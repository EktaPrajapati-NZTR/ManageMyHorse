import React,{useState} from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { colors } from '../constants/ColorConstant';
import URLConfig from '../constants/UrlConstant';
import loginApi from '../utils/loginApi';

const InfoRow = ({ icon, text }) => (
  <View className="flex-row items-center border-b border-gray-200 py-9 px-6">
    <Icon name={icon} size={20} color={colors.theme.green} />
    <Text className="ml-4 text-base text-black">{text}</Text>
  </View>
);

const Settings = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const user = {
    firstName: 'Ekta',
    lastName: 'Prajapati',
    email: 'ekta@example.com',
    dob: '27 August 1994',
    region: 'Waikato'
  };
  const fullName = `${user.firstName} ${user.lastName}`;

  const performLogout = async () => {
    await AsyncStorage.setItem('isLoggedIn', 'false');
    await AsyncStorage.removeItem('LoggedInUserInfo');
  
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  const handleLogout = async() => {
    try{
      if (isLoading) return;

      setIsLoading(true);
      const response = await loginApi.get(URLConfig.LOGIN.Logout());
      if (response && response.status === 200){
        await performLogout();
      }
    }catch(error){
      if (error.response && error.response.status === 401) {
        await performLogout();
      } else {
        Alert.alert("Logout Failed", "Something went wrong. Please try again.");
      }
    }finally{
      setIsLoading(false);
    }
    
  }

  return (
      <View className="flex-1 bg-white relative">

        {isLoading && (
          <View className="absolute top-0 left-0 right-0 bottom-0 z-50 justify-center items-center bg-white/70">
            <ActivityIndicator size="large" color={colors.theme.green} />
          </View>
        )}

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