import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  SafeAreaView,
  ScrollView,
  TextInput,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ExploreScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState([]);

  const trendingRecipes = [
    { id: 1, name: 'Healthy Salad 🥗', imageUrl: 'https://via.placeholder.com/150' },
    { id: 2, name: 'Vegan Smoothie 🥤', imageUrl: 'https://via.placeholder.com/150' },
  ];

  const trendingHashtags = ['#Healthy', '#Vegan', '#LowCarb', '#ProteinRich'];

  const topUsers = [
    { id: 1, username: 'HealthGuru', healthScore: 95, level: 'Gold 🥇' },
    { id: 2, username: 'FitLife', healthScore: 90, level: 'Silver 🥈' },
  ];

  const handleSearch = () => {
    console.log('Searching for:', searchQuery);
  };

  const navigateToRecipe = (recipeId) => {
    console.log('Navigating to recipe with ID:', recipeId);
  };

  const navigateToUserProfile = (userId) => {
    console.log('Navigating to user profile with ID:', userId);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Custom Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Explore</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search friends, recipes, hashtags..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
        />
      </View>

      {/* Filters with Emojis */}
      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {/* Sample filters with emojis */}
          {[
            { label: 'All', emoji: '✨' },
            { label: 'Vegan', emoji: '🌱' },
            { label: 'Low Carb', emoji: '🥦' },
            { label: 'High Protein', emoji: '💪' },
            { label: 'Gluten Free', emoji: '🚫🌾' },
          ].map((filter, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.filterButton,
                selectedFilters.includes(filter.label) && styles.filterButtonActive,
              ]}
              onPress={() => {
                setSelectedFilters((prevFilters) =>
                  prevFilters.includes(filter.label)
                    ? prevFilters.filter((f) => f !== filter.label)
                    : [...prevFilters, filter.label]
                );
              }}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  selectedFilters.includes(filter.label) && styles.filterButtonTextActive,
                ]}
              >
                {filter.emoji} {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Main Content */}
      <ScrollView style={styles.mainContent}>
        {/* Trending Recipes Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔥 Trending Recipes</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {trendingRecipes.map((recipe) => (
              <TouchableOpacity
                key={recipe.id}
                style={styles.recipeCard}
                onPress={() => navigateToRecipe(recipe.id)}
                activeOpacity={0.8}
              >
                <Image source={{ uri: recipe.imageUrl }} style={styles.recipeImage} />
                <Text style={styles.recipeName}>{recipe.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Trending Hashtags Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📈 Trending Hashtags</Text>
          <View style={styles.hashtagsContainer}>
            {trendingHashtags.map((hashtag, index) => (
              <TouchableOpacity key={index} style={styles.hashtagButton}>
                <Text style={styles.hashtagText}>{hashtag}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Top 100 Users Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🏆 Top 100 Users</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          {topUsers.slice(0, 5).map((user, index) => (
            <TouchableOpacity
              key={user.id}
              style={styles.userCard}
              onPress={() => navigateToUserProfile(user.id)}
              activeOpacity={0.7}
            >
              <View style={styles.userInfo}>
                <View style={styles.userAvatar}>
                  <Text style={styles.userRank}>{index + 1}</Text>
                </View>
                <View>
                  <Text style={styles.username}>{user.username}</Text>
                  <Text style={styles.userLevel}>{user.level}</Text>
                </View>
              </View>
              <Text style={styles.healthScore}>Health Score: {user.healthScore}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingTop: Platform.OS === 'android' ? 40 : 10,
    paddingBottom: 10,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  headerText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#F27A1A',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 15,
    marginBottom: 10,
    paddingHorizontal: 15,
    borderRadius: 25,
    backgroundColor: '#f2f2f2',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  filtersContainer: {
    paddingVertical: 10,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#f2f2f2',
    marginLeft: 10,
    marginBottom: 5,
  },
  filterButtonActive: {
    backgroundColor: '#F27A1A',
    shadowColor: '#F27A1A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  filterButtonText: {
    fontSize: 14,
    color: '#666',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  mainContent: {
    flex: 1,
  },
  section: {
    marginVertical: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    paddingHorizontal: 20,
  },
  viewAllText: {
    color: '#F27A1A',
    fontSize: 14,
  },
  recipeCard: {
    width: 160,
    marginLeft: 20,
    marginRight: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    overflow: 'hidden',
    shadowColor: '#aaa',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  recipeImage: {
    width: '100%',
    height: 120,
    backgroundColor: '#ddd',
  },
  recipeName: {
    margin: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#262626',
  },
  hashtagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
  },
  hashtagButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
    backgroundColor: '#f2f2f2',
    marginRight: 10,
    marginBottom: 10,
  },
  hashtagText: {
    fontSize: 14,
    color: '#666',
  },
  userCard: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F27A1A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  userRank: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  userLevel: {
    fontSize: 14,
    color: '#F27A1A',
    marginTop: 2,
  },
  healthScore: {
    fontSize: 14,
    color: '#666',
  }
});

export default ExploreScreen;