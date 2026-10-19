import React, { useMemo, useState } from "react";
import { ScanLine, Wand2 } from "lucide-react";
import {
  collection,
  doc,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import toast from "react-hot-toast";
import { db } from "../../firebase";
import { useAuth } from "../../contexts/AuthContext";
import {
  COLLECTIONS,
  DEFAULTS,
  MATERIAL_STATUS,
  MOVEMENT_TYPES,
  STATUS_LABELS,
  STOCK_THRESHOLDS,
  VALIDATION,
} from "../../constants";
import { generateMaterialCode } from "../../utils";
import { getStock, normalize } from "../../utils/stock";
import Modal from "../../components/Modal/Modal";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import BarcodeScanner from "../../components/BarcodeScanner/BarcodeScanner";
import ImageUploadWidget from "../../components/ImageUploadWidget/ImageUploadWidget";

const toFormState = (material, defaultCategory) => ({
  name: material?.name || "",
  code: material?.code || "",
  category: material?.category || defaultCategory || "",
  subcategory: material?.subcategory || "",
  quantity: String(material?.quantity ?? 0),
  quantityCommitted: String(material?.quantityCommitted ?? 0),
  quantityMaintenance: String(material?.quantityMaintenance ?? 0),
  minStock: material?.minStock != null ? String(material.minStock) : "",
  location: material?.location || DEFAULTS.LOCATION,
  status: material?.status || MATERIAL_STATUS.OPERATIVO,
  notes: material?.notes || "",
  imageUrl: material?.imageUrl || "",
  imagePath: material?.imagePath || "",
});

const parseCount = (value) => {
  if (value === "" || value == null) return 0;
  const n = Number(value);
  return Number.isInteger(n) && n >= 0 ? n : NaN;
};

/**
 * Modal de alta/edición de material.
 * - Valida campos y unicidad del código.
 * - Al crear con stock inicial registra una "Entrada".
 * - Al editar y cambiar el stock disponible registra un "Ajuste".
 */
const MaterialForm = ({ material, materials, categories, onClose }) => {
  const { currentUser, userData, isAdmin } = useAuth();
  const isEdit = Boolean(material);
  const [form, setForm] = useState(() => toFormState(material, categories[0]?.key));
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

  const locations = useMemo(
    () => [...new Set(materials.map((m) => m.location).filter(Boolean))].sort(),
    [materials]
  );

  const set = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const next = {};
    const name = form.name.trim();
    const code = form.code.trim();

    if (!name) next.name = "El nombre es obligatorio";
    else if (name.length > VALIDATION.NAME_MAX_LENGTH)
      next.name = `Máximo ${VALIDATION.NAME_MAX_LENGTH} caracteres`;

    if (!code) next.code = "El código es obligatorio";
    else if (code.length > VALIDATION.CODE_MAX_LENGTH)
      next.code = `Máximo ${VALIDATION.CODE_MAX_LENGTH} caracteres`;
    else if (
      materials.some((m) => m.id !== material?.id && normalize(m.code) === normalize(code))
    )
      next.code = "Ya existe un material con este código";

    if (!form.category) next.category = "Selecciona una categoría";

    ["quantity", "quantityCommitted", "quantityMaintenance"].forEach((f) => {
      if (Number.isNaN(parseCount(form[f]))) next[f] = "Debe ser un entero ≥ 0";
    });
    if (form.minStock !== "" && Number.isNaN(parseCount(form.minStock)))
      next.minStock = "Debe ser un entero ≥ 0";

    if (form.notes.length > VALIDATION.DESCRIPTION_MAX_LENGTH)
      next.notes = `Máximo ${VALIDATION.DESCRIPTION_MAX_LENGTH} caracteres`;

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Revisa los campos marcados");
      return;
    }

    const data = {
      name: form.name.trim(),
      code: form.code.trim(),
      category: form.category,
      subcategory: form.subcategory.trim(),
      quantity: parseCount(form.quantity),
      quantityCommitted: parseCount(form.quantityCommitted),
      quantityMaintenance: parseCount(form.quantityMaintenance),
      minStock: form.minStock === "" ? null : parseCount(form.minStock),
      location: form.location.trim() || DEFAULTS.LOCATION,
      status: form.status,
      notes: form.notes.trim(),
      imageUrl: form.imageUrl || "",
      imagePath: form.imagePath || "",
      updatedAt: serverTimestamp(),
    };

    const author = {
      createdBy: currentUser?.uid || "",
      createdByName: userData?.name || "Usuario",
    };

    setSaving(true);
    try {
      const batch = writeBatch(db);

      if (isEdit) {
        batch.update(doc(db, COLLECTIONS.MATERIALS, material.id), data);

        const previous = getStock(material).available;
        if (previous !== data.quantity) {
          batch.set(doc(collection(db, COLLECTIONS.MOVEMENTS)), {
            materialId: material.id,
            materialName: data.name,
            materialCode: data.code,
            type: MOVEMENT_TYPES.AJUSTE,
            quantity: data.quantity,
            previousQuantity: previous,
            newQuantity: data.quantity,
            reason: "Edición manual del material",
            project: "",
            notes: "",
            fromLocation: data.location,
            toLocation: data.location,
            createdAt: serverTimestamp(),
            ...author,
          });
        }
      } else {
        const ref = doc(collection(db, COLLECTIONS.MATERIALS));
        batch.set(ref, { ...data, createdAt: serverTimestamp(), ...author });

        if (data.quantity > 0) {
          batch.set(doc(collection(db, COLLECTIONS.MOVEMENTS)), {
            materialId: ref.id,
            materialName: data.name,
            materialCode: data.code,
            type: MOVEMENT_TYPES.ENTRADA,
            quantity: data.quantity,
            previousQuantity: 0,
            newQuantity: data.quantity,
            reason: "Alta de material",
            project: "",
            notes: "",
            fromLocation: data.location,
            toLocation: data.location,
            createdAt: serverTimestamp(),
            ...author,
          });
        }
      }

      await batch.commit();
      toast.success(isEdit ? "Material actualizado" : "Material creado");
      onClose();
    } catch (error) {
      console.error("Error saving material:", error);
      toast.error(
        error.code === "permission-denied"
          ? "No tienes permisos para realizar esta acción"
          : "No se pudo guardar el material"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleScanned = (code) => {
    setForm((prev) => ({ ...prev, code }));
    setErrors((prev) => ({ ...prev, code: undefined }));
    setShowScanner(false);
    toast.success(`Código leído: ${code}`);
  };

  const generateCode = () => {
    const prefix = form.category || "MAT";
    setForm((prev) => ({ ...prev, code: generateMaterialCode(prefix) }));
    setErrors((prev) => ({ ...prev, code: undefined }));
  };

  return (
    <>
      <Modal
        isOpen
        onClose={saving ? () => {} : onClose}
        title={isEdit ? "Editar material" : "Nuevo material"}
        subtitle={isEdit ? `${material.name} · ${material.code}` : "Completa los datos del equipo"}
        size="lg"
        closeOnBackdrop={false}
      >
        <form onSubmit={handleSubmit} className="form-stack" noValidate>
          <p className="form-section-title">Identificación</p>
          <div className="form-grid">
            <Input
              className="span-2"
              label="Nombre"
              name="name"
              value={form.name}
              onChange={set("name")}
              error={errors.name}
              placeholder="Ej: Consola Yamaha QL5"
              required
            />
            <Input
              label="Código"
              name="code"
              value={form.code}
              onChange={set("code")}
              error={errors.code}
              placeholder="Escanea o genera un código"
              autoComplete="off"
              required
              suffix={
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Wand2}
                    onClick={generateCode}
                    title="Generar código"
                    aria-label="Generar código"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={ScanLine}
                    onClick={() => setShowScanner(true)}
                    title="Escanear código"
                    aria-label="Escanear código"
                  />
                </>
              }
              style={{ paddingRight: "4.75rem" }}
            />
            <Input
              type="select"
              label="Estado"
              name="status"
              value={form.status}
              onChange={set("status")}
            >
              {Object.entries(STATUS_LABELS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </Input>
          </div>

          <p className="form-section-title">Clasificación y ubicación</p>
          <div className="form-grid">
            <Input
              type="select"
              label="Categoría"
              name="category"
              value={form.category}
              onChange={set("category")}
              error={errors.category}
              required
            >
              <option value="" disabled>
                Seleccionar...
              </option>
              {categories.map((cat) => (
                <option key={cat.key} value={cat.key}>
                  {cat.label}
                </option>
              ))}
              {form.category && !categories.some((c) => c.key === form.category) && (
                <option value={form.category}>{form.category} (eliminada)</option>
              )}
            </Input>
            <Input
              label="Subcategoría"
              name="subcategory"
              value={form.subcategory}
              onChange={set("subcategory")}
              placeholder="Ej: Consolas digitales"
            />
            <Input
              className="span-2"
              label="Ubicación"
              name="location"
              value={form.location}
              onChange={set("location")}
              list="material-locations"
              placeholder={DEFAULTS.LOCATION}
            />
            <datalist id="material-locations">
              {locations.map((loc) => (
                <option key={loc} value={loc} />
              ))}
            </datalist>
          </div>

          <p className="form-section-title">Stock</p>
          <div className="form-grid">
            <Input
              label="Disponible"
              type="number"
              inputMode="numeric"
              name="quantity"
              value={form.quantity}
              onChange={set("quantity")}
              error={errors.quantity}
              min="0"
              step="1"
              disabled={isEdit && !isAdmin}
              helper={isEdit ? "Si lo cambias se registrará un ajuste" : "Se registra como entrada inicial"}
            />
            <Input
              label="Stock mínimo (alerta)"
              type="number"
              inputMode="numeric"
              name="minStock"
              value={form.minStock}
              onChange={set("minStock")}
              error={errors.minStock}
              min="0"
              step="1"
              placeholder={String(STOCK_THRESHOLDS.LOW)}
              helper={`Vacío = ${STOCK_THRESHOLDS.LOW} unidades`}
            />
            <Input
              label="En uso / comprometido"
              type="number"
              inputMode="numeric"
              name="quantityCommitted"
              value={form.quantityCommitted}
              onChange={set("quantityCommitted")}
              error={errors.quantityCommitted}
              min="0"
              step="1"
            />
            <Input
              label="En mantenimiento"
              type="number"
              inputMode="numeric"
              name="quantityMaintenance"
              value={form.quantityMaintenance}
              onChange={set("quantityMaintenance")}
              error={errors.quantityMaintenance}
              min="0"
              step="1"
            />
          </div>

          <p className="form-section-title">Imagen</p>
          <ImageUploadWidget
            materialId={material?.id || "new"}
            currentImageUrl={form.imageUrl}
            onImageUpload={(url, path) =>
              setForm((prev) => ({ ...prev, imageUrl: url, imagePath: path }))
            }
            onImageRemove={() => setForm((prev) => ({ ...prev, imageUrl: "", imagePath: "" }))}
          />

          <p className="form-section-title">Observaciones</p>
          <Input
            type="textarea"
            name="notes"
            value={form.notes}
            onChange={set("notes")}
            error={errors.notes}
            rows={3}
            placeholder="Accesorios incluidos, número de serie, estado físico..."
            helper={`${form.notes.length}/${VALIDATION.DESCRIPTION_MAX_LENGTH}`}
          />

          <div className="form-actions">
            <Button variant="secondary" onClick={onClose} disabled={saving}>
              Cancelar
            </Button>
            <Button type="submit" loading={saving}>
              {isEdit ? "Guardar cambios" : "Crear material"}
            </Button>
          </div>
        </form>
      </Modal>

      {showScanner && (
        <BarcodeScanner onScan={handleScanned} onClose={() => setShowScanner(false)} />
      )}
    </>
  );
};

export default MaterialForm;
