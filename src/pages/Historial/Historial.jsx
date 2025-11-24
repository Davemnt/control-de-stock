import React, { useState, useEffect } from 'react';
import { Search, Filter, Download } from 'lucide-react';
import {
  collection,
  query,
  getDocs,
  where,
  orderBy
} from 'firebase/firestore';
import { db } from '../../firebase';
import { COLLECTIONS, MOVEMENT_LABELS } from '../../constants';
import { formatDateTime } from '../../utils/formatters';
import Layout from '../../components/Layout/Layout';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import Badge from '../../components/Badge/Badge';
import toast from 'react-hot-toast';
import './Historial.css';

const Historial = () => {
  const [movements, setMovements] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [filteredMovements, setFilteredMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterMovements();
  }, [movements, searchTerm, selectedMaterial, selectedType]);

  const loadData = async () => {
    try {
      // Load materials
      const materialsSnapshot = await getDocs(collection(db, COLLECTIONS.MATERIALS));
      const materialsData = materialsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMaterials(materialsData);

      // Load all movements
      const movementsQuery = query(
        collection(db, COLLECTIONS.MOVEMENTS),
        orderBy('createdAt', 'desc')
      );
      const movementsSnapshot = await getDocs(movementsQuery);
      const movementsData = movementsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMovements(movementsData);
    } catch (error) {
      console.error('Error loading history:', error);
      toast.error('Error al cargar historial');
    } finally {
      setLoading(false);
    }
  };

  const filterMovements = () => {
    let filtered = [...movements];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(mov =>
        mov.materialName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mov.materialCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mov.reason?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mov.userName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Material filter
    if (selectedMaterial !== 'all') {
      filtered = filtered.filter(mov => mov.materialId === selectedMaterial);
    }

    // Type filter
    if (selectedType !== 'all') {
      filtered = filtered.filter(mov => mov.type === selectedType);
    }

    setFilteredMovements(filtered);
  };

  const exportToCSV = () => {
    if (filteredMovements.length === 0) {
      toast.error('No hay datos para exportar');
      return;
    }

    const headers = ['Fecha', 'Material', 'Código', 'Tipo', 'Cantidad', 'Stock Anterior', 'Stock Nuevo', 'Motivo', 'Proyecto', 'Usuario'];
    const rows = filteredMovements.map(mov => [
      formatDateTime(mov.createdAt?.toDate?.() || new Date()),
      mov.materialName,
      mov.materialCode,
      MOVEMENT_LABELS[mov.type],
      mov.quantity,
      mov.previousQuantity,
      mov.newQuantity,
      mov.reason || '-',
      mov.project || '-',
      mov.userName || '-'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `historial_stock_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    toast.success('Historial exportado');
  };

  if (loading) {
    return (
      <Layout>
        <div className="historial-loading">
          <div className="spinner"></div>
          <p>Cargando historial...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="historial">
        <div className="historial-header">
          <div>
            <h1>Historial Completo</h1>
            <p>{filteredMovements.length} registros</p>
          </div>
          <Button
            variant="primary"
            icon={Download}
            onClick={exportToCSV}
          >
            Exportar CSV
          </Button>
        </div>

        <div className="historial-filters">
          <Input
            placeholder="Buscar por material, código, motivo o usuario..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={Search}
          />

          <select
            className="input"
            value={selectedMaterial}
            onChange={(e) => setSelectedMaterial(e.target.value)}
          >
            <option value="all">Todos los materiales</option>
            {materials.map(mat => (
              <option key={mat.id} value={mat.id}>
                {mat.name} ({mat.code})
              </option>
            ))}
          </select>

          <select
            className="input"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="all">Todos los tipos</option>
            {Object.entries(MOVEMENT_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>

        {filteredMovements.length === 0 ? (
          <Card>
            <p className="empty-state">No se encontraron registros</p>
          </Card>
        ) : (
          <div className="historial-table-container">
            <table className="historial-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Material</th>
                  <th>Tipo</th>
                  <th>Cantidad</th>
                  <th>Stock Anterior</th>
                  <th>Stock Nuevo</th>
                  <th>Motivo</th>
                  <th>Usuario</th>
                </tr>
              </thead>
              <tbody>
                {filteredMovements.map(movement => (
                  <tr key={movement.id}>
                    <td className="date-cell">
                      {formatDateTime(movement.createdAt?.toDate?.() || new Date())}
                    </td>
                    <td>
                      <div className="material-cell">
                        <span className="material-name">{movement.materialName}</span>
                        <span className="material-code">{movement.materialCode}</span>
                      </div>
                    </td>
                    <td>
                      <Badge variant={
                        movement.type === 'entrada' || movement.type === 'devolucion' ? 'success' :
                        movement.type === 'salida' ? 'warning' : 'info'
                      }>
                        {MOVEMENT_LABELS[movement.type]}
                      </Badge>
                    </td>
                    <td className="quantity-cell">{movement.quantity}</td>
                    <td className="stock-cell">{movement.previousQuantity}</td>
                    <td className="stock-cell highlight">{movement.newQuantity}</td>
                    <td className="reason-cell">{movement.reason}</td>
                    <td className="user-cell">{movement.userName || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Historial;
