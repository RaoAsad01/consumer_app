import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import BoxOfficeTab from '../screens/BoxOfficeTab';
import CheckInAllTickets from '../screens/CheckInAllTickets';
import StaffDashboard from '../screens/dashboard/StaffDashboard';
import GetStartedScreen from '../screens/GetStartedScreen';
import InitialScreen from '../screens/InitialScreen';
import LoginScreen from '../screens/LoginScreen';
import ManualCheckInAllTickets from '../screens/ManualcheckInAllTickets';
import MyTabs from '../screens/MyTabs';
import OnboardingScreen from '../screens/OnboardingScreen';
import OtpLoginScreen from '../screens/OtpLoginScreen';
import SplashScreenComponent from '../screens/SplashScreen';
import TicketScanned from '../screens/TicketScanned';
import TicketsTab from '../screens/TicketsTab';

const Stack = createNativeStackNavigator();

function LoggedInScreen() {
  return <MyTabs />;
}

function Navigation({ route }) {
  return (
    <Stack.Navigator initialRouteName="Splash">
      <Stack.Screen 
        name="Initial" 
        component={InitialScreen} 
        options={{ 
          headerShown: false,
          unmountOnBlur: false,
          statusBarHidden: true,
          statusBarStyle: 'light',
          statusBarTranslucent: true,
          animation: 'none'
        }} 
      />
      <Stack.Screen 
        name="Splash" 
        component={SplashScreenComponent} 
        options={{ 
          headerShown: false,
          unmountOnBlur: true,
          statusBarHidden: true,
          statusBarStyle: 'light',
          statusBarTranslucent: true,
          animation: 'fade'
        }} 
      />
      <Stack.Screen 
        name="Onboarding" 
        component={OnboardingScreen} 
        options={{ 
          headerShown: false,
          unmountOnBlur: true,
          statusBarHidden: true,
          statusBarStyle: 'light',
          statusBarTranslucent: true,
          animation: 'fade'
        }} 
      />
      <Stack.Screen 
        name="Login" 
        component={LoginScreen} 
        options={{ 
          headerShown: false, 
          unmountOnBlur: true,
          statusBarHidden: true,
          statusBarStyle: 'light',
          statusBarTranslucent: true,
          animation: 'fade'
        }} 
      />
      <Stack.Screen 
        name="LoggedIn" 
        component={LoggedInScreen} 
        options={{ 
          headerShown: false,
          unmountOnBlur: true,
          statusBarStyle: 'dark',
          statusBarBackgroundColor: 'white',
          statusBarTranslucent: false
        }} 
      />
      <Stack.Screen 
        name="OtpLogin" 
        component={OtpLoginScreen} 
        options={{ 
          headerShown: false,
          unmountOnBlur: true,
          statusBarHidden: true,
          statusBarStyle: 'light',
          statusBarTranslucent: true,
          animation: 'fade'
        }} 
      />
      <Stack.Screen 
        name="GetStarted" 
        component={GetStartedScreen} 
        options={{ 
          headerShown: false,
          unmountOnBlur: true,
          statusBarHidden: true,
          statusBarStyle: 'light',
          statusBarTranslucent: true,
          animation: 'fade'
        }} 
      />
      <Stack.Screen 
        name="TicketsTab" 
        component={TicketsTab} 
        options={{ 
          headerShown: false,
          unmountOnBlur: true,
          statusBarStyle: 'dark',
          statusBarBackgroundColor: 'white',
          statusBarTranslucent: false
        }} 
      />
      <Stack.Screen 
        name="BoxOfficeTab" 
        component={BoxOfficeTab} 
        options={{ 
          headerShown: false,
          unmountOnBlur: false,
          statusBarStyle: 'dark',
          statusBarBackgroundColor: 'white',
          statusBarTranslucent: false
        }} 
      />
      <Stack.Screen 
        name="CheckInAllTickets" 
        component={CheckInAllTickets} 
        options={{ 
          headerShown: false,
          unmountOnBlur: true,
          statusBarStyle: 'dark',
          statusBarBackgroundColor: 'white',
          statusBarTranslucent: false
        }} 
      />
      <Stack.Screen 
        name="ManualCheckInAllTickets" 
        component={ManualCheckInAllTickets} 
        options={{ 
          headerShown: false,
          unmountOnBlur: true,
          statusBarStyle: 'dark',
          statusBarBackgroundColor: 'white',
          statusBarTranslucent: false
        }} 
      />
      <Stack.Screen 
        name="TicketScanned" 
        component={TicketScanned} 
        options={{ 
          headerShown: false,
          unmountOnBlur: true,
          statusBarStyle: 'dark',
          statusBarBackgroundColor: 'white',
          statusBarTranslucent: false
        }} 
      />
      <Stack.Screen 
        name="StaffDashboard" 
        component={StaffDashboard} 
        options={{ 
          headerShown: false,
          unmountOnBlur: true,
          statusBarStyle: 'dark',
          statusBarBackgroundColor: 'white',
          statusBarTranslucent: false
        }} 
      />
    </Stack.Navigator>
  );
}

export default Navigation;