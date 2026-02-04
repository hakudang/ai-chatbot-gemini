# ✅ Cách lấy API key Google Gemini
## 🔹 Bước 1: Truy cập Google AI Studio

Vào: 👉 https://aistudio.google.com/

Đăng nhập bằng tài khoản Google.

## 🔹 Bước 2: Tạo API key

Ở menu bên trái → chọn Get API key

→ bấm Create API key

→ chọn hoặc tạo Google Cloud Project

→ hệ thống sinh ra một chuỗi dạng:
```nginx
AIzaSyDxxxxxxxxxxxxxxxxxxxx
```

👉 Đây chính là Gemini API Key.

## 🔹 Bước 3: Lưu lại API key

Copy và lưu ở nơi an toàn.

Khi làm project, luôn để trong file môi trường, ví dụ:

`.env`
```env
GEMINI_API_KEY=AIzaSyDxxxxxxxxxxxxxxxx
```

❗ Không hard-code key trực tiếp vào code public / GitHub.

## 🔹 Bước 4: Dùng API key trong code
Ví dụ JavaScript (Web / Node.js)
```javascript
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const result = await model.generateContent("Xin chào Gemini");
console.log(result.response.text());
```

## 🔹 Bước 5: Kiểm tra quota và billing

Trong Google AI Studio → API keys / Usage

- Xem giới hạn request
- Xem model đang bật
- Có thể gắn sang Google Cloud Console nếu làm dự án lớn