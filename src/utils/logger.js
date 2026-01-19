import ENV from '../config/env';

/**
 * Centralized Logging Utility
 * Replaces console.log/error/warn with a controlled logging system
 * 
 * Usage:
 *   import logger from '../utils/logger';
 *   logger.info('User logged in');
 *   logger.error('API error', error);
 */

const isLoggingEnabled = () => {
  return ENV.ENABLE_LOGGING === 'true' || __DEV__;
};

const logger = {
  /**
   * Log informational messages
   */
  info: (...args) => {
    if (isLoggingEnabled()) {
      console.log('[INFO]', ...args);
    }
  },

  /**
   * Log warning messages
   */
  warn: (...args) => {
    if (isLoggingEnabled()) {
      console.warn('[WARN]', ...args);
    }
  },

  /**
   * Log error messages
   */
  error: (...args) => {
    // Always log errors, even in production
    console.error('[ERROR]', ...args);
    
    // In production, you might want to send errors to a crash reporting service
    // Example: Sentry.captureException(error);
  },

  /**
   * Log debug messages (only in development)
   */
  debug: (...args) => {
    if (__DEV__ && isLoggingEnabled()) {
      console.log('[DEBUG]', ...args);
    }
  },

  /**
   * Log API requests/responses
   */
  api: {
    request: (method, url, data) => {
      if (__DEV__ && isLoggingEnabled()) {
        logger.debug(`[API REQUEST] ${method} ${url}`, data);
      }
    },
    response: (method, url, status, data) => {
      if (__DEV__ && isLoggingEnabled()) {
        logger.debug(`[API RESPONSE] ${method} ${url} ${status}`, data);
      }
    },
    error: (method, url, error) => {
      logger.error(`[API ERROR] ${method} ${url}`, error);
    },
  },
};

export default logger;

