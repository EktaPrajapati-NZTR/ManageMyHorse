import axios from 'axios';
import URLConfig from '../constants/UrlConstant';

const loginApi = axios.create({
    baseURL: URLConfig.LOGIN_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'API-Key': 'secretsquirrel',
    },
});

export default loginApi;
