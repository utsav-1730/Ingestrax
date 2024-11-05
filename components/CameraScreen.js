// components/CameraScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  SafeAreaView,
  StatusBar,
  TextInput,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { useNavigation } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';

const CameraScreen = () => {
  const navigation = useNavigation();

  // State variables
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [loading, setLoading] = useState(false);
  const [textPrompt, setTextPrompt] = useState('');
  const apiUrl =
    'https://1aw4hjm1bc.execute-api.ca-central-1.amazonaws.com/dev/Image-Recognization';

  // Function to open the camera
  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'You need to grant camera permissions to use this feature.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 5],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setSelectedMedia(result.assets[0]);
    }
  };

  // Function to open the gallery
  const openGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'You need to grant gallery permissions to use this feature.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 5],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setSelectedMedia(result.assets[0]);
    }
  };

  // Function to send image data to the API
  const sendData = async () => {
    if (selectedMedia) {
      try {
        setLoading(true); // Start loading indicator

        // Compress the image to reduce size
        const compressedImage = await ImageManipulator.manipulateAsync(
          selectedMedia.uri,
          [],
          { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG, base64: true }
        );

        // Send a POST request to the API with the image data
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            image_data_base64: compressedImage.base64,
            text: textPrompt,
          }),
        });

        const result = await response.json();

        // Assuming the API returns JSON directly in result.content
        if (result.content) {
          try {
            const parsedData =
              typeof result.content === 'string'
                ? JSON.parse(result.content)
                : result.content;

            // Ensure all expected fields are available
            if (parsedData && Object.keys(parsedData).length > 0) {
              // Navigate to the ResultScreen with the parsed data
              navigation.navigate('ResultScreen', { resultData: parsedData });
            } else {
              Alert.alert('Error', 'Received empty or invalid data from server.');
            }
          } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
            Alert.alert('Error', 'Failed to parse data from server.');
          }
        } else if (result.message) {
          Alert.alert('Error', result.message);
        } else {
          Alert.alert('Error', 'Unexpected response from server.');
        }
      } catch (error) {
        console.error('Fetch Error:', error);
        Alert.alert('Error', 'Failed to communicate with server.');
      } finally {
        setLoading(false); // Stop loading indicator
      }
    } else {
      Alert.alert('No Image Selected', 'Please select an image before sending.');
    }
  };

  // If loading is true, display the loading indicator
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        {/* Animated Loading Indicator */}
        <Animatable.Image
          animation="rotate"
          iterationCount="infinite"
          easing="linear"
          source={require('../assets/logo.png')} // Ensure this path is correct or replace with an existing image
          style={styles.loadingImage}
        />
        <Text style={styles.loadingText}>Processing... ⏳</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {/* Selected Media Preview */}
        {selectedMedia && (
          <View style={styles.previewContainer}>
            <Image source={{ uri: selectedMedia.uri }} style={styles.previewMedia} />
          </View>
        )}

        {/* Options */}
        <View style={styles.optionsContainer}>
          <TouchableOpacity style={styles.enhancedButton} onPress={openCamera}>
            <Ionicons name="camera-outline" size={32} color="white" />
            <Text style={styles.enhancedButtonText}>Take Photo/Video</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.enhancedButton} onPress={openGallery}>
            <Ionicons name="image-outline" size={32} color="white" />
            <Text style={styles.enhancedButtonText}>Choose from Gallery</Text>
          </TouchableOpacity>
        </View>

        {/* Text Input for Prompt */}
        <View style={styles.promptContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Enter a description..."
            placeholderTextColor="#888"
            value={textPrompt}
            onChangeText={(text) => setTextPrompt(text)}
          />
          {/* Send Button */}
          <TouchableOpacity style={styles.sendButton} onPress={sendData}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Styles for the CameraScreen component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    padding: 20,
  },
  previewContainer: {
    width: '100%',
    height: 300,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 20,
  },
  previewMedia: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  promptContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 15,
    marginBottom: 20,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    paddingRight: 10,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    marginBottom: 20,
  },
  enhancedButton: {
    backgroundColor: '#F27A1A',
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#F27A1A',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 5,
    width: '45%',
  },
  enhancedButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
  },
  sendButton: {
    backgroundColor: '#32CD32',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#32CD32',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 5,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingImage: {
    width: 100,
    height: 100,
  },
  loadingText: {
    color: 'white',
    marginTop: 20,
    fontSize: 18,
  },
});

export default CameraScreen;
