import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import SvgIcons from '../../components/SvgIcons';
import { color } from '../color/color';
import BuzzingCard from '../components/BuzzingCard';
import DealCard from '../components/DealCard';
import EventCard from '../components/EventCard';
import ExclusiveSection from '../components/ExclusiveSection';
import ExploreSectionHomePage from '../components/ExploreSectionHomePage';
import Typography from '../components/Typography';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ============================================
// MOCK DATA - Move outside component to prevent recreation
// ============================================
const createMockCards = (count = 5, prefix = 'event') => {
  return Array.from({ length: count }, (_, i) => ({
    id: `${prefix}-${i + 1}`,
    title: `Namba's Night ${i + 1}`,
    date: 'June 10, 2025 • 7:00 PM',
    location: 'Namba, Osaka',
    price: '$25',
    image: null,
  }));
};

const createDestinationCards = (count = 5) => {
  return Array.from({ length: count }, (_, i) => ({
    id: `dest-${i + 1}`,
    title: i === 0 ? 'Mount Fuji Trip' : 'Shibuya',
    location: i === 0 ? 'Shizuoka' : 'Tokyo',
    image: null,
    showCountryCode: false,
  }));
};

// Blazing Deals data - IDs MUST match the tab IDs in BlazingDealsScreen
const createBlazingDealsData = () => [
  {
    id: 'black-friday',
    title: 'Black Friday Deals',
    deals: [
      { id: '1', title: 'Accra', date: 'June 10, 2025', time: '7:00 PM', location: 'City Hall, London', price: '$25', image: null },
      { id: '2', title: 'Accra', date: 'June 10, 2025', time: '7:00 PM', location: 'City Hall, London', price: '$25', image: null },
      { id: '3', title: 'Accra', date: 'June 10, 2025', time: '7:00 PM', location: 'City Hall, London', price: '$25', image: null },
    ],
  },
  {
    id: 'cyber-monday',
    title: 'Cyber Monday',
    deals: [
      { id: '1', title: 'Lagos', date: 'June 12, 2025', time: '8:00 PM', location: 'Event Center, Lagos', price: '$30', image: null },
      { id: '2', title: 'Lagos', date: 'June 12, 2025', time: '8:00 PM', location: 'Event Center, Lagos', price: '$30', image: null },
      { id: '3', title: 'Lagos', date: 'June 12, 2025', time: '8:00 PM', location: 'Event Center, Lagos', price: '$30', image: null },
    ],
  },
  {
    id: 'flash-sale',
    title: 'Flash Sale',
    deals: [
      { id: '1', title: 'Nairobi', date: 'June 15, 2025', time: '6:00 PM', location: 'Convention Hall', price: '$20', image: null },
      { id: '2', title: 'Nairobi', date: 'June 15, 2025', time: '6:00 PM', location: 'Convention Hall', price: '$20', image: null },
      { id: '3', title: 'Nairobi', date: 'June 15, 2025', time: '6:00 PM', location: 'Convention Hall', price: '$20', image: null },
    ],
  },
];

// Explore Japan categories data
const createExploreJapanData = () => [
  { id: 'events', title: 'Events', image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400' },
  { id: 'activities', title: 'Activities', image: 'https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?w=400' },
  { id: 'restaurants', title: 'Restaurants', image: 'https://images.unsplash.com/photo-1554797589-7241bb691973?w=400' },
  { id: 'services', title: 'Services', image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=400' },
  { id: 'places', title: 'Places', image: 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=400' },
  { id: 'tours', title: 'Tours', image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=400' },
  { id: 'destinations', title: 'Destinations', image: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400' },
  { id: 'accommodation', title: 'Accommodation', image: 'https://images.unsplash.com/photo-1480796927426-f609979314bd?w=400' },
];

// ============================================
// MEMOIZED SECTION COMPONENTS
// ============================================
const SectionHeader = React.memo(({ title, onPress }) => (
  <View style={styles.sectionHeader}>
    <Typography weight="700" size={18} color={color.placeholderTxt_24282C}>
      {title}
    </Typography>
    <TouchableOpacity style={styles.arrowButton} onPress={onPress}>
      <Typography weight="400" size={14} color={color.black_212b34}>
        {'>'}
      </Typography>
    </TouchableOpacity>
  </View>
));

const CardSeparator = React.memo(() => <View style={styles.cardSeparator} />);

// Timer Box Component
const TimerBox = React.memo(({ value, label }) => (
  <View style={styles.timerBox}>
    <Typography weight="700" size={18} color={color.placeholderTxt_24282C}>
      {value}
    </Typography>
    <Typography weight="400" size={11} color={color.grey_87807C}>
      {label}
    </Typography>
  </View>
));

// Blazing Deals Header with Timer Boxes
const BlazingDealsHeader = React.memo(({ timer, onPress }) => (
  <View style={styles.blazingDealsHeader}>
    {/* Left: Title and Offer Ends */}
    <View style={styles.blazingDealsHeaderLeft}>
      <TouchableOpacity onPress={onPress} style={styles.blazingDealsTitleRow}>
        <Typography weight="700" size={18} color={color.placeholderTxt_24282C}>
          Blazing Deals
        </Typography>
        <Typography weight="400" size={16} color={color.placeholderTxt_24282C} style={styles.blazingDealsArrow}>
          {' >'}
        </Typography>
      </TouchableOpacity>
      <Typography weight="450" size={12} color={color.red_BA1C11}>
        Offer Ends:
      </Typography>
    </View>

    {/* Right: Timer Boxes */}
    <View style={styles.timerBoxesContainer}>
      <TimerBox value={timer.days} label="Days" />
      <TimerBox value={timer.hours} label="Hours" />
      <TimerBox value={timer.mins} label="Min" />
    </View>
  </View>
));

// ============================================
// HORIZONTAL LIST COMPONENT
// ============================================
const HorizontalCardList = React.memo(({ data, renderItem, keyExtractor }) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return null;
  }

  const safeKeyExtractor = (item, index) => {
    try {
      if (keyExtractor && item) {
        const key = keyExtractor(item, index);
        if (key != null) {
          return String(key);
        }
      }
      return `item-${index}`;
    } catch (error) {
      console.warn('[HorizontalCardList] keyExtractor error:', error);
      return `item-${index}`;
    }
  };

  const safeRenderItem = ({ item, index }) => {
    try {
      if (!item) {
        return null;
      }
      return renderItem({ item, index });
    } catch (error) {
      console.error('[HorizontalCardList] renderItem error:', error);
      return null;
    }
  };

  return (
    <FlatList
      data={data}
      renderItem={safeRenderItem}
      keyExtractor={safeKeyExtractor}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.cardsList}
      ItemSeparatorComponent={CardSeparator}
      removeClippedSubviews={false}
      maxToRenderPerBatch={3}
      windowSize={3}
      initialNumToRender={2}
      nestedScrollEnabled={true}
    />
  );
});

HorizontalCardList.displayName = 'HorizontalCardList';

// ============================================
// MAIN COMPONENT
// ============================================
const ExploreScreen = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Timer state for deals countdown
  const [timer, setTimer] = useState({ days: '02', hours: '06', mins: '05' });

  // ============================================
  // MEMOIZED DATA - Only created once
  // ============================================
  const nearbyEventsData = useMemo(() => createMockCards(2, 'nearby'), []);
  const upcomingData = useMemo(() => createMockCards(5, 'upcoming'), []);
  const spotlightData = useMemo(() => createMockCards(5, 'spotlight'), []);
  const hotWeekData = useMemo(() => createMockCards(5, 'hotweek'), []);
  const trendingData = useMemo(() => createMockCards(5, 'trending'), []);
  const exclusiveData = useMemo(() => createMockCards(2, 'exclusive'), []);
  const forYouData = useMemo(() => createMockCards(5, 'foryou'), []);
  const buzzingData = useMemo(() => createDestinationCards(5), []);
  const blazingDealsData = useMemo(() => createBlazingDealsData(), []);
  const exploreJapanData = useMemo(() => createExploreJapanData(), []);
  const hiddenGemsData = useMemo(() => createMockCards(5, 'hiddengems'), []);
  const topTenData = useMemo(() => createMockCards(5, 'topten'), []);
  const globalData = useMemo(() => createMockCards(5, 'global'), []);

  // ============================================
  // COUNTDOWN TIMER EFFECT
  // ============================================
  useEffect(() => {
    const endTime = new Date().getTime() + (2 * 24 * 60 * 60 * 1000) + (6 * 60 * 60 * 1000) + (5 * 60 * 1000);

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = endTime - now;

      if (distance < 0) {
        clearInterval(interval);
        setTimer({ days: '00', hours: '00', mins: '00' });
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

      setTimer({
        days: days.toString().padStart(2, '0'),
        hours: hours.toString().padStart(2, '0'),
        mins: mins.toString().padStart(2, '0'),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // ============================================
  // MEMOIZED CALLBACKS
  // ============================================
  const handleCardPress = useCallback((item) => {
    console.log('Card pressed:', item);
  }, []);

  const handleBookmarkPress = useCallback((item) => {
    console.log('Bookmark pressed:', item);
  }, []);

  const handleDestinationPress = useCallback((item) => {
    console.log('Destination pressed:', item);
  }, []);

  const handleDealPress = useCallback((deal) => {
    console.log('Deal pressed:', deal);
  }, []);

  // Navigate to BlazingDealsScreen with specific tab when "View All Offers" is pressed
  const handleViewAllDealsPress = useCallback((category) => {
    console.log('View all deals pressed:', category);
    navigation.navigate('BlazingDealDetail', { initialTab: category.id });
  }, [navigation]);

  const handleSectionPress = useCallback((sectionName) => {
    console.log('Section pressed:', sectionName);
    if (sectionName === 'Hot This Week') {
      navigation.navigate('HotThisWeek');
    }
    else if (sectionName === 'Happening Nearby') {
      navigation.navigate('NearbyEvents');
    }
    else if (sectionName === 'Blazing Deals') {
      navigation.navigate('BlazingDealDetail');
    }
  }, [navigation]);

  const handleNearbyCardPress = useCallback((item) => {
    console.log('Nearby event card pressed:', item);
  }, []);

  const handleNearbyBookmarkPress = useCallback((item) => {
    console.log('Nearby bookmark pressed:', item);
  }, []);

  const handleNearbyHeaderPress = useCallback(() => {
    navigation.navigate('NearbyEvents');
  }, [navigation]);

  const handleExclusiveCardPress = useCallback((item) => {
    console.log('Exclusive card pressed:', item);
  }, []);

  const handleExclusiveBookmarkPress = useCallback((item) => {
    console.log('Exclusive bookmark pressed:', item);
  }, []);

  const handleExclusiveHeaderPress = useCallback(() => {
    console.log('Exclusive header pressed');
  }, []);

  const handleExploreJapanPress = useCallback((item) => {
    console.log('Explore Japan category pressed:', item);
  }, []);

  const handleNotificationPress = useCallback(() => {
    console.log('Notification pressed');
  }, []);

  const handleLocationPress = useCallback(() => {
    console.log('Location pressed');
  }, []);

  const handleFilterPress = useCallback(() => {
    console.log('Filter pressed');
  }, []);

  const handleInvitePress = useCallback(() => {
    console.log('Invite pressed');
  }, []);

  // ============================================
  // MEMOIZED RENDER FUNCTIONS
  // ============================================
  
  // Standard EventCard with price
  const renderEventCard = useCallback(({ item }) => (
    <EventCard
      item={item}
      onPress={handleCardPress}
      onBookmarkPress={handleBookmarkPress}
    />
  ), [handleCardPress, handleBookmarkPress]);

  // EventCard with "View Details >" for Upcoming section
  const renderUpcomingCard = useCallback(({ item }) => (
    <EventCard
      item={item}
      onPress={handleCardPress}
      onBookmarkPress={handleBookmarkPress}
      showViewDetails={true}
    />
  ), [handleCardPress, handleBookmarkPress]);

  const renderEventCardNoBookmark = useCallback(({ item }) => (
    <EventCard
      item={item}
      onPress={handleCardPress}
      showBookmark={false}
    />
  ), [handleCardPress]);

  const renderBuzzingCard = useCallback(({ item }) => (
    <BuzzingCard
      item={item}
      onPress={handleDestinationPress}
    />
  ), [handleDestinationPress]);

  // Render DealCard - onViewAllPress navigates to specific tab
  const renderDealCard = useCallback(({ item }) => (
    <DealCard
      item={item}
      onPress={handleDealPress}
      onViewAllPress={handleViewAllDealsPress}
    />
  ), [handleDealPress, handleViewAllDealsPress]);

  const keyExtractor = useCallback((item, index) => {
    if (!item) {
      return `item-${index}`;
    }
    if (item.id != null) {
      return String(item.id);
    }
    return `item-${index}`;
  }, []);

  // ============================================
  // RENDER
  // ============================================
  return (
    <View style={styles.container}>
      <StatusBar style="dark" backgroundColor="#FFFFFF" />

      {/* Fixed Header Section */}
      <View style={styles.fixedHeader}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity style={styles.profileImageContainer}>
              {userData?.profile_image ? (
                <Image
                  source={{ uri: userData.profile_image }}
                  style={styles.profileImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.profileImagePlaceholder}>
                  <SvgIcons.profilePersonImage width={50} height={50} />
                </View>
              )}
            </TouchableOpacity>
            <View style={styles.headerTextContainer}>
              <View style={styles.textWithWavingHandContainer}>
                <Typography weight="700" size={18} color={color.black_544B45}>
                  Hey Alex
                </Typography>
                <SvgIcons.wavingHand width={20} height={20} style={{ marginBottom: 4 }} />
              </View>
              <View style={styles.locationContainer}>
                <SvgIcons.locationIcon width={12} height={12} />
                <Typography
                  weight="400"
                  size={12}
                  color={color.grey_87807C}
                  style={styles.locationText}
                >
                  New York, USA
                </Typography>
              </View>
            </View>
          </View>

          {/* Right side icons */}
          <View style={styles.headerRightIcons}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={handleLocationPress}
            >
              <SvgIcons.pinLocationIcon width={24} height={24} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={handleNotificationPress}
            >
              <SvgIcons.notificationBellIcon width={24} height={24} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Fixed Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <SvgIcons.searchBarIcon width={14} height={14} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for services, events, places"
              placeholderTextColor={color.btnBrown_AE6F28}
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
            />
          </View>
          <TouchableOpacity style={styles.filterButton} onPress={handleFilterPress}>
            <SvgIcons.filterIconConsumer width={24} height={24} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={false}
        nestedScrollEnabled={true}
        scrollEventThrottle={16}
      >
        {/* Invite Friends Banner */}
        <View style={styles.inviteBanner}>
          <View style={styles.inviteBannerContent}>
            <View style={styles.inviteBannerLeft}>
              <Typography weight="700" size={18} color={color.placeholderTxt_24282C}>
                Invite your friends
              </Typography>
              <Typography
                weight="450"
                size={13}
                color={color.brown_766F6A}
                style={styles.inviteSubtitle}
              >
                Get $20 for ticket
              </Typography>
              <TouchableOpacity
                style={styles.inviteButton}
                activeOpacity={0.8}
                onPress={handleInvitePress}
              >
                <Typography weight="500" size={12} color={color.white_FFFFFF}>
                  INVITE
                </Typography>
              </TouchableOpacity>
            </View>
            <View style={styles.inviteBannerRight}>
              <SvgIcons.inviteGiftImage width={263} height={164} />
            </View>
          </View>
        </View>

        {/* Upcoming Section - Uses "View Details >" instead of price */}
        <View style={styles.sectionContainer}>
          <SectionHeader title="Upcoming" onPress={() => handleSectionPress('Upcoming')} />
          <HorizontalCardList
            data={upcomingData}
            renderItem={renderUpcomingCard}
            keyExtractor={keyExtractor}
          />
        </View>

        {/* NearBy Events Section */}
        <ExclusiveSection
          title="Happening Nearby"
          data={nearbyEventsData}
          onCardPress={handleNearbyCardPress}
          onBookmarkPress={handleNearbyBookmarkPress}
          onHeaderPress={handleNearbyHeaderPress}
        />

        {/* Blazing Deals Section with Timer Boxes */}
        <View style={styles.sectionContainer}>
          <BlazingDealsHeader
            timer={timer}
            onPress={() => handleSectionPress('Blazing Deals')}
          />
          <HorizontalCardList
            data={blazingDealsData}
            renderItem={renderDealCard}
            keyExtractor={keyExtractor}
          />
        </View>

        {/* Exclusive Section */}
        <ExclusiveSection
          title="Exclusive"
          data={exclusiveData}
          onCardPress={handleExclusiveCardPress}
          onBookmarkPress={handleExclusiveBookmarkPress}
          onHeaderPress={handleExclusiveHeaderPress}
        />

        {/* Tonight's Spotlight Section */}
        <View style={styles.sectionContainer}>
          <SectionHeader title="Tonight's Spotlight" onPress={() => handleSectionPress("Tonight's Spotlight")} />
          <HorizontalCardList
            data={spotlightData}
            renderItem={renderEventCard}
            keyExtractor={keyExtractor}
          />
        </View>

        {/* Hot This Week Section */}
        <View style={styles.sectionContainer}>
          <SectionHeader title="Hot This Week" onPress={() => handleSectionPress('Hot This Week')} />
          <HorizontalCardList
            data={hotWeekData}
            renderItem={renderEventCard}
            keyExtractor={keyExtractor}
          />
        </View>

        {/* For You Section */}
        <View style={styles.japanGroupedContainer}>
          <View style={styles.sectionContainer}>
            <SectionHeader title="For You" onPress={() => handleSectionPress('For You')} />
            <HorizontalCardList
              data={forYouData}
              renderItem={renderEventCard}
              keyExtractor={keyExtractor}
            />
          </View>

          {/* Trending Section */}
          <View style={styles.sectionContainer}>
            <SectionHeader title="Trending" onPress={() => handleSectionPress('Trending')} />
            <HorizontalCardList
              data={trendingData}
              renderItem={renderEventCard}
              keyExtractor={keyExtractor}
            />
          </View>

          {/* Buzzing Destinations Section */}
          <View style={styles.sectionContainer}>
            <SectionHeader title="Buzzing Destinations" onPress={() => handleSectionPress('Buzzing Destinations')} />
            <HorizontalCardList
              data={buzzingData}
              renderItem={renderBuzzingCard}
              keyExtractor={keyExtractor}
            />
          </View>

          {/* Hidden Gems Section */}
          <View style={styles.sectionContainer}>
            <SectionHeader title="Hidden Gems" onPress={() => handleSectionPress('Hidden Gems')} />
            <HorizontalCardList
              data={hiddenGemsData}
              renderItem={renderBuzzingCard}
              keyExtractor={keyExtractor}
            />
          </View>
        </View>

        {/* Explore Japan - Masonry Grid */}
        <ExploreSectionHomePage
          title="Explore Japan"
          data={exploreJapanData}
          onCardPress={handleExploreJapanPress}
        />

        {/* Japan's Top 10 - Horizontal List */}
        <View style={styles.topTenSection}>
          <SectionHeader title="Japan's Top 10" onPress={() => handleSectionPress("Japan's Top 10")} />
          <HorizontalCardList
            data={topTenData}
            renderItem={renderEventCardNoBookmark}
            keyExtractor={keyExtractor}
          />
        </View>

        {/* Global Highlights Section */}
        <View style={[styles.sectionContainer, styles.lastSectionContainer]}>
          <SectionHeader title="Global Highlights" onPress={() => handleSectionPress('Global Highlights')} />
          <HorizontalCardList
            data={globalData}
            renderItem={renderBuzzingCard}
            keyExtractor={keyExtractor}
          />
        </View>

        {/* Bottom padding for tab bar */}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
};

// ============================================
// STYLES
// ============================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fixedHeader: {
    paddingTop: Platform.OS === 'ios' ? 50 : Platform.OS === 'android' ? 30 : 0,
    zIndex: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileImageContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    marginRight: 12,
    backgroundColor: color.white_FFFFFF,
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  profileImagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: color.white_FFFFFF,
  },
  headerTextContainer: {
    flex: 1,
  },
  textWithWavingHandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  locationText: {
    marginLeft: 4,
    flex: 1,
  },
  headerRightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 26,
    height: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: color.lightBrown_FFF6DF,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '400',
    color: color.black_212b34,
    marginLeft: 12,
  },
  filterButton: {
    width: 48,
    height: 48,
    backgroundColor: color.lightBrown_FFF6DF,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inviteBanner: {
    marginHorizontal: 20,
    marginBottom: 24,
    backgroundColor: color.brown_F7E4B6,
    borderRadius: 12,
    padding: 16,
    overflow: 'hidden',
    minHeight: 127,
  },
  inviteBannerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
  },
  inviteBannerLeft: {
    flex: 1,
    zIndex: 1,
    paddingRight: 20,
  },
  inviteSubtitle: {
    marginTop: 4,
    marginBottom: 12,
  },
  inviteButton: {
    backgroundColor: color.btnBrown_AE6F28,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  inviteBannerRight: {
    position: 'absolute',
    right: -20,
    top: 20,
    bottom: -20,
    justifyContent: 'center',
    alignItems: 'flex-end',
    zIndex: 0,
    width: 140,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  lastSectionContainer: {
    marginBottom: 100,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  arrowButton: {
    marginLeft: 8,
    padding: 4,
  },
  cardsList: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  cardSeparator: {
    width: 12,
  },
  // Blazing Deals Header Styles
  blazingDealsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  blazingDealsHeaderLeft: {
    flex: 1,
  },
  blazingDealsTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  blazingDealsArrow: {
    marginLeft: 4,
  },
  timerBoxesContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  timerBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  japanGroupedContainer: {
    backgroundColor: color.lightBrown_FFF6DF,
    paddingTop: 24,
    paddingBottom: 24,
    marginBottom: 24,
  },
  topTenSection: {
    marginTop: 24,
    marginBottom: 14,
  },
  bottomPadding: {
    height: 20,
  },
});

export default ExploreScreen;