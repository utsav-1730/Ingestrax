// MainScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, SafeAreaView, ScrollView, Image, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FAB } from 'react-native-paper';

const { width } = Dimensions.get('window');

const MainScreen = ({ navigation }) => {
  
  // Navigation functions
  const navigateToStoryCreation = () => {
    navigation.navigate('StoryCreation'); // Ensure you have a StoryCreation component
  };

  const navigateToStoryViewer = (index) => {
    navigation.navigate('StoryViewer', { stories: sampleStories, initialIndex: index });
  };

  const navigateToLikes = (postId) => {
    navigation.navigate('Likes', { postId });
  };

  const navigateToComments = (postId) => {
    navigation.navigate('Comments', { postId });
  };

  const navigateToShareSheet = (postId) => {
    navigation.navigate('ShareSheet', { postId });
  };

  const navigateToCreatePost = () => {
    navigation.navigate('CreatePost'); // Ensure you have a CreatePost component
  };

  // Sample data for stories and posts
  const sampleStories = [
    {
      id: 1,
      type: 'image',
      contentUrl: 'https://via.placeholder.com/300x400',
      user: {
        username: 'Alex',
        avatar: 'https://via.placeholder.com/100x100',
      },
    },
    {
      id: 2,
      type: 'video',
      contentUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      user: {
        username: 'Maria',
        avatar: 'https://via.placeholder.com/100x100',
      },
    },
  ];

  const samplePosts = [
    {
      id: 1,
      username: 'Sarah',
      userAvatar: 'https://via.placeholder.com/100x100',
      imageUrl: 'https://via.placeholder.com/300x400',
      likes: 234,
      caption: 'Beautiful day! ✨',
      timeAgo: '2h ago',
    },
    {
      id: 2,
      username: 'Mike',
      userAvatar: 'https://via.placeholder.com/100x100',
      imageUrl: 'https://via.placeholder.com/300x400',
      likes: 156,
      caption: 'Perfect evening for a walk 🌅',
      timeAgo: '4h ago',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>BEGLZ</Text>
      </View>

      {/* Main Content - Feed */}
      <ScrollView style={styles.feedContainer}>
        {/* Stories */}
        <View style={styles.storiesContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.storiesScroll}>
            {/* Add Story Button */}
            <TouchableOpacity style={styles.addStoryButton} onPress={navigateToStoryCreation}>
              <View style={styles.addStoryIcon}>
                <Ionicons name="add" size={24} color="#F27A1A" />
              </View>
              <Text style={styles.storyText}>Your Story</Text>
            </TouchableOpacity>
            {/* Sample Story Circles */}
            {sampleStories.map((story, index) => (
              <TouchableOpacity key={story.id} style={styles.storyCircle} onPress={() => navigateToStoryViewer(index)}>
                <View style={styles.storyRing}>
                  {story.type === 'video' ? (
                    <Ionicons name="play-circle-outline" size={36} color="#fff" style={styles.storyOverlayIcon} />
                  ) : null}
                  <Image source={{ uri: story.user.avatar }} style={styles.storyImage} />
                </View>
                <Text style={styles.storyText}>{story.user.username}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Posts */}
        {samplePosts.map((post) => (
          <View key={post.id} style={styles.postContainer}>
            <View style={styles.postHeader}>
              <TouchableOpacity onPress={() => navigation.navigate('Profile', { userId: post.id })}>
                <Image source={{ uri: post.userAvatar }} style={styles.userAvatar} />
              </TouchableOpacity>
              <Text style={styles.username}>{post.username}</Text>
              <Ionicons name="ellipsis-horizontal" size={20} color="#666" style={{ marginLeft: 'auto' }} />
            </View>
            <TouchableOpacity onPress={() => navigateToStoryViewer(0)}>
              <Image source={{ uri: post.imageUrl }} style={styles.postImage} />
            </TouchableOpacity>
            <View style={styles.postActions}>
              <View style={styles.leftActions}>
                <TouchableOpacity onPress={() => {/* Like functionality placeholder */}}>
                  <Ionicons name="heart-outline" size={24} color="#666" style={styles.actionIcon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigateToComments(post.id)}>
                  <Ionicons name="chatbubble-outline" size={22} color="#666" style={styles.actionIcon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigateToShareSheet(post.id)}>
                  <Ionicons name="paper-plane-outline" size={22} color="#666" style={styles.actionIcon} />
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={() => {/* Bookmark functionality placeholder */}}>
                <Ionicons name="bookmark-outline" size={22} color="#666" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => navigateToLikes(post.id)}>
              <Text style={styles.likes}>{post.likes} likes</Text>
            </TouchableOpacity>
            <Text style={styles.caption}>
              <Text style={styles.username}>{post.username}</Text> {post.caption}
            </Text>
            <Text style={styles.timeAgo}>{post.timeAgo}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Floating Action Button */}
      <FAB
        style={styles.fab}
        small={false}
        icon="plus"
        onPress={navigateToCreatePost}
        color="#fff"
      />
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
    justifyContent: 'center',
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  storyOverlayIcon: {
    position: 'absolute',
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
    paddingHorizontal: 15,
    paddingVertical: 10,
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
    color: '#262626',
  },
  caption: {
    paddingHorizontal: 15,
    marginBottom: 5,
    color: '#262626',
  },
  timeAgo: {
    fontSize: 12,
    color: '#666',
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 20,
    backgroundColor: '#F27A1A',
  },
});

export default MainScreen;
