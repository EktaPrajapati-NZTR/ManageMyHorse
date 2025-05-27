import React, { useEffect, useState } from 'react';
import { BackHandler } from 'react-native';
import SplashScreen from 'react-native-splash-screen';

import AppNavigator from './src/navigation/AppNavigator';

const App = () => {

  useEffect(() => {
    const initApp = async () => {
      try {
        // Preventing to go back by disabling hardware back.
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);
        return () => backHandler.remove();
      } catch (error) {
      } finally {
        SplashScreen.hide(); // hide only after everything is ready
      }
    };
  
    initApp();
  }, []);  

  return (
    <AppNavigator />
  );
};

export default App;
