import React, { useState } from 'react';
import {
    Dimensions,
    FlatList,
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { color } from '../../color/color';
import SvgIcons from '../../components/SvgIcons';
import Typography from '../../components/Typography';
import logger from '../../utils/logger';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ============ Data ============
const CATEGORIES = [
    { id: 'all', label: 'All' },
    { id: 'concerts', label: 'Concerts' },
    { id: 'parties', label: 'Parties' },
    { id: 'pageantry', label: 'Pageantry' },
    { id: 'festivals', label: 'Festivals' },
    { id: 'arts', label: 'Arts' },
];

const TOP_LOCAL_DESTINATIONS_DATA = [
    {
        id: '1',
        title: 'Coffee Chat',
        description: 'Experience engaging activities and connect with like-minded individuals. Don\'t miss out on this opportunity to learn and grow!.',
        image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400',
        date: 'Sat 12 Jan 2026 - Wed 15 Jan 2026',
        time: '9:00am - 5:00pm',
        location: 'New York, NY United States',
        price: 25,
        isBookmarked: false,
    },
    {
        id: '2',
        title: 'Coffee Chat',
        description: 'Experience engaging activities and connect with like-minded individuals. Don\'t miss out on this opportunity to learn and grow!.',
        image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400',
        date: 'Sat 12 Jan 2026',
        time: '9:00am - 5:00pm',
        location: 'New York, NY United States',
        price: 25,
        isBookmarked: false,
    },
    {
        id: '3',
        title: 'Coffee Chat',
        description: 'Experience engaging activities and connect with like-minded individuals. Don\'t miss out on this opportunity to learn and grow!.',
        image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400',
        date: 'Sat 12 Jan 2026',
        time: '9:00am - 5:00pm',
        location: 'New York, NY United States',
        price: 25,
        isBookmarked: false,
    },
    {
        id: '4',
        title: 'Coffee Chat',
        description: 'Experience engaging activities and connect with like-minded individuals. Don\'t miss out on this opportunity to learn and grow!.',
        image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400',
        date: 'Sat 12 Jan 2026',
        time: '9:00am - 5:00pm',
        location: 'New York, NY United States',
        price: 25,
        isBookmarked: false,
    },
    {
        id: '5',
        title: 'Coffee Chat',
        description: 'Experience engaging activities and connect with like-minded individuals. Don\'t miss out on this opportunity to learn and grow!.',
        image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400',
        date: 'Sat 12 Jan 2026',
        time: '9:00am - 5:00pm',
        location: 'New York, NY United States',
        price: 25,
        isBookmarked: false,
    },
];

const GLOBAL_EVENTS_DATA = [
    {
        id: '1',
        title: 'Coffee Chat',
        description: 'Experience engaging activities and connect with like-minded individuals. Don\'t miss out on this opportunity to learn and grow!.',
        image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400',
        date: 'Sat 12 Jan 2026 - Wed 15 Jan 2026',
        time: '9:00am - 5:00pm',
        location: 'New York, NY United States',
        price: 25,
        isBookmarked: false,
    },
    {
        id: '2',
        title: 'Coffee Chat',
        description: 'Experience engaging activities and connect with like-minded individuals. Don\'t miss out on this opportunity to learn and grow!.',
        image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400',
        date: 'Sat 12 Jan 2026',
        time: '9:00am - 5:00pm',
        location: 'New York, NY United States',
        price: 25,
        isBookmarked: false,
    },
    {
        id: '3',
        title: 'Coffee Chat',
        description: 'Experience engaging activities and connect with like-minded individuals. Don\'t miss out on this opportunity to learn and grow!.',
        image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400',
        date: 'Sat 12 Jan 2026',
        time: '9:00am - 5:00pm',
        location: 'New York, NY United States',
        price: 25,
        isBookmarked: false,
    },
    {
        id: '4',
        title: 'Coffee Chat',
        description: 'Experience engaging activities and connect with like-minded individuals. Don\'t miss out on this opportunity to learn and grow!.',
        image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400',
        date: 'Sat 12 Jan 2026',
        time: '9:00am - 5:00pm',
        location: 'New York, NY United States',
        price: 25,
        isBookmarked: false,
    },
    {
        id: '5',
        title: 'Coffee Chat',
        description: 'Experience engaging activities and connect with like-minded individuals. Don\'t miss out on this opportunity to learn and grow!.',
        image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400',
        date: 'Sat 12 Jan 2026',
        time: '9:00am - 5:00pm',
        location: 'New York, NY United States',
        price: 25,
        isBookmarked: false,
    },
];

const TOP_GLOBAL_DESTINATIONS_DATA = [
    {
        id: '1',
        title: 'Coffee Chat',
        description: 'Experience engaging activities and connect with like-minded individuals. Don\'t miss out on this opportunity to learn and grow!.',
        image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400',
        date: 'Sat 12 Jan 2026 - Wed 15 Jan 2026',
        time: '9:00am - 5:00pm',
        location: 'New York, NY United States',
        price: 25,
        isBookmarked: false,
    },
    {
        id: '2',
        title: 'Coffee Chat',
        description: 'Experience engaging activities and connect with like-minded individuals. Don\'t miss out on this opportunity to learn and grow!.',
        image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400',
        date: 'Sat 12 Jan 2026',
        time: '9:00am - 5:00pm',
        location: 'New York, NY United States',
        price: 25,
        isBookmarked: false,
    },
    {
        id: '3',
        title: 'Coffee Chat',
        description: 'Experience engaging activities and connect with like-minded individuals. Don\'t miss out on this opportunity to learn and grow!.',
        image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400',
        date: 'Sat 12 Jan 2026',
        time: '9:00am - 5:00pm',
        location: 'New York, NY United States',
        price: 25,
        isBookmarked: false,
    },
    {
        id: '4',
        title: 'Coffee Chat',
        description: 'Experience engaging activities and connect with like-minded individuals. Don\'t miss out on this opportunity to learn and grow!.',
        image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400',
        date: 'Sat 12 Jan 2026',
        time: '9:00am - 5:00pm',
        location: 'New York, NY United States',
        price: 25,
        isBookmarked: false,
    },
    {
        id: '5',
        title: 'Coffee Chat',
        description: 'Experience engaging activities and connect with like-minded individuals. Don\'t miss out on this opportunity to learn and grow!.',
        image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400',
        date: 'Sat 12 Jan 2026',
        time: '9:00am - 5:00pm',
        location: 'New York, NY United States',
        price: 25,
        isBookmarked: false,
    },
];

// Screen type configurations
const SCREEN_CONFIG = {
    'TopLocalDestinations': {
        title: 'Explore Top Local Destinations',
        data: TOP_LOCAL_DESTINATIONS_DATA,
    },
    'GlobalEvents': {
        title: 'Explore Global Events',
        data: GLOBAL_EVENTS_DATA,
    },
    'TopGlobalDestinations': {
        title: 'Explore Top Global Destinations',
        data: TOP_GLOBAL_DESTINATIONS_DATA,
    },
};

// ============ Components ============

// Header Component
const Header = ({ title, onBackPress, onSearchPress }) => {
    return (
        <View style={styles.header}>
            <TouchableOpacity
                onPress={onBackPress}
                style={styles.headerButton}
                activeOpacity={0.7}
            >
                <SvgIcons.backIcon width={20} height={20} />
            </TouchableOpacity>

            <Typography weight="700" size={18} color={color.brown_3C200A} style={styles.headerTitle}>
                {title}
            </Typography>

            <TouchableOpacity
                onPress={onSearchPress}
                style={styles.headerButton}
                activeOpacity={0.7}
            >
                <SvgIcons.seacrhIconBrown width={20} height={20} />
            </TouchableOpacity>
        </View>
    );
};

// Category Tab Item
const CategoryTab = ({ item, isActive, onPress }) => {
    return (
        <TouchableOpacity
            onPress={() => onPress(item.id)}
            style={styles.categoryTab}
            activeOpacity={0.7}
        >
            <Typography
                weight={isActive ? '600' : '450'}
                size={14}
                color={isActive ? color.brown_5A2F0E : color.grey_87807C}
            >
                {item.label}
            </Typography>
            {isActive && <View style={styles.categoryTabIndicator} />}
        </TouchableOpacity>
    );
};

// Category Tabs
const CategoryTabs = ({ activeCategory, onCategoryChange }) => {
    return (
        <View style={styles.categoryTabsWrapper}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoryTabsContainer}
            >
                {CATEGORIES.map((category) => (
                    <CategoryTab
                        key={category.id}
                        item={category}
                        isActive={activeCategory === category.id}
                        onPress={onCategoryChange}
                    />
                ))}
            </ScrollView>
        </View>
    );
};

// Detail Event Card Component
const DetailEventCard = ({ item, onPress, onBookmarkPress }) => {
    return (
        <TouchableOpacity
            style={styles.eventCard}
            onPress={() => onPress(item)}
            activeOpacity={0.9}
        >
            {/* Event Image */}
            <View style={styles.eventImageContainer}>
                <Image
                    source={{ uri: item.image }}
                    style={styles.eventImage}
                    resizeMode="cover"
                />
            </View>

            {/* Event Details */}
            <View style={styles.eventDetails}>
                <View style={styles.eventTitleRow}>
                    <Typography
                        weight="700"
                        size={16}
                        color={color.placeholderTxt_24282C}
                        style={styles.eventTitle}
                    >
                        {item.title}
                    </Typography>
                    <TouchableOpacity
                        onPress={() => onBookmarkPress(item)}
                        style={styles.bookmarkButton}
                        activeOpacity={0.7}
                    >
                        {item.isBookmarked ? (
                            <SvgIcons.bookmarkSelectedIcon width={20} height={20} />
                        ) : (
                            <SvgIcons.bookmarkUnselectedIcon width={20} height={20} />
                        )}
                    </TouchableOpacity>
                </View>

                {/* Description */}
                <Typography
                    weight="400"
                    size={12}
                    color={color.brown_766F6A}
                    style={styles.eventDescription}
                    numberOfLines={3}
                >
                    {item.description}
                </Typography>

                {/* Date and Time Row */}
                <View style={styles.dateTimeRow}>
                    <Typography
                        weight="450"
                        size={12}
                        color={color.brown_766F6A}
                    >
                        {item.date}
                    </Typography>
                    <Typography
                        weight="450"
                        size={12}
                        color={color.brown_766F6A}
                    >
                        {'  |  '}
                    </Typography>
                    <Typography
                        weight="450"
                        size={12}
                        color={color.brown_766F6A}
                    >
                        {item.time}
                    </Typography>
                </View>

                {/* Location */}
                <Typography
                    weight="450"
                    size={12}
                    color={color.brown_766F6A}
                    style={styles.eventLocation}
                >
                    {item.location}
                </Typography>

                {/* Price Row */}
                <View style={styles.eventPriceRow}>
                    <Typography weight="450" size={12} color={color.brown_766F6A}>
                        from{' '}
                    </Typography>
                    <Typography weight="700" size={14} color={color.brown_766F6A}>
                        ${item.price}
                    </Typography>
                </View>
            </View>
        </TouchableOpacity>
    );
};

// ============ Main Screen ============
const ExploreLocalGlobalDetailScreen = ({ navigation, route }) => {
    // Get screen type from route params (default to GlobalEvents)
    const screenType = route?.params?.screenType || 'GlobalEvents';
    const config = SCREEN_CONFIG[screenType] || SCREEN_CONFIG['GlobalEvents'];

    const [activeCategory, setActiveCategory] = useState('all');
    const [items, setItems] = useState(config.data);

    const handleBackPress = () => {
        navigation?.goBack();
    };

    const handleSearchPress = () => {
        logger.debug('Search pressed');
    };

    const handleCategoryChange = (categoryId) => {
        setActiveCategory(categoryId);
        logger.debug('Category changed:', categoryId);
    };

    const handleItemPress = (item) => {
        logger.debug('Item pressed:', item.title);
    };

    const handleBookmarkPress = (item) => {
        setItems((prevItems) =>
            prevItems.map((e) =>
                e.id === item.id ? { ...e, isBookmarked: !e.isBookmarked } : e
            )
        );
    };

    const renderEventCard = ({ item }) => (
        <DetailEventCard
            item={item}
            onPress={handleItemPress}
            onBookmarkPress={handleBookmarkPress}
        />
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar barStyle="dark-content" backgroundColor={color.white_FFFFFF} />

            {/* Header */}
            <Header
                title={config.title}
                onBackPress={handleBackPress}
                onSearchPress={handleSearchPress}
            />

            {/* Category Tabs */}
            <CategoryTabs
                activeCategory={activeCategory}
                onCategoryChange={handleCategoryChange}
            />

            {/* Events List */}
            <FlatList
                data={items}
                renderItem={renderEventCard}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.eventsList}
                showsVerticalScrollIndicator={false}
                ItemSeparatorComponent={() => <View style={styles.eventSeparator} />}
            />
        </SafeAreaView>
    );
};

// ============ Styles ============
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: color.white_FFFFFF,
    },

    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: color.white_FFFFFF,
    },
    headerButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        flex: 1,
        textAlign: 'center',
    },

    // Category Tabs
    categoryTabsWrapper: {
        backgroundColor: color.white_FFFFFF,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    categoryTabsContainer: {
        paddingHorizontal: 24,
        gap: 24,
    },
    categoryTab: {
        paddingVertical: 12,
        position: 'relative',
    },
    categoryTabIndicator: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 2,
        backgroundColor: color.brown_5A2F0E,
        borderRadius: 1,
    },

    // Events List
    eventsList: {
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: 24,
    },
    eventSeparator: {
        height: 24,
    },

    // Event Card
    eventCard: {
        backgroundColor: color.white_FFFFFF,
    },
    eventImageContainer: {
        width: '100%',
        height: 200,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#F5F5F5',
    },
    eventImage: {
        width: '100%',
        height: '100%',
    },
    eventDetails: {
        paddingTop: 12,
    },
    eventTitleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 4,
    },
    eventTitle: {
        flex: 1,
        marginRight: 12,
    },
    bookmarkButton: {
        padding: 4,
    },
    eventDescription: {
        marginBottom: 8,
        lineHeight: 18,
        maxWidth: '95%',
    },
    dateTimeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 2,
    },
    eventLocation: {
        marginBottom: 8,
    },
    eventPriceRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});

export default ExploreLocalGlobalDetailScreen;