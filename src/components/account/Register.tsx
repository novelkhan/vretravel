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
    .email('Invalid email address'),
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

  const { register, handleSubmit, formState: { errors, isSubmitted } } = useForm<Register>({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    console.log('Form errors:', errors);
  }, [errors]);

  const onSubmit = async (data: Register) => {
    setSubmitted(true);
    setErrorMessages([]);

    try {
      const response = await accountService.register(data);
      // সফল রেসপন্সে value প্রপার্টি চেক করা
      if (response?.value?.title && response?.value?.message) {
        sharedService.showNotification(true, response.value.title, response.value.message);
        navigate('/account/login');
      } else {
        throw new Error('Invalid response format');
      }
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
        errors = ['Registration failed'];
      }

      setErrorMessages(errors);
    }
  };

  return (
    <div className="d-flex justify-content-center">
      <div className="col-12 col-lg-5">
        <main className="form-signin w-100 p-3">
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
                className={`form-control ${errors.firstName && (submitted || isSubmitted) ? 'is-invalid' : ''}`}
                placeholder="First name"
                id="firstName"
                autoComplete="given-name"
              />
              <label htmlFor="firstName">First name</label>
              {(submitted || isSubmitted) && errors.firstName?.type === 'required' && (
                <span className="text-danger">First name is required</span>
              )}
              {(submitted || isSubmitted) && (errors.firstName?.type === 'min' || errors.firstName?.type === 'max') && (
                <span className="text-danger">First name must be at least 3, and maximum 15 characters</span>
              )}
            </div>
            <div className="form-floating mb-3">
              <input
                {...register('lastName')}
                type="text"
                className={`form-control ${errors.lastName && (submitted || isSubmitted) ? 'is-invalid' : ''}`}
                placeholder="Last name"
                id="lastName"
                autoComplete="family-name"
              />
              <label htmlFor="lastName">Last name</label>
              {(submitted || isSubmitted) && errors.lastName?.type === 'required' && (
                <span className="text-danger">Last name is required</span>
              )}
              {(submitted || isSubmitted) && (errors.lastName?.type === 'min' || errors.lastName?.type === 'max') && (
                <span className="text-danger">Last name must be at least 3, and maximum 15 characters</span>
              )}
            </div>
            <div className="form-floating mb-3">
              <input
                {...register('email')}
                type="email"
                className={`form-control ${errors.email && (submitted || isSubmitted) ? 'is-invalid' : ''}`}
                placeholder="Email"
                id="email"
                autoComplete="email"
              />
              <label htmlFor="email">Email</label>
              {(submitted || isSubmitted) && errors.email?.type === 'required' && (
                <span className="text-danger">Email is required</span>
              )}
              {(submitted || isSubmitted) && errors.email?.type === 'email' && (
                <span className="text-danger">Invalid email address</span>
              )}
            </div>
            <div className="form-floating mb-3">
              <input
                {...register('password')}
                type="password"
                className={`form-control ${errors.password && (submitted || isSubmitted) ? 'is-invalid' : ''}`}
                placeholder="Password"
                id="password"
                autoComplete="new-password"
              />
              <label htmlFor="password">Password</label>
              {(submitted || isSubmitted) && errors.password?.type === 'required' && (
                <span className="text-danger">Password is required</span>
              )}
              {(submitted || isSubmitted) && (errors.password?.type === 'min' || errors.password?.type === 'max') && (
                <span className="text-danger">Password must be at least 6, and maximum 15 characters</span>
              )}
            </div>
            {errorMessages.length > 0 && (
              <div className="form-floating mb-3">
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