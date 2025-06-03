import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  BackHandler
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

import api from "../utils/api";
import URLConfig from "../constants/UrlConstant";
import { colors } from "../constants/ColorConstant";
import {
  convertUTCDateTimeToLocalDateTime,
  getAddressFromLatLong,
  handleBack
} from "../utils/helper";
import { useNetwork } from "../hooks/useNetwork";
import NoInternetScreen from "../utils/NoInternetScreen";

// Reusable text row for horse details
const DetailRow = ({ label, value }) => (
  <Text className="text-base font-semibold p-2">
    {label}: {value || "-"}
  </Text>
);

// Displays horse details block
const HorseDetails = ({ horseData }) => {
  const {
    horseName,
    appDisplayName,
    ageYear,
    sexAtBirth,
    owner,
    brandLeftShoulder,
    brandRightShoulder,
    baseColours,
    trainerName,
    damName,
    sireName,
    timestamp,
    address,
    latitude,
    longitude,
  } = horseData;

  const scannedLocation = address
    ? address
    : latitude != null && longitude != null
    ? `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
    : "-";

  return (
    <View>
      <Text className="text-2xl font-bold mb-4 text-center">
        {horseName || appDisplayName || "-"}
      </Text>
      <View className="bg-gray-100 p-4 rounded-lg">
        <DetailRow label="Age year" value={ageYear} />
        <DetailRow label="Sex at Birth" value={sexAtBirth} />
        <DetailRow label="Owner" value={owner} />
        <DetailRow label="Brand left shoulder" value={brandLeftShoulder} />
        <DetailRow label="Brand right shoulder" value={brandRightShoulder} />
        <DetailRow label="Base colour" value={baseColours} />
        <DetailRow label="Trainer" value={trainerName} />
        <DetailRow label="Dam" value={damName} />
        <DetailRow label="Sire" value={sireName} />
        <DetailRow
          label="Scanned on"
          value={
            timestamp ? convertUTCDateTimeToLocalDateTime(timestamp) : "-"
          }
        />
        <DetailRow label="Scanned location" value={scannedLocation} />
      </View>
    </View>
  );
};

// Error or empty state view
const ErrorMessage = ({ message, onGoBack }) => (
  <View className="flex-1 justify-center items-center">
    <Text className="text-lg font-semibold text-gray-500 text-center">
      {message}
    </Text>
    <TouchableOpacity
      className="mt-4 bg-black px-6 py-2 rounded-full"
      onPress={onGoBack}
    >
      <Text className="text-white text-center font-semibold">Go back</Text>
    </TouchableOpacity>
  </View>
);

const HorseDetail = ({ route }) => {
  const navigation = useNavigation();
  const { isInternetReachable } = useNetwork();
  const microchipNumber = route?.params?.microchipNumber;

  const [isLoading, setIsLoading] = useState(false);
  const [horseData, setHorseData] = useState(null);
  const [horseMessage, setHorseMessage] = useState("");

  const getHorseDetails = async () => {
    if (!microchipNumber) return;
    try {
      setIsLoading(true);
      const response = await api.get(
        URLConfig.MICROCHIP.GetHorseByMicrochipNumber(microchipNumber)
      );

      if (response?.data?.success) {
        const data = { ...response.data.data };
        data.address = await getAddressFromLatLong(data.latitude, data.longitude);
        setHorseData(data);
      } else {
        setHorseData(null);
        setHorseMessage(response.data.message || "Failed to get horse data");
      }
    } catch (error) {
      setHorseData(null);
      setHorseMessage(
        !error.response
          ? "Network Error"
          : error.response?.data?.message ||
            "Access Denied - Your API key is invalid or expired."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (microchipNumber) getHorseDetails();

      // Back handler to block back button
      handleBack();
      
    }, [microchipNumber])
  );

  if (isInternetReachable === false) {
    return (
      <NoInternetScreen
        onRetry={isInternetReachable ? getHorseDetails : null}
      />
    );
  }

  return (
    <View className="flex-1 bg-white p-4">
      {isLoading && (
        <View className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-opacity-50 z-20">
          <ActivityIndicator size="large" color={colors.theme.green} />
        </View>
      )}

      {!isLoading && (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          {horseData ? (
            <HorseDetails horseData={horseData} />
          ) : (
            <ErrorMessage
              message={horseMessage}
              onGoBack={() =>
                navigation.navigate("Scan", { screen: "MicrochipScan" })
              }
            />
          )}
        </ScrollView>
      )}
    </View>
  );
};

export default HorseDetail;
