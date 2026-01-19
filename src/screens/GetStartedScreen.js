import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import * as SecureStore from 'expo-secure-store';
import { Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import * as Yup from 'yup';
import { userService } from '../api/apiService';
import { color } from '../color/color';
import CountryCodePicker from '../components/CountryCodePicker';
import SvgIcons from '../components/SvgIcons';
import Typography, { Caption } from '../components/Typography';
import { defaultCountryCode } from '../constants/countryCodes';
import OtpErrorPopup from '../constants/OtpErrorPopup';
import { getAutoDetectedCountry } from '../utils/countryDetection';
import logger from '../utils/logger';

// Helper function to detect if user identifier is email or phone
function isEmail(identifier) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(identifier);
}

const GetStartedScreen = ({ route }) => {
  const navigation = useNavigation();
  const userIdentifier = route?.params?.user_identifier;
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGenderPicker, setShowGenderPicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(defaultCountryCode);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [isDetectingCountry, setIsDetectingCountry] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorPopupMessage, setErrorPopupMessage] = useState('');
  const formikRef = React.useRef(null);
  const prevValuesRef = React.useRef({});

  // Initialize calendar to current date or selected date
  useEffect(() => {
    if (dateOfBirth) {
      const date = new Date(dateOfBirth.split('-').reverse().join('-'));
      setCalendarMonth(date.getMonth());
      setCalendarYear(date.getFullYear());
    }
  }, [dateOfBirth]);

  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth());
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());

  // Show opposite field: if user logged in with email, show phone field; if phone, show email field
  // Check if the userIdentifier is an email (contains @ symbol)
  const userLoggedInWithEmail = userIdentifier ? isEmail(userIdentifier) : false;
  // Show the opposite: if logged in with email, show phone field (isEmailLogin = false)
  // if logged in with phone, show email field (isEmailLogin = true)
  const isEmailLogin = !userLoggedInWithEmail;

  // Debug logging
  useEffect(() => {
    logger.debug('GetStartedScreen - userIdentifier:', userIdentifier);
    logger.debug('GetStartedScreen - userLoggedInWithEmail:', userLoggedInWithEmail);
    logger.debug('GetStartedScreen - isEmailLogin (show email field?):', isEmailLogin);
  }, [userIdentifier, userLoggedInWithEmail, isEmailLogin]);

  const { height: screenHeight } = Dimensions.get('window');
  const isSmallScreen = screenHeight < 700;

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

  // Auto-detect country code when component mounts (only for phone)
  useEffect(() => {
    if (!isEmailLogin) {
      const autoDetectCountry = async () => {
        if (selectedCountry.code === defaultCountryCode.code) {
          setIsDetectingCountry(true);
          try {
            const detectedCountry = await getAutoDetectedCountry();
            if (detectedCountry && detectedCountry.code !== defaultCountryCode.code) {
              setSelectedCountry(detectedCountry);
            }
          } catch (error) {
            logger.error('Failed to auto-detect country:', error);
          } finally {
            setIsDetectingCountry(false);
          }
        }
      };

      autoDetectCountry();
    }
  }, [isEmailLogin]);

  // Helper function to check form validity
  const checkFormValidity = (formValues, formErrors, currentDateOfBirth, currentSelectedGender, currentIsEmailLogin) => {
    const fullName = formValues?.fullName?.trim() || '';
    const nameParts = fullName.split(/\s+/).filter(part => part.length > 0);
    const hasFullName = nameParts.length >= 2 && nameParts.every(part => part.length >= 2);
    const hasDateOfBirth = formValues?.dateOfBirth || currentDateOfBirth;
    const hasEmail = currentIsEmailLogin ? (formValues?.email && formValues.email.trim().length > 0) : true;
    const hasPhoneNumber = !currentIsEmailLogin ? (formValues?.phoneNumber && formValues.phoneNumber.trim().length >= 7) : true;
    const hasGender = formValues?.gender || currentSelectedGender;
    const noErrors = !formErrors?.fullName && !formErrors?.dateOfBirth &&
      (!currentIsEmailLogin || !formErrors?.email) &&
      (currentIsEmailLogin || !formErrors?.phoneNumber) &&
      !formErrors?.gender;

    return hasFullName && hasDateOfBirth && hasEmail && hasPhoneNumber && hasGender && noErrors;
  };

  // Check form validity whenever form values or state changes
  useEffect(() => {
    if (formikRef.current) {
      // Use setTimeout to ensure Formik has updated its state
      setTimeout(() => {
        if (formikRef.current) {
          formikRef.current.validateForm().then(() => {
            const { values, errors } = formikRef.current;
            setIsFormValid(checkFormValidity(values, errors, dateOfBirth, selectedGender, isEmailLogin));
          });
        }
      }, 100);
    }
  }, [dateOfBirth, selectedGender, isEmailLogin]);

  const validationSchema = Yup.object().shape({
    fullName: Yup.string()
      .trim()
      .test('has-first-last-name', 'Please enter first and last name', (value) => {
        if (!value) return false;
        const nameParts = value.trim().split(/\s+/).filter(part => part.length > 0);
        return nameParts.length >= 2 && nameParts.every(part => part.length >= 2);
      })
      .required('Full name is required'),
    dateOfBirth: Yup.string()
      .required('Date of birth is required'),
    email: isEmailLogin ? Yup.string()
      .email('Invalid email address')
      .required('Email is required') : Yup.string(),
    phoneNumber: !isEmailLogin ? Yup.string()
      .min(7, 'Phone number must be at least 7 digits')
      .max(15, 'Phone number must be at most 15 digits')
      .matches(/^[0-9]+$/, 'Phone number must contain only digits')
      .required('Phone number is required') : Yup.string(),
    gender: Yup.string()
      .required('Gender is required'),
  });

  // Format date for display: "Thu 18 December 2025"
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return '';

    try {
      // Parse DD-MM-YYYY format
      const [day, month, year] = dateString.split('-');
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));

      // Get day name (Thu)
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const dayName = dayNames[date.getDay()];

      // Get month name (December)
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      const monthName = monthNames[date.getMonth()];

      return `${dayName} ${parseInt(day)} ${monthName} ${year}`;
    } catch (error) {
      return dateString; // Return original if parsing fails
    }
  };

  const handleDateSelect = (day, month, year, setFieldValue) => {
    const formattedDate = `${day.toString().padStart(2, '0')}-${month.toString().padStart(2, '0')}-${year}`;
    setDateOfBirth(formattedDate);
    if (setFieldValue) {
      setFieldValue('dateOfBirth', formattedDate);
    }
    setShowDatePicker(false);
  };

  // Calendar helper functions
  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(calendarMonth, calendarYear);
    const firstDay = getFirstDayOfMonth(calendarMonth, calendarYear);
    const days = [];

    // Previous month's days
    const prevMonth = calendarMonth === 0 ? 11 : calendarMonth - 1;
    const prevYear = calendarMonth === 0 ? calendarYear - 1 : calendarYear;
    const daysInPrevMonth = getDaysInMonth(prevMonth, prevYear);

    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({
        day: daysInPrevMonth - i,
        month: prevMonth,
        year: prevYear,
        isCurrentMonth: false,
      });
    }

    // Current month's days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        month: calendarMonth,
        year: calendarYear,
        isCurrentMonth: true,
      });
    }

    // Next month's days to fill the grid
    const remainingDays = 42 - days.length; // 6 weeks * 7 days
    const nextMonth = calendarMonth === 11 ? 0 : calendarMonth + 1;
    const nextYear = calendarMonth === 11 ? calendarYear + 1 : calendarYear;

    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        month: nextMonth,
        year: nextYear,
        isCurrentMonth: false,
      });
    }

    return days;
  };

  const navigateMonth = (direction) => {
    if (direction === 'prev') {
      if (calendarMonth === 0) {
        setCalendarMonth(11);
        setCalendarYear(calendarYear - 1);
      } else {
        setCalendarMonth(calendarMonth - 1);
      }
    } else if (direction === 'next') {
      if (calendarMonth === 11) {
        setCalendarMonth(0);
        setCalendarYear(calendarYear + 1);
      } else {
        setCalendarMonth(calendarMonth + 1);
      }
    }
  };

  const navigateYear = (direction) => {
    if (direction === 'prev') {
      setCalendarYear(calendarYear - 1);
    } else {
      setCalendarYear(calendarYear + 1);
    }
  };

  // Year picker state for decade navigation
  const [yearPickerDecade, setYearPickerDecade] = useState(() => {
    const currentYear = new Date().getFullYear();
    return Math.floor(currentYear / 10) * 10; // Get the decade (e.g., 2020 for 2026)
  });

  // Generate years for current decade (10 years in a grid)
  const generateDecadeYears = () => {
    const years = [];
    // Include previous year, current decade, and next year
    years.push(yearPickerDecade - 1); // Previous year
    for (let year = yearPickerDecade; year < yearPickerDecade + 10; year++) {
      years.push(year);
    }
    years.push(yearPickerDecade + 10); // Next year
    return years;
  };

  const navigateDecade = (direction) => {
    if (direction === 'prev') {
      setYearPickerDecade(yearPickerDecade - 10);
    } else {
      setYearPickerDecade(yearPickerDecade + 10);
    }
  };

  const handleYearSelect = (year) => {
    setCalendarYear(year);
    setShowYearPicker(false);
  };

  const handleMonthSelect = (month) => {
    setCalendarMonth(month);
    setShowMonthPicker(false);
  };

  // Update decade when year picker opens
  useEffect(() => {
    if (showYearPicker) {
      setYearPickerDecade(Math.floor(calendarYear / 10) * 10);
    }
  }, [showYearPicker, calendarYear]);

  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const fullMonthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const handleGenderSelect = (gender, setFieldValue) => {
    setSelectedGender(gender);
    if (setFieldValue) {
      setFieldValue('gender', gender);
    }
    setShowGenderPicker(false);
  };

  const handleContinue = async (values) => {
    if (isSubmitting) return; // Prevent multiple submissions

    setIsSubmitting(true);

    try {
      // Check if token exists before making API call
      const token = await SecureStore.getItemAsync('accessToken');
      if (!token) {
        logger.error('No access token found. User needs to login again.');
        setErrorPopupMessage('Please login again to continue.');
        setShowErrorPopup(true);
        // Navigate to login after a delay
        setTimeout(() => {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
        }, 2000);
        setIsSubmitting(false);
        return;
      }

      logger.debug('Token found, proceeding with profile update');

      // Backend expects a single 'name' field (not first_name and last_name)
      // Backend behavior: If the name contains a space, the last part is treated as the last name
      // Example: "Ali Awan" -> first_name: "Ali", last_name: "Awan"
      // Example: "John Michael Smith" -> first_name: "John", last_name: "Michael Smith"
      const fullName = values.fullName.trim();

      // Convert date from DD-MM-YYYY to YYYY-MM-DD
      const dateOfBirthFormatted = (values.dateOfBirth || dateOfBirth)
        .split('-')
        .reverse()
        .join('-');

      // Format gender to uppercase (MALE, FEMALE, OTHER)
      const genderFormatted = (values.gender || selectedGender).toUpperCase();

      // Prepare profile data
      const profileData = {
        name: fullName,
        date_of_birth: dateOfBirthFormatted,
        gender: genderFormatted,
      };

      // Add email or phone number based on login type
      if (isEmailLogin) {
        profileData.email = values.email.trim();
      } else {
        // Format phone number with country code (same format as LoginScreen)
        // Remove any non-digit characters and ensure it's a string
        const phoneNumber = String(values.phoneNumber || '').replace(/\D/g, '');
        // Ensure phone number is not empty and has valid length (7-15 digits, same as LoginScreen)
        if (phoneNumber && phoneNumber.length >= 7 && phoneNumber.length <= 15) {
          // Format exactly like LoginScreen: dialCode + phoneNumber
          const formattedPhone = String(selectedCountry.dialCode) + String(phoneNumber);
          profileData.phone_number = formattedPhone;
        } else {
          throw new Error('Please enter a valid phone number (7-15 digits)');
        }
      }

      logger.debug('Submitting profile data:', profileData);

      // Call the API
      const response = await userService.updateProfileJson(profileData);

      logger.debug('Profile update response:', response);

      // Check if the response is successful
      if (response && (response.success === true || response.status === 200)) {
        logger.info('Profile update successful, navigating to home screen');

        // Navigate to home screen on success
        navigation.reset({
          index: 0,
          routes: [{ name: 'LoggedIn' }],
        });
      } else {
        // If response doesn't indicate success, show error
        throw new Error(response?.message || 'Profile update failed');
      }
    } catch (error) {
      logger.error('Profile update error:', error);

      // Handle authentication errors specifically
      if (error.response?.status === 401 || error.status === 401) {
        setErrorPopupMessage('Your session has expired. Please login again.');
        setShowErrorPopup(true);
        // Navigate to login after a delay
        setTimeout(() => {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
        }, 2000);
      } else {
        // Extract error message from backend response
        let errorMessage = 'Failed to update profile. Please try again.';
        
        // Check for backend error response structure
        const errorData = error?.response?.data || error?.data || {};
        
        // Helper function to clean error message (remove field name prefix)
        const cleanErrorMessage = (message) => {
          if (!message) return message;
          // Remove field name prefixes like "phone_number: ", "email: ", etc.
          return String(message).replace(/^[a-z_]+:\s*/i, '').trim();
        };
        
        // First, check for main message
        if (errorData.message) {
          errorMessage = cleanErrorMessage(errorData.message);
        }
        // Check for field-specific errors (phone_number, email, etc.)
        else if (errorData.data) {
          // Handle phone number validation errors (array format)
          if (errorData.data.phone_number) {
            const phoneErrors = errorData.data.phone_number;
            const rawError = Array.isArray(phoneErrors) ? phoneErrors[0] : String(phoneErrors);
            errorMessage = cleanErrorMessage(rawError);
          }
          // Handle email validation errors (array format)
          else if (errorData.data.email) {
            const emailErrors = errorData.data.email;
            const rawError = Array.isArray(emailErrors) ? emailErrors[0] : String(emailErrors);
            errorMessage = cleanErrorMessage(rawError);
          }
          // Handle other field errors
          else {
            const fieldErrors = Object.values(errorData.data);
            if (fieldErrors.length > 0) {
              const firstError = fieldErrors[0];
              const rawError = Array.isArray(firstError) ? firstError[0] : String(firstError);
              errorMessage = cleanErrorMessage(rawError);
            }
          }
        }
        // Fallback to error message
        else if (error?.message) {
          errorMessage = cleanErrorMessage(error.message);
        }

        setErrorPopupMessage(errorMessage);
        setShowErrorPopup(true);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseErrorPopup = () => {
    setShowErrorPopup(false);
    setErrorPopupMessage('');
  };

  const genders = ['Male', 'Female', 'Other'];

  return (
    <LinearGradient
      colors={['#D9BA95', '#F5F5F5', '#F5F5F5', '#F5F5F5', '#E8D4B8', '#DBC2A3', '#D9BA95']}
      locations={[0, 0.15, 0.5, 0.65, 0.75, 0.88, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled={Platform.OS === 'ios'}
        keyboardVerticalOffset={0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1 }}>
          <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            keyboardShouldPersistTaps="handled"
          >
            {/* Header Section */}
            <View style={styles.headerSection}>
              <Typography
                weight="700"
                size={28}
                color={color.brown_3C200A}
                style={styles.title}
              >
                Get Started
              </Typography>
              <Typography
                weight="400"
                size={14}
                color={color.grey_87807C}
                style={styles.subtitle}
              >
                Enter your details, it helps us keep your account secure.
              </Typography>
            </View>

            {/* Form Section */}
            <View style={styles.formSection}>
              <Formik
                innerRef={formikRef}
                initialValues={{
                  fullName: '',
                  dateOfBirth: '',
                  email: isEmailLogin ? '' : '', // Show email field if user logged in with phone
                  phoneNumber: !isEmailLogin ? '' : '', // Show phone field if user logged in with email
                  gender: '',
                }}
                validationSchema={validationSchema}
                onSubmit={handleContinue}
              >
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue, isValid }) => {
                  // Create enhanced handleChange that also triggers validation
                  const enhancedHandleChange = (fieldName) => (text) => {
                    handleChange(fieldName)(text);
                    // Trigger validation after a short delay
                    setTimeout(() => {
                      if (formikRef.current) {
                        formikRef.current.validateForm().then(() => {
                          const { values: formValues, errors: formErrors } = formikRef.current;
                          setIsFormValid(checkFormValidity(formValues, formErrors, dateOfBirth, selectedGender, isEmailLogin));
                        });
                      }
                    }, 100);
                  };

                  // Check validity immediately based on current values (use ref to avoid state update during render)
                  const currentValidity = checkFormValidity(values, errors, dateOfBirth, selectedGender, isEmailLogin);
                  if (currentValidity !== isFormValid && prevValuesRef.current.lastValidity !== currentValidity) {
                    prevValuesRef.current.lastValidity = currentValidity;
                    // Use requestAnimationFrame to update state after render
                    requestAnimationFrame(() => {
                      setIsFormValid(currentValidity);
                    });
                  }

                  // Trigger validation check when values change
                  const valuesKey = JSON.stringify({
                    fullName: values.fullName,
                    email: values.email,
                    phoneNumber: values.phoneNumber,
                    gender: values.gender,
                    dateOfBirth: values.dateOfBirth || dateOfBirth,
                    selectedGender: selectedGender
                  });

                  // Check if values have changed and trigger validation
                  if (prevValuesRef.current.key !== valuesKey) {
                    prevValuesRef.current.key = valuesKey;
                    // Trigger validation check after render
                    setTimeout(() => {
                      if (formikRef.current) {
                        formikRef.current.validateForm().then(() => {
                          const { values: formValues, errors: formErrors } = formikRef.current;
                          setIsFormValid(checkFormValidity(formValues, formErrors, dateOfBirth, selectedGender, isEmailLogin));
                        });
                      }
                    }, 50);
                  }

                  return (
                    <View style={styles.formContainer}>
                      {/* Full Name Field */}
                      <View style={styles.fieldContainer}>
                        <TextInput
                          style={[
                            styles.inputField,
                            (touched.fullName || values.fullName) && errors.fullName ? styles.inputError : null
                          ]}
                          placeholder="Enter your Full Name"
                          placeholderTextColor={color.grey_87807C}
                          onChangeText={enhancedHandleChange('fullName')}
                          onBlur={handleBlur('fullName')}
                          value={values.fullName}
                          selectionColor={color.btnBrown_AE6F28}
                          autoCapitalize="words"
                          returnKeyType="next"
                          onSubmitEditing={() => {
                            // Prevent moving to next field if current field is invalid
                            const nameParts = (values.fullName?.trim() || '').split(/\s+/).filter(part => part.length > 0);
                            const isValid = nameParts.length >= 2 && nameParts.every(part => part.length >= 2);
                            if (!isValid) {
                              // Keep focus on current field if invalid
                              // The error will already be showing
                            }
                          }}
                        />
                        {((touched.fullName || values.fullName) && errors.fullName) && (
                          <Caption color={color.red_FF0000} style={styles.errorText}>
                            {errors.fullName}
                          </Caption>
                        )}
                      </View>

                      {/* Date of Birth Field */}
                      <View style={styles.fieldContainer}>
                        <TouchableOpacity
                          style={[
                            styles.inputField,
                            styles.dateInputField,
                            touched.dateOfBirth && errors.dateOfBirth ? styles.inputError : null
                          ]}
                          onPress={() => {
                            setShowDatePicker(true);
                          }}
                          activeOpacity={0.7}
                        >
                          <Text style={[
                            styles.dateInputText,
                            (values.dateOfBirth || dateOfBirth) ? styles.dateInputTextFilled : styles.dateInputTextPlaceholder
                          ]}>
                            {(values.dateOfBirth || dateOfBirth)
                              ? formatDateForDisplay(values.dateOfBirth || dateOfBirth)
                              : 'Enter your Date of Birth'}
                          </Text>
                          <View style={styles.calendarIconButton}>
                            <SvgIcons.calendarIcon width={18} height={18} />
                          </View>
                        </TouchableOpacity>
                        {touched.dateOfBirth && errors.dateOfBirth && (
                          <Caption color={color.red_FF0000} style={styles.errorText}>
                            {errors.dateOfBirth}
                          </Caption>
                        )}
                      </View>

                      {/* Email or Phone Field */}
                      {isEmailLogin ? (
                        <View style={styles.fieldContainer}>
                          <TextInput
                            style={[
                              styles.inputField,
                              touched.email && errors.email ? styles.inputError : null
                            ]}
                            placeholder="Enter your Email Address"
                            placeholderTextColor={color.grey_87807C}
                            onChangeText={enhancedHandleChange('email')}
                            onBlur={handleBlur('email')}
                            value={values.email}
                            keyboardType="email-address"
                            selectionColor={color.btnBrown_AE6F28}
                            autoCapitalize="none"
                            autoComplete="email"
                          />
                          {touched.email && errors.email && (
                            <Caption color={color.red_FF0000} style={styles.errorText}>
                              {errors.email}
                            </Caption>
                          )}
                        </View>
                      ) : (
                        <View style={styles.fieldContainer}>
                          <View style={[
                            styles.phoneInputRow,
                            touched.phoneNumber && errors.phoneNumber ? styles.inputError : null
                          ]}>
                            <TouchableOpacity
                              style={styles.countryCodeButton}
                              onPress={() => setShowCountryPicker(true)}
                              disabled={isDetectingCountry}
                            >
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
                            <TextInput
                              style={styles.phoneInputField}
                              placeholder="Enter phone number"
                              placeholderTextColor={color.grey_87807C}
                              onChangeText={enhancedHandleChange('phoneNumber')}
                              onBlur={handleBlur('phoneNumber')}
                              value={values.phoneNumber}
                              keyboardType="numeric"
                              selectionColor={color.btnBrown_AE6F28}
                              autoComplete="tel"
                            />
                          </View>
                          {touched.phoneNumber && errors.phoneNumber && (
                            <Caption color={color.red_FF0000} style={styles.errorText}>
                              {errors.phoneNumber}
                            </Caption>
                          )}
                        </View>
                      )}

                      {/* Gender Field */}
                      <View style={styles.fieldContainer}>
                        <TouchableOpacity
                          style={[
                            styles.inputField,
                            styles.genderInputField,
                            touched.gender && errors.gender ? styles.inputError : null
                          ]}
                          onPress={() => {
                            setShowGenderPicker(true);
                          }}
                        >
                          <Text style={[
                            styles.genderInputText,
                            selectedGender ? styles.genderInputTextFilled : styles.genderInputTextPlaceholder
                          ]}>
                            {values.gender || selectedGender || 'Select your Gender'}
                          </Text>
                          <SvgIcons.arrowDown width={18} height={18} />
                        </TouchableOpacity>
                        {touched.gender && errors.gender && (
                          <Caption color={color.red_FF0000} style={styles.errorText}>
                            {errors.gender}
                          </Caption>
                        )}
                      </View>

                      {/* Spacer for Continue button */}
                      <View style={styles.spacer} />

                      {/* Date Picker Modal */}
                      <Modal
                        visible={showDatePicker}
                        transparent={true}
                        animationType="fade"
                        onRequestClose={() => setShowDatePicker(false)}
                      >
                        <TouchableOpacity
                          style={styles.modalOverlay}
                          activeOpacity={1}
                          onPress={() => setShowDatePicker(false)}
                        >
                          <TouchableWithoutFeedback>
                            <View style={styles.datePickerModal} onStartShouldSetResponder={() => true}>

                              {/* Calendar Header with Navigation */}
                              <View style={styles.calendarHeader}>
                                <View style={styles.calendarNavButtons}>
                                  <TouchableOpacity onPress={() => navigateYear('prev')} style={styles.navButton}>
                                    <Ionicons name="chevron-back" size={20} color={color.black_544B45} />
                                  </TouchableOpacity>
                                  <TouchableOpacity onPress={() => navigateMonth('prev')} style={styles.navButton}>
                                    <Ionicons name="chevron-back" size={20} color={color.black_544B45} />
                                  </TouchableOpacity>
                                </View>

                                <View style={styles.calendarMonthYearContainer}>
                                  <TouchableOpacity
                                    onPress={() => setShowMonthPicker(true)}
                                    activeOpacity={0.7}
                                  >
                                    <Typography
                                      weight="600"
                                      size={16}
                                      color={color.btnBrown_AE6F28}
                                      style={styles.calendarMonthText}
                                    >
                                      {fullMonthNames[calendarMonth]}
                                    </Typography>
                                  </TouchableOpacity>
                                  <Typography
                                    weight="600"
                                    size={16}
                                    color={color.black_544B45}
                                    style={styles.calendarMonthYear}
                                  >
                                    {' '}
                                  </Typography>
                                  <TouchableOpacity
                                    onPress={() => setShowYearPicker(true)}
                                    activeOpacity={0.7}
                                  >
                                    <Typography
                                      weight="600"
                                      size={16}
                                      color={color.btnBrown_AE6F28}
                                      style={styles.calendarYearText}
                                    >
                                      {calendarYear}
                                    </Typography>
                                  </TouchableOpacity>
                                </View>

                                <View style={styles.calendarNavButtons}>
                                  <TouchableOpacity onPress={() => navigateMonth('next')} style={styles.navButton}>
                                    <Ionicons name="chevron-forward" size={20} color={color.black_544B45} />
                                  </TouchableOpacity>
                                  <TouchableOpacity onPress={() => navigateYear('next')} style={styles.navButton}>
                                    <Ionicons name="chevron-forward" size={20} color={color.black_544B45} />
                                  </TouchableOpacity>
                                </View>
                              </View>

                              {/* Week Days Header */}
                              <View style={styles.weekDaysContainer}>
                                {weekDays.map((day, index) => (
                                  <View key={index} style={styles.weekDay}>
                                    <Typography
                                      weight="400"
                                      size={14}
                                      color={color.black_544B45}
                                    >
                                      {day}
                                    </Typography>
                                  </View>
                                ))}
                              </View>

                              {/* Calendar Grid */}
                              <View style={styles.calendarGrid}>
                                {generateCalendarDays().map((dateItem, index) => {
                                  const selectedDate = values.dateOfBirth || dateOfBirth;
                                  const isSelected = selectedDate &&
                                    parseInt(selectedDate.split('-')[0]) === dateItem.day &&
                                    parseInt(selectedDate.split('-')[1]) - 1 === dateItem.month &&
                                    parseInt(selectedDate.split('-')[2]) === dateItem.year;

                                  return (
                                    <TouchableOpacity
                                      key={index}
                                      style={[
                                        styles.calendarDay,
                                        !dateItem.isCurrentMonth && styles.calendarDayOtherMonth,
                                        isSelected && styles.calendarDaySelected,
                                      ]}
                                      onPress={() => {
                                        if (dateItem.isCurrentMonth) {
                                          handleDateSelect(dateItem.day, dateItem.month + 1, dateItem.year, setFieldValue);
                                        }
                                      }}
                                    >
                                      <Typography
                                        weight={isSelected ? "600" : "400"}
                                        size={14}
                                        color={
                                          isSelected
                                            ? color.black_544B45
                                            : !dateItem.isCurrentMonth
                                              ? color.grey_87807C
                                              : color.black_544B45
                                        }
                                      >
                                        {dateItem.day}
                                      </Typography>
                                    </TouchableOpacity>
                                  );
                                })}
                              </View>
                            </View>
                          </TouchableWithoutFeedback>
                        </TouchableOpacity>
                      </Modal>

                      {/* Year Picker Modal */}
                      <Modal
                        visible={showYearPicker}
                        transparent={true}
                        animationType="slide"
                        onRequestClose={() => setShowYearPicker(false)}
                      >
                        <TouchableOpacity
                          style={styles.yearModalOverlay}
                          activeOpacity={1}
                          onPress={() => setShowYearPicker(false)}
                        >
                          <TouchableWithoutFeedback>
                            <View style={styles.yearPickerModal}>
                              <View style={styles.modalHandle} />

                              {/* Decade Header with Navigation */}
                              <View style={styles.yearPickerHeader}>
                                <TouchableOpacity
                                  onPress={() => navigateDecade('prev')}
                                  style={styles.decadeNavButton}
                                >
                                  <Ionicons name="chevron-back" size={20} color={color.black_544B45} />
                                  <Ionicons name="chevron-back" size={20} color={color.black_544B45} style={{ marginLeft: -8 }} />
                                </TouchableOpacity>

                                <Typography
                                  weight="600"
                                  size={16}
                                  color={color.btnBrown_AE6F28}
                                  style={styles.decadeText}
                                >
                                  {yearPickerDecade}-{yearPickerDecade + 9}
                                </Typography>

                                <TouchableOpacity
                                  onPress={() => navigateDecade('next')}
                                  style={styles.decadeNavButton}
                                >
                                  <Ionicons name="chevron-forward" size={20} color={color.black_544B45} />
                                  <Ionicons name="chevron-forward" size={20} color={color.black_544B45} style={{ marginLeft: -8 }} />
                                </TouchableOpacity>
                              </View>

                              {/* Years Grid */}
                              <View style={styles.yearsGrid}>
                                {generateDecadeYears().map((year) => {
                                  const isCurrentDecade = year >= yearPickerDecade && year < yearPickerDecade + 10;
                                  const isSelected = calendarYear === year;

                                  return (
                                    <TouchableOpacity
                                      key={year}
                                      style={[
                                        styles.yearGridItem,
                                        isCurrentDecade && styles.yearGridItemCurrentDecade,
                                        isSelected && styles.yearGridItemSelected
                                      ]}
                                      onPress={() => handleYearSelect(year)}
                                      activeOpacity={0.7}
                                    >
                                      <Typography
                                        weight={isSelected ? "600" : "400"}
                                        size={14}
                                        color={
                                          isSelected
                                            ? color.btnBrown_AE6F28
                                            : isCurrentDecade
                                              ? color.black_544B45
                                              : color.grey_87807C
                                        }
                                      >
                                        {year}
                                      </Typography>
                                    </TouchableOpacity>
                                  );
                                })}
                              </View>
                            </View>
                          </TouchableWithoutFeedback>
                        </TouchableOpacity>
                      </Modal>

                      {/* Month Picker Modal */}
                      <Modal
                        visible={showMonthPicker}
                        transparent={true}
                        animationType="slide"
                        onRequestClose={() => setShowMonthPicker(false)}
                      >
                        <TouchableOpacity
                          style={styles.yearModalOverlay}
                          activeOpacity={1}
                          onPress={() => setShowMonthPicker(false)}
                        >
                          <TouchableWithoutFeedback>
                            <View style={styles.yearPickerModal}>
                              <View style={styles.modalHandle} />

                              {/* Month Picker Header */}
                              <View style={styles.yearPickerHeader}>
                                <View style={styles.decadeNavButton} />
                                <Typography
                                  weight="600"
                                  size={16}
                                  color={color.btnBrown_AE6F28}
                                  style={styles.decadeText}
                                >
                                  Select Month
                                </Typography>
                                <View style={styles.decadeNavButton} />
                              </View>

                              {/* Months Grid */}
                              <View style={styles.yearsGrid}>
                                {fullMonthNames.map((monthName, index) => {
                                  const isSelected = calendarMonth === index;

                                  return (
                                    <TouchableOpacity
                                      key={index}
                                      style={[
                                        styles.yearGridItem,
                                        styles.monthGridItem,
                                        isSelected && styles.yearGridItemSelected
                                      ]}
                                      onPress={() => handleMonthSelect(index)}
                                      activeOpacity={0.7}
                                    >
                                      <Typography
                                        weight={isSelected ? "600" : "400"}
                                        size={14}
                                        color={
                                          isSelected
                                            ? color.btnBrown_AE6F28
                                            : color.black_544B45
                                        }
                                      >
                                        {monthName}
                                      </Typography>
                                    </TouchableOpacity>
                                  );
                                })}
                              </View>
                            </View>
                          </TouchableWithoutFeedback>
                        </TouchableOpacity>
                      </Modal>

                      {/* Gender Picker Modal */}
                      <Modal
                        visible={showGenderPicker}
                        transparent={true}
                        animationType="slide"
                        onRequestClose={() => setShowGenderPicker(false)}
                      >
                        <TouchableOpacity
                          style={styles.genderModalOverlay}
                          activeOpacity={1}
                          onPress={() => setShowGenderPicker(false)}
                        >
                          <TouchableWithoutFeedback>
                            <View style={styles.genderPickerModal}>
                              <View style={styles.modalHandle} />
                              <View style={styles.modalHeader}>
                                <Typography
                                  weight="600"
                                  size={16}
                                  color={color.brown_3C200A}
                                  style={styles.modalTitle}
                                >
                                  Select Gender
                                </Typography>
                              </View>
                              <View style={styles.genderOptions}>
                                {genders.map((gender) => (
                                  <TouchableOpacity
                                    key={gender}
                                    style={styles.genderOption}
                                    onPress={() => handleGenderSelect(gender, setFieldValue)}
                                  >
                                    {/* <View style={styles.genderRadio}>
                                    {(values.gender === gender || selectedGender === gender) && (
                                      <View style={styles.genderRadioSelected} />
                                    )}
                                  </View> */}
                                    <Typography
                                      weight="400"
                                      size={16}
                                      color={color.black_544B45}
                                    >
                                      {gender}
                                    </Typography>
                                  </TouchableOpacity>
                                ))}
                              </View>
                            </View>
                          </TouchableWithoutFeedback>
                        </TouchableOpacity>
                      </Modal>
                    </View>
                  );
                }}
              </Formik>
            </View>
          </ScrollView>

          {/* Continue Button - Fixed at bottom, doesn't move with keyboard */}
          {isFormValid && (
            <View style={styles.continueButtonContainer}>
              <TouchableOpacity
                style={[
                  styles.continueButton,
                  isSubmitting && styles.continueButtonDisabled
                ]}
                onPress={() => {
                  if (formikRef.current && !isSubmitting) {
                    formikRef.current.handleSubmit();
                  }
                }}
                disabled={isSubmitting}
              >
                <Typography
                  weight="600"
                  size={16}
                  color={color.white_FFFFFF}
                >
                  {isSubmitting ? 'Submitting...' : 'Continue'}
                </Typography>
              </TouchableOpacity>
            </View>
          )}

          {/* Country Code Picker Modal */}
          {!isEmailLogin && (
            <CountryCodePicker
              selectedCountry={selectedCountry}
              onSelectCountry={setSelectedCountry}
              visible={showCountryPicker}
              onClose={() => setShowCountryPicker(false)}
            />
          )}

          {/* Error Popup */}
          <OtpErrorPopup
            visible={showErrorPopup}
            onClose={handleCloseErrorPopup}
            title="Error"
            subtitle={errorPopupMessage || "Failed to update profile. Please try again."}
            showResendButton={false}
          />
        </View>
      </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'android' ? 100 : 80, // Extra padding for Continue button
  },
  headerSection: {
    marginTop: 40,
    marginBottom: 30,
  },
  title: {
    marginBottom: 12,
  },
  subtitle: {
    lineHeight: 20,
  },
  formSection: {
    flex: 1,
  },
  formContainer: {
    width: '100%',
  },
  fieldContainer: {
    marginBottom: 20,
  },
  inputField: {
    width: '100%',
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: color.borderBrown_CEBCA0,
    backgroundColor: color.white_FFFFFF,
    paddingHorizontal: 20,
    fontSize: 14,
    color: color.black_544B45,
    fontWeight: '400',
  },
  dateInputField: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 10,
  },
  calendarIconButton: {
    padding: 5,
  },
  dateInputText: {
    fontSize: 14,
    fontWeight: '400',
  },
  dateInputTextFilled: {
    color: color.black_544B45,
  },
  dateInputTextPlaceholder: {
    color: color.grey_87807C,
  },
  genderInputField: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  genderInputText: {
    fontSize: 14,
    fontWeight: '400',
  },
  genderInputTextFilled: {
    color: color.black_544B45,
  },
  genderInputTextPlaceholder: {
    color: color.grey_87807C,
  },
  phoneInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: color.borderBrown_CEBCA0,
    borderRadius: 12,
    backgroundColor: color.white_FFFFFF,
    overflow: 'hidden',
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
  flagText: {
    fontSize: 16,
    marginRight: 6,
  },
  countryCodeText: {
    marginRight: 4,
  },
  phoneInputField: {
    flex: 1,
    height: 56,
    paddingHorizontal: 15,
    fontSize: 14,
    color: color.black_544B45,
    fontWeight: '400',
  },
  inputError: {
    borderColor: color.red_FF0000,
    borderWidth: 2,
  },
  errorText: {
    marginTop: 5,
    marginLeft: 4,
  },
  spacer: {
    height: 20,
  },
  continueButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 30 : 20,
    backgroundColor: 'transparent',
    zIndex: 1000,
    elevation: Platform.OS === 'android' ? 1000 : 0,
  },
  continueButton: {
    width: '100%',
    height: 56,
    borderRadius: 12,
    backgroundColor: color.btnBrown_AE6F28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: color.grey_E0E0E0,
    opacity: 0.6,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20,
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
  },
  linkText: {
    textDecorationLine: 'underline',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  genderModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  datePickerModal: {
    backgroundColor: color.white_FFFFFF,
    borderRadius: 20,
    width: '100%',
    maxWidth: 400,
    maxHeight: '43%',
    paddingBottom: Platform.OS === 'ios' ? 30 : 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  genderPickerModal: {
    backgroundColor: color.white_FFFFFF,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: '100%',
    paddingBottom: Platform.OS === 'ios' ? 30 : 20,
  },
  modalHandle: {
    width: 28,
    height: 3,
    backgroundColor: color.grey_AFAFAF,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  modalTitle: {
    flex: 1,
    fontWeight: 'bold'
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: color.grey_E0E0E0,
  },
  calendarNavButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navButton: {
    padding: 5,
  },
  calendarMonthYearContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  calendarMonthText: {
    fontSize: 16,
  },
  calendarMonthYear: {
    fontSize: 16,
  },
  calendarYearText: {
    fontSize: 16,
  },
  monthGridItem: {
    backgroundColor: '#F5F5F5',
  },
  weekDaysContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: color.grey_E0E0E0,
  },
  weekDay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  calendarDay: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    marginVertical: 2,
  },
  calendarDayOtherMonth: {
    opacity: 0.3,
  },
  calendarDaySelected: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#2196F3',
  },
  genderOptions: {
    paddingHorizontal: 20,
  },
  genderOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomColor: color.borderBrown_CEBCA0,
  },
  genderRadio: {
    width: 16,
    height: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: color.borderBrown_CEBCA0,
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  genderRadioSelected: {
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: color.btnBrown_AE6F28,
  },
  yearModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  yearPickerModal: {
    backgroundColor: color.white_FFFFFF,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: '100%',
    maxHeight: '50%',
    paddingBottom: Platform.OS === 'ios' ? 30 : 20,
    paddingHorizontal: 20,
  },
  yearPickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: color.grey_E0E0E0,
  },
  decadeNavButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  decadeText: {
    fontSize: 16,
  },
  yearsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingTop: 20,
    paddingBottom: 10,
  },
  yearGridItem: {
    width: '30%',
    minHeight: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderRadius: 8,
    paddingVertical: 12,
  },
  yearGridItemCurrentDecade: {
    backgroundColor: '#F5F5F5',
  },
  yearGridItemSelected: {
    backgroundColor: color.white_FFFFFF,
    borderWidth: 2,
    borderColor: color.btnBrown_AE6F28,
  },
});

export default GetStartedScreen;

