import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  RefreshControl,
  Platform,
  Dimensions,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const LikesScreen = ({ route, navigation }) => {
  const { postId } = route.params;
  const [likes, setLikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const insets = useSafeAreaInsets();

  // Fetch likes for the post
  const fetchLikes = async () => {
    setLoading(true);
    try {
      // Simulated data for demonstration
      setTimeout(() => {
        setLikes([
          { id: 1, username: 'User1', avatar: 'https://via.placeholder.com/100x100', isFollowing: false },
          { id: 2, username: 'User2', avatar: 'https://via.placeholder.com/100x100', isFollowing: true },
          { id: 3, username: 'User3', avatar: 'https://via.placeholder.com/100x100', isFollowing: false },
        ]);
        setLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Error fetching likes:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLikes();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchLikes().then(() => setRefreshing(false));
  };

  const toggleFollow = (userId) => {
    setLikes((prevLikes) =>
      prevLikes.map((user) =>
        user.id === userId ? { ...user, isFollowing: !user.isFollowing } : user
      )
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.userRow}>
      <TouchableOpacity 
        style={styles.avatarContainer}
        onPress={() => navigation.navigate('Profile', { userId: item.id })}
      >
        <Image 
          source={{ uri: item.avatar }} 
          style={styles.avatar}
          resizeMode="cover"
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.usernameContainer}
        onPress={() => navigation.navigate('Profile', { userId: item.id })}
      >
        <Text style={styles.username} numberOfLines={1}>{item.username}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.followButton, item.isFollowing && styles.followingButton]}
        onPress={() => toggleFollow(item.id)}
      >
        <Text style={[styles.followButtonText, item.isFollowing && styles.followingButtonText]}>
          {item.isFollowing ? 'Following' : 'Follow'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      {/* Header */}
      <View style={[styles.header, { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Likes</Text>
      </View>

      {/* Likes List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#F27A1A" />
        </View>
      ) : (
        <FlatList
          data={likes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh}
              colors={['#F27A1A']} // Android
              tintColor="#F27A1A" // iOS
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No likes yet.</Text>
            </View>
          }
          contentContainerStyle={styles.listContainer}
        />
      )}
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
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  backButton: {
    padding: 8,
    marginRight: 8,
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#262626',
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: SCREEN_WIDTH * 0.12, // Responsive avatar size
    height: SCREEN_WIDTH * 0.12,
    borderRadius: (SCREEN_WIDTH * 0.12) / 2,
    backgroundColor: '#f0f0f0',
  },
  usernameContainer: {
    flex: 1,
    marginRight: 12,
  },
  username: {
    fontSize: 16,
    color: '#262626',
    fontWeight: '500',
  },
  followButton: {
    backgroundColor: '#F27A1A',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    minWidth: 90,
    alignItems: 'center',
  },
  followingButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#dbdbdb',
  },
  followButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  followingButtonText: {
    color: '#262626',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: SCREEN_HEIGHT * 0.2,
  },
  emptyText: {
    color: '#8e8e8e',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default LikesScreen;