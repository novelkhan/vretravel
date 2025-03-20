import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useEffect } from 'react';

const useJwtInterceptor = () => {
  const { user } = useAuth();

  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(config => {
      if (user) {
        config.headers.Authorization = `Bearer ${user.jwt}`;
      }
      return config;
    });

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
    };
  }, [user]);
};

export default useJwtInterceptor;