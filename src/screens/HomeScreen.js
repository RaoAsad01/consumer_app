import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import SvgIcons from '../../components/SvgIcons';
import { color } from '../color/color';
import Typography from '../components/Typography';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.75; // 75% of screen width for cards

// Mock data for cards - replace with actual API data later
const generateMockCards = (count = 5) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    title: `Namba’s Night ${i + 1}`,
    date: 'June 10, 2025 • 7:00 PM',
    location: 'Namba, Osaka',
    price: '$25',
    image: null, // Add image URL later
  }));
};

const ExploreScreen = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get user's location or default
  const getUserLocation = () => {
    // You can add location logic here based on your API response
    return userData?.location || 'New York, USA';
  };

  const renderCard = ({ item }) => (
    <TouchableOpacity style={styles.card} activeOpacity={0.8}>
      <View style={styles.cardImageContainer}>
        <View style={styles.cardImageWrapper}>
          <SvgIcons.dummyImageExploreCategory width="100%" height="100%" />
        </View>
        <TouchableOpacity style={styles.bookmarkButton} activeOpacity={0.8}>
          <SvgIcons.favouriteIconConsumer width={24} height={24} />
        </TouchableOpacity>
      </View>
      <View style={styles.cardContent}>
        <Typography weight="700" size={16} color={color.placeholderTxt_24282C} numberOfLines={1} style={styles.cardTitle}>
          {item.title}
        </Typography>
        <Typography weight="450" size={12} color={color.brown_766F6A} style={styles.cardDate}>
          {item.date}
        </Typography>
        <View style={styles.cardLocationPriceRow}>
          <Typography weight="450" size={12} color={color.brown_766F6A} style={styles.cardLocation}>
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

  const renderSection = (title, data, isLast = false) => (
    <View style={[styles.sectionContainer, isLast && styles.lastSectionContainer]}>
      <View style={styles.sectionHeader}>
        <Typography weight="700" size={18} color={color.placeholderTxt_24282C}>
          {title}
        </Typography>
        <TouchableOpacity style={styles.arrowButton}>
          <Typography weight="400" size={14} color={color.black_212b34}>
            {'>'}
          </Typography>
        </TouchableOpacity>
      </View>
      <FlatList
        data={data}
        renderItem={renderCard}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.cardsList}
        ItemSeparatorComponent={() => <View style={styles.cardSeparator} />}
      />
    </View>
  );

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
              <Typography weight="600" size={16} color={color.black_544B45}>
                Hey Alex
              </Typography>
              <View style={styles.locationContainer}>
                <SvgIcons.locationIcon width={12} height={12} />
                <Typography weight="400" size={12} color={color.grey_87807C} style={styles.locationText}>
                  New York, USA
                </Typography>
              </View>
            </View>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color={color.black_544B45} />
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>

        {/* Fixed Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <SvgIcons.searchBarIcon width={14} height={14} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for services, events, places"
              placeholderTextColor={color.btnBrown_AE6F28}
            />
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <SvgIcons.filterIconConsumer width={24} height={24} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Invite Friends Banner */}
        <View style={styles.inviteBanner}>
          <View style={styles.inviteBannerContent}>
            <View style={styles.inviteBannerLeft}>
              <Typography weight="700" size={18} color={color.placeholderTxt_24282C}>
                Invite your friends
              </Typography>
              <Typography weight="450" size={13} color={color.brown_766F6A} style={styles.inviteSubtitle}>
                Get $20 for ticket
              </Typography>

              <TouchableOpacity style={styles.inviteButton} activeOpacity={0.8}>
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

        {/* Horizontal Scrollable Sections */}
        {renderSection("Upcoming", generateMockCards(5))}
        {renderSection("Tonight's Spotlight", generateMockCards(5))}
        {renderSection('Hot This Week', generateMockCards(5))}
        {renderSection('Trending', generateMockCards(5))}
        {/* {renderSection('Exclusive', generateMockCards(5))} */}
        {renderSection('For You', generateMockCards(5), true)}
        {/* {renderSection('Buzzing Destinations', generateMockCards(5), true)} */}

        {/* Bottom padding for tab bar */}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  fixedHeader: {
    backgroundColor: '#F5F5F5',
    paddingTop: Platform.OS === 'ios' ? 50 : Platform.OS === 'android' ? 40 : 0,
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
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    gap: 4,
  },
  locationText: {
    flex: 1,
  },
  notificationButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: color.red_FF0000,
    borderWidth: 1.5,
    borderColor: color.white_FFFFFF,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: color.lightBrown_FFF6DF,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '400',
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
  },
  cardsList: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  cardSeparator: {
    width: 12,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: color.white_FFFFFF,
    borderRadius: 18,
    overflow: 'hidden',
  },
  cardImageContainer: {
    width: '100%',
    height: 212, // 180 + 16 top + 16 bottom padding
    position: 'relative',
    backgroundColor: color.white_FFFFFF,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    justifyContent: 'center',
  },
  cardImageWrapper: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    overflow: 'hidden',
  },
  bookmarkButton: {
    position: 'absolute',
    top: 28,
    right: 28,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  cardContent: {
    padding: 16,
    paddingTop: 12,
  },
  cardTitle: {
    marginBottom: 8,
  },
  cardDate: {
    marginTop: 0,
    marginBottom: 4,
  },
  cardLocationPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  cardLocation: {
    flex: 1,
    marginRight: 8,
  },
  cardPriceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    paddingRight: 0,
  },
  bottomPadding: {
    height: 20,
  },
});

export default ExploreScreen;
