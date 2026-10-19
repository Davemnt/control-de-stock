#!/usr/bin/env node
/**
 * Compila y publica la app (Hosting) y las reglas de Firestore.
 *
 *   npm run deploy               → tu instalación (archivo .env)
 *   npm run deploy -- acme       → instalación del cliente "acme" (.env.acme)
 *   npm run deploy -- acme --solo-app      → sin publicar las reglas
 *
 * El proyecto de Firebase de destino sale del propio archivo .env, así nunca
 * se publica la app de un cliente en el proyecto de otro.
 */
import fs from "node:fs";
import { execSync } from "node:child_process";

const args = process.argv.slice(2);
const client = args.find((a) => !a.startsWith("--"));
const onlyApp = args.includes("--solo-app");

const envFile = client ? `.env.${client}` : ".env";
const mode = client || "production";

// Las 6 claves: si faltara alguna, Vite tomaría la del .env base (otro proyecto)
const REQUIRED = [
  "VITE_FIREBASE_API_KEY",
  "VITE_FIREBASE_AUTH_DOMAIN",
  "VITE_FIREBASE_PROJECT_ID",
  "VITE_FIREBASE_STORAGE_BUCKET",
  "VITE_FIREBASE_MESSAGING_SENDER_ID",
  "VITE_FIREBASE_APP_ID",
];

const fail = (message) => {
  console.error(`\n✖ ${message}\n`);
  process.exit(1);
};

if (!fs.existsSync(envFile)) {
  fail(`No existe ${envFile}. ${client ? "Créalo con: npm run cliente:nuevo" : "Cópialo de .env.example"}`);
}

const env = Object.fromEntries(
  fs
    .readFileSync(envFile, "utf8")
    .split(/\r?\n/)
    .filter((line) => line.trim() && !line.trim().startsWith("#") && line.includes("="))
    .map((line) => {
      const i = line.indexOf("=");
      return [line.slice(0, i).trim(), line.slice(i + 1).trim()];
    })
);

// Cada cliente debe definir TODA su configuración: si faltara una clave,
// Vite usaría la del .env base (otro proyecto).
const missing = REQUIRED.filter((key) => !env[key] || /^your[_-]/i.test(env[key]));
if (missing.length) fail(`${envFile} no tiene valores válidos para: ${missing.join(", ")}`);

// La marca indicada debe existir (si no, se publicaría con el diseño estándar)
if (env.VITE_BRAND && !fs.existsSync(`brands/${env.VITE_BRAND}/brand.json`)) {
  fail(`VITE_BRAND=${env.VITE_BRAND} pero no existe brands/${env.VITE_BRAND}/brand.json`);
}

const projectId = env.VITE_FIREBASE_PROJECT_ID;
const run = (cmd) => {
  console.log(`\n> ${cmd}`);
  execSync(cmd, { stdio: "inherit" });
};

console.log(`Instalación: ${env.VITE_COMPANY_NAME || env.VITE_APP_NAME || "propia"} · proyecto ${projectId}`);

try {
  run(`npx vite build --mode ${mode}`);
  run(
    `firebase deploy --project ${projectId} --only ${onlyApp ? "hosting" : "hosting,firestore:rules"}`
  );
} catch {
  fail("La publicación falló (ver el error arriba).");
}

console.log(`\n✔ Publicado en https://${projectId}.web.app`);
if (!onlyApp) {
  console.log("  Si es la primera vez: inicia sesión como admin para cerrar el alta libre de administradores.");
}
