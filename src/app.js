// src/app.js
import logger from './utils/logger.js';
import { runAutomation } from './orchestrators/automationFlow.js';

/**
 * Punto de entrada principal de la aplicación de automatización.
 * Inicia el proceso de simulación de la mesa de servicios.
 */
async function main() {
  logger.info('Iniciando la aplicación Service Desk Automator...');
  try {
    await runAutomation();
    logger.info('Service Desk Automator ha finalizado su ejecución.');
  } catch (error) {
    // Aunque runAutomation ya tiene un try/catch, este es un último recurso.
    logger.error('Ha ocurrido un error no capturado en el nivel más alto de app.js:', error.message);
    if (error.stack) {
        logger.debug('Stack trace del error en app.js:', error.stack);
    }
    process.exitCode = 1; // Indicar una finalización con error
  }
}

// Ejecutar la función principal
main();
