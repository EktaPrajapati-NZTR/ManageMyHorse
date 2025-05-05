import AsyncStorage from '@react-native-async-storage/async-storage';
import { clearHorseLocations } from '../utils/database';

  // Clears horse locations if cleanup hasn't been performed today.
  export const clearHorseLocationsToday = async () => {
    const today = new Date().toISOString().split('T')[0];  // Current date in YYYY-MM-DD format

    try {
      const lastRunDate = await AsyncStorage.getItem('lastHorseCleanupDate');
      if (lastRunDate !== today) {
        await clearHorseLocations();  // Custom function to clear horse locations
        await AsyncStorage.setItem('lastHorseCleanupDate', today);
        // console.log("Horse location data cleared for today");
      } else {
        // console.log("Horse location cleanup already done today");
      }
    } catch (err) {
      // console.error("Error clearing horse locations:", err);
    }
  }

  // Converts a UTC date to a local date.
  export const convertUTCDateTimeToLocalDateTime = (dateString) => {
    if (!dateString.endsWith('Z')) {
      dateString += 'Z';
    }
    let date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    // Determine AM/PM
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // Convert to 12-hour format
    const formattedHours = String(hours).padStart(2, "0");

    return `${day}/${month}/${year} ${formattedHours}:${minutes}:${seconds} ${ampm}`;

    // const UTCdate = new Date(dateString);
    // const localDate = new Date(UTCdate.getTime() - UTCdate.getTimezoneOffset() * 60 * 1000);
    // var offset = localDate.getTimezoneOffset() / 60;
    // var hours = localDate.getHours();

    // localDate.setHours(hours - offset);
    // return localDate.toLocaleString();
  }
