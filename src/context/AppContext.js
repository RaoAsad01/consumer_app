import * as SecureStore from 'expo-secure-store';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { userService } from '../api/apiService';
import logger from '../utils/logger';

/**
 * Global App Context
 * Manages user authentication state, profile data, and app-wide settings
 */

const AppContext = createContext(null);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(null);

  const logout = useCallback(async () => {
    try {
      await SecureStore.deleteItemAsync('accessToken');
      setAccessToken(null);
      setIsAuthenticated(false);
      setUser(null);
      logger.info('User logged out');
    } catch (error) {
      logger.error('Error during logout:', error);
    }
  }, []);

  const fetchUserProfile = useCallback(async () => {
    try {
      const profile = await userService.getProfile();
      if (profile?.data) {
        setUser(profile.data);
        logger.info('User profile loaded');
      }
    } catch (error) {
      logger.error('Error fetching user profile:', error);
      // If profile fetch fails, user might not be fully authenticated
      if (error.response?.status === 401 || error.status === 401) {
        await logout();
      }
    }
  }, [logout]);

  const checkAuthStatus = useCallback(async () => {
    try {
      setIsLoading(true);
      const token = await SecureStore.getItemAsync('accessToken');
      
      if (token) {
        setAccessToken(token);
        setIsAuthenticated(true);
        // Fetch user profile
        await fetchUserProfile();
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      logger.error('Error checking auth status:', error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [fetchUserProfile]);

  const login = useCallback(async (token) => {
    try {
      await SecureStore.setItemAsync('accessToken', token);
      setAccessToken(token);
      setIsAuthenticated(true);
      await fetchUserProfile();
      logger.info('User logged in successfully');
    } catch (error) {
      logger.error('Error during login:', error);
      throw error;
    }
  }, [fetchUserProfile]);

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const updateUser = useCallback(async (profileData) => {
    try {
      const updatedProfile = await userService.updateProfileJson(profileData);
      if (updatedProfile?.data) {
        setUser(updatedProfile.data);
        logger.info('User profile updated');
        return updatedProfile.data;
      }
    } catch (error) {
      logger.error('Error updating user profile:', error);
      throw error;
    }
  }, []);

  const value = {
    // State
    user,
    isAuthenticated,
    isLoading,
    accessToken,
    
    // Actions
    login,
    logout,
    updateUser,
    fetchUserProfile,
    checkAuthStatus,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

