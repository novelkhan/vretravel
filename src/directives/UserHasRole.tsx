import React from 'react';
import { jwtDecode } from 'jwt-decode';
import { useAccount } from '../context/AccountContext';

interface UserHasRoleProps {
  roles: string[];
  children: React.ReactNode;
}

export const UserHasRole: React.FC<UserHasRoleProps> = ({ roles, children }) => {
  const { user } = useAccount();

  if (!user) {
    return null; // ইউজার না থাকলে কিছু রেন্ডার করবে না
  }

  const decodedToken: any = jwtDecode(user.jwt);
  const userRoles = Array.isArray(decodedToken.role) ? decodedToken.role : [decodedToken.role];

  // যদি ইউজারের কোনো রোল ইনপুট রোলের সাথে মেলে, তাহলে কনটেন্ট দেখাবে
  if (userRoles.some((role: string) => roles.includes(role))) {
    return <>{children}</>;
  }

  return null; // রোল না মিললে কিছু রেন্ডার করবে না
};