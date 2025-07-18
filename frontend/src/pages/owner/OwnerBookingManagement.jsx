import React, { useState } from 'react';
import Select from 'react-select';
import { format } from 'date-fns';
import { useRef } from 'react';
import { useAuth } from '../../context/AuthContext';

// Danh sách đầy đủ các môn thể thao
const FIELD_TYPE_OPTIONS = [
  { value: '', label: 'Tất cả môn thể thao' },
  { value: 'Bóng đá', label: 'Bóng đá' },
  { value: 'Tennis', label: 'Tennis' },
  { value: 'Golf', label: 'Golf' },
  { value: 'Cầu lông', label: 'Cầu lông' },
  { value: 'Bóng bàn', label: 'Bóng bàn' },
  { value: 'Pickleball', label: 'Pickleball' },
];

const HOUR_OPTIONS = Array.from({ length: 19 }, (_, i) => `${(i + 5).toString().padStart(2, '0')}:00`);

const STATUS_COLORS = {
  'Đã đặt': 'bg-green-400 text-green-700',
  'Bảo trì': 'bg-yellow-300 text-yellow-800',
};

export default function OwnerBookingManagement() {
  const { user, token } = useAuth();
  const [fields, setFields] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [selectedFieldName, setSelectedFieldName] = useState('');
  const [selectedFieldType, setSelectedFieldType] = useState('');
  const [showDetail, setShowDetail] = useState(null);
  const [selectedSlots, setSelectedSlots] = useState([]); // [{ fieldId, hour }]
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [slotNotes, setSlotNotes] = useState({}); // { slotKey: note }
  const [bookingNote, setBookingNote] = useState("");
  const confirmBtnRef = useRef();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch fields
  const fetchFields = async () => {
    if (!user?.id || !token) return;
    try {
      const res = await fetch('/api/owner/fields', {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      if (!res.ok) throw new Error('Không thể tải danh sách sân');
      const data = await res.json();
      setFields(data);
    } catch (e) {
      setError(e.message || 'Lỗi không xác định');
    }
  };
  // Fetch bookings
  const fetchBookings = async (date) => {
    if (!user?.id || !token) return;
    try {
      const res = await fetch(`/api/owner/bookings?date=${date}`, {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      if (!res.ok) throw new Error('Không thể tải lịch đặt sân');
      const data = await res.json();
      setBookings(data);
    } catch (e) {
      setError(e.message || 'Lỗi không xác định');
    }
  };
  // Load data on mount & when date changes
  React.useEffect(() => {
    fetchFields();
  }, [user?.id, token]);
  React.useEffect(() => {
    fetchBookings(selectedDate);
  }, [user?.id, token, selectedDate]);

  // Filter fields
  const filteredFields = fields.filter(f => {
    const matchType = !selectedFieldType || f.type === selectedFieldType;
    const matchName = !selectedFieldName || f.name === selectedFieldName;
    return matchType && matchName;
  });

  // Build bookingMap from API data
  const bookingMap = {};
  for (const hour of HOUR_OPTIONS) bookingMap[hour] = {};
  for (const b of bookings) {
    const startIdx = HOUR_OPTIONS.indexOf(b.startTime?.slice(0,5));
    const endIdx = HOUR_OPTIONS.indexOf(b.endTime?.slice(0,5));
    for (let i = startIdx; i < endIdx; i++) {
      bookingMap[HOUR_OPTIONS[i]][b.fieldId] = b;
    }
  }

  // Tính tổng giờ và tổng tiền
  const totalHours = selectedSlots.length;
  const totalAmount = selectedSlots.reduce((sum, slot) => {
    const field = fields.find(f => f.id === slot.fieldId);
    return sum + (field?.pricePerHour || 0);
  }, 0);

  // Đặt sân (gửi API)
  const handleBooking = async () => {
    if (!user?.id || !token) return;
    setLoading(true);
    setError('');
    try {
      // Gom slot thành các range liên tiếp cùng field
      const slotGroups = {};
      selectedSlots.forEach(slot => {
        if (!slotGroups[slot.fieldId]) slotGroups[slot.fieldId] = [];
        slotGroups[slot.fieldId].push(slot.hour);
      });
      const slots = [];
      Object.entries(slotGroups).forEach(([fieldId, hours]) => {
        const sorted = hours.slice().sort();
        let rangeStart = sorted[0];
        let prevHour = sorted[0];
        let count = 1;
        for (let i = 1; i < sorted.length; i++) {
          const [prevH] = prevHour.split(":").map(Number);
          const [currH] = sorted[i].split(":").map(Number);
          if (currH === prevH + 1) {
            prevHour = sorted[i];
            count++;
          } else {
            // push range
            const [h, m] = prevHour.split(":");
            slots.push({
              fieldId: Number(fieldId),
              startTime: rangeStart,
              endTime: (parseInt(prevH, 10) + 1).toString().padStart(2, "0") + ":00",
              price: (fields.find(f => f.id === Number(fieldId))?.pricePerHour || 0) * count
            });
            rangeStart = sorted[i];
            prevHour = sorted[i];
            count = 1;
          }
        }
        // push cuối
        const [h, m] = prevHour.split(":");
        slots.push({
          fieldId: Number(fieldId),
          startTime: rangeStart,
          endTime: (parseInt(h, 10) + 1).toString().padStart(2, "0") + ":00",
          price: (fields.find(f => f.id === Number(fieldId))?.pricePerHour || 0) * count
        });
      });
      const payload = {
        date: selectedDate,
        slots,
        customerName: 'Khách lẻ', // hoặc cho nhập thêm
        note: bookingNote,
        paymentMethod,
        totalAmount
      };
      const res = await fetch('/api/owner/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Không thể đặt sân');
      await res.json();
      // Đợi fetchBookings xong mới đóng modal và reset state
      await fetchBookings(selectedDate);
      setShowPaymentModal(false);
      setShowConfirmModal(false);
      setSelectedSlots([]);
      setSlotNotes({});
      setBookingNote("");
    } catch (e) {
      setError(e.message || 'Lỗi không xác định');
    }
    setLoading(false);
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="flex flex-wrap gap-2 items-center mb-2">
        <div className="flex gap-4 text-sm mr-4">
          <div className="flex items-center gap-1"><span className="w-4 h-4 inline-block rounded bg-green-300 border"></span> <span className="text-green-700">Đã đặt</span></div>
          <div className="flex items-center gap-1"><span className="w-4 h-4 inline-block rounded bg-yellow-300 border border-gray-300"></span> <span className="text-yellow-800">Bảo trì</span></div>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="border rounded px-3 py-2" />
        <select value={selectedFieldName} onChange={e => setSelectedFieldName(e.target.value)} className="border rounded px-3 py-2">
          <option value="">Tất cả tên sân</option>
          {fields.map(f => <option key={f.name} value={f.name}>{f.name}</option>)}
        </select>
        <select value={selectedFieldType} onChange={e => setSelectedFieldType(e.target.value)} className="border rounded px-3 py-2">
          {FIELD_TYPE_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
        <div className="ml-auto flex items-center gap-4">
          {selectedSlots.length > 0 && (
            <div className="flex items-center gap-6 text-right min-w-[320px]">
              <div className="flex items-center gap-2">
                <span className="text-blue-800 font-bold">Tổng giờ:</span>
                <span className="text-blue-900 font-bold text-lg">{totalHours}</span>
                <span className="text-blue-800 font-bold">h</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-800 font-bold">Tổng tiền:</span>
                <span className="text-green-900 font-bold text-lg">{totalAmount.toLocaleString()}</span>
                <span className="text-green-800 font-bold">đ</span>
              </div>
            </div>
          )}
          <button
            className={`px-5 py-2 rounded-lg font-bold text-base shadow transition ${selectedSlots.length > 0 ? 'bg-orange-500 text-white hover:bg-orange-600' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
            disabled={selectedSlots.length === 0}
            onClick={() => setShowConfirmModal(true)}
            ref={confirmBtnRef}
          >
            + Đặt sân
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-0">
          <thead>
            <tr>
              <th className="w-28 bg-gray-200 border border-gray-300 p-2 text-sm font-bold text-gray-500 sticky left-0 z-20">Loại hình</th>
              <th className="bg-gray-200 border border-gray-300 p-2 text-sm font-bold text-gray-500 sticky left-0 z-10">Sân</th>
              {HOUR_OPTIONS.map(hour => (
                <th key={hour} className="bg-gray-200 border border-gray-300 p-2 text-sm font-bold text-gray-500 text-center">{hour}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Sửa logic render bảng để hiển thị từng sân con theo quantity */}
            {(() => {
              // Lọc fields theo filter
              const filteredFields = fields.filter(f => {
                const matchType = !selectedFieldType || f.type === selectedFieldType;
                const matchName = !selectedFieldName || f.name === selectedFieldName;
                return matchType && matchName;
              });

              // Nhóm theo loại hình
              const grouped = {};
              filteredFields.forEach(f => {
                if (!grouped[f.type]) grouped[f.type] = [];
                grouped[f.type].push(f);
              });

              const rows = [];
              Object.entries(grouped).forEach(([type, fieldsOfType]) => {
                // Đếm tổng số dòng cho loại hình này (tổng numberOfField của các field)
                const totalRows = fieldsOfType.reduce((sum, f) => sum + (f.numberOfField || 1), 0);
                let rowIdx = 0;
                fieldsOfType.forEach((field, fieldIdx) => {
                  for (let i = 1; i <= (field.numberOfField || 1); i++) {
                    rows.push(
                      <tr key={field.id + '-' + i}>
                        {/* Loại hình: chỉ hiển thị ở dòng đầu tiên của loại hình, rowspan = tổng số dòng */}
                        {rowIdx === 0 && (
                          <td
                            className="border border-gray-300 p-2 text-sm font-semibold text-gray-500 bg-gray-200 sticky left-0 z-20 text-center align-top"
                            rowSpan={totalRows}
                            style={{ verticalAlign: 'middle' }}
                          >
                            {type}
                          </td>
                        )}
                        <td className="border border-gray-300 p-2 text-sm font-semibold text-gray-500 bg-gray-200 sticky left-0 z-10 text-center align-top">
                          <div>{field.name}</div>
                          <div className="text-xs text-gray-700 mt-1">(Sân {i})</div>
                          {field.pricePerHour && (
                            <div className="text-xs text-gray-700 mt-1">{field.pricePerHour.toLocaleString()}đ/h</div>
                          )}
                        </td>
                        {HOUR_OPTIONS.map(hour => {
                          // Nếu backend có subFieldIndex thì cần phân biệt, còn hiện tại chỉ dùng field.id
                          const isSelected = selectedSlots.some(slot => slot.fieldId === field.id && slot.subFieldIndex === i && slot.hour === hour);
                          // Nếu muốn phân biệt booking từng sân con, cần backend trả về subFieldIndex, tạm thời chỉ check field.id
                          const b = bookingMap[hour][field.id];
                          return (
                            <td
                              key={hour}
                              className={`border p-0 align-top h-14 relative min-w-[70px] ${isSelected ? 'bg-blue-100 border-blue-400 z-30' : 'border-gray-300'} ${!b ? 'cursor-pointer' : ''}`}
                              onClick={() => {
                                if (!b) {
                                  setSelectedSlots(prev => {
                                    const exists = prev.some(slot => slot.fieldId === field.id && slot.subFieldIndex === i && slot.hour === hour);
                                    if (exists) {
                                      return prev.filter(slot => !(slot.fieldId === field.id && slot.subFieldIndex === i && slot.hour === hour));
                                    } else {
                                      return [...prev, { fieldId: field.id, subFieldIndex: i, hour }];
                                    }
                                  });
                                } else {
                                  setShowDetail(b);
                                }
                              }}
                            >
                              {b ? (
                                <div
                                  className={`absolute inset-1 rounded-md cursor-pointer flex flex-col justify-center items-center ${STATUS_COLORS[b.status]} transition-all duration-150`}
                                  style={{ fontSize: '0.95rem', fontWeight: 500 }}
                                >
                                  <div className="truncate w-full text-center text-sm">{b.customerName}</div>
                                  <div className="text-xs">{b.phone}</div>
                                  <div className="text-xs font-semibold">{b.totalPrice.toLocaleString()}đ</div>
                                  <div className="text-xs italic">{b.status}</div>
                                </div>
                              ) : null}
                            </td>
                          );
                        })}
                      </tr>
                    );
                    rowIdx++;
                  }
                });
              });
              return rows;
            })()}
          </tbody>
        </table>
      </div>
      {/* Popup chi tiết booking */}
      {showDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-xs text-center relative">
            <button onClick={() => setShowDetail(null)} className="absolute top-2 right-3 text-gray-400 hover:text-gray-700 text-2xl">&times;</button>
            <h2 className="text-lg font-bold mb-2">Chi tiết đặt sân</h2>
            <div className="mb-2 text-sm"><b>Sân:</b> {fields.find(f => f.id === showDetail.fieldId)?.name}</div>
            <div className="mb-2 text-sm"><b>Khách:</b> {showDetail.customerName}</div>
            <div className="mb-2 text-sm"><b>SĐT:</b> {showDetail.phone}</div>
            <div className="mb-2 text-sm"><b>Ngày:</b> {showDetail.date}</div>
            <div className="mb-2 text-sm"><b>Giờ:</b> {showDetail.startTime} - {showDetail.endTime}</div>
            <div className="mb-2 text-sm"><b>Giá:</b> {showDetail.totalPrice.toLocaleString()}đ</div>
            <div className="mb-2 text-sm"><b>Trạng thái:</b> {showDetail.status}</div>
            <button onClick={() => setShowDetail(null)} className="mt-4 px-6 py-2 rounded bg-gray-200 text-gray-600 font-semibold hover:bg-gray-300">Đóng</button>
          </div>
        </div>
      )}
      {/* Modal xác nhận đặt sân */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-blue-900 rounded-xl shadow-2xl p-8 w-full max-w-xl text-white relative animate-fadeIn" style={{ minHeight: '320px' }}>
            <button onClick={() => setShowConfirmModal(false)} className="absolute top-3 right-4 text-yellow-200 hover:text-yellow-400 text-2xl">&times;</button>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-yellow-300 text-2xl">📋</span>
              <span className="text-lg font-bold text-blue-100">Thông tin lịch đặt</span>
            </div>
            <div className="mb-2 text-blue-100">Ngày: <span className="font-bold text-white">{selectedDate.split('-').reverse().join('/')}</span></div>
            <div className="mb-3">
              {/* Group slots by field.type */}
              {(() => {
                const grouped = {};
                selectedSlots.forEach(slot => {
                  const field = fields.find(f => f.id === slot.fieldId);
                  if (!field) return;
                  if (!grouped[field.type]) grouped[field.type] = [];
                  grouped[field.type].push({ slot, field });
                });
                return Object.entries(grouped).map(([type, slots]) => {
                  // Nhóm tiếp theo fieldId + subFieldIndex
                  const fieldMap = {};
                  slots.forEach(({ slot, field }) => {
                    const key = `${field.id}_${slot.subFieldIndex || 1}`;
                    if (!fieldMap[key]) fieldMap[key] = { field, subFieldIndex: slot.subFieldIndex || 1, hours: [] };
                    fieldMap[key].hours.push(slot.hour);
                  });
                  return (
                    <div key={type} className="mb-2">
                      <div className="font-bold text-indigo-300 mb-1">Loại hình: <span className="text-white">{type}</span></div>
                      {Object.values(fieldMap).map(({ field, subFieldIndex, hours }) => {
                        // Sắp xếp giờ tăng dần
                        const sortedHours = hours.slice().sort();
                        // Gom các khung giờ liên tiếp
                        const ranges = [];
                        let rangeStart = sortedHours[0];
                        let prevHour = sortedHours[0];
                        let count = 1;
                        for (let i = 1; i < sortedHours.length; i++) {
                          const [prevH] = prevHour.split(":").map(Number);
                          const [currH] = sortedHours[i].split(":").map(Number);
                          if (currH === prevH + 1) {
                            // Liền kề
                            prevHour = sortedHours[i];
                            count++;
                          } else {
                            // Kết thúc 1 range
                            ranges.push({ start: rangeStart, end: prevHour, count, subFieldIndex });
                            rangeStart = sortedHours[i];
                            prevHour = sortedHours[i];
                            count = 1;
                          }
                        }
                        // Push range cuối
                        ranges.push({ start: rangeStart, end: prevHour, count, subFieldIndex });
                        return ranges.map((r, idx) => {
                          // Tính endHour +1
                          const [h, m] = r.end.split(":");
                          const endHour = (parseInt(h, 10) + 1).toString().padStart(2, "0") + ":00";
                          const total = (field.pricePerHour || 0) * r.count;
                          return (
                            <div key={field.id + (r.subFieldIndex || 1) + idx} className="mb-1 flex flex-col gap-1">
                              <div>
                                <span className="font-bold text-indigo-100">- {field?.name || 'Sân'} (Sân {r.subFieldIndex || 1}):</span>
                                <span className="font-bold text-white"> {r.start} - {endHour}</span>
                                <span className="text-indigo-400 font-bold ml-2">| {total.toLocaleString()} đ</span>
                              </div>
                            </div>
                          );
                        });
                      })}
                    </div>
                  );
                });
              })()}
            </div>
            {/* Ghi chú chung */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Ghi chú (nếu có)"
                className="px-3 py-2 rounded bg-indigo-800 text-indigo-100 placeholder-indigo-300 text-base outline-none border border-indigo-700 focus:border-indigo-400 w-full"
                value={bookingNote}
                onChange={e => setBookingNote(e.target.value)}
              />
            </div>
            <div className="mb-2 text-blue-100">Tổng giờ: <span className="font-bold text-yellow-400">{totalHours}h</span></div>
            <div className="mb-2 text-blue-100">Tổng tiền: <span className="font-bold text-yellow-400">{totalAmount.toLocaleString()} đ</span></div>
            <div className="flex justify-end mt-6 gap-2">
              <button onClick={() => setShowConfirmModal(false)} className="px-4 py-2 rounded bg-blue-800 text-blue-100 font-semibold hover:bg-blue-700">Hủy</button>
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  setShowPaymentModal(true);
                }}
                className="px-4 py-2 rounded bg-yellow-400 text-blue-900 font-bold hover:bg-yellow-300"
              >
                Xác nhận đặt sân
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal thanh toán */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-blue-900 rounded-2xl shadow-2xl p-8 w-full max-w-lg text-white relative animate-fadeIn flex flex-col items-center" style={{ minHeight: '340px' }}>
            <button onClick={() => setShowPaymentModal(false)} className="absolute top-4 right-6 text-yellow-200 hover:text-yellow-400 text-2xl">&times;</button>
            <div className="flex items-center gap-2 mb-6 mt-2 self-start">
              <span className="text-yellow-300 text-2xl">💳</span>
              <span className="text-xl font-bold text-blue-100">Thanh toán đặt sân</span>
            </div>
            <div className="mb-6 w-full flex flex-col items-center">
              <span className="text-blue-100 text-lg mb-1">Tổng tiền:</span>
              <span className="font-bold text-yellow-400 text-3xl tracking-wide drop-shadow">{totalAmount.toLocaleString()} đ</span>
            </div>
            <div className="mb-8 w-full flex items-center justify-center gap-6">
              <label className="font-semibold text-base mr-4">Hình thức thanh toán:</label>
              <div className="flex gap-8 items-center">
                <label className="flex items-center cursor-pointer text-lg gap-2">
                  <input type="radio" name="paymentMethod" value="cash" checked={paymentMethod === 'cash'} onChange={() => setPaymentMethod('cash')} className="w-5 h-5 accent-blue-500" />
                  Tiền mặt
                </label>
                <label className="flex items-center cursor-pointer text-lg gap-2">
                  <input type="radio" name="paymentMethod" value="qr" checked={paymentMethod === 'qr'} onChange={() => setPaymentMethod('qr')} className="w-5 h-5 accent-blue-500" />
                  QR Code
                </label>
              </div>
            </div>
            {paymentMethod === 'qr' && (
              <div className="mb-6 flex flex-col items-center gap-2 w-full">
                <img src="/qr-demo.png" alt="QR chuyển khoản" className="w-44 h-44 object-contain rounded bg-white p-2 shadow" />
                <div className="text-blue-100 text-sm mt-2 text-center">
                  <div><b>Ngân hàng:</b> Vietcombank</div>
                  <div><b>Số tài khoản:</b> 0123456789</div>
                  <div><b>Tên chủ TK:</b> NGUYEN VAN A</div>
                  <div><b>Nội dung:</b> Thanh toan san {selectedDate.replace(/-/g, '')}</div>
                </div>
              </div>
            )}
            <div className="flex justify-center w-full gap-4 mt-2">
              <button onClick={() => { setShowPaymentModal(false); setShowConfirmModal(true); }} className="px-6 py-2 rounded-lg bg-blue-800 text-blue-100 font-semibold hover:bg-blue-700 text-lg">Quay lại</button>
              <button onClick={handleBooking} className={`px-6 py-2 rounded-lg font-bold text-lg shadow ${loading ? 'bg-yellow-200 text-yellow-600 cursor-not-allowed' : 'bg-yellow-400 text-blue-900 hover:bg-yellow-300'}`} disabled={loading}>{loading ? 'Đang đặt...' : 'Hoàn tất thanh toán'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 