import PropTypes from 'prop-types';
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { color } from '../color/color';
import Typography from './Typography';

/**
 * Loading Spinner Component
 * Reusable loading indicator for API calls and async operations
 * 
 * @param {string} message - Optional loading message
 * @param {string} size - Spinner size: 'small' | 'large' (default: 'large')
 * @param {string} spinnerColor - Spinner color (default: primary brown)
 * @param {string} textColor - Text color (default: brown)
 * @param {object} style - Additional styles
 */
const LoadingSpinner = ({ 
  message = 'Loading...', 
  size = 'large',
  spinnerColor = color.btnBrown_AE6F28,
  textColor = color.brown_766F6A,
  style 
}) => {
  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size={size} color={spinnerColor} />
      {message && (
        <Typography
          weight="400"
          size={14}
          color={textColor}
          style={styles.message}
        >
          {message}
        </Typography>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  message: {
    marginTop: 12,
    textAlign: 'center',
  },
});

LoadingSpinner.propTypes = {
  message: PropTypes.string,
  size: PropTypes.oneOf(['small', 'large']),
  spinnerColor: PropTypes.string,
  textColor: PropTypes.string,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

export default LoadingSpinner;

