
/*************************************************
 * 1 - Constants (BR / SR)
 *************************************************/

import { API_KEY } from "./config.js";
import { API_URL } from "./config.js";

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
 * Utilities
 *************************************************/
function scrollToBottom() {
  chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });
}

/*************************************************
 * 4 - Storage (BR-LS-01 ~ 04)
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
 * 5 - Validation
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

/*************************************************
 * 6 - UI Rendering
 *************************************************/
function createMessageElement(role, html) {
  const div = document.createElement("div");
  div.classList.add("message", role === "user" ? "user-message" : "bot-message");
  div.innerHTML = html;
  return div;
}

function renderMessage(role, text, imageData = null) {
  let html;
  
  if (role === "user") {
    html = `<div class="message-text">${text}</div>`;
    if (imageData) {
      html += `<img src="data:${imageData.mimeType};base64,${imageData.data}" class="attachment" />`;
    }
  } else {
    html = `<span class="bot-avatar material-symbols-rounded">smart_toy</span>
        <div class="message-text">${text} </div>`;
  }

  chatBody.appendChild(createMessageElement(role, html));
  scrollToBottom();
}

function renderThinking() {
  const html = `
    <span class="bot-avatar material-symbols-rounded">smart_toy</span>
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

/*************************************************
 * 7 - API Call
 *************************************************/
async function callGeminiAPI() {
  // Build request body with chat history
  const requestBody = {
    contents: chatHistory.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.text }]
    }))
  };

  // Add current attachment if exists
  if (currentAttachment) {
    const lastMessage = requestBody.contents[requestBody.contents.length - 1];
    lastMessage.parts.push({
      inline_data: {
        mime_type: currentAttachment.mimeType,
        data: currentAttachment.data
      }
    });
  }

  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody)
  };

  const response = await fetch(API_URL, requestOptions);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || "API request failed");
  }

  // Extract bot response text
  const apiResponseText = data.candidates[0].content.parts[0].text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .trim();

  return apiResponseText;
}

/*************************************************
 * 8 - Core Flow
 *************************************************/
async function handleSendMessage(e) {
  e.preventDefault();

  const text = messageInput.value.trim();
  const hasImage = !!currentAttachment;

  if (!canSendMessage(text, hasImage)) return;

  // Render user message with image if attached
  renderMessage("user", text, currentAttachment);
  chatHistory.push({ role: "user", text });
  saveChatHistory();

  // Reset input fields (but keep currentAttachment for API call)
  messageInput.value = "";
  fileInput.value = "";
  fileUploadWrapper.querySelector("img").src = "#";
  fileUploadWrapper.classList.remove("file-uploaded");

  // Thinking indicator
  const thinkingDiv = renderThinking();

  try {
    const botText = await callGeminiAPI();
    replaceThinking(thinkingDiv, botText);
    chatHistory.push({ role: "model", text: botText });
    saveChatHistory();
  } catch (err) {
    replaceThinking(thinkingDiv, err.message, true);
  } finally {
    // Reset attachment after API call is done
    currentAttachment = null;
  }
}

/*************************************************
 * 9 - Events
 *************************************************/

sendButton.addEventListener("click", handleSendMessage);
chatForm.addEventListener("submit", handleSendMessage);

messageInput.addEventListener("keydown", e => {
  if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 768) {
    e.preventDefault();
    handleSendMessage(e);
  }
});

const fileUploadBtn = document.querySelector("#file-upload");
fileUploadBtn.addEventListener("click", () => fileInput.click());

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
  fileInput.value = "";
  fileUploadWrapper.querySelector("img").src = "#";
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