import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback } from 'react';
import {
    Dimensions,
    Image,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import { color } from '../color/color';
import Typography from './Typography';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HORIZONTAL_PADDING = 20;
const GAP = 12;
const COLUMN_WIDTH = (SCREEN_WIDTH - (HORIZONTAL_PADDING * 2) - GAP) / 2;

// Card height configurations based on design
const CARD_HEIGHTS = {
  small: 104,
  medium: 200,
  large: 200,
  extraLarge: 280,
};

/**
 * CategoryCard Component
 * Individual card for the masonry grid
 */
const CategoryCard = React.memo(({ 
  item, 
  onPress, 
  height = CARD_HEIGHTS.medium,
  style,
  isLast = false,
}) => {
  const handlePress = useCallback(() => {
    if (onPress) {
      onPress(item);
    }
  }, [onPress, item]);

  return (
    <TouchableOpacity
      style={[styles.card, { height }, isLast && styles.cardLast, style]}
      activeOpacity={0.85}
      onPress={handlePress}
    >
      {/* Image or Placeholder */}
      {item?.image ? (
        <Image
          source={{ uri: item.image }}
          style={styles.cardImage}
          resizeMode="cover"
          onError={(error) => {
            console.warn('[CategoryCard] Image load error:', error.nativeEvent?.error);
          }}
        />
      ) : (
        <View style={styles.placeholderContainer} />
      )}
      
      {/* Gradient overlay for better text readability */}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.6)']}
        style={styles.gradient}
      />
      
      {/* Title */}
      <View style={styles.cardContent}>
        <Typography
          weight="700"
          size={16}
          color={color.white_FFFFFF}
          style={styles.cardTitle}
        >
          {item?.title || ''}
        </Typography>
      </View>
    </TouchableOpacity>
  );
});

/**
 * ExploreSectionHomePage Component
 * Masonry-style grid layout for exploring categories (Explore Japan)
 * 
 * @param {string} title - Section title
 * @param {Array} data - Array of category objects with id, title, image
 * @param {Function} onCardPress - Callback when a card is pressed
 * @param {Function} onHeaderPress - Callback when header arrow is pressed
 */
const ExploreSectionHomePage = ({ 
  title = "Explore Japan",
  data = [], 
  onCardPress, 
  onHeaderPress,
}) => {
  
  const handleCardPress = useCallback((item) => {
    if (onCardPress) {
      onCardPress(item);
    }
  }, [onCardPress]);

  const handleHeaderPress = useCallback(() => {
    if (onHeaderPress) {
      onHeaderPress();
    }
  }, [onHeaderPress]);

  // Default data structure matching the design if no data provided
  const defaultData = [
    { id: 'events', title: 'Events', image: null },
    { id: 'activities', title: 'Activities', image: null },
    { id: 'restaurants', title: 'Restaurants', image: null },
    { id: 'services', title: 'Services', image: null },
    { id: 'places', title: 'Places', image: null },
    { id: 'tours', title: 'Tours', image: null },
    { id: 'destinations', title: 'Destinations', image: null },
    { id: 'accommodation', title: 'Accommodation', image: null },
  ];

  const categories = data && data.length > 0 ? data : defaultData;

  // Get category by index safely
  const getCategory = (index) => {
    if (categories && categories[index]) {
      return categories[index];
    }
    return null;
  };

  // Left column cards configuration
  const leftColumnCards = [
    { index: 0, height: CARD_HEIGHTS.small },
    { index: 2, height: CARD_HEIGHTS.medium },
    { index: 4, height: CARD_HEIGHTS.small },
    { index: 6, height: CARD_HEIGHTS.medium, isLast: true },
  ];

  // Right column cards configuration
  const rightColumnCards = [
    { index: 1, height: CARD_HEIGHTS.medium },
    { index: 3, height: CARD_HEIGHTS.small },
    { index: 5, height: CARD_HEIGHTS.large },
    { index: 7, height: CARD_HEIGHTS.small, isLast: true },
  ];

  return (
    <View style={styles.container}>
      {/* Section Header */}
      <View style={styles.sectionHeader}>
        <Typography weight="700" size={18} color={color.placeholderTxt_24282C}>
          {title}
        </Typography>
        {onHeaderPress && (
          <TouchableOpacity 
            style={styles.arrowButton} 
            onPress={handleHeaderPress}
            activeOpacity={0.7}
          >
            <Typography weight="400" size={14} color={color.black_212b34}>
              {'>'}
            </Typography>
          </TouchableOpacity>
        )}
      </View>

      {/* Masonry Grid Layout - Two Columns */}
      <View style={styles.gridContainer}>
        {/* Left Column */}
        <View style={styles.column}>
          {leftColumnCards.map((config) => {
            const category = getCategory(config.index);
            if (!category) return null;
            return (
              <CategoryCard
                key={category.id || `left-${config.index}`}
                item={category}
                height={config.height}
                onPress={handleCardPress}
                isLast={config.isLast}
              />
            );
          })}
        </View>

        {/* Right Column */}
        <View style={styles.columnRight}>
          {rightColumnCards.map((config) => {
            const category = getCategory(config.index);
            if (!category) return null;
            return (
              <CategoryCard
                key={category.id || `right-${config.index}`}
                item={category}
                height={config.height}
                onPress={handleCardPress}
                isLast={config.isLast}
              />
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // No marginBottom - let parent control spacing
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: HORIZONTAL_PADDING,
    marginBottom: 16,
  },
  arrowButton: {
    marginLeft: 8,
    padding: 4,
  },
  gridContainer: {
    flexDirection: 'row',
    paddingHorizontal: HORIZONTAL_PADDING,
  },
  column: {
    flex: 1,
    marginRight: GAP / 2,
  },
  columnRight: {
    flex: 1,
    marginLeft: GAP / 2,
  },
  card: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#3a3a3a',
    marginBottom: GAP,
  },
  cardLast: {
    marginBottom: 0,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  placeholderContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#4a4a4a',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
  },
  cardContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
  },
  cardTitle: {
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});

export default ExploreSectionHomePage;