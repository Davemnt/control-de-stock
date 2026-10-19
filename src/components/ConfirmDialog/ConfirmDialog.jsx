import React, { useState } from "react";
import { AlertTriangle } from "lucide-react";
import Modal from "../Modal/Modal";
import Button from "../Button/Button";
import "./ConfirmDialog.css";

/**
 * Diálogo de confirmación (reemplaza window.confirm).
 * `onConfirm` puede ser async: el botón muestra la carga y el diálogo
 * se cierra al terminar. Si lanza un error, el diálogo queda abierto.
 */
const ConfirmDialog = ({
  isOpen,
  title = "¿Confirmar acción?",
  message,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  variant = "danger",
  onConfirm,
  onCancel,
}) => {
  const [busy, setBusy] = useState(false);

  const handleConfirm = async () => {
    setBusy(true);
    try {
      await onConfirm?.();
      onCancel?.();
    } catch (error) {
      console.error(error);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={busy ? () => {} : onCancel}
      title={title}
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onCancel} disabled={busy}>
            {cancelLabel}
          </Button>
          <Button variant={variant} onClick={handleConfirm} loading={busy} data-autofocus>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div className="confirm-dialog">
        {variant === "danger" && (
          <span className="confirm-dialog-icon">
            <AlertTriangle size={18} />
          </span>
        )}
        <div className="confirm-dialog-message">{message}</div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
