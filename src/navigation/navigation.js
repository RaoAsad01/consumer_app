import { useNavigationState } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as NavigationBar from 'expo-navigation-bar';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { Platform, useColorScheme } from 'react-native';
import GetStartedScreen from '../screens/GetStartedScreen';
import HotThisWeekScreen from '../screens/HotThisWeekScreen';
import InitialScreen from '../screens/InitialScreen';
import LoginScreen from '../screens/LoginScreen';
import MyTabs from '../screens/MyTabs';
import OnboardingScreen from '../screens/OnboardingScreen';
import OtpLoginScreen from '../screens/OtpLoginScreen';
import SplashScreenComponent from '../screens/SplashScreen';
import SettingsScreen from '../screens/Tickets';
import NearbyEventsScreen from '../screens/nearbyevents/NearbyEventsScreen';


const Stack = createNativeStackNavigator();

// Brown screens that need brown navigation bar
const brownScreens = ['Initial', 'Login', 'OtpLogin', 'GetStarted'];
// Logged-in screens that need white navigation bar
const loggedInScreens = ['LoggedIn', 'TicketsTab', 'BoxOfficeTab', 'CheckInAllTickets', 'ManualCheckInAllTickets', 'TicketScanned', 'StaffDashboard', 'HotThisWeek'];
const onboardingScreens = ['Splash', 'Onboarding'];


function LoggedInScreen() {
  return <MyTabs />;
}

function Navigation({ route }) {
  const scheme = useColorScheme();
  const routeName = useNavigationState(state => {
    if (!state) return 'Splash'; // Default to Splash since it's the initial route
    const route = state.routes[state.index];
    return route.name;
  });

  useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setBehaviorAsync('overlay-swipe');

      // Determine navigation bar color based on screen type
      if (brownScreens.includes(routeName)) {
        // Brown screens - brown navigation bar
        NavigationBar.setBackgroundColorAsync('#DCC3A4');
        NavigationBar.setButtonStyleAsync('dark');
      } else if (loggedInScreens.includes(routeName)) {
        // Logged-in screens - white navigation bar
        NavigationBar.setBackgroundColorAsync('#fff');
        NavigationBar.setButtonStyleAsync('dark');
      } else if (onboardingScreens.includes(routeName)) {
        // Onboarding screens - yellow navigation bar
        NavigationBar.setBackgroundColorAsync('#F2C86C');
        NavigationBar.setButtonStyleAsync('dark');
      } else {
        // Default - dark navigation bar
        NavigationBar.setBackgroundColorAsync('#281c10');
        NavigationBar.setButtonStyleAsync('light');
      }
    }
  }, [routeName, scheme]);

  return (
    <>
      <StatusBar
        translucent
        backgroundColor="transparent"
        style="dark"
      />
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen
          name="Initial"
          component={InitialScreen}
          options={{
            headerShown: false,
            unmountOnBlur: true,
            animation: 'fade',
          }}
        />
        <Stack.Screen
          name="Splash"
          component={SplashScreenComponent}
          options={{
            headerShown: false,
            unmountOnBlur: true,
            animation: 'fade',
          }}
        />
        <Stack.Screen
          name="Onboarding"
          component={OnboardingScreen}
          options={{
            headerShown: false,
            unmountOnBlur: true,
            animation: 'fade',
          }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            headerShown: false,
            unmountOnBlur: true,
            animation: 'fade',
          }}
        />
        <Stack.Screen
          name="LoggedIn"
          component={LoggedInScreen}
          options={{
            headerShown: false,
            unmountOnBlur: true,
            animation: 'fade',
          }}
        />
        <Stack.Screen
          name="OtpLogin"
          component={OtpLoginScreen}
          options={{
            headerShown: false,
            unmountOnBlur: true,
            animation: 'fade',
          }}
        />
        <Stack.Screen
          name="GetStarted"
          component={GetStartedScreen}
          options={{
            headerShown: false,
            unmountOnBlur: true,
            animation: 'fade',
          }}
        />
        <Stack.Screen
          name="Tickets"
          component={SettingsScreen}
          options={{
            headerShown: false,
            unmountOnBlur: true,
            animation: 'fade',
          }}
        />
        <Stack.Screen
          name="HotThisWeek"
          component={HotThisWeekScreen}
          options={{
            headerShown: false,
            unmountOnBlur: true,
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="NearbyEvents"
          component={NearbyEventsScreen}
          options={{
            headerShown: false,
            unmountOnBlur: true,
            animation: 'slide_from_right',
          }}
        />
      </Stack.Navigator>
    </>
  );
}

export default Navigation;