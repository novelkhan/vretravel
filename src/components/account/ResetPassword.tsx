import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  useEffect(() => {
    if (!token || !email) {
      navigate('/account/login');
    }
  }, [token, email, navigate]);

  const resetPassword = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    setErrorMessages([]);

    if (token && email) {
      try {
        const response = await axios.post('/api/account/reset-password', { token, email, newPassword });
        // Handle success notification
        navigate('/account/login');
      } catch (error) {
        if (error.response.data.errors) {
          setErrorMessages(error.response.data.errors);
        } else {
          setErrorMessages([error.response.data]);
        }
      }
    }
  };

  return (
    <div className="d-flex justify-content-center">
      <div className="col-12 col-lg-5">
        <main className="form-signin">
          <form onSubmit={resetPassword}>
            <div className="text-center mb-4">
              <h1 className="mb-3 font-weight-normal">Change your password</h1>
            </div>
            <div className="form-floating mb-3">
              <input
                type="email"
                className="form-control"
                placeholder="Email"
                value={email}
                disabled
              />
              <label>Email</label>
            </div>
            <div className="form-floating mb-3">
              <input
                type="password"
                className="form-control"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <label>New Password</label>
            </div>
            {errorMessages.length > 0 && (
              <ul className="text-danger">
                {errorMessages.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            )}
            <div className="row">
              <div className="col-6">
                <button type="submit" className="btn btn-success w-100">Change Password</button>
              </div>
              <div className="col-6">
                <button type="button" className="btn btn-danger w-100" onClick={() => navigate('/account/login')}>Cancel</button>
              </div>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

export default ResetPassword;