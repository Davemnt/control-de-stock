import { PERMISSIONS, ROLES } from "../constants";

/**
 * Check if user has specific permission
 */
export const hasPermission = (userRole, permission) => {
  return PERMISSIONS[userRole]?.includes(permission) || false;
};

/**
 * Check if user is admin
 */
export const isAdmin = (userRole) => userRole === ROLES.ADMIN;

/**
 * Check if user can edit materials
 */
export const canEdit = (userRole) => hasPermission(userRole, "edit_material");

/**
 * Check if user can only view
 */
export const isReadOnly = (userRole) => userRole === ROLES.GUEST;
