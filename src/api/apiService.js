import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Base URL configuration
const BASE_URL = 'https://d1-api.hexallo.com/';
//for dev orgainer const BASE_URL = 'https://d1-api.hexallo.com/';
//for dev admin  const BASE_URL = 'https://d1-admin.hexallo.com/';
//for prod orgainer const BASE_URL = 'https://t1-api.hexallo.com/';
//for prod admin  const BASE_URL = 'https://t1-admin.hexallo.com/';
// Create axios instance with default config
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
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
        console.error('Error getting token from SecureStore:', error);
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
        console.log('Token expired or invalid, cleared from storage');
      } catch (clearError) {
        console.error('Error clearing token:', clearError);
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
      const response = await apiClient.post(endpoints.otpRequest, data);
      console.log('Consumer API Response:', response.data);

      if (!response.data) {
        throw new Error('No data received from server');
      }

      return response.data;
    } catch (error) {
      console.error('OTP Request Error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        request: error.config?.data
      });

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
      console.log('Verifying OTP with payload:', { uuid: data.uuid, otp: '*' });
      const response = await apiClient.post(endpoints.verifyOtp, data);
      console.log(' OTP Verification Response Status:', response.status);
      const responseData = response.data;
      const accessToken = responseData?.data?.access_token || responseData?.access_token;

      if (accessToken) {
        await SecureStore.setItemAsync('accessToken', accessToken);
        console.log('Token stored successfully in SecureStore');

        // Verify token was stored
        const storedToken = await SecureStore.getItemAsync('accessToken');
        console.log('Token verification - stored:', !!storedToken);
      } else {
        console.warn('No access_token found in response');
        console.warn('Response structure:', JSON.stringify(responseData, null, 2));
      }

      // Return the full response data structure
      return responseData;
    } catch (error) {
      console.error('OTP Verification Error:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
        request: error.config?.data,
        url: error.config?.url,
        baseURL: BASE_URL
      });

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

//GetStarted Screen
export const userService = {
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

      console.log("Profile update FormData:", formData);

      const response = await apiClient.patch(endpoints.updateProfile, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log("Profile update response:", response.data);
      return response.data;
    } catch (error) {
      console.error('Update Profile Error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
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