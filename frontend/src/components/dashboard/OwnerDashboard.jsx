import React, { useEffect, useState } from 'react';
import { FaTable, FaCalendarCheck, FaCalendarDay, FaTools, FaSyncAlt, FaUser, FaClipboardList, FaMoneyBill } from 'react-icons/fa';
// import Chart lib nếu cần
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
  const { user } = useAuth ? useAuth() : { user: null };
  const ownerId = user?.id;
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [maintenance, setMaintenance] = useState([]);
  const [availability, setAvailability] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    if (!ownerId) return;
    setLoading(true);
    try {
      const [statsRes, bookingsRes, availRes, maintRes] = await Promise.all([
        fetch(`/api/owner/dashboard/stats?ownerId=${ownerId}`),
        fetch(`/api/owner/dashboard/recent-bookings?ownerId=${ownerId}`),
        fetch(`/api/owner/dashboard/availability?ownerId=${ownerId}`),
        fetch(`/api/owner/dashboard/maintenance?ownerId=${ownerId}`),
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

  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Sidebar */}
      <aside className="w-60 bg-[#18181b] flex flex-col justify-between py-6 px-4 min-h-screen">
        <div>
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-indigo-400 mb-6">EasyField</h2>
            <nav className="space-y-2">
              <SidebarItem icon={<FaTable />} label="Dashboard" active />
              <SidebarItem icon={<FaCalendarCheck />} label="Courts" />
              <SidebarItem icon={<FaClipboardList />} label="Bookings" />
              <SidebarItem icon={<FaUser />} label="Users" />
              <SidebarItem icon={<FaClipboardList />} label="Reports" />
              <SidebarItem icon={<FaMoneyBill />} label="Payments" />
            </nav>
          </div>
        </div>
        <div className="flex items-center gap-3 border-t border-gray-700 pt-4">
          <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-lg font-bold">A</div>
          <div>
            <div className="font-semibold">Admin User</div>
            <div className="text-xs text-gray-400">Administrator</div>
          </div>
        </div>
      </aside>
      {/* Main content */}
      <main className="flex-1 p-8 bg-[#18181b] min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Dashboard Overview</h1>
          <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold shadow">
            <FaSyncAlt /> Refresh Data
          </button>
        </div>
        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats?.map((s, i) => (
            <div key={i} className="bg-[#23232a] rounded-xl p-6 shadow flex flex-col gap-2">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl text-indigo-400">{s.icon}</span>
                <span className="text-lg font-semibold">{s.label}</span>
              </div>
              <div className="text-3xl font-bold">{s.value}</div>
              <div className="text-gray-400 text-sm">{s.desc}</div>
              <div className={`text-xs font-semibold mt-1 ${s.color === 'green' ? 'text-green-400' : s.color === 'red' ? 'text-red-400' : 'text-gray-400'}`}>{s.change}</div>
            </div>
          ))}
        </div>
        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Bookings */}
          <section className="lg:col-span-2 bg-[#23232a] rounded-xl p-6 shadow">
            <h2 className="text-xl font-bold mb-4">Recent Bookings</h2>
            <p className="text-gray-400 text-sm mb-4">Latest court reservations.</p>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-gray-400 border-b border-gray-700">
                    <th className="py-2 px-3 text-left">Court</th>
                    <th className="py-2 px-3 text-left">User</th>
                    <th className="py-2 px-3 text-left">Date</th>
                    <th className="py-2 px-3 text-left">Time</th>
                    <th className="py-2 px-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b, i) => (
                    <tr key={i} className="border-b border-gray-800 hover:bg-gray-800/40">
                      <td className="py-2 px-3 font-semibold">{b.court}</td>
                      <td className="py-2 px-3">{b.user}</td>
                      <td className="py-2 px-3">{b.date}</td>
                      <td className="py-2 px-3">{b.time}</td>
                      <td className={`py-2 px-3 font-semibold ${statusColor[b.status]}`}>{b.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
          {/* Right column: Chart + Maintenance */}
          <div className="flex flex-col gap-8">
            {/* Court Availability Chart */}
            <section className="bg-[#23232a] rounded-xl p-6 shadow flex-1 flex flex-col items-center justify-center">
              <h2 className="text-lg font-bold mb-2">Court Availability</h2>
              <p className="text-gray-400 text-sm mb-4">Current status of all courts.</p>
              {/* TODO: Thay bằng chart thật */}
              <div className="w-32 h-32 rounded-full border-8 border-gray-700 flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-400">75%</span>
              </div>
            </section>
            {/* Upcoming Maintenance */}
            <section className="bg-[#23232a] rounded-xl p-6 shadow">
              <h2 className="text-lg font-bold mb-2">Upcoming Maintenance</h2>
              <p className="text-gray-400 text-sm mb-4">Courts requiring attention soon.</p>
              <ul className="space-y-3">
                {maintenance.map((m, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <span className="font-semibold text-white">{m.court}</span>
                    <span className="text-gray-400 text-xs">{m.date}</span>
                    <span className={`ml-auto px-2 py-1 rounded text-xs font-bold text-black ${priorityColor[m.priority]}`}>{m.priority}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

function SidebarItem({ icon, label, active }) {
  return (
    <div className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer ${active ? 'bg-indigo-700 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}>
      <span className="text-lg">{icon}</span>
      <span className="font-medium">{label}</span>
    </div>
  );
} 