import React, { useEffect, useRef, useState } from 'react';

const VIDEO_URL =
  'https://res.cloudinary.com/dkscvg8pg/video/upload/v1790464894/Untitled_design_1_xgnc2f.mp4';

export default function FloatingVideoWidget() {
  // Default is closed, showing only the round play icon button
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const miniVideoRef = useRef(null);
  const modalVideoRef = useRef(null);

  // Play mini video when opened
  useEffect(() => {
    if (isOpen && miniVideoRef.current) {
      miniVideoRef.current.currentTime = 0;
      miniVideoRef.current.play().catch(() => {});
    }
  }, [isOpen]);

  // Sync video time when cinema modal is opened
  useEffect(() => {
    if (isExpanded) {
      if (modalVideoRef.current) {
        modalVideoRef.current.currentTime = miniVideoRef.current?.currentTime || 0;
        modalVideoRef.current.muted = true;
        modalVideoRef.current.play().catch(() => {});
      }
      if (miniVideoRef.current) {
        miniVideoRef.current.pause();
      }
    } else {
      if (miniVideoRef.current && isOpen) {
        miniVideoRef.current.play().catch(() => {});
      }
    }
  }, [isExpanded, isOpen]);

  // Close modal via ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (isExpanded) setIsExpanded(false);
        else if (isOpen) setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isExpanded, isOpen]);

  // Listen for global open video event (e.g. from HowItWorks section)
  useEffect(() => {
    const handleOpenVideo = () => {
      setIsOpen(true);
      setIsExpanded(true);
    };
    window.addEventListener('open-how-it-works-video', handleOpenVideo);
    return () => window.removeEventListener('open-how-it-works-video', handleOpenVideo);
  }, []);

  return (
    <>
      {/* ------------------------------------------------------------------ */}
      {/* FLOATING BOTTOM-RIGHT WIDGET CONTAINER (Above Chat Assistant)      */}
      {/* ------------------------------------------------------------------ */}
      <aside
        aria-label="How it Works Video"
        className="fixed bottom-24 right-5 sm:bottom-24 sm:right-6 z-40 flex flex-col items-end select-none"
      >
        {/* MINI VIDEO CARD (Opens on click) */}
        {isOpen && (
          <div className="mb-3 w-64 sm:w-72 rounded-2xl overflow-hidden bg-black/95 text-white border-2 border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.4),0_10px_25px_rgba(18,82,36,0.25)] backdrop-blur-md transition-all duration-300 animate-scale-up group">
            {/* Header Bar (Theme Matched Green) */}
            <div className="flex items-center justify-between px-3.5 py-2.5 bg-gradient-to-r from-[#125224] via-[#1a632e] to-[#205c2e] border-b border-white/15 shadow-xs">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-300" />
                </span>
                <span className="text-[11px] font-black text-white tracking-wider uppercase drop-shadow-xs">
                  How it Works
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                {/* Expand to Modal Button */}
                <button
                  type="button"
                  onClick={() => setIsExpanded(true)}
                  title="Expand to Full View"
                  className="w-6 h-6 rounded-md bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[15px]">fullscreen</span>
                </button>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  title="Close"
                  className="w-6 h-6 rounded-md bg-white/15 hover:bg-red-500/80 flex items-center justify-center text-white transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[15px]">close</span>
                </button>
              </div>
            </div>

            {/* Pure Video Element (Clean, no extra overlay text or buttons) */}
            <div
              className="relative aspect-video w-full bg-black cursor-pointer overflow-hidden"
              onClick={() => setIsExpanded(true)}
              title="Click to expand"
            >
              <video
                ref={miniVideoRef}
                src={VIDEO_URL}
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          </div>
        )}

        {/* DEFAULT CIRCULAR PLAY BUTTON (Exact match to screenshot) */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Close How It Works Video' : 'Watch How It Works Video'}
          className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#125224] hover:bg-[#1b6b32] text-white flex items-center justify-center shadow-[0_10px_25px_rgba(18,82,36,0.35)] ring-4 ring-[#88c596]/40 border-2 border-white/30 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer group"
        >
          {/* Subtle pulse wave animation when closed */}
          {!isOpen && (
            <span className="absolute inset-0 rounded-full border-2 border-emerald-400/50 animate-ping pointer-events-none" />
          )}

          {/* Icon: Play triangle when closed, Close (X) when open */}
          {isOpen ? (
            <span className="material-symbols-outlined text-[24px] sm:text-[26px]">close</span>
          ) : (
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6 translate-x-0.5 text-white"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          )}

          {/* Hover Tooltip (Only when closed) */}
          {!isOpen && (
            <span className="pointer-events-none absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-black/85 text-white text-[11px] font-bold tracking-tight whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-md">
              How It Works
            </span>
          )}
        </button>
      </aside>

      {/* ------------------------------------------------------------------ */}
      {/* CINEMA MODAL (High-Definition Centered Walkthrough Player)         */}
      {/* ------------------------------------------------------------------ */}
      {isExpanded && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="How MarketLink Works Video Walkthrough"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in"
          onClick={() => setIsExpanded(false)}
        >
          <div
            className="relative w-full max-w-4xl bg-surface-container-lowest rounded-3xl overflow-hidden shadow-2xl border border-white/20 animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 sm:px-6 py-4 bg-gradient-to-r from-[#125224] to-[#205c2e] text-white">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center border border-white/20">
                  <svg className="w-4 h-4 text-emerald-300" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black tracking-tight leading-none">
                    How MarketLink Works
                  </h3>
                  <p className="text-xs text-emerald-100/80 mt-1 font-medium">
                    Farm-Fresh Produce Direct from Regional Stalls in 3 Simple Steps
                  </p>
                </div>
              </div>

              {/* Close Modal Button */}
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Modal HD Video Player */}
            <div className="relative aspect-video w-full bg-black">
              <video
                ref={modalVideoRef}
                src={VIDEO_URL}
                controls
                autoPlay
                muted
                playsInline
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
