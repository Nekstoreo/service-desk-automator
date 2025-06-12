// src/services/knowledgeBaseService.js
import axios from 'axios';
import FormData from 'form-data';
import config from '../config/index.js';
import logger from '../utils/logger.js';
import { handleError, APIError, AppError } from '../utils/errorHandler.js';
import { getUserToken } from './authService.js';
import { getRandomAttachmentDetails } from './fileService.js';

const KB_BASE_ENDPOINT = `${config.BASE_URL}/KnowledgeBase`;
const KB_CATEGORIES_ENDPOINT = `${KB_BASE_ENDPOINT}/categories`;
const KB_ARTICLES_ENDPOINT = `${KB_BASE_ENDPOINT}/articles`;

/**
 * Helper para manejar errores de API de forma consistente en este servicio.
 * @param {Error} error - El error original.
 * @param {string} context - Contexto de la operación.
 * @param {string} [usernameForContext=''] - Nombre de usuario para añadir al contexto.
 * @throws {APIError}
 */
function handleKbServiceError(error, context, usernameForContext = '') {
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
      error.message || 'Error desconocido en servicio de Knowledge Base.',
      500,
      fullContext,
      { originalError: error }
    );
  } else {
    error.context = error.context || fullContext;
    apiError = error;
  }
  handleError(apiError);
  throw apiError;
}

/**
 * Crea una nueva categoría en la Base de Conocimientos.
 * @param {string} categoryName - Nombre de la categoría.
 * @param {string} categoryDescription - Descripción de la categoría.
 * @param {string} creatorUsername - Username del usuario (Admin) que crea la categoría.
 * @returns {Promise<object|null>} El objeto de la categoría creada por la API o null si falla.
 */
async function createKbCategory(categoryName, categoryDescription, creatorUsername) {
  logger.info(`Creando categoría KB '${categoryName}' por ${creatorUsername}.`);
  const creatorToken = getUserToken(creatorUsername);

  if (!creatorToken) {
    logger.error(`No se pudo obtener token para el creador de categoría KB: ${creatorUsername}`);
    return null;
  }

  try {
    const response = await axios.post(KB_CATEGORIES_ENDPOINT, {
      name: categoryName,
      description: categoryDescription,
    }, {
      headers: {
        Authorization: `Bearer ${creatorToken}`,
        'Content-Type': 'application/json',
      },
      timeout: config.API_TIMEOUT,
    });
    // La API (punto 5.2) devuelve el objeto de la categoría creada, incluyendo su ID.
    logger.info(`Categoría KB '${categoryName}' creada exitosamente. ID: ${response.data.id}`);
    return response.data;
  } catch (error) {
    handleKbServiceError(error, `Crear categoría KB '${categoryName}'`, creatorUsername);
    return null;
  }
}


/**
 * Crea un nuevo artículo en la Base de Conocimientos (ajustado: sin categoría y usando 'topic').
 * @param {string} topic - Tema del artículo.
 * @param {string} articleContent - Contenido del artículo.
 * @param {undefined} _kbCategoryId - Ya no se usa categoría.
 * @param {string[]} keywords - Array de palabras clave para el artículo.
 * @param {string} creatorUsername - Username del usuario (Analista) que crea el artículo.
 * @param {boolean} [includeAttachment=false] - Si se debe incluir un adjunto aleatorio.
 * @returns {Promise<object|null>} El objeto del artículo creado por la API o null si falla.
 */
async function createKbArticle(
  topic,
  articleContent,
  _kbCategoryId,
  keywords,
  creatorUsername,
  includeAttachment = false
) {
  logger.info(`Creando artículo KB '${topic}' por ${creatorUsername} ${includeAttachment ? 'con adjunto' : ''}.`);
  const creatorToken = getUserToken(creatorUsername);

  if (!creatorToken) {
    logger.error(`No se pudo obtener token para el creador de artículo KB: ${creatorUsername}`);
    return null;
  }

  const form = new FormData();
  form.append('Topic', topic); // Cambiado a 'Topic'
  form.append('Content', articleContent);
  // Ya no se agrega categoryId

  if (Array.isArray(keywords)) {
    keywords.forEach(keyword => {
      form.append('Keywords', keyword);
    });
  } else if (typeof keywords === 'string' && keywords.trim() !== '') {
    form.append('Keywords', keywords);
  }

  if (includeAttachment) {
    const attachment = await getRandomAttachmentDetails();
    if (attachment) {
      form.append('Attachments', attachment.fileContent, attachment.fileName);
      logger.info(`Adjuntando archivo al artículo KB: ${attachment.fileName}`);
    } else {
      logger.warn('Se solicitó adjunto para artículo KB pero no se pudo obtener uno.');
    }
  }

  try {
    const response = await axios.post(KB_ARTICLES_ENDPOINT, form, {
      headers: {
        ...form.getHeaders(),
        Authorization: `Bearer ${creatorToken}`,
      },
      timeout: config.API_TIMEOUT,
    });
    logger.info(`Artículo KB '${topic}' (ID: ${response.data.id}) creado exitosamente.`);
    return response.data;
  } catch (error) {
    handleKbServiceError(error, `Crear artículo KB '${topic}'`, creatorUsername);
    return null;
  }
}

export { createKbCategory, createKbArticle };
