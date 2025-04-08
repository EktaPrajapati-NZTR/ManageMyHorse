import React, { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, ActivityIndicator, TouchableOpacity, 
  ScrollView, Alert, useWindowDimensions, Platform, KeyboardAvoidingView } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation, usePreventRemove } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Tooltip from 'react-native-walkthrough-tooltip';
import { RESULTS } from "react-native-permissions";

import api from "../../utils/api";
import URLConfig from "../../constants/UrlConstant";
import { colors } from "../../constants/ColorConstant";
import { useNetwork } from "../../hooks/useNetwork";
import usePermission from "../../hooks/usePermission";
import useLocation from "../../hooks/useLocation";
import { permission } from "../../utils/permissions";
import "../../../global.css";

const MicrochipScan = () => {
  const { isInternetReachable, checkInternetReachable } = useNetwork();
  const inputRef = useRef(null);
  const [isPressed, setIsPressed] = useState(false);
  const navigation = useNavigation();
  const { width, height } = useWindowDimensions(); // Get dynamic screen dimensions
  const isLandscape = width > height; // Check if the device is in landscape mode

  const [scannedMicrochips, setScannedMicrochips] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showTipCheck, setTipCheck] = useState(false);
  const [showTipCross, setTipCross] = useState(false);
  const {permissionStatus, checkPermissionStatus, checkAndRequestPermission, handleBlockedPermission} = usePermission(permission.location);
  const { location, getLocation } = useLocation();


  const saveScannedMicrochipsToAsyncStorage = async () => {
    try {
      if(scannedMicrochips.length > 0){
        let updatedData = [];
        const existingData = await AsyncStorage.getItem('@scanned_microchips');
        if (existingData) {
          const parsedData = JSON.parse(existingData);
          updatedData = Array.isArray(parsedData) ? [...parsedData, ...scannedMicrochips] : [parsedData, ...scannedMicrochips];
        } else {
          updatedData = scannedMicrochips;
        }
        await AsyncStorage.setItem('@scanned_microchips', JSON.stringify(updatedData));
        Alert.alert("Success", "Scanned microchip data has been temporarily stored. You can restore it once the internet is available.");
      }
    } catch (e) {
      Alert.alert("Alert","Failed to save the data for later");
    }
  };

  const loadScannedMicrochips = async () => {
    try {
      const value = await AsyncStorage.getItem('@scanned_microchips');
      return value != null ? JSON.parse(value) : { scannedMicrochips: [] };
    } catch (e) {
      return { scannedMicrochips: [] };
    }
  };

  const clearScannedMicrochipsFromStorage = async () => {
    try {
      await AsyncStorage.removeItem('@scanned_microchips');
    } catch (e) {
      return { scannedMicrochips: [] };
    }
  };

  const checkAndRestoreStorageData = async () => {
    const storageData = await loadScannedMicrochips();
      if (storageData?.length > 0 && isInternetReachable) {
        Alert.alert(
          "Restore Data",
          "Previously scanned microchips were found. Do you want to save them?",
          [
            { text: "No", onPress: clearScannedMicrochipsFromStorage },
            { text: "Yes", onPress: () => saveHorseDetails(storageData) },
          ]
        );
      }
  }

  // Helper function to validate input and restrict to numeric values
  const checkValidation = (text) => {
    const numericText = text.replace(/[^0-9]/g, "");
    setInputValue(numericText);
  };

  // Function to handle microchip scan
  const handleScan = async(newMicrochip) => {
    if (newMicrochip.length === 0) return showAlert("Please enter a microchip number", false);
    if (newMicrochip.length !== 15) return showAlert("Invalid microchip number", true);
  
    if (scannedMicrochips.length >= 30) {
      return showAlert("You can scan and save up to 30 microchips per batch.", true, false);
    }

    if (permissionStatus === RESULTS.GRANTED) {
      await getLocation(setIsLoading);
      if(location != null){
        setScannedMicrochips((prev) => [
          ...prev,
          { microchipNumber: newMicrochip, isRegistered: null, Latitude: location?.coords?.latitude, Longitude: location?.coords?.longitude },
        ]);
        setInputValue("");
        // setTimeout(() => {
          //inputRef.current?.focus();
        // }, 300); 
      }
    }
    else{
      setInputValue("");
      await handleBlockedPermission();
    }
  };
  
  // Helper function to display alert
  const showAlert = (message, clearInput = false, focusInput = true) => {
    setIsLoading(false);
    Alert.alert("Alert", message, [
      {
        text: "OK",
        onPress: () => {
          if (clearInput) {
            setInputValue("");
          }
          if (focusInput) {
            setTimeout(() => {
              inputRef.current?.focus();
            }, 200);
          }
        },
      },
    ]);
    return;
  };

  // Handle deleting a microchip from the list
  const handleDelete = (index) => {
    setScannedMicrochips((prev) => prev.filter((_, i) => i !== index));
  };

  // Navigate to horse details page
  const handleInfoPress = (microchipNumber) => {
    if (isPressed) return; // Prevent multiple clicks

    if(!isInternetReachable){
      checkInternetReachable();
      return;
    }
    
    setIsPressed(true);
    navigation.navigate("Horse", {
      screen: "HorseDetail",
      params: { microchipNumber: microchipNumber },
    });

    // Reset button press state after a short delay
    setTimeout(() => setIsPressed(false), 1000);
  };

  //Save microchip data with location.
  const saveHorseDetails = async (storageData) => {
    if (isLoading) return;

    let horseLocation = storageData ?? scannedMicrochips;
    try {
      setIsLoading(true);
      const response = await api.post(URLConfig.MICROCHIP.SaveHorseLocation(), horseLocation);

      if (response?.data?.success) {
        clearScannedMicrochipsFromStorage();

        const microchipsWithStatus = response.data.data || [];
        setScannedMicrochips(microchipsWithStatus);

        const hasUnregisteredMicrochip  = microchipsWithStatus.some(chip => chip.isRegistered === false);
        Alert.alert("Success", 
          hasUnregisteredMicrochip
          ? "Horse(s) location saved successfully, but some microchips are unregistered."
          : response?.data?.message || "Horse(s)  with location saved successfully.",
        );
      } else {
        Alert.alert("Error", response.data.message || "Failed to save horse(s) with location");
      }
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Failed to save horse(s) with location");
    } finally {
      setIsLoading(false);
    }
  };
  
  const clearMicrochips = () =>{
    setScannedMicrochips([]);
  }

  //Hook to handle back navigation
  usePreventRemove(scannedMicrochips.length > 0, ({ data }) => {
    Alert.alert(
      "You have unsaved data",
      "Do you want to discard scanned microchips and go back?",
      [
        { text: "Stay", style: "cancel" },
        { text: "Go Back", onPress: () => navigation.dispatch(data.action) },
      ]
    );
  });

  useEffect(() => {
  checkAndRestoreStorageData();
  }, [isInternetReachable]);

  useEffect(() => {
    const fetchLocation = async() =>{
      if (permissionStatus === RESULTS.GRANTED) {
        await getLocation();
      }else{
        await checkAndRequestPermission();
      }
    }
    if (permissionStatus !== null) {
      fetchLocation();
    }
  }, [permissionStatus]);

  // Small delay to capture full microchip data 
  // useEffect(() => {
  //   if (inputValue.length > 0) {
  //     setIsLoading(true);
  //     setTimeout(() => {
  //       console.log('Final Scanned Value:', inputValue);
  //       if(inputValue.length == 15){
  //         handleScan(inputValue);
  //       }
  //     }, 100);
  //     setIsLoading(false);
  //   }
  // }, [inputValue]);

  // Automatically refocus input field when scannedMicrochips changes
  // useEffect(() => {
  //   inputRef.current?.focus();
  // }, [scannedMicrochips]);

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : undefined} 
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      className="flex-1"
    >
      <SafeAreaView className="flex-1 bg-white" edges={["left","right"]}>
        <View className="flex-1 px-5 pt-2">
          {isLoading ? (
            <View className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-opacity-50 z-20">
              <ActivityIndicator size="large" color={colors.theme.green} />
            </View>
          ) : (
            <>
              {/* Input for Scanned Microchip */}
              <TextInput
                className="border border-gray-300 rounded-lg px-4 text-lg text-black w-full"
                placeholder="Please tap here to focus before scanning"
                ref={inputRef}
                keyboardType="number-pad"
                returnKeyType="done"
                maxLength={15}
                placeholderTextColor="gray"
                autoFocus={true}
                value={inputValue}
                onChangeText={checkValidation}
                onSubmitEditing={(event) => {
                    let data = event.nativeEvent.text.trim();
                    handleScan(data);
                }}
                style={{
                  height: 40,
                  lineHeight: 20,
                  }}
              />
            <View className="w-full">
                <Text className="text-[14x] font-semibold text-wrap">Please keep enable location service to scan the microchip.</Text>
            </View>
              {scannedMicrochips.length > 0 && (
                <View className={`flex-1 mt-2 mb-2 border border-gray-300 rounded-lg p-2 ${isLandscape ? "h-48" : "h-80"}`}>
                  <ScrollView showsVerticalScrollIndicator={true}>
                    {scannedMicrochips.map((chip, index) => (
                      <View key={index} className="flex-row items-center bg-gray-100 rounded-lg p-3 my-1">
                        <Text className="text-black text-lg flex-1">{chip.microchipNumber}</Text>
                        <View className="flex-row item-centre">
                          {chip.isRegistered !== undefined && chip.isRegistered !== null && (
                            chip.isRegistered ? (
                              <View>
                                <Tooltip
                                  isVisible={showTipCheck}
                                  content={<Text>Registered horse</Text>}
                                  placement="top"
                                  onClose={() => setTipCheck(false)}
                                >
                                  <TouchableOpacity onPress={() => setTipCheck(true)} className="mx-3">
                                      <Icon name="check-circle" size={20} color="green" />
                                    </TouchableOpacity>
                                </Tooltip>
                              </View>
                            ) : (
                              <View>
                                <Tooltip
                                  isVisible={showTipCross}
                                  content={<Text>Unregistered horse</Text>}
                                  placement="top"
                                  onClose={() => setTipCross(false)}
                                >
                                  <TouchableOpacity onPress={() => setTipCross(true)} className="mx-3">
                                      <Ionicons name="close-circle" size={20} color="red" />
                                </TouchableOpacity>
                                </Tooltip>
                            </View>
                            )
                          )}
                          <TouchableOpacity onPress={() => handleInfoPress(chip.microchipNumber)} disabled={isPressed} className="mx-3">
                            <Icon name="info-circle" size={20} color={colors.theme.green} />
                          </TouchableOpacity>
                          <TouchableOpacity onPress={() => handleDelete(index)} className="mx-3">
                            <Icon name="trash" size={20} color={colors.theme.black}/>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))}
                  </ScrollView>
                </View>
              )}

              <View className={`flex-row justify-between mt-auto mb-2 gap-2 ${isLandscape ? "flex-wrap" : ""}`}>
                <TouchableOpacity
                  className={`rounded-full py-3 flex-1 min-w-[150px] items-center ${isLoading || scannedMicrochips.length == 0 ? "bg-gray-400" : "bg-black"}`}
                  disabled={isLoading || scannedMicrochips.length == 0}
                  onPress={() => {isInternetReachable ? saveHorseDetails(null) : saveScannedMicrochipsToAsyncStorage()}}
                >
                  <Text className="text-white text-lg">{isInternetReachable ? "Save" : "Save for Later"}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className={`rounded-full py-3 flex-1 min-w-[150px] items-center ${isLoading || scannedMicrochips.length == 0 ? "bg-gray-400" : "border border-black text-black"}`}
                  disabled={isLoading || scannedMicrochips.length == 0}
                  onPress={clearMicrochips}
                >
                  <Text className={`${isLoading || scannedMicrochips.length == 0 ? "text-white" : "text-black"} text-lg`}>Clear</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default MicrochipScan;
