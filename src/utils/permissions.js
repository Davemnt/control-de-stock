/**
 * Check if user has specific permission
 */
export const hasPermission = (userRole, permission) => {
  const { PERMISSIONS } = require('../constants');
  return PERMISSIONS[userRole]?.includes(permission) || false;
};

/**
 * Check if user is admin
 */
export const isAdmin = (userRole) => {
  const { ROLES } = require('../constants');
  return userRole === ROLES.ADMIN;
};

/**
 * Check if user can edit
 */
export const canEdit = (userRole) => {
  const { ROLES } = require('../constants');
  return userRole === ROLES.ADMIN || userRole === ROLES.USER;
};

/**
 * Check if user can only view
 */
export const isReadOnly = (userRole) => {
  const { ROLES } = require('../constants');
  return userRole === ROLES.GUEST;
};
