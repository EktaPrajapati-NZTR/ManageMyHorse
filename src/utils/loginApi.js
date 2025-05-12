import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import URLConfig from '../constants/UrlConstant';

const loginApi = axios.create({
    
    baseURL: URLConfig.LOGIN_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'API-Key': 'secretsquirrel'
    },
});

loginApi.interceptors.request.use(async (config) => {

    const userInfoString = await AsyncStorage.getItem('LoggedInUserInfo');
    const userInfo = userInfoString ? JSON.parse(userInfoString) : null;
    const authToken = userInfo?.apiKey;

    if (authToken) {
      config.headers['Auth-Token'] = authToken;
    }
    return config;
  });

export default loginApi;
