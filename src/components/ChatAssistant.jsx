import React, { useState } from 'react';

export default function ChatAssistant({ onNavigate, onFilterProduct }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'assistant',
      text: 'Hello! I can help you find fresh produce, locate market stall pickup bays, or answer questions about paying at pickup.'
    }
  ]);
  const [inputText, setInputText] = useState('');

  const quickPrompts = [
    {
      label: 'Market timings & pickup windows',
      icon: 'schedule',
      response: 'Downtown Market runs Saturday 8:00 AM - 1:00 PM. Oak Valley Community Market runs Sunday 9:00 AM - 2:00 PM. Riverside Twilight runs Wednesday 4:00 PM - 7:30 PM. Reserved crates are held at the farmer’s stall until 1 hour before market closing.'
    },
    {
      label: 'Is a farmer available this week?',
      icon: 'agriculture',
      response: 'Yes! Martha & Joe Miller (Green Pastures) will be at Downtown Saturday (Stall #12). Elias Vance (Whispering Pines) is at Oak Valley Sunday. Elena Rostova is at Riverside Wednesday.'
    },
    {
      label: 'Find fresh heirloom tomatoes',
      icon: 'nutrition',
      response: 'Green Pastures Organic has Heirloom Brandywine Tomatoes in stock ($4.50/lb) at the Downtown Market. You can reserve yours right now for pickup this Saturday!'
    },
    {
      label: 'How does pay-at-pickup work?',
      icon: 'payments',
      response: 'Zero online card charges! Simply reserve items online for free. The grower packs your named crate. When you visit the stall, you inspect the harvest and pay the grower directly with cash or card.'
    }
  ];

  const handlePromptClick = (prompt) => {
    setMessages((prev) => [
      ...prev,
      { sender: 'user', text: prompt.label },
      { sender: 'assistant', text: prompt.response }
    ]);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userText = inputText.trim();
    setInputText('');

    let reply = "Thanks for your question! You can reserve any available crop directly on MarketLink and pay in-person at your weekend market pickup.";
    const lower = userText.toLowerCase();

    if (lower.includes('tomato') || lower.includes('fruit') || lower.includes('apple') || lower.includes('honey')) {
      reply = "We have fresh seasonal batches listed right above in our 'Fresh This Week' showcase! Click 'Reserve for Pickup' on any in-stock item to hold your crate.";
    } else if (lower.includes('pay') || lower.includes('cash') || lower.includes('card') || lower.includes('price')) {
      reply = "You never pay online! MarketLink lets you reserve for free; you pay the farmer directly at the stall using cash, card, or local vouchers.";
    } else if (lower.includes('where') || lower.includes('location') || lower.includes('market') || lower.includes('address')) {
      reply = "Check out our Featured Markets section: Central Plaza Downtown, Pioneer Park Pavilion in Oak Valley, and Pier 4 Riverfront Greenway!";
    }

    setMessages((prev) => [
      ...prev,
      { sender: 'user', text: userText },
      { sender: 'assistant', text: reply }
    ]);
  };

  return (
    <aside className="fixed bottom-space-lg right-space-lg z-50 flex flex-col items-end">
      {/* Assistant Dialog Window */}
      {isOpen && (
        <div className="mb-space-sm w-80 sm:w-96 bg-surface-container-lowest rounded-xl shadow-[0_12px_32px_rgba(34,34,34,0.12),0_4px_8px_rgba(46,107,58,0.08)] overflow-hidden border border-outline-variant/40 animate-fade-in flex flex-col max-h-[520px]">
          {/* Header */}
          <div className="bg-primary px-space-md py-space-sm flex items-center justify-between text-on-primary">
            <div className="flex items-center gap-space-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-secondary-fixed animate-pulse"></span>
              <div>
                <p className="font-label-md text-on-primary">MarketLink Assistant</p>
                <p className="font-label-sm text-primary-fixed-dim text-xs">
                  Online • Local stall &amp; harvest queries
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close Assistant"
              className="text-on-primary hover:text-primary-fixed-dim cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* Conversation Body */}
          <div className="p-space-md bg-surface flex flex-col gap-space-sm overflow-y-auto max-h-[320px]">
            <p className="font-body-sm text-on-surface-variant">
              Ask about local market stalls, producer schedules, and weekly crop arrivals:
            </p>

            {/* Message Thread */}
            <div className="flex flex-col gap-space-xs my-1">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-space-xs rounded-lg text-sm ${
                    msg.sender === 'assistant'
                      ? 'bg-surface-container text-on-surface'
                      : 'bg-primary text-on-primary self-end max-w-[85%]'
                  }`}
                >
                  {msg.text}
                </div>
              ))}
            </div>

            {/* Quick Prompts */}
            <div className="flex flex-col gap-space-xs mt-1">
              <span className="font-label-sm text-xs text-on-surface-variant uppercase tracking-wider">Quick Inquiries</span>
              {quickPrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePromptClick(p)}
                  type="button"
                  className="text-left font-body-sm px-space-sm py-space-xs bg-surface-container-low hover:bg-surface-container text-on-surface rounded-lg transition-colors flex items-center gap-space-xs cursor-pointer text-xs"
                >
                  <span className="material-symbols-outlined text-[16px] text-primary">
                    {p.icon}
                  </span>
                  <span>{p.label}</span>
                </button>
              ))}
            </div>

            {/* Informational Notice */}
            <div className="p-space-sm rounded-lg bg-surface-container-low flex items-start gap-space-xs mt-space-xs border border-outline-variant/30">
              <span className="material-symbols-outlined text-primary text-[18px] mt-0.5">verified</span>
              <p className="font-label-sm text-on-surface-variant text-xs leading-normal">
                No online payment required. Pay your farmer directly at the stall upon reservation pickup!
              </p>
            </div>
          </div>

          {/* Input Form */}
          <form onSubmit={handleSendMessage} className="p-space-xs bg-surface-container-lowest border-t border-outline-variant/30 flex items-center gap-space-xs">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask about markets or crops..."
              className="flex-1 bg-surface-container-low px-space-sm py-space-xs rounded-lg text-xs font-body-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button
              type="submit"
              className="w-8 h-8 rounded-lg bg-primary text-on-primary flex items-center justify-center hover:bg-primary-container transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">send</span>
            </button>
          </form>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open MarketLink Assistant"
        className="relative w-14 h-14 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-[0_12px_32px_rgba(34,34,34,0.12),0_4px_8px_rgba(46,107,58,0.08)] hover:bg-primary-container transition-transform active:scale-95 cursor-pointer"
      >
        <span className="material-symbols-outlined text-[28px]">
          {isOpen ? 'close' : 'chat'}
        </span>
        {!isOpen && (
          <span className="absolute top-0 right-0 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary-fixed opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-secondary-fixed-dim"></span>
          </span>
        )}
      </button>
    </aside>
  );
}
