import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { jwtDecode } from 'jwt-decode';
import { CustomJwtPayload } from '../types/jwt'; // Import the custom interface

const useUserHasRole = (roles: string[]) => {
  const { user } = useAuth();
  const [hasRole, setHasRole] = useState(false);

  useEffect(() => {
    if (user) {
      const decodedToken = jwtDecode<CustomJwtPayload>(user.jwt); // Use the custom type
      if (Array.isArray(decodedToken.role)) {
        setHasRole(decodedToken.role.some(role => roles.includes(role)));
      } else {
        setHasRole(roles.includes(decodedToken.role));
      }
    }
  }, [user, roles]);

  return hasRole;
};

export default useUserHasRole;