import axios from 'axios';
import config from '../config/index.js';
import logger from '../utils/logger.js';
import { handleError, APIError, AppError } from '../utils/errorHandler.js';
import { selectRandomElement, getRandomInt } from '../utils/helpers.js';
import { getUserToken } from './authService.js';
import { USER_CLOSURE_COMMENTS, ANALYST_FOLLOWUP_COMMENTS } from '../data/commentContent.js'; // Usar comentarios de cierre de usuario o de seguimiento de analistas

const SURVEYS_BASE_ENDPOINT = `${config.BASE_URL}/Surveys`;

/**
 * Helper para manejar errores de API de forma consistente en este servicio.
 * @param {Error} error - El error original.
 * @param {string} context - Contexto de la operación.
 * @param {string} [usernameForContext=''] - Nombre de usuario para añadir al contexto.
 * @throws {APIError}
 */
function handleSurveyServiceError(error, context, usernameForContext = '') {
  let apiError;
  const fullContext = usernameForContext ? `${context} (Usuario: ${usernameForContext})` : context;

  if (error.isAxiosError) {
    const status = error.response ? error.response.status : 500;
    const message = error.response?.data?.message || error.response?.data?.title || error.message;
    apiError = new APIError(
      message,
      status,
      fullContext,
      { requestConfig: error.config, responseData: error.response?.data }
    );
  } else if (!(error instanceof APIError || error instanceof AppError)) {
    apiError = new APIError(
      error.message || 'Error desconocido en servicio de encuestas.',
      500,
      fullContext,
      { originalError: error }
    );
  } else {
    error.context = error.context || fullContext; // Asegurar contexto si ya es un error conocido
    apiError = error;
  }
  handleError(apiError); // Loguea el error
  throw apiError; // Relanza para que el flujo principal pueda decidir cómo continuar
}

/**
 * Obtiene todas las encuestas pendientes para ser completadas (requiere token de administrador).
 * @param {string} adminUsername - Username del usuario administrador.
 * @returns {Promise<Array<object>>} Una lista de encuestas pendientes o un array vacío si falla.
 */
async function getPendingSurveys(adminUsername) {
  logger.info(`Intentando obtener encuestas pendientes como ${adminUsername}.`);
  const adminToken = await Promise.resolve(getUserToken(adminUsername));
  if (!adminToken) {
    logger.error(`No se pudo obtener token de administrador para ${adminUsername}`);
    return [];
  }

  try {
    // Filtrar por IsCompleted = false para obtener solo las pendientes
    const response = await axios.get(`${SURVEYS_BASE_ENDPOINT}`, {
      headers: { Authorization: `Bearer ${adminToken}` },
      params: { IsCompleted: false, PageSize: 50 }, // Asumo un PageSize máximo para obtener la mayoría
      timeout: config.API_TIMEOUT,
    });

    if (response.data && Array.isArray(response.data.items)) {
      logger.info(`Se encontraron ${response.data.items.length} encuestas pendientes.`);
      return response.data.items;
    } else {
      logger.warn('La respuesta de obtener encuestas pendientes no contiene items válidos.');
      return [];
    }
  } catch (error) {
    handleSurveyServiceError(error, `Obtener encuestas pendientes como ${adminUsername}`, adminUsername);
    return [];
  }
}

/**
 * Obtiene los detalles de una encuesta específica utilizando el ID del ticket asociado.
 * @param {string} ticketId - El ID del ticket asociado a la encuesta.
 * @param {string} authenticatedUsername - El nombre de usuario de un usuario autenticado (ej. administrador).
 * @returns {Promise<object|null>} El objeto de la encuesta con sus detalles (incluyendo el token) o null si falla.
 */
async function getSurveyDetailsByTicketId(ticketId, authenticatedUsername) {
  logger.info(`Intentando obtener detalles de la encuesta para el ticket: ${ticketId}.`);
  const authToken = await Promise.resolve(getUserToken(authenticatedUsername));
  if (!authToken) {
    logger.error(`No se pudo obtener token de autenticación para ${authenticatedUsername}. No se pueden obtener detalles de la encuesta.`);
    return null;
  }

  try {
    const response = await axios.get(`${SURVEYS_BASE_ENDPOINT}/ticket/${ticketId}`, {
      headers: { Authorization: `Bearer ${authToken}` },
      timeout: config.API_TIMEOUT,
    });
    logger.info(`Detalles de la encuesta para el ticket ${ticketId} obtenidos exitosamente.`);
    return response.data; // Asumo que esta respuesta contiene el token de la encuesta
  } catch (error) {
    if (error.response && error.response.status === 404) {
      logger.warn(`No se encontraron detalles de la encuesta para el ticket ${ticketId}.`);
    } else {
      handleSurveyServiceError(error, `Obtener detalles de la encuesta para el ticket ${ticketId}`, authenticatedUsername);
    }
    return null;
  }
}

/**
 * Completa una encuesta de satisfacción para un ticket utilizando su token.
 * Las calificaciones se generan aleatoriamente entre 3 y 5.
 * @param {string} surveyToken - El token único de la encuesta para completarla.
 * @param {string} ticketId - ID del ticket asociado a la encuesta (para logging).
 * @returns {Promise<object|null>} La respuesta de la API o null si falla.
 */
async function completeSurvey(surveyToken, ticketId) {
  logger.info(`Completando encuesta para el ticket ${ticketId} con el token ${surveyToken}.`);

  // Generar calificaciones aleatorias entre 3 y 5 (inclusive)
  const satisfactionRating = getRandomInt(3, 5); // 3, 4, 5
  const resolutionRating = getRandomInt(3, 5);   // 3, 4, 5
  const analystRating = getRandomInt(3, 5);      // 3, 4, 5
  const punctualityRating = getRandomInt(3, 5);  // 3, 4, 5
  const communicationRating = getRandomInt(3, 5); // 3, 4, 5

  // Seleccionar un comentario aleatorio de una combinación de comentarios de cierre de usuario y seguimiento de analistas
  const allComments = [...USER_CLOSURE_COMMENTS, ...ANALYST_FOLLOWUP_COMMENTS];
  const surveyComment = selectRandomElement(allComments);

  try {
    const response = await axios.post(`${SURVEYS_BASE_ENDPOINT}/token/${surveyToken}/complete`, {
      // No se envía ticketId en el body para este endpoint, solo el token en la URL
      satisfactionRating: satisfactionRating,
      resolutionRating: resolutionRating,
      analystRating: analystRating,
      punctualityRating: punctualityRating,
      communicationRating: communicationRating,
      comment: surveyComment,
    }, {
      // Este endpoint no requiere autenticación (AllowAnonymous), según la documentación
      timeout: config.API_TIMEOUT,
    });
    logger.info(`Encuesta para el ticket ${ticketId} completada exitosamente.`);
    return response.data;
  } catch (error) {
    handleSurveyServiceError(error, `Completar encuesta para el ticket ${ticketId} con token ${surveyToken}`, 'Anonymous'); // 'Anonymous' porque no requiere auth
    return null;
  }
}

export {
  getPendingSurveys,
  getSurveyDetailsByTicketId,
  completeSurvey,
}; 