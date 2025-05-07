import React,{ useCallback, useState, useMemo, useEffect } from "react";
import { View, Text, FlatList, ActivityIndicator, Platform, TouchableOpacity } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/FontAwesome'; 

import { getAllHorseLocations } from "../utils/database"
import { colors } from "../constants/ColorConstant";
import { convertUTCDateTimeToLocalDateTime, convertAndFormatUTCDateToLocalDate, formatDateToDDMMYYYY } from "../utils/helper";

const ScannedHorseHistory = () => {

    const defaultDate = new Date();
    const [selectedDate, setSelectedDate] = useState(defaultDate);
    const [history, setHistory] = useState([]);
    const [showPicker, setShowPicker] = useState(false);
    const [dateFilterEnabled, setDateFilterEnabled] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    const onChange = (event, date) => {
        // Cancel 
        if (event.type === 'dismissed') {
            setShowPicker(false);
            return;
        }
        
        // Ok
        if (event.type === 'set' && date) {
            setShowPicker(Platform.OS === 'ios');
            setSelectedDate(date);
            setDateFilterEnabled(true);
        }
    };

    // Filter the history based on selected date
    const filteredHistory = useMemo(() => {
        if (!dateFilterEnabled) return history;

        setIsLoading(true);
        // Format the selectedDate directly to local YYYY-MM-DD
        const selectedLocalDate = convertAndFormatUTCDateToLocalDate(selectedDate);
        
        const data = history?.filter(item => {
            const localDate = convertAndFormatUTCDateToLocalDate(item.timestamp)
            return localDate === selectedLocalDate;
        }) || [];

        setIsLoading(false);
        return data;
      }, [selectedDate, history, dateFilterEnabled]);

    useFocusEffect(
        useCallback(() => {
            const fetchHistory = async () => {
                const scannedHorseHistory = await getAllHorseLocations();
                setHistory(scannedHorseHistory);
            };

            setIsLoading(true);
            fetchHistory();
            setIsLoading(false);
        }, [])
    );

    const clearFilters = () => {
        setSelectedDate(defaultDate);
    };

    const renderItem = ({ item }) => (
        <View className="bg-white m-2 p-4 rounded-2xl shadow-md border border-gray-200">
          <Text className="text-base font-semibold mt-1">Microchip: {item.microchipNumber ? item.microchipNumber : '-'}</Text>
          <Text className="text-base font-semibold mt-1">Horse name: {item.horseName ? item.horseName : '-'}</Text>
          <Text className="text-base font-semibold mt-1">Scanned Location: {item.latitude && item.longitude ? `${item.latitude.toFixed(4)}, ${item.longitude.toFixed(4)}` : '-'}</Text>
          <Text className="text-base font-semibold mt-1">Scanned datetime: {item.timestamp ? convertUTCDateTimeToLocalDateTime(item.timestamp) : '-'}</Text>
        </View>
    );

    return (
        <View className="flex-1 bg-white px-4 pt-3">
            <View className="justify-between mb-1">
                <View className="flex-col">
                    <Text className="pl-1 mb-1">Select Date: </Text>

                    <View className="flex-row items-center rounded-lg border border-gray-400 bg-white px-3 py-2">
                        <Icon name="calendar" size={18} color="gray" />

                        {/* Date Display (opens picker) */}
                        <TouchableOpacity
                            onPress={() => setShowPicker(true)}
                            className="flex-1 mx-2"
                            activeOpacity={0.8}
                        >
                       <Text className="text-black text-base">
                        {formatDateToDDMMYYYY(selectedDate)}
                        </Text>

                        </TouchableOpacity>

                         {/* Clear Button (does NOT open picker) */}
                        {dateFilterEnabled && (
                        <TouchableOpacity
                            onPress={clearFilters}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                            <Icon name="times-circle" size={20} color="gray" />
                        </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>
    
            {/* Date Picker */}
            {showPicker && (
                <DateTimePicker
                    value={selectedDate}
                    mode="date"
                    display="default"
                    onChange={onChange}
                />
            )}

            {isLoading ? (
                <View className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-opacity-50 z-20">
                    <ActivityIndicator size="large" color={colors.theme.green} />
                </View>
                ) : filteredHistory.length === 0 ? (
                <View className="flex-1 justify-center items-center px-4">
                    <Text className="text-lg font-semibold text-gray-500 text-center">
                    No history found.
                    </Text>
                </View>
                ) : (
                <FlatList
                    data={filteredHistory}
                    keyExtractor={(item, index) => item.horseLocationId?.toString() || index.toString()}
                    renderItem={renderItem}
                />
            )}
        </View>
    )    
}

export default ScannedHorseHistory;