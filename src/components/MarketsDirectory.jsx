import React, { useState, useMemo, useEffect } from 'react';
import { DIRECTORY_MARKETS } from '../data/mockData';
import browseApi from '../api/browse';

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
  const [mapMode, setMapMode] = useState('osm'); // 'osm' | 'stylized'
  const [liveMarkets, setLiveMarkets] = useState([]);

  useEffect(() => {
    let mounted = true;
    browseApi.getMarkets().then((res) => {
      if (mounted && res.data && res.data.length > 0) {
        setLiveMarkets(res.data);
      }
    }).catch(() => {});
    return () => { mounted = false; };
  }, []);

  // Merged markets dataset (live from backend with rich mock fallback data)
  const allMarkets = useMemo(() => {
    if (liveMarkets.length === 0) return DIRECTORY_MARKETS;
    return liveMarkets.map((m, idx) => {
      const fb = DIRECTORY_MARKETS[idx % DIRECTORY_MARKETS.length] || DIRECTORY_MARKETS[0];
      const operatingDays = Array.isArray(m.operating_days)
        ? m.operating_days.join(' & ')
        : (m.operating_days || fb.dayText || 'Every Saturday');
      const timings = m.timings || fb.timeText || '8:00 AM – 1:00 PM';
      const farmersCount = m.farmers_count || m.farmers?.length || 24;

      return {
        id: m.id,
        title: m.market_name || m.title || fb.title,
        address: m.address || fb.address,
        latitude: m.latitude || fb.latitude || 37.7833,
        longitude: m.longitude || fb.longitude || -122.4166,
        region: fb.region || 'downtown',
        schedule: `${operatingDays} • ${timings}`,
        hours: timings,
        day: (Array.isArray(m.operating_days) ? m.operating_days[0] : (m.operating_days || fb.day || 'saturday')).toLowerCase(),
        dayText: operatingDays.startsWith('Every') ? operatingDays : `Every ${operatingDays}`,
        timeText: timings,
        openStatus: fb.openStatus || 'Weekend Market Hub',
        openStatusType: fb.openStatusType || 'pulse',
        growers: `${farmersCount}+ Certified Local Growers`,
        vendorCountText: `${farmersCount} Local Farm Stands & Food Producers`,
        distance: `${(0.8 + idx * 1.4).toFixed(1)} miles away`,
        numBadge: idx + 1,
        numBadgeClass: idx === 0 ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface',
        tags: fb.tags || ['Certified Local', 'EBT/SNAP', 'Family Friendly', 'Heirloom Produce'],
        features: fb.features || ['ebt', 'dog-friendly', 'live-music'],
        policyText: fb.policyText || 'Free produce reservation. Settle directly with grower via cash, card, or market tokens upon collection.',
        policyBadge: fb.policyBadge || 'Zero Online Fees',
        policyIcon: fb.policyIcon || 'payments',
        visualStalls: fb.visualStalls && fb.visualStalls.length > 0 ? fb.visualStalls : [
          {
            title: 'Heirlooms',
            img: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
            alt: 'Organic tomatoes and farm vegetables'
          },
          {
            title: 'Artisan Bakery',
            img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
            alt: 'Freshly baked sourdough and bread'
          },
          {
            title: 'Orchard Fresh',
            img: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=600&q=80',
            alt: 'Organic apples and seasonal fruits'
          }
        ],
        pinLeft: fb.mapPos?.left || `${25 + (idx * 30) % 55}%`,
        pinTop: fb.mapPos?.top || `${20 + (idx * 25) % 55}%`,
        mapPos: fb.mapPos || { top: '30%', left: '45%' },
        popupPos: fb.popupPos || { top: '45%', left: '45%' },
        popupBadge: fb.popupBadge || `${operatingDays} • ${timings}`,
        popupStalls: `${farmersCount} Active Stalls`,
        popupImg: fb.popupImg || fb.visualStalls?.[0]?.img || 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=600&q=80',
        key: m.id === 1 ? 'downtown' : `market-${m.id}`,
        pickupWindow: timings,
        parkingBadge: fb.parkingBadge || 'Free Street & Parking Lot Stalls',
        farmers: m.farmers || [],
      };
    });
  }, [liveMarkets]);

  // Filter chips list
  const chips = [
    { id: 'all', label: 'All Days', icon: 'calendar_today' },
    { id: 'saturday', label: 'Saturday Morning', icon: 'wb_sunny' },
    { id: 'sunday', label: 'Sunday Afternoon', icon: 'wb_twilight' },
    { id: 'midweek', label: 'Midweek Evening', icon: 'nights_stay' },
    { id: 'dog-friendly', label: 'Dog Friendly', icon: 'pets' },
    { id: 'ebt', label: 'EBT / SNAP', icon: 'payments' }
  ];

  // Filtering logic
  const filteredMarkets = useMemo(() => {
    return allMarkets.filter((m) => {
      // Search term
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const text = `${m.title} ${m.address} ${m.region} ${(m.tags || []).join(' ')}`.toLowerCase();
        if (!text.includes(q)) return false;
      }

      // Region
      if (selectedRegion !== 'all' && m.region !== selectedRegion) {
        return false;
      }

      // Day dropdown
      if (selectedDay !== 'all') {
        const scheduleStr = (m.schedule || '').toLowerCase();
        if (selectedDay === 'saturday' && !scheduleStr.includes('saturday')) return false;
        if (selectedDay === 'sunday' && !scheduleStr.includes('sunday')) return false;
        if (selectedDay === 'wednesday' && !scheduleStr.includes('wednesday')) return false;
      }

      // Filter chip
      if (activeChip === 'saturday' && !(m.schedule || '').toLowerCase().includes('saturday')) return false;
      if (activeChip === 'sunday' && !(m.schedule || '').toLowerCase().includes('sunday')) return false;
      if (activeChip === 'midweek' && !(m.schedule || '').toLowerCase().includes('wednesday') && !(m.schedule || '').toLowerCase().includes('thursday')) return false;
      if (activeChip === 'dog-friendly' && !m.features?.includes('dog-friendly')) return false;
      if (activeChip === 'ebt' && !m.features?.includes('ebt')) return false;

      return true;
    });
  }, [allMarkets, searchTerm, activeChip, selectedRegion, selectedDay]);

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
  const activeMarket = allMarkets.find((m) => m.id === selectedMarketId) || allMarkets[0];

  return (
    <div className="w-full flex flex-col bg-surface">
      {/* Breadcrumbs & Hero Header Section */}
      <section className="w-full bg-gradient-to-b from-surface-container-low via-surface to-surface py-space-lg px-gutter border-b border-outline-variant/30">
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
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-bold w-fit">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span>DIRECT REGIONAL PAVILIONS • 100% FARM-TO-HAND</span>
              </div>
              <h1 className="font-headline-lg text-3xl sm:text-4xl text-on-surface font-extrabold tracking-tight mt-1">
                Regional Farmers Markets &amp; Pavilions
              </h1>
              <p className="font-body-md text-sm sm:text-base text-on-surface-variant leading-relaxed">
                Connect directly with family growers across your county. Inspect stall produce, reserve sunrise harvest for free, and pick up in person with zero middleman fees.
              </p>
            </div>

            {/* Quick Stats Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/30 shadow-2xs font-label-sm text-xs font-semibold text-on-surface">
                <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
                <span>14 Active Pavilions</span>
              </div>
              <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/30 shadow-2xs font-label-sm text-xs font-semibold text-on-surface">
                <span className="material-symbols-outlined text-primary text-[17px]">agriculture</span>
                <span>180+ Local Growers</span>
              </div>
              <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/30 shadow-2xs font-label-sm text-xs font-semibold text-on-surface">
                <span className="material-symbols-outlined text-secondary text-[17px]">payments</span>
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
            
            {/* Search & Filter Controls Card */}
            <div className="p-5 bg-surface-container-lowest rounded-2xl shadow-sm flex flex-col gap-4 border border-outline-variant/30">
              
              {/* Text Search Bar */}
              <div className="relative w-full">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary text-[20px]">
                  search
                </span>
                <input
                  id="marketSearchInput"
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by market name, town, neighborhood, or produce type..."
                  className="w-full bg-surface-container-low pl-12 pr-10 py-3 rounded-xl font-body-md text-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/25 focus:bg-white transition-all border border-outline-variant/40"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-surface-container-high hover:bg-surface-container-highest text-on-surface-variant flex items-center justify-center cursor-pointer text-xs"
                    title="Clear search"
                  >
                    <span className="material-symbols-outlined text-[14px]">close</span>
                  </button>
                )}
              </div>

              {/* Quick Filter Chips (Clean wrap pills layout - No scrollbar) */}
              <div className="flex flex-wrap items-center gap-2" id="chipContainer">
                {chips.map((chip) => {
                  const isActive = activeChip === chip.id;
                  return (
                    <button
                      key={chip.id}
                      onClick={() => setActiveChip(chip.id)}
                      type="button"
                      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                        isActive
                          ? 'bg-primary text-white shadow-xs font-bold'
                          : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface hover:bg-surface-container border border-outline-variant/30'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[15px]">{chip.icon}</span>
                      <span>{chip.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Refined Dropdowns Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 border-t border-outline-variant/20">
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-on-surface-variant text-[11px] uppercase tracking-wider">
                    Area / Region
                  </label>
                  <select
                    id="regionFilter"
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                    className="w-full bg-surface-container-low px-3 py-2 rounded-xl font-medium text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/25 cursor-pointer border border-outline-variant/40 transition-colors"
                  >
                    <option value="all">All Regions</option>
                    <option value="downtown">Downtown Metro</option>
                    <option value="oak-valley">North Oak Valley</option>
                    <option value="riverside">East Riverside</option>
                    <option value="sunnybrook">Sunnybrook Valley</option>
                    <option value="pine-creek">Pine Creek Foothills</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-bold text-on-surface-variant text-[11px] uppercase tracking-wider">
                    Market Day
                  </label>
                  <select
                    id="dayFilter"
                    value={selectedDay}
                    onChange={(e) => setSelectedDay(e.target.value)}
                    className="w-full bg-surface-container-low px-3 py-2 rounded-xl font-medium text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/25 cursor-pointer border border-outline-variant/40 transition-colors"
                  >
                    <option value="all">Any Day</option>
                    <option value="saturday">Saturday</option>
                    <option value="sunday">Sunday</option>
                    <option value="wednesday">Wednesday</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-bold text-on-surface-variant text-[11px] uppercase tracking-wider">
                    Distance Radius
                  </label>
                  <select
                    value={distanceRadius}
                    onChange={(e) => setDistanceRadius(e.target.value)}
                    className="w-full bg-surface-container-low px-3 py-2 rounded-xl font-medium text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/25 cursor-pointer border border-outline-variant/40 transition-colors"
                  >
                    <option value="10">Within 10 miles</option>
                    <option value="25">Within 25 miles</option>
                    <option value="50">Within 50 miles</option>
                  </select>
                </div>
              </div>

              {/* Counter Bar & Reset */}
              <div className="flex items-center justify-between pt-2 border-t border-outline-variant/20">
                <p className="font-label-sm text-xs text-on-surface-variant flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>
                    Showing <strong className="text-on-surface font-bold">{filteredMarkets.length}</strong> verified market pavilions
                  </span>
                </p>
                <button
                  id="resetFiltersBtn"
                  onClick={handleResetFilters}
                  className="font-label-sm text-xs text-primary hover:text-primary-container font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[15px]">restart_alt</span>
                  <span>Reset Filters</span>
                </button>
              </div>
            </div>

            {/* Market Cards Feed */}
            <div className="flex flex-col gap-space-md" id="marketCardList">
              {filteredMarkets.length === 0 ? (
                <div className="p-8 bg-surface-container-lowest rounded-2xl text-center shadow-sm border border-outline-variant/30 flex flex-col items-center">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-3">
                    <span className="material-symbols-outlined text-[32px]">storefront</span>
                  </div>
                  <h3 className="font-headline-md text-lg font-bold text-on-surface">No market pavilions found</h3>
                  <p className="font-body-sm text-xs sm:text-sm text-on-surface-variant mt-1 mb-4 max-w-md">
                    Try changing your area or day filters to find nearby weekend markets or clear your search term.
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="bg-primary hover:bg-[#0d3b1c] text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-sm transition-all cursor-pointer"
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
                      className={`p-5 sm:p-6 bg-surface-container-lowest rounded-2xl shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col gap-4 border cursor-pointer group ${
                        isSelected
                          ? 'border-primary ring-2 ring-primary/25 bg-emerald-50/10'
                          : 'border-outline-variant/30 hover:border-primary/40'
                      }`}
                    >
                      {/* Top Row: Title, Distance, Schedule */}
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="flex flex-col min-w-0">
                          {/* Distance & Status row */}
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-surface-container-high text-on-surface">
                              <span className="material-symbols-outlined text-[13px] text-primary">near_me</span>
                              {market.distance}
                            </span>
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300/50">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                              {market.openStatus || 'Weekend Market'}
                            </span>
                          </div>

                          {/* Title */}
                          <h2 className="font-headline-md text-xl sm:text-2xl text-on-surface font-extrabold group-hover:text-primary transition-colors tracking-tight">
                            {market.title}
                          </h2>

                          {/* Location */}
                          <p className="font-body-sm text-xs text-on-surface-variant flex items-center gap-1.5 mt-1">
                            <span className="material-symbols-outlined text-[16px] text-primary">location_on</span>
                            <span>{market.address}</span>
                          </p>
                        </div>

                        {/* Operating Day & Time Badge */}
                        <div className="sm:text-right shrink-0 bg-surface-container-low sm:bg-transparent p-2.5 sm:p-0 rounded-xl sm:rounded-none">
                          <span className="font-bold text-xs sm:text-sm text-primary block">
                            {market.dayText}
                          </span>
                          <span className="text-xs text-on-surface-variant font-medium block mt-0.5">
                            {market.timeText}
                          </span>
                        </div>
                      </div>

                      {/* Visual Produce Gallery (3 Stall Highlights) */}
                      {market.visualStalls && market.visualStalls.length > 0 && (
                        <div className="grid grid-cols-3 gap-2.5 pt-1">
                          {market.visualStalls.map((stall, sIdx) => (
                            <div
                              key={sIdx}
                              className="h-24 sm:h-28 rounded-xl overflow-hidden bg-surface-container relative group/img shadow-2xs border border-outline-variant/20"
                            >
                              <img
                                src={stall.img}
                                alt={stall.alt}
                                className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-500"
                                loading="lazy"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                              <span className="absolute bottom-1.5 left-2 bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-md font-bold text-[10px] text-white tracking-wide">
                                {stall.title}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Vendor Count & Tags */}
                      <div className="flex flex-col gap-2 pt-1">
                        <div className="flex items-center gap-2 text-xs font-semibold text-on-surface">
                          <span className="material-symbols-outlined text-[18px] text-primary">groups</span>
                          <span>{market.vendorCountText}</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {market.tags.map((tag, tIdx) => (
                            <span
                              key={tIdx}
                              className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant border border-outline-variant/20"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Stall Policy Banner (clean, premium green box) */}
                      <div className="p-3.5 rounded-xl bg-primary/[0.04] border border-primary/15 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[18px] text-primary shrink-0">
                            verified_user
                          </span>
                          <p className="text-on-surface text-xs font-medium leading-snug">
                            {market.policyText || 'Free produce reservation • 100% In-person payment upon pickup.'}
                          </p>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary uppercase text-[10px] font-black shrink-0 self-start sm:self-auto">
                          {market.policyBadge || 'Zero Online Fees'}
                        </span>
                      </div>

                      {/* Action Buttons Row */}
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onNavigate('market-details', market.id);
                          }}
                          className="flex-1 py-3 px-5 rounded-xl bg-primary hover:bg-[#0d3b1c] text-white font-bold text-xs sm:text-sm shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <span>View Market Details &amp; Stalls</span>
                          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onReserveForMarket(market.key);
                          }}
                          className="py-3 px-5 rounded-xl bg-surface-container-low hover:bg-surface-container border border-primary/25 text-primary font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
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

          {/* Right Column: Sticky Map Radar View (5 cols) */}
          <div className="lg:col-span-5 sticky top-24 flex flex-col gap-space-md">
            
            {/* Map Container Card */}
            <div className="bg-surface-container-lowest rounded-2xl shadow-sm overflow-hidden flex flex-col border border-outline-variant/30">
              
              {/* Map Header / Controls */}
              <div className="p-4 bg-surface-container-low flex items-center justify-between border-b border-outline-variant/30">
                <div>
                  <h3 className="font-bold text-sm text-on-surface flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-primary text-[20px]">explore</span>
                    <span>Interactive Market Radar</span>
                  </h3>
                  <p className="text-[11px] text-on-surface-variant mt-0.5">Click pins to inspect location &amp; directions</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setMapMode((m) => m === 'osm' ? 'stylized' : 'osm')}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-surface text-primary border border-primary/30 font-bold hover:bg-surface-container flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                    title="Toggle map style"
                  >
                    <span className="material-symbols-outlined text-[14px]">
                      {mapMode === 'osm' ? 'schema' : 'public'}
                    </span>
                    <span>{mapMode === 'osm' ? 'Stylized' : 'OpenStreet'}</span>
                  </button>
                  <button
                    onClick={() => setMapZoom((z) => Math.min(z + 0.15, 1.45))}
                    className="w-7 h-7 rounded-lg bg-surface flex items-center justify-center text-on-surface shadow-2xs hover:bg-surface-container transition-colors cursor-pointer border border-outline-variant/30"
                    title="Zoom in"
                  >
                    <span className="material-symbols-outlined text-[16px]">add</span>
                  </button>
                  <button
                    onClick={() => setMapZoom((z) => Math.max(z - 0.15, 0.85))}
                    className="w-7 h-7 rounded-lg bg-surface flex items-center justify-center text-on-surface shadow-2xs hover:bg-surface-container transition-colors cursor-pointer border border-outline-variant/30"
                    title="Zoom out"
                  >
                    <span className="material-symbols-outlined text-[16px]">remove</span>
                  </button>
                  <button
                    onClick={() => {
                      setMapZoom(1);
                      setSelectedMarketId(1);
                      setPopupVisible(true);
                    }}
                    className="w-7 h-7 rounded-lg bg-surface flex items-center justify-center text-primary shadow-2xs hover:bg-surface-container transition-colors cursor-pointer border border-outline-variant/30"
                    title="Recenter location"
                  >
                    <span className="material-symbols-outlined text-[16px]">my_location</span>
                  </button>
                </div>
              </div>

              {/* Conditional Map View */}
              {mapMode === 'osm' ? (
                <div className="relative w-full h-[480px] bg-surface-container-low overflow-hidden select-none">
                  <iframe
                    title="OpenStreetMap"
                    className="w-full h-full border-0"
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${Number(activeMarket.longitude || -122.4166) - 0.02}%2C${Number(activeMarket.latitude || 37.7833) - 0.02}%2C${Number(activeMarket.longitude || -122.4166) + 0.02}%2C${Number(activeMarket.latitude || 37.7833) + 0.02}&layer=mapnik&marker=${activeMarket.latitude || 37.7833}%2C${activeMarket.longitude || -122.4166}`}
                  />
                  <div className="absolute bottom-3 left-3 right-3 bg-surface/95 backdrop-blur-md p-3 rounded-xl border border-outline-variant/40 shadow-lg text-xs flex items-center justify-between z-10">
                    <div className="min-w-0 pr-2">
                      <span className="font-bold text-on-surface block truncate">{activeMarket.title}</span>
                      <span className="text-on-surface-variant text-[11px] block truncate">
                        {activeMarket.address} &bull; GPS: {Number(activeMarket.latitude || 37.7833).toFixed(4)}, {Number(activeMarket.longitude || -122.4166).toFixed(4)}
                      </span>
                    </div>
                    <button
                      onClick={() => onNavigate('market-details', activeMarket.id)}
                      className="px-3 py-1.5 rounded-lg bg-primary text-white font-bold text-xs hover:bg-[#0d3b1c] shrink-0 cursor-pointer shadow-xs"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  id="mapCanvas"
                  className="relative w-full h-[480px] bg-[#E7EBDD] overflow-hidden select-none transition-transform duration-200"
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
                  {allMarkets.map((m) => {
                    const isSelected = selectedMarketId === m.id;
                    const isWednesday = (m.schedule || '').toLowerCase().includes('wednesday');
                    const isPrimary = m.id === 1;

                    return (
                      <button
                        key={m.id}
                        onClick={() => handlePinClick(m.id)}
                        style={{ top: m.mapPos?.top || m.pinTop, left: m.mapPos?.left || m.pinLeft }}
                        className={`map-pin absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer focus:outline-none transition-transform ${
                          isSelected ? 'scale-110 z-30' : 'z-10'
                        }`}
                      >
                        <div
                          className={`w-9 h-9 rounded-full shadow-lg flex items-center justify-center ring-2 ring-white transition-all ${
                            isPrimary
                              ? 'bg-primary text-white ring-4'
                              : isWednesday
                              ? 'bg-tertiary-container text-white'
                              : 'bg-secondary text-white'
                          }`}
                        >
                          <span className="font-bold text-xs">{m.id}</span>
                        </div>
                        <span className="mt-1 bg-surface/95 px-1.5 py-0.5 rounded shadow-sm text-[10px] font-bold text-on-surface pointer-events-none whitespace-nowrap">
                          {m.title.split(' ')[0]} {m.title.split(' ')[1] || ''}
                        </span>
                      </button>
                    );
                  })}

                  {/* Active Selected Market Callout Popover */}
                  {popupVisible && activeMarket && (
                    <div
                      style={{ top: activeMarket.popupPos?.top || '40%', left: activeMarket.popupPos?.left || '50%' }}
                      className="absolute -translate-x-1/2 z-30 w-72 bg-surface-container-lowest rounded-2xl shadow-2xl p-3.5 flex flex-col gap-2 transition-all duration-200 border border-outline-variant/40 animate-fade-in"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
                          <span className="text-[11px] text-primary font-bold">
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

                      <div className="flex gap-2.5 items-center">
                        <div className="w-14 h-14 rounded-xl bg-surface-container overflow-hidden shrink-0 shadow-sm border border-outline-variant/20">
                          <img
                            src={activeMarket.popupImg || activeMarket.visualStalls?.[0]?.img}
                            alt={activeMarket.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-xs text-on-surface truncate">
                            {activeMarket.title}
                          </h4>
                          <p className="text-[11px] text-on-surface-variant truncate">
                            {activeMarket.address}
                          </p>
                          <p className="text-[10px] text-secondary font-bold mt-0.5">
                            {activeMarket.popupStalls}
                          </p>
                        </div>
                      </div>

                      <div className="pt-2 flex items-center justify-between gap-2 border-t border-outline-variant/20">
                        <button
                          type="button"
                          onClick={() => onNavigate('market-details', activeMarket.id)}
                          className="text-xs text-primary font-bold flex items-center gap-1 hover:underline cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[14px]">near_me</span>
                          <span>Directions</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onReserveForMarket(activeMarket.key)}
                          className="text-xs px-3 py-1 rounded-lg bg-primary text-white font-bold hover:bg-[#0d3b1c] transition-colors cursor-pointer shadow-2xs"
                        >
                          View Stalls
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Floating Map Legend */}
                  <div className="absolute bottom-3 left-3 bg-surface/95 backdrop-blur-sm px-3 py-2 rounded-xl shadow-sm text-[11px] flex flex-col gap-1 z-20 border border-outline-variant/30">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                      <span className="text-on-surface font-medium">Weekend Markets (Sat/Sun)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-tertiary-container" />
                      <span className="text-on-surface font-medium">Midweek Twilight Stalls</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* In-Person Guarantee Card */}
            <div className="p-5 rounded-2xl bg-surface-container-lowest shadow-2xs flex items-start gap-3.5 border border-outline-variant/30">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[22px]">verified_user</span>
              </div>
              <div>
                <p className="font-bold text-sm text-on-surface">Simple Direct Stall Pickup Guarantee</p>
                <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                  Reserving a produce crate holds your items safely until 11:30 AM at the farmer stall. Settle in person with cash, debit card, or SNAP market tokens upon collection with zero online transaction markups.
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
            <div className="w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center shrink-0 shadow-sm">
              <span className="material-symbols-outlined text-[32px]">add_location_alt</span>
            </div>
            <div className="flex flex-col">
              <h3 className="font-headline-md text-xl sm:text-2xl text-on-surface font-bold">Don't see your neighborhood market?</h3>
              <p className="font-body-sm text-xs sm:text-sm text-on-surface-variant mt-1 max-w-xl">
                Help expand the regional grower directory! Recommend a local gathering or register your family farm as a participating stallholder.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigate('contact-us')}
              className="font-bold text-xs px-5 py-3 rounded-xl bg-primary hover:bg-[#0d3b1c] text-white shadow-sm transition-all cursor-pointer"
            >
              Nominate a Local Market
            </button>
            <button
              onClick={() => onNavigate('farmer-dashboard')}
              className="font-bold text-xs px-5 py-3 rounded-xl bg-surface-container-lowest hover:bg-surface-container text-primary shadow-2xs transition-all cursor-pointer border border-outline-variant/40"
            >
              Farmer Stallholder Portal
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
