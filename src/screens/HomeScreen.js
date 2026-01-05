import React from 'react';
import {
    ScrollView,
    StyleSheet,
    View
} from 'react-native';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Home Page Content - Add your home page content here */}
        <View style={styles.homeContent}>
          {/* You can add banners, featured items, etc. here */}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  homeContent: {
    minHeight: 200,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
});

export default HomeScreen;

