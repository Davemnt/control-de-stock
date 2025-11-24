import React, { useState, useEffect } from 'react';
import {
  Package,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Activity
} from 'lucide-react';
import { collection, query, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../../firebase';
import { COLLECTIONS, STOCK_THRESHOLDS } from '../../constants';
import Layout from '../../components/Layout/Layout';
import Card from '../../components/Card/Card';
import Badge from '../../components/Badge/Badge';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalMaterials: 0,
    totalStock: 0,
    lowStock: 0,
    inMaintenance: 0
  });
  const [recentMovements, setRecentMovements] = useState([]);
  const [criticalMaterials, setCriticalMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Load materials
      const materialsSnapshot = await getDocs(collection(db, COLLECTIONS.MATERIALS));
      const materials = materialsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Calculate stats
      const totalMaterials = materials.length;
      const totalStock = materials.reduce((sum, mat) => sum + (mat.quantity || 0), 0);
      const lowStock = materials.filter(mat => mat.quantity <= STOCK_THRESHOLDS.LOW).length;
      const inMaintenance = materials.filter(mat => 
        mat.status === 'mantenimiento' || mat.status === 'reparacion'
      ).length;

      setStats({ totalMaterials, totalStock, lowStock, inMaintenance });

      // Critical materials (stock bajo)
      const critical = materials
        .filter(mat => mat.quantity <= STOCK_THRESHOLDS.CRITICAL)
        .sort((a, b) => a.quantity - b.quantity)
        .slice(0, 5);
      setCriticalMaterials(critical);

      // Load recent movements
      const movementsQuery = query(
        collection(db, COLLECTIONS.MOVEMENTS),
        orderBy('createdAt', 'desc'),
        limit(5)
      );
      const movementsSnapshot = await getDocs(movementsQuery);
      const movements = movementsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRecentMovements(movements);

    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="dashboard-loading">
          <div className="spinner"></div>
          <p>Cargando dashboard...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="dashboard">
        <div className="dashboard-header">
          <h1>Dashboard</h1>
          <p>Resumen general del inventario</p>
        </div>

        <div className="dashboard-stats">
          <Card className="stat-card" hover>
            <div className="stat-icon stat-primary">
              <Package size={32} />
            </div>
            <div className="stat-content">
              <p className="stat-label">Total Materiales</p>
              <h2 className="stat-value">{stats.totalMaterials}</h2>
            </div>
          </Card>

          <Card className="stat-card" hover>
            <div className="stat-icon stat-success">
              <TrendingUp size={32} />
            </div>
            <div className="stat-content">
              <p className="stat-label">Stock Total</p>
              <h2 className="stat-value">{stats.totalStock}</h2>
            </div>
          </Card>

          <Card className="stat-card" hover>
            <div className="stat-icon stat-warning">
              <AlertTriangle size={32} />
            </div>
            <div className="stat-content">
              <p className="stat-label">Stock Bajo</p>
              <h2 className="stat-value">{stats.lowStock}</h2>
            </div>
          </Card>

          <Card className="stat-card" hover>
            <div className="stat-icon stat-info">
              <Activity size={32} />
            </div>
            <div className="stat-content">
              <p className="stat-label">En Mantenimiento</p>
              <h2 className="stat-value">{stats.inMaintenance}</h2>
            </div>
          </Card>
        </div>

        <div className="dashboard-grid">
          <Card title="Materiales Críticos" subtitle="Stock bajo - requiere atención">
            {criticalMaterials.length === 0 ? (
              <p className="empty-state">No hay materiales críticos</p>
            ) : (
              <div className="critical-list">
                {criticalMaterials.map(material => (
                  <div key={material.id} className="critical-item">
                    <div>
                      <p className="critical-name">{material.name}</p>
                      <p className="critical-code">{material.code}</p>
                    </div>
                    <Badge variant="error">{material.quantity} unidades</Badge>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card title="Últimos Movimientos" subtitle="Actividad reciente">
            {recentMovements.length === 0 ? (
              <p className="empty-state">No hay movimientos registrados</p>
            ) : (
              <div className="movements-list">
                {recentMovements.map(movement => (
                  <div key={movement.id} className="movement-item">
                    <div className="movement-info">
                      <p className="movement-material">{movement.materialName}</p>
                      <p className="movement-details">
                        {movement.type} • {movement.quantity} unidades
                      </p>
                    </div>
                    <Badge variant={movement.type === 'entrada' ? 'success' : 'info'}>
                      {movement.type}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
