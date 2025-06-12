// src/services/userService.js
import axios from 'axios';
import config from '../config/index.js';
import allUsers, { USER_ROLES, getUsersByRole } from '../data/users.js'; // Importamos el array mutable
import logger from '../utils/logger.js';
import { handleError, APIError, AppError } from '../utils/errorHandler.js';
import { getUserToken } from './authService.js'; // Para obtener el token del admin
import { delay } from '../utils/helpers.js';

const USERS_ENDPOINT = `${config.BASE_URL}/Users`;

/**
 * Obtiene todos los usuarios de la API y actualiza/verifica los IDs en el array 'allUsers'.
 * Los IDs obtenidos durante el login en authService tienen prioridad.
 * Esta función sirve para asegurar que todos los usuarios locales tengan su ID de API
 * y para verificar la consistencia si ya se obtuvo un ID.
 * Requiere que el usuario administrador (definido en users.js) esté autenticado.
 * @returns {Promise<boolean>} True si la operación general fue exitosa (no necesariamente todos mapeados).
 */
async function fetchAndStoreUserIds() {
  logger.info('Iniciando sincronización/verificación de IDs de usuario con la API...');
  const adminUser = getUsersByRole(USER_ROLES.ADMINISTRATOR)[0];
  if (!adminUser) {
    logger.error('fetchAndStoreUserIds: No se encontró un usuario administrador en la configuración local.');
    return false;
  }

  const adminToken = getUserToken(adminUser.username);
  if (!adminToken) {
    logger.error(`fetchAndStoreUserIds: El usuario administrador ${adminUser.username} no está autenticado o no tiene token.`);
    return false;
  }

  let apiUsers = [];
  try {
    const response = await axios.get(USERS_ENDPOINT, {
      headers: { Authorization: `Bearer ${adminToken}` },
      timeout: config.API_TIMEOUT,
    });

    if (response.data && Array.isArray(response.data)) {
      apiUsers = response.data;
      logger.debug(`API devolvió ${apiUsers.length} usuarios. Procediendo a mapear/verificar con usuarios locales.`);
    } else {
      throw new APIError(
        'La respuesta de la API para obtener usuarios no es válida o no es un array.',
        response.status,
        'Obtener todos los usuarios (API)',
        { responseData: response.data }
      );
    }
  } catch (error) {
    // El error ya debería ser manejado y logueado por handleTicketServiceError o similar
    // si se lanza desde axios, o lo adaptamos aquí.
    let apiError;
    if (error.isAxiosError) {
      const status = error.response ? error.response.status : 500;
      const message = error.response?.data?.message || error.response?.data?.title || error.message;
      apiError = new APIError(
        message,
        status,
        'Obtener todos los usuarios (API)',
        { requestConfig: error.config, responseData: error.response?.data }
      );
    } else if (!(error instanceof APIError || error instanceof AppError)) {
      apiError = new APIError(
        error.message || 'Error desconocido al obtener usuarios de la API.',
        500,
        'Obtener todos los usuarios (API)',
        { originalError: error }
      );
    } else {
      apiError = error; // Ya es un error conocido
    }
    handleError(apiError);
    return false; // Indica fallo en la obtención de datos de la API
  }

  let updatedOrVerifiedCount = 0;
  let newMatchesFound = 0;

  allUsers.forEach(localUser => {
    const apiUserByEmail = apiUsers.find(apiUser => apiUser.email === localUser.username);

    if (localUser.id) {
      // El usuario local ya tiene un ID (probablemente del login)
      logger.debug(`Usuario local ${localUser.username} ya tiene ID: ${localUser.id}. Verificando consistencia...`);
      updatedOrVerifiedCount++;
      if (apiUserByEmail) {
        if (apiUserByEmail.id !== localUser.id) {
          logger.warn(`Discrepancia de ID para ${localUser.username}: Local=${localUser.id}, API=${apiUserByEmail.id}. Se prioriza el ID del login si es reciente, pero esto es inusual.`);
          // Aquí se podría decidir qué ID tomar. Por ahora, mantenemos el del login.
        }
        if (apiUserByEmail.name !== localUser.name && localUser.name) { // localUser.name puede haber sido poblado por authService
             logger.info(`Nombre para ${localUser.username}: Local='${localUser.name}', API='${apiUserByEmail.name}'. El local puede ser más actualizado por login.`);
        }
         if (apiUserByEmail.role !== localUser.role) {
             logger.warn(`Discrepancia de Rol para ${localUser.username}: Local='${localUser.role}', API='${apiUserByEmail.role}'. Se prioriza el rol del login.`);
        }
      } else {
        logger.warn(`Usuario local ${localUser.username} (ID: ${localUser.id}) no encontrado en la respuesta de GET /Users por email. El ID podría ser de un login reciente.`);
      }
    } else {
      // El usuario local NO tiene un ID, intentamos encontrarlo en la API
      if (apiUserByEmail && apiUserByEmail.id) {
        localUser.id = apiUserByEmail.id;
        localUser.name = apiUserByEmail.name; // Poblar nombre si no se obtuvo en login
        // Si el rol local difiere del de la API y no se obtuvo en login, considerar actualizarlo.
        if (localUser.role !== apiUserByEmail.role) {
            logger.warn(`Rol para ${localUser.username} difiere: Local='${localUser.role}', API='${apiUserByEmail.role}'. Actualizando a rol de API.`);
            localUser.role = apiUserByEmail.role;
        }
        updatedOrVerifiedCount++;
        newMatchesFound++;
        logger.info(`ID ${apiUserByEmail.id} asignado a usuario local ${localUser.username} desde GET /Users.`);
      } else {
        logger.warn(`No se encontró ID en la API para el usuario local (sin ID previo): ${localUser.username}`);
      }
    }
  });

  logger.info(`Sincronización de IDs completada. Usuarios actualizados/verificados: ${updatedOrVerifiedCount}. Nuevos IDs asignados: ${newMatchesFound}.`);
  if (updatedOrVerifiedCount < allUsers.length) {
    logger.warn('Algunos usuarios locales no pudieron ser completamente verificados o no se les asignó un ID. Revisa los logs.');
  }
  return true; // La operación general de intentar sincronizar se considera exitosa
}

/**
 * Promueve a un usuario específico a un nuevo rol en la API.
 * @param {object} userToPromote - El objeto de usuario local (debe tener 'id' y 'username').
 * @param {string} newRole - El nuevo rol a asignar (ej. USER_ROLES.ANALYST).
 * @returns {Promise<boolean>} True si la promoción fue exitosa, false en caso contrario.
 */
async function promoteUserToRole(userToPromote, newRole) {
  if (!userToPromote || !userToPromote.id || !userToPromote.username) {
    logger.warn(`promoteUserToRole: Datos incompletos para el usuario a promover (ID o username faltante): ${userToPromote ? userToPromote.username : 'desconocido'}.`);
    return false;
  }
  // Validar que el newRole sea uno de los conocidos por USER_ROLES
  if (!Object.values(USER_ROLES).includes(newRole)) {
    logger.error(`promoteUserToRole: Rol '${newRole}' no es válido. Roles válidos: ${Object.values(USER_ROLES).join(', ')}`);
    return false;
  }

  logger.info(`Intentando promover al usuario ${userToPromote.username} (ID: ${userToPromote.id}) al rol: ${newRole}`);

  const adminUser = getUsersByRole(USER_ROLES.ADMINISTRATOR)[0];
  if (!adminUser) {
    logger.error('promoteUserToRole: No se encontró un usuario administrador en la configuración local.');
    return false;
  }
  const adminToken = getUserToken(adminUser.username);
  if (!adminToken) {
    logger.error(`promoteUserToRole: El usuario administrador ${adminUser.username} no está autenticado o no tiene token.`);
    return false;
  }

  const promoteEndpoint = `${USERS_ENDPOINT}/${userToPromote.id}/role`;

  try {
    await axios.put(promoteEndpoint, {
      role: newRole // Ej: "Analyst", "Employee", "Administrator"
    }, {
      headers: { Authorization: `Bearer ${adminToken}` },
      timeout: config.API_TIMEOUT,
    });
    logger.info(`Usuario ${userToPromote.username} promovido exitosamente al rol ${newRole} en la API.`);
    // Actualizar el rol en nuestro array local también, por consistencia.
    userToPromote.role = newRole;
    return true;
  } catch (error) {
    let apiError;
    if (error.isAxiosError) {
      const status = error.response ? error.response.status : 500;
      const message = error.response?.data?.message || error.response?.data?.title || error.message;
      apiError = new APIError(
        message,
        status,
        `Promover usuario ${userToPromote.username} a ${newRole}`,
        { requestConfig: error.config, responseData: error.response?.data }
      );
    } else if (!(error instanceof APIError || error instanceof AppError)) {
      apiError = new APIError(
        error.message || 'Error desconocido durante la promoción de rol.',
        500,
        `Promover usuario ${userToPromote.username} a ${newRole}`,
        { originalError: error }
      );
    } else {
      apiError = error;
    }
    handleError(apiError);
    return false;
  }
}

/**
 * Promueve a todos los usuarios definidos como analistas en src/data/users.js al rol de Analista en la API,
 * si su rol actual en la API (o localmente si no se pudo verificar) no es Analista.
 * @returns {Promise<number>} El número de analistas promovidos exitosamente en esta ejecución.
 */
async function promoteAnalysts() {
  logger.separator('INICIO DE PROMOCIÓN DE ANALISTAS');
  // Usuarios que según nuestra configuración inicial deberían ser analistas
  const targetAnalystUsernames = ['juan.perez', 'carlos.lopez'];
  let analystsRequiringPromotion = [];

  for (const username of targetAnalystUsernames) {
      const analyst = allUsers.find(u => u.username === username);
      if (analyst) {
          if (analyst.role !== USER_ROLES.ANALYST) {
              logger.info(`Analista ${username} tiene rol local '${analyst.role}', requiere promoción a '${USER_ROLES.ANALYST}'.`);
              analystsRequiringPromotion.push(analyst);
          } else {
              logger.info(`Analista ${username} ya tiene el rol '${USER_ROLES.ANALYST}' localmente.`);
          }
      } else {
          logger.warn(`Usuario analista objetivo ${username} no encontrado en la lista local 'allUsers'.`);
      }
  }

  if (analystsRequiringPromotion.length === 0) {
    logger.info('No hay analistas que necesiten promoción según los datos locales.');
    logger.separator('FIN DE PROMOCIÓN DE ANALISTAS');
    return 0;
  }

  let successfulPromotions = 0;
  for (const analyst of analystsRequiringPromotion) {
    if (!analyst.id) {
      logger.warn(`El analista ${analyst.username} no tiene un ID de API. No se puede promover. Ejecute fetchAndStoreUserIds o asegure login exitoso primero.`);
      continue;
    }
    const success = await promoteUserToRole(analyst, USER_ROLES.ANALYST);
    if (success) {
      successfulPromotions++;
    }
    await delay(20); // Pequeña pausa entre promociones
  }

  logger.info(`Total de analistas promovidos exitosamente en esta ejecución: ${successfulPromotions} de ${analystsRequiringPromotion.length}`);
  if (successfulPromotions < analystsRequiringPromotion.length) {
    logger.warn('Algunos analistas no pudieron ser promovidos. Revisa los logs de error.');
  }
  logger.separator('FIN DE PROMOCIÓN DE ANALISTAS');
  return successfulPromotions;
}

/**
 * Obtiene un usuario por su username desde el array local 'allUsers'.
 * @param {string} username
 * @returns {object | undefined} El objeto de usuario si se encuentra, o undefined.
 */
function getLocalUserByUsername(username) {
    return allUsers.find(u => u.username === username);
}


export { fetchAndStoreUserIds, promoteUserToRole, promoteAnalysts, getLocalUserByUsername };
