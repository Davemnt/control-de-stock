import React, { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import "./Modal.css";

// Cuenta de modales abiertos para bloquear el scroll del body correctamente
let openModals = 0;

const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  size = "md",
  closeOnBackdrop = true,
  className = "",
}) => {
  const titleId = useId();
  const dialogRef = useRef(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!isOpen) return undefined;

    openModals += 1;
    document.body.style.overflow = "hidden";
    const previousFocus = document.activeElement;

    // Foco inicial: primer campo editable, o el diálogo
    const timer = setTimeout(() => {
      const target = dialogRef.current?.querySelector(
        "[data-autofocus], input:not([disabled]):not([type=hidden]), select:not([disabled]), textarea:not([disabled])"
      );
      (target || dialogRef.current)?.focus();
    }, 30);

    const handleKey = (e) => {
      if (e.key !== "Escape") return;
      // Sólo cierra el modal superior
      const dialogs = document.querySelectorAll(".modal");
      if (dialogs[dialogs.length - 1] === dialogRef.current) {
        e.stopPropagation();
        onCloseRef.current?.();
      }
    };
    document.addEventListener("keydown", handleKey);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("keydown", handleKey);
      openModals -= 1;
      if (openModals <= 0) {
        openModals = 0;
        document.body.style.overflow = "";
      }
      if (previousFocus && previousFocus.focus) previousFocus.focus();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropMouseDown = (e) => {
    if (e.target === e.currentTarget && closeOnBackdrop) {
      onClose();
    }
  };

  return createPortal(
    <div className="modal-backdrop" onMouseDown={handleBackdropMouseDown}>
      <div
        ref={dialogRef}
        className={`modal modal-${size} ${className}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
      >
        <div className="modal-header">
          <div className="modal-heading">
            <h2 id={titleId} className="modal-title">
              {title}
            </h2>
            {subtitle && <p className="modal-subtitle">{subtitle}</p>}
          </div>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Cerrar">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">{children}</div>

        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
