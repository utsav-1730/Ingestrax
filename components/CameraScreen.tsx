import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useState, useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image, TextInput, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';

export default function App() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [capturedImage, setCapturedImage] = useState<any>(null);
  const [textPrompt, setTextPrompt] = useState('');
  const [resultText, setResultText] = useState<string | null>(null);
  const [resultData, setResultData] = useState(null);
  const apiUrl = 'https://1aw4hjm1bc.execute-api.ca-central-1.amazonaws.com/dev/Image-Recognization';

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  async function takePicture() {
    if (cameraRef.current) {
      const options = { quality: 1, base64: true };
      const photo = await cameraRef.current.takePictureAsync(options);
      console.log(photo);
      setCapturedImage(photo);
    }
  }

  async function pickImage() {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      setCapturedImage({ uri: result.assets[0].uri, base64: result.assets[0].base64 });
    }
  }

  function retakePicture() {
    setCapturedImage(null);
    setTextPrompt('');
  }

  async function sendData() {
    if (capturedImage) {
      console.log("Captured Image Base64:", capturedImage.base64);
      console.log("Text Prompt:", textPrompt);
      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            image_data_base64: capturedImage.base64,
            text: textPrompt || ''
          })
        });

        const result = await response.json();
        console.log("API Response:", result);

        // Extract the 'content' field
        if (result.content) {
          const content = result.content;
          console.log("Content:", content);

          // Extract the JSON block within the content
          const jsonRegex = /```json\n([\s\S]*?)\n```/;
          const match = content.match(jsonRegex);

          if (match && match[1]) {
            const jsonString = match[1];
            try {
              const parsedData = JSON.parse(jsonString);
              console.log("Parsed Data:", parsedData);

              // Set the parsed data to a new state variable
              setResultData(parsedData);
            } catch (parseError) {
              console.error("Error parsing JSON:", parseError);
              setResultText(content);
            }
          } else {
            // If no JSON block is found, set the entire content
            setResultText(content);
          }
        } else if (result.message) {
          setResultText(result.message);
        } else {
          setResultText(JSON.stringify(result));
        }
      } catch (error) {
        console.error("Fetch Error:", error);
      }
    }
  }

  function renderJson(data) {
    return Object.keys(data).map(key => {
      const value = data[key];
      if (typeof value === 'object' && value !== null) {
        return (
          <View key={key} style={{ marginLeft: 10, marginBottom: 5 }}>
            <Text style={{ color: 'white', fontWeight: 'bold' }}>{key}:</Text>
            {renderJson(value)}
          </View>
        );
      } else {
        return (
          <Text key={key} style={{ color: 'white', marginLeft: 20 }}>
            {key}: {String(value)}
          </Text>
        );
      }
    });
  }

  if (resultData) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.resultTitle}>Analysis Result:</Text>
        <View style={{ width: '90%' }}>
          {renderJson(resultData)}
        </View>
        <TouchableOpacity style={styles.sendButton} onPress={() => { setResultData(null); setCapturedImage(null); }}>
          <Text style={styles.sendButtonText}>Back</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  if (resultText) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.resultText}>{resultText}</Text>
        <TouchableOpacity style={styles.sendButton} onPress={() => { setResultText(null); setCapturedImage(null); }}>
          <Text style={styles.sendButtonText}>Back</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  if (capturedImage) {
    return (
      <View style={styles.container}>
        <Image source={{ uri: capturedImage.uri }} style={styles.capturedImage} />
        <TextInput
          style={styles.textInput}
          placeholder="Add a description..."
          onChangeText={text => setTextPrompt(text)}
          value={textPrompt}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={retakePicture}>
            <Ionicons name="camera-reverse" size={32} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.sendButton} onPress={sendData}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={pickImage}>
            <Ionicons name="images" size={32} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
            <View style={styles.captureButtonInner} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Ionicons name="camera-reverse" size={32} color="white" />
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 20,
    color: 'white',
    fontSize: 16,
  },
  permissionButton: {
    backgroundColor: '#007AFF',
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
    backgroundColor: '#F27A1A',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 5,
    borderColor: '#F27A1A',
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
  },
  sendButton: {
    backgroundColor: '#F27A1A',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  resultTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
});
