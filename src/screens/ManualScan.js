import React from 'react';
import { SafeAreaView, StyleSheet, Text } from 'react-native';

const ManualScan = () => {

  return (
    <SafeAreaView style={styles.container}>
      <Text>Marketplace</Text>
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

export default ManualScan;
