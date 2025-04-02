import React, { Suspense, useEffect } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/Home';
import NotificationComponent from './components/shared/NotificationComponent';
import ExpiringSessionCountdownComponent from './components/shared/ExpiringSessionCountdownComponent';
import NotFound from './components/shared/NotFound';
import { RouteGuard } from './guards/RouteGuard';
import accountService from './services/AccountService';
import sharedService from './services/SharedService';

const Admin = React.lazy(() => import('./components/admin/Admin'));
const AddEditMember = React.lazy(() => import('./components/admin/AddEditMember'));
const Customer = React.lazy(() => import('./components/Customer'));
const Cart = React.lazy(() => import('./components/cart/Cart'));
const OrderHistory = React.lazy(() => import('./components/order/OrderHistory'));
const OrderDetails = React.lazy(() => import('./components/order/OrderDetails'));
const Packages = React.lazy(() => import('./components/package/Packages'));
const AddPackage = React.lazy(() => import('./components/package/AddPackage'));
const EditPackage = React.lazy(() => import('./components/package/EditPackage'));
const Login = React.lazy(() => import('./components/account/Login'));
const Register = React.lazy(() => import('./components/account/Register'));

const AppLayout = () => {
  const checkUserActivity = () => {
    console.log('User activity detected, checking idle timeout...'); // ডিবাগিং লজিক
    accountService.checkUserIdleTimeout();
  };

  useEffect(() => {
    window.addEventListener('keydown', checkUserActivity);
    window.addEventListener('mousedown', checkUserActivity);

    return () => {
      window.removeEventListener('keydown', checkUserActivity);
      window.removeEventListener('mousedown', checkUserActivity);
    };
  }, []);

  return (
    <div>
      <Navbar />
      <NotificationComponent />
      <ExpiringSessionCountdownComponent />
      <div style={{ maxWidth: '1200px', margin: '0 auto', paddingTop: '3rem', minHeight: '500px' }}>
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

const App = () => {
  useEffect(() => {
    const jwt = accountService.getJWT();
    if (jwt) {
      accountService.refreshUser(jwt).catch((error) => {
        accountService.logout();
        if (error.response?.status === 401) {
          sharedService.showNotification(false, 'Account blocked', error.response?.data || 'Unauthorized');
        }
      });
    } else {
      accountService.refreshUser(null);
    }
  }, []);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route element={<RouteGuard requireAuth />}>
            <Route element={<RouteGuard requireNotAdmin />}>
              <Route path="customer" element={<Customer />} />
            </Route>
            <Route element={<RouteGuard requireAdmin />}>
              <Route path="admin" element={<Admin />} />
              <Route path="admin/add-edit-member" element={<AddEditMember />} />
              <Route path="admin/add-edit-member/:id" element={<AddEditMember />} />
              <Route path="packages/add-package" element={<AddPackage />} />
              <Route path="packages/edit-package/:id" element={<EditPackage />} />
            </Route>
            <Route path="cart" element={<Cart />} />
            <Route path="order-history" element={<OrderHistory />} />
            <Route path="order-details/:id" element={<OrderDetails />} />
            <Route path="packages" element={<Packages />} />
          </Route>
          <Route path="account">
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default App;