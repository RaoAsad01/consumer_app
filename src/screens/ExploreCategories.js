import React from 'react';
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import SvgIcons from '../../components/SvgIcons';
import { color } from '../color/color';
import Typography from '../components/Typography';

const { width } = Dimensions.get('window');
const NUM_COLUMNS = 4;
const CATEGORY_SIZE = (width - 40 - (NUM_COLUMNS - 1) * 12) / NUM_COLUMNS; // 40 for padding, 12 for gap

const categories = [
  { id: 1, name: 'Events', icon: 'tent' },
  { id: 2, name: 'People', icon: 'person' },
  { id: 3, name: 'Nightlife', icon: 'nightlife' },
  { id: 4, name: 'Restaurants', icon: 'restaurant' },
  { id: 5, name: 'Tours', icon: 'tours' },
  { id: 6, name: 'Sports', icon: 'sports' },
  { id: 7, name: 'Places', icon: 'places' },
  { id: 8, name: 'Movies', icon: 'movies' },
  { id: 9, name: 'Subscriptions', icon: 'subscriptions' },
  { id: 10, name: 'Vouchers', icon: 'vouchers' },
  { id: 11, name: 'Spaces', icon: 'spaces' },
  { id: 12, name: 'Cruise', icon: 'cruise' },
  { id: 13, name: 'Indulge', icon: 'indulge' },
  { id: 14, name: 'Activities', icon: 'activities' },
  { id: 15, name: 'Table', icon: 'table' },
  { id: 16, name: 'Conferences', icon: 'conferences' },
  { id: 17, name: 'Auditions', icon: 'auditions' },
  { id: 18, name: 'Workshops', icon: 'workshops' },
  { id: 19, name: 'World Fairs', icon: 'worldFairs' },
  { id: 20, name: 'Holidays', icon: 'holidays' },
  { id: 21, name: 'Stays', icon: 'stays' },
  { id: 22, name: 'Voting', icon: 'voting' },
  { id: 23, name: 'Virtual Events', icon: 'virtual' },
  { id: 24, name: 'Social Bookings', icon: 'social' },
];

const ExploreCategories = () => {
  const handleCategoryPress = (category) => {
    console.log('Category pressed:', category.name);
    // TODO: Navigate to category screen
  };

  const renderCategoryItem = (item, index) => {
    // For now, using a placeholder icon - you'll need to add actual icons to SvgIcons
    const IconComponent = SvgIcons[item.icon] || SvgIcons.hexalloSvg;
    
    return (
      <TouchableOpacity
        key={item.id}
        style={styles.categoryButton}
        onPress={() => handleCategoryPress(item)}
        activeOpacity={0.7}
      >
        <View style={styles.iconContainer}>
          {IconComponent && (
            <IconComponent
              width={CATEGORY_SIZE * 0.4}
              height={CATEGORY_SIZE * 0.4}
              fill={color.btnBrown_AE6F28}
            />
          )}
        </View>
        <Typography
          weight="400"
          size={11}
          color={color.btnBrown_AE6F28}
          style={styles.categoryLabel}
          numberOfLines={2}
        >
          {item.name}
        </Typography>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Scrollable Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.categoriesGrid}>
          {categories.map((item, index) => renderCategoryItem(item, index))}
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
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryButton: {
    width: CATEGORY_SIZE,
    height: CATEGORY_SIZE + 30, // Extra height for label
    backgroundColor: color.white_FFFFFF,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    paddingVertical: 12,
    paddingHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  iconContainer: {
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  categoryLabel: {
    textAlign: 'center',
    marginTop: 4,
  },
});

export default ExploreCategories;

