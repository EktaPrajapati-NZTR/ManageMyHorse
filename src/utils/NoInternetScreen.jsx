import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../constants/ColorConstant';

const NoInternetScreen = ({ onRetry }) => {
  return (
    <View className="flex-1 bg-white items-center justify-center px-6">
      {/* No Internet Icon */}
      <Icon name="wifi-off" size={80} color ={colors.theme.black} />

      {/* Title */}
      <Text className="text-black text-2xl font-bold mt-6">
        No Internet Connection
      </Text>

      {/* Subtitle */}
      <Text className="text-black text-center mt-2">
        Please check your internet connection and try again.
      </Text>
    </View>
  );
};

export default NoInternetScreen;
