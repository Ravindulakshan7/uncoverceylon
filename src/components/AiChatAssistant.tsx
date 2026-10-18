'use client';

import React, { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import {
  Sparkles,
  MessageSquare,
  X,
  Send,
  RotateCcw,
  Compass,
  MapPin,
  Bot,
  User,
  ExternalLink,
} from 'lucide-react';

interface ChatMsg {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  time: string;
}

const INITIAL_MESSAGE: ChatMsg = {
  id: 'welcome',
  role: 'assistant',
  content:
    "**Ayubowan! 🌴** Welcome to Sri Lanka!\n\nI'm your **Serandib AI** travel concierge for *Uncover Ceylon*. Ask me anything — from the best surf seasons and blue train tickets to hidden waterfalls and authentic street food spots!",
  time: 'Just now',
};

const SUGGESTIONS = [
  '🚂 How to book Kandy to Ella train?',
  '🐋 Best months for Mirissa whales?',
  '🍛 What street foods must I try?',
  '🏛️ Dress code for sacred temples?',
];

export default function AiChatAssistant() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Don't render on admin dashboard
  if (pathname && pathname.startsWith('/admin')) {
    return null;
  }

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    setInput('');
    setHasInteracted(true);

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const userMsg: ChatMsg = {
      id: Date.now().toString(),
      role: 'user',
      content: query,
      time: timeStr,
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setIsLoading(true);

    try {
      // Format messages for the API route
      const apiPayload = newHistory.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiPayload }),
      });

      const data = await res.json();

      if (res.ok && data.reply) {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: data.reply,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      } else {
        throw new Error(data.error || 'Failed to get reply');
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content:
            "I'm having a brief connection hitch reaching Ceylon satellites. Please try asking again in a moment! 🌴",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([INITIAL_MESSAGE]);
  };

  return (
    <>
      {/* ━━━ FLOATING LAUNCHER BUTTON ━━━ */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => {
            setIsOpen(true);
            setHasInteracted(true);
          }}
          aria-label="Ask Serandib AI Travel Concierge"
          className="fixed bottom-5 right-4 sm:right-6 z-[9990] flex items-center gap-2 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-full bg-[#002b11] hover:bg-[#00421a] text-white shadow-[0_8px_25px_rgba(0,43,17,0.45)] border border-emerald-500/40 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer group"
        >
          <div className="relative flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-emerald-400 group-hover:rotate-12 transition-transform" />
            {!hasInteracted && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            )}
          </div>
          <span className="text-xs sm:text-sm font-bold tracking-tight">
            Ask AI Guide
          </span>
        </button>
      )}

      {/* ━━━ CHAT WINDOW MODAL ━━━ */}
      {isOpen && (
        <div className="fixed bottom-4 sm:bottom-6 right-3 sm:right-6 z-[9999] w-[calc(100vw-24px)] sm:w-[390px] h-[550px] max-h-[85vh] bg-white rounded-3xl shadow-[0_20px_60px_-10px_rgba(0,0,0,0.35)] border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          
          {/* Header */}
          <div className="bg-[#002b11] text-white px-4 py-3.5 flex items-center justify-between border-b border-emerald-950/40">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
                <Compass className="w-4 h-4 animate-spin" style={{ animationDuration: '20s' }} />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-bold tracking-tight">Serandib AI</h4>
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <p className="text-[10px] text-emerald-200/80 font-medium">
                  Ceylon Travel Concierge · Gemini 2.5
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleReset}
                title="Restart chat"
                className="p-1.5 rounded-full hover:bg-white/10 text-emerald-200 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Close chat"
                className="p-1.5 rounded-full hover:bg-white/10 text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs sm:text-sm bg-[#fafbfa]">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && (
                    <div className="w-6 h-6 rounded-full bg-[#002b11] text-emerald-300 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                      <Sparkles className="w-3 h-3" />
                    </div>
                  )}

                  <div
                    className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl ${
                      isUser
                        ? 'bg-[#002b11] text-white rounded-br-xs shadow-xs'
                        : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs shadow-2xs'
                    }`}
                  >
                    <div className="whitespace-pre-line leading-relaxed font-normal">
                      {msg.content}
                    </div>
                    <div
                      className={`text-[9px] mt-1 ${
                        isUser ? 'text-emerald-200/60 text-right' : 'text-slate-400'
                      }`}
                    >
                      {msg.time}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Loading typing bubble */}
            {isLoading && (
              <div className="flex items-center gap-2 text-slate-500">
                <div className="w-6 h-6 rounded-full bg-[#002b11] text-emerald-300 flex items-center justify-center shrink-0 shadow-2xs">
                  <Sparkles className="w-3 h-3 animate-spin" />
                </div>
                <div className="bg-white border border-slate-200/80 px-3.5 py-2 rounded-2xl rounded-bl-xs flex items-center gap-1.5 shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick suggestions on startup */}
          {messages.length === 1 && (
            <div className="px-3 pb-2 bg-[#fafbfa] flex gap-1.5 overflow-x-auto no-scrollbar">
              {SUGGESTIONS.map((sugg) => (
                <button
                  key={sugg}
                  type="button"
                  onClick={() => handleSend(sugg)}
                  className="whitespace-nowrap px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-700 text-[11px] font-semibold hover:border-emerald-500 hover:text-emerald-700 transition-all cursor-pointer shadow-2xs shrink-0"
                >
                  {sugg}
                </button>
              ))}
            </div>
          )}

          {/* Input Box Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-2.5 bg-white border-t border-slate-200 flex items-center gap-1.5"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about trains, places, food, weather..."
              className="flex-1 bg-slate-50 border border-slate-200 focus:border-emerald-600 focus:bg-white rounded-full px-3.5 py-2 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 outline-none transition-all"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              aria-label="Send message"
              className="w-9 h-9 rounded-full bg-[#002b11] hover:bg-[#00421a] disabled:opacity-40 text-white flex items-center justify-center transition-all cursor-pointer shrink-0 active:scale-95 shadow-xs"
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
