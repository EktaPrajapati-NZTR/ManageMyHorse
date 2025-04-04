import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

const TermsAndConditions = ({ navigation }) => {
  return (
    <View className="flex-1 p-6 bg-white">
      <Text className="text-3xl font-bold mb-4">Terms & Conditions</Text>
      <Text className="text-gray-700 mb-4">
        This privacy notification explains how we collect, use, and protect personal information when you use this app as part of this Proof of Concept.
      </Text>
      <Text className="text-gray-700 mb-4">
        The information you provide is used for the purpose of helping us locate thoroughbred horses in the event of an equine health event, or a natural disaster.
      </Text>
      <Text className="text-gray-700 mb-4">
        Location Services must be enabled to allow the app to capture GPS location data. This app will only collect and use GPS data strictly for the stated purpose and will not track location outside of these events.
      </Text>
      <Text className="text-gray-700 mb-4">
        Personal information will be held and used in accordance with NZTR’s Privacy Policy and the Privacy Act 2020. Under this Act, you may request access to, and request correction of any personal information held by the NZTR. If you wish to have your data deleted or have any questions regarding this privacy notification, please contact NZTR’s Privacy Officer at office@nztr.co.nz.
      </Text>

      <TouchableOpacity
        className="bg-black rounded-full py-3 mt-6"
        onPress={() => 
          navigation.reset({
            index: 0,
            routes: [{ name: 'BottomTabNavigator' }],
          })}
      >
        <Text className="text-white text-center font-bold">Accept & Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

export default TermsAndConditions;
