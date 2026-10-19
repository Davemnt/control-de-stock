import { MOVEMENT_TYPES, STOCK_THRESHOLDS } from "../constants";

/**
 * Modelo de stock de un material:
 *  - quantity             → unidades disponibles en depósito
 *  - quantityCommitted    → unidades en uso (salidas a eventos/préstamos)
 *  - quantityMaintenance  → unidades en mantenimiento / reparación
 */
export const getStock = (material = {}) => {
  const available = Number(material.quantity) || 0;
  const committed = Number(material.quantityCommitted) || 0;
  const maintenance = Number(material.quantityMaintenance) || 0;
  return { available, committed, maintenance, total: available + committed + maintenance };
};

/**
 * Nivel de stock disponible: "out" | "low" | "ok"
 */
export const getStockLevel = (material) => {
  const { available } = getStock(material);
  if (available <= 0) return "out";
  if (available <= (material.minStock ?? STOCK_THRESHOLDS.LOW)) return "low";
  return "ok";
};

export const STOCK_LEVEL_LABELS = {
  out: "Sin stock",
  low: "Stock bajo",
  ok: "En stock",
};

/**
 * Calcula los cambios que produce un movimiento sobre un material.
 * Lanza un Error con un mensaje legible si el movimiento no es válido.
 *
 * @returns {{ updates: object, previousQuantity: number, newQuantity: number }}
 */
export const computeMovement = (material, type, rawQuantity, { toLocation } = {}) => {
  const quantity = Number(rawQuantity);
  const { available, committed, maintenance } = getStock(material);

  const isAdjust = type === MOVEMENT_TYPES.AJUSTE;
  if (!Number.isInteger(quantity) || quantity < 0 || (!isAdjust && quantity === 0)) {
    throw new Error(
      isAdjust
        ? "La cantidad debe ser un número entero mayor o igual a 0"
        : "La cantidad debe ser un número entero mayor a 0"
    );
  }

  const requireAvailable = () => {
    if (quantity > available) {
      throw new Error(`Stock insuficiente: sólo hay ${available} unidades disponibles`);
    }
  };

  let updates = {};

  switch (type) {
    case MOVEMENT_TYPES.ENTRADA:
      updates = { quantity: available + quantity };
      break;

    case MOVEMENT_TYPES.SALIDA:
      requireAvailable();
      updates = { quantity: available - quantity, quantityCommitted: committed + quantity };
      break;

    case MOVEMENT_TYPES.DEVOLUCION:
      // Si no había unidades registradas "en uso" (datos antiguos) se suman igualmente.
      updates = {
        quantity: available + quantity,
        quantityCommitted: Math.max(0, committed - quantity),
      };
      break;

    case MOVEMENT_TYPES.REPARACION:
      requireAvailable();
      updates = { quantity: available - quantity, quantityMaintenance: maintenance + quantity };
      break;

    case MOVEMENT_TYPES.REPARADO:
      if (quantity > maintenance) {
        throw new Error(`Sólo hay ${maintenance} unidades en mantenimiento`);
      }
      updates = { quantity: available + quantity, quantityMaintenance: maintenance - quantity };
      break;

    case MOVEMENT_TYPES.BAJA:
      requireAvailable();
      updates = { quantity: available - quantity };
      break;

    case MOVEMENT_TYPES.AJUSTE:
      updates = { quantity };
      break;

    case MOVEMENT_TYPES.TRANSFERENCIA: {
      const destination = (toLocation || "").trim();
      if (!destination) throw new Error("Indica la ubicación de destino");
      if (destination === (material.location || "").trim()) {
        throw new Error("El destino es igual a la ubicación actual");
      }
      updates = { location: destination };
      break;
    }

    default:
      throw new Error("Tipo de movimiento no válido");
  }

  return {
    updates,
    previousQuantity: available,
    newQuantity: updates.quantity ?? available,
  };
};

/**
 * Calcula los cambios para ANULAR un movimiento ya registrado: deshace su
 * efecto sobre el stock actual del material. Lanza un Error si no es posible
 * (por ejemplo, si las unidades a retirar ya no están disponibles).
 *
 * @returns {{ updates: object }}
 */
export const computeReversal = (material, movement) => {
  const quantity = Number(movement.quantity) || 0;
  const { available, committed, maintenance } = getStock(material);

  const takeFromAvailable = (n) => {
    if (n > available) {
      throw new Error(
        `No se puede anular: el movimiento sumó ${n} unidades pero sólo quedan ${available} disponibles`
      );
    }
    return available - n;
  };

  switch (movement.type) {
    case MOVEMENT_TYPES.ENTRADA:
      return { updates: { quantity: takeFromAvailable(quantity) } };
    case MOVEMENT_TYPES.SALIDA:
      return {
        updates: { quantity: available + quantity, quantityCommitted: Math.max(0, committed - quantity) },
      };
    case MOVEMENT_TYPES.DEVOLUCION:
      return {
        updates: { quantity: takeFromAvailable(quantity), quantityCommitted: committed + quantity },
      };
    case MOVEMENT_TYPES.REPARACION:
      return {
        updates: { quantity: available + quantity, quantityMaintenance: Math.max(0, maintenance - quantity) },
      };
    case MOVEMENT_TYPES.REPARADO:
      return {
        updates: { quantity: takeFromAvailable(quantity), quantityMaintenance: maintenance + quantity },
      };
    case MOVEMENT_TYPES.BAJA:
      return { updates: { quantity: available + quantity } };
    case MOVEMENT_TYPES.AJUSTE: {
      // Se revierte la diferencia que introdujo el ajuste, no el valor absoluto
      const delta = (Number(movement.newQuantity) || 0) - (Number(movement.previousQuantity) || 0);
      if (available - delta < 0) {
        throw new Error("No se puede anular: el stock quedaría negativo");
      }
      return { updates: { quantity: available - delta } };
    }
    case MOVEMENT_TYPES.TRANSFERENCIA:
      if (!movement.fromLocation) throw new Error("El movimiento no registra la ubicación de origen");
      return { updates: { location: movement.fromLocation } };
    default:
      throw new Error("Tipo de movimiento no válido");
  }
};

/**
 * Dirección del movimiento para iconos/colores: "in" | "out" | "neutral"
 */
export const getMovementDirection = (type) => {
  switch (type) {
    case MOVEMENT_TYPES.ENTRADA:
    case MOVEMENT_TYPES.DEVOLUCION:
    case MOVEMENT_TYPES.REPARADO:
      return "in";
    case MOVEMENT_TYPES.SALIDA:
    case MOVEMENT_TYPES.REPARACION:
    case MOVEMENT_TYPES.BAJA:
      return "out";
    default:
      return "neutral";
  }
};

export const getMovementVariant = (type) => {
  if (type === MOVEMENT_TYPES.BAJA) return "error";
  const dir = getMovementDirection(type);
  if (dir === "in") return "success";
  if (dir === "out") return "warning";
  return "info";
};

/** Nombre de quien registró un movimiento (compatibilidad con datos antiguos) */
export const getMovementUser = (movement) =>
  movement.createdByName || movement.userName || "—";

/** Convierte un Timestamp de Firestore (o Date/ISO) en Date */
export const toDate = (value) => {
  if (!value) return null;
  if (value.toDate) return value.toDate();
  const d = value instanceof Date ? value : new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
};

/** Normaliza texto para búsquedas sin tildes ni mayúsculas */
export const normalize = (text) =>
  String(text ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
