import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import {
  Animated,
  Dimensions,
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  TextInput, TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import * as Yup from 'yup';
import SvgIcons from '../../components/SvgIcons';
import { authService } from '../api/apiService';
import { color } from '../color/color';
import CountryCodePicker from '../components/CountryCodePicker';
import Typography, { Caption } from '../components/Typography';
import { defaultCountryCode } from '../constants/countryCodes';
import { getAutoDetectedCountry } from '../utils/countryDetection';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showError, setShowError] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(defaultCountryCode);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [inputType, setInputType] = useState('phone'); // Start with 'phone' as default
  const [fadeAnim] = useState(new Animated.Value(1));
  const [slideAnim] = useState(new Animated.Value(0));
  const [isDetectingCountry, setIsDetectingCountry] = useState(false);

  const { height: screenHeight } = Dimensions.get('window');
  const isSmallScreen = screenHeight < 700;
  const isLargeScreen = screenHeight > 800;

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });

    const keyboardDidHideListener = Platform.OS === 'ios'
      ? Keyboard.addListener('keyboardWillHide', () => setKeyboardVisible(false))
      : Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  // Auto-detect country code when component mounts
  useEffect(() => {
    const autoDetectCountry = async () => {
      // Only auto-detect if we're still using the default country
      if (selectedCountry.code === defaultCountryCode.code) {
        setIsDetectingCountry(true);
        try {
          const detectedCountry = await getAutoDetectedCountry();
          if (detectedCountry && detectedCountry.code !== defaultCountryCode.code) {
            setSelectedCountry(detectedCountry);
          }
        } catch (error) {
          console.error('Failed to auto-detect country:', error);
        } finally {
          setIsDetectingCountry(false);
        }
      }
    };

    autoDetectCountry();
  }, []);

  const validationSchema = Yup.object().shape({
    user_identifier: Yup.string()
      .min(1, 'Required')
      .required('Required')
      .test('emailOrPhone', 'Invalid email or phone number', (value) => {
        if (!value) return false;
        if (inputType === 'email') {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(value);
        } else {
          const phoneRegex = /^[0-9]{7,15}$/;
          return phoneRegex.test(value);
        }
      }),
  });

  const handleSignIn = async (values) => {
    try {
      let userIdentifier = values.user_identifier.trim();

      // If it's a phone number, add the country code
      if (inputType === 'phone') {
        userIdentifier = selectedCountry.dialCode + userIdentifier;
      }

      const response = await authService.requestOtp({
        user_identifier: userIdentifier,
      });
      if (response && response.success) {
        navigation.navigate('OtpLogin', {
          uuid: response.data.uuid,
          user_identifier: userIdentifier
        });
      } else {
        setShowError(false);
        setErrorMessage('');
      }
    } catch (error) {
      if (error.response?.data?.message) {
        setErrorMessage(`Invalid ${inputType === 'email' ? 'email' : 'phone number'}`);
        setShowError(true);
      } else {
        setErrorMessage('Failed to request OTP. Please try again.');
        setShowError(true);
      }
    }
  };

  const dismissError = () => {
    setShowError(false);
    setErrorMessage('');
  };

  const toggleInputType = (setFieldValue) => {
    // Clear the input field when switching types
    setFieldValue('user_identifier', '');
    const newInputType = inputType === 'phone' ? 'email' : 'phone';

    // Animate the transition
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: newInputType === 'phone' ? 0 : 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setInputType(newInputType);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();
    });
  };

  const handleInputChange = (text, setFieldValue) => {
    setFieldValue('user_identifier', text);
  };

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
  };

  return (
    <>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <LinearGradient
          colors={['#D9BA95', '#F5F5F5', '#D9BA95']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ flex: 1 }}
        >
          <StatusBar
            style="light"
            backgroundColor="transparent"
            translucent
            hidden={true}
          />
          <View style={styles.container}>
            <View style={styles.contentWrapper}>
              {/* Header Section */}
              <View style={styles.headerSection}>
                <Typography
                  weight="700"
                  size={25}
                  color={color.brown_3C200A}
                  style={styles.title}
                >
                  Get Started
                </Typography>
                <Typography
                  weight="400"
                  size={12}
                  color={color.grey_87807C}
                  style={styles.subtitle}
                >
                  {inputType === 'phone'
                    ? "We'll send you a code, it helps us keep your account secure."
                    : "We'll send you an OTP for confirmation, it helps us keep your account secure."}
                </Typography>
              </View>

              {/* Input Section */}
              <View style={styles.inputSection}>
                <Formik
                  initialValues={{ user_identifier: '' }}
                  validationSchema={validationSchema}
                  onSubmit={handleSignIn}
                >
                  {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
                    <Animated.View style={{ width: '100%', opacity: fadeAnim }}>
                      <View style={[
                        styles.inputRow,
                        (touched.user_identifier && errors.user_identifier) || showError ? styles.inputError : null
                      ]}>
                        {/* Country Code Picker (only show for phone input) */}
                        {inputType === 'phone' && (
                          <TouchableOpacity
                            style={styles.countryCodeButton}
                            onPress={() => setShowCountryPicker(true)}
                            disabled={isDetectingCountry}
                          >
                            {/* <View style={styles.redDot} /> */}
                            <Text style={styles.flagText}>{selectedCountry.flag}</Text>
                            <Typography
                              weight="600"
                              size={14}
                              color={isDetectingCountry ? color.grey_87807C : color.black_544B45}
                              style={styles.countryCodeText}
                            >
                              {isDetectingCountry ? '...' : selectedCountry.dialCode}
                            </Typography>
                            {!isDetectingCountry && (
                              <SvgIcons.downArrow width={12} height={12} fill={color.grey_87807C} />
                            )}
                          </TouchableOpacity>
                        )}

                        <TextInput
                          style={[
                            styles.inputField,
                            touched.user_identifier && errors.user_identifier ? styles.inputError : null,
                            inputType === 'phone' ? styles.inputFieldWithCountryCode : styles.inputFieldWithoutCountryCode
                          ]}
                          placeholder={inputType === 'phone' ? "Enter phone number" : "Enter email address"}
                          placeholderTextColor={color.grey_87807C}
                          onChangeText={(text) => handleInputChange(text, setFieldValue)}
                          onBlur={handleBlur('user_identifier')}
                          value={values.user_identifier}
                          keyboardType={inputType === 'phone' ? "numeric" : "email-address"}
                          selectionColor={color.btnBrown_AE6F28}
                          autoCapitalize="none"
                          autoComplete={inputType === 'phone' ? "tel" : "email"}
                        />
                        <TouchableOpacity
                          style={[styles.arrowButton, !values.user_identifier.trim() && styles.arrowButtonDisabled]}
                          onPress={handleSubmit}
                          disabled={!values.user_identifier.trim()}
                        >
                          <SvgIcons.rightArrowWhite width={24} height={24} />
                        </TouchableOpacity>
                      </View>
                      {touched.user_identifier && errors.user_identifier && (
                        <Caption color={color.red_FF0000} style={styles.errorText}>{errors.user_identifier}</Caption>
                      )}

                      {/* Toggle Button */}
                      {showError && (
                        <View style={styles.errorContainer}>
                          <TouchableOpacity onPress={dismissError}>
                            <SvgIcons.crossIconRed width={20} height={20} fill={color.red_FF3B30} />
                          </TouchableOpacity>
                          <Typography weight="400" size={14} color={color.red_EF3E32} style={styles.errorTextCross}>
                            {errorMessage}
                          </Typography>
                        </View>
                      )}
                      <TouchableOpacity
                        style={styles.toggleButton}
                        onPress={() => toggleInputType(setFieldValue)}
                      >
                        <Typography
                          weight="450"
                          size={12}
                          color={color.brown_766F6A}
                        // style={styles.toggleButtonText}
                        >
                          {inputType === 'phone' ? 'Use email instead' : 'Use phone number instead'}
                        </Typography>
                      </TouchableOpacity>
                    </Animated.View>
                  )}
                </Formik>
              </View>

              {/* Footer Section */}
              {!isKeyboardVisible && (
                <>
                  <View style={styles.logoContainer}>
                    <SvgIcons.hexalloSvg width={40} height={40} />
                  </View>
                  <View style={styles.footerSection}>
                    <Typography
                      weight="450"
                      size={12}
                      color={color.brown_766F6A}
                      style={styles.footerText}
                    >
                      By registering, you accept our{' '}
                      <Typography weight="600" size={12} color={color.brown_766F6A} style={styles.linkText}>
                        Terms of Use
                      </Typography>
                      {' '}and{'\n'}{' '}
                      <Typography weight="600" size={12} color={color.brown_766F6A} style={styles.linkText}>
                        Privacy Policy
                      </Typography>
                    </Typography>
                  </View>
                </>
              )}
            </View>
          </View>
        </LinearGradient>
      </TouchableWithoutFeedback>

      {/* Country Code Picker Modal */}
      <CountryCodePicker
        selectedCountry={selectedCountry}
        onSelectCountry={handleCountrySelect}
        visible={showCountryPicker}
        onClose={() => setShowCountryPicker(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  contentWrapper: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  headerSection: {
    marginTop: 40,
    marginBottom: 40,
  },
  title: {
    marginBottom: 12,
  },
  subtitle: {
    lineHeight: 20,
  },
  inputSection: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: color.borderBrown_CEBCA0,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: color.white_FFFFFF,
    marginBottom: 16,
    height: 56,
  },
  countryCodeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRightWidth: 1,
    borderRightColor: color.borderBrown_CEBCA0,
    backgroundColor: color.white_FFFFFF,
  },
  redDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: color.red_FF0000,
    marginRight: 8,
  },
  flagText: {
    fontSize: 16,
    marginRight: 6,
  },
  countryCodeText: {
    marginRight: 4,
  },
  inputField: {
    flex: 1,
    color: color.black_544B45,
    fontSize: 14,
    fontWeight: '400',
    height: '100%',
    backgroundColor: color.white_FFFFFF,
    paddingRight: 10,
  },
  inputFieldWithCountryCode: {
    paddingLeft: 15,
  },
  inputFieldWithoutCountryCode: {
    paddingLeft: 20,
  },
  arrowButton: {
    backgroundColor: color.btnBrown_AE6F28,
    height: '100%',
    width: 56,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 11,
    borderBottomRightRadius: 11,
  },
  arrowButtonDisabled: {
    opacity: 0.5,
  },
  inputError: {
    borderColor: color.red_FF0000,
  },
  errorText: {
    width: '100%',
    marginLeft: 4,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: color.white_FFFFFF,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginTop: 10,
    borderWidth: 1,
    borderColor: color.red_FF0000,
    gap: 10,
  },
  errorTextCross: {
    flex: 1,
  },
  toggleButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  toggleButtonText: {
    textDecorationLine: 'underline',
  },
  footerSection: {
    alignItems: 'center',
    paddingBottom: 30,
    paddingTop: 20,
    paddingHorizontal: 16,
  },
  footerText: {
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 50,
  },
  linkText: {
    textDecorationLine: 'underline',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
});

export default LoginScreen;
