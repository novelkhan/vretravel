import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="text-center mt-5">
      <h1 className="h1">404 - Not Found</h1>
      <p className="lead">The page you are looking for does not exist.</p>
      <button className="btn btn-primary" onClick={() => navigate('/')}>
        Go to Home
      </button>
    </div>
  );
};

export default NotFound;