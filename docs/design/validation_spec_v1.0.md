# Validation Specification – AI Chatbot với Google Gemini API

```text
Version : 1.0
Status  : Draft → To be Frozen
Date    : 29/01/2026
Owner   : BrSE Dang
Input   : 
  - System Requirements v1.1
  - Use Case Specification v1.0
  - Business Rules v1.0
```

---

## 1. Mục tiêu tài liệu
Tài liệu Validation Specification định nghĩa các điều kiện kiểm tra (validation rules) cho input, upload ảnh, trạng thái hệ thống và dữ liệu lưu trữ nhằm thống nhất triển khai và kiểm thử.

---

## 2. Phạm vi validation

Áp dụng cho các use case:
- UC-03: Gửi câu hỏi văn bản
- UC-04: Gửi câu hỏi kèm ảnh
- UC-07: Lưu & khôi phục lịch sử chat
- UC-08: Xử lý lỗi
- UC-09: Giới hạn upload ảnh

---

## 3. Nguyên tắc validation chung

- Validation ưu tiên client-side (v1).
- Không gọi AI API nếu validation fail.
- Validation fail phải:
  - Hiển thị message cho user (user-friendly)
  - Không làm crash UI
  - Validation logic không phụ thuộc AI response.
  - Validation cho response được định nghĩa riêng ( **Validation cho AI response**).

---

## 4. Validation cho input text

### 4.1. Validation rules – Text input

| ID         | Điều kiện        | Mô tả                                   | Kết quả khi fail |
| ---------- | ---------------- | --------------------------------------- | ---------------- |
| VAL-TXT-01 | Text rỗng        | Text = empty string hoặc chỉ chứa space | Không cho gửi    |
| VAL-TXT-02 | Text-only hợp lệ | Có ít nhất 1 ký tự không phải space     | Cho gửi          |
| VAL-TXT-03 | Text + image     | Text rỗng nhưng có image                | Cho gửi          |
| VAL-TXT-04 | Xuống dòng       | Shift+Enter cho phép xuống dòng         | Không gửi        |
| VAL-TXT-05 | Enter gửi        | Enter (desktop) khi đủ điều kiện        | Gửi message      |

**Trace**

- UC-03
- BR-IN-01, BR-IN-02

---

### 4.2. Error message (Text)

| Case                     | Message                                   |
| ------------------------ | ----------------------------------------- |
| Text rỗng & không có ảnh | *(Không hiển thị message – disable send)* |


## 5. Validation cho upload ảnh

### 5.1 Validation rules – File selection

| ID          | Điều kiện   | Mô tả                           | Kết quả          |
| ----------- | ----------- | ------------------------------- | ---------------- |
| VAL-FILE-01 | File type   | Chỉ chấp nhận PNG/JPG/JPEG/WebP | Reject           |
| VAL-FILE-02 | File size   | ≤ 5MB                           | Reject nếu > 5MB |
| VAL-FILE-03 | Single file | Chỉ 1 ảnh tại 1 thời điểm       | Replace ảnh cũ   |
| VAL-FILE-04 | Cancel      | User bấm cancel                 | Xoá ảnh          |

**Trace**
- UC-04, UC-09
- BR-FILE-01, BR-FILE-02, BR-FILE-04

---

### 5.2 Error message – File upload

| Case           | Message hiển thị                                             |
| -------------- | ------------------------------------------------------------ |
| Sai định dạng  | “Unsupported image format. Please upload PNG, JPG, or WebP.” |
| Quá dung lượng | “Image size must be 5MB or less.”                            |

---

## 6. Validation cho submit message

## 6.1 Validation rules – Submit

| ID         | Điều kiện               | Mô tả             | Kết quả                     |
| ---------- | ----------------------- | ----------------- | --------------------------- |
| VAL-SUB-01 | Text hoặc image hợp lệ  | Thoả BR-IN-01     | Cho submit                  |
| VAL-SUB-02 | Text rỗng & không image | Không hợp lệ      | Không submit                |
| VAL-SUB-03 | Submit khi thinking     | Đang chờ response | (v1) Cho submit tiếp        |
| VAL-SUB-04 | Reset input             | Sau submit        | Clear textarea & attachment |

Note: VAL-SUB-03, v1 cho phép submit khi thinking, mỗi submit tạo một request độc lập và một thinking bubble riêng.

**Trace**
- UC-03, UC-04
- BR-IN-01, BR-IN-03, BR-FILE-06

---

## 7. Validation cho AI response
### 7.1 Validation rules – Response

| ID        | Điều kiện         | Mô tả            | Xử lý          |
| --------- | ----------------- | ---------------- | -------------- |
| VAL-AI-01 | Response OK       | Có text response | Hiển thị       |
| VAL-AI-02 | Response empty    | Không có content | Hiển thị error |
| VAL-AI-03 | Response markdown | Có `**bold**`    | Clean format   |
| VAL-AI-04 | Response timeout  | > timeout        | Error          |

**Trace**
- UC-03, UC-04, UC-06
- BR-AI-04, BR-TH-03
  
---

## 7.2 Error message – AI response

| Case           | Message                                    |
| -------------- | ------------------------------------------ |
| Empty response | “No response from AI. Please try again.”   |
| Timeout        | “The request timed out. Please try again.” |

---

## 8. Validation cho thinking indicator
### 8.1 Rules

| ID        | Điều kiện    | Mô tả                 |
| --------- | ------------ | --------------------- |
| VAL-TH-01 | Sau submit   | Hiển thị thinking     |
| VAL-TH-02 | Sau response | Remove thinking       |
| VAL-TH-03 | Khi lỗi      | Replace bằng error    |
| VAL-TH-04 | Timeout      | Force remove thinking |

**Trace**

- UC-06, UC-08
- BR-TH-01, BR-TH-02, BR-TH-03

---

## 9. Validation cho localStorage
### 9.1 Validation rules – Save

| ID        | Điều kiện    | Mô tả                | Xử lý          |
| --------- | ------------ | -------------------- | -------------- |
| VAL-LS-01 | JSON valid   | chatHistory parse OK | Save           |
| VAL-LS-02 | JSON invalid | Parse error          | Clear storage  |
| VAL-LS-03 | Over size    | Exceed quota         | Limit messages |

**Trace**
- UC-07
- BR-LS-01, BR-LS-03, BR-LS-04

## 9.2 Validation rules – Load

| ID        | Điều kiện      | Mô tả             | Xử lý          |
| --------- | -------------- | ----------------- | -------------- |
| VAL-LS-04 | Storage exists | chatHistory found | Restore        |
| VAL-LS-05 | Storage empty  | No key            | Start new chat |

**Trace**
- UC-07
- BR-LS-02
---

## 10. Validation cho error handling

### 10.1 Error types

| Type            | Ví dụ             |
| --------------- | ----------------- |
| Network error   | Offline, DNS fail |
| API error       | 4xx, 5xx          |
| Quota exceeded  | 429               |
| Invalid API key | 401               |
| Timeout         | Request > limit   |

### 10.2 Validation rules – Error

| ID         | Điều kiện | Kết quả                |
| ---------- | --------- | ---------------------- |
| VAL-ERR-01 | Xảy ra Error  | Hiển thị error message |
| VAL-ERR-02 | Xảy ra Error  | Không crash UI         |
| VAL-ERR-03 | Xảy ra Error  | Cho phép gửi tiếp      |

**Trace**
- UC-08
- BR-ERR-01, BR-ERR-02, BR-ERR-03

---

## 11. Bảng thống kê validation

| No.| Validation ID | Đối tượng |Điều kiện | Mô tả | Xử lý / Kết quả  |
| ------ | -------------- | -------- | -------- | ------------- |------------- |
| 01 | VAL-TXT-01    | Text input | Text rỗng | Text = empty string hoặc chỉ chứa space | Không cho gửi |
| 02 | VAL-TXT-02    | Text input | Text-only hợp lệ | Có ít nhất 1 ký tự không phải space | Cho gửi |
| 03 | VAL-TXT-03    | Text input | Text + image | Text rỗng nhưng có image | Cho gửi |
| 04 | VAL-TXT-04    | Text input | Xuống dòng | Shift+Enter cho phép xuống dòng | | Không gửi |
| 05 | VAL-TXT-05    | Text input | Enter gửi | Enter (desktop) khi đủ điều kiện | Gửi message |
| 06 | VAL-FILE-01   | File upload | File type | Chỉ chấp nhận PNG/JPG/JPEG/WebP | Reject |
| 07 | VAL-FILE-02   | File upload | File size | ≤ 5MB | Reject nếu > 5MB |
| 08 | VAL-FILE-03   | File upload | Single file | Chỉ 1 ảnh tại 1 thời điểm | Replace ảnh cũ |
| 09 | VAL-FILE-04   | File upload | Cancel | User bấm cancel | Xoá ảnh |
| 10 | VAL-SUB-01    | Submit message | Text hoặc image hợp lệ | Thoả BR-IN-01 | Cho submit |
| 11 | VAL-SUB-02    | Submit message | Text rỗng & không image | Không hợp lệ | Không submit |
| 12 | VAL-SUB-03    | Submit message | Submit khi thinking | Đang chờ response | (v1) Cho submit tiếp |
| 13 | VAL-SUB-04    | Submit message | Reset input | Sau submit | Clear textarea & attachment |
| 14 | VAL-AI-01    | AI response | Response OK | Có text response | Hiển thị |
| 15 | VAL-AI-02    | AI response | Response empty | Không có content | Hiển thị error |
| 16 | VAL-AI-03    | AI response | Response markdown | Có `**bold**` | Clean format |
| 17 | VAL-AI-04    | AI response | Response timeout | > timeout | Error |
| 18 | VAL-TH-01    | Thinking indicator | Sau submit | Hiển thị thinking | Hiển thị thinking |
| 19 | VAL-TH-02    | Thinking indicator | Sau response | Remove thinking | Remove thinking |
| 20 | VAL-TH-03    | Thinking indicator | Khi lỗi | Replace bằng error | Replace bằng error |
| 21 | VAL-TH-04    | Thinking indicator | Timeout | Force remove thinking | Force remove thinking |
| 22 | VAL-LS-01    | localStorage | JSON valid | chatHistory parse OK | Save |
| 23 | VAL-LS-02    | localStorage | JSON invalid | Parse error | Clear storage |
| 24 | VAL-LS-03    | localStorage | Over size | Exceed quota | Limit messages |
| 25 | VAL-LS-04    | localStorage | Storage exists | chatHistory found | Restore |
| 26 | VAL-LS-05    | localStorage | Storage empty | No key | Start new chat |
| 27 | VAL-ERR-01   | Error handling | Xảy ra Error | Hiển thị error message | | Hiển thị error message |
| 28 | VAL-ERR-02   | Error handling | Xảy ra Error | Không crash UI | Không crash UI |
| 29 | VAL-ERR-03   | Error handling | Xảy ra Error | Cho phép gửi tiếp | Cho phép gửi tiếp |

---

## 12. Mapping Validation ↔ UC ↔ BR

| Validation  | Use Case | Business Rule |
| ----------- | -------- | ------------- |
| VAL-TXT-01  | UC-03    | BR-IN-01      |
| VAL-FILE-02 | UC-09    | BR-FILE-02    |
| VAL-SUB-02  | UC-03    | BR-IN-01      |
| VAL-TH-04   | UC-06    | BR-TH-03      |
| VAL-LS-02   | UC-07    | BR-LS-03      |
| VAL-ERR-03  | UC-08    | BR-ERR-03     |

---

## 13. Revision History

| Version | Date | Description | Author |
|--------|------|-------------|--------|
| 1.0 | 2026-01-29 | Initial version | BrSE Dang |
