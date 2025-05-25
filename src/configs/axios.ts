import {BASE_URL} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

console.log(`BASE_URL: ${BASE_URL}`);

const instance = axios.create({
  //   baseURL: 'http://192.168.1.85:8000/api/',
  baseURL: BASE_URL,
});

instance.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

export default instance;
