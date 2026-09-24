import React, { useState } from 'react';

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

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({
      query: localQuery,
      day: localDay,
      category: localCat
    });
  };

  return (
    <section className="relative w-full -mt-20 pt-28 pb-space-xl overflow-hidden bg-gradient-to-b from-surface-container-low via-surface to-surface">
      {/* Ambient Organic Shapes */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-fixed-dim/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 -left-20 w-80 h-80 bg-secondary-fixed/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-gutter relative z-10">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-space-xs bg-surface-container-high px-space-md py-space-xs rounded-full mb-space-md shadow-sm">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span className="font-label-sm text-primary tracking-wide uppercase">
              🌱 100% Local &amp; Seasonal • Pay In-Person at Pickup
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="font-display-lg text-on-surface tracking-tight mb-space-md">
            Farm Fresh Just a Click Away —{' '}
            <span className="italic font-normal text-primary">
              Direct From Neighboring Growers
            </span>
          </h1>

          {/* Subtext */}
          <p className="font-body-lg text-on-surface-variant max-w-3xl mb-space-lg leading-relaxed">
            Discover certified local farmers markets, reserve peak-season fruits, vegetables, artisan cheeses, and honey in advance, then pick up fresh at your weekend market. Zero delivery delays, zero online credit card fees.
          </p>

          {/* Search & Filter Bar Component */}
          <div className="w-full bg-surface-container-lowest rounded-xl p-space-sm sm:p-space-md shadow-xl mb-space-md border border-outline-variant/30">
            <form 
              id="market-search-form"
              onSubmit={handleSubmit}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-space-sm items-center text-left"
            >
              {/* Location Input */}
              <div className="lg:col-span-4 flex items-center gap-space-xs bg-surface-container-low px-space-md py-space-sm rounded-lg border border-outline-variant/40 focus-within:border-primary transition-colors">
                <span className="material-symbols-outlined text-primary text-[22px]">location_on</span>
                <div className="flex flex-col flex-1 min-w-0">
                  <label className="font-label-sm text-on-surface-variant uppercase text-xs" htmlFor="location-query">
                    Pickup Town / ZIP
                  </label>
                  <input
                    id="location-query"
                    type="text"
                    value={localQuery}
                    onChange={(e) => setLocalQuery(e.target.value)}
                    placeholder="Oak Valley, 94022"
                    className="bg-transparent font-body-md text-on-surface placeholder:text-outline focus:outline-none w-full truncate"
                  />
                </div>
              </div>

              {/* Market Day Dropdown */}
              <div className="lg:col-span-3 flex items-center gap-space-xs bg-surface-container-low px-space-md py-space-sm rounded-lg border border-outline-variant/40 focus-within:border-primary transition-colors">
                <span className="material-symbols-outlined text-primary text-[22px]">calendar_month</span>
                <div className="flex flex-col flex-1 min-w-0">
                  <label className="font-label-sm text-on-surface-variant uppercase text-xs" htmlFor="market-day-select">
                    Market Day
                  </label>
                  <select
                    id="market-day-select"
                    value={localDay}
                    onChange={(e) => setLocalDay(e.target.value)}
                    className="bg-transparent font-body-md text-on-surface focus:outline-none w-full cursor-pointer truncate"
                  >
                    <option value="any">Any Market Day</option>
                    <option value="sat">Saturday Morning</option>
                    <option value="sun">Sunday Morning</option>
                    <option value="wed">Wednesday Twilight</option>
                  </select>
                </div>
              </div>

              {/* Category Dropdown */}
              <div className="lg:col-span-3 flex items-center gap-space-xs bg-surface-container-low px-space-md py-space-sm rounded-lg border border-outline-variant/40 focus-within:border-primary transition-colors">
                <span className="material-symbols-outlined text-primary text-[22px]">compost</span>
                <div className="flex flex-col flex-1 min-w-0">
                  <label className="font-label-sm text-on-surface-variant uppercase text-xs" htmlFor="harvest-cat-select">
                    Produce Type
                  </label>
                  <select
                    id="harvest-cat-select"
                    value={localCat}
                    onChange={(e) => setLocalCat(e.target.value)}
                    className="bg-transparent font-body-md text-on-surface focus:outline-none w-full cursor-pointer truncate"
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
                  className="w-full h-full min-h-[52px] bg-tertiary-container hover:bg-tertiary text-on-tertiary font-label-md px-space-md py-space-sm rounded-lg shadow-md transition-all flex items-center justify-center gap-space-xs active:scale-95 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">search</span>
                  <span>Find Markets</span>
                </button>
              </div>
            </form>
          </div>

          {/* Secondary CTA & Direct Navigation */}
          <div className="flex flex-wrap items-center justify-center gap-space-md mb-space-lg">
            <button
              onClick={() => onNavigate('products')}
              className="font-label-md text-primary hover:text-primary-container inline-flex items-center gap-space-xs transition-colors cursor-pointer"
            >
              <span>Browse All Available Products</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
            <span className="text-outline-variant">•</span>
            <button
              onClick={() => onNavigate('markets')}
              className="font-label-md text-on-surface-variant hover:text-primary inline-flex items-center gap-space-xs transition-colors cursor-pointer"
            >
              <span>View Full Market Map &amp; Schedule</span>
              <span className="material-symbols-outlined text-[18px]">explore</span>
            </button>
          </div>

          {/* Trust Indicators Row */}
          <div className="w-full pt-space-md border-t border-outline-variant/40 flex flex-wrap items-center justify-center gap-x-space-lg gap-y-space-xs text-on-surface-variant font-label-sm">
            <span className="inline-flex items-center gap-space-xs text-primary font-bold">
              <span className="material-symbols-outlined text-[16px] text-primary">verified</span> 100% Free Reservations
            </span>
            <span className="inline-flex items-center gap-space-xs text-primary font-bold">
              <span className="material-symbols-outlined text-[16px] text-primary">payments</span> Pay Cash or Card at the Stall
            </span>
            <span className="inline-flex items-center gap-space-xs text-primary font-bold">
              <span className="material-symbols-outlined text-[16px] text-primary">schedule</span> Harvested Under 24h Ago
            </span>
            <span className="inline-flex items-center gap-space-xs text-primary font-bold">
              <span className="material-symbols-outlined text-[16px] text-primary">diversity_1</span> 42+ Local Farm Partners
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
