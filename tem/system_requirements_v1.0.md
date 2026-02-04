# System Requirements (SR) – AI Chatbot với Google Gemini API

```text
Version : 1.0
Status  : Draft → To be Frozen
Date    : 29/01/2026
Owner   : BrSE Dang
Input   : Client Requirements v1.0
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
- Quản lý user chatbot.
- Lưu lịch sử chat trên server.
- Dashboard quản trị.
- Moderation nâng cao, multi-AI provider.

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

Bảng tổng hợp yêu cầu chức năng:
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

---

## 6. Yêu cầu phi chức năng

- Bảo mật: API Key không lộ trên frontend.
- Hiệu năng: phản hồi < 5s.
- Tương thích: Chrome/Edge/Safari/Chrome mobile.
- Mở rộng: dễ thay đổi model/provider.

---

## 7. Dữ liệu & Interface

### Input
- Text prompt
- Image (base64 + mimeType)

### Output
- Text response

---

## 8. Ràng buộc & Giả định
- Gemini API có giới hạn quota.
- Client cung cấp API Key hợp lệ.

---

## 9. Traceability
Client Requirements v1.0 → System Requirements v1.0

---

## 10. Open Points
- Có bắt buộc proxy server ở v1? -> không bắt buộc, khuyến nghị.
- Ngôn ngữ mặc định chatbot? -> Tiếng Anh, có thể auto-detect.
- Giới hạn kích thước ảnh? -> đề xuất ≤ 5MB.

## 11. Revision History
| Version | Date       | Description               | Author     |
|---------|------------|---------------------------|------------|
| 1.0     | 2026-01-29 | Initial draft version     | BrSE Dang  |