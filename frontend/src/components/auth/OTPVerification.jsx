import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import { toast } from 'react-toastify';

const otpSchema = yup.object({
  otpCode: yup
    .string()
    .length(6, 'Mã OTP phải có 6 chữ số')
    .required('Mã OTP không được để trống'),
}).required();

const OTPVerification = ({ 
  email, 
  onSuccess, 
  onBack, 
  onResend, 
  isLoading = false,
  title = "Xác thực OTP",
  subtitle = "Nhập mã xác thực đã được gửi đến email của bạn"
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm({
    resolver: yupResolver(otpSchema),
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post('http://localhost:8080/api/auth/verify-otp', {
        email: email,
        otpCode: data.otpCode,
      });
      
      if (response.data.message) {
        toast.success('Xác thực thành công!');
        onSuccess && onSuccess(response.data);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Xác thực OTP thất bại';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (onResend) {
      await onResend();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            {title}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
            {subtitle}
          </p>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
            Email: <strong>{email}</strong>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="otpCode" className="sr-only">
              Mã OTP
            </label>
            <input
              {...form.register('otpCode')}
              id="otpCode"
              name="otpCode"
              type="text"
              maxLength="6"
              required
              className={`appearance-none relative block w-full px-3 py-2 border ${form.formState.errors.otpCode ? 'border-red-300' : 'border-gray-300'} placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm text-center text-lg tracking-widest`}
              placeholder="000000"
            />
            {form.formState.errors.otpCode && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{form.formState.errors.otpCode.message}</p>
            )}
          </div>

          <div className="flex flex-col space-y-4">
            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Đang xác thực...' : 'Xác thực OTP'}
            </button>

            <button
              type="button"
              onClick={handleResend}
              disabled={isSubmitting || isLoading}
              className="text-sm text-indigo-600 hover:text-indigo-500 disabled:opacity-50"
            >
              Gửi lại mã OTP
            </button>

            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="text-sm text-gray-600 hover:text-gray-500"
              >
                Quay lại
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default OTPVerification; 