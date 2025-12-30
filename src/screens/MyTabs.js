import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useRoute } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import SvgIcons from '../../components/SvgIcons';
import { eventService } from '../api/apiService';
import { color } from '../color/color';
import Typography from '../components/Typography';
import DashboardScreen from '../screens/dashboard';
import { fetchUpdatedScanCount, updateEventInfoScanCount } from '../utils/scanCountUpdater';
import HomeScreen from './CheckIn';
import ManualScan from './ManualScan';
import ProfileScreen from './ProfileScreen';
import Tickets from './Tickets';

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
            console.log('No last event UUID found in storage, fetching user events...');
            // Fallback: fetch user events and use the first available event
            try {
              const staffEventsData = await eventService.fetchStaffEvents();
              const eventsList = staffEventsData?.data;
              
              if (eventsList && eventsList.length > 0) {
                let selectedEvent = null;
                
                // Handle different data structures for ADMIN vs Organizer roles
                if (eventsList[0].events && Array.isArray(eventsList[0].events)) {
                  // For organizer role: eventsList[0] contains {events: [...], staff: "..."}
                  if (eventsList[0].events.length > 0) {
                    selectedEvent = eventsList[0].events[0];
                  }
                } else {
                  // For admin role or direct event structure
                  selectedEvent = eventsList[0];
                }
                
                if (selectedEvent) {
                  const eventUuid = selectedEvent.uuid || selectedEvent.eventUuid;
                  console.log('Using first available event:', eventUuid);
                  
                  // Store this event UUID for future use
                  await SecureStore.setItemAsync('lastSelectedEventUuid', eventUuid);
                  
                  // Fetch event info
                  const eventInfoData = await eventService.fetchEventInfo(eventUuid);
                  
                  const transformedEventInfo = {
                    staff_name: eventInfoData?.data?.staff_name,
                    event_title: eventInfoData?.data?.event_title,
                    cityName: eventInfoData?.data?.location?.city,
                    date: eventInfoData?.data?.start_date,
                    time: eventInfoData?.data?.start_time,
                    userId: eventInfoData?.data?.staff_id,
                    scanCount: eventInfoData?.data?.scan_count,
                    event_uuid: eventInfoData?.data?.location?.uuid,
                    eventUuid: eventUuid
                  };
                  
                  console.log('Fetched fallback event info from backend:', transformedEventInfo);
                  setEventInformation(transformedEventInfo);
                } else {
                  console.log('No events available for user');
                }
              } else {
                console.log('No events found for user');
              }
            } catch (fallbackError) {
              console.error('Error fetching fallback events:', fallbackError);
            }
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
    return (
      <View style={styles.customTabBarContainer}>
        {/* Brown Header Section */}
        <View style={styles.tabBarHeader}>
          <View style={styles.handleBar} />
          <Typography
            weight="600"
            size={16}
            color={color.btnTxt_FFF6DF}
            style={styles.headerText}
          >
            Explore Categories
          </Typography>
        </View>
        
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
      </View>
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
        {() => <DashboardScreen eventInfo={eventInformation} onScanCountUpdate={updateScanCount} onEventChange={handleEventChange} />}
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
  customTabBarContainer: {
    backgroundColor: color.btnBrown_AE6F28,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
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
  },
  handleBar: {
    width: 40,
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    marginBottom: 8,
  },
  headerText: {
    textAlign: 'center',
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
