import { useState, useEffect } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Camera, X } from "lucide-react";
import Button from "../Button/Button";
import "./BarcodeScanner.css";

const BarcodeScanner = ({ onScan, onClose }) => {
  const [scanning, setScanning] = useState(false);
  const [scanner, setScanner] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    return () => {
      if (scanner) {
        scanner.stop().catch(console.error);
      }
    };
  }, [scanner]);

  const startScanning = async () => {
    try {
      const html5QrCode = new Html5Qrcode("qr-reader");
      setScanner(html5QrCode);

      await html5QrCode.start(
        { facingMode: "environment" }, // Cámara trasera
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        },
        (decodedText) => {
          // Código escaneado exitosamente
          html5QrCode.stop();
          setScanning(false);
          onScan(decodedText);
        },
        () => {
          // Error de escaneo (no hacer nada, es normal)
        }
      );

      setScanning(true);
      setError(null);
    } catch (err) {
      console.error("Error al iniciar escáner:", err);
      setError("No se pudo acceder a la cámara. Verifica los permisos.");
      setScanning(false);
    }
  };

  const stopScanning = () => {
    if (scanner) {
      scanner
        .stop()
        .then(() => {
          setScanning(false);
          setScanner(null);
        })
        .catch(console.error);
    }
  };

  return (
    <div className="barcode-scanner-modal">
      <div className="barcode-scanner-backdrop" onClick={onClose}></div>
      <div className="barcode-scanner-content">
        <div className="barcode-scanner-header">
          <h2>Escanear Código de Barras</h2>
          <button className="close-button" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="barcode-scanner-body">
          {error && (
            <div className="scanner-error">
              <p>{error}</p>
            </div>
          )}

          <div
            id="qr-reader"
            className={`scanner-viewport ${scanning ? "active" : ""}`}
          ></div>

          {!scanning && !error && (
            <div className="scanner-placeholder">
              <Camera size={64} />
              <p>Presiona &quot;Iniciar Escaneo&quot; para usar la cámara</p>
            </div>
          )}

          {scanning && (
            <div className="scanner-instructions">
              <p>Coloca el código de barras dentro del marco</p>
            </div>
          )}
        </div>

        <div className="barcode-scanner-footer">
          {!scanning ? (
            <Button variant="primary" icon={Camera} onClick={startScanning}>
              Iniciar Escaneo
            </Button>
          ) : (
            <Button variant="ghost" icon={X} onClick={stopScanning}>
              Cancelar Escaneo
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BarcodeScanner;
