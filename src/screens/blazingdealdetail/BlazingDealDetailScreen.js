import React, { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SvgIcons from '../../../components/SvgIcons';
import { color } from '../../color/color';
import Typography from '../../components/Typography';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ============ Data ============
const DEAL_CATEGORIES = [
  { id: 'black-friday', label: 'Black Friday Sale' },
  { id: 'bogo', label: 'BOGO' },
  { id: 'cyber-monday', label: 'Cyber Monday' },
  { id: 'flat-60', label: 'Flat 60% off' },
  { id: 'flash-sale', label: 'Flash Sale' },
];

const DEALS_DATA = {
  'black-friday': {
    sectionTitle: 'Black Friday Sale',
    deals: [
      {
        id: '1',
        title: 'Accra',
        description: 'A global hub for finance, culture, and events, London boasts world-class venues, excellent transportation, and a vibrant atmosphere.',
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400',
        dateRange: 'Sat 12 Jan 2026 - Wed 15 Jan 2026',
        time: '9:00am - 5:00pm',
        location: 'New York, NY United States',
        price: 25,
      },
      {
        id: '2',
        title: 'Accra',
        description: 'A global hub for finance, culture, and events, London boasts world-class venues, excellent transportation, and a vibrant atmosphere.',
        image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400',
        dateRange: 'Sat 12 Jan 2026 - Wed 15 Jan 2026',
        time: '9:00am - 5:00pm',
        location: 'New York, NY United States',
        price: 25,
      },
      {
        id: '3',
        title: 'Accra',
        description: 'A global hub for finance, culture, and events, London boasts world-class venues, excellent transportation, and a vibrant atmosphere.',
        image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400',
        dateRange: 'Sat 12 Jan 2026 - Wed 15 Jan 2026',
        time: '9:00am - 5:00pm',
        location: 'New York, NY United States',
        price: 25,
      },
    ],
  },
  'bogo': {
    sectionTitle: 'BOGO Deals',
    deals: [
      {
        id: '1',
        title: 'Lagos Festival',
        description: 'Experience the vibrant culture of Lagos with amazing buy-one-get-one deals on tickets and merchandise.',
        image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400',
        dateRange: 'Fri 20 Jan 2026 - Sun 22 Jan 2026',
        time: '6:00pm - 11:00pm',
        location: 'Lagos, Nigeria',
        price: 30,
      },
      {
        id: '2',
        title: 'Nairobi Nights',
        description: 'Join us for an unforgettable evening with BOGO deals on all premium experiences.',
        image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=400',
        dateRange: 'Sat 25 Jan 2026 - Sun 26 Jan 2026',
        time: '7:00pm - 12:00am',
        location: 'Nairobi, Kenya',
        price: 40,
      },
    ],
  },
  'cyber-monday': {
    sectionTitle: 'Cyber Monday',
    deals: [
      {
        id: '1',
        title: 'Tech Summit 2026',
        description: 'The biggest tech conference of the year with exclusive Cyber Monday pricing on all tickets.',
        image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=400',
        dateRange: 'Mon 27 Jan 2026 - Wed 29 Jan 2026',
        time: '9:00am - 6:00pm',
        location: 'San Francisco, CA',
        price: 50,
      },
      {
        id: '2',
        title: 'Digital Marketing Workshop',
        description: 'Learn the latest digital marketing strategies with our Cyber Monday special discount.',
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400',
        dateRange: 'Mon 27 Jan 2026',
        time: '10:00am - 4:00pm',
        location: 'Online Event',
        price: 35,
      },
    ],
  },
  'flat-60': {
    sectionTitle: 'Flat 60% Off',
    deals: [
      {
        id: '1',
        title: 'Art Exhibition',
        description: 'Explore world-renowned art pieces at a fraction of the cost with our 60% discount.',
        image: 'https://images.unsplash.com/photo-1531243269054-5ebf6f34081e?w=400',
        dateRange: 'Sat 01 Feb 2026 - Sun 15 Feb 2026',
        time: '10:00am - 8:00pm',
        location: 'Paris, France',
        price: 20,
      },
    ],
  },
  'flash-sale': {
    sectionTitle: 'Flash Sale',
    deals: [
      {
        id: '1',
        title: 'Concert Night',
        description: 'Limited time flash sale on premium concert tickets. Grab them before they\'re gone!',
        image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400',
        dateRange: 'Fri 05 Feb 2026',
        time: '8:00pm - 11:00pm',
        location: 'London, UK',
        price: 35,
      },
    ],
  },
};

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
        Blazing Deals
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
const CategoryTabs = ({ categories, activeCategory, onCategoryChange, scrollRef }) => {
  return (
    <View style={styles.categoryTabsWrapper}>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryTabsContainer}
      >
        {categories.map((category) => (
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

// Deal Card Component - Matches the Figma design
const DealCard = ({ item, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.dealCard}
      onPress={() => onPress(item)}
      activeOpacity={0.9}
    >
      {/* Deal Image */}
      <View style={styles.dealImageContainer}>
        <Image
          source={{ uri: item.image }}
          style={styles.dealImage}
          resizeMode="cover"
        />
      </View>

      {/* Deal Details */}
      <View style={styles.dealDetails}>
        {/* Title */}
        <Typography
          weight="700"
          size={18}
          color={color.placeholderTxt_24282C}
          style={styles.dealTitle}
        >
          {item.title}
        </Typography>

        {/* Description */}
        <Typography
          weight="400"
          size={14}
          color={color.grey_87807C}
          style={styles.dealDescription}
          numberOfLines={3}
        >
          {item.description}
        </Typography>

        {/* Date and Time Row */}
        <View style={styles.dateTimeRow}>
          <Typography
            weight="450"
            size={13}
            color={color.brown_766F6A}
          >
            {item.dateRange}
          </Typography>
          <View style={styles.dateSeparator} />
          <Typography
            weight="450"
            size={13}
            color={color.brown_766F6A}
          >
            {item.time}
          </Typography>
        </View>

        {/* Location */}
        <Typography
          weight="450"
          size={13}
          color={color.brown_766F6A}
          style={styles.dealLocation}
        >
          {item.location}
        </Typography>

        {/* Price */}
        <View style={styles.priceRow}>
          <Typography weight="400" size={12} color={color.grey_87807C}>
            from{' '}
          </Typography>
          <Typography weight="700" size={16} color={color.placeholderTxt_24282C}>
            ${item.price}
          </Typography>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// ============ Main Screen ============
const BlazingDealDetailScreen = ({ navigation, route }) => {
  // Get initial tab from navigation params (when coming from "View All Offers")
  const initialTab = route?.params?.initialTab || 'black-friday';
  const tabScrollRef = useRef(null);
  
  const [activeCategory, setActiveCategory] = useState(initialTab);
  const [currentData, setCurrentData] = useState(DEALS_DATA[initialTab] || DEALS_DATA['black-friday']);

  // Update data when category changes
  useEffect(() => {
    const data = DEALS_DATA[activeCategory];
    if (data) {
      setCurrentData(data);
    }
  }, [activeCategory]);

  // Set initial tab when coming from "View All Offers"
  useEffect(() => {
    if (route?.params?.initialTab) {
      setActiveCategory(route.params.initialTab);
    }
  }, [route?.params?.initialTab]);

  const handleBackPress = () => {
    navigation?.goBack();
  };

  const handleSearchPress = () => {
    console.log('Search pressed');
  };

  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
  };

  const handleDealPress = (deal) => {
    console.log('Deal pressed:', deal.title);
    // Navigate to deal details screen if needed
    // navigation.navigate('DealDetails', { deal });
  };

  const renderDealCard = ({ item }) => (
    <DealCard
      item={item}
      onPress={handleDealPress}
    />
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={color.white_FFFFFF} />

      {/* Header */}
      <Header onBackPress={handleBackPress} onSearchPress={handleSearchPress} />

      {/* Category Tabs */}
      <CategoryTabs
        categories={DEAL_CATEGORIES}
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
        scrollRef={tabScrollRef}
      />

      {/* Divider */}
      <View style={styles.divider} />

      {/* Section Title */}
      <View style={styles.sectionTitleContainer}>
        <Typography weight="700" size={20} color={color.placeholderTxt_24282C}>
          {currentData.sectionTitle}
        </Typography>
      </View>

      {/* Deals List */}
      <FlatList
        data={currentData.deals}
        renderItem={renderDealCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.dealsList}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.dealSeparator} />}
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
    backgroundColor: color.grey_F0F0F0,
  },

  // Section Title
  sectionTitleContainer: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 8,
  },

  // Deals List
  dealsList: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 120,
  },
  dealSeparator: {
    height: 24,
  },

  // Deal Card
  dealCard: {
    backgroundColor: color.white_FFFFFF,
  },
  dealImageContainer: {
    width: '100%',
    height: 220,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#F5F5F5',
  },
  dealImage: {
    width: '100%',
    height: '100%',
  },
  dealDetails: {
    paddingTop: 16,
  },
  dealTitle: {
    marginBottom: 8,
  },
  dealDescription: {
    marginBottom: 12,
    lineHeight: 20,
  },
  dateTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    flexWrap: 'wrap',
  },
  dateSeparator: {
    width: 1,
    height: 12,
    backgroundColor: color.brown_766F6A,
    marginHorizontal: 8,
  },
  dealLocation: {
    marginBottom: 12,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
});

export default BlazingDealDetailScreen;