import React, { useEffect, useState } from 'react';
import SplashScreen from 'react-native-splash-screen';

import AppStackNavigator from './src/navigation/AppStackNavigator';
import { disableHardwareBack } from './src/utils/helper';

const App = () => {

  useEffect(() => {
    const initApp = async () => {
      try {
        disableHardwareBack();
      } catch (error) {
        console.error('Error initializing DB:', error);
      } finally {
        SplashScreen.hide(); // hide only after everything is ready
      }
    };
  
    initApp();
  }, []);  

  return (
    <AppStackNavigator />
  );
};

export default App;
