# Client Requirements (CR) – AI Chatbot (Gemini)
```
Version: 1.0  
Owner: BrSE Dang
Status: Draft  
```

## 1. Mục tiêu (Purpose)
Xây dựng một chatbot AI nhúng trên website, cho phép người dùng đặt câu hỏi và nhận phản hồi nhanh bằng AI (Google Gemini).  
Chatbot hướng tới:
- Tăng mức độ tương tác trên website.
- Cung cấp hỗ trợ/tra cứu thông tin tức thời.
- Trải nghiệm mượt trên cả PC và thiết bị di động.

## 2. Bối cảnh & Stakeholders
### 2.1 Bối cảnh
Chatbot hiển thị dạng popup ở góc phải dưới trang (floating widget), có nút mở/đóng (toggler). Giao diện theo mẫu minh họa (header “Chatbot”, vùng hội thoại, thanh nhập).

### 2.2 Stakeholders
- **End User**: người dùng website sử dụng chatbot để hỏi/nhờ hỗ trợ.
- **Client/Product Owner**: quyết định nội dung/định hướng trợ lý.
- **BrSE/PM**: chốt scope, tiêu chí nghiệm thu, điều phối.
- **Dev/QA**: triển khai, kiểm thử, bàn giao.

## 3. Phạm vi (Scope)
### 3.1 In Scope (v1)
1) **Chat cơ bản**
- Người dùng nhập câu hỏi → chatbot trả lời dựa trên Gemini.
- Hiển thị tin nhắn theo dạng “bubble” (user/bot).

2) **Widget UI dạng Popup**
- Nút mở/đóng chatbot ở góc phải dưới.
- Popup gồm: Header + Body (message list) + Footer (form nhập).

3) **Emoji Picker**
- Cho phép chọn emoji và chèn vào vị trí con trỏ trong ô nhập.

4) **Upload ảnh (Image attachment)**
- Người dùng chọn ảnh từ thiết bị.
- Hiển thị preview ảnh trước khi gửi.
- Có nút hủy ảnh đã chọn.
- Khi gửi, ảnh được gửi kèm để AI trả lời theo ảnh (vision).

5) **Thinking indicator**
- Khi chờ phản hồi từ AI, hiển thị trạng thái “đang suy nghĩ” (3 chấm).

6) **Responsive**
- Trên mobile: popup full màn hình (100% width/height), header/footer cố định, body scroll.

7) **Error handling cơ bản**
- Hiển thị thông báo lỗi khi API lỗi, network lỗi, quota vượt giới hạn, key sai.

### 3.2 Out of Scope (v1)
- Đăng nhập, phân quyền người dùng chatbot.
- Lưu lịch sử chat lên server/multi-device sync.
- Streaming token (chữ chạy từng ký tự).
- Dashboard quản trị, analytics, moderation/guardrails nâng cao.
- Hỗ trợ nhiều model/provider (OpenAI, Claude…).

## 4. Yêu cầu chức năng (Functional Requirements)
### FR-01: Toggler (Mở/Đóng chatbot)
- Có nút floating để mở chatbot.
- Khi mở: popup hiển thị, icon chuyển trạng thái.
- Khi đóng: popup ẩn, quay về trạng thái ban đầu.

**Acceptance (nghiệm thu)**: thao tác mở/đóng hoạt động ổn định trên Chrome/Safari mobile.

---

### FR-02: Hiển thị lời chào mặc định
- Khi lần đầu mở chatbot, hiển thị 1 tin nhắn bot chào mừng (ví dụ: “Hey there. How can I help you today?”).

**Acceptance (nghiệm thu)**: message mặc định hiển thị đúng layout bot-message.

---

### FR-03: Gửi tin nhắn văn bản
- Người dùng nhập text và bấm nút gửi.
- Tạo message user-message trong chat body.
- Gửi request tới Gemini và nhận response.
- Tạo message bot-message trả lời.

**Acceptance (nghiệm thu)**:  
- Nếu input rỗng → không gửi.  
- Sau khi gửi, input được clear.

---

### FR-04: Enter/Shift+Enter
- **Desktop**: Enter gửi; Shift+Enter xuống dòng.
- **Mobile**: hành vi theo thiết bị, ưu tiên không gây gửi nhầm (có thể chỉ gửi bằng nút).

**Acceptance (nghiệm thu)**: không gửi nhầm khi người dùng muốn xuống dòng.

---

### FR-05: Tự động co giãn ô nhập
- Textarea tự tăng chiều cao theo nội dung (tới ngưỡng max), và form bo góc thay đổi theo thiết kế.

**Acceptance (nghiệm thu)**: UI không vỡ layout, vẫn dùng được trên mobile.

---

### FR-06: Upload ảnh + Preview
- Người dùng bấm icon đính kèm → mở file picker.
- Chỉ nhận `image/*`.
- Hiển thị preview thumbnail trong khu vực upload.
- Có nút hủy đính kèm.

**Acceptance (nghiệm thu)**:  
- Hủy ảnh → preview biến mất, ảnh không gửi.  
- Ảnh gửi kèm hiển thị trong message user (attachment).

---

### FR-07: Gửi ảnh kèm prompt (Vision)
- Khi user gửi tin nhắn có ảnh, request tới Gemini phải bao gồm cả text + ảnh (base64).
- Bot trả lời theo nội dung ảnh.

**Acceptance (nghiệm thu)**: cùng 1 ảnh + câu hỏi đơn giản, bot phản hồi đúng ngữ cảnh ảnh (mức “hợp lý”).

---

### FR-08: Emoji picker
- Bấm icon emoji → hiển thị panel chọn emoji.
- Chọn emoji → chèn vào vị trí con trỏ trong textarea.
- Click ngoài vùng panel → đóng panel.

**Acceptance (nghiệm thu)**: emoji chèn đúng vị trí, không mất focus dài.

---

### FR-09: Thinking indicator
- Khi request đang chạy: hiển thị “thinking message”.
- Khi có kết quả: thay nội dung thinking bằng câu trả lời hoặc xóa thinking.

**Acceptance (nghiệm thu)**: không để lại bubble “thinking” vĩnh viễn khi lỗi.

---

### FR-10: Xử lý lỗi hiển thị cho người dùng
- Khi API lỗi: hiển thị message bot màu đỏ hoặc format cảnh báo.
- Log lỗi ở console để debug.

**Acceptance (nghiệm thu)**: lỗi không làm crash UI, user vẫn tiếp tục chat được.

---

## 5. Yêu cầu phi chức năng (Non-Functional Requirements)

### NFR-01: Bảo mật API Key
- **Không để lộ API key trên frontend** khi triển khai thực tế.
- Khuyến nghị dùng **server proxy** (Node/Cloud Function) để gọi Gemini.

### NFR-02: Hiệu năng
- Thời gian phản hồi mục tiêu: < 5 giây cho câu hỏi ngắn (tùy network & model).
- UI scroll mượt, không giật lag khi nhiều tin nhắn.

### NFR-03: Tương thích trình duyệt
- Desktop: Chrome/Edge (latest).
- Mobile: Safari iOS / Chrome Android (latest).

### NFR-04: Giới hạn tải ảnh
- Khuyến nghị giới hạn dung lượng ảnh (ví dụ ≤ 5MB) để tránh lỗi request.

### NFR-05: Khả năng mở rộng
- Thiết kế code tách phần UI và phần gọi API (service layer) để dễ thay provider/model.

---

## 6. Dữ liệu & API (High-level)
### 6.1 Input
- Text prompt từ user.
- Ảnh đính kèm (base64 + mimeType).

### 6.2 Output
- Text response từ AI.

### 6.3 Lưu trữ
- v1: lưu tạm trên RAM (chatHistory trong JS).  
- (tùy chọn) v1.1: localStorage để giữ lịch sử khi refresh.

---

## 7. Giả định & Ràng buộc
### Assumptions
- Client cung cấp API key và quyền sử dụng Gemini.
- Website cho phép nhúng JS/CSS và gọi API (hoặc có backend proxy).

### Constraints
- Nếu không dùng proxy, API key sẽ lộ khi deploy public (chỉ dùng cho demo local).
- Gemini quota/free tier có thể bị giới hạn theo thời điểm.

---

## 8. Tiêu chí nghiệm thu (Acceptance Criteria)
1) Mở/đóng chatbot hoạt động đúng trên desktop & mobile.  
2) Gửi text → bot trả lời.  
3) Gửi ảnh (có/không kèm text) → bot trả lời có liên quan.  
4) Emoji picker hoạt động, chèn emoji đúng vị trí.  
5) Thinking indicator hiển thị khi chờ và biến mất sau khi có kết quả.  
6) Khi lỗi API/network → hiển thị lỗi rõ ràng, không crash.  
7) Responsive: mobile full screen, không che input, chat scroll ok.

---

## 9. Open Points (cần chốt để vào thiết kế chi tiết)
- OP-01: Bot persona & phạm vi tri thức (chỉ FAQ của site hay “hỏi gì cũng được”?)  
- OP-02: Ngôn ngữ mặc định (VI/EN/JP) và có auto-detect không?  
- OP-03: Có cần lưu lịch sử chat (localStorage/server) không?  
- OP-04: Giới hạn ảnh (kích thước/dung lượng) và format hỗ trợ cụ thể (png/jpg/webp).  
- OP-05: Cách deploy proxy (Node server riêng, Cloud Functions, hoặc Vercel/Netlify serverless).  

## 10. Next Steps

- ✳️ Viết System Requirements v1.0
- ✳️ Chuẩn hóa Business Rules + Use Case

## 11. Revision History
| Version | Date       | Description               | Author  |
|---------|------------|---------------------------|---------|
| 1.0     | 2026-01-29 | Initial draft version     | BrSE Dang   |