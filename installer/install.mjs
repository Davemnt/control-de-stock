#!/usr/bin/env node

/**
 * CONTROL DE STOCK - INSTALADOR PROFESIONAL
 *
 * Sistema automatizado para desplegar Control de Stock a nuevos clientes
 *
 * @author David Monte
 * @version 1.0.0
 * @license PROPRIETARY
 */

import inquirer from "inquirer";
import chalk from "chalk";
import ora from "ora";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import slugify from "slugify";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuración
const CONFIG = {
  appName: "Control de Stock",
  version: "2.0.0",
  githubRepo: "https://github.com/Davemnt/control-de-stock.git",
  plans: {
    basic: { materials: 500, users: 3, storage: "1GB" },
    pro: { materials: 2000, users: 10, storage: "5GB" },
    enterprise: { materials: -1, users: -1, storage: "20GB" },
  },
};

// Colores y emojis
const colors = {
  success: chalk.green,
  error: chalk.red,
  warning: chalk.yellow,
  info: chalk.cyan,
  title: chalk.bold.magenta,
};

/**
 * Banner de inicio
 */
function showBanner() {
  console.clear();
  console.log(
    colors.title(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║        🚀  CONTROL DE STOCK - INSTALADOR PRO 🚀          ║
║                                                           ║
║              Sistema Automatizado de Despliegue           ║
║                    Versión ${CONFIG.version}                    ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `)
  );
  console.log(colors.info("  Desarrollado por: David Monte\n"));
}

/**
 * Verificar requisitos del sistema
 */
async function checkRequirements() {
  const spinner = ora("Verificando requisitos del sistema...").start();

  try {
    // Verificar Node.js
    const nodeVersion = execSync("node --version").toString().trim();
    spinner.info(`Node.js: ${nodeVersion}`);

    // Verificar Firebase CLI
    try {
      const firebaseVersion = execSync("firebase --version").toString().trim();
      spinner.info(`Firebase CLI: ${firebaseVersion}`);
    } catch {
      spinner.fail("Firebase CLI no encontrado");
      console.log(colors.warning("\n⚠️  Instala Firebase CLI con:"));
      console.log(colors.info("   npm install -g firebase-tools\n"));
      process.exit(1);
    }

    // Verificar Git
    try {
      const gitVersion = execSync("git --version").toString().trim();
      spinner.info(`Git: ${gitVersion}`);
    } catch {
      spinner.warn("Git no encontrado (opcional)");
    }

    spinner.succeed("✅ Requisitos verificados correctamente\n");
    return true;
  } catch (error) {
    spinner.fail(`Error verificando requisitos: ${error.message}`);
    return false;
  }
}

/**
 * Recopilar información del cliente
 */
async function getClientInfo() {
  console.log(colors.title("\n📋 INFORMACIÓN DEL CLIENTE\n"));

  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "companyName",
      message: "🏢 Nombre de la empresa:",
      validate: (input) => input.length > 0 || "El nombre es requerido",
    },
    {
      type: "input",
      name: "adminEmail",
      message: "📧 Email del administrador:",
      validate: (input) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(input) || "Email inválido";
      },
    },
    {
      type: "password",
      name: "adminPassword",
      message: "🔑 Contraseña inicial (mínimo 6 caracteres):",
      mask: "*",
      validate: (input) => {
        if (!input || input.length === 0) {
          return "La contraseña es requerida";
        }
        if (input.length < 6) {
          return "La contraseña debe tener al menos 6 caracteres";
        }
        return true;
      },
    },
    {
      type: "input",
      name: "adminName",
      message: "👤 Nombre completo del administrador:",
      validate: (input) => input.length > 0 || "El nombre es requerido",
    },
    {
      type: "list",
      name: "plan",
      message: "📦 Plan contratado:",
      choices: [
        {
          name: "💼 Basic - $39/mes (500 materiales, 3 usuarios)",
          value: "basic",
        },
        {
          name: "🚀 Pro - $79/mes (2000 materiales, 10 usuarios)",
          value: "pro",
        },
        { name: "⭐ Enterprise - $149/mes (Ilimitado)", value: "enterprise" },
      ],
    },
    {
      type: "confirm",
      name: "loadSampleData",
      message: "📊 ¿Cargar datos de ejemplo?",
      default: true,
    },
    {
      type: "confirm",
      name: "customDomain",
      message: "🌐 ¿Configurar dominio personalizado?",
      default: false,
    },
  ]);

  // Generar ID del proyecto
  answers.projectId = slugify(answers.companyName, {
    lower: true,
    strict: true,
    replacement: "-",
  });

  // Agregar timestamp
  answers.timestamp = new Date().toISOString();

  return answers;
}

/**
 * Crear proyecto Firebase
 */
async function createFirebaseProject(clientInfo) {
  const spinner = ora(
    `Creando proyecto Firebase: ${clientInfo.projectId}...`
  ).start();

  try {
    // Crear proyecto
    execSync(
      `firebase projects:create ${clientInfo.projectId} --display-name "${clientInfo.companyName}"`,
      {
        stdio: "pipe",
      }
    );

    spinner.text = "Configurando Firestore...";

    // Activar Firestore
    execSync(
      `firebase firestore:databases:create --project ${clientInfo.projectId}`,
      {
        stdio: "pipe",
      }
    );

    spinner.text = "Activando Authentication...";

    // No hay comando directo para activar Auth, se activa automáticamente al usarlo

    spinner.succeed(`✅ Proyecto Firebase creado: ${clientInfo.projectId}`);
    return true;
  } catch (error) {
    if (error.message.includes("already exists")) {
      spinner.warn(
        `⚠️  Proyecto ${clientInfo.projectId} ya existe, continuando...`
      );
      return true;
    }
    spinner.fail(`Error creando proyecto: ${error.message}`);
    return false;
  }
}

/**
 * Clonar y configurar código fuente
 */
async function setupSourceCode(clientInfo) {
  const spinner = ora("Preparando código fuente...").start();
  const workDir = path.join(__dirname, "temp", clientInfo.projectId);

  try {
    // Crear directorio temporal
    if (!fs.existsSync(workDir)) {
      fs.mkdirSync(workDir, { recursive: true });
    }

    spinner.text = "Clonando repositorio...";

    // Clonar repo (aquí deberías tener el código en un lugar accesible)
    // Por ahora copiamos desde el directorio padre
    const sourceDir = path.join(__dirname, "..");

    // Copiar archivos necesarios
    spinner.text = "Copiando archivos...";
    const filesToCopy = [
      "package.json",
      "vite.config.js",
      "index.html",
      "firebase.json",
      ".firebaserc.template",
    ];

    for (const file of filesToCopy) {
      const source = path.join(sourceDir, file);
      if (fs.existsSync(source)) {
        fs.copyFileSync(source, path.join(workDir, file));
      }
    }

    // Copiar directorios
    const dirsToCopy = ["src", "public"];
    for (const dir of dirsToCopy) {
      const source = path.join(sourceDir, dir);
      const dest = path.join(workDir, dir);
      if (fs.existsSync(source)) {
        fs.cpSync(source, dest, { recursive: true });
      }
    }

    spinner.text = "Configurando variables de entorno...";

    // Crear archivo .env
    const envContent = `
VITE_FIREBASE_API_KEY=YOUR_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=${clientInfo.projectId}.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=${clientInfo.projectId}
VITE_FIREBASE_STORAGE_BUCKET=${clientInfo.projectId}.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
VITE_FIREBASE_APP_ID=YOUR_APP_ID
`;

    fs.writeFileSync(path.join(workDir, ".env.production"), envContent.trim());

    // Configurar .firebaserc
    const firebaserc = {
      projects: {
        default: clientInfo.projectId,
      },
    };
    fs.writeFileSync(
      path.join(workDir, ".firebaserc"),
      JSON.stringify(firebaserc, null, 2)
    );

    spinner.succeed(`✅ Código fuente configurado en: ${workDir}`);
    return workDir;
  } catch (error) {
    spinner.fail(`Error configurando código: ${error.message}`);
    return null;
  }
}

/**
 * Instalar dependencias y compilar
 */
async function buildApplication(workDir) {
  const spinner = ora("Instalando dependencias...").start();

  try {
    execSync("npm install", {
      cwd: workDir,
      stdio: "pipe",
    });

    spinner.text = "Compilando aplicación...";

    execSync("npm run build", {
      cwd: workDir,
      stdio: "pipe",
    });

    spinner.succeed("✅ Aplicación compilada correctamente");
    return true;
  } catch (error) {
    spinner.fail(`Error compilando: ${error.message}`);
    return false;
  }
}

/**
 * Desplegar a Firebase Hosting
 */
async function deployToFirebase(workDir, clientInfo) {
  const spinner = ora("Desplegando a Firebase Hosting...").start();

  try {
    execSync(
      `firebase deploy --only hosting --project ${clientInfo.projectId}`,
      {
        cwd: workDir,
        stdio: "pipe",
      }
    );

    const url = `https://${clientInfo.projectId}.web.app`;
    spinner.succeed(`✅ Aplicación desplegada: ${colors.info(url)}`);

    return url;
  } catch (error) {
    spinner.fail(`Error desplegando: ${error.message}`);
    return null;
  }
}

/**
 * Crear usuario administrador
 */
async function createAdminUser(clientInfo) {
  const spinner = ora("Creando usuario administrador...").start();

  try {
    // Aquí necesitarías usar Firebase Admin SDK
    // Por simplicidad, mostraremos las credenciales para crear manualmente

    spinner.succeed("✅ Credenciales preparadas para el administrador");

    console.log(colors.title("\n📧 CREDENCIALES DEL ADMINISTRADOR:"));
    console.log(colors.info(`   Email: ${clientInfo.adminEmail}`));
    console.log(colors.info(`   Password: ${clientInfo.adminPassword}`));
    console.log(colors.info(`   Nombre: ${clientInfo.adminName}\n`));

    return true;
  } catch (error) {
    spinner.fail(`Error creando administrador: ${error.message}`);
    return false;
  }
}

/**
 * Generar resumen de instalación
 */
function generateSummary(clientInfo, url) {
  const summary = {
    timestamp: clientInfo.timestamp,
    company: clientInfo.companyName,
    projectId: clientInfo.projectId,
    plan: clientInfo.plan,
    url: url,
    admin: {
      email: clientInfo.adminEmail,
      name: clientInfo.adminName,
    },
    limits: CONFIG.plans[clientInfo.plan],
  };

  // Guardar resumen
  const summaryFile = path.join(
    __dirname,
    "logs",
    `${clientInfo.projectId}-summary.json`
  );
  fs.mkdirSync(path.join(__dirname, "logs"), { recursive: true });
  fs.writeFileSync(summaryFile, JSON.stringify(summary, null, 2));

  // Mostrar resumen
  console.log(
    colors.title(
      "\n\n═══════════════════════════════════════════════════════════"
    )
  );
  console.log(
    colors.title("               📋 RESUMEN DE INSTALACIÓN                    ")
  );
  console.log(
    colors.title(
      "═══════════════════════════════════════════════════════════\n"
    )
  );

  console.log(colors.success(`✅ Cliente: ${clientInfo.companyName}`));
  console.log(colors.success(`✅ Plan: ${clientInfo.plan.toUpperCase()}`));
  console.log(colors.success(`✅ URL: ${url}`));
  console.log(
    colors.success(`✅ Proyecto Firebase: ${clientInfo.projectId}\n`)
  );

  console.log(colors.title("📊 LÍMITES DEL PLAN:\n"));
  const limits = CONFIG.plans[clientInfo.plan];
  console.log(
    `   Materiales: ${limits.materials === -1 ? "Ilimitado" : limits.materials}`
  );
  console.log(
    `   Usuarios: ${limits.users === -1 ? "Ilimitado" : limits.users}`
  );
  console.log(`   Storage: ${limits.storage}\n`);

  console.log(colors.title("🔐 CREDENCIALES DE ACCESO:\n"));
  console.log(`   Email: ${clientInfo.adminEmail}`);
  console.log(`   Password: ${clientInfo.adminPassword}`);
  console.log(`   Administrador: ${clientInfo.adminName}\n`);

  console.log(
    colors.warning("⚠️  IMPORTANTE: Guarda esta información de forma segura")
  );
  console.log(colors.info(`📄 Resumen guardado en: ${summaryFile}\n`));

  console.log(
    colors.title(
      "═══════════════════════════════════════════════════════════\n"
    )
  );
}

/**
 * Función principal
 */
async function main() {
  try {
    showBanner();

    // Verificar requisitos
    const reqOk = await checkRequirements();
    if (!reqOk) process.exit(1);

    // Recopilar información
    const clientInfo = await getClientInfo();

    // Confirmación
    console.log(colors.title("\n\n📋 RESUMEN DE CONFIGURACIÓN:\n"));
    console.log(`   Empresa: ${clientInfo.companyName}`);
    console.log(`   Proyecto: ${clientInfo.projectId}`);
    console.log(`   Admin: ${clientInfo.adminEmail}`);
    console.log(`   Plan: ${clientInfo.plan}\n`);

    const { confirmed } = await inquirer.prompt([
      {
        type: "confirm",
        name: "confirmed",
        message: "¿Continuar con la instalación?",
        default: true,
      },
    ]);

    if (!confirmed) {
      console.log(colors.warning("\n⚠️  Instalación cancelada\n"));
      process.exit(0);
    }

    console.log(colors.title("\n\n🚀 INICIANDO INSTALACIÓN...\n"));

    // Crear proyecto Firebase
    const projectOk = await createFirebaseProject(clientInfo);
    if (!projectOk) process.exit(1);

    // Configurar código fuente
    const workDir = await setupSourceCode(clientInfo);
    if (!workDir) process.exit(1);

    // Compilar aplicación
    const buildOk = await buildApplication(workDir);
    if (!buildOk) process.exit(1);

    // Desplegar
    const url = await deployToFirebase(workDir, clientInfo);
    if (!url) process.exit(1);

    // Crear administrador
    await createAdminUser(clientInfo);

    // Generar resumen
    generateSummary(clientInfo, url);

    console.log(colors.success("✅ ¡INSTALACIÓN COMPLETADA EXITOSAMENTE!\n"));

    // Limpiar directorio temporal (opcional)
    const { cleanup } = await inquirer.prompt([
      {
        type: "confirm",
        name: "cleanup",
        message: "🗑️  ¿Limpiar archivos temporales?",
        default: true,
      },
    ]);

    if (cleanup) {
      fs.rmSync(workDir, { recursive: true, force: true });
      console.log(colors.success("✅ Archivos temporales eliminados\n"));
    }
  } catch (error) {
    console.error(colors.error(`\n❌ Error fatal: ${error.message}\n`));
    process.exit(1);
  }
}

// Ejecutar
main();
