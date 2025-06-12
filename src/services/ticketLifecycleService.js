// src/services/ticketLifecycleService.js
import axios from 'axios';
import FormData from 'form-data'; // Necesitarás instalar form-data: pnpm add form-data
import config from '../config/index.js';
import logger from '../utils/logger.js';
import { handleError, APIError, AppError } from '../utils/errorHandler.js';
import { selectRandomElement, delay, getRandomInt } from '../utils/helpers.js';
import { getUserToken, getUserId } from './authService.js';
import { getLocalUserByUsername } from './userService.js';
import { getRandomAttachmentDetails } from './fileService.js';

// Datos para contenido de tickets y comentarios
import subcategoriesData from '../data/subcategories.js';
import { TITLES, TICKET_DETAILS, PREFIXES, SUFFIXES } from '../data/ticketContent.js';
import {
  ANALYST_COMMENTS,
  USER_COMMENTS,
  RESOLUTION_COMMENTS,
  LOCK_REASONS,
  USER_CLOSURE_COMMENTS,
  ANALYST_FOLLOWUP_COMMENTS,
  USER_FOLLOWUP_COMMENTS
} from '../data/commentContent.js';

const TICKETS_BASE_ENDPOINT = `${config.BASE_URL}/Tickets`;

/**
 * Helper para manejar errores de API de forma consistente en este servicio.
 * @param {Error} error - El error original.
 * @param {string} context - Contexto de la operación.
 * @param {string} [usernameForContext=''] - Nombre de usuario para añadir al contexto.
 * @throws {APIError}
 */
function handleTicketServiceError(error, context, usernameForContext = '') {
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
      error.message || 'Error desconocido en servicio de tickets.',
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
 * Crea un nuevo ticket.
 * @param {string} creatorUsername - Username del empleado que crea el ticket.
 * @param {string} subcategoryName - Nombre de la subcategoría del ticket.
 * @param {boolean} [includeAttachment=false] - Si se debe incluir un adjunto aleatorio.
 * @returns {Promise<object|null>} El objeto del ticket creado por la API o null si falla.
 */
async function createTicket(creatorUsername, subcategoryName, includeAttachment = false) {
  logger.info(`Creando ticket para ${creatorUsername} en subcategoría '${subcategoryName}' ${includeAttachment ? 'con adjunto' : 'sin adjunto'}.`);
  const creatorToken = getUserToken(creatorUsername);
  const creator = getLocalUserByUsername(creatorUsername);

  if (!creatorToken || !creator) {
    logger.error(`No se pudo obtener token o datos para el creador: ${creatorUsername}`);
    return null;
  }

  const subcategory = subcategoriesData.find(s => s.name === subcategoryName);
  if (!subcategory) {
    logger.error(`Subcategoría '${subcategoryName}' no encontrada en los datos locales.`);
    return null;
  }

  const titlesForSubcategory = TITLES[subcategoryName] || TITLES["Errores generales (Aplicaciones)"];
  const ticketTitle = selectRandomElement(titlesForSubcategory);

  const detailsForSubcategory = TICKET_DETAILS[subcategoryName] || TICKET_DETAILS["Errores generales (Aplicaciones)"];
  const ticketDetailBody = selectRandomElement(detailsForSubcategory);
  const prefix = selectRandomElement(PREFIXES).replace('{username}', creator.name || creatorUsername); // Usar nombre real si está disponible
  const suffix = selectRandomElement(SUFFIXES);
  const ticketDescription = `${prefix}${ticketDetailBody}${suffix}`;

  const form = new FormData();
  form.append('Title', ticketTitle);
  form.append('Description', ticketDescription);
  form.append('SubcategoryId', subcategory.id);

  // Siempre agregar de 1 a 3 archivos adjuntos aleatorios
  const numAttachments = getRandomInt(1, 4); // 1, 2 o 3
  let attachedCount = 0;
  for (let i = 0; i < numAttachments; i++) {
    const attachment = await getRandomAttachmentDetails();
    if (attachment) {
      form.append('Attachments', attachment.fileContent, attachment.fileName);
      logger.info(`Adjuntando archivo: ${attachment.fileName}`);
      attachedCount++;
    } else {
      logger.warn('No se pudo obtener un adjunto para el ticket.');
    }
  }
  if (attachedCount === 0) {
    logger.warn('No se adjuntó ningún archivo al ticket.');
  }

  try {
    const response = await axios.post(TICKETS_BASE_ENDPOINT, form, {
      headers: {
        ...form.getHeaders(), // Necesario para FormData con axios
        Authorization: `Bearer ${creatorToken}`,
      },
      timeout: config.API_TIMEOUT,
    });
    // Basado en tu ejemplo, la respuesta contiene el objeto ticket completo.
    logger.info(`Ticket creado exitosamente por ${creatorUsername}. ID: ${response.data.id}, Título: ${response.data.title}`);
    return response.data; // Devuelve el objeto ticket completo
  } catch (error) {
    handleTicketServiceError(error, 'Crear ticket', creatorUsername);
    return null; // O relanzar si se prefiere detener el flujo
  }
}

/**
 * Añade un comentario a un ticket existente.
 * @param {string} ticketId - ID del ticket.
 * @param {string} commenterUsername - Username de quien comenta.
 * @param {string} commentText - Texto del comentario.
 * @param {boolean} [includeAttachment=false] - Si se debe incluir un adjunto aleatorio.
 * @returns {Promise<object|null>} La respuesta de la API o null si falla.
 */
async function addCommentToTicket(ticketId, commenterUsername, commentText, includeAttachment = false) {
  logger.info(`Añadiendo comentario de ${commenterUsername} al ticket ${ticketId} ${includeAttachment ? 'con adjunto' : ''}.`);
  const commenterToken = getUserToken(commenterUsername);
  if (!commenterToken) {
    logger.error(`No se pudo obtener token para el comentador: ${commenterUsername}`);
    return null;
  }

  const form = new FormData();
  form.append('Comment', commentText);

  if (includeAttachment) {
    const attachment = await getRandomAttachmentDetails();
    if (attachment) {
      form.append('Attachments', attachment.fileContent, attachment.fileName);
      logger.info(`Adjuntando archivo al comentario: ${attachment.fileName}`);
    } else {
      logger.warn('Se solicitó adjunto para comentario pero no se pudo obtener uno.');
    }
  }

  try {
    const response = await axios.post(`${TICKETS_BASE_ENDPOINT}/${ticketId}/comments`, form, {
      headers: {
        ...form.getHeaders(),
        Authorization: `Bearer ${commenterToken}`,
      },
      timeout: config.API_TIMEOUT,
    });
    logger.info(`Comentario añadido exitosamente al ticket ${ticketId} por ${commenterUsername}.`);
    return response.data;
  } catch (error) {
    handleTicketServiceError(error, `Añadir comentario al ticket ${ticketId}`, commenterUsername);
    return null;
  }
}

/**
 * Asigna un ticket a un analista.
 * @param {string} ticketId - ID del ticket.
 * @param {string} analystUsername - Username del analista a quien se asignará.
 * @returns {Promise<object|null>} La respuesta de la API o null si falla.
 */
async function assignTicketToAnalyst(ticketId, analystUsername) {
  logger.info(`Autoasignando ticket ${ticketId} al analista ${analystUsername}.`);
  const analystToken = getUserToken(analystUsername);
  const assignee = getLocalUserByUsername(analystUsername);

  if (!analystToken) {
    logger.error(`No se pudo obtener token para el analista: ${analystUsername}`);
    return null;
  }
  if (!assignee || !assignee.id) {
    logger.error(`No se pudo obtener ID para el analista: ${analystUsername}. Asegúrate de que haya sido autenticado y su ID obtenido.`);
    return null;
  }

  try {
    const response = await axios.put(`${TICKETS_BASE_ENDPOINT}/${ticketId}/assign`, {
      assignedUserId: assignee.id,
    }, {
      headers: { Authorization: `Bearer ${analystToken}` },
      timeout: config.API_TIMEOUT,
    });
    logger.info(`Ticket ${ticketId} autoasignado exitosamente al analista ${analystUsername}.`);
    return response.data;
  } catch (error) {
    handleTicketServiceError(error, `Autoasignar ticket ${ticketId} al analista ${analystUsername}`, analystUsername);
    return null;
  }
}

/**
 * Resuelve un ticket.
 * @param {string} ticketId - ID del ticket.
 * @param {string} analystUsername - Username del analista que resuelve.
 * @param {boolean} [includeAttachment=false] - Si se debe incluir un adjunto aleatorio.
 * @returns {Promise<object|null>} La respuesta de la API o null si falla.
 */
async function resolveTicket(ticketId, analystUsername, includeAttachment = false) {
  logger.info(`Resolviendo ticket ${ticketId} por ${analystUsername} ${includeAttachment ? 'con adjunto de resolución' : ''}.`);
  const analystToken = getUserToken(analystUsername);
  if (!analystToken) {
    logger.error(`No se pudo obtener token para el analista: ${analystUsername}`);
    return null;
  }

  const resolutionCommentText = selectRandomElement(RESOLUTION_COMMENTS);
  const form = new FormData();
  form.append('ResolutionComment', resolutionCommentText);

  if (includeAttachment) {
    const attachment = await getRandomAttachmentDetails();
    if (attachment) {
      form.append('Attachments', attachment.fileContent, attachment.fileName);
      logger.info(`Adjuntando archivo a la resolución: ${attachment.fileName}`);
    } else {
      logger.warn('Se solicitó adjunto para resolución pero no se pudo obtener uno.');
    }
  }

  try {
    const response = await axios.put(`${TICKETS_BASE_ENDPOINT}/${ticketId}/resolve`, form, {
      headers: {
        ...form.getHeaders(),
        Authorization: `Bearer ${analystToken}`,
      },
      timeout: config.API_TIMEOUT,
    });
    logger.info(`Ticket ${ticketId} resuelto exitosamente por ${analystUsername}.`);
    return response.data;
  } catch (error) {
    handleTicketServiceError(error, `Resolver ticket ${ticketId}`, analystUsername);
    return null;
  }
}

/**
 * Acepta la resolución de un ticket por parte del empleado.
 * @param {string} ticketId - ID del ticket.
 * @param {string} employeeUsername - Username del empleado que acepta.
 * @returns {Promise<object|null>} La respuesta de la API o null si falla.
 */
async function acceptTicketResolution(ticketId, employeeUsername) {
  logger.info(`Empleado ${employeeUsername} aceptando resolución del ticket ${ticketId}.`);
  const employeeToken = getUserToken(employeeUsername);
  if (!employeeToken) {
    logger.error(`No se pudo obtener token para el empleado: ${employeeUsername}`);
    return null;
  }

  // Opcional: añadir un comentario de cierre por parte del usuario si la API lo permitiera en este endpoint
  // o si se hiciera una llamada separada a addCommentToTicket.
  // Por ahora, seguimos la documentación que no muestra un cuerpo para este PUT.
  // const closureComment = selectRandomElement(USER_CLOSURE_COMMENTS);
  // logger.info(`Comentario de cierre del empleado: "${closureComment}"`); // Para log, no se envía

  try {
    const response = await axios.put(`${TICKETS_BASE_ENDPOINT}/${ticketId}/accept-resolution`, {}, {
      headers: { Authorization: `Bearer ${employeeToken}` },
      timeout: config.API_TIMEOUT,
    });
    logger.info(`Resolución del ticket ${ticketId} aceptada exitosamente por ${employeeUsername}. Ticket cerrado.`);
    return response.data;
  } catch (error) {
    handleTicketServiceError(error, `Aceptar resolución del ticket ${ticketId}`, employeeUsername);
    return null;
  }
}

/**
 * Bloquea un ticket.
 * @param {string} ticketId - ID del ticket.
 * @param {string} analystUsername - Username del analista que bloquea.
 * @returns {Promise<object|null>} La respuesta de la API o null si falla.
 */
async function lockTicket(ticketId, analystUsername) {
  logger.info(`Bloqueando ticket ${ticketId} por ${analystUsername}.`);
  const analystToken = getUserToken(analystUsername);
  if (!analystToken) {
    logger.error(`No se pudo obtener token para el analista: ${analystUsername}`);
    return null;
  }

  const lockReasonText = selectRandomElement(LOCK_REASONS);

  try {
    const response = await axios.post(`${TICKETS_BASE_ENDPOINT}/${ticketId}/lock`, {
      lockReason: lockReasonText,
    }, {
      headers: { Authorization: `Bearer ${analystToken}` },
      timeout: config.API_TIMEOUT,
    });
    logger.info(`Ticket ${ticketId} bloqueado exitosamente por ${analystUsername}. Razón: ${lockReasonText}`);
    return response.data;
  } catch (error) {
    handleTicketServiceError(error, `Bloquear ticket ${ticketId}`, analystUsername);
    return null;
  }
}

export {
  createTicket,
  addCommentToTicket,
  assignTicketToAnalyst,
  resolveTicket,
  acceptTicketResolution,
  lockTicket,
  // Podríamos añadir más funciones como reopenTicket, unlockTicket si son necesarias
  // y están en la API (reopen y unlock están en la documentación).
  ANALYST_COMMENTS, // Exportar para uso en el orquestador
  USER_COMMENTS,    // Exportar para uso en el orquestador
  ANALYST_FOLLOWUP_COMMENTS,
  USER_FOLLOWUP_COMMENTS,
  USER_CLOSURE_COMMENTS
};