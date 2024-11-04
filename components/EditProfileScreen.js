import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Platform,
  Alert,
  Animated,
  Easing,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker'; // For image selection
import { useNavigation } from '@react-navigation/native';

const EditProfileScreen = () => {
  const navigation = useNavigation();

  // State variables for user data
  const [name, setName] = useState(''); // User's name
  const [bio, setBio] = useState(''); // User's bio
  const [photo, setPhoto] = useState(null); // User's profile photo URI
  const [level, setLevel] = useState(1); // User's level for gamification
  const [experience, setExperience] = useState(50); // User's experience points (0-100)

  // Animation state for experience bar
  const progress = useState(new Animated.Value(0))[0];

  // Fetch user data from backend when component mounts
  useEffect(() => {
    // TODO: Fetch user data from backend and set state variables
    // Example:
    // fetchUserData().then(data => {
    //   setName(data.name);
    //   setBio(data.bio);
    //   setPhoto(data.photoUrl);
    //   setLevel(data.level);
    //   setExperience(data.experience);
    //   animateProgress(data.experience / 100);
    // });
    // For demonstration, we'll animate the progress bar
    animateProgress(experience / 100);
  }, []);

  // Function to animate the experience progress bar
  const animateProgress = (toValue) => {
    Animated.timing(progress, {
      toValue: toValue,
      duration: 1000,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  };

  // Function to handle image selection
  const pickImage = async () => {
    // Request permission to access media library
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert('Permission Denied', 'Permission to access camera roll is required!');
      return;
    }

    // Launch image picker
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // Allow images only
      allowsEditing: true, // Allow editing (cropping, etc.)
      aspect: [1, 1], // Aspect ratio of the image
      quality: 0.7, // Image quality
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri); // Update photo state with selected image URI
      // TODO: Upload the selected image to backend or storage service
    }
  };

  // Function to handle saving profile changes
  const saveProfile = () => {
    // Input validation
    if (name.trim() === '') {
      Alert.alert('Validation Error', 'Name cannot be empty.');
      return;
    }

    // TODO: Implement backend integration to save profile changes
    // You might need to upload the photo and then save the user data
    // Example:
    // updateUserData({ name, bio, photo }).then(() => {
    //   Alert.alert('Success', 'Profile updated successfully');
    //   navigation.goBack();
    // }).catch(error => {
    //   Alert.alert('Error', 'Failed to update profile');
    // });

    Alert.alert('Profile Update', 'Profile updated successfully', [
      {
        text: 'Done',
        onPress: () => navigation.goBack(),
      },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          {/* Back Button */}
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#F27A1A" />
          </TouchableOpacity>
          {/* Screen Title */}
          <Text style={styles.headerText}>Edit Profile</Text>
          {/* Save Button */}
          <TouchableOpacity onPress={saveProfile} style={styles.saveButton}>
            <Ionicons name="checkmark" size={28} color="#F27A1A" />
          </TouchableOpacity>
        </View>

        {/* Gamified Level and Experience */}
        <View style={styles.gamificationContainer}>
          <Text style={styles.levelText}>Level {level}</Text>
          <View style={styles.progressBarBackground}>
            <Animated.View
              style={[
                styles.progressBarFill,
                { width: progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) },
              ]}
            />
          </View>
          <Text style={styles.experienceText}>{experience}% to next level</Text>
        </View>

        {/* Profile Image */}
        <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
          {photo ? (
            // Display selected or current photo
            <Image source={{ uri: photo }} style={styles.profileImage} />
          ) : (
            // Placeholder image if no photo is selected
            <View style={styles.placeholderImage}>
              <Ionicons name="person-circle-outline" size={100} color="#ccc" />
            </View>
          )}
          <Text style={styles.changePhotoText}>Change Profile Photo</Text>
        </TouchableOpacity>

        {/* Name Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            value={name}
            onChangeText={(text) => setName(text)}
          />
        </View>

        {/* Bio Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Bio</Text>
          <TextInput
            style={[styles.input, styles.bioInput]}
            placeholder="Enter your bio"
            value={bio}
            onChangeText={(text) => setBio(text)}
            multiline
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // Container style
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  // Header styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Platform.OS === 'android' ? 40 : 20,
    marginBottom: 20,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F27A1A',
    textAlign: 'center',
    flex: 1,
  },
  saveButton: {
    padding: 5,
  },
  // Gamification styles
  gamificationContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  levelText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#F27A1A',
    marginBottom: 10,
  },
  progressBarBackground: {
    width: '90%',
    height: 12,
    backgroundColor: '#eee',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: 12,
    backgroundColor: '#F27A1A',
  },
  experienceText: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  // Profile Image styles
  imageContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 130,
    height: 130,
    borderRadius: 65,
  },
  placeholderImage: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
  },
  changePhotoText: {
    marginTop: 10,
    color: '#F27A1A',
    fontSize: 18,
  },
  // Input styles
  inputContainer: {
    marginBottom: 25,
  },
  label: {
    fontSize: 18,
    color: '#666',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 15,
    fontSize: 18,
    color: '#333',
    backgroundColor: '#f9f9f9',
  },
  bioInput: {
    height: 120,
    textAlignVertical: 'top', // Aligns text at the top for multiline input
  },
});

export default EditProfileScreen;