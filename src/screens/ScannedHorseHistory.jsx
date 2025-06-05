import React, { useCallback, useState, useMemo } from "react";
import { View, Text, FlatList, ActivityIndicator, Platform, TouchableOpacity, Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Icon from "react-native-vector-icons/FontAwesome";

import api from "../utils/api";
import URLConfig from "../constants/UrlConstant";
import { colors } from "../constants/ColorConstant";
import {
  getLoggedInUserInfo,
  convertUTCDateTimeToLocalDateTime,
  convertAndFormatUTCDateToLocalDate,
  formatDateToDDMMYYYY,
  getAddressFromLatLong,
  handleBack
} from "../utils/helper";

const ScannedHorseHistory = () => {
  const defaultDate = useMemo(() => new Date(), []);
  const [selectedDate, setSelectedDate] = useState(defaultDate);
  const [history, setHistory] = useState([]);
  const [showPicker, setShowPicker] = useState(false);
  const [dateFilterEnabled, setDateFilterEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDateChange = (event, date) => {
    if (event.type === "dismissed") return setShowPicker(false);
    if (event.type === "set" && date) {
      setSelectedDate(date);
      setDateFilterEnabled(true);
      setShowPicker(Platform.OS === "ios");
    }
  };

  const clearFilters = () => {
    setDateFilterEnabled(false);
    setSelectedDate(defaultDate);
  };

  const getHistory = async (contactID) => {
    if (!contactID) return;

    setIsLoading(true);
    try {
      const response = await api.get(URLConfig.MICROCHIP.GetScannedHorsesByContactID(contactID));
      if (response?.data?.success) {
        const rawData = response.data.data;

        const updatedHistory = await Promise.all(
          rawData.map(async (item) => {
            if (item.latitude && item.longitude && !item.address) {
              const address = await getAddressFromLatLong(item.latitude, item.longitude);
              return { ...item, address };
            }
            return item;
          })
        );

        setHistory(updatedHistory);
      } else {
        setHistory([]);
      }
    } catch (error) {
      const message = error?.response?.data?.message || "Access Denied - Your API key is invalid or expired.";
      Alert.alert(error?.response ? "Error" : "Network Error", message);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchHistory = async () => {
        const userInfo = await getLoggedInUserInfo();
        if (userInfo?.contactID && isActive) {
          await getHistory(userInfo.contactID);
        }
        if (isActive) {
          setSelectedDate(defaultDate);
          setDateFilterEnabled(false);
        }
      };

      fetchHistory();

      handleBack();
      
      return () => {
        isActive = false;
      };
    }, [defaultDate])
  );

  const filteredHistory = useMemo(() => {
    if (!dateFilterEnabled) return history;
    const selectedLocalDate = convertAndFormatUTCDateToLocalDate(selectedDate);

    return history.filter((item) => {
      const itemDate = convertAndFormatUTCDateToLocalDate(item.timestamp);
      return itemDate === selectedLocalDate;
    });
  }, [selectedDate, history, dateFilterEnabled]);

  const renderItem = ({ item }) => (
    <View className="bg-white m-2 p-4 rounded-2xl shadow-md border border-gray-200">
      <Text className="text-base font-semibold mt-1">Microchip: {item.microchipNumber || "-"}</Text>
      <Text className="text-base font-semibold mt-1">Horse name: {item.horseName || item.horseAppDisplayName || "-"}</Text>
      <Text className="text-base font-semibold mt-1">Dam: {item.damName || item.damName || "-"}</Text>
      <Text className="text-base font-semibold mt-1">Sire: {item.sireName || item.sireName || "-"}</Text>
      <Text className="text-base font-semibold mt-1">Scanned on: {item.timestamp ? convertUTCDateTimeToLocalDateTime(item.timestamp) : "-"}</Text>
      <Text className="text-base font-semibold mt-1">
        Scanned location:{" "}
        {item?.address
          ? item.address
          : item.latitude && item.longitude
          ? `${item.latitude.toFixed(4)}, ${item.longitude.toFixed(4)}`
          : "-"}
      </Text>
    </View>
  );

  return (
    <View className="flex-1 bg-white px-4 pt-3">
      <View className="justify-between mb-1">
        <View className="flex-col">
          <View className="flex-row items-center rounded-lg border border-gray-400 bg-white px-3 py-2">
            <Icon name="calendar" size={18} color={colors.theme.green} />
            <TouchableOpacity
              onPress={() => setShowPicker(true)}
              className="flex-1 mx-2"
              activeOpacity={0.8}
            >
              <Text className="text-black text-base">
                {dateFilterEnabled ? formatDateToDDMMYYYY(selectedDate) : "Select Date"}
              </Text>
            </TouchableOpacity>
            {dateFilterEnabled && (
              <TouchableOpacity onPress={clearFilters} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Icon name="times-circle" size={20} color="gray" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      {showPicker && (
        <DateTimePicker value={selectedDate} mode="date" display="default" onChange={handleDateChange} />
      )}

      {isLoading ? (
        <View className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-opacity-50 z-20">
          <ActivityIndicator size="large" color={colors.theme.green} />
        </View>
      ) : filteredHistory.length === 0 ? (
        <View className="flex-1 justify-center items-center px-4">
          <Text className="text-lg font-semibold text-gray-500 text-center">No history found.</Text>
        </View>
      ) : (
        <FlatList
          data={filteredHistory}
          keyExtractor={(item, index) => item.horseLocationId?.toString() || index.toString()}
          renderItem={renderItem}
        />
      )}
    </View>
  );
};

export default ScannedHorseHistory;
