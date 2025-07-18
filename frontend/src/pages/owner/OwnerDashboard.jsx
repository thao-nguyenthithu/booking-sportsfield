import React, { useEffect, useState } from 'react';
import { FaTable, FaCalendarCheck, FaCalendarDay, FaTools, FaSyncAlt } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const statusColor = {
  Confirmed: 'text-green-500',
  Pending: 'text-yellow-400',
  Cancelled: 'text-red-500',
};
const priorityColor = {
  High: 'bg-red-600',
  Medium: 'bg-yellow-500',
  Low: 'bg-green-500',
};

export default function OwnerDashboard() {
  const { user, token } = useAuth();
  const ownerId = user?.id;
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [maintenance, setMaintenance] = useState([]);
  const [availability, setAvailability] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    if (!ownerId || !token) return;
    setLoading(true);
    try {
      const headers = { 'Authorization': 'Bearer ' + token };
      const [statsRes, bookingsRes, availRes, maintRes] = await Promise.all([
        fetch(`/api/owner/dashboard/stats?ownerId=${ownerId}`, { headers }),
        fetch(`/api/owner/dashboard/recent-bookings?ownerId=${ownerId}`, { headers }),
        fetch(`/api/owner/dashboard/availability?ownerId=${ownerId}`, { headers }),
        fetch(`/api/owner/dashboard/maintenance?ownerId=${ownerId}`, { headers }),
      ]);
      setStats(await statsRes.json());
      setBookings(await bookingsRes.json());
      setAvailability(await availRes.json());
      setMaintenance(await maintRes.json());
    } catch (e) {
      // handle error
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line
  }, [ownerId]);

  if (loading) return <div className="flex items-center justify-center min-h-screen text-2xl">Đang tải dữ liệu...</div>;

  // Chuyển object stats thành mảng để render
  const statsArray = stats
    ? [
        { label: 'Tổng số sân', value: stats.totalCourts, icon: <FaTable />, desc: 'Số lượng sân bạn quản lý', color: 'green' },
        { label: 'Đang được đặt', value: stats.currentlyBooked, icon: <FaCalendarCheck />, desc: 'Số lượt đặt sân hôm nay', color: 'red' },
        { label: 'Sẵn sàng hôm nay', value: stats.availableToday, icon: <FaCalendarDay />, desc: 'Sân sẵn sàng cho thuê hôm nay', color: 'green' },
        { label: 'Bảo trì sắp tới', value: stats.maintenanceDue, icon: <FaTools />, desc: 'Số lượt bảo trì sắp diễn ra', color: 'gray' }
      ]
    : [];

  // Thống kê số lượng sân theo khu vực (nếu có stats.areaStats)
  let areaStatsStr = '';
  if (stats && stats.areaStats) {
    areaStatsStr = Object.entries(stats.areaStats)
      .map(([area, count]) => `${area}: ${count}`)
      .join(' | ');
  } else if (stats && stats.courts) {
    // Nếu có mảng courts, tự tính
    const areaStats = stats.courts.reduce((acc, court) => {
      const area = court.location.split(',')[0].trim();
      acc[area] = (acc[area] || 0) + 1;
      return acc;
    }, {});
    areaStatsStr = Object.entries(areaStats)
      .map(([area, count]) => `${area}: ${count}`)
      .join(' | ');
  }

  return (
    <div className="w-full">
      {/* Main content */}
      <div className="p-6 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Tổng quan Dashboard</h1>
            {areaStatsStr && (
              <div className="text-gray-600 text-sm mt-1">{areaStatsStr}</div>
            )}
          </div>
          <button 
            onClick={fetchAll}
            className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-2 rounded-lg font-semibold shadow text-sm"
          >
            <FaSyncAlt /> Làm mới dữ liệu
          </button>
        </div>
        {/* Stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 mb-6">
          {statsArray.map((s, i) => (
            <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 flex flex-col gap-2">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg text-indigo-500">{s.icon}</span>
                <span className="text-sm font-semibold truncate">{s.label}</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{s.value}</div>
              <div className="text-gray-500 text-xs line-clamp-2">{s.desc}</div>
              <div className={`text-xs font-semibold mt-1 ${s.color === 'green' ? 'text-green-600' : s.color === 'red' ? 'text-red-600' : 'text-gray-500'}`}>{s.change}</div>
            </div>
          ))}
        </div>
        {/* Main grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Recent Bookings */}
          <section className="xl:col-span-2 bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <h2 className="text-lg font-bold mb-3">Lịch sử đặt sân gần đây</h2>
            <p className="text-gray-500 text-xs mb-3">Các lượt đặt sân mới nhất.</p>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-gray-500 border-b border-gray-200">
                    <th className="py-2 px-2 text-left text-xs">Sân</th>
                    <th className="py-2 px-2 text-left text-xs">Người đặt</th>
                    <th className="py-2 px-2 text-left text-xs">Ngày</th>
                    <th className="py-2 px-2 text-left text-xs">Giờ</th>
                    <th className="py-2 px-2 text-left text-xs">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b, i) => (
                    <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-2 px-2 font-semibold text-xs">{b.court}</td>
                      <td className="py-2 px-2 text-xs">{b.user}</td>
                      <td className="py-2 px-2 text-xs">{b.date}</td>
                      <td className="py-2 px-2 text-xs">{b.time}</td>
                      <td className={`py-2 px-2 font-semibold text-xs ${statusColor[b.status]}`}>{b.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
          {/* Right column: Chart + Maintenance */}
          <div className="flex flex-col gap-6">
            {/* Court Availability Chart */}
            <section className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 flex flex-col items-center justify-center">
              <h2 className="text-base font-bold mb-2">Tình trạng sân</h2>
              <p className="text-gray-500 text-xs mb-3 text-center">Tỉ lệ sân trống/đã đặt hiện tại.</p>
              {/* TODO: Thay bằng chart thật */}
              <div className="w-24 h-24 rounded-full border-6 border-gray-200 flex items-center justify-center">
                <span className="text-xl font-bold text-gray-600">75%</span>
              </div>
            </section>
            {/* Upcoming Maintenance */}
            <section className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <h2 className="text-base font-bold mb-2">Bảo trì sắp tới</h2>
              <p className="text-gray-500 text-xs mb-3">Các sân cần bảo trì trong thời gian tới.</p>
              <ul className="space-y-2">
                {maintenance.map((m, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900 text-xs">{m.court}</span>
                    <span className="text-gray-500 text-xs">{m.date}</span>
                    <span className={`ml-auto px-1.5 py-0.5 rounded text-xs font-bold text-white ${priorityColor[m.priority]}`}>{m.priority === 'High' ? 'Cao' : m.priority === 'Medium' ? 'TB' : 'Thấp'}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

 