import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

const SelectionScreen = ({ navigation }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);

  const options = [
    { title: 'Weight gain', icon: require('../assets/weight_gain.png') },
    { title: 'Weight loss', icon: require('../assets/weight_loss.png') },
    { title: 'Salad', icon: require('../assets/salad.png') },
    { title: 'Yoga', icon: require('../assets/yoga.png') },
    { title: 'Home workout', icon: require('../assets/home_workout.png') },
    { title: 'Calorie management', icon: require('../assets/calorie_management.png') }
  ];

  const toggleSelection = (title) => {
    setSelectedOptions((prevSelected) =>
      prevSelected.includes(title)
        ? prevSelected.filter((item) => item !== title)
        : [...prevSelected, title]
    );
  };

  return (
    <View style={styles.container}>
      {/* Skip Button */}
      <TouchableOpacity onPress={() => navigation.navigate('NextScreen')} style={styles.skipContainer}>
        <Text style={styles.skipText}>skip &gt;</Text>
      </TouchableOpacity>
      
      {/* Heading */}
      <Text style={styles.heading}>Please Select what you want here</Text>
      <Text style={styles.subHeading}>
      Select your focus areas and let Ingestrax guide you with personalized health and fitness recommendations tailored to your goals.
      </Text>
      
      {/* Options Grid */}
      <View style={styles.gridContainer}>
        {options.map((item, index) => (
          <TouchableOpacity 
            key={index} 
            style={[styles.optionBox, selectedOptions.includes(item.title) && styles.selectedOption]} 
            onPress={() => toggleSelection(item.title)}
          >
            <Image source={item.icon} style={styles.icon} />
            <Text style={styles.optionText}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  skipContainer: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  skipText: {
    fontSize: 16,
    color: '#7C7C7C',
  },
  heading: {
    fontSize: 29,
    fontWeight: 'bold',
    color: '#208F8F',
    marginBottom: 20,
    textAlign: 'center',
  },
  subHeading: {
    fontSize: 14,
    color: '#7C7C7C',
    textAlign: 'center',
    marginBottom: 30,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  optionBox: {
    width: '47%',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  selectedOption: {
    backgroundColor: '#D9F7F5',
  },
  icon: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  optionText: {
    fontSize: 16,
    color: '#2C2C2C',
  },
});

export default SelectionScreen;
