// src/hooks/useAuthGuard.js
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const useAuthGuard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/account/login'); // ইউজার লগইন না থাকলে লগইন পেজে রিডাইরেক্ট করুন
    }
  }, [user, navigate]);
};