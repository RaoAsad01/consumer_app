import React, { useState } from 'react';
import {
    Dimensions,
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
const CARD_WIDTH = SCREEN_WIDTH * 0.75;
const HORIZONTAL_CARD_WIDTH = SCREEN_WIDTH - 48;

// ============ Data ============
const CATEGORIES = [
    { id: 'all', label: 'All' },
    { id: 'concerts', label: 'Concerts' },
    { id: 'parties', label: 'Parties' },
    { id: 'pageantry', label: 'Pageantry' },
    { id: 'festivals', label: 'Festivals' },
    { id: 'arts', label: 'Arts' },
];

const EVENTS_DATA = [
    {
        id: '1',
        title: 'Networking',
        image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400',
        date: 'Sun, 15 Oct 2023',
        time: '8:00am - 4:00pm',
        location: 'Sunny Meadows, Boulder, CO',
        price: 25,
        isBookmarked: false,
    },
    {
        id: '2',
        title: 'Q/A Session',
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400',
        date: 'Thu, 20 Jul 2023',
        time: '6:00pm - 10:00pm',
        location: 'City Gallery, San Francisco, CA',
        price: 25,
        isBookmarked: false,
    },
    {
        id: '3',
        title: 'Coffee Chat',
        image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400',
        date: 'Sat, 12 Aug 2023',
        time: '9:00am - 5:00pm',
        location: 'Hilton Hotel, New York, NY',
        price: 25,
        isBookmarked: false,
    },
    {
        id: '4',
        title: 'Networking',
        image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=400',
        date: 'Sun, 15 Oct 2023',
        time: '8:00am - 4:00pm',
        location: 'Sunny Meadows, Boulder, CO',
        price: 25,
        isBookmarked: false,
    },
    {
        id: '5',
        title: 'Q/A Session',
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400',
        date: 'Thu, 20 Jul 2023',
        time: '6:00pm - 10:00pm',
        location: 'City Gallery, San Francisco, CA',
        price: 25,
        isBookmarked: false,
    },
    {
        id: '6',
        title: 'Coffee Chat',
        image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400',
        date: 'Sat, 12 Aug 2023',
        time: '9:00am - 5:00pm',
        location: 'Hilton Hotel, New York, NY',
        price: 25,
        isBookmarked: false,
    },
];

const TOP_LOCAL_DESTINATIONS = [
    {
        id: '1',
        title: 'Tokyo',
        image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400',
        eventsCount: 150,
        startDate: 'From Wed. 07 Jan 2026',
        price: 25,
        isBookmarked: false,
    },
    {
        id: '2',
        title: 'New York',
        image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400',
        eventsCount: 200,
        startDate: 'From Mon. 12 Jan 2026',
        price: 30,
        isBookmarked: false,
    },
    {
        id: '3',
        title: 'London',
        image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=400',
        eventsCount: 180,
        startDate: 'From Fri. 15 Jan 2026',
        price: 35,
        isBookmarked: false,
    },
    {
        id: '4',
        title: 'Paris',
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400',
        eventsCount: 120,
        startDate: 'From Sat. 20 Jan 2026',
        price: 40,
        isBookmarked: false,
    },
];

const GLOBAL_EVENTS = [
    {
        id: '1',
        title: 'Coffee Chat',
        image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400',
        date: 'Sat, 12 Aug 2023',
        time: '9:00am - 5:00pm',
        location: 'New York, NY United States',
        price: 25,
        isBookmarked: false,
    },
    {
        id: '2',
        title: 'Tech Summit',
        image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=400',
        date: 'Mon, 15 Sep 2023',
        time: '10:00am - 6:00pm',
        location: 'San Francisco, CA United States',
        price: 50,
        isBookmarked: false,
    },
    {
        id: '3',
        title: 'Music Festival',
        image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400',
        date: 'Fri, 20 Oct 2023',
        time: '4:00pm - 11:00pm',
        location: 'Austin, TX United States',
        price: 75,
        isBookmarked: true,
    },
    {
        id: '4',
        title: 'Art Exhibition',
        image: 'https://images.unsplash.com/photo-1531243269054-5ebf6f34081e?w=400',
        date: 'Sun, 25 Nov 2023',
        time: '11:00am - 7:00pm',
        location: 'Chicago, IL United States',
        price: 20,
        isBookmarked: false,
    },
];

const TOP_GLOBAL_DESTINATIONS = [
    {
        id: '1',
        title: 'Tokyo',
        image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400',
        eventsCount: 150,
        startDate: 'From Wed. 07 Jan 2026',
        price: 25,
        isBookmarked: false,
    },
    {
        id: '2',
        title: 'Dubai',
        image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=400',
        eventsCount: 90,
        startDate: 'From Thu. 10 Jan 2026',
        price: 45,
        isBookmarked: false,
    },
    {
        id: '3',
        title: 'Singapore',
        image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400',
        eventsCount: 110,
        startDate: 'From Sat. 18 Jan 2026',
        price: 38,
        isBookmarked: false,
    },
    {
        id: '4',
        title: 'Sydney',
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400',
        eventsCount: 85,
        startDate: 'From Mon. 22 Jan 2026',
        price: 42,
        isBookmarked: false,
    },
];

// ============ Components ============

// Header Component
const Header = ({ onBackPress, onSearchPress }) => {
    return (
        <View style={styles.header}>
            <TouchableOpacity
                onPress={onBackPress}
                style={styles.headerButton}
                activeOpacity={0.7}
            >
                <SvgIcons.backIcon width={20} height={20} />
            </TouchableOpacity>

            <Typography weight="700" size={18} color={color.brown_3C200A}>
                Explore Events
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

// Section Header Component
const SectionHeader = ({ title, onPress }) => {
    return (
        <TouchableOpacity 
            style={styles.sectionHeader} 
            onPress={onPress}
            activeOpacity={0.7}
        >
            <Typography weight="700" size={18} color={color.placeholderTxt_24282C}>
                {title}
            </Typography>
            <Typography weight="700" size={16} color={color.placeholderTxt_24282C}>
                {' >'}
            </Typography>
        </TouchableOpacity>
    );
};

// Event Card Component (Vertical - for Events section)
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
                    size={14}
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

// Horizontal Event Card Component (for Global Events section)
const HorizontalEventCard = ({ item, onPress, onBookmarkPress }) => {
    return (
        <TouchableOpacity
            style={styles.horizontalEventCard}
            onPress={() => onPress(item)}
            activeOpacity={0.9}
        >
            {/* Event Image */}
            <View style={styles.horizontalEventImageContainer}>
                <Image
                    source={{ uri: item.image }}
                    style={styles.horizontalEventImage}
                    resizeMode="cover"
                />
            </View>

            {/* Event Details */}
            <View style={styles.horizontalEventDetails}>
                <View style={styles.horizontalEventTitleRow}>
                    <Typography
                        weight="700"
                        size={14}
                        color={color.placeholderTxt_24282C}
                        style={styles.horizontalEventTitle}
                        numberOfLines={1}
                    >
                        {item.title}
                    </Typography>
                    <TouchableOpacity
                        onPress={() => onBookmarkPress(item)}
                        style={styles.bookmarkButton}
                        activeOpacity={0.7}
                    >
                        {item.isBookmarked ? (
                            <SvgIcons.bookmarkSelectedIcon width={18} height={18} />
                        ) : (
                            <SvgIcons.bookmarkUnselectedIcon width={18} height={18} />
                        )}
                    </TouchableOpacity>
                </View>

                <Typography
                    weight="450"
                    size={12}
                    color={color.brown_766F6A}
                    style={styles.horizontalEventDate}
                >
                    {item.date}
                </Typography>

                <Typography
                    weight="450"
                    size={12}
                    color={color.brown_766F6A}
                    style={styles.horizontalEventTime}
                >
                    {item.time}
                </Typography>

                <Typography
                    weight="450"
                    size={12}
                    color={color.brown_766F6A}
                    style={styles.horizontalEventLocation}
                    numberOfLines={1}
                >
                    {item.location}
                </Typography>

                <View style={styles.globalEventPriceRow}>
                    <Typography weight="450" size={12} color={color.brown_766F6A} style={styles.fromText}>
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

// Destination Card Component (for Top Local/Global Destinations)
const DestinationCard = ({ item, onPress, onBookmarkPress }) => {
    return (
        <TouchableOpacity
            style={styles.destinationCard}
            onPress={() => onPress(item)}
            activeOpacity={0.9}
        >
            {/* Destination Image */}
            <View style={styles.destinationImageContainer}>
                <Image
                    source={{ uri: item.image }}
                    style={styles.destinationImage}
                    resizeMode="cover"
                />
            </View>

            {/* Destination Details */}
            <View style={styles.destinationDetails}>
                <View style={styles.destinationTitleRow}>
                    <Typography
                        weight="700"
                        size={14}
                        color={color.placeholderTxt_24282C}
                        style={styles.destinationTitle}
                        numberOfLines={1}
                    >
                        {item.title}
                    </Typography>
                    <TouchableOpacity
                        onPress={() => onBookmarkPress(item)}
                        style={styles.bookmarkButton}
                        activeOpacity={0.7}
                    >
                        {item.isBookmarked ? (
                            <SvgIcons.bookmarkSelectedIcon width={18} height={18} />
                        ) : (
                            <SvgIcons.bookmarkUnselectedIcon width={18} height={18} />
                        )}
                    </TouchableOpacity>
                </View>

                <Typography
                    weight="450"
                    size={12}
                    color={color.brown_766F6A}
                    style={styles.destinationEventsCount}
                >
                    {item.eventsCount} Events
                </Typography>

                <Typography
                    weight="450"
                    size={12}
                    color={color.brown_766F6A}
                    style={styles.destinationStartDate}
                >
                    {item.startDate}
                </Typography>

                <View style={styles.globalEventPriceRow}>
                    <Typography weight="450" size={12} color={color.brown_766F6A} style={styles.fromText}>
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

// Horizontal List Section Component
const HorizontalListSection = ({ 
    title, 
    data, 
    onSeeAllPress, 
    renderItem, 
    backgroundColor 
}) => {
    return (
        <View style={[styles.horizontalSection, backgroundColor && { backgroundColor }]}>
            <View style={styles.horizontalSectionHeader}>
                <SectionHeader title={title} onPress={onSeeAllPress} />
            </View>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalListContainer}
            >
                {data.map((item, index) => (
                    <View key={item.id} style={styles.horizontalListItem}>
                        {renderItem(item)}
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

// ============ Main Screen ============
const ExploreEventsScreen = ({ navigation }) => {
    const [activeCategory, setActiveCategory] = useState('all');
    const [events, setEvents] = useState(EVENTS_DATA);
    const [localDestinations, setLocalDestinations] = useState(TOP_LOCAL_DESTINATIONS);
    const [globalEvents, setGlobalEvents] = useState(GLOBAL_EVENTS);
    const [globalDestinations, setGlobalDestinations] = useState(TOP_GLOBAL_DESTINATIONS);

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

    const handleBookmarkPress = (item, listType) => {
        switch (listType) {
            case 'events':
                setEvents((prev) =>
                    prev.map((e) =>
                        e.id === item.id ? { ...e, isBookmarked: !e.isBookmarked } : e
                    )
                );
                break;
            case 'localDestinations':
                setLocalDestinations((prev) =>
                    prev.map((e) =>
                        e.id === item.id ? { ...e, isBookmarked: !e.isBookmarked } : e
                    )
                );
                break;
            case 'globalEvents':
                setGlobalEvents((prev) =>
                    prev.map((e) =>
                        e.id === item.id ? { ...e, isBookmarked: !e.isBookmarked } : e
                    )
                );
                break;
            case 'globalDestinations':
                setGlobalDestinations((prev) =>
                    prev.map((e) =>
                        e.id === item.id ? { ...e, isBookmarked: !e.isBookmarked } : e
                    )
                );
                break;
            default:
                break;
        }
    };

    const handleViewAllEvents = () => {
        navigation?.navigate('ExploreAllEvents');
    };

    const handleViewAllLocalDestinations = () => {
        navigation?.navigate('ExploreLocalGlobalDetailScreen', { screenType: 'TopLocalDestinations' });
    };

    const handleViewAllGlobalEvents = () => {
        navigation?.navigate('ExploreLocalGlobalDetailScreen', { screenType: 'GlobalEvents' });
    };

    const handleViewAllGlobalDestinations = () => {
        navigation?.navigate('ExploreLocalGlobalDetailScreen', { screenType: 'TopGlobalDestinations' });
    };

    const handleDestinationPress = (destination) => {
        logger.debug('Destination pressed:', destination.title);
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar barStyle="dark-content" backgroundColor={color.white_FFFFFF} />

            {/* Header */}
            <Header onBackPress={handleBackPress} onSearchPress={handleSearchPress} />

            {/* Category Tabs */}
            <CategoryTabs
                activeCategory={activeCategory}
                onCategoryChange={handleCategoryChange}
            />

            {/* Main Content ScrollView */}
            <ScrollView
                style={styles.mainScrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.mainScrollContent}
            >
                {/* Events Section */}
                <View style={styles.eventsSection}>
                    <SectionHeader 
                        title="Events" 
                        onPress={handleViewAllEvents}
                    />
                    {events.map((item, index) => (
                        <View key={item.id} style={index < events.length - 1 ? styles.eventItemMargin : null}>
                            <EventCard
                                item={item}
                                onPress={handleEventPress}
                                onBookmarkPress={(item) => handleBookmarkPress(item, 'events')}
                            />
                        </View>
                    ))}
                </View>

                {/* Top Local Destinations Section */}
                <HorizontalListSection
                    title="Top Local Destinations"
                    data={localDestinations}
                    onSeeAllPress={handleViewAllLocalDestinations}
                    backgroundColor={color.btnTxt_FFF6DF || '#FFF6DF'}
                    renderItem={(item) => (
                        <DestinationCard
                            item={item}
                            onPress={handleDestinationPress}
                            onBookmarkPress={(item) => handleBookmarkPress(item, 'localDestinations')}
                        />
                    )}
                />

                {/* Global Events Section */}
                <HorizontalListSection
                    title="Global Events"
                    data={globalEvents}
                    onSeeAllPress={handleViewAllGlobalEvents}
                    renderItem={(item) => (
                        <HorizontalEventCard
                            item={item}
                            onPress={handleEventPress}
                            onBookmarkPress={(item) => handleBookmarkPress(item, 'globalEvents')}
                        />
                    )}
                />

                {/* Top Global Destinations Section */}
                <HorizontalListSection
                    title="Top Global Destinations"
                    data={globalDestinations}
                    onSeeAllPress={handleViewAllGlobalDestinations}
                    backgroundColor={color.btnTxt_FFF6DF || '#FFF6DF'}
                    renderItem={(item) => (
                        <DestinationCard
                            item={item}
                            onPress={handleDestinationPress}
                            onBookmarkPress={(item) => handleBookmarkPress(item, 'globalDestinations')}
                        />
                    )}
                />
            </ScrollView>
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

    // Main ScrollView
    mainScrollView: {
        flex: 1,
    },
    mainScrollContent: {
        paddingBottom: 24,
    },

    // Section Header
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
    },

    // Events Section
    eventsSection: {
        paddingHorizontal: 24,
    },
    eventItemMargin: {
        marginBottom: 24,
    },

    // Event Card (Vertical)
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

    // Horizontal Section
    horizontalSection: {
        paddingVertical: 16,
        marginTop: 8,
        paddingBottom: 32,
    },
    horizontalSectionHeader: {
        paddingHorizontal: 24,
    },
    horizontalListContainer: {
        paddingHorizontal: 24,
        gap: 16,
    },
    horizontalListItem: {
        width: HORIZONTAL_CARD_WIDTH,
    },

    // Horizontal Event Card
    horizontalEventCard: {
        backgroundColor: color.white_FFFFFF,
        borderRadius: 12,
    },
    horizontalEventImageContainer: {
        width: '100%',
        height: 200,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: color.grey_F5F5F5,
    },
    horizontalEventImage: {
        width: '100%',
        height: '100%',
    },
    horizontalEventDetails: {
        paddingTop: 10,
        paddingLeft: 2,
    },
    horizontalEventTitleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 4,
    },
    horizontalEventTitle: {
        flex: 1,
        marginRight: 8,
    },
    horizontalEventDate: {
        marginBottom: 2,
    },
    horizontalEventTime: {
        marginBottom: 2,
    },
    horizontalEventLocation: {
        marginBottom: 6,
    },
    globalEventPriceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
        paddingBottom: 4,
    },
    fromText: {
        lineHeight: 18,
    },

    // Destination Card
    destinationCard: {
        backgroundColor: 'transparent',
    },
    destinationImageContainer: {
        width: '100%',
        height: 200,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: color.grey_F5F5F5,
    },
    destinationImage: {
        width: '100%',
        height: '100%',
    },
    destinationDetails: {
        paddingTop: 10,
        paddingLeft: 2,
    },
    destinationTitleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 4,
    },
    destinationTitle: {
        flex: 1,
        marginRight: 8,
    },
    destinationEventsCount: {
        marginBottom: 2,
    },
    destinationStartDate: {
        marginBottom: 6,
    },
});

export default ExploreEventsScreen;