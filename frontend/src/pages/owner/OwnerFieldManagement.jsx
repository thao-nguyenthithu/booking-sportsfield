import React, { useEffect, useState } from 'react';
import { FaPlus, FaSyncAlt, FaEdit, FaTrash, FaMapMarkerAlt, FaSearch } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const STATUS_LABELS = {
  ACTIVE: 'Hoạt động',
  MAINTENANCE: 'Bảo trì',
};

const STATUS_COLORS = {
  ACTIVE: 'bg-green-100 text-green-700',
  MAINTENANCE: 'bg-yellow-100 text-yellow-700',
};

const FIELD_TYPES = [
  { value: 'Bóng đá', label: 'Bóng đá' },
  { value: 'Tennis', label: 'Tennis' },
  { value: 'Golf', label: 'Golf' },
  { value: 'Cầu lông', label: 'Cầu lông' },
  { value: 'Bóng bàn', label: 'Bóng bàn' },
  { value: 'Pickleball', label: 'Pickleball' },
];

function AddFieldModal({ open, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    location: '',
    pricePerHour: '',
    numberOfField: '',
    openTime: '',
    closeTime: '',
    status: 'ACTIVE'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      name: '',
      type: '',
      location: '',
      pricePerHour: '',
      numberOfField: '',
      openTime: '',
      closeTime: '',
      status: 'ACTIVE'
    });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Thêm sân mới</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-2xl">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold mb-1">Tên sân</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Loại sân</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              required
            >
              <option value="">Chọn loại sân</option>
              {FIELD_TYPES.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block font-semibold mb-1">Địa điểm</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Giá/giờ (VNĐ)</label>
            <input
              type="number"
              min="0"
              value={formData.pricePerHour}
              onChange={(e) => setFormData({...formData, pricePerHour: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Số sân</label>
            <input
              type="number"
              min="1"
              value={formData.numberOfField}
              onChange={(e) => setFormData({...formData, numberOfField: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Giờ mở cửa</label>
            <input
              type="time"
              value={formData.openTime}
              onChange={(e) => setFormData({...formData, openTime: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Giờ đóng cửa</label>
            <input
              type="time"
              value={formData.closeTime}
              onChange={(e) => setFormData({...formData, closeTime: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Trạng thái</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            >
              <option value="ACTIVE">Hoạt động</option>
              <option value="MAINTENANCE">Bảo trì</option>
            </select>
          </div>
          <div className="flex gap-2 pt-4">
            <button
              type="submit"
              className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded font-semibold"
            >
              Thêm sân
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded font-semibold"
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ConfirmDeleteModal({ open, onClose, onConfirm, field }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Xác nhận xóa</h2>
        <p className="mb-6">Bạn có chắc chắn muốn xóa sân "{field?.name}"?</p>
        <div className="flex gap-2">
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded font-semibold"
          >
            Xóa
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded font-semibold"
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
}

export default function OwnerFieldManagement() {
  const { user, token } = useAuth();
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [addFieldModalOpen, setAddFieldModalOpen] = useState(false);
  const [confirmDeleteModalOpen, setConfirmDeleteModalOpen] = useState(false);
  const [fieldToDelete, setFieldToDelete] = useState(null);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const fetchFields = async () => {
    if (!user?.id || !token) {
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/owner/fields`, {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error('Không thể tải danh sách sân: ' + errorText);
      }
      const data = await res.json();
      setFields(data);
    } catch (e) {
      setError(e.message || 'Lỗi không xác định');
    }
    setLoading(false);
  };

  const handleAddField = async (data) => {
    if (!user?.id || !token) return;
    try {
      const payload = { 
        ...data,
        pricePerHour: Number(data.pricePerHour),
        numberOfField: Number(data.numberOfField),
        status: data.status || 'ACTIVE'
      };
      
      const res = await fetch('/api/owner/fields', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) {
        const errorData = await res.text();
        throw new Error(`Không thể thêm sân: ${errorData}`);
      }
      
      const newField = await res.json();
      setFields(prev => [...prev, newField]);
      setAddFieldModalOpen(false);
      setError('');
    } catch (e) {
      setError(e.message || 'Lỗi không xác định');
    }
  };

  const handleDeleteField = async (fieldId) => {
    if (!user?.id || !token) return;
    try {
      const res = await fetch(`/api/owner/fields/${fieldId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer ' + token
        }
      });
      if (!res.ok) throw new Error('Không thể xóa sân');
      setFields(prev => prev.filter(f => f.id !== fieldId));
      setConfirmDeleteModalOpen(false);
      setFieldToDelete(null);
    } catch (e) {
      setError(e.message || 'Lỗi không xác định');
    }
  };

  const handleUpdateStatus = async (fieldId, newStatus) => {
    if (!user?.id || !token) return;
    try {
      const res = await fetch(`/api/owner/fields/${fieldId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (!res.ok) throw new Error('Không thể cập nhật trạng thái sân');
      fetchFields();
    } catch (e) {
      setError(e.message || 'Lỗi không xác định');
    }
  };

  useEffect(() => {
    fetchFields();
  }, [user?.id, token]);

  const typeStats = fields.reduce((acc, f) => {
    acc[f.type] = (acc[f.type] || 0) + (f.numberOfField || 0);
    return acc;
  }, {});

  const filteredFields = fields.filter(f => {
    const matchType = !typeFilter || f.type === typeFilter;
    const matchSearch = !search || f.name.toLowerCase().includes(search.toLowerCase()) || f.location?.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Quản lý sân</h1>
          <div className="text-gray-500 text-sm">
            {Object.entries(typeStats).map(([type, count], i) => (
              <span key={type}>
                {type}: {count}{i < Object.entries(typeStats).length - 1 && ' | '}
              </span>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchFields} className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold shadow">
            <FaSyncAlt /> Làm mới
          </button>
          <button onClick={() => setAddFieldModalOpen(true)} className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold shadow">
            <FaPlus /> Thêm sân
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm sân..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="w-48">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Tất cả loại sân</option>
              {FIELD_TYPES.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-gray-600">Đang tải...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFields.map(field => (
              <div key={field.id} className="bg-gray-50 rounded-lg p-4 border">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-lg">{field.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[field.status]}`}>
                    {STATUS_LABELS[field.status]}
                  </span>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Loại:</span>
                    <span>{field.type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-gray-400" />
                    <span>{field.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Giá:</span>
                    <span>{field.pricePerHour?.toLocaleString()} VNĐ/giờ</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Số sân:</span>
                    <span>{field.numberOfField}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Giờ mở cửa:</span>
                    <span>{field.openTime} - {field.closeTime}</span>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleUpdateStatus(field.id, field.status === 'ACTIVE' ? 'MAINTENANCE' : 'ACTIVE')}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium"
                  >
                    {field.status === 'ACTIVE' ? 'Bảo trì' : 'Kích hoạt'}
                  </button>
                  <button
                    onClick={() => {
                      setFieldToDelete(field);
                      setConfirmDeleteModalOpen(true);
                    }}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm font-medium"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredFields.length === 0 && !loading && (
          <div className="text-center py-8 text-gray-500">
            Không có sân nào được tìm thấy.
          </div>
        )}
      </div>

      <AddFieldModal
        open={addFieldModalOpen}
        onClose={() => setAddFieldModalOpen(false)}
        onSubmit={handleAddField}
      />

      <ConfirmDeleteModal
        open={confirmDeleteModalOpen}
        onClose={() => {
          setConfirmDeleteModalOpen(false);
          setFieldToDelete(null);
        }}
        onConfirm={() => handleDeleteField(fieldToDelete?.id)}
        field={fieldToDelete}
      />
    </div>
  );
}