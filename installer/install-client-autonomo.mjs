#!/usr/bin/env node

/**
 * CONTROL DE STOCK - INSTALADOR CLIENTE AUTÓNOMO
 * 
 * El CLIENTE crea y maneja su propio proyecto Firebase
 * TÚ solo instalas la aplicación en SU infraestructura
 * Sin acceso a datos, sin responsabilidad legal
 * 
 * @author David Monte
 * @version 2.0.0
 * @license PROPRIETARY
 */

import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const colors = {
  success: chalk.green,
  error: chalk.red,
  warning: chalk.yellow,
  info: chalk.cyan,
  title: chalk.bold.magenta
};

/**
 * Banner
 */
function showBanner() {
  console.clear();
  console.log(colors.title(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║        🔐  INSTALADOR AUTÓNOMO - CLIENTE GESTIONA        ║
║                      SUS PROPIOS DATOS                    ║
║                                                           ║
║              Control de Stock v2.0                        ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `));
  console.log(colors.warning('\n⚠️  IMPORTANTE: El cliente debe tener su proyecto Firebase listo\n'));
}

/**
 * Instrucciones para el cliente
 */
function showClientInstructions() {
  console.log(colors.title('\n📋 INSTRUCCIONES PARA EL CLIENTE\n'));
  console.log(colors.info('El cliente debe completar estos pasos ANTES de la instalación:\n'));
  
  console.log(colors.warning('1️⃣  CREAR PROYECTO FIREBASE:'));
  console.log('   → Ir a: https://console.firebase.google.com');
  console.log('   → Clic en "Agregar proyecto"');
  console.log('   → Nombre: [nombre-de-su-empresa]');
  console.log('   → Aceptar términos y crear\n');
  
  console.log(colors.warning('2️⃣  ACTIVAR FIRESTORE:'));
  console.log('   → En el proyecto, ir a "Firestore Database"');
  console.log('   → Clic en "Crear base de datos"');
  console.log('   → Modo: "Iniciar en modo de producción"');
  console.log('   → Ubicación: Preferentemente "southamerica-east1" (São Paulo)\n');
  
  console.log(colors.warning('3️⃣  ACTIVAR AUTHENTICATION:'));
  console.log('   → Ir a "Authentication"');
  console.log('   → Clic en "Comenzar"');
  console.log('   → En "Sign-in method", activar "Correo electrónico/contraseña"\n');
  
  console.log(colors.warning('4️⃣  ACTIVAR HOSTING:'));
  console.log('   → Ir a "Hosting"');
  console.log('   → Clic en "Comenzar"');
  console.log('   → Seguir los pasos (lo haremos desde aquí)\n');
  
  console.log(colors.warning('5️⃣  OBTENER CREDENCIALES:'));
  console.log('   → En "Configuración del proyecto" (⚙️)');
  console.log('   → Ir a "Tus aplicaciones"');
  console.log('   → Clic en "Agregar app" → Web (</>)');
  console.log('   → Registrar app');
  console.log('   → Copiar TODO el objeto de configuración\n');
  
  console.log(colors.warning('6️⃣  AGREGAR PERMISOS TEMPORALES:'));
  console.log('   → En "IAM y administración"');
  console.log('   → Agregar tu email como "Editor"');
  console.log('   → (Después de la instalación lo puedes quitar)\n');
  
  console.log(colors.success('✅ Una vez completado, presiona ENTER para continuar...\n'));
}

/**
 * Recopilar credenciales de Firebase del cliente
 */
async function getFirebaseCredentials() {
  console.log(colors.title('\n🔑 CREDENCIALES DE FIREBASE DEL CLIENTE\n'));
  console.log(colors.info('Pídele al cliente que te proporcione esta información:\n'));
  
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'projectId',
      message: '📦 Project ID:',
      validate: (input) => {
        if (!input) return 'Project ID es requerido';
        if (!/^[a-z0-9-]+$/.test(input)) return 'Solo letras minúsculas, números y guiones';
        return true;
      }
    },
    {
      type: 'input',
      name: 'apiKey',
      message: '🔑 API Key:',
      validate: (input) => input.length > 0 || 'API Key es requerida'
    },
    {
      type: 'input',
      name: 'authDomain',
      message: '🌐 Auth Domain:',
      default: (answers) => `${answers.projectId}.firebaseapp.com`,
      validate: (input) => input.length > 0 || 'Auth Domain es requerido'
    },
    {
      type: 'input',
      name: 'storageBucket',
      message: '📦 Storage Bucket:',
      default: (answers) => `${answers.projectId}.appspot.com`,
      validate: (input) => input.length > 0 || 'Storage Bucket es requerido'
    },
    {
      type: 'input',
      name: 'messagingSenderId',
      message: '📨 Messaging Sender ID:',
      validate: (input) => input.length > 0 || 'Messaging Sender ID es requerido'
    },
    {
      type: 'input',
      name: 'appId',
      message: '🆔 App ID:',
      validate: (input) => input.length > 0 || 'App ID es requerido'
    }
  ]);
  
  return answers;
}

/**
 * Recopilar información del administrador
 */
async function getAdminInfo() {
  console.log(colors.title('\n👤 INFORMACIÓN DEL ADMINISTRADOR\n'));
  
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'companyName',
      message: '🏢 Nombre de la empresa:',
      validate: (input) => input.length > 0 || 'El nombre es requerido'
    },
    {
      type: 'input',
      name: 'adminName',
      message: '👤 Nombre completo del administrador:',
      validate: (input) => input.length > 0 || 'El nombre es requerido'
    },
    {
      type: 'input',
      name: 'adminEmail',
      message: '📧 Email del administrador:',
      validate: (input) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(input) || 'Email inválido';
      }
    },
    {
      type: 'password',
      name: 'adminPassword',
      message: '🔑 Contraseña inicial (mínimo 6 caracteres):',
      mask: '*',
      validate: (input) => {
        if (!input || input.length === 0) return 'La contraseña es requerida';
        if (input.length < 6) return 'Mínimo 6 caracteres';
        return true;
      }
    },
    {
      type: 'confirm',
      name: 'loadSampleData',
      message: '📊 ¿Cargar datos de ejemplo?',
      default: true
    }
  ]);
  
  return answers;
}

/**
 * Preparar código fuente
 */
async function setupSourceCode(firebase, admin) {
  const spinner = ora('Preparando código fuente...').start();
  const workDir = path.join(__dirname, 'temp', firebase.projectId);
  
  try {
    // Crear directorio
    if (!fs.existsSync(workDir)) {
      fs.mkdirSync(workDir, { recursive: true });
    }
    
    spinner.text = 'Copiando archivos...';
    
    // Copiar desde directorio padre
    const sourceDir = path.join(__dirname, '..');
    const filesToCopy = [
      'package.json',
      'vite.config.js',
      'index.html',
      'firebase.json'
    ];
    
    for (const file of filesToCopy) {
      const source = path.join(sourceDir, file);
      if (fs.existsSync(source)) {
        fs.copyFileSync(source, path.join(workDir, file));
      }
    }
    
    // Copiar directorios
    const dirsToCopy = ['src', 'public'];
    for (const dir of dirsToCopy) {
      const source = path.join(sourceDir, dir);
      const dest = path.join(workDir, dir);
      if (fs.existsSync(source)) {
        fs.cpSync(source, dest, { recursive: true });
      }
    }
    
    spinner.text = 'Configurando variables de entorno...';
    
    // Crear .env con credenciales del cliente
    const envContent = `
VITE_FIREBASE_API_KEY=${firebase.apiKey}
VITE_FIREBASE_AUTH_DOMAIN=${firebase.authDomain}
VITE_FIREBASE_PROJECT_ID=${firebase.projectId}
VITE_FIREBASE_STORAGE_BUCKET=${firebase.storageBucket}
VITE_FIREBASE_MESSAGING_SENDER_ID=${firebase.messagingSenderId}
VITE_FIREBASE_APP_ID=${firebase.appId}
`;
    
    fs.writeFileSync(path.join(workDir, '.env.production'), envContent.trim());
    
    // Configurar .firebaserc
    const firebaserc = {
      projects: {
        default: firebase.projectId
      }
    };
    fs.writeFileSync(
      path.join(workDir, '.firebaserc'),
      JSON.stringify(firebaserc, null, 2)
    );
    
    // Copiar reglas de Firestore
    spinner.text = 'Copiando reglas de seguridad...';
    const rulesSource = path.join(sourceDir, 'firestore.rules');
    if (fs.existsSync(rulesSource)) {
      fs.copyFileSync(rulesSource, path.join(workDir, 'firestore.rules'));
    }
    
    spinner.succeed(`✅ Código configurado en: ${workDir}`);
    return workDir;
  } catch (error) {
    spinner.fail(`Error: ${error.message}`);
    return null;
  }
}

/**
 * Instalar dependencias y compilar
 */
async function buildApplication(workDir) {
  const spinner = ora('Instalando dependencias...').start();
  
  try {
    execSync('npm install', {
      cwd: workDir,
      stdio: 'pipe'
    });
    
    spinner.text = 'Compilando aplicación...';
    
    execSync('npm run build', {
      cwd: workDir,
      stdio: 'pipe'
    });
    
    spinner.succeed('✅ Aplicación compilada');
    return true;
  } catch (error) {
    spinner.fail(`Error: ${error.message}`);
    return false;
  }
}

/**
 * Iniciar sesión en Firebase CLI con cuenta del cliente
 */
async function loginFirebase() {
  const spinner = ora('Iniciando sesión en Firebase...').start();
  
  try {
    console.log('\n');
    spinner.info('Se abrirá el navegador para que el cliente autorice el acceso...');
    console.log(colors.warning('\n⚠️  IMPORTANTE: Usa la cuenta de Google del CLIENTE\n'));
    
    execSync('firebase login', {
      stdio: 'inherit'
    });
    
    spinner.succeed('✅ Sesión iniciada');
    return true;
  } catch (error) {
    spinner.fail('Error al iniciar sesión');
    return false;
  }
}

/**
 * Desplegar reglas de Firestore
 */
async function deployFirestoreRules(workDir, projectId) {
  const spinner = ora('Desplegando reglas de seguridad...').start();
  
  try {
    execSync(`firebase deploy --only firestore:rules --project ${projectId}`, {
      cwd: workDir,
      stdio: 'pipe'
    });
    
    spinner.succeed('✅ Reglas de Firestore desplegadas');
    return true;
  } catch (error) {
    spinner.fail(`Error: ${error.message}`);
    return false;
  }
}

/**
 * Desplegar aplicación
 */
async function deployToFirebase(workDir, projectId) {
  const spinner = ora('Desplegando aplicación...').start();
  
  try {
    execSync(`firebase deploy --only hosting --project ${projectId}`, {
      cwd: workDir,
      stdio: 'pipe'
    });
    
    const url = `https://${projectId}.web.app`;
    spinner.succeed(`✅ App desplegada: ${colors.info(url)}`);
    
    return url;
  } catch (error) {
    spinner.fail(`Error: ${error.message}`);
    return null;
  }
}

/**
 * Generar script de inicialización para el cliente
 */
function generateInitScript(admin, firebase) {
  const scriptContent = `
/**
 * Script de inicialización - EJECUTAR UNA SOLA VEZ
 * Crear usuario administrador en Firebase Authentication
 */

import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "${firebase.apiKey}",
  authDomain: "${firebase.authDomain}",
  projectId: "${firebase.projectId}",
  storageBucket: "${firebase.storageBucket}",
  messagingSenderId: "${firebase.messagingSenderId}",
  appId: "${firebase.appId}"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function createAdmin() {
  try {
    console.log("Creando usuario administrador...");
    
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      "${admin.adminEmail}",
      "${admin.adminPassword}"
    );
    
    const uid = userCredential.user.uid;
    
    await setDoc(doc(db, "users", uid), {
      uid: uid,
      name: "${admin.adminName}",
      email: "${admin.adminEmail}",
      role: "admin",
      active: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    console.log("✅ Usuario administrador creado correctamente");
    console.log("Email:", "${admin.adminEmail}");
    console.log("UID:", uid);
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

createAdmin();
`;

  return scriptContent;
}

/**
 * Generar documentación para el cliente
 */
function generateClientDocumentation(admin, firebase, url) {
  const docContent = `
# 📋 DOCUMENTACIÓN DE INSTALACIÓN

## ✅ INSTALACIÓN COMPLETADA

**Fecha:** ${new Date().toLocaleDateString()}
**Empresa:** ${admin.companyName}
**URL:** ${url}

---

## 🔐 CREDENCIALES DE ACCESO

**Email:** ${admin.adminEmail}
**Contraseña:** ${admin.adminPassword}

⚠️ **IMPORTANTE:** Cambia tu contraseña al primer ingreso desde:
Configuración → Cambiar Contraseña

---

## 🎯 TU PROYECTO FIREBASE

**Project ID:** ${firebase.projectId}
**Consola:** https://console.firebase.google.com/project/${firebase.projectId}

### Acceso a tu Consola Firebase:

1. **Firestore Database:**
   - Ver/editar todos tus datos
   - Backups manuales
   - Exportar colecciones

2. **Authentication:**
   - Gestionar usuarios
   - Ver actividad de login
   - Resetear contraseñas

3. **Hosting:**
   - Historial de despliegues
   - Configurar dominio personalizado
   - SSL automático

---

## 💾 TUS DATOS

### ✅ Control Total:
- ✅ Todos los datos están en TU proyecto Firebase
- ✅ TÚ pagas el hosting directamente a Google
- ✅ TÚ tienes el control administrativo total
- ✅ Puedes hacer backups cuando quieras
- ✅ Puedes exportar todos tus datos

### 📊 Costos de Firebase:

**Plan Spark (Gratis):**
- Hasta 50,000 lecturas/día
- 20,000 escrituras/día
- 1GB almacenamiento
- **Suficiente para empresas pequeñas**

**Plan Blaze (Pago por uso):**
- Solo pagas lo que usas
- Estimado: $5-20 USD/mes para empresa mediana
- $30-50 USD/mes para empresa grande

Ver precios: https://firebase.google.com/pricing

---

## 🔒 SEGURIDAD Y PRIVACIDAD

### ✅ Garantías:

1. **Tus datos son 100% TUYOS**
   - El desarrollador NO tiene acceso permanente
   - Solo acceso temporal durante instalación
   - Puedes revocar permisos cuando quieras

2. **Cumplimiento Legal:**
   - Datos alojados en Google Cloud (certificado)
   - Cumple GDPR y normativas internacionales
   - Backups automáticos por Google

3. **Revocar Accesos:**
   - Ir a: https://console.firebase.google.com/project/${firebase.projectId}/settings/iam
   - Eliminar usuarios externos
   - Solo TÚ mantén acceso de propietario

---

## 🛠️ MANTENIMIENTO

### Backups Recomendados:

1. **Backup Manual (Mensual):**
   \`\`\`
   - Firestore → Exportar datos
   - Guardar en Google Drive
   \`\`\`

2. **Backup Automático:**
   - Configurar desde Firebase Console
   - Cloud Scheduler + Cloud Functions
   - Costo: ~$5/mes

### Actualizaciones:

**El desarrollador puede:**
- Actualizar el código de la aplicación
- Desplegar nuevas funcionalidades
- Corregir bugs

**Requiere:**
- Tu autorización temporal
- Acceso limitado al proyecto
- Puede revocar después

---

## 📞 SOPORTE

**Desarrollador:** David Monte
**Email:** montedavid07@hotmail.com
**WhatsApp:** [Tu número]

### Incluye:
- ✅ Soporte técnico por email
- ✅ Respuesta en 24-48 horas
- ✅ Actualizaciones del sistema
- ✅ Capacitación inicial (2 horas)

### NO incluye:
- ❌ Costos de Firebase (pagas directamente a Google)
- ❌ Soporte 24/7 (disponible en plan premium)
- ❌ Desarrollo de funcionalidades custom

---

## 📚 RECURSOS

**Manual de Usuario:**
[Link a PDF o video]

**Tutoriales:**
- Cómo crear un material
- Cómo registrar movimientos
- Cómo generar reportes PDF
- Cómo gestionar usuarios

**Consola Firebase:**
https://console.firebase.google.com/project/${firebase.projectId}

---

## ⚠️ IMPORTANTE

### Guarda esta información:
- ✅ Credenciales de acceso
- ✅ Project ID de Firebase
- ✅ Este documento

### Primeros pasos:
1. Cambiar contraseña de admin
2. Crear usuarios adicionales
3. Cargar tus materiales
4. Configurar categorías personalizadas

---

**Fecha de instalación:** ${new Date().toISOString()}
**Versión del sistema:** 2.0.0
**Estado:** ✅ Operativo
`;

  return docContent;
}

/**
 * Función principal
 */
async function main() {
  try {
    showBanner();
    
    // Mostrar instrucciones
    showClientInstructions();
    await inquirer.prompt([{
      type: 'confirm',
      name: 'ready',
      message: '¿El cliente completó todos los pasos?',
      default: false
    }]).then(answers => {
      if (!answers.ready) {
        console.log(colors.warning('\n⚠️  Instalación cancelada. Completa los pasos primero.\n'));
        process.exit(0);
      }
    });
    
    // Recopilar credenciales
    const firebase = await getFirebaseCredentials();
    const admin = await getAdminInfo();
    
    // Confirmación
    console.log(colors.title('\n\n📋 RESUMEN:\n'));
    console.log(`   Empresa: ${admin.companyName}`);
    console.log(`   Firebase Project: ${firebase.projectId}`);
    console.log(`   Admin: ${admin.adminEmail}\n`);
    
    const { confirmed } = await inquirer.prompt([{
      type: 'confirm',
      name: 'confirmed',
      message: '¿Continuar con la instalación?',
      default: true
    }]);
    
    if (!confirmed) {
      console.log(colors.warning('\n⚠️  Instalación cancelada\n'));
      process.exit(0);
    }
    
    console.log(colors.title('\n\n🚀 INICIANDO INSTALACIÓN...\n'));
    
    // Login en Firebase (con cuenta del cliente)
    const loginOk = await loginFirebase();
    if (!loginOk) process.exit(1);
    
    // Preparar código
    const workDir = await setupSourceCode(firebase, admin);
    if (!workDir) process.exit(1);
    
    // Compilar
    const buildOk = await buildApplication(workDir);
    if (!buildOk) process.exit(1);
    
    // Desplegar reglas
    await deployFirestoreRules(workDir, firebase.projectId);
    
    // Desplegar app
    const url = await deployToFirebase(workDir, firebase.projectId);
    if (!url) process.exit(1);
    
    // Generar script de inicialización
    console.log(colors.title('\n📝 Generando documentación...\n'));
    
    const initScript = generateInitScript(admin, firebase);
    const initScriptPath = path.join(workDir, 'createAdmin.mjs');
    fs.writeFileSync(initScriptPath, initScript);
    
    const documentation = generateClientDocumentation(admin, firebase, url);
    const docPath = path.join(workDir, 'INSTALACION_COMPLETA.md');
    fs.writeFileSync(docPath, documentation);
    
    // Resumen final
    console.log(colors.title('\n\n═══════════════════════════════════════════════════════════'));
    console.log(colors.title('             ✅ INSTALACIÓN COMPLETADA                      '));
    console.log(colors.title('═══════════════════════════════════════════════════════════\n'));
    
    console.log(colors.success(`🌐 URL: ${url}\n`));
    
    console.log(colors.warning('📋 PRÓXIMOS PASOS PARA EL CLIENTE:\n'));
    console.log('1️⃣  Crear usuario administrador:');
    console.log(`   cd ${workDir}`);
    console.log('   npm install firebase');
    console.log('   node createAdmin.mjs\n');
    
    console.log('2️⃣  Iniciar sesión en la aplicación:\');
    console.log(`   URL: ${url}`);
    console.log(`   Email: ${admin.adminEmail}`);
    console.log(`   Password: ${admin.adminPassword}\n`);
    
    console.log('3️⃣  Cambiar contraseña desde Configuración\n');
    
    console.log('4️⃣  Revocar tu acceso (opcional):');
    console.log(`   https://console.firebase.google.com/project/${firebase.projectId}/settings/iam`);
    console.log('   Eliminar tu usuario de la lista\n');
    
    console.log(colors.info(`📄 Documentación completa: ${docPath}\n`));
    
    console.log(colors.title('═══════════════════════════════════════════════════════════\n'));
    
    console.log(colors.success('✅ El cliente ahora tiene CONTROL TOTAL de sus datos\n'));
    console.log(colors.info('💡 Envíale el archivo INSTALACION_COMPLETA.md\n'));
    
  } catch (error) {
    console.error(colors.error(`\n❌ Error: ${error.message}\n`));
    process.exit(1);
  }
}

main();
