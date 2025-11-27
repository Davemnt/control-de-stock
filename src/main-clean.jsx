import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./contexts/AuthContext";
import App from "./App";
import "./index.css";

// Main entry point - clean version without special characters
try {
  const rootElement = document.getElementById("root");

  if (!rootElement) {
    throw new Error("Root element not found");
  }

  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
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
              success: {
                iconTheme: {
                  primary: "#4CAF50",
                  secondary: "#ffffff",
                },
              },
              error: {
                iconTheme: {
                  primary: "#f44336",
                  secondary: "#ffffff",
                },
              },
            }}
          />
        </AuthProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
} catch (error) {
  console.error("App initialization error:", error);

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
          <h1 style="color: #d32f2f; margin-bottom: 20px;">Error de Carga</h1>
          <p style="margin-bottom: 15px;">La aplicacion no pudo inicializarse correctamente.</p>
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
            Recargar Pagina
          </button>
        </div>
      </div>
    `;
  }
}
