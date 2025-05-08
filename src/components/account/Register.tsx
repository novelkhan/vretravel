import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import ValidationMessages from '../shared/ValidationMessages';
import { Register } from '../../models/account';
import { useAccount } from '../../context/AccountContext';
import accountService from '../../services/AccountService';
import sharedService from '../../services/SharedService';

const schema = yup.object({
  firstName: yup
    .string()
    .required('First name is required')
    .min(3, 'First name must be at least 3, and maximum 15 characters')
    .max(15, 'First name must be at least 3, and maximum 15 characters'),
  lastName: yup
    .string()
    .required('Last name is required')
    .min(3, 'Last name must be at least 3, and maximum 15 characters')
    .max(15, 'Last name must be at least 3, and maximum 15 characters'),
  email: yup
    .string()
    .required('Email is required')
    .matches(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/, 'Invalid email address'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6, and maximum 15 characters')
    .max(15, 'Password must be at least 6, and maximum 15 characters'),
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
      sharedService.showNotification(true, response.value.title, response.value.message);
      navigate('/account/login');
    } catch (error: any) {
      if (error.error?.errors) {
        setErrorMessages(error.error.errors);
      } else {
        setErrorMessages([error.error || 'Registration failed']);
      }
    }
  };

  return (
    <div className="d-flex justify-content-center">
      <div className="col-12 col-lg-5">
        <main className="w-100 p-3">
          <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            <div className="text-center mb-4">
              <h3 className="mb-3 fw-normal">
                Let's Get Started to <span className="text-danger">Play</span>
              </h3>
            </div>
            <div className="form-floating mb-3">
              <input
                {...register('firstName')}
                type="text"
                className={`form-control ${submitted && errors.firstName ? 'is-invalid' : ''}`}
                placeholder="First name"
                id="firstName"
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
                id="lastName"
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
                id="email"
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
                id="password"
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