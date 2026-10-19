/* 📚 GUÍA TRAINEE - COMPONENTE APP PRINCIPAL
   =========================================

   Este es el componente raíz de toda la aplicación.
   Define las rutas, proveedores de contexto y lógica de navegación.

   🔑 RESPONSABILIDADES:
   - ✅ Configurar rutas de la aplicación
   - ✅ Proveer contextos globales (Theme)
   - ✅ Proteger rutas que requieren autenticación o un rol concreto
   - ✅ Manejar redirecciones
*/

import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ROLES } from "./constants";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import Materiales from "./pages/Materiales/Materiales";
import Movimientos from "./pages/Movimientos/Movimientos";
import Historial from "./pages/Historial/Historial";
import Indicadores from "./pages/Indicadores/Indicadores";
import Usuarios from "./pages/Usuarios/Usuarios";
import Configuracion from "./pages/Configuracion/Configuracion";

const STAFF = [ROLES.ADMIN, ROLES.EMPLOYEE, ROLES.USER];

function App() {
  const { currentUser } = useAuth();

  const page = (element, roles) => <ProtectedRoute roles={roles}>{element}</ProtectedRoute>;

  return (
    <ThemeProvider>
      <div className="app-wrapper">
        <Routes>
          <Route path="/login" element={currentUser ? <Navigate to="/" replace /> : <Login />} />
          <Route path="/" element={page(<Dashboard />)} />
          <Route path="/materiales" element={page(<Materiales />)} />
          <Route path="/movimientos" element={page(<Movimientos />, STAFF)} />
          <Route path="/historial" element={page(<Historial />)} />
          <Route path="/indicadores" element={page(<Indicadores />)} />
          <Route path="/usuarios" element={page(<Usuarios />, [ROLES.ADMIN])} />
          <Route path="/configuracion" element={page(<Configuracion />)} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;
