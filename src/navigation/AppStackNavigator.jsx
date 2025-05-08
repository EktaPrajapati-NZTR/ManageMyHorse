import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import BottomTabNavigator from './BottomTabNavigator';
import TermsAndConditions from '../utils/TermsAndConditions'; 
import Login from '../screens/Login';

const Stack = createStackNavigator();

const AppStackNavigator = () => {
  const [initialScreen, setInitialScreen] = useState(null);

  useEffect(() => {
    const init = async () => {
      const isFirstLaunch = await AsyncStorage.getItem('isFirstLaunch');
      const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
      if (isFirstLaunch === null) {
        await AsyncStorage.clear();
        await AsyncStorage.setItem('isFirstLaunch', 'false');
        setInitialScreen('TermsAndConditions');
      } else if (isLoggedIn === 'true') {
        setInitialScreen('BottomTabNavigator');
      } else {
        setInitialScreen('Login');
      }
    };

    init();
  }, []);

  if (!initialScreen) {
    return null; // or splash/loading screen
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialScreen}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="TermsAndConditions" component={TermsAndConditions} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="BottomTabNavigator" component={BottomTabNavigator} />
      </Stack.Navigator>
  </NavigationContainer>
  );
};

export default AppStackNavigator;
