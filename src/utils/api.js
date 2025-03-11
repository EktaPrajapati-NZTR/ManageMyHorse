import axios from 'axios';
import URLConfig from '../constants/UrlConstant';

const api = axios.create({
    baseURL: URLConfig.BASE_URL,
    headers:{
        'Content-Type':'application/json',
        'Accept': 'application/json'
        // Optionally add authentication tokens or other headers when needed
        // 'Authorization': `Bearer ${your_token}`,
    }
});

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        return Promise.reject(error);
    }
)
export default api;
