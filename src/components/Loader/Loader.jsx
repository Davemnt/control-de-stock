import React from "react";

const baseStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "1rem",
  color: "var(--c-text-muted)",
  fontSize: "0.875rem",
};

const Loader = ({ text = "Cargando...", fullScreen = false }) => (
  <div
    role="status"
    style={{
      ...baseStyle,
      minHeight: fullScreen ? "100vh" : "320px",
      background: fullScreen ? "var(--c-body)" : undefined,
    }}
  >
    <div className="spinner" />
    <p>{text}</p>
  </div>
);

export default Loader;
