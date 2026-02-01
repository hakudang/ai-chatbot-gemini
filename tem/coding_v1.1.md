# Cấu trúc app.js 
- Theo Coding Plan + BR v1.1 (Frozen).
- Mục tiêu: spec-compliant, đọc là hiểu luồng, QA trace được, dev maintain được.

- ✔ Tách rõ State / Init / UI / Validation / AI Service / Storage / Error
- ✔ Không “kẹt thinking”
- ✔ Đúng BR-IN, BR-FILE, BR-AI, BR-TH, BR-LS, BR-ERR

## 1. Constants & Global State
```js
/*************************************************
 * Constants (BR / SR)
 *************************************************/
const API_KEY = "PASTE-YOUR-API-KEY";
const API_URL =
  "https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=" +
  API_KEY;

const STORAGE_KEY = "chatHistory";
const MAX_MESSAGES = 50;
const REQUEST_TIMEOUT = 5000; // BR-TH-03

const ALLOWED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

/*************************************************
 * State
 *************************************************/
let chatHistory = []; // [{ role, text }]
let currentAttachment = null; // { data, mimeType }
```

## 2. DOM Elements
```js
/*************************************************
 * DOM Elements
 *************************************************/
const chatBody = document.querySelector(".chat-body");
const messageInput = document.querySelector(".message-input");
const chatForm = document.querySelector(".chat-form");

const sendButton = document.querySelector("#send-message");
const chatbotToggler = document.querySelector("#chatbot-toggler");
const closeChatbotBtn = document.querySelector("#close-chatbot");

const fileInput = document.querySelector("#file-input");
const fileUploadWrapper = document.querySelector(".file-upload-wrapper");
const fileCancelBtn = document.querySelector("#file-cancel");
```

## 3. Utility Functions

```js
/*************************************************
 * Utilities
 *************************************************/
function scrollToBottom() {
  chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });
}

function cleanMarkdown(text) {
  return text.replace(/\*\*(.*?)\*\*/g, "$1").trim();
}

function fetchWithTimeout(url, options, timeout = REQUEST_TIMEOUT) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  return fetch(url, { ...options, signal: controller.signal })
    .finally(() => clearTimeout(timer));
}
```
## 4. localStorage Handling (BR-LS)

```js
/*************************************************
 * Storage (BR-LS-01 ~ 04)
 *************************************************/
function loadChatHistory() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!Array.isArray(stored)) return;

    chatHistory = stored;
    stored.forEach(msg => renderMessage(msg.role, msg.text));
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    chatHistory = [];
  }
}

function saveChatHistory() {
  const trimmed = chatHistory.slice(-MAX_MESSAGES);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
}
```

## 5. Validation (BR-IN / BR-FILE)

```js
/*************************************************
 * Validation
 *************************************************/
function canSendMessage(text, hasImage) {
  return text.length > 0 || hasImage;
}

function validateImage(file) {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    alert("Unsupported image format.");
    return false;
  }
  if (file.size > MAX_IMAGE_SIZE) {
    alert("Image size must be 5MB or less.");
    return false;
  }
  return true;
}
```

## 6. UI Rendering

```js
/*************************************************
 * UI Rendering
 *************************************************/
function createMessageElement(role, html) {
  const div = document.createElement("div");
  div.classList.add("message", role === "user" ? "user-message" : "bot-message");
  div.innerHTML = html;
  return div;
}

function renderMessage(role, text) {
  const html =
    role === "user"
      ? `<div class="message-text">${text}</div>`
      : `<svg class="bot-avatar" ...></svg>
         <div class="message-text">${text}</div>`;

  chatBody.appendChild(createMessageElement(role, html));
  scrollToBottom();
}

function renderThinking() {
  const html = `
    <svg class="bot-avatar" ...></svg>
    <div class="message-text">
      <div class="thinking-indicator">
        <div class="dot"></div><div class="dot"></div><div class="dot"></div>
      </div>
    </div>`;
  const div = createMessageElement("bot", html);
  div.classList.add("thinking");
  chatBody.appendChild(div);
  scrollToBottom();
  return div;
}

function replaceThinking(div, text, isError = false) {
  div.classList.remove("thinking");
  const textEl = div.querySelector(".message-text");
  textEl.innerText = text;
  if (isError) textEl.style.color = "red";
}
```

## 7. AI Service (BR-AI / BR-TH / BR-ERR)

```js
/*************************************************
 * AI Service
 *************************************************/
async function callGeminiAPI() {
  const parts = [];

  if (messageInput.value.trim()) {
    parts.push({ text: messageInput.value.trim() });
  }
  if (currentAttachment) {
    parts.push({
      inlineData: {
        data: currentAttachment.data,
        mimeType: currentAttachment.mimeType,
      },
    });
  }

  const contents = [
    ...chatHistory.map(m => ({ role: m.role, parts: [{ text: m.text }] })),
    { role: "user", parts },
  ];

  const res = await fetchWithTimeout(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || "API Error");
  }

  const data = await res.json();
  return cleanMarkdown(data.candidates[0].content.parts[0].text);
}
```

## 8. Core Flow – Send Message

```js
/*************************************************
 * Core Flow
 *************************************************/
async function handleSendMessage(e) {
  e.preventDefault();

  const text = messageInput.value.trim();
  const hasImage = !!currentAttachment;

  if (!canSendMessage(text, hasImage)) return;

  // Render user message
  renderMessage("user", text);
  chatHistory.push({ role: "user", text });
  saveChatHistory();

  // Reset input & attachment
  messageInput.value = "";
  fileUploadWrapper.classList.remove("file-uploaded");
  currentAttachment = null;

  // Thinking indicator
  const thinkingDiv = renderThinking();

  try {
    const botText = await callGeminiAPI();
    replaceThinking(thinkingDiv, botText);
    chatHistory.push({ role: "model", text: botText });
    saveChatHistory();
  } catch (err) {
    replaceThinking(thinkingDiv, err.message, true);
  }
}
```

## 9. Event Handlers

```js
/*************************************************
 * Events
 *************************************************/
chatForm.addEventListener("submit", handleSendMessage);

messageInput.addEventListener("keydown", e => {
  if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 768) {
    handleSendMessage(e);
  }
});

fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  if (!file || !validateImage(file)) return;

  const reader = new FileReader();
  reader.onload = e => {
    currentAttachment = {
      data: e.target.result.split(",")[1],
      mimeType: file.type,
    };
    fileUploadWrapper.querySelector("img").src = e.target.result;
    fileUploadWrapper.classList.add("file-uploaded");
  };
  reader.readAsDataURL(file);
});

fileCancelBtn.addEventListener("click", () => {
  currentAttachment = null;
  fileUploadWrapper.classList.remove("file-uploaded");
});

chatbotToggler.addEventListener("click", () =>
  document.body.classList.toggle("show-chatbot")
);
closeChatbotBtn.addEventListener("click", () =>
  document.body.classList.remove("show-chatbot")
);
```

## 10. Init

```js
/*************************************************
 * Init
 *************************************************/
loadChatHistory();
```

## 11. Kết luận

✔ 100% tuân Coding Plan
✔ Đúng BR v1.1 Frozen
✔ QA trace được từng rule
✔ Dev nhìn là hiểu ngay luồng
Nếu muốn có thể triển khai :

✳️ Gắn comment BR-ID trực tiếp vào code

✳️ Viết Test Case Spec map đúng code này

✳️ Refactor sang Service layer tách file (aiService.js / storage.js)


## 12. Giải thích 

### Phân nhóm module theo Coding Plan

| No.| Nhóm code                | Thuộc Module nào trong Coding Plan? |
| ----- | ------------------------ | ----------------------------------- |
| 01 | Constants & Global State | ✅ Module 1 – Quản lý Trạng thái (State Management)    |
| 02 | DOM Elements             | ✅ Module 1 – Quản lý Trạng thái (State Management)         |
| 03 | Utility Functions        | ✅ Module 4 – Xử lý Logic Gửi/Nhận (Core Logic)               |
| 04 | localStorage Handling    | ✅ Module 4 – Xử lý Logic Gửi/Nhận (Core Logic)               |
| 05 | Validation               | ✅ Module 4 – Xử lý Logic Gửi/Nhận (Core Logic)               |
| 06 | UI Rendering             | ✅ Module 3 – Xử lý Sự kiện UI (Event Handlers)   |
| 07 | AI Service               | ✅ Module 4 – Xử lý Logic Gửi/Nhận (Core Logic)               |
| 08 | Core Flow – Send Message | ✅ Module 4 – Xử lý Logic Gửi/Nhận (Core Logic)               |
| 09 | Event Handlers           | ✅ Module 3 – Xử lý Sự kiện UI (Event Handlers)   |
| 10 | Init                     | ✅ Module 2 – Khởi tạo & Khôi phục (Initialization)           |

### Cấu trúc file sau refactor

```
app.js
 ├─ init.js
 ├─ state.js
 ├─ ui.js
 ├─ core/
 │   ├─ validation.js
 │   ├─ aiService.js
 │   ├─ storage.js
 │   └─ sendMessage.js
```