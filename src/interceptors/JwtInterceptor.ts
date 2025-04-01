import axios from 'axios';
import accountService from '../services/AccountService';

export const setupJwtInterceptor = () => {
  axios.interceptors.request.use(
    (config) => {
      const user = accountService.getCurrentUser(); // AccountService থেকে বর্তমান ইউজার পাওয়া
      if (user && user.jwt) {
        // Authorization হেডারে JWT টোকেন যোগ করা
        config.headers['Authorization'] = `Bearer ${user.jwt}`;
      }
      return config;
    },
    (error) => {
      // রিকোয়েস্টে ত্রুটি হলে প্রত্যাখ্যান
      return Promise.reject(error);
    }
  );
};