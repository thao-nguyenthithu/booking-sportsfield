import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth, useTheme } from '../../context/AuthContext';

const Navigation = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
    toast.success('Đăng xuất thành công!');
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-xl font-bold text-indigo-600">
                EasyField
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <div className="relative group flex items-center h-16">
                <button
                  className={`inline-flex items-center h-16 px-1 pt-1 border-b-2 text-sm font-medium focus:outline-none ${
                    isActive('/fields')
                      ? 'border-indigo-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:text-orange-500'
                  }`}
                  type="button"
                >
                  Danh sách sân bãi
                  <svg className="ml-1 w-4 h-4 text-gray-400 group-hover:text-indigo-600 transition" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.585l3.71-3.355a.75.75 0 111.02 1.1l-4.25 3.85a.75.75 0 01-1.02 0l-4.25-3.85a.75.75 0 01.02-1.06z" clipRule="evenodd" /></svg>
                </button>
                <div className="absolute left-0 top-full -mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-20 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 pointer-events-none group-hover:pointer-events-auto transition-all duration-200">
                  <div className="relative">
                    {/* Mũi tên hướng lên */}
                    <div className="absolute -top-2 left-6 w-4 h-4 bg-white dark:bg-gray-800 rotate-45" style={{zIndex:1}}></div>
                    <div className="rounded-b-lg overflow-hidden">
                      <Link to="/fields?type=football" className="block px-4 py-2 text-gray-800 dark:text-gray-100 text-sm font-medium border-b border-blue-100 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-orange-500 dark:hover:text-orange-400 hover:border-orange-200 transition">Bóng đá</Link>
                      <Link to="/fields?type=tennis" className="block px-4 py-2 text-gray-800 dark:text-gray-100 text-sm font-medium border-b border-blue-100 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-orange-500 dark:hover:text-orange-400 hover:border-orange-200 transition">Tennis</Link>
                      <Link to="/fields?type=golf" className="block px-4 py-2 text-gray-800 dark:text-gray-100 text-sm font-medium border-b border-blue-100 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-orange-500 dark:hover:text-orange-400 hover:border-orange-200 transition">Golf</Link>
                      <Link to="/fields?type=badminton" className="block px-4 py-2 text-gray-800 dark:text-gray-100 text-sm font-medium border-b border-blue-100 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-orange-500 dark:hover:text-orange-400 hover:border-orange-200 transition">Cầu lông</Link>
                      <Link to="/fields?type=tabletennis" className="block px-4 py-2 text-gray-800 dark:text-gray-100 text-sm font-medium border-b border-blue-100 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-orange-500 dark:hover:text-orange-400 hover:border-orange-200 transition">Bóng bàn</Link>
                      <Link to="/fields?type=pickleball" className="block px-4 py-2 text-gray-800 dark:text-gray-100 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-orange-500 dark:hover:text-orange-400 transition">Pickleball</Link>
                    </div>
                  </div>
                </div>
              </div>
              <Link
                to="/owner"
                className={`inline-flex items-center h-16 px-3 pt-1 border-b-2 text-sm font-medium focus:outline-none ${isActive('/owner') ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500 hover:text-orange-500'}`}
              >
                Dành cho chủ sân
              </Link>
              {user && (
                <>
                  <Link
                    to="/dashboard"
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      isActive('/dashboard')
                        ? 'border-indigo-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/bookings/history"
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      isActive('/bookings/history')
                        ? 'border-indigo-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    Lịch sử đặt sân
                  </Link>
                  {user.role === 'ROLE_ADMIN' && (
                    <Link
                      to="/admin"
                      className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                        isActive('/admin')
                          ? 'border-indigo-500 text-gray-900'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      }`}
                    >
                      Quản trị
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {/* Dark/Light mode toggle button */}
            <button
              onClick={toggleTheme}
              className="mr-4 p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-100 dark:bg-gray-700"
              title={theme === 'dark' ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối'}
            >
              {theme === 'dark' ? (
                // Sun icon
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364-6.364l-1.414 1.414M6.05 17.95l-1.414 1.414M17.95 17.95l-1.414-1.414M6.05 6.05L4.636 7.464M12 8a4 4 0 100 8 4 4 0 000-8z" />
                </svg>
              ) : (
                // Moon icon
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-800 dark:text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
                </svg>
              )}
            </button>
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">
                  Xin chào, {user.fullName}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Đăng xuất
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-500 hover:text-orange-500 px-3 py-2 rounded-md text-sm font-medium transition"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md text-sm font-medium transition"
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} sm:hidden`}>
        <div className="pt-2 pb-3 space-y-1">
          <Link
            to="/fields"
            className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
              isActive('/fields')
                ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            Danh sách sân bãi
          </Link>
          <Link
            to="/owner"
            className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
              isActive('/owner')
                ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            Dành cho chủ sân
          </Link>
          {user && (
            <>
              <Link
                to="/dashboard"
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  isActive('/dashboard')
                    ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                    : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                to="/bookings/history"
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  isActive('/bookings/history')
                    ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                    : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Lịch sử đặt sân
              </Link>
              {user.role === 'ROLE_ADMIN' && (
                <Link
                  to="/admin"
                  className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                    isActive('/admin')
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                      : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Quản trị
                </Link>
              )}
            </>
          )}
        </div>
        <div className="pt-4 pb-3 border-t border-gray-200">
          {user ? (
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center">
                  <span className="text-white font-medium">
                    {user.fullName.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800">{user.fullName}</div>
                <div className="text-sm font-medium text-gray-500">{user.email}</div>
              </div>
              <button
                onClick={handleLogout}
                className="ml-auto bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            <div className="flex items-center px-4 space-x-4">
              <Link
                to="/login"
                className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Đăng nhập
              </Link>
              <Link
                to="/register"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Đăng ký
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 