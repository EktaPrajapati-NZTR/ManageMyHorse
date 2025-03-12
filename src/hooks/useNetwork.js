import { useState, useEffect } from "react";
import { Alert, AppState } from "react-native";
import { useNetInfo } from "@react-native-community/netinfo";

export const useNetwork = () => {
  const netInfo = useNetInfo();
  const [isInternetReachable, setIsInternetReachable] = useState(netInfo.isInternetReachable);
  const [appState, setAppState] = useState(AppState.currentState);

  useEffect(() => {
    setIsInternetReachable(netInfo.isInternetReachable);
  }, [netInfo.isInternetReachable]);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      setAppState(nextAppState);
    });
    return () => subscription.remove();
  }, []);

  const checkInternetReachable = () => {
    if (netInfo.isInternetReachable === false) {
      Alert.alert("No Internet Access", "You are offline. Please check your connection.", [{ text: "OK" }]);
    }
  };

  return { isInternetReachable, checkInternetReachable, appState };
};
