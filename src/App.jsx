import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Páginas
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import Materiales from "./pages/Materiales/Materiales";
import Movimientos from "./pages/Movimientos/Movimientos";
import Historial from "./pages/Historial/Historial";
import Usuarios from "./pages/Usuarios/Usuarios";
import Configuracion from "./pages/Configuracion/Configuracion";

function App() {
  const { currentUser } = useAuth();

  // Detectar si es modo demo
  const isDemo =
    import.meta.env.VITE_FIREBASE_PROJECT_ID === "control-stock-demo" ||
    import.meta.env.MODE === "demo";

  console.log("🚀 Modo actual:", isDemo ? "DEMO" : "PRODUCCIÓN");
  console.log("📋 Project ID:", import.meta.env.VITE_FIREBASE_PROJECT_ID);
  console.log("🔧 Mode:", import.meta.env.MODE);

  return (
    <ThemeProvider>
      <div className="app-wrapper">
        <Routes>
          <Route
            path="/login"
            element={currentUser ? <Navigate to="/" /> : <Login />}
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/materiales"
            element={
              <ProtectedRoute>
                <Materiales />
              </ProtectedRoute>
            }
          />
          <Route
            path="/movimientos"
            element={
              <ProtectedRoute>
                <Movimientos />
              </ProtectedRoute>
            }
          />
          <Route
            path="/historial"
            element={
              <ProtectedRoute>
                <Historial />
              </ProtectedRoute>
            }
          />
          <Route
            path="/usuarios"
            element={
              <ProtectedRoute adminOnly>
                <Usuarios />
              </ProtectedRoute>
            }
          />
          <Route
            path="/configuracion"
            element={
              <ProtectedRoute>
                <Configuracion />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;
