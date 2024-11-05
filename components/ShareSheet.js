import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Share,
  Alert,
  Platform,
  Dimensions,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const ShareSheet = ({ route, navigation }) => {
  const { postId } = route.params;
  const insets = useSafeAreaInsets();

  const sharePostExternally = async () => {
    try {
      const result = await Share.share({
        message: `Check out this post on BEGLZ! https://beglz.com/post/${postId}`,
        url: `https://beglz.com/post/${postId}`, // iOS only
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // Shared with activity type (iOS)
          console.log(result.activityType);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to share post');
    }
  };

  const copyLink = async () => {
    try {
      await Clipboard.setStringAsync(`https://beglz.com/post/${postId}`);
      Alert.alert('Success', 'Link copied to clipboard!', [{ text: 'OK' }], {
        cancelable: true,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to copy link');
    }
  };

  const addToStory = () => {
    navigation.navigate('Camera', { postId });
  };

  const sendDirectMessage = () => {
    navigation.navigate('DirectMessage', { postId });
  };

  const ShareOption = ({ icon, text, onPress, isLast }) => (
    <TouchableOpacity 
      style={[
        styles.option,
        !isLast && styles.optionBorder,
        { paddingHorizontal: SCREEN_WIDTH * 0.04 }
      ]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.optionIconContainer}>
        <Ionicons name={icon} size={SCREEN_WIDTH * 0.06} color="#F27A1A" />
      </View>
      <Text style={styles.optionText}>{text}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView 
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom }
      ]}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={[styles.header, { marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }]}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.iconButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="close" size={SCREEN_WIDTH * 0.06} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Share</Text>
      </View>

      {/* Content Container */}
      <View style={styles.contentContainer}>
        {/* Internal Share Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Share to</Text>
          <View style={styles.optionsContainer}>
            <ShareOption 
              icon="paper-plane-outline" 
              text="Direct Message" 
              onPress={sendDirectMessage}
            />
            <ShareOption 
              icon="add-circle-outline" 
              text="Add to Story" 
              onPress={addToStory}
            />
            <ShareOption 
              icon="link-outline" 
              text="Copy Link" 
              onPress={copyLink}
              isLast={true}
            />
          </View>
        </View>

        {/* External Share Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>More options</Text>
          <View style={styles.optionsContainer}>
            <ShareOption 
              icon="share-social-outline" 
              text="Share via..." 
              onPress={sharePostExternally}
              isLast={true}
            />
          </View>
        </View>
      </View>

      {/* Cancel Button */}
      <TouchableOpacity 
        style={[
          styles.cancelButton,
          { marginBottom: Platform.OS === 'ios' ? insets.bottom : 20 }
        ]} 
        onPress={() => navigation.goBack()}
        activeOpacity={0.7}
      >
        <Text style={styles.cancelText}>Cancel</Text>
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
    paddingVertical: SCREEN_HEIGHT * 0.02,
    paddingHorizontal: SCREEN_WIDTH * 0.04,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  iconButton: {
    padding: SCREEN_WIDTH * 0.02,
    marginRight: SCREEN_WIDTH * 0.02,
  },
  headerTitle: {
    fontSize: SCREEN_WIDTH * 0.05,
    fontWeight: '600',
    color: '#262626',
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: SCREEN_WIDTH * 0.04,
  },
  section: {
    marginTop: SCREEN_HEIGHT * 0.03,
  },
  sectionTitle: {
    fontSize: SCREEN_WIDTH * 0.045,
    fontWeight: '500',
    marginBottom: SCREEN_HEIGHT * 0.015,
    color: '#262626',
  },
  optionsContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SCREEN_HEIGHT * 0.02,
  },
  optionBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
  },
  optionIconContainer: {
    width: SCREEN_WIDTH * 0.08,
    alignItems: 'center',
  },
  optionText: {
    fontSize: SCREEN_WIDTH * 0.04,
    marginLeft: SCREEN_WIDTH * 0.03,
    color: '#262626',
    fontWeight: '400',
  },
  cancelButton: {
    marginTop: 'auto',
    marginHorizontal: SCREEN_WIDTH * 0.04,
    paddingVertical: SCREEN_HEIGHT * 0.018,
    borderRadius: 12,
    backgroundColor: '#f8f8f8',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  cancelText: {
    fontSize: SCREEN_WIDTH * 0.04,
    color: '#F27A1A',
    fontWeight: '600',
  },
});

export default ShareSheet;