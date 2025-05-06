import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useAccount } from '../../context/AccountContext';
import accountService from '../../services/AccountService';
import sharedService from '../../services/SharedService';
import { Register } from '../../models/account';
import './Register.css';
import ValidationMessages from '../shared/ValidationMessages';

const schema = yup.object({
  firstName: yup
    .string()
    .required('First name is required')
    .min(3, 'First name must be at least 3 characters')
    .max(15, 'First name must be maximum 15 characters'),
  lastName: yup
    .string()
    .required('Last name is required')
    .min(3, 'Last name must be at least 3 characters')
    .max(15, 'Last name must be maximum 15 characters'),
  email: yup
    .string()
    .required('Email is required')
    .matches(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/, 'Invalid email address'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters')
    .max(15, 'Password must be maximum 15 characters'),
}).required();

const RegisterPage: React.FC = () => {
  const { user } = useAccount();
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);

  const { register, handleSubmit, formState: { errors } } = useForm<Register>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  // ✅ Logging error messages when they change
  useEffect(() => {
    if (errorMessages.length > 0) {
      console.log(errorMessages);
    }
  }, [errorMessages]);

  const onSubmit = async (data: Register) => {
    setSubmitted(true);
    setErrorMessages([]);

    try {
      const response = await accountService.register(data);
      sharedService.showNotification(true, response.data.value.title, response.data.value.message);
      navigate('/account/login');
    } catch (error: any) {
      const errorMsg = error.response?.data?.errors || [error.response?.data || 'Registration failed'];
      setErrorMessages(errorMsg);
    }
  };

  return (
    <div className="d-flex justify-content-center">
      <div className="col-12 col-lg-5">
        <main className="form-signin">
          <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            <div className="text-center mb-4">
              <h3 className="mb-3 font-weight-normal">
                Let's Get Started to <span className="text-danger">Play</span>
              </h3>
            </div>

            <div className="form-floating mb-3">
              <input
                {...register('firstName')}
                type="text"
                className={`form-control ${submitted && errors.firstName ? 'is-invalid' : ''}`}
                placeholder="First name"
              />
              <label htmlFor="firstName">First name</label>
              {submitted && errors.firstName && (
                <span className="text-danger">{errors.firstName.message}</span>
              )}
            </div>

            <div className="form-floating mb-3">
              <input
                {...register('lastName')}
                type="text"
                className={`form-control ${submitted && errors.lastName ? 'is-invalid' : ''}`}
                placeholder="Last name"
              />
              <label htmlFor="lastName">Last name</label>
              {submitted && errors.lastName && (
                <span className="text-danger">{errors.lastName.message}</span>
              )}
            </div>

            <div className="form-floating mb-3">
              <input
                {...register('email')}
                type="text"
                className={`form-control ${submitted && errors.email ? 'is-invalid' : ''}`}
                placeholder="Email"
              />
              <label htmlFor="email">Email</label>
              {submitted && errors.email && (
                <span className="text-danger">{errors.email.message}</span>
              )}
            </div>

            <div className="form-floating mb-3">
              <input
                {...register('password')}
                type="password"
                className={`form-control ${submitted && errors.password ? 'is-invalid' : ''}`}
                placeholder="Password"
              />
              <label htmlFor="password">Password</label>
              {submitted && errors.password && (
                <span className="text-danger">{errors.password.message}</span>
              )}
            </div>

            {errorMessages.length > 0 && (
              <div className="mb-3">
                <ValidationMessages errorMessages={errorMessages} />
              </div>
            )}

            <div className="d-grid mt-4 px-1">
              <button className="btn btn-lg btn-info" type="submit">
                Create Account
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

export default RegisterPage;