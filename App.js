// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';

// AWS Amplify Configuration
import { Amplify } from 'aws-amplify';
import awsconfig from './src/aws-exports';

// Screen Imports
import CameraScreen from './components/CameraScreen';
import ResultScreen from './components/ResultScreen'; // Import the ResultScreen
import LoginScreen from './components/LoginScreen';
import SignupScreen from './components/SignupScreen';
import VerificationScreen from './components/VerificationScreen';
import MainScreen from './components/MainScreen';
import ExploreScreen from './components/ExploreScreen';
import ProfileScreen from './components/ProfileScreen';
import EditProfileScreen from './components/EditProfileScreen';
import ForgotPasswordScreen from './components/ForgotPasswordscreen';
import SettingsScreen from './components/SettingsScreen';
import LikesScreen from './components/LikesScreen';
import CommentsScreen from './components/CommentsScreen';
import ShareSheet from './components/ShareSheet';
import StoryViewerScreen from './components/StoryViewerScreen';
import StoryCreation from './components/StoryCreation';
import CreatePost from './components/CreatePost'; // Import the CreatePost screen

// New Screens for Help and Legal
import FAQScreen from './components/FAQScreen';
import ContactSupportScreen from './components/ContactSupportScreen';
import PrivacyPolicyScreen from './components/PrivacyPolicyScreen';
import TermsOfUseScreen from './components/TermsOfUseScreen';

Amplify.configure(awsconfig);

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

/**
 * MainTabNavigator handles the bottom tab navigation.
 * It includes Main, Explore, Camera, Result, and Profile tabs.
 */
const MainTabNavigator = () => (
  <Tab.Navigator
    initialRouteName="Main"
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName;

        switch (route.name) {
          case 'Main':
            iconName = 'home';
            break;
          case 'Explore':
            iconName = 'compass';
            break;
          case 'Camera':
            iconName = 'scan';
            break;
          case 'Result':
            iconName = 'stats-chart'; // Choose an appropriate icon
            break;
          case 'Profile':
            iconName = 'person';
            break;
          default:
            iconName = 'home';
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#F27A1A',
      tabBarInactiveTintColor: '#666',
      tabBarShowLabel: true,
      tabBarStyle: {
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingBottom: Platform.OS === 'ios' ? 25 : 15,
        paddingTop: 5,
        height: Platform.OS === 'ios' ? 85 : 65,
        display: 'flex',
      },
      headerShown: false,
    })}
  >
    <Tab.Screen name="Main" component={MainScreen} />
    <Tab.Screen name="Explore" component={ExploreScreen} />
    <Tab.Screen
      name="Camera"
      component={CameraScreen}
      options={{
        tabBarIcon: ({ focused, color, size }) => (
          <Ionicons name="scan" size={size} color={focused ? '#F27A1A' : '#666'} />
        ),
      }}
    />
    <Tab.Screen
      name="Result"
      component={ResultScreen}
      options={{
        tabBarIcon: ({ focused, color, size }) => (
          <Ionicons name="stats-chart" size={size} color={focused ? '#F27A1A' : '#666'} />
        ),
      }}
    />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

/**
 * App is the root component that sets up the navigation container
 * and defines the stack navigator.
 */
const App = () => (
  <NavigationContainer>
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      {/* Authentication Stack */}
      <Stack.Group>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Verification" component={VerificationScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      </Stack.Group>

      {/* Main App Navigation */}
      <Stack.Screen
        name="MainTabs"
        component={MainTabNavigator}
        options={{
          gestureEnabled: false, // Prevent swipe back from main app
        }}
      />

      {/* Modal Screens */}
      <Stack.Group
        screenOptions={{
          cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
          gestureEnabled: true,
          gestureDirection: 'vertical',
        }}
      >
        <Stack.Screen name="Likes" component={LikesScreen} />
        <Stack.Screen name="Comments" component={CommentsScreen} />
        <Stack.Screen name="ShareSheet" component={ShareSheet} />
      </Stack.Group>

      {/* Story Related Screens */}
      <Stack.Group>
        <Stack.Screen
          name="StoryViewer"
          component={StoryViewerScreen}
          options={{
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            gestureEnabled: true,
            gestureDirection: 'horizontal',
          }}
        />
        <Stack.Screen
          name="StoryCreation"
          component={StoryCreation}
          options={{
            cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
          }}
        />
      </Stack.Group>

      {/* Profile Related Screens */}
      <Stack.Group>
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      </Stack.Group>

      {/* Help and Legal Screens */}
      <Stack.Group>
        {/* Help Screens */}
        <Stack.Screen
          name="FAQScreen"
          component={FAQScreen}
          options={{
            title: 'FAQ',
            headerShown: true,
            headerStyle: {
              backgroundColor: '#fff',
            },
            headerTintColor: '#F27A1A',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen
          name="ContactSupportScreen"
          component={ContactSupportScreen}
          options={{
            title: 'Contact Support',
            headerShown: true,
            headerStyle: {
              backgroundColor: '#fff',
            },
            headerTintColor: '#F27A1A',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />

        {/* Legal Screens */}
        <Stack.Screen
          name="PrivacyPolicyScreen"
          component={PrivacyPolicyScreen}
          options={{
            title: 'Privacy Policy',
            headerShown: true,
            headerStyle: {
              backgroundColor: '#fff',
            },
            headerTintColor: '#F27A1A',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen
          name="TermsOfUseScreen"
          component={TermsOfUseScreen}
          options={{
            title: 'Terms of Use',
            headerShown: true,
            headerStyle: {
              backgroundColor: '#fff',
            },
            headerTintColor: '#F27A1A',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
      </Stack.Group>

      {/* Create Post Screen */}
      <Stack.Group>
        <Stack.Screen
          name="CreatePost"
          component={CreatePost}
          options={{
            cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
            gestureEnabled: true,
            gestureDirection: 'vertical',
          }}
        />
      </Stack.Group>

      {/* Result Screen */}
      <Stack.Group>
        <Stack.Screen
          name="ResultScreen"
          component={ResultScreen}
          options={{
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            gestureEnabled: true,
            gestureDirection: 'horizontal',
          }}
        />
      </Stack.Group>
    </Stack.Navigator>
  </NavigationContainer>
);

export default App;
