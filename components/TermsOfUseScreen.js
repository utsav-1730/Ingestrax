// TermsOfUseScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { API } from 'aws-amplify'; // Assuming you're using AWS Amplify for API calls
import { useNavigation } from '@react-navigation/native';

const TermsOfUseScreen = () => {
  const [terms, setTerms] = useState('');
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchTermsOfUse = async () => {
      try {
        const response = await API.get('beglzAPI', '/terms-of-use');
        if (response && response.termsText) {
          setTerms(response.termsText);
        } else {
          setTerms(defaultTermsContent);
        }
      } catch (error) {
        console.log('Error fetching terms of use:', error);
        setTerms(defaultTermsContent);
      } finally {
        setLoading(false);
      }
    };

    fetchTermsOfUse();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#F27A1A" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Terms of Use</Text>
      <Text style={styles.content}>{terms}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.acceptButton} 
          onPress={() => {
            alert('You accepted the Terms of Use!');
            navigation.navigate('Settings');
          }}
        >
          <Text style={styles.buttonText}>Accept</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.declineButton} 
          onPress={() => {
            alert('You declined the Terms of Use!');
          }}
        >
          <Text style={styles.buttonText}>Decline</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const defaultTermsContent = `
  Welcome to our application! Please read these Terms of Use carefully before using our services.

  1. **Acceptance of Terms**: By accessing and using this application, you accept and agree to be bound by these terms. If you do not agree, you must not use our services.

  2. **Modification of Terms**: We reserve the right to change or modify these terms at any time. Any changes will be effective immediately upon posting, and your continued use constitutes acceptance of those changes.

  3. **User Responsibilities**: You agree to use the application only for lawful purposes and in a way that does not infringe the rights of others or restrict their use. Remember, no using the app to summon dark forces or conduct intergalactic trade unless you have our express permission.

  4. **Account Security**: You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account. If you lose your password, we recommend you don't panic, and definitely don't write it on a sticky note on your computer.

  5. **Termination**: We reserve the right to suspend or terminate your access if you violate these terms. If you summon the aforementioned dark forces, consider your access terminated.

  6. **Limitation of Liability**: We are not liable for any damages that may result from the use of this application. This includes, but is not limited to, damages from alien abductions, spontaneous combustion, or your cat deciding to claw your device while you use the app.

  7. **Governing Law**: These terms shall be governed by and construed in accordance with the laws of the jurisdiction in which our company operates. So, if you find yourself in a heated argument over our app, just know that we're abiding by the rules (mostly).

  8. **Random Awesome Terms**:
    - You shall not use this app while attempting to learn how to time travel. Any disruption in the space-time continuum is on you.
    - If you find a bug and report it, you may or may not receive a virtual high-five. No promises.
    - You agree to be awesome while using this app. Non-awesome behavior includes, but is not limited to, trolling, spamming, and general negativity.

  9. **Indemnity**: You agree to indemnify and hold us harmless from any claim or demand, including reasonable attorney's fees, made by any third party due to or arising out of your use of the app, your violation of these terms, or your violation of any rights of another. Basically, don't get us in trouble and we'll do the same for you.

  10. **Contact Us**: If you have questions about these terms, feel free to contact us. Carrier pigeons are not an acceptable form of communication.

  Thank you for taking the time to read our Terms of Use. By clicking 'Accept', you agree to comply with these terms. Remember, be awesome, don’t break the laws of physics, and enjoy using our app!
`;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
    color: '#333333',
  },
  content: {
    fontSize: 16,
    color: '#555555',
    lineHeight: 24,
    marginBottom: 30,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  declineButton: {
    backgroundColor: '#F44336',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default TermsOfUseScreen;
