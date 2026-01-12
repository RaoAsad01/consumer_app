import React from 'react';
import { Dimensions, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import SvgIcons from '../../components/SvgIcons';
import { color } from '../color/color';
import Typography from './Typography';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
// Base dimensions from design: container 238x240, image 218x130
const BASE_CARD_WIDTH = 238;
const BASE_CARD_HEIGHT = 240;
const BASE_IMAGE_WIDTH = 218;
const BASE_IMAGE_HEIGHT = 130;
// Calculate horizontal padding: (238 - 218) / 2 = 10px
const BASE_HORIZONTAL_PADDING = (BASE_CARD_WIDTH - BASE_IMAGE_WIDTH) / 2;
// Scale factor based on screen width (using 375 as reference for iPhone)
const SCALE_FACTOR = Math.min(SCREEN_WIDTH / 375, 1.2); // Cap scaling at 1.2x
const CARD_WIDTH = BASE_CARD_WIDTH * SCALE_FACTOR;
const CARD_HEIGHT = BASE_CARD_HEIGHT * SCALE_FACTOR;
const IMAGE_WIDTH = BASE_IMAGE_WIDTH * SCALE_FACTOR;
const IMAGE_HEIGHT = BASE_IMAGE_HEIGHT * SCALE_FACTOR;
const HORIZONTAL_PADDING = BASE_HORIZONTAL_PADDING * SCALE_FACTOR;

/**
 * EventCard Component
 * 
 * @param {Object} item - Card data object
 * @param {string} item.title - Event title
 * @param {string} item.date - Event date
 * @param {string} item.location - Event location
 * @param {string} item.price - Event price (e.g., "$25")
 * @param {string} [item.image] - Optional image URL
 * @param {Function} [onPress] - Optional callback when card is pressed
 * @param {Function} [onBookmarkPress] - Optional callback when bookmark is pressed
 * @param {Object} [style] - Optional additional styles for the card container
 */
const EventCard = ({ 
  item, 
  onPress, 
  onBookmarkPress,
  style 
}) => {
  const handleCardPress = () => {
    if (onPress) {
      onPress(item);
    }
  };

  const handleBookmarkPress = () => {
    if (onBookmarkPress) {
      onBookmarkPress(item);
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.card, style]} 
      activeOpacity={0.8}
      onPress={handleCardPress}
    >
      <View style={styles.cardImageContainer}>
        <View style={styles.cardImageWrapper}>
          {item.image ? (
            <Image 
              source={{ uri: item.image }} 
              style={styles.cardImage}
              resizeMode="cover"
            />
          ) : (
            <SvgIcons.dummyImageExploreCategory width="100%" height="100%" />
          )}
        </View>
        <TouchableOpacity 
          style={styles.bookmarkButton} 
          activeOpacity={0.8}
          onPress={handleBookmarkPress}
        >
          <SvgIcons.favouriteIconConsumer width={24} height={24} />
        </TouchableOpacity>
      </View>
      <View style={styles.cardContent}>
      <Typography 
          weight="700" 
          size={16} 
          color={color.placeholderTxt_24282C} 
          numberOfLines={1} 
          style={styles.cardTitle}
        >
          {item.title}
        </Typography>
        <Typography 
          weight="450" 
          size={12} 
          color={color.brown_766F6A} 
          style={styles.cardDate}
        >
          {item.date}
        </Typography>
        <View style={styles.cardLocationPriceRow}>
          <Typography 
            weight="450" 
            size={12} 
            color={color.brown_766F6A} 
            style={styles.cardLocation}
          >
            {item.location}
          </Typography>
          <View style={styles.cardPriceContainer}>
            <Typography weight="450" size={10} color={color.grey_9F9996}>
              from{' '}
            </Typography>
            <Typography weight="700" size={16} color={color.btnBrown_AE6F28}>
              {item.price}
            </Typography>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: color.white_FFFFFF,
    borderRadius: 18,
    overflow: 'hidden',
  },
  cardImageContainer: {
    width: '100%',
    height: IMAGE_HEIGHT + 10 * SCALE_FACTOR, // Image height + top padding (10px scaled)
    position: 'relative',
    backgroundColor: color.white_FFFFFF,
    paddingHorizontal: HORIZONTAL_PADDING, // 10px scaled
    paddingTop: 10 * SCALE_FACTOR, // 10px top padding scaled
    paddingBottom: 0,
    justifyContent: 'flex-start',
  },
  cardImageWrapper: {
    width: IMAGE_WIDTH,
    height: IMAGE_HEIGHT,
    borderRadius: 10,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  bookmarkButton: {
    position: 'absolute',
    top: 10 * SCALE_FACTOR + 10, // Top padding + small offset
    right: HORIZONTAL_PADDING + 10, // Right padding + small offset
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  cardContent: {
    padding: 12,
    paddingTop: 8,
    flex: 1,
    justifyContent: 'space-between',
  },
  cardDate: {
    marginTop: 0,
    marginBottom: 8,
  },
  cardTitle: {
    marginBottom: 12,
  },
  cardLocationPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  cardLocation: {
    flex: 1,
    marginRight: 8,
  },
  cardPriceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    paddingRight: 0,
  },
});

// Export dimensions for use in other components (e.g., for FlatList itemSeparator)
export { CARD_HEIGHT, CARD_WIDTH };

export default EventCard;

