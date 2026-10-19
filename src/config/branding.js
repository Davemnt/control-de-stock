/**
 * Marca de la instalación. Se define por cliente en su archivo .env
 * (ver docs/ENTREGA_CLIENTE.md); si no se define, se usan estos valores.
 */
import brand from "virtual:brand";

/** Marca visual del cliente (logo, fondo del login…) definida en brands/<id>/ */
export const BRAND = brand;

export const APP_NAME = import.meta.env.VITE_APP_NAME || "Control de Stock";

/** Nombre de la empresa cliente (opcional) */
export const COMPANY_NAME = import.meta.env.VITE_COMPANY_NAME || "";

/** Subtítulo bajo el nombre en el menú y el login */
export const APP_TAGLINE = COMPANY_NAME || "Sistema profesional";
