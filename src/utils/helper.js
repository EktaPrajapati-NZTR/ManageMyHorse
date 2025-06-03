import { BackHandler } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import { TOMTOM_API_KEY } from '../../appKeys';

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

  export const getLoggedInUserInfo = async() =>{
    const userInfoString = await AsyncStorage.getItem('LoggedInUserInfo');
    const userInfo = userInfoString ? JSON.parse(userInfoString) : null;
    return userInfo;
  }

  export const getAddressFromLatLong = async (latitude, longitude) => {

    if (latitude == null || longitude == null) {
      return null;
    }

    const url = `https://api.tomtom.com/search/2/reverseGeocode/${latitude},${longitude}.json?key=${TOMTOM_API_KEY}`;
    try {
      const response = await axios.get(url);
      const address = response.data?.addresses?.[0]?.address?.freeformAddress;
      return address || null;
    } catch (error) {
      return null;
    }
  };

  export const handleBack = () =>{
     // Add back handler to block back button
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);

    // Cleanup when unfocused or dependency changes
    return () => {
      backHandler.remove();
    };
  }
  
  
