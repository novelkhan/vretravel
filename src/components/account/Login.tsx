import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAccount } from '../../context/AccountContext';
import accountService from '../../services/AccountService';
import { Login } from '../../models/account';
import 'bootstrap/dist/css/bootstrap.min.css';

const schema = yup.object({
  userName: yup.string().required('Username is required'),
  password: yup.string().required('Password is required'),
}).required();

const LoginPage: React.FC = () => {
  const { user } = useAccount();
  const navigate = useNavigate();
  const location = useLocation();
  const [submitted, setSubmitted] = useState(false);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const returnUrl = (location.state as any)?.returnUrl || null;

  const { register, handleSubmit, formState: { errors } } = useForm<Login>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const onSubmit = async (data: Login) => {
    setSubmitted(true);
    setErrorMessages([]);

    try {
      await accountService.login(data);
      navigate(returnUrl || '/');
    } catch (error: any) {
      const errorMsg = error.response?.data || 'Invalid credentials';
      setErrorMessages([errorMsg]);
    }
  };

  const resendEmailConfirmationLink = () => {
    navigate('/account/send-email/resend-email-confirmation-link');
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="col-12 col-lg-5 p-4">
        <main>
          <form onSubmit={handleSubmit(onSubmit)} autoComplete="off" className="p-3">
            <div className="text-center mb-4">
              <h3 className="mb-3 fw-normal">Login</h3>
            </div>
            <div className="mb-3">
              <div className="form-floating">
                <input
                  {...register('userName')}
                  type="text"
                  className={`form-control ${submitted && errors.userName ? 'is-invalid' : ''}`}
                  placeholder="Username (your email address)"
                  id="userName"
                />
                <label htmlFor="userName">Username (your email address)</label>
                {submitted && errors.userName && (
                  <div className="invalid-feedback">{errors.userName.message}</div>
                )}
              </div>
            </div>
            <div className="mb-3">
              <div className="form-floating">
                <input
                  {...register('password')}
                  type="password"
                  className={`form-control ${submitted && errors.password ? 'is-invalid' : ''}`}
                  placeholder="Password"
                  id="password"
                />
                <label htmlFor="password">Password</label>
                {submitted && errors.password && (
                  <div className="invalid-feedback">{errors.password.message}</div>
                )}
              </div>
            </div>
            {errorMessages.length > 0 && (
              <div className="mb-3">
                <div className="text-danger">
                  {errorMessages.map((msg, idx) => (
                    <div key={idx}>{msg}</div>
                  ))}
                </div>
                {errorMessages[0].includes('Please confirm your email') && (
                  <button
                    type="button"
                    className="btn btn-link p-0"
                    onClick={resendEmailConfirmationLink}
                  >
                    Click here to resend email confirmation link in case you didn't receive it.
                  </button>
                )}
              </div>
            )}
            <div className="d-grid mt-4">
              <button className="btn btn-info btn-lg" type="submit">
                Log in
              </button>
            </div>
          </form>
          <div className="mt-4 text-center">
            <a
              className="btn btn-link"
              href="/account/send-email/forgot-username-or-password"
              onClick={(e) => {
                e.preventDefault();
                navigate('/account/send-email/forgot-username-or-password');
              }}
            >
              <h6 className="mb-0">Forgot username or password</h6>
            </a>
          </div>
        </main>
      </div>
    </div>
  );
};

export default LoginPage;