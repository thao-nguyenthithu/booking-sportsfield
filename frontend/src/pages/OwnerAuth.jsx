import React, { useState } from "react";

export default function OwnerAuth() {
  // State cho form đăng ký
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [submitted, setSubmitted] = useState(false);
  const [agree, setAgree] = useState(false);
  const [agreeError, setAgreeError] = useState("");
  // OTP flow
  const [otpStep, setOtpStep] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpSuccess, setOtpSuccess] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [otpMsg, setOtpMsg] = useState("");

  // Validation rules
  const validate = (field, value) => {
    switch (field) {
      case "name":
        if (!value.trim()) return "Họ và tên không được để trống.";
        return "";
      case "email":
        if (!value.trim()) return "Email không được để trống.";
        if (!/^\S+@\S+\.\S+$/.test(value.trim())) return "Email không đúng định dạng.";
        return "";
      case "password":
        if (!value) return "Mật khẩu không được để trống.";
        if (value.length < 6) return "Mật khẩu tối thiểu 6 ký tự.";
        return "";
      case "confirmPassword":
        if (!value) return "Xác nhận mật khẩu không được để trống.";
        if (value !== form.password) return "Mật khẩu xác nhận không khớp.";
        return "";
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: validate(name, value) });
    // Nếu là password thì check lại confirmPassword luôn
    if (name === "password" && form.confirmPassword) {
      setErrors((prev) => ({ ...prev, confirmPassword: validate("confirmPassword", form.confirmPassword) }));
    }
  };

  // Gửi OTP về email qua API /api/auth/register
  const sendOtp = async () => {
    setSendingOtp(true);
    setOtpMsg("");
    setOtpError("");
    try {
      const payload = {
        email: form.email,
        fullName: form.name,
        password: form.password,
        confirmPassword: form.confirmPassword,
        role: "OWNER"
      };
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        setOtpMsg("Mã xác thực đã được gửi về email của bạn. Vui lòng kiểm tra hộp thư.");
        setSendingOtp(false);
        return true;
      } else {
        setOtpError(data.message || "Không thể gửi mã OTP. Vui lòng thử lại sau.");
        setSendingOtp(false);
        return false;
      }
    } catch (e) {
      setOtpError("Có lỗi xảy ra khi gửi OTP. Vui lòng thử lại.");
      setSendingOtp(false);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Kiểm tra tất cả các trường
    const newErrors = {
      name: validate("name", form.name),
      email: validate("email", form.email),
      password: validate("password", form.password),
      confirmPassword: validate("confirmPassword", form.confirmPassword),
    };
    setErrors(newErrors);
    let valid = Object.values(newErrors).every((v) => !v);
    if (!agree) {
      setAgreeError("Bạn cần đồng ý với Điều khoản dịch vụ và Chính sách bảo mật.");
      valid = false;
    } else {
      setAgreeError("");
    }
    // Nếu không có lỗi mới submit
    if (valid) {
      setOtpStep(true); // Chuyển ngay sang trang OTP
      const ok = await sendOtp();
      if (ok === false) {
        setOtpStep(false); // Quay lại nếu gửi OTP lỗi
      }
    }
  };

  // Xác thực OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setVerifyingOtp(true);
    setOtpError("");
    setOtpMsg("");
    try {
      // Gọi API xác thực OTP
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, otpCode: otp })
      });
      const data = await res.json();
      if (res.ok) {
        setOtpSuccess(true);
        setOtpMsg("Xác thực thành công! Đăng ký làm chủ sân đã hoàn tất.");
      } else {
        setOtpError(data.message || "Mã OTP không đúng hoặc đã hết hạn.");
      }
    } catch (e) {
      setOtpError("Có lỗi xảy ra khi xác thực OTP. Vui lòng thử lại.");
    }
    setVerifyingOtp(false);
  };

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen py-12 px-4">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12 mb-16">
        <div className="flex-1">
          <h1 className="text-4xl font-black mb-4 text-gray-900 dark:text-white">
            Tham gia đăng ký cho thuê sân tại EasyField
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
            Chúng tôi rất vui mừng thông báo rằng chúng tôi đang mở cửa cho cơ hội hợp tác đầy tiềm năng với các đối tác trong việc cho thuê sân thể thao thông qua website
            của chúng tôi. Với mục tiêu tạo ra một trải nghiệm thể thao tuyệt vời và thuận tiện cho cộng đồng, chúng tôi tin rằng sự hợp tác của chúng ta sẽ mang lại lợi ích lớn cho cả hai bên.
          </p>
        </div>
        <div className="flex-1 flex justify-center">
          <img src="https://file3.qdnd.vn/data/images/0/2024/08/19/upload_2312/pickleball.jpg?dpi=150&quality=100&w=870" alt="App mockup" className="w-[350px] max-h-[400px] object-cover drop-shadow-2xl rounded-xl" />
        </div>
      </div>
      {/* 2 cột bên dưới: Form và Stepper */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start gap-12">
        {/* Bảng đăng ký làm chủ sân */}
        <div className="flex-1 flex justify-center w-full">
          <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-8 w-full max-w-md border-t-8 border-blue-600 dark:border-blue-400">
            <h2 className="text-2xl font-extrabold text-center mb-4 text-blue-700 dark:text-blue-300">{otpStep ? 'Chào mừng chủ sân mới!' : 'Đăng ký làm chủ sân'}</h2>
            {/* Ẩn mô tả phụ khi ở bước OTP */}
            {!otpStep && (
              <p className="text-gray-600 dark:text-gray-300 text-center mb-6">Nhận tư vấn và hợp tác vận hành sân thể thao cùng chúng tôi!</p>
            )}
            {/* OTP Step */}
            {otpStep ? (
              <form className="space-y-5" onSubmit={handleVerifyOtp} noValidate>
                <div className="text-center text-base text-gray-700 dark:text-gray-300 mb-2 min-h-[48px] flex items-center justify-center">
                  {sendingOtp ? (
                    <span className="text-green">Đang gửi mã OTP...</span>
                  ) : otpSuccess ? (
                    <div className="flex flex-col items-center w-full animate-fade-in">
                      <div className="mb-4">
                        <svg className="w-16 h-16 text-green-500 animate-bounce" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="#fff" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12l2.5 2.5L16 9" />
                        </svg>
                      </div>
                      <div className="text-green-600 font-bold text-xl mb-2 animate-fade-in-slow">Xác thực thành công!</div>
                      <div className="text-gray-700 text-base mb-4 animate-fade-in-slow2">Giờ bạn có thể đi tới đăng nhập với tư cách là chủ sân để quảng bá sân của bạn ngay hôm nay.</div>
                      <a href="/owner-login" className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition animate-fade-in-slow3">Đến trang đăng nhập</a>
                      <div className="mt-4 text-sm text-gray-600 animate-fade-in-slow3">
                        Hoặc quay lại <button type="button" className="font-bold text-orange-500 underline hover:text-orange-600" onClick={() => { setOtpStep(false); setOtp(""); setOtpError(""); setOtpMsg(""); setOtpSuccess(false); setForm({ name: "", email: "", password: "", confirmPassword: "" }); setErrors({ name: "", email: "", password: "", confirmPassword: "" }); setAgree(false); setAgreeError(""); }}>
                          đăng ký làm chủ sân
                        </button>
                      </div>
                    </div>
                  ) : (
                    <span>Mã xác thực đã được gửi về email <span className="font-semibold">{form.email}</span>. Vui lòng nhập mã OTP để hoàn tất đăng ký.</span>
                  )}
                </div>
                {!otpSuccess && (
                  <>
                    <div>
                      <label className="block text-gray-700 font-medium mb-1">Mã OTP</label>
                      <input
                        type="text"
                        name="otp"
                        value={otp}
                        onChange={e => setOtp(e.target.value)}
                        required
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${otpError ? 'border-red-500 focus:ring-red-400' : 'focus:ring-blue-400'}`}
                        placeholder="Nhập mã OTP"
                        disabled={sendingOtp}
                      />
                      {otpError && <p className="text-red-500 text-sm mt-1">{otpError}</p>}
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2 bg-blue-600 text-white font-bold rounded-lg shadow hover:bg-blue-700 transition mt-2"
                      disabled={verifyingOtp || sendingOtp}
                    >
                      {verifyingOtp ? 'Đang xác thực...' : 'Xác thực OTP'}
                    </button>
                    <div className="flex mt-2">
                      <button
                        type="button"
                        className="flex items-center text-gray-500 hover:text-gray-700 text-sm font-medium focus:outline-none"
                        onClick={() => { setOtpStep(false); setOtp(""); setOtpError(""); setOtpMsg(""); setOtpSuccess(false); }}
                        disabled={sendingOtp}
                      >
                        <span className="mr-1">&#8592;</span> Quay lại
                      </button>
                    </div>
                  </>
                )}
              </form>
            ) : submitted ? (
              <div className="text-green-600 text-center font-semibold py-8">
                Đăng ký thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.
              </div>
            ) : (
              <form className="space-y-5" onSubmit={handleSubmit} noValidate>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Họ và tên</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.name ? 'border-red-500 focus:ring-red-400' : 'focus:ring-blue-400'}`}
                    placeholder="Nhập họ tên của bạn"
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.email ? 'border-red-500 focus:ring-red-400' : 'focus:ring-blue-400'}`}
                    placeholder="Nhập email liên hệ"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Mật khẩu</label>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.password ? 'border-red-500 focus:ring-red-400' : 'focus:ring-blue-400'}`}
                    placeholder="Nhập mật khẩu"
                  />
                  {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Xác nhận mật khẩu</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.confirmPassword ? 'border-red-500 focus:ring-red-400' : 'focus:ring-blue-400'}`}
                    placeholder="Nhập lại mật khẩu"
                  />
                  {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                </div>
                <div className="flex items-start mt-2">
                  <input
                    type="checkbox"
                    id="agree"
                    checked={agree}
                    onChange={e => setAgree(e.target.checked)}
                    className="mt-1 mr-2"
                  />
                  <label htmlFor="agree" className="text-sm text-gray-700 select-none">
                    Bằng việc đăng ký, tôi đã đồng ý với <span className="font-semibold">Sports Booking</span> về <a href="#" className="underline text-blue-600 hover:text-blue-800">Điều khoản dịch vụ</a> và <a href="#" className="underline text-blue-600 hover:text-blue-800">Chính sách bảo mật</a>
                  </label>
                </div>
                {agreeError && <p className="text-red-500 text-sm mt-1">{agreeError}</p>}
                <button
                  type="submit"
                  className="w-full py-2 bg-blue-600 text-white font-bold rounded-lg shadow hover:bg-blue-700 transition mt-2"
                  disabled={sendingOtp}
                >
                  Đăng ký ngay
                </button>
              </form>
            )}
          </div>
        </div>
        {/* Cách thức đăng ký làm chủ sân */}
        <div className="flex-1 w-full mt-12 md:mt-0">
          <h2 className="text-3xl font-bold mb-2 text-gray-900 text-center md:text-left">Cách thức đăng ký làm chủ sân</h2>
          <p className="text-gray-600 mb-8 text-center md:text-left">Tăng doanh thu với chúng tôi.</p>
          <ol className="relative border-l-4 border-blue-500 pl-8 space-y-10">
            <li>
              <div className="absolute -left-6 top-0 w-10 h-10 bg-white border-4 border-blue-500 rounded-full flex items-center justify-center text-xl font-bold text-blue-600 shadow">
                1
              </div>
              <h3 className="font-bold text-lg mb-1">Đăng ký</h3>
              <p className="text-gray-700">Tham gia cùng chúng tôi, miễn phí và dễ dàng.</p>
            </li>
            <li>
              <div className="absolute -left-6 top-24 w-10 h-10 bg-white border-4 border-blue-500 rounded-full flex items-center justify-center text-xl font-bold text-blue-600 shadow">
                2
              </div>
              <h3 className="font-bold text-lg mb-1">Tìm kiếm sân của bạn trên cơ sở dữ liệu của chúng tôi</h3>
              <p className="text-gray-700">Nhập vị trí của bạn để lấy dữ liệu sân của bạn.</p>
            </li>
            <li>
              <div className="absolute -left-6 top-48 w-10 h-10 bg-white border-4 border-blue-500 rounded-full flex items-center justify-center text-xl font-bold text-blue-600 shadow">
                3
              </div>
              <h3 className="font-bold text-lg mb-1">Nhận booking online</h3>
              <p className="text-gray-700">Dễ dàng nhận huỷ các slot đặt sân, thu tiền thông qua ứng dụng.</p>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
} 