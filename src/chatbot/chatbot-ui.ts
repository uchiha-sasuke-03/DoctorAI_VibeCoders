// ============================================
// Chatbot UI Controller
// ============================================
import { initChatbot, handleUserInput, type ChatMessage } from './diagnostic-engine';

let messagesContainer: HTMLElement;
let inputField: HTMLInputElement;
let sendButton: HTMLElement;

export function initChatbotUI() {
  messagesContainer = document.getElementById('doctor-messages')!;
  inputField = document.getElementById('doctor-input') as HTMLInputElement;
  sendButton = document.getElementById('doctor-send')!;

  // Event listeners
  sendButton.addEventListener('click', sendMessage);
  inputField.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  // Initialize chatbot engine
  initChatbot(renderMessage);
}

function sendMessage() {
  const text = inputField.value.trim();
  if (!text) return;
  inputField.value = '';
  inputField.disabled = true;
  sendButton.classList.add('disabled');
  handleUserInput(text).finally(() => {
    inputField.disabled = false;
    sendButton.classList.remove('disabled');
    inputField.focus();
  });
}

function renderMessage(msg: ChatMessage) {
  // Handle '...' placeholder as typing indicator
  if (msg.role === 'bot' && msg.text === '...') {
    showTypingIndicator();
    return;
  }
  // Remove typing indicator before appending real message
  removeTypingIndicator();
  appendMessage(msg);
}

function showTypingIndicator() {
  const existing = messagesContainer.querySelector('.typing-indicator');
  if (existing) return;
  const div = document.createElement('div');
  div.className = 'typing-indicator';
  div.innerHTML = '<span></span><span></span><span></span>';
  messagesContainer.appendChild(div);
  scrollToBottom();
}

function removeTypingIndicator() {
  const indicator = messagesContainer.querySelector('.typing-indicator');
  if (indicator) indicator.remove();
}

function scrollToBottom() {
  requestAnimationFrame(() => {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  });
}



function appendMessage(msg: ChatMessage) {
  const div = document.createElement('div');

  if (msg.role === 'system') {
    div.className = 'chat-msg system';
    div.innerHTML = `<span class="msg-label">System Alert</span>${formatText(msg.text)}`;
  } else if (msg.role === 'bot') {
    div.className = `chat-msg bot${msg.isRedFlag ? ' redflag' : ''}`;
    let html = `<span class="msg-label">AI Doctor</span>${formatText(msg.text)}`;

    if (msg.disclaimer) {
      html += `<div class="msg-disclaimer">${msg.disclaimer}</div>`;
    }

    div.innerHTML = html;
  } else {
    div.className = 'chat-msg user';
    div.textContent = msg.text;
  }

  messagesContainer.appendChild(div);

  // Quick replies
  if (msg.quickReplies && msg.quickReplies.length > 0) {
    const qrDiv = document.createElement('div');
    qrDiv.className = 'quick-replies';
    msg.quickReplies.forEach((qr) => {
      const btn = document.createElement('button');
      btn.className = 'quick-reply-btn';
      btn.textContent = qr.label;
      btn.addEventListener('click', () => {
        // Remove the quick-reply buttons
        qrDiv.remove();
        handleUserInput(qr.value);
      });
      qrDiv.appendChild(btn);
    });
    messagesContainer.appendChild(qrDiv);
  }

  scrollToBottom();
}

function formatText(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>')
    .replace(/• /g, '&bull; ');
}

