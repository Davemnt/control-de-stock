import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Moon,
  Sun,
  Settings as SettingsIcon,
} from "lucide-react";
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import Layout from "../../components/Layout/Layout";
import Card from "../../components/Card/Card";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import Modal from "../../components/Modal/Modal";
import toast from "react-hot-toast";
import "./Configuracion.css";

const Configuracion = () => {
  const { userData, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    key: "",
    label: "",
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const configDoc = await getDoc(doc(db, "system", "categories"));

      if (configDoc.exists()) {
        const data = configDoc.data();
        setCategories(data.categories || []);
      } else {
        // Crear configuración por defecto
        const defaultCategories = [
          { key: "Audio", label: "Audio" },
          { key: "Iluminación", label: "Iluminación" },
          { key: "Video", label: "Video" },
          { key: "Rigging", label: "Rigging" },
          { key: "Estructuras", label: "Estructuras" },
          { key: "Cables", label: "Cables y Accesorios" },
          { key: "Mochilas Técnicas", label: "Mochilas Técnicas" },
          { key: "Repuestos", label: "Repuestos" },
        ];
        await setDoc(doc(db, "system", "categories"), {
          categories: defaultCategories,
          updatedAt: serverTimestamp(),
          updatedBy: userData.uid,
        });
        setCategories(defaultCategories);
      }
    } catch (error) {
      console.error("Error loading categories:", error);
      toast.error("Error al cargar configuración");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.key || !formData.label) {
      toast.error("Completa todos los campos");
      return;
    }

    try {
      let updatedCategories;

      if (editingCategory) {
        // Editar categoría existente
        updatedCategories = categories.map((cat) =>
          cat.key === editingCategory.key
            ? { key: formData.key, label: formData.label }
            : cat
        );
        toast.success("Categoría actualizada");
      } else {
        // Verificar que no exista
        if (categories.some((cat) => cat.key === formData.key)) {
          toast.error("Ya existe una categoría con ese identificador");
          return;
        }
        // Agregar nueva categoría
        updatedCategories = [
          ...categories,
          { key: formData.key, label: formData.label },
        ];
        toast.success("Categoría agregada");
      }

      // Guardar en Firestore
      await updateDoc(doc(db, "system", "categories"), {
        categories: updatedCategories,
        updatedAt: serverTimestamp(),
        updatedBy: userData.uid,
      });

      setCategories(updatedCategories);
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error("Error saving category:", error);
      toast.error("Error al guardar categoría");
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      key: category.key,
      label: category.label,
    });
    setShowModal(true);
  };

  const handleDelete = async (categoryKey) => {
    if (!window.confirm("¿Estás seguro de eliminar esta categoría?")) {
      return;
    }

    try {
      const updatedCategories = categories.filter(
        (cat) => cat.key !== categoryKey
      );

      await updateDoc(doc(db, "system", "categories"), {
        categories: updatedCategories,
        updatedAt: serverTimestamp(),
        updatedBy: userData.uid,
      });

      setCategories(updatedCategories);
      toast.success("Categoría eliminada");
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Error al eliminar categoría");
    }
  };

  const resetForm = () => {
    setFormData({ key: "", label: "" });
    setEditingCategory(null);
  };

  if (loading) {
    return (
      <Layout>
        <div className="config-loading">
          <div className="spinner"></div>
          <p>Cargando configuración...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="configuracion">
        <div className="config-header">
          <div>
            <h1>Configuración del Sistema</h1>
            <p>Personaliza las categorías y preferencias</p>
          </div>
        </div>

        {/* Tema */}
        <Card>
          <div className="config-section">
            <div className="config-section-header">
              <div>
                <h2>Apariencia</h2>
                <p>Cambia entre tema claro y oscuro</p>
              </div>
              <Button
                variant={theme === "dark" ? "primary" : "ghost"}
                icon={theme === "dark" ? Moon : Sun}
                onClick={toggleTheme}
              >
                {theme === "dark" ? "Tema Oscuro" : "Tema Claro"}
              </Button>
            </div>
          </div>
        </Card>

        {/* Categorías */}
        {isAdmin && (
          <Card>
            <div className="config-section">
              <div className="config-section-header">
                <div>
                  <h2>Categorías de Materiales</h2>
                  <p>{categories.length} categorías configuradas</p>
                </div>
                <Button
                  variant="primary"
                  icon={Plus}
                  onClick={() => {
                    resetForm();
                    setShowModal(true);
                  }}
                >
                  Nueva Categoría
                </Button>
              </div>

              <div className="categories-list">
                {categories.map((category) => (
                  <div key={category.key} className="category-item">
                    <div className="category-info">
                      <strong>{category.label}</strong>
                      <span className="category-key">{category.key}</span>
                    </div>
                    <div className="category-actions">
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={Edit}
                        onClick={() => handleEdit(category)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={Trash2}
                        onClick={() => handleDelete(category.key)}
                      >
                        Eliminar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}

        {/* Modal */}
        <Modal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            resetForm();
          }}
          title={editingCategory ? "Editar Categoría" : "Nueva Categoría"}
        >
          <form onSubmit={handleSubmit} className="category-form">
            <Input
              label="Identificador"
              name="key"
              value={formData.key}
              onChange={(e) =>
                setFormData({ ...formData, key: e.target.value })
              }
              required
              disabled={!!editingCategory}
              placeholder="Audio, Video, etc."
            />

            <Input
              label="Nombre a Mostrar"
              name="label"
              value={formData.label}
              onChange={(e) =>
                setFormData({ ...formData, label: e.target.value })
              }
              required
              placeholder="Audio Profesional"
            />

            <div className="modal-footer">
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
              >
                Cancelar
              </Button>
              <Button type="submit" variant="primary">
                {editingCategory ? "Actualizar" : "Crear"} Categoría
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </Layout>
  );
};

export default Configuracion;
