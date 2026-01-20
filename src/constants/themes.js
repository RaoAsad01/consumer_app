import * as NavigationBar from 'expo-navigation-bar';
import { Platform } from 'react-native';
import { color } from '../color/color';
import logger from '../utils/logger';

/**
 * Generic Theme System
 * Can be used across multiple screens for consistent theming
 */

export const THEME = {
  light: {
    backgroundColor: color.white_FFFFFF,
    headerBackground: color.white_FFFFFF,
    titleColor: color.brown_3C200A,
    tabActiveColor: color.brown_5A2F0E,
    tabInactiveColor: color.grey_87807C,
    tabIndicatorColor: color.brown_5A2F0E,
    dividerColor: '#F0F0F0',
    cardBackground: color.white_FFFFFF,
    cardTitleColor: color.placeholderTxt_24282C,
    cardTextColor: color.brown_766F6A,
    buttonBackground: color.btnTxt_FFF6DF,
    buttonTextColor: color.btnBrown_AE6F28,
    statusBarStyle: 'dark-content',
    navigationBarColor: color.white_FFFFFF,
  },
  dark: {
    backgroundColor: color.placeholderTxt_24282C,
    headerBackground:   color.placeholderTxt_24282C,
    titleColor: color.btnTxt_FFF6DF,
    tabActiveColor: color.btnBrown_AE6F28,
    tabInactiveColor: color.btnTxt_FFF6DF,
    tabIndicatorColor: color.btnBrown_AE6F28,
    dividerColor: color.drak_black_000000,
    cardBackground: color.placeholderTxt_24282C,
    cardTitleColor: color.white_FFFFFF,
    cardTextColor: color.btnTxt_FFF6DF,
    buttonBackground: color.grey_393F45,
    buttonTextColor: color.btnTxt_FFF6DF,
    statusBarStyle: 'light-content',
    navigationBarColor:  color.placeholderTxt_24282C,
  },
};

/**
 * Get theme based on category or preference
 * @param {string} categoryId - Category ID to check for dark theme
 * @param {Array<string>} darkThemeCategories - Array of category IDs that use dark theme
 * @returns {Object} Theme object (light or dark)
 */
export const getTheme = (categoryId, darkThemeCategories = []) => {
  const isDarkTheme = darkThemeCategories.includes(categoryId);
  return isDarkTheme ? THEME.dark : THEME.light;
};

/**
 * Apply theme to navigation bar (Android)
 * @param {Object} theme - Theme object to apply
 */
export const applyNavigationBarTheme = async (theme) => {
  if (Platform.OS === 'android') {
    try {
      await NavigationBar.setBackgroundColorAsync(theme.navigationBarColor);
      await NavigationBar.setButtonStyleAsync(
        theme.statusBarStyle === 'light-content' ? 'light' : 'dark'
      );
    } catch (error) {
      logger.warn('Failed to apply navigation bar theme:', error);
    }
  }
};

export default THEME;

