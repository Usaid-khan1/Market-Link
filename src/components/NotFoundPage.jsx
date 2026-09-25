import React, { useState } from 'react';

export default function NotFoundPage({ onNavigate, onSearch, onOpenFarmerPortal }) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch({ query: searchQuery, day: 'any', category: 'all' });
    } else {
      onNavigate('products');
    }
  };

  const handleCategorySearch = (cat) => {
    if (onSearch) {
      onSearch({ query: '', day: 'any', category: cat });
    } else {
      onNavigate('products');
    }
  };

  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-280px)]">
      {/* 404 Hero Section */}
      <section className="relative w-full overflow-hidden py-space-xl">
        {/* Ambient Glows */}
        <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[720px] h-[360px] bg-secondary-container/20 rounded-full blur-3xl"></div>
        <div className="pointer-events-none absolute top-48 right-12 w-64 h-64 bg-tertiary-fixed/30 rounded-full blur-2xl"></div>

        <div className="max-w-5xl mx-auto px-gutter relative flex flex-col items-center text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-space-xs px-space-md py-space-xs bg-surface-container-low text-primary rounded-full shadow-sm mb-space-lg border border-outline-variant/30">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span className="font-label-sm uppercase tracking-wider text-primary text-xs font-bold">
              Error 404 • Crop Not Found
            </span>
          </div>

          {/* SVG Illustration: Overturned Harvest Basket & Fresh Vegetables */}
          <div className="relative w-full max-w-lg mx-auto mb-space-lg flex items-center justify-center">
            <div className="w-full max-w-md h-72 sm:h-80 flex items-center justify-center relative">
              <svg
                className="w-full h-full drop-shadow-md select-none"
                fill="none"
                viewBox="0 0 540 380"
                xmlns="http://www.w3.org/2000/svg"
              >
                <ellipse cx="270" cy="328" fill="#E5DFDA" fillOpacity="0.6" rx="210" ry="24" />
                <ellipse cx="282" cy="330" fill="#DCD9D9" fillOpacity="0.8" rx="140" ry="14" />
                
                {/* Overturned Woven Basket */}
                <g transform="translate(145, 120) rotate(-18)">
                  <ellipse cx="140" cy="110" fill="#B27439" rx="98" ry="72" />
                  <ellipse cx="132" cy="106" fill="#914D00" rx="90" ry="64" />
                  <ellipse cx="126" cy="102" fill="#6E3900" rx="80" ry="54" />
                  <path
                    d="M 52 82 Q 132 14 212 78"
                    fill="none"
                    stroke="#D18D48"
                    strokeLinecap="round"
                    strokeWidth="14"
                  />
                  <path
                    d="M 54 86 Q 132 20 210 82"
                    fill="none"
                    stroke="#B27439"
                    strokeLinecap="round"
                    strokeWidth="6"
                  />
                  <path
                    d="M 56 104 C 54 168, 92 198, 154 196 C 214 194, 238 152, 232 98"
                    fill="#B27439"
                  />
                  <path
                    d="M 72 108 Q 146 172 216 104"
                    fill="none"
                    stroke="#914D00"
                    strokeDasharray="12 10"
                    strokeWidth="7"
                  />
                  <path
                    d="M 80 128 Q 148 184 206 122"
                    fill="none"
                    stroke="#D18D48"
                    strokeDasharray="14 10"
                    strokeWidth="6"
                  />
                  <path
                    d="M 94 148 Q 148 190 192 144"
                    fill="none"
                    stroke="#7A3F00"
                    strokeDasharray="10 8"
                    strokeWidth="6"
                  />
                  <path
                    d="M 96 112 L 180 190"
                    opacity="0.35"
                    stroke="#7A3F00"
                    strokeWidth="3"
                  />
                  <path
                    d="M 176 110 L 98 186"
                    opacity="0.35"
                    stroke="#7A3F00"
                    strokeWidth="3"
                  />
                </g>

                {/* White Egg / Garlic Bulb */}
                <path
                  d="M 188 238 C 172 258, 162 284, 168 296 C 172 304, 186 308, 202 300 C 220 292, 226 270, 214 246 Z"
                  fill="#F0EDED"
                  opacity="0.9"
                />
                <path
                  d="M 194 252 Q 186 276 190 292"
                  stroke="#C0C9BD"
                  strokeLinecap="round"
                  strokeWidth="2"
                />

                {/* Spilled Carrot with Leafy Greens */}
                <g transform="translate(290, 270)">
                  <path
                    d="M 18 36 C 54 30, 116 18, 142 8 C 146 6, 148 14, 142 18 C 108 38, 52 52, 26 50 C 14 49, 10 40, 18 36 Z"
                    fill="#B85D19"
                  />
                  <path
                    d="M 28 38 C 58 33, 110 22, 136 12"
                    opacity="0.8"
                    stroke="#FFB77D"
                    strokeLinecap="round"
                    strokeWidth="3"
                  />
                  <path d="M 44 42 Q 40 46 38 50" stroke="#914D00" strokeWidth="2" />
                  <path d="M 72 37 Q 68 41 66 45" stroke="#914D00" strokeWidth="2" />
                  <path d="M 104 29 Q 100 33 98 37" stroke="#914D00" strokeWidth="2" />
                  <path
                    d="M 18 38 C 2 34, -14 26, -26 12 C -28 10, -22 8, -18 14 C -10 24, 0 30, 14 34"
                    fill="#2E6B3A"
                  />
                  <path
                    d="M 16 40 C -2 38, -20 38, -36 32 C -38 31, -34 26, -28 28 C -14 32, 2 34, 16 36"
                    fill="#3E6A00"
                  />
                  <path
                    d="M 14 42 C -4 48, -18 56, -28 66 C -30 68, -32 64, -28 58 C -18 46, -2 42, 14 40"
                    fill="#2E6B3A"
                  />
                  <path
                    d="M 16 40 C 2 24, -4 6, 0 -12 C 2 -14, 6 -10, 4 -2 C 2 12, 8 26, 16 36"
                    fill="#437000"
                  />
                </g>

                {/* Radish / Turnip */}
                <g transform="translate(236, 310)">
                  <ellipse cx="28" cy="18" fill="#C5D8BD" rx="14" ry="10" />
                  <ellipse cx="28" cy="18" fill="#A7E9AC" rx="9" ry="6" />
                  <path d="M 28 14 A 4 4 0 1 1 27.9 14" stroke="#2E6B3A" strokeWidth="2" />
                  <path
                    d="M 12 24 C 18 20, 36 20, 44 23 C 48 24, 46 27, 40 27 C 28 27, 10 27, 8 26 C 6 25, 8 24, 12 24 Z"
                    fill="#95D69A"
                  />
                  <path
                    d="M 10 24 L 6 18"
                    stroke="#2E6B3A"
                    strokeLinecap="round"
                    strokeWidth="2"
                  />
                  <circle cx="6" cy="18" fill="#125224" r="1.5" />
                  <path
                    d="M 13 24 L 11 16"
                    stroke="#2E6B3A"
                    strokeLinecap="round"
                    strokeWidth="2"
                  />
                  <circle cx="11" cy="16" fill="#125224" r="1.5" />
                </g>

                {/* Floating Leaves */}
                <g opacity="0.85" transform="translate(132, 88)">
                  <path
                    d="M 12 0 C 22 14, 18 32, 0 38 C 2 22, 10 8, 12 0 Z"
                    fill="#FFB77D"
                  />
                  <path d="M 10 8 Q 8 22 2 30" stroke="#B85D19" strokeWidth="1.5" />
                </g>
                <g opacity="0.7" transform="translate(416, 210)">
                  <path
                    d="M 0 14 C 14 4, 30 10, 32 28 C 18 28, 6 20, 0 14 Z"
                    fill="#B9F474"
                  />
                  <path d="M 8 16 Q 18 20 24 24" stroke="#2E6B3A" strokeWidth="1.5" />
                </g>
              </svg>
            </div>
          </div>

          {/* Heading */}
          <h1 className="font-headline-lg text-headline-lg sm:text-display-lg text-on-surface max-w-2xl tracking-tight mb-space-sm font-bold">
            Looks Like This Basket Is Empty
          </h1>

          {/* Description */}
          <p className="font-body-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed mb-space-lg text-sm sm:text-base">
            The farm stand, produce batch, or harvest page you're looking for might have been gathered early, moved to a different market stall, or never planted in our soil. Don't fret—our regional growers have plenty more in the field.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-space-md mb-space-xl">
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="inline-flex items-center gap-space-xs font-label-lg text-on-tertiary bg-tertiary-container hover:bg-tertiary px-space-lg py-space-sm rounded-full shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer text-sm font-bold"
            >
              <span className="material-symbols-outlined text-[20px]">storefront</span>
              <span>Back to Home</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('products')}
              className="inline-flex items-center gap-space-xs font-label-lg text-primary bg-surface-container-low hover:bg-surface-container px-space-lg py-space-sm rounded-full transition-all cursor-pointer text-sm font-bold border border-outline-variant/30"
            >
              <span className="material-symbols-outlined text-[20px]">nutrition</span>
              <span>Browse Seasonal Harvest</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('markets')}
              className="inline-flex items-center gap-space-xs font-label-lg text-primary bg-surface-container-low hover:bg-surface-container px-space-lg py-space-sm rounded-full transition-all cursor-pointer text-sm font-bold border border-outline-variant/30"
            >
              <span className="material-symbols-outlined text-[20px]">calendar_month</span>
              <span>Find a Weekend Market</span>
            </button>
          </div>

          {/* Recovery Search Box */}
          <div className="w-full max-w-xl bg-surface-container-lowest p-space-sm sm:p-space-md rounded-2xl shadow-sm mb-space-xl text-left border border-outline-variant/30">
            <label className="block font-label-sm text-on-surface-variant mb-space-xs text-xs font-bold" htmlFor="recovery-search">
              Looking for something fresh today?
            </label>
            <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-stretch gap-space-xs">
              <div className="relative flex-1 flex items-center">
                <span className="material-symbols-outlined absolute left-space-sm text-on-surface-variant pointer-events-none text-[20px]">
                  search
                </span>
                <input
                  id="recovery-search"
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search heirloom tomatoes, honey, microgreens..."
                  className="w-full pl-11 pr-space-md py-space-sm bg-surface-container-low rounded-xl text-on-surface font-body-md focus:outline-none focus:bg-surface-container transition-colors text-sm border border-outline-variant/40"
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-space-xs px-space-lg py-space-sm bg-primary hover:bg-primary-container text-on-primary font-label-md rounded-xl transition-colors cursor-pointer text-xs font-bold"
              >
                <span>Search</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </form>
            <div className="flex flex-wrap items-center gap-space-xs mt-space-sm pt-space-xs text-xs">
              <span className="font-label-sm text-on-surface-variant">Popular searches:</span>
              <button
                type="button"
                onClick={() => handleCategorySearch('vegetables')}
                className="font-body-sm text-primary hover:underline px-space-xs py-0.5 rounded bg-surface-container-low cursor-pointer transition-colors"
              >
                Crisp Kale
              </button>
              <button
                type="button"
                onClick={() => handleCategorySearch('fruits')}
                className="font-body-sm text-primary hover:underline px-space-xs py-0.5 rounded bg-surface-container-low cursor-pointer transition-colors"
              >
                Cider Apples
              </button>
              <button
                type="button"
                onClick={() => handleCategorySearch('bakery')}
                className="font-body-sm text-primary hover:underline px-space-xs py-0.5 rounded bg-surface-container-low cursor-pointer transition-colors"
              >
                Artisan Sourdough
              </button>
              <button
                type="button"
                onClick={() => handleCategorySearch('dairy')}
                className="font-body-sm text-primary hover:underline px-space-xs py-0.5 rounded bg-surface-container-low cursor-pointer transition-colors"
              >
                Raw Goat Chevre
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Harvest Wayfinding Section */}
      <section className="w-full bg-surface-container-low py-space-xl border-t border-outline-variant/30">
        <div className="max-w-6xl mx-auto px-gutter">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-space-lg">
            <div>
              <span className="font-label-sm uppercase tracking-wider text-primary text-xs font-bold">
                Harvest Wayfinding
              </span>
              <h2 className="font-headline-md text-headline-md text-on-surface mt-1 font-bold">
                Let Us Help You Find Your Way Back
              </h2>
            </div>
            <p className="font-body-sm text-on-surface-variant mt-space-xs sm:mt-0 max-w-sm text-xs leading-relaxed">
              Select one of our community hubs below or tap straight into current field arrivals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
            
            {/* Card 1: Popular Market Hubs */}
            <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow border border-outline-variant/20">
              <div>
                <div className="w-12 h-12 rounded-xl bg-surface-container-low flex items-center justify-center text-primary mb-space-md">
                  <span className="material-symbols-outlined text-[28px]">explore</span>
                </div>
                <h3 className="font-headline-sm text-on-surface mb-space-xs font-bold text-base">
                  Popular Market Hubs
                </h3>
                <p className="font-body-sm text-on-surface-variant mb-space-md leading-relaxed text-xs">
                  Weekend town squares where dozens of regional farms set up their wooden crates every Saturday &amp; Sunday.
                </p>
                <ul className="flex flex-col gap-space-xs mb-space-md">
                  <li>
                    <button
                      type="button"
                      onClick={() => onNavigate('market-details')}
                      className="w-full group flex items-center justify-between font-label-md text-on-surface hover:text-primary transition-colors py-1 cursor-pointer text-xs"
                    >
                      <span className="flex items-center gap-space-xs">
                        <span className="material-symbols-outlined text-primary text-[18px]">location_on</span>
                        <span>Saturday Downtown Square</span>
                      </span>
                      <span className="font-label-sm text-on-surface-variant group-hover:translate-x-1 transition-transform">
                        8am - 1pm
                      </span>
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => onNavigate('markets')}
                      className="w-full group flex items-center justify-between font-label-md text-on-surface hover:text-primary transition-colors py-1 cursor-pointer text-xs"
                    >
                      <span className="flex items-center gap-space-xs">
                        <span className="material-symbols-outlined text-primary text-[18px]">location_on</span>
                        <span>Oak Valley Sunday Bazaar</span>
                      </span>
                      <span className="font-label-sm text-on-surface-variant group-hover:translate-x-1 transition-transform">
                        9am - 2pm
                      </span>
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => onNavigate('markets')}
                      className="w-full group flex items-center justify-between font-label-md text-on-surface hover:text-primary transition-colors py-1 cursor-pointer text-xs"
                    >
                      <span className="flex items-center gap-space-xs">
                        <span className="material-symbols-outlined text-primary text-[18px]">location_on</span>
                        <span>Riverside Harvest Green</span>
                      </span>
                      <span className="font-label-sm text-on-surface-variant group-hover:translate-x-1 transition-transform">
                        Wednesdays
                      </span>
                    </button>
                  </li>
                </ul>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('markets')}
                className="inline-flex items-center gap-space-xs font-label-md text-primary hover:underline pt-space-xs cursor-pointer text-xs font-bold"
              >
                <span>View all market schedules</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>

            {/* Card 2: In-Season Favorites */}
            <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow border border-outline-variant/20">
              <div>
                <div className="w-12 h-12 rounded-xl bg-surface-container-low flex items-center justify-center text-primary mb-space-md">
                  <span className="material-symbols-outlined text-[28px]">eco</span>
                </div>
                <h3 className="font-headline-sm text-on-surface mb-space-xs font-bold text-base">
                  In-Season Favorites
                </h3>
                <p className="font-body-sm text-on-surface-variant mb-space-md leading-relaxed text-xs">
                  Curated crop selections freshly picked by neighboring growers ready for pickup reservation.
                </p>
                <div className="flex flex-col gap-space-sm mb-space-md">
                  <button
                    type="button"
                    onClick={() => onNavigate('product-details')}
                    className="w-full flex items-center justify-between p-space-xs rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-space-sm">
                      <span className="material-symbols-outlined text-tertiary text-[20px]">nutrition</span>
                      <div className="text-left">
                        <p className="font-label-sm text-on-surface text-xs font-bold">Heirloom Brandywine</p>
                        <p className="font-body-sm text-on-surface-variant text-[11px]">Cedar Ridge Organic Farm</p>
                      </div>
                    </div>
                    <span className="font-label-sm text-primary text-xs font-bold">$4.50/lb</span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => onNavigate('products')}
                    className="w-full flex items-center justify-between p-space-xs rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-space-sm">
                      <span className="material-symbols-outlined text-tertiary text-[20px]">hive</span>
                      <div className="text-left">
                        <p className="font-label-sm text-on-surface text-xs font-bold">Wildflower Raw Honey</p>
                        <p className="font-body-sm text-on-surface-variant text-[11px]">Meadowview Apiary</p>
                      </div>
                    </div>
                    <span className="font-label-sm text-primary text-xs font-bold">$12.00/jar</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onNavigate('products')}
                    className="w-full flex items-center justify-between p-space-xs rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-space-sm">
                      <span className="material-symbols-outlined text-tertiary text-[20px]">bakery_dining</span>
                      <div className="text-left">
                        <p className="font-label-sm text-on-surface text-xs font-bold">Rustic Country Loaf</p>
                        <p className="font-body-sm text-on-surface-variant text-[11px]">Old Mill Hearth Bakery</p>
                      </div>
                    </div>
                    <span className="font-label-sm text-primary text-xs font-bold">$7.50/ea</span>
                  </button>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('products')}
                className="inline-flex items-center gap-space-xs font-label-md text-primary hover:underline pt-space-xs cursor-pointer text-xs font-bold"
              >
                <span>Explore all 140+ fresh items</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>

            {/* Card 3: Need Community Help? */}
            <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow border border-outline-variant/20">
              <div>
                <div className="w-12 h-12 rounded-xl bg-surface-container-low flex items-center justify-center text-primary mb-space-md">
                  <span className="material-symbols-outlined text-[28px]">volunteer_activism</span>
                </div>
                <h3 className="font-headline-sm text-on-surface mb-space-xs font-bold text-base">
                  Need Community Help?
                </h3>
                <p className="font-body-sm text-on-surface-variant mb-space-md leading-relaxed text-xs">
                  Our market volunteers and desk coordinators are always nearby to point you toward specific growers or answer pickup questions.
                </p>
                <div className="bg-surface-container-low rounded-xl p-space-md flex flex-col gap-space-xs mb-space-md border border-outline-variant/20">
                  <div className="flex items-center gap-space-xs text-on-surface font-label-md text-xs font-bold">
                    <span className="material-symbols-outlined text-primary text-[18px]">call</span>
                    <span>(503) 555-FARM</span>
                  </div>
                  <p className="font-body-sm text-on-surface-variant text-[11px]">
                    Staffed Friday – Sunday, 7:00 AM – 3:00 PM PST.
                  </p>
                  <div className="mt-space-xs flex items-center gap-space-xs text-on-surface font-label-md text-xs font-bold">
                    <span className="material-symbols-outlined text-primary text-[18px]">mail</span>
                    <span>support@marketlink.local</span>
                  </div>
                </div>
                <p className="font-body-sm text-on-surface-variant text-[11px] leading-normal italic">
                  Remember: MarketLink reservations require zero online cards. You pay the grower directly at their stand!
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('contact-us')}
                className="inline-flex items-center gap-space-xs font-label-md text-primary hover:underline pt-space-xs cursor-pointer text-xs font-bold"
              >
                <span>Visit the Help &amp; FAQ Desk</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Regional Grower CTA Banner */}
      <section className="w-full py-space-xl">
        <div className="max-w-4xl mx-auto px-gutter text-center">
          <div className="p-space-lg sm:p-space-xl rounded-3xl bg-secondary-container/30 flex flex-col sm:flex-row items-center justify-between gap-space-lg text-left border border-secondary-fixed/40">
            <div className="flex items-center gap-space-md">
              <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-on-primary shrink-0 shadow-md">
                <span className="material-symbols-outlined text-[32px]">agriculture</span>
              </div>
              <div>
                <h4 className="font-headline-sm text-on-surface font-bold text-base sm:text-lg">
                  Are you a regional grower or producer?
                </h4>
                <p className="font-body-sm text-on-surface-variant mt-0.5 text-xs sm:text-sm">
                  List your stall inventory for community reservations with zero fees.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => (onOpenFarmerPortal ? onOpenFarmerPortal() : onNavigate('register'))}
              className="whitespace-nowrap inline-flex items-center gap-space-xs font-label-md text-primary bg-surface-container-lowest hover:bg-surface-container px-space-lg py-space-sm rounded-full transition-colors shadow-sm cursor-pointer text-xs font-bold"
            >
              <span>Farmer Partner Portal</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
