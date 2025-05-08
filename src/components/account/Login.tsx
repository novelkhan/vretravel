import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, useLocation } from 'react-router-dom';
import ValidationMessages from '../shared/ValidationMessages';
import { Login } from '../../models/account';
import { useAccount } from '../../context/AccountContext';
import accountService from '../../services/AccountService';
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

  // returnUrl হ্যান্ডল করা
  const query = new URLSearchParams(location.search);
  const returnUrl = query.get('returnUrl') || null;

  const { register, handleSubmit, formState: { errors, isSubmitted } } = useForm<Login>({
    resolver: yupResolver(schema),
    mode: 'onChange',
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
      console.log('Server error response:', error); // ডিবাগিংয়ের জন্য
      let errors: string[] = [];

      // ASP.NET Core এরর ফরম্যাট হ্যান্ডল করা
      if (error.response?.data?.Errors) {
        errors = error.response.data.Errors; // { Errors: string[] }
      } else if (error.response?.data?.errors) {
        errors = error.response.data.errors; // { errors: string[] }
      } else if (typeof error.response?.data === 'string') {
        errors = [error.response.data]; // স্ট্রিং হিসেবে এরর
      } else if (error.message) {
        errors = [error.message]; // ফলব্যাক মেসেজ
      } else {
        errors = ['Invalid credentials'];
      }

      setErrorMessages(errors);
    }
  };

  const resendEmailConfirmationLink = () => {
    navigate('/account/send-email/resend-email-confirmation-link');
  };

  return (
    <div className="d-flex justify-content-center">
      <div className="col-12 col-lg-5">
        <main className="form-signin w-100 p-3">
          <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            <div className="text-center mb-4">
              <h3 className="mb-3 font-weight-normal">Login</h3>
            </div>
            <div className="form-floating mb-3">
              <input
                {...register('userName')}
                type="text"
                className={`form-control ${errors.userName && (submitted || isSubmitted) ? 'is-invalid' : ''}`}
                placeholder="Username (your email address)"
                id="userName"
                autoComplete="username"
              />
              <label htmlFor="userName">Username (your email address)</label>
              {(submitted || isSubmitted) && errors.userName?.type === 'required' && (
                <span className="text-danger">Username is required</span>
              )}
            </div>
            <div className="form-floating mb-3">
              <input
                {...register('password')}
                type="password"
                className={`form-control ${errors.password && (submitted || isSubmitted) ? 'is-invalid' : ''}`}
                placeholder="Password"
                id="password"
                autoComplete="current-password"
              />
              <label htmlFor="password">Password</label>
              {(submitted || isSubmitted) && errors.password?.type === 'required' && (
                <span className="text-danger">Password is required</span>
              )}
            </div>
            {errorMessages.length > 0 && (
              <div className="form-floating mb-3">
                <ValidationMessages errorMessages={errorMessages} />
                {errorMessages[0].includes('Please confirm your email') && (
                  <a
                    className="btn btn-link p-0"
                    onClick={resendEmailConfirmationLink}
                    style={{ cursor: 'pointer' }}
                  >
                    Click here to resend email confirmation link in case you didn't receive it.
                  </a>
                )}
              </div>
            )}
            <div className="d-grid mt-4 px-1">
              <button className="btn btn-lg btn-info" type="submit">
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