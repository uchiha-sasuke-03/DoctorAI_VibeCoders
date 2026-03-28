"use client";

import { useState, useRef, useEffect } from "react";

export interface ChatMessage {
  id: string;
  role: 'bot' | 'user' | 'system';
  text: string;
  quickReplies?: { label: string; value: string }[];
  isRedFlag?: boolean;
}

const OLLAMA_API_URL = '/api/chat';
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

export function useDiagnosticEngine() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  
  // Store the raw LLM context array behind the scenes
  const llmHistory = useRef<{ role: string; content: string }[]>([]);

  useEffect(() => {
    // Initialize the chat on mount
    const greeting = "Hello, I am aidAR, your AI-powered medical assistant. I can help assess your symptoms. How are you feeling today or what brings you here?";
    
    llmHistory.current = [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'assistant', content: greeting }
    ];

    setTimeout(() => {
      setMessages([{
        id: "msg-0",
        role: 'bot',
        text: greeting,
        quickReplies: [
          { label: 'Fever', value: 'fever' },
          { label: 'Headache', value: 'headache' },
          { label: 'Cough', value: 'cough' },
          { label: 'Stomach Pain', value: 'stomach ache' }
        ]
      }]);
    }, 600);
  }, []);

  const sendMessage = async (input: string) => {
    if (!input.trim()) return;

    const userMsgId = "user-" + Date.now();
    const newMessages = [...messages, { id: userMsgId, role: 'user' as const, text: input }];
    setMessages(newMessages);
    
    llmHistory.current.push({ role: 'user', content: input });
    setIsTyping(true);

    try {
      const response = await fetch(OLLAMA_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: MODEL_NAME,
          messages: llmHistory.current,
          stream: false,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        const errMsg = errData.error || response.statusText || "500 Internal Error";
        
        setMessages((prev) => [...prev, {
          id: "sys-" + Date.now(),
          role: 'system',
          text: `⚠️ **Ollama AI Engine Crashed**: ${errMsg}\n\n*Tip: Your local Ollama process ran out of RAM or GPU memory. Try restarting Ollama or closing heavy applications.*`,
          isRedFlag: true
        }]);
        return;
      }

      const data = await response.json();
      const botText = data.message.content;

      llmHistory.current.push({ role: 'assistant', content: botText });

      const isRedFlag = botText.toLowerCase().includes('emergency') || 
                        botText.toLowerCase().includes('911') || 
                        botText.toLowerCase().includes('seek immediate');

      setMessages((prev) => [...prev, {
        id: "bot-" + Date.now(),
        role: 'bot',
        text: botText,
        isRedFlag
      }]);

    } catch (error) {
      setMessages((prev) => [...prev, {
        id: "sys-" + Date.now(),
        role: 'system',
        text: '⚠️ **Connection Error**: Unable to reach Next.js Server. Ensure your local server is stable.',
        isRedFlag: true
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return { messages, isTyping, sendMessage };
}
