# Business Rules (BR) – AI Chatbot với Google Gemini API

```text
Version : 1.0
Status  : Draft → To be Frozen
Date    : 29/01/2026
Owner   : BrSE Dang
Input   : System Requirements v1.1, Use Case Spec v1.0
```

---

## 1. Mục tiêu
Tài liệu Business Rules định nghĩa các quy tắc nghiệp vụ (ràng buộc, điều kiện, giới hạn, hành vi hệ thống) để thống nhất cách hiểu giữa BrSE/Dev/QA và làm chuẩn cho thiết kế – triển khai – kiểm thử.

---

## 2. Phạm vi áp dụng
Các rule trong tài liệu này áp dụng cho các use case:
- UC-01 Mở/Đóng chatbot
- UC-02 Tin nhắn chào mừng
- UC-03 Gửi câu hỏi văn bản
- UC-04 Gửi câu hỏi kèm ảnh (Vision)
- UC-05 Emoji picker
- UC-06 Thinking indicator
- UC-07 Lưu/khôi phục lịch sử chat
- UC-08 Xử lý lỗi
- UC-09 Giới hạn upload ảnh
- UC-10 Auto-detect ngôn ngữ

---

## 3. Định nghĩa / Thuật ngữ
- **Message**: một phần tử hội thoại hiển thị trong chat body (user-message hoặc bot-message).
- **Chat history**: danh sách message dùng để hiển thị UI và (tuỳ triển khai) gửi làm ngữ cảnh cho AI.
- **Thinking indicator**: bubble bot hiển thị trạng thái đang xử lý (3 chấm).
- **Attachment**: ảnh người dùng đính kèm trong tin nhắn.
- **Proxy API**: server/proxy giữ API key khi triển khai production.

---

## 4. Business Rules
Bảng tổng hợp Business Rules:
| BR-ID     | Đối tượng | Mô tả ngắn                      | Áp dụng cho Use Case | Trace đến System Req |
|--------|-----------|-----------------------|----------------------|----------------------|
| BR-UI-01 | UI/Trạng thái Chatbot | Trạng thái chatbot (Open/Close) | UC-01               | SR-01, SR-02         |
| BR-UI-02 | UI/Trạng thái Chatbot | Auto-scroll | UC-03/04/06/08      | SR-02                 |
| BR-UI-03 | UI/Trạng thái Chatbot | One request → one bot response bubble | UC-03/04/06/08      | SR-04, SR-10, SR-11  |
| BR-IN-01 | Input/Gửi tin nhắn | Điều kiện được phép gửi (Send condition) | UC-03/04            | SR-04, SR-07, SR-08  |
| BR-IN-02 | Input/Gửi tin nhắn | Hành vi Enter/Shift+Enter | UC-03               | SR-04                 |
| BR-IN-03 | Input/Gửi tin nhắn | Reset input sau khi gửi  | UC-03/04            | SR-04, SR-05        |
| BR-FILE-01 | Attachment (Upload ảnh) | Định dạng & dung lượng ảnh hợp lệ | UC-09               | SR-13                 |
| BR-FILE-02 | Attachment (Upload ảnh) | Giới hạn dung lượng ảnh | UC-09               | SR-13                 |
| BR-FILE-03 | Attachment (Upload ảnh) | Preview ảnh | UC-04               | SR-07                 |
| BR-FILE-04 | Attachment (Upload ảnh) | Cancel ảnh | UC-04               | SR-07                 |
| BR-FILE-05 | Encode ảnh | UC-04 | SR-08 |
| BR-FILE-06 | Attachment (Upload ảnh) | Reset ảnh sau khi submit | UC-04               | SR-07, SR-08         |
| BR-AI-01 | AI Request/Response | Nội dung gửi AI (parts) | UC-03/04            | SR-05, SR-08         |
| BR-AI-02 | AI Request/Response | Chat history làm ngữ cảnh | UC-03/04/07         | SR-05, SR-12         |
| BR-AI-03 | AI Request/Response | Auto-detect ngôn ngữ | UC-10 | SR-14 |
| BR-AI-04 | AI Request/Response | Làm sạch format hiển thị | UC-03/04            | SR-06                 |
| BR-TH-01 | Thinking indicator | Khi nào hiển thị thinking | UC-06               | SR-10                 |
| BR-TH-02 | Thinking indicator | Thinking phải kết thúc | UC-06/08 | SR-10, SR-11 |
| BR-TH-03 | Thinking indicator | Không được để “kẹt thinking” | UC-06/08 | SR-10, SR-11 |
| BR-LS-01 | Lưu lịch sử (localStorage) | Key và format lưu trữ | UC-07               | SR-12                 |
| BR-LS-02 | Lưu lịch sử (localStorage) | Khi nào lưu | UC-07               | SR-12                 |
| BR-LS-03 | Lưu lịch sử (localStorage) | Khôi phục lịch sử | UC-07               | SR-12                 |
| BR-LS-04 | Lưu lịch sử (localStorage) | Giới hạn dung lượng | UC-07               | SR-12, NFR-04         |
| BR-LS-05 | Lưu lịch sử (localStorage) | Không lưu dữ liệu nhạy cảm | UC-07               | NFR-01                |
| BR-ERR-01 | Error handling | Các loại lỗi cần xử lý | UC-08 | SR-11 |
| BR-ERR-02 | Error handling | Nội dung hiển thị lỗi | UC-08 | SR-11 |
| BR-ERR-03 | Error handling | Xử lý lỗi timeout | UC-08 | SR-11 |

---

### 4.1 Rules về UI/Trạng thái Chatbot

#### BR-UI-01: Trạng thái chatbot (Open/Close)
- Chatbot có 2 trạng thái: `CLOSED` và `OPEN`.
- Click toggler sẽ đảo trạng thái: `CLOSED ↔ OPEN`.
- Click nút close trong header chỉ thực hiện `OPEN → CLOSED`.
- Đóng chatbot không được xoá lịch sử chat trên UI.

**Applies to**: UC-01  
**Trace**: SR-01, SR-02

---

#### BR-UI-02: Auto-scroll
- Sau khi thêm message mới (user hoặc bot), chat body phải scroll xuống cuối.
- Khi user đang scroll lên xem lịch sử, hệ thống có thể:
  - (v1) vẫn auto-scroll xuống cuối sau response, hoặc
  - (future) chỉ hiển thị nút “Jump to latest”.

**Applies to**: UC-03, UC-04, UC-06, UC-08  
**Trace**: SR-02

---

#### BR-UI-03: One request → one bot response bubble
- Mỗi lần user gửi (submit) tạo đúng:
  - 01 user-message
  - 01 bot-message (ban đầu là thinking, sau đó thay bằng response hoặc error)

**Applies to**: UC-03, UC-04, UC-06, UC-08  
**Trace**: SR-04, SR-10, SR-11

---

### 4.2 Rules về Input/Gửi tin nhắn

#### BR-IN-01: Điều kiện được phép gửi (Send condition)
- Không gửi request nếu:
  - Text rỗng **và** không có ảnh đính kèm.
- Được phép gửi nếu:
  - Có text (không rỗng), hoặc
  - Có ảnh (image-only), hoặc
  - Có cả text + ảnh.

**Applies to**: UC-03, UC-04  
**Trace**: SR-04, SR-05, SR-07, SR-08

---

#### BR-IN-02: Hành vi Enter/Shift+Enter
- Desktop:
  - `Enter` = gửi tin nhắn (khi đủ điều kiện BR-IN-01).
  - `Shift+Enter` = xuống dòng (không gửi).
- Mobile:
  - Không bắt buộc Enter để gửi (ưu tiên gửi bằng nút), tránh gửi nhầm.

**Applies to**: UC-03  
**Trace**: SR-04

---

#### BR-IN-03: Reset input sau khi gửi
- Sau submit thành công (tạo user-message), textarea phải:
  - Clear nội dung
  - Reset chiều cao về mặc định
- Nếu có attachment: xử lý theo BR-FILE-06.

**Applies to**: UC-03, UC-04  
**Trace**: SR-04, SR-05

---

### 4.3 Rules về Attachment (Upload ảnh)

#### BR-FILE-01: Định dạng ảnh hợp lệ
Chỉ chấp nhận các định dạng:
- `image/png`
- `image/jpeg` (bao gồm jpg/jpeg)
- `image/webp`

**Applies to**: UC-09  
**Trace**: SR-13

---

#### BR-FILE-02: Giới hạn dung lượng ảnh
- Dung lượng ảnh phải ≤ **5MB**.
- Nếu vượt giới hạn: reject ngay tại client, không gọi AI.

**Applies to**: UC-09  
**Trace**: SR-13

---

#### BR-FILE-03: Preview ảnh
- Khi chọn ảnh hợp lệ:
  - UI hiển thị preview thumbnail
  - Trạng thái file-uploaded = true
- Preview không được tự động gửi; chỉ gửi khi user submit.

**Applies to**: UC-04  
**Trace**: SR-07

---

#### BR-FILE-04: Cancel ảnh
- Khi user bấm cancel:
  - Xoá preview
  - Xoá dữ liệu base64 và mimeType trong bộ nhớ
  - Trạng thái file-uploaded = false

**Applies to**: UC-04  
**Trace**: SR-07

---

#### BR-FILE-05: Encode ảnh
- Ảnh phải được encode base64 (không kèm prefix `data:...;base64,` trong payload gửi AI).
- Payload gửi AI phải gồm `data` (base64 string) và `mimeType`.

**Applies to**: UC-04  
**Trace**: SR-08

---

#### BR-FILE-06: Reset ảnh sau khi submit
- Sau khi user submit:
  - Attachment phải reset (để tránh gửi nhầm lần sau).
  - UI xoá preview và trạng thái file-uploaded.

**Applies to**: UC-04  
**Trace**: SR-07, SR-08

---

### 4.4 Rules về AI Request/Response

#### BR-AI-01: Nội dung gửi AI (parts)
- Gửi text bằng `{ text: <string> }`
- Nếu có ảnh, thêm `{ inlineData: { data: <base64>, mimeType: <mime> } }`
- Thứ tự parts: text trước, ảnh sau (ưu tiên readability).

**Applies to**: UC-03, UC-04  
**Trace**: SR-05, SR-08

---

#### BR-AI-02: Chat history làm ngữ cảnh
- v1: lưu chatHistory ở client để:
  - Hiển thị UI
  - (tuỳ triển khai) gửi toàn bộ lịch sử làm context cho AI
- Nếu gửi context:
  - Role dùng: `user`, `model`
  - Không gửi thinking bubble vào context.

**Applies to**: UC-03, UC-04, UC-07  
**Trace**: SR-05, SR-12

---

#### BR-AI-03: Auto-detect ngôn ngữ
- Bot mặc định tiếng Anh.
- Khi user gửi message bằng ngôn ngữ khác (VI/JP…):
  - AI được kỳ vọng phản hồi cùng ngôn ngữ.
- (Optional) Có thể bổ sung system instruction trong prompt để “reply in user's language”.

**Applies to**: UC-10  
**Trace**: SR-14

---

#### BR-AI-04: Làm sạch format hiển thị
- Response có thể chứa markdown.
- v1 chỉ cần xử lý cơ bản:
  - Bỏ `**bold**` → `bold`
  - Giữ xuống dòng

**Applies to**: UC-03, UC-04  
**Trace**: SR-06

---

### 4.5 Rules về Thinking indicator

#### BR-TH-01: Khi nào hiển thị thinking
- Sau khi user submit và trước khi có response, system phải tạo bot bubble dạng thinking.

**Applies to**: UC-06  
**Trace**: SR-10

---

#### BR-TH-02: Thinking phải kết thúc
Thinking bubble phải bị xoá/replace trong mọi trường hợp:
- AI trả lời thành công → replace bằng text response
- AI trả lỗi / network lỗi → replace bằng error message

**Applies to**: UC-06, UC-08  
**Trace**: SR-10, SR-11

---

#### BR-TH-03: Không được để “kẹt thinking”
- Không được tồn tại thinking bubble quá lâu.
- (v1 khuyến nghị) Timeout 20–30 giây:
  - nếu quá timeout → hiển thị lỗi “Request timeout”.

**Applies to**: UC-06, UC-08  
**Trace**: SR-10, SR-11

---

### 4.6 Rules về Lưu lịch sử (localStorage)

#### BR-LS-01: Key và format lưu trữ
- localStorage key: `chatHistory`
- value: JSON array, mỗi phần tử gồm tối thiểu:
  - role: `user` | `model`
  - text: string
  - (optional) attachment: { mimeType, data } hoặc URL preview (tuỳ design)

**Applies to**: UC-07  
**Trace**: SR-12

---

#### BR-LS-02: Khi nào lưu
- Lưu sau mỗi message được append thành công:
  - Sau user-message
  - Sau bot-message (response hoặc error)

**Applies to**: UC-07  
**Trace**: SR-12

---

#### BR-LS-03: Khôi phục lịch sử
- Khi load trang:
  - Nếu localStorage có `chatHistory` hợp lệ → render lại toàn bộ chat body theo thứ tự.
  - Nếu parse lỗi → clear key và bắt đầu mới.

**Applies to**: UC-07  
**Trace**: SR-12

---

#### BR-LS-04: Giới hạn dung lượng
- localStorage giới hạn khoảng 5–10MB tuỳ browser.
- v1 khuyến nghị:
  - Giới hạn số message lưu (ví dụ 50–100 message gần nhất)
  - Hoặc bỏ lưu attachment base64 để tránh tràn bộ nhớ.

**Applies to**: UC-07  
**Trace**: SR-12, NFR-04

---

#### BR-LS-05: Không lưu dữ liệu nhạy cảm
- Không lưu API key, token hay thông tin định danh nhạy cảm trong localStorage.
- Nếu người dùng nhập thông tin nhạy cảm, hệ thống không có trách nhiệm lọc (out of scope), nhưng không được tự động thu thập thêm.

**Applies to**: UC-07  
**Trace**: NFR-01

---

### 4.7 Rules về Error handling

#### BR-ERR-01: Phân loại lỗi hiển thị
- Các nhóm lỗi tối thiểu:
  - Network error
  - API error (4xx/5xx)
  - Quota exceeded
  - Invalid API key
  - Request timeout

**Applies to**: UC-08  
**Trace**: SR-11

---

#### BR-ERR-02: Lỗi phải hiển thị “user-friendly”
- Error message phải dễ hiểu, ngắn gọn, không expose thông tin nội bộ.
- Dev log chi tiết ở console để debug.

**Applies to**: UC-08  
**Trace**: SR-11

---

#### BR-ERR-03: Lỗi không được làm crash UI
- Khi lỗi xảy ra:
  - Thinking bubble phải kết thúc (BR-TH-02)
  - Chatbot vẫn cho phép gửi message tiếp theo

**Applies to**: UC-08  
**Trace**: SR-11, SR-10

---

## 5. Mapping BR ↔ UC ↔ SR (tóm tắt)

| BR-ID | Use Case | System Req |
|------|----------|------------|
| BR-UI-01 | UC-01 | SR-01, SR-02 |
| BR-UI-03 | UC-03/04/06/08 | SR-04, SR-10, SR-11 |
| BR-IN-01 | UC-03/04 | SR-04, SR-07, SR-08 |
| BR-FILE-01/02 | UC-09 | SR-13 |
| BR-FILE-05 | UC-04 | SR-08 |
| BR-AI-03 | UC-10 | SR-14 |
| BR-TH-02 | UC-06/08 | SR-10, SR-11 |
| BR-LS-01/03 | UC-07 | SR-12 |
| BR-ERR-03 | UC-08 | SR-10, SR-11 |

---

## 6. Open Points (nếu phát sinh thay đổi)
- OP-BR-01: Có gửi toàn bộ chatHistory làm context hay chỉ gửi last N message?
- OP-BR-02: Có lưu attachment base64 vào localStorage hay chỉ lưu text?
- OP-BR-03: Timeout chuẩn cho AI request là bao nhiêu (mặc định 30s)?

---

## 7. Revision History
| Version | Date | Description | Author |
|--------|------|-------------|--------|
| 1.0 | 2026-01-29 | Initial version | BrSE Dang |
