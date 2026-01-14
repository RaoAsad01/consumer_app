import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useCallback, useRef, useState } from 'react';
import {
  Dimensions,
  Keyboard,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import SvgIcons from '../../components/SvgIcons';
import { color } from '../color/color';
import Typography from '../components/Typography';
import HomeScreen from './CheckIn';
import ConsumerHomeScreen from './HomeScreen';
import ManualScan from './ManualScan';
import ProfileScreen from './ProfileScreen';
import Tickets from './Tickets';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const HEADER_HEIGHT = 50;
const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 85 : 70;
const CATEGORIES_CONTENT_HEIGHT = SCREEN_HEIGHT * 0.65;
const TOTAL_PANEL_HEIGHT = HEADER_HEIGHT + CATEGORIES_CONTENT_HEIGHT;

const SPRING_CONFIG = {
  damping: 20,
  stiffness: 200,
  mass: 0.5,
};

const Tab = createBottomTabNavigator();

// Category data with icon components directly
const CATEGORIES = [
  { id: 'events', label: 'Events', icon: SvgIcons.eventsCategoryIcon },
  { id: 'people', label: 'People', icon: SvgIcons.peopleCategoryIcon },
  { id: 'nightlife', label: 'Nightlife', icon: SvgIcons.nightlifeCategoryIcon },
  { id: 'restaurants', label: 'Restaurants', icon: SvgIcons.restaurantsCategoryIcon },
  { id: 'tours', label: 'Tours', icon: SvgIcons.toursCategoryIcon },
  { id: 'sports', label: 'Sports', icon: SvgIcons.sportsCategoryIcon },
  { id: 'places', label: 'Places', icon: SvgIcons.placesCategoryIcon },
  { id: 'movies', label: 'Movies', icon: SvgIcons.moviesCategoryIcon },
  { id: 'subs', label: 'Subs', icon: SvgIcons.subsCategoryIcon },
  { id: 'vouchers', label: 'Vouchers', icon: SvgIcons.vouchersCategoryIcon },
  { id: 'spaces', label: 'Spaces', icon: SvgIcons.spacesCategoryIcon },
  { id: 'cruise', label: 'Cruise', icon: SvgIcons.cruiseCategoryIcon },
  { id: 'indulge', label: 'Indulge', icon: SvgIcons.indulgeCategoryIcon },
  { id: 'activities', label: 'Activities', icon: SvgIcons.activitiesCategoryIcon },
  { id: 'table', label: 'Table', icon: SvgIcons.tableCategoryIcon },
  { id: 'conferences', label: 'Confer...', icon: SvgIcons.conferencesCategoryIcon },
  { id: 'auditions', label: 'Auditions', icon: SvgIcons.auditionsCategoryIcon },
  { id: 'workshops', label: 'Worksh...', icon: SvgIcons.workshopsCategoryIcon },
  { id: 'worldFood', label: 'World F...', icon: SvgIcons.worldFairsCategoryIcon },
  { id: 'holidays', label: 'Holidays', icon: SvgIcons.holidaysCategoryIcon },
  { id: 'stays', label: 'Stays', icon: SvgIcons.staysCategoryIcon },
  { id: 'voting', label: 'Voting', icon: SvgIcons.votingCategoryIcon },
  { id: 'virtual', label: 'Virtual...', icon: SvgIcons.virtualEventsCategoryIcon },
  { id: 'socialB', label: 'Social B...', icon: SvgIcons.socialBookingsCategoryIcon },
];

// Category Item Component
const CategoryItem = ({ item, onPress }) => {
  const IconComponent = item.icon;
  
  return (
    <TouchableOpacity
      style={styles.categoryItem}
      onPress={() => onPress?.(item)}
      activeOpacity={0.7}
    >
      <View style={styles.categoryIconContainer}>
        {IconComponent ? (
          <IconComponent width={28} height={28} />
        ) : (
          <View style={styles.categoryIconPlaceholder} />
        )}
      </View>
      <Typography
        weight="500"
        size={12}
        color={color.placeholderTxt_24282C}
        style={styles.categoryLabel}
        numberOfLines={1}
      >
        {item.label}
      </Typography>
    </TouchableOpacity>
  );
};

// Explore Categories Component
const ExploreCategories = ({ onCategoryPress }) => {
  return (
    <View style={styles.categoriesGrid}>
      {CATEGORIES.map((item) => (
        <CategoryItem key={item.id} item={item} onPress={onCategoryPress} />
      ))}
    </View>
  );
};

// Tab mapping
const tabMapping = {
  Dashboard: {
    label: 'Explore',
    icon: SvgIcons.exploreBottomTabIcon,
    inactiveIcon: SvgIcons.exploreInactiveBottomIcon,
  },
  Tickets: {
    label: 'Services',
    icon: SvgIcons.servicesActiveBottomIcon,
    inactiveIcon: SvgIcons.servicesInactiveBottomIcon,
  },
  'Check In': {
    label: 'Mobility',
    icon: SvgIcons.mobilityActiveBottomIcon,
    inactiveIcon: SvgIcons.mobilityInactiveBottomIcon,
  },
  Manual: {
    label: 'Marketplace',
    icon: SvgIcons.marketplaceActiveBottomIcon,
    inactiveIcon: SvgIcons.marketplaceInactiveBottomIcon,
  },
  Profile: {
    label: 'More',
    icon: SvgIcons.moreActiveBottomIcon,
    inactiveIcon: SvgIcons.moreInactiveBottomIcon,
  },
};

// Custom Tab Bar Component
const CustomTabBar = ({ state, descriptors, navigation }) => {
  const translateY = useSharedValue(CATEGORIES_CONTENT_HEIGHT);
  const [isExpanded, setIsExpanded] = useState(false);
  const scrollRef = useRef(null);
  const context = useSharedValue({ startY: 0 });

  const updateExpandedState = useCallback((expanded) => {
    setIsExpanded(expanded);
  }, []);

  const resetScroll = useCallback(() => {
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  }, []);

  const togglePanelJS = useCallback(() => {
    Keyboard.dismiss();
    if (isExpanded) {
      translateY.value = withSpring(CATEGORIES_CONTENT_HEIGHT, SPRING_CONFIG, (finished) => {
        if (finished) {
          runOnJS(updateExpandedState)(false);
        }
      });
      resetScroll();
    } else {
      translateY.value = withSpring(0, SPRING_CONFIG, (finished) => {
        if (finished) {
          runOnJS(updateExpandedState)(true);
        }
      });
    }
  }, [isExpanded]);

  // Pan gesture for swipe
  const panGesture = Gesture.Pan()
    .onStart(() => {
      context.value = { startY: translateY.value };
    })
    .onUpdate((event) => {
      const newValue = context.value.startY + event.translationY;
      translateY.value = Math.max(0, Math.min(CATEGORIES_CONTENT_HEIGHT, newValue));
    })
    .onEnd((event) => {
      const threshold = CATEGORIES_CONTENT_HEIGHT / 3;
      const velocity = event.velocityY;

      if (velocity > 300) {
        // Fast swipe down - collapse
        translateY.value = withSpring(CATEGORIES_CONTENT_HEIGHT, SPRING_CONFIG, (finished) => {
          if (finished) {
            runOnJS(updateExpandedState)(false);
            runOnJS(resetScroll)();
          }
        });
      } else if (velocity < -300) {
        // Fast swipe up - expand
        translateY.value = withSpring(0, SPRING_CONFIG, (finished) => {
          if (finished) {
            runOnJS(updateExpandedState)(true);
          }
        });
      } else {
        // Position based
        if (translateY.value < threshold) {
          translateY.value = withSpring(0, SPRING_CONFIG, (finished) => {
            if (finished) {
              runOnJS(updateExpandedState)(true);
            }
          });
        } else {
          translateY.value = withSpring(CATEGORIES_CONTENT_HEIGHT, SPRING_CONFIG, (finished) => {
            if (finished) {
              runOnJS(updateExpandedState)(false);
              runOnJS(resetScroll)();
            }
          });
        }
      }
    });

  // Tap gesture for click
  const tapGesture = Gesture.Tap()
    .onEnd(() => {
      runOnJS(togglePanelJS)();
    });

  // Combine gestures - pan takes priority, tap is secondary
  const combinedGesture = Gesture.Race(panGesture, tapGesture);

  const animatedPanelStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  // Only animate overlay opacity, NOT the content
  const animatedOverlayStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateY.value,
      [CATEGORIES_CONTENT_HEIGHT, 0],
      [0, 0.5],
      Extrapolation.CLAMP
    );
    return { opacity };
  });

  const handleCategoryPress = useCallback((category) => {
    console.log('Category pressed:', category);
    translateY.value = withSpring(CATEGORIES_CONTENT_HEIGHT, SPRING_CONFIG, (finished) => {
      if (finished) {
        runOnJS(updateExpandedState)(false);
        runOnJS(resetScroll)();
      }
    });
  }, []);

  const handleOverlayPress = useCallback(() => {
    translateY.value = withSpring(CATEGORIES_CONTENT_HEIGHT, SPRING_CONFIG, (finished) => {
      if (finished) {
        runOnJS(updateExpandedState)(false);
        runOnJS(resetScroll)();
      }
    });
  }, []);

  return (
    <GestureHandlerRootView style={styles.gestureRoot}>
      {/* Background overlay */}
      <Animated.View
        style={[styles.overlay, animatedOverlayStyle]}
        pointerEvents={isExpanded ? 'auto' : 'none'}
      >
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          onPress={handleOverlayPress}
          activeOpacity={1}
        />
      </Animated.View>

      {/* Sliding Panel */}
      <Animated.View style={[styles.slidingPanel, animatedPanelStyle]}>
        <View style={styles.panelContainer}>
          {/* Header with combined gesture (swipe + tap) */}
          <GestureDetector gesture={combinedGesture}>
            <Animated.View style={styles.header}>
              <View style={styles.handleBar} />
              <Typography
                weight="600"
                size={16}
                color={color.btnTxt_FFF6DF}
              >
                Explore Categories
              </Typography>
            </Animated.View>
          </GestureDetector>

          {/* Categories Container - FULL OPACITY */}
          <View style={styles.categoriesContainer}>
            <ScrollView
              ref={scrollRef}
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={true}
              bounces={true}
              nestedScrollEnabled={true}
              keyboardShouldPersistTaps="handled"
            >
              <ExploreCategories onCategoryPress={handleCategoryPress} />
            </ScrollView>
          </View>
        </View>
      </Animated.View>

      {/* Fixed Tab Bar - white background */}
      <View style={styles.tabBarContainer}>
        <View style={styles.tabBar}>
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const isFocused = state.index === index;
            const tabInfo = tabMapping[route.name] || {
              label: route.name,
              icon: null,
              inactiveIcon: null,
            };

            const onPress = () => {
              if (isExpanded) {
                translateY.value = withSpring(CATEGORIES_CONTENT_HEIGHT, SPRING_CONFIG, (finished) => {
                  if (finished) {
                    runOnJS(updateExpandedState)(false);
                    runOnJS(resetScroll)();
                  }
                });
              }

              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            const IconComponent = isFocused ? tabInfo.icon : tabInfo.inactiveIcon;

            return (
              <TouchableOpacity
                key={route.key}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
                onPress={onPress}
                style={styles.tabItem}
                activeOpacity={0.7}
              >
                {IconComponent && <IconComponent width={24} height={24} />}
                <Typography
                  weight={isFocused ? '600' : '400'}
                  size={12}
                  color={isFocused ? color.btnBrown_AE6F28 : color.grey_87807C}
                  style={styles.tabLabel}
                >
                  {tabInfo.label}
                </Typography>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </GestureHandlerRootView>
  );
};

function MyTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="Dashboard"
    >
      <Tab.Screen
        name="Dashboard"
        options={{ headerShown: false, unmountOnBlur: true }}
      >
        {() => <ConsumerHomeScreen />}
      </Tab.Screen>

      <Tab.Screen
        name="Tickets"
        options={{ headerShown: false, unmountOnBlur: true }}
      >
        {() => <Tickets />}
      </Tab.Screen>

      <Tab.Screen
        name="Check In"
        options={{ headerShown: false, unmountOnBlur: true }}
      >
        {() => <HomeScreen />}
      </Tab.Screen>

      <Tab.Screen
        name="Manual"
        options={{ headerShown: false, unmountOnBlur: true }}
      >
        {() => <ManualScan />}
      </Tab.Screen>

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ headerShown: false, unmountOnBlur: true }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  gestureRoot: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: 'transparent',
  },
  overlay: {
    position: 'absolute',
    top: -SCREEN_HEIGHT,
    left: 0,
    right: 0,
    bottom: TAB_BAR_HEIGHT,
    backgroundColor: '#000',
  },
  slidingPanel: {
    position: 'absolute',
    bottom: TAB_BAR_HEIGHT,
    left: 0,
    right: 0,
    height: TOTAL_PANEL_HEIGHT,
  },
  panelContainer: {
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
    backgroundColor: color.btnBrown_AE6F28,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 16,
      },
    }),
  },
  header: {
    backgroundColor: color.btnBrown_AE6F28,
    paddingTop: 10,
    paddingBottom: 14,
    alignItems: 'center',
    justifyContent: 'center',
    height: HEADER_HEIGHT,
  },
  handleBar: {
    width: 28,
    height: 3,
    backgroundColor: color.brown_6A3A03,
    borderRadius: 2,
    marginBottom: 8,
  },
  categoriesContainer: {
    flex: 1,
    backgroundColor: color.white_FFFFFF,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 40,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryItem: {
    width: '22%',
    aspectRatio: 1,
    backgroundColor: color.btnTxt_FFF6DF,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  categoryIconContainer: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  categoryIconPlaceholder: {
    width: 28,
    height: 28,
    backgroundColor: color.white_FFFFFF,
    borderRadius: 6,
  },
  categoryLabel: {
    textAlign: 'center',
    paddingHorizontal: 4,
  },
  tabBarContainer: {
    backgroundColor: color.btnBrown_AE6F28,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: color.white_FFFFFF,
    paddingHorizontal: 8,
    paddingTop: 12,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: Platform.OS === 'ios' ? 28 : 12,
    justifyContent: 'space-around',
    alignItems: 'center',
    height: TAB_BAR_HEIGHT,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  tabLabel: {
    marginTop: 4,
    textAlign: 'center',
  },
});

export default MyTabs;