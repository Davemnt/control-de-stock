import React from 'react';
import './Input.css';

const Input = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  error,
  icon: Icon,
  helper,
  autoComplete,
  min,
  max,
  step,
  rows = 4,
  className = ''
}) => {
  const inputId = `input-${name}`;
  const isTextarea = type === 'textarea';
  const InputComponent = isTextarea ? 'textarea' : 'input';

  return (
    <div className={`input-group ${className}`}>
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
          {required && <span className="input-required">*</span>}
        </label>
      )}
      
      <div className="input-wrapper">
        {Icon && (
          <div className="input-icon">
            <Icon size={20} />
          </div>
        )}
        
        <InputComponent
          id={inputId}
          type={isTextarea ? undefined : type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          autoComplete={autoComplete}
          min={min}
          max={max}
          step={step}
          rows={isTextarea ? rows : undefined}
          className={`input ${Icon ? 'input-with-icon' : ''} ${error ? 'input-error' : ''}`}
        />
      </div>
      
      {error && <span className="input-error-text">{error}</span>}
      {helper && !error && <span className="input-helper">{helper}</span>}
    </div>
  );
};

export default Input;
