import { useNavigation } from '@react-navigation/native';
import * as NavigationBar from 'expo-navigation-bar';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Platform,
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
    // Set navigation bar color for Splash screen
    if (Platform.OS === 'android') {
      NavigationBar.setBackgroundColorAsync('#F2C86C');
      NavigationBar.setButtonStyleAsync('dark');
    }
  }, []);

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

  const HexalloIcon = SvgIcons.hexalloSvg;
  const ShadowGlowSplash = SvgIcons.shadowGlowSplash;
  const IllustrationSplashImage = SvgIcons.illustrationSplashImage;

  return (
    <View style={styles.container}>
     
      <SafeAreaView style={styles.safeArea}>
        {/* Top Section - Brown Background with Logo and Text */}
        <View style={styles.topSection}>
          <View style={styles.logoContainer}>
            <View style={styles.shadowGlowContainer}>
              <ShadowGlowSplash width="100%" height="100%" />
            </View>
            <View style={styles.logoIconContainer}>
              <HexalloIcon width={80} height={80} />
            </View>
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
    position: 'relative',
    width: '100%',
    height: 200,
  },
  shadowGlowContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 0,
  },
  logoIconContainer: {
    position: 'relative',
    zIndex: 1,
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
    flex: 0.50,
    width,   
    overflow: 'hidden',
  },
  illustration: {
    width: '100%',
    height: '100%',
  },
});

export default SplashScreenComponent;
