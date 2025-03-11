import { useState, useEffect } from "react";
import Geolocation from "react-native-geolocation-service";

import usePermission from "../hooks/usePermission";
import { permission } from "../utils/permissions";

const useLocation = () => {
  // const {permissionStatus} = usePermission(permission.location);
  const [location, setLocation] = useState(null);

  // Function to get the current location
  const getLocation = async (setIsLoading) => {
    if (setIsLoading) setIsLoading(true);

    Geolocation.getCurrentPosition(
      (position) => {
        setTimeout(() => {
          setLocation(position);
          if (setIsLoading) setIsLoading(false);
        }, 200);
      },
      (error) => {
        setLocation(null);
        if (setIsLoading) setIsLoading(false);
        console.log(`Code ${error.code}`, error.message);
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
  };

  // useEffect(() => {
  //   console.log("location hook:", permissionStatus);
  //   if (permissionStatus === "granted") {
  //     getLocation();
  //   }
  // }, [permissionStatus]);

  return { getLocation, location };
};

export default useLocation;
