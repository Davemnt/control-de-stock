import React from "react";
import ReactDOM from "react-dom/client";

const TestApp = () => {
  return (
    <div
      style={{
        padding: "40px",
        fontFamily: "Arial, sans-serif",
        textAlign: "center",
        background: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          maxWidth: "400px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            background: "#DE591F",
            width: "60px",
            height: "60px",
            borderRadius: "12px",
            margin: "0 auto 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "24px",
          }}
        >
          📦
        </div>

        <h1>Control de Stock</h1>
        <p>Sistema Profesional para Eventos</p>

        <div style={{ marginTop: "30px" }}>
          <div style={{ marginBottom: "15px" }}>
            <label>Email</label>
            <input
              type="email"
              placeholder="usuario@ejemplo.com"
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "6px",
                marginTop: "5px",
              }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label>Contraseña</label>
            <input
              type="password"
              placeholder="••••••••"
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "6px",
                marginTop: "5px",
              }}
            />
          </div>

          <button
            style={{
              width: "100%",
              padding: "14px",
              background: "#DE591F",
              color: "white",
              border: "none",
              borderRadius: "6px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Iniciar Sesión
          </button>
        </div>

        <div style={{ marginTop: "20px", fontSize: "14px", color: "#666" }}>
          <p>
            <strong>Usuario demo:</strong> demo@demo.com / demo123
          </p>
        </div>
      </div>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<TestApp />);
