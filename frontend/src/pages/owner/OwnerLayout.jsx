import React from 'react';
import OwnerSidebar from '../../components/common/OwnerSidebar';
import { Outlet } from 'react-router-dom';
import { FaUserCircle, FaBell } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

export default function OwnerLayout() {
  const { user } = useAuth();
  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      <OwnerSidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="flex items-center justify-between h-12 px-6 bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-700">Xin chào chủ sân, <span className="font-semibold">{user?.fullName || user?.name || 'Chủ sân'}</span></span>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative text-gray-500 hover:text-indigo-600 focus:outline-none">
              <FaBell className="text-xl" />
              {/* Badge notification nếu cần */}
              {/* <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">2</span> */}
            </button>
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
              <FaUserCircle className="text-2xl text-indigo-500" />
            </div>
          </div>
        </header>
        <main className="flex-1 p-6 bg-gray-50 min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
} 