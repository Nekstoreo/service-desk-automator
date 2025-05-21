// src/utils/logger.js
import config from '../config/index.js';

// ANSI escape codes for colors
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  underscore: "\x1b[4m",
  blink: "\x1b[5m",
  reverse: "\x1b[7m",
  hidden: "\x1b[8m",

  fg: {
    black: "\x1b[30m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
    white: "\x1b[37m",
  },
  bg: {
    black: "\x1b[40m",
    red: "\x1b[41m",
    green: "\x1b[42m",
    yellow: "\x1b[43m",
    blue: "\x1b[44m",
    magenta: "\x1b[45m",
    cyan: "\x1b[46m",
    white: "\x1b[47m",
  }
};

const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3,
};

const CURRENT_LOG_LEVEL_STRING = config.LOG_LEVEL.toUpperCase();
const CURRENT_LOG_LEVEL = LOG_LEVELS[CURRENT_LOG_LEVEL_STRING] !== undefined ? LOG_LEVELS[CURRENT_LOG_LEVEL_STRING] : LOG_LEVELS.INFO;

/**
 * Formats the current date and time.
 * @returns {string} Formatted timestamp (HH:MM:SS).
 */
function getTimestamp() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

/**
 * Logs a message to the console if the given level is enabled.
 * @param {string} level - The log level (e.g., 'INFO', 'ERROR').
 * @param {string} message - The main message to log.
 * @param  {...any} details - Additional details to log.
 */
function log(level, message, ...details) {
  const messageLevel = LOG_LEVELS[level.toUpperCase()];
  if (messageLevel === undefined || messageLevel > CURRENT_LOG_LEVEL) {
    return; // Do not log if level is not recognized or below current log level
  }

  let levelColor = colors.fg.white;
  switch (level.toUpperCase()) {
    case 'ERROR':
      levelColor = colors.fg.red;
      break;
    case 'WARN':
      levelColor = colors.fg.yellow;
      break;
    case 'INFO':
      levelColor = colors.fg.green;
      break;
    case 'DEBUG':
      levelColor = colors.fg.blue;
      break;
  }

  const timestamp = getTimestamp();
  console.log(`${colors.fg.cyan}[${timestamp}]${colors.reset} ${levelColor}${level.toUpperCase().padEnd(5)}${colors.reset}: ${message}`);

  if (details.length > 0) {
    details.forEach(detail => {
      if (typeof detail === 'object' && detail !== null) {
        // Using console.dir for better object inspection, indented
        console.dir(detail, { depth: null, colors: true });
      } else {
        console.log(`  ${detail}`);
      }
    });
  }
}

const logger = {
  /**
   * Logs an error message.
   * @param {string} message - The message to log.
   * @param  {...any} details - Additional details.
   */
  error: (message, ...details) => log('ERROR', message, ...details),

  /**
   * Logs a warning message.
   * @param {string} message - The message to log.
   * @param  {...any} details - Additional details.
   */
  warn: (message, ...details) => log('WARN', message, ...details),

  /**
   * Logs an informational message.
   * @param {string} message - The message to log.
   * @param  {...any} details - Additional details.
   */
  info: (message, ...details) => log('INFO', message, ...details),

  /**
   * Logs a debug message.
   * @param {string} message - The message to log.
   * @param  {...any} details - Additional details.
   */
  debug: (message, ...details) => log('DEBUG', message, ...details),

  /**
   * Logs a separator line for visual distinction in logs.
   * @param {string} [title=''] - Optional title for the separator.
   */
  separator: (title = '') => {
    const line = '============================================================';
    if (title) {
        const padding = Math.max(0, (line.length - title.length - 2) / 2);
        const centeredTitle = `${'='.repeat(Math.floor(padding))} ${title} ${'='.repeat(Math.ceil(padding))}`;
        console.log(`\n${colors.fg.magenta}${centeredTitle.substring(0,line.length)}${colors.reset}`);
    } else {
        console.log(`\n${colors.fg.magenta}${line}${colors.reset}`);
    }
  }
};

export default logger;
