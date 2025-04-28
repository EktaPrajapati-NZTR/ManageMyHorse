import { useState } from "react";
import { Alert } from "react-native";
import Geolocation from "react-native-geolocation-service";

const useLocation = () => {

  // Function to get the current location
  const getLocation = async () => {
    return new Promise((resolve, reject) => {

      Geolocation.getCurrentPosition(
        (position) => {
          setTimeout(() => {
            resolve(position);
          }, 200);
        },
        (error) => {
          reject(error);
          Alert.alert("Alert","Something wrong while fetching location data");
        },
        {
          accuracy: {
            android: "high",
            ios: "best",
          },
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
          distanceFilter: 0,
        }
      );
    });
  };

  // useEffect(() => {
  //   console.log("location hook:", permissionStatus);
  //   if (permissionStatus === "granted") {
  //     getLocation();
  //   }
  // }, [permissionStatus]);

  return { getLocation };
};

export default useLocation;
