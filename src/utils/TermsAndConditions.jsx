import React from "react";
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity } from "react-native";

import { colors } from "../constants/ColorConstant";

const TermsAndConditions = ({ navigation }) => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ padding: 24 }}>
        <Text className="text-3xl font-bold mb-6">Terms & Conditions</Text>
 
        <View>
          <Text className="text-gray-700 text-lg leading-tight mb-2">
            This privacy notification explains how we collect, use, and protect personal information when you use this app as part of this Proof of Concept.
          </Text>
 
          <Text className="text-gray-700 text-lg leading-tight mb-2">
            The information you provide is used for the purpose of helping us locate thoroughbred horses in the event of an equine health event, or a natural disaster.
          </Text>
 
          <Text className="text-gray-700 text-lg leading-tight mb-2">
            Location Services must be enabled to allow the app to capture GPS location data. This app will only collect and use GPS data strictly for the stated purpose and will not track location outside of these events.
          </Text>
 
          <Text className="text-gray-700 text-lg leading-tight mb-2">
            Personal information will be held and used in accordance with NZTR’s Privacy Policy and the Privacy Act 2020. Under this Act, you may request access to, and request correction of any personal information held by the NZTR. If you wish to have your data deleted or have any questions regarding this privacy notification, please contact NZTR’s Privacy Officer at office@nztr.co.nz.
          </Text>
        </View>
 
        <TouchableOpacity
          className="rounded-full py-3 mt-6 self-center px-12"
          style={{backgroundColor: colors.theme.green}}
          onPress={() =>
            navigation.replace("Login")
          }
        >
          <Text className="text-white text-center font-bold text-lg">Accept & Continue</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};
 
export default TermsAndConditions;