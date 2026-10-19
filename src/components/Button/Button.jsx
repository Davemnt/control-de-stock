import React from "react";
import "./Button.css";

const ICON_SIZES = { sm: 16, md: 18, lg: 20 };

const Button = ({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  disabled = false,
  loading = false,
  icon: Icon,
  onClick,
  type = "button",
  className = "",
  ...rest
}) => {
  const iconOnly = !children;
  const classes = [
    "btn",
    `btn-${variant}`,
    `btn-${size}`,
    fullWidth && "btn-full",
    iconOnly && "btn-icon-only",
    loading && "btn-loading",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? (
        <span className="btn-spinner" aria-hidden="true" />
      ) : Icon ? (
        <Icon size={ICON_SIZES[size] || 18} aria-hidden="true" />
      ) : null}
      {children && <span className="btn-text">{children}</span>}
    </button>
  );
};

export default Button;
