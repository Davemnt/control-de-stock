import React, { useMemo, useState } from "react";
import { BarChart3, Table2, TrendingDown, TrendingUp, Minus } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useMaterials, useMovements } from "../../hooks/useFirestore";
import { MOVEMENT_LABELS } from "../../constants";
import { formatNumber } from "../../utils";
import { formatDate } from "../../utils/formatters";
import { getStock } from "../../utils/stock";
import { PERIODS, computeKpis, getPendingByProject, percentChange } from "../../utils/analytics";
import Layout from "../../components/Layout/Layout";
import Card from "../../components/Card/Card";
import Badge from "../../components/Badge/Badge";
import PageHeader from "../../components/PageHeader/PageHeader";
import EmptyState from "../../components/EmptyState/EmptyState";
import Loader from "../../components/Loader/Loader";
import { BarList, Legend, StackedColumns } from "./Charts";
import "./Indicadores.css";

// Colores de serie validados (paleta de referencia, slots 1-3)
const SERIES = [
  { key: "in", label: "Ingresos", color: "var(--viz-series-1)" },
  { key: "out", label: "Egresos", color: "var(--viz-series-2)" },
  { key: "neutral", label: "Traslados y ajustes", color: "var(--viz-series-3)" },
];

/** Indicador con variación respecto al período anterior */
const StatTile = ({ label, value, hint, current, previous, upIsGood, suffix = "" }) => {
  const change = previous !== undefined ? percentChange(current, previous) : null;
  let tone = "neutral";
  if (change !== null && change !== 0 && upIsGood !== undefined) {
    tone = (change > 0) === upIsGood ? "good" : "bad";
  }
  const Icon = change > 0 ? TrendingUp : change < 0 ? TrendingDown : Minus;
  return (
    <div className="kpi-tile">
      <span className="kpi-label">{label}</span>
      <span className="kpi-value">
        {value}
        {suffix && <span className="kpi-suffix">{suffix}</span>}
      </span>
      <span className="kpi-foot">
        {change !== null && (
          <span className={`kpi-delta tone-${tone}`}>
            <Icon size={13} />
            {change > 0 ? "+" : ""}
            {change}%
          </span>
        )}
        <span className="kpi-hint">{change !== null ? `vs. período anterior · ${hint}` : hint}</span>
      </span>
    </div>
  );
};

const Indicadores = () => {
  const { isGuest } = useAuth();
  const { movements, loading } = useMovements();
  const { materials, loading: loadingMaterials } = useMaterials();
  const [period, setPeriod] = useState("30d");
  const [showTable, setShowTable] = useState(false);

  const kpis = useMemo(() => computeKpis(movements, period), [movements, period]);
  const pending = useMemo(() => getPendingByProject(movements), [movements]);
  const inUseNow = useMemo(
    () => materials.reduce((acc, m) => acc + getStock(m).committed, 0),
    [materials]
  );

  if (loading || loadingMaterials) {
    return (
      <Layout>
        <Loader text="Calculando indicadores..." />
      </Layout>
    );
  }

  const { totals, previous } = kpis;
  const returnRate = totals.out > 0 ? Math.round((totals.returned / totals.out) * 100) : null;
  const hasData = totals.count > 0;
  const pendingOpen = pending.filter((p) => p.pending > 0);

  return (
    <Layout>
      <div className="page indicadores">
        <PageHeader
          title="Indicadores"
          subtitle={`Movimientos del ${formatDate(kpis.range.start)} al ${formatDate(
            new Date(kpis.range.end.getTime() - 1)
          )} · los anulados no se cuentan`}
        />

        <div className="chips" role="group" aria-label="Período">
          {Object.entries(PERIODS).map(([key, p]) => (
            <button
              key={key}
              type="button"
              className={`chip ${period === key ? "is-active" : ""}`}
              onClick={() => setPeriod(key)}
              aria-pressed={period === key}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="kpi-grid">
          <StatTile
            label="Movimientos registrados"
            value={formatNumber(totals.count)}
            current={totals.count}
            previous={previous.count}
            hint={`${formatNumber(previous.count)} antes`}
          />
          <StatTile
            label="Unidades enviadas a eventos"
            value={formatNumber(totals.out)}
            current={totals.out}
            previous={previous.out}
            hint={`${formatNumber(inUseNow)} en uso ahora`}
          />
          <StatTile
            label="Tasa de devolución"
            value={returnRate === null ? "—" : formatNumber(returnRate)}
            suffix={returnRate === null ? "" : "%"}
            hint={`${formatNumber(totals.returned)} de ${formatNumber(totals.out)} unidades volvieron`}
          />
          <StatTile
            label="Unidades dadas de baja"
            value={formatNumber(totals.losses)}
            current={totals.losses}
            previous={previous.losses}
            upIsGood={false}
            hint={`${formatNumber(totals.repairs)} enviadas a reparación`}
          />
        </div>

        {!hasData ? (
          <EmptyState
            icon={BarChart3}
            title="Sin movimientos en este período"
            description="Elige un período más amplio o registra movimientos para ver los indicadores."
          />
        ) : (
          <>
            <Card
              title="Actividad en el tiempo"
              subtitle={`Cantidad de movimientos por ${
                PERIODS[period].bucket === "day" ? "día" : PERIODS[period].bucket === "week" ? "semana" : "mes"
              }`}
              actions={
                <button
                  type="button"
                  className="view-toggle"
                  onClick={() => setShowTable((v) => !v)}
                  aria-pressed={showTable}
                >
                  {showTable ? <BarChart3 size={15} /> : <Table2 size={15} />}
                  {showTable ? "Ver gráfico" : "Ver tabla"}
                </button>
              }
            >
              {showTable ? (
                <div className="table-wrap">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Período</th>
                        {SERIES.map((s) => (
                          <th key={s.key} className="num">
                            {s.label}
                          </th>
                        ))}
                        <th className="num">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {kpis.series.map((row) => (
                        <tr key={row.key}>
                          <td>{row.label}</td>
                          {SERIES.map((s) => (
                            <td key={s.key} className="num">
                              {row[s.key]}
                            </td>
                          ))}
                          <td className="num">
                            <strong>{row.in + row.out + row.neutral}</strong>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <>
                  <Legend series={SERIES} />
                  <StackedColumns
                    data={kpis.series}
                    series={SERIES}
                    ariaLabel="Movimientos por período, separados en ingresos, egresos y traslados"
                  />
                </>
              )}
            </Card>

            <div className="kpi-columns">
              <Card title="Por tipo de movimiento" subtitle="Cantidad de movimientos">
                <BarList
                  rows={kpis.byType.map((r) => ({
                    label: MOVEMENT_LABELS[r.label] || r.label,
                    value: r.count,
                    hint: `${formatNumber(r.units)} unidades`,
                  }))}
                />
              </Card>

              <Card title="Materiales con más movimiento" subtitle="Top 8 por cantidad de movimientos">
                <BarList
                  rows={kpis.byMaterial.map((r) => ({
                    label: r.label,
                    value: r.count,
                    hint: `${formatNumber(r.units)} unidades`,
                  }))}
                />
              </Card>

              <Card title="Actividad por usuario" subtitle="Movimientos registrados por cada persona">
                <BarList
                  rows={kpis.byUser.map((r) => ({
                    label: r.label,
                    value: r.count,
                    hint: `${formatNumber(r.units)} unidades`,
                  }))}
                />
              </Card>
            </div>
          </>
        )}

        <Card
          title="Material pendiente de devolución por evento"
          subtitle="Salidas menos devoluciones con el mismo proyecto/evento · todo el historial"
          padding="none"
        >
          {pending.length === 0 ? (
            <EmptyState
              compact
              icon={Table2}
              title="Sin eventos registrados"
              description="Indica el proyecto/evento al registrar salidas y devoluciones para seguirlas aquí."
            />
          ) : (
            <div className="pending-table">
              <table className="table">
                <thead>
                  <tr>
                    <th>Proyecto / evento</th>
                    <th className="num">Salieron</th>
                    <th className="num">Volvieron</th>
                    <th className="num">Pendiente</th>
                    <th>Último movimiento</th>
                    {!isGuest && <th aria-label="Acciones" />}
                  </tr>
                </thead>
                <tbody>
                  {pending.slice(0, 15).map((p) => (
                    <tr key={p.project}>
                      <td>
                        <span className="cell-title">{p.project}</span>
                      </td>
                      <td className="num">{formatNumber(p.out)}</td>
                      <td className="num">{formatNumber(p.returned)}</td>
                      <td className="num">
                        {p.pending > 0 ? (
                          <Badge size="sm" variant="warning" dot>
                            {formatNumber(p.pending)} unid.
                          </Badge>
                        ) : (
                          <Badge size="sm" variant="success" dot>
                            Completo
                          </Badge>
                        )}
                      </td>
                      <td className="text-secondary">{formatDate(p.last)}</td>
                      {!isGuest && (
                        <td className="num">
                          {p.pending > 0 && (
                            <Link
                              className="card-link"
                              to={`/movimientos?lote=devolucion&evento=${encodeURIComponent(p.project)}`}
                            >
                              Registrar devolución
                            </Link>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
              {pendingOpen.length > 0 && (
                <p className="pending-foot">
                  {pendingOpen.length} {pendingOpen.length === 1 ? "evento tiene" : "eventos tienen"}{" "}
                  material sin devolver.
                </p>
              )}
            </div>
          )}
        </Card>
      </div>
    </Layout>
  );
};

export default Indicadores;
