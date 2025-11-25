import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Filter,
  Grid,
  List,
  Edit,
  Trash2,
  Eye,
  Camera,
  FileDown,
} from "lucide-react";
import {
  collection,
  query,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../contexts/AuthContext";
import {
  COLLECTIONS,
  getCollection,
  CATEGORIES,
  CATEGORY_LABELS,
  STATUS_LABELS,
} from "../../constants";
import Layout from "../../components/Layout/Layout";
import Card from "../../components/Card/Card";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import Badge from "../../components/Badge/Badge";
import Modal from "../../components/Modal/Modal";
import BarcodeScanner from "../../components/BarcodeScanner/BarcodeScanner";
import { exportMaterialsToPDF } from "../../utils/pdfExport";
import toast from "react-hot-toast";
import "./Materiales.css";

const Materiales = () => {
  const { userData, isAdmin, isUser, isGuest } = useAuth();
  const [materials, setMaterials] = useState([]);
  const [filteredMaterials, setFilteredMaterials] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    category: "",
    subcategory: "",
    quantity: 0,
    quantityCommitted: 0,
    quantityMaintenance: 0,
    location: "Depósito Principal",
    status: "operativo",
    notes: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterMaterials();
  }, [materials, searchTerm, categoryFilter, statusFilter]);

  const loadData = async () => {
    try {
      // Cargar categorías
      const configDoc = await getDoc(doc(db, "system", "categories"));
      let categoriesList = [];

      if (configDoc.exists()) {
        categoriesList = configDoc.data().categories || [];
      } else {
        // Categorías por defecto si no existen en Firestore
        categoriesList = [
          { key: "Audio", label: "Audio" },
          { key: "Iluminación", label: "Iluminación" },
          { key: "Video", label: "Video" },
          { key: "Rigging", label: "Rigging" },
          { key: "Estructuras", label: "Estructuras" },
          { key: "Cables", label: "Cables y Accesorios" },
          { key: "Mochilas Técnicas", label: "Mochilas Técnicas" },
          { key: "Repuestos", label: "Repuestos" },
        ];
      }

      setCategories(categoriesList);

      // Establecer categoría por defecto en formData
      if (categoriesList.length > 0 && !formData.category) {
        setFormData((prev) => ({ ...prev, category: categoriesList[0].key }));
      }

      // Cargar materiales
      const materialsSnapshot = await getDocs(
        collection(db, COLLECTIONS.MATERIALS)
      );
      const materialsData = materialsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMaterials(materialsData);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Error al cargar datos");
    } finally {
      setLoading(false);
    }
  };

  const loadMaterials = async () => {
    try {
      const materialsCollectionName = getCollection(COLLECTIONS.MATERIALS);
      const materialsSnapshot = await getDocs(
        collection(db, materialsCollectionName)
      );
      const materialsData = materialsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMaterials(materialsData);
    } catch (error) {
      console.error("Error loading materials:", error);
      toast.error("Error al cargar materiales");
    }
  };

  const filterMaterials = () => {
    let filtered = [...materials];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (mat) =>
          mat.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          mat.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          mat.subcategory?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter((mat) => mat.category === categoryFilter);
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((mat) => mat.status === statusFilter);
    }

    setFilteredMaterials(filtered);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.code) {
      toast.error("Nombre y código son obligatorios");
      return;
    }

    // Validar que quantity sea un número válido
    const quantity = Number(formData.quantity) || 0;
    const quantityCommitted = Number(formData.quantityCommitted) || 0;
    const quantityMaintenance = Number(formData.quantityMaintenance) || 0;

    if (quantity < 0 || quantityCommitted < 0 || quantityMaintenance < 0) {
      toast.error("Las cantidades no pueden ser negativas");
      return;
    }

    try {
      if (editingMaterial) {
        // Update - preservar createdAt y createdBy
        const materialsCollectionName = getCollection(COLLECTIONS.MATERIALS);
        await updateDoc(doc(db, materialsCollectionName, editingMaterial.id), {
          name: formData.name.trim(),
          code: formData.code.trim(),
          category: formData.category,
          subcategory: formData.subcategory?.trim() || "",
          quantity: quantity,
          quantityCommitted: quantityCommitted,
          quantityMaintenance: quantityMaintenance,
          location: formData.location.trim() || "Depósito Principal",
          status: formData.status || "operativo",
          notes: formData.notes?.trim() || "",
          updatedAt: serverTimestamp(),
        });
        toast.success("Material actualizado");
      } else {
        // Create - incluir TODOS los campos obligatorios según las reglas de Firestore
        const materialsCollectionName = getCollection(COLLECTIONS.MATERIALS);
        const materialData = {
          name: String(formData.name || "").trim(),
          code: String(formData.code || "").trim(),
          category: String(formData.category || categories[0]?.key || "audio"),
          subcategory: String(formData.subcategory || "").trim(),
          quantity: Number(quantity) || 0,
          quantityCommitted: Number(quantityCommitted) || 0,
          quantityMaintenance: Number(quantityMaintenance) || 0,
          location: String(formData.location || "Depósito Principal").trim(),
          status: String(formData.status || "operativo"),
          notes: String(formData.notes || "").trim(),
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          createdBy: String(userData?.uid || ""),
          createdByName: String(userData?.name || "Usuario"),
        };

        console.log("Creating material with data:", materialData);
        await addDoc(collection(db, materialsCollectionName), materialData);
        toast.success("Material creado exitosamente");
      }

      setShowModal(false);
      resetForm();
      loadMaterials();
    } catch (error) {
      console.error("Error saving material:", error);

      // Mensajes de error más descriptivos
      let errorMessage = "Error al guardar material";
      if (error.message.includes("permission")) {
        errorMessage = "No tienes permisos para realizar esta acción";
      } else if (error.message.includes("invalid")) {
        errorMessage = "Datos inválidos. Verifica todos los campos";
      }

      toast.error(errorMessage);
    }
  };

  const handleEdit = (material) => {
    setEditingMaterial(material);
    setFormData({
      name: material.name || "",
      code: material.code || "",
      category:
        material.category || (categories.length > 0 ? categories[0].key : ""),
      subcategory: material.subcategory || "",
      quantity: material.quantity || 0,
      quantityCommitted: material.quantityCommitted || 0,
      quantityMaintenance: material.quantityMaintenance || 0,
      location: material.location || "Depósito Principal",
      status: material.status || "operativo",
      notes: material.notes || "",
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este material?")) {
      return;
    }

    try {
      const materialsCollectionName = getCollection(COLLECTIONS.MATERIALS);
      await deleteDoc(doc(db, materialsCollectionName, id));
      toast.success("Material eliminado");
      loadMaterials();
    } catch (error) {
      console.error("Error deleting material:", error);
      toast.error("Error al eliminar material");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      code: "",
      category: categories.length > 0 ? categories[0].key : "",
      subcategory: "",
      quantity: 0,
      quantityCommitted: 0,
      quantityMaintenance: 0,
      location: "Depósito Principal",
      status: "operativo",
      notes: "",
    });
    setEditingMaterial(null);
  };

  const handleNewMaterial = () => {
    // Si es usuario guest (demo), mostrar mensaje informativo
    if (isGuest) {
      toast.info(
        "👁️ Versión Demo: Esta funcionalidad está disponible solo para usuarios con permisos de edición. Contáctanos para acceso completo.",
        { duration: 5000 }
      );
      return;
    }
    resetForm();
    setShowModal(true);
  };

  const handleBarcodeScanned = (code) => {
    setFormData({ ...formData, code: code });
    setShowScanner(false);
    toast.success(`Código escaneado: ${code}`);
  };

  const handleExportPDF = () => {
    exportMaterialsToPDF(filteredMaterials, {
      categoryFilter,
      statusFilter,
    });
    toast.success("PDF generado exitosamente");
  };

  if (loading) {
    return (
      <Layout>
        <div className="materials-loading">
          <div className="spinner"></div>
          <p>Cargando materiales...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="materials">
        <div className="materials-header">
          <div>
            <h1>Catálogo de Materiales</h1>
            <p>{filteredMaterials.length} materiales</p>
          </div>
          <div className="materials-header-actions">
            <Button variant="ghost" icon={FileDown} onClick={handleExportPDF}>
              Exportar PDF
            </Button>
            <Button variant="primary" icon={Plus} onClick={handleNewMaterial}>
              Nuevo Material
            </Button>
          </div>
        </div>

        <div className="materials-filters">
          <div className="search-box">
            <Input
              placeholder="Buscar por nombre, código o subcategoría..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={Search}
            />
          </div>

          <select
            className="input"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">Todas las categorías</option>
            {categories.map((cat) => (
              <option key={cat.key} value={cat.key}>
                {cat.label}
              </option>
            ))}
          </select>

          <select
            className="input"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Todos los estados</option>
            {Object.entries(STATUS_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>

          <div className="view-toggle">
            <Button
              variant={viewMode === "grid" ? "primary" : "ghost"}
              icon={Grid}
              onClick={() => setViewMode("grid")}
            />
            <Button
              variant={viewMode === "list" ? "primary" : "ghost"}
              icon={List}
              onClick={() => setViewMode("list")}
            />
          </div>
        </div>

        {filteredMaterials.length === 0 ? (
          <Card>
            <p className="empty-state">No se encontraron materiales</p>
          </Card>
        ) : (
          <div className={`materials-${viewMode}`}>
            {filteredMaterials.map((material) => (
              <Card key={material.id} className="material-card" hover>
                <div className="material-header">
                  <div>
                    <h3>{material.name}</h3>
                    <p className="material-code">{material.code}</p>
                  </div>
                  <Badge variant={material.status}>
                    {STATUS_LABELS[material.status]}
                  </Badge>
                </div>

                <div className="material-info">
                  <div className="material-info-item">
                    <span className="label">Categoría:</span>
                    <span>
                      {categories.find((c) => c.key === material.category)
                        ?.label || material.category}
                    </span>
                  </div>
                  {material.subcategory && (
                    <div className="material-info-item">
                      <span className="label">Subcategoría:</span>
                      <span>{material.subcategory}</span>
                    </div>
                  )}
                  <div className="material-info-item">
                    <span className="label">Ubicación:</span>
                    <span>{material.location}</span>
                  </div>
                  <div className="material-info-item">
                    <span className="label">Disponible:</span>
                    <span className="quantity-highlight">
                      {material.quantity || 0}
                    </span>
                  </div>
                </div>

                <div className="material-actions">
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Edit}
                    onClick={() => {
                      if (isGuest) {
                        toast.info("👁️ Versión Demo: Edición no disponible");
                      } else {
                        handleEdit(material);
                      }
                    }}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Trash2}
                    onClick={() => {
                      if (isGuest || !isAdmin) {
                        toast.info(
                          "🗑️ Versión Demo: Solo los administradores pueden eliminar materiales"
                        );
                      } else {
                        handleDelete(material.id);
                      }
                    }}
                  >
                    Eliminar
                  </Button>
                  {isGuest && (
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={Trash2}
                      onClick={() =>
                        toast.info("👁️ Versión Demo: Eliminación no disponible")
                      }
                    >
                      Eliminar
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Material Modal */}
        <Modal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            resetForm();
          }}
          title={editingMaterial ? "Editar Material" : "Nuevo Material"}
          size="lg"
        >
          <form onSubmit={handleSubmit} className="material-form">
            {/* Sección: Información Básica */}
            <div className="form-section">
              <h3 className="form-section-title">Información Básica</h3>
              <div className="form-row">
                <div className="form-col-full">
                  <Input
                    label="Nombre"
                    name="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-col-2">
                  <Input
                    label="Código"
                    name="code"
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({ ...formData, code: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-col-1">
                  <Button
                    type="button"
                    variant="ghost"
                    icon={Camera}
                    onClick={() => setShowScanner(true)}
                    title="Escanear código de barras"
                    className="scanner-button"
                  >
                    Escanear
                  </Button>
                </div>
              </div>
            </div>

            {/* Sección: Clasificación */}
            <div className="form-section">
              <h3 className="form-section-title">Clasificación</h3>
              <div className="form-row">
                <div className="form-col-2">
                  <div className="input-group">
                    <label className="input-label">Categoría *</label>
                    <select
                      className="input"
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      required
                    >
                      {categories.map((cat) => (
                        <option key={cat.key} value={cat.key}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="form-col-2">
                  <Input
                    label="Subcategoría"
                    name="subcategory"
                    value={formData.subcategory}
                    onChange={(e) =>
                      setFormData({ ...formData, subcategory: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Sección: Cantidades */}
            <div className="form-section">
              <h3 className="form-section-title">Inventario</h3>
              <div className="form-row">
                <div className="form-col-3">
                  <Input
                    label="Cantidad Disponible"
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        quantity: parseInt(e.target.value) || 0,
                      })
                    }
                    min="0"
                  />
                </div>
                <div className="form-col-3">
                  <Input
                    label="Cantidad Comprometida"
                    type="number"
                    name="quantityCommitted"
                    value={formData.quantityCommitted}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        quantityCommitted: parseInt(e.target.value) || 0,
                      })
                    }
                    min="0"
                  />
                </div>
                <div className="form-col-3">
                  <Input
                    label="En Mantenimiento"
                    type="number"
                    name="quantityMaintenance"
                    value={formData.quantityMaintenance}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        quantityMaintenance: parseInt(e.target.value) || 0,
                      })
                    }
                    min="0"
                  />
                </div>
              </div>
            </div>

            {/* Sección: Estado y Ubicación */}
            <div className="form-section">
              <h3 className="form-section-title">Estado y Ubicación</h3>
              <div className="form-row">
                <div className="form-col-2">
                  <Input
                    label="Ubicación"
                    name="location"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                  />
                </div>
                <div className="form-col-2">
                  <div className="input-group">
                    <label className="input-label">Estado</label>
                    <select
                      className="input"
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                      }
                    >
                      {Object.entries(STATUS_LABELS).map(([key, label]) => (
                        <option key={key} value={key}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Sección: Observaciones */}
            <div className="form-section">
              <h3 className="form-section-title">Observaciones</h3>
              <Input
                label="Notas adicionales"
                type="textarea"
                name="notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                rows={3}
              />
            </div>

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
                {editingMaterial ? "Actualizar" : "Crear"} Material
              </Button>
            </div>
          </form>
        </Modal>

        {/* Barcode Scanner */}
        {showScanner && (
          <BarcodeScanner
            onScan={handleBarcodeScanned}
            onClose={() => setShowScanner(false)}
          />
        )}
      </div>
    </Layout>
  );
};

export default Materiales;
