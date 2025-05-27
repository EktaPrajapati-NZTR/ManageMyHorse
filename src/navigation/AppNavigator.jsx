import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import BottomTabsWithStacks from './BottomTabsWithStacks';
import TermsAndConditions from '../utils/TermsAndConditions'; 
import Login from '../screens/Login';

const Stack = createStackNavigator();

const AppNavigator = () => {
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
        setInitialScreen('BottomTabsWithStacks');
      } else {
        setInitialScreen('Login');
      }
    };

    init();
  }, []);

  if (!initialScreen) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialScreen}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="TermsAndConditions" component={TermsAndConditions} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="BottomTabsWithStacks" component={BottomTabsWithStacks} />
      </Stack.Navigator>
  </NavigationContainer>
  );
};

export default AppNavigator;
