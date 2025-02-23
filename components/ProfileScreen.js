import React, { useState } from 'react';
import { 
  View, Text, Image, TouchableOpacity, StyleSheet, Modal, SafeAreaView, ScrollView, Dimensions 
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'react-native-image-picker';

const { width } = Dimensions.get('window');

const ProfileScreen = () => {
  const [profileData, setProfileData] = useState({
    name: 'Jason Duooo',
    goal: 'Weight Gain',
    profileImage: null
  });

  const [modalVisible, setModalVisible] = useState(false);

  const handleImageUpload = () => {
    ImagePicker.launchImageLibrary({ mediaType: 'photo', quality: 1 }, (response) => {
      if (response.didCancel) return;
      if (response.error) {
        console.log('Image Picker Error: ', response.error);
      } else if (response.assets) {
        setProfileData((prev) => ({
          ...prev,
          profileImage: response.assets[0].uri
        }));
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>

        {/* Header */}
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="black" />
        </TouchableOpacity>

        {/* Profile Image */}
        <View style={styles.profileContainer}>
          <Image
            source={{ uri: profileData.profileImage || 'https://via.placeholder.com/150' }}
            style={styles.profileImage}
          />
          <TouchableOpacity style={styles.cameraIcon} onPress={handleImageUpload}>
            <Ionicons name="camera" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* User Details */}
        <View style={styles.card}>
          <View style={styles.detailRow}>
            <Ionicons name="person-outline" size={22} color="#00bcd4" />
            <Text style={styles.detailText}>{profileData.name}</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="barbell-outline" size={22} color="#00bcd4" />
            <Text style={styles.detailText}>{profileData.goal}</Text>
          </View>
          <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.editButton}>
            <Text style={styles.editText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Menu Options */}
        <View style={styles.card}>
          <TouchableOpacity style={styles.optionRow}>
            <Ionicons name="stats-chart-outline" size={22} color="#00bcd4" />
            <Text style={styles.optionText}>Statistics</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionRow}>
            <Ionicons name="settings-outline" size={22} color="#00bcd4" />
            <Text style={styles.optionText}>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionRow}>
            <Ionicons name="log-out-outline" size={22} color="red" />
            <Text style={[styles.optionText, { color: 'red' }]}>Log out</Text>
          </TouchableOpacity>
        </View>

        {/* Edit Modal */}
        <Modal visible={modalVisible} transparent animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                <Ionicons name="close" size={26} color="black" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={handleImageUpload}>
                <Text style={styles.buttonText}>Change Profile Picture</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  scrollContainer: { alignItems: 'center', paddingVertical: 20 },

  backButton: { position: 'absolute', top: 20, left: 20, zIndex: 10 },
  
  profileContainer: { alignItems: 'center', marginTop: 80 },
  profileImage: { width: 140, height: 140, borderRadius: 70, borderWidth: 3, borderColor: '#00bcd4' },
  cameraIcon: { 
    position: 'absolute', bottom: 5, right: 5, backgroundColor: '#00bcd4', 
    padding: 10, borderRadius: 30, shadowColor: '#000', shadowOpacity: 0.2, elevation: 5 
  },

  card: { 
    backgroundColor: 'white', padding: 20, borderRadius: 20, marginVertical: 15, 
    width: width * 0.9, elevation: 5, shadowColor: '#000', shadowOpacity: 0.1 
  },

  detailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  detailText: { fontSize: 18, marginLeft: 12, color: '#333' },

  editButton: { alignSelf: 'center', marginTop: 10 },
  editText: { color: '#00bcd4', fontSize: 16, fontWeight: 'bold' },

  optionRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
  optionText: { fontSize: 18, marginLeft: 12, color: '#333' },

  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { backgroundColor: 'white', padding: 20, borderRadius: 10, width: '80%', alignItems: 'center' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  closeButton: { position: 'absolute', top: 10, right: 10 },
  button: { marginTop: 20, backgroundColor: '#00bcd4', padding: 12, borderRadius: 8 },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});

export default ProfileScreen;
