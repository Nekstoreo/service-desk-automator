// src/utils/helpers.js
import logger from './logger.js';

/**
 * Selects a random element from an array.
 * @template T
 * @param {T[]} array - The array to select from.
 * @returns {T | undefined} A random element from the array, or undefined if the array is empty or invalid.
 */
function selectRandomElement(array) {
  if (!Array.isArray(array) || array.length === 0) {
    logger.warn('selectRandomElement: Se proporcionó un array vacío o inválido.');
    return undefined;
  }
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

/**
 * Creates a promise that resolves after a specified number of milliseconds.
 * @param {number} ms - The number of milliseconds to wait.
 * @returns {Promise<void>} A promise that resolves after the delay.
 */
function delay(ms) {
  if (typeof ms !== 'number' || ms < 0) {
    logger.warn(`delay: Se proporcionó un valor de ms inválido (${ms}). Usando 0ms por defecto.`);
    ms = 0;
  }
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Generates a random integer between min (inclusive) and max (inclusive).
 * @param {number} min - The minimum possible value.
 * @param {number} max - The maximum possible value.
 * @returns {number} A random integer within the specified range.
 */
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  if (min > max) {
    logger.warn(`getRandomInt: min (${min}) no puede ser mayor que max (${max}). Intercambiando valores.`);
    [min, max] = [max, min]; // Swap values
  }
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Shuffles an array in place using the Fisher-Yates (Knuth) algorithm.
 * @template T
 * @param {T[]} array - The array to shuffle.
 * @returns {T[]} The shuffled array (mutated directly).
 */
function shuffleArray(array) {
  if (!Array.isArray(array)) {
    logger.warn('shuffleArray: Se proporcionó un valor no array.');
    return [];
  }
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
  return array;
}


export { selectRandomElement, delay, getRandomInt, shuffleArray };
