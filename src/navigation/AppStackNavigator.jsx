import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import BottomTabNavigator from './BottomTabNavigator';
import TermsAndConditions from '../utils/TermsAndConditions'; 

const Stack = createNativeStackNavigator();

const AppStackNavigator = () => {
  const [isFirstTime, setIsFirstTime] = useState(null);

  useEffect(() => {
    const checkFirstLaunch = async () => {
      const isFirstLaunch = await AsyncStorage.getItem('isFirstLaunch');
      if (isFirstLaunch === null) {
         // Clear AsyncStorage on the first launch
         await AsyncStorage.clear();

        setIsFirstTime(true);
        await AsyncStorage.setItem('isFirstLaunch', 'false');
      } else {
        setIsFirstTime(false);
      }
    };
    checkFirstLaunch();
  }, []);

  if (isFirstTime === null) {
    return null; // Wait until the check is complete
  }

  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName={isFirstTime ? "TermsAndConditions" : "BottomTabNavigator"}
        screenOptions={{headerShown: false}}>
          <Stack.Screen
            name="TermsAndConditions"
            component={TermsAndConditions}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="BottomTabNavigator"
            component={BottomTabNavigator}
            options={{ headerShown: false }}
          />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppStackNavigator;
