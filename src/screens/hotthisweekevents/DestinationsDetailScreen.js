import { useNavigation, useRoute } from '@react-navigation/native';
import * as NavigationBar from 'expo-navigation-bar';
import React, { useEffect, useState } from 'react';
import {
    Dimensions,
    FlatList,
    Image,
    ImageBackground,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { color } from '../../color/color';
import SvgIcons from '../../components/SvgIcons';
import Typography from '../../components/Typography';
import logger from '../../utils/logger';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const HEADER_HEIGHT = 150;

// ============ Data ============
const CATEGORIES = [
    { id: 'all', label: 'All' },
    { id: 'sports', label: 'Sports' },
    { id: 'parties', label: 'Parties' },
    { id: 'music', label: 'Music' },
    { id: 'dance', label: 'Dance' },
    { id: 'entertainment', label: 'Entertainment' },
];

// Sample destination data
const DESTINATIONS_DATA = {
    tokyo: {
        id: 'tokyo',
        name: 'Tokyo',
        image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt',
    },
    paris: {
        id: 'paris',
        name: 'Paris',
        image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400',
        description: 'Experience the magic of the City of Lights with world-class cuisine, iconic landmarks, and unforgettable cultural experiences.',
    },
    newyork: {
        id: 'newyork',
        name: 'New York',
        image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400',
        description: 'The city that never sleeps offers endless entertainment, dining, and cultural experiences for every traveler.',
    },
    london: {
        id: 'london',
        name: 'London',
        image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800',
        description: 'Discover the perfect blend of historic charm and modern excitement in this iconic British capital.',
    },
};

const EVENTS_DATA = [
    {
        id: '1',
        title: 'Liv North & The Soho DJ',
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400',
        date: 'Thu, 20 Jul 2023',
        time: '6:00pm - 10:00pm',
        location: 'City Gallery, San Francisco, CA',
        price: 25,
        isBookmarked: false,
    },
    {
        id: '2',
        title: 'Liv North & The Soho DJ',
        image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400',
        date: 'Thu, 20 Jul 2023',
        time: '6:00pm - 10:00pm',
        location: 'City Gallery, San Francisco, CA',
        price: 25,
        isBookmarked: false,
    },
    {
        id: '3',
        title: 'Liv North & The Soho DJ',
        image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=400',
        date: 'Thu, 20 Jul 2023',
        time: '6:00pm - 10:00pm',
        location: 'City Gallery, San Francisco, CA',
        price: 25,
        isBookmarked: false,
    },
    {
        id: '4',
        title: 'Liv North & The Soho DJ',
        image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400',
        date: 'Thu, 20 Jul 2023',
        time: '6:00pm - 10:00pm',
        location: 'City Gallery, San Francisco, CA',
        price: 25,
        isBookmarked: false,
    },
    {
        id: '5',
        title: 'Liv North & The Soho DJ',
        image: 'https://images.unsplash.com/photo-1531243269054-5ebf6f34081e?w=400',
        date: 'Thu, 20 Jul 2023',
        time: '6:00pm - 10:00pm',
        location: 'City Gallery, San Francisco, CA',
        price: 25,
        isBookmarked: false,
    },
];

// ============ Components ============

// Header with Image Background
const ImageHeader = ({ destination, onBackPress, onSearchPress, insets }) => {
    return (
        <ImageBackground
            source={{ uri: destination.image }}
            style={[styles.headerBackground, { paddingTop: insets.top }]}
            resizeMode="cover"
        >
            {/* Overlay for better text visibility */}
            <View style={styles.headerOverlay} />

            {/* Navigation Row */}
            <View style={styles.headerNavRow}>
                <TouchableOpacity
                    onPress={onBackPress}
                    style={styles.headerButton}
                    activeOpacity={0.7}
                >
                    <SvgIcons.backArrowWithBg width={24} height={24} />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={onSearchPress}
                    style={styles.headerButton}
                    activeOpacity={0.7}
                >
                    <SvgIcons.searchIconWithBg width={24} height={24} />
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
};

// Info Card Component - Yellow/Cream Background
const InfoCard = ({ destination, onMorePress }) => {
    return (
        <View style={styles.infoCard}>
            <View style={styles.infoCardHeader}>
                <Typography weight="700" size={20} color={color.placeholderTxt_24282C}>
                    {destination.name}
                </Typography>
                <TouchableOpacity
                    onPress={onMorePress}
                    style={styles.moreButton}
                    activeOpacity={0.7}
                >
                    <SvgIcons.moreDotsIcon width={20} height={20} />
                </TouchableOpacity>
            </View>
            <Typography
                weight="400"
                size={12}
                color={color.brown_766F6A}
                style={styles.infoDescription}
                numberOfLines={4}
            >
                {destination.description}
            </Typography>
        </View>
    );
};

// Category Tab Item
const CategoryTab = ({ item, isActive, onPress }) => {
    return (
        <TouchableOpacity
            onPress={() => onPress(item.id)}
            style={[
                styles.categoryTab,
                isActive && styles.categoryTabActive
            ]}
            activeOpacity={0.7}
        >
            <Typography
                weight={isActive ? '600' : '450'}
                size={12}
                color={isActive ? color.white_FFFFFF : color.brown_766F6A}
            >
                {item.label}
            </Typography>
        </TouchableOpacity>
    );
};

// Category Tabs - On White Background
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

// Event Card Component
const EventCard = ({ item, onPress, onBookmarkPress }) => {
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

                <Typography
                    weight="450"
                    size={12}
                    color={color.brown_766F6A}
                    style={styles.eventDate}
                >
                    {item.date}
                </Typography>

                <Typography
                    weight="450"
                    size={12}
                    color={color.brown_766F6A}
                    style={styles.eventTime}
                >
                    {item.time}
                </Typography>

                <Typography
                    weight="450"
                    size={12}
                    color={color.brown_766F6A}
                    style={styles.eventLocation}
                >
                    {item.location}
                </Typography>

                <View style={styles.eventPriceRow}>
                    <Typography weight="450" size={10} color={color.brown_766F6A}>
                        from{' '}
                    </Typography>
                    <Typography weight="700" size={12} color={color.brown_766F6A}>
                        ${item.price}
                    </Typography>
                </View>
            </View>
        </TouchableOpacity>
    );
};

// ============ Main Screen ============
const DestinationsDetailScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const insets = useSafeAreaInsets();

    // Get destination from route params or use default
    const destinationId = route?.params?.destinationId || 'tokyo';
    const destinationType = route?.params?.type || 'local'; // 'local' or 'global'
    const destination = route?.params?.destination || DESTINATIONS_DATA[destinationId] || DESTINATIONS_DATA.tokyo;

    const [activeCategory, setActiveCategory] = useState('all');
    const [events, setEvents] = useState(EVENTS_DATA);

    // Set navigation bar for Android
    useEffect(() => {
        if (Platform.OS === 'android') {
            NavigationBar.setBackgroundColorAsync(color.white_FFFFFF);
            NavigationBar.setButtonStyleAsync('dark');
        }
    }, []);

    const handleBackPress = () => {
        navigation?.goBack();
    };

    const handleSearchPress = () => {
        logger.debug('Search pressed');
    };

    const handleMorePress = () => {
        logger.debug('More pressed');
    };

    const handleCategoryChange = (categoryId) => {
        setActiveCategory(categoryId);
        logger.debug('Category changed:', categoryId);
    };

    const handleEventPress = (event) => {
        logger.debug('Event pressed:', event.title);
        // Navigate to event detail if needed
    };

    const handleBookmarkPress = (event) => {
        setEvents((prevEvents) =>
            prevEvents.map((e) =>
                e.id === event.id ? { ...e, isBookmarked: !e.isBookmarked } : e
            )
        );
    };

    const renderEventCard = ({ item }) => (
        <EventCard
            item={item}
            onPress={handleEventPress}
            onBookmarkPress={handleBookmarkPress}
        />
    );

    return (
        <View style={styles.container}>
            <StatusBar
                barStyle="light-content"
                backgroundColor="transparent"
                translucent
            />

            {/* Fixed Header Section */}
            <View style={styles.fixedHeaderSection}>
                {/* Image Header */}
                <ImageHeader
                    destination={destination}
                    onBackPress={handleBackPress}
                    onSearchPress={handleSearchPress}
                    insets={insets}
                />

                {/* Info Card - Yellow/Cream Background */}
                <InfoCard
                    destination={destination}
                    onMorePress={handleMorePress}
                />

                {/* Category Tabs - White Background */}
                <CategoryTabs
                    activeCategory={activeCategory}
                    onCategoryChange={handleCategoryChange}
                />
            </View>

            {/* Scrollable Events List */}
            <View style={styles.eventsListContainer}>
                <FlatList
                    data={events}
                    renderItem={renderEventCard}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.eventsList}
                    showsVerticalScrollIndicator={false}
                    ItemSeparatorComponent={() => <View style={styles.eventSeparator} />}
                />
            </View>
        </View>
    );
};

// ============ Styles ============
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    // Fixed Header Section (does not scroll)
    fixedHeaderSection: {
        // This section stays fixed at the top
    },

    // Header with Image Background
    headerBackground: {
        width: '100%',
        height: HEADER_HEIGHT,
    },
    headerOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
    },
    headerNavRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 8,
    },
    headerButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Info Card - Yellow/Cream Background
    infoCard: {
        backgroundColor: color.btnTxt_FFF6DF,
        paddingHorizontal: 24,
        paddingTop: 24,
        paddingBottom: 20,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        marginTop: -24,
    },
    infoCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    moreButton: {
        width: 32,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    infoDescription: {
        lineHeight: 20,
    },

    // Category Tabs - White Background, tabs have no individual background
    categoryTabsWrapper: {
        paddingTop: 4,
        paddingBottom: 4,
    },
    categoryTabsContainer: {
        paddingHorizontal: 24,
        gap: 8,
        backgroundColor: color.red_BA1C1,
    },
    categoryTab: {
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    categoryTabActive: {
        backgroundColor: color.btnBrown_AE6F28,
        borderRadius: 8,
    },

    // Events List - Scrollable
    eventsListContainer: {
        flex: 1,
        backgroundColor: color.white_FFFFFF,
    },
    eventsList: {
        paddingTop: 16,
        paddingBottom: 24,
    },
    eventSeparator: {
        height: 24,
    },

    // Event Card
    eventCard: {
        paddingHorizontal: 24,
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
    },
    eventTitle: {
        flex: 1,
        marginRight: 12,
    },
    bookmarkButton: {
        padding: 4,
    },
    eventDate: {
        marginBottom: 2,
    },
    eventTime: {
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

export default DestinationsDetailScreen;
