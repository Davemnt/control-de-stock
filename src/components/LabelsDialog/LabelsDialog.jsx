import React, { useState } from "react";
import { QrCode } from "lucide-react";
import toast from "react-hot-toast";
import { LABEL_FORMATS, generateLabelsPdf } from "../../utils/labelsPdf";
import Modal from "../Modal/Modal";
import Button from "../Button/Button";

const MAX_LABELS = 500;

/** Elige el formato y genera el PDF de etiquetas QR */
const LabelsDialog = ({ materials, getCategoryLabel, onClose }) => {
  const [format, setFormat] = useState(materials.length === 1 ? "single" : "a4");
  const [busy, setBusy] = useState(false);
  const tooMany = materials.length > MAX_LABELS;

  const handleGenerate = async () => {
    setBusy(true);
    try {
      await generateLabelsPdf(materials, format, getCategoryLabel);
      toast.success(
        materials.length === 1 ? "Etiqueta generada" : `${materials.length} etiquetas generadas`
      );
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("No se pudieron generar las etiquetas");
      setBusy(false);
    }
  };

  return (
    <Modal
      isOpen
      onClose={busy ? () => {} : onClose}
      title="Etiquetas con código QR"
      subtitle={
        materials.length === 1
          ? `${materials[0].name} · ${materials[0].code}`
          : `${materials.length} materiales (los filtrados en el inventario)`
      }
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={busy}>
            Cancelar
          </Button>
          <Button icon={QrCode} onClick={handleGenerate} loading={busy} disabled={tooMany}>
            Generar PDF
          </Button>
        </>
      }
    >
      <fieldset className="role-picker labels-picker">
        <legend className="input-label">Formato</legend>
        {Object.entries(LABEL_FORMATS).map(([key, f]) => (
          <label key={key} className={`role-option ${format === key ? "is-selected" : ""}`}>
            <input
              type="radio"
              name="format"
              value={key}
              checked={format === key}
              onChange={() => setFormat(key)}
            />
            <span>
              <strong>{f.label}</strong>
              <small>
                {key === "a4"
                  ? "Para imprimir en hojas adhesivas con cualquier impresora."
                  : "Para impresoras de etiquetas (Brother, Dymo, Zebra…)."}
              </small>
            </span>
          </label>
        ))}
      </fieldset>
      <p className="input-helper" style={{ marginTop: "0.75rem" }}>
        {tooMany
          ? `Son demasiadas etiquetas (máximo ${MAX_LABELS}). Filtra el inventario para generar menos.`
          : "El QR contiene el código del material: escanéalo desde la app para abrir su ficha."}
      </p>
    </Modal>
  );
};

export default LabelsDialog;
