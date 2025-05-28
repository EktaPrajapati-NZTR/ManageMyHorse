import React from "react";
import { View, Text, TouchableOpacity,useWindowDimensions, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { colors } from '../../constants/ColorConstant';
import "../../../global.css";

const ScanInstruction = () => {
  const navigation = useNavigation();

  return (
    <ScrollView className="flex-1 bg-white" contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 10 }}>
        {/* Instruction Text */}
        <View className="flex-1 justify-center mb-6">
          <View className="items-center mb-6">
            <Text className="text-center text-black text-2xl">
              Please follow the instructions below to connect scanner:
            </Text>
            <Text className="text-center text-black mt-4 text-2xl">
              Settings {">"} Bluetooth {">"} Connect your Scanner
            </Text>
            <Text className="text-center text-black mt-4 text-2xl">
              Make sure your scanner is turned on for it to be discoverable.
            </Text>
            <Text className="text-center text-black mt-4 text-2xl">
              After connecting, please click the button below to begin scanning.
            </Text>
          </View>
        </View>

        {/* Button and Instruction Text at Bottom */}
        <View className="mb-12">
          <TouchableOpacity
            className="rounded-full flex self-center px-10 py-3"
            style={{ backgroundColor: colors.theme.green }}
            onPress={() => navigation.navigate("MicrochipScan")}
          >
            <Text className="text-white font-semibold">Start Scan</Text>
          </TouchableOpacity>

          <Text className="text-center text-black mt-4 px-4 text-2xl">
            You can scan multiple horses and they will be listed as you scan.
          </Text>
        </View>
      </ScrollView>
  );
};

export default ScanInstruction;
