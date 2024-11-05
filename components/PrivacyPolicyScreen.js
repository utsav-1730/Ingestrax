// PrivacyPolicyScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PrivacyPolicyScreen = () => {
  const [policy, setPolicy] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching privacy policy
    const fetchPrivacyPolicy = async () => {
      try {
        const response = { policyText: samplePrivacyPolicy };
        if (response && response.policyText) {
          setPolicy(response.policyText);
        } else {
          setPolicy('Unable to load Privacy Policy at this time.');
        }
      } catch (error) {
        console.error('Error fetching privacy policy:', error);
        setPolicy('Unable to load Privacy Policy at this time.');
      } finally {
        setLoading(false);
      }
    };

    fetchPrivacyPolicy();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#F27A1A" />
      </View>
    );
  }

  return (
    <View style={styles.screenContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => {/* Add navigation back logic */}}>
          <Ionicons name="arrow-back" size={28} color="#F27A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
      </View>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Our Privacy Commitment</Text>
        <Text style={styles.content}>{policy}</Text>
      </ScrollView>
    </View>
  );
};

const samplePrivacyPolicy = `
  Welcome to our Privacy Policy page! Your privacy is critically important to us.
  We only collect the information that is necessary to provide our services to you.

  What Information Do We Collect?
  - Personal identification information (Name, email address, phone number, etc.)
  - Usage data (how you use our app, features you use the most, etc.)
  - Device information (such as IP address, browser type, operating system, etc.)

  How Do We Use Your Information?
  - To provide, operate, and maintain our app services.
  - To improve and personalize user experience.
  - To communicate with you, including for customer service and support.
  - To send you updates, notifications, and promotional messages (you can opt-out at any time).
  - To prevent fraudulent activity and ensure compliance with our policies.

  How Do We Protect Your Information?
  - We implement a variety of security measures to maintain the safety of your personal information.
  - We use encryption, secure networks, and access controls to protect your data.

  Sharing Your Information
  - We do not sell, trade, or otherwise transfer your personal information to outside parties without your consent, except to trusted third parties who assist us in operating our app, conducting our business, or servicing you, under strict confidentiality agreements.

  Cookies and Tracking Technologies
  - Our app may use cookies and similar tracking technologies to enhance your experience. You can control the use of cookies through your device settings.

  User Responsibilities
  - Ensure that the personal information you provide is accurate and up to date.
  - Do not share your account details with others.

  Data Retention
  - We retain your personal information only as long as it is necessary for the purposes outlined in this policy.
  - After that, your data will be deleted or anonymized to ensure your privacy.

  Third-Party Services
  - The BEGLZ app may contain links to third-party websites or services. We are not responsible for the privacy practices of those third parties.

  Children's Privacy
  - Our services are not intended for individuals under the age of 13. We do not knowingly collect personal information from children under 13.

  Your Consent
  By using our services, you consent to our Privacy Policy.

  Changes to This Privacy Policy
  - We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
  - It is your responsibility to review this Privacy Policy periodically for any updates.

  Contact Us
  For more detailed information, or if you have questions or concerns about our privacy practices, feel free to contact us at privacy@ourcompany.com.
`;

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#dddddd',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#F27A1A',
    marginLeft: 10,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 15,
    color: '#333333',
    textAlign: 'center',
  },
  content: {
    fontSize: 16,
    color: '#666666',
    lineHeight: 24,
    textAlign: 'justify',
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
});

export default PrivacyPolicyScreen;
