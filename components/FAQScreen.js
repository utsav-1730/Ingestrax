// FAQScreen.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';

const FAQScreen = () => {
  // Sample FAQ data
  const faqs = [
    {
      question: 'How do I reset my password?',
      answer: 'To reset your password, go to the settings screen and select "Change Password". Follow the instructions sent to your email.',
    },
    {
      question: 'How do I contact support?',
      answer: 'You can contact support by navigating to the Contact Support screen from the Help section.',
    },
    // Add more FAQs as needed
  ];

  return (
    <ScrollView style={styles.container}>
      {faqs.map((faq, index) => (
        <View key={index} style={styles.faqItem}>
          <Text style={styles.question}>{faq.question}</Text>
          <Text style={styles.answer}>{faq.answer}</Text>
        </View>
      ))}
      {/* Example of linking to a website */}
      <TouchableOpacity onPress={() => Linking.openURL('https://beglz.com/contact')}>
        <Text style={styles.link}>Visit our website for more information</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  faqItem: {
    marginBottom: 20,
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 8,
    elevation: 2,
  },
  question: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333333',
  },
  answer: {
    fontSize: 14,
    color: '#555555',
  },
  link: {
    color: '#F27A1A',
    textAlign: 'center',
    marginTop: 20,
    textDecorationLine: 'underline',
  },
});

export default FAQScreen;
