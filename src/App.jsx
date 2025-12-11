/* 📚 GUÍA TRAINEE - COMPONENTE APP PRINCIPAL
   =========================================
   
   Este es el componente raíz de toda la aplicación.
   Define las rutas, proveedores de contexto y lógica de navegación.
   
   🔑 RESPONSABILIDADES:
   - ✅ Configurar rutas de la aplicación
   - ✅ Proveer contextos globales (Auth, Theme)
   - ✅ Proteger rutas que requieren autenticación
   - ✅ Detectar modo demo vs producción
   - ✅ Manejar redirecciones
*/

// 📦 IMPORTS PRINCIPALES
import React from "react"; // ⚛️ Biblioteca principal
import { Routes, Route, Navigate } from "react-router-dom"; // 🧭 Sistema de rutas
import { useAuth } from "./contexts/AuthContext"; // 🔐 Contexto de autenticación
import { ThemeProvider } from "./contexts/ThemeContext"; // 🎨 Contexto de temas
import ProtectedRoute from "./components/ProtectedRoute"; // 🛡️ Protección de rutas

// 📄 PÁGINAS DE LA APLICACIÓN
// Cada import representa una pantalla completa del sistema
import Login from "./pages/Login/Login"; // 🔐 Página de autenticación
import Dashboard from "./pages/Dashboard/Dashboard"; // 🏠 Panel principal
import Materiales from "./pages/Materiales/Materiales"; // 📦 Gestión de inventario
import Movimientos from "./pages/Movimientos/Movimientos"; // 🔄 Registro de movimientos
import Historial from "./pages/Historial/Historial"; // 📅 Historial de actividad
import Usuarios from "./pages/Usuarios/Usuarios"; // 👥 Administración de usuarios
import Configuracion from "./pages/Configuracion/Configuracion"; // ⚙️ Configuraciones del sistema

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
