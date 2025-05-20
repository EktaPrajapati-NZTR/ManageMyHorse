import axios from 'axios';
import { Alert } from "react-native";

import URLConfig from '../constants/UrlConstant';
import { IdMyTb_API_KEY } from '../../appKeys';

const api = axios.create({
    baseURL: URLConfig.BASE_URL,
    headers:{
        'Content-Type':'application/json',
        'Accept': 'application/json',
        'IdMyTb-api-key': IdMyTb_API_KEY
    }
});

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    Alert.alert('Unauthorized', 'You are not authorized to access this resource.');
                    break;
            } 
        }
        return Promise.reject(error);
    }
)
export default api;
