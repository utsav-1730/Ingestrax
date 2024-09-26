import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Amplify } from 'aws-amplify';
import awsconfig from './src/aws-exports';

import LoginScreen from './components/LoginScreen';
import SignupScreen from './components/SignupScreen';
import VerificationScreen from './components/VerificationScreen';
import MainScreen from './components/MainScreen';

Amplify.configure(awsconfig);

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Verification" component={VerificationScreen} />
        <Stack.Screen name="Main" component={MainScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;