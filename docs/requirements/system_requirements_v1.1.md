# System Requirements (SR) – AI Chatbot với Google Gemini API

```text
Version : 1.1
Status  : Draft → To be Frozen
Date    : 29/01/2026
Owner   : BrSE Dang
Input   : Client Requirements v1.1
```

---

## 1. Mục tiêu tài liệu
Tài liệu System Requirements nhằm chuyển đổi Client Requirements thành các yêu cầu hệ thống rõ ràng, làm cơ sở cho thiết kế, phát triển và kiểm thử hệ thống AI Chatbot.

---

## 2. Phạm vi hệ thống

### 2.1 In Scope
- Chatbot UI nhúng trên website (popup widget).
- Tương tác với Google Gemini API.
- Hỗ trợ chat văn bản, upload ảnh (Vision), emoji picker.
- Hoạt động trên Desktop và Mobile browser.

### 2.2 Out of Scope
- Quản lý user chatbot (authentication/authorization).
- Lưu lịch sử chat trên server (server-side persistence).
- Dashboard quản trị và analytics.
- Moderation nâng cao, streaming response.
- Multi-AI provider support (v1 chỉ Gemini).

---

## 3. Actors

| Actor | Mô tả |
|------|------|
| End User | Người dùng website sử dụng chatbot |
| AI System (Gemini) | Hệ thống AI cung cấp phản hồi |
| Web System | Website nhúng chatbot |

---

## 4. Tổng quan hệ thống

### 4.1 Kiến trúc logic
End User → Chatbot UI → (Proxy API) → Google Gemini API

### 4.2 Nguyên tắc kiến trúc
- Tách UI và AI service.
- Không lộ API Key trên production.
- Có khả năng thay đổi model AI.

---

## 5. Yêu cầu chức năng hệ thống

**Danh sách yêu cầu chức năng:**

| ID     | Mô tả ngắn                      | Mô tả chi tiết                                   |
|--------|----------------------------------|--------------------------------------------------|
| SR-01  | Hiển thị chatbot widget         | Toggler góc phải dưới màn hình, cho phép mở/đóng popup chatbot                        |
| SR-02  | Giao diện chatbot               | Popup gồm Header, Body, Footer                      |
| SR-03  | Tin nhắn chào mừng              | Hiển thị tin nhắn bot mặc định khi mở lần đầu   |
| SR-04  | Gửi tin nhắn người dùng         | Hiển thị user-message khi gửi tin nhắn              |
| SR-05  | Gửi request tới AI              | Gửi text/image tới Gemini API                        |
| SR-06  | Hiển thị phản hồi AI            | Hiển thị bot-message với format markdown cơ bản |
| SR-07  | Upload ảnh                      | Chọn, preview, hủy ảnh trước khi gửi               |
| SR-08  | Vision request                  | Ảnh encode base64 gửi kèm prompt tới Gemini |
| SR-09  | Emoji picker                    | Chọn emoji và chèn vào textarea                      |
| SR-10  | Thinking indicator              | Hiển thị trạng thái “thinking” trong thời gian chờ AI  |
| SR-11  | Xử lý lỗi                       | Hiển thị lỗi API/network, không làm crash UI |
| SR-12  | Lưu lịch sử chat                | Lưu chat history vào localStorage để giữ khi refresh |
| SR-13  | Giới hạn upload ảnh             | Giới hạn 5MB, chỉ chấp nhận PNG/JPG/JPEG/WebP |
| SR-14  | Auto-detect ngôn ngữ            | Chatbot mặc định tiếng Anh, tự động phát hiện ngôn ngữ user |

---

## 6. Yêu cầu phi chức năng
### 6.1. Danh sách yêu cầu phi chức năng

| ID     | Mô tả ngắn                      | Mô tả chi tiết                                   |
|--------|----------------------------------|--------------------------------------------------|
| NFR-01 | Bảo mật                         | Bảo vệ API key, không lưu thông tin nhạy cảm trong localStorage |
| NFR-02 | Hiệu năng                       |  Thời gian phản hồi < 5 giây, UI mượt mà, lazy loading emoji picker |
| NFR-03 | Tương thích                     | Hỗ trợ các trình duyệt phổ biến trên desktop và mobile |
| NFR-04 | Giới hạn dữ liệu                | Giới hạn kích thước ảnh upload, dung lượng localStorage |
| NFR-05 | Khả năng mở rộng                | Cấu trúc code dễ dàng thay đổi model/provider | 


### 6.2. Chi tiết yêu cầu phi chức năng
**NFR-01: Bảo mật**
- **Phase 1**: API Key được lưu trong code (chỉ demo/development).
- **Phase 2 (future)**: Sử dụng proxy server hoặc serverless function để bảo vệ API key.
- Không lưu thông tin nhạy cảm trong localStorage.

**NFR-02: Hiệu năng**
- Thời gian phản hồi mục tiêu: < 5 giây cho câu hỏi ngắn.
- UI scroll mượt mà, không lag khi có nhiều tin nhắn.
- Lazy loading cho emoji picker.

**NFR-03: Tương thích**
- Desktop: Chrome, Edge, Safari (latest versions).
- Mobile: Chrome Android, Safari iOS (latest versions).
- Responsive: Full screen trên mobile, popup trên desktop.

**NFR-04: Giới hạn dữ liệu**
- Ảnh upload: ≤ 5MB.
- Format hỗ trợ: PNG, JPG/JPEG, WebP.
- Chat history trong localStorage: giới hạn theo browser (thường ~5-10MB).

**NFR-05: Khả năng mở rộng**
- Code structure cho phép thay đổi AI model/provider dễ dàng.
- Tách riêng UI components và API service layer.

---

## 7. Dữ liệu & Interface

### 7.1 Input Data
- **Text prompt**: String, UTF-8 encoded.
- **Image**: base64 encoded, kèm mimeType (image/png, image/jpeg, image/webp).
- **Chat history**: Array of messages (role: user/model, parts: text/inline_data).

### 7.2 Output Data
- **Text response**: String từ AI, có thể chứa markdown formatting.
- **Error messages**: String mô tả lỗi (API error, network error, quota exceeded).

### 7.3 Storage
- **localStorage**: 
  - Key: `chatHistory`
  - Value: JSON array of message objects
  - Lifetime: Persistent cho đến khi user clear browser data hoặc chatbot clear history

### 7.4 API Integration
- **Endpoint**: `https://generativelanguage.googleapis.com/v1/models/{model}:generateContent`
- **Model**: `gemini-2.0-flash`, `gemini-2.5-flash-lite` hoặc tương đương
- **Method**: POST
- **Headers**: Content-Type: application/json
- **Query params**: key={API_KEY}

---

## 8. Ràng buộc & Giả định

### 8.1 Assumptions (Giả định)
- Client cung cấp API Key hợp lệ có quyền truy cập Gemini API.
- Website cho phép nhúng JS/CSS và gọi external API.
- User browser hỗ trợ localStorage, FileReader API, và modern JavaScript (ES6+).
- Network connection ổn định cho API calls.

### 8.2 Constraints (Ràng buộc)

- **Gemini API quota**: Free tier có giới hạn requests/ngày và tokens.
- **Browser limitations**: localStorage có giới hạn dung lượng (~5-10MB).
- **Image size**: Gemini API có giới hạn request payload size.
- **Security**: Phase 1 không có proxy → API key exposed (chỉ dùng cho demo).

---

## 9. Traceability Matrix

| Client Req | System Req | Description |
|------------|------------|-------------|
| FR-01      | SR-01      | Toggler mở/đóng chatbot |
| FR-02      | SR-03      | Tin nhắn chào mừng |
| FR-03      | SR-04, SR-05, SR-06 | Gửi/nhận tin nhắn văn bản |
| FR-04      | SR-04      | Enter/Shift+Enter behavior |
| FR-05      | SR-02      | Tự động co giãn textarea |
| FR-06      | SR-07      | Upload ảnh + preview |
| FR-07      | SR-08      | Vision request với ảnh |
| FR-08      | SR-09      | Emoji picker |
| FR-09      | SR-10      | Thinking indicator |
| FR-10      | SR-11      | Error handling |
| OP-03      | SR-12      | LocalStorage history |
| OP-04      | SR-13      | Giới hạn ảnh 5MB, PNG/JPG/WebP |
| OP-02      | SR-14      | Auto-detect ngôn ngữ |

---

## 10. Open Points - Resolved

### OP-01: Proxy Server
**Quyết định**: Phase 1 không bắt buộc proxy (API key exposed), Phase 2 khuyến nghị dùng Node server hoặc serverless function.

### OP-02: Ngôn ngữ mặc định
**Quyết định**: Tiếng Anh, chatbot tự động phát hiện và phản hồi theo ngôn ngữ của user.

### OP-03: Giới hạn ảnh
**Quyết định**: ≤ 5MB, format PNG/JPG/JPEG/WebP.

### OP-04: Lưu trữ chat history
**Quyết định**: localStorage (client-side), không sync across devices.

## 11. Revision History
| Version | Date       | Description               | Author     |
|---------|------------|---------------------------|------------|
| 1.0     | 2026-01-29 | Initial draft version     | BrSE Dang  |
| 1.1     | 2026-01-29 | Updated based on CR v1.1, resolved open points, added localStorage, image limits, and language auto-detect | BrSE Dang  |