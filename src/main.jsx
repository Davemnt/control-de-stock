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
// Capturar errores de inicialización
try {
  const rootElement = document.getElementById("root");

  if (!rootElement) {
    throw new Error("No se encontró el elemento #root en el HTML");
  }

  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <BrowserRouter>
        <AuthProvider>
          <App />
          <Toaster
            position="top-right"
            gutter={8}
            toastOptions={{
              duration: 4000,
              style: {
                background: "var(--c-surface)",
                color: "var(--c-text)",
                border: "1px solid var(--c-border-strong)",
                boxShadow: "var(--shadow-lg)",
                fontFamily: "var(--font-base)",
                fontSize: "0.875rem",
                borderRadius: "10px",
              },
              success: {
                iconTheme: { primary: "var(--c-success)", secondary: "#fff" },
              },
              error: {
                duration: 5000,
                iconTheme: { primary: "var(--c-error)", secondary: "#fff" },
              },
            }}
          />
        </AuthProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
} catch (error) {
  console.error("Error al inicializar la aplicación:", error);

  // Mostrar mensaje de error básico
  const rootElement = document.getElementById("root");
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="
        padding: 40px;
        font-family: Arial, sans-serif;
        text-align: center;
        background: #f5f5f5;
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
      ">
        <div style="
          background: white;
          padding: 30px;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          max-width: 400px;
        ">
          <h1 style="color: #d32f2f; margin-bottom: 20px;">⚠️ Error de Carga</h1>
          <p style="margin-bottom: 15px;">La aplicación no pudo inicializarse correctamente.</p>
          <p style="font-size: 14px; color: #666; margin-bottom: 20px;">Error: ${error.message}</p>
          <button onclick="window.location.reload()" style="
            background: #1976d2;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 16px;
          ">
            Recargar Página
          </button>
        </div>
      </div>
    `;
  }
}

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
