import React from 'react';

export default function PageLoader({
  title = 'Loading Fresh Marketplace Data...',
  subtitle = 'Connecting with local farm stalls & verified regional markets...',
  fullScreen = false,
  minHeight = 'min-h-[50vh]',
}) {
  const content = (
    <div className="flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto animate-fade-in">
      {/* Radiant Glowing Orb & Animated Spinner */}
      <div className="relative mb-6 flex items-center justify-center">
        {/* Ambient Glow */}
        <div className="absolute w-24 h-24 rounded-full bg-primary/20 blur-xl animate-pulse" />
        <div className="absolute w-16 h-16 rounded-full bg-[#b9f474]/25 blur-lg" />

        {/* Outer Ring */}
        <div className="w-16 h-16 rounded-full border-3 border-outline-variant/30 border-t-primary border-r-secondary animate-spin" />

        {/* Inner Counter-spinning Ring */}
        <div
          className="absolute w-11 h-11 rounded-full border-2 border-outline-variant/20 border-b-[#b9f474] border-l-primary animate-spin"
          style={{ animationDirection: 'reverse', animationDuration: '1.2s' }}
        />

        {/* Center Icon */}
        <div className="absolute w-8 h-8 rounded-full bg-surface-container-lowest shadow-md flex items-center justify-center text-primary">
          <span className="material-symbols-outlined text-[18px] animate-pulse">eco</span>
        </div>
      </div>

      {/* Title */}
      <h3 className="font-headline-sm text-lg sm:text-xl font-extrabold text-on-surface tracking-tight mb-1.5">
        {title}
      </h3>

      {/* Subtitle */}
      <p className="font-body-md text-xs sm:text-sm text-on-surface-variant max-w-xs leading-relaxed mb-4">
        {subtitle}
      </p>

      {/* Micro-Progress Bar */}
      <div className="w-40 h-1 bg-surface-container-high rounded-full overflow-hidden relative">
        <div
          className="h-full bg-gradient-to-r from-primary via-[#3e6a00] to-[#b9f474] rounded-full animate-progress"
          style={{
            width: '60%',
            animation: 'loaderSlide 1.6s ease-in-out infinite alternate',
          }}
        />
      </div>

      <style>{`
        @keyframes loaderSlide {
          0% { transform: translateX(-80%); }
          100% { transform: translateX(80%); }
        }
      `}</style>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface/90 backdrop-blur-md">
        {content}
      </div>
    );
  }

  return (
    <div className={`w-full flex items-center justify-center ${minHeight}`}>
      {content}
    </div>
  );
}
