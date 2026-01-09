import * as Location from 'expo-location';
import { countryCodes } from '../constants/countryCodes';

/**
 * Detects the country code based on the user's current location
 * @returns {Promise<string|null>} The detected country code or null if detection fails
 */
export const detectCountryCode = async () => {
  try {
    console.log('Checking location permissions...');
    // First check if permission is already granted
    let { status } = await Location.getForegroundPermissionsAsync();
    
    // If not granted, request it
    if (status !== 'granted') {
      console.log('Requesting location permissions...');
      const permissionResult = await Location.requestForegroundPermissionsAsync();
      status = permissionResult.status;
    }
    
    if (status !== 'granted') {
      console.log('❌ Location permission not granted, status:', status);
      return null;
    }
    console.log('✅ Location permission granted');

    console.log('Getting current position...');
    // Get current position with better error handling
    let location;
    try {
      location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        timeout: 15000, // Increased timeout for slower devices
        maximumAge: 300000, // 5 minutes
      });
    } catch (locationError) {
      console.error('Error getting location:', locationError);
      // Try with lower accuracy if high accuracy fails
      try {
        location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Low,
          timeout: 10000,
          maximumAge: 600000, // 10 minutes for low accuracy
        });
      } catch (lowAccuracyError) {
        console.error('Error getting location with low accuracy:', lowAccuracyError);
        return null;
      }
    }

    if (!location || !location.coords) {
      console.log('No location data obtained');
      return null;
    }

    console.log('Location obtained:', {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude
    });

    console.log('Reverse geocoding...');
    // Reverse geocode to get address
    let address;
    try {
      address = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    } catch (geocodeError) {
      console.error('Error reverse geocoding:', geocodeError);
      return null;
    }

    console.log('Address data:', address);

    if (address && address.length > 0 && address[0].isoCountryCode) {
      const countryCode = address[0].isoCountryCode;
      console.log('✅ Detected country code from location:', countryCode);
      return countryCode;
    }

    console.log('No address data found');
    return null;
  } catch (error) {
    console.error('Error detecting country code:', error);
    return null;
  }
};

/**
 * Detects country code from device locale as fallback
 * @returns {string|null} The detected country code or null if detection fails
 */
export const detectCountryFromLocale = () => {
  try {
    console.log('Attempting locale-based country detection...');
    
    // Try multiple methods to get locale
    let locale;
    try {
      // Method 1: Intl.DateTimeFormat
      locale = Intl.DateTimeFormat().resolvedOptions().locale;
      console.log('Device locale (Intl):', locale);
    } catch (e) {
      console.log('Intl.DateTimeFormat failed, trying navigator...');
      // Method 2: Navigator language
      if (typeof navigator !== 'undefined' && navigator.language) {
        locale = navigator.language;
        console.log('Device locale (navigator):', locale);
      }
    }
    
    if (!locale) {
      console.log('No locale found');
      return null;
    }
    
    // Extract country code from locale (format: en-US, en_US, etc.)
    const countryCode = locale.split('-')[1] || locale.split('_')[1];
    console.log('Extracted country code from locale:', countryCode);
    
    if (countryCode && countryCode.length === 2) {
      const upperCode = countryCode.toUpperCase();
      console.log('✅ Detected country code from locale:', upperCode);
      return upperCode;
    }
    
    console.log('No valid country code found in locale');
    return null;
  } catch (error) {
    console.error('Error detecting country from locale:', error);
    return null;
  }
};

/**
 * Detects country code from device timezone as fallback
 * @returns {string|null} The detected country code or null if detection fails
 */
export const detectCountryFromTimezone = () => {
  try {
    console.log('Attempting timezone-based country detection...');
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    console.log('Device timezone:', timezone);
    
    // Map common timezones to country codes
    const timezoneToCountry = {
      'Asia/Karachi': 'PK',
      'Asia/Dubai': 'AE',
      'Asia/Riyadh': 'SA',
      'Asia/Kuwait': 'KW',
      'Asia/Bahrain': 'BH',
      'Asia/Qatar': 'QA',
      'Asia/Muscat': 'OM',
      'Asia/Kolkata': 'IN',
      'Asia/Dhaka': 'BD',
      'Asia/Colombo': 'LK',
      'America/New_York': 'US',
      'America/Los_Angeles': 'US',
      'Europe/London': 'GB',
      'Europe/Paris': 'FR',
      'Europe/Berlin': 'DE',
      'Asia/Singapore': 'SG',
      'Asia/Kuala_Lumpur': 'MY',
      'Africa/Accra': 'GH',
      'Africa/Lagos': 'NG',
    };
    
    const countryCode = timezoneToCountry[timezone];
    if (countryCode) {
      console.log('✅ Detected country code from timezone:', countryCode);
      return countryCode;
    }
    
    console.log('No country code found for timezone:', timezone);
    return null;
  } catch (error) {
    console.error('Error detecting country from timezone:', error);
    return null;
  }
};

/**
 * Finds a country by its ISO code
 * @param {string} isoCode - The ISO country code
 * @returns {Object|null} The country object or null if not found
 */
export const findCountryByIsoCode = (isoCode) => {
  if (!isoCode) return null;
  
  const country = countryCodes.find(c => c.code === isoCode);
  return country || null;
};

/**
 * Auto-detects the user's country and returns the corresponding country object
 * @returns {Promise<Object>} The detected country object or default country
 */
export const getAutoDetectedCountry = async () => {
  try {
    console.log('Starting country auto-detection...');
    
    // Method 1: Try location-based detection (most accurate)
    console.log('Method 1: Attempting location-based detection...');
    const detectedIsoCode = await detectCountryCode();
    console.log('Location detection result:', detectedIsoCode);
    
    if (detectedIsoCode) {
      const country = findCountryByIsoCode(detectedIsoCode);
      if (country) {
        console.log('Country detected from location:', country.name, country.code);
        return country;
      } else {
        console.log('Country not found in our list for code:', detectedIsoCode);
      }
    } else {
      console.log('Location detection failed or permission denied');
    }
    
    // Method 2: Try timezone-based detection (more reliable than locale)
    console.log('Method 2: Attempting timezone-based detection...');
    const timezoneIsoCode = detectCountryFromTimezone();
    console.log('Timezone detection result:', timezoneIsoCode);
    
    if (timezoneIsoCode) {
      const country = findCountryByIsoCode(timezoneIsoCode);
      if (country) {
        console.log('Country detected from timezone:', country.name, country.code);
        return country;
      } else {
        console.log('Country not found in our list for code:', timezoneIsoCode);
      }
    } else {
      console.log('Timezone detection failed');
    }
    
    // Method 3: Fallback to locale-based detection
    console.log('Method 3: Attempting locale-based detection...');
    const localeIsoCode = detectCountryFromLocale();
    console.log('Locale detection result:', localeIsoCode);
    
    if (localeIsoCode) {
      const country = findCountryByIsoCode(localeIsoCode);
      if (country) {
        console.log('Country detected from locale:', country.name, country.code);
        return country;
      } else {
        console.log('Country not found in our list for code:', localeIsoCode);
      }
    } else {
      console.log('Locale detection failed');
    }
    
    // Final fallback to default country (Pakistan)
    console.log('⚠️ All detection methods failed, using default country: Pakistan');
    const defaultCountry = findCountryByIsoCode('PK') || {
      name: 'Pakistan',
      code: 'PK',
      dialCode: '+92',
      flag: '🇵🇰'
    };
    return defaultCountry;
    
  } catch (error) {
    console.error('❌ Error in getAutoDetectedCountry:', error);
    // Return default country on error
    return findCountryByIsoCode('PK') || {
      name: 'Pakistan',
      code: 'PK',
      dialCode: '+92',
      flag: '🇵🇰'
    };
  }
};