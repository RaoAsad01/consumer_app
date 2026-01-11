import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text
} from 'react-native';


const HomeScreen = () => {

  return (
    <SafeAreaView style={styles.container}>
      <Text>Mobility</Text>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  }
});

export default HomeScreen;