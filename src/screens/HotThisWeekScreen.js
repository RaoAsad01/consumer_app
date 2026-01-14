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
import SvgIcons from '../../components/SvgIcons';
import { color } from '../color/color';
import Typography from '../components/Typography';

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
    {
        id: '6',
        title: 'Q/A Session',
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400',
        date: 'Fri, 05 May 2023',
        time: '7:00pm - 12:00 am',
        location: 'Nishat Mall, Lahore, Punjab',
        price: 25,
        isBookmarked: false,
    },
    {
        id: '7',
        title: 'Girls Meetup',
        image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400',
        date: 'Fri, 05 May 2023',
        time: '7:00pm - 12:00 am',
        location: 'Nishat Mall, Lahore, Punjab',
        price: 25,
        isBookmarked: false,
    },
    {
        id: '8',
        title: 'Tech Conference 2023',
        image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=400',
        date: 'Sat, 12 Aug 2023',
        time: '9:00am - 5:00pm',
        location: 'Hilton Hotel, New York, NY',
        price: 25,
        isBookmarked: false,
    },
    {
        id: '9',
        title: 'Music Festival',
        image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400',
        date: 'Sun, 20 Aug 2023',
        time: '4:00pm - 11:00pm',
        location: 'Central Park, New York, NY',
        price: 50,
        isBookmarked: true,
    },
    {
        id: '10',
        title: 'Art Exhibition',
        image: 'https://images.unsplash.com/photo-1531243269054-5ebf6f34081e?w=400',
        date: 'Mon, 25 Aug 2023',
        time: '10:00am - 6:00pm',
        location: 'Modern Art Museum, LA',
        price: 15,
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
                Hot This Week
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

// ============ Main Screen ============
const HotThisWeekScreen = ({ navigation }) => {
    const [activeCategory, setActiveCategory] = useState('events');
    const [events, setEvents] = useState(EVENTS_DATA);

    const handleBackPress = () => {
        navigation?.goBack();
    };

    const handleSearchPress = () => {
        console.log('Search pressed');
    };

    const handleCategoryChange = (categoryId) => {
        setActiveCategory(categoryId);
        console.log('Category changed:', categoryId);
    };

    const handleEventPress = (event) => {
        console.log('Event pressed:', event.title);
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
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar barStyle="dark-content" backgroundColor={color.white_FFFFFF} />

            {/* Header */}
            <Header onBackPress={handleBackPress} onSearchPress={handleSearchPress} />

            {/* Category Tabs */}
            <CategoryTabs
                activeCategory={activeCategory}
                onCategoryChange={handleCategoryChange}
            />

            {/* Divider */}
            <View style={styles.divider} />

            {/* Events List */}
            <FlatList
                data={events}
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

    // Category Tabs
    categoryTabsWrapper: {
        backgroundColor: color.white_FFFFFF,
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

    // Divider
    divider: {
        height: 1,
        backgroundColor: '#F0F0F0',
    },

    // Events List
    eventsList: {
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: 120,
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

export default HotThisWeekScreen;