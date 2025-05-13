import axios from 'axios';

import URLConfig from '../constants/UrlConstant';
import { getLoggedInUserInfo } from '../utils/helper';

const loginApi = axios.create({
    
    baseURL: URLConfig.LOGIN_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'API-Key': 'secretsquirrel'
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
