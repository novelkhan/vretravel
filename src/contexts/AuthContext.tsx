// src/contexts/AuthContext.tsx
import React, { createContext, useContext, ReactNode, useState } from 'react'; // React কে ইমপোর্ট করুন
import { useNavigate } from 'react-router-dom';

// User টাইপ ডিফাইন করুন
interface User {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  jwt: string;
}

// AuthContext টাইপ ডিফাইন করুন
interface AuthContextType {
  user: User | null;
  login: (credentials: { userName: string; password: string }) => Promise<void>;
  logout: () => void;
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
    // লগইন লজিক এখানে যোগ করুন
    const response = await fetch('/api/account/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    const data = await response.json();
    setUser(data);
    navigate('/');
  };

  const logout = () => {
    setUser(null);
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};