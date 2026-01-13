import React from 'react';
import { Dimensions, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import SvgIcons from '../../components/SvgIcons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
// Base dimensions from design: container 238x240, image 218x130
const BASE_CARD_WIDTH = 164;
const BASE_CARD_HEIGHT = 200;
const BASE_IMAGE_WIDTH = 164;
const BASE_IMAGE_HEIGHT = 200;
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
 * DealCard Component
 * Deal card with image only (NO text overlay)
 * 
 * @param {Object} item - Card data object
 * @param {string} item.title - Deal title (not displayed, for accessibility)
 * @param {string} item.location - Deal location (not displayed)
 * @param {string} [item.image] - Optional image URL
 * @param {Function} [onPress] - Optional callback when card is pressed
 * @param {Object} [style] - Optional additional styles for the card container
 */
const DealCard = ({ 
  item, 
  onPress,
  style 
}) => {
  // Safety check
  if (!item) {
    return null;
  }

  const handleCardPress = () => {
    if (onPress) {
      onPress(item);
    }
  };

  try {
    return (
    <TouchableOpacity 
      style={[styles.card, style]} 
      activeOpacity={0.8}
      onPress={handleCardPress}
      accessible={true}
      accessibilityLabel={`${item.title} deal in ${item.location}`}
      accessibilityRole="button"
    >
      <View style={styles.imageContainer}>
        {item.image ? (
          <Image 
            source={{ uri: item.image }} 
            style={styles.cardImage}
            resizeMode="cover"
            onError={(error) => {
              console.log('DealCard image load error:', error.nativeEvent.error);
            }}
          />
        ) : (
          <View style={styles.placeholderContainer}>
            <SvgIcons.dummyImageExploreCategory 
              width={CARD_WIDTH} 
              height={CARD_HEIGHT} 
              style={styles.placeholderImage}
            />
          </View>
        )}
      </View>
    </TouchableOpacity>
    );
  } catch (error) {
    console.error('[DealCard] Render error:', error);
    return null;
  }
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0', // Fallback background color
  },
  imageContainer: {
    width: '100%',
    height: '100%',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  placeholderContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  placeholderImage: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});

// Export dimensions for use in other components
export { CARD_HEIGHT, CARD_WIDTH };

export default DealCard;