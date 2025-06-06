// src/data/users.js

/**
 * Array de usuarios de prueba para la aplicación.
 * Cada objeto de usuario contiene nombre de usuario, contraseña y rol.
 * Estos datos se utilizarán para simular inicios de sesión y operaciones
 * específicas de cada rol en el sistema de automatización de tickets.
 *
 * Roles definidos:
 * - Administrator: Administrador del sistema con permisos totales.
 * - Analyst: Analista de la mesa de servicios, puede gestionar tickets.
 * - Employee: Empleado que crea tickets.
 */
const users = [
  { username: 'maria.gomez', password: 'P@ssw0rd123', role: 'Administrator', id: null, token: null },
  { username: 'juan.perez', password: 'P@ssw0rd123', role: 'Analyst', id: null, token: null },
  { username: 'carlos.lopez', password: 'P@ssw0rd123', role: 'Analyst', id: null, token: null },
  { username: 'laura.martinez', password: 'P@ssw0rd123', role: 'Employee', id: null, token: null },
  { username: 'sofia.fernandez', password: 'P@ssw0rd123', role: 'Employee', id: null, token: null },
  // { username: 'andres.ramirez', password: 'P@ssw0rd123', role: 'Employee', id: null, token: null },
  // { username: 'paula.jimenez', password: 'P@ssw0rd123', role: 'Employee', id: null, token: null },
];

/**
 * Constantes para los roles de usuario, para evitar errores de tipeo.
 */
export const USER_ROLES = {
  ADMINISTRATOR: 'Administrator',
  ANALYST: 'Analyst',
  EMPLOYEE: 'Employee',
};

/**
 * Filtra usuarios por rol.
 * @param {string} role - El rol por el cual filtrar (usar USER_ROLES).
 * @returns {Array<Object>} Un array de usuarios que coinciden con el rol.
 */
export const getUsersByRole = (role) => {
  return users.filter(user => user.role === role);
};

export default users;
