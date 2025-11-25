// switch-client.js
// Script para cambiar entre configuraciones de clientes

const fs = require('fs');
const path = require('path');

const clients = {
  demo: '.env.demo',
  cliente1: '.env.cliente1',
  cliente2: '.env.cliente2',
  production: '.env.production',
};

const clientName = process.argv[2];

// Colores para la consola
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

console.log('\n' + colors.cyan + '🔄 Switch Client Configuration' + colors.reset + '\n');

if (!clientName || !clients[clientName]) {
  console.error(colors.red + '❌ Cliente no válido' + colors.reset);
  console.log(colors.yellow + '\n📋 Clientes disponibles:' + colors.reset);
  Object.keys(clients).forEach(client => {
    const exists = fs.existsSync(clients[client]) ? '✓' : '✗';
    console.log(`   ${exists} ${client} → ${clients[client]}`);
  });
  console.log('\n' + colors.blue + '💡 Uso: node switch-client.js [cliente]' + colors.reset);
  console.log(colors.blue + '   Ejemplo: node switch-client.js demo\n' + colors.reset);
  process.exit(1);
}

const sourceFile = clients[clientName];
const targetFile = '.env';
const backupFile = '.env.backup';

// Verificar que existe el archivo fuente
if (!fs.existsSync(sourceFile)) {
  console.error(colors.red + `❌ Archivo ${sourceFile} no encontrado` + colors.reset);
  console.log(colors.yellow + '\n💡 Crea el archivo basándote en .env.example' + colors.reset + '\n');
  process.exit(1);
}

// Backup del .env actual
if (fs.existsSync(targetFile)) {
  try {
    fs.copyFileSync(targetFile, backupFile);
    console.log(colors.green + '💾 Backup creado: ' + colors.reset + backupFile);
  } catch (error) {
    console.warn(colors.yellow + '⚠️  No se pudo crear backup' + colors.reset);
  }
}

// Copiar configuración del cliente
try {
  fs.copyFileSync(sourceFile, targetFile);
  console.log(colors.green + '✅ Configuración cambiada exitosamente' + colors.reset);
  console.log(colors.cyan + '📁 Cliente activo: ' + colors.reset + colors.green + clientName + colors.reset);
  console.log(colors.cyan + '📄 Archivo usado: ' + colors.reset + sourceFile);
  
  // Leer y mostrar algunas variables importantes
  const envContent = fs.readFileSync(targetFile, 'utf8');
  const projectId = envContent.match(/VITE_FIREBASE_PROJECT_ID=(.+)/)?.[1];
  const appMode = envContent.match(/VITE_APP_MODE=(.+)/)?.[1];
  
  if (projectId) {
    console.log(colors.cyan + '🔥 Firebase Project: ' + colors.reset + projectId);
  }
  if (appMode) {
    console.log(colors.cyan + '🎯 App Mode: ' + colors.reset + appMode);
  }
  
  console.log('\n' + colors.yellow + '⚠️  IMPORTANTE: Reinicia el servidor de desarrollo' + colors.reset);
  console.log(colors.blue + '   npm run dev\n' + colors.reset);
  
} catch (error) {
  console.error(colors.red + '❌ Error al copiar configuración: ' + colors.reset + error.message);
  process.exit(1);
}
