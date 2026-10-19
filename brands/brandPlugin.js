import fs from "node:fs";
import path from "node:path";

/**
 * Marcas por cliente (ver brands/README.md).
 *
 * VITE_BRAND=<id> en el .env elige la carpeta brands/<id>/. El plugin:
 *  - publica sus archivos en /brand/* (en desarrollo y en el build),
 *  - inyecta en index.html el tema (theme.css), la fuente y el favicon,
 *  - expone la configuración a la app como el módulo "virtual:brand".
 * Sin VITE_BRAND (o con una carpeta inexistente) se usa el diseño estándar.
 */
export const loadBrand = (brandId) => {
  const id = brandId || "default";
  const dir = path.resolve(process.cwd(), "brands", id);
  const configFile = path.join(dir, "brand.json");
  if (!brandId || !fs.existsSync(configFile)) {
    if (brandId) console.warn(`[brand] No existe brands/${brandId}/brand.json: se usa el diseño estándar`);
    return { id: "default", dir: null, config: {} };
  }
  const config = JSON.parse(fs.readFileSync(configFile, "utf8"));
  const missing = ["logo", "loginBackground", "icon192", "icon512", "theme"]
    .filter((key) => config[key] && !fs.existsSync(path.join(dir, config[key])))
    .map((key) => config[key]);
  if (missing.length) throw new Error(`[brand] Faltan archivos en brands/${id}/: ${missing.join(", ")}`);
  return { id, dir, config };
};

const url = (brand, key) => (brand.config[key] ? `/brand/${brand.config[key]}` : null);

const MIME = { ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml", ".css": "text/css", ".webp": "image/webp" };

export default function brandPlugin(brand) {
  const VIRTUAL = "virtual:brand";
  const files = brand.dir ? fs.readdirSync(brand.dir).filter((f) => f !== "brand.json" && !f.endsWith(".md")) : [];

  return {
    name: "client-brand",

    resolveId: (id) => (id === VIRTUAL ? `\0${VIRTUAL}` : null),
    load: (id) =>
      id === `\0${VIRTUAL}`
        ? `export default ${JSON.stringify({
            id: brand.id,
            name: brand.config.name || null,
            logo: url(brand, "logo"),
            loginBackground: url(brand, "loginBackground"),
          })};`
        : null,

    transformIndexHtml(html) {
      if (!brand.dir) return html;
      const tags = [];
      if (brand.config.fonts) tags.push({ tag: "link", attrs: { rel: "stylesheet", href: brand.config.fonts }, injectTo: "head" });
      if (brand.config.theme) tags.push({ tag: "link", attrs: { rel: "stylesheet", href: url(brand, "theme") }, injectTo: "head" });
      if (brand.config.icon192) {
        html = html
          .replace(/<link rel="icon"[^>]*>/, `<link rel="icon" type="image/png" href="${url(brand, "icon192")}" />`)
          .replace(/<link rel="apple-touch-icon"[^>]*>/, `<link rel="apple-touch-icon" href="${url(brand, "icon192")}" />`);
      }
      if (brand.config.backgroundColor) {
        html = html.replace(/<meta name="theme-color" content="[^"]*"/, `<meta name="theme-color" content="${brand.config.backgroundColor}"`);
      }
      return { html, tags };
    },

    // Desarrollo: servir /brand/* desde la carpeta de la marca
    configureServer(server) {
      if (!brand.dir) return;
      server.middlewares.use("/brand", (req, res, next) => {
        const file = path.join(brand.dir, decodeURIComponent(req.url.split("?")[0]).replace(/^\/+/, ""));
        if (!file.startsWith(brand.dir) || !fs.existsSync(file) || !files.includes(path.basename(file))) return next();
        res.setHeader("Content-Type", MIME[path.extname(file)] || "application/octet-stream");
        fs.createReadStream(file).pipe(res);
      });
    },

    // Build: copiar los archivos de la marca a dist/brand/
    generateBundle() {
      files.forEach((f) =>
        this.emitFile({ type: "asset", fileName: `brand/${f}`, source: fs.readFileSync(path.join(brand.dir, f)) })
      );
    },
  };
}

/** Iconos de la app instalable (PWA) según la marca */
export const brandManifest = (brand) => ({
  theme_color: brand.config.themeColor || "#e2571c",
  background_color: brand.config.backgroundColor || "#f3f4f6",
  icons: [
    { src: url(brand, "icon192") || "/icon-192.png", sizes: "192x192", type: "image/png" },
    { src: url(brand, "icon512") || "/icon-512.png", sizes: "512x512", type: "image/png" },
    { src: url(brand, "icon512") || "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
  ],
});
