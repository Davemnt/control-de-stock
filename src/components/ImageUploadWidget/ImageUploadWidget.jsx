import React, { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import toast from "react-hot-toast";
import "./ImageUploadWidget.css";

const ImageUploadWidget = ({
  materialId,
  currentImageUrl,
  onImageUpload,
  onImageRemove,
  disabled = false,
}) => {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(currentImageUrl);
  const fileInputRef = useRef(null);

  // Formatos de imagen permitidos
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  const maxSizeInMB = 2; // Reducimos a 2MB para base64
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

  const validateFile = (file) => {
    if (!allowedTypes.includes(file.type)) {
      toast.error("Formato no válido. Use JPG, PNG o WebP");
      return false;
    }

    if (file.size > maxSizeInBytes) {
      toast.error(`Archivo muy grande. Máximo ${maxSizeInMB}MB`);
      return false;
    }

    return true;
  };

  const compressImage = (file, maxWidth = 800, quality = 0.8) => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = () => {
        // Calcular dimensiones manteniendo proporción
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;

        // Dibujar imagen redimensionada
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Convertir a blob con compresión
        canvas.toBlob(resolve, "image/jpeg", quality);
      };

      img.src = URL.createObjectURL(file);
    });
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file || disabled) return;

    if (!validateFile(file)) {
      event.target.value = ""; // Limpiar input
      return;
    }

    try {
      setUploading(true);

      // Comprimir imagen antes de convertir a base64
      const compressedFile = await compressImage(file);

      // Convertir a base64 para almacenar en Firestore
      const base64String = await convertToBase64(compressedFile);

      // Crear identificador único para la imagen
      const timestamp = Date.now();
      const fileName = `material_${materialId}_${timestamp}.jpg`;

      // Mostrar preview inmediatamente
      setPreviewUrl(base64String);

      // Notificar al componente padre con la imagen en base64
      onImageUpload(base64String, fileName);

      toast.success("Imagen procesada correctamente");
    } catch (error) {
      console.error("Error processing image:", error);
      toast.error("Error al procesar la imagen");
    } finally {
      setUploading(false);
      event.target.value = ""; // Limpiar input
    }
  };

  const handleRemoveImage = async () => {
    if (!previewUrl || disabled) return;

    try {
      setUploading(true);

      // Para imágenes base64, solo removemos la referencia
      setPreviewUrl(null);
      onImageRemove();

      toast.success("Imagen eliminada");
    } catch (error) {
      console.error("Error removing image:", error);
      toast.error("Error al eliminar la imagen");
    } finally {
      setUploading(false);
    }
  };

  const handleClick = () => {
    if (!disabled && !uploading) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="image-upload-widget">
      <input
        ref={fileInputRef}
        type="file"
        accept={allowedTypes.join(",")}
        onChange={handleFileSelect}
        style={{ display: "none" }}
        disabled={disabled || uploading}
      />

      <div className="image-preview-container">
        {previewUrl ? (
          <div className="image-preview">
            <img
              src={previewUrl}
              alt="Vista previa del material"
              className="preview-image"
              loading="lazy"
            />

            {!disabled && (
              <button
                type="button"
                onClick={handleRemoveImage}
                className="remove-image-btn"
                disabled={uploading}
                title="Eliminar imagen"
              >
                <X size={16} />
              </button>
            )}

            {uploading && (
              <div className="upload-overlay">
                <div className="spinner"></div>
              </div>
            )}
          </div>
        ) : (
          <div
            className={`upload-placeholder ${disabled ? "disabled" : ""} ${
              uploading ? "uploading" : ""
            }`}
            onClick={handleClick}
          >
            {uploading ? (
              <>
                <div className="spinner"></div>
                <span>Subiendo imagen...</span>
              </>
            ) : (
              <>
                <ImageIcon size={32} />
                <span>Click para subir imagen</span>
                <small>JPG, PNG o WebP - Máx. {maxSizeInMB}MB</small>
              </>
            )}
          </div>
        )}
      </div>

      {!disabled && (
        <div className="upload-actions">
          <button
            type="button"
            onClick={handleClick}
            disabled={uploading}
            className="upload-btn"
          >
            <Upload size={16} />
            {previewUrl ? "Cambiar imagen" : "Subir imagen"}
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUploadWidget;
