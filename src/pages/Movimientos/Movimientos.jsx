import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  TrendingUp,
  TrendingDown,
  ArrowRightLeft,
} from "lucide-react";
import {
  collection,
  query,
  getDocs,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
  orderBy,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../contexts/AuthContext";
import { COLLECTIONS, MOVEMENT_TYPES, MOVEMENT_LABELS } from "../../constants";
import { formatDateTime } from "../../utils/formatters";
import Layout from "../../components/Layout/Layout";
import Card from "../../components/Card/Card";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import Badge from "../../components/Badge/Badge";
import Modal from "../../components/Modal/Modal";
import toast from "react-hot-toast";
import "./Movimientos.css";

const Movimientos = () => {
  const { userData, isAdmin, isUser, currentUser } = useAuth();
  const [movements, setMovements] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [filteredMovements, setFilteredMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    materialId: "",
    type: MOVEMENT_TYPES.ENTRADA,
    quantity: 0,
    reason: "",
    project: "",
    notes: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterMovements();
  }, [movements, searchTerm]);

  const loadData = async () => {
    try {
      // Load materials
      const materialsSnapshot = await getDocs(
        collection(db, COLLECTIONS.MATERIALS)
      );
      const materialsData = materialsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMaterials(materialsData);

      // Load movements
      const movementsQuery = query(
        collection(db, COLLECTIONS.MOVEMENTS),
        orderBy("createdAt", "desc")
      );
      const movementsSnapshot = await getDocs(movementsQuery);
      const movementsData = movementsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMovements(movementsData);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Error al cargar datos");
    } finally {
      setLoading(false);
    }
  };

  const filterMovements = () => {
    let filtered = [...movements];

    if (searchTerm) {
      filtered = filtered.filter(
        (mov) =>
          mov.materialName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          mov.reason?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          mov.project?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredMovements(filtered);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.materialId || !formData.quantity || formData.quantity <= 0) {
      toast.error("Completa todos los campos requeridos");
      return;
    }

    try {
      const materialDoc = await getDoc(
        doc(db, COLLECTIONS.MATERIALS, formData.materialId)
      );
      if (!materialDoc.exists()) {
        toast.error("Material no encontrado");
        return;
      }

      const material = materialDoc.data();
      let newQuantity = material.quantity || 0;

      // Calculate new quantity based on movement type
      if (
        formData.type === MOVEMENT_TYPES.ENTRADA ||
        formData.type === MOVEMENT_TYPES.DEVOLUCION
      ) {
        newQuantity += parseInt(formData.quantity);
      } else if (formData.type === MOVEMENT_TYPES.SALIDA) {
        if (newQuantity < parseInt(formData.quantity)) {
          toast.error("Stock insuficiente");
          return;
        }
        newQuantity -= parseInt(formData.quantity);
      }

      // Create movement
      const movementData = {
        materialId: formData.materialId,
        materialName: material.name,
        materialCode: material.code || "",
        type: formData.type,
        quantity: parseInt(formData.quantity),
        reason: formData.reason,
        project: formData.project || "",
        notes: formData.notes || "",
        previousQuantity: material.quantity || 0,
        newQuantity: newQuantity,
        createdAt: serverTimestamp(),
        createdBy: currentUser?.uid || userData?.uid || "unknown",
        createdByName: userData?.name || "Usuario",
        fromLocation: material.location || "Sin ubicación",
        toLocation: material.location || "Sin ubicación",
      };

      await addDoc(collection(db, COLLECTIONS.MOVEMENTS), movementData);

      // Update material quantity
      await updateDoc(doc(db, COLLECTIONS.MATERIALS, formData.materialId), {
        quantity: newQuantity,
        updatedAt: serverTimestamp(),
      });

      toast.success("Movimiento registrado");
      setShowModal(false);
      resetForm();
      loadData();
    } catch (error) {
      console.error("Error creating movement:", error);
      toast.error("Error al registrar movimiento");
    }
  };

  const resetForm = () => {
    setFormData({
      materialId: "",
      type: MOVEMENT_TYPES.ENTRADA,
      quantity: 0,
      reason: "",
      project: "",
      notes: "",
    });
  };

  const getMovementIcon = (type) => {
    switch (type) {
      case MOVEMENT_TYPES.ENTRADA:
      case MOVEMENT_TYPES.DEVOLUCION:
        return TrendingUp;
      case MOVEMENT_TYPES.SALIDA:
        return TrendingDown;
      default:
        return ArrowRightLeft;
    }
  };

  const getMovementColor = (type) => {
    switch (type) {
      case MOVEMENT_TYPES.ENTRADA:
      case MOVEMENT_TYPES.DEVOLUCION:
        return "success";
      case MOVEMENT_TYPES.SALIDA:
        return "warning";
      default:
        return "info";
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="movements-loading">
          <div className="spinner"></div>
          <p>Cargando movimientos...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="movements">
        <div className="movements-header">
          <div>
            <h1>Movimientos de Stock</h1>
            <p>{filteredMovements.length} movimientos registrados</p>
          </div>
          {(isAdmin || isUser) && (
            <Button
              variant="primary"
              icon={Plus}
              onClick={() => setShowModal(true)}
            >
              Registrar Movimiento
            </Button>
          )}
        </div>

        <div className="movements-filters">
          <Input
            placeholder="Buscar por material, motivo o proyecto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={Search}
          />
        </div>

        {filteredMovements.length === 0 ? (
          <Card>
            <p className="empty-state">No se encontraron movimientos</p>
          </Card>
        ) : (
          <div className="movements-list">
            {filteredMovements.map((movement) => {
              const Icon = getMovementIcon(movement.type);
              const color = getMovementColor(movement.type);

              return (
                <Card key={movement.id} className="movement-card" hover>
                  <div className="movement-header">
                    <div className="movement-icon" data-color={color}>
                      <Icon size={24} />
                    </div>
                    <div className="movement-main">
                      <h3>{movement.materialName}</h3>
                      <p className="movement-code">{movement.materialCode}</p>
                    </div>
                    <Badge variant={color}>
                      {MOVEMENT_LABELS[movement.type]}
                    </Badge>
                  </div>

                  <div className="movement-details">
                    <div className="movement-detail-item">
                      <span className="label">Cantidad:</span>
                      <span className="value">
                        {movement.quantity} unidades
                      </span>
                    </div>
                    <div className="movement-detail-item">
                      <span className="label">Stock anterior:</span>
                      <span className="value">{movement.previousQuantity}</span>
                    </div>
                    <div className="movement-detail-item">
                      <span className="label">Stock nuevo:</span>
                      <span className="value highlight">
                        {movement.newQuantity}
                      </span>
                    </div>
                    {movement.reason && (
                      <div className="movement-detail-item">
                        <span className="label">Motivo:</span>
                        <span className="value">{movement.reason}</span>
                      </div>
                    )}
                    {movement.project && (
                      <div className="movement-detail-item">
                        <span className="label">Proyecto:</span>
                        <span className="value">{movement.project}</span>
                      </div>
                    )}
                  </div>

                  <div className="movement-footer">
                    <p className="movement-user">
                      {movement.userName || "Usuario"}
                    </p>
                    <p className="movement-date">
                      {formatDateTime(
                        movement.createdAt?.toDate?.() || new Date()
                      )}
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Movement Modal */}
        <Modal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            resetForm();
          }}
          title="Registrar Movimiento"
          size="md"
        >
          <form onSubmit={handleSubmit} className="movement-form">
            <div className="input-group">
              <label className="input-label">Material *</label>
              <select
                className="input"
                value={formData.materialId}
                onChange={(e) =>
                  setFormData({ ...formData, materialId: e.target.value })
                }
                required
              >
                <option value="">Seleccionar material...</option>
                {materials.map((mat) => (
                  <option key={mat.id} value={mat.id}>
                    {mat.name} ({mat.code}) - Stock: {mat.quantity}
                  </option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Tipo de Movimiento *</label>
              <select
                className="input"
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                required
              >
                {Object.entries(MOVEMENT_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Cantidad"
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={(e) =>
                setFormData({ ...formData, quantity: e.target.value })
              }
              min="1"
              required
            />

            <Input
              label="Motivo"
              name="reason"
              value={formData.reason}
              onChange={(e) =>
                setFormData({ ...formData, reason: e.target.value })
              }
              placeholder="Ej: Evento corporativo, Mantenimiento preventivo..."
              required
            />

            <Input
              label="Proyecto / Evento"
              name="project"
              value={formData.project}
              onChange={(e) =>
                setFormData({ ...formData, project: e.target.value })
              }
              placeholder="Opcional"
            />

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
                Registrar Movimiento
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </Layout>
  );
};

export default Movimientos;
