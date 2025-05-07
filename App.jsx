import React, { useEffect, useState } from 'react';
import SplashScreen from 'react-native-splash-screen';

import { initDB } from "./src/utils/database";
import { clearHorseLocationsToday } from './src/utils/helper';
import AppStackNavigator from './src/navigation/AppStackNavigator';
import { disableHardwareBack } from './src/utils/helper';

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

    disableHardwareBack();
  }, []);

  return (
    <AppStackNavigator />
  );
};

export default App;
