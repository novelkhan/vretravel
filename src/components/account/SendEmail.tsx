import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios, { AxiosError } from 'axios';

const SendEmail = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const { mode } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!mode) {
      navigate('/account/login');
      return;
    }
  }, [mode, navigate]);

  const sendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setErrorMessages([]);

    if (mode) {
      try {
        const response = await axios.post(`/api/account/${mode}`, { email });
        navigate('/account/login');
      } catch (err) {
        const error = err as AxiosError<any>; // 👈 এখানে টাইপ কাস্ট
        if (error.response?.data?.errors) {
          setErrorMessages(error.response.data.errors);
        } else if (error.response?.data) {
          setErrorMessages([error.response.data]);
        } else {
          setErrorMessages(['Something went wrong.']);
        }
      }
    }
  };

  return (
    <div className="d-flex justify-content-center">
      <div className="col-12 col-lg-5">
        <main className="form-signin">
          <form onSubmit={sendEmail}>
            <div className="text-center mb-4">
              <h1 className="mb-3 font-weight-normal">
                {mode && mode.includes('resend-email-confirmation-link')
                  ? 'Resend email confirmation link'
                  : 'Retrieve your username or password'}
              </h1>
            </div>
            <div className="form-floating mb-3">
              <input
                type="email"
                className="form-control"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label>Email</label>
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
                <button type="submit" className="btn btn-success w-100">Send</button>
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

export default SendEmail;