// src/components/account/Login.tsx
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [credentials, setCredentials] = useState({ userName: '', password: '' });
  const { login } = useAuth(); // useAuth থেকে login ফাংশন ডিস্ট্রাকচার করুন
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(credentials); // login ফাংশন কল করুন
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="d-flex justify-content-center">
      <div className="col-12 col-lg-5">
        <main className="form-signin">
          <form onSubmit={handleSubmit}>
            <div className="text-center mb-4">
              <h3 className="mb-3 font-weight-normal">Login</h3>
            </div>
            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Username"
                value={credentials.userName}
                onChange={(e) => setCredentials({ ...credentials, userName: e.target.value })}
              />
              <label>Username</label>
            </div>
            <div className="form-floating mb-3">
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              />
              <label>Password</label>
            </div>
            <div className="d-grid mt-4 px-1">
              <button type="submit" className="btn btn-lg btn-info">
                Log in
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

export default Login;