// src/services/fileService.js
import fs from 'node:fs/promises';
import fsConstants from 'node:fs/constants';
import path from 'node:path';
import config from '../config/index.js';
import logger from '../utils/logger.js';
import { selectRandomElement } from '../utils/helpers.js';
import { AppError } from '../utils/errorHandler.js';

// Construir la ruta absoluta al directorio de archivos
const FILES_DIRECTORY = path.resolve(config.FILES_PATH);

let availableFilesCache = null; // Caché para la lista de archivos

/**
 * Checks if the files directory exists and is accessible.
 * @returns {Promise<boolean>} True if the directory exists, false otherwise.
 */
async function checkFilesDirectory() {
  try {
    await fs.access(FILES_DIRECTORY, fsConstants.F_OK | fsConstants.R_OK);
    logger.debug(`Directorio de archivos verificado y accesible en: ${FILES_DIRECTORY}`);
    return true;
  } catch (error) {
    logger.error(`El directorio de archivos '${FILES_DIRECTORY}' no existe o no es accesible.`, error.message);
    return false;
  }
}

/**
 * Lists all files in the configured files directory, excluding subdirectories and hidden files.
 * Caches the result for subsequent calls to improve performance.
 * @returns {Promise<string[] | null>} An array of file names, or null if an error occurs or directory is empty.
 */
async function listAvailableFiles() {
  if (availableFilesCache !== null) {
    logger.debug('Usando lista de archivos cacheados.');
    return availableFilesCache;
  }

  if (!(await checkFilesDirectory())) {
    availableFilesCache = []; // Marcar como verificado pero vacío/inaccesible
    return null;
  }

  try {
    const allEntries = await fs.readdir(FILES_DIRECTORY, { withFileTypes: true });
    const files = allEntries
      .filter(dirent => dirent.isFile() && !dirent.name.startsWith('.')) // Solo archivos, no ocultos
      .map(dirent => dirent.name);

    if (files.length === 0) {
      logger.warn(`No se encontraron archivos válidos en el directorio: ${FILES_DIRECTORY}`);
      availableFilesCache = [];
      return null;
    }
    logger.debug(`Archivos disponibles encontrados en '${FILES_DIRECTORY}':`, files);
    availableFilesCache = files;
    return files;
  } catch (error) {
    logger.error(`Error al leer el directorio de archivos '${FILES_DIRECTORY}'.`, error);
    availableFilesCache = []; // Marcar como error para no reintentar indefinidamente la lectura
    throw new AppError(`No se pudo leer el directorio de archivos: ${FILES_DIRECTORY}`, 500, true, 'Listar archivos');
  }
}


/**
 * Gets the full path of a random file from the files directory.
 * @returns {Promise<string | null>} The full path to a random file, or null if no files are available.
 */
async function getRandomFilePath() {
  const files = await listAvailableFiles();
  if (!files || files.length === 0) {
    return null;
  }

  const randomFileName = selectRandomElement(files);
  if (!randomFileName) {
    logger.warn('No se pudo seleccionar un archivo aleatorio (lista de archivos vacía después de filtrar).');
    return null;
  }
  return path.join(FILES_DIRECTORY, randomFileName);
}

/**
 * Reads the content of a file into a Buffer.
 * @param {string} filePath - The full path to the file.
 * @returns {Promise<Buffer | null>} A Buffer with the file content, or null if an error occurs.
 */
async function getFileBuffer(filePath) {
  if (!filePath) {
    logger.warn('getFileBuffer: Se proporcionó una ruta de archivo nula o indefinida.');
    return null;
  }
  try {
    const buffer = await fs.readFile(filePath);
    logger.debug(`Archivo '${filePath}' leído en buffer exitosamente (${buffer.length} bytes).`);
    return buffer;
  } catch (error) {
    logger.error(`Error al leer el archivo '${filePath}' en buffer.`, error);
    throw new AppError(`No se pudo leer el archivo: ${filePath}`, 500, true, 'Leer buffer de archivo');
  }
}

/**
 * Gets a random file's name, path, and its content as a Buffer.
 * This is useful for preparing attachments for multipart/form-data requests.
 * @returns {Promise<{fileName: string, fileContent: Buffer, filePath: string} | null>}
 * An object containing file details, or null if an error occurs or no files are available.
 */
async function getRandomAttachmentDetails() {
  try {
    const filePath = await getRandomFilePath();
    if (!filePath) {
      logger.warn('getRandomAttachmentDetails: No se pudo obtener una ruta de archivo aleatoria.');
      return null;
    }

    const fileName = path.basename(filePath);
    const fileContent = await getFileBuffer(filePath);

    if (!fileContent) {
      // getFileBuffer ya loguea el error específico
      return null;
    }

    logger.info(`Adjunto aleatorio seleccionado: ${fileName}`);
    return { fileName, fileContent, filePath };
  } catch (error) {
    // Los errores de AppError de funciones internas ya deberían haber sido logueados.
    // Si no es un AppError, lo logueamos aquí.
    if (!(error instanceof AppError)) {
        logger.error('Error inesperado en getRandomAttachmentDetails:', error);
    }
    // No es necesario llamar a handleError aquí si las funciones internas ya lo hacen o lanzan AppError.
    return null;
  }
}

/**
 * Pre-calienta la caché de archivos listando los archivos disponibles al inicio.
 */
async function initializeFileCache() {
    logger.info('Inicializando caché de archivos...');
    await listAvailableFiles();
}

export {
  checkFilesDirectory,
  getRandomFilePath,
  getFileBuffer,
  getRandomAttachmentDetails,
  initializeFileCache, // Para llamarlo al inicio de la app si se desea
  FILES_DIRECTORY // Exportar para referencia si es necesario
};
