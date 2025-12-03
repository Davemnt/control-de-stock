/**
 * COMPONENTE DE PROTECCIÓN DE SUSCRIPCIÓN
 *
 * Verifica el estado de suscripción y bloquea la app si:
 * - Período de prueba expirado
 * - Suscripción suspendida
 * - Suscripción cancelada
 */

import React, { useEffect, useState } from "react";
import { AlertCircle, Lock, Clock, CreditCard } from "lucide-react";
import {
  getSubscriptionInfo,
  isSubscriptionActive,
  getDaysRemaining,
  getSubscriptionMessage,
  SUBSCRIPTION_STATUS,
} from "../../utils/subscriptionManager";
import "./SubscriptionGuard.css";

const SubscriptionGuard = ({ children, projectId }) => {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    checkSubscription();
  }, [projectId]);

  const checkSubscription = async () => {
    try {
      const info = await getSubscriptionInfo(projectId);
      setSubscription(info);

      const active = isSubscriptionActive(info);
      setBlocked(!active);
    } catch (error) {
      console.error("Error checking subscription:", error);
      setBlocked(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="subscription-loading">
        <div className="spinner"></div>
        <p>Verificando suscripción...</p>
      </div>
    );
  }

  if (blocked) {
    const message = getSubscriptionMessage(subscription);

    return (
      <div className="subscription-blocked">
        <div className="subscription-blocked-card">
          <div className="subscription-blocked-icon">
            {subscription?.status === SUBSCRIPTION_STATUS.TRIAL_EXPIRED ? (
              <Clock size={64} />
            ) : (
              <Lock size={64} />
            )}
          </div>

          <h1>{message.title}</h1>
          <p className="subscription-blocked-message">{message.message}</p>

          <div className="subscription-contact-info">
            <CreditCard size={20} />
            <div>
              <strong>Contacta al administrador:</strong>
              <p>Email: montedavid07@hotmail.com</p>
              <p>WhatsApp: [Tu número]</p>
            </div>
          </div>

          {subscription?.status === SUBSCRIPTION_STATUS.TRIAL_EXPIRED && (
            <div className="subscription-plans">
              <h3>Planes Disponibles:</h3>
              <div className="subscription-plans-grid">
                <div className="subscription-plan-card">
                  <h4>Básico</h4>
                  <p className="plan-price">$40 USD/mes</p>
                  <ul>
                    <li>Hasta 50 usuarios</li>
                    <li>Reportes básicos</li>
                    <li>Soporte por email</li>
                  </ul>
                </div>
                <div className="subscription-plan-card featured">
                  <span className="plan-badge">Popular</span>
                  <h4>Profesional</h4>
                  <p className="plan-price">$70 USD/mes</p>
                  <ul>
                    <li>Usuarios ilimitados</li>
                    <li>Reportes avanzados</li>
                    <li>Soporte prioritario</li>
                    <li>Acceso a API</li>
                  </ul>
                </div>
                <div className="subscription-plan-card">
                  <h4>Empresarial</h4>
                  <p className="plan-price">$150 USD/mes</p>
                  <ul>
                    <li>Todo en Profesional</li>
                    <li>Soporte 24/7</li>
                    <li>Personalización</li>
                    <li>Servidor dedicado</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Mostrar banner de advertencia si quedan pocos días
  const daysRemaining = getDaysRemaining(subscription);
  const showWarning =
    subscription?.status === SUBSCRIPTION_STATUS.TRIAL && daysRemaining <= 3;

  return (
    <>
      {showWarning && (
        <div className="subscription-warning-banner">
          <AlertCircle size={20} />
          <span>
            <strong>⏰ Período de prueba:</strong> Te quedan {daysRemaining}{" "}
            días. Contacta al administrador para activar tu suscripción.
          </span>
        </div>
      )}
      {children}
    </>
  );
};

export default SubscriptionGuard;
