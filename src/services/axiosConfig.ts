import axios from 'axios';
import accountService from './AccountService';

axios.interceptors.request.use(
  (config) => {
    const jwt = accountService.getJWT();
    if (jwt) {
      config.headers['Authorization'] = `Bearer ${jwt}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // টোকেন এক্সপায়ার্ড বা ইনভ্যালিড হলে লগআউট করুন
      accountService.logout();
    }
    return Promise.reject(error);
  }
);

export default axios;