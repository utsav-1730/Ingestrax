// components/ResultScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Modal from 'react-native-modal';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import * as Animatable from 'react-native-animatable';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const ResultScreen = ({ route, navigation }) => {
  const { resultData } = route.params || {};
  const insets = useSafeAreaInsets();

  // State to manage active modal
  const [activeModal, setActiveModal] = useState(null);

  useEffect(() => {
    if (!resultData || Object.keys(resultData).length === 0) {
      Alert.alert('Error', 'No data received from the server.', [
        { text: 'Go Back', onPress: () => navigation.goBack() },
      ]);
    }
  }, [resultData]);

  // Extract necessary data from resultData
  const nutritionInfo = resultData?.nutrition_info || {};
  const score = resultData?.score || {};
  const criteria = score?.criteria || {};

  // Determine if the food is harmful based on the score
  const isHarmful = score?.total < 50; // Adjust this threshold as needed
  const statusText = isHarmful ? 'Harmful' : 'Risk-Free';
  const statusColor = isHarmful ? '#FF4500' : '#32CD32';

  // Function to render modal content based on active modal
  const renderModalContent = () => {
    if (!activeModal) return null;

    let content = null;
    let title = '';

    switch (activeModal) {
      case 'processed_chemicals':
        title = 'Processed Chemicals 🔬';
        content = (
          <ScrollView>
            {nutritionInfo.processed_chemicals && nutritionInfo.processed_chemicals.length > 0 ? (
              nutritionInfo.processed_chemicals.map((item, index) => (
                <View key={index} style={styles.modalItem}>
                  <Text style={styles.modalItemTitle}>{item.chemical_name}</Text>
                  <Text style={styles.modalItemText}>Function in Food: {item.function_in_food}</Text>
                  <Text style={styles.modalItemText}>Non-Food Industrial Uses: {item.non_food_industrial_uses}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.modalItemText}>No processed chemicals detected.</Text>
            )}
          </ScrollView>
        );
        break;

      case 'vulnerable_groups':
        title = 'Vulnerable Groups 🛡️';
        content = (
          <ScrollView>
            {nutritionInfo.vulnerable_groups && nutritionInfo.vulnerable_groups.avoid_if && nutritionInfo.vulnerable_groups.avoid_if.length > 0 ? (
              nutritionInfo.vulnerable_groups.avoid_if.map((item, index) => (
                <View key={index} style={styles.modalItem}>
                  <Text style={styles.modalItemTitle}>{item.group}</Text>
                  <Text style={styles.modalItemText}>Reason: {item.reason}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.modalItemText}>No vulnerable groups specified.</Text>
            )}
          </ScrollView>
        );
        break;

      case 'nutrition_info':
        title = 'Nutrition Info 🥗';
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
                <Text style={styles.nutritionTitle}>{item.charAt(0).toUpperCase() + item.slice(1)}</Text>
                <Text style={styles.nutritionValue}>{nutritionInfo[item] !== undefined ? nutritionInfo[item] : 'Data not available'}</Text>
              </View>
            ))}
          </View>
        );
        break;

      case 'alternative_recipes':
        title = 'Alternative Recipes 🍲';
        content = (
          <ScrollView>
            {nutritionInfo.alternative_recipes && nutritionInfo.alternative_recipes.length > 0 ? (
              nutritionInfo.alternative_recipes.map((item, index) => (
                <View key={index} style={styles.modalItem}>
                  <Text style={styles.modalItemTitle}>{item.name}</Text>
                  <Text style={styles.modalItemText}>{item.description}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.modalItemText}>No alternative recipes available.</Text>
            )}
          </ScrollView>
        );
        break;

      case 'additional_nutrients':
        title = 'Additional Nutrients 🌿';
        content = (
          <ScrollView>
            {nutritionInfo.additional_nutrients && nutritionInfo.additional_nutrients.length > 0 ? (
              nutritionInfo.additional_nutrients.map((item, index) => (
                <View key={index} style={styles.modalItem}>
                  <Text style={styles.modalItemTitle}>{item.name}</Text>
                  <Text style={styles.modalItemText}>Amount: {item.amount}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.modalItemText}>No additional nutrients specified.</Text>
            )}
          </ScrollView>
        );
        break;

      default:
        return null;
    }

    return (
      <Modal
        isVisible={!!activeModal}
        onBackdropPress={() => setActiveModal(null)}
        animationIn="zoomIn"
        animationOut="zoomOut"
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{title}</Text>
          {content}
          <TouchableOpacity style={styles.closeButton} onPress={() => setActiveModal(null)}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
            <Ionicons name="close" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Analysis Result</Text>
          <View style={styles.iconButton} />
        </View>

        {/* Animated View for Result */}
        <Animatable.View animation="fadeInUp" duration={800} style={styles.resultBox}>
          {/* Display the animated score */}
          <AnimatedCircularProgress
            size={250}
            width={20}
            fill={score.total || 0}
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
                <Text style={[styles.statusText, { color: statusColor }]}>{statusText}</Text>
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
              <Text style={styles.sectionButtonText}>Processed Chemicals 🔬</Text>
            </TouchableOpacity>

            {/* Vulnerable Groups Button */}
            <TouchableOpacity
              style={styles.sectionButton}
              onPress={() => setActiveModal('vulnerable_groups')}
            >
              <Text style={styles.sectionButtonText}>Vulnerable Groups 🛡️</Text>
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
              <Text style={styles.sectionButtonText}>Alternative Recipes 🍲</Text>
            </TouchableOpacity>

            {/* Additional Nutrients Button */}
            <TouchableOpacity
              style={styles.sectionButton}
              onPress={() => setActiveModal('additional_nutrients')}
            >
              <Text style={styles.sectionButtonText}>Additional Nutrients 🌿</Text>
            </TouchableOpacity>
          </View>

          {/* Name of the food item */}
          <View style={styles.nameBox}>
            <Text style={styles.resultTitle}>
              {nutritionInfo.name ? nutritionInfo.name : 'Unknown Food Item'}
            </Text>
          </View>

          {/* "Back" button to return to the previous screen */}
          <TouchableOpacity
            style={[styles.backButton, { marginTop: 20 }]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        </Animatable.View>

        {/* Render Modal Content */}
        {renderModalContent()}
      </ScrollView>
    </SafeAreaView>
  );
};

// Styles for the ResultScreen component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a', // Dark background
  },
  scrollContainer: {
    alignItems: 'center',
    padding: 20,
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  resultBox: {
    width: '100%',
    alignItems: 'center',
  },
  scoreContainer: {
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 60,
    color: 'white',
    fontWeight: 'bold',
  },
  statusText: {
    fontSize: 26,
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
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginVertical: 10,
    width: '85%',
    alignItems: 'center',
    shadowColor: '#F27A1A',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 5,
  },
  sectionButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  nameBox: {
    backgroundColor: '#2b2b2b',
    padding: 20,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 30,
    width: '90%',
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },
  resultTitle: {
    color: '#F27A1A', // Orange color
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: '#F27A1A', // Orange color
    paddingVertical: 14,
    paddingHorizontal: 35,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#F27A1A', // Orange color
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 5,
  },
  backButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalContent: {
    backgroundColor: '#1E1E1E',
    padding: 25,
    borderRadius: 25,
    alignItems: 'center',
    maxHeight: '80%',
  },
  modalTitle: {
    color: '#F27A1A', // Orange color
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalItem: {
    marginBottom: 15,
    alignItems: 'center',
  },
  modalItemTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalItemText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: '#F27A1A', // Orange color
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginTop: 20,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  nutritionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  nutritionBox: {
    width: '40%',
    margin: 10,
    padding: 20,
    borderRadius: 25,
    alignItems: 'center',
  },
  nutritionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  nutritionValue: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
  },
});

export default ResultScreen;
