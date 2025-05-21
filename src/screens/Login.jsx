import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, 
  ScrollView, ActivityIndicator, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { colors } from '../constants/ColorConstant';
import URLConfig from '../constants/UrlConstant';
import loginApi from '../utils/loginApi';

const Login = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleLogin = async() =>{

    let valid = true;

    // Reset previous errors
    setEmailError('');
    setPasswordError('');

    if (!email.trim()) {
      setEmailError('Please enter a valid email or logon.');
      valid = false;
    }

    if (!password.trim()) {
      setPasswordError('Please enter a valid password.');
      valid = false;
    }

    if (valid) {
      try{
        if (isLoading) return;

        let loginData = {
          username: email,
          password: password
        }
        setIsLoading(true);
        const response = await loginApi.post(URLConfig.LOGIN.Login(), loginData);

        if (response && response.status === 200 && response.data?.contactDetails) {
          const userInfo = {
            ...response.data.contactDetails,
            username: loginData.username
          };

          await AsyncStorage.setItem('LoggedInUserInfo', JSON.stringify(userInfo));
          await AsyncStorage.setItem('isLoggedIn', 'true');

          navigation.reset({
            index: 0, 
            routes: [{ name: 'BottomTabNavigator' }]
          })
        }
      }catch(error){
        if(error && error.response && error.response.status == 500){
          Alert.alert('Login Failed', 'Invalid username or password.');
        }else{
          Alert.alert('Login Failed', 'An error occurred during login. Please try again.');
        }
      }finally{
        setIsLoading(false);
      }
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1 bg-white relative"
    >
      {isLoading && (
        <View className="absolute top-0 left-0 right-0 bottom-0 z-50 justify-center items-center bg-white/70">
          <ActivityIndicator size="large" color={colors.theme.green} />
        </View>
      )}
      
      <ScrollView
      className="px-6"
      contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
      keyboardShouldPersistTaps="handled">
        {/* Title */}
        <Text className="text-center text-xl font-semibold mb-5">Log in</Text>

        <TextInput
          placeholder="Email/Logon"
          placeholderTextColor={colors.theme.silver}
          autoCapitalize="none"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setEmailError(''); // Clear error while typing
          }}
          className={`border border-gray-300 rounded-md p-3 ${emailError ? 'mb-0' : 'mb-3'} text-m text-black`}
        />
        {emailError ? <Text className="text-red-600 mb-3 text-sm">{emailError}</Text> : null}
        
        <View className="border border-gray-300 rounded-md flex-row items-center px-3">
          <TextInput
            placeholder="Password"
            placeholderTextColor={colors.theme.silver}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setPasswordError(''); // Clear error while typing
            }}
            className="flex-1 py-3 text-base text-black"
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Icon
              name={!showPassword ? 'eye' : 'eye-off'}
              size={20}
              color={colors.theme.silver}
            />
          </TouchableOpacity>
        </View>
        {passwordError ? <Text className="text-red-600 text-sm">{passwordError}</Text> : null}
        
        <View>
          {/* Log in Button */}
          <TouchableOpacity className="rounded-full py-3 self-center px-12 mt-8" 
            style={{backgroundColor: colors.theme.green}}
            onPress={handleLogin}>
            <Text className="text-center text-white font-semibold">Log in</Text>
          </TouchableOpacity>

          {/* Terms and Privacy */}
          {/* <View className="flex-row flex-wrap justify-center items-center mb-4 px-6 mt-2">
            <Text className="text-sm text-black">By continuing, you agree to our </Text>
            <TouchableOpacity onPress={() => console.log('Terms of Services Pressed')}>
              <Text className="text-sm text-black underline">Terms of Services</Text>
            </TouchableOpacity>
            <Text className="text-sm text-black"> and </Text>
            <TouchableOpacity onPress={() => console.log('Terms and Conditions pressed')}>
              <Text className="text-sm text-black underline">Privacy Policy</Text>
            </TouchableOpacity>
            <Text className="text-sm text-black">.</Text>
          </View> */}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Login;
