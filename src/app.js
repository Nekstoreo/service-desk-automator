import logger from './utils/logger.js';
import { runAutomation as runTicketAutomation } from './orchestrators/automationFlow.js';
import { runKbAutomation } from './orchestrators/knowledgeBaseFlow.js';
import { initializeGlobalErrorHandlers } from './utils/errorHandler.js';
import { automateSurveyCompletion } from './orchestrators/surveyAutomationFlow.js';

/**
 * Punto de entrada principal de la aplicación de automatización.
 */
async function main() {
  initializeGlobalErrorHandlers();
  logger.info('Manejadores de errores globales inicializados.');

  const args = process.argv.slice(2);
  const flowToRun = args[0];

  logger.info('Iniciando la aplicación Service Desk Automator...');

  try {
    if (flowToRun === 'tickets') {
      logger.info('Ejecutando el flujo de automatización de TICKETS...');
      await runTicketAutomation();
    } else if (flowToRun === 'kb') {
      logger.info('Ejecutando el flujo de automatización de KNOWLEDGE BASE...');
      await runKbAutomation();
    } else if (flowToRun === 'survey') {
      logger.info('Ejecutando el flujo de automatización de ENCUESTAS...');
      await automateSurveyCompletion();
    } else {
      logger.warn('Flujo no especificado o no reconocido.');
      logger.info('Por favor, ejecute con uno de los siguientes argumentos:');
      logger.info('  node src/app.js tickets   -> Para el flujo de tickets');
      logger.info('  node src/app.js kb        -> Para el flujo de Knowledge Base');
      logger.info('  node src/app.js survey    -> Para el flujo de Encuestas');
    }

    logger.separator('FLUJO DE AUTOMATIZACIÓN COMPLETADO');

    logger.info('Service Desk Automator ha finalizado la ejecución del flujo seleccionado.');
  } catch (error) {
    logger.error('Ha ocurrido un error no capturado en el nivel más alto de app.js:', error.message);
    if (error.stack) {
        logger.debug('Stack trace del error en app.js:', error.stack);
    }
    process.exitCode = 1;
  }
}

main();