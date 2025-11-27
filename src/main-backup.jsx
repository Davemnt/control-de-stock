import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./contexts/AuthContext";
import App from "./App";
import "./index.css";

// Versión sin StrictMode para debugging
const rootElement = document.getElementById("root");

if (!rootElement) {
  document.body.innerHTML = `
    <div style="text-align: center; padding: 50px; font-family: Arial;">
      <h1>❌ Error: Elemento #root no encontrado</h1>
      <p>El div con id="root" no existe en el HTML</p>
    </div>
  `;
} else {
  try {
    const root = ReactDOM.createRoot(rootElement);

    root.render(
      <BrowserRouter>
        <AuthProvider>
          <App />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#ffffff",
                color: "#000000",
                border: "1px solid #e0e0e0",
                fontFamily: "Arial, sans-serif",
              },
            }}
          />
        </AuthProvider>
      </BrowserRouter>
    );

    console.log("✅ Aplicación montada correctamente");
  } catch (error) {
    console.error("❌ Error al montar la aplicación:", error);
    rootElement.innerHTML = `
      <div style="text-align: center; padding: 50px; font-family: Arial; background: #f5f5f5; min-height: 100vh;">
        <div style="background: white; padding: 30px; border-radius: 12px; display: inline-block; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
          <h1 style="color: #d32f2f;">❌ Error de React</h1>
          <p>No se pudo montar la aplicación React</p>
          <pre style="background: #f5f5f5; padding: 15px; border-radius: 8px; text-align: left; font-size: 12px; margin: 20px 0;">${error.message}</pre>
          <button onclick="window.location.reload()" style="background: #1976d2; color: white; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer;">
            Recargar
          </button>
        </div>
      </div>
    `;
  }
}
