import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

const CongratulationsScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Celebration Animation */}
      <Image source={require('../assets/congratulations.png')} style={styles.confetti} />
      
      {/* Title */}
      <Text style={styles.title}>Congratulations</Text>
      
      {/* Description */}
      <Text style={styles.description}>
        You are enrolled in our most choosen programme!
      </Text>
      
      {/* Continue Button */}
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('MainScreen')}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
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
  confetti: {
    width: 200,
    height: 150,
    marginBottom: 30,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#00A3FF',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#7C7C7C',
    textAlign: 'center',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#5FD6D3',
    padding: 15,
    borderRadius: 25,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CongratulationsScreen;
