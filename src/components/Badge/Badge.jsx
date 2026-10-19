import React from "react";
import "./Badge.css";

const Badge = ({ children, variant = "default", size = "md", dot = false, className = "" }) => {
  return (
    <span className={`badge badge-${variant} badge-${size} ${className}`}>
      {dot && <span className="badge-dot" aria-hidden="true" />}
      {children}
    </span>
  );
};

export default Badge;
