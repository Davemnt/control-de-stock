// config/clientConfig.js
// Configuración específica por cliente

const clientConfigs = {
  // Modo Demo - Para portfolio y demostraciones
  demo: {
    appName: "Control de Stock - Versión Demo",
    companyName: "Demo Company",
    supportEmail: "demo@controldestock.com",
    showDemoBanner: true,
    allowDataModification: true,
    features: {
      barcodeScanner: true,
      pdfExport: true,
      csvExport: true,
      userManagement: true,
    },
    branding: {
      primaryColor: "#DE591F",
      secondaryColor: "#1A1D29",
      logoUrl: null,
    },
    demoUsers: {
      admin: "demo@demo.com",
      user: "usuario@demo.com",
      password: "demo123",
    },
  },

  // Cliente 1 - Ejemplo
  cliente1: {
    appName: "Inventario Producciones XYZ",
    companyName: "Producciones XYZ Internacional",
    supportEmail: "soporte@produccionesxyz.com",
    showDemoBanner: false,
    allowDataModification: true,
    features: {
      barcodeScanner: true,
      pdfExport: true,
      csvExport: true,
      userManagement: true,
    },
    branding: {
      primaryColor: "#FF6B35",
      secondaryColor: "#004E89",
      logoUrl: "/clients/cliente1/logo.png",
    },
    customCategories: [
      { key: "AudioProfesional", label: "Audio Profesional" },
      { key: "IluminacionEscenica", label: "Iluminación Escénica" },
      { key: "VideoLED", label: "Video y Pantallas LED" },
      { key: "RiggingTrusses", label: "Rigging y Trusses" },
      { key: "EstructurasEscenarios", label: "Estructuras y Escenarios" },
    ],
  },

  // Cliente 2 - Ejemplo
  cliente2: {
    appName: "Stock Manager - EventTech",
    companyName: "EventTech Solutions",
    supportEmail: "help@eventtech.com",
    showDemoBanner: false,
    allowDataModification: true,
    features: {
      barcodeScanner: true,
      pdfExport: true,
      csvExport: true,
      userManagement: true,
    },
    branding: {
      primaryColor: "#6C5CE7",
      secondaryColor: "#2D3436",
      logoUrl: "/clients/cliente2/logo.png",
    },
  },
};

/**
 * Obtiene la configuración del cliente actual basado en VITE_APP_MODE
 * @returns {Object} Configuración del cliente
 */
export const getClientConfig = () => {
  const mode = import.meta.env.VITE_APP_MODE || "demo";
  const clientName = import.meta.env.VITE_CLIENT_NAME || mode;

  return clientConfigs[clientName] || clientConfigs.demo;
};

/**
 * Verifica si la app está en modo demo
 * @returns {boolean}
 */
export const isDemoMode = () => {
  return import.meta.env.VITE_APP_MODE === "demo";
};

/**
 * Obtiene el nombre de la aplicación actual
 * @returns {string}
 */
export const getAppName = () => {
  return getClientConfig().appName;
};

/**
 * Obtiene el color primario del cliente
 * @returns {string}
 */
export const getPrimaryColor = () => {
  return getClientConfig().branding.primaryColor;
};

/**
 * Verifica si una característica está habilitada
 * @param {string} feature - Nombre de la característica
 * @returns {boolean}
 */
export const isFeatureEnabled = (feature) => {
  const config = getClientConfig();
  return config.features[feature] !== false;
};

export default clientConfigs;
