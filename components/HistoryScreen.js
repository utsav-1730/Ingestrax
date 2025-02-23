import React, { useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  StyleSheet,
  TextInput,
  SafeAreaView
} from 'react-native';
import { Feather } from '@expo/vector-icons';

const generateSyntheticData = () => {
  const foods = [
    { name: 'Idli', calories: 48, image: require('../assets/idli.png') },
    { name: 'Banana', calories: 117, image: require('../assets/banana.png') },
    { name: 'Aloo Paratha', calories: 182, image: require('../assets/paratha.png') },
    { name: 'Eggs', calories: 86, image: require('../assets/eggs.png') },
    { name: 'Cow\'s Milk', calories: 167, image: require('../assets/milk.png') },
    { name: 'Coffee', calories: 135, image: require('../assets/coffee.png') },
  ];

  const generateRandomDateTime = () => {
    const daysAgo = Math.floor(Math.random() * 7);
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    
    const hours = Math.floor(Math.random() * 24);
    const minutes = Math.floor(Math.random() * 60);
    date.setHours(hours, minutes);

    return {
      date: date.toISOString().split('T')[0],
      time: date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    };
  };

  return Array.from({ length: 50 }, (_, index) => {
    const food = foods[Math.floor(Math.random() * foods.length)];
    const { date, time } = generateRandomDateTime();
    
    return {
      id: String(index + 1),
      foodName: food.name,
      calories: food.calories,
      serving: `${Math.floor(Math.random() * 3) + 1} serving`,
      image: food.image,
      date,
      time
    };
  }).sort((a, b) => new Date(b.date + ' ' + b.time) - new Date(a.date + ' ' + a.time));
};

const HistoryScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const historySyntheticData = generateSyntheticData();
  
  const filteredHistory = historySyntheticData.filter(item => 
    item.foodName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderHistoryItem = ({ item }) => (
    <TouchableOpacity style={styles.historyItemContainer}>
      <Image 
        source={item.image} 
        style={styles.foodImage} 
      />
      <View style={styles.historyItemDetails}>
        <View style={styles.historyItemHeader}>
          <Text style={styles.foodName}>{item.foodName}</Text>
          <Text style={styles.caloriesText}>{item.calories} Cal</Text>
        </View>
        <Text style={styles.servingText}>{item.serving}</Text>
        <View style={styles.dateTimeContainer}>
          <Text style={styles.dateText}>{item.date}</Text>
          <Text style={styles.timeText}>{item.time}</Text>
        </View>
      </View>
      <Feather name="chevron-right" size={24} color="#666" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Food History</Text>
        <View style={styles.searchContainer}>
          <Feather name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput 
            placeholder="Search food history" 
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>
      
      <FlatList 
        data={filteredHistory}
        renderItem={renderHistoryItem}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No food items found</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  headerContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#208F8F',
    marginBottom: 15,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  historyItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  foodImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 15,
  },
  historyItemDetails: {
    flex: 1,
  },
  historyItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  foodName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  caloriesText: {
    fontSize: 14,
    color: '#06b6d4',
    fontWeight: 'bold',
  },
  servingText: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  dateText: {
    fontSize: 12,
    color: '#999',
  },
  timeText: {
    fontSize: 12,
    color: '#999',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
  },
});

export default HistoryScreen;