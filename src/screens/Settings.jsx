import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { colors } from '../constants/ColorConstant';

const InfoRow = ({ icon, text }) => (
  <View className="flex-row items-center border-b border-gray-200 py-9 px-6">
    <Icon name={icon} size={20} color={colors.theme.green} />
    <Text className="ml-4 text-base text-black">{text}</Text>
  </View>
);

const Settings = ({ navigation }) => {
  const user = {
    firstName: 'Ekta',
    lastName: 'Prajapati',
    email: 'ekta@example.com',
    dob: '27 August 1994',
    region: 'Waikato'
  };
  const fullName = `${user.firstName} ${user.lastName}`;

  const handleLogout = async() =>{
    await AsyncStorage.setItem('isLoggedIn', 'false');
    navigation.navigate("Login", { screen: "Login" })
  }

  return (
      <View className="flex-1 bg-white">
        <View className="h-36 justify-center items-center mt-10">
          <Image
            source={require('../assets/user_default_profile_photo.png')}
            className="w-36 h-36 rounded-full"
          />
        </View>
  
      <View className="mt-2">
        <InfoRow icon="user" text={fullName} />
        <InfoRow icon="mail" text={user.email} />
        <InfoRow icon="calendar" text={user.dob} />
        <InfoRow icon="map-pin" text={user.region} />
      </View>
  
      <TouchableOpacity className="mt-8 px-12 py-3 rounded-full self-center"
        style={{backgroundColor: colors.theme.green}}
        onPress={handleLogout}>
        <Text className="text-white text-base font-semibold">Logout</Text>
      </TouchableOpacity>
    </View>
    );
}
export default Settings;