import React, { useMemo, useState } from "react";
import { ArrowRight, MapPin, ScanLine, Search } from "lucide-react";
import { collection, doc, runTransaction, serverTimestamp } from "firebase/firestore";
import toast from "react-hot-toast";
import { db } from "../../firebase";
import { useAuth } from "../../contexts/AuthContext";
import {
  ADMIN_ONLY_MOVEMENTS,
  COLLECTIONS,
  MOVEMENT_HELP,
  MOVEMENT_LABELS,
  MOVEMENT_TYPES,
} from "../../constants";
import { computeMovement, getStock, normalize } from "../../utils/stock";
import Modal from "../../components/Modal/Modal";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import BarcodeScanner from "../../components/BarcodeScanner/BarcodeScanner";
import { OFFLINE_MESSAGE } from "../../hooks/useOnlineStatus";
import { notifyLowStock } from "../../utils/alerts";

const SUGGESTED_REASONS = {
  [MOVEMENT_TYPES.ENTRADA]: "Compra / alta de equipo",
  [MOVEMENT_TYPES.SALIDA]: "Salida a evento",
  [MOVEMENT_TYPES.DEVOLUCION]: "Regreso de evento",
  [MOVEMENT_TYPES.REPARACION]: "Envío a servicio técnico",
  [MOVEMENT_TYPES.REPARADO]: "Reparación finalizada",
  [MOVEMENT_TYPES.TRANSFERENCIA]: "Cambio de depósito",
  [MOVEMENT_TYPES.BAJA]: "Equipo dañado sin reparación",
  [MOVEMENT_TYPES.AJUSTE]: "Recuento de inventario",
};

/**
 * Modal para registrar un movimiento. El stock se recalcula dentro de una
 * transacción para que dos usuarios simultáneos no se pisen.
 */
const MovementForm = ({ materials, initialMaterialId, initialType, onClose }) => {
  const { currentUser, userData, isAdmin } = useAuth();

  const allowedTypes = Object.keys(MOVEMENT_LABELS).filter(
    (t) => isAdmin || !ADMIN_ONLY_MOVEMENTS.includes(t)
  );

  const [materialId, setMaterialId] = useState(
    materials.some((m) => m.id === initialMaterialId) ? initialMaterialId : ""
  );
  const [type, setType] = useState(
    allowedTypes.includes(initialType) ? initialType : MOVEMENT_TYPES.SALIDA
  );
  const [quantity, setQuantity] = useState("1");
  const [toLocation, setToLocation] = useState("");
  const [reason, setReason] = useState("");
  const [project, setProject] = useState("");
  const [notes, setNotes] = useState("");
  const [materialSearch, setMaterialSearch] = useState("");
  const [showScanner, setShowScanner] = useState(false);
  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const material = materials.find((m) => m.id === materialId);
  const isTransfer = type === MOVEMENT_TYPES.TRANSFERENCIA;
  const isAdjust = type === MOVEMENT_TYPES.AJUSTE;

  const locations = useMemo(
    () => [...new Set(materials.map((m) => m.location).filter(Boolean))].sort(),
    [materials]
  );

  const materialOptions = useMemo(() => {
    const term = normalize(materialSearch.trim());
    if (!term) return materials;
    return materials.filter(
      (m) => normalize(`${m.name} ${m.code}`).includes(term) || m.id === materialId
    );
  }, [materials, materialSearch, materialId]);

  // Para traslados se mueve el material completo
  const effectiveQuantity = isTransfer
    ? Math.max(1, material ? getStock(material).total : 1)
    : quantity;

  // Vista previa del resultado (y validación en vivo)
  let preview = null;
  let movementError = null;
  if (material) {
    try {
      preview = computeMovement(material, type, effectiveQuantity, { toLocation });
    } catch (error) {
      movementError = error.message;
    }
  }

  const handleScanned = (code) => {
    setShowScanner(false);
    const match = materials.find((m) => normalize(m.code) === normalize(code));
    if (match) {
      setMaterialId(match.id);
      setMaterialSearch("");
      toast.success(`Seleccionado: ${match.name}`);
    } else {
      toast.error(`No hay ningún material con el código ${code}`);
    }
  };

  const handleTypeChange = (e) => {
    setType(e.target.value);
    if (e.target.value === MOVEMENT_TYPES.AJUSTE && material) {
      setQuantity(String(getStock(material).available));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    if (!material) return toast.error("Selecciona un material");
    if (movementError) return toast.error(movementError);
    if (!reason.trim()) return toast.error("Indica el motivo del movimiento");
    if (!navigator.onLine) return toast.error(OFFLINE_MESSAGE);

    setSaving(true);
    try {
      let stockChange = null;
      await runTransaction(db, async (tx) => {
        const ref = doc(db, COLLECTIONS.MATERIALS, material.id);
        const snap = await tx.get(ref);
        if (!snap.exists()) throw new Error("El material ya no existe");

        const fresh = snap.data();
        const result = computeMovement(fresh, type, effectiveQuantity, { toLocation });
        stockChange = { before: fresh, after: { ...fresh, ...result.updates } };

        tx.update(ref, { ...result.updates, updatedAt: serverTimestamp() });
        tx.set(doc(collection(db, COLLECTIONS.MOVEMENTS)), {
          materialId: material.id,
          materialName: fresh.name || "",
          materialCode: fresh.code || "",
          type,
          quantity: Number(effectiveQuantity),
          previousQuantity: result.previousQuantity,
          newQuantity: result.newQuantity,
          reason: reason.trim(),
          project: project.trim(),
          notes: notes.trim(),
          fromLocation: fresh.location || "",
          toLocation: result.updates.location || fresh.location || "",
          createdAt: serverTimestamp(),
          createdBy: currentUser?.uid || "",
          createdByName: userData?.name || "Usuario",
        });
      });

      toast.success(`${MOVEMENT_LABELS[type]} registrada: ${material.name}`);
      if (stockChange) notifyLowStock([stockChange]);
      onClose();
    } catch (error) {
      console.error("Error creating movement:", error);
      toast.error(
        error.code === "permission-denied"
          ? "No tienes permisos para registrar movimientos"
          : error.message || "No se pudo registrar el movimiento"
      );
    } finally {
      setSaving(false);
    }
  };

  const stock = material ? getStock(material) : null;

  return (
    <>
      <Modal
        isOpen
        onClose={saving ? () => {} : onClose}
        title="Registrar movimiento"
        subtitle="El stock se actualiza automáticamente"
        size="md"
        closeOnBackdrop={false}
      >
        <form onSubmit={handleSubmit} className="form-stack" noValidate>
          <div className="input-group">
            <label className="input-label" htmlFor="movement-material">
              Material <span className="input-required">*</span>
            </label>
            <Input
              name="materialSearch"
              value={materialSearch}
              onChange={(e) => setMaterialSearch(e.target.value)}
              placeholder="Filtrar por nombre o código..."
              icon={Search}
              aria-label="Filtrar materiales"
              autoComplete="off"
              suffix={
                <Button
                  variant="ghost"
                  size="sm"
                  icon={ScanLine}
                  onClick={() => setShowScanner(true)}
                  aria-label="Escanear código"
                  title="Escanear código"
                />
              }
            />
            <select
              id="movement-material"
              className={`input ${submitted && !material ? "input-error" : ""}`}
              value={materialId}
              onChange={(e) => setMaterialId(e.target.value)}
              required
            >
              <option value="">
                {materialOptions.length
                  ? `Seleccionar material (${materialOptions.length})...`
                  : "Sin coincidencias"}
              </option>
              {materialOptions.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} · {m.code} — disp. {getStock(m).available}
                </option>
              ))}
            </select>
          </div>

          {material && (
            <div className="movement-material-summary">
              <div>
                <span className="summary-value">{stock.available}</span>
                <span className="summary-label">Disponible</span>
              </div>
              <div>
                <span className="summary-value">{stock.committed}</span>
                <span className="summary-label">En uso</span>
              </div>
              <div>
                <span className="summary-value">{stock.maintenance}</span>
                <span className="summary-label">Mantenim.</span>
              </div>
              <div className="summary-location">
                <MapPin size={13} /> {material.location || "Sin ubicación"}
              </div>
            </div>
          )}

          <Input
            type="select"
            label="Tipo de movimiento"
            name="type"
            value={type}
            onChange={handleTypeChange}
            helper={MOVEMENT_HELP[type]}
            required
          >
            {allowedTypes.map((key) => (
              <option key={key} value={key}>
                {MOVEMENT_LABELS[key]}
              </option>
            ))}
          </Input>

          {isTransfer ? (
            <>
              <Input
                label="Ubicación de destino"
                name="toLocation"
                value={toLocation}
                onChange={(e) => setToLocation(e.target.value)}
                list="movement-locations"
                placeholder="Ej: Depósito Norte"
                required
              />
              <datalist id="movement-locations">
                {locations.map((loc) => (
                  <option key={loc} value={loc} />
                ))}
              </datalist>
            </>
          ) : (
            <Input
              label={isAdjust ? "Nuevo stock disponible" : "Cantidad"}
              type="number"
              inputMode="numeric"
              name="quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min={isAdjust ? "0" : "1"}
              step="1"
              required
            />
          )}

          {material && (movementError || preview) && (
            <div className={`movement-preview ${movementError ? "is-error" : ""}`} role="status">
              {movementError ? (
                movementError
              ) : isTransfer ? (
                <>
                  {material.location || "Sin ubicación"} <ArrowRight size={14} />{" "}
                  <strong>{preview.updates.location}</strong>
                </>
              ) : (
                <>
                  Stock disponible: {preview.previousQuantity} <ArrowRight size={14} />{" "}
                  <strong>{preview.newQuantity}</strong>
                </>
              )}
            </div>
          )}

          <Input
            label="Motivo"
            name="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={SUGGESTED_REASONS[type]}
            error={submitted && !reason.trim() ? "El motivo es obligatorio" : undefined}
            required
            suffix={
              !reason && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setReason(SUGGESTED_REASONS[type])}
                  title="Usar motivo sugerido"
                >
                  Usar
                </Button>
              )
            }
            style={!reason ? { paddingRight: "4rem" } : undefined}
          />

          <Input
            label="Proyecto / evento"
            name="project"
            value={project}
            onChange={(e) => setProject(e.target.value)}
            placeholder="Opcional"
          />

          <Input
            label="Notas"
            type="textarea"
            name="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            placeholder="Opcional"
          />

          <div className="form-actions">
            <Button variant="secondary" onClick={onClose} disabled={saving}>
              Cancelar
            </Button>
            <Button type="submit" loading={saving} disabled={Boolean(material && movementError)}>
              Registrar
            </Button>
          </div>
        </form>
      </Modal>

      {showScanner && (
        <BarcodeScanner
          title="Seleccionar material por código"
          onScan={handleScanned}
          onClose={() => setShowScanner(false)}
        />
      )}
    </>
  );
};

export default MovementForm;
