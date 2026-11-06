# KEEPBOX – Smart Storage Service (Nền tảng Lưu trữ Thông minh)

> **Slogan:** *“Giải phóng không gian – An tâm lưu trữ.”*

Dự án mẫu (Prototype) hoàn chỉnh cho cuộc thi Khởi nghiệp – Nền tảng dịch vụ lưu trữ ngắn hạn dành cho sinh viên, người thuê trọ, nhân viên văn phòng tại TP. Hồ Chí Minh.

---

## 🚀 Hướng Dẫn Khởi Chạy Dự Án

```bash
cd c:\khoinghiep\keepbox
npm run dev
```

Mở trình duyệt truy cập: `http://localhost:5173`

---

## 🔑 Tài Khoản Demo Sẵn Có

| Vai trò | Email đăng nhập | Mật khẩu | Phạm vi quyền hạn |
| :--- | :--- | :--- | :--- |
| **Quản trị viên (Admin)** | `admin@keepbox.vn` | `admin123` | Quản trị toàn hệ thống `/admin`: Đơn hàng, Kho, Logistics, Thanh toán, Bảng giá, Thống kê, Phản hồi |
| **Khách hàng 1** | `nguyen.thi.lan@gmail.com` | `123456` | Khách hàng Nguyễn Thị Lan: Đơn hàng, thùng đồ cá nhân, lịch giao nhận |
| **Khách hàng 2** | `tran.minh.duc@gmail.com` | `123456` | Khách hàng Trần Minh Đức |
| **Khách hàng mới** | *Đăng ký tự do* | *Tùy chọn* | Tạo tài khoản mới trực tiếp trên trang `/register` |

---

## 📦 Kiến Trúc & Các Tính Năng Đã Xây Dựng

### 1. Website Khách Hàng (Public Customer Portal)
* **Trang chủ (`/`):** Hero section, 3 lợi ích cốt lõi, quy trình 4 bước, bảng gói lưu trữ nổi bật, đánh giá thực tế (testimonials), FAQ, CTA và Footer đầy đủ liên kết.
* **Dịch vụ & Bảng giá (`/services`):**
  * 4 gói dịch vụ: **MINI** (49k/tháng), **BASIC** (129k/tháng), **STANDARD** (199k/tháng), **PLUS** (349k/tháng).
  * Chu kỳ thanh toán linh hoạt 1 tháng, 3 tháng (-5%), 6 tháng (-12%).
  * Bảng so sánh tính năng chi tiết giữa các gói.
  * Danh mục dịch vụ bổ sung: Lấy hàng tận nơi, Giao tận nhà, Đóng gói.
* **Đăng ký lưu trữ đa bước (`/booking`):**
  * **Bước 1:** Chọn gói dịch vụ.
  * **Bước 2:** Nhập thông tin khách hàng (họ tên, SĐT, địa chỉ, quận, chọn kho).
  * **Bước 3:** Chi tiết lưu trữ (số thùng, loại đồ vật, thời hạn, ngày gửi).
  * **Bước 4:** Chọn hình thức vận chuyển vào kho & nhận lại đồ.
  * **Bước 5:** Tổng hợp chi phí, xác nhận đặt lịch.
  * Màn hình thành công tự động sinh mã đơn hàng `KB-2024-xxxx` và nút sao chép mã.
* **Theo dõi đơn & đồ đạc (`/tracking`):**
  * Tra cứu theo mã đơn hàng hoặc mã thùng.
  * Hiển thị dòng thời gian trạng thái (Timeline 7 bước).
  * Danh sách thùng đồ kèm vị trí kho.
* **Hỗ trợ khách hàng (`/support`):** Form gửi thắc mắc / khiếu nại, FAQ dạng accordion, Demo widget Chatbox tương tác thời gian thực.
* **Xác thực (`/login`, `/register`):** Hỗ trợ đăng nhập vai trò Admin / Khách hàng, tạo tài khoản mới.

### 2. Trang Cá Nhân Khách Hàng (`/account`)
* **Tổng quan (`/account`):** Thống kê đơn đang hoạt động, thùng đang lưu, lịch giao nhận sắp tới, tổng chi tiêu.
* **Đồ lưu trữ (`/account/storage`):** Chi tiết từng thùng, mã vị trí kho (Khu A1, B1...), ngày nhập, hạn trả.
* **Lịch sử đơn hàng (`/account/orders`):** Danh sách tất cả đơn, gói đã đặt, trạng thái và tổng tiền.
* **Lịch giao nhận (`/account/delivery`):** Quản lý các yêu cầu nhân viên lấy hàng & giao trả hàng tận nơi.
* **Thông báo (`/account/notifications`):** Thông báo real-time khi Admin duyệt đơn, cập nhật trạng thái kho.
* **Cài đặt tài khoản (`/account/settings`):** Sửa thông tin cá nhân, địa chỉ, đổi mật khẩu demo.

### 3. Admin Dashboard (`/admin`)
* **Tổng quan Dashboard (`/admin`):**
  * 6 chỉ số KPI then chốt (Khách hàng, Đơn hàng, Thùng đang lưu, Doanh thu, Chờ lấy/giao).
  * Biểu đồ Doanh thu (Area Chart) và Đơn hàng (Bar Chart) theo tháng bằng **Recharts**.
  * Biểu đồ phân bổ tỷ lệ các gói lưu trữ (Donut Chart).
  * Thước đo công suất lấp đầy kho hàng theo từng khu vực.
  * Bảng đơn hàng và khách hàng mới đăng ký gần nhất.
* **Quản lý khách hàng (`/admin/customers`):** Tìm kiếm theo tên/SĐT/email, lọc trạng thái, xem hồ sơ & lịch sử đơn hàng, chỉnh sửa thông tin, khoá/mở khoá tài khoản.
* **Quản lý đơn hàng (`/admin/orders`):** Tìm kiếm, lọc theo trạng thái, xem chi tiết đơn, duyệt đơn hàng, hủy đơn, cập nhật tiến trình trạng thái (`Chờ xác nhận` ➔ `Đã xác nhận` ➔ `Đang lấy hàng` ➔ `Đã nhập kho` ➔ `Đang lưu trữ` ➔ `Đang giao trả` ➔ `Hoàn tất`).
* **Quản lý kho trực quan (`/admin/warehouse`):** Sơ đồ khu vực lưu trữ (Khu A1, A2, B1, B2, C1), danh sách 50 thùng đồ chi tiết, tạo thẻ thùng mới, gán vị trí kho, mã QR.
* **Quản lý giao nhận (`/admin/logistics`):** Theo dõi danh sách yêu cầu lấy hàng và giao trả hàng, phân công nhân viên phụ trách (`Nguyễn Thế Anh`, `Trần Đình Khoa`, v.v.).
* **Quản lý thanh toán (`/admin/payments`):** Thống kê giao dịch (Chuyển khoản, Tiền mặt, QR), cập nhật trạng thái thủ công (Đã thanh toán / Thất bại / Hoàn tiền).
* **Quản lý bảng giá (`/admin/pricing`):** Sửa giá, giới hạn số thùng, ẩn/hiện gói dịch vụ, cấu hình phí dịch vụ bổ sung.
* **Báo cáo & Phân tích (`/admin/reports`):** Thống kê doanh thu theo gói, tỷ lệ đơn hàng theo trạng thái, tính năng **Xuất dữ liệu báo cáo ra file CSV**.
* **Quản lý phản hồi (`/admin/feedback`):** Đọc góp ý / khiếu nại, chuyển trạng thái đang xem xét, trả lời trực tiếp cho khách hàng.
* **Cài đặt hệ thống (`/admin/settings`):** Cấu hình thông tin kho trung tâm, cấu hình nhận thông báo, đổi mật khẩu.

### 4. Dữ Liệu Demo Chuẩn Tiếng Việt
* **20 Khách hàng** với đầy đủ tên tiếng Việt, số điện thoại, địa chỉ các quận tại TP.HCM.
* **30 Đơn đặt lịch** đa dạng tình trạng thực tế.
* **50 Thùng lưu trữ** chi tiết nội dung, ngày nhập kho, hạn trả.
* **10 Yêu cầu lấy hàng** & **10 Yêu cầu giao hàng**.
* **20 Giao dịch thanh toán** mẫu.
* **10 Phản hồi & khiếu nại** mẫu.

---

## 🛠️ Công Nghệ Sử Dụng
* **Frontend:** React 19 + TypeScript + Vite 8
* **Styling:** Tailwind CSS v4 (Hệ màu Deep Navy Blue `#1e3a5f`, Sky Blue `#0ea5e9`, Soft Orange `#f97316`)
* **State Management:** Zustand (Đồng bộ dữ liệu thời gian thực 2 chiều giữa Customer & Admin)
* **Routing:** React Router DOM v7
* **Biểu đồ:** Recharts
* **Icons:** Lucide React
* **Thông báo:** Toast notification custom provider
