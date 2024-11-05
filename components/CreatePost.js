// components/CreatePost.js
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  Image, 
  ActivityIndicator, 
  Alert, 
  Platform,
  SafeAreaView,
  ScrollView,
  Dimensions,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Video } from 'expo-av';
import { Storage, API, graphqlOperation, Auth } from 'aws-amplify';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Placeholder for the `createPost` mutation.
// Replace this with your actual mutation once backend is implemented.
const CREATE_POST_MUTATION = `
  mutation CreatePost($input: CreatePostInput!) {
    createPost(input: $input) {
      id
      caption
      media
      mediaType
      createdAt
      updatedAt
    }
  }
`;

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const CreatePost = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  // State to hold the selected media (image or video)
  const [media, setMedia] = useState(null); // { uri, type: 'image' | 'video' }
  
  // State to hold the caption input by the user
  const [caption, setCaption] = useState('');
  
  // State to indicate if the upload is in progress
  const [uploading, setUploading] = useState(false);

  /**
   * useEffect hook to request media library permissions when the component mounts.
   * This ensures that the app has the necessary permissions to access the user's media.
   */
  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);

  /**
   * Function to launch the media library and allow the user to pick an image or video.
   */
  const pickMedia = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All, // Allow both images and videos
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const selectedMedia = result.assets[0];
      const type = selectedMedia.type === 'video' ? 'video' : 'image';
      setMedia({ uri: selectedMedia.uri, type });
    }
  };

  /**
   * Function to launch the camera and allow the user to take a new photo or video.
   */
  const takeMedia = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need camera permissions to make this work!');
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All, // Allow both images and videos
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const selectedMedia = result.assets[0];
      const type = selectedMedia.type === 'video' ? 'video' : 'image';
      setMedia({ uri: selectedMedia.uri, type });
    }
  };

  /**
   * Function to upload the selected media to AWS S3 using Amplify Storage.
   * Returns the key of the uploaded media if successful, otherwise null.
   */
  const uploadMedia = async () => {
    if (!media) return null;

    try {
      // Fetch the media from the local URI
      const response = await fetch(media.uri);
      const blob = await response.blob();

      // Generate a unique filename using the current timestamp
      const fileName = media.uri.split('/').pop();
      const s3FileName = `${Date.now()}-${fileName}`;

      // Upload the media to S3
      const result = await Storage.put(s3FileName, blob, {
        contentType: media.type === 'video' ? 'video/mp4' : 'image/jpeg', // Set the appropriate content type
      });

      return result.key; // Return the S3 key of the uploaded media
    } catch (error) {
      console.log('Error uploading media:', error);
      Alert.alert('Upload Error', 'There was an error uploading your media. Please try again.');
      return null;
    }
  };

  /**
   * Function to handle the submission of a new post.
   * - Validates that media is selected.
   * - Uploads the media to S3.
   * - Executes the `createPost` mutation to save the post in the backend.
   * - Provides feedback to the user upon success or failure.
   */
  const handleSubmit = async () => {
    if (!media) {
      Alert.alert('No Media Selected', 'Please select an image or video to post.');
      return;
    }

    setUploading(true);

    // Upload the selected media and get the S3 key
    const mediaKey = await uploadMedia();
    if (!mediaKey) {
      setUploading(false);
      return;
    }

    try {
      // Get the current authenticated user
      const user = await Auth.currentAuthenticatedUser();
      const userId = user.attributes.sub; // Unique user ID

      // Prepare the input for the `createPost` mutation
      const input = {
        caption: caption,
        media: mediaKey,
        mediaType: media.type,
        userId: userId, // Associate post with user
      };

      // Execute the `createPost` mutation
      await API.graphql(graphqlOperation(CREATE_POST_MUTATION, { input }));

      // Show success alert to the user
      Alert.alert('Success', 'Your post has been created!');

      // Navigate back to the main screen
      navigation.goBack();

      /**
       * TODO:
       * - Once the backend is implemented, ensure that the main feed fetches and displays the new post.
       * - Consider using state management (e.g., Context API or Redux) to update the main feed in real-time.
       */
    } catch (error) {
      console.log('Error creating post:', error);
      Alert.alert('Post Error', 'There was an error creating your post. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  /**
   * Function to remove the selected media.
   * This allows users to re-select or change their media before submitting the post.
   */
  const removeMedia = () => {
    setMedia(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
            <Ionicons name="close" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Create Post</Text>
          {/* Placeholder for alignment; can add more buttons if needed */}
          <View style={styles.iconButton} />
        </View>

        {/* Media Selector */}
        <TouchableOpacity style={styles.mediaSelector} onPress={pickMedia}>
          {media ? (
            media.type === 'video' ? (
              // Display video preview if the selected media is a video
              <Video
                source={{ uri: media.uri }}
                rate={1.0}
                volume={1.0}
                isMuted={false}
                resizeMode="cover"
                shouldPlay={false}
                isLooping
                style={styles.mediaPreview}
              />
            ) : (
              // Display image preview if the selected media is an image
              <Image source={{ uri: media.uri }} style={styles.mediaPreview} />
            )
          ) : (
            // Display a placeholder prompting the user to select media
            <View style={styles.placeholder}>
              <Ionicons name="add" size={50} color="#ccc" />
              <Text style={styles.placeholderText}>Select an Image or Video</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Buttons to Pick or Take Media */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.secondaryButton} onPress={pickMedia}>
            <Ionicons name="images-outline" size={24} color="#F27A1A" />
            <Text style={styles.buttonText}>Gallery</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={takeMedia}>
            <Ionicons name="camera-outline" size={24} color="#F27A1A" />
            <Text style={styles.buttonText}>Camera</Text>
          </TouchableOpacity>
          {media && (
            <TouchableOpacity style={styles.secondaryButton} onPress={removeMedia}>
              <Ionicons name="trash-outline" size={24} color="#F27A1A" />
              <Text style={styles.buttonText}>Remove</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Caption Input */}
        <TextInput
          style={styles.captionInput}
          placeholder="Write a caption..."
          multiline
          value={caption}
          onChangeText={setCaption}
        />

        {/* Submit Button */}
        <TouchableOpacity 
          style={[styles.submitButton, uploading && styles.buttonDisabled]} 
          onPress={handleSubmit}
          disabled={uploading}
        >
          {uploading ? (
            // Show loading indicator while uploading
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Post</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

// Stylesheet for the CreatePost component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    padding: 20,
    alignItems: 'center',
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  iconButton: {
    padding: 10,
  },
  headerText: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#262626',
    textAlign: 'center',
  },
  mediaSelector: {
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_HEIGHT * 0.35,
    borderWidth: 2,
    borderColor: '#F27A1A',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#fafafa',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#ccc',
    marginTop: 10,
    fontSize: 16,
  },
  mediaPreview: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    marginBottom: 20,
    justifyContent: 'space-between',
    width: SCREEN_WIDTH * 0.9,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderColor: '#F27A1A',
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginHorizontal: 5,
    flex: 1,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 2,
  },
  buttonText: {
    marginLeft: 8,
    color: '#F27A1A',
    fontSize: 16,
    fontWeight: '600',
  },
  captionInput: {
    width: SCREEN_WIDTH * 0.9,
    minHeight: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 12,
    padding: 15,
    textAlignVertical: 'top',
    marginBottom: 20,
    fontSize: 16,
    color: '#262626',
    backgroundColor: '#fafafa',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 2,
  },
  submitButton: {
    backgroundColor: '#F27A1A',
    paddingVertical: 15,
    borderRadius: 12,
    width: SCREEN_WIDTH * 0.9,
    alignItems: 'center',
    shadowColor: '#F27A1A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
  buttonDisabled: {
    backgroundColor: '#FFA07A',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CreatePost;
