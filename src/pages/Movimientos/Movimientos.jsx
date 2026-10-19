import React, { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Plus,
  Search,
  ArrowDownLeft,
  ArrowUpRight,
  ArrowLeftRight,
  Undo2,
  Wrench,
  CheckCircle2,
  PackageMinus,
  PackageCheck,
  SearchX,
  X,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useMaterials, useMovements } from "../../hooks/useFirestore";
import { MOVEMENT_LABELS, MOVEMENT_TYPES } from "../../constants";
import { formatDateTime, formatRelativeTime } from "../../utils/formatters";
import {
  getMovementDirection,
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
import MovementForm from "./MovementForm";
import EventBatch from "./EventBatch";
import MovementDetail from "../../components/MovementDetail/MovementDetail";
import "./Movimientos.css";

const RECENT_LIMIT = 100;
const DIRECTION_ICONS = { in: ArrowDownLeft, out: ArrowUpRight, neutral: ArrowLeftRight };

const QUICK_ACTIONS = [
  { type: MOVEMENT_TYPES.SALIDA, icon: ArrowUpRight, tone: "warning", hint: "A evento o préstamo" },
  { type: MOVEMENT_TYPES.DEVOLUCION, icon: Undo2, tone: "success", hint: "Vuelve al depósito" },
  { type: MOVEMENT_TYPES.ENTRADA, icon: ArrowDownLeft, tone: "success", hint: "Compra o alta" },
  { type: MOVEMENT_TYPES.REPARACION, icon: Wrench, tone: "info", hint: "Al servicio técnico" },
  { type: MOVEMENT_TYPES.REPARADO, icon: CheckCircle2, tone: "info", hint: "Vuelve reparado" },
  { type: MOVEMENT_TYPES.TRANSFERENCIA, icon: ArrowLeftRight, tone: "neutral", hint: "Cambio de ubicación" },
];

const Movimientos = () => {
  const { isGuest } = useAuth();
  const { materials, loading: loadingMaterials } = useMaterials();
  const { movements, loading: loadingMovements } = useMovements(RECENT_LIMIT);
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedId, setSelectedId] = useState(null);

  const formOpen = searchParams.get("nuevo") === "1";

  const openForm = (type) => {
    const next = new URLSearchParams();
    next.set("nuevo", "1");
    if (type) next.set("tipo", type);
    setSearchParams(next);
  };

  const closeForm = () => setSearchParams({}, { replace: true });

  // Eventos en lote: ?lote=salida | ?lote=devolucion&evento=...
  const batchMode = { salida: "out", devolucion: "return" }[searchParams.get("lote")];
  const openBatch = (lote) => setSearchParams({ lote });

  const filtered = useMemo(() => {
    const term = normalize(search.trim());
    return movements.filter((mv) => {
      if (typeFilter !== "all" && mv.type !== typeFilter) return false;
      if (!term) return true;
      return normalize(
        [mv.materialName, mv.materialCode, mv.reason, mv.project, getMovementUser(mv)].join(" ")
      ).includes(term);
    });
  }, [movements, search, typeFilter]);

  if (loadingMaterials || loadingMovements) {
    return (
      <Layout>
        <Loader text="Cargando movimientos..." />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="page movements">
        <PageHeader
          title="Movimientos"
          subtitle="Registra entradas, salidas, devoluciones y reparaciones"
          actions={
            !isGuest && (
              <Button icon={Plus} onClick={() => openForm()}>
                Registrar movimiento
              </Button>
            )
          }
        />

        {!isGuest && (
          <div className="event-actions">
            <button type="button" className="quick-action event-action" onClick={() => openBatch("salida")}>
              <span className="quick-action-icon">
                <PackageMinus size={18} />
              </span>
              <span className="quick-action-text">
                <strong>Salida a evento</strong>
                <span>Varios equipos de una vez, escaneando o buscando</span>
              </span>
            </button>
            <button type="button" className="quick-action event-action" onClick={() => openBatch("devolucion")}>
              <span className="quick-action-icon">
                <PackageCheck size={18} />
              </span>
              <span className="quick-action-text">
                <strong>Devolución de evento</strong>
                <span>Marca lo que volvió de cada evento</span>
              </span>
            </button>
          </div>
        )}

        {!isGuest && (
          <div className="quick-actions">
            {QUICK_ACTIONS.map(({ type, icon: Icon, tone, hint }) => (
              <button
                key={type}
                type="button"
                className={`quick-action tone-${tone}`}
                onClick={() => openForm(type)}
              >
                <span className="quick-action-icon">
                  <Icon size={18} />
                </span>
                <span className="quick-action-text">
                  <strong>{MOVEMENT_LABELS[type]}</strong>
                  <span>{hint}</span>
                </span>
              </button>
            ))}
          </div>
        )}

        <section className="movements-section">
          <div className="movements-section-head">
            <h2>Últimos movimientos</h2>
            <span className="text-muted">
              Mostrando los {RECENT_LIMIT} más recientes · consulta todo en Historial
            </span>
          </div>

          <div className="toolbar">
            <Input
              className="grow"
              name="search"
              placeholder="Buscar material, motivo, proyecto o usuario..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={Search}
              aria-label="Buscar movimientos"
              suffix={
                search && (
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={X}
                    onClick={() => setSearch("")}
                    aria-label="Limpiar búsqueda"
                  />
                )
              }
            />
          </div>

          <div className="chips" role="group" aria-label="Filtrar por tipo">
            {["all", ...Object.keys(MOVEMENT_LABELS)].map((t) => (
              <button
                key={t}
                type="button"
                className={`chip ${typeFilter === t ? "is-active" : ""}`}
                onClick={() => setTypeFilter(t)}
                aria-pressed={typeFilter === t}
              >
                {t === "all" ? "Todos" : MOVEMENT_LABELS[t]}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <EmptyState
              icon={movements.length ? SearchX : ArrowLeftRight}
              title={movements.length ? "Sin resultados" : "Aún no hay movimientos"}
              description={
                movements.length
                  ? "Prueba con otra búsqueda o tipo."
                  : "Registra el primero con los accesos rápidos de arriba."
              }
            />
          ) : (
            <ul className="timeline">
              {filtered.map((mv) => {
                const dir = getMovementDirection(mv.type);
                const Icon = DIRECTION_ICONS[dir];
                const date = toDate(mv.createdAt);
                const isTransfer = mv.type === MOVEMENT_TYPES.TRANSFERENCIA;
                return (
                  <li
                    key={mv.id}
                    className={`timeline-item clickable ${mv.voided ? "is-voided" : ""}`}
                    onClick={() => setSelectedId(mv.id)}
                    onKeyDown={(e) => e.key === "Enter" && setSelectedId(mv.id)}
                    tabIndex={0}
                    role="button"
                  >
                    <span className={`timeline-icon dir-${dir}`}>
                      <Icon size={16} />
                    </span>
                    <div className="timeline-body">
                      <div className="timeline-top">
                        <span className="timeline-title">{mv.materialName}</span>
                        <Badge size="sm" variant={getMovementVariant(mv.type)}>
                          {MOVEMENT_LABELS[mv.type] || mv.type}
                        </Badge>
                        {mv.voided && (
                          <Badge size="sm" variant="error">
                            Anulado
                          </Badge>
                        )}
                      </div>
                      <p className="timeline-sub">
                        <span className="mono">{mv.materialCode}</span>
                        {mv.reason && ` · ${mv.reason}`}
                        {mv.project && ` · ${mv.project}`}
                      </p>
                      <p className="timeline-meta">
                        {getMovementUser(mv)}
                        {date && (
                          <time dateTime={date.toISOString()} title={formatDateTime(date)}>
                            {" · "}
                            {formatRelativeTime(date)}
                          </time>
                        )}
                      </p>
                    </div>
                    <div className="timeline-qty">
                      {isTransfer ? (
                        <span className="timeline-transfer">
                          {mv.fromLocation} → {mv.toLocation}
                        </span>
                      ) : (
                        <>
                          <span className={`qty dir-${dir}`}>
                            {mv.type === MOVEMENT_TYPES.AJUSTE
                              ? `= ${mv.quantity}`
                              : `${dir === "in" ? "+" : dir === "out" ? "−" : ""}${mv.quantity}`}
                          </span>
                          <span className="timeline-stock">
                            {mv.previousQuantity} → {mv.newQuantity}
                          </span>
                        </>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>

      {selectedId && movements.find((m) => m.id === selectedId) && (
        <MovementDetail
          movement={movements.find((m) => m.id === selectedId)}
          onClose={() => setSelectedId(null)}
        />
      )}

      {batchMode && !isGuest && (
        <EventBatch
          mode={batchMode}
          materials={materials}
          initialEvent={searchParams.get("evento") || ""}
          onClose={closeForm}
        />
      )}

      {formOpen && !isGuest && (
        <MovementForm
          materials={materials}
          initialMaterialId={searchParams.get("material")}
          initialType={searchParams.get("tipo")}
          onClose={closeForm}
        />
      )}
    </Layout>
  );
};

export default Movimientos;
