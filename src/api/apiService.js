import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import ENV from '../config/env';
import logger from '../utils/logger';

// Base URL configuration from environment
const BASE_URL = ENV.API_BASE_URL;

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  async (config) => {
    // Skip auth for public endpoints
    const publicEndpoints = [endpoints.otpRequest, endpoints.verifyOtp];

    if (!publicEndpoints.some(endpoint => config.url?.includes(endpoint))) {
      try {
        const token = await SecureStore.getItemAsync('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        logger.error('Error getting token from SecureStore:', error);
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling auth errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // If we get a 401 Unauthorized response, the token is invalid/expired
    if (error.response?.status === 401) {
      try {
        // Clear the invalid token
        await SecureStore.deleteItemAsync('accessToken');
        logger.info('Token expired or invalid, cleared from storage');
      } catch (clearError) {
        logger.error('Error clearing token:', clearError);
      }
    }

    return Promise.reject(error);
  }
);


//Consumer API endpoints
const endpoints = {
  //signup: '/api/signup/',
  otpRequest: '/api/otp-request/',
  verifyOtp: '/api/login/',
  updateProfile: '/api/profile/',
  userProfile: '/api/me/',
  logout: '/api/logout/',
};

// API services
export const authService = {
  // Request OTP service
  requestOtp: async (data) => {
    try {
      logger.api.request('POST', endpoints.otpRequest, { uuid: data?.uuid });
      const response = await apiClient.post(endpoints.otpRequest, data);
      logger.api.response('POST', endpoints.otpRequest, response.status, response.data);

      if (!response.data) {
        throw new Error('No data received from server');
      }

      return response.data;
    } catch (error) {
      logger.api.error('POST', endpoints.otpRequest, error);

      // If we have a response from the server
      if (error.response?.data) {
        throw {
          message: error.response.data.message || 'Server error',
          response: error.response
        };
      }

      throw {
        message: 'Network error. Please check your connection.',
        error: error
      };
    }
  },

  // Verify OTP service
  verifyOtp: async (data) => {
    try {
      logger.api.request('POST', endpoints.verifyOtp, { uuid: data.uuid, otp: '***' });
      const response = await apiClient.post(endpoints.verifyOtp, data);
      logger.api.response('POST', endpoints.verifyOtp, response.status);
      
      const responseData = response.data;
      const accessToken = responseData?.data?.access_token || responseData?.access_token;

      if (accessToken) {
        await SecureStore.setItemAsync('accessToken', accessToken);
        logger.info('Token stored successfully in SecureStore');
      } else {
        logger.warn('No access_token found in response');
      }

      // Return the full response data structure
      return responseData;
    } catch (error) {
      logger.api.error('POST', endpoints.verifyOtp, error);

      if (error.response?.data) {
        const errorMessage = error.response.data.message ||
          error.response.data.error ||
          'Server error';
        throw {
          message: errorMessage,
          response: error.response,
          status: error.response?.status
        };
      }
      throw {
        message: 'Network error. Please check your connection.',
        error: error
      };
    }
  },
};

// User Service
export const userService = {
  // Get user profile
  getProfile: async () => {
    try {
      logger.api.request('GET', endpoints.userProfile);
      const response = await apiClient.get(endpoints.userProfile);
      logger.api.response('GET', endpoints.userProfile, response.status);
      return response.data;
    } catch (error) {
      logger.api.error('GET', endpoints.userProfile, error);
      if (error.response?.data) {
        throw {
          message: error.response.data.message || 'Failed to fetch profile.',
          response: error.response
        };
      }
      throw {
        message: 'Network error. Please check your connection.',
        error: error
      };
    }
  },

  // Update user profile
  updateProfileJson: async (profileData) => {
    try {
      // Create FormData object for multipart/form-data
      const formData = new FormData();

      if (profileData.name) {
        formData.append('name', String(profileData.name));
      }
      if (profileData.email) {
        formData.append('email', String(profileData.email));
      }
      if (profileData.phone_number) {
        formData.append('phone_number', String(profileData.phone_number));
      }
      if (profileData.date_of_birth) {
        formData.append('date_of_birth', String(profileData.date_of_birth));
      }
      if (profileData.gender) {
        formData.append('gender', String(profileData.gender));
      }

      logger.api.request('PATCH', endpoints.updateProfile, 'FormData');
      const response = await apiClient.patch(endpoints.updateProfile, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      logger.api.response('PATCH', endpoints.updateProfile, response.status);
      return response.data;
    } catch (error) {
      logger.api.error('PATCH', endpoints.updateProfile, error);
      if (error.response?.data) {
        throw {
          message: error.response.data.message || 'Failed to update profile.',
          response: error.response
        };
      }
      throw {
        message: 'Network error. Please check your connection.',
        error: error
      };
    }
  },

}
// You can add more service groups as needed 