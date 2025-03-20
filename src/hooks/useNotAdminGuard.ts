import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const useNotAdminGuard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.role === 'Admin') {
      navigate('/');
    }
  }, [user, navigate]);
};

export default useNotAdminGuard;