import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import { Dimensions, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  Extrapolate,
  interpolate,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring
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
const HEADER_HEIGHT = 50; // Fixed header height
const TAB_BAR_HEIGHT = 70; // Fixed tab bar height
const COLLAPSED_HEIGHT = HEADER_HEIGHT + TAB_BAR_HEIGHT; // Total collapsed height
const EXPANDED_HEIGHT = SCREEN_HEIGHT * 0.7; // Height when expanded
const CATEGORIES_MAX_HEIGHT = EXPANDED_HEIGHT - COLLAPSED_HEIGHT; // Available space for categories

const Tab = createBottomTabNavigator();

function MyTabs() {
  const route = useRoute();
  // Tab mapping to new design
  const tabMapping = {
    'Dashboard': { label: 'Explore', icon: SvgIcons.exploreBottomTabIcon, inactiveIcon: SvgIcons.dashboardInactiveIcon },
    'Tickets': { label: 'Services', icon: SvgIcons.ticketActiveTabSvg, inactiveIcon: SvgIcons.servicesInactiveBottomIcon },
    'Check In': { label: 'Mobility', icon: SvgIcons.checkinActiveTabSVG, inactiveIcon: SvgIcons.mobilityInactiveBottomIcon },
    'Manual': { label: 'Marketplace', icon: SvgIcons.manualActiveTabSVG, inactiveIcon: SvgIcons.marketplaceInactiveBottomIcon },
    'Profile': { label: 'More', icon: SvgIcons.profileIconActive, inactiveIcon: SvgIcons.moreInactiveBottomIcon },
  };

  const CustomTabBar = ({ state, descriptors, navigation }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const categoriesHeight = useSharedValue(0);

    const updateExpandedState = (expanded) => {
      setIsExpanded(expanded);
    };

    const toggleExpanded = () => {
      const newExpanded = !isExpanded;
      setIsExpanded(newExpanded); // Update immediately for smooth UI
      categoriesHeight.value = withSpring(newExpanded ? CATEGORIES_MAX_HEIGHT : 0, {
        damping: 25,
        stiffness: 150,
        mass: 0.8,
      });
    };

    const gestureHandler = useAnimatedGestureHandler({
      onStart: (_, ctx) => {
        ctx.startY = categoriesHeight.value;
        ctx.isExpanded = categoriesHeight.value > CATEGORIES_MAX_HEIGHT / 2;
      },
      onActive: (event, ctx) => {
        const newHeight = ctx.startY - event.translationY;

        if (ctx.isExpanded) {
          // When expanded, allow dragging down to collapse
          if (event.translationY > 0) {
            categoriesHeight.value = Math.max(0, newHeight);
          } else {
            // Allow slight bounce back
            categoriesHeight.value = Math.min(CATEGORIES_MAX_HEIGHT, newHeight);
          }
        } else {
          // When collapsed, allow dragging up to expand
          if (event.translationY < 0) {
            categoriesHeight.value = Math.min(CATEGORIES_MAX_HEIGHT, newHeight);
          } else {
            // Prevent negative values
            categoriesHeight.value = Math.max(0, newHeight);
          }
        }
      },
      onEnd: () => {
        const threshold = CATEGORIES_MAX_HEIGHT / 2;
        const shouldExpand = categoriesHeight.value > threshold;

        if (shouldExpand) {
          // Expand
          categoriesHeight.value = withSpring(CATEGORIES_MAX_HEIGHT, {
            damping: 25,
            stiffness: 150,
            mass: 0.8,
          }, () => {
            runOnJS(updateExpandedState)(true);
          });
        } else {
          // Collapse
          categoriesHeight.value = withSpring(0, {
            damping: 25,
            stiffness: 150,
            mass: 0.8,
          }, () => {
            runOnJS(updateExpandedState)(false);
          });
        }
      },
    });

    const animatedCategoriesStyle = useAnimatedStyle(() => {
      const opacity = interpolate(
        categoriesHeight.value,
        [0, 10, CATEGORIES_MAX_HEIGHT],
        [0, 1, 1],
        Extrapolate.CLAMP
      );

      return {
        height: categoriesHeight.value,
        opacity: opacity,
      };
    });

    return (
      <GestureHandlerRootView style={styles.gestureContainer}>
        <View style={styles.customTabBarContainer}>
          {/* Brown Header Section - Touchable to toggle and draggable */}
          <PanGestureHandler onGestureEvent={gestureHandler}>
            <Animated.View>
              <TouchableOpacity
                style={styles.tabBarHeader}
                onPress={toggleExpanded}
                activeOpacity={0.8}
              >
                <View style={styles.handleBar} />
                <Typography
                  weight="600"
                  size={16}
                  color={color.btnTxt_FFF6DF}
                  style={styles.headerText}
                >
                  Explore Categories
                </Typography>
              </TouchableOpacity>
            </Animated.View>
          </PanGestureHandler>

          {/* Scrollable Categories Section - Animated height */}
          {/* <Animated.View style={[styles.categoriesContainer, animatedCategoriesStyle]} pointerEvents={isExpanded ? 'auto' : 'none'}>
            <ScrollView
              style={styles.categoriesScrollView}
              contentContainerStyle={styles.categoriesScrollContent}
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled={true}
              bounces={false}
              scrollEnabled={isExpanded}
            >
              <ExploreCategories />
            </ScrollView>
          </Animated.View> */}

          {/* White Container with Tabs - Fixed at bottom */}
          <View style={styles.tabBarContent}>
            {state.routes.map((route, index) => {
              const { options } = descriptors[route.key];
              const isFocused = state.index === index;
              const tabInfo = tabMapping[route.name] || { label: route.name, icon: null, inactiveIcon: null };

              const onPress = () => {
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
                  {IconComponent && (
                    <IconComponent
                      width={24}
                      height={24}
                    // fill={isFocused ? color.btnBrown_AE6F28 : color.grey_87807C}
                    />
                  )}
                  <Typography
                    weight={isFocused ? "600" : "400"}
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
        options={{
          headerShown: false,
          unmountOnBlur: true,
          statusBarStyle: 'dark',
          statusBarBackgroundColor: 'white',
          statusBarTranslucent: false
        }}
      >
        {() => <ConsumerHomeScreen />}
      </Tab.Screen>

      <Tab.Screen
        name="Tickets"
        options={{
          headerShown: false,
          unmountOnBlur: true,
          statusBarStyle: 'dark',
          statusBarBackgroundColor: 'white',
          statusBarTranslucent: false
        }}
      >
        {() => <Tickets />}
      </Tab.Screen>

      <Tab.Screen
        name="Check In"
        options={{
          headerShown: false,
          unmountOnBlur: true,
          statusBarStyle: 'dark',
          statusBarBackgroundColor: 'white',
          statusBarTranslucent: false
        }}
      >
        {() => <HomeScreen />}
      </Tab.Screen>

      <Tab.Screen
        name="Manual"
        options={{
          headerShown: false,
          unmountOnBlur: true,
          statusBarStyle: 'dark',
          statusBarBackgroundColor: 'white',
          statusBarTranslucent: false
        }}
      >
        {() => <ManualScan />}
      </Tab.Screen>

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerShown: false,
          unmountOnBlur: true,
          statusBarStyle: 'dark',
          statusBarBackgroundColor: 'white',
          statusBarTranslucent: false
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  gestureContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  customTabBarContainer: {
    backgroundColor: 'transparent',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
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
  tabBarHeader: {
    backgroundColor: color.btnBrown_AE6F28,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 8,
    paddingBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: HEADER_HEIGHT,
  },
  handleBar: {
    width: 40,
    height: 3,
    backgroundColor: 'rgba(106, 58, 3, 1)',
    borderRadius: 2,
    marginBottom: 8,
  },
  headerText: {
    textAlign: 'center',
  },
  categoriesContainer: {
    backgroundColor: '#F5F5F5',
    overflow: 'hidden',
  },
  categoriesScrollView: {
    flex: 1,
  },
  categoriesScrollContent: {
    paddingBottom: 20,
  },
  tabBarContent: {
    flexDirection: 'row',
    backgroundColor: color.white_FFFFFF,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 12,
    paddingBottom: Platform.OS === 'ios' ? 20 : 12,
    justifyContent: 'space-around',
    alignItems: 'center',
    minHeight: TAB_BAR_HEIGHT,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  tabLabel: {
    marginTop: 4,
    textAlign: 'center',
  },
});

export default MyTabs;
