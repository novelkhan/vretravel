// src/App.jsx বা src/App.tsx
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/Home';
import NotFound from './components/NotFound';

// লেজি লোডিং ব্যবহার করে Admin এবং Customer কম্পোনেন্ট ইমপোর্ট করুন
const Admin = React.lazy(() => import('./components/Admin'));
const Customer = React.lazy(() => import('./components/Customer'));

const AppLayout = () => {
  return (
    <div>
      <Navbar />
      <div className="container mt-5" style={{ minHeight: '500px' }}>
        {/* Outlet ব্যবহার করে নেস্টেড রাউট রেন্ডার করুন */}
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

const App = () => {
  return (
    <Router>
      {/* Suspense ব্যবহার করে লোডিং স্টেট হ্যান্ডেল করুন */}
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {/* AppLayout কম্পোনেন্ট ব্যবহার করে মূল লেআউট সেট করুন */}
          <Route element={<AppLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/customer" element={<Customer />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;