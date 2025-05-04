import React, { useEffect, useState } from 'react';
import { BackHandler } from "react-native";
import SplashScreen from 'react-native-splash-screen';

import { initDB } from "./src/utils/database";
import { clearHorseLocationsToday } from './src/utils/helper';
import AppStackNavigator from './src/navigation/AppStackNavigator';

const App = () => {

  useEffect(() => {

    //Hide splash screen
    SplashScreen.hide();
    
    //Initialize sqlite database
    (async () => {
      try {
        await initDB(); // only creates the table once
        clearHorseLocationsToday();
      } catch (error) {
        console.error('Error initializing DB:', error);
      }
    })();

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
