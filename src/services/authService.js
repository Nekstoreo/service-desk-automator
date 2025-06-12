// src/services/authService.js
import axios from 'axios';
import config from '../config/index.js';
import allUsers from '../data/users.js'; // Importamos el array mutable
import logger from '../utils/logger.js';
import { handleError, APIError } from '../utils/errorHandler.js';
import { delay } from '../utils/helpers.js';

const LOGIN_ENDPOINT = `${config.BASE_URL}/Auth/login`;

/**
 * Autentica a un usuario individual contra la API.
 * Actualiza el objeto de usuario en el array 'allUsers' con el token y el ID.
 * @param {object} user - El objeto de usuario con 'username' y 'password'.
 * @returns {Promise<boolean>} True si la autenticación fue exitosa, false en caso contrario.
 */
async function authenticateUser(user) {
  if (!user || !user.username || !user.password) {
    logger.warn(`authenticateUser: Datos de usuario incompletos para ${user ? user.username : 'usuario desconocido'}.`);
    return false;
  }

  logger.info(`Intentando autenticar al usuario: ${user.username}`);
  try {
    const response = await axios.post(LOGIN_ENDPOINT, {
      username: user.username,
      password: user.password,
    }, {
      timeout: config.API_TIMEOUT,
    });

    if (response.data && response.data.token && response.data.user && response.data.user.id) {
      const userInArray = allUsers.find(u => u.username === user.username);
      if (userInArray) {
        userInArray.token = response.data.token;
        userInArray.id = response.data.user.id;
        userInArray.name = response.data.user.name; 
        userInArray.emailFromApi = response.data.user.email; 
        
        if (userInArray.role !== response.data.user.role) {
            logger.warn(`Discrepancia de rol para ${user.username}: Local='${userInArray.role}', API='${response.data.user.role}'. Se usará el rol de la API.`);
            userInArray.role = response.data.user.role;
        }

        logger.info(`Usuario ${user.username} (ID: ${userInArray.id}) autenticado exitosamente.`);
      } else {
        logger.warn(`Usuario ${user.username} autenticado, pero no encontrado en el array global 'allUsers'.`);
      }
      return true;
    } else {
      throw new APIError(
        'La respuesta de login no contiene un token o información de usuario completa (ID).',
        response.status,
        `Login de ${user.username}`,
        { responseData: response.data }
      );
    }
  } catch (error) {
    let apiError;
    if (error.isAxiosError) {
      const status = error.response ? error.response.status : 500;
      const message = error.response && error.response.data && error.response.data.message
        ? error.response.data.message
        : error.message;
      apiError = new APIError(
        message,
        status,
        `Login de ${user.username}`,
        { requestConfig: error.config, responseData: error.response ? error.response.data : null }
      );
    } else if (!(error instanceof APIError)) {
      apiError = new APIError(
        error.message || 'Error desconocido durante el login.',
        500,
        `Login de ${user.username}`,
        { originalError: error }
      );
    } else {
      apiError = error;
    }
    
    apiError.context = apiError.context || `Login de ${user.username}`;
    handleError(apiError);
    const userInArray = allUsers.find(u => u.username === user.username);
    if (userInArray) {
        userInArray.token = null;
        userInArray.id = null;
    }
    return false;
  }
}

/**
 * Autentica a todos los usuarios definidos en src/data/users.js.
 * @returns {Promise<number>} El número de usuarios autenticados exitosamente.
 */
async function authenticateAllUsers() {
  logger.separator('INICIO DE AUTENTICACIÓN DE USUARIOS');
  let successfulAuthentications = 0;

  for (const user of allUsers) {
    const success = await authenticateUser(user);
    if (success) {
      successfulAuthentications++;
    }
    await delay(20); 
  }

  logger.info(`Total de usuarios autenticados exitosamente: ${successfulAuthentications} de ${allUsers.length}`);
  logger.separator('FIN DE AUTENTICACIÓN DE USUARIOS');

  if (successfulAuthentications === 0 && allUsers.length > 0) {
    logger.error('Ningún usuario pudo ser autenticado. Revisa la configuración de la API y las credenciales.');
  } else if (successfulAuthentications < allUsers.length) {
    logger.warn('Algunos usuarios no pudieron ser autenticados. Revisa los logs de error.');
  }

  return successfulAuthentications;
}

/**
 * Obtiene el token de un usuario específico.
 * @param {string} username - El nombre de usuario.
 * @returns {string | null} El token JWT si el usuario está autenticado, o null.
 */
function getUserToken(username) {
  const user = allUsers.find(u => u.username === username);
  if (user && user.token) {
    return user.token;
  }
  logger.warn(`Token no encontrado para el usuario: ${username}. ¿Fue autenticado?`);
  return null;
}

/**
 * Obtiene el ID de un usuario específico.
 * @param {string} username - El nombre de usuario.
 * @returns {string | null} El ID del usuario si se conoce, o null.
 */
function getUserId(username) {
  const user = allUsers.find(u => u.username === username);
  if (user && user.id) {
    return user.id;
  }
  logger.warn(`ID no encontrado para el usuario: ${username}. ¿Fue autenticado y se obtuvo su ID?`);
  return null;
}


export { authenticateUser, authenticateAllUsers, getUserToken, getUserId };
