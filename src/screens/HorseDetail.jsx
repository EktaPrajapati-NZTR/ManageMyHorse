import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  useWindowDimensions
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

import api from "../utils/api";
import URLConfig from "../constants/UrlConstant";
import { colors } from "../constants/ColorConstant";
import { useNetwork } from "../utils/NetworkProvider";
import NoInternetScreen from "../utils/NoInternetScreen";

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
      if (response.data.success) {
        setHorseData(response.data.data);
      } else {
        setHorseData(null);
        setHorseMessage(response.data.message || "Failed to get horse data");
      }
    } catch (error) {
      setHorseData(null);
      setHorseMessage(error.response?.data?.message || "Network error.");
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (microchipNumber) {
        getHorseDetails();
      }
    }, [microchipNumber])
  );
  
  if (!isInternetReachable) {
    return <NoInternetScreen onRetry={isInternetReachable ? getHorseDetails : null} />;
  }

  return (
    <View className="flex-1 bg-white p-4">
      {isLoading ? (
        <View className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-opacity-50 z-20">
          <ActivityIndicator size="large" color={colors.theme.brown} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          {horseData ? (
            <View>
              <Text className="text-2xl font-bold mb-4 text-center">{horseData.horseName || horseData.appDisplayName}</Text>

              <View className="bg-gray-100 p-4 rounded-lg">
                <Text className="text-base font-semibold p-2">Age year: {horseData.ageYear}</Text>
                <Text className="text-base font-semibold p-2">Sex at Birth: {horseData.sexAtBirth}</Text>
                <Text className="text-base font-semibold p-2">Owner: {horseData.ownerName}</Text>
                <Text className="text-base font-semibold p-2">
                  Last Location: {horseData.latitude ? `${horseData.latitude.toFixed(4)}, ${horseData.longitude?.toFixed(4)}` : ""}
                </Text>
              </View>
            </View>
          ) : (
            <View className="flex-1 justify-center items-center">
              <Text className="text-lg font-semibold text-gray-500 text-center">{horseMessage}</Text>
              <TouchableOpacity
                className="mt-4 bg-brown px-6 py-2 rounded-full"
                onPress={() => navigation.navigate("Scan", { screen: "MicrochipScan" })}
              >
                <Text className="text-white font-semibold">Go back</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
};

export default HorseDetail;
