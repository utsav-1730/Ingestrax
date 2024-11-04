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

const SettingsScreen = () => {
  const navigation = useNavigation();

  // Placeholder states for toggles - to be replaced with real data from backend
  const [profileVisibility, setProfileVisibility] = React.useState(true);
  const [dataSharing, setDataSharing] = React.useState(false);
  const [cameraPermission, setCameraPermission] = React.useState(true);
  const [locationPermission, setLocationPermission] = React.useState(true);
  const [notificationsPermission, setNotificationsPermission] = React.useState(false);

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

      {/* Subscription Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Subscription</Text>
        {/* Current Plan Display */}
        <View style={styles.settingItemContainer}>
          <View style={styles.settingTextContainer}>
            <Ionicons name="card-outline" size={24} color="#262626" />
            <Text style={styles.settingText}>Current Plan: Basic</Text>
          </View>
        </View>
        {/* Available Plans */}
        <TouchableOpacity style={styles.upgradeButton} onPress={() => {}}>
          <Text style={styles.upgradeButtonText}>Upgrade Plan</Text>
        </TouchableOpacity>
      </View>

      {/* Help Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Help</Text>
        {/* FAQ */}
        <TouchableOpacity
          style={styles.settingItemContainer}
          onPress={() => navigation.navigate('FAQ')}
        >
          <View style={styles.settingTextContainer}>
            <Ionicons name="help-circle-outline" size={24} color="#262626" />
            <Text style={styles.settingText}>FAQ</Text>
          </View>
        </TouchableOpacity>
        {/* Contact Support */}
        <TouchableOpacity
          style={styles.settingItemContainer}
          onPress={() => navigation.navigate('ContactSupport')}
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
        <TouchableOpacity style={styles.settingItemContainer} onPress={() => {}}>
          <View style={styles.settingTextContainer}>
            <Ionicons name="document-text-outline" size={24} color="#262626" />
            <Text style={styles.settingText}>Privacy Policy</Text>
          </View>
        </TouchableOpacity>
        {/* Terms of Use */}
        <TouchableOpacity style={styles.settingItemContainer} onPress={() => {}}>
          <View style={styles.settingTextContainer}>
            <Ionicons name="clipboard-outline" size={24} color="#262626" />
            <Text style={styles.settingText}>Terms of Use</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  sectionContainer: {
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#262626',
    marginBottom: 15,
  },
  settingItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  settingTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 18,
    color: '#262626',
    marginLeft: 10,
  },
  upgradeButton: {
    backgroundColor: '#F27A1A',
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 20,
  },
  upgradeButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default SettingsScreen;

// TODO: Implement backend data fetching and updating functionality for each setting.
// Each setting should be tied to the backend to save the user preferences.
// Example: Use async functions with API calls to save profile visibility, data sharing, and permission toggles.
