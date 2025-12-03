#!/usr/bin/env node

/**
 * PANEL DE ADMINISTRACIÓN - GESTIÓN DE SUSCRIPCIONES
 *
 * Permite:
 * - Ver lista de clientes
 * - Aprobar pagos
 * - Suspender suscripciones
 * - Ver estado de pagos
 *
 * @author David Monte
 */

import inquirer from "inquirer";
import chalk from "chalk";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import fs from "fs";
import path from "path";

const colors = {
  success: chalk.green,
  error: chalk.red,
  warning: chalk.yellow,
  info: chalk.cyan,
  title: chalk.bold.magenta,
};

// Tu proyecto Firebase MAESTRO donde guardas info de suscripciones
const MASTER_PROJECT_CONFIG = {
  projectId: "control-de-stock-e4f5f",
  // Aquí deberías tener el service account key
};

let db;

function showBanner() {
  console.clear();
  console.log(
    colors.title(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║            📊 PANEL DE ADMINISTRACIÓN                    ║
║              Gestión de Suscripciones                     ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `)
  );
}

async function initializeFirebase() {
  try {
    // Buscar service account key
    const serviceAccountPath = path.join(
      process.cwd(),
      "serviceAccountKey.json"
    );

    if (!fs.existsSync(serviceAccountPath)) {
      console.log(colors.error("\n❌ No se encontró serviceAccountKey.json"));
      console.log(colors.info("\n📋 Descárgalo desde:"));
      console.log(
        `   https://console.firebase.google.com/project/${MASTER_PROJECT_CONFIG.projectId}/settings/serviceaccounts/adminsdk\n`
      );
      process.exit(1);
    }

    const serviceAccount = JSON.parse(
      fs.readFileSync(serviceAccountPath, "utf8")
    );

    initializeApp({
      credential: cert(serviceAccount),
    });

    db = getFirestore();
    console.log(colors.success("\n✅ Conectado a Firebase\n"));
  } catch (error) {
    console.error(colors.error(`\n❌ Error: ${error.message}\n`));
    process.exit(1);
  }
}

async function listSubscriptions() {
  console.log(colors.title("\n📋 LISTA DE CLIENTES\n"));

  try {
    const subscriptionsRef = db.collection("subscriptions");
    const snapshot = await subscriptionsRef.get();

    if (snapshot.empty) {
      console.log(colors.warning("No hay clientes registrados.\n"));
      return [];
    }

    const subscriptions = [];
    snapshot.forEach((doc) => {
      subscriptions.push({ id: doc.id, ...doc.data() });
    });

    // Mostrar tabla
    console.table(
      subscriptions.map((sub) => ({
        "Project ID": sub.projectId || sub.id,
        Estado: sub.status,
        Plan: sub.plan || "N/A",
        Activo: sub.isActive ? "✅" : "❌",
        "Días restantes": sub.daysRemaining || "N/A",
      }))
    );

    return subscriptions;
  } catch (error) {
    console.error(colors.error(`Error: ${error.message}`));
    return [];
  }
}

async function approvePayment() {
  console.log(colors.title("\n💰 APROBAR PAGO\n"));

  const subscriptions = await listSubscriptions();
  if (subscriptions.length === 0) return;

  const answers = await inquirer.prompt([
    {
      type: "list",
      name: "projectId",
      message: "Selecciona el cliente:",
      choices: subscriptions.map((sub) => ({
        name: `${sub.projectId || sub.id} - ${sub.status}`,
        value: sub.projectId || sub.id,
      })),
    },
    {
      type: "list",
      name: "plan",
      message: "Selecciona el plan:",
      choices: ["BASIC", "PRO", "ENTERPRISE"],
    },
    {
      type: "input",
      name: "reference",
      message: "Referencia de pago (opcional):",
      default: "",
    },
    {
      type: "list",
      name: "method",
      message: "Método de pago:",
      choices: ["Mercado Pago", "PayPal", "Transferencia Bancaria", "Otro"],
    },
  ]);

  try {
    const subscriptionRef = db
      .collection("subscriptions")
      .doc(answers.projectId);

    const now = new Date();
    const nextBillingDate = new Date(now);
    nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);

    const plans = {
      BASIC: 40,
      PRO: 70,
      ENTERPRISE: 150,
    };

    await subscriptionRef.set(
      {
        status: "active",
        plan: answers.plan,
        isActive: true,
        approvedAt: now.toISOString(),
        approvedBy: "admin",
        paymentMethod: answers.method,
        lastPaymentDate: now.toISOString(),
        nextBillingDate: nextBillingDate.toISOString(),
        paymentAmount: plans[answers.plan],
        paymentReference: answers.reference,
        updatedAt: now.toISOString(),
      },
      { merge: true }
    );

    console.log(colors.success(`\n✅ Pago aprobado para ${answers.projectId}`));
    console.log(
      colors.info(`   Plan: ${answers.plan} ($${plans[answers.plan]} USD/mes)`)
    );
    console.log(
      colors.info(`   Próximo pago: ${nextBillingDate.toLocaleDateString()}\n`)
    );
  } catch (error) {
    console.error(colors.error(`\n❌ Error: ${error.message}\n`));
  }
}

async function suspendClient() {
  console.log(colors.title("\n⚠️  SUSPENDER CLIENTE\n"));

  const subscriptions = await listSubscriptions();
  if (subscriptions.length === 0) return;

  const answers = await inquirer.prompt([
    {
      type: "list",
      name: "projectId",
      message: "Selecciona el cliente a suspender:",
      choices: subscriptions
        .filter((sub) => sub.isActive)
        .map((sub) => ({
          name: `${sub.projectId || sub.id} - ${sub.plan}`,
          value: sub.projectId || sub.id,
        })),
    },
    {
      type: "input",
      name: "reason",
      message: "Razón de suspensión:",
      default: "Falta de pago",
    },
    {
      type: "confirm",
      name: "confirm",
      message: "¿Estás seguro?",
      default: false,
    },
  ]);

  if (!answers.confirm) {
    console.log(colors.warning("\n⚠️  Operación cancelada\n"));
    return;
  }

  try {
    const subscriptionRef = db
      .collection("subscriptions")
      .doc(answers.projectId);

    await subscriptionRef.set(
      {
        status: "suspended",
        isActive: false,
        suspendedAt: new Date().toISOString(),
        suspensionReason: answers.reason,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );

    console.log(
      colors.success(`\n✅ Cliente ${answers.projectId} suspendido\n`)
    );
  } catch (error) {
    console.error(colors.error(`\n❌ Error: ${error.message}\n`));
  }
}

async function viewPaymentHistory() {
  console.log(colors.title("\n💳 HISTORIAL DE PAGOS\n"));

  try {
    const subscriptionsRef = db.collection("subscriptions");
    const snapshot = await subscriptionsRef
      .where("status", "==", "active")
      .get();

    if (snapshot.empty) {
      console.log(
        colors.warning("No hay clientes activos con historial de pagos.\n")
      );
      return;
    }

    const payments = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      if (data.lastPaymentDate) {
        payments.push({
          Cliente: data.projectId || doc.id,
          Plan: data.plan,
          Monto: `$${data.paymentAmount} USD`,
          "Último Pago": new Date(data.lastPaymentDate).toLocaleDateString(),
          "Próximo Pago": new Date(data.nextBillingDate).toLocaleDateString(),
          Método: data.paymentMethod || "N/A",
        });
      }
    });

    console.table(payments);

    // Calcular ingresos totales
    const totalMonthly = payments.reduce((sum, p) => {
      return sum + parseInt(p.Monto.replace(/\D/g, ""));
    }, 0);

    console.log(
      colors.success(`\n💰 Ingreso mensual total: $${totalMonthly} USD\n`)
    );
  } catch (error) {
    console.error(colors.error(`Error: ${error.message}`));
  }
}

async function mainMenu() {
  const { action } = await inquirer.prompt([
    {
      type: "list",
      name: "action",
      message: "Selecciona una opción:",
      choices: [
        { name: "📋 Ver lista de clientes", value: "list" },
        { name: "💰 Aprobar pago", value: "approve" },
        { name: "⚠️  Suspender cliente", value: "suspend" },
        { name: "💳 Ver historial de pagos", value: "history" },
        { name: "🚪 Salir", value: "exit" },
      ],
    },
  ]);

  switch (action) {
    case "list":
      await listSubscriptions();
      break;
    case "approve":
      await approvePayment();
      break;
    case "suspend":
      await suspendClient();
      break;
    case "history":
      await viewPaymentHistory();
      break;
    case "exit":
      console.log(colors.info("\n👋 Hasta luego!\n"));
      process.exit(0);
  }

  // Volver al menú
  console.log("\n");
  await inquirer.prompt([
    {
      type: "confirm",
      name: "continue",
      message: "Presiona ENTER para continuar...",
      default: true,
    },
  ]);

  await mainMenu();
}

async function main() {
  showBanner();
  await initializeFirebase();
  await mainMenu();
}

main();
