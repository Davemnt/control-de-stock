import React from "react";
import ReactDOM from "react-dom/client";

// Componente simple para diagnosticar
const SimpleApp = () => {
  return (
    <div
      style={{
        padding: "40px",
        fontFamily: "Arial, sans-serif",
        textAlign: "center",
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      <h1>🔧 Control de Stock - Diagnóstico</h1>
      <p>Si ves este mensaje, React está funcionando correctamente.</p>
      <p>Hora actual: {new Date().toLocaleString()}</p>
      <div
        style={{
          marginTop: "20px",
          padding: "20px",
          backgroundColor: "white",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <h3>✅ Estado del sistema:</h3>
        <p>• React: Funcionando</p>
        <p>• JavaScript: Funcionando</p>
        <p>• Renderización: Funcionando</p>
      </div>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<SimpleApp />);
