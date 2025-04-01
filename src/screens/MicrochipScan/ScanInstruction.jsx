import React, {useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity,useWindowDimensions, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";

import "../../../global.css";

const ScanInstruction = () => {
  const navigation = useNavigation();
  const { width, height } = useWindowDimensions(); // Get dynamic screen dimensions
  const isPortrait = height > width; // Check if the device is in landscape mode

  return (
    <ScrollView className="flex-1 bg-white" contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: isPortrait ? 10 : 12 }}>
        {/* Instruction Text */}
        <View className="flex-1 justify-center mb-6">
          <View className="items-center mb-6">
            <Text
              className="text-center text-black"
              style={{ fontSize: isPortrait ? 20 : 18 }}
            >
              Please follow the instructions below to connect scanner:
            </Text>
            <Text
              className="text-center text-black mt-4"
              style={{ fontSize: isPortrait ? 20 : 18 }}
            >
              Settings {">"} Bluetooth {">"} Connect your Scanner
            </Text>
            <Text
              className="text-center text-black mt-4"
              style={{ fontSize: isPortrait ? 20 : 18 }}
            >
              Make sure your scanner is turned on for it to be discoverable.
            </Text>
          </View>
        </View>

        {/* Button and Instruction Text at Bottom */}
        <View className="mb-12">
          <TouchableOpacity
            className="bg-black rounded-full flex items-center justify-center"
            style={{
              height: 45,
              width: isPortrait ? "100%" : "60%",
              alignSelf: "center",
            }}
            onPress={() => navigation.navigate("MicrochipScan")}
          >
            <Text className="text-white font-semibold" style={{ fontSize: isPortrait ? 18 : 16 }}>
              Start Scan
            </Text>
          </TouchableOpacity>

          <Text
            className="text-center text-black mt-4 px-4"
            style={{ fontSize: isPortrait ? 20 : 18 }}
          >
            You can scan multiple horses and they will be listed as you scan.
          </Text>
        </View>
      </ScrollView>
  );
};

export default ScanInstruction;
