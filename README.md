# AI Chatbot với Google Gemini API

```text
version: 1.0
status : Draft → To be Frozen
Date : 29/01/2026
```
## 1. Giới thiệu dự án
Chatbot đang trở thành một kênh tương tác quan trọng giúp người dùng tiếp cận thông tin và dịch vụ nhanh chóng, trực quan và thuận tiện hơn so với các hình thức truyền thống.

Dự án AI Chatbot với Google Gemini API nhằm xây dựng một chatbot nhúng (embedded widget) trên website, cho phép:

- Người dùng đặt câu hỏi và nhận phản hồi tức thời từ AI.
- Tăng mức độ tương tác và thời gian ở lại trang.
- Hỗ trợ nội dung, tư vấn dịch vụ, hoặc giải trí cơ bản.

Ứng dụng được phát triển bằng HTML, CSS, JavaScript, tích hợp Google Gemini API (free tier), hỗ trợ:

- Chat văn bản
- Upload ảnh (Vision)
- Emoji picker
- Giao diện responsive cho Desktop & Mobile

## 2. Đối tượng sử dụng
- Người dùng cuối (End User)
  - Người dùng phổ thông
  - Học sinh / sinh viên
  - Nhân viên văn phòng

- Ngữ cảnh sử dụng
  - Truy cập website trên Web hoặc Mobile
  - Thực hiện hỏi–đáp nhanh với AI để:
    - Tìm hiểu dịch vụ
    - Hỏi thông tin tổng quát
    - Tăng tính tương tác, trải nghiệm người dùng
  
## 3. Các tính năng chính
### 3.1 Chat văn bản với AI

- Người dùng nhập câu hỏi → chatbot trả lời bằng Google Gemini.
- Hiển thị hội thoại dạng bubble (User / Bot).

### 3.2 Widget chatbot dạng popup

- Nút mở/đóng (toggler) ở góc phải dưới màn hình.
- Popup gồm:
  - Header (tiêu đề chatbot)
  - Body (lịch sử hội thoại)
  - Footer (ô nhập + control)

### 3.3 Upload ảnh (Vision)

- Người dùng có thể:
  - Đính kèm ảnh từ thiết bị
  - Xem preview ảnh trước khi gửi
  - Hủy ảnh đã chọn
- Ảnh được gửi kèm prompt để AI phân tích nội dung ảnh.

### 3.4 Emoji picker

- Chọn emoji từ bảng emoji.
- Emoji được chèn đúng vị trí con trỏ trong textarea.

### 3.5 Thinking indicator

- Khi chờ phản hồi từ AI, chatbot hiển thị trạng thái “đang suy nghĩ”.
- Trạng thái này tự động biến mất khi có kết quả hoặc lỗi.

### 3.6 Responsive UI

- Desktop: popup kích thước cố định.
- Mobile: chatbot hiển thị full màn hình, không che nội dung nhập.
## 4. Quy tắc nghiệp vụ & Logic tính toán (Business Rules)
- BR-01: Không gửi tin nhắn khi input rỗng (không text và không ảnh).

- BR-02: Khi gửi ảnh:
  - Ảnh phải là image/*
  - Dữ liệu ảnh được encode base64 trước khi gửi API.

- BR-03: Mỗi lần gửi tạo đúng 1 user-message và 1 bot-message.

- BR-04: Thinking indicator phải được xóa khi:
  - Có phản hồi AI
  - Hoặc xảy ra lỗi API.

- BR-05: Sau khi gửi tin nhắn, trạng thái upload ảnh phải được reset.

## 5. Đặc tính kỹ thuật
### 5.1 Frontend

- HTML5
- CSS3 (responsive, animation)
- JavaScript (Vanilla JS)

### 5.2 AI / API

- Google Gemini API (gemini-1.5-flash)
- Gửi request theo schema:
  - Text prompt
  - Ảnh (base64 + mimeType)

### 5.3 Kiến trúc khuyến nghị

- Demo: Frontend gọi trực tiếp Gemini API (chỉ dùng local).
- Triển khai thực tế:
  - Frontend → Backend proxy (Node.js / Serverless)
  - Backend giữ API Key, gọi Gemini API.

### 5.4 Phi chức năng

- Không để lộ API Key trên môi trường production.
- Thời gian phản hồi mục tiêu: < 5 giây (mạng bình thường).
- Tương thích:
  - Chrome / Edge (desktop)
  - Safari iOS / Chrome Android (mobile)

## 6. Phạm vi ngoài (Out of Scope)

- Đăng nhập / quản lý người dùng chatbot
- Lưu lịch sử chat trên server
- Streaming token (hiển thị chữ chạy)
- Dashboard quản trị
- Moderation, filter nội dung nâng cao
- Multi-language auto-detect (ngoài cấu hình mặc định)

## 7. Cấu trúc tài liệu dự án
Dự án được quản lý chặt chẽ thông qua hệ thống tài liệu có tính truy vết cao (Traceability):
- Mục đích (Goal): Client Requirements → System Requirements.
- Logic: Business Rules → Use Case Specification.
- Xác thực (Validation): Validation Specification → Test Case Specification.

### Ý nghĩa từng loại tài liệu:
- Tài liệu Client Requirements và System Requirements là quan trọng nhất để làm rõ yêu cầu khách hàng và chuyển giao cho team phát triển.
- Tài liệu Business Rules và Use Case Specification giúp định nghĩa chi tiết các quy tắc nghiệp vụ và kịch bản sử dụng.
- Tài liệu Validation Specification và Test Case Specification đảm bảo hệ thống được kiểm thử đầy đủ theo yêu cầu đã định nghĩa.

### Vai trò BrSE - Các tài liệu phụ trách:
- Các tài liệu BrSE phụ trách soạn thảo và duy trì bao gồm:
  - Client Requirements
  - System Requirements
  - Business Rules
  - Use Case Specification 
  
## 8. Tổ chức cây thư mục
```text
/ ai-chatbot-gemini
  / docs
    / requirements
      - client_requirements_v1.0.md
      - system_requirements_v1.0.md
    / design
      - business_rule_v1.0.md
      - usecase_spec_v1.0.md
      - validation_spec_v1.0.md
      - testcase_spec_v1.0.md
      - sc-01.png
  / src
    / components
    / styles
    - index.html
    - app.js
    - styles.css
  / tests
    - unit_tests.js
    - integration_tests.js
  - README.md
  - .gitignore
```