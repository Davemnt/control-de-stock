import React, { useId } from "react";
import "./Input.css";

/**
 * Campo de formulario. Soporta type="textarea" y type="select"
 * (para select, pasar las <option> como children).
 * `suffix` permite añadir un elemento a la derecha (p. ej. un botón).
 */
const Input = ({
  label,
  type = "text",
  name,
  id,
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  error,
  icon: Icon,
  suffix,
  helper,
  rows = 4,
  className = "",
  children,
  ...rest
}) => {
  const autoId = useId();
  const inputId = id || (name ? `input-${name}-${autoId}` : autoId);
  const isTextarea = type === "textarea";
  const isSelect = type === "select";
  const Component = isTextarea ? "textarea" : isSelect ? "select" : "input";
  const describedBy = error || helper ? `${inputId}-desc` : undefined;

  const inputClasses = [
    "input",
    Icon && "input-with-icon",
    suffix && "input-with-suffix",
    error && "input-error",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={`input-group ${className}`}>
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
          {required && <span className="input-required" aria-hidden="true">*</span>}
        </label>
      )}

      <div className="input-wrapper">
        {Icon && (
          <span className="input-icon" aria-hidden="true">
            <Icon size={18} />
          </span>
        )}

        <Component
          id={inputId}
          type={isTextarea || isSelect ? undefined : type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          rows={isTextarea ? rows : undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={inputClasses}
          {...rest}
        >
          {isSelect ? children : undefined}
        </Component>

        {suffix && <span className="input-suffix">{suffix}</span>}
      </div>

      {error ? (
        <span id={describedBy} className="input-error-text">
          {error}
        </span>
      ) : helper ? (
        <span id={describedBy} className="input-helper">
          {helper}
        </span>
      ) : null}
    </div>
  );
};

export default Input;
