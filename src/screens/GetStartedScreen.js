import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Keyboard,
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
import SvgIcons from '../../components/SvgIcons';
import { color } from '../color/color';
import CountryCodePicker from '../components/CountryCodePicker';
import Typography, { Caption } from '../components/Typography';
import { defaultCountryCode } from '../constants/countryCodes';
import { getAutoDetectedCountry } from '../utils/countryDetection';

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
  const [selectedCountry, setSelectedCountry] = useState(defaultCountryCode);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [isDetectingCountry, setIsDetectingCountry] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
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

  const isEmailLogin = userIdentifier ? isEmail(userIdentifier) : false;
  
  // Debug logging
  useEffect(() => {
    console.log('GetStartedScreen - userIdentifier:', userIdentifier);
    console.log('GetStartedScreen - isEmailLogin:', isEmailLogin);
  }, [userIdentifier, isEmailLogin]);

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
            console.error('Failed to auto-detect country:', error);
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
    const hasFullName = formValues?.fullName && formValues.fullName.trim().length >= 1;
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
      const { values, errors } = formikRef.current;
      setIsFormValid(checkFormValidity(values, errors, dateOfBirth, selectedGender, isEmailLogin));
    }
  }, [dateOfBirth, selectedGender, isEmailLogin]);

  const validationSchema = Yup.object().shape({
    fullName: Yup.string()
      .min(2, 'Full name must be at least 2 characters')
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
    // // TODO: Handle form submission - navigate to next screen or submit to API
    // console.log('Form values:', values);
    // // For now, navigate to LoggedIn screen
    // navigation.reset({
    //   index: 0,
    //   routes: [{ name: 'LoggedIn' }],
    // });
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
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1 }}>
          <StatusBar
            style="light"
            backgroundColor="transparent"
            translucent
            hidden={true}
          />
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
                  email: isEmailLogin ? userIdentifier : '',
                  phoneNumber: !isEmailLogin ? '' : '',
                  gender: '',
                }}
                validationSchema={validationSchema}
                onSubmit={handleContinue}
              >
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue, isValid }) => {
                  // Trigger validation check when values change
                  const valuesKey = JSON.stringify({ 
                    fullName: values.fullName, 
                    email: values.email, 
                    phoneNumber: values.phoneNumber, 
                    gender: values.gender,
                    dateOfBirth: values.dateOfBirth || dateOfBirth,
                    selectedGender: selectedGender
                  });
                  
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
                    }, 0);
                  }

                  return (
                  <View style={styles.formContainer}>
                    {/* Full Name Field */}
                    <View style={styles.fieldContainer}>
                      <TextInput
                        style={[
                          styles.inputField,
                          touched.fullName && errors.fullName ? styles.inputError : null
                        ]}
                        placeholder="Enter your Full Name"
                        placeholderTextColor={color.grey_87807C}
                        onChangeText={handleChange('fullName')}
                        onBlur={handleBlur('fullName')}
                        value={values.fullName}
                        selectionColor={color.btnBrown_AE6F28}
                        autoCapitalize="words"
                      />
                      {touched.fullName && errors.fullName && (
                        <Caption color={color.red_FF0000} style={styles.errorText}>
                          {errors.fullName}
                        </Caption>
                      )}
                    </View>

                    {/* Date of Birth Field */}
                    <View style={styles.fieldContainer}>
                      <View style={[
                        styles.inputField,
                        styles.dateInputField,
                        touched.dateOfBirth && errors.dateOfBirth ? styles.inputError : null
                      ]}>
                        <Text style={[
                          styles.dateInputText,
                          (values.dateOfBirth || dateOfBirth) ? styles.dateInputTextFilled : styles.dateInputTextPlaceholder
                        ]}>
                          {(values.dateOfBirth || dateOfBirth) 
                            ? formatDateForDisplay(values.dateOfBirth || dateOfBirth)
                            : 'Enter your Date of Birth'}
                        </Text>
                        <TouchableOpacity
                          onPress={() => {
                            setShowDatePicker(true);
                          }}
                          style={styles.calendarIconButton}
                        >
                          <SvgIcons.calendarIcon width={18} height={18} />
                        </TouchableOpacity>
                      </View>
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
                          onChangeText={handleChange('email')}
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
                            onChangeText={handleChange('phoneNumber')}
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
                              
                              <Typography
                                weight="600"
                                size={16}
                                color={color.black_544B45}
                                style={styles.calendarMonthYear}
                              >
                                {fullMonthNames[calendarMonth]} {calendarYear}
                              </Typography>
                              
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
          
          {/* Continue Button - Fixed at bottom */}
          {isFormValid && (
            <View style={styles.continueButtonContainer}>
              <TouchableOpacity
                style={styles.continueButton}
                onPress={() => {
                  if (formikRef.current) {
                    formikRef.current.handleSubmit();
                  }
                }}
              >
                <Typography
                  weight="600"
                  size={16}
                  color={color.white_FFFFFF}
                >
                  Continue
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
        </View>
      </TouchableWithoutFeedback>
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
    paddingBottom: 100, // Extra padding for Continue button
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
    paddingBottom: 100,
    backgroundColor: 'transparent',
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
  calendarMonthYear: {
    fontSize: 16,
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
});

export default GetStartedScreen;

