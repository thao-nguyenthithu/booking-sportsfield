import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaTable, FaCalendarCheck, FaClipboardList, FaUser, FaMoneyBill } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

export default function OwnerSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  const menuItems = [
    { path: '/owner/dashboard', icon: <FaTable />, label: 'Bảng điều khiển' },
    { path: '/owner/fields', icon: <FaCalendarCheck />, label: 'Sân' },
    { path: '/owner/bookings', icon: <FaClipboardList />, label: 'Đặt sân' },
    { path: '/owner/users', icon: <FaUser />, label: 'Người dùng' },
    { path: '/owner/reports', icon: <FaClipboardList />, label: 'Báo cáo' },
    { path: '/owner/payments', icon: <FaMoneyBill />, label: 'Thanh toán' },
  ];

  return (
    <aside className="w-60 bg-white border-r border-gray-200 flex flex-col justify-between py-6 px-4 min-h-screen">
      <div>
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-indigo-600 mb-6">Booking Sports</h2>
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <SidebarItem 
                  icon={item.icon} 
                  label={item.label} 
                  active={location.pathname === item.path}
                />
              </Link>
            ))}
          </nav>
        </div>
      </div>
      <div className="flex-1" />
      <div className="sticky bottom-0 left-0 w-full bg-white pb-6 pt-4">
        <button
          className="w-full py-2 border border-gray-300 text-gray-400 font-semibold rounded-lg transition hover:border-indigo-500 hover:text-indigo-600 bg-transparent"
          onClick={handleLogout}
        >
          Đăng xuất
        </button>
      </div>
    </aside>
  );
}

function SidebarItem({ icon, label, active }) {
  return (
    <div className={`flex items-center gap-3 px-3 py-2 rounded-lg transition font-medium ${active ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-100 hover:text-indigo-700'}`}>
      <span className="text-lg">{icon}</span>
      <span>{label}</span>
    </div>
  );
} 