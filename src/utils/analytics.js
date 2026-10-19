import { MOVEMENT_TYPES } from "../constants";
import { getMovementDirection, getMovementUser, toDate } from "./stock";

const DAY = 24 * 60 * 60 * 1000;

export const PERIODS = {
  "7d": { label: "Últimos 7 días", days: 7, bucket: "day" },
  "30d": { label: "Últimos 30 días", days: 30, bucket: "day" },
  "90d": { label: "Últimos 90 días", days: 90, bucket: "week" },
  month: { label: "Este mes", bucket: "day" },
  "12m": { label: "Últimos 12 meses", days: 365, bucket: "month" },
};

const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

/** Rango [start, end) del período y del período anterior de igual duración */
export const getRange = (periodKey, now = new Date()) => {
  const period = PERIODS[periodKey];
  const end = new Date(startOfDay(now).getTime() + DAY);
  const start =
    periodKey === "month"
      ? new Date(now.getFullYear(), now.getMonth(), 1)
      : periodKey === "12m"
        ? new Date(now.getFullYear() - 1, now.getMonth() + 1, 1)
        : new Date(end.getTime() - period.days * DAY);
  const length = end - start;
  return { start, end, prevStart: new Date(start.getTime() - length), prevEnd: start };
};

const inRange = (mv, start, end) => {
  const d = toDate(mv.createdAt);
  return d && d >= start && d < end;
};

const sumQty = (list, type) =>
  list.filter((m) => m.type === type).reduce((acc, m) => acc + (Number(m.quantity) || 0), 0);

/** Totales del período usados por los indicadores */
const summarize = (list) => ({
  count: list.length,
  out: sumQty(list, MOVEMENT_TYPES.SALIDA),
  returned: sumQty(list, MOVEMENT_TYPES.DEVOLUCION),
  repairs: sumQty(list, MOVEMENT_TYPES.REPARACION),
  losses: sumQty(list, MOVEMENT_TYPES.BAJA),
});

// ---------- Series temporales ----------
const bucketKey = (date, bucket) => {
  if (bucket === "month") return `${date.getFullYear()}-${date.getMonth()}`;
  const d = startOfDay(date);
  if (bucket === "week") {
    const day = (d.getDay() + 6) % 7; // lunes = 0
    d.setDate(d.getDate() - day);
  }
  return d.toISOString().slice(0, 10);
};

const MONTHS = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

const buildBuckets = (start, end, bucket) => {
  const buckets = [];
  const cursor = new Date(start);
  if (bucket === "week") cursor.setDate(cursor.getDate() - ((cursor.getDay() + 6) % 7));
  while (cursor < end) {
    const key = bucketKey(cursor, bucket);
    if (!buckets.length || buckets[buckets.length - 1].key !== key) {
      const label =
        bucket === "month"
          ? `${MONTHS[cursor.getMonth()]} ${String(cursor.getFullYear()).slice(2)}`
          : `${cursor.getDate()} ${MONTHS[cursor.getMonth()]}`;
      buckets.push({
        key,
        label: bucket === "week" ? `Sem. ${label}` : label,
        shortLabel: label,
        in: 0,
        out: 0,
        neutral: 0,
      });
    }
    if (bucket === "month") cursor.setMonth(cursor.getMonth() + 1, 1);
    else cursor.setDate(cursor.getDate() + (bucket === "week" ? 7 : 1));
  }
  return buckets;
};

/** Ranking genérico: [{ label, count, units }] ordenado por cantidad de movimientos */
const rankBy = (list, getKey, limit) => {
  const map = new Map();
  list.forEach((mv) => {
    const key = getKey(mv);
    if (!key) return;
    const row = map.get(key) || { label: key, count: 0, units: 0 };
    row.count += 1;
    row.units += Number(mv.quantity) || 0;
    map.set(key, row);
  });
  const rows = [...map.values()].sort((a, b) => b.count - a.count || b.units - a.units);
  return limit ? rows.slice(0, limit) : rows;
};

/**
 * Material pendiente de devolución por proyecto/evento (todo el historial):
 * unidades salidas − unidades devueltas con el mismo proyecto.
 */
export const getPendingByProject = (movements) => {
  const map = new Map();
  movements
    .filter((mv) => !mv.voided && mv.project?.trim())
    .forEach((mv) => {
      const key = mv.project.trim();
      const row = map.get(key) || { project: key, out: 0, returned: 0, last: null };
      if (mv.type === MOVEMENT_TYPES.SALIDA) row.out += Number(mv.quantity) || 0;
      if (mv.type === MOVEMENT_TYPES.DEVOLUCION) row.returned += Number(mv.quantity) || 0;
      const d = toDate(mv.createdAt);
      if (d && (!row.last || d > row.last)) row.last = d;
      map.set(key, row);
    });
  return [...map.values()]
    .filter((r) => r.out > 0)
    .map((r) => ({ ...r, pending: Math.max(0, r.out - r.returned) }))
    .sort((a, b) => b.pending - a.pending || b.last - a.last);
};

/**
 * Detalle por material de lo que falta devolver de un evento.
 * @returns [{ materialId, materialName, materialCode, out, returned, pending }]
 */
export const getEventPendingItems = (movements, project) => {
  const target = project.trim().toLowerCase();
  const map = new Map();
  movements
    .filter((mv) => !mv.voided && mv.project?.trim().toLowerCase() === target)
    .forEach((mv) => {
      const row = map.get(mv.materialId) || {
        materialId: mv.materialId,
        materialName: mv.materialName,
        materialCode: mv.materialCode,
        out: 0,
        returned: 0,
      };
      if (mv.type === MOVEMENT_TYPES.SALIDA) row.out += Number(mv.quantity) || 0;
      if (mv.type === MOVEMENT_TYPES.DEVOLUCION) row.returned += Number(mv.quantity) || 0;
      map.set(mv.materialId, row);
    });
  return [...map.values()]
    .map((r) => ({ ...r, pending: Math.max(0, r.out - r.returned) }))
    .filter((r) => r.pending > 0)
    .sort((a, b) => String(a.materialName).localeCompare(String(b.materialName), "es"));
};

/**
 * Calcula todos los indicadores de un período.
 * Los movimientos anulados no cuentan.
 */
export const computeKpis = (movements, periodKey, now = new Date()) => {
  const { start, end, prevStart, prevEnd } = getRange(periodKey, now);
  const valid = movements.filter((m) => !m.voided);
  const current = valid.filter((m) => inRange(m, start, end));
  const previous = valid.filter((m) => inRange(m, prevStart, prevEnd));

  const buckets = buildBuckets(start, end, PERIODS[periodKey].bucket);
  const index = new Map(buckets.map((b, i) => [b.key, i]));
  current.forEach((mv) => {
    const i = index.get(bucketKey(toDate(mv.createdAt), PERIODS[periodKey].bucket));
    if (i !== undefined) buckets[i][getMovementDirection(mv.type)] += 1;
  });

  return {
    range: { start, end },
    totals: summarize(current),
    previous: summarize(previous),
    series: buckets,
    byType: rankBy(current, (m) => m.type),
    byMaterial: rankBy(current, (m) => m.materialName, 8),
    byUser: rankBy(current, (m) => getMovementUser(m), 8),
  };
};

/** Variación porcentual; null si no hay base de comparación */
export const percentChange = (current, previous) =>
  previous > 0 ? Math.round(((current - previous) / previous) * 100) : null;
