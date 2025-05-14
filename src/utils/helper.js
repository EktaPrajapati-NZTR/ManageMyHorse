import { BackHandler } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

  export const formatDateToDDMMYYYY = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Converts a UTC date to a local date.
  export const convertUTCDateTimeToLocalDateTime = (dateString) => {
    if (!dateString.endsWith('Z')) {
      dateString += 'Z';
    }
    let date = new Date(dateString);
    const formattedDate = formatDateToDDMMYYYY(date);

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    // Determine AM/PM
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // Convert to 12-hour format
    const formattedHours = String(hours).padStart(2, "0");

    return `${formattedDate} ${formattedHours}:${minutes}:${seconds} ${ampm}`;
  }

  // Convert and format UTC date to local date
  export const convertAndFormatUTCDateToLocalDate = (input) => {
    const date = typeof input === 'string'
      ? new Date(input.endsWith('Z') ? input : input + 'Z')
      : new Date(input); // if already a Date object
  
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
  
    return `${year}-${month}-${day}`;
  };

  // Preventing to go back by disabling hardware back.
  export const disableHardwareBack = () => {
    const backAction = () => true; 
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  };

  export const getLoggedInUserInfo = async() =>{
    const userInfoString = await AsyncStorage.getItem('LoggedInUserInfo');
    const userInfo = userInfoString ? JSON.parse(userInfoString) : null;
    return userInfo;
  }
  
  
