"use client";

import { useDiagnosticEngine, ChatMessage } from "@/lib/diagnostic-engine";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function DoctorPage() {
  const { messages, isTyping, sendMessage } = useDiagnosticEngine();
  const [input, setInput] = useState("");
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input);
    setInput("");
  };

  const handleQuickReply = (val: string) => {
    sendMessage(val);
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white selection:bg-blue-500 overflow-hidden relative">
      <header className="absolute top-0 w-full p-6 flex justify-between items-center z-50 bg-gradient-to-b from-black to-transparent">
        <Link href="/" className="text-2xl font-bold tracking-tighter hover:opacity-70 transition-opacity">
          <span className="text-blue-500">aid</span>AR.
        </Link>
        <span className="text-sm font-mono text-neutral-500">Diagnostic Engine Online</span>
      </header>

      {/* Main Chat Area */}
      <main className="flex-1 overflow-y-auto px-4 md:px-20 pt-32 pb-40">
        <div className="max-w-3xl mx-auto flex flex-col gap-6">
          <AnimatePresence initial={false}>
            {messages.map((msg: ChatMessage) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                layout
                transition={{ duration: 0.4, type: "spring", bounce: 0.3 }}
                className={msg.role === 'user' ? 'flex justify-end' : 'flex justify-start'}
              >
                <div 
                  className={
                     msg.role === 'user' 
                       ? 'max-w-[80%] p-5 bg-blue-600 text-white rounded-3xl rounded-br-none' 
                       : msg.isRedFlag 
                         ? 'max-w-[80%] p-5 bg-red-950 border border-red-500/50 text-red-100 rounded-3xl rounded-bl-none'
                         : 'max-w-[80%] p-5 bg-neutral-900 border border-neutral-800 text-neutral-200 rounded-3xl rounded-bl-none'
                  }
                >
                  <div className="whitespace-pre-wrap leading-relaxed">{msg.text}</div>
                  
                  {msg.quickReplies && (
                    <motion.div 
                      className="mt-4 flex flex-wrap gap-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      {msg.quickReplies.map((qr) => (
                        <button
                          key={qr.value}
                          onClick={() => handleQuickReply(qr.value)}
                          className="px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/30 transition-colors text-sm"
                        >
                          {qr.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
            
            {isTyping && (
              <motion.div
                key="typing-indicator"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex justify-start"
              >
                <div className="bg-neutral-900 border border-neutral-800 rounded-3xl rounded-bl-none p-5 flex items-center gap-1">
                  <span className="animate-bounce delay-75 w-1.5 h-1.5 bg-neutral-500 rounded-full" />
                  <span className="animate-bounce delay-150 w-1.5 h-1.5 bg-neutral-500 rounded-full" />
                  <span className="animate-bounce delay-300 w-1.5 h-1.5 bg-neutral-500 rounded-full" />
                </div>
              </motion.div>
            )}
            <div key="end-of-messages" ref={endOfMessagesRef} />
          </AnimatePresence>
        </div>
      </main>

      {/* Input Area */}
      <footer className="absolute bottom-0 w-full p-6 bg-gradient-to-t from-black via-black to-transparent z-50">
        <div className="max-w-3xl mx-auto relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Describe your symptoms..."
            className="w-full bg-neutral-900/80 backdrop-blur-md border border-neutral-800 rounded-full py-5 px-8 pr-32 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white text-black px-6 py-2 rounded-full font-medium hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
          >
            Send
          </button>
        </div>
      </footer>
    </div>
  );
}
