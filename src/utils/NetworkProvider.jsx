import React, { createContext, useContext, useEffect, useState } from "react";
import { Alert, AppState } from 'react-native';
import { useNetInfo } from "@react-native-community/netinfo";

// Create Context
const NetworkContext = createContext(null);

// Provider Component
export const NetworkProvider = ({ children }) => {
  const netInfo = useNetInfo();
  const [isInternetReachable, setIsInternetReachable] = useState(netInfo.isInternetReachable);
  const [appState, setAppState] = useState(AppState.currentState);

  useEffect(() => {
    setIsInternetReachable(netInfo.isInternetReachable);
  }, [netInfo.isInternetReachable]);

  const checkInternetReachable = () =>{
    if (netInfo.isInternetReachable === false) {
      Alert.alert(
        "No Internet Access",
        "You are offline. Please check your connection.", 
        [{ text: "OK" }]
      );
    }
  }
  
  // Set app state changes (foreground/background)
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      setAppState(nextAppState);
    });
    return () => subscription.remove();
  }, [appState]);

  return (
    <NetworkContext.Provider value={{ isInternetReachable, checkInternetReachable, appState }}>
      {children}
    </NetworkContext.Provider>
  );
};

// Custom Hook to use network status
export const useNetwork = () => useContext(NetworkContext);
