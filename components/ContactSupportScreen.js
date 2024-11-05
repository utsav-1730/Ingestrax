// ContactSupportScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Auth } from 'aws-amplify';

const ContactSupportScreen = () => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');

  const handleSend = async () => {
    if (!subject || !message || !email) {
      Alert.alert('Error', 'Please fill in subject, message, and email.');
      return;
    }

    try {
      // Example: Send the support request to your backend or email
      // Replace this with your actual API call
      // await api.sendSupportRequest({ subject, message, email, userId: Auth.currentAuthenticatedUser().username });
      
      Alert.alert('Success', 'Your message has been sent to support.');
      setSubject('');
      setMessage('');
      setEmail('');
    } catch (error) {
      console.log('Error sending support request:', error);
      Alert.alert('Error', 'There was an issue sending your message. Please try again later.');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1, backgroundColor: '#f8f8f8' }} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Contact Support</Text>
        <Text style={styles.subHeader}>We're here to help. Fill in the details below and we'll get back to you.</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="#F27A1A" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
        </View>
        <View style={styles.inputContainer}>
          <Ionicons name="document-text-outline" size={20} color="#F27A1A" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Subject"
            value={subject}
            onChangeText={setSubject}
          />
        </View>
        <View style={[styles.inputContainer, styles.messageContainer]}>
          <Ionicons name="chatbubbles-outline" size={20} color="#F27A1A" style={styles.icon} />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Your message"
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />
        </View>
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendButtonText}>Send Message</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  subHeader: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
    elevation: 2,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#333333',
  },
  messageContainer: {
    height: 150,
    paddingTop: 10,
  },
  textArea: {
    height: '100%',
  },
  sendButton: {
    backgroundColor: '#F27A1A',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    elevation: 2,
  },
  sendButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ContactSupportScreen;

// Backend Implementation Comments:
// 1. Replace the `handleSend` function with your backend API integration.
// 2. Use the `Auth.currentAuthenticatedUser()` to get the user's ID or email for tracking support requests.
// 3. Use appropriate error handling mechanisms for the API call to ensure reliability.
// 4. Ensure that email and message validation are done server-side as well to prevent spam or incorrect data submissions.
// 5. Optionally, store the support request in a database for better user support tracking.
