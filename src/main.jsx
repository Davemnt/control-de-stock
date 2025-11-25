/*
 * ========================================
 * ARCHIVO DE ENTRADA PRINCIPAL (main.jsx)
 * ========================================
 *
 * Este es el PRIMER archivo que se ejecuta en tu aplicación React.
 * Su función es:
 * 1. Configurar React para que se monte en el HTML
 * 2. Envolver la aplicación con proveedores (Router, Auth, Toast)
 * 3. Inicializar todos los servicios necesarios
 *
 * ORDEN DE EJECUCIÓN:
 * index.html → main.jsx → App.jsx → páginas individuales
 */

// ========== IMPORTS DE REACT ==========
import React from "react";
import ReactDOM from "react-dom/client";

// ========== IMPORTS DE ROUTING (Navegación) ==========
// BrowserRouter: Permite navegar entre páginas sin recargar el navegador (SPA - Single Page Application)
import { BrowserRouter } from "react-router-dom";

// ========== IMPORTS DE NOTIFICACIONES ==========
// Toaster: Componente que muestra notificaciones toast (mensajes emergentes)
import { Toaster } from "react-hot-toast";

// ========== IMPORTS DE AUTENTICACIÓN ==========
// AuthProvider: Proveedor de contexto que maneja toda la lógica de autenticación
// Permite que cualquier componente acceda a los datos del usuario logueado
import { AuthProvider } from "./contexts/AuthContext";

// ========== IMPORTS DE LA APLICACIÓN ==========
import App from "./App"; // Componente principal que contiene todas las rutas
import "./index.css"; // Estilos globales de la aplicación

/*
 * ReactDOM.createRoot():
 * - Busca el elemento con id="root" en index.html
 * - Crea un "root" de React donde se montará toda la aplicación
 * - Es la forma moderna de renderizar React (React 18+)
 */
ReactDOM.createRoot(document.getElementById("root")).render(
  /*
   * React.StrictMode:
   * - Modo de desarrollo que activa comprobaciones adicionales
   * - Detecta problemas potenciales en la aplicación
   * - Solo funciona en desarrollo, no afecta producción
   * - Puede causar que algunos efectos se ejecuten 2 veces (es normal)
   */
  <React.StrictMode>
    {/*
     * BrowserRouter:
     * - Habilita el sistema de navegación de React Router
     * - Permite usar <Link> en lugar de <a> para navegación sin recarga
     * - Maneja el historial del navegador (botones atrás/adelante)
     * - DEBE envolver toda la aplicación si usas React Router
     */}
    <BrowserRouter>
      {/*
       * AuthProvider:
       * - Proveedor de contexto de autenticación
       * - Proporciona datos del usuario a TODA la aplicación
       * - Contiene funciones: login(), logout(), register()
       * - Cualquier componente hijo puede acceder a estos datos con useAuth()
       * - Se conecta con Firebase Authentication
       */}
      <AuthProvider>
        {/*
         * App:
         * - Componente principal que contiene todas las rutas
         * - Define qué página mostrar según la URL
         * - Maneja las rutas protegidas (solo usuarios logueados)
         */}
        <App />

        {/*
         * Toaster:
         * - Sistema de notificaciones toast
         * - Muestra mensajes de éxito, error, info
         * - Se configura aquí para que funcione en TODA la aplicación
         * - Personalizado con los colores del tema dark
         *
         * position="top-right": Las notificaciones aparecen arriba a la derecha
         * toastOptions: Configuración de estilo y duración
         */}
        <Toaster
          position="top-right"
          toastOptions={{
            // Duración en milisegundos (4000ms = 4 segundos)
            duration: 4000,

            // Estilos personalizados usando variables CSS del tema
            style: {
              background: "var(--c-surface)", // Color de fondo del toast
              color: "var(--c-text)", // Color del texto
              border: "1px solid var(--c-border)", // Borde sutil
              fontFamily: "var(--font-base)", // Tipografía consistente
            },

            // Personalización del ícono de éxito (✓)
            success: {
              iconTheme: {
                primary: "var(--c-success)", // Verde
                secondary: "var(--c-white)", // Blanco
              },
            },

            // Personalización del ícono de error (✕)
            error: {
              iconTheme: {
                primary: "var(--c-error)", // Rojo
                secondary: "var(--c-white)", // Blanco
              },
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

/*
 * FLUJO DE LA APLICACIÓN:
 *
 * 1. El navegador carga index.html
 * 2. index.html ejecuta main.jsx
 * 3. main.jsx monta React en el div #root
 * 4. Se inicializa BrowserRouter (sistema de rutas)
 * 5. Se inicializa AuthProvider (sistema de autenticación)
 * 6. Se renderiza App.jsx (que contiene las rutas)
 * 7. App.jsx decide qué página mostrar según la URL
 *
 * NOTA: Este archivo NO se modifica frecuentemente.
 * Solo se modifica si necesitas agregar nuevos proveedores globales.
 */
