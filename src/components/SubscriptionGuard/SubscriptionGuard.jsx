/**
 * COMPONENTE DE PROTECCIÓN DE SUSCRIPCIÓN - VERSIÓN SIMPLIFICADA
 * Para demo y desarrollo local, siempre permite acceso
 */

import React from "react";

const SubscriptionGuard = ({ children }) => {
  // En demo y desarrollo, siempre permitir acceso al contenido
  return children;
};

export default SubscriptionGuard;
