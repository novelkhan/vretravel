import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { jwtDecode } from 'jwt-decode';
import { CustomJwtPayload } from '../types/jwt'; // Import the custom interface

const useUserHasNotRole = (roles: string[]) => {
  const { user } = useAuth();
  const [hasNotRole, setHasNotRole] = useState(false);

  useEffect(() => {
    if (user) {
      const decodedToken = jwtDecode<CustomJwtPayload>(user.jwt); // Use the custom type
      if (Array.isArray(decodedToken.role)) {
        setHasNotRole(!decodedToken.role.some(role => roles.includes(role)));
      } else {
        setHasNotRole(!roles.includes(decodedToken.role));
      }
    } else {
      setHasNotRole(true);
    }
  }, [user, roles]);

  return hasNotRole;
};

export default useUserHasNotRole;