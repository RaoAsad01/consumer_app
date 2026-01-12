import React from 'react';
import { Dimensions, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import SvgIcons from '../../components/SvgIcons';
import { color } from '../color/color';
import Typography from './Typography';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
// Base dimensions from design: container 238x240, image 218x130
const BASE_CARD_WIDTH = 164;
const BASE_CARD_HEIGHT = 200; // Taller for destination cards
// Scale factor based on screen width (using 375 as reference for iPhone)
const SCALE_FACTOR = Math.min(SCREEN_WIDTH / 375, 1.2); // Cap scaling at 1.2x
const CARD_WIDTH = BASE_CARD_WIDTH * SCALE_FACTOR;
const CARD_HEIGHT = BASE_CARD_HEIGHT * SCALE_FACTOR;

/**
 * BuzzingCard Component
 * Destination card with image and text overlay
 * 
 * @param {Object} item - Card data object
 * @param {string} item.title - Destination title
 * @param {string} item.location - Destination location
 * @param {string} [item.image] - Optional image URL
 * @param {boolean} [item.showCountryCode] - Optional flag to show country code
 * @param {Function} [onPress] - Optional callback when card is pressed
 * @param {Object} [style] - Optional additional styles for the card container
 */
const BuzzingCard = ({ 
  item, 
  onPress,
  style 
}) => {
  const handleCardPress = () => {
    if (onPress) {
      onPress(item);
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.card, style]} 
      activeOpacity={0.8}
      onPress={handleCardPress}
    >
      <View style={styles.imageContainer}>
        <View style={styles.imageWrapper}>
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
        <View style={styles.textOverlay}>
          <Typography 
            weight="700" 
            size={14} 
            color={color.white_FFFFFF} 
            numberOfLines={1}
            style={styles.cardTitle}
          >
            {item.title}
          </Typography>
          <Typography 
            weight="450" 
            size={12} 
            color={color.white_FFFFFF} 
            style={styles.cardLocation}
          >
            {item.location}{item.showCountryCode ? ', JP' : ''}
          </Typography>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 18,
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  imageWrapper: {
    width: '100%',
    height: '100%',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  textOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  cardTitle: {
    marginBottom: 4,
  },
  cardLocation: {
    marginTop: 0,
  },
});

// Export dimensions for use in other components (e.g., for FlatList itemSeparator)
export { CARD_HEIGHT, CARD_WIDTH };

export default BuzzingCard;

