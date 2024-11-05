import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Auth } from 'aws-amplify';

const SettingsScreen = () => {
  const navigation = useNavigation();

  // Placeholder states for toggles - to be replaced with real data from backend
  const [profileVisibility, setProfileVisibility] = React.useState(true);
  const [dataSharing, setDataSharing] = React.useState(false);
  const [cameraPermission, setCameraPermission] = React.useState(true);
  const [locationPermission, setLocationPermission] = React.useState(true);
  const [notificationsPermission, setNotificationsPermission] = React.useState(false);

  const handleSignOut = async () => {
    try {
      await Auth.signOut();
      navigation.navigate('Login');
    } catch (error) {
      console.log('Error signing out: ', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Account Privacy Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Account Privacy</Text>
        {/* Profile Visibility */}
        <View style={styles.settingItemContainer}>
          <View style={styles.settingTextContainer}>
            <Ionicons name="eye-outline" size={24} color="#262626" />
            <Text style={styles.settingText}>Profile Visibility</Text>
          </View>
          <Switch
            value={profileVisibility}
            onValueChange={(value) => setProfileVisibility(value)}
            trackColor={{ true: '#F27A1A', false: '#ddd' }}
          />
        </View>
        {/* Data Sharing Preferences */}
        <View style={styles.settingItemContainer}>
          <View style={styles.settingTextContainer}>
            <Ionicons name="share-social-outline" size={24} color="#262626" />
            <Text style={styles.settingText}>Data Sharing Preferences</Text>
          </View>
          <Switch
            value={dataSharing}
            onValueChange={(value) => setDataSharing(value)}
            trackColor={{ true: '#F27A1A', false: '#ddd' }}
          />
        </View>
      </View>

      {/* Device Permissions Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Device Permissions</Text>
        {/* Camera Permission */}
        <View style={styles.settingItemContainer}>
          <View style={styles.settingTextContainer}>
            <MaterialCommunityIcons name="camera-outline" size={24} color="#262626" />
            <Text style={styles.settingText}>Camera</Text>
          </View>
          <Switch
            value={cameraPermission}
            onValueChange={(value) => setCameraPermission(value)}
            trackColor={{ true: '#F27A1A', false: '#ddd' }}
          />
        </View>
        {/* Location Permission */}
        <View style={styles.settingItemContainer}>
          <View style={styles.settingTextContainer}>
            <Ionicons name="location-outline" size={24} color="#262626" />
            <Text style={styles.settingText}>Location</Text>
          </View>
          <Switch
            value={locationPermission}
            onValueChange={(value) => setLocationPermission(value)}
            trackColor={{ true: '#F27A1A', false: '#ddd' }}
          />
        </View>
        {/* Notifications Permission */}
        <View style={styles.settingItemContainer}>
          <View style={styles.settingTextContainer}>
            <Ionicons name="notifications-outline" size={24} color="#262626" />
            <Text style={styles.settingText}>Notifications</Text>
          </View>
          <Switch
            value={notificationsPermission}
            onValueChange={(value) => setNotificationsPermission(value)}
            trackColor={{ true: '#F27A1A', false: '#ddd' }}
          />
        </View>
      </View>

      {/* Help Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Help</Text>
        {/* FAQ */}
        <TouchableOpacity
          style={styles.settingItemContainer}
          onPress={() => navigation.navigate('FAQScreen')}
        >
          <View style={styles.settingTextContainer}>
            <Ionicons name="help-circle-outline" size={24} color="#262626" />
            <Text style={styles.settingText}>FAQ</Text>
          </View>
        </TouchableOpacity>
        {/* Contact Support */}
        <TouchableOpacity
          style={styles.settingItemContainer}
          onPress={() => navigation.navigate('ContactSupportScreen')}
        >
          <View style={styles.settingTextContainer}>
            <Ionicons name="chatbubbles-outline" size={24} color="#262626" />
            <Text style={styles.settingText}>Contact Support</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Legal Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Legal</Text>
        {/* Privacy Policy */}
        <TouchableOpacity 
          style={styles.settingItemContainer} 
          onPress={() => navigation.navigate('PrivacyPolicyScreen')}
        >
          <View style={styles.settingTextContainer}>
            <Ionicons name="document-text-outline" size={24} color="#262626" />
            <Text style={styles.settingText}>Privacy Policy</Text>
          </View>
        </TouchableOpacity>
        {/* Terms of Use */}
        <TouchableOpacity 
          style={styles.settingItemContainer} 
          onPress={() => navigation.navigate('TermsOfUseScreen')}
        >
          <View style={styles.settingTextContainer}>
            <Ionicons name="clipboard-outline" size={24} color="#262626" />
            <Text style={styles.settingText}>Terms of Use</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Sign Out Section */}
      <View style={styles.sectionContainer}>
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Ionicons name="log-out-outline" size={24} color="#fff" />
          <Text style={styles.signOutButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  sectionContainer: {
    marginVertical: 15,
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#262626',
    marginBottom: 20,
  },
  settingItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e6e6e6',
  },
  settingTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 18,
    color: '#333333',
    marginLeft: 15,
  },
  signOutButton: {
    flexDirection: 'row',
    backgroundColor: '#F27A1A',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  signOutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
  },
});

export default SettingsScreen;

// TODO: Implement backend data fetching and updating functionality for each setting.
// Each setting should be tied to the backend to save the user preferences.
// Example: Use async functions with API calls to save profile visibility, data sharing, and permission toggles.
