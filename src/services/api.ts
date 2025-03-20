// src/services/api.js
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const api = axios.create({
  baseURL: 'https://localhost:7039', // আপনার API এর বেস URL
  withCredentials: true,
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user')); // localStorage থেকে ইউজার ডেটা লোড করুন
    if (user && user.jwt) {
      config.headers.Authorization = `Bearer ${user.jwt}`; // JWT টোকেন হেডারে যোগ করুন
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      // 401 Unauthorized এরর হলে লগআউট করুন
      const { logout } = useAuth();
      logout();
    }
    return Promise.reject(error);
  }
);

export default api;