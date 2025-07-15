import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const featuredFields = [
  {
    id: 1,
    name: 'Sân Bóng Đá Bình An',
    location: 'Quận 7, TP.HCM',
    type: 'Bóng đá',
    rating: 4.8,
    reviews: 230,
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 2,
    name: 'Sân Cầu Lông Sky',
    location: 'Quận Bình Thạnh, TP.HCM',
    type: 'Cầu lông',
    rating: 4.7,
    reviews: 187,
    image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 3,
    name: 'Sân Tennis Elite',
    location: 'Thủ Đức, TP.HCM',
    type: 'Tennis',
    rating: 4.9,
    reviews: 201,
    image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 4,
    name: 'Sân Bóng rổ Gold',
    location: 'Quận 7, TP.HCM',
    type: 'Bóng rổ',
    rating: 4.5,
    reviews: 145,
    image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=600&q=80',
  },
];

const HomePage = () => {
  const [search, setSearch] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    window.location.href = `/fields?search=${encodeURIComponent(search)}`;
  };

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      {/* Hero Section */}
      <section className="relative">
        <img
          src="https://phenikaa-uni.edu.vn:3600/fs/vi/san-bong-nha-da-nang-va-khu-the-chat/sb2.jpg"
          alt="Hero"
          className="w-full h-[500px] object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 text-center drop-shadow-lg tracking-wide" style={{ fontFamily: 'Inter, sans-serif' }}>
            Đặt Sân Thể Thao Dễ Dàng,<br />Nhanh Chóng
          </h1>
          <p className="text-lg md:text-xl text-white mb-8 text-center drop-shadow">
            Tìm kiếm và đặt sân bóng đá, cầu lông, tennis và nhiều hơn nữa chỉ trong tích tắc
          </p>
          <form onSubmit={handleSearch} className="w-full max-w-2xl flex bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <input
              type="text"
              className="flex-1 px-4 py-3 text-gray-700 dark:text-white dark:bg-gray-900 focus:outline-none"
              placeholder="Tìm sân theo tên, địa điểm, loại sân..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 font-semibold"
            >
              Tìm kiếm
            </button>
          </form>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="max-w-6xl mx-auto py-12 px-4 bg-white dark:bg-gray-900">
        <h2 className="text-2xl font-bold text-center mb-8 dark:text-white">Tại Sao Chọn EasyField?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex flex-col items-center">
            <span className="text-green-500 text-4xl mb-4">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" /></svg>
            </span>
            <h3 className="font-semibold text-lg mb-2 dark:text-white">Tìm Sân Dễ Dàng</h3>
            <p className="text-gray-500 dark:text-gray-300 text-center">Tìm kiếm sân thể thao dễ dàng, lọc sân và khung giờ trống chỉ với vài cú nhấp chuột.</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex flex-col items-center">
            <span className="text-green-500 text-4xl mb-4">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </span>
            <h3 className="font-semibold text-lg mb-2 dark:text-white">Đặt Lịch Nhanh Chóng</h3>
            <p className="text-gray-500 dark:text-gray-300 text-center">Hệ thống đặt lịch trực tuyến thuận tiện, xác nhận tức thì, tiết kiệm thời gian tối đa.</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex flex-col items-center">
            <span className="text-green-500 text-4xl mb-4">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a5 5 0 00-10 0v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2z" /></svg>
            </span>
            <h3 className="font-semibold text-lg mb-2 dark:text-white">Thanh Toán Linh Hoạt</h3>
            <p className="text-gray-500 dark:text-gray-300 text-center">Hỗ trợ đa dạng phương thức thanh toán, từ chuyển khoản đến ví điện tử.</p>
          </div>
        </div>
      </section>

      {/* Featured Fields */}
      <section className="max-w-6xl mx-auto py-12 px-4 bg-white dark:bg-gray-900">
        <h2 className="text-2xl font-bold text-center mb-8 dark:text-white">Các Sân Nổi Bật</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredFields.map((field) => (
            <div key={field.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden flex flex-col">
              <img src={field.image} alt={field.name} className="h-40 w-full object-cover" />
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="text-lg font-semibold mb-1 dark:text-white">{field.name}</h3>
                <p className="text-gray-500 dark:text-gray-300 text-sm mb-1">{field.location}</p>
                <p className="text-gray-500 dark:text-gray-300 text-sm mb-2">{field.type}</p>
                <div className="flex items-center mb-2">
                  <span className="text-yellow-400 mr-1">★</span>
                  <span className="font-semibold mr-1 dark:text-white">{field.rating}</span>
                  <span className="text-gray-400 dark:text-gray-400 text-xs">({field.reviews} đánh giá)</span>
                </div>
                <Link
                  to={`/booking/${field.id}`}
                  className="mt-auto bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium text-center"
                >
                  Đặt sân
                </Link>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-8">
          <Link
            to="/fields"
            className="border border-orange-500 text-orange-500 px-6 py-2 rounded hover:bg-orange-50 dark:hover:bg-gray-800 font-semibold"
          >
            Xem Tất Cả Sân
          </Link>
        </div>
      </section>

      {/* Steps Section */}
      <section className="max-w-6xl mx-auto py-12 px-4 bg-white dark:bg-gray-900">
        <h2 className="text-2xl font-bold text-center mb-8 dark:text-white">Đặt Sân Dễ Dàng Chỉ Với 3 Bước</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center">
            <div className="bg-indigo-100 dark:bg-gray-700 text-indigo-600 dark:text-indigo-300 rounded-full w-16 h-16 flex items-center justify-center mb-4 text-2xl font-bold">1</div>
            <h3 className="font-semibold text-lg mb-2 dark:text-white">Tìm kiếm & chọn sân</h3>
            <p className="text-gray-500 dark:text-gray-300 text-center">Chọn sân phù hợp với nhu cầu, vị trí và thời gian mong muốn.</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-indigo-100 dark:bg-gray-700 text-indigo-600 dark:text-indigo-300 rounded-full w-16 h-16 flex items-center justify-center mb-4 text-2xl font-bold">2</div>
            <h3 className="font-semibold text-lg mb-2 dark:text-white">Đặt lịch & thanh toán</h3>
            <p className="text-gray-500 dark:text-gray-300 text-center">Điền thông tin, chọn khung giờ và thanh toán trực tuyến an toàn.</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-indigo-100 dark:bg-gray-700 text-indigo-600 dark:text-indigo-300 rounded-full w-16 h-16 flex items-center justify-center mb-4 text-2xl font-bold">3</div>
            <h3 className="font-semibold text-lg mb-2 dark:text-white">Xác nhận & tận hưởng</h3>
            <p className="text-gray-500 dark:text-gray-300 text-center">Nhận xác nhận đặt sân và tận hưởng trải nghiệm thể thao tuyệt vời.</p>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="max-w-6xl mx-auto py-12 px-4 bg-white dark:bg-gray-900">
        <h2 className="text-2xl font-bold text-center mb-8 dark:text-white">Khách Hàng Nói Gì Về Chúng Tôi</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex flex-col items-center border border-gray-100">
            <p className="italic text-gray-700 dark:text-gray-300 mb-4 text-center">“Ứng dụng rất tiện lợi, tìm sân nhanh chóng và giá cả hợp lý. Tôi thường xuyên đặt sân ở đây và rất hài lòng với dịch vụ!”</p>
            <div className="flex items-center space-x-3 mt-auto">
              <img src="https://randomuser.me/api/portraits/women/68.jpg" alt="avatar" className="w-10 h-10 rounded-full border" />
              <div>
                <div className="font-semibold text-gray-900">Nguyễn Thị Mai Anh</div>
                <div className="text-xs text-gray-400">Người dùng tích cực</div>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex flex-col items-center border border-gray-100">
            <p className="italic text-gray-700 dark:text-gray-300 mb-4 text-center">“Trải nghiệm tuyệt vời! Giao diện dễ dùng, có nhiều sân chất lượng gần nhà. Đặt sân chưa bao giờ dễ đến thế.”</p>
            <div className="flex items-center space-x-3 mt-auto">
              <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="avatar" className="w-10 h-10 rounded-full border" />
              <div>
                <div className="font-semibold text-gray-900">Lê Văn Hùng</div>
                <div className="text-xs text-gray-400">Người dùng thân thiết</div>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex flex-col items-center border border-gray-100">
            <p className="italic text-gray-700 dark:text-gray-300 mb-4 text-center">“Rất hài lòng với dịch vụ và các hệ thống này. Sẽ sử dụng lại nhiều lần và giới thiệu cho khách hàng khác vì hệ thống rất chuyên nghiệp.”</p>
            <div className="flex items-center space-x-3 mt-auto">
              <img src="https://randomuser.me/api/portraits/women/65.jpg" alt="avatar" className="w-10 h-10 rounded-full border" />
              <div>
                <div className="font-semibold text-gray-900">Phạm Thu Hương</div>
                <div className="text-xs text-gray-400">Người dùng trung thành</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="w-full bg-white dark:bg-gray-900 py-12 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-2 text-center text-gray-900 dark:text-white">Sẵn Sàng Đặt Sân Của Bạn?</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-6 text-center">Tham gia EasyField ngay hôm nay để trải nghiệm dịch vụ đặt sân thể thao hàng đầu!</p>
        <Link to="/register" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded font-semibold text-lg shadow">Đăng Ký Ngay</Link>
      </section>

      {/* App Download Section */}
      <section className="max-w-6xl mx-auto py-16 px-4 flex flex-col md:flex-row items-center gap-10">
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-4 dark:text-white">Tải Ứng Dụng EasyField Ngay!</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">Trải nghiệm đặt sân tiện lợi hơn nữa với ứng dụng di động của chúng tôi. Tải về miễn phí trên App Store và Youtube Play.</p>
          <div className="flex space-x-4">
            <a href="#" className="inline-block"><img src="https://upload.wikimedia.org/wikipedia/commons/6/67/App_Store_%28iOS%29.svg" alt="App Store" className="h-12" /></a>
            <a href="#" className="inline-block"><img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" className="h-12" /></a>
          </div>
        </div>
        <div className="flex-1 flex justify-center">
          <img src="https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80" alt="App demo" className="rounded-lg shadow-lg w-full max-w-xs object-cover" />
        </div>
      </section>
    </div>
  );
};

export default HomePage; 