import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  Dimensions,
  Keyboard,
  Modal,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import SvgIcons from '../../components/SvgIcons';
import { authService } from '../api/apiService';
import { color } from '../color/color';
import Typography from '../components/Typography';
import OtpErrorPopup from '../constants/OtpErrorPopup';
import OtpSuccessPopup from '../constants/OtpSuccessPopup';

// Helper function to format seconds as mm:ss
function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

// Helper function to detect if user identifier is email or phone
function isEmail(identifier) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(identifier);
}

const OtpLoginScreen = ({ route }) => {
  const navigation = useNavigation();
  const [otpResendTime, setOtpResendTime] = useState(120); // 2 minutes
  const [otp, setOtp] = useState(['', '', '', '', '']);
  const inputRefs = useRef([]);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const uuid = route?.params?.uuid;
  const userIdentifier = route?.params?.user_identifier;
  const [errorMessage, setErrorMessage] = useState('');
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [showOtpSourceModal, setShowOtpSourceModal] = useState(false);
  const [selectedOtpSource, setSelectedOtpSource] = useState('WHATSAPP');

  const { height: screenHeight, width: screenWidth } = Dimensions.get('window');
  const isSmallScreen = screenHeight < 700;
  const isNarrowScreen = screenWidth < 400;
  // useEffect(() => {
  //   const checkLoggedIn = async () => {
  //     const token = await SecureStore.getItemAsync('accessToken');
  //     if (token) {
  //       navigation.navigate('LoggedIn'); // Navigate to your home screen
  //     }
  //   };

  //   checkLoggedIn();
  // }, [navigation]);

  useEffect(() => {
    if (!uuid || !userIdentifier) {
      console.log('Missing required parameters:', { uuid, userIdentifier });
      Alert.alert('Error', 'Missing verification information');
      navigation.goBack();
    }
  }, [uuid, userIdentifier]);

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

  const gotologinscreen = () => {
    navigation.navigate('Login');
  }

  const handleSignIn = async (otpArray) => {
    navigation.navigate('GetStarted')
    // const enteredOtp = otpArray.join('');
    // console.log('handleSignIn called with OTP:', enteredOtp);
    // if (enteredOtp.length === 5) {
    //   setLoading(true);
    //   try {
    //     const payload = {
    //       uuid: uuid,
    //       otp: enteredOtp
    //     };
    //     const response = await authService.verifyOtp(payload);
    //     console.log('OTP verify response:', response);
    //     if (response.success && response.data && response.data.access_token) {
    //       setShowError(false);
    //       setErrorMessage('');
    //       setLoading(false);
    //       // Store the access token
    //       await SecureStore.setItemAsync('accessToken', response.data.access_token);
    //       // Fetch staff events
    //       const staffEventsData = await eventService.fetchStaffEvents();
    //       console.log('Staff events data structure:', JSON.stringify(staffEventsData, null, 2));
    //       const eventsList = staffEventsData?.data;
    //       console.log('Events list:', eventsList);

    //       // Handle different data structures for ADMIN vs Organizer roles
    //       let selectedEvent = null;

    //       if (eventsList && eventsList.length > 0) {
    //         // For organizer role: eventsList[0] contains {events: [...], staff: "..."}
    //         if (eventsList[0].events && Array.isArray(eventsList[0].events)) {
    //           console.log('Organizer role detected - events array found');
    //           console.log('Events array:', eventsList[0].events);
    //           if (eventsList[0].events.length > 0) {
    //             selectedEvent = eventsList[0].events[0];
    //             console.log('Selected event from organizer role:', selectedEvent);
    //           }
    //         } else {
    //           // For admin role or direct event structure
    //           console.log('Admin role or direct event structure detected');
    //           selectedEvent = eventsList[0];
    //           console.log('Selected event from admin role:', selectedEvent);
    //         }
    //       }

    //       if (selectedEvent) {
    //         const eventUuid = selectedEvent.uuid || selectedEvent.eventUuid;
    //         console.log('Selected event UUID:', eventUuid);

    //         try {
    //           // Fetch event info
    //           const eventInfoData = await eventService.fetchEventInfo(eventUuid);

    //           // Store the selected event UUID for app restart scenarios
    //           await SecureStore.setItemAsync('lastSelectedEventUuid', eventUuid);
    //           console.log('Stored last selected event UUID:', eventUuid);

    //           // Verify the storage worked
    //           const storedUuid = await SecureStore.getItemAsync('lastSelectedEventUuid');
    //           console.log('Verified stored UUID:', storedUuid);

    //           navigation.navigate('GetStarted', {
    //             user_identifier: userIdentifier
    //           });
    //         } catch (eventError) {
    //           console.error('Error fetching event info:', eventError);

    //           // Handle business logic errors gracefully
    //           if (eventError.isBusinessError) {
    //             console.log('Business logic error - proceeding without event data');
    //             // Navigate to GetStarted screen
    //             navigation.navigate('GetStarted', {
    //               user_identifier: userIdentifier
    //             });
    //           } else {
    //             // For other errors, show error message but still navigate
    //             setErrorMessage('Unable to load event details. Please try again later.');
    //             setShowError(true);
    //             setLoading(false);
    //             setTimeout(() => {
    //               navigation.reset({
    //                 index: 0,
    //                 routes: [{ name: 'LoggedIn' }],
    //               });
    //             }, 2000);
    //           }
    //         }
    //       } else {
    //         console.log('No events found - proceeding to GetStarted');
    //         navigation.navigate('GetStarted', {
    //           user_identifier: userIdentifier
    //         });
    //       }
    //     } else {
    //       setErrorMessage('You have entered an invalid OTP');
    //       setShowError(true);
    //       setLoading(false);
    //     }
    //   } catch (error) {
    //     setErrorMessage('You have entered an invalid OTP');
    //     setShowError(true);
    //     setLoading(false);
    //     console.log('OTP Verification Error:', error);
    //   }
    // }
  };

  const handleResendOtp = async () => {
    setShowError(false);
    setErrorMessage('');
    setShowErrorPopup(false); // Clear any existing error popup
    setShowOtpSourceModal(true); // Show OTP source selection modal
  };

  const handleOtpSourceSelect = async (otpSource) => {
    setSelectedOtpSource(otpSource);
    setShowOtpSourceModal(false);

    try {
      const payload = {
        user_identifier: userIdentifier,
        resend_otp: true,
        otp_source: otpSource
      };

      const response = await authService.requestOtp(payload);
      if (response && response.success) {
        // Update the UUID with the new one from response
        setOtp(['', '', '', '', '']); // Clear the OTP fields
        setOtpResendTime(120); // Reset timer to 2 minutes
        setShowSuccessPopup(true);
      } else {
        setShowErrorPopup(true);
      }
    } catch (error) {
      console.error('Resend OTP Error:', error);
      setShowErrorPopup(true);
    }
  };

  const handleCloseSuccessPopup = useCallback(() => {
    setShowSuccessPopup(false);
  }, []);

  const handleCloseErrorPopup = useCallback(() => {
    setShowErrorPopup(false);
  }, []);

  useEffect(() => {
    if (otpResendTime > 0) {
      const timer = setInterval(() => {
        setOtpResendTime((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [otpResendTime]);

  const handleOtpChange = (value, index) => {
    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);
    setShowError(false);
    setErrorMessage('');
    console.log('OTP changed:', updatedOtp);
    // Move to next input field automatically
    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
    // If all 5 digits are filled, trigger handleSignIn
    if (updatedOtp.every((digit) => digit.length === 1)) {
      handleSignIn(updatedOtp);
    }
  };

  const handleKeyPress = (event, index) => {
    if (event.nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const dismissError = () => {
    setShowError(false);
    setErrorMessage('');
  };
  return (
    <LinearGradient
      colors={['#D9BA95', '#F5F5F5', '#D9BA95']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1 }}>
      
          <View style={styles.container}>
            {/* Header Section */}
            <View style={styles.headerSection}>
              <Typography
                weight="700"
                size={25}
                color={color.brown_3C200A}
                style={styles.title}
              >
                We've sent you an OTP
              </Typography>
              <Typography
                weight="400"
                size={12}
                color={color.grey_87807C}
                style={styles.subtitle}
              >
                Enter the OTP sent to your {isEmail(userIdentifier) ? 'email' : 'phone number'}
              </Typography>
            </View>

            {/* OTP Input Section */}
            <View style={styles.otpSection}>
              <View style={styles.otpContainer}>
                {otp.map((digit, index) => (
                  <TextInput
                    key={index}
                    style={[
                      styles.otpInput,
                      showError ? styles.otpInputError : null
                    ]}
                    value={digit}
                    placeholder=""
                    placeholderTextColor={color.grey_87807C}
                    maxLength={1}
                    keyboardType="numeric"
                    onChangeText={(value) => handleOtpChange(value, index)}
                    onKeyPress={(event) => handleKeyPress(event, index)}
                    ref={(ref) => (inputRefs.current[index] = ref)}
                    selectionColor={color.btnBrown_AE6F28}
                    editable={!loading}
                  />
                ))}
              </View>

              {/* Resend/Timer and Try Another Way */}
              <View style={styles.actionRow}>
                {otpResendTime > 0 ? (
                  <View style={styles.timerRow}>
                    <Typography
                      weight="400"
                      size={12}
                      color={color.grey_87807C}
                    >
                      Resend{' '}
                    </Typography>
                    <Typography
                      weight="400"
                      size={14}
                      color={color.btnBrown_AE6F28}
                    >
                      {formatTime(otpResendTime)}sec
                    </Typography>
                  </View>
                ) : (
                  <TouchableOpacity style={styles.resendOtpButton} onPress={handleResendOtp}>
                    <Typography
                      weight="400"
                      size={12}
                      color={color.grey_87807C}
                    >
                      Resend
                    </Typography>
                  </TouchableOpacity>
                )}
                <TouchableOpacity onPress={handleResendOtp}>
                  <Typography
                    weight="500"
                    size={12}
                    color={color.brown_766F6A}
                    style={styles.tryAnotherWay}
                  >
                    Try another way
                  </Typography>
                </TouchableOpacity>
              </View>
              {showError && (
              <View style={styles.errorContainer}>
                <TouchableOpacity onPress={dismissError}>
                  <SvgIcons.crossIconRed width={20} height={20} fill={color.red_FF3B30} />
                </TouchableOpacity>
                <Typography weight="400" size={14} color={color.red_EF3E32} style={styles.errorText}>
                  {errorMessage}
                </Typography>
              </View>
            )}
            </View>


            {/* Footer with Logo */}
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

          {/* Popups */}
          <OtpSuccessPopup
            visible={showSuccessPopup}
            onClose={handleCloseSuccessPopup}
            title="OTP Sent Successfully"
            subtitle={
              selectedOtpSource === 'WHATSAPP'
                ? "We've sent a one-time password to your WhatsApp"
                : selectedOtpSource === 'SMS'
                  ? "We've sent a one-time password via SMS"
                  : "We've sent a one-time password to your email"
            }
          />
          <OtpErrorPopup
            visible={showErrorPopup}
            onClose={handleCloseErrorPopup}
            title="Sending Failed"
            subtitle="We couldn't send the OTP. Please try again shortly."
            showResendButton={true}
            onResend={handleResendOtp}
          />

          {/* OTP Source Selection Modal */}
          <Modal
            visible={showOtpSourceModal}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setShowOtpSourceModal(false)}
          >
            <TouchableOpacity
              style={styles.modalOverlay}
              activeOpacity={1}
              onPress={() => setShowOtpSourceModal(false)}
            >
              <View style={styles.modalContainer}>
                <Typography
                  weight="700"
                  size={15}
                  color={color.placeholderTxt_24282C}
                  style={styles.modalTitle}
                >
                  Get another Code
                </Typography>

                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={() => handleOtpSourceSelect('WHATSAPP')}
                >
                  <View style={styles.optionContent}>
                    <SvgIcons.whatsappBlackIcon width={24} height={24} />
                    <Typography
                      weight="400"
                      size={13}
                      color={color.brown_766F6A}
                      style={styles.optionText}
                    >
                      Send code by whatsapp
                    </Typography>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={() => handleOtpSourceSelect('SMS')}
                >
                  <View style={styles.optionContent}>
                    <SvgIcons.smsBlackIcon width={24} height={24} />
                    <Typography
                      weight="400"
                      size={13}
                      color={color.brown_766F6A}
                      style={styles.optionText}
                    >
                      Send code by text message (sms)
                    </Typography>
                  </View>
                </TouchableOpacity>

                {!isEmail(userIdentifier) && (
                  <TouchableOpacity
                    style={styles.modalOption}
                    onPress={() => handleOtpSourceSelect('EMAIL')}
                  >
                    <View style={styles.optionContent}>
                      <SvgIcons.emailBlackIcon width={24} height={24} />
                      <Typography
                        weight="400"
                        size={13}
                        color={color.brown_766F6A}
                        style={styles.optionText}
                      >
                        Send code by email
                      </Typography>
                    </View>
                  </TouchableOpacity>
                )}
              </View>
            </TouchableOpacity>
          </Modal>
        </View>
      </TouchableWithoutFeedback>
    </LinearGradient>
  );

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  headerSection: {
    marginTop: 40,
    alignItems: 'flex-start',
  },
  title: {
    marginBottom: 12,
  },
  subtitle: {
    lineHeight: 20,
  },
  otpSection: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 40,
    alignItems: 'center',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    minWidth: 300,
    marginBottom: 10,
  },
  otpInput: {
    width: 55,
    height: 50,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: color.borderBrown_CEBCA0,
    textAlign: 'center',
    fontSize: 20,
    color: color.black_544B45,
    backgroundColor: color.white_FFFFFF,
    fontWeight: '700',
  },
  otpInputError: {
    borderColor: color.red_FF3B30,
    borderWidth: 2,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    minWidth: 300,
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',

  },
  resendOtpButton: {
    paddingVertical: 8,
  },
  tryAnotherWay: {
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: color.white_FFFFFF,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginTop: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: color.red_FF0000,
    gap: 10,
    width: '100%',
    minWidth: 300,
  },
  errorText: {
    flex: 1,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    justifyContent: 'center',
    backgroundColor: color.white_FFFFFF,
    borderRadius: 15,
    padding: 20,
    width: '90%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
    position: 'relative',
  },
  modalTitle: {
    marginBottom: 20,
    textAlign: 'center',
  },
  modalOption: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: '100%',
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
  },
  optionText: {
    marginLeft: 15,
    textAlign: 'left',
  },
});

export default OtpLoginScreen;
