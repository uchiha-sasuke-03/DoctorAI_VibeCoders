// ============================================
// AI Doctor Page — ChatGPT-Style Entry Point
// ============================================
import './style.css';
import { initChatbot, handleUserInput, type ChatMessage } from './chatbot/diagnostic-engine';

let messagesArea: HTMLElement;
let searchInput: HTMLInputElement;
let sendBtn: HTMLElement;
let welcomeEl: HTMLElement;
let conversationEl: HTMLElement;
let hasStarted = false;

document.addEventListener('DOMContentLoaded', () => {
  messagesArea = document.getElementById('doctor-messages-area')!;
  searchInput = document.getElementById('doctor-search') as HTMLInputElement;
  sendBtn = document.getElementById('doctor-search-send')!;
  welcomeEl = document.getElementById('doctor-welcome')!;
  conversationEl = document.getElementById('doctor-conversation')!;

  // Init chatbot engine (but don't show greeting — we have our own welcome)
  initChatbot(onBotMessage);

  // Send button
  sendBtn.addEventListener('click', sendMessage);
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  // Category pills
  const pills = document.querySelectorAll<HTMLElement>('.category-pill');
  pills.forEach((pill) => {
    pill.addEventListener('click', () => {
      const symptom = pill.dataset.symptom || pill.textContent || '';
      searchInput.value = symptom;
      sendMessage();
    });
  });
});

function sendMessage() {
  const text = searchInput.value.trim();
  if (!text) return;
  searchInput.value = '';

  // Transition from welcome to conversation mode
  if (!hasStarted) {
    hasStarted = true;
    welcomeEl.classList.add('hidden');
    conversationEl.classList.remove('hidden');
    conversationEl.classList.add('visible');
  }

  // Show user message immediately
  appendMessage({ role: 'user', text });

  // Show thinking indicator
  showThinking();

  // Disable input while "thinking"
  searchInput.disabled = true;
  sendBtn.classList.add('disabled');

  // Add a realistic delay before processing
  const delay = 800 + Math.random() * 1200;
  setTimeout(() => {
    removeThinking();
    handleUserInput(text);
    searchInput.disabled = false;
    sendBtn.classList.remove('disabled');
    searchInput.focus();
  }, delay);
}

function onBotMessage(msg: ChatMessage) {
  // Skip user messages (we render them ourselves)
  if (msg.role === 'user') return;

  // Transition to conversation if not already
  if (!hasStarted) {
    hasStarted = true;
    welcomeEl.classList.add('hidden');
    conversationEl.classList.remove('hidden');
    conversationEl.classList.add('visible');
  }

  appendMessage(msg);
}

function showThinking() {
  const div = document.createElement('div');
  div.className = 'doc-thinking';
  div.id = 'thinking-indicator';
  div.innerHTML = `
    <div class="thinking-avatar">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="18" height="18">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
      </svg>
    </div>
    <div class="thinking-dots">
      <span></span><span></span><span></span>
    </div>
  `;
  messagesArea.appendChild(div);
  scrollToBottom();
}

function removeThinking() {
  const el = document.getElementById('thinking-indicator');
  if (el) el.remove();
}

function appendMessage(msg: ChatMessage) {
  const div = document.createElement('div');

  if (msg.role === 'system') {
    div.className = 'doc-msg doc-msg-system';
    div.innerHTML = `
      <div class="doc-msg-alert">⚠️</div>
      <div class="doc-msg-body">${formatText(msg.text)}</div>
    `;
  } else if (msg.role === 'bot') {
    div.className = `doc-msg doc-msg-bot${msg.isRedFlag ? ' doc-msg-redflag' : ''}`;
    div.innerHTML = `
      <div class="doc-msg-avatar">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="20" height="20">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
        </svg>
      </div>
      <div class="doc-msg-content">
        <span class="doc-msg-label">AI Doctor</span>
        <div class="doc-msg-text">${formatText(msg.text)}</div>
        ${msg.disclaimer ? `<div class="doc-msg-disclaimer">${msg.disclaimer}</div>` : ''}
      </div>
    `;
  } else {
    div.className = 'doc-msg doc-msg-user';
    div.innerHTML = `<div class="doc-msg-text">${escapeHtml(msg.text)}</div>`;
  }

  messagesArea.appendChild(div);

  // Quick replies
  if (msg.quickReplies && msg.quickReplies.length > 0) {
    const qrDiv = document.createElement('div');
    qrDiv.className = 'doc-quick-replies';
    msg.quickReplies.forEach((qr) => {
      const btn = document.createElement('button');
      btn.className = 'doc-qr-btn';
      btn.textContent = qr.label;
      btn.addEventListener('click', () => {
        qrDiv.remove();
        searchInput.value = qr.value;
        sendMessage();
      });
      qrDiv.appendChild(btn);
    });
    messagesArea.appendChild(qrDiv);
  }

  scrollToBottom();
}

function formatText(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>')
    .replace(/• /g, '&bull; ');
}

function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function scrollToBottom() {
  requestAnimationFrame(() => {
    messagesArea.scrollTop = messagesArea.scrollHeight;
  });
}
