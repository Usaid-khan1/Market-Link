import React, { useState, useEffect, useRef } from 'react';

export default function Hero({
  onSearch,
  searchQuery,
  selectedDay,
  selectedCategory,
  onNavigate,
  videoSrc = 'https://res.cloudinary.com/dkscvg8pg/video/upload/v1790464415/Farmer_walking_with_basket_1080p_20260927041313_szrddw.mp4',
}) {
  const [localQuery, setLocalQuery] = useState(searchQuery || '');
  const [localDay, setLocalDay] = useState(selectedDay || 'any');
  const [localCat, setLocalCat] = useState(selectedCategory || 'all');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);
  const dropdownRef = useRef(null);
  const videoRef = useRef(null);

  const marketDayOptions = [
    { value: 'any', label: 'Any Market Day' },
    { value: 'sat', label: 'Saturday Morning' },
    { value: 'sun', label: 'Sunday Morning' },
    { value: 'wed', label: 'Wednesday Twilight' },
  ];

  useEffect(() => {
    setLocalDay(selectedDay || 'any');
  }, [selectedDay]);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {});
    }
  }, [videoSrc]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ query: localQuery, day: localDay, category: localCat });
  };

  const benefits = [
    { icon: 'psychiatry', label: '100% Free Reservations' },
    { icon: 'payments', label: 'Pay Cash at Stall' },
    // { icon: 'schedule', label: 'Harvested Under 24h' },
    { icon: 'diversity_1', label: '42+ Farm Partners' },
  ];

  return (
    <section
      ref={ref}
      className="relative w-full min-h-[780px] lg:h-screen lg:max-h-[1050px] flex flex-col justify-center overflow-hidden"
    >
      {/* ============================================================
          CINEMATIC FARM BACKGROUND (Looping Video)
          ============================================================ */}
      <div className="absolute inset-0 w-full h-full pointer-events-none select-none overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          poster="/farm-hero-bg.jpg"
          className="w-full h-full object-cover object-center transform scale-105"
          src={videoSrc}
        />

        {/* Left Dark-to-Transparent Gradient Overlay for perfect text contrast */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(90deg, rgba(7, 35, 18, 0.78) 0%, rgba(7, 35, 18, 0.46) 42%, rgba(7, 35, 18, 0.12) 80%, rgba(7, 35, 18, 0.02) 100%)',
          }}
        />

        {/* Bottom subtle gradient blend */}
        <div
          className="absolute bottom-0 left-0 right-0 h-24"
          style={{
            background:
              'linear-gradient(180deg, transparent 0%, rgba(7, 35, 18, 0.25) 70%, #fcf9f8 100%)',
          }}
        />
      </div>

      {/* ============================================================
          HERO CONTENT (Left Aligned, exactly matching reference image)
          ============================================================ */}
      <div className="max-w-[1360px] mx-auto w-full px-5 sm:px-10 lg:px-16 pt-28 sm:pt-36 pb-14 relative z-10 flex flex-col items-start text-left">
        <div
          className={`flex flex-col items-start max-w-[700px] transition-all duration-700 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          {/* Eyebrow Badge */}
          <div
            className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full mb-5 shadow-sm border border-white/20"
            style={{
              background: 'rgba(7, 35, 18, 0.58)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <div className="w-5 h-5 rounded-full bg-[#27ae60] flex items-center justify-center text-white flex-shrink-0">
              <span className="material-symbols-outlined text-[14px]">eco</span>
            </div>
            <span className="text-white text-[11px] sm:text-[11.5px] font-extrabold uppercase tracking-wider">
              100% Local &amp; Seasonal
            </span>
            <span className="text-white/40 text-xs">|</span>
            <span className="text-white text-[11px] sm:text-[11.5px] font-extrabold uppercase tracking-wider">
              Pay In-Person at Pickup
            </span>
          </div>

          {/* Main Hero Heading */}
          <h1 className="font-sans text-5xl sm:text-6xl md:text-7xl lg:text-[76px] font-black leading-[0.98] tracking-[-1.5px] sm:tracking-[-2.5px] mb-4">
            <span className="text-white block">Farm Fresh</span>
            <span className="text-[#54d62c] block mt-1">Just a Click Away</span>
          </h1>

          {/* Hero Description */}
          <p className="font-sans text-[#dce8de] text-base sm:text-lg lg:text-[17.5px] leading-relaxed max-w-[640px] mb-7 font-normal">
            Discover certified local farmers markets, reserve peak-season produce in advance, then{' '}
            <strong className="text-white font-bold">pick up fresh</strong> at your weekend market.{' '}
            Zero delivery delays, zero online card fees.
          </p>

          {/* Market Search / Filter Glass Panel */}
          <div
            className="w-full max-w-[1080px] rounded-3xl md:rounded-full p-2 sm:p-2.5 mb-6 border border-white/60 shadow-[0_16px_45px_rgba(0,0,0,0.22)]"
            style={{
              background: 'rgba(255, 255, 255, 0.90)',
              backdropFilter: 'blur(20px)',
              position: 'relative',
              zIndex: 40,
            }}
          >
            <form
              id="market-search-form"
              onSubmit={handleSubmit}
              className="flex flex-col md:flex-row items-stretch md:items-center gap-1.5 sm:gap-2 w-full"
            >
              {/* FILTER 1: Market Day (Custom Dropdown on LEFT - 40% width) */}
              <div
                ref={dropdownRef}
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{ position: 'relative', zIndex: 45 }}
                className={`w-full md:w-[40%] md:flex-[40] flex items-center gap-3 pl-4 sm:pl-6 pr-4 py-2 rounded-full transition-all group cursor-pointer select-none ${
                  localDay !== 'any'
                    ? 'bg-[#eef8f1] border border-[#bde5c8] shadow-sm'
                    : 'hover:bg-black/[0.02]'
                }`}
              >
                <div className="w-9 h-9 rounded-full bg-[#dcf3e4] text-[#125224] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[19px]">calendar_month</span>
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-sans text-[9px] font-black uppercase text-[#637565] tracking-wider cursor-pointer">
                      Market Day
                    </span>
                    {localDay !== 'any' && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#278638] animate-pulse" />
                    )}
                  </div>
                  <span
                    className={`font-sans font-bold text-sm truncate ${
                      localDay !== 'any' ? 'text-[#0b3d20]' : 'text-[#112615]'
                    }`}
                  >
                    {marketDayOptions.find((o) => o.value === localDay)?.label || 'Any Market Day'}
                  </span>
                </div>
                <span
                  className={`material-symbols-outlined text-[18px] text-[#637565] flex-shrink-0 transition-transform duration-200 ${
                    dropdownOpen ? 'rotate-180 text-[#125224]' : ''
                  }`}
                >
                  expand_more
                </span>

                {/* Custom Floating Glass Dropdown Menu */}
                {dropdownOpen && (
                  <div
                    className="absolute top-[calc(100%+12px)] left-0 right-0 sm:min-w-[240px] border border-white/80 rounded-2xl p-1.5 animate-slide-down"
                    style={{
                      position: 'absolute',
                      zIndex: 9999,
                      background: 'rgba(255, 255, 255, 0.98)',
                      backdropFilter: 'blur(24px)',
                      boxShadow: '0 24px 60px rgba(7, 35, 18, 0.35), 0 4px 16px rgba(0, 0, 0, 0.1)',
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {marketDayOptions.map((opt) => {
                      const isSelected = localDay === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => {
                            setLocalDay(opt.value);
                            setDropdownOpen(false);
                            // On select activate filter immediately
                            onSearch({ query: localQuery, day: opt.value, category: localCat });
                          }}
                          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer text-left ${
                            isSelected
                              ? 'bg-[#eef8f1] text-[#0b3d20] font-bold shadow-sm'
                              : 'text-[#2e3d30] hover:bg-black/5 hover:text-[#0b3d20]'
                          }`}
                        >
                          <span>{opt.label}</span>
                          {isSelected && (
                            <span className="material-symbols-outlined text-[16px] text-[#0b3d20]">
                              check
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Vertical divider on desktop */}
              <div className="w-px h-8 bg-black/10 mx-0.5 hidden md:block flex-shrink-0" />

              {/* FILTER 2: Pickup Town / ZIP (Search bar on RIGHT - 60% width with integrated Search Button) */}
              <div className="w-full md:w-[60%] md:flex-[60] flex items-center justify-between gap-2 pl-4 sm:pl-5 pr-2 py-1.5 hover:bg-black/[0.02] rounded-full transition-all group">
                <div className="flex flex-col flex-1 min-w-0 pr-2">
                  <label
                    htmlFor="location-query"
                    className="font-sans text-[9px] font-black uppercase text-[#637565] tracking-wider cursor-pointer"
                  >
                    Pickup Town / ZIP
                  </label>
                  <input
                    id="location-query"
                    type="text"
                    value={localQuery}
                    onChange={(e) => setLocalQuery(e.target.value)}
                    placeholder="Search"
                    className="bg-transparent font-sans font-bold text-sm text-[#112615] placeholder:text-[#112615]/75 focus:outline-none w-full"
                  />
                </div>

                {/* Search CTA button placed right inside the search bar */}
                <button
                  type="submit"
                  aria-label="Search"
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#278638] hover:bg-[#1f752f] text-white flex items-center justify-center shadow-[0_4px_16px_rgba(39,134,56,0.4)] hover:shadow-[0_6px_22px_rgba(39,134,56,0.6)] hover:scale-105 active:scale-95 transition-all cursor-pointer flex-shrink-0"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    search
                  </span>
                </button>
              </div>
            </form>
          </div>

          {/* Benefits Strip (Directly floating below filter panel) */}
          <div
            className="inline-flex flex-wrap items-center gap-3 sm:gap-6 px-5 sm:px-6 py-2.5 rounded-full border border-white/15 shadow-md"
            style={{
              background: 'rgba(7, 35, 18, 0.52)',
              backdropFilter: 'blur(12px)',
              position: 'relative',
              zIndex: 1,
            }}
          >
            {benefits.map((item, i) => (
              <React.Fragment key={i}>
                <div className="inline-flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#27ae60]/25 border border-[#54d62c]/40 flex items-center justify-center text-[#54d62c] flex-shrink-0">
                    <span className="material-symbols-outlined text-[15px]">{item.icon}</span>
                  </div>
                  <span className="font-sans text-white text-xs sm:text-[13px] font-semibold whitespace-nowrap">
                    {item.label}
                  </span>
                </div>
                {i < benefits.length - 1 && (
                  <span className="text-white/20 select-none hidden sm:inline">|</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
