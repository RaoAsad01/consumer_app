import React, { useState } from 'react';
import { Dimensions, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import SvgIcons from '../../components/SvgIcons';
import { color } from '../color/color';
import Typography from './Typography';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CONTAINER_PADDING = 20 * 2; // Left + right padding
const FULL_WIDTH = SCREEN_WIDTH - CONTAINER_PADDING;
const EXCLUSIVE_IMAGE_WIDTH = 86;
const EXCLUSIVE_IMAGE_HEIGHT = 90;

/**
 * ExclusiveCard Component
 * Horizontal card layout with image on left and content on right
 */
const ExclusiveCard = ({ item, onPress, onBookmarkPress, isBookmarked, onToggleBookmark }) => {
    const handleCardPress = () => {
        if (onPress) {
            onPress(item);
        }
    };

    const handleBookmarkPress = () => {
        if (onToggleBookmark) {
            onToggleBookmark(item.id);
        }
        if (onBookmarkPress) {
            onBookmarkPress(item);
        }
    };

    return (
        <TouchableOpacity
            style={styles.exclusiveCard}
            activeOpacity={0.8}
            onPress={handleCardPress}
        >
            {/* Image on the left */}
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
            </View>

            {/* Content on the right */}
            <View style={styles.contentContainer}>
                <View style={styles.dateBookmarkRow}>
                    <Typography
                        weight="450"
                        size={12}
                        color={color.brown_766F6A}
                        style={styles.cardDate}
                    >
                        {item.date}
                    </Typography>
                    <TouchableOpacity
                        style={styles.bookmarkButton}
                        activeOpacity={0.8}
                        onPress={handleBookmarkPress}
                    >
                        {isBookmarked ? (
                            <SvgIcons.bookmarkSelectedIcon width={20} height={20} />
                        ) : (
                            <SvgIcons.bookmarkUnselectedIcon width={20} height={20} />
                        )}
                    </TouchableOpacity>
                </View>
                <Typography
                    weight="700"
                    size={16}
                    color={color.placeholderTxt_24282C}
                    numberOfLines={2}
                    style={styles.cardTitle}
                >
                    {item.title}
                </Typography>
                <View style={styles.cardLocationPriceRow}>
                    <Typography
                        weight="450"
                        size={12}
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
 * ExclusiveSection Component
 * Displays event cards in a vertical layout (stacked)
 * 
 * @param {Array} data - Array of card data objects
 * @param {Function} [onCardPress] - Optional callback when a card is pressed
 * @param {Function} [onBookmarkPress] - Optional callback when bookmark is pressed
 * @param {Function} [onHeaderPress] - Optional callback when header arrow is pressed
 */
const ExclusiveSection = ({
    data = [],
    onCardPress,
    onBookmarkPress,
    onHeaderPress
}) => {
    // State to track bookmarked items
    const [bookmarkedItems, setBookmarkedItems] = useState(new Set());

    const handleToggleBookmark = (itemId) => {
        setBookmarkedItems(prev => {
            const newSet = new Set(prev);
            if (newSet.has(itemId)) {
                newSet.delete(itemId);
            } else {
                newSet.add(itemId);
            }
            return newSet;
        });
    };

    return (
        <View style={styles.container}>
            <View style={styles.sectionHeader}>
                <Typography weight="700" size={18} color={color.placeholderTxt_24282C}>
                    Exclusive
                </Typography>
                <TouchableOpacity
                    style={styles.arrowButton}
                    onPress={onHeaderPress}
                    activeOpacity={0.7}
                >
                    <Typography weight="400" size={14} color={color.black_212b34}>
                        {'>'}
                    </Typography>
                </TouchableOpacity>
            </View>

            <View style={styles.cardsContainer}>
                {data.map((item, index) => (
                    <View
                        key={item.id?.toString() || index}
                        style={[
                            styles.cardWrapper,
                            index < data.length - 1 && styles.cardWrapperWithMargin
                        ]}
                    >
                        <ExclusiveCard
                            item={item}
                            onPress={onCardPress}
                            onBookmarkPress={onBookmarkPress}
                            isBookmarked={bookmarkedItems.has(item.id)}
                            onToggleBookmark={handleToggleBookmark}
                        />
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
        paddingHorizontal: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    arrowButton: {
        marginLeft: 8,
    },
    cardsContainer: {
        flexDirection: 'column',
    },
    cardWrapper: {
        width: '100%',
    },
    cardWrapperWithMargin: {
        marginBottom: 16,
    },
    // ExclusiveCard styles
    exclusiveCard: {
        width: '100%',
        backgroundColor: color.white_FFFFFF,
        borderRadius: 18,
        overflow: 'hidden',
        flexDirection: 'row',
        padding: 12,
    },
    imageContainer: {
        width: EXCLUSIVE_IMAGE_WIDTH,
        height: EXCLUSIVE_IMAGE_HEIGHT,
        marginRight: 12,
    },
    imageWrapper: {
        width: EXCLUSIVE_IMAGE_WIDTH,
        height: EXCLUSIVE_IMAGE_HEIGHT,
        borderRadius: 10,
        overflow: 'hidden',
    },
    cardImage: {
        width: '100%',
        height: '100%',
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'space-between',
        paddingVertical: 4,
    },
    dateBookmarkRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    cardDate: {
        flex: 1,
    },
    bookmarkButton: {
        width: 28,
        height: 28,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
    },
    cardTitle: {
        marginBottom: 8,
        flex: 1,
    },
    cardLocationPriceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 4,
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

export default ExclusiveSection;

