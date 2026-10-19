import React from "react";
import "./Card.css";

const Card = ({
  children,
  title,
  subtitle,
  actions,
  hover = false,
  padding = "md",
  className = "",
  onClick,
  ...rest
}) => {
  const interactive = typeof onClick === "function";

  const handleKeyDown = (e) => {
    if (e.target === e.currentTarget && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      onClick(e);
    }
  };

  return (
    <div
      className={`card ${hover || interactive ? "card-hover" : ""} card-padding-${padding} ${className}`}
      onClick={onClick}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      onKeyDown={interactive ? handleKeyDown : undefined}
      {...rest}
    >
      {(title || subtitle || actions) && (
        <div className="card-header">
          <div className="card-header-content">
            {title && <h3 className="card-title">{title}</h3>}
            {subtitle && <p className="card-subtitle">{subtitle}</p>}
          </div>
          {actions && <div className="card-actions">{actions}</div>}
        </div>
      )}
      <div className="card-body">{children}</div>
    </div>
  );
};

export default Card;
