import React from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { Auth } from 'aws-amplify';

const MainScreen = ({ navigation }) => {
  const categories = ["Weight gain", "Exercises", "Yoga", "Salad"];

  // Sample data for charts
  const dailyStats = Array(7).fill(0).map(() => Math.random() * 100);
  const smokingStats = Array(7).fill(0).map(() => Math.random() * 100);

  const handleLogout = async () => {
    try {
      await Auth.signOut();
      navigation.replace('Login');
    } catch (error) {
      Alert.alert('Error', 'Error signing out. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView style={styles.scrollView} contentContainerStyle={{ paddingBottom: 20 }}>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity>
            <View style={styles.menuButton}>
              <View style={styles.menuLine} />
              <View style={styles.menuLine} />
              <View style={styles.menuLine} />
            </View>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Hii, Good noon</Text>
          <TouchableOpacity>
            <Ionicons name="notifications-outline" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Main Title */}
        <Text style={styles.mainTitle}>Find out The best meal for diet.</Text>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Feather name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor="#666"
          />
          <Feather name="maximize" size={20} color="#666" />
        </View>

        {/* Categories */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
        >
          {categories.map((category, index) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                index === 0 && styles.activeCategoryButton
              ]}
            >
              <Text style={[
                styles.categoryText,
                index === 0 && styles.activeCategoryText
              ]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Daily Diet Stats - Now Navigates to DailyStatsScreen */}
        <TouchableOpacity onPress={() => navigation.navigate('DailyStatsScreen')}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Daily diet Stats</Text>
            <View style={styles.statsContainer}>
              <View>
                <Text style={styles.statsLabel}>Daily calories</Text>
                <Text style={styles.statsValue}>2070.99</Text>
              </View>
              <View>
                <Text style={styles.statsLabel}>Calories to eat</Text>
                <Text style={styles.statsValue}>400.90</Text>
              </View>
            </View>
            <View style={styles.chartContainer}>
              {dailyStats.map((height, index) => (
                <View
                  key={index}
                  style={[styles.bar, { height: height * 1.2 }]}
                />
              ))}
            </View>
          </View>
        </TouchableOpacity>

        {/* Smoking Stats */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Smoking Stats</Text>
            <TouchableOpacity>
              <Feather name="plus" size={24} color="#06b6d4" />
            </TouchableOpacity>
          </View>
          <View style={styles.statsContainer}>
            <View>
              <Text style={styles.statsLabel}>Puffs Today</Text>
              <Text style={styles.statsValue}>264</Text>
            </View>
            <View>
              <Text style={styles.statsLabel}>Puffs till date</Text>
              <Text style={styles.statsValue}>19,435</Text>
            </View>
          </View>
          <View style={styles.chartContainer}>
            {smokingStats.map((height, index) => (
              <View
                key={index}
                style={[styles.bar, { height: height * 1.2 }]}
              />
            ))}
          </View>
        </View>
        
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollView: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  menuButton: { padding: 8 },
  menuLine: { width: 24, height: 2, backgroundColor: '#666', marginVertical: 2 },
  headerTitle: { fontSize: 18, fontWeight: '500', color: "#208F8F" },
  mainTitle: { fontSize: 24, fontWeight: 'bold', paddingHorizontal: 16, paddingVertical: 8, color: "#208F8F" },
  searchContainer: { flexDirection: 'row', alignItems: 'center', margin: 16, paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#f5f5f5', borderRadius: 12 },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 16 },
  categoriesContainer: { paddingHorizontal: 12, marginBottom: 16 , backgroundColor: '#e0f7fa' },
  categoryButton: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginHorizontal: 4, backgroundColor: 'transparent' },
  activeCategoryButton: { backgroundColor: '#06b6d4' },
  categoryText: { color: '#666', fontSize: 16 },
  activeCategoryText: { color: '#fff' },
  card: { margin: 16, padding: 16, backgroundColor: '#e0f7fa', borderRadius: 16 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: 18, fontWeight: '600', marginBottom: 12,color: "#208F8F" },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 , backgroundColor: '#e0f7fa'},
  statsLabel: { color: '#666', fontSize: 14,},
  statsValue: { color: '#06b6d4', fontSize: 18, fontWeight: 'bold' },
  chartContainer: { height: 120, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  bar: { width: 16, backgroundColor: '#06b6d4', borderRadius: 8, opacity: 0.8 },
});

export default MainScreen;
