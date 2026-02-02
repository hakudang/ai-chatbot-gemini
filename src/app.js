
/*************************************************
 * 1 - Constants (BR / SR)
 *************************************************/

// const API_KEY = "PASTE-YOUR-API-KEY";
// const API_URL =
//     "https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key==${API_KEY}" ;
// Nơi lấy API https://aistudio.google.com/api-keys

const API_KEY = "PASTE-YOUR-API-KEY";
const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash-lite:generateContent?key=${API_KEY}`;

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

/*************************************************
 * 2 - DOM Elements
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

/*************************************************
 * 9 - Events
 *************************************************/
// chatForm.addEventListener("submit", handleSendMessage);

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

/*************************************************
 * 10 - Init
 *************************************************/
loadChatHistory();