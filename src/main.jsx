import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AccountProvider } from './context/AccountContext';

// ডিবাগিং লজিক: main.jsx লোড হচ্ছে কিনা চেক করা
console.log('main.jsx loaded successfully.');

// ডিবাগিং লজিক: window.bootstrap উপলব্ধ কিনা চেক করা
console.log('Checking if Bootstrap JS is loaded...');
if (window.bootstrap) {
  console.log('Bootstrap JS loaded successfully:', window.bootstrap);
} else {
  console.error('Bootstrap JS is not loaded. Ensure the CDN script in index.html is working and you have an internet connection.');
}

// এরর বাউন্ডারি কম্পোনেন্ট
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught in ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong. Please refresh the page.</h1>;
    }
    return this.props.children;
  }
}

const container = document.getElementById('root');
if (!container) {
  console.error('Root element not found. Ensure there is a <div id="root"> in your index.html.');
} else {
  const root = createRoot(container);
  root.render(
    <ErrorBoundary>
      <BrowserRouter>
        <AccountProvider>
          <App />
        </AccountProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}