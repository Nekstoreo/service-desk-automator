// src/config/index.js
import dotenv from 'dotenv';

// Cargar variables de entorno del archivo .env
dotenv.config();

/**
 * Configuración base de la aplicación.
 */
const config = {
  /**
   * URL base para todas las llamadas a la API de la Mesa de Servicios.
   * Se toma de la variable de entorno BASE_URL o se usa un valor por defecto.
   * @type {string}
   */
  BASE_URL: process.env.BASE_URL || 'http://localhost:5154/api',

  /**
   * Tiempo máximo de espera para las solicitudes HTTP en milisegundos.
   * @type {number}
   */
  API_TIMEOUT: process.env.API_TIMEOUT ? parseInt(process.env.API_TIMEOUT, 10) : 30000, // 30 segundos por defecto

  /**
   * Nivel de log para la aplicación (ej: 'info', 'debug', 'error').
   * Podría ser utilizado por el logger.
   * @type {string}
   */
  LOG_LEVEL: process.env.LOG_LEVEL || 'debug',

  /**
   * Ruta a la carpeta que contiene los archivos de muestra para adjuntar.
   * @type {string}
   */
  FILES_PATH: process.env.FILES_PATH || 'files/',
};

// Validar que BASE_URL no termine con una barra para evitar problemas al concatenar rutas
if (config.BASE_URL.endsWith('/')) {
  config.BASE_URL = config.BASE_URL.slice(0, -1);
  console.warn("Advertencia: La BASE_URL terminaba con '/', ha sido corregida a:", config.BASE_URL);
}


export default config;
