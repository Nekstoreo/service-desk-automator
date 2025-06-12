// src/orchestrators/knowledgeBaseFlow.js
import logger from '../utils/logger.js';
import { delay, selectRandomElement, getRandomInt } from '../utils/helpers.js';
import { AppError } from '../utils/errorHandler.js'; // initializeGlobalErrorHandlers ya se llama en app.js
import { initializeFileCache } from '../services/fileService.js'; // Para asegurar que la caché esté lista

import { USER_ROLES, getUsersByRole } from '../data/users.js';
import { KB_CATEGORIES, KB_ARTICLES } from '../data/knowledgeBaseContent.js';

import * as authService from '../services/authService.js';
import * as kbService from '../services/knowledgeBaseService.js';

/**
 * Función principal para ejecutar el flujo de automatización de la Base de Conocimientos.
 */
async function runKbAutomation() {
  logger.separator('INICIO DE LA AUTOMATIZACIÓN DE LA BASE DE CONOCIMIENTOS');

  try {
    // Asegurar que la caché de archivos esté inicializada
    // initializeGlobalErrorHandlers() se llama en app.js
    await initializeFileCache();
    logger.info('Caché de archivos para adjuntos verificada/inicializada.');

    // Paso 1: Autenticación de usuarios necesarios
    // No es necesario re-autenticar si ya se hizo en el flujo principal y los tokens son válidos.
    // Pero para un flujo independiente, es mejor asegurar la autenticación.
    // Si este flujo se ejecuta siempre DESPUÉS del de tickets, se podría optimizar
    // para reusar los tokens, pero por ahora lo hacemos independiente.

    const adminUser = getUsersByRole(USER_ROLES.ADMINISTRATOR)[0];
    const analystUser = getUsersByRole(USER_ROLES.ANALYST)[0]; // Tomamos el primer analista

    if (!adminUser) {
      throw new AppError('No se encontró un usuario administrador en la configuración local para crear categorías KB.', 500, false);
    }
    if (!analystUser) {
      throw new AppError('No se encontró un usuario analista en la configuración local para crear artículos KB.', 500, false);
    }

    // Asegurar que estén autenticados (si no lo están ya por un flujo anterior)
    // Esta llamada podría ser redundante si authenticateAllUsers ya se ejecutó y los tokens están en allUsersArray.
    // Pero para independencia del flujo:
    if (!authService.getUserToken(adminUser.username)) {
        logger.info(`Autenticando a ${adminUser.username} para operaciones de KB...`);
        await authService.authenticateUser(adminUser);
        if (!authService.getUserToken(adminUser.username)) {
            throw new AppError(`No se pudo autenticar al administrador ${adminUser.username}.`, 500, false);
        }
    }
     if (!authService.getUserToken(analystUser.username)) {
        logger.info(`Autenticando a ${analystUser.username} para operaciones de KB...`);
        await authService.authenticateUser(analystUser);
         if (!authService.getUserToken(analystUser.username)) {
            throw new AppError(`No se pudo autenticar al analista ${analystUser.username}.`, 500, false);
        }
    }
    
    logger.info(`Usuarios listos para KB: Admin=${adminUser.username}, Analista=${analystUser.username}`);

    // Paso 2: Creación de Categorías y Artículos KB
    logger.separator('PASO 2: CREACIÓN DE CATEGORÍAS Y ARTÍCULOS KB');

    // Ahora los artículos no están agrupados por categoría ni requieren creación de categorías
    logger.info(`Creando ${KB_ARTICLES.length} artículos de la base de conocimientos...`);
    for (const articleData of KB_ARTICLES) {
      // Decidir aleatoriamente si incluir adjunto (ej. 60% de probabilidad)
      const includeAttachment = Math.random() < 0.6;
      // El backend espera 'topic' en vez de 'title' y ya no requiere categoryId
      const newArticle = await kbService.createKbArticle(
        articleData.topic,
        articleData.content,
        undefined, // categoryId eliminado
        articleData.keywords,
        analystUser.username,
        includeAttachment
      );
      if (newArticle) {
        logger.info(`Artículo KB '${articleData.topic}' creado con ID: ${newArticle.id}`);
      } else {
        logger.warn(`No se pudo crear el artículo KB '${articleData.topic}'. Continuando...`);
      }
      await delay(getRandomInt(20, 80)); // Pausa entre creación de artículos
    }

    logger.separator('FIN DE LA AUTOMATIZACIÓN DE LA BASE DE CONOCIMIENTOS');

  } catch (error) {
    logger.error('Error fatal durante la automatización de la Base de Conocimientos:', error.message);
    if (error instanceof AppError && !error.isOperational) {
      logger.error('La automatización de KB se detuvo debido a un error no operacional.');
    } else if (error instanceof AppError) {
      logger.error('La automatización de KB encontró un error operacional:', error.context);
    }
    // No es necesario llamar a handleError aquí si los servicios ya lo hacen y relanzan
  }
}

export { runKbAutomation };
