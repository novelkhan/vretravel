import React, { createContext, useContext, ReactNode, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { environment } from '../environments';

// User টাইপ ডিফাইন করুন
interface User {
  firstName: string; // Required
  lastName: string; // Required
  email: string; // Required
  role: string; // Required
  jwt: string; // Required
}

// AuthContext টাইপ ডিফাইন করুন
interface AuthContextType {
  user: User | null;
  login: (credentials: { userName: string; password: string }) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

// AuthContext তৈরি করুন
const AuthContext = createContext<AuthContextType | null>(null);

// useAuth হুক তৈরি করুন
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// AuthProvider কম্পোনেন্ট তৈরি করুন
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  const login = async (credentials: { userName: string; password: string }) => {
    try {
      const response = await fetch(`${environment.apiUrl}/api/account/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      if (!response.ok) {
        throw new Error('Login failed');
      }
      const data = await response.json();
      setUser(data); // ইউজার ডেটা সেট করুন
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      // Handle the login error, maybe show an error message to the user
    }
  };

  const logout = () => {
    setUser(null); // ইউজার ডেটা null সেট করুন
    navigate('/');
  };

  const refreshToken = async () => {
    try {
      const response = await fetch(`${environment.apiUrl}/api/account/refresh-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Include cookies if needed
      });
      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }
      const data = await response.json();
      if (data.jwt) {
        setUser((prevUser) => {
          if (!prevUser) {
            return null; // যদি prevUser null হয়, তাহলে null রিটার্ন করুন
          }
          return {
            ...prevUser, // পূর্বের ইউজার ডেটা কপি করুন
            jwt: data.jwt, // নতুন JWT টোকেন আপডেট করুন
          };
        });
      } else {
        throw new Error('Failed to refresh token');
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
      logout(); // Logout the user if token refresh fails
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, refreshToken }}>
      {children}
    </AuthContext.Provider>
  );
};