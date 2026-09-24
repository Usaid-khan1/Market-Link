import React, { useState, useMemo } from 'react';
import { DIRECTORY_MARKETS } from '../data/mockData';

export default function MarketsDirectory({ onNavigate, onReserveForMarket }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeChip, setActiveChip] = useState('all');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedDay, setSelectedDay] = useState('all');
  const [distanceRadius, setDistanceRadius] = useState('10');

  // Map state
  const [selectedMarketId, setSelectedMarketId] = useState(1);
  const [popupVisible, setPopupVisible] = useState(true);
  const [mapZoom, setMapZoom] = useState(1);

  // Filter chips list
  const chips = [
    { id: 'all', label: 'All Days' },
    { id: 'saturday', label: 'Saturday Morning' },
    { id: 'sunday', label: 'Sunday Afternoon' },
    { id: 'midweek', label: 'Midweek Evening' },
    { id: 'dog-friendly', label: 'Dog Friendly' },
    { id: 'ebt', label: 'EBT / SNAP' }
  ];

  // Filtering logic
  const filteredMarkets = useMemo(() => {
    return DIRECTORY_MARKETS.filter((m) => {
      // Search term
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const text = `${m.title} ${m.address} ${m.region} ${m.tags.join(' ')}`.toLowerCase();
        if (!text.includes(q)) return false;
      }

      // Region
      if (selectedRegion !== 'all' && m.region !== selectedRegion) {
        return false;
      }

      // Day dropdown
      if (selectedDay !== 'all') {
        if (selectedDay === 'saturday' && m.day !== 'saturday') return false;
        if (selectedDay === 'sunday' && m.day !== 'sunday') return false;
        if (selectedDay === 'wednesday' && m.day !== 'wednesday') return false;
      }

      // Filter chip
      if (activeChip === 'saturday' && m.day !== 'saturday') return false;
      if (activeChip === 'sunday' && m.day !== 'sunday') return false;
      if (activeChip === 'midweek' && m.day !== 'wednesday') return false;
      if (activeChip === 'dog-friendly' && !m.features?.includes('dog-friendly')) return false;
      if (activeChip === 'ebt' && !m.features?.includes('ebt')) return false;

      return true;
    });
  }, [searchTerm, activeChip, selectedRegion, selectedDay]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setActiveChip('all');
    setSelectedRegion('all');
    setSelectedDay('all');
    setDistanceRadius('10');
  };

  const handlePinClick = (id) => {
    setSelectedMarketId(id);
    setPopupVisible(true);
  };

  // Currently active market for the map popup
  const activeMarket = DIRECTORY_MARKETS.find((m) => m.id === selectedMarketId) || DIRECTORY_MARKETS[0];

  return (
    <div className="w-full flex flex-col">
      {/* Breadcrumbs & Hero Header Section */}
      <section className="w-full bg-surface-container-low py-space-lg px-gutter">
        <div className="max-w-7xl mx-auto flex flex-col gap-space-sm">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-space-xs text-on-surface-variant font-label-sm">
            <button
              onClick={() => onNavigate('home')}
              className="hover:text-primary transition-colors cursor-pointer"
            >
              Home
            </button>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-on-surface-variant">Markets</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-primary font-bold">Regional Directory</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-md pt-space-xs">
            <div className="max-w-3xl flex flex-col gap-space-xs">
              <span className="font-label-sm uppercase tracking-wider text-secondary flex items-center gap-space-xs font-bold">
                <span className="material-symbols-outlined text-[18px]">storefront</span>
                Certified Producer Network
              </span>
              <h1 className="font-headline-lg text-primary tracking-tight font-bold">
                Find Certified Local Farmers Markets Near You
              </h1>
              <p className="font-body-md text-on-surface-variant leading-relaxed">
                Reserve fresh harvest directly from neighboring family farms. Always free stall holds, zero delivery miles, and 100% pay-in-person at your weekend market pavilion.
              </p>
            </div>

            {/* Quick Stats Pills */}
            <div className="flex flex-wrap lg:flex-col items-start gap-space-xs shrink-0">
              <div className="inline-flex items-center gap-space-xs px-space-md py-space-xs rounded-full bg-surface-container shadow-sm font-label-sm text-on-surface">
                <span className="w-2 h-2 rounded-full bg-secondary"></span>
                <span>14 Active Pavilions</span>
              </div>
              <div className="inline-flex items-center gap-space-xs px-space-md py-space-xs rounded-full bg-surface-container shadow-sm font-label-sm text-on-surface">
                <span className="material-symbols-outlined text-primary text-[16px]">yard</span>
                <span>180+ Local Growers</span>
              </div>
              <div className="inline-flex items-center gap-space-xs px-space-md py-space-xs rounded-full bg-surface-container shadow-sm font-label-sm text-on-surface">
                <span className="material-symbols-outlined text-tertiary text-[16px]">toll</span>
                <span>Cash, Cards &amp; SNAP Tokens</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main 12-Column Split: Listings & Interactive Map */}
      <section className="w-full max-w-7xl mx-auto px-gutter py-space-lg">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
          {/* Left Column: Search, Filters & Cards (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-space-md">
            {/* Search & Filter Controls */}
            <div className="p-space-md bg-surface-container-lowest rounded-xl shadow-sm flex flex-col gap-space-md border border-outline-variant/30">
              {/* Text Search Bar */}
              <div className="relative w-full">
                <span className="material-symbols-outlined absolute left-space-md top-1/2 -translate-y-1/2 text-on-surface-variant text-[22px]">
                  search
                </span>
                <input
                  id="marketSearchInput"
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by market name, town, or neighborhood (e.g. Oak Valley, Riverside)..."
                  className="w-full bg-surface-container-low pl-12 pr-space-md py-space-sm rounded-lg font-body-sm text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface transition-all border border-outline-variant/40"
                />
              </div>

              {/* Quick Filter Chips */}
              <div className="flex items-center gap-space-xs overflow-x-auto pb-space-xs scrollbar-none" id="chipContainer">
                {chips.map((chip) => {
                  const isActive = activeChip === chip.id;
                  return (
                    <button
                      key={chip.id}
                      onClick={() => setActiveChip(chip.id)}
                      type="button"
                      className={`filter-chip px-space-md py-1.5 rounded-full font-label-sm shadow-sm whitespace-nowrap transition-all cursor-pointer ${
                        isActive
                          ? 'active-chip bg-primary text-on-primary font-bold'
                          : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                      }`}
                    >
                      {chip.label}
                    </button>
                  );
                })}
              </div>

              {/* Refined Dropdowns Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-xs pt-space-xs">
                <div className="flex flex-col gap-0.5">
                  <label className="font-label-sm text-on-surface-variant text-[11px] uppercase tracking-wider">
                    Area / Region
                  </label>
                  <select
                    id="regionFilter"
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                    className="w-full bg-surface-container-low px-space-sm py-1.5 rounded-lg font-body-sm text-on-surface focus:outline-none cursor-pointer border border-outline-variant/40"
                  >
                    <option value="all">All Regions</option>
                    <option value="downtown">Downtown Metro</option>
                    <option value="oak-valley">North Oak Valley</option>
                    <option value="riverside">East Riverside</option>
                    <option value="sunnybrook">Sunnybrook Valley</option>
                    <option value="pine-creek">Pine Creek Foothills</option>
                  </select>
                </div>

                <div className="flex flex-col gap-0.5">
                  <label className="font-label-sm text-on-surface-variant text-[11px] uppercase tracking-wider">
                    Market Day
                  </label>
                  <select
                    id="dayFilter"
                    value={selectedDay}
                    onChange={(e) => setSelectedDay(e.target.value)}
                    className="w-full bg-surface-container-low px-space-sm py-1.5 rounded-lg font-body-sm text-on-surface focus:outline-none cursor-pointer border border-outline-variant/40"
                  >
                    <option value="all">Any Day</option>
                    <option value="saturday">Saturday</option>
                    <option value="sunday">Sunday</option>
                    <option value="wednesday">Wednesday</option>
                  </select>
                </div>

                <div className="flex flex-col gap-0.5">
                  <label className="font-label-sm text-on-surface-variant text-[11px] uppercase tracking-wider">
                    Distance Radius
                  </label>
                  <select
                    value={distanceRadius}
                    onChange={(e) => setDistanceRadius(e.target.value)}
                    className="w-full bg-surface-container-low px-space-sm py-1.5 rounded-lg font-body-sm text-on-surface focus:outline-none cursor-pointer border border-outline-variant/40"
                  >
                    <option value="10">Within 10 miles</option>
                    <option value="25">Within 25 miles</option>
                    <option value="50">Within 50 miles</option>
                  </select>
                </div>
              </div>

              {/* Counter Bar & Reset */}
              <div className="flex items-center justify-between pt-space-xs">
                <p className="font-label-sm text-on-surface-variant flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-[16px] text-secondary">verified</span>
                  <span>
                    Showing <strong className="text-on-surface font-bold">{filteredMarkets.length}</strong> verified market pavilions
                  </span>
                </p>
                <button
                  id="resetFiltersBtn"
                  onClick={handleResetFilters}
                  className="font-label-sm text-primary hover:text-primary-container transition-colors flex items-center gap-0.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">restart_alt</span>
                  Reset Filters
                </button>
              </div>
            </div>

            {/* Market Cards Feed */}
            <div className="flex flex-col gap-space-md" id="marketCardList">
              {filteredMarkets.length === 0 ? (
                <div className="p-space-xl bg-surface-container-lowest rounded-xl text-center shadow-sm">
                  <span className="material-symbols-outlined text-primary text-[48px] mb-space-sm">storefront</span>
                  <h3 className="font-headline-md text-on-surface">No market pavilions found</h3>
                  <p className="font-body-sm text-on-surface-variant mt-1 mb-space-md">
                    Try changing your area or day filters to find nearby weekend markets.
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="bg-primary hover:bg-primary-container text-on-primary font-label-md px-space-lg py-space-xs rounded-full shadow-sm cursor-pointer"
                  >
                    Show All Pavilions
                  </button>
                </div>
              ) : (
                filteredMarkets.map((market) => {
                  const isSelected = selectedMarketId === market.id;
                  return (
                    <article
                      key={market.id}
                      onClick={() => handlePinClick(market.id)}
                      className={`market-card p-space-md bg-surface-container-lowest rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col gap-space-sm border cursor-pointer ${
                        isSelected ? 'border-primary ring-2 ring-primary/20' : 'border-outline-variant/30'
                      }`}
                    >
                      {/* Top row */}
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-space-sm">
                        <div className="flex items-start gap-space-sm">
                          <div className={`w-10 h-10 rounded-full ${market.numBadgeClass} flex items-center justify-center shrink-0 shadow-sm`}>
                            <span className="font-headline-sm font-bold">{market.numBadge}</span>
                          </div>
                          <div>
                            <div className="flex items-center gap-space-xs flex-wrap">
                              <span className="font-label-sm px-space-xs py-0.5 rounded-full bg-surface-container-high text-on-surface">
                                {market.distance}
                              </span>
                              {market.openStatusType === 'pulse' ? (
                                <span className="font-label-sm px-space-xs py-0.5 rounded-full bg-primary text-on-primary flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-secondary-fixed animate-ping"></span>
                                  {market.openStatus}
                                </span>
                              ) : market.openStatusType === 'tertiary' ? (
                                <span className="font-label-sm px-space-xs py-0.5 rounded-full bg-tertiary-container text-on-tertiary">
                                  {market.openStatus}
                                </span>
                              ) : (
                                <span className="font-label-sm px-space-xs py-0.5 rounded-full bg-surface-container-high text-on-surface-variant">
                                  {market.openStatus}
                                </span>
                              )}
                            </div>
                            <h2 className="font-headline-md text-primary font-bold mt-1">
                              {market.title}
                            </h2>
                            <p className="font-body-sm text-on-surface-variant flex items-center gap-1 mt-0.5">
                              <span className="material-symbols-outlined text-[16px]">location_on</span>
                              {market.address}
                            </p>
                          </div>
                        </div>

                        <div className="sm:text-right shrink-0">
                          <span className="font-label-md text-secondary font-bold block">
                            {market.dayText}
                          </span>
                          <span className="font-body-sm text-on-surface-variant">
                            {market.timeText}
                          </span>
                        </div>
                      </div>

                      {/* Visual Stall Highlights Strip (if present) */}
                      {market.visualStalls && market.visualStalls.length > 0 && (
                        <div className="grid grid-cols-3 gap-space-xs py-space-xs">
                          {market.visualStalls.map((stall, sIdx) => (
                            <div key={sIdx} className="h-24 rounded-lg overflow-hidden bg-surface-container relative">
                              <img
                                src={stall.img}
                                alt={stall.alt}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                              />
                              <span className="absolute bottom-1 left-1 bg-surface/90 px-1.5 py-0.5 rounded font-label-sm text-[10px] text-on-surface font-semibold shadow-sm">
                                {stall.title}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Details, Tags & Vendor Count */}
                      <div className="flex flex-col gap-space-xs">
                        <div className="flex items-center gap-space-xs font-label-sm text-on-surface">
                          <span className="material-symbols-outlined text-[18px] text-primary">groups</span>
                          <span>{market.vendorCountText}</span>
                        </div>
                        <div className="flex flex-wrap gap-space-xs">
                          {market.tags.map((tag, tIdx) => (
                            <span
                              key={tIdx}
                              className="font-label-sm px-space-sm py-0.5 rounded-full bg-surface-container text-on-surface-variant text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Stall Policy Banner */}
                      <div className="bg-surface-container-low px-space-md py-space-xs rounded-lg flex items-center justify-between gap-space-xs border border-outline-variant/30">
                        <div className="flex items-center gap-space-xs">
                          <span className="material-symbols-outlined text-[18px] text-secondary">
                            {market.policyIcon || 'payments'}
                          </span>
                          <p className="font-label-sm text-on-surface-variant text-xs">
                            {market.policyText}
                          </p>
                        </div>
                        <span className="font-label-sm text-primary uppercase text-[10px] font-bold shrink-0">
                          {market.policyBadge}
                        </span>
                      </div>

                      {/* Actions Row */}
                      <div className="flex items-center gap-space-sm pt-space-xs">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePinClick(market.id);
                          }}
                          className="flex-1 text-center font-label-md py-space-xs rounded-full bg-tertiary-container hover:bg-tertiary text-on-tertiary shadow-sm transition-colors cursor-pointer"
                        >
                          View Market Details &amp; Stalls
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onReserveForMarket(market.key);
                          }}
                          className="font-label-md px-space-md py-space-xs rounded-full bg-surface-container hover:bg-surface-container-high text-primary transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[18px]">shopping_basket</span>
                          <span>Reserve Produce</span>
                        </button>
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Sticky Map View (5 cols) */}
          <div className="lg:col-span-5 sticky top-24 flex flex-col gap-space-sm">
            {/* Map Container Card */}
            <div className="bg-surface-container-lowest rounded-xl shadow-md overflow-hidden flex flex-col border border-outline-variant/30">
              {/* Map Header / Controls */}
              <div className="p-space-md bg-surface-container-low flex items-center justify-between border-b border-outline-variant/30">
                <div>
                  <h3 className="font-headline-sm text-on-surface font-semibold flex items-center gap-space-xs">
                    <span className="material-symbols-outlined text-primary text-[22px]">map</span>
                    Interactive Market Map
                  </h3>
                  <p className="font-label-sm text-on-surface-variant text-xs">Click pins to inspect location details</p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setMapZoom((z) => Math.min(z + 0.15, 1.45))}
                    className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center text-on-surface shadow-sm hover:bg-surface-container transition-colors cursor-pointer"
                    title="Zoom in"
                  >
                    <span className="material-symbols-outlined text-[18px]">add</span>
                  </button>
                  <button
                    onClick={() => setMapZoom((z) => Math.max(z - 0.15, 0.85))}
                    className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center text-on-surface shadow-sm hover:bg-surface-container transition-colors cursor-pointer"
                    title="Zoom out"
                  >
                    <span className="material-symbols-outlined text-[18px]">remove</span>
                  </button>
                  <button
                    onClick={() => {
                      setMapZoom(1);
                      setSelectedMarketId(1);
                      setPopupVisible(true);
                    }}
                    className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center text-primary shadow-sm hover:bg-surface-container transition-colors cursor-pointer"
                    title="Recenter location"
                  >
                    <span className="material-symbols-outlined text-[18px]">my_location</span>
                  </button>
                </div>
              </div>

              {/* Stylized Map Canvas with Topographic & Street Visuals */}
              <div
                id="mapCanvas"
                className="relative w-full h-[520px] bg-[#E7EBDD] overflow-hidden select-none transition-transform duration-200"
                style={{ transform: `scale(${mapZoom})`, transformOrigin: 'center center' }}
              >
                {/* Map Background Vector Grid & Topo Elements */}
                <svg className="absolute inset-0 w-full h-full opacity-60 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#D3DCBF" strokeWidth="0.75" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#gridPattern)" />
                  {/* Simulated River Flow */}
                  <path d="M -20,280 C 140,240 220,380 500,320" fill="none" opacity="0.8" stroke="#BDD5D8" strokeLinecap="round" strokeWidth="26" />
                  {/* Park Area */}
                  <circle cx="160" cy="180" r="110" fill="#D7E8CE" opacity="0.6" />
                  {/* Road Networks */}
                  <path d="M 0,140 L 500,160" fill="none" stroke="#FAF8F5" strokeWidth="7" />
                  <path d="M 230,0 L 250,550" fill="none" stroke="#FAF8F5" strokeWidth="7" />
                  <path d="M 80,450 L 460,80" fill="none" stroke="#FFFFFF" strokeDasharray="6,4" strokeWidth="4" />
                </svg>

                {/* Map Pins */}
                {DIRECTORY_MARKETS.map((m) => {
                  const isSelected = selectedMarketId === m.id;
                  const isWednesday = m.day === 'wednesday';
                  const isPrimary = m.id === 1;

                  return (
                    <button
                      key={m.id}
                      onClick={() => handlePinClick(m.id)}
                      style={{ top: m.mapPos.top, left: m.mapPos.left }}
                      className={`map-pin absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer focus:outline-none transition-transform ${
                        isSelected ? 'scale-110 z-30' : 'z-10'
                      }`}
                    >
                      <div
                        className={`w-9 h-9 rounded-full shadow-lg flex items-center justify-center ring-2 ring-white transition-all ${
                          isPrimary
                            ? 'bg-primary text-on-primary ring-4'
                            : isWednesday
                            ? 'bg-tertiary text-on-tertiary'
                            : 'bg-secondary text-on-secondary'
                        }`}
                      >
                        <span className="font-label-sm font-bold text-xs">{m.id}</span>
                      </div>
                      <span className="mt-1 bg-surface/95 px-1.5 py-0.5 rounded shadow-sm text-[10px] font-label-sm text-on-surface font-bold pointer-events-none whitespace-nowrap">
                        {m.title.split(' ')[0]} {m.title.split(' ')[1]}
                      </span>
                    </button>
                  );
                })}

                {/* Active Selected Market Callout Popover */}
                {popupVisible && activeMarket && (
                  <div
                    style={{ top: activeMarket.popupPos.top, left: activeMarket.popupPos.left }}
                    className="absolute -translate-x-1/2 z-30 w-72 bg-surface-container-lowest rounded-xl shadow-2xl p-space-sm flex flex-col gap-space-xs transition-all duration-200 border border-outline-variant/40 animate-fade-in"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-space-xs">
                        <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
                        <span className="font-label-sm text-[11px] text-primary font-bold">
                          {activeMarket.popupBadge}
                        </span>
                      </div>
                      <button
                        onClick={() => setPopupVisible(false)}
                        className="text-on-surface-variant hover:text-on-surface text-[14px] cursor-pointer"
                        aria-label="Close popup"
                      >
                        <span className="material-symbols-outlined text-[16px]">close</span>
                      </button>
                    </div>

                    <div className="flex gap-space-xs items-center">
                      <div className="w-14 h-14 rounded-lg bg-surface-container overflow-hidden shrink-0 shadow-sm">
                        <img
                          src={activeMarket.popupImg || activeMarket.visualStalls?.[0]?.img}
                          alt={activeMarket.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-headline-sm text-sm text-primary font-bold truncate">
                          {activeMarket.title}
                        </h4>
                        <p className="font-body-sm text-[12px] text-on-surface-variant truncate">
                          {activeMarket.address}
                        </p>
                        <p className="font-label-sm text-[11px] text-secondary font-bold">
                          {activeMarket.popupStalls}
                        </p>
                      </div>
                    </div>

                    <div className="pt-space-xs flex items-center justify-between gap-space-xs border-t border-outline-variant/20">
                      <a
                        href="#directions"
                        onClick={(e) => {
                          e.preventDefault();
                          alert(`Navigating to ${activeMarket.address}`);
                        }}
                        className="font-label-sm text-[11px] text-primary flex items-center gap-0.5 hover:underline cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[14px]">near_me</span>
                        Directions
                      </a>
                      <button
                        onClick={() => onReserveForMarket(activeMarket.key)}
                        className="font-label-sm text-[11px] px-space-sm py-1 rounded-full bg-tertiary-container text-on-tertiary hover:bg-tertiary transition-colors cursor-pointer"
                      >
                        View Stalls
                      </button>
                    </div>
                  </div>
                )}

                {/* Floating Map Legend */}
                <div className="absolute bottom-space-sm left-space-sm bg-surface/95 backdrop-blur-sm px-space-sm py-space-xs rounded-lg shadow-sm font-label-sm text-[11px] flex flex-col gap-1 z-20 border border-outline-variant/30">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
                    <span className="text-on-surface">Weekend Markets (Sat/Sun)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-tertiary"></span>
                    <span className="text-on-surface">Midweek Twilight Stalls</span>
                  </div>
                </div>

                {/* Offline / Static Notice Badge */}
                <div className="absolute bottom-space-sm right-space-sm bg-surface/90 backdrop-blur-sm px-space-xs py-0.5 rounded text-[10px] text-on-surface-variant font-label-sm pointer-events-none">
                  Map: Regional Agro-Directory Canvas
                </div>
              </div>
            </div>

            {/* In-Person Reminder Card */}
            <div className="p-space-md rounded-xl bg-surface-container-low shadow-sm flex items-start gap-space-sm border border-outline-variant/30">
              <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-on-primary-fixed text-[18px]">verified</span>
              </div>
              <div>
                <p className="font-label-md text-on-surface">Simple Pickup Guarantee</p>
                <p className="font-body-sm text-on-surface-variant text-xs mt-0.5 leading-relaxed">
                  Reserving a produce crate holds your items until 11:30 AM at the farmer stall. Pay directly with your choice of cash, debit card, or SNAP market tokens upon collection.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Community Callout Banner */}
      <section className="w-full bg-surface-container py-space-xl px-gutter mt-space-lg border-t border-outline-variant/30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-space-lg">
          <div className="flex items-center gap-space-md">
            <div className="w-14 h-14 rounded-full bg-primary-fixed flex items-center justify-center text-primary shrink-0 shadow-sm">
              <span className="material-symbols-outlined text-[32px]">add_location_alt</span>
            </div>
            <div className="flex flex-col">
              <h3 className="font-headline-md text-primary font-bold">Don't see your neighborhood market?</h3>
              <p className="font-body-sm text-on-surface-variant mt-1">
                Help expand the community network! Recommend a local gathering or register your family farm as a participating stallholder.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-space-sm shrink-0">
            <button
              onClick={() => onNavigate('contact-us')}
              className="font-label-md px-space-lg py-space-xs rounded-full bg-tertiary-container hover:bg-tertiary text-on-tertiary shadow-sm transition-colors cursor-pointer"
            >
              Nominate a Local Market
            </button>
            <button
              onClick={() => onNavigate('farmer-portal')}
              className="font-label-md px-space-lg py-space-xs rounded-full bg-surface-container-lowest hover:bg-surface-container-high text-primary shadow-sm transition-colors cursor-pointer border border-outline-variant/30"
            >
              Farmer Stallholder Applications
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
