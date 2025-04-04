import React, { useEffect, useState } from 'react';
import { BackHandler } from "react-native";
import SplashScreen from 'react-native-splash-screen';

import AppStackNavigator from './src/navigation/AppStackNavigator';

const App = () => {

  useEffect(() => {

    //Hide splash screen
    SplashScreen.hide();
    
    // Function to prevent hardware back button action
    const backAction = () => {
      return true; // This prevents the default behavior (doing nothing)
    };

    // Add back button listener
    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);

    // Cleanup listener on unmount
    return () => {
      backHandler.remove();
    };
  }, []);

  return (
    <AppStackNavigator />
  );
};

export default App;
