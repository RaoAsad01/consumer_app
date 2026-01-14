import { NavigationContainer } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import React, { useCallback, useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Navigation from './src/navigation/navigation';

SplashScreen.preventAutoHideAsync().catch(() => {});

function App() {
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    let timeoutId;

    const prepare = async () => {
      try {
        timeoutId = setTimeout(() => {
          setIsAppReady(true);
        }, 5000);
      } catch (error) {
        console.warn('Error during splash delay', error);
        setIsAppReady(true);
      }
    };

    prepare();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  const handleLayout = useCallback(async () => {
    if (isAppReady) {
      await SplashScreen.hideAsync();
    }
  }, [isAppReady]);

  if (!isAppReady) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }} onLayout={handleLayout}>
      <NavigationContainer>
        <Navigation />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

export default App;
