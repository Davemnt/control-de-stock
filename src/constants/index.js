// User roles
export const ROLES = {
  ADMIN: "admin",
  EMPLOYEE: "employee", // Nuevo rol: puede crear y registrar, pero no editar
  USER: "user",
  GUEST: "guest",
};

export const ROLE_LABELS = {
  [ROLES.ADMIN]: "Administrador",
  [ROLES.EMPLOYEE]: "Empleado",
  [ROLES.USER]: "Encargado de stock",
  [ROLES.GUEST]: "Invitado",
};

export const ROLE_DESCRIPTIONS = {
  [ROLES.ADMIN]: "Acceso total: materiales, movimientos, usuarios y configuración",
  [ROLES.EMPLOYEE]: "Crea materiales y registra movimientos",
  [ROLES.USER]: "Registra entradas, salidas y devoluciones de material. No edita el inventario",
  [ROLES.GUEST]: "Sólo lectura",
};

// Categorías por defecto (se usan si no existe system/categories)
export const DEFAULT_CATEGORIES = [
  { key: "Audio", label: "Audio" },
  { key: "Iluminación", label: "Iluminación" },
  { key: "Video", label: "Video" },
  { key: "Rigging", label: "Rigging" },
  { key: "Estructuras", label: "Estructuras" },
  { key: "Cables", label: "Cables y Accesorios" },
  { key: "Mochilas Técnicas", label: "Mochilas Técnicas" },
  { key: "Repuestos", label: "Repuestos" },
];

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
  REPARADO: "reparado",
  BAJA: "baja",
  AJUSTE: "ajuste",
};

export const MOVEMENT_LABELS = {
  [MOVEMENT_TYPES.ENTRADA]: "Entrada",
  [MOVEMENT_TYPES.SALIDA]: "Salida",
  [MOVEMENT_TYPES.TRANSFERENCIA]: "Transferencia",
  [MOVEMENT_TYPES.DEVOLUCION]: "Devolución",
  [MOVEMENT_TYPES.REPARACION]: "Envío a reparación",
  [MOVEMENT_TYPES.REPARADO]: "Retorno de reparación",
  [MOVEMENT_TYPES.BAJA]: "Baja",
  [MOVEMENT_TYPES.AJUSTE]: "Ajuste Manual",
};

// Descripción de cómo afecta cada movimiento al stock
export const MOVEMENT_HELP = {
  [MOVEMENT_TYPES.ENTRADA]: "Suma unidades al stock disponible (compras, altas).",
  [MOVEMENT_TYPES.SALIDA]: "Pasa unidades de disponible a «en uso» (eventos, préstamos).",
  [MOVEMENT_TYPES.DEVOLUCION]: "Devuelve unidades «en uso» al stock disponible.",
  [MOVEMENT_TYPES.REPARACION]: "Pasa unidades de disponible a «en mantenimiento».",
  [MOVEMENT_TYPES.REPARADO]: "Devuelve unidades de mantenimiento al stock disponible.",
  [MOVEMENT_TYPES.TRANSFERENCIA]: "Cambia la ubicación del material.",
  [MOVEMENT_TYPES.BAJA]: "Descuenta unidades del stock definitivamente (rotura, pérdida).",
  [MOVEMENT_TYPES.AJUSTE]: "Fija el stock disponible a la cantidad indicada (inventario físico).",
};

// Movimientos reservados a administradores
export const ADMIN_ONLY_MOVEMENTS = [MOVEMENT_TYPES.BAJA, MOVEMENT_TYPES.AJUSTE];

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
  [ROLES.EMPLOYEE]: [
    "view_all",
    "create_material", // ✅ Puede crear materiales
    "create_movement", // ✅ Puede registrar movimientos
    "view_history",
    "export_reports",
    // ❌ NO puede editar ni eliminar materiales
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
