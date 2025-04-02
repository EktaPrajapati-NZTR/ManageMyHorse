import React, { useEffect } from 'react';
import { BackHandler } from "react-native";
import SplashScreen from 'react-native-splash-screen';

import BottomTabNavigator from './src/navigation/BottomTabNavigator';

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
      <BottomTabNavigator />
  );
};

export default App;
