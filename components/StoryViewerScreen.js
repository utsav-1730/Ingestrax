import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  ActivityIndicator,
  Platform,
  StatusBar,
  Animated,
  TouchableWithoutFeedback,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Swiper from 'react-native-swiper';
import { Video } from 'expo-av';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const STORY_DURATION = 5000; // 5 seconds per story

const StoryViewerScreen = ({ route, navigation }) => {
  const { stories, initialIndex } = route.params;
  const insets = useSafeAreaInsets();
  const swiperRef = useRef(null);
  const videoRef = useRef(null);
  const progressAnimation = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(initialIndex || 0);
  const [loading, setLoading] = useState(true);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  // Story progress animation
  const startProgress = useCallback(() => {
    progressAnimation.setValue(0);
    Animated.timing(progressAnimation, {
      toValue: 1,
      duration: STORY_DURATION,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished && !paused) {
        goToNextStory();
      }
    });
  }, [paused]);

  useEffect(() => {
    if (!stories || stories.length === 0) {
      navigation.goBack();
    } else {
      setLoading(false);
      startProgress();
    }
  }, [stories, startProgress]);

  useEffect(() => {
    if (paused) {
      progressAnimation.stopAnimation();
    } else {
      startProgress();
    }
  }, [paused, progressAnimation, startProgress]);

  const onIndexChanged = (index) => {
    setCurrentIndex(index);
    startProgress();
  };

  const goToNextStory = () => {
    if (currentIndex < stories.length - 1) {
      swiperRef.current?.scrollBy(1);
    } else {
      navigation.goBack();
    }
  };

  const goToPreviousStory = () => {
    if (currentIndex > 0) {
      swiperRef.current?.scrollBy(-1);
    }
  };

  const handlePress = (evt) => {
    const x = evt.nativeEvent.locationX;
    if (x < SCREEN_WIDTH * 0.3) {
      goToPreviousStory();
    } else if (x > SCREEN_WIDTH * 0.7) {
      goToNextStory();
    } else {
      setPaused(!paused);
    }
  };

  const StoryProgressBar = ({ index }) => {
    const width = index === currentIndex
      ? progressAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: ['0%', '100%'],
        })
      : index < currentIndex ? '100%' : '0%';

    return (
      <View style={styles.progressSegment}>
        <Animated.View
          style={[
            styles.progressFill,
            { width },
          ]}
        />
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#F27A1A" />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <Swiper
        ref={swiperRef}
        loop={false}
        index={currentIndex}
        onIndexChanged={onIndexChanged}
        showsPagination={false}
        loadMinimal={true}
        loadMinimalSize={2}
      >
        {stories.map((story, index) => (
          <View key={story.id} style={styles.storyContainer}>
            <TouchableWithoutFeedback onPress={handlePress}>
              <View style={styles.storyContent}>
                {story.type === 'video' ? (
                  <Video
                    ref={videoRef}
                    source={{ uri: story.contentUrl }}
                    rate={1.0}
                    volume={1.0}
                    isMuted={false}
                    resizeMode="cover"
                    shouldPlay={!paused && currentIndex === index}
                    isLooping={false}
                    style={styles.mediaContent}
                    onPlaybackStatusUpdate={(status) => {
                      if (status.didJustFinish) {
                        goToNextStory();
                      }
                    }}
                  />
                ) : (
                  <Image 
                    source={{ uri: story.contentUrl }} 
                    style={styles.mediaContent}
                    resizeMode="cover"
                  />
                )}
              </View>
            </TouchableWithoutFeedback>

            {/* Progress Bar */}
            <View style={[styles.progressBarContainer, { top: Platform.OS === 'ios' ? insets.top + 10 : StatusBar.currentHeight + 10 }]}>
              {stories.map((_, i) => (
                <StoryProgressBar key={i} index={i} />
              ))}
            </View>

            {/* User Info */}
            <View style={[styles.userInfo, { top: Platform.OS === 'ios' ? insets.top + 20 : StatusBar.currentHeight + 20 }]}>
              <Image 
                source={{ uri: story.user.avatar }} 
                style={styles.userAvatar}
                resizeMode="cover"
              />
              <Text style={styles.username}>{story.user.username}</Text>
              {paused && (
                <View style={styles.pausedIndicator}>
                  <Text style={styles.pausedText}>Paused</Text>
                </View>
              )}
            </View>

            {/* Navigation Hints */}
            {paused && (
              <View style={styles.navigationHints}>
                <Text style={styles.hintText}>Tap left to go back</Text>
                <Text style={styles.hintText}>Tap right for next</Text>
              </View>
            )}

            {/* Close Button */}
            <TouchableOpacity 
              style={[styles.closeButton, { top: Platform.OS === 'ios' ? insets.top + 20 : StatusBar.currentHeight + 20 }]}
              onPress={() => navigation.goBack()}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close" size={SCREEN_WIDTH * 0.07} color="#fff" />
            </TouchableOpacity>
          </View>
        ))}
      </Swiper>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  storyContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: '#000',
  },
  storyContent: {
    flex: 1,
    backgroundColor: '#000',
  },
  mediaContent: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
  },
  progressBarContainer: {
    position: 'absolute',
    flexDirection: 'row',
    width: '94%',
    alignSelf: 'center',
    zIndex: 1,
  },
  progressSegment: {
    height: 2,
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 2,
    overflow: 'hidden',
    borderRadius: 1,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#fff',
  },
  userInfo: {
    position: 'absolute',
    left: SCREEN_WIDTH * 0.04,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1,
  },
  userAvatar: {
    width: SCREEN_WIDTH * 0.1,
    height: SCREEN_WIDTH * 0.1,
    borderRadius: SCREEN_WIDTH * 0.05,
    borderWidth: 2,
    borderColor: '#F27A1A',
  },
  username: {
    color: '#fff',
    fontWeight: '600',
    fontSize: SCREEN_WIDTH * 0.04,
    marginLeft: SCREEN_WIDTH * 0.03,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  closeButton: {
    position: 'absolute',
    right: SCREEN_WIDTH * 0.04,
    zIndex: 1,
    padding: 8,
  },
  pausedIndicator: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginLeft: 10,
  },
  pausedText: {
    color: '#fff',
    fontSize: SCREEN_WIDTH * 0.035,
  },
  navigationHints: {
    position: 'absolute',
    bottom: '10%',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SCREEN_WIDTH * 0.1,
  },
  hintText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: SCREEN_WIDTH * 0.035,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});

export default StoryViewerScreen;