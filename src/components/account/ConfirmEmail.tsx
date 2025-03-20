import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const ConfirmEmail = () => {
  const [success, setSuccess] = useState(true);
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    } else {
      const token = searchParams.get('token');
      const email = searchParams.get('email');

      if (token && email) {
        axios.post('/api/account/confirm-email', { token, email })
          .then(response => {
            // Handle success notification
          })
          .catch(error => {
            setSuccess(false);
            // Handle error notification
          });
      }
    }
  }, [user, navigate, searchParams]);

  const resendEmailConfirmationLink = () => {
    navigate('/account/send-email/resend-email-confirmation-link');
  };

  return (
    <div className="container text-center">
      {success ? (
        <a className="btn btn-primary" href="/account/login">Login</a>
      ) : (
        <a className="btn btn-link" onClick={resendEmailConfirmationLink}>
          Click here to resend email confirmation link
        </a>
      )}
    </div>
  );
};

export default ConfirmEmail;