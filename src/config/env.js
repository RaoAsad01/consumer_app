import Constants from 'expo-constants';
import logger from '../utils/logger';

/**
 * Environment Configuration
 * Uses expo-constants to access environment variables
 * 
 * For Expo preview builds, set these in eas.json or app.json extra section
 * For local development, create .env file (not committed to git)
 */

const getEnvVar = (key, defaultValue) => {
  // Check expo-constants extra config first
  const extra = Constants.expoConfig?.extra || {};
  if (extra[key] !== undefined) {
    return extra[key];
  }
  
  // Check process.env (for web/Node environments)
  if (typeof process !== 'undefined' && process.env?.[key]) {
    return process.env[key];
  }
  
  return defaultValue;
};

const ENV = {
  // API Configuration
  API_BASE_URL: getEnvVar('API_BASE_URL', 'https://d1-api.hexallo.com/'),
  
  // Google Maps
  GOOGLE_MAPS_API_KEY: getEnvVar('GOOGLE_MAPS_API_KEY', 'YOUR_GOOGLE_MAPS_API_KEY'),
  
  // Environment
  ENV: getEnvVar('ENV', __DEV__ ? 'development' : 'production'),
  
  // Feature Flags
  ENABLE_LOGGING: getEnvVar('ENABLE_LOGGING', __DEV__ ? 'true' : 'false'),
};

// Validate required environment variables in production
if (ENV.ENV === 'production') {
  if (ENV.API_BASE_URL === 'https://d1-api.hexallo.com/') {
    // Critical configuration warning - always log
    logger.warn('⚠️ Using development API URL in production. Please set API_BASE_URL.');
  }
}

export default ENV;

