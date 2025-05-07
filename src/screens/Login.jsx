import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

import { colors } from '../constants/ColorConstant';

const Login = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1 bg-white"
    >
      <ScrollView
      className="px-6"
      contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
        {/* Title */}
        <Text className="text-center text-xl font-semibold mb-4">Log in</Text>

        <TextInput
          placeholder="Email/Logon"
          placeholderTextColor={colors.theme.silver}
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          className="border border-gray-300 rounded-md p-3 mb-3 text-m text-black"
        />
        
        <View className="border border-gray-300 rounded-md mb-2 flex-row items-center px-3">
          <TextInput
            placeholder="Password"
            placeholderTextColor={colors.theme.silver}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            value={password}
            onChangeText={setPassword}
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
        
        {/* Forgot Password */}
        <TouchableOpacity className='mb-6'>
          <Text className="text-right text-black text-m mb-6 font-medium">Forgot password?</Text>
        </TouchableOpacity>

        <View>
          {/* Log in Button */}
          <TouchableOpacity className="bg-black rounded-full py-3" 
            onPress={() => navigation.reset({
              index: 0, 
              routes: [{ name: 'BottomTabNavigator' }]
            })}>
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
