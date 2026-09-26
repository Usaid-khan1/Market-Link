import React, { useState, useRef, useEffect } from 'react';

const quickPrompts = [
  { label: 'Market timings & pickup windows', icon: 'schedule', response: 'Downtown Market: Saturday 8AM–1PM. Oak Valley: Sunday 9AM–2PM. Riverside Twilight: Wednesday 4–7:30PM. Reserved crates held until 1 hour before closing.' },
  { label: 'Is a farmer available this week?', icon: 'agriculture', response: 'Yes! Martha & Joe Miller (Green Pastures) at Downtown Saturday, Stall #12. Elias Vance (Whispering Pines) at Oak Valley Sunday. Elena Rostova at Riverside Wednesday.' },
  { label: 'Find fresh heirloom tomatoes', icon: 'nutrition', response: 'Green Pastures Organic has Heirloom Brandywine Tomatoes ($4.50/lb) at Downtown Market. Reserve yours for pickup this Saturday!' },
  { label: 'How does pay-at-pickup work?', icon: 'payments', response: 'Zero online charges! Reserve for free, grower packs your named crate. Visit the stall, inspect the harvest, pay directly with cash or card.' },
];

export default function ChatAssistant({ onNavigate, onFilterProduct }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'assistant', text: "Hello! 🌿 I can help you find fresh produce, locate market stall pickup bays, or answer questions about paying at pickup." }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const addBotMessage = (text) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [...prev, { sender: 'assistant', text }]);
    }, 700);
  };

  const handlePromptClick = (prompt) => {
    setMessages((prev) => [...prev, { sender: 'user', text: prompt.label }]);
    addBotMessage(prompt.response);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    const userText = inputText.trim();
    setInputText('');
    setMessages((prev) => [...prev, { sender: 'user', text: userText }]);

    const lower = userText.toLowerCase();
    let reply = "Thanks for your question! You can reserve any available crop directly on MarketLink and pay in-person at your weekend market pickup.";

    if (lower.includes('tomato') || lower.includes('fruit') || lower.includes('apple') || lower.includes('honey')) {
      reply = "We have fresh seasonal batches listed in our 'Fresh This Week' showcase! Click 'Reserve Pickup' on any in-stock item to hold your crate.";
    } else if (lower.includes('pay') || lower.includes('cash') || lower.includes('card') || lower.includes('price')) {
      reply = "You never pay online! MarketLink lets you reserve for free; pay the farmer directly at the stall using cash, card, or local vouchers.";
    } else if (lower.includes('where') || lower.includes('location') || lower.includes('market') || lower.includes('address')) {
      reply = "Check out our Featured Markets: Central Plaza Downtown, Pioneer Park Pavilion in Oak Valley, and Pier 4 Riverfront Greenway!";
    }

    addBotMessage(reply);
  };

  return (
    <aside className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Chat Window */}
      {isOpen && (
        <div
          className="w-80 sm:w-[360px] rounded-3xl overflow-hidden flex flex-col max-h-[560px] animate-bounce-in"
          style={{
            background: 'rgba(255,255,255,0.97)',
            backdropFilter: 'blur(24px)',
            boxShadow: '0 24px 64px rgba(18,82,36,0.2), 0 8px 24px rgba(0,0,0,0.1)',
            border: '1px solid rgba(192,201,189,0.25)',
          }}
        >
          {/* Top accent bar */}
          <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #125224, #3e6a00, #b9f474)' }} />

          {/* Header */}
          <div
            className="px-5 py-4 flex items-center justify-between"
            style={{ background: 'linear-gradient(135deg, #125224, #2e6b3a)' }}
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-secondary-fixed/20 border border-secondary-fixed/30 flex items-center justify-center">
                  <span className="material-symbols-outlined text-secondary-fixed text-[22px]">smart_toy</span>
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary-fixed opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-secondary-fixed" />
                </span>
              </div>
              <div>
                <p className="font-black text-on-primary text-sm leading-none">MarketLink AI</p>
                <p className="text-primary-fixed-dim text-[10px] mt-0.5 font-semibold">Online • Answering harvest queries</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close Assistant"
              className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-on-primary transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-gradient-to-b from-surface-container-low/30 to-white">
            <p className="text-center text-on-surface-variant text-[10px] font-semibold uppercase tracking-widest py-1">Today &bull; Local Market Chat</p>

            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
              >
                {msg.sender === 'assistant' && (
                  <div className="w-7 h-7 rounded-xl bg-primary/10 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-primary text-[14px]">eco</span>
                  </div>
                )}
                <div
                  className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.sender === 'user'
                      ? 'rounded-tr-sm text-on-primary font-medium'
                      : 'rounded-tl-sm bg-white border border-outline-variant/20 text-on-surface'
                    }`}
                  style={msg.sender === 'user' ? { background: 'linear-gradient(135deg, #125224, #2e6b3a)' } : {}}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start animate-fade-in">
                <div className="w-7 h-7 rounded-xl bg-primary/10 flex items-center justify-center mr-2 flex-shrink-0">
                  <span className="material-symbols-outlined text-primary text-[14px]">eco</span>
                </div>
                <div className="bg-white border border-outline-variant/20 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm">
                  <div className="flex gap-1 items-center">
                    {[0, 0.2, 0.4].map((delay, i) => (
                      <span
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-primary/50 animate-bounce"
                        style={{ animationDelay: `${delay}s` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="px-4 py-3 border-t border-outline-variant/10 bg-surface-container-low/50">
            <p className="font-black text-[9px] text-on-surface-variant uppercase tracking-widest mb-2">Quick Inquiries</p>
            <div className="flex flex-col gap-1.5">
              {quickPrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePromptClick(p)}
                  type="button"
                  className="text-left flex items-center gap-2.5 px-3 py-2 bg-white hover:bg-primary/6 border border-outline-variant/20 hover:border-primary/20 text-on-surface rounded-xl transition-all duration-150 cursor-pointer text-xs font-medium group"
                >
                  <span className="material-symbols-outlined text-[15px] text-primary group-hover:scale-110 transition-transform flex-shrink-0">{p.icon}</span>
                  <span className="truncate">{p.label}</span>
                  <span className="material-symbols-outlined text-[14px] text-on-surface-variant/40 group-hover:text-primary ml-auto flex-shrink-0 group-hover:translate-x-0.5 transition-transform">chevron_right</span>
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-outline-variant/10 bg-white flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask about markets or crops..."
              className="flex-1 bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-2.5 text-xs text-on-surface focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(18,82,36,0.08)] transition-all placeholder:text-outline/50"
            />
            <button
              type="submit"
              className="w-9 h-9 rounded-xl flex items-center justify-center text-on-primary transition-all hover:shadow-green-md cursor-pointer active:scale-95 flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #125224, #2e6b3a)' }}
            >
              <span className="material-symbols-outlined text-[17px]">send</span>
            </button>
          </form>
        </div>
      )}

      {/* FAB Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open MarketLink Assistant"
        className="relative w-14 h-14 rounded-2xl text-on-primary flex items-center justify-center cursor-pointer active:scale-90 transition-all duration-300 hover:-translate-y-1"
        style={{
          background: isOpen
            ? 'linear-gradient(135deg, #6e3900, #914d00)'
            : 'linear-gradient(135deg, #125224, #2e6b3a)',
          boxShadow: isOpen
            ? '0 8px 32px rgba(145,77,0,0.4)'
            : '0 8px 32px rgba(18,82,36,0.4)',
        }}
      >
        <span
          className="material-symbols-outlined text-[26px] transition-all duration-300"
          style={{ transform: isOpen ? 'rotate(90deg) scale(0.9)' : 'none' }}
        >
          {isOpen ? 'close' : 'chat'}
        </span>

        {!isOpen && (
          <>
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary-fixed opacity-75" />
              <span className="relative inline-flex rounded-full h-4 w-4 bg-secondary-fixed border-2 border-white" />
            </span>
            {/* Tooltip */}
            <span className="absolute right-16 top-1/2 -translate-y-1/2 bg-on-surface text-surface text-[11px] font-bold px-3 py-1.5 rounded-xl whitespace-nowrap pointer-events-none opacity-0 hover:opacity-0 shadow-lg" style={{ background: '#1b1c1c' }}>
              Need help? Ask me!
            </span>
          </>
        )}
      </button>
    </aside>
  );
}
