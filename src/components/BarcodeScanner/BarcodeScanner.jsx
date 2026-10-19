import { useEffect, useRef, useState } from "react";
import { Camera, Keyboard } from "lucide-react";
import Modal from "../Modal/Modal";
import Button from "../Button/Button";
import Input from "../Input/Input";
import "./BarcodeScanner.css";

const READER_ID = "barcode-reader";

/**
 * Escáner de códigos de barras / QR con la cámara.
 * Incluye entrada manual como alternativa (lectores USB o sin cámara).
 */
const BarcodeScanner = ({ onScan, onClose, title = "Escanear código" }) => {
  const scannerRef = useRef(null);
  const [scanning, setScanning] = useState(false);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState(null);
  const [manualCode, setManualCode] = useState("");

  const stopScanner = async () => {
    const scanner = scannerRef.current;
    scannerRef.current = null;
    if (scanner) {
      try {
        if (scanner.isScanning) await scanner.stop();
        scanner.clear();
      } catch {
        // ya estaba detenido
      }
    }
    setScanning(false);
  };

  // Libera la cámara al desmontar
  useEffect(() => () => void stopScanner(), []);

  const startScanner = async () => {
    setError(null);
    setStarting(true);
    try {
      // La librería se carga sólo cuando se usa la cámara
      const { Html5Qrcode } = await import("html5-qrcode");
      const scanner = new Html5Qrcode(READER_ID);
      scannerRef.current = scanner;
      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 260, height: 160 } },
        async (decodedText) => {
          await stopScanner();
          onScan(decodedText.trim());
        },
        () => {}
      );
      setScanning(true);
    } catch (err) {
      console.error("Error al iniciar escáner:", err);
      scannerRef.current = null;
      setError(
        window.isSecureContext
          ? "No se pudo acceder a la cámara. Revisa los permisos del navegador."
          : "La cámara sólo funciona en conexiones seguras (HTTPS)."
      );
    } finally {
      setStarting(false);
    }
  };

  const handleClose = async () => {
    await stopScanner();
    onClose();
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const code = manualCode.trim();
    if (!code) return;
    await stopScanner();
    onScan(code);
  };

  return (
    <Modal isOpen onClose={handleClose} title={title} size="sm">
      <div className="scanner">
        <div className={`scanner-viewport ${scanning ? "active" : ""}`}>
          <div id={READER_ID} />
          {!scanning && (
            <div className="scanner-placeholder">
              <Camera size={40} />
              <p>Apunta la cámara al código de barras o QR</p>
              <Button icon={Camera} onClick={startScanner} loading={starting}>
                Activar cámara
              </Button>
            </div>
          )}
        </div>

        {error && <p className="scanner-error">{error}</p>}
        {scanning && (
          <div className="scanner-actions">
            <Button variant="secondary" size="sm" onClick={stopScanner}>
              Detener cámara
            </Button>
          </div>
        )}

        <form className="scanner-manual" onSubmit={handleManualSubmit}>
          <p className="scanner-manual-label">
            <Keyboard size={14} /> O escribe el código manualmente
          </p>
          <div className="scanner-manual-row">
            <Input
              name="manualCode"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              placeholder="Ej: AUD-000123"
              autoComplete="off"
            />
            <Button type="submit" variant="secondary" disabled={!manualCode.trim()}>
              Usar
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default BarcodeScanner;
