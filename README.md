# Sports Field Booking - API Contract & Setup

## 1. User Roles

Hệ thống gồm 2 vai trò người dùng:

* **Khách hàng** (User)
* **Quản trị viên** (Admin)

Mọi mật khẩu được mã hoá bằng **BCrypt** trước khi lưu. Tất cả các endpoint bảo vệ đều yêu cầu **JWT** và xác thực phân quyền.

## 2. API Contract

Các endpoint được chia theo module:

### 2.1 Đăng kí, đăng nhập

#### POST `/api/auth/register`

* **Mô tả** : Đăng ký tài khoản mới (vai trò khách hàng) gồm 2 bước (nhập thông tin → xác thực OTP qua email)

##### Bước 1: Nhập thông tin cơ bản

* **Request Body** (JSON):

  ```json
  {
    "email": "user@example.com",
    "fullName": "Nguyen Van A",
    "password": "string",
    "confirmPassword": "string"
  }
  ```
* **Validation (client-side tức thì)** :

  * Email sai cấu trúc: thông báo `"Email không hợp lệ"`
  * Email hợp lệ nhưng đã tồn tại: thông báo `"Email đã tồn tại"`
  * `fullName` để trống: thông báo `"Họ và tên không được để trống"`
  * `password` < 6 ký tự: thông báo `"Mật khẩu phải ít nhất 6 ký tự"`
  * `password` và `confirmPassword` không khớp: thông báo `"Mật khẩu không khớp"`
* **Chỉ khi tất cả hợp lệ** , button `Tiếp tục` mới enabled.
* Khi nhấn `Tiếp tục`, frontend gọi API này.
* **Response 200 OK** (JSON):

  ```json
  {
    "pendingEmail": "user@example.com",
    "otpRequestId": "uuid-token",
    "message": "OTP đã được gửi đến email"
  }
  ```

  * `otpRequestId`: mã định danh để xác thực OTP sau này
* **Errors** :

  * `400 Bad Request`:

    ```json
    { "error": "Thông tin không được để trống" }
    ```

##### Bước 2: Xác thực OTP

* **Endpoint** : POST `/api/auth/verify-otp`
* **Request Body** (JSON):
  ```json
  {
    "otpRequestId": "uuid-token",
    "otpCode": "123456"
  }
  ```
* **OTP Code** gồm 6 chữ số, hợp lệ trong 10 phút kể từ khi gửi email.
* **Response 200 OK** :

```json
  {
    "message": "Xác thực thành công, bạn có thể đăng nhập"
  }
```

* **Errors** :` 400 Bad Request`

```json
{ "error": "Mã xác thực sai hoặc đã quá hạn. Vui lòng thử lại." }
```

#### POST `/api/auth/login`

* **Mô tả** : Đăng nhập, trả về token JWT
* **Request Body** :

```json
  {
    "email": "user@example.com",
    "password": "string"
  }
```

* **Validation (Client-side tức thì):**
  * Email sai cấu trúc: thông báo `"Email không hợp lệ"`
  * Email hợp lệ nhưng chưa tồn tại: thông báo `"Email chưa được đăng kí"`
  * `password` < 6 ký tự: thông báo `"Mật khẩu phải ít nhất 6 ký tự"`
* **Response 200 OK** (JSON):

```json
{
    "message": "Đăng nhập thành công!",
    "token": "<JWT_TOKEN>",
    "user": {
        "id": 123,
        "email": "user@example.com",
        "fullName": "Nguyen Van A",
        "role": "ROLE_USER | ROLE_ADMIN", // hoặc "ROLE_ADMIN"
    }
}
```

* **Errors** :

`400 Bad Request:`

```json
{ "error": "Thông tin không được để trống."}
```

`401 Unauthorized`:

```json
{ "error": "Email hoặc mật khẩu không đúng. Vui lòng kiểm tra lại hoặc quên mật khẩu." }
```

#### POST `/api/auth/forgot-password/request`

* **Mô tả:** Gửi yêu cầu lấy mã OTP để đặt lại mật khẩu
* **Request Body:**

```json
{
  "email": "user@example.com"
}
```

* **Validation (Client-side tức thì):**

  * Email sai cấu trúc: thông báo `"Email không hợp lệ"`
  * Email hợp lệ nhưng chưa tồn tại: thông báo `"Email chưa được đăng kí"`
* Nếu hợp lệ → gửi OTP 6 chữ số có hiệu lực **10 phút** đến email.
* Response 200 OK:

  ```json
  {
    "pendingEmail": "user@example.com",
    "otpRequestId": "uuid-token",
    "message": "Mã xác thực đã được gửi đến email"
  }
  ```
* **Errors** :

  * `400 Bad Request`:

    ```json
    { "error": "Thông tin không được để trống" }
    ```

#### POST `/api/auth/forgot-password/verify-otp`

* **Mô tả**: Xác nhận mã OTP (cùng schema như đăng kí)
* **Request Body** :

  ```json
  {
    "otpRequestId": "uuid-token",
    "otpCode": "123456"
  }

  ```
* **Errors** :

  ```json
  {
    "error": "Mã xác thực sai hoặc đã quá hạn. Vui lòng thử lại."
  }

  ```

#### POST `/api/auth/forgot-password/reset`

* **Mô tả:** Đặt mật khẩu mới sau khi xác minh OTP thành công
* **Request Body** :

```json
{
  "email": "user@example.com",
  "newPassword": "abc123",
  "confirmPassword": "abc123"
}
```

* **Validation (client-side)** :

  * `newPassword` < 6 ký tự → `"Mật khẩu phải ít nhất 6 ký tự"`
  * `newPassword` ≠ `confirmPassword` → `"Mật khẩu không khớp"`
  * Trường rỗng → `"Thông tin không được để trống"`
* Đổi mật khẩu mới sau khi xác thực
* **Response 200 OK** :

  ```json
  {
    "message": "Cập nhật mật khẩu thành công"
  }
  ```
* Sau 2 giây, frontend redirect về trang đăng nhập.

### 2.2 Fields Booking

#### GET `/api/fields`

* **Mô tả** : Lấy danh sách tất cả các sân

#### GET `/api/fields/search?name=&location=`

* **Mô tả** : Tìm kiếm sân theo tên/ vị trí

### 2.3 Bookings

#### POST `/api/user/bookings`

* **Mô tả** : Khách hàng đã đăng nhập thực hiện đặt sân trực tuyến. Frontend sẽ hiển thị tổng số tiền và tổng thời gian tương ứng ngay khi người dùng chọn khung giờ.
* **Quyền truy cập** : **ROLE_USER** (Yêu cầu JWT)
* **Request Body** :

```json
{
    "courtId": 101,
    "bookingDate": "2025-07-20",
    "startTime": "10:00",
    "endTime": "12:00"
    // totalAmount không gửi từ frontend để backend tính toán và xác nhận lại
}
```

* **Validation (Client-side tức thì)** : Sân đã được đặt trong khung giờ đó: thông báo **"Sân bạn chọn đã có người đặt trong khung giờ này"**
* **Response 200 OK** :

```json
{
    "message": "Đặt sân của bạn đã được tạo thành công. Vui lòng tiến hành thanh toán.",
    "bookingId": 789,
    "paymentDetails": {
        "bankAccount": "1234567890",
        "bankName": "Ngân hàng XYZ",
        "accountHolder": "Công ty ABC",
        "transferContent": "BOOK-789", 
        "amount": 200000 
    }
}
```

* Backend tạo một bản ghi đặt sân với trạng thái `"PENDING_PAYMENT"` (chờ thanh toán), tính toán lại tổng số tiền và cung cấp chi tiết thanh toán qua chuyển khoản (tích hợp Autopay.vn). Frontend chuyển đến trang xác nhận và thanh toán.

#### POST `/api/user/bookings/{id}/payment-confirm` *(Webhook từ Autopay)*

* **Mô tả** : Endpoint này được **Autopay.vn** (hoặc hệ thống thanh toán tích hợp) gọi khi phát hiện một giao dịch thanh toán thành công.
* **Quyền truy cập** : Public (Chỉ các IP được phép từ cổng thanh toán)
* **Request Body** : (Định dạng phụ thuộc vào Autopay.vn)
* Backend sẽ trích xuất `content` (ví dụ `BOOK-789`), tìm `bookingId` tương ứng và cập nhật trạng thái đặt sân thành `"PAID"` (Đã thanh toán).
* **Response 200 OK** (JSON):

  ```json
  {
      "status": "success",
      "message": "Đặt sân thành công!"
  }
  ```
* Backend xử lý logic nghiệp vụ: đánh dấu đặt sân là đã thanh toán, giải phóng các tài nguyên tạm thời. Frontend (có thể thông qua polling hoặc WebSocket) sẽ nhận được thông báo trạng thái thanh toán thành công.

#### POST `/api/admin/bookings`

* **Mô tả** : Admin thực hiện đặt sân cho khách hàng tại quầy. Frontend sẽ có 2 radio button để lựa chọn "Khách đã đăng kí" hoặc "Khách vãn lai".
* **Quyền truy cập** : **ROLE_ADMIN** (Yêu cầu JWT)
* **Request Body** :

  ```json
  {
      "customerType": "REGISTERED", // Hoặc "WALK_IN"
      "customerId": 123, // Bắt buộc nếu customerType là REGISTERED. Sẽ được tìm kiếm theo tên hoặc email đã đăng ký.
      "customerName": "Khách Vãn Lai", // Bắt buộc nếu customerType là WALK_IN.
      "customerNote": "...", // Có thể nhập thông tin bất kì hoặc không của khách ví dụ số điện thoại liên hệ, hay gì đó để nhận diện. 
      "courtId": 101,
      "bookingDate": "2025-07-20",
      "startTime": "10:00",
      "endTime": "12:00",
      "totalAmount": 200000, // Backend cũng sẽ tính toán lại.
      "paymentMethod": "CASH" // Ví dụ: "CASH", "BANK_TRANSFER_OFFLINE"
  }
  ```
* **Validation (Client-side tức thì)** :

  * Tương tự như đặt sân online, cộng thêm:
  * Nếu `customerType` là `WALK_IN` nhưng `customerName` trống: thông báo **"Tên khách vãng lai không được để trống"**
* **Response 201 Created** (JSON):

  ```json
  {
      "message": "Đặt sân thành công cho khách hàng.",
      "booking": {
          "id": 790,
          "courtId": 101,
          "bookingDate": "2025-07-20",
          "startTime": "10:00",
          "endTime": "12:00",
          "status": "PAID", // Đặt sân tại quầy thường được đánh dấu PAID ngay lập tức
          "customerType": "REGISTERED", // Hoặc "WALK_IN"
          "customerId": u123, // Có thể w123 nếu là khách vãng lai
          "customerName": "Nguyen Van A" // Tên khách hàng (đã đăng ký hoặc vãng lai)
          // ... các thông tin booking khác
      }
  }
  ```

#### POST `/api/user/bookings/{id}/cancel`

* **Mô tả** : Khách hàng yêu cầu hủy đặt sân đã thanh toán. Chỉ có thể hủy khi thời gian đặt sân **chưa đến giờ bắt đầu** (hủy trước giờ bắt đầu chơi). Nếu đang trong thời gian đặt sân thì không được phép hủy.
* **Quyền truy cập** : **ROLE_USER**(Yêu cầu JWT của chủ booking)
* **Request Body** :

  ```json
  {
      "bookingId": 789,
      "refundBankAccount": "9876543210",
      "refundBankName": "Ngân hàng ABC",
      "refundAccountHolder": "Nguyen Van A",
      "cancellationReason": "Thay đổi lịch trình cá nhân."
  }
  ```
* **Validation (Client-side tức thì)** : Để trống bất kỳ thông tin nào trong form hoàn tiền: thông báo **"Thông tin không được để trống"**
* Backend kiểm tra thời gian đặt sân. Nếu đủ điều kiện hủy (chưa đến giờ bắt đầu chơi), trạng thái của `bookingId` sẽ được cập nhật thành `"CANCELLATION_REQUESTED"` (Yêu cầu hủy). Sân sẽ được giải phóng trong hệ thống ngay lập tức (trở lại trạng thái `AVAILABLE`). Thông tin yêu cầu hoàn tiền sẽ được gửi về email của khách hàng và đồng thời hiển thị trên trang yêu cầu hoàn tiền của Admin để xử lý trong vòng 2 tuần.
* **Response 200 OK** (JSON):

  ```json
  {
      "message": "Yêu cầu hủy đặt sân đã được gửi thành công. Chúng tôi sẽ kiểm tra và hoàn tiền trong vòng 2 tuần kể từ khi bạn xác nhận yêu cầu hoàn tiền. (Thông tin sân hủy: Sân ABC, ngày 2025-07-20, 10:00-12:00. Thông tin hoàn tiền: STK 9876543210, Ngân hàng ABC, Chủ TK Nguyen Van A)"
  }
  ```

#### PUT `/api/admin/refund-requests/{requestId}/process`

* **Mô tả** : **Admin** xử lý yêu cầu hoàn tiền từ khách hàng sau khi hủy đặt sân.
* **Quyền truy cập** : **ROLE_ADMIN** (Yêu cầu JWT)
* **Request Body** :

  ```json
  {
      "status": "COMPLETED", // Hoặc "REJECTED"
      "adminNotes": "Đã hoàn tiền vào tài khoản khách hàng."
  }
  ```
* **Response 200 OK** (JSON):

  ```json
  {
      "message": "Yêu cầu hoàn tiền đã được xử lý thành công."
  }
  ```
* Backend cập nhật trạng thái yêu cầu hoàn tiền và gửi thông báo qua mail cho khách hàng.

#### PUT `/api/admin/bookings/{id}/cancel`

* **Mô tả** : Admin có quyền hủy đặt sân cho khách hàng do lỗi phát sinh từ sân trong quá trình chơi (ví dụ: sân hỏng, mất điện). Điều kiện là thời gian đặt sân **chưa quá 1/2 thời gian đặt sân** . Tiền sẽ được hoàn trả trực tiếp offline cho khách hàng.
* **Quyền truy cập** : **ROLE_ADMIN** (Yêu cầu JWT)
* **Request Body** :

  ```json
  {
      "reason": "Sân bị hư hỏng đột xuất trong quá trình chơi.",
      "refundAmount": 50000 
  }
  ```
* **Response 200 OK** (JSON):

  ```json
  {
      "message": "Đặt sân đã được hủy do lỗi. Tiền đã được hoàn trực tiếp offline.",
      "bookingId": 789
  }
  ```
* Backend kiểm tra điều kiện hủy (chưa quá 1/2 thời gian chơi). Nếu hợp lệ, trạng thái `bookingId` được cập nhật thành `"CANCELLED_BY_MANAGER"` và ghi lại hình thức hoàn tiền là `"OFFLINE_REFUND".`

### 2.4 Lịch sử & Đánh giá

#### GET `/api/user/bookings/history`

* **Mô tả** : Lấy lịch sử booking của user hiện tại
* **Response 200 OK** : danh sách bookings

#### POST `/api/user/bookings/{id}/rate`

* Mô tả : Đánh giá sân. Chỉ được đánh giá sau khi đặt sân xong và trong vòng 5 ngày.
* ```json
  {
    "fieldId": 1,
    "stars": 4,// số sao(1-5)
    "content": "Sân sạch sẽ",
    "images": ["url1", "url2"]
  }
  ```

### 2.5 Admin

Manual Admin Creation

```json
{
  "email": "22010496@st.phenikaa-uni.edu.vn",
  "password": "admin123",
  "role": "ROLE_ADMIN"
}
```

Các endpoint CRUD cho users, fields, timeslots và báo cáo hệ thống.

* **GET/POST/PUT/DELETE** `/api/admin/users`
* **GET/POST/PUT/DELETE** `/api/admin/fields`

  ```json
  {
    "name": "Sân A",
    "type": "Bóng đá",
    "location": "Hà Đông",
    "pricePerHour": 100000,
    "openTime": "07:00",
    "closeTime": "22:00",
    "details": "Ngoài trời, 200m2"
  }
  ```
* **PATCH** `/api/admin/fields/{id}/status`

  ```json
  {
    "status": "ACTIVE | MAINTENANCE"
  }
  ```
* **GET** `/api/admin/reports?from=...&to=...&type=...&area=...`

  * Báo cáo theo ngày, loại sân, khu vực

---

## 3. Cài đặt môi trường

### 3.1 Backend

1. Cài Java 21, Maven.
2. Chạy:
   ```bash
   cd backend
   ./mvnw spring-boot:run
   ```
3. Mở `http://localhost:8080/` kiểm tra "Hello Spring Boot".

### 3.2 Frontend

1. Cài Node.js, npm.
2. Chạy:
   ```bash
   cd frontend
   npm install
   npx tailwindcss@3.4.17 init -p
   npm run dev
   ```
3. Mở `http://localhost:5173/` kiểm tra nút Tailwind.
