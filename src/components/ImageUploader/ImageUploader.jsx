import React, { useState, useRef } from "react";
import { Upload, X, Camera, Image as ImageIcon } from "lucide-react";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "../../firebase";
import Button from "../Button/Button";
import toast from "react-hot-toast";
import "./ImageUploader.css";

const ImageUploader = ({
  onImageUploaded,
  onImageRemoved,
  currentImageUrl = null,
  disabled = false,
  maxSizeKB = 5000, // 5MB por defecto
}) => {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(currentImageUrl);
  const fileInputRef = useRef(null);

  const validateFile = (file) => {
    // Validar tipo de archivo
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Solo se permiten archivos JPG, PNG o WebP");
      return false;
    }

    // Validar tamaño
    const fileSizeKB = file.size / 1024;
    if (fileSizeKB > maxSizeKB) {
      toast.error(`El archivo es muy grande. Máximo ${maxSizeKB / 1024}MB`);
      return false;
    }

    return true;
  };

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!validateFile(file)) {
      event.target.value = ""; // Limpiar input
      return;
    }

    if (!storage) {
      toast.error("Storage no configurado");
      return;
    }

    setUploading(true);

    try {
      // Generar nombre único para el archivo
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substring(2);
      const extension = file.name.split(".").pop();
      const materialId = `material_${timestamp}_${randomId}`;
      const fileName = `${timestamp}_${randomId}.${extension}`;
      const fullPath = `materials/${materialId}/${fileName}`;

      // Subir archivo a Firebase Storage
      const storageRef = ref(storage, fullPath);
      const snapshot = await uploadBytes(storageRef, file);

      // Obtener URL de descarga
      const downloadURL = await getDownloadURL(snapshot.ref);

      setPreviewUrl(downloadURL);
      onImageUploaded(downloadURL, fullPath);

      toast.success("Imagen subida correctamente");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Error al subir la imagen");
    } finally {
      setUploading(false);
      event.target.value = ""; // Limpiar input para permitir seleccionar el mismo archivo
    }
  };

  const handleRemoveImage = async () => {
    if (!previewUrl) return;

    try {
      // Si tenemos una referencia al archivo en Storage, intentar eliminarlo
      if (storage && currentImageUrl && currentImageUrl.includes("firebase")) {
        try {
          const imageRef = ref(storage, currentImageUrl);
          await deleteObject(imageRef);
        } catch (deleteError) {
          // Si no se puede eliminar (ej: no existe), continuar de todas formas
          console.warn(
            "No se pudo eliminar la imagen del storage:",
            deleteError
          );
        }
      }

      setPreviewUrl(null);
      onImageRemoved();
      toast.success("Imagen eliminada");
    } catch (error) {
      console.error("Error removing image:", error);
      toast.error("Error al eliminar la imagen");
    }
  };

  const openFileDialog = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="image-uploader">
      <label className="image-uploader-label">
        <Camera size={16} />
        Imagen del Material
      </label>

      <div className="image-uploader-container">
        {previewUrl ? (
          <div className="image-preview">
            <img
              src={previewUrl}
              alt="Preview"
              className="preview-image"
              onError={(e) => {
                e.target.src = "/placeholder-image.png"; // Imagen placeholder si falla
              }}
            />
            <div className="image-overlay">
              <Button
                variant="ghost"
                size="sm"
                icon={X}
                onClick={handleRemoveImage}
                disabled={disabled}
                className="remove-button"
              >
                Eliminar
              </Button>
              <Button
                variant="ghost"
                size="sm"
                icon={Upload}
                onClick={openFileDialog}
                disabled={disabled || uploading}
                className="change-button"
              >
                Cambiar
              </Button>
            </div>
          </div>
        ) : (
          <div
            className={`upload-area ${disabled ? "disabled" : ""}`}
            onClick={openFileDialog}
          >
            <div className="upload-content">
              {uploading ? (
                <>
                  <div className="upload-spinner"></div>
                  <p>Subiendo imagen...</p>
                </>
              ) : (
                <>
                  <ImageIcon size={48} />
                  <p>Haz clic para subir una imagen</p>
                  <small>JPG, PNG o WebP • Máximo {maxSizeKB / 1024}MB</small>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileSelect}
        style={{ display: "none" }}
        disabled={disabled || uploading}
      />
    </div>
  );
};

export default ImageUploader;
