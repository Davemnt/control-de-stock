#!/usr/bin/env node
/**
 * Crea el archivo de configuración de un cliente: .env.<id>
 *
 *   npm run cliente:nuevo
 *
 * Pide el nombre de la app y de la empresa, y la configuración web del
 * proyecto Firebase del cliente (se copia tal cual desde Firebase Console →
 * Configuración del proyecto → Tus apps → Configuración del SDK).
 */
import fs from "node:fs";
import readline from "node:readline";

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise((resolve) => rl.question(q, (a) => resolve(a.trim())));

const slugify = (text) =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 30);

const KEYS = {
  apiKey: "VITE_FIREBASE_API_KEY",
  authDomain: "VITE_FIREBASE_AUTH_DOMAIN",
  projectId: "VITE_FIREBASE_PROJECT_ID",
  storageBucket: "VITE_FIREBASE_STORAGE_BUCKET",
  messagingSenderId: "VITE_FIREBASE_MESSAGING_SENDER_ID",
  appId: "VITE_FIREBASE_APP_ID",
};

/** Lee el bloque `const firebaseConfig = {...}` pegado desde la consola */
const readFirebaseConfig = async () => {
  console.log(
    "\nPega la configuración web de Firebase (el bloque firebaseConfig = { ... })" +
      "\ny pulsa Enter en una línea vacía al terminar:\n"
  );
  const lines = [];
  for (;;) {
    const line = await ask("");
    if (!line && lines.length) break;
    if (line) lines.push(line);
  }
  const text = lines.join("\n");
  const config = {};
  for (const key of Object.keys(KEYS)) {
    const match = text.match(new RegExp(`${key}\\s*:\\s*["']([^"']+)["']`));
    if (match) config[key] = match[1];
  }
  return config;
};

const main = async () => {
  console.log("=== Nueva instalación de cliente ===\n");
  const company = await ask("Nombre de la empresa cliente: ");
  const appName = (await ask(`Nombre de la app [Control de Stock]: `)) || "Control de Stock";
  const suggested = slugify(company || "cliente");
  const id = slugify((await ask(`Identificador corto [${suggested}]: `)) || suggested);

  const brands = fs.existsSync("brands")
    ? fs.readdirSync("brands").filter((d) => fs.existsSync(`brands/${d}/brand.json`))
    : [];
  const brandDefault = brands.includes(id) ? id : "";
  const brand = brands.length
    ? await ask(
        `Marca visual (${brands.join(", ")} · vacío = diseño estándar)${brandDefault ? ` [${brandDefault}]` : ""}: `
      ) || brandDefault
    : "";
  if (brand && !brands.includes(brand)) {
    console.error(`No existe brands/${brand}/brand.json`);
    rl.close();
    process.exit(1);
  }

  const file = `.env.${id}`;
  if (fs.existsSync(file)) {
    const overwrite = await ask(`${file} ya existe. ¿Sobrescribir? (si/no): `);
    if (overwrite.toLowerCase() !== "si") {
      console.log("Cancelado.");
      rl.close();
      return;
    }
  }

  const config = await readFirebaseConfig();
  const missing = Object.keys(KEYS).filter((k) => !config[k]);
  if (missing.length) {
    console.error(`\nFaltan datos en la configuración pegada: ${missing.join(", ")}`);
    rl.close();
    process.exit(1);
  }

  const content = [
    `# Instalación: ${company || id}`,
    `VITE_APP_NAME=${appName}`,
    `VITE_COMPANY_NAME=${company}`,
    `VITE_BRAND=${brand}`,
    "",
    ...Object.entries(KEYS).map(([k, env]) => `${env}=${config[k]}`),
    "",
  ].join("\n");
  fs.writeFileSync(file, content);
  rl.close();

  console.log(`\n✔ Creado ${file} (proyecto ${config.projectId})\n`);
  console.log("Siguientes pasos:");
  console.log(`  1. Publicar la app y las reglas:   npm run deploy -- ${id}`);
  console.log(`  2. Crear el administrador:        node scripts/createAdmin.mjs ${id}`);
  console.log(`  3. Entrar como admin en           https://${config.projectId}.web.app`);
};

main().catch((error) => {
  console.error(error);
  rl.close();
  process.exit(1);
});
