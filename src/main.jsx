import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import Login from './components/account/Login';
import Register from './components/account/Register';
import Cart from './components/cart/Cart';
import Home from './components/Home';
import Customer from './components/Customer';
import Admin from './components/Admin';
import NotFound from './components/shared/NotFound';

ReactDOM.render(
  <Router>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<Home />} />
        <Route path="customer" element={<Customer />} />
        <Route path="admin" element={<Admin />} />
        <Route path="cart" element={<Cart />} />
        <Route path="account">
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  </Router>,
  document.getElementById('root')
);