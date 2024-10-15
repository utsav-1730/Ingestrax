import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Auth } from 'aws-amplify';
import { Ionicons } from '@expo/vector-icons';
import { Camera } from './CameraScreen';

const MainScreen = ({ navigation }) => {
  const handleSignOut = async () => {
    try {
      await Auth.signOut();
      navigation.navigate('Login');
    } catch (error) {
      console.log('Error signing out: ', error);
    }
  };

  const navigateToCamera = () => {
    navigation.navigate('Camera'); // Assuming 'Camera' is the name of your Camera screen
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to Beglz</Text>

      <TouchableOpacity style={styles.button} onPress={handleSignOut}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>

      {/* Icon button positioned at the bottom middle */}
      <TouchableOpacity style={styles.iconButton} onPress={navigateToCamera}>
        <Ionicons name="camera" size={32} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#e74c3c',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  iconButton: {
    position: 'absolute',
    bottom: 30, // Position the button at the bottom
    backgroundColor: '#F27A1A', // Orange color for the button
    padding: 15,
    borderRadius: 50, // Makes the button round
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MainScreen;
