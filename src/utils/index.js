export * from './permissions';
export * from './formatters';
export * from './validation';

/**
 * Generate unique code for materials
 */
export const generateMaterialCode = (category) => {
  const prefix = category.substring(0, 3).toUpperCase();
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');
  return `${prefix}-${timestamp}${random}`;
};

/**
 * Calculate available stock
 */
export const calculateAvailableStock = (material) => {
  const total = material.quantity || 0;
  const committed = material.quantityCommitted || 0;
  const maintenance = material.quantityMaintenance || 0;
  return Math.max(0, total - committed - maintenance);
};

/**
 * Get stock status (critical, low, medium, good)
 */
export const getStockStatus = (quantity, thresholds = { critical: 5, low: 10, medium: 20 }) => {
  if (quantity <= thresholds.critical) return 'critical';
  if (quantity <= thresholds.low) return 'low';
  if (quantity <= thresholds.medium) return 'medium';
  return 'good';
};

/**
 * Sort array by property
 */
export const sortBy = (array, property, ascending = true) => {
  return [...array].sort((a, b) => {
    const aVal = a[property];
    const bVal = b[property];
    
    if (aVal < bVal) return ascending ? -1 : 1;
    if (aVal > bVal) return ascending ? 1 : -1;
    return 0;
  });
};

/**
 * Group array by property
 */
export const groupBy = (array, property) => {
  return array.reduce((acc, item) => {
    const key = item[property];
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {});
};

/**
 * Debounce function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Format number with thousands separator
 */
export const formatNumber = (num) => {
  return new Intl.NumberFormat('es-ES').format(num);
};

/**
 * Truncate text
 */
export const truncate = (text, length = 50) => {
  if (!text) return '';
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
};
