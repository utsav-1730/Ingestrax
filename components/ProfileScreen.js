import React, { useState, useEffect } from 'react';
import {
  View,
  Text,  
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  Dimensions,
  Platform,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit'; // For the graphs
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {
  const navigation = useNavigation();

  // State to manage which data to display (7 days, 30 days, 3 months)
  const [selectedPeriod, setSelectedPeriod] = useState('last7Days');

  // Sample user data - replace with real data from backend
  const [userData, setUserData] = useState({
    name: 'Jane Doe',
    photoUrl: 'https://via.placeholder.com/120', // Placeholder image URL
    bio: 'Health is wealth!',
    healthScore: 92,
    badges: ['Novice', 'Intermediate', 'Expert'],
    achievements: ['First Scan', '100% Health Score Day'],
    healthScoreData: {
      last7Days: [85, 88, 90, 92, 93, 95, 92],
      last30Days: [
        80, 82, 83, 85, 87, 88, 90, 92, 93, 95,
        92, 90, 88, 87, 85, 83, 82, 80, 78, 76,
        75, 77, 79, 80, 82, 83, 85, 87, 88, 90,
      ],
      last3Months: [
        // 12 data points representing weeks over 3 months
        75, 76, 77, 78, // Month 1
        79, 80, 81, 82, // Month 2
        83, 84, 85, 86, // Month 3
      ],
    },
  });

  // Fetch user data from backend (placeholder function)
  useEffect(() => {
    // TODO: Fetch user data from backend and update state
    // Example:
    // fetchUserData().then(data => setUserData(data));
  }, []);

  // Function to calculate average safely
  const calculateAverage = (dataSlice) => {
    if (dataSlice.length === 0) return 0;
    return dataSlice.reduce((a, b) => a + b, 0) / dataSlice.length;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Profile</Text>
        {/* Settings Button */}
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Ionicons name="settings-outline" size={24} color="#F27A1A" />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* User Info Section */}
        <View style={styles.userInfoSection}>
          {/* Profile Image */}
          <Image source={{ uri: userData.photoUrl }} style={styles.profileImage} />
          {/* User Name */}
          <Text style={styles.userName}>{userData.name}</Text>
          {/* User Bio */}
          <Text style={styles.userBio}>{userData.bio}</Text>
          {/* Edit Profile Button */}
         {/* Edit Profile Button */}
<TouchableOpacity
  style={styles.editProfileButton}
  onPress={() => navigation.navigate('EditProfile')}
>
  <Text style={styles.editProfileButtonText}>Edit Profile</Text>
</TouchableOpacity>

        </View>

        {/* Health Score Section */}
        <View style={styles.healthScoreSection}>
          <Text style={styles.sectionTitle}>Health Score</Text>
          <View style={styles.healthScoreContainer}>
            {/* Displaying Health Score with an Icon */}
            <MaterialCommunityIcons name="heart-pulse" size={60} color="#F27A1A" />
            <Text style={styles.healthScore}>{userData.healthScore}%</Text>
          </View>
        </View>

        {/* Badges Section */}
        <View style={styles.badgesSection}>
          <Text style={styles.sectionTitle}>Badges</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.badgesScroll}>
            {userData.badges.map((badge, index) => (
              <View key={index} style={styles.badgeContainer}>
                {/* Badge Image */}
                <Image
                  source={{ uri: 'https://via.placeholder.com/60' }} // TODO: Replace with actual badge images
                  style={styles.badgeImage}
                />
                {/* Badge Name */}
                <Text style={styles.badgeText}>{badge}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Achievements Section */}
        <View style={styles.achievementsSection}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          {userData.achievements.map((achievement, index) => (
            <View key={index} style={styles.achievementContainer}>
              {/* Achievement Icon */}
              <Ionicons name="trophy-outline" size={24} color="#F27A1A" />
              {/* Achievement Text */}
              <Text style={styles.achievementText}>{achievement}</Text>
            </View>
          ))}
        </View>

        {/* Health Score Tracking Graph */}
        <View style={styles.graphSection}>
          <Text style={styles.sectionTitle}>Health Score Tracking</Text>
          {/* Period Selection Buttons */}
          <View style={styles.periodSelector}>
            <TouchableOpacity
              style={[
                styles.periodButton,
                selectedPeriod === 'last7Days' && styles.activePeriodButton,
              ]}
              onPress={() => setSelectedPeriod('last7Days')}
            >
              <Text
                style={[
                  styles.periodButtonText,
                  selectedPeriod === 'last7Days' && styles.activePeriodButtonText,
                ]}
              >
                7 Days
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.periodButton,
                selectedPeriod === 'last30Days' && styles.activePeriodButton,
              ]}
              onPress={() => setSelectedPeriod('last30Days')}
            >
              <Text
                style={[
                  styles.periodButtonText,
                  selectedPeriod === 'last30Days' && styles.activePeriodButtonText,
                ]}
              >
                30 Days
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.periodButton,
                selectedPeriod === 'last3Months' && styles.activePeriodButton,
              ]}
              onPress={() => setSelectedPeriod('last3Months')}
            >
              <Text
                style={[
                  styles.periodButtonText,
                  selectedPeriod === 'last3Months' && styles.activePeriodButtonText,
                ]}
              >
                3 Months
              </Text>
            </TouchableOpacity>
          </View>
          {/* Line Chart */}
          <LineChart
            data={{
              labels:
                selectedPeriod === 'last7Days'
                  ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                  : selectedPeriod === 'last30Days'
                  ? ['Week 1', 'Week 2', 'Week 3', 'Week 4']
                  : ['Month 1', 'Month 2', 'Month 3'],
              datasets: [
                {
                  data:
                    selectedPeriod === 'last7Days'
                      ? userData.healthScoreData.last7Days
                      : selectedPeriod === 'last30Days'
                      ? [
                          // Averaging data weekly for 30 days
                          calculateAverage(userData.healthScoreData.last30Days.slice(0, 7)),
                          calculateAverage(userData.healthScoreData.last30Days.slice(7, 14)),
                          calculateAverage(userData.healthScoreData.last30Days.slice(14, 21)),
                          calculateAverage(userData.healthScoreData.last30Days.slice(21, 28)),
                        ]
                      : [
                          // Monthly averages for 3 months
                          calculateAverage(userData.healthScoreData.last3Months.slice(0, 4)),
                          calculateAverage(userData.healthScoreData.last3Months.slice(4, 8)),
                          calculateAverage(userData.healthScoreData.last3Months.slice(8, 12)),
                        ],
                },
              ],
            }}
            width={Dimensions.get('window').width - 40} // Adjusted for padding
            height={220}
            yAxisSuffix="%"
            yAxisInterval={1}
            chartConfig={{
              backgroundColor: '#fff',
              backgroundGradientFrom: '#fff',
              backgroundGradientTo: '#fff',
              decimalPlaces: 1,
              color: (opacity = 1) => `rgba(242, 122, 26, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(102, 102, 102, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: '5',
                strokeWidth: '2',
                stroke: '#F27A1A',
              },
            }}
            bezier
            style={styles.graphStyle}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // Container Style
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  // Header Style
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Platform.OS === 'android' ? 40 : 0,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F27A1A',
  },
  // Content Container Style
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  // User Info Section Styles
  userInfoSection: {
    alignItems: 'center',
    marginVertical: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#ddd',
    marginBottom: 10,
  },
  userName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#262626',
  },
  userBio: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginVertical: 10,
  },
  editProfileButton: {
    backgroundColor: '#F27A1A',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginTop: 10,
  },
  editProfileButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  // Health Score Section Styles
  healthScoreSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#262626',
    marginBottom: 15,
  },
  healthScoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  healthScore: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#F27A1A',
    marginLeft: 10,
  },
  // Badges Section Styles
  badgesSection: {
    marginBottom: 30,
  },
  badgesScroll: {
    flexDirection: 'row',
  },
  badgeContainer: {
    alignItems: 'center',
    marginRight: 20,
  },
  badgeImage: {
    width: 60,
    height: 60,
    backgroundColor: '#ddd',
    borderRadius: 30,
    marginBottom: 5,
  },
  badgeText: {
    fontSize: 14,
    color: '#666',
  },
  // Achievements Section Styles
  achievementsSection: {
    marginBottom: 30,
  },
  achievementContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  achievementText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 10,
  },
  // Graph Section Styles
  graphSection: {
    marginBottom: 20,
  },
  periodSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
  },
  periodButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: '#eee',
    marginHorizontal: 5,
  },
  activePeriodButton: {
    backgroundColor: '#F27A1A',
  },
  periodButtonText: {
    fontSize: 14,
    color: '#666',
  },
  activePeriodButtonText: {
    color: '#fff',
  },
  graphStyle: {
    borderRadius: 16,
    marginVertical: 8,
  },
});

export default ProfileScreen;
