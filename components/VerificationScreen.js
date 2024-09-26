import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Auth } from 'aws-amplify';

const VerificationScreen = ({ route, navigation }) => {
  const [verificationCode, setVerificationCode] = useState('');
  const { username } = route.params;

  const handleVerification = async () => {
    try {
      await Auth.confirmSignUp(username, verificationCode);
      Alert.alert('Success', 'Account verified successfully!', [
        { text: 'OK', onPress: () => navigation.navigate('Login') }
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
    <View style={styles.container}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  resendButton: {
    marginTop: 20,
  },
  resendButtonText: {
    color: '#3498db',
    fontSize: 16,
  },
});

export default VerificationScreen;