import React,{ useCallback, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { getAllHorseLocations } from "../utils/database"
import {convertUTCDateTimeToLocalDateTime} from "../utils/helper";

const ScannedHorseHistory = () => {

    const [history, setHistory] = useState([]);

    useFocusEffect(
        useCallback(() => {
          const fetchHistory = async () => {
            const scannedHorseHistory = await getAllHorseLocations();
            setHistory(scannedHorseHistory);
          };
    
          fetchHistory();
        }, [])
    );

    const renderItem = ({ item }) => (
        <View className="bg-white m-2 p-4 rounded-2xl shadow-md border border-gray-200">
          <Text className="text-base font-semibold mt-1">Microchip: {item.microchipNumber ? item.microchipNumber : '-'}</Text>
          <Text className="text-base font-semibold mt-1">Horse name: {item.horseName ? item.horseName : '-'}</Text>
          <Text className="text-base font-semibold mt-1">Scanned Location: {item.latitude && item.longitude ? `${item.latitude.toFixed(4)}, ${item.longitude.toFixed(4)}` : '-'}</Text>
          <Text className="text-base font-semibold mt-1">Scanned datetime: {item.timestamp ? convertUTCDateTimeToLocalDateTime(item.timestamp) : '-'}</Text>
        </View>
    );

    return (
        <View className="flex-1 bg-white p-4">
             {!history || history.length === 0 ? (
                <View className="flex-1 justify-center items-center">
                    <Text className="text-lg font-semibold text-gray-500 text-center">
                        No history found.
                    </Text>
                </View>
                ) : (
                <FlatList
                    data={history}
                    keyExtractor={(item, index) => item.horseLocationId ? item.horseLocationId.toString() : index.toString()}
                    renderItem={renderItem}
                />
            )}
        </View>
    )
}

export default ScannedHorseHistory;