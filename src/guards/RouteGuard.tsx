import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import accountService from '../services/AccountService'; // আপনার AccountService ফাইলের পাথ
import sharedService from '../services/SharedService'; // আপনার SharedService ফাইলের পাথ
import React from 'react';

interface GuardConfig {
  requireAuth?: boolean; // AuthorizationGuard
  requireAdmin?: boolean; // AdminGuard
  requireNotAdmin?: boolean; // NotAdminGuard
}

export const RouteGuard = ({ requireAuth, requireAdmin, requireNotAdmin }: GuardConfig) => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = accountService.getCurrentUser();

  // Authorization Guard Logic
  if (requireAuth && !user) {
    sharedService.showNotification(false, 'Restricted Area', 'Leave immediately!');
    navigate('/account/login', { state: { returnUrl: location.pathname }, replace: true });
    return null;
  }

  // Admin Guard Logic
  if (requireAdmin && (!user || !(jwtDecode(user.jwt) as any).role?.includes('Admin'))) {
    sharedService.showNotification(false, 'Admin Area', 'Leave now!');
    navigate('/', { replace: true });
    return null;
  }

  // NotAdmin Guard Logic
  if (requireNotAdmin && user && (jwtDecode(user.jwt) as any).role?.includes('Admin')) {
    sharedService.showNotification(
      false,
      'Customer Area',
      'This service is not available to admin. \nPlease leave now!'
    );
    navigate('/', { replace: true });
    return null;
  }

  // সব শর্ত পূরণ হলে রাউটের কনটেন্ট রেন্ডার করা হবে
  return <Outlet />;
};