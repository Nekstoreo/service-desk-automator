// src/services/ticketLifecycleService.js
import axios from 'axios';
import FormData from 'form-data'; // Necesitarás instalar form-data: pnpm add form-data
import config from '../config/index.js';
import logger from '../utils/logger.js';
import { handleError, APIError, AppError } from '../utils/errorHandler.js';
import { selectRandomElement, getRandomInt } from '../utils/helpers.js';
import { getUserToken, getUserId } from './authService.js';
import { getLocalUserByUsername } from './userService.js';
import { getRandomAttachmentDetails } from './fileService.js';

// Datos para contenido de tickets y comentarios
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
 * @param {object} subcategory - Objeto de la subcategoría con id y name.
 * @param {boolean} [includeAttachment=false] - Si se debe incluir un adjunto aleatorio.
 * @returns {Promise<object|null>} El objeto del ticket creado por la API o null si falla.
 */
async function createTicket(creatorUsername, subcategory, includeAttachment = false) {
  logger.info(`Creando ticket para ${creatorUsername} en subcategoría '${subcategory.name}' ${includeAttachment ? 'con adjunto' : 'sin adjunto'}.`);
  // Obtener token y datos de usuario en paralelo
  const [creatorToken, creator] = await Promise.all([
    Promise.resolve(getUserToken(creatorUsername)),
    Promise.resolve(getLocalUserByUsername(creatorUsername))
  ]);

  if (!creatorToken || !creator) {
    logger.error(`No se pudo obtener token o datos para el creador: ${creatorUsername}`);
    return null;
  }


  // La subcategoría se obtiene ahora desde el flujo principal y se pasa solo el nombre

  // Ahora los títulos y detalles son agnósticos a la subcategoría
  const ticketTitle = selectRandomElement(TITLES);
  const ticketDetailBody = selectRandomElement(TICKET_DETAILS);
  const prefix = selectRandomElement(PREFIXES).replace('{username}', creator.name || creatorUsername); // Usar nombre real si está disponible
  const suffix = selectRandomElement(SUFFIXES);
  const ticketDescription = `${prefix}${ticketDetailBody}${suffix}`;

  const form = new FormData();
  form.append('Title', ticketTitle);
  form.append('Description', ticketDescription);
  form.append('SubcategoryId', subcategory.id);

  // Siempre agregar de 1 a 3 archivos adjuntos aleatorios (en paralelo)
  const numAttachments = getRandomInt(1, 4); // 1, 2 o 3
  let attachedCount = 0;
  const attachmentPromises = Array.from({ length: numAttachments }, () => getRandomAttachmentDetails());
  const attachments = await Promise.all(attachmentPromises);
  attachments.forEach(attachment => {
    if (attachment) {
      form.append('Attachments', attachment.fileContent, attachment.fileName);
      logger.info(`Adjuntando archivo: ${attachment.fileName}`);
      attachedCount++;
    } else {
      logger.warn('No se pudo obtener un adjunto para el ticket.');
    }
  });
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
    // Log del error detallado antes de manejarlo
    logger.error(`Error detallado al crear ticket para ${creatorUsername}:`, {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });
    
    // Registrar el error pero no relanzarlo para que el flujo continue
    let apiError;
    const fullContext = `Crear ticket (Usuario: ${creatorUsername})`;

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
      error.context = error.context || fullContext;
      apiError = error;
    }
    
    handleError(apiError); // Solo loguea, no lanza
    return null;
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
  // Obtener token y adjunto (si aplica) en paralelo
  const [commenterToken, attachment] = await Promise.all([
    Promise.resolve(getUserToken(commenterUsername)),
    includeAttachment ? getRandomAttachmentDetails() : Promise.resolve(null)
  ]);
  if (!commenterToken) {
    logger.error(`No se pudo obtener token para el comentador: ${commenterUsername}`);
    return null;
  }

  const form = new FormData();
  form.append('Comment', commentText);

  if (includeAttachment && attachment) {
    form.append('Attachments', attachment.fileContent, attachment.fileName);
    logger.info(`Adjuntando archivo al comentario: ${attachment.fileName}`);
  } else if (includeAttachment && !attachment) {
    logger.warn('Se solicitó adjunto para comentario pero no se pudo obtener uno.');
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
  // Obtener token y datos de usuario en paralelo
  const [analystToken, assignee] = await Promise.all([
    Promise.resolve(getUserToken(analystUsername)),
    Promise.resolve(getLocalUserByUsername(analystUsername))
  ]);

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
  // Obtener token y adjunto (si aplica) en paralelo
  const [analystToken, attachment] = await Promise.all([
    Promise.resolve(getUserToken(analystUsername)),
    includeAttachment ? getRandomAttachmentDetails() : Promise.resolve(null)
  ]);
  if (!analystToken) {
    logger.error(`No se pudo obtener token para el analista: ${analystUsername}`);
    return null;
  }

  const resolutionCommentText = selectRandomElement(RESOLUTION_COMMENTS);
  const form = new FormData();
  form.append('ResolutionComment', resolutionCommentText);

  if (includeAttachment && attachment) {
    form.append('Attachments', attachment.fileContent, attachment.fileName);
    logger.info(`Adjuntando archivo a la resolución: ${attachment.fileName}`);
  } else if (includeAttachment && !attachment) {
    logger.warn('Se solicitó adjunto para resolución pero no se pudo obtener uno.');
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
  const employeeToken = await Promise.resolve(getUserToken(employeeUsername));
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
  const analystToken = await Promise.resolve(getUserToken(analystUsername));
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