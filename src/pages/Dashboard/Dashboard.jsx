import React, { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Package,
  Boxes,
  Wrench,
  AlertTriangle,
  ArrowDownLeft,
  ArrowUpRight,
  ArrowLeftRight,
  Plus,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useCategories, useMaterials, useMovements } from "../../hooks/useFirestore";
import { MOVEMENT_LABELS } from "../../constants";
import { formatNumber } from "../../utils";
import { formatRelativeTime } from "../../utils/formatters";
import { getCategoryVisual } from "../../utils/categoryVisual";
import {
  getMovementDirection,
  getMovementUser,
  getStock,
  getStockLevel,
  toDate,
} from "../../utils/stock";
import Layout from "../../components/Layout/Layout";
import Card from "../../components/Card/Card";
import Badge from "../../components/Badge/Badge";
import Button from "../../components/Button/Button";
import PageHeader from "../../components/PageHeader/PageHeader";
import EmptyState from "../../components/EmptyState/EmptyState";
import Loader from "../../components/Loader/Loader";
import "./Dashboard.css";

const DIRECTION_ICONS = { in: ArrowDownLeft, out: ArrowUpRight, neutral: ArrowLeftRight };

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Buenos días";
  if (h < 20) return "Buenas tardes";
  return "Buenas noches";
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { userData, isGuest } = useAuth();
  const { materials, loading: loadingMaterials } = useMaterials();
  const { movements: latestMovements, loading: loadingMovements } = useMovements(12);
  const movements = useMemo(
    () => latestMovements.filter((m) => !m.voided).slice(0, 8),
    [latestMovements]
  );
  const { categories, getLabel } = useCategories();

  const stats = useMemo(() => {
    let available = 0;
    let committed = 0;
    let maintenance = 0;
    let low = 0;
    let out = 0;
    materials.forEach((m) => {
      const s = getStock(m);
      available += s.available;
      committed += s.committed;
      maintenance += s.maintenance;
      const level = getStockLevel(m);
      if (level === "low") low += 1;
      if (level === "out") out += 1;
    });
    return { available, committed, maintenance, low, out };
  }, [materials]);

  const attention = useMemo(
    () =>
      materials
        .filter((m) => getStockLevel(m) !== "ok")
        .sort((a, b) => getStock(a).available - getStock(b).available)
        .slice(0, 6),
    [materials]
  );

  const byCategory = useMemo(() => {
    const map = new Map();
    materials.forEach((m) => {
      const key = m.category || "—";
      const row = map.get(key) || { key, count: 0, units: 0 };
      row.count += 1;
      row.units += getStock(m).available;
      map.set(key, row);
    });
    return [...map.values()].sort((a, b) => b.count - a.count);
  }, [materials]);

  if (loadingMaterials || loadingMovements) {
    return (
      <Layout>
        <Loader text="Cargando dashboard..." />
      </Layout>
    );
  }

  const firstName = (userData?.name || "").split(" ")[0];
  const today = new Date().toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const tiles = [
    {
      label: "Materiales",
      value: materials.length,
      hint: `${categories.length} categorías`,
      icon: Package,
      tone: "brand",
      to: "/materiales",
    },
    {
      label: "Unidades disponibles",
      value: stats.available,
      hint: `${formatNumber(stats.committed)} en uso`,
      icon: Boxes,
      tone: "success",
      to: "/materiales",
    },
    {
      label: "En mantenimiento",
      value: stats.maintenance,
      hint: "unidades en reparación",
      icon: Wrench,
      tone: "info",
      to: "/materiales?stock=maintenance",
    },
    {
      label: "Alertas de stock",
      value: stats.low + stats.out,
      hint: `${stats.out} sin stock · ${stats.low} bajo`,
      icon: AlertTriangle,
      tone: stats.low + stats.out > 0 ? "warning" : "neutral",
      to: "/materiales?stock=alert",
    },
  ];

  return (
    <Layout>
      <div className="page dashboard">
        <PageHeader
          title={`${getGreeting()}${firstName ? `, ${firstName}` : ""}`}
          subtitle={today.charAt(0).toUpperCase() + today.slice(1)}
          actions={
            !isGuest && (
              <Button icon={Plus} onClick={() => navigate("/movimientos?nuevo=1")}>
                Registrar movimiento
              </Button>
            )
          }
        />

        <div className="stat-grid">
          {tiles.map(({ label, value, hint, icon: Icon, tone, to }) => (
            <Link key={label} to={to} className={`stat-tile tone-${tone}`}>
              <div className="stat-tile-top">
                <span className="stat-tile-label">{label}</span>
                <span className="stat-tile-icon">
                  <Icon size={18} />
                </span>
              </div>
              <span className="stat-tile-value">{formatNumber(value)}</span>
              <span className="stat-tile-hint">{hint}</span>
            </Link>
          ))}
        </div>

        <div className="dashboard-grid">
          <Card
            title="Requieren atención"
            subtitle="Materiales sin stock o con stock bajo"
            actions={
              attention.length > 0 && (
                <Link to="/materiales?stock=alert" className="card-link">
                  Ver todos <ChevronRight size={14} />
                </Link>
              )
            }
          >
            {attention.length === 0 ? (
              <EmptyState
                compact
                icon={CheckCircle2}
                title="Todo en orden"
                description="Ningún material está por debajo del mínimo."
              />
            ) : (
              <ul className="dash-list">
                {attention.map((m) => {
                  const level = getStockLevel(m);
                  const { icon: CatIcon, style } = getCategoryVisual(m.category);
                  return (
                    <li key={m.id}>
                      <Link to={`/materiales?ver=${m.id}`} className="dash-row">
                        <span className="activity-icon cat-tint" style={style}>
                          <CatIcon size={16} />
                        </span>
                        <div className="dash-row-main">
                          <span className="dash-row-title">{m.name}</span>
                          <span className="dash-row-sub">
                            {m.code} · {getLabel(m.category)}
                          </span>
                        </div>
                        <Badge variant={level === "out" ? "error" : "warning"} dot>
                          {level === "out" ? "Sin stock" : `${getStock(m).available} disp.`}
                        </Badge>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </Card>

          <Card
            title="Actividad reciente"
            subtitle="Últimos movimientos registrados"
            actions={
              movements.length > 0 && (
                <Link to="/historial" className="card-link">
                  Historial <ChevronRight size={14} />
                </Link>
              )
            }
          >
            {movements.length === 0 ? (
              <EmptyState
                compact
                icon={ArrowLeftRight}
                title="Sin movimientos todavía"
                description="Aquí verás las entradas y salidas a medida que se registren."
              />
            ) : (
              <ul className="dash-list">
                {movements.map((mv) => {
                  const dir = getMovementDirection(mv.type);
                  const Icon = DIRECTION_ICONS[dir];
                  const date = toDate(mv.createdAt);
                  return (
                    <li key={mv.id} className="dash-row">
                      <span className={`activity-icon dir-${dir}`}>
                        <Icon size={16} />
                      </span>
                      <div className="dash-row-main">
                        <span className="dash-row-title">{mv.materialName}</span>
                        <span className="dash-row-sub">
                          {MOVEMENT_LABELS[mv.type] || mv.type} · {getMovementUser(mv)}
                          {date && ` · ${formatRelativeTime(date)}`}
                        </span>
                      </div>
                      <span className={`activity-qty dir-${dir}`}>
                        {dir === "in" ? "+" : dir === "out" ? "−" : ""}
                        {mv.quantity}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </Card>
        </div>

        <Card title="Inventario por categoría" padding="none">
          {byCategory.length === 0 ? (
            <EmptyState
              compact
              icon={Package}
              title="Aún no hay materiales"
              action={
                <Button variant="secondary" onClick={() => navigate("/materiales")}>
                  Ir al inventario
                </Button>
              }
            />
          ) : (
            <div className="category-table">
              <table className="table">
                <thead>
                  <tr>
                    <th>Categoría</th>
                    <th className="num">Materiales</th>
                    <th className="num">Unidades disponibles</th>
                  </tr>
                </thead>
                <tbody>
                  {byCategory.map((row) => (
                    <tr
                      key={row.key}
                      className="clickable"
                      onClick={() =>
                        navigate(`/materiales?categoria=${encodeURIComponent(row.key)}`)
                      }
                    >
                      <td>{getLabel(row.key)}</td>
                      <td className="num">{formatNumber(row.count)}</td>
                      <td className="num">{formatNumber(row.units)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;
