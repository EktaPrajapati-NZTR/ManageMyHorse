import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { colors } from '../constants/ColorConstant';
import URLConfig from '../constants/UrlConstant';
import loginApi from '../utils/loginApi';
import { getLoggedInUserInfo } from '../utils/helper';

const InfoRow = ({ icon, text }) => (
  <View className="flex-row items-center border-b border-gray-200 py-9 px-6">
    <Icon name={icon} size={20} color={colors.theme.green} />
    <Text className="ml-4 text-base text-black">{text}</Text>
  </View>
);

const Settings = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    loadUserInfo();
  }, []);

  const loadUserInfo = async () => {
    try {
      const parsedUserInfo = await getLoggedInUserInfo();
      if (parsedUserInfo) {
        parsedUserInfo.fullName = `${parsedUserInfo.firstName} ${parsedUserInfo.lastName}`;
      }
      setUserInfo(parsedUserInfo);
    } catch (error) {
      console.error('Failed to load user info:', error);
    }
  };

  const performLogout = async () => {
    await AsyncStorage.multiRemove(['isLoggedIn', 'LoggedInUserInfo']);
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  const handleLogout = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const response = await loginApi.get(URLConfig.LOGIN.Logout());

      if (response?.status === 200) {
        await performLogout();
      }
    } catch (error) {
      if (error?.response?.status === 401) {
        await performLogout();
      } else {
        Alert.alert('Logout Failed', 'Something went wrong. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white relative">
      {isLoading && (
        <View className="absolute inset-0 z-50 justify-center items-center bg-white/70">
          <ActivityIndicator size="large" color={colors.theme.green} />
        </View>
      )}

      <View>
        <InfoRow icon="user" text={userInfo?.fullName || '-'} />
        <InfoRow icon="mail" text={userInfo?.emailAddress || '-'} />
      </View>

      <TouchableOpacity
        className="mt-8 px-12 py-3 rounded-full self-center"
        style={{ backgroundColor: colors.theme.green }}
        onPress={handleLogout}
        disabled={isLoading}
      >
        <Text className="text-white text-center font-semibold">Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Settings;
