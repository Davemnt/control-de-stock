import React, { useEffect, useMemo, useState } from "react";
import { Search, FileDown, FileSpreadsheet, History, SearchX, X } from "lucide-react";
import toast from "react-hot-toast";
import { useMaterials, useMovements } from "../../hooks/useFirestore";
import { MOVEMENT_LABELS, MOVEMENT_TYPES } from "../../constants";
import { formatDateTime } from "../../utils/formatters";
import { exportToExcel } from "../../utils/exportExcel";
import {
  getMovementUser,
  getMovementVariant,
  normalize,
  toDate,
} from "../../utils/stock";
import Layout from "../../components/Layout/Layout";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import Badge from "../../components/Badge/Badge";
import PageHeader from "../../components/PageHeader/PageHeader";
import EmptyState from "../../components/EmptyState/EmptyState";
import Loader from "../../components/Loader/Loader";
import MovementDetail from "../../components/MovementDetail/MovementDetail";
import "./Historial.css";

const PAGE_SIZE = 50;

const Historial = () => {
  const { movements, loading: loadingMovements } = useMovements();
  const { materials, loading: loadingMaterials } = useMaterials();

  const [search, setSearch] = useState("");
  const [material, setMaterial] = useState("all");
  const [type, setType] = useState("all");
  const [user, setUser] = useState("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => setVisible(PAGE_SIZE), [search, material, type, user, from, to]);

  const users = useMemo(
    () => [...new Set(movements.map(getMovementUser))].filter((u) => u !== "—").sort(),
    [movements]
  );

  const filtered = useMemo(() => {
    const term = normalize(search.trim());
    const fromDate = from ? new Date(`${from}T00:00:00`) : null;
    const toDateLimit = to ? new Date(`${to}T23:59:59.999`) : null;

    return movements.filter((mv) => {
      if (material !== "all" && mv.materialId !== material) return false;
      if (type !== "all" && mv.type !== type) return false;
      if (user !== "all" && getMovementUser(mv) !== user) return false;
      const date = toDate(mv.createdAt);
      if (fromDate && (!date || date < fromDate)) return false;
      if (toDateLimit && (!date || date > toDateLimit)) return false;
      if (term) {
        const haystack = normalize(
          [mv.materialName, mv.materialCode, mv.reason, mv.project, mv.notes, getMovementUser(mv)].join(" ")
        );
        if (!haystack.includes(term)) return false;
      }
      return true;
    });
  }, [movements, search, material, type, user, from, to]);

  const hasFilters = search || material !== "all" || type !== "all" || user !== "all" || from || to;

  const clearFilters = () => {
    setSearch("");
    setMaterial("all");
    setType("all");
    setUser("all");
    setFrom("");
    setTo("");
  };

  const handleExcel = async () => {
    if (filtered.length === 0) return toast.error("No hay datos para exportar");
    try {
      await exportToExcel(
        filtered.map((mv) => ({
          Fecha: formatDateTime(toDate(mv.createdAt)),
          Material: mv.materialName || "",
          Código: mv.materialCode || "",
          Tipo: MOVEMENT_LABELS[mv.type] || mv.type,
          Cantidad: mv.quantity,
          "Stock anterior": mv.previousQuantity,
          "Stock nuevo": mv.newQuantity,
          Origen: mv.fromLocation || "",
          Destino: mv.toLocation || "",
          Motivo: mv.reason || "",
          Proyecto: mv.project || "",
          Notas: mv.notes || "",
          Usuario: getMovementUser(mv),
          Estado: mv.voided ? `Anulado: ${mv.voidReason || ""}` : "Válido",
        })),
        "historial-movimientos",
        "Historial"
      );
      toast.success("Excel generado");
    } catch (error) {
      console.error(error);
      toast.error("No se pudo generar el Excel");
    }
  };

  const handlePDF = async () => {
    if (filtered.length === 0) return toast.error("No hay datos para exportar");
    try {
      const { exportMovementsToPDF } = await import("../../utils/pdfExport");
      exportMovementsToPDF(
        filtered.map((mv) => ({
          ...mv,
          type: MOVEMENT_LABELS[mv.type] || mv.type,
          createdByName: getMovementUser(mv),
        }))
      );
      toast.success("PDF generado");
    } catch (error) {
      console.error(error);
      toast.error("No se pudo generar el PDF");
    }
  };

  if (loadingMovements || loadingMaterials) {
    return (
      <Layout>
        <Loader text="Cargando historial..." />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="page historial">
        <PageHeader
          title="Historial"
          subtitle={
            hasFilters
              ? `${filtered.length} de ${movements.length} registros`
              : `${movements.length} movimientos registrados`
          }
          actions={
            <>
              <Button variant="secondary" icon={FileSpreadsheet} onClick={handleExcel}>
                Excel
              </Button>
              <Button variant="secondary" icon={FileDown} onClick={handlePDF}>
                PDF
              </Button>
            </>
          }
        />

        <div className="historial-filters">
          <Input
            className="filter-search"
            name="search"
            label="Buscar"
            placeholder="Material, código, motivo, proyecto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={Search}
          />
          <Input type="select" label="Material" name="material" value={material} onChange={(e) => setMaterial(e.target.value)}>
            <option value="all">Todos</option>
            {materials.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} ({m.code})
              </option>
            ))}
          </Input>
          <Input type="select" label="Tipo" name="type" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="all">Todos</option>
            {Object.entries(MOVEMENT_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </Input>
          <Input type="select" label="Usuario" name="user" value={user} onChange={(e) => setUser(e.target.value)}>
            <option value="all">Todos</option>
            {users.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </Input>
          <Input type="date" label="Desde" name="from" value={from} max={to || undefined} onChange={(e) => setFrom(e.target.value)} />
          <Input type="date" label="Hasta" name="to" value={to} min={from || undefined} onChange={(e) => setTo(e.target.value)} />
          {hasFilters && (
            <Button variant="ghost" icon={X} onClick={clearFilters} className="filter-clear">
              Limpiar
            </Button>
          )}
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={movements.length ? SearchX : History}
            title={movements.length ? "Sin resultados" : "El historial está vacío"}
            description={
              movements.length
                ? "Ningún movimiento coincide con los filtros."
                : "Los movimientos de stock aparecerán aquí."
            }
            action={
              hasFilters && (
                <Button variant="secondary" onClick={clearFilters}>
                  Limpiar filtros
                </Button>
              )
            }
          />
        ) : (
          <>
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Material</th>
                    <th>Tipo</th>
                    <th className="num">Cantidad</th>
                    <th className="num">Stock</th>
                    <th>Motivo</th>
                    <th>Usuario</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.slice(0, visible).map((mv) => (
                    <tr
                      key={mv.id}
                      className={`clickable ${mv.voided ? "is-voided" : ""}`}
                      onClick={() => setSelectedId(mv.id)}
                    >
                      <td className="nowrap text-secondary">{formatDateTime(toDate(mv.createdAt))}</td>
                      <td>
                        <span className="cell-title">{mv.materialName}</span>
                        <span className="cell-sub mono">{mv.materialCode}</span>
                      </td>
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
                        {mv.type === MOVEMENT_TYPES.TRANSFERENCIA ? (
                          <span className="cell-sub">
                            {mv.fromLocation} → {mv.toLocation}
                          </span>
                        ) : (
                          <>
                            {mv.previousQuantity} → <strong>{mv.newQuantity}</strong>
                          </>
                        )}
                      </td>
                      <td className="reason-cell">
                        {mv.reason || "—"}
                        {mv.project && <span className="cell-sub">{mv.project}</span>}
                      </td>
                      <td className="nowrap">{getMovementUser(mv)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filtered.length > visible && (
              <div className="load-more">
                <Button variant="secondary" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
                  Mostrar más ({filtered.length - visible} restantes)
                </Button>
              </div>
            )}
          </>
        )}
      </div>
      {selectedId && movements.find((m) => m.id === selectedId) && (
        <MovementDetail
          movement={movements.find((m) => m.id === selectedId)}
          onClose={() => setSelectedId(null)}
        />
      )}
    </Layout>
  );
};

export default Historial;
