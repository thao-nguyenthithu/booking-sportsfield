import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const FieldList = () => {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchFields();
  }, []);

  const fetchFields = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/fields');
      setFields(response.data);
    } catch (error) {
      console.error('Error fetching fields:', error);
      // For demo purposes, show mock data
      setFields([
        {
          id: 1,
          name: 'Sân A - Bóng đá',
          type: 'Bóng đá',
          location: 'Hà Đông, Hà Nội',
          pricePerHour: 150000,
          status: 'ACTIVE',
          details: 'Sân cỏ nhân tạo, có đèn chiếu sáng, 200m2'
        },
        {
          id: 2,
          name: 'Sân B - Bóng đá',
          type: 'Bóng đá',
          location: 'Cầu Giấy, Hà Nội',
          pricePerHour: 180000,
          status: 'ACTIVE',
          details: 'Sân cỏ tự nhiên, có phòng thay đồ, 250m2'
        },
        {
          id: 3,
          name: 'Sân C - Tennis',
          type: 'Tennis',
          location: 'Ba Đình, Hà Nội',
          pricePerHour: 200000,
          status: 'ACTIVE',
          details: 'Sân tennis trong nhà, có điều hòa, 150m2'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredFields = fields.filter(field =>
    field.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    field.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Sân thể thao</h1>
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm sân theo tên hoặc địa điểm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-900 dark:text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFields.map((field) => (
            <div key={field.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">{field.type}</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{field.name}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-2">
                  <svg className="inline w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  {field.location}
                </p>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{field.details}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-300">
                    {field.pricePerHour.toLocaleString('vi-VN')}đ/giờ
                  </span>
                  <Link
                    to={`/booking/${field.id}`}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Đặt sân
                  </Link>
                </div>
                <div className="mt-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    field.status === 'ACTIVE' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                  }`}>
                    {field.status === 'ACTIVE' ? 'Có sẵn' : 'Bảo trì'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredFields.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Không tìm thấy sân nào phù hợp.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FieldList; 