/**
 * Email validation
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Password validation
 */
export const isValidPassword = (password, minLength = 6) => {
  return password && password.length >= minLength;
};

/**
 * Required field validation
 */
export const isRequired = (value) => {
  return value !== null && value !== undefined && value.toString().trim() !== '';
};

/**
 * Number validation
 */
export const isValidNumber = (value, min = 0) => {
  const num = Number(value);
  return !isNaN(num) && num >= min;
};

/**
 * Validate material code
 */
export const isValidCode = (code) => {
  return code && code.trim().length > 0 && code.length <= 20;
};

/**
 * Validate quantity
 */
export const isValidQuantity = (quantity) => {
  return isValidNumber(quantity) && Number(quantity) >= 0;
};

/**
 * General form validation
 */
export const validateForm = (data, rules) => {
  const errors = {};
  
  for (const field in rules) {
    const rule = rules[field];
    const value = data[field];
    
    if (rule.required && !isRequired(value)) {
      errors[field] = rule.message || 'Este campo es requerido';
      continue;
    }
    
    if (rule.email && !isValidEmail(value)) {
      errors[field] = 'Email inválido';
      continue;
    }
    
    if (rule.minLength && value.length < rule.minLength) {
      errors[field] = `Mínimo ${rule.minLength} caracteres`;
      continue;
    }
    
    if (rule.maxLength && value.length > rule.maxLength) {
      errors[field] = `Máximo ${rule.maxLength} caracteres`;
      continue;
    }
    
    if (rule.min && Number(value) < rule.min) {
      errors[field] = `Valor mínimo: ${rule.min}`;
      continue;
    }
    
    if (rule.custom && !rule.custom(value)) {
      errors[field] = rule.message || 'Valor inválido';
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
