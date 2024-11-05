import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  KeyboardAvoidingView,
  Platform,
  Animated,
  LayoutAnimation,
  UIManager,
  Modal,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Get device dimensions and constants
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IS_IOS = Platform.OS === 'ios';
const HEADER_HEIGHT = IS_IOS ? 44 : 56;
const BOTTOM_SPACING = IS_IOS ? 34 : 24;

const CommentsScreen = ({ route, navigation }) => {
  const [initialLoading, setInitialLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchComments(true);
  }, []);

  const fetchComments = async (isInitialLoad = false) => {
    if (isInitialLoad) setInitialLoading(true);
    else setRefreshing(true);

    setTimeout(() => {
      setComments([
        {
          id: '1',
          user: {
            id: '1',
            username: 'JohnDoe',
            avatar: 'https://via.placeholder.com/40',
          },
          text: 'This is a sample comment',
          timestamp: new Date(),
          likes: 5,
          likedByCurrentUser: false,
          replies: [],
        },
      ]);
      setInitialLoading(false);
      setRefreshing(false);
      fadeInComments();
    }, 1000);
  };

  const fadeInComments = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const onRefresh = () => {
    fetchComments();
  };

  const submitComment = () => {
    if (newComment.trim()) {
      const newCommentData = {
        id: Date.now().toString(),
        user: {
          id: '1',
          username: 'User',
          avatar: 'https://via.placeholder.com/40',
        },
        text: newComment,
        timestamp: new Date(),
        likes: 0,
        likedByCurrentUser: false,
        replies: [],
      };
      setComments((prevComments) => [...prevComments, newCommentData]);
      setNewComment('');
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }
  };

  const toggleLike = (commentId) => {
    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment.id === commentId
          ? {
              ...comment,
              likedByCurrentUser: !comment.likedByCurrentUser,
              likes: comment.likedByCurrentUser ? comment.likes - 1 : comment.likes + 1,
            }
          : comment
      )
    );
  };

  const renderItem = ({ item }) => (
    <Animated.View
      style={[
        styles.commentRow,
        {
          opacity: fadeAnim,
          transform: [
            {
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0],
              }),
            },
          ],
        },
      ]}
    >
      <TouchableOpacity
        onPress={() => navigation.navigate('Profile', { userId: item.user.id })}
        style={styles.avatarContainer}
      >
        <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
      </TouchableOpacity>

      <View style={styles.commentContent}>
        <View style={styles.commentHeader}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Profile', { userId: item.user.id })}
          >
            <Text style={styles.username}>{item.user.username}</Text>
          </TouchableOpacity>
          <Text style={styles.timestamp}>{moment(item.timestamp).fromNow()}</Text>
        </View>

        <Text style={styles.commentText}>{item.text}</Text>

        <View style={styles.commentFooter}>
          <TouchableOpacity
            style={styles.commentAction}
            onPress={() => toggleLike(item.id)}
          >
            <Ionicons
              name={item.likedByCurrentUser ? 'heart' : 'heart-outline'}
              size={16}
              color={item.likedByCurrentUser ? 'red' : '#666'}
            />
            <Text style={styles.actionText}>
              {item.likes > 0 ? `${item.likes} ` : ''}Like
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.commentAction}>
            <Ionicons name="reply-outline" size={16} color="#666" />
            <Text style={styles.actionText}>Reply</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={IS_IOS ? 'padding' : 'height'}
        keyboardVerticalOffset={IS_IOS ? HEADER_HEIGHT : 0}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Comments</Text>
          <View style={styles.headerRight} />
        </View>

        {initialLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#F27A1A" />
          </View>
        ) : (
          <FlatList
            data={comments}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#F27A1A" />
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="chatbubble-outline" size={48} color="#ccc" />
                <Text style={styles.emptyText}>No comments yet</Text>
                <Text style={styles.emptySubtext}>Be the first to comment</Text>
              </View>
            }
            onEndReached={() => fetchComments(false)}
            onEndReachedThreshold={0.5}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}

        <View style={styles.inputWrapper}>
          <View style={styles.inputContainer}>
            <Image source={{ uri: 'https://via.placeholder.com/100x100' }} style={styles.inputAvatar} />
            <TextInput
              style={styles.input}
              placeholder="Add a comment..."
              placeholderTextColor="#666"
              value={newComment}
              onChangeText={setNewComment}
              multiline
              maxLength={1000}
            />
            <View style={styles.inputActions}>
              <TouchableOpacity onPress={() => setShowEmojiPicker(true)} style={styles.emojiButton}>
                <Ionicons name="happy-outline" size={24} color="#666" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={submitComment}
                disabled={newComment.trim() === ''}
                style={[
                  styles.sendButton,
                  newComment.trim() === '' && styles.sendButtonDisabled,
                ]}
              >
                <Ionicons
                  name="send"
                  size={24}
                  color={newComment.trim() === '' ? '#ccc' : '#F27A1A'}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Emoji Picker Modal */}
        <Modal
          visible={showEmojiPicker}
          animationType="slide"
          transparent
          onRequestClose={() => setShowEmojiPicker(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowEmojiPicker(false)}
          >
            <View style={styles.emojiPickerContainer}>
              <View style={styles.emojiPickerHeader}>
                <Text style={styles.emojiPickerTitle}>Choose Emoji</Text>
                <TouchableOpacity onPress={() => setShowEmojiPicker(false)} style={styles.closeButton}>
                  <Ionicons name="close" size={24} color="#000" />
                </TouchableOpacity>
              </View>
              <View style={styles.emojiContainer}>
                {['😀', '😂', '😍', '👍', '🙏', '🎉', '🔥', '❤️', '😎', '🤔'].map(
                  (emoji, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => {
                        setNewComment(newComment + emoji);
                        setShowEmojiPicker(false);
                      }}
                      style={styles.emojiButton}
                    >
                      <Text style={styles.emoji}>{emoji}</Text>
                    </TouchableOpacity>
                  )
                )}
              </View>
            </View>
          </TouchableOpacity>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
    safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: HEADER_HEIGHT,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  headerButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000',
  },
  headerRight: {
    width: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: 16,
  },
  commentRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  username: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
  },
  commentText: {
    fontSize: 15,
    color: '#262626',
    lineHeight: 20,
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
  },
  commentFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  commentAction: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  actionText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 4,
  },
  repliesContainer: {
    marginTop: 8,
    paddingLeft: 16,
  },
  replyRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
  replyAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  replyContent: {
    flex: 1,
  },
  replyText: {
    fontSize: 14,
    color: '#262626',
    marginTop: 2,
  },
  replyFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  inputWrapper: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingBottom: IS_IOS ? 34 : 0,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  input: {
    flex: 1,
    minHeight: 36,
    maxHeight: 100,
    backgroundColor: '#f2f2f2',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 15,
    color: '#000',
  },
  inputActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  emojiButton: {
    padding: 8,
    marginRight: 4,
  },
  sendButton: {
    padding: 8,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  emojiPickerContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: BOTTOM_SPACING,
  },
  emojiPickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  emojiPickerTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  closeButton: {
    padding: 8,
  },
  emojiContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: 16,
  },
  emoji: {
    fontSize: 32,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
  // Additional styles for enhanced animations and interactions
  replyAction: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  likeAnimation: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Enhanced accessibility styles
  accessibilityButton: {
    minHeight: 44,
    minWidth: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Loading indicator styles
  loadingMore: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  // Enhanced input focus styles
  inputFocused: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#F27A1A',
  },
  // Platform specific shadow styles
  ...Platform.select({
    ios: {
      shadowContainer: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
    },
    android: {
      shadowContainer: {
        elevation: 5,
      },
    },
  }),
});

export default CommentsScreen;
