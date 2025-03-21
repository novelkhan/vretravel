import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { environment } from '../environments';
import { jwtDecode } from 'jwt-decode';

interface User {
  email: string;
  role: string;
  jwt: string;
  exp?: number;
}

interface AccountContextType {
  user: User | null;
  login: (credentials: any) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  register: (data: any) => Promise<void>;
  resetPassword: (data: any) => Promise<void>;
  confirmEmail: (data: any) => Promise<void>;
  resendConfirmationEmail: (email: string) => Promise<void>;
}

const AccountContext = createContext<AccountContextType | undefined>(undefined);

export const useAccount = () => {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error('useAccount must be used within an AccountProvider');
  }
  return context;
};

export const AccountProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const refreshTokenTimeout = useRef<number | undefined>(undefined);
  const timeoutId = useRef<number | undefined>(undefined);

  const setUserFromToken = (token: string | null) => {
    if (token) {
      const decoded = jwtDecode<User>(token);
      setUser(decoded);
      localStorage.setItem('user', JSON.stringify(decoded));
      startRefreshTokenTimer(token);
      checkUserIdleTimeout(); // ✅ এখন ঠিকমতো কাজ করবে
    } else {
      setUser(null);
      localStorage.removeItem('user');
      stopRefreshTokenTimer();
    }
  };

  const login = async (credentials: any) => {
    try {
      const { data } = await axios.post(`${environment.apiUrl}/api/account/login`, credentials, { withCredentials: true });
      if (data) {
        setUserFromToken(data.jwt);
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    axios.post(`${environment.apiUrl}/api/account/logout`, {}, { withCredentials: true });
    stopRefreshTokenTimer();
    window.location.href = '/';
  };

  const refreshUser = async () => {
    const token = getJWT();
    if (token) {
      try {
        const { data } = await axios.get(`${environment.apiUrl}/api/account/refresh-page`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        if (data) {
          setUserFromToken(data.jwt);
        }
      } catch (error) {
        console.error('Refresh user failed:', error);
        logout();
      }
    }
  };

  const register = async (data) => {
    try {
      await axios.post(`${environment.apiUrl}/api/account/register`, data);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };
  
  const resetPassword = async (data) => {
    try {
      await axios.put(`${environment.apiUrl}/api/account/reset-password`, data);
    } catch (error) {
      console.error('Reset password failed:', error);
      throw error;
    }
  };
  
  const confirmEmail = async (data) => {
    try {
      await axios.put(`${environment.apiUrl}/api/account/confirm-email`, data);
    } catch (error) {
      console.error('Confirm email failed:', error);
      throw error;
    }
  };
  
  const resendConfirmationEmail = async (email) => {
    try {
      await axios.post(`${environment.apiUrl}/api/account/resend-email-confirmation-link/${email}`);
    } catch (error) {
      console.error('Resend confirmation link failed:', error);
      throw error;
    }
  };
  

  const getJWT = () => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      return user?.jwt;
    }
    return null;
  };

  const startRefreshTokenTimer = (token: string) => {
    const decoded = jwtDecode<User>(token);
    const expires = (decoded.exp ?? 0) * 1000;
    const timeout = expires - Date.now() - 30 * 1000;

    if (timeout > 0) {
      refreshTokenTimeout.current = window.setTimeout(refreshToken, timeout);
    }
  };

  const stopRefreshTokenTimer = () => {
    clearTimeout(refreshTokenTimeout.current);
  };

  const refreshToken = async () => {
    try {
      const { data } = await axios.post(`${environment.apiUrl}/api/account/refresh-token`, {}, { withCredentials: true });
      if (data) {
        setUserFromToken(data.jwt);
      }
    } catch (error) {
      console.error('Refresh token failed:', error);
      logout();
    }
  };

  const checkUserIdleTimeout = () => {
    if (user) {
      clearTimeout(timeoutId.current);
      timeoutId.current = window.setTimeout(() => {
        alert('Session is about to expire due to inactivity.');
        logout();
      }, 10 * 60 * 1000); // 10 minutes
    }
  };

  useEffect(() => {
    const resetIdleTimer = () => checkUserIdleTimeout();

    window.addEventListener('mousemove', resetIdleTimer);
    window.addEventListener('keydown', resetIdleTimer);

    return () => {
      window.removeEventListener('mousemove', resetIdleTimer);
      window.removeEventListener('keydown', resetIdleTimer);
    };
  }, [user]);

  useEffect(() => {
    refreshUser(); // অ্যাপে ঢুকার সময় user রিফ্রেশ করা
  }, []);

  return (
    <AccountContext.Provider value={{
      user,
      login,
      logout,
      refreshUser,
      register,
      resetPassword,
      confirmEmail,
      resendConfirmationEmail
    }}>
      {children}
    </AccountContext.Provider>
  );
};
