import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const schema = yup.object({
  email: yup
    .string()
    .email('Email không hợp lệ')
    .required('Email không được để trống'),
}).required();

const ForgotPasswordForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const email = watch('email');

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:8080/api/auth/forgot-password/request', {
        email: data.email,
      });
      
      if (response.data.message) {
        setIsSubmitted(true);
        toast.success('Mã xác thực đã được gửi đến email của bạn!');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Gửi yêu cầu thất bại';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
              Kiểm tra email
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
              Chúng tôi đã gửi mã xác thực đến <strong>{email}</strong>
            </p>
          </div>
          
          <div className="text-center space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Vui lòng kiểm tra email và làm theo hướng dẫn để đặt lại mật khẩu.
            </p>
            <Link
              to="/login"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Quay lại trang đăng nhập
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Quên mật khẩu
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
            Nhập email để nhận hướng dẫn đặt lại mật khẩu.
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                {...register('email')}
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${errors.email ? 'border-red-300' : 'border-gray-300'} placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                placeholder="Email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Đang gửi...' : 'Gửi mã xác thực'}
              </button>
            </div>

            <div className="text-center">
              <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                Quay lại trang đăng nhập
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordForm; 