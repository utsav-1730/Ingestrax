import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Auth } from 'aws-amplify';

const MainScreen = ({ navigation }) => {
  const handleSignOut = async () => {
    try {
      await Auth.signOut();
      navigation.navigate('Login');
    } catch (error) {
      console.log('Error signing out: ', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello World!</Text>
      <TouchableOpacity style={styles.button} onPress={handleSignOut}>
        <Text style={styles.buttonText}>Sign Out</Text>
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
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default MainScreen;