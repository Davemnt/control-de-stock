#!/usr/bin/env node

/**
 * GUÍA RÁPIDA - SISTEMA DE SUSCRIPCIONES
 * Cómo usar el sistema paso a paso
 */

import chalk from "chalk";

console.clear();
console.log(
  chalk.bold.magenta(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║         🎯 GUÍA RÁPIDA - SISTEMA DE SUSCRIPCIONES        ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
`)
);

console.log(chalk.cyan("\n📋 PASOS PARA EMPEZAR:\n"));

console.log(chalk.white("1️⃣  CONFIGURACIÓN INICIAL (Una sola vez)\n"));
console.log(chalk.yellow("   → Descargar Service Account Key:"));
console.log(
  "     https://console.firebase.google.com/project/control-de-stock-e4f5f/settings/serviceaccounts/adminsdk"
);
console.log("     Guardar como: installer/serviceAccountKey.json\n");

console.log(chalk.white("2️⃣  INSTALAR UN CLIENTE\n"));
console.log(chalk.yellow("   → Cliente nuevo (autónomo):"));
console.log("     cd installer");
console.log("     npm run install-autonomo\n");
console.log(
  chalk.gray(
    "   (El instalador crea automáticamente la suscripción de prueba)\n"
  )
);

console.log(chalk.white("3️⃣  CLIENTE USA LA APP (7 días de prueba)\n"));
console.log(chalk.green("   ✅ Días 1-4: App funciona normal"));
console.log(chalk.yellow('   ⚠️  Días 5-7: Banner "Te quedan X días"'));
console.log(chalk.red("   🔒 Día 8+: App bloqueada, mensaje de pago\n"));

console.log(chalk.white("4️⃣  CLIENTE QUIERE PAGAR\n"));
console.log(chalk.yellow("   → Enviarle link de Mercado Pago:"));
console.log("     Plan Básico ($40/mes): https://mpago.la/tu-link");
console.log("     Plan PRO ($70/mes): https://mpago.la/tu-link");
console.log("     Plan Enterprise ($150/mes): https://mpago.la/tu-link\n");

console.log(chalk.white("5️⃣  APROBAR EL PAGO\n"));
console.log(chalk.yellow("   → Una vez recibido el pago:"));
console.log("     cd installer");
console.log("     npm run admin\n");
console.log(chalk.gray("   En el menú selecciona:"));
console.log("   2. Aprobar pago");
console.log("   → Selecciona cliente");
console.log("   → Selecciona plan");
console.log("   → Ingresa referencia de pago");
console.log(
  chalk.green("   ✅ App del cliente se desbloquea automáticamente\n")
);

console.log(chalk.white("6️⃣  GESTIÓN MENSUAL\n"));
console.log(chalk.yellow("   → Panel de administración:"));
console.log("     npm run admin\n");
console.log("   Opciones:");
console.log("   1. Ver lista de clientes");
console.log("   2. Aprobar pago");
console.log("   3. Suspender cliente (si no paga)");
console.log("   4. Ver historial de pagos\n");

console.log(
  chalk.bold.green(
    "\n═══════════════════════════════════════════════════════════\n"
  )
);
console.log(chalk.white("💡 TIPS IMPORTANTES:\n"));
console.log(chalk.cyan("• Demo NO tiene restricciones de suscripción"));
console.log(
  chalk.cyan("• Cada cliente de producción tiene su propia suscripción")
);
console.log(chalk.cyan("• Puedes suspender clientes que no paguen"));
console.log(chalk.cyan("• El sistema valida automáticamente en cada carga\n"));

console.log(
  chalk.bold.magenta(
    "═══════════════════════════════════════════════════════════\n"
  )
);
console.log(chalk.white("📚 DOCUMENTACIÓN COMPLETA:\n"));
console.log("   installer/SISTEMA_SUSCRIPCIONES.md\n");

console.log(chalk.gray("Presiona Ctrl+C para salir\n"));
