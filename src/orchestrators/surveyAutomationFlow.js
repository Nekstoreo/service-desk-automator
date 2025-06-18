import logger from '../utils/logger.js';
import { getPendingSurveys, completeSurvey, getSurveyDetailsByTicketId } from '../services/surveyAutomationService.js';
import { getRandomAdminUser } from '../services/userService.js'; // Asumo que esta función existe o la podemos crear/obtener de userService
import * as authService from '../services/authService.js'; // Importar authService

/**
 * Orquesta el proceso de obtención y completado de encuestas pendientes.
 * Este flujo asume que se ejecutará periódicamente para procesar encuestas.
 */
async function automateSurveyCompletion() {
  logger.info('Iniciando el flujo de automatización de encuestas.');

  // Autenticación de usuarios para asegurar que los tokens estén disponibles
  logger.info('Autenticando todos los usuarios para la automatización de encuestas...');
  const authSuccessCount = await authService.authenticateAllUsers();
  if (authSuccessCount === 0) {
    logger.error('Fallo crítico: Ningún usuario pudo ser autenticado. Abortando flujo de encuestas.');
    return;
  }
  logger.info(`Se autenticaron ${authSuccessCount} usuarios.`);

  let adminUser;
  try {
    adminUser = getRandomAdminUser();
    if (!adminUser) {
      logger.error('No se pudo obtener un usuario administrador para la automatización de encuestas.');
      return;
    }
    logger.info(`Autenticado como administrador: ${adminUser.username}`);
  } catch (error) {
    logger.error(`Error al obtener usuario administrador: ${error.message}`);
    return;
  }

  try {
    const pendingSurveys = await getPendingSurveys(adminUser.username);

    if (pendingSurveys.length === 0) {
      logger.info('No se encontraron encuestas pendientes para completar.');
      return;
    }

    logger.info(`Se encontraron ${pendingSurveys.length} encuestas pendientes. Procesando...`);

    for (const survey of pendingSurveys) {
      if (!survey.ticketId) {
        logger.warn(`Encuesta con ID ${survey.id} no tiene un Ticket ID asociado, omitiendo.`);
        continue;
      }

      // Obtener los detalles completos de la encuesta, incluyendo el token, usando el TicketId
      const surveyDetails = await getSurveyDetailsByTicketId(survey.ticketId, adminUser.username);

      if (surveyDetails && surveyDetails.accessGuidToken) {
        logger.info(`Completando encuesta para Ticket ID: ${survey.ticketId}, Survey ID: ${survey.id} (Token: ${surveyDetails.accessGuidToken.substring(0, 8)}...).`);
        // La función completeSurvey ya no necesita el ticketId en el body, solo el token en la URL.
        // Sin embargo, mantenemos el ticketId en el segundo parámetro para propósitos de logging si es útil.
        await completeSurvey(surveyDetails.accessGuidToken, survey.ticketId);
      } else {
        logger.warn(`No se pudieron obtener los detalles de la encuesta o el token para el ticket ${survey.ticketId} (Survey ID: ${survey.id}), omitiendo.`);
      }
    }
    logger.info('Flujo de automatización de encuestas completado.');
  } catch (error) {
    logger.error(`Error durante el flujo de automatización de encuestas: ${error.message}`);
  }
}

export {
  automateSurveyCompletion,
}; 