import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { setupJwtInterceptor } from './interceptors/JwtInterceptor';
import { AccountProvider } from './context/AccountContext';

// Interceptor সেটআপ
setupJwtInterceptor();

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <BrowserRouter
    future={{
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    }}
  >
    <AccountProvider>
      <App />
    </AccountProvider>
  </BrowserRouter>
);