// src/app.js
import logger from './utils/logger.js';
import { runAutomation as runTicketAutomation } from './orchestrators/automationFlow.js';
import { runKbAutomation } from './orchestrators/knowledgeBaseFlow.js';
import { initializeGlobalErrorHandlers } from './utils/errorHandler.js';

/**
 * Punto de entrada principal de la aplicación de automatización.
 * Inicia el proceso de simulación seleccionado.
 */
async function main() {
  // Inicializar manejadores de errores globales una sola vez
  initializeGlobalErrorHandlers();
  logger.info('Manejadores de errores globales inicializados.');

  const args = process.argv.slice(2); // Obtener argumentos de la línea de comandos
  const flowToRun = args[0]; // El primer argumento después de 'node src/app.js'

  logger.info('Iniciando la aplicación Service Desk Automator...');

  try {
    if (flowToRun === 'tickets') {
      logger.info('Ejecutando el flujo de automatización de TICKETS...');
      await runTicketAutomation();
    } else if (flowToRun === 'kb') {
      logger.info('Ejecutando el flujo de automatización de KNOWLEDGE BASE...');
      await runKbAutomation();
    } else {
      logger.warn('Flujo no especificado o no reconocido.');
      logger.info('Por favor, ejecute con uno de los siguientes argumentos:');
      logger.info('  node src/app.js tickets   -> Para el flujo de tickets');
      logger.info('  node src/app.js kb        -> Para el flujo de Knowledge Base');
      // Opcionalmente, ejecutar un flujo por defecto si no se especifica
      // logger.info('Ejecutando flujo de tickets por defecto...');
      // await runTicketAutomation();
    }
    logger.info('Service Desk Automator ha finalizado la ejecución del flujo seleccionado.');
  } catch (error) {
    // Aunque los flujos ya tienen try/catch, este es un último recurso.
    logger.error('Ha ocurrido un error no capturado en el nivel más alto de app.js:', error.message);
    if (error.stack) {
        logger.debug('Stack trace del error en app.js:', error.stack);
    }
    process.exitCode = 1; // Indicar una finalización con error
  }
}

// Ejecutar la función principal
main();