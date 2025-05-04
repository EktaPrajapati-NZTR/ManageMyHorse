import AsyncStorage from '@react-native-async-storage/async-storage';
import { clearHorseLocations } from '../utils/database';

export const clearHorseLocationsToday = async () => {
  const today = new Date().toISOString().split('T')[0];

  try {
    const lastRunDate = await AsyncStorage.getItem('lastHorseCleanupDate');
    if (lastRunDate !== today) {
      await clearHorseLocations();
      await AsyncStorage.setItem('lastHorseCleanupDate', today);
      console.log("Horse location data cleared for today");
    } else {
      console.log("Horse location cleanup already done today");
    }
  } catch (err) {
    // console.error("Error clearing horse locations:", err);
  }
};
