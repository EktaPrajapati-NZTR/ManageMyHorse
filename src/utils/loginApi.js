import axios from 'axios';

import URLConfig from '../constants/UrlConstant';
import { getLoggedInUserInfo } from '../utils/helper';
import { Login_API_KEY } from '../../appKeys';

const loginApi = axios.create({
    
    baseURL: URLConfig.LOGIN_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'API-Key': Login_API_KEY
    },
});

loginApi.interceptors.request.use(async (config) => {

    const userInfo = await getLoggedInUserInfo();
    const authToken = userInfo?.apiKey;

    if (authToken) {
      config.headers['Auth-Token'] = authToken;
    }
    return config;
  });

export default loginApi;
