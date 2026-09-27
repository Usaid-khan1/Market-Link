import React, { useState, useRef, useEffect } from 'react';
import apiClient from '../api/client';

// Quick action inquiries as specified in requirements
const QUICK_QUESTIONS = [
  {
    label: 'Find a product',
    icon: 'search',
    query: 'Help me find an available product.',
  },
  {
    label: 'Find a farmer',
    icon: 'agriculture',
    query: 'Which farmers are currently selling on MarketLink?',
  },
  {
    label: 'Find a market',
    icon: 'storefront',
    query: 'Which markets are open or available near me?',
  },
  {
    label: 'Market timings',
    icon: 'schedule',
    query: 'What are the market operating days and opening hours?',
  },
  {
    label: 'Pickup information',
    icon: 'inventory_2',
    query: 'What is the pickup time and how does pay-at-pickup work?',
  },
];

const INITIAL_WELCOME =
  "Hi! I'm MarketLink Assistant 👋\n\nI can help you find products, farmers and markets, check availability, market timings, pickup windows, and answer common questions.\n\nWhat are you looking for today?";

// Lightweight formatted text renderer supporting bold, italics, bullets, and line breaks
function FormattedMessage({ text }) {
  if (!text) return null;

  // Split lines
  const lines = text.split('\n');

  return (
    <div className="space-y-1.5 leading-relaxed text-xs sm:text-[13px]">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={idx} className="h-1" />;
        }

        // Bullet point check
        const isBullet = trimmed.startsWith('- ') || trimmed.startsWith('* ');
        const cleanLine = isBullet ? trimmed.substring(2) : trimmed;

        // Render inline markdown (* or **)
        const parts = [];
        let cursor = 0;
        const regex = /(\*\*.*?\*\*|\*.*?\*)/g;
        let match;

        while ((match = regex.exec(cleanLine)) !== null) {
          if (match.index > cursor) {
            parts.push(cleanLine.substring(cursor, match.index));
          }
          const raw = match[0];
          if (raw.startsWith('**') && raw.endsWith('**')) {
            parts.push(
              <strong key={match.index} className="font-bold text-on-surface">
                {raw.slice(2, -2)}
              </strong>
            );
          } else if (raw.startsWith('*') && raw.endsWith('*')) {
            parts.push(
              <em key={match.index} className="italic">
                {raw.slice(1, -1)}
              </em>
            );
          }
          cursor = match.index + raw.length;
        }

        if (cursor < cleanLine.length) {
          parts.push(cleanLine.substring(cursor));
        }

        if (isBullet) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-1 my-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-1.5" />
              <div className="flex-1">{parts}</div>
            </div>
          );
        }

        return <div key={idx}>{parts}</div>;
      })}
    </div>
  );
}

export default function ChatAssistant({ onNavigate, onFilterProduct }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      content: INITIAL_WELCOME,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 200);
    }
  }, [isOpen]);

  /**
   * Send a query to the backend /api/chat endpoint with session history.
   */
  const handleSend = async (textToSend) => {
    const query = (textToSend || inputText).trim();
    if (!query || isTyping) return;

    setHasInteracted(true);
    setInputText('');

    const userMsg = {
      id: 'u-' + Date.now(),
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    // Keep up to 6 previous messages for multi-turn context
    const currentHistory = messages
      .filter((m) => m.id !== 'welcome')
      .slice(-6)
      .map((m) => ({ role: m.role, content: m.content }));

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const response = await apiClient.post('/chat', {
        message: query,
        history: currentHistory,
      });

      if (response && response.reply) {
        const assistantMsg = {
          id: 'a-' + Date.now(),
          role: 'assistant',
          content: response.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          matches: response.matches || [],
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } else {
        throw new Error('Empty response from assistant endpoint');
      }
    } catch (err) {
      console.warn('MarketLink chat backend error:', err);
      // Friendly fallback error message as requested in section 8 & 14
      const errorMsg = {
        id: 'err-' + Date.now(),
        role: 'assistant',
        content: "Sorry, I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSend();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <aside
      className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end"
      aria-label="MarketLink AI Assistant"
    >
      {/* CHAT WINDOW */}
      {isOpen && (
        <section
          role="dialog"
          aria-label="MarketLink Assistant Chat"
          className="mb-3 w-[calc(100vw-2.5rem)] sm:w-[390px] h-[550px] max-h-[82vh] rounded-3xl overflow-hidden flex flex-col shadow-2xl animate-fade-in border border-outline-variant/30"
          style={{
            background: '#ffffff',
            boxShadow: '0 24px 64px -12px rgba(18, 82, 36, 0.25), 0 12px 28px -8px rgba(0, 0, 0, 0.12)',
            fontFamily: "'Rubik', sans-serif",
          }}
        >
          {/* Header */}
          <header
            className="px-5 py-4 flex items-center justify-between relative select-none flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg, #125224 0%, #205c2e 60%, #2e6b3a 100%)',
            }}
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center backdrop-blur-sm shadow-sm">
                  <span className="material-symbols-outlined text-secondary-fixed text-[22px]">
                    smart_toy
                  </span>
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary-fixed opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-secondary-fixed border-2 border-[#125224]" />
                </span>
              </div>
              <div>
                <h2 className="font-bold text-white text-sm tracking-tight leading-none flex items-center gap-1.5">
                  MarketLink Assistant
                  <span className="text-[10px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant leading-none">
                    AI
                  </span>
                </h2>
                <p className="text-secondary-fixed text-[11px] mt-1 font-medium flex items-center gap-1 opacity-90">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary-fixed" />
                  Active • Real-time harvest data
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close MarketLink Assistant"
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all cursor-pointer active:scale-95"
              >
                <span className="material-symbols-outlined text-[19px]">close</span>
              </button>
            </div>
          </header>


          {/* Messages Area */}
          <div
            tabIndex={0}
            aria-live="polite"
            className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-[#fcf9f8]/60 scroll-smooth"
            style={{ minHeight: 0 }}
          >
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} gap-1`}
                >
                  <div
                    className={`flex items-end gap-2 max-w-[85%] ${
                      isUser ? 'flex-row-reverse' : 'flex-row'
                    }`}
                  >
                    {!isUser && (
                      <div className="w-7 h-7 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 mb-1">
                        <span className="material-symbols-outlined text-primary text-[15px]">
                          eco
                        </span>
                      </div>
                    )}

                    <div
                      className={`px-4 py-3 rounded-2xl shadow-sm text-sm transition-all ${
                        isUser
                          ? 'bg-primary text-white rounded-br-xs font-normal'
                          : msg.isError
                          ? 'bg-red-50 border border-red-200 text-red-900 rounded-bl-xs'
                          : 'bg-white border border-outline-variant/25 text-on-surface rounded-bl-xs'
                      }`}
                      style={
                        isUser
                          ? {
                              background: 'linear-gradient(135deg, #125224 0%, #205c2e 100%)',
                            }
                          : {}
                      }
                    >
                      <FormattedMessage text={msg.content} />
                    </div>
                  </div>

                  <span
                    className={`text-[10px] text-outline font-medium px-1 ${
                      isUser ? 'mr-1' : 'ml-9'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
              );
            })}

            {/* Quick Prompts below welcome message */}
            {!hasInteracted && (
              <div className="pt-2 pb-1 space-y-2 animate-fade-in">
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider pl-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px] text-primary">
                    tips_and_updates
                  </span>
                  Quick Inquiries
                </p>
                <div className="grid grid-cols-1 gap-1.5">
                  {QUICK_QUESTIONS.map((q, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSend(q.query)}
                      className="text-left w-full flex items-center gap-2.5 px-3 py-2 bg-white hover:bg-primary/5 active:bg-primary/10 border border-outline-variant/30 hover:border-primary/40 rounded-xl transition-all duration-150 cursor-pointer text-xs font-medium text-on-surface group shadow-2xs"
                    >
                      <span className="material-symbols-outlined text-[16px] text-primary group-hover:scale-110 transition-transform flex-shrink-0">
                        {q.icon}
                      </span>
                      <span className="flex-1 truncate">{q.label}</span>
                      <span className="material-symbols-outlined text-[14px] text-outline group-hover:text-primary ml-auto flex-shrink-0 group-hover:translate-x-0.5 transition-transform">
                        arrow_forward
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Animated Typing Indicator */}
            {isTyping && (
              <div className="flex items-end gap-2 max-w-[85%] animate-fade-in">
                <div className="w-7 h-7 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 mb-1">
                  <span className="material-symbols-outlined text-primary text-[15px]">eco</span>
                </div>
                <div className="bg-white border border-outline-variant/25 px-4 py-3 rounded-2xl rounded-bl-xs shadow-sm flex items-center gap-3">
                  <div className="flex gap-1 items-center">
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce"
                      style={{ animationDelay: '0s' }}
                    />
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce"
                      style={{ animationDelay: '0.2s' }}
                    />
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce"
                      style={{ animationDelay: '0.4s' }}
                    />
                  </div>
                  <span className="text-[11px] font-semibold text-on-surface-variant italic">
                    MarketLink Assistant is typing...
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form
            onSubmit={handleSubmit}
            className="p-3 border-t border-outline-variant/20 bg-white flex items-center gap-2 flex-shrink-0"
          >
            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about crops, farmers, pickup windows..."
                disabled={isTyping}
                aria-label="Ask MarketLink Assistant a question"
                className="w-full bg-[#f6f3f2] border border-outline-variant/30 rounded-xl pl-3.5 pr-3 py-2.5 text-xs text-on-surface focus:outline-none focus:border-primary focus:bg-white focus:shadow-[0_0_0_3px_rgba(18,82,36,0.12)] transition-all placeholder:text-outline/60 disabled:opacity-60"
              />
            </div>

            <button
              type="submit"
              disabled={!inputText.trim() || isTyping}
              aria-label="Send message"
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white transition-all cursor-pointer active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0 shadow-sm"
              style={{
                background:
                  !inputText.trim() || isTyping
                    ? '#71796f'
                    : 'linear-gradient(135deg, #125224 0%, #2e6b3a 100%)',
              }}
            >
              <span className="material-symbols-outlined text-[18px]">send</span>
            </button>
          </form>
        </section>
      )}

      {/* FLOATING ACTION BUTTON */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close MarketLink Assistant' : 'Open MarketLink Assistant'}
        aria-expanded={isOpen}
        className="relative w-14 h-14 rounded-2xl text-white flex items-center justify-center cursor-pointer active:scale-95 transition-all duration-300 hover:-translate-y-1 group"
        style={{
          background: isOpen
            ? 'linear-gradient(135deg, #2e4f00 0%, #125224 100%)'
            : 'linear-gradient(135deg, #125224 0%, #205c2e 60%, #2e6b3a 100%)',
          boxShadow: '0 12px 32px -4px rgba(18, 82, 36, 0.4), 0 4px 12px rgba(0, 0, 0, 0.1)',
        }}
      >
        <span
          className="material-symbols-outlined text-[26px] transition-transform duration-300"
          style={{ transform: isOpen ? 'rotate(90deg)' : 'none' }}
        >
          {isOpen ? 'close' : 'chat'}
        </span>

        {/* Pulse beacon when closed */}
        {!isOpen && (
          <>
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary-fixed opacity-75" />
              <span className="relative inline-flex rounded-full h-4 w-4 bg-secondary-fixed border-2 border-white shadow-sm" />
            </span>

            {/* Hover tooltip */}
            <span className="absolute right-16 top-1/2 -translate-y-1/2 bg-on-surface text-white text-[11px] font-bold px-3 py-1.5 rounded-xl whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
              MarketLink AI Assistant
            </span>
          </>
        )}
      </button>
    </aside>
  );
}
