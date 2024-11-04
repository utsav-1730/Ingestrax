// Import necessary modules and components
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  TextInput,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import * as Animatable from 'react-native-animatable';
import Modal from 'react-native-modal';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

export default function App() {
  // State variables
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [textPrompt, setTextPrompt] = useState('');
  const [resultData, setResultData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // New state for active modal
  const apiUrl =
    'https://1aw4hjm1bc.execute-api.ca-central-1.amazonaws.com/dev/Image-Recognization';

  // If camera permissions are not yet granted, request them
  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    // Show a message requesting camera permissions
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera 📷
        </Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={requestPermission}
        >
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Function to toggle camera between front and back
  function toggleCameraFacing() {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  }

  // Function to take a picture using the camera
  async function takePicture() {
    if (cameraRef.current) {
      const options = { quality: 1, base64: true };
      const photo = await cameraRef.current.takePictureAsync(options);
      console.log(photo);
      setCapturedImage(photo);
    }
  }

  // Function to pick an image from the device gallery
  async function pickImage() {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      setCapturedImage({
        uri: result.assets[0].uri,
        base64: result.assets[0].base64,
      });
    }
  }

  // Function to reset the captured image and text prompt
  function retakePicture() {
    setCapturedImage(null);
    setTextPrompt('');
  }

  // Function to send image data to the API
  async function sendData() {
    if (capturedImage) {
      try {
        setLoading(true); // Start loading indicator

        // Compress the image to reduce size
        const compressedImage = await ImageManipulator.manipulateAsync(
          capturedImage.uri,
          [],
          { compress: 0, format: ImageManipulator.SaveFormat.JPEG, base64: true }
        );

        console.log('Compressed Image Base64:', compressedImage.base64);
        console.log('Text Prompt:', textPrompt);

        // Send a POST request to the API with the image data and text prompt
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            image_data_base64: compressedImage.base64,
            text: textPrompt || '',
          }),
        });

        const result = await response.json();
        console.log('API Response:', result);

        // Assuming the API returns JSON directly in result.content
        if (result.content) {
          try {
            const parsedData =
              typeof result.content === 'string'
                ? JSON.parse(result.content)
                : result.content;
            console.log('Parsed Data:', parsedData);

            // Set the parsed data to the state variable
            setResultData(parsedData);
          } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
            alert('Error parsing data from server.');
          }
        } else if (result.message) {
          alert(result.message);
        } else {
          alert('Unexpected response from server.');
        }
      } catch (error) {
        console.error('Fetch Error:', error);
        alert('Error communicating with server.');
      } finally {
        setLoading(false); // Stop loading indicator
      }
    }
  }

  // If loading is true, display the loading indicator
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        {/* Animated Loading Indicator */}
        <Animatable.Image
          animation="rotate"
          iterationCount="infinite"
          easing="linear"
          source={require('../assets/logo.png')} // Replace with your own loading image
          style={styles.loadingImage}
        />
        <Text style={{ color: 'white', marginTop: 20, fontSize: 18 }}>
          Processing... ⏳
        </Text>
      </View>
    );
  }

  // If resultData is available, display the analysis result
  if (resultData) {
    // Extract the necessary data from resultData
    const nutritionInfo = resultData.nutrition_info || {};
    const score = resultData.score || {};
    const criteria = score.criteria || {};

    // Determine if the food is harmful based on the score
    const isHarmful = score.total < 50; // Adjust this threshold as needed
    const statusText = isHarmful ? 'Harmful ' : 'Risk-Free ';
    const statusColor = isHarmful ? '#FF4500' : '#32CD32';

    return (
      <ScrollView contentContainerStyle={styles.resultContainer}>
        {/* Animated View for Result */}
        <Animatable.View
          animation="fadeInUp"
          duration={800}
          style={{ width: '100%', alignItems: 'center' }}
        >
          {/* Display the animated score */}
          <AnimatedCircularProgress
            size={200}
            width={15}
            fill={score.total}
            tintColor={statusColor}
            backgroundColor="#3d5875"
            duration={2000}
            rotation={0}
            lineCap="round"
            style={{ marginTop: 20 }}
          >
            {(fill) => (
              <View style={styles.scoreContainer}>
                <Text style={styles.scoreText}>{Math.round(fill)}%</Text>
                <Text style={[styles.statusText, { color: statusColor }]}>
                  {statusText}
                </Text>
              </View>
            )}
          </AnimatedCircularProgress>

          {/* Buttons for each section */}
          <View style={styles.buttonGroup}>
            {/* Processed Chemicals Button */}
            <TouchableOpacity
              style={styles.sectionButton}
              onPress={() => setActiveModal('processed_chemicals')}
            >
              <Text style={styles.sectionButtonText}>
                Processed Chemicals 🔬
              </Text>
            </TouchableOpacity>

            {/* Vulnerable Groups Button */}
            <TouchableOpacity
              style={styles.sectionButton}
              onPress={() => setActiveModal('vulnerable_groups')}
            >
              <Text style={styles.sectionButtonText}>
                Vulnerable Groups 🛡️
              </Text>
            </TouchableOpacity>

            {/* Nutrition Info Button */}
            <TouchableOpacity
              style={styles.sectionButton}
              onPress={() => setActiveModal('nutrition_info')}
            >
              <Text style={styles.sectionButtonText}>Nutrition Info 🥗</Text>
            </TouchableOpacity>

            {/* Alternative Recipes Button */}
            <TouchableOpacity
              style={styles.sectionButton}
              onPress={() => setActiveModal('alternative_recipes')}
            >
              <Text style={styles.sectionButtonText}>
                Alternative Recipes 🍲
              </Text>
            </TouchableOpacity>

            {/* Additional Nutrients Button */}
            <TouchableOpacity
              style={styles.sectionButton}
              onPress={() => setActiveModal('additional_nutrients')}
            >
              <Text style={styles.sectionButtonText}>
                Additional Nutrients 🌿
              </Text>
            </TouchableOpacity>
          </View>

          {/* Name of the food item */}
          <View style={styles.nameBox}>
            <Text style={styles.resultTitle}>{nutritionInfo.name} </Text>
          </View>

          {/* "Back" button to return to the previous screen */}
          <TouchableOpacity
            style={[styles.sendButton, { marginTop: 20 }]}
            onPress={() => {
              setResultData(null);
              setCapturedImage(null);
            }}
          >
            <Text style={styles.sendButtonText}>Back</Text>
          </TouchableOpacity>
        </Animatable.View>

        {/* Modals for each section */}
        {renderModalContent(
          activeModal,
          resultData,
          isHarmful,
          () => setActiveModal(null)
        )}
      </ScrollView>
    );
  }

  // If an image has been captured or selected, show it with options
  if (capturedImage) {
    return (
      <View style={styles.container}>
        {/* Display the captured image */}
        <Image source={{ uri: capturedImage.uri }} style={styles.capturedImage} />
        {/* Text input for adding a description */}
        <TextInput
          style={styles.textInput}
          placeholder="Add a description... 📝"
          placeholderTextColor="#888"
          onChangeText={(text) => setTextPrompt(text)}
          value={textPrompt}
        />
        <View style={styles.buttonContainer}>
          {/* Button to retake or reselect an image */}
          <TouchableOpacity style={styles.button} onPress={retakePicture}>
            <Ionicons name="camera-reverse" size={32} color="white" />
          </TouchableOpacity>
          {/* Button to send data to the API */}
          <TouchableOpacity style={styles.sendButton} onPress={sendData}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Default screen showing the camera
  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
        <View style={styles.buttonContainer}>
          {/* Button to pick an image from the gallery */}
          <TouchableOpacity style={styles.button} onPress={pickImage}>
            <Ionicons name="images" size={32} color="white" />
          </TouchableOpacity>
          {/* Capture button */}
          <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
            <View style={styles.captureButtonInner} />
          </TouchableOpacity>
          {/* Button to toggle camera facing */}
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Ionicons name="camera-reverse" size={32} color="white" />
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );

  // Function to render modal content based on active modal
  function renderModalContent(activeModal, data, isHarmful, closeModal) {
    if (!activeModal) return null;

    let content = null;
    let title = '';

    switch (activeModal) {
      case 'processed_chemicals':
        title = 'Processed Chemicals 🔬';
        content = (
          <ScrollView>
            {data.processed_chemicals && data.processed_chemicals.length > 0 ? (
              data.processed_chemicals.map((item, index) => (
                <View key={index} style={styles.modalItem}>
                  <Text style={styles.modalItemTitle}>{item.chemical_name}</Text>
                  <Text style={styles.modalItemText}>
                    Function in Food: {item.function_in_food}
                  </Text>
                  <Text style={styles.modalItemText}>
                    Non-Food Industrial Uses: {item.non_food_industrial_uses}
                  </Text>
                </View>
              ))
            ) : (
              <Text style={styles.modalItemText}>
                No processed chemicals detected.
              </Text>
            )}
          </ScrollView>
        );
        break;

      case 'vulnerable_groups':
        title = 'Vulnerable Groups 🛡️';
        content = (
          <ScrollView>
            {data.vulnerable_groups &&
            data.vulnerable_groups.avoid_if &&
            data.vulnerable_groups.avoid_if.length > 0 ? (
              data.vulnerable_groups.avoid_if.map((item, index) => (
                <View key={index} style={styles.modalItem}>
                  <Text style={styles.modalItemTitle}>{item.group}</Text>
                  <Text style={styles.modalItemText}>Reason: {item.reason}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.modalItemText}>
                No vulnerable groups specified.
              </Text>
            )}
          </ScrollView>
        );
        break;

      case 'nutrition_info':
        title = 'Nutrition Info 🥗';
        // Define nutritionInfo here
        const nutritionInfo = data.nutrition_info || {};
        content = (
          <View style={styles.nutritionContainer}>
            {[
              'calories',
              'fat',
              'sugar',
              'protein',
              'carbohydrates',
              'fiber',
              'sodium',
              'cholesterol',
            ].map((item) => (
              <View
                key={item}
                style={[
                  styles.nutritionBox,
                  {
                    backgroundColor: isHarmful ? '#FF6347' : '#2E8B57',
                  },
                ]}
              >
                <Text style={styles.nutritionTitle}>
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </Text>
                <Text style={styles.nutritionValue}>{nutritionInfo[item]}</Text>
              </View>
            ))}
          </View>
        );
        break;

      case 'alternative_recipes':
        title = 'Alternative Recipes 🍲';
        content = (
          <ScrollView>
            {data.alternative_recipes && data.alternative_recipes.length > 0 ? (
              data.alternative_recipes.map((item, index) => (
                <View key={index} style={styles.modalItem}>
                  <Text style={styles.modalItemTitle}>{item.name}</Text>
                  <Text style={styles.modalItemText}>{item.description}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.modalItemText}>
                No alternative recipes available.
              </Text>
            )}
          </ScrollView>
        );
        break;

      case 'additional_nutrients':
        title = 'Additional Nutrients 🌿';
        content = (
          <ScrollView>
            {data.nutrition_info.additional_nutrients &&
            data.nutrition_info.additional_nutrients.length > 0 ? (
              data.nutrition_info.additional_nutrients.map((item, index) => (
                <View key={index} style={styles.modalItem}>
                  <Text style={styles.modalItemTitle}>{item.name}</Text>
                  <Text style={styles.modalItemText}>Amount: {item.amount}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.modalItemText}>
                No additional nutrients specified.
              </Text>
            )}
          </ScrollView>
        );
        break;

      default:
        return null;
    }

    return (
      <Modal
        isVisible={true}
        onBackdropPress={closeModal}
        animationIn="zoomIn"
        animationOut="zoomOut"
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{title}</Text>
          {content}
          <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }
}

// Styles for the components
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#1a1a1a', // Black background
    alignItems: 'center',
    paddingVertical: 20,
  },
  resultContainer: {
    flexGrow: 1,
    backgroundColor: '#1a1a1a', // Black background
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#1a1a1a', // Black background
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingImage: {
    width: 100,
    height: 100,
  },
  message: {
    textAlign: 'center',
    paddingBottom: 20,
    color: 'white',
    fontSize: 16,
  },
  permissionButton: {
    backgroundColor: '#F27A1A', // Orange color
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 20,
    marginTop: 20,
  },
  permissionButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 30,
    width: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 15,
  },
  button: {
    width: 60,
    height: 60,
    backgroundColor: '#F27A1A', // Orange color
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 5,
    borderColor: '#F27A1A', // Orange color
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    backgroundColor: 'white',
  },
  capturedImage: {
    width: '100%',
    height: '70%',
    borderRadius: 20,
    marginBottom: 20,
  },
  textInput: {
    width: '90%',
    height: 50,
    borderColor: '#B0BEC5',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: '#FFF',
    fontSize: 16,
    marginBottom: 45,
    color: 'black',
  },
  sendButton: {
    backgroundColor: '#F27A1A', // Orange color
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    shadowColor: '#F27A1A', // Orange color
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 5,
  },
  sendButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  scoreContainer: {
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 48,
    color: 'white',
    fontWeight: 'bold',
  },
  statusText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  buttonGroup: {
    marginTop: 30,
    width: '100%',
    alignItems: 'center',
  },
  sectionButton: {
    backgroundColor: '#F27A1A', // Orange color
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    marginVertical: 8,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#F27A1A', // Orange color
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 5,
  },
  sectionButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  nameBox: {
    backgroundColor: '#2b2b2b',
    padding: 15,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 20,
    width: '90%',
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },
  resultTitle: {
    color: '#F27A1A', // Orange color
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalContent: {
    backgroundColor: '#1E1E1E',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    maxHeight: '80%',
  },
  modalTitle: {
    color: '#F27A1A', // Orange color
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalItem: {
    marginBottom: 15,
  },
  modalItemTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalItemText: {
    color: '#fff',
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: '#F27A1A', // Orange color
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 25,
    marginTop: 20,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  nutritionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  nutritionBox: {
    width: '40%',
    margin: 8,
    padding: 15,
    borderRadius: 20,
    alignItems: 'center',
  },
  nutritionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  nutritionValue: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
});
