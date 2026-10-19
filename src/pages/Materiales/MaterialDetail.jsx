import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeftRight, Edit, FileDown, QrCode } from "lucide-react";
import { collection, getDocs, query, where } from "firebase/firestore";
import toast from "react-hot-toast";
import { db } from "../../firebase";
import { useAuth } from "../../contexts/AuthContext";
import { COLLECTIONS, MOVEMENT_LABELS, STATUS_LABELS, STOCK_THRESHOLDS } from "../../constants";
import { formatDateTime } from "../../utils/formatters";
import { getCategoryVisual } from "../../utils/categoryVisual";
import {
  getMovementUser,
  getMovementVariant,
  getStock,
  getStockLevel,
  STOCK_LEVEL_LABELS,
  toDate,
} from "../../utils/stock";
import Modal from "../../components/Modal/Modal";
import Button from "../../components/Button/Button";
import Badge from "../../components/Badge/Badge";
import EmptyState from "../../components/EmptyState/EmptyState";
import LabelsDialog from "../../components/LabelsDialog/LabelsDialog";

const LEVEL_VARIANT = { out: "error", low: "warning", ok: "success" };

const MaterialDetail = ({ material, categoryLabel, onClose, onEdit }) => {
  const navigate = useNavigate();
  const { isAdmin, isGuest } = useAuth();
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLabel, setShowLabel] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        // Filtro por igualdad (no requiere índice compuesto); se ordena en el cliente
        const snap = await getDocs(
          query(collection(db, COLLECTIONS.MOVEMENTS), where("materialId", "==", material.id))
        );
        const list = snap.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .sort((a, b) => (toDate(b.createdAt) || 0) - (toDate(a.createdAt) || 0));
        if (!cancelled) setMovements(list);
      } catch (error) {
        console.error("Error loading material movements:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [material.id]);

  const stock = getStock(material);
  const { icon: CategoryIcon, style: categoryStyle } = getCategoryVisual(material.category);
  const level = getStockLevel(material);

  const handleReport = async () => {
    try {
      const { exportMaterialReportPDF } = await import("../../utils/pdfExport");
      exportMaterialReportPDF(
        { ...material, category: categoryLabel },
        movements.map((m) => ({
          ...m,
          type: `${MOVEMENT_LABELS[m.type] || m.type}${m.voided ? " (anulado)" : ""}`,
        }))
      );
      toast.success("Reporte generado");
    } catch (error) {
      console.error(error);
      toast.error("No se pudo generar el PDF");
    }
  };

  const info = [
    ["Categoría", categoryLabel],
    ["Subcategoría", material.subcategory || "—"],
    ["Ubicación", material.location || "—"],
    ["Stock mínimo", material.minStock ?? `${STOCK_THRESHOLDS.LOW} (por defecto)`],
    ["Creado por", material.createdByName || "—"],
    ["Alta", formatDateTime(toDate(material.createdAt))],
    ["Última modificación", formatDateTime(toDate(material.updatedAt))],
  ];

  return (
    <>
    <Modal
      isOpen
      onClose={onClose}
      title={material.name}
      subtitle={material.code}
      size="lg"
      footer={
        <>
          <Button variant="secondary" icon={QrCode} onClick={() => setShowLabel(true)}>
            Etiqueta
          </Button>
          <Button variant="secondary" icon={FileDown} onClick={handleReport} disabled={loading}>
            Reporte PDF
          </Button>
          {isAdmin && (
            <Button variant="secondary" icon={Edit} onClick={onEdit}>
              Editar
            </Button>
          )}
          {!isGuest && (
            <Button
              icon={ArrowLeftRight}
              onClick={() => navigate(`/movimientos?nuevo=1&material=${material.id}`)}
            >
              Registrar movimiento
            </Button>
          )}
        </>
      }
    >
      <div className="detail">
        <div className="detail-media">
          {material.imageUrl ? (
            <img src={material.imageUrl} alt={material.name} />
          ) : (
            <div className="detail-media-empty cat-tint" style={categoryStyle}>
              <CategoryIcon size={40} strokeWidth={1.5} />
              <span>{categoryLabel}</span>
            </div>
          )}
        </div>

        <div className="detail-main">
          <div className="detail-badges">
            <Badge variant={material.status}>{STATUS_LABELS[material.status] || material.status}</Badge>
            <Badge variant={LEVEL_VARIANT[level]} dot>
              {STOCK_LEVEL_LABELS[level]}
            </Badge>
          </div>

          <div className="stock-trio">
            <div>
              <span className="stock-trio-value">{stock.available}</span>
              <span className="stock-trio-label">Disponible</span>
            </div>
            <div>
              <span className="stock-trio-value">{stock.committed}</span>
              <span className="stock-trio-label">En uso</span>
            </div>
            <div>
              <span className="stock-trio-value">{stock.maintenance}</span>
              <span className="stock-trio-label">Mantenimiento</span>
            </div>
          </div>

          <dl className="detail-info">
            {info.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {material.notes && (
        <div className="detail-notes">
          <p className="form-section-title">Observaciones</p>
          <p>{material.notes}</p>
        </div>
      )}

      <div className="detail-history">
        <p className="form-section-title">Últimos movimientos</p>
        {loading ? (
          <div className="detail-history-loading">
            <div className="spinner" />
          </div>
        ) : movements.length === 0 ? (
          <EmptyState compact icon={ArrowLeftRight} title="Sin movimientos registrados" />
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Tipo</th>
                  <th className="num">Cant.</th>
                  <th className="num">Stock</th>
                  <th>Usuario</th>
                </tr>
              </thead>
              <tbody>
                {movements.slice(0, 10).map((mv) => (
                  <tr key={mv.id} className={mv.voided ? "is-voided" : ""}>
                    <td className="text-secondary">{formatDateTime(toDate(mv.createdAt))}</td>
                    <td>
                      <Badge size="sm" variant={getMovementVariant(mv.type)}>
                        {MOVEMENT_LABELS[mv.type] || mv.type}
                      </Badge>
                      {mv.voided && (
                        <Badge size="sm" variant="error" className="voided-badge">
                          Anulado
                        </Badge>
                      )}
                    </td>
                    <td className="num">{mv.quantity}</td>
                    <td className="num text-secondary">
                      {mv.previousQuantity} → <strong>{mv.newQuantity}</strong>
                    </td>
                    <td className="text-secondary">{getMovementUser(mv)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Modal>

    {showLabel && (
      <LabelsDialog
        materials={[material]}
        getCategoryLabel={() => categoryLabel}
        onClose={() => setShowLabel(false)}
      />
    )}
    </>
  );
};

export default MaterialDetail;
