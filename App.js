import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Amplify, Auth, Hub } from 'aws-amplify';
import awsconfig from './src/aws-exports';
import { ActivityIndicator, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

// Screen Imports
import LoginScreen from './components/LoginScreen';
import SignupScreen from './components/SignupScreen';
import VerificationScreen from './components/VerificationScreen';
import ForgotPasswordScreen from './components/ForgotPasswordscreen';
import SelectionScreen from './components/SelectionScreen';
import CongratulationsScreen from './components/CongratulationsScreen';
import MainScreen from './components/MainScreen';
import DailyStatsScreen from './components/DailyStatsScreen';
import ProfileScreen from './components/ProfileScreen';
import HistoryScreen from './components/HistoryScreen';

Amplify.configure(awsconfig);

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Custom Centered Floating Plus Button
const CenteredPlusButton = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.centeredPlusButton} onPress={onPress}>
      <Feather name="plus" size={32} color="#fff" />
    </TouchableOpacity>
  );
};

// 🔹 Bottom Tab Navigation (MainTabs)
const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarStyle: { backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#ddd', height: 70 },
      tabBarIcon: ({ color, size }) => {
        let iconName;
        if (route.name === 'Home') iconName = 'home';
        else if (route.name === 'Daily Stats') iconName = 'bar-chart-2';
        else if (route.name === 'History') iconName = 'file-text';
        else if (route.name === 'Profile') iconName = 'user';
        return <Feather name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#06b6d4',
      tabBarInactiveTintColor: '#666',
    })}
  >
    <Tab.Screen name="Home" component={MainScreen} />
    <Tab.Screen name="Daily Stats" component={DailyStatsScreen} />
    <Tab.Screen name="History" component={HistoryScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);



const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);

  useEffect(() => {
    checkAuthState();

    // Listen for authentication events (SignIn, SignOut)
    const listener = Hub.listen('auth', (data) => {
      const { payload } = data;
      if (payload.event === 'signIn') {
        setIsAuthenticated(true);
        setIsNewUser(false);
      }
      if (payload.event === 'signOut') {
        setIsAuthenticated(false);
        setIsNewUser(false);
      }
    });

    return () => listener(); // Cleanup on unmount
  }, []);

  const checkAuthState = async () => {
    try {
      await Auth.signOut(); // Ensures old sessions are cleared
      const authUser = await Auth.currentAuthenticatedUser();
      setIsAuthenticated(!!authUser);
    } catch (err) {
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' }}>
        <ActivityIndicator size="large" color="#5FD6D3" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={isAuthenticated ? (isNewUser ? 'Selection' : 'MainTabs') : 'Login'}
        screenOptions={{
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      >
        {/* Authentication Flow */}
        {!isAuthenticated ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
            <Stack.Screen name="Verification" component={VerificationScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          </>
        ) : (
          // Flow for Authenticated Users
          isNewUser ? (
            <>
              <Stack.Screen name="Selection" component={SelectionScreen} />
              <Stack.Screen name="Congratulations" component={CongratulationsScreen} />
              <Stack.Screen name="MainTabs" component={MainTabs} />
            </>
          ) : (
            <>
              <Stack.Screen name="MainTabs" component={MainTabs} />
            </>
          )
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
