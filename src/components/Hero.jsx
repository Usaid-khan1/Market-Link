import React, { useState, useEffect, useRef } from 'react';

export default function Hero({
  onSearch,
  searchQuery,
  selectedDay,
  selectedCategory,
  onNavigate
}) {
  const [localQuery, setLocalQuery] = useState(searchQuery || '');
  const [localDay, setLocalDay] = useState(selectedDay || 'any');
  const [localCat, setLocalCat] = useState(selectedCategory || 'all');
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ query: localQuery, day: localDay, category: localCat });
  };

  const stats = [
    { icon: 'verified', label: '100% Free Reservations', color: 'text-primary' },
    { icon: 'payments', label: 'Pay Cash at Stall', color: 'text-secondary' },
    { icon: 'schedule', label: 'Harvested Under 24h', color: 'text-tertiary' },
    { icon: 'diversity_1', label: '42+ Farm Partners', color: 'text-primary' },
  ];

  return (
    <section
      ref={ref}
      className="relative w-full -mt-20 pt-32 pb-16 overflow-hidden"
      style={{
        background: 'linear-gradient(160deg, #f0f7f1 0%, #fcf9f8 45%, #fff8f0 100%)',
      }}
    >
      {/* Ambient Background Orbs */}
      <div
        className="ambient-orb w-[600px] h-[600px]"
        style={{
          top: '-120px',
          right: '-100px',
          background: 'radial-gradient(circle, rgba(185, 244, 116, 0.25) 0%, transparent 70%)',
          animation: 'float 8s ease-in-out infinite',
        }}
      />
      <div
        className="ambient-orb w-[500px] h-[500px]"
        style={{
          bottom: '-80px',
          left: '-80px',
          background: 'radial-gradient(circle, rgba(176, 242, 180, 0.2) 0%, transparent 70%)',
          animation: 'float 10s ease-in-out infinite reverse',
        }}
      />
      <div
        className="ambient-orb w-[300px] h-[300px]"
        style={{
          top: '30%',
          left: '40%',
          background: 'radial-gradient(circle, rgba(255, 220, 195, 0.15) 0%, transparent 70%)',
          animation: 'float 12s ease-in-out infinite 2s',
        }}
      />

      {/* Subtle grid pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(18, 82, 36, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(18, 82, 36, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="max-w-7xl mx-auto px-gutter relative z-10">
        <div
          className={`flex flex-col items-center text-center max-w-4xl mx-auto transition-all duration-700 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Eyebrow Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 shadow-green-sm border border-primary/15"
            style={{
              background: 'linear-gradient(135deg, rgba(18, 82, 36, 0.06), rgba(62, 106, 0, 0.06))',
              backdropFilter: 'blur(8px)',
            }}
          >
            <span
              className="w-2 h-2 rounded-full bg-primary"
              style={{ animation: 'pulse-glow 2s ease-in-out infinite' }}
            />
            <span className="material-symbols-outlined text-primary text-[16px]">eco</span>
            <span className="font-label-sm text-primary tracking-wide uppercase text-xs font-black">
              100% Local &amp; Seasonal • Pay In-Person at Pickup
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="font-display-lg text-on-surface tracking-tight mb-4 leading-tight">
            Farm Fresh{' '}
            <span className="relative inline-block">
              <span
                className="hero-headline-gradient"
                style={{ backgroundSize: '200% auto' }}
              >
                Just a Click Away
              </span>
            </span>
            {' '}—{' '}
            <span className="italic font-normal text-on-surface-variant">
              Direct From Neighboring Growers
            </span>
          </h1>

          {/* Subtext */}
          <p className="font-body-lg text-on-surface-variant max-w-2xl mb-8 leading-relaxed">
            Discover certified local farmers markets, reserve peak-season produce in advance, then{' '}
            <strong className="text-primary font-bold">pick up fresh</strong> at your weekend market.{' '}
            Zero delivery delays, zero online card fees.
          </p>

          {/* Search & Filter Bar */}
          <div
            className="w-full rounded-2xl p-3 mb-6 border border-outline-variant/20 shadow-[0_8px_32px_rgba(18,82,36,0.1),0_2px_8px_rgba(0,0,0,0.04)]"
            style={{
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(20px)',
            }}
          >
            <form
              id="market-search-form"
              onSubmit={handleSubmit}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-2 items-stretch text-left"
            >
              {/* Location Input */}
              <div className="lg:col-span-4 flex items-center gap-2 bg-surface-container-low/70 px-4 py-3 rounded-xl border border-outline-variant/30 focus-within:border-primary focus-within:bg-white focus-within:shadow-green-sm transition-all duration-200 group">
                <span className="material-symbols-outlined text-primary text-[20px] flex-shrink-0 group-focus-within:scale-110 transition-transform">location_on</span>
                <div className="flex flex-col flex-1 min-w-0">
                  <label className="font-label-sm text-on-surface-variant uppercase text-[10px] font-black tracking-widest" htmlFor="location-query">
                    Pickup Town / ZIP
                  </label>
                  <input
                    id="location-query"
                    type="text"
                    value={localQuery}
                    onChange={(e) => setLocalQuery(e.target.value)}
                    placeholder="Oak Valley, 94022..."
                    className="bg-transparent font-body-md text-on-surface placeholder:text-outline/60 focus:outline-none w-full text-sm"
                  />
                </div>
              </div>

              {/* Market Day Dropdown */}
              <div className="lg:col-span-3 flex items-center gap-2 bg-surface-container-low/70 px-4 py-3 rounded-xl border border-outline-variant/30 focus-within:border-primary focus-within:bg-white focus-within:shadow-green-sm transition-all duration-200 group">
                <span className="material-symbols-outlined text-primary text-[20px] flex-shrink-0 group-focus-within:scale-110 transition-transform">calendar_month</span>
                <div className="flex flex-col flex-1 min-w-0">
                  <label className="font-label-sm text-on-surface-variant uppercase text-[10px] font-black tracking-widest" htmlFor="market-day-select">
                    Market Day
                  </label>
                  <select
                    id="market-day-select"
                    value={localDay}
                    onChange={(e) => setLocalDay(e.target.value)}
                    className="bg-transparent font-body-md text-on-surface focus:outline-none w-full cursor-pointer text-sm"
                  >
                    <option value="any">Any Market Day</option>
                    <option value="sat">Saturday Morning</option>
                    <option value="sun">Sunday Morning</option>
                    <option value="wed">Wednesday Twilight</option>
                  </select>
                </div>
              </div>

              {/* Category Dropdown */}
              <div className="lg:col-span-3 flex items-center gap-2 bg-surface-container-low/70 px-4 py-3 rounded-xl border border-outline-variant/30 focus-within:border-primary focus-within:bg-white focus-within:shadow-green-sm transition-all duration-200 group">
                <span className="material-symbols-outlined text-primary text-[20px] flex-shrink-0 group-focus-within:scale-110 transition-transform">compost</span>
                <div className="flex flex-col flex-1 min-w-0">
                  <label className="font-label-sm text-on-surface-variant uppercase text-[10px] font-black tracking-widest" htmlFor="harvest-cat-select">
                    Produce Type
                  </label>
                  <select
                    id="harvest-cat-select"
                    value={localCat}
                    onChange={(e) => setLocalCat(e.target.value)}
                    className="bg-transparent font-body-md text-on-surface focus:outline-none w-full cursor-pointer text-sm"
                  >
                    <option value="all">All Produce</option>
                    <option value="veg">Organic Vegetables</option>
                    <option value="fruit">Orchard Fruits</option>
                    <option value="honey">Raw Honey</option>
                    <option value="dairy">Pasture Dairy</option>
                    <option value="bread">Artisan Breads</option>
                  </select>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="lg:col-span-2 w-full">
                <button
                  type="submit"
                  className="w-full h-full min-h-[58px] font-bold text-sm px-4 rounded-xl shadow-green-md transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 cursor-pointer hover:shadow-green-lg hover:-translate-y-0.5"
                  style={{
                    background: 'linear-gradient(135deg, #914d00, #6e3900)',
                    color: 'white',
                  }}
                >
                  <span className="material-symbols-outlined text-[20px]">search</span>
                  <span>Find Markets</span>
                </button>
              </div>
            </form>
          </div>

          {/* Secondary CTA Navigation */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
            <button
              onClick={() => onNavigate('products')}
              className="group font-semibold text-sm text-primary hover:text-primary-container inline-flex items-center gap-2 transition-all duration-200 cursor-pointer"
            >
              <span>Browse All Available Products</span>
              <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform duration-200">arrow_forward</span>
            </button>
            <span className="w-1 h-1 rounded-full bg-outline-variant" />
            <button
              onClick={() => onNavigate('markets')}
              className="group font-semibold text-sm text-on-surface-variant hover:text-primary inline-flex items-center gap-2 transition-all duration-200 cursor-pointer"
            >
              <span>View Full Market Map &amp; Schedule</span>
              <span className="material-symbols-outlined text-[18px] group-hover:rotate-12 transition-transform duration-200">explore</span>
            </button>
          </div>

          {/* Trust Indicators Row */}
          <div
            className="w-full py-4 rounded-2xl flex flex-wrap items-center justify-center gap-x-8 gap-y-3 border border-outline-variant/20"
            style={{
              background: 'rgba(255, 255, 255, 0.6)',
              backdropFilter: 'blur(12px)',
            }}
          >
            {stats.map((stat, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-2 font-semibold text-xs"
              >
                <span className={`material-symbols-outlined text-[16px] ${stat.color}`}>{stat.icon}</span>
                <span className="text-on-surface">{stat.label}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
