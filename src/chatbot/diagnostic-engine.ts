// ============================================
// Diagnostic AI Chatbot Engine — MedLlama2 (Ollama API)
// ============================================

type MessageCallback = (msg: ChatMessage) => void;

export interface ChatMessage {
  role: 'bot' | 'user' | 'system';
  text: string;
  quickReplies?: { label: string; value: string }[];
  isRedFlag?: boolean;
  disclaimer?: string;
}

let onMessageCb: MessageCallback;
let conversationHistory: { role: string; content: string }[] = [];

// Configure your Ollama local server details here
const OLLAMA_API_URL = 'http://127.0.0.1:11434/api/chat';
const MODEL_NAME = 'medllama2';

const SYSTEM_PROMPT = `You are a professional, empathetic, and highly knowledgeable AI Medical Assistant named aidAR. 
Your goal is to help users assess their medical symptoms.

Follow these strict guidelines:
1. Ask clarifying questions one at a time to narrow down the conditions.
2. Provide gentle medical guidance including potential over-the-counter (OTC) medicines and home care when appropriate.
3. Be conversational but stay strictly focused on medical queries.
4. RED FLAGS: If the user reports severe symptoms (e.g., severe chest pain, inability to breathe, signs of a stroke, massive bleeding), you MUST immediately advise them to seek emergency medical care.
5. DISCLAIMER: Always remind users that you are an AI and not a substitute for a real doctor, especially when providing a final summary of potential causes. 
Limit your responses to a reasonable length. Use Markdown formatting for readability.`;

export function initChatbot(onMessage: MessageCallback) {
  onMessageCb = onMessage;
  resetState();

  // Send greeting message
  const greeting = "Hello, I am aidAR, your AI-powered medical assistant. I can help assess your symptoms. How are you feeling today or what brings you here?";

  setTimeout(() => {
    onMessageCb({
      role: 'bot',
      text: greeting,
      quickReplies: [
        { label: 'Fever', value: 'fever' },
        { label: 'Headache', value: 'headache' },
        { label: 'Cough', value: 'cough' },
        { label: 'Stomach Pain', value: 'stomach ache' }
      ]
    });
  }, 500);

  // Initialize the LLM conversation history with the system prompt and assistant greeting
  conversationHistory = [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'assistant', content: greeting }
  ];
}

function resetState() {
  conversationHistory = [];
}

export async function handleUserInput(input: string) {
  // Echo user message to UI immediately
  onMessageCb({ role: 'user', text: input });

  // Add user message to history
  conversationHistory.push({ role: 'user', content: input });

  // Show a typing indicator/loading state via a system message (optional, but good UX)
  // onMessageCb({ role: 'system', text: 'aidAR is thinking...' });

  try {
    const response = await fetch(OLLAMA_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL_NAME,
        messages: conversationHistory,
        stream: false,
      }),
    });

    if (!response.ok) {
        throw new Error('Ollama API Error: ' + response.status);
    }

    const data = await response.json();
    const botText = data.message.content;

    // Add bot response to history
    conversationHistory.push({ role: 'assistant', content: botText });

    // Check if the LLM output explicitly contains a severe warning pattern
    const isRedFlag = botText.toLowerCase().includes('emergency') || 
                      botText.toLowerCase().includes('911') || 
                      botText.toLowerCase().includes('seek immediate');

    onMessageCb({
      role: 'bot',
      text: botText,
      isRedFlag: isRedFlag,
      disclaimer: "Disclaimer: This AI symptom checker is for informational purposes only. Do not use it for medical emergencies."
    });

  } catch (error) {
    console.error('Failed to communicate with MedLlama2 via Ollama:', error);
    onMessageCb({
      role: 'system',
      text: '⚠️ **Connection Error**: Unable to connect to your local MedLlama2 AI. Please ensure that Ollama is running on your machine and the "medllama2" model is downloaded (you can run `ollama run medllama2` in your terminal).',
      isRedFlag: true
    });
  }
}
