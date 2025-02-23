import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Image
} from 'react-native';
import { Auth } from 'aws-amplify';

const VerificationScreen = ({ route, navigation }) => {
  const [verificationCode, setVerificationCode] = useState('');
  const { username, setIsNewUser } = route.params;

  const handleVerification = async () => {
    try {
      await Auth.confirmSignUp(username, verificationCode);
      Alert.alert('Success', 'Account verified successfully!', [
        { text: 'OK', onPress: () => navigation.replace('Selection') } // Redirect to Selection Screen
      ]);
    } catch (error) {
      console.log('Error confirming sign up', error);
      Alert.alert('Error', error.message || 'An error occurred during verification.');
    }
  };
  

  const handleResendCode = async () => {
    try {
      await Auth.resendSignUp(username);
      Alert.alert('Success', 'Verification code resent successfully.');
    } catch (error) {
      console.log('Error resending code: ', error);
      Alert.alert('Error', error.message || 'An error occurred while resending the code.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.select({ ios: 0, android: 500 })}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo */}
        <Image source={require('../assets/logo.png')} style={styles.logo} />

        <Text style={styles.title}>Verify Your Account</Text>
        <Text style={styles.subtitle}>Enter the verification code sent to your email</Text>
        <TextInput
          style={styles.input}
          placeholder="Verification Code"
          value={verificationCode}
          onChangeText={setVerificationCode}
          keyboardType="number-pad"
        />
        <TouchableOpacity style={styles.button} onPress={handleVerification}>
          <Text style={styles.buttonText}>Verify</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.resendButton} onPress={handleResendCode}>
          <Text style={styles.resendButtonText}>Resend Code</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#208F8F',
    marginBottom: 30,
  },
  subtitle: {
    fontSize: 16,
    color: '#7C7C7C',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#D1D1D1',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: '#F9F9F9',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#5FD6D3',
    padding: 15,
    borderRadius: 10,
    width: '100%',
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
  resendButton: {
    marginTop: 20,
  },
  resendButtonText: {
    color: '#00A3FF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default VerificationScreen;
