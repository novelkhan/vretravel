import React from 'react';
import { jwtDecode } from 'jwt-decode';
import { useAccount } from '../../context/AccountContext';

interface UserHasNotRoleProps {
  roles: string[];
  children: React.ReactNode;
}

export const UserHasNotRole: React.FC<UserHasNotRoleProps> = ({ roles, children }) => {
  const { user } = useAccount();

  if (!user) {
    return <>{children}</>; // ইউজার না থাকলে কনটেন্ট দেখাবে (Angular-এর মতো)
  }

  const decodedToken: any = jwtDecode(user.jwt);
  const userRoles = Array.isArray(decodedToken.role) ? decodedToken.role : [decodedToken.role];

  // যদি ইউজারের কোনো রোল ইনপুট রোলের সাথে না মেলে, তাহলে কনটেন্ট দেখাবে
  if (!userRoles.some((role: string) => roles.includes(role))) {
    return <>{children}</>;
  }

  return null; // রোল মিললে কিছু রেন্ডার করবে না
};