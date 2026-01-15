import React from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import SvgIcons from '../../components/SvgIcons';
import { color } from '../color/color';
import Typography from './Typography';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Card dimensions
const CARD_WIDTH = SCREEN_WIDTH * 0.85;

/**
 * Deal Item Component - Single deal row
 */
const DealItem = ({ item, onPress }) => {
  if (!item) return null;

  return (
    <TouchableOpacity
      style={styles.dealItem}
      activeOpacity={0.8}
      onPress={() => onPress?.(item)}
    >
      {/* Thumbnail Image */}
      <View style={styles.thumbnailContainer}>
        {item.image ? (
          <Image
            source={{ uri: item.image }}
            style={styles.thumbnailImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.thumbnailPlaceholder}>
            <SvgIcons.dummyImageExploreCategory
              width={70}
              height={70}
            />
          </View>
        )}
      </View>

      {/* Deal Info */}
      <View style={styles.dealInfo}>
        {/* Date & Time */}
        <Typography weight="450" size={12} color={color.grey_87807C}>
          {item.date || 'June 10, 2025'} • {item.time || '7:00 PM'}
        </Typography>

        {/* Title */}
        <Typography
          weight="700"
          size={15}
          color={color.placeholderTxt_24282C}
          numberOfLines={2}
          style={styles.dealTitle}
        >
          {item.title || 'Event Title'}
        </Typography>

        <View style={styles.cardLocationPriceRow}>
          <SvgIcons.locationIcon width={12} height={12} />
          <Typography
            weight="450"
            size={14}
            color={color.brown_766F6A}
            style={styles.cardLocation}
            numberOfLines={1}
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

/**
 * DealCard Component
 * Card containing multiple deal items with a category header
 *
 * @param {Object} props
 * @param {Object} props.item - For backward compatibility (contains title and deals array)
 * @param {string} props.title - Card header title (e.g., "Black Friday Deals")
 * @param {Array} props.deals - Array of deal items to display
 * @param {Function} props.onPress - Callback when a deal item is pressed
 * @param {Function} props.onViewAllPress - Callback when "View All Offers" is pressed
 * @param {Object} props.style - Optional additional styles
 */
const DealCard = ({
  item,
  title,
  deals,
  onPress,
  onViewAllPress,
  style,
}) => {
  // Support both new props and backward compatible item prop
  const cardTitle = title || item?.title || 'Black Friday Deals';
  const cardDeals = deals || item?.deals || [];

  // Default deals if none provided
  const displayDeals = cardDeals.length > 0 ? cardDeals : [
    {
      id: '1',
      title: 'Accra',
      date: 'June 10, 2025',
      time: '7:00 PM',
      location: 'City Hall, London',
      price: '25',
      image: null,
    },
    {
      id: '2',
      title: 'Accra',
      date: 'June 10, 2025',
      time: '7:00 PM',
      location: 'City Hall, London',
      price: '25',
      image: null,
    },
    {
      id: '3',
      title: 'Accra',
      date: 'June 10, 2025',
      time: '7:00 PM',
      location: 'City Hall, London',
      price: '25',
      image: null,
    },
  ];

  const handleDealPress = (deal) => {
    if (onPress) {
      onPress(deal);
    }
  };

  const handleViewAllPress = () => {
    if (onViewAllPress) {
      onViewAllPress(item || { title: cardTitle, deals: displayDeals });
    }
  };

  return (
    <View style={[styles.card, style]}>
      {/* Card Header */}
      <View style={styles.cardHeader}>
        <Typography weight="700" size={18} color={color.placeholderTxt_24282C}>
          {cardTitle}
        </Typography>
      </View>

      {/* Deal Items */}
      <View style={styles.dealsContainer}>
        {displayDeals.slice(0, 3).map((deal, index) => (
          <DealItem key={deal.id || index} item={deal} onPress={handleDealPress} />
        ))}
      </View>

      {/* View All Button */}
      <TouchableOpacity
        style={styles.viewAllButton}
        activeOpacity={0.7}
        onPress={handleViewAllPress}
      >
        <Typography weight="500" size={14} color={color.placeholderTxt_24282C}>
          View All Offers
        </Typography>
        <Typography weight="400" size={14} color={color.black_212b34}>
          {'>'}
        </Typography>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    borderWidth: 0.05,
    paddingVertical: 16,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    marginVertical: 5,
    elevation: 2,
  },
  cardHeader: {
    marginBottom: 6,
  },
  dealsContainer: {
    marginBottom: 16,
    gap: 10,
  },
  dealItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
  },
  thumbnailContainer: {
    width: 70,
    height: 70,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F5F5F5',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  thumbnailPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  dealInfo: {
    flex: 1,
    marginLeft: 12,
  },
  dealTitle: {
    marginVertical: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    marginLeft: 4,
    flex: 1,
  },
  priceContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginLeft: 8,
    flexDirection: 'row',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    backgroundColor: color.selectField_CEBCA0,
    borderRadius: 12,
    gap: 8,
  },
  cardLocationPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  cardLocation: {
    flex: 1,
    marginRight: 8,
  },
  cardPriceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
});

// Export dimensions for use in other components
export { CARD_WIDTH };

export default DealCard;