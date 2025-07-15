import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import OTPVerification from './OTPVerification';

const step1Schema = yup.object({
  email: yup
    .string()
    .email('Email không hợp lệ')
    .required('Email không được để trống'),
  fullName: yup
    .string()
    .min(2, 'Họ và tên phải ít nhất 2 ký tự')
    .required('Họ và tên không được để trống'),
  password: yup
    .string()
    .min(6, 'Mật khẩu phải ít nhất 6 ký tự')
    .required('Mật khẩu không được để trống'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Mật khẩu không khớp')
    .required('Xác nhận mật khẩu không được để trống'),
  role: yup
    .string()
    .oneOf(['PLAYER', 'OWNER'], 'Vai trò không hợp lệ')
    .required('Bạn phải chọn vai trò'),
}).required();



const RegisterForm = () => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [pendingEmail, setPendingEmail] = useState('');
  const navigate = useNavigate();

  const step1Form = useForm({
    resolver: yupResolver(step1Schema),
    defaultValues: { role: 'PLAYER' },
  });



  const onStep1Submit = async (data) => {
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:8080/api/auth/register', data);
      
      if (response.data.message) {
        setPendingEmail(data.email);
        setStep(2);
        toast.success('OTP đã được gửi đến email của bạn!');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Đăng ký thất bại';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const onOTPSuccess = (data) => {
    toast.success('Đăng ký thành công! Vui lòng đăng nhập.');
    navigate('/login');
  };

  const resendOTP = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:8080/api/auth/register', {
        email: pendingEmail,
        fullName: step1Form.getValues('fullName'),
        password: step1Form.getValues('password'),
        confirmPassword: step1Form.getValues('confirmPassword'),
        role: step1Form.getValues('role'),
      });
      
      if (response.data.message) {
        toast.success('OTP mới đã được gửi!');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Gửi lại OTP thất bại';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Đăng ký tài khoản mới
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
            Đã có tài khoản?{' '}
            <button
              onClick={() => navigate('/login')}
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Đăng nhập
            </button>
          </p>
        </div>

        {step === 1 ? (
          <form className="mt-8 space-y-6" onSubmit={step1Form.handleSubmit(onStep1Submit)}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email" className="sr-only">
                  Email
                </label>
                <input
                  {...step1Form.register('email')}
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                    step1Form.formState.errors.email ? 'border-red-300' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                  placeholder="Email"
                />
                {step1Form.formState.errors.email && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{step1Form.formState.errors.email.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="fullName" className="sr-only">
                  Họ và tên
                </label>
                <input
                  {...step1Form.register('fullName')}
                  id="fullName"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  required
                  className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                    step1Form.formState.errors.fullName ? 'border-red-300' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                  placeholder="Họ và tên"
                />
                {step1Form.formState.errors.fullName && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{step1Form.formState.errors.fullName.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Mật khẩu
                </label>
                <input
                  {...step1Form.register('password')}
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                    step1Form.formState.errors.password ? 'border-red-300' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                  placeholder="Mật khẩu"
                />
                {step1Form.formState.errors.password && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{step1Form.formState.errors.password.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="confirmPassword" className="sr-only">
                  Xác nhận mật khẩu
                </label>
                <input
                  {...step1Form.register('confirmPassword')}
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                    step1Form.formState.errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                  placeholder="Xác nhận mật khẩu"
                />
                {step1Form.formState.errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{step1Form.formState.errors.confirmPassword.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="role" className="block text-gray-700 dark:text-gray-200 font-medium mb-1">Vai trò</label>
                <select
                  {...step1Form.register('role')}
                  id="role"
                  name="role"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-900 dark:text-white ${step1Form.formState.errors.role ? 'border-red-300' : 'border-gray-300'}`}
                >
                  <option value="PLAYER">Người chơi (Player)</option>
                  <option value="OWNER">Chủ sân (Owner)</option>
                </select>
                {step1Form.formState.errors.role && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{step1Form.formState.errors.role.message}</p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Đang xử lý...' : 'Tiếp tục'}
              </button>
            </div>

            <div className="text-center">
              <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                Đã có tài khoản? Đăng nhập
              </Link>
            </div>
          </form>
        ) : (
          <OTPVerification
            email={pendingEmail}
            onSuccess={onOTPSuccess}
            onBack={() => setStep(1)}
            onResend={resendOTP}
            isLoading={isLoading}
            title="Xác thực đăng ký"
            subtitle="Nhập mã xác thực đã được gửi đến email của bạn"
          />
        )}
      </div>
    </div>
  );
};

export default RegisterForm; 