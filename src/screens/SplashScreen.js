import { useNavigation } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import SvgIcons from '../../components/SvgIcons';
import { color } from '../color/color';

const { width, height } = Dimensions.get('window');
const IMAGE_HEIGHT = height * 0.50;

const SplashScreenComponent = () => {
  const navigation = useNavigation();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Hide native splash screen immediately so our custom splash can show
    const hideNativeSplash = async () => {
      try {
        await SplashScreen.hideAsync();
        setIsReady(true);
      } catch (e) {
        console.warn('Error hiding native splash:', e);
        setIsReady(true);
      }
    };

    hideNativeSplash();
  }, []);

  useEffect(() => {
    if (isReady) {
      // Wait 2 seconds then navigate to onboarding screen
      const timer = setTimeout(() => {
        if (navigation) {
          // Navigate to OnboardingScreen
          navigation.replace('Onboarding');
        }
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isReady, navigation]);

  const SplashImageIcon = SvgIcons.splashImageIcon;
  const IllustrationSplashImage = SvgIcons.illustrationSplashImage;

  return (
    <View style={styles.container}>
      <StatusBar
            style="light"
            backgroundColor="transparent"
            translucent
            hidden={true}
          />
      <SafeAreaView style={styles.safeArea}>
        {/* Top Section - Brown Background with Logo and Text */}
        <View style={styles.topSection}>
          <View style={styles.logoContainer}>
            <SplashImageIcon />
          </View>
          <Text style={styles.title}>Hexallo</Text>
          <Text style={styles.tagline}>Seamless Access Memorable Experiences</Text>
        </View>

        {/* Bottom Section - Sandy Yellow with Illustration */}
        <View style={styles.bottomSection}>
          <IllustrationSplashImage 
             width={width}
             height={IMAGE_HEIGHT}
             preserveAspectRatio="xMidYMid meet"
          />
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.btnBrown_AE6F28,
  },
  safeArea: {
    flex: 1,
  },
  topSection: {
    flex: 0.65,
    backgroundColor: color.btnBrown_AE6F28,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: height * 0.1,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: color.btnTxt_FFF6DF,
    marginBottom: 10,
  },
  tagline: {
    fontSize: 12,
    color: color.btnTxt_FFF6DF,
    textAlign: 'center',
    paddingHorizontal: 40,
    fontWeight: '400',
    marginBottom: 30,
  },
  bottomSection: {
    flex: 0.60,
    width,   
    overflow: 'hidden',
  },
  illustration: {
    width: '100%',
    height: '100%',
  },
});

export default SplashScreenComponent;
