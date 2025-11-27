// User roles
export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  GUEST: "guest",
};

// Material categories
export const CATEGORIES = {
  AUDIO: "audio",
  ILUMINACION: "iluminacion",
  VIDEO: "video",
  RIGGING: "rigging",
  ESTRUCTURAS: "estructuras",
  CABLES: "cables",
  MOCHILAS: "mochilas",
  REPUESTOS: "repuestos",
};

export const CATEGORY_LABELS = {
  [CATEGORIES.AUDIO]: "Audio",
  [CATEGORIES.ILUMINACION]: "Iluminación",
  [CATEGORIES.VIDEO]: "Video",
  [CATEGORIES.RIGGING]: "Rigging",
  [CATEGORIES.ESTRUCTURAS]: "Estructuras",
  [CATEGORIES.CABLES]: "Cables y Accesorios",
  [CATEGORIES.MOCHILAS]: "Mochilas Técnicas",
  [CATEGORIES.REPUESTOS]: "Repuestos",
};

// Material status
export const MATERIAL_STATUS = {
  OPERATIVO: "operativo",
  MANTENIMIENTO: "mantenimiento",
  PRESTADO: "prestado",
  RESERVADO: "reservado",
  FUERA_SERVICIO: "fuera_servicio",
  REPARACION: "reparacion",
};

export const STATUS_LABELS = {
  [MATERIAL_STATUS.OPERATIVO]: "Operativo",
  [MATERIAL_STATUS.MANTENIMIENTO]: "En Mantenimiento",
  [MATERIAL_STATUS.PRESTADO]: "Prestado",
  [MATERIAL_STATUS.RESERVADO]: "Reservado",
  [MATERIAL_STATUS.FUERA_SERVICIO]: "Fuera de Servicio",
  [MATERIAL_STATUS.REPARACION]: "En Reparación",
};

// Movement types
export const MOVEMENT_TYPES = {
  ENTRADA: "entrada",
  SALIDA: "salida",
  TRANSFERENCIA: "transferencia",
  DEVOLUCION: "devolucion",
  REPARACION: "reparacion",
  BAJA: "baja",
  AJUSTE: "ajuste",
};

export const MOVEMENT_LABELS = {
  [MOVEMENT_TYPES.ENTRADA]: "Entrada",
  [MOVEMENT_TYPES.SALIDA]: "Salida",
  [MOVEMENT_TYPES.TRANSFERENCIA]: "Transferencia",
  [MOVEMENT_TYPES.DEVOLUCION]: "Devolución",
  [MOVEMENT_TYPES.REPARACION]: "Reparación",
  [MOVEMENT_TYPES.BAJA]: "Baja",
  [MOVEMENT_TYPES.AJUSTE]: "Ajuste Manual",
};

// Permissions by role
export const PERMISSIONS = {
  [ROLES.ADMIN]: [
    "view_all",
    "create_material",
    "edit_material",
    "delete_material",
    "create_movement",
    "edit_movement",
    "view_history",
    "manage_users",
    "export_reports",
    "manual_adjust",
  ],
  [ROLES.USER]: [
    "view_all",
    "create_movement",
    "view_history",
    "export_reports",
  ],
  [ROLES.GUEST]: ["view_all"],
};

// Stock alert thresholds
export const STOCK_THRESHOLDS = {
  CRITICAL: 5,
  LOW: 10,
  MEDIUM: 20,
};

// Pagination
export const ITEMS_PER_PAGE = 20;

// Date formats
export const DATE_FORMAT = "dd/MM/yyyy";
export const DATETIME_FORMAT = "dd/MM/yyyy HH:mm";

// Validation rules
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 6,
  CODE_MAX_LENGTH: 20,
  NAME_MAX_LENGTH: 100,
  DESCRIPTION_MAX_LENGTH: 500,
};

// Firebase collections
export const COLLECTIONS = {
  USERS: "users",
  MATERIALS: "materials",
  MOVEMENTS: "movements",
  LOGS: "logs",
};

// Helper para obtener nombre de coleccion segun el usuario
export const getCollection = (collectionName) => {
  const isDemoMode = () => {
    const userData = JSON.parse(localStorage.getItem("currentUser") || "{}");
    return userData.email === "demo@demo.com";
  };

  const prefix = isDemoMode() ? "demo_" : "";
  return `${prefix}${collectionName}`;
};

// Languages
export const LANGUAGES = {
  ES: "es",
  EN: "en",
};

// Default values
export const DEFAULTS = {
  LOCATION: "Depósito Principal",
  LANGUAGE: LANGUAGES.ES,
  ITEMS_PER_PAGE: 20,
};
