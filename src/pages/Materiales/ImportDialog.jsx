import React, { useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Download, FileSpreadsheet, Upload } from "lucide-react";
import {
  collection,
  doc,
  increment,
  serverTimestamp,
  setDoc,
  writeBatch,
} from "firebase/firestore";
import toast from "react-hot-toast";
import { db } from "../../firebase";
import { useAuth } from "../../contexts/AuthContext";
import { COLLECTIONS, MOVEMENT_TYPES } from "../../constants";
import { OFFLINE_MESSAGE } from "../../hooks/useOnlineStatus";
import {
  IMPORT_FIELDS,
  downloadImportTemplate,
  guessMapping,
  readSpreadsheet,
  recallMapping,
  rememberMapping,
  validateImport,
} from "../../utils/importMaterials";
import { getStock } from "../../utils/stock";
import Modal from "../../components/Modal/Modal";
import Button from "../../components/Button/Button";
import Badge from "../../components/Badge/Badge";
import Input from "../../components/Input/Input";

// Firestore admite 500 escrituras por lote; se deja margen
const BATCH_LIMIT = 400;
const PREVIEW_ROWS = 100;

const STOCK_MODES = {
  add: {
    label: "Sumar al stock (llegó material)",
    help: "Las cantidades del archivo se suman a las actuales y se registran como Entrada.",
  },
  set: {
    label: "Reemplazar el stock (recuento físico)",
    help: "El stock disponible pasa a ser el del archivo y se registra como Ajuste.",
    adminOnly: true,
  },
  none: {
    label: "No modificar el stock",
    help: "Las cantidades del archivo se ignoran para los materiales que ya existen.",
  },
};

/**
 * Importación de materiales desde Excel/CSV con cualquier formato.
 * Pasos: 1) archivo · 2) qué columna es cada dato · 3) revisión e importación.
 */
const ImportDialog = ({ materials, categories, onClose }) => {
  const { currentUser, userData, isAdmin } = useAuth();
  const fileRef = useRef(null);

  const [step, setStep] = useState("file"); // "file" | "map" | "preview"
  const [file, setFile] = useState(null);
  const [sheetData, setSheetData] = useState(null);
  const [mapping, setMapping] = useState({});
  const [mappingRecalled, setMappingRecalled] = useState(false);
  const [stockMode, setStockMode] = useState("");
  const [updateData, setUpdateData] = useState(false);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);

  // ---------- Paso 1: archivo ----------
  const loadSheet = async (f, sheetName) => {
    setBusy(true);
    try {
      const data = await readSpreadsheet(f, sheetName);
      if (!data.rows.length || !data.headers.length) {
        toast.error("La hoja no tiene datos");
        return;
      }
      setSheetData(data);
      const recalled = recallMapping(data.headers);
      setMapping(recalled || guessMapping(data.headers));
      setMappingRecalled(Boolean(recalled));
      setStep("map");
    } catch (error) {
      console.error(error);
      toast.error("No se pudo leer el archivo. Usa .xlsx, .xls o .csv");
    } finally {
      setBusy(false);
    }
  };

  const handleFile = async (e) => {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    setFile(f);
    await loadSheet(f);
  };

  // ---------- Paso 3: validación ----------
  const result = useMemo(
    () =>
      step === "preview" && sheetData
        ? validateImport(sheetData.rows, { materials, categories, mapping })
        : null,
    [step, sheetData, materials, categories, mapping]
  );

  const rows = result?.rows || [];
  const toCreate = rows.filter((r) => r.action === "create");
  const existingRows = rows.filter((r) => r.action === "update");
  const withErrors = rows.filter((r) => r.action === "error");
  const existingWithQty = existingRows.filter((r) => r.hasQuantity);
  const newCategories = result?.newCategories || [];
  const blockedByCategories = newCategories.length > 0 && !isAdmin;
  const needsStockChoice = existingWithQty.length > 0 && Boolean(mapping.quantity);

  // Qué le pasa a cada material existente
  const plan = existingRows.map((r) => {
    const current = getStock(r.existing).available;
    let stockChange = null;
    if (r.hasQuantity && stockMode === "add" && r.data.quantity > 0) {
      stockChange = { type: MOVEMENT_TYPES.ENTRADA, quantity: r.data.quantity, from: current, to: current + r.data.quantity };
    }
    if (r.hasQuantity && stockMode === "set" && r.data.quantity !== current) {
      stockChange = { type: MOVEMENT_TYPES.AJUSTE, quantity: r.data.quantity, from: current, to: r.data.quantity };
    }
    return { row: r, stockChange, dataChange: isAdmin && updateData };
  });
  const stockChanges = plan.filter((p) => p.stockChange).length;
  const dataChanges = plan.filter((p) => p.dataChange).length;
  const total = toCreate.length + plan.filter((p) => p.stockChange || p.dataChange).length;

  const goToPreview = () => {
    if (!mapping.name) return toast.error("Indica qué columna tiene el nombre del material");
    rememberMapping(sheetData.headers, mapping);
    setStockMode("");
    setStep("preview");
  };

  const handleImport = async () => {
    if (!navigator.onLine) return toast.error(OFFLINE_MESSAGE);
    if (needsStockChoice && !stockMode) return toast.error("Elige qué hacer con las cantidades");
    setBusy(true);
    setProgress(0);
    const author = { createdBy: currentUser?.uid || "", createdByName: userData?.name || "Usuario" };
    const reason = `Importación desde Excel (${file?.name || "archivo"})`;

    const movement = (materialId, data, type, quantity, from, to) => ({
      materialId,
      materialName: data.name,
      materialCode: data.code,
      type,
      quantity,
      previousQuantity: from,
      newQuantity: to,
      reason,
      project: "",
      notes: "",
      fromLocation: data.location,
      toLocation: data.location,
      createdAt: serverTimestamp(),
      ...author,
    });

    try {
      // 1. Categorías nuevas (sólo admin)
      if (newCategories.length && isAdmin) {
        await setDoc(
          doc(db, "system", "categories"),
          {
            categories: [...categories, ...newCategories.map((label) => ({ key: label, label }))],
            updatedAt: serverTimestamp(),
            updatedBy: author.createdBy,
          },
          { merge: true }
        );
      }

      // 2. Escrituras en lotes
      const ops = [];
      toCreate.forEach(({ data }) => {
        const ref = doc(collection(db, COLLECTIONS.MATERIALS));
        ops.push((b) =>
          b.set(ref, {
            ...data,
            quantityCommitted: 0,
            quantityMaintenance: 0,
            imageUrl: "",
            imagePath: "",
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            ...author,
          })
        );
        if (data.quantity > 0) {
          ops.push((b) =>
            b.set(
              doc(collection(db, COLLECTIONS.MOVEMENTS)),
              movement(ref.id, data, MOVEMENT_TYPES.ENTRADA, data.quantity, 0, data.quantity)
            )
          );
        }
      });

      plan.forEach(({ row, stockChange, dataChange }) => {
        if (!stockChange && !dataChange) return;
        const ref = doc(db, COLLECTIONS.MATERIALS, row.existing.id);
        const update = { updatedAt: serverTimestamp() };
        if (dataChange) {
          // El stock nunca se pisa con los datos descriptivos
          Object.assign(update, row.data);
          delete update.quantity;
        }
        if (stockChange) {
          // Al sumar se usa increment() para no pisar movimientos simultáneos
          update.quantity =
            stockChange.type === MOVEMENT_TYPES.ENTRADA ? increment(stockChange.quantity) : stockChange.quantity;
        }
        ops.push((b) => b.update(ref, update));
        if (stockChange) {
          ops.push((b) =>
            b.set(
              doc(collection(db, COLLECTIONS.MOVEMENTS)),
              movement(row.existing.id, { ...row.existing, ...row.data }, stockChange.type, stockChange.quantity, stockChange.from, stockChange.to)
            )
          );
        }
      });

      for (let i = 0; i < ops.length; i += BATCH_LIMIT) {
        const batch = writeBatch(db);
        ops.slice(i, i + BATCH_LIMIT).forEach((op) => op(batch));
        await batch.commit();
        setProgress(Math.min(100, Math.round(((i + BATCH_LIMIT) / ops.length) * 100)));
      }

      const parts = [
        toCreate.length && `${toCreate.length} nuevos`,
        stockChanges && `${stockChanges} con stock actualizado`,
        dataChanges && `${dataChanges} con datos actualizados`,
      ].filter(Boolean);
      toast.success(`Importación completa: ${parts.join(", ")}`);
      onClose();
    } catch (error) {
      console.error(error);
      toast.error(
        error.code === "permission-denied"
          ? "No tienes permisos para esta importación"
          : "La importación se interrumpió. Revisa el inventario antes de reintentar."
      );
      setBusy(false);
    }
  };

  // ---------- Render ----------
  const sample = (header) =>
    sheetData.rows
      .map((r) => String(r[header] ?? "").trim())
      .filter(Boolean)
      .slice(0, 3)
      .join(" · ");

  const footer =
    step === "map" ? (
      <>
        <Button variant="secondary" icon={ArrowLeft} onClick={() => setStep("file")}>
          Otro archivo
        </Button>
        <Button icon={ArrowRight} onClick={goToPreview}>
          Revisar datos
        </Button>
      </>
    ) : step === "preview" ? (
      <>
        <Button variant="secondary" icon={ArrowLeft} onClick={() => setStep("map")} disabled={busy}>
          Columnas
        </Button>
        <Button
          icon={Upload}
          onClick={handleImport}
          loading={busy}
          disabled={total === 0 || blockedByCategories || (needsStockChoice && !stockMode)}
        >
          {busy && progress ? `Importando… ${progress}%` : `Importar (${total})`}
        </Button>
      </>
    ) : null;

  return (
    <Modal
      isOpen
      onClose={busy ? () => {} : onClose}
      title="Importar materiales desde Excel"
      subtitle={
        step === "file"
          ? "Sirve nuestra plantilla o cualquier Excel con un listado de materiales"
          : `${file?.name} · hoja «${sheetData?.sheet}» · ${sheetData?.rows.length} filas`
      }
      size="lg"
      closeOnBackdrop={false}
      footer={footer}
    >
      {step === "file" && (
        <div className="import-start">
          <ol className="import-steps">
            <li>
              Sube el Excel tal como lo recibiste (.xlsx, .xls o .csv). No hace falta adaptarlo: en el
              siguiente paso indicas qué columna es cada dato.
            </li>
            <li>Sólo es obligatorio el <strong>nombre</strong> del material. Si no hay código, se busca por nombre o se genera.</li>
            <li>Revisas la vista previa: nada se guarda hasta que pulses «Importar».</li>
          </ol>
          <div className="import-actions">
            <Button icon={FileSpreadsheet} onClick={() => fileRef.current?.click()} loading={busy}>
              Elegir archivo
            </Button>
            <Button variant="secondary" icon={Download} onClick={() => downloadImportTemplate(categories)}>
              Descargar plantilla
            </Button>
            <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv" onChange={handleFile} hidden />
          </div>
        </div>
      )}

      {step === "map" && sheetData && (
        <div className="form-stack">
          {sheetData.sheets.length > 1 && (
            <Input
              type="select"
              label="Hoja del archivo"
              name="sheet"
              value={sheetData.sheet}
              onChange={(e) => loadSheet(file, e.target.value)}
            >
              {sheetData.sheets.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Input>
          )}
          <p className="input-helper">
            {mappingRecalled
              ? "Usamos las columnas que elegiste la última vez para este formato. Revísalas."
              : `Encabezados detectados en la fila ${sheetData.headerLine}. Revisa que cada dato apunte a la columna correcta.`}
          </p>
          <div className="table-wrap">
            <table className="table import-map">
              <thead>
                <tr>
                  <th>Dato</th>
                  <th>Columna del archivo</th>
                  <th>Ejemplo</th>
                </tr>
              </thead>
              <tbody>
                {IMPORT_FIELDS.map((field) => (
                  <tr key={field.key}>
                    <td>
                      <span className="cell-title">
                        {field.label}
                        {field.required && <span className="input-required">*</span>}
                      </span>
                      {field.hint && <span className="cell-sub">{field.hint}</span>}
                    </td>
                    <td>
                      <select
                        className="input"
                        value={mapping[field.key] || ""}
                        onChange={(e) =>
                          setMapping((prev) => {
                            const next = { ...prev };
                            if (e.target.value) next[field.key] = e.target.value;
                            else delete next[field.key];
                            return next;
                          })
                        }
                        aria-label={`Columna para ${field.label}`}
                      >
                        <option value="">— No importar —</option>
                        {sheetData.headers.map((h) => (
                          <option key={h} value={h}>
                            {h}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="text-muted import-sample">
                      {mapping[field.key] ? sample(mapping[field.key]) || "(vacía)" : ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {step === "preview" && result && (
        <div className="form-stack">
          <div className="import-summary">
            <Badge variant="success">{toCreate.length} nuevos</Badge>
            <Badge variant="info">{existingRows.length} ya existen</Badge>
            <Badge variant="error">{withErrors.length} con errores</Badge>
          </div>

          {needsStockChoice && (
            <fieldset className="role-picker labels-picker">
              <legend className="input-label">
                ¿Qué hacemos con las cantidades de los {existingWithQty.length} materiales que ya existen?
                <span className="input-required">*</span>
              </legend>
              {Object.entries(STOCK_MODES)
                .filter(([, m]) => isAdmin || !m.adminOnly)
                .map(([key, m]) => (
                  <label key={key} className={`role-option ${stockMode === key ? "is-selected" : ""}`}>
                    <input
                      type="radio"
                      name="stockMode"
                      value={key}
                      checked={stockMode === key}
                      onChange={() => setStockMode(key)}
                    />
                    <span>
                      <strong>{m.label}</strong>
                      <small>{m.help}</small>
                    </span>
                  </label>
                ))}
            </fieldset>
          )}

          {existingRows.length > 0 && isAdmin && (
            <label className="checkbox-label">
              <input type="checkbox" checked={updateData} onChange={(e) => setUpdateData(e.target.checked)} />
              Actualizar también los datos (nombre, categoría, ubicación…) de los que ya existen
            </label>
          )}

          {newCategories.length > 0 && (
            <p className={blockedByCategories ? "mv-detail-alert" : "input-helper"}>
              {blockedByCategories
                ? `Hay categorías que no existen (${newCategories.join(", ")}). Pide a un administrador que las cree o corrige el archivo.`
                : `Se crearán ${newCategories.length} categorías nuevas: ${newCategories.join(", ")}.`}
            </p>
          )}

          {withErrors.length > 0 && (
            <p className="input-helper">
              Las filas con errores no se importan; corrígelas en el archivo y vuelve a subirlo.
            </p>
          )}

          <div className="table-wrap import-preview">
            <table className="table">
              <thead>
                <tr>
                  <th>Fila</th>
                  <th>Estado</th>
                  <th>Código</th>
                  <th>Nombre</th>
                  <th className="num">Cant.</th>
                  <th>Qué pasará</th>
                </tr>
              </thead>
              <tbody>
                {rows.slice(0, PREVIEW_ROWS).map((r) => {
                  const p = plan.find((x) => x.row === r);
                  let detail = "";
                  if (r.action === "error") detail = r.errors.join(" · ");
                  else if (r.action === "create")
                    detail = `Se crea${r.data.quantity ? ` con ${r.data.quantity} unid.` : ""}${r.generatedCode ? " · código generado" : ""}`;
                  else if (p?.stockChange) detail = `Stock ${p.stockChange.from} → ${p.stockChange.to}`;
                  else if (p?.dataChange) detail = "Se actualizan sus datos";
                  else detail = "Sin cambios";
                  return (
                    <tr key={r.line}>
                      <td className="text-muted">{r.line}</td>
                      <td>
                        <Badge
                          size="sm"
                          variant={r.action === "create" ? "success" : r.action === "update" ? "info" : "error"}
                        >
                          {r.action === "create" ? "Nuevo" : r.action === "update" ? "Existe" : "Error"}
                        </Badge>
                      </td>
                      <td className="mono">{r.data.code}</td>
                      <td>{r.data.name}</td>
                      <td className="num">{r.hasQuantity ? r.data.quantity : "—"}</td>
                      <td className={r.action === "error" ? "text-error" : "text-muted"}>{detail}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {rows.length > PREVIEW_ROWS && (
            <p className="input-helper">
              Mostrando {PREVIEW_ROWS} de {rows.length} filas.
            </p>
          )}
        </div>
      )}
    </Modal>
  );
};

export default ImportDialog;
