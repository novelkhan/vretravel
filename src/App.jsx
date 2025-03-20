import React, { Suspense } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/Home';
import NotFound from './components/shared/NotFound';

const Admin = React.lazy(() => import('./components/admin/Admin'));
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
  return (
    <div>
      <Navbar />
      <div className="container mt-5" style={{ minHeight: '500px' }}>
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

const App = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="customer" element={<Customer />} />
          <Route path="admin" element={<Admin />} />
          <Route path="cart" element={<Cart />} />
          <Route path="order-history" element={<OrderHistory />} />
          <Route path="order-details/:id" element={<OrderDetails />} />
          <Route path="packages" element={<Packages />} />
          <Route path="packages/add-package" element={<AddPackage />} />
          <Route path="packages/edit-package/:id" element={<EditPackage />} />
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
