import { useNavigation } from '@react-navigation/native';
import * as NavigationBar from 'expo-navigation-bar';
import React, { useEffect, useState } from 'react';
import {
    Dimensions,
    FlatList,
    Image,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SvgIcons from '../../components/SvgIcons';
import Typography from '../../components/Typography';
import { getTheme } from '../../constants/themes';
import logger from '../../utils/logger';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ============ Data ============
const CATEGORIES = [
    { id: 'events', label: 'Events' },
    { id: 'nightlife', label: 'Nightlife' },
    { id: 'restaurants', label: 'Restaurants' },
    { id: 'sports', label: 'Sports' },
    { id: 'places', label: 'Places' },
    { id: 'games', label: 'Games' },
    { id: 'movies', label: 'Movies' },
    { id: 'tours', label: 'Tours' },
];

const EVENTS_DATA = [
    {
        id: '1',
        title: 'Q/A Session',
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400',
        date: 'Fri, 05 May 2023',
        time: '7:00pm - 12:00 am',
        location: 'Nishat Mall, Lahore, Punjab',
        price: 25,
        isBookmarked: false,
    },
    {
        id: '2',
        title: 'Girls Meetup',
        image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400',
        date: 'Fri, 05 May 2023',
        time: '7:00pm - 12:00 am',
        location: 'Nishat Mall, Lahore, Punjab',
        price: 25,
        isBookmarked: false,
    },
    {
        id: '3',
        title: 'Tech Conference 2023',
        image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=400',
        date: 'Sat, 12 Aug 2023',
        time: '9:00am - 5:00pm',
        location: 'Hilton Hotel, New York, NY',
        price: 25,
        isBookmarked: false,
    },
    {
        id: '4',
        title: 'Music Festival',
        image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400',
        date: 'Sun, 20 Aug 2023',
        time: '4:00pm - 11:00pm',
        location: 'Central Park, New York, NY',
        price: 50,
        isBookmarked: true,
    },
    {
        id: '5',
        title: 'Art Exhibition',
        image: 'https://images.unsplash.com/photo-1531243269054-5ebf6f34081e?w=400',
        date: 'Mon, 25 Aug 2023',
        time: '10:00am - 6:00pm',
        location: 'Modern Art Museum, LA',
        price: 15,
        isBookmarked: false,
    },
];

const NIGHTLIFE_DATA = [
    {
        id: '1',
        title: 'New Year\'s Eve Gala',
        image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400',
        date: 'Sun, 31 Dec 2023',
        time: '8:00pm - 1:00am',
        location: 'Grand Ballroom, Las Vegas, NV',
        price: 25,
        isBookmarked: false,
    },
    {
        id: '2',
        title: 'New Year\'s Eve Gala',
        image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400',
        date: 'Sun, 31 Dec 2023',
        time: '8:00pm - 1:00am',
        location: 'Grand Ballroom, Las Vegas, NV',
        price: 25,
        isBookmarked: false,
    },
    {
        id: '3',
        title: 'New Year\'s Eve Gala',
        image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400',
        date: 'Sun, 31 Dec 2023',
        time: '8:00pm - 1:00am',
        location: 'Grand Ballroom, Las Vegas, NV',
        price: 25,
        isBookmarked: false,
    },
    {
        id: '4',
        title: 'New Year\'s Eve Gala',
        image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400',
        date: 'Sun, 31 Dec 2023',
        time: '8:00pm - 1:00am',
        location: 'Grand Ballroom, Las Vegas, NV',
        price: 25,
        isBookmarked: false,
    },
    {
        id: '5',
        title: 'New Year\'s Eve Gala',
        image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400',
        date: 'Sun, 31 Dec 2023',
        time: '8:00pm - 1:00am',
        location: 'Grand Ballroom, Las Vegas, NV',
        price: 25,
        isBookmarked: false,
    },
];

// Categories that use dark theme
const DARK_THEME_CATEGORIES = ['nightlife'];

// ============ Components ============

// Header Component
const Header = ({ onBackPress, onSearchPress, theme }) => {
    // Determine if dark theme is active
    const isDarkTheme = theme.statusBarStyle === 'light-content';

    return (
        <View style={[styles.header, { backgroundColor: theme.headerBackground }]}>
            <TouchableOpacity
                onPress={onBackPress}
                style={styles.headerButton}
            >
                {isDarkTheme ? (
                    <SvgIcons.backArrowWhite width={20} height={20} />
                ) : (
                    <SvgIcons.backIcon
                        width={20}
                        height={20}
                        color={theme.titleColor}
                    />
                )}
            </TouchableOpacity>

            <Typography weight="700" size={18} color={theme.titleColor}>
                Hot This Week
            </Typography>

            <TouchableOpacity
                onPress={onSearchPress}
                style={styles.headerButton}
            >
                {isDarkTheme ? (
                    <SvgIcons.seacrhIconWhite width={20} height={20} />
                ) : (
                    <SvgIcons.seacrhIconBrown
                        width={20}
                        height={20}
                        color={theme.titleColor}
                    />
                )}
            </TouchableOpacity>
        </View>
    );
};

// Category Tab Item
const CategoryTab = ({ item, isActive, onPress, theme }) => {
    return (
        <TouchableOpacity
            onPress={() => onPress(item.id)}
            style={styles.categoryTab}
            activeOpacity={0.7}
        >
            <Typography
                weight={isActive ? '600' : '450'}
                size={14}
                color={isActive ? theme.tabActiveColor : theme.tabInactiveColor}
            >
                {item.label}
            </Typography>
            {isActive && (
                <View
                    style={[
                        styles.categoryTabIndicator,
                        { backgroundColor: theme.tabIndicatorColor }
                    ]}
                />
            )}
        </TouchableOpacity>
    );
};

// Category Tabs
const CategoryTabs = ({ activeCategory, onCategoryChange, theme }) => {
    return (
        <View style={[styles.categoryTabsWrapper, { backgroundColor: theme.headerBackground }]}>
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
                        theme={theme}
                    />
                ))}
            </ScrollView>
        </View>
    );
};

// Event Card Component
const EventCard = ({ item, onPress, onBookmarkPress, theme }) => {
    return (
        <TouchableOpacity
            style={[styles.eventCard]}
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
                        color={theme.cardTitleColor}
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
                            <SvgIcons.bookmarkUnselectedIcon
                                width={20}
                                height={20}
                                color={theme.cardTextColor}
                            />
                        )}
                    </TouchableOpacity>
                </View>

                <Typography
                    weight="450"
                    size={12}
                    color={theme.cardTextColor}
                    style={styles.eventDate}
                >
                    {item.date}
                </Typography>

                <Typography
                    weight="450"
                    size={12}
                    color={theme.cardTextColor}
                    style={styles.eventTime}
                >
                    {item.time}
                </Typography>

                <Typography
                    weight="450"
                    size={14}
                    color={theme.cardTextColor}
                    style={styles.eventLocation}
                >
                    {item.location}
                </Typography>

                <View style={styles.eventPriceRow}>
                    <Typography weight="450" size={10} color={theme.cardTextColor}>
                        from{' '}
                    </Typography>
                    <Typography weight="700" size={12} color={theme.cardTextColor}>
                        ${item.price}
                    </Typography>
                </View>
            </View>
        </TouchableOpacity>
    );
};

// ============ Main Screen ============
const HotThisWeekScreen = () => {
    const navigation = useNavigation();
    const [activeCategory, setActiveCategory] = useState('events');
    const [eventsData, setEventsData] = useState(EVENTS_DATA);
    const [nightlifeData, setNightlifeData] = useState(NIGHTLIFE_DATA);

    // Get theme based on active category
    const theme = getTheme(activeCategory, DARK_THEME_CATEGORIES);

    // Apply navigation bar theme when category changes
    useEffect(() => {
        if (Platform.OS === 'android') {
            NavigationBar.setBackgroundColorAsync(theme.navigationBarColor);
            NavigationBar.setButtonStyleAsync(
                theme.statusBarStyle === 'light-content' ? 'light' : 'dark'
            );
        }
    }, [theme]);

    // Get current data based on active category
    const getCurrentData = () => {
        switch (activeCategory) {
            case 'nightlife':
                return nightlifeData;
            case 'events':
            default:
                return eventsData;
        }
    };

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

    const handleEventPress = (event) => {
        logger.debug('Event pressed:', event.title);
    };

    const handleBookmarkPress = (event) => {
        if (activeCategory === 'nightlife') {
            setNightlifeData((prevData) =>
                prevData.map((e) =>
                    e.id === event.id ? { ...e, isBookmarked: !e.isBookmarked } : e
                )
            );
        } else {
            setEventsData((prevData) =>
                prevData.map((e) =>
                    e.id === event.id ? { ...e, isBookmarked: !e.isBookmarked } : e
                )
            );
        }
    };

    const handleExploreMoreEvents = () => {
        navigation?.navigate('ExploreEvents');
    };

    const handleExploreNightlife = () => {
        logger.debug('Explore Nightlife pressed');
        // No navigation - just log for now
    };

    const renderEventCard = ({ item }) => (
        <EventCard
            item={item}
            onPress={handleEventPress}
            onBookmarkPress={handleBookmarkPress}
            theme={theme}
        />
    );

    const renderListFooter = () => (
        <View style={styles.footerContainer}>
            {activeCategory === 'events' && (
                <TouchableOpacity
                    style={[
                        styles.exploreButton,
                        { backgroundColor: theme.buttonBackground }
                    ]}
                    onPress={handleExploreMoreEvents}
                    activeOpacity={0.8}
                >
                    <Text style={[styles.exploreButtonText, { color: theme.buttonTextColor }]}>
                        Explore More Events
                    </Text>
                </TouchableOpacity>
            )}
            
            {activeCategory === 'nightlife' && (
                <TouchableOpacity
                    style={[
                        styles.exploreButton,
                        { backgroundColor: theme.buttonBackground }
                    ]}
                    onPress={handleExploreNightlife}
                    activeOpacity={0.8}
                >
                    <Text style={[styles.exploreButtonText, { color: theme.buttonTextColor }]}>
                        Explore Nightlife
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    );

    return (
        <SafeAreaView
            style={[styles.container, { backgroundColor: theme.backgroundColor }]}
            edges={['top']}
        >
            <StatusBar
                barStyle={theme.statusBarStyle}
                backgroundColor={theme.backgroundColor}
            />

            {/* Header */}
            <Header
                onBackPress={handleBackPress}
                onSearchPress={handleSearchPress}
                theme={theme}
            />

            {/* Category Tabs */}
            <CategoryTabs
                activeCategory={activeCategory}
                onCategoryChange={handleCategoryChange}
                theme={theme}
            />

            {/* Divider */}
            <View style={[styles.divider, { backgroundColor: theme.dividerColor }]} />

            {/* Events List */}
            <FlatList
                data={getCurrentData()}
                renderItem={renderEventCard}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.eventsList}
                showsVerticalScrollIndicator={false}
                ItemSeparatorComponent={() => <View style={styles.eventSeparator} />}
                ListFooterComponent={renderListFooter}
            />
        </SafeAreaView>
    );
};

// ============ Styles ============
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    headerButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Category Tabs
    categoryTabsWrapper: {
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
        borderRadius: 1,
    },

    // Divider
    divider: {
        height: 1,
    },

    // Events List
    eventsList: {
        paddingHorizontal: 24,
        paddingTop: 16,
    },
    eventSeparator: {
        height: 24,
    },

    // Event Card
    eventCard: {
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

    // Footer Container
    footerContainer: {
        paddingTop: 24,
        paddingBottom: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    exploreButton: {
        borderRadius: 25,
        paddingVertical: 14,
        paddingHorizontal: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    exploreButtonText: {
        fontSize: 14,
        fontWeight: '400',
        letterSpacing: 0.3,
    },
});

export default HotThisWeekScreen;
