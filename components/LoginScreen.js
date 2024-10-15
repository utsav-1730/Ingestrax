import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { Auth } from 'aws-amplify';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await Auth.signIn(email, password);
      navigation.navigate('Main');
    } catch (error) {
      console.log('Error signing in:', error);
      Alert.alert('Error', error.message || 'An error occurred while signing in.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image source={require('../assets/logo.png')} style={styles.logo} />
      {/* Rotated Text */}
      <View style={styles.rotatedTextContainer}>
        <Text style={styles.rotatedText}>B  E  G  L  Z</Text>
      </View>

      {/* Sign In Form */}
      <TextInput
        style={styles.input}
        placeholder="Enter your Username or Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Enter your Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Sign in</Text>
      </TouchableOpacity>

      {/* Footer Text */}
      <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
        <Text style={styles.forgotText}>Forgot Password?</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.signupText}>Create Account</Text>
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
    backgroundColor: '#FFEDDB', // Light, clean background color
  },
  logo: {
    width: 200, // Adjust size to your needs
    height: 100,
    marginBottom: 20,
    justifyContent: 'center',
  },
  rotatedTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '60%',
    marginBottom: 30,
  },
  rotatedText: {
    fontSize: 20,
    color: '#F27A1A',
    justifyContent: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#B0BEC5', // Lighter border color for a polished look
    borderWidth: 1,
    marginBottom: 15, // Spacing between inputs
    paddingHorizontal: 15,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    fontSize: 16,
    elevation: 2, // Subtle shadow for input fields
  },
  button: {
    backgroundColor: '#F27A1A', // Keep the orange button color
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    elevation: 5, // Add shadow for a polished button feel
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  forgotText: {
    marginTop: 20,
    color: '#F27A1A',
    fontSize: 16, // Match font size consistency
  },
  signupText: {
    marginTop: 20,
    color: '#F27A1A',
    fontSize: 16, // Match font size consistency
  },
});


export default LoginScreen;