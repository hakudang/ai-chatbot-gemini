# Use Case Specification

**AI Chatbot với Google Gemini API**

```text
Version : 1.0
Status  : Draft → To be Frozen
Date    : 29/01/2026
Owner   : BrSE Dang
Input   : System Requirements v1.1
```

---

## 1. Mục tiêu tài liệu
Tài liệu Use Case Specification mô tả chi tiết các kịch bản sử dụng hệ thống AI Chatbot từ góc nhìn người dùng, làm cơ sở cho thiết kế, phát triển và kiểm thử.

---

## 2. Actors

| Actor | Mô tả |
|------|------|
| End User | Người dùng website tương tác với chatbot |
| AI (Gemini)| Hệ thống AI xử lý và trả lời |
| System (Web System) | Website nhúng chatbot |

---

## 3. Danh sách Use Case

| UC-ID | Use Case Name |
|------|---------------|
| UC-01 | Mở / Đóng chatbot |
| UC-02 | Nhận tin nhắn chào mừng |
| UC-03 | Gửi câu hỏi văn bản |
| UC-04 | Gửi câu hỏi kèm ảnh (Vision) |
| UC-05 | Sử dụng emoji khi nhập câu hỏi |
| UC-06 | Hiển thị trạng thái “thinking” |
| UC-07 | Lưu và khôi phục lịch sử chat |
| UC-08 | Xử lý lỗi khi gọi AI |
| UC-09 | Giới hạn upload ảnh |
| UC-10 | Tự động phát hiện ngôn ngữ |

---

## 4. Use Case chi tiết

### UC-01: Mở / Đóng chatbot
**Actor chính**: End User  

**Pre-condition**
- Website đã load.
- Chatbot widget sẵn sàng.

**Post-condition**
- Chatbot popup mở hoặc đóng.

**Basic Flow**
1. User click chatbot toggler.
2. System mở popup chatbot.
3. User click lại toggler hoặc nút close.
4. System đóng popup.

**Trace**: SR-01, SR-02

---

### UC-02: Nhận tin nhắn chào mừng
**Actor chính**: End User  

**Pre-condition**
- Chatbot được mở lần đầu.

**Post-condition**
- Tin nhắn chào mừng hiển thị.

**Basic Flow**
1. User mở chatbot.
2. System kiểm tra lịch sử chat.
3. Nếu chưa có lịch sử → hiển thị message chào mừng.

**Trace**: SR-03

---

### UC-03: Gửi câu hỏi văn bản
**Actor chính**: End User  
**Actor phụ**: AI System  

**Pre-condition**
- Chatbot đang mở.
- User nhập text.

**Post-condition**
- Bot trả lời bằng text.

**Basic Flow**
1. User nhập câu hỏi.
2. User gửi (Enter hoặc nút gửi).
3. System hiển thị user-message.
4. System gửi request tới Gemini.
5. AI trả response.
6. System hiển thị bot-message.

**Exception**
- Input rỗng → không gửi.
- API lỗi → UC-08.

**Trace**: SR-04, SR-05, SR-06

---

### UC-04: Gửi câu hỏi kèm ảnh (Vision)
**Actor chính**: End User  
**Actor phụ**: AI System  

**Pre-condition**
- Chatbot mở.
- Ảnh hợp lệ đã được chọn.

**Post-condition**
- Bot trả lời theo nội dung ảnh.

**Basic Flow**
1. User chọn ảnh.
2. System preview ảnh.
3. User nhập câu hỏi (optional).
4. User gửi.
5. System encode ảnh + gửi prompt.
6. AI trả response.
7. System hiển thị bot-message.

**Trace**: SR-07, SR-08

---

### UC-05: Sử dụng emoji khi nhập câu hỏi
**Actor chính**: End User  

**Basic Flow**
1. User mở emoji picker.
2. Chọn emoji.
3. Emoji được chèn vào textarea.

**Trace**: SR-09

---

### UC-06: Hiển thị trạng thái “thinking”
**Actor chính**: End User  

**Basic Flow**
1. System gửi request AI.
2. System hiển thị thinking indicator.
3. Khi có kết quả hoặc lỗi → indicator biến mất.

**Trace**: SR-10

---

### UC-07: Lưu và khôi phục lịch sử chat
**Actor chính**: End User  

**Basic Flow**
1. System lưu chatHistory vào localStorage.
2. User refresh trang.
3. System load và hiển thị lịch sử chat.

**Trace**: SR-12

---

### UC-08: Xử lý lỗi khi gọi AI
**Actor chính**: End User  

**Basic Flow**
1. API/network lỗi xảy ra.
2. System hiển thị error message.
3. User tiếp tục chat.

**Trace**: SR-11

---

### UC-09: Giới hạn upload ảnh
**Actor chính**: End User  

**Basic Flow**
1. User chọn ảnh.
2. System kiểm tra size/format.
3. Nếu không hợp lệ → hiển thị lỗi.

**Trace**: SR-13

---

### UC-10: Tự động phát hiện ngôn ngữ
**Actor chính**: End User  
**Actor phụ**: AI System  

**Basic Flow**
1. User gửi câu hỏi.
2. AI phát hiện ngôn ngữ.
3. Bot trả lời cùng ngôn ngữ.

**Trace**: SR-14

---

## 5. Traceability Matrix

| System Requirement | Use Case |
|-------------------|----------|
| SR-01, SR-02 | UC-01 |
| SR-03 | UC-02 |
| SR-04, SR-05, SR-06 | UC-03 |
| SR-07, SR-08 | UC-04 |
| SR-09 | UC-05 |
| SR-10 | UC-06 |
| SR-12 | UC-07 |
| SR-11 | UC-08 |
| SR-13 | UC-09 |
| SR-14 | UC-10 |

---

## 6. Revision History

| Version | Date | Description | Author |
|-------|------|-------------|--------|
| 1.0 | 2026-01-29 | Initial version | BrSE Dang |
