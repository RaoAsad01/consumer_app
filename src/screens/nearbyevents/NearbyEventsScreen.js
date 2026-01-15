import React, { useCallback, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import SvgIcons from '../../../components/SvgIcons';
import { color } from '../../color/color';
import Typography from '../../components/Typography';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Bottom sheet positions
const SHEET_MIN_HEIGHT = 320;
const SHEET_MAX_HEIGHT = SCREEN_HEIGHT * 0.8;

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

const MAP_MARKERS = [
  { id: '1', price: '$5,482', latitude: 40.6365, longitude: 14.3737 },
  { id: '2', price: '$2,165', latitude: 40.6465, longitude: 14.4037 },
  { id: '3', price: '$19,357', latitude: 40.6365, longitude: 14.4337 },
  { id: '4', price: '$17,103', latitude: 40.6265, longitude: 14.3937 },
  { id: '5', price: '$11,802', latitude: 40.6165, longitude: 14.4037 },
  { id: '6', price: '$5,602', latitude: 40.6165, longitude: 14.4237 },
  { id: '7', price: '$13,538', latitude: 40.6265, longitude: 14.3537 },
  { id: '8', price: '$7,181', latitude: 40.6165, longitude: 14.3537 },
];

const NEARBY_EVENTS = [
  {
    id: '1',
    title: "Women's leadership conference",
    image: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=400',
    date: 'June 10, 2025',
    time: '7:00 PM',
    location: '36 Guild, UK',
    price: 25,
    isBookmarked: true,
  },
  {
    id: '2',
    title: 'International kids safety workshop',
    image: 'https://images.unsplash.com/photo-1544531586-fde5298cdd40?w=400',
    date: 'June 10, 2025',
    time: '7:00 PM',
    location: 'Central Hall, London',
    price: 15,
    isBookmarked: false,
  },
  {
    id: '3',
    title: 'Tech Startup Meetup',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400',
    date: 'June 12, 2025',
    time: '6:00 PM',
    location: 'Innovation Hub, NYC',
    price: 30,
    isBookmarked: false,
  },
  {
    id: '4',
    title: 'Art & Wine Evening',
    image: 'https://images.unsplash.com/photo-1531243269054-5ebf6f34081e?w=400',
    date: 'June 15, 2025',
    time: '8:00 PM',
    location: 'Gallery District, LA',
    price: 45,
    isBookmarked: false,
  },
  {
    id: '5',
    title: 'Yoga in the Park',
    image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=400',
    date: 'June 18, 2025',
    time: '7:00 AM',
    location: 'Central Park, NYC',
    price: 10,
    isBookmarked: true,
  },
  {
    id: '6',
    title: 'Business Networking Night',
    image: 'https://images.unsplash.com/photo-1515169067868-5387ec356754?w=400',
    date: 'June 20, 2025',
    time: '6:30 PM',
    location: 'Downtown Convention Center',
    price: 35,
    isBookmarked: false,
  },
  {
    id: '7',
    title: 'Food & Wine Festival',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400',
    date: 'June 22, 2025',
    time: '12:00 PM',
    location: 'Waterfront Park',
    price: 55,
    isBookmarked: false,
  },
];

// Initial map region (Sorrento, Italy area)
const INITIAL_REGION = {
  latitude: 40.6265,
  longitude: 14.3837,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

// ============ Components ============

// Category Tab
const CategoryTab = ({ item, isActive, onPress }) => (
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

// Price Marker Component
const PriceMarker = ({ price }) => (
  <View style={styles.priceMarker}>
    <Typography weight="600" size={11} color={color.placeholderTxt_24282C}>
      {price}
    </Typography>
  </View>
);

// Event List Item
const EventListItem = ({ item, onPress, onBookmarkPress }) => (
  <TouchableOpacity
    style={styles.eventItem}
    onPress={() => onPress(item)}
    activeOpacity={0.9}
  >
    <View style={styles.eventImageContainer}>
      <Image
        source={{ uri: item.image }}
        style={styles.eventImage}
        resizeMode="cover"
      />
    </View>

    <View style={styles.eventContent}>
      <View style={styles.eventHeader}>
        <Typography weight="400" size={12} color={color.grey_87807C}>
          {item.date} • {item.time}
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
        weight="600"
        size={15}
        color={color.placeholderTxt_24282C}
        style={styles.eventTitle}
        numberOfLines={2}
      >
        {item.title}
      </Typography>

      <View style={styles.eventFooter}>
        <View style={styles.locationRow}>
          <SvgIcons.locationIcon width={14} height={14} />
          <Typography
            weight="400"
            size={12}
            color={color.grey_87807C}
            style={styles.locationText}
            numberOfLines={1}
          >
            {item.location}
          </Typography>
        </View>

        <View style={styles.priceRow}>
          <Typography weight="400" size={12} color={color.grey_87807C}>
            from{' '}
          </Typography>
          <Typography weight="700" size={16} color={color.btnBrown_AE6F28}>
            ${item.price}
          </Typography>
        </View>
      </View>
    </View>
  </TouchableOpacity>
);

// ============ Main Screen ============
const NearbyEventsScreen = ({ navigation }) => {
  const [activeCategory, setActiveCategory] = useState('events');
  const [searchQuery, setSearchQuery] = useState('');
  const [events, setEvents] = useState(NEARBY_EVENTS);
  const [isSheetExpanded, setIsSheetExpanded] = useState(false);
  const mapRef = useRef(null);
  const flatListRef = useRef(null);

  // Bottom sheet animation
  const translateY = useSharedValue(SCREEN_HEIGHT - SHEET_MIN_HEIGHT);
  const context = useSharedValue({ y: 0 });

  const updateSheetState = useCallback((expanded) => {
    setIsSheetExpanded(expanded);
  }, []);

  const scrollToMyLocation = useCallback(() => {
    mapRef.current?.animateToRegion(INITIAL_REGION, 500);
  }, []);

  const handleCategoryChange = useCallback((categoryId) => {
    setActiveCategory(categoryId);
  }, []);

  const handleEventPress = useCallback((event) => {
    console.log('Event pressed:', event.title);
  }, []);

  const handleBookmarkPress = useCallback((event) => {
    setEvents((prev) =>
      prev.map((e) =>
        e.id === event.id ? { ...e, isBookmarked: !e.isBookmarked } : e
      )
    );
  }, []);

  const handleFilterPress = useCallback(() => {
    console.log('Filter pressed');
  }, []);

  const handleMarkerPress = useCallback((marker) => {
    console.log('Marker pressed:', marker);
  }, []);

  // Pan gesture for bottom sheet - ONLY on handle area
  const panGesture = Gesture.Pan()
    .onStart(() => {
      context.value = { y: translateY.value };
    })
    .onUpdate((event) => {
      const newY = context.value.y + event.translationY;
      const minY = SCREEN_HEIGHT - SHEET_MAX_HEIGHT;
      const maxY = SCREEN_HEIGHT - SHEET_MIN_HEIGHT;
      translateY.value = Math.max(minY, Math.min(maxY, newY));
    })
    .onEnd((event) => {
      const velocity = event.velocityY;
      const midPoint = SCREEN_HEIGHT - (SHEET_MIN_HEIGHT + SHEET_MAX_HEIGHT) / 2;

      if (velocity > 500) {
        // Fast swipe down - collapse
        translateY.value = withSpring(SCREEN_HEIGHT - SHEET_MIN_HEIGHT, {
          damping: 20,
          stiffness: 200,
        });
        runOnJS(updateSheetState)(false);
      } else if (velocity < -500) {
        // Fast swipe up - expand
        translateY.value = withSpring(SCREEN_HEIGHT - SHEET_MAX_HEIGHT, {
          damping: 20,
          stiffness: 200,
        });
        runOnJS(updateSheetState)(true);
      } else {
        // Position based
        if (translateY.value < midPoint) {
          translateY.value = withSpring(SCREEN_HEIGHT - SHEET_MAX_HEIGHT, {
            damping: 20,
            stiffness: 200,
          });
          runOnJS(updateSheetState)(true);
        } else {
          translateY.value = withSpring(SCREEN_HEIGHT - SHEET_MIN_HEIGHT, {
            damping: 20,
            stiffness: 200,
          });
          runOnJS(updateSheetState)(false);
        }
      }
    });

  // Tap gesture to toggle sheet
  const tapGesture = Gesture.Tap().onEnd(() => {
    if (isSheetExpanded) {
      translateY.value = withSpring(SCREEN_HEIGHT - SHEET_MIN_HEIGHT, {
        damping: 20,
        stiffness: 200,
      });
      runOnJS(updateSheetState)(false);
    } else {
      translateY.value = withSpring(SCREEN_HEIGHT - SHEET_MAX_HEIGHT, {
        damping: 20,
        stiffness: 200,
      });
      runOnJS(updateSheetState)(true);
    }
  });

  // Combine gestures for handle
  const combinedGesture = Gesture.Race(panGesture, tapGesture);

  const animatedSheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const renderEventItem = useCallback(
    ({ item }) => (
      <EventListItem
        item={item}
        onPress={handleEventPress}
        onBookmarkPress={handleBookmarkPress}
      />
    ),
    [handleEventPress, handleBookmarkPress]
  );

  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Search Bar */}
      <SafeAreaView edges={['top']} style={styles.searchWrapper}>
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <SvgIcons.seacrhIconBrown width={14} height={14} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for services, events, places"
              placeholderTextColor={color.btnBrown_AE6F28}
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
            />
          </View>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={handleFilterPress}
            activeOpacity={0.7}
          >
            <SvgIcons.filterIconConsumer width={24} height={24} />
          </TouchableOpacity>
        </View>

        {/* Category Tabs */}
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
              onPress={handleCategoryChange}
            />
          ))}
        </ScrollView>
      </SafeAreaView>

      <View style={styles.divider} />

      {/* Map View */}
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={INITIAL_REGION}
          showsUserLocation
          showsMyLocationButton={false}
        >
          {MAP_MARKERS.map((marker) => (
            <Marker
              key={marker.id}
              coordinate={{
                latitude: marker.latitude,
                longitude: marker.longitude,
              }}
              onPress={() => handleMarkerPress(marker)}
            >
              <PriceMarker price={marker.price} />
            </Marker>
          ))}
        </MapView>

        {/* My Location Button */}
        <TouchableOpacity
          style={styles.myLocationButton}
          onPress={scrollToMyLocation}
          activeOpacity={0.8}
        >
          <SvgIcons.mapIcon width={24} height={24} />
        </TouchableOpacity>
      </View>

      {/* Bottom Sheet */}
      <Animated.View style={[styles.bottomSheet, animatedSheetStyle]}>
        {/* Draggable Handle Area - Only this area responds to pan gesture */}
        <GestureDetector gesture={combinedGesture}>
          <View style={styles.sheetHandleArea}>
            <View style={styles.handleBar} />
            {/* Events Count */}
            <View style={styles.eventsCountContainer}>
              <Typography weight="600" size={16} color={color.placeholderTxt_24282C}>
                {events.length} Nearby Events
              </Typography>
            </View>
          </View>
        </GestureDetector>

        {/* Scrollable Events List - Independent scrolling */}
        <FlatList
          ref={flatListRef}
          data={events}
          renderItem={renderEventItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.eventsList}
          showsVerticalScrollIndicator={true}
          ItemSeparatorComponent={() => <View style={styles.eventSeparator} />}
          bounces={true}
          scrollEnabled={true}
          ListFooterComponent={<View style={styles.listFooter} />}
        />
      </Animated.View>
    </GestureHandlerRootView>
  );
};

// ============ Styles ============
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  searchWrapper: {
    backgroundColor: '#FFFFFF',
    zIndex: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: color.lightBrown_FFF6DF || '#FFF6DF',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '400',
    color: '#24282C',
    marginLeft: 12,
  },
  filterButton: {
    width: 48,
    height: 48,
    backgroundColor: color.lightBrown_FFF6DF || '#FFF6DF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryTabsContainer: {
    paddingHorizontal: 16,
    gap: 24,
    paddingBottom: 12,
  },
  categoryTab: {
    paddingVertical: 8,
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
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  myLocationButton: {
    position: 'absolute',
    right: 16,
    top: 16,
    width: 44,
    height: 44,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  priceMarker: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  bottomSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: SHEET_MAX_HEIGHT,
    backgroundColor: color.white_FFFFFF || '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 16,
      },
    }),
  },
  sheetHandleArea: {
    paddingTop: 12,
    paddingBottom: 8,
    alignItems: 'center',
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: '#D9D9D9',
    borderRadius: 2,
    marginBottom: 16,
  },
  eventsCountContainer: {
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  eventsList: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  eventSeparator: {
    height: 16,
  },
  listFooter: {
    height: 200, // Extra padding at the bottom to see all items
  },
  eventItem: {
    flexDirection: 'row',
    backgroundColor: color.white_FFFFFF || '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  eventImageContainer: {
    width: 90,
    height: 90,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F5F5F5',
  },
  eventImage: {
    width: '100%',
    height: '100%',
  },
  eventContent: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  bookmarkButton: {
    padding: 2,
  },
  eventTitle: {
    marginTop: 2,
    marginBottom: 4,
  },
  eventFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationText: {
    marginLeft: 4,
    flex: 1,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default NearbyEventsScreen;