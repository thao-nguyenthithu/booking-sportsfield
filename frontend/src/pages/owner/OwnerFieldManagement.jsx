import React, { useEffect, useState } from 'react';
import { FaPlus, FaSyncAlt, FaEdit, FaTrash, FaMapMarkerAlt, FaSearch, FaImages, FaWrench } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { useForm } from 'react-hook-form';
import Select from 'react-select';
import heic2any from "heic2any";

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
const STATUS_OPTIONS = [
  { value: 'ACTIVE', label: 'Hoạt động' },
  { value: 'MAINTENANCE', label: 'Bảo trì' },
];

// Đảm bảo HOUR_OPTIONS chỉ có HH:mm từ 05:00 đến 22:00
const HOUR_OPTIONS = Array.from({ length: 18 }, (_, i) => {
  const hour = i + 5;
  return `${hour.toString().padStart(2, '0')}:00`;
});

function AddFieldModal({ open, onClose, onSubmit }) {
  const { register, handleSubmit, formState: { errors }, watch, setValue, reset } = useForm();
  const location = watch('location');
  const openTime = watch('openTime');
  const closeTime = watch('closeTime');
  const [images, setImages] = React.useState([]);
  const [imagePreviews, setImagePreviews] = React.useState([]);
  const [uploading, setUploading] = React.useState(false);

  // react-select options
  const hourOptions = HOUR_OPTIONS.map(h => ({ value: h, label: h }));

  // Xử lý chọn ảnh và upload lên backend, convert .heic sang .jpg nếu cần
  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    setUploading(true);
    const uploadedUrls = [];
    const previews = [];
    for (const file of files) {
      let uploadFile = file;
      // Nếu là file .heic thì convert sang jpg
      if (file.type === "image/heic" || file.name.endsWith(".heic")) {
        try {
          const convertedBlob = await heic2any({
            blob: file,
            toType: "image/jpeg",
            quality: 0.9,
          });
          uploadFile = new File([convertedBlob], file.name.replace(/\.heic$/i, ".jpg"), { type: "image/jpeg" });
        } catch (err) {
          alert("Không thể chuyển đổi file HEIC. Vui lòng chọn ảnh khác!");
          continue;
        }
      }
      // Preview local
      previews.push(URL.createObjectURL(uploadFile));
      // Upload file (đã convert nếu là heic)
      const formData = new FormData();
      formData.append("file", uploadFile);
      try {
        const res = await fetch("/api/upload/image", {
          method: "POST",
          body: formData,
        });
        if (res.ok) {
          const url = await res.text();
          uploadedUrls.push(url.replace(/"/g, ""));
        }
      } catch (err) {
        // Có thể show thông báo lỗi upload nếu muốn
      }
    }
    setImages(uploadedUrls);        // Dùng cho submit
    setImagePreviews(previews);     // Dùng cho preview local
    setUploading(false);
  };

  // Xử lý submit kèm ảnh và mô tả
  const handleFormSubmit = (data) => {
    onSubmit({ ...data, images, numberOfField: data.numberOfField, details: data.details });
    setImages([]);
    setImagePreviews([]);
    reset();
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-xl overflow-y-auto" style={{ minHeight: '50vh', maxHeight: '80vh', width: '33vw', zIndex: 1100 }}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Thêm sân mới</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-2xl">&times;</button>
        </div>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="grid grid-cols-2 gap-4">
          <div className="col-span-1">
            <label className="block font-semibold mb-1">Tên sân</label>
            <input {...register('name', { required: 'Tên sân không được để trống' })} className={`w-full px-3 py-2 border rounded ${errors.name ? 'border-red-500' : 'border-gray-300'}`} />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div className="col-span-1">
            <label className="block font-semibold mb-1">Loại sân</label>
            <select {...register('type', { required: 'Loại sân không được để trống' })} className={`w-full px-3 py-2 border rounded ${errors.type ? 'border-red-500' : 'border-gray-300'}`} defaultValue="">
              <option value="">Chọn loại sân</option>
              {FIELD_TYPES.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
            {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type.message}</p>}
          </div>
          <div className="col-span-1">
            <label className="block font-semibold mb-1">Địa điểm</label>
            <input {...register('location', { required: 'Địa điểm không được để trống' })} className={`w-full px-3 py-2 border rounded ${errors.location ? 'border-red-500' : 'border-gray-300'}`} />
            {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location.message}</p>}
          </div>
          <div className="col-span-1">
            <label className="block font-semibold mb-1">Giá/giờ (VNĐ)</label>
            <input type="number" min={0} {...register('pricePerHour', { required: 'Giá/giờ không được để trống', min: 1 })} className={`w-full px-3 py-2 border rounded ${errors.pricePerHour ? 'border-red-500' : 'border-gray-300'}`} />
            {errors.pricePerHour && <p className="text-red-500 text-xs mt-1">{errors.pricePerHour.message}</p>}
          </div>
          <div className="col-span-1">
            <label className="block font-semibold mb-1">Số sân</label>
            <input type="number" min={1} {...register('numberOfField', { required: 'Số sân không được để trống', min: { value: 1, message: 'Số sân phải lớn hơn 0' }, valueAsNumber: true })} className={`w-full px-3 py-2 border rounded ${errors.numberOfField ? 'border-red-500' : 'border-gray-300'}`} />
            {errors.numberOfField && <p className="text-red-500 text-xs mt-1">{errors.numberOfField.message}</p>}
          </div>
          <div className="col-span-1">
            <label className="block font-semibold mb-1">Giờ mở cửa</label>
            <Select
              options={hourOptions}
              value={hourOptions.find(opt => opt.value === openTime) || null}
              onChange={opt => setValue('openTime', opt ? opt.value : '')}
              placeholder="--:--"
              classNamePrefix="react-select"
              menuPortalTarget={document.body}
              styles={{ menuPortal: base => ({ ...base, zIndex: 1200 }) }}
              maxMenuHeight={180}
            />
            {errors.openTime && <p className="text-red-500 text-xs mt-1">{errors.openTime.message}</p>}
          </div>
          <div className="col-span-1">
            <label className="block font-semibold mb-1">Giờ đóng cửa</label>
            <Select
              options={hourOptions}
              value={hourOptions.find(opt => opt.value === closeTime) || null}
              onChange={opt => setValue('closeTime', opt ? opt.value : '')}
              placeholder="--:--"
              classNamePrefix="react-select"
              menuPortalTarget={document.body}
              styles={{ menuPortal: base => ({ ...base, zIndex: 1200 }) }}
              maxMenuHeight={180}
            />
            {errors.closeTime && <p className="text-red-500 text-xs mt-1">{errors.closeTime.message}</p>}
          </div>
          <div className="col-span-2">
            <label className="block font-semibold mb-1">Trạng thái</label>
            <select {...register('status', { required: 'Trạng thái không được để trống' })} className={`w-full px-3 py-2 border rounded ${errors.status ? 'border-red-500' : 'border-gray-300'}`} defaultValue="ACTIVE">
              {STATUS_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
            {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status.message}</p>}
          </div>
          <div className="col-span-2">
            <label className="block font-semibold mb-1">Mô tả</label>
            <textarea {...register('details')} rows={2} className="w-full px-3 py-2 border rounded border-gray-300 resize-none" placeholder="Mô tả chi tiết về sân, tiện ích, ..." />
          </div>
          <div className="col-span-2">
            <label className="block font-semibold mb-1">Ảnh sân</label>
            <input type="file" accept="image/*" multiple onChange={handleImageChange} className="block" />
            <div className="flex gap-2 mt-2 flex-wrap">
              {imagePreviews.map((src, i) => (
                <img key={i} src={src} alt="preview" className="w-16 h-16 object-cover rounded border" />
              ))}
            </div>
          </div>
          <div className="col-span-2 flex justify-end gap-2 mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-100 text-gray-600 font-semibold hover:bg-gray-200">Hủy</button>
            <button type="submit" className="px-4 py-2 rounded bg-green-500 text-white font-semibold hover:bg-green-600" disabled={uploading}>Lưu</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ConfirmDeleteModal({ open, onClose, onConfirm, field }) {
  if (!open || !field) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-xs text-center">
        <div className="mb-4">
          <span>Bạn có chắc chắn muốn <span className="text-red-500 font-semibold">xóa sân</span></span><br />
          <span className="font-bold text-lg">{field.name}</span>?
        </div>
        <div className="flex justify-center gap-3 mt-4">
          <button onClick={onConfirm} className="px-6 py-2 rounded bg-red-500 text-white font-semibold hover:bg-red-600">Xác nhận</button>
          <button onClick={onClose} className="px-6 py-2 rounded bg-gray-200 text-gray-600 font-semibold hover:bg-gray-300">Hủy</button>
        </div>
      </div>
    </div>
  );
}

export default function OwnerFieldManagement() {
  const { user, token } = useAuth();
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [areaFilter, setAreaFilter] = useState('');
  const [addFieldModalOpen, setAddFieldModalOpen] = useState(false);
  const [confirmDeleteModalOpen, setConfirmDeleteModalOpen] = useState(false);
  const [fieldToDelete, setFieldToDelete] = useState(null);
  const [maintenanceModalOpen, setMaintenanceModalOpen] = useState(false);
  const [fieldToMaintain, setFieldToMaintain] = useState(null);
  const [editFieldModalOpen, setEditFieldModalOpen] = useState(false);
  const [fieldToEdit, setFieldToEdit] = useState(null);

  const fetchFields = async () => {
    if (!user?.id || !token) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/owner/fields?ownerId=${user.id}`, {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      if (!res.ok) throw new Error('Không thể tải danh sách sân');
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

      const payload = { ...data };
      if (data.images && Array.isArray(data.images)) {
        payload.images = data.images.map(img => (typeof img === 'string' ? img : img.name));
      }
      const res = await fetch('/api/owner/fields', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Không thể thêm sân');
      const newField = await res.json();
      setFields(prev => [...prev, newField]);
      setAddFieldModalOpen(false);
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

  // 2. Hàm cập nhật trạng thái sân
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
      // Cập nhật lại danh sách sân
      fetchFields();
      setMaintenanceModalOpen(false);
      setFieldToMaintain(null);
    } catch (e) {
      setError(e.message || 'Lỗi không xác định');
    }
  };

  // Hàm xử lý cập nhật sân
  const handleEditField = async (fieldId, data, oldImages) => {
    if (!user?.id || !token) return;
    try {
      // Nếu không upload ảnh mới, giữ lại ảnh cũ
      const payload = { ...data };
      if (!data.images || data.images.length === 0) {
        payload.images = oldImages;
      }
      const res = await fetch(`/api/owner/fields/${fieldId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Không thể cập nhật sân');
      const updatedField = await res.json();
      setFields(prev => prev.map(f => f.id === fieldId ? updatedField : f));
      setEditFieldModalOpen(false);
      setFieldToEdit(null);
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
    const matchArea = !areaFilter || f.location?.includes(areaFilter);
    const matchSearch = !search || f.name.toLowerCase().includes(search.toLowerCase()) || f.location?.toLowerCase().includes(search.toLowerCase());
    return matchType && matchArea && matchSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex items-center justify-between mb-2">
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
          <button onClick={fetchFields} className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold shadow text-sm">
            <FaSyncAlt /> Làm mới
          </button>
          <button onClick={() => setAddFieldModalOpen(true)} className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold shadow text-sm">
            <FaPlus /> Thêm sân
          </button>
        </div>
      </div>
      {/* Filter/Search */}
      <div className="flex flex-wrap gap-2 mb-6 mt-2">
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="px-3 py-2 border rounded text-sm">
          <option value="">Tất cả môn thể thao</option>
          {FIELD_TYPES.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Nhập tên sân hoặc địa chỉ..."
          className="px-3 py-2 border rounded text-sm flex-1 min-w-[200px]"
        />
        <select value={areaFilter} onChange={e => setAreaFilter(e.target.value)} className="px-3 py-2 border rounded text-sm">
          <option value="">Tất cả khu vực</option>
          <option value="Hà Nội">Hà Nội</option>
        </select>
        <button className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded-lg font-semibold shadow text-sm">
          <FaSearch /> Tìm kiếm
        </button>
      </div>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFields.map(field => (
              <div key={field.id} className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden flex flex-col">
                {field.images && field.images[0] ? (
                  <img src={field.images[0].startsWith('http') ? field.images[0] : `http://localhost:8080${field.images[0]}`}
                    alt={field.name}
                    className="h-40 w-full object-cover" />
                ) : (
                  <div className="h-40 w-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-green-100">
                    <span className="text-lg text-indigo-500 font-bold">{field.type}</span>
                  </div>
                )}
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="text-lg font-semibold mb-1">{field.name}</h3>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-indigo-500 font-medium">{field.type}</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${STATUS_COLORS[field.status]}`}>{STATUS_LABELS[field.status]}</span>
                  </div>
                  <div className="flex items-center text-gray-500 text-sm mb-1">
                    <FaMapMarkerAlt className="mr-1" />
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(field.location)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline hover:text-blue-600"
                    >
                      {field.location}
                    </a>
                  </div>
                  <div className="text-indigo-600 font-bold text-lg mb-1">{field.pricePerHour?.toLocaleString('vi-VN')}đ/giờ</div>
                  <div className="text-gray-500 text-xs mb-1">Giờ mở cửa: {field.openTime} - {field.closeTime}</div>
                  <div className="text-gray-500 text-xs mb-2">{field.details}</div>
                  {field.numberOfField !== undefined && (
                    <div className="text-sm text-gray-700 mb-1"><b>Số lượng:</b> {field.numberOfField} sân</div>
                  )}
                  <div className="flex gap-2 mt-3">
                    <button className="p-2 rounded bg-blue-50 hover:bg-blue-100 text-blue-600" title="Sửa sân" onClick={() => { setFieldToEdit(field); setEditFieldModalOpen(true); }}><FaEdit /></button>
                    <button className="p-2 rounded bg-red-50 hover:bg-red-100 text-red-600" title="Xóa sân" onClick={() => { setFieldToDelete(field); setConfirmDeleteModalOpen(true); }}><FaTrash /></button>
                    <button className="p-2 rounded bg-yellow-50 hover:bg-yellow-100 text-yellow-600" title="Bảo trì" onClick={() => { setFieldToMaintain(field); setMaintenanceModalOpen(true); }}><FaWrench /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {filteredFields.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Không tìm thấy sân nào phù hợp.</p>
            </div>
          )}
        </>
      )}
      <AddFieldModal
        open={addFieldModalOpen}
        onClose={() => setAddFieldModalOpen(false)}
        onSubmit={handleAddField}
      />
      <ConfirmDeleteModal
        open={confirmDeleteModalOpen}
        onClose={() => setConfirmDeleteModalOpen(false)}
        onConfirm={() => fieldToDelete && handleDeleteField(fieldToDelete.id)}
        field={fieldToDelete}
      />
      {/* Modal bảo trì */}
      {maintenanceModalOpen && fieldToMaintain && (
        <MaintenanceModal
          open={maintenanceModalOpen}
          onClose={() => { setMaintenanceModalOpen(false); setFieldToMaintain(null); }}
          field={fieldToMaintain}
          onSubmit={handleUpdateStatus}
        />
      )}
      {/* Modal chỉnh sửa */}
      {editFieldModalOpen && fieldToEdit && (
        <EditFieldModal
          open={editFieldModalOpen}
          onClose={() => { setEditFieldModalOpen(false); setFieldToEdit(null); }}
          field={fieldToEdit}
          onSubmit={handleEditField}
        />
      )}
    </div>
  );
}

function MaintenanceModal({ open, onClose, field, onSubmit }) {
  const [selectedStatus, setSelectedStatus] = useState(field.status);
  if (!open || !field) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-xl shadow-lg p-8 pt-7 w-full max-w-xs text-center relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl"
          aria-label="Đóng"
        >
          &times;
        </button>
        <h2 className="text-lg mb-2">Cập nhật trạng thái sân</h2>
        <div className="font-semibold mb-4 text-base text-center">{field.name}</div>
        <select
          className="w-full px-3 py-2 border rounded mb-4"
          value={selectedStatus}
          onChange={e => setSelectedStatus(e.target.value)}
        >
          {STATUS_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <div className="flex justify-center gap-3 mt-2">
          <button
            onClick={() => onSubmit(field.id, selectedStatus)}
            className="px-6 py-2 rounded bg-green-500 text-white font-semibold hover:bg-green-600"
          >
            Xác nhận
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 rounded bg-gray-200 text-gray-600 font-semibold hover:bg-gray-300"
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
}

function EditFieldModal({ open, onClose, field, onSubmit }) {
  const { register, handleSubmit, formState: { errors }, watch, setValue, reset } = useForm({ defaultValues: { ...field, numberOfField: field?.numberOfField } });
  const [images, setImages] = React.useState([]);
  const [imagePreviews, setImagePreviews] = React.useState(field?.images || []);
  const [uploading, setUploading] = React.useState(false);
  React.useEffect(() => {
    if (field) {
      reset(field);
      setImagePreviews(field.images || []);
      setImages([]);
    }
  }, [field, reset]);
  const hourOptions = HOUR_OPTIONS.map(h => ({ value: h, label: h }));
  // Xử lý chọn ảnh và upload lên backend, convert .heic sang .jpg nếu cần
  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    setUploading(true);
    const uploadedUrls = [];
    const previews = [];
    for (const file of files) {
      let uploadFile = file;
      if (file.type === "image/heic" || file.name.endsWith(".heic")) {
        try {
          const convertedBlob = await heic2any({ blob: file, toType: "image/jpeg", quality: 0.9 });
          uploadFile = new File([convertedBlob], file.name.replace(/\.heic$/i, ".jpg"), { type: "image/jpeg" });
        } catch (err) {
          alert("Không thể chuyển đổi file HEIC. Vui lòng chọn ảnh khác!");
          continue;
        }
      }
      previews.push(URL.createObjectURL(uploadFile));
      const formData = new FormData();
      formData.append("file", uploadFile);
      try {
        const res = await fetch("/api/upload/image", { method: "POST", body: formData });
        if (res.ok) {
          const url = await res.text();
          uploadedUrls.push(url.replace(/"/g, ""));
        }
      } catch (err) {}
    }
    setImages(uploadedUrls);
    setImagePreviews(previews);
    setUploading(false);
  };
  const handleFormSubmit = (data) => {
    onSubmit(field.id, { ...data, images, numberOfField: data.numberOfField }, field.images);
    setImages([]);
    setImagePreviews([]);
    reset();
  };
  if (!open || !field) return null;
  const openTimeRaw = watch('openTime') || '';
  const closeTimeRaw = watch('closeTime') || '';
  const openTime = openTimeRaw.slice(0, 5); // chỉ lấy HH:mm
  const closeTime = closeTimeRaw.slice(0, 5);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-xl overflow-y-auto" style={{ minHeight: '50vh', maxHeight: '80vh', width: '33vw', zIndex: 1100 }}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Chỉnh sửa sân</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-2xl">&times;</button>
        </div>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="grid grid-cols-2 gap-4">
          <div className="col-span-1">
            <label className="block font-semibold mb-1">Tên sân</label>
            <input {...register('name', { required: 'Tên sân không được để trống' })} className={`w-full px-3 py-2 border rounded ${errors.name ? 'border-red-500' : 'border-gray-300'}`} />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div className="col-span-1">
            <label className="block font-semibold mb-1">Loại sân</label>
            <select {...register('type', { required: 'Loại sân không được để trống' })} className={`w-full px-3 py-2 border rounded ${errors.type ? 'border-red-500' : 'border-gray-300'}`} defaultValue={field.type}>
              <option value="">Chọn loại sân</option>
              {FIELD_TYPES.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
            {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type.message}</p>}
          </div>
          <div className="col-span-1">
            <label className="block font-semibold mb-1">Địa điểm</label>
            <input {...register('location', { required: 'Địa điểm không được để trống' })} className={`w-full px-3 py-2 border rounded ${errors.location ? 'border-red-500' : 'border-gray-300'}`} />
            {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location.message}</p>}
          </div>
          <div className="col-span-1">
            <label className="block font-semibold mb-1">Giá/giờ (VNĐ)</label>
            <input type="number" min={0} {...register('pricePerHour', { required: 'Giá/giờ không được để trống', min: 1 })} className={`w-full px-3 py-2 border rounded ${errors.pricePerHour ? 'border-red-500' : 'border-gray-300'}`} />
            {errors.pricePerHour && <p className="text-red-500 text-xs mt-1">{errors.pricePerHour.message}</p>}
          </div>
          <div className="col-span-1">
            <label className="block font-semibold mb-1">Số sân</label>
            <input type="number" min={1} {...register('numberOfField', { required: 'Số sân không được để trống', min: { value: 1, message: 'Số sân phải lớn hơn 0' }, valueAsNumber: true })} className={`w-full px-3 py-2 border rounded ${errors.numberOfField ? 'border-red-500' : 'border-gray-300'}`} />
            {errors.numberOfField && <p className="text-red-500 text-xs mt-1">{errors.numberOfField.message}</p>}
          </div>
          <div className="col-span-1">
            <label className="block font-semibold mb-1">Giờ mở cửa</label>
            <Select
              options={hourOptions}
              value={hourOptions.find(opt => opt.value === openTime) || null}
              onChange={opt => setValue('openTime', opt ? opt.value : '')}
              placeholder="--:--"
              classNamePrefix="react-select"
              menuPortalTarget={document.body}
              styles={{ menuPortal: base => ({ ...base, zIndex: 1200 }) }}
              maxMenuHeight={180}
            />
            {errors.openTime && <p className="text-red-500 text-xs mt-1">{errors.openTime.message}</p>}
          </div>
          <div className="col-span-1">
            <label className="block font-semibold mb-1">Giờ đóng cửa</label>
            <Select
              options={hourOptions}
              value={hourOptions.find(opt => opt.value === closeTime) || null}
              onChange={opt => setValue('closeTime', opt ? opt.value : '')}
              placeholder="--:--"
              classNamePrefix="react-select"
              menuPortalTarget={document.body}
              styles={{ menuPortal: base => ({ ...base, zIndex: 1200 }) }}
              maxMenuHeight={180}
            />
            {errors.closeTime && <p className="text-red-500 text-xs mt-1">{errors.closeTime.message}</p>}
          </div>
          <div className="col-span-2">
            <label className="block font-semibold mb-1">Trạng thái</label>
            <select {...register('status', { required: 'Trạng thái không được để trống' })} className={`w-full px-3 py-2 border rounded ${errors.status ? 'border-red-500' : 'border-gray-300'}`} defaultValue={field.status}>
              {STATUS_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
            {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status.message}</p>}
          </div>
          <div className="col-span-2">
            <label className="block font-semibold mb-1">Mô tả</label>
            <textarea {...register('details')} rows={2} className="w-full px-3 py-2 border rounded border-gray-300 resize-none" placeholder="Mô tả chi tiết về sân, tiện ích, ..." />
          </div>
          <div className="col-span-2">
            <label className="block font-semibold mb-1">Ảnh sân</label>
            <input type="file" accept="image/*" multiple onChange={handleImageChange} className="block" />
            <div className="flex gap-2 mt-2 flex-wrap">
              {imagePreviews.map((src, i) => (
                <img key={i} src={src} alt="preview" className="w-16 h-16 object-cover rounded border" />
              ))}
            </div>
          </div>
          <div className="col-span-2 flex justify-end gap-2 mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-100 text-gray-600 font-semibold hover:bg-gray-200">Hủy</button>
            <button type="submit" className="px-4 py-2 rounded bg-green-500 text-white font-semibold hover:bg-green-600" disabled={uploading}>Lưu</button>
          </div>
        </form>
      </div>
    </div>
  );
}