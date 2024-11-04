import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, SafeAreaView, ScrollView, Image } from 'react-native';
import { Auth } from 'aws-amplify';
import { Ionicons } from '@expo/vector-icons';
import { Camera } from './CameraScreen';
import LoginScreen from './LoginScreen';

const MainScreen = ({ navigation }) => {
  const handleSignOut = async () => {
    try {
      await Auth.signOut();
      navigation.navigate('Login');
    } catch (error) {
      console.log('Error signing out: ', error);
    }
  };

  const navigateToCamera = () => {
    navigation.navigate('Camera');
  };

  // Sample post data - you can replace this with real data
  const samplePosts = [
    {
      id: 1,
      username: 'Sarah',
      imageUrl: 'https://placeholder.com/300x400',
      likes: 234,
      caption: 'Beautiful day! ✨',
      timeAgo: '2h ago'
    },
    {
      id: 2,
      username: 'Mike',
      imageUrl: 'https://placeholder.com/300x400',
      likes: 156,
      caption: 'Perfect evening for a walk 🌅',
      timeAgo: '4h ago'
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>BEGLZ</Text>
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Ionicons name="log-out-outline" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Main Content - Feed */}
      <ScrollView style={styles.feedContainer}>
        <View style={styles.storiesContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.storiesScroll}>
            {/* Add Story Button */}
            <TouchableOpacity style={styles.addStoryButton}>
              <View style={styles.addStoryIcon}>
                <Ionicons name="add" size={24} color="#F27A1A" />
              </View>
              <Text style={styles.storyText}>Your Story</Text>
            </TouchableOpacity>
            {/* Sample Story Circles */}
            {['Alex', 'Maria', 'John', 'Emma'].map((name, index) => (
              <View key={index} style={styles.storyCircle}>
                <View style={styles.storyRing}>
                  <View style={styles.storyImage} />
                </View>
                <Text style={styles.storyText}>{name}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Posts */}
        {samplePosts.map((post) => (
          <View key={post.id} style={styles.postContainer}>
            <View style={styles.postHeader}>
              <View style={styles.userInfo}>
                <View style={styles.userAvatar} />
                <Text style={styles.username}>{post.username}</Text>
              </View>
              <Ionicons name="ellipsis-horizontal" size={20} color="#666" />
            </View>
            <View style={styles.postImage} />
            <View style={styles.postActions}>
              <View style={styles.leftActions}>
                <Ionicons name="heart-outline" size={24} color="#666" style={styles.actionIcon} />
                <Ionicons name="chatbubble-outline" size={22} color="#666" style={styles.actionIcon} />
                <Ionicons name="paper-plane-outline" size={22} color="#666" style={styles.actionIcon} />
              </View>
              <Ionicons name="bookmark-outline" size={22} color="#666" />
            </View>
            <Text style={styles.likes}>{post.likes} likes</Text>
            <Text style={styles.caption}>
              <Text style={styles.username}>{post.username}</Text> {post.caption}
            </Text>
            <Text style={styles.timeAgo}>{post.timeAgo}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Task Bar */}
      <View style={styles.taskBar}>
        <TouchableOpacity style={styles.tabButton}>
          <Ionicons name="home" size={24} color="#F27A1A" />
          <Text style={[styles.tabText, styles.activeTabText]}>Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.tabButton} onPress={() => navigation.navigate('Explore')}>
          <Ionicons name="compass" size={24} color="#666" />
          <Text style={styles.tabText}>Explore</Text>
        </TouchableOpacity>


        <TouchableOpacity style={styles.tabButton} onPress={navigateToCamera}>
          <Ionicons name="scan" size={24} color="#666" />
          <Text style={styles.tabText}>Scan</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabButton} onPress={() => navigation.navigate('Profile')}>
           <Ionicons name="person" size={24} color="#666" />
           <Text style={styles.tabText}>Profile</Text>
        </TouchableOpacity>

      </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F27A1A',
  },
  signOutButton: {
    backgroundColor: '#F27A1A',
    padding: 8,
    borderRadius: 20,
  },
  feedContainer: {
    flex: 1,
  },
  storiesContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 10,
  },
  storiesScroll: {
    paddingHorizontal: 15,
  },
  addStoryButton: {
    alignItems: 'center',
    marginRight: 15,
  },
  addStoryIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#F27A1A',
    marginBottom: 5,
  },
  storyCircle: {
    alignItems: 'center',
    marginRight: 15,
  },
  storyRing: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#F27A1A',
    padding: 2,
    marginBottom: 5,
  },
  storyImage: {
    width: '100%',
    height: '100%',
    borderRadius: 34,
    backgroundColor: '#ddd',
  },
  storyText: {
    fontSize: 12,
    color: '#666',
  },
  postContainer: {
    marginBottom: 15,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ddd',
    marginRight: 10,
  },
  username: {
    fontWeight: 'bold',
    color: '#262626',
  },
  postImage: {
    width: '100%',
    height: 400,
    backgroundColor: '#ddd',
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  leftActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIcon: {
    marginRight: 15,
  },
  likes: {
    fontWeight: 'bold',
    paddingHorizontal: 15,
    marginBottom: 5,
  },
  caption: {
    paddingHorizontal: 15,
    marginBottom: 5,
  },
  timeAgo: {
    fontSize: 12,
    color: '#666',
    paddingHorizontal: 15,
  },
  taskBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingBottom: Platform.OS === 'ios' ? 25 : 15,
  },
  tabButton: {
    alignItems: 'center',
    
  },
  tabText: {
    fontSize: 12,
    marginTop: 4,
    color: '#666',
  },
  activeTabText: {
    color: '#F27A1A',
  },
});

export default MainScreen;