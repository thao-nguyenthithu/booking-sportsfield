import React from 'react';

const AdminDashboard = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Bảng quản trị</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Tính năng quản trị sẽ được phát triển trong giai đoạn tiếp theo.
        </p>
        <div className="bg-purple-50 dark:bg-purple-900 border border-purple-200 dark:border-purple-700 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-purple-800 dark:text-purple-200">
                Tính năng đang phát triển
              </h3>
              <div className="mt-2 text-sm text-purple-700 dark:text-purple-100">
                <p>
                  Quản lý người dùng, sân bóng, đặt sân và báo cáo sẽ được hoàn thiện trong giai đoạn tiếp theo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 