import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Filter,
  Grid,
  List,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';
import {
  collection,
  query,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import { COLLECTIONS, CATEGORIES, CATEGORY_LABELS, STATUS_LABELS } from '../../constants';
import Layout from '../../components/Layout/Layout';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import Badge from '../../components/Badge/Badge';
import Modal from '../../components/Modal/Modal';
import toast from 'react-hot-toast';
import './Materiales.css';

const Materiales = () => {
  const { userData, isAdmin, isUser } = useAuth();
  const [materials, setMaterials] = useState([]);
  const [filteredMaterials, setFilteredMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    category: CATEGORIES.AUDIO,
    subcategory: '',
    quantity: 0,
    quantityCommitted: 0,
    quantityMaintenance: 0,
    location: 'Depósito Principal',
    status: 'operativo',
    notes: ''
  });

  useEffect(() => {
    loadMaterials();
  }, []);

  useEffect(() => {
    filterMaterials();
  }, [materials, searchTerm, categoryFilter, statusFilter]);

  const loadMaterials = async () => {
    try {
      const materialsSnapshot = await getDocs(collection(db, COLLECTIONS.MATERIALS));
      const materialsData = materialsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMaterials(materialsData);
    } catch (error) {
      console.error('Error loading materials:', error);
      toast.error('Error al cargar materiales');
    } finally {
      setLoading(false);
    }
  };

  const filterMaterials = () => {
    let filtered = [...materials];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(mat =>
        mat.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mat.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mat.subcategory?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(mat => mat.category === categoryFilter);
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(mat => mat.status === statusFilter);
    }

    setFilteredMaterials(filtered);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.code) {
      toast.error('Nombre y código son obligatorios');
      return;
    }

    try {
      if (editingMaterial) {
        // Update
        await updateDoc(doc(db, COLLECTIONS.MATERIALS, editingMaterial.id), {
          ...formData,
          updatedAt: serverTimestamp()
        });
        toast.success('Material actualizado');
      } else {
        // Create
        await addDoc(collection(db, COLLECTIONS.MATERIALS), {
          ...formData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          createdBy: userData.uid
        });
        toast.success('Material creado');
      }

      setShowModal(false);
      resetForm();
      loadMaterials();
    } catch (error) {
      console.error('Error saving material:', error);
      toast.error('Error al guardar material');
    }
  };

  const handleEdit = (material) => {
    setEditingMaterial(material);
    setFormData({
      name: material.name || '',
      code: material.code || '',
      category: material.category || CATEGORIES.AUDIO,
      subcategory: material.subcategory || '',
      quantity: material.quantity || 0,
      quantityCommitted: material.quantityCommitted || 0,
      quantityMaintenance: material.quantityMaintenance || 0,
      location: material.location || 'Depósito Principal',
      status: material.status || 'operativo',
      notes: material.notes || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este material?')) {
      return;
    }

    try {
      await deleteDoc(doc(db, COLLECTIONS.MATERIALS, id));
      toast.success('Material eliminado');
      loadMaterials();
    } catch (error) {
      console.error('Error deleting material:', error);
      toast.error('Error al eliminar material');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      category: CATEGORIES.AUDIO,
      subcategory: '',
      quantity: 0,
      quantityCommitted: 0,
      quantityMaintenance: 0,
      location: 'Depósito Principal',
      status: 'operativo',
      notes: ''
    });
    setEditingMaterial(null);
  };

  const handleNewMaterial = () => {
    resetForm();
    setShowModal(true);
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
          {(isAdmin || isUser) && (
            <Button
              variant="primary"
              icon={Plus}
              onClick={handleNewMaterial}
            >
              Nuevo Material
            </Button>
          )}
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
            {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>

          <select
            className="input"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Todos los estados</option>
            {Object.entries(STATUS_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>

          <div className="view-toggle">
            <Button
              variant={viewMode === 'grid' ? 'primary' : 'ghost'}
              icon={Grid}
              onClick={() => setViewMode('grid')}
            />
            <Button
              variant={viewMode === 'list' ? 'primary' : 'ghost'}
              icon={List}
              onClick={() => setViewMode('list')}
            />
          </div>
        </div>

        {filteredMaterials.length === 0 ? (
          <Card>
            <p className="empty-state">No se encontraron materiales</p>
          </Card>
        ) : (
          <div className={`materials-${viewMode}`}>
            {filteredMaterials.map(material => (
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
                    <span>{CATEGORY_LABELS[material.category]}</span>
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
                    <span className="quantity-highlight">{material.quantity || 0}</span>
                  </div>
                </div>

                {(isAdmin || isUser) && (
                  <div className="material-actions">
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={Edit}
                      onClick={() => handleEdit(material)}
                    >
                      Editar
                    </Button>
                    {isAdmin && (
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={Trash2}
                        onClick={() => handleDelete(material.id)}
                      >
                        Eliminar
                      </Button>
                    )}
                  </div>
                )}
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
          title={editingMaterial ? 'Editar Material' : 'Nuevo Material'}
          size="lg"
        >
          <form onSubmit={handleSubmit} className="material-form">
            <div className="form-grid">
              <Input
                label="Nombre"
                name="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />

              <Input
                label="Código"
                name="code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                required
              />

              <div className="input-group">
                <label className="input-label">Categoría *</label>
                <select
                  className="input"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                >
                  {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>

              <Input
                label="Subcategoría"
                name="subcategory"
                value={formData.subcategory}
                onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
              />

              <Input
                label="Cantidad Disponible"
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                min="0"
              />

              <Input
                label="Cantidad Comprometida"
                type="number"
                name="quantityCommitted"
                value={formData.quantityCommitted}
                onChange={(e) => setFormData({ ...formData, quantityCommitted: parseInt(e.target.value) || 0 })}
                min="0"
              />

              <Input
                label="En Mantenimiento"
                type="number"
                name="quantityMaintenance"
                value={formData.quantityMaintenance}
                onChange={(e) => setFormData({ ...formData, quantityMaintenance: parseInt(e.target.value) || 0 })}
                min="0"
              />

              <Input
                label="Ubicación"
                name="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />

              <div className="input-group">
                <label className="input-label">Estado</label>
                <select
                  className="input"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  {Object.entries(STATUS_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
            </div>

            <Input
              label="Observaciones"
              type="textarea"
              name="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={4}
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
                {editingMaterial ? 'Actualizar' : 'Crear'} Material
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </Layout>
  );
};

export default Materiales;
