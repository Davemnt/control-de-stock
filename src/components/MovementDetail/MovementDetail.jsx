import React, { useState } from "react";
import { Ban, Edit, Save } from "lucide-react";
import { doc, runTransaction, serverTimestamp, updateDoc } from "firebase/firestore";
import toast from "react-hot-toast";
import { db } from "../../firebase";
import { useAuth } from "../../contexts/AuthContext";
import { COLLECTIONS, MOVEMENT_LABELS, MOVEMENT_TYPES } from "../../constants";
import { formatDateTime } from "../../utils/formatters";
import { computeReversal, getMovementUser, getMovementVariant, toDate } from "../../utils/stock";
import Modal from "../Modal/Modal";
import Button from "../Button/Button";
import Badge from "../Badge/Badge";
import Input from "../Input/Input";
import { OFFLINE_MESSAGE } from "../../hooks/useOnlineStatus";
import "./MovementDetail.css";

/**
 * Detalle de un movimiento. El administrador puede:
 * - Corregir los datos descriptivos (motivo, proyecto, notas).
 * - Anular el movimiento: se revierte su efecto en el stock y queda marcado
 *   como anulado en el historial (nunca se borra, para conservar la auditoría).
 */
const MovementDetail = ({ movement, onClose }) => {
  const { isAdmin, currentUser, userData } = useAuth();
  const [mode, setMode] = useState("view"); // "view" | "edit" | "void"
  const [form, setForm] = useState({
    reason: movement.reason || "",
    project: movement.project || "",
    notes: movement.notes || "",
  });
  const [voidReason, setVoidReason] = useState("");
  const [saving, setSaving] = useState(false);

  const isVoided = Boolean(movement.voided);
  const isTransfer = movement.type === MOVEMENT_TYPES.TRANSFERENCIA;
  const actor = { uid: currentUser?.uid || "", name: userData?.name || "Usuario" };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!form.reason.trim()) return toast.error("El motivo no puede quedar vacío");
    setSaving(true);
    try {
      await updateDoc(doc(db, COLLECTIONS.MOVEMENTS, movement.id), {
        reason: form.reason.trim(),
        project: form.project.trim(),
        notes: form.notes.trim(),
        editedAt: serverTimestamp(),
        editedBy: actor.uid,
        editedByName: actor.name,
      });
      toast.success("Movimiento corregido");
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("No se pudo guardar la corrección");
      setSaving(false);
    }
  };

  const handleVoid = async (e) => {
    e.preventDefault();
    if (!voidReason.trim()) return toast.error("Indica por qué se anula");
    if (!navigator.onLine) return toast.error(OFFLINE_MESSAGE);
    setSaving(true);
    try {
      let stockReverted = true;
      await runTransaction(db, async (tx) => {
        const movRef = doc(db, COLLECTIONS.MOVEMENTS, movement.id);
        const matRef = doc(db, COLLECTIONS.MATERIALS, movement.materialId);
        const [movSnap, matSnap] = [await tx.get(movRef), await tx.get(matRef)];

        if (movSnap.data()?.voided) throw new Error("Este movimiento ya estaba anulado");

        if (matSnap.exists()) {
          const { updates } = computeReversal(matSnap.data(), movement);
          tx.update(matRef, { ...updates, updatedAt: serverTimestamp() });
        } else {
          stockReverted = false; // el material fue eliminado: sólo se marca
        }

        tx.update(movRef, {
          voided: true,
          voidReason: voidReason.trim(),
          voidedAt: serverTimestamp(),
          voidedBy: actor.uid,
          voidedByName: actor.name,
        });
      });
      toast.success(
        stockReverted
          ? "Movimiento anulado y stock restaurado"
          : "Movimiento anulado (el material ya no existe)"
      );
      onClose();
    } catch (error) {
      console.error(error);
      toast.error(error.message || "No se pudo anular el movimiento");
      setSaving(false);
    }
  };

  const fields = [
    ["Fecha", formatDateTime(toDate(movement.createdAt))],
    ["Registrado por", getMovementUser(movement)],
    ["Cantidad", movement.quantity],
    isTransfer
      ? ["Traslado", `${movement.fromLocation || "—"} → ${movement.toLocation || "—"}`]
      : ["Stock disponible", `${movement.previousQuantity} → ${movement.newQuantity}`],
    ["Motivo", movement.reason || "—"],
    ["Proyecto / evento", movement.project || "—"],
  ];

  return (
    <Modal
      isOpen
      onClose={saving ? () => {} : onClose}
      title={movement.materialName}
      subtitle={movement.materialCode}
      size="md"
      footer={
        mode === "view" &&
        isAdmin &&
        !isVoided && (
          <>
            <Button variant="danger-ghost" icon={Ban} onClick={() => setMode("void")}>
              Anular
            </Button>
            <Button variant="secondary" icon={Edit} onClick={() => setMode("edit")}>
              Corregir datos
            </Button>
          </>
        )
      }
    >
      <div className="mv-detail-badges">
        <Badge variant={getMovementVariant(movement.type)}>
          {MOVEMENT_LABELS[movement.type] || movement.type}
        </Badge>
        {isVoided && <Badge variant="error">Anulado</Badge>}
        {movement.editedAt && !isVoided && <Badge>Corregido</Badge>}
      </div>

      {isVoided && (
        <div className="mv-detail-alert">
          Anulado por <strong>{movement.voidedByName || "—"}</strong> el{" "}
          {formatDateTime(toDate(movement.voidedAt))}. Motivo: {movement.voidReason || "—"}
        </div>
      )}

      {mode === "view" && (
        <>
          <dl className="mv-detail-grid">
            {fields.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
          {movement.notes && (
            <div className="mv-detail-notes">
              <dt>Notas</dt>
              <dd>{movement.notes}</dd>
            </div>
          )}
          {movement.editedAt && (
            <p className="mv-detail-meta">
              Corregido por {movement.editedByName || "—"} el {formatDateTime(toDate(movement.editedAt))}
            </p>
          )}
          {isAdmin && !isVoided && (
            <p className="mv-detail-meta">
              ¿Cantidad o material equivocados? Anula este movimiento (el stock se restaura) y
              registra uno nuevo con los datos correctos.
            </p>
          )}
        </>
      )}

      {mode === "edit" && (
        <form className="form-stack" onSubmit={handleSaveEdit}>
          <Input
            label="Motivo"
            name="reason"
            value={form.reason}
            onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))}
            required
          />
          <Input
            label="Proyecto / evento"
            name="project"
            value={form.project}
            onChange={(e) => setForm((f) => ({ ...f, project: e.target.value }))}
          />
          <Input
            label="Notas"
            type="textarea"
            name="notes"
            rows={3}
            value={form.notes}
            onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
          />
          <p className="mv-detail-meta">
            La cantidad y el tipo no se editan para no descuadrar el stock: para eso, anula el movimiento.
          </p>
          <div className="form-actions">
            <Button variant="secondary" onClick={() => setMode("view")} disabled={saving}>
              Volver
            </Button>
            <Button type="submit" icon={Save} loading={saving}>
              Guardar corrección
            </Button>
          </div>
        </form>
      )}

      {mode === "void" && (
        <form className="form-stack" onSubmit={handleVoid}>
          <div className="mv-detail-alert">
            Se revertirá el efecto de este movimiento en el stock de{" "}
            <strong>{movement.materialName}</strong> y quedará marcado como anulado en el historial.
          </div>
          <Input
            label="Motivo de la anulación"
            name="voidReason"
            value={voidReason}
            onChange={(e) => setVoidReason(e.target.value)}
            placeholder="Ej: cantidad cargada por error"
            required
          />
          <div className="form-actions">
            <Button variant="secondary" onClick={() => setMode("view")} disabled={saving}>
              Volver
            </Button>
            <Button type="submit" variant="danger" icon={Ban} loading={saving}>
              Anular movimiento
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default MovementDetail;
