/*
 * ========================================
 * COMPONENTE PRINCIPAL DE LA APLICACIÓN (App.jsx)
 * ========================================
 *
 * Este archivo define todas las RUTAS (páginas) de la aplicación.
 * Es como un "mapa" que le dice a React qué página mostrar según la URL.
 *
 * EJEMPLO DE RUTAS:
 * - http://localhost:3000/           → Muestra Dashboard
 * - http://localhost:3000/materiales → Muestra Catálogo de Materiales
 * - http://localhost:3000/login      → Muestra página de Login
 *
 * CONCEPTO CLAVE: SPA (Single Page Application)
 * - La aplicación NO recarga el navegador al cambiar de página
 * - Solo cambia el contenido dinámicamente
 * - Esto hace la navegación muy rápida y fluida
 */

// ========== IMPORTS DE REACT Y ROUTING ==========
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// ========== IMPORT DE AUTENTICACIÓN Y TEMA ==========
// useAuth: Hook personalizado para acceder a los datos del usuario
// Permite saber: ¿Hay un usuario logueado? ¿Qué rol tiene?
import { useAuth } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";

// ========== IMPORT DE COMPONENTE DE PROTECCIÓN ==========
// ProtectedRoute: Componente que protege rutas privadas
// Si el usuario NO está logueado, lo redirige al login
import ProtectedRoute from "./components/ProtectedRoute";

// ========== IMPORTS DE PÁGINAS ==========
// Cada una de estas es una página completa de la aplicación
import Login from "./pages/Login/Login"; // Página de inicio de sesión
import Dashboard from "./pages/Dashboard/Dashboard"; // Página principal con estadísticas
import Materiales from "./pages/Materiales/Materiales"; // Catálogo de materiales
import Movimientos from "./pages/Movimientos/Movimientos"; // Registro de movimientos
import Historial from "./pages/Historial/Historial"; // Historial completo
import Usuarios from "./pages/Usuarios/Usuarios"; // Gestión de usuarios (solo admin)
import Configuracion from "./pages/Configuracion/Configuracion"; // Configuración del sistema

/*
 * COMPONENTE APP
 * - Componente principal que contiene toda la lógica de rutas
 * - Se renderiza dentro de <AuthProvider> en main.jsx
 * - Tiene acceso a los datos de autenticación vía useAuth()
 */
function App() {
  // ========== OBTENER DATOS DEL USUARIO ==========
  /*
   * currentUser: Objeto con los datos del usuario de Firebase
   * - null si NO hay usuario logueado
   * - { uid, email, ... } si HAY usuario logueado
   *
   * Este valor se usa para decidir si mostrar Login o Dashboard
   */
  const { currentUser } = useAuth();

  return (
    <ThemeProvider>
      <div className="app-wrapper">
        {/*
         * <Routes>: Contenedor principal de todas las rutas
         * - React Router renderiza SOLO la ruta que coincida con la URL actual
         * - Si ninguna coincide, renderiza la última ruta con path="*"
         */}
        <Routes>
          {/*
           * ========== RUTA DE LOGIN ==========
           * path="/login" → http://localhost:3000/login
           *
           * LÓGICA:
           * - Si NO hay usuario logueado (currentUser === null):
           *   → Muestra la página de Login
           *
           * - Si HAY usuario logueado (currentUser !== null):
           *   → Redirige automáticamente al Dashboard (/)
           *   → Esto evita que un usuario ya logueado vea el login
           */}
          <Route
            path="/login"
            element={currentUser ? <Navigate to="/" /> : <Login />}
          />

          {/*
           * ========== RUTA DEL DASHBOARD (PÁGINA PRINCIPAL) ==========
           * path="/" → http://localhost:3000/
           *
           * <ProtectedRoute>:
           * - Verifica que el usuario esté logueado
           * - Si NO está logueado → Redirige a /login
           * - Si SÍ está logueado → Muestra el Dashboard
           *
           * Esta es la primera página que ve el usuario después del login
           */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/*
           * ========== RUTA DE MATERIALES ==========
           * path="/materiales" → http://localhost:3000/materiales
           *
           * Muestra el catálogo completo de materiales
           * - Lista de todos los equipos
           * - Filtros por categoría, estado, ubicación
           * - Botón para crear nuevo material
           *
           * PROTEGIDA: Solo usuarios logueados pueden acceder
           */}
          <Route
            path="/materiales"
            element={
              <ProtectedRoute>
                <Materiales />
              </ProtectedRoute>
            }
          />

          {/*
           * ========== RUTA DE MOVIMIENTOS ==========
           * path="/movimientos" → http://localhost:3000/movimientos
           *
           * Muestra y registra movimientos de stock:
           * - Entradas (nuevo material llegó)
           * - Salidas (material fue usado/prestado)
           * - Transferencias (cambio de ubicación)
           * - Ajustes (correcciones de cantidad)
           *
           * PROTEGIDA: Solo usuarios logueados pueden acceder
           */}
          <Route
            path="/movimientos"
            element={
              <ProtectedRoute>
                <Movimientos />
              </ProtectedRoute>
            }
          />

          {/*
           * ========== RUTA DE HISTORIAL ==========
           * path="/historial" → http://localhost:3000/historial
           *
           * Muestra el historial completo de todos los movimientos
           * - Auditoría completa del sistema
           * - Filtros por fecha, usuario, material
           * - Exportación a PDF/Excel
           *
           * PROTEGIDA: Solo usuarios logueados pueden acceder
           */}
          <Route
            path="/historial"
            element={
              <ProtectedRoute>
                <Historial />
              </ProtectedRoute>
            }
          />

          {/*
           * ========== RUTA DE USUARIOS ==========
           * path="/usuarios" → http://localhost:3000/usuarios
           *
           * Gestión de usuarios del sistema:
           * - Crear nuevos usuarios
           * - Asignar roles (admin, user, guest)
           * - Activar/desactivar usuarios
           * - Editar información de usuarios
           *
           * PROTEGIDA Y SOLO ADMIN:
           * - adminOnly={true}: Solo administradores pueden acceder
           * - Si un usuario normal intenta entrar, será redirigido
           */}
          <Route
            path="/usuarios"
            element={
              <ProtectedRoute adminOnly>
                <Usuarios />
              </ProtectedRoute>
            }
          />

          {/*
           * ========== RUTA DE CONFIGURACIÓN ==========
           * path="/configuracion" → http://localhost:3000/configuracion
           *
           * Configuración del sistema:
           * - Cambiar tema claro/oscuro
           * - Gestionar categorías de materiales
           * - Personalizar preferencias
           *
           * PROTEGIDA: Solo usuarios logueados pueden acceder
           */}
          <Route
            path="/configuracion"
            element={
              <ProtectedRoute>
                <Configuracion />
              </ProtectedRoute>
            }
          />

          {/*
           * ========== RUTA 404 (PÁGINA NO ENCONTRADA) ==========
           * path="*" → Cualquier ruta que no coincida con las anteriores
           *
           * EJEMPLOS que caerían aquí:
           * - /pagina-inexistente
           * - /abc123
           * - /cualquier-cosa
           *
           * ACCIÓN: Redirige automáticamente al Dashboard (/)
           * Esto evita que el usuario vea una página en blanco
           */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;

/*
 * ========================================
 * FLUJO DE NAVEGACIÓN TÍPICO:
 * ========================================
 *
 * 1. Usuario abre la app → Ve /login (si no está logueado)
 * 2. Usuario ingresa email y contraseña → AuthContext.login()
 * 3. Login exitoso → currentUser se llena con datos
 * 4. Redirige automáticamente a / (Dashboard)
 * 5. Usuario puede navegar libremente entre rutas protegidas
 * 6. Usuario hace click en "Cerrar Sesión" → AuthContext.logout()
 * 7. currentUser se vacía → Redirige a /login
 *
 * ========================================
 * CÓMO AGREGAR UNA NUEVA PÁGINA:
 * ========================================
 *
 * 1. Crear el componente de la página en /src/pages/NombrePagina/
 * 2. Importar el componente: import NombrePagina from './pages/NombrePagina/NombrePagina';
 * 3. Agregar una nueva <Route>:
 *
 *    <Route
 *      path="/nueva-ruta"
 *      element={
 *        <ProtectedRoute>
 *          <NombrePagina />
 *        </ProtectedRoute>
 *      }
 *    />
 *
 * 4. Agregar link en el Sidebar para que sea accesible
 *
 * ========================================
 * CONCEPTOS IMPORTANTES:
 * ========================================
 *
 * - <Route>: Define una ruta (URL) y qué componente renderizar
 * - <Navigate>: Redirige a otra ruta programáticamente
 * - <ProtectedRoute>: Componente personalizado que verifica autenticación
 * - adminOnly: Prop que restringe acceso solo a administradores
 * - currentUser: Estado global del usuario logueado
 */
