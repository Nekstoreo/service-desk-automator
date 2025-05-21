// src/utils/errorHandler.js
import logger from './logger.js';

/**
 * Clase base para errores personalizados de la aplicación.
 */
class AppError extends Error {
  constructor(message, statusCode = 500, isOperational = true, context = '') {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational; // Errores operacionales son 'esperados' (ej. input inválido, API error)
    this.context = context; // Dónde ocurrió el error
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error específico para problemas con la API.
 */
class APIError extends AppError {
  constructor(message, statusCode = 500, context = '', apiDetails = null) {
    super(message, statusCode, true, context); // Los errores de API suelen ser operacionales
    this.apiDetails = apiDetails; // Puede contener la respuesta de la API, config de la request, etc.
  }
}

/**
 * Maneja y registra un error.
 * @param {Error | AppError | APIError} error - El objeto de error.
 * @param {string} [defaultContext='Error no especificado'] - Contexto si el error no lo provee.
 */
function handleError(error, defaultContext = 'Contexto de error no especificado') {
  const context = error.context || defaultContext;
  let errorMessage = `Error en [${context}]: ${error.message}`;

  logger.error(errorMessage);

  if (error instanceof APIError && error.apiDetails) {
    logger.debug('Detalles de APIError:', error.apiDetails);
  }

  if (error.stack) {
    logger.debug('Stack trace:', error.stack);
  } else {
    logger.debug('Error sin stack trace:', error);
  }

  // Para errores operacionales conocidos, podríamos no querer terminar la aplicación,
  // pero sí asegurar que se registren.
  // Si es un error no operacional (bug inesperado), podríamos considerar terminar.
  if (!error.isOperational) {
    logger.error('Error no operacional detectado. Considera revisar y reiniciar si es necesario.');
    // En un servidor real, aquí podría ir process.exit(1) tras limpiar recursos.
    // Para este script de automatización, usualmente queremos que continúe si es posible
    // para procesar otros ítems, a menos que el error sea catastrófico.
  }
}

/**
 * Inicializa los manejadores globales de excepciones no capturadas y promesas rechazadas.
 */
function initializeGlobalErrorHandlers() {
  process.on('uncaughtException', (error) => {
    logger.error('EXCEPCIÓN NO CAPTURADA:', error.message);
    handleError(error, 'Excepción global no capturada');
    // Para excepciones no capturadas, usualmente es más seguro terminar.
    // process.exit(1); // Descomentar si se desea terminar la aplicación en este punto.
  });

  process.on('unhandledRejection', (reason, promise) => {
    let errorMessage = 'RECHAZO DE PROMESA NO MANEJADO: ';
    if (reason instanceof Error) {
      errorMessage += reason.message;
    } else {
      errorMessage += String(reason);
    }
    logger.error(errorMessage, promise);
    // Es importante manejar el 'reason' que puede ser un Error o cualquier otro valor.
    const errorToHandle = reason instanceof Error ? reason : new Error(String(reason));
    handleError(errorToHandle, 'Rechazo de promesa global no manejado');
    // process.exit(1); // Descomentar si se desea terminar la aplicación.
  });

  logger.info('Manejadores de errores globales inicializados.');
}

export { handleError, initializeGlobalErrorHandlers, AppError, APIError };
