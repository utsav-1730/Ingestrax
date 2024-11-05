// components/StoryCreation.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Video } from 'expo-av';

const StoryCreation = ({ navigation }) => {
  const [selectedMedia, setSelectedMedia] = useState(null);

  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'You need to grant camera permissions to use this feature.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 5],
      quality: 1,
    });

    if (!result.cancelled) {
      setSelectedMedia(result);
    }
  };

  const openGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'You need to grant gallery permissions to use this feature.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 5],
      quality: 1,
    });

    if (!result.cancelled) {
      setSelectedMedia(result);
    }
  };

  const handlePostStory = () => {
    // Backend Integration Point: Upload story to the server
    if (selectedMedia) {
      console.log('Posting story:', selectedMedia);
      Alert.alert('Story Posted', 'Your story has been successfully uploaded!');
      setSelectedMedia(null);
      navigation.goBack();
    } else {
      Alert.alert('No Media Selected', 'Please add media to create your story.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
          <Ionicons name="close" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Create Story</Text>
      </View>

      {/* Selected Media Preview */}
      {selectedMedia && (
        <View style={styles.previewContainer}>
          {selectedMedia.type === 'video' ? (
            <Video
              source={{ uri: selectedMedia.uri }}
              rate={1.0}
              volume={1.0}
              isMuted={false}
              resizeMode="cover"
              shouldPlay
              isLooping
              style={styles.previewMedia}
            />
          ) : (
            <Image source={{ uri: selectedMedia.uri }} style={styles.previewMedia} />
          )}
        </View>
      )}

      {/* Options */}
      <View style={styles.optionsContainer}>
        <TouchableOpacity style={styles.optionButton} onPress={openCamera}>
          <Ionicons name="camera-outline" size={28} color="#F27A1A" />
          <Text style={styles.optionText}>Take Photo/Video</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionButton} onPress={openGallery}>
          <Ionicons name="image-outline" size={28} color="#F27A1A" />
          <Text style={styles.optionText}>Choose from Gallery</Text>
        </TouchableOpacity>
      </View>

      {/* Post Button */}
      <TouchableOpacity style={styles.postButton} onPress={handlePostStory}>
        <Text style={styles.postButtonText}>Post Story</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  iconButton: {
    paddingHorizontal: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#262626',
    marginLeft: 10,
  },
  previewContainer: {
    width: '100%',
    height: '50%',
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewMedia: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
  },
  optionButton: {
    alignItems: 'center',
    paddingVertical: 15,
  },
  optionText: {
    marginTop: 5,
    fontSize: 14,
    color: '#666',
  },
  postButton: {
    marginHorizontal: 20,
    marginTop: 'auto',
    backgroundColor: '#F27A1A',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  postButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default StoryCreation;
