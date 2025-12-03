/**
 * SISTEMA DE SUSCRIPCIONES Y CONTROL DE PAGOS
 *
 * Gestiona:
 * - Período de prueba (7-30 días)
 * - Validación de pagos
 * - Bloqueo de app si no paga
 * - Estado de suscripción
 *
 * @author David Monte
 * @version 1.0.0
 */

import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config";

/**
 * Estados de suscripción
 */
export const SUBSCRIPTION_STATUS = {
  TRIAL: "trial", // Período de prueba activo
  TRIAL_EXPIRED: "trial_expired", // Prueba expirada, bloqueado
  ACTIVE: "active", // Pago y activo
  SUSPENDED: "suspended", // Suspendido por falta de pago
  CANCELLED: "cancelled", // Cancelado permanentemente
};

/**
 * Planes disponibles
 */
export const PLANS = {
  TRIAL: {
    name: "Prueba Gratuita",
    duration: 7, // días
    price: 0,
  },
  BASIC: {
    name: "Plan Básico",
    price: 40, // USD/mes
    features: ["Hasta 50 usuarios", "Reportes básicos", "Soporte email"],
  },
  PRO: {
    name: "Plan Profesional",
    price: 70,
    features: [
      "Usuarios ilimitados",
      "Reportes avanzados",
      "Soporte prioritario",
      "API access",
    ],
  },
  ENTERPRISE: {
    name: "Plan Empresarial",
    price: 150,
    features: [
      "Todo en Pro",
      "Soporte 24/7",
      "Personalización",
      "Servidor dedicado",
    ],
  },
};

/**
 * Obtener información de suscripción del cliente
 */
export async function getSubscriptionInfo(projectId) {
  try {
    const subscriptionRef = doc(db, "subscriptions", projectId);
    const subscriptionDoc = await getDoc(subscriptionRef);

    if (!subscriptionDoc.exists()) {
      // Primera vez, crear suscripción de prueba
      return await initializeTrialSubscription(projectId);
    }

    return subscriptionDoc.data();
  } catch (error) {
    console.error("Error getting subscription:", error);
    return null;
  }
}

/**
 * Inicializar período de prueba
 */
export async function initializeTrialSubscription(projectId) {
  const trialDuration = PLANS.TRIAL.duration; // 7 días
  const now = new Date();
  const trialEnd = new Date(
    now.getTime() + trialDuration * 24 * 60 * 60 * 1000
  );

  const subscriptionData = {
    projectId,
    status: SUBSCRIPTION_STATUS.TRIAL,
    plan: "TRIAL",
    trialStartDate: serverTimestamp(),
    trialEndDate: trialEnd.toISOString(),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    isActive: true,
    daysRemaining: trialDuration,
  };

  try {
    const subscriptionRef = doc(db, "subscriptions", projectId);
    await setDoc(subscriptionRef, subscriptionData);
    return subscriptionData;
  } catch (error) {
    console.error("Error initializing trial:", error);
    return null;
  }
}

/**
 * Verificar si la suscripción está activa
 */
export function isSubscriptionActive(subscriptionInfo) {
  if (!subscriptionInfo) return false;

  const { status, trialEndDate } = subscriptionInfo;

  // Si es de prueba, verificar fecha
  if (status === SUBSCRIPTION_STATUS.TRIAL) {
    const now = new Date();
    const endDate = new Date(trialEndDate);
    return now < endDate;
  }

  // Si está pagada, verificar estado
  return status === SUBSCRIPTION_STATUS.ACTIVE;
}

/**
 * Obtener días restantes de prueba
 */
export function getDaysRemaining(subscriptionInfo) {
  if (!subscriptionInfo || !subscriptionInfo.trialEndDate) return 0;

  const now = new Date();
  const endDate = new Date(subscriptionInfo.trialEndDate);
  const diffTime = endDate - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays > 0 ? diffDays : 0;
}

/**
 * Aprobar pago y activar suscripción
 * (Esta función la ejecutas TÚ desde un panel admin)
 */
export async function approvePayment(projectId, plan, paymentInfo) {
  try {
    const subscriptionRef = doc(db, "subscriptions", projectId);

    const now = new Date();
    const nextBillingDate = new Date(now);
    nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);

    const updateData = {
      status: SUBSCRIPTION_STATUS.ACTIVE,
      plan: plan,
      isActive: true,
      approvedAt: serverTimestamp(),
      approvedBy: paymentInfo.approvedBy || "admin",
      paymentMethod: paymentInfo.method || "manual",
      lastPaymentDate: serverTimestamp(),
      nextBillingDate: nextBillingDate.toISOString(),
      paymentAmount: PLANS[plan]?.price || 0,
      paymentReference: paymentInfo.reference || "",
      updatedAt: serverTimestamp(),
    };

    await setDoc(subscriptionRef, updateData, { merge: true });

    console.log(`✅ Payment approved for ${projectId} - Plan: ${plan}`);
    return true;
  } catch (error) {
    console.error("Error approving payment:", error);
    return false;
  }
}

/**
 * Suspender suscripción por falta de pago
 */
export async function suspendSubscription(projectId, reason) {
  try {
    const subscriptionRef = doc(db, "subscriptions", projectId);

    await setDoc(
      subscriptionRef,
      {
        status: SUBSCRIPTION_STATUS.SUSPENDED,
        isActive: false,
        suspendedAt: serverTimestamp(),
        suspensionReason: reason || "Falta de pago",
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    console.log(`⚠️ Subscription suspended for ${projectId}`);
    return true;
  } catch (error) {
    console.error("Error suspending subscription:", error);
    return false;
  }
}

/**
 * Expirar período de prueba
 */
export async function expireTrialSubscription(projectId) {
  try {
    const subscriptionRef = doc(db, "subscriptions", projectId);

    await setDoc(
      subscriptionRef,
      {
        status: SUBSCRIPTION_STATUS.TRIAL_EXPIRED,
        isActive: false,
        expiredAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    console.log(`⏰ Trial expired for ${projectId}`);
    return true;
  } catch (error) {
    console.error("Error expiring trial:", error);
    return false;
  }
}

/**
 * Obtener mensaje para el cliente según estado
 */
export function getSubscriptionMessage(subscriptionInfo) {
  if (!subscriptionInfo) {
    return {
      type: "error",
      title: "Error",
      message: "No se pudo obtener información de suscripción.",
    };
  }

  const { status } = subscriptionInfo;
  const daysRemaining = getDaysRemaining(subscriptionInfo);

  switch (status) {
    case SUBSCRIPTION_STATUS.TRIAL:
      if (daysRemaining <= 3) {
        return {
          type: "warning",
          title: "Período de prueba por vencer",
          message: `Te quedan ${daysRemaining} días de prueba gratuita. Contacta al administrador para activar tu suscripción.`,
        };
      }
      return {
        type: "info",
        title: "Período de prueba activo",
        message: `Tienes ${daysRemaining} días restantes de prueba gratuita.`,
      };

    case SUBSCRIPTION_STATUS.TRIAL_EXPIRED:
      return {
        type: "error",
        title: "Período de prueba expirado",
        message:
          "Tu período de prueba ha finalizado. Contacta al administrador para activar tu suscripción y continuar usando el sistema.",
      };

    case SUBSCRIPTION_STATUS.ACTIVE:
      return {
        type: "success",
        title: "Suscripción activa",
        message: `Plan ${
          subscriptionInfo.plan
        } activo. Próximo pago: ${new Date(
          subscriptionInfo.nextBillingDate
        ).toLocaleDateString()}`,
      };

    case SUBSCRIPTION_STATUS.SUSPENDED:
      return {
        type: "error",
        title: "Suscripción suspendida",
        message:
          "Tu suscripción ha sido suspendida. Por favor, contacta al administrador para renovar tu plan.",
      };

    case SUBSCRIPTION_STATUS.CANCELLED:
      return {
        type: "error",
        title: "Suscripción cancelada",
        message:
          "Tu suscripción ha sido cancelada. Contacta al administrador si deseas reactivarla.",
      };

    default:
      return {
        type: "info",
        title: "Estado desconocido",
        message: "Contacta al administrador.",
      };
  }
}
