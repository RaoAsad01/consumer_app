import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useRoute } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import { Dimensions, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from 'react-native-reanimated';
import SvgIcons from '../../components/SvgIcons';
import { eventService } from '../api/apiService';
import { color } from '../color/color';
import Typography from '../components/Typography';
import ExploreCategories from '../screens/ExploreCategories';
import { fetchUpdatedScanCount, updateEventInfoScanCount } from '../utils/scanCountUpdater';
import HomeScreen from './CheckIn';
import ConsumerHomeScreen from './HomeScreen';
import ManualScan from './ManualScan';
import ProfileScreen from './ProfileScreen';
import Tickets from './Tickets';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const COLLAPSED_HEIGHT = 120; // Height when collapsed (header + tabs)
const EXPANDED_HEIGHT = SCREEN_HEIGHT * 0.7; // Height when expanded

const Tab = createBottomTabNavigator();

function MyTabs() {
  const route = useRoute();
  const initialEventInfo = route?.params?.eventInfo;
  const [eventInformation, setEventInformation] = useState(initialEventInfo);
  const [isLoadingEventInfo, setIsLoadingEventInfo] = useState(false);

  // Update eventInfo when route params change
  useEffect(() => {
    if (route?.params?.eventInfo) {
      setEventInformation(route.params.eventInfo);
    }
  }, [route?.params?.eventInfo]);

  // Fetch event info if not available (app restart scenario)
  useEffect(() => {
    const fetchEventInfoIfNeeded = async () => {
      if (!eventInformation?.eventUuid) {
        try {
          setIsLoadingEventInfo(true);
          console.log('No eventInfo found, fetching from backend...');
          
          // Try to get the last selected event from secure storage
          const lastEventUuid = await SecureStore.getItemAsync('lastSelectedEventUuid');
          console.log('Retrieved stored UUID:', lastEventUuid);
          
          if (lastEventUuid) {
            console.log('Found last event UUID in storage:', lastEventUuid);
            const eventInfoData = await eventService.fetchEventInfo(lastEventUuid);
            
            const transformedEventInfo = {
              staff_name: eventInfoData?.data?.staff_name,
              event_title: eventInfoData?.data?.event_title,
              cityName: eventInfoData?.data?.location?.city,
              date: eventInfoData?.data?.start_date,
              time: eventInfoData?.data?.start_time,
              userId: eventInfoData?.data?.staff_id,
              scanCount: eventInfoData?.data?.scan_count,
              event_uuid: eventInfoData?.data?.location?.uuid,
              eventUuid: lastEventUuid
            };
            
            console.log('Fetched event info from backend:', transformedEventInfo);
            setEventInformation(transformedEventInfo);
          } else {
            console.log('No last event UUID found in storage. Consumer app does not fetch staff events.');
            // Consumer app: No need to fetch staff events
            // User will need to select an event through the app flow
          }
        } catch (error) {
          console.error('Error fetching event info on app restart:', error);
        } finally {
          setIsLoadingEventInfo(false);
        }
      }
    };

    fetchEventInfoIfNeeded();
  }, []);

  // Function to update scan count
  const updateScanCount = async () => {
    if (!eventInformation?.eventUuid) return;

    try {
      const newScanCount = await fetchUpdatedScanCount(eventInformation.eventUuid);
      if (newScanCount !== null) {
        const updatedEventInfo = updateEventInfoScanCount(eventInformation, newScanCount);
        setEventInformation(updatedEventInfo);
      }
    } catch (error) {
      console.error('Error updating scan count:', error);
    }
  };

  // Function to handle event change from dashboard
  const handleEventChange = async (newEvent) => {
    console.log('Event changed to:', newEvent);
    // Transform the event data to match the expected format
    const transformedEvent = {
      eventUuid: newEvent.uuid,
      event_title: newEvent.title,
      uuid: newEvent.uuid,
      cityName: eventInformation?.cityName || 'Accra',
      date: eventInformation?.date || '28-12-2024',
      time: eventInformation?.time || '7:00 PM',
    };
    
    // Store the new event UUID for app restart scenarios
    try {
      await SecureStore.setItemAsync('lastSelectedEventUuid', newEvent.uuid);
      console.log('Stored new selected event UUID:', newEvent.uuid);
    } catch (error) {
      console.error('Error storing event UUID:', error);
    }
    
    setEventInformation(transformedEvent);
    
    // The dashboard will automatically refresh its data when eventInformation changes
    // because it depends on eventInfo?.eventUuid in the useEffect
  };

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
    const containerHeight = useSharedValue(COLLAPSED_HEIGHT);

    const toggleExpanded = () => {
      const newExpanded = !isExpanded;
      setIsExpanded(newExpanded);
      containerHeight.value = withSpring(newExpanded ? EXPANDED_HEIGHT : COLLAPSED_HEIGHT, {
        damping: 20,
        stiffness: 90,
      });
    };

    const gestureHandler = useAnimatedGestureHandler({
      onStart: (_, ctx) => {
        ctx.startY = containerHeight.value;
      },
      onActive: (event, ctx) => {
        const newHeight = ctx.startY - event.translationY;
        
        if (isExpanded) {
          // When expanded, allow dragging down to collapse
          if (event.translationY > 0) {
            containerHeight.value = Math.max(COLLAPSED_HEIGHT, newHeight);
          }
        } else {
          // When collapsed, allow dragging up to expand
          if (event.translationY < 0) {
            containerHeight.value = Math.min(EXPANDED_HEIGHT, newHeight);
          }
        }
      },
      onEnd: (event) => {
        const threshold = (EXPANDED_HEIGHT + COLLAPSED_HEIGHT) / 2;
        
        if (containerHeight.value > threshold) {
          // Expand
          containerHeight.value = withSpring(EXPANDED_HEIGHT, {
            damping: 20,
            stiffness: 90,
          });
          runOnJS(setIsExpanded)(true);
        } else {
          // Collapse
          containerHeight.value = withSpring(COLLAPSED_HEIGHT, {
            damping: 20,
            stiffness: 90,
          });
          runOnJS(setIsExpanded)(false);
        }
      },
    });

    const animatedContainerStyle = useAnimatedStyle(() => {
      return {
        height: containerHeight.value,
      };
    });

    return (
      <GestureHandlerRootView style={styles.gestureContainer}>
        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View style={[styles.customTabBarContainer, animatedContainerStyle]}>
            {/* Brown Header Section - Touchable to toggle */}
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
            
            {/* Scrollable Categories Section - Only visible when expanded */}
            {isExpanded && (
              <ScrollView
                style={styles.categoriesScrollView}
                contentContainerStyle={styles.categoriesScrollContent}
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled={true}
              >
                <ExploreCategories />
              </ScrollView>
            )}
            
            {/* White Container with Tabs */}
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
          </Animated.View>
        </PanGestureHandler>
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
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.reset({
              index: 0,
              routes: [
                {
                  name: 'Tickets',
                  params: { fromTab: true, eventInfo: eventInformation },
                },
              ],
            });
          },
        })}
      >
        {(props) => <Tickets {...props} eventInfo={eventInformation} onScanCountUpdate={updateScanCount} />}
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
        {() => <HomeScreen eventInfo={eventInformation} onScanCountUpdate={updateScanCount} />}
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
        {() => <ManualScan eventInfo={eventInformation} onScanCountUpdate={updateScanCount} />}
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
    backgroundColor: color.btnBrown_AE6F28,
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
    maxHeight: 38,
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
  categoriesScrollView: {
    maxHeight: 500,
    backgroundColor: '#F5F5F5',
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
