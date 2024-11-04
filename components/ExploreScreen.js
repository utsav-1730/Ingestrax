// ExploreScreen.js

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
  // State variables for search query and selected filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState([]);

  // Sample data for demonstration purposes
  // TODO: Replace with data fetched from your backend
  const trendingRecipes = [
    {
      id: 1,
      name: 'Healthy Salad 🥗',
      imageUrl: 'https://via.placeholder.com/150',
    },
    {
      id: 2,
      name: 'Vegan Smoothie 🥤',
      imageUrl: 'https://via.placeholder.com/150',
    },
    // Add more recipes as needed
  ];

  const trendingHashtags = ['#Healthy', '#Vegan', '#LowCarb', '#ProteinRich'];

  const topUsers = [
    { id: 1, username: 'HealthGuru', healthScore: 95, level: 'Gold 🥇' },
    { id: 2, username: 'FitLife', healthScore: 90, level: 'Silver 🥈' },
    // Add more users as needed
  ];

  // Function to handle search functionality
  const handleSearch = () => {
    // TODO: Implement search functionality with backend
    console.log('Searching for:', searchQuery);
  };

  // Function to navigate to the Recipe Detail screen
  const navigateToRecipe = (recipeId) => {
    // TODO: Implement navigation to RecipeDetail screen
    // navigation.navigate('RecipeDetail', { id: recipeId });
    console.log('Navigating to recipe with ID:', recipeId);
  };

  // Function to navigate to the User Profile screen
  const navigateToUserProfile = (userId) => {
    // TODO: Implement navigation to UserProfile screen
    // navigation.navigate('UserProfile', { id: userId });
    console.log('Navigating to user profile with ID:', userId);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
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
                // Toggle filter selection
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
            <TouchableOpacity
              onPress={() => {
                // TODO: Navigate to full list of top users
              }}
            >
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          {/* Display top users (limiting to top 5 for brevity) */}
          {topUsers.slice(0, 5).map((user, index) => (
            <TouchableOpacity
              key={user.id}
              style={styles.userCard}
              onPress={() => navigateToUserProfile(user.id)}
              activeOpacity={0.7}
            >
              <View style={styles.userInfo}>
                <View style={styles.userAvatar}>
                  {/* You can replace this with user's avatar */}
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

      {/* Task Bar */}
      <View style={styles.taskBar}>
        <TouchableOpacity style={styles.tabButton} onPress={() => navigation.navigate('Main')}>
          <Ionicons name="home" size={24} color="#666" />
          <Text style={styles.tabText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabButton}>
          <Ionicons name="compass" size={24} color="#F27A1A" />
          <Text style={[styles.tabText, styles.activeTabText]}>Explore</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabButton} onPress={() => navigation.navigate('Camera')}>
          <Ionicons name="scan" size={24} color="#666" />
          <Text style={styles.tabText}>Scan</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabButton} onPress={() => navigation.navigate('Profile')}>
          <Ionicons name="person" size={24} color="#666" />
          <Text style={styles.tabText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// Styles for the ExploreScreen component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    // Header styling
    paddingTop: Platform.OS === 'android' ? 40 : 10,
    paddingBottom: 10,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  headerText: {
    // Header text styling
    fontSize: 26,
    fontWeight: 'bold',
    color: '#F27A1A',
  },
  searchContainer: {
    // Search bar container styling
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
    // Search icon styling
    marginRight: 10,
  },
  searchInput: {
    // Search input field styling
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  filtersContainer: {
    // Filters container styling
    paddingVertical: 10,
  },
  filterButton: {
    // Filter button styling
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
    // Active filter button styling
    backgroundColor: '#F27A1A',
    shadowColor: '#F27A1A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  filterButtonText: {
    // Filter button text styling
    fontSize: 14,
    color: '#666',
  },
  filterButtonTextActive: {
    // Active filter button text styling
    color: '#fff',
  },
  mainContent: {
    // Main content styling
    flex: 1,
  },
  section: {
    // Section styling
    marginVertical: 15,
  },
  sectionHeader: {
    // Section header styling
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    // Section title styling
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  viewAllText: {
    // 'View All' text styling
    color: '#F27A1A',
    fontSize: 14,
  },
  recipeCard: {
    // Recipe card styling
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
    // Recipe image styling
    width: '100%',
    height: 120,
    backgroundColor: '#ddd',
  },
  recipeName: {
    // Recipe name text styling
    margin: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#262626',
  },
  hashtagsContainer: {
    // Hashtags container styling
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
  },
  hashtagButton: {
    // Hashtag button styling
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
    backgroundColor: '#f2f2f2',
    marginRight: 10,
    marginBottom: 10,
  },
  hashtagText: {
    // Hashtag text styling
    fontSize: 14,
    color: '#666',
  },
  userCard: {
    // User card styling
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {
    // User info styling
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    // User avatar styling
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F27A1A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  userRank: {
    // User rank text styling
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  username: {
    // Username text styling
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  userLevel: {
    // User level styling
    fontSize: 14,
    color: '#F27A1A',
    marginTop: 2,
  },
  healthScore: {
    // Health score text styling
    fontSize: 14,
    color: '#666',
  },
  taskBar: {
    // Task bar styling
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingBottom: Platform.OS === 'ios' ? 25 : 15,
  },
  tabButton: {
    // Tab button styling
    alignItems: 'center',
  },
  tabText: {
    // Tab text styling
    fontSize: 12,
    marginTop: 4,
    color: '#666',
  },
  activeTabText: {
    // Active tab text styling
    color: '#F27A1A',
  },
});

export default ExploreScreen;
