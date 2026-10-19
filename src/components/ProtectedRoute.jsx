import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Loader from "./Loader/Loader";

/**
 * Protege una ruta: exige sesión y, opcionalmente, uno de los roles indicados.
 */
const ProtectedRoute = ({ children, roles }) => {
  const { currentUser, userData, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loader fullScreen />;
  }

  if (!currentUser) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (roles && !roles.includes(userData?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
