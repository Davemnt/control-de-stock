import { format, parseISO, formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * Format date to DD/MM/YYYY
 */
export const formatDate = (date) => {
  if (!date) return '-';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'dd/MM/yyyy', { locale: es });
};

/**
 * Format datetime to DD/MM/YYYY HH:mm
 */
export const formatDateTime = (date) => {
  if (!date) return '-';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'dd/MM/yyyy HH:mm', { locale: es });
};

/**
 * Format relative time (hace 2 horas, hace 3 días)
 */
export const formatRelativeTime = (date) => {
  if (!date) return '-';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return formatDistanceToNow(dateObj, { addSuffix: true, locale: es });
};

/**
 * Format Firebase Timestamp
 */
export const formatFirebaseTimestamp = (timestamp) => {
  if (!timestamp) return '-';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return formatDateTime(date);
};

/**
 * Get current ISO string
 */
export const getCurrentISOString = () => {
  return new Date().toISOString();
};
