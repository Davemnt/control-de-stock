import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import brandPlugin, { brandManifest, loadBrand } from "./brands/brandPlugin.js";

export default defineConfig(({ mode }) => {
  // Marca de la instalación (por cliente, en su archivo .env — ver docs/ENTREGA_CLIENTE.md)
  const env = loadEnv(mode, process.cwd(), "VITE_");
  const appName = env.VITE_APP_NAME || "Control de Stock";
  const company = env.VITE_COMPANY_NAME || "";
  const brand = loadBrand(env.VITE_BRAND);
  const description = company
    ? `Inventario de ${company}`
    : "Gestión de inventario para productoras técnicas de eventos";

  return {
    plugins: [
      react(),
      brandPlugin(brand),
      {
        name: "branding-html",
        transformIndexHtml: (html) =>
          html.replaceAll("__APP_NAME__", appName).replaceAll("__APP_DESCRIPTION__", description),
      },
      // App instalable y con la interfaz disponible sin conexión.
      // Los datos los cachea Firestore (persistentLocalCache en src/firebase.js).
      VitePWA({
        registerType: "autoUpdate",
        includeAssets: ["icon.svg", "security.js"],
        manifest: {
          name: appName,
          short_name: appName.length > 12 ? "Stock" : appName,
          description,
          lang: "es",
          start_url: "/",
          display: "standalone",
          ...brandManifest(brand),
        },
        workbox: {
          globPatterns: ["**/*.{js,css,html,svg,png,woff2}"],
          // xlsx, jsPDF y el escáner se cargan bajo demanda y superan el límite por defecto
          maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
          navigateFallback: "/index.html",
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
              handler: "CacheFirst",
              options: {
                cacheName: "google-fonts",
                expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
              },
            },
          ],
        },
      }),
    ],
    server: {
      port: 3000,
      open: true,
    },
    resolve: {
      alias: {
        "@": "/src",
      },
    },
  };
});
