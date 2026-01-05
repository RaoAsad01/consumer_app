import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import { StatusBar } from 'expo-status-bar';
import React, { useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SvgIcons from '../../components/SvgIcons';
import { color } from '../color/color';

const { width, height } = Dimensions.get('window');
const IMAGE_HEIGHT = height * 0.50;


const OnboardingScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  const scrollStartX = useRef(0);
  const isNavigating = useRef(false);

  const onboardingData = [
    {
      id: 1,
      title: 'Discover & Book instantly',
      subtitle: 'One stop for all your experiences and plans',
    },
    {
      id: 2,
      title: 'Discover more to do more',
      subtitle: 'find more services that simply everyday life',
    },
  ];

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    if (index !== currentIndex && index >= 0 && index < onboardingData.length) {
      setCurrentIndex(index);
    }
  };

  const handleScrollBeginDrag = (event) => {
    scrollStartX.current = event.nativeEvent.contentOffset.x;
    isNavigating.current = false;
  };

  const handleScrollEndDrag = (event) => {
    // This fires even if scroll doesn't complete (e.g., when at the end)
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    const scrollEndX = event.nativeEvent.contentOffset.x;
    const scrollDirection = scrollEndX - scrollStartX.current;
    const velocity = event.nativeEvent.velocity?.x || 0;
    const maxScroll = width * (onboardingData.length - 1);
    const isAtEnd = scrollEndX >= maxScroll - 5; // Allow small tolerance
    
    // Only navigate if:
    // 1. User is on the last screen (2nd screen, index 1)
    // 2. User is at the end of the scroll (can't scroll further)
    // 3. User is trying to swipe FORWARD (left swipe = negative velocity)
    // 4. NOT swiping backward (right swipe = positive velocity)
    if (index === onboardingData.length - 1 && currentIndex === onboardingData.length - 1 && isAtEnd && !isNavigating.current) {
      // Forward swipe: negative velocity (swiping left to go forward)
      // Backward swipe: positive velocity (swiping right to go back) - DON'T navigate
      // Use velocity as primary indicator since scrollDirection might be 0 at the end
      if (velocity < -0.5) {
        // Strong forward swipe - navigate to Login
        isNavigating.current = true;
        handleGetStarted();
      }
      // If velocity is positive or near zero, don't navigate (user is going back or not swiping)
    }
  };

  const handleScrollEnd = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    const scrollEndX = event.nativeEvent.contentOffset.x;
    const scrollDirection = scrollEndX - scrollStartX.current;
    const maxScroll = width * (onboardingData.length - 1);
    const isAtEnd = scrollEndX >= maxScroll - 5; // Allow small tolerance
    
    // Only navigate if:
    // 1. User is on the last screen (2nd screen, index 1)
    // 2. User is at the end of the scroll
    // 3. User tried to swipe FORWARD (left swipe = negative direction)
    // 4. NOT swiping backward (right swipe = positive direction)
    if (index === onboardingData.length - 1 && currentIndex === onboardingData.length - 1 && isAtEnd && !isNavigating.current) {
      // Forward swipe: negative scrollDirection (swiping left to go forward)
      // Backward swipe: positive scrollDirection (swiping right to go back) - DON'T navigate
      // Only navigate if there's a clear forward swipe attempt
      if (scrollDirection < -30) {
        // Strong forward swipe - navigate to Login
        isNavigating.current = true;
        handleGetStarted();
      }
      // If scrollDirection is positive or near zero, don't navigate
    }
  };

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const index = viewableItems[0].index;
      if (index !== null && index !== currentIndex) {
        setCurrentIndex(index);
      }
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const handleGetStarted = async () => {
    try {
      // Mark that the user has seen the onboarding
      await SecureStore.setItemAsync('hasSeenOnboarding', 'true');
      // Navigate to Login screen
      navigation.replace('Login');
    } catch (error) {
      console.error('Error saving onboarding status:', error);
      // On error, still go to login
      navigation.replace('Login');
    }
  };


  const renderItem = ({ item, index }) => {
    const ImageComponent =
      index === 0
        ? SvgIcons.onboardingImage1
        : SvgIcons.onboardingImage2;


    return (
      <View style={styles.slide}>
        {/* Top Section - Brown Background */}
        <View style={styles.topSection}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.subtitle}>{item.subtitle}</Text>
        </View>

        {/* Bottom Section */}
        <View style={styles.bottomSection}>
          <ImageComponent
            width={width}
            height={IMAGE_HEIGHT}
            preserveAspectRatio="xMidYMid meet"
          />
        </View>

      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar
            style="light"
            backgroundColor="transparent"
            translucent
            hidden={true}
          />
      <SafeAreaView style={styles.safeArea}>
        {/* Progress Bar */}
        <View style={[styles.progressBarContainer, { paddingTop: insets.top + 40 }]}>
          <View style={styles.progressBar}>
            {onboardingData.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.progressBarSegment,
                  index === currentIndex
                    ? styles.progressBarActive
                    : index < currentIndex
                    ? styles.progressBarCompleted
                    : styles.progressBarInactive,
                ]}
              />
            ))}
          </View>
        </View>

        {/* Onboarding Slides */}
        <FlatList
          ref={flatListRef}
          data={onboardingData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          onMomentumScrollEnd={handleScrollEnd}
          onScrollEndDrag={handleScrollEndDrag}
          onScrollBeginDrag={handleScrollBeginDrag}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          getItemLayout={(data, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
        />
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
  progressBarContainer: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  progressBar: {
    height: 4,
    flexDirection: 'row',
  },
  progressBarSegment: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  progressBarActive: {
    backgroundColor: color.brown_3C200A,
  },
  progressBarCompleted: {
    backgroundColor: "#C99152",
  },
  progressBarInactive: {
    backgroundColor: "#C99152",
  },
  slide: {
    width: width,
    flex: 1,
    flexDirection: 'column',
  },
  topSection: {
    flex: 0.65,
    width: width,
    backgroundColor: color.btnBrown_AE6F28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: color.btnTxt_FFF6DF,
    marginBottom: 5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    color: color.btnTxt_FFF6DF,
    textAlign: 'center',
    fontWeight: '400',
    opacity: 0.9,
  },
  /* SVG Section */
  bottomSection: {
    flex: 0.75,
    width,   
    overflow: 'hidden',
  },
});

export default OnboardingScreen;

