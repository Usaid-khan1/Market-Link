import React, { useState, useEffect, useMemo, useRef } from 'react';
import PageLoader from './PageLoader';
import browseApi from '../api/browse';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const MAP_STYLE = {
  version: 8,
  sources: {
    'osm-tiles': {
      type: 'raster',
      tiles: [
        'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
        'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
        'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png',
      ],
      tileSize: 256,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors',
    },
  },
  layers: [
    {
      id: 'osm-tiles-layer',
      type: 'raster',
      source: 'osm-tiles',
      minzoom: 0,
      maxzoom: 19,
    },
  ],
};

export default function MarketDetails({ marketId = 1, onNavigate, onReserveProduct, onNotifyProduct }) {
  const [mapFilter, setMapFilter] = useState('all');
  const [producerFilter, setProducerFilter] = useState('all');
  const [preferredMarket, setPreferredMarket] = useState(false);
  const [liveMarket, setLiveMarket] = useState(null);
  const [marketProducts, setMarketProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    Promise.allSettled([
      browseApi.getMarket(marketId || 1),
      browseApi.getProducts({ market_id: marketId || 1 }),
    ])
      .then(([marketRes, prodRes]) => {
        if (mounted) {
          if (marketRes.status === 'fulfilled' && marketRes.value?.data) {
            setLiveMarket(marketRes.value.data);
          } else {
            setLiveMarket(null);
          }
          if (prodRes.status === 'fulfilled' && prodRes.value?.data && Array.isArray(prodRes.value.data)) {
            setMarketProducts(prodRes.value.data);
          } else {
            setMarketProducts([]);
          }
        }
      })
      .catch((err) => {
        console.warn('Could not load market details:', err);
        if (mounted) {
          setLiveMarket(null);
          setMarketProducts([]);
        }
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, [marketId]);

  // Registered stalls dynamically loaded from this market (no dummy data)
  const marketStalls = useMemo(() => {
    if (!liveMarket?.farmers || !Array.isArray(liveMarket.farmers)) return [];
    return liveMarket.farmers.map((f, idx) => {
      const p = f.farmer_profile || {};
      const stallNo = p.stall_number || `Stall #${idx + 1}`;
      const stallNm = p.stall_name || `${f.name}'s Stand`;
      const days = Array.isArray(p.operating_days) ? p.operating_days.join(', ') : (p.operating_days || 'Weekend Morning');
      return {
        id: `farmer-${f.id}`,
        farmerId: f.id,
        name: stallNm,
        stallNumber: stallNo,
        farmers: `${f.name} • ${p.contact_person || 'Grower'}`,
        stall: `${stallNo} • ${p.address || liveMarket.address || 'Market Plaza'}`,
        category: 'veg',
        rating: '5.00',
        reviews: 'Verified',
        desc: p.bio || `Fresh local harvest brought directly to ${liveMarket.market_name}. Operating: ${days}. Contact: ${f.phone || f.email || 'At the stand'}.`,
        status: 'active',
        btnText: 'View Stall Profile',
        farmKey: `farmer-${f.id}`,
        isLiveStall: true,
        pickupWindow: `${p.pickup_time_start || '08:00 AM'} – ${p.pickup_time_end || '01:30 PM'}`,
        latitude: parseFloat(p.latitude) || parseFloat(liveMarket.latitude) || 24.9849,
        longitude: parseFloat(p.longitude) || parseFloat(liveMarket.longitude) || 67.0596,
        phone: f.phone,
        email: f.email,
        products: f.products || [],
      };
    });
  }, [liveMarket]);

  const allProducers = marketStalls;

  // Filter producers
  const filteredProducers = useMemo(() => {
    return allProducers.filter((p) => {
      if (producerFilter === 'all') return true;
      return p.category === producerFilter;
    });
  }, [allProducers, producerFilter]);

  // Live harvest products for this market (no dummy data)
  const harvestItems = useMemo(() => {
    if (marketProducts && marketProducts.length > 0) {
      return marketProducts.map((p) => {
        const numPrice = Number(p.price) || 0;
        const isSoldOut = p.status === 'sold_out' || p.stock_quantity <= 0;
        const isLowStock = p.stock_quantity > 0 && p.stock_quantity <= 5;
        return {
          id: p.id,
          name: p.name,
          price: numPrice,
          unit: p.unit || 'lb',
          stall: p.stall_name || (p.farmer_name ? `${p.farmer_name}'s Stand` : 'Farm Stand'),
          farm: p.farmer_name || 'Regional Grower',
          market: p.market_name || liveMarket?.market_name || 'Downtown Historic Market',
          status: isSoldOut ? 'SOLD_OUT' : (isLowStock ? 'LOW_STOCK' : 'IN_STOCK'),
          badge: isSoldOut ? 'SOLD OUT THIS WEEK' : (isLowStock ? `LOW STOCK • ${p.stock_quantity} LEFT` : 'IN STOCK'),
          desc: p.description || 'Fresh morning harvest harvested for weekend market pickup.',
          image: p.image || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
          alt: p.name,
        };
      });
    }

    // Also collect products attached to farmers if browse/products was empty
    const farmerProducts = [];
    (liveMarket?.farmers || []).forEach((f) => {
      if (Array.isArray(f.products)) {
        f.products.forEach((p) => {
          const numPrice = Number(p.price) || 0;
          const isSoldOut = p.status === 'sold_out' || p.stock_quantity <= 0;
          const isLowStock = p.stock_quantity > 0 && p.stock_quantity <= 5;
          farmerProducts.push({
            id: p.id,
            name: p.name,
            price: numPrice,
            unit: p.unit || 'lb',
            stall: f.farmer_profile?.stall_name || `${f.name}'s Stand`,
            farm: f.name || 'Regional Grower',
            market: liveMarket?.market_name || 'Downtown Historic Market',
            status: isSoldOut ? 'SOLD_OUT' : (isLowStock ? 'LOW_STOCK' : 'IN_STOCK'),
            badge: isSoldOut ? 'SOLD OUT THIS WEEK' : (isLowStock ? `LOW STOCK • ${p.stock_quantity} LEFT` : 'IN STOCK'),
            desc: p.description || 'Fresh morning harvest harvested for weekend market pickup.',
            image: p.image || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
            alt: p.name,
          });
        });
      }
    });
    return farmerProducts;
  }, [marketProducts, liveMarket]);

  // Interactive OpenStreetMap for Market Plaza & Farmer Stalls
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    const defaultLat = parseFloat(liveMarket?.latitude) || 24.98494;
    const defaultLng = parseFloat(liveMarket?.longitude) || 67.059616;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: MAP_STYLE,
      center: [defaultLng, defaultLat],
      zoom: 14.5,
      attributionControl: false,
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'top-right');

    map.on('load', () => {
      // 1. Market Plaza Center Pin
      const marketEl = document.createElement('div');
      marketEl.innerHTML = `
        <div style="
          width: 38px; height: 38px; border-radius: 50%; background: #125224;
          border: 3px solid #ffffff; box-shadow: 0 4px 14px rgba(18,82,36,0.5);
          display: flex; align-items: center; justify-content: center; color: white; cursor: pointer;
        ">
          <span class="material-symbols-outlined" style="font-size: 20px;">storefront</span>
        </div>
      `;

      new maplibregl.Marker({ element: marketEl })
        .setLngLat([defaultLng, defaultLat])
        .setPopup(
          new maplibregl.Popup({ offset: 25 }).setHTML(`
            <div style="font-family: sans-serif; padding: 4px; min-width: 140px;">
              <div style="font-weight: 800; color: #125224; font-size: 13px;">${liveMarket?.market_name || 'Farmers Market Plaza'}</div>
              <div style="font-size: 11px; color: #444; margin-top: 2px;">${liveMarket?.address || 'Market Location'}</div>
              <div style="font-size: 10px; color: #777; margin-top: 4px; font-weight: bold;">Plaza Central Grounds</div>
            </div>
          `)
        )
        .addTo(map);

      // 2. Stall Markers for registered farmers in this market
      marketStalls.forEach((stall) => {
        if (!stall.latitude || !stall.longitude) return;
        const stallEl = document.createElement('div');
        stallEl.innerHTML = `
          <div style="
            padding: 4px 9px; border-radius: 20px; background: #914d00;
            border: 2px solid white; box-shadow: 0 4px 12px rgba(145,77,0,0.4);
            display: flex; align-items: center; gap: 4px; color: white; font-weight: bold; font-size: 11px; cursor: pointer;
          ">
            <span class="material-symbols-outlined" style="font-size: 14px;">agriculture</span>
            <span>${stall.stallNumber || 'Stall'}</span>
          </div>
        `;

        new maplibregl.Marker({ element: stallEl })
          .setLngLat([stall.longitude, stall.latitude])
          .setPopup(
            new maplibregl.Popup({ offset: 20 }).setHTML(`
              <div style="font-family: sans-serif; padding: 4px; min-width: 160px;">
                <div style="font-weight: 800; color: #914d00; font-size: 13px;">${stall.name}</div>
                <div style="font-size: 11px; color: #222; font-weight: 600; margin-top: 2px;">${stall.stallNumber}</div>
                <div style="font-size: 10px; color: #555; margin-top: 2px;">${stall.farmers}</div>
                <div style="font-size: 10px; color: #125224; margin-top: 4px; font-weight: bold;">Pickup: ${stall.pickupWindow}</div>
              </div>
            `)
          )
          .addTo(map);
      });
    });

    mapRef.current = map;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [liveMarket, marketStalls]);

  if (loading) {
    return (
      <PageLoader
        title="Loading Market Pavilion & Stalls..."
        subtitle="Connecting to real-time stall rosters, grower map pins, and morning harvest inventory..."
        minHeight="min-h-[85vh]"
      />
    );
  }

  if (!liveMarket) {
    return (
      <div className="w-full min-h-[70vh] flex flex-col items-center justify-center p-8 bg-surface">
        <div className="max-w-md w-full p-8 rounded-2xl bg-white border border-outline-variant/30 text-center shadow-lg">
          <span className="material-symbols-outlined text-[54px] text-primary mb-3">storefront</span>
          <h2 className="text-xl font-bold text-on-surface mb-2">Market Pavilion Not Found</h2>
          <p className="text-sm text-on-surface-variant mb-6">
            The market pavilion you requested could not be found or is currently not scheduled.
          </p>
          <button
            onClick={() => onNavigate('markets')}
            className="w-full py-3 px-4 rounded-xl bg-primary text-white font-bold text-sm cursor-pointer hover:bg-primary/90 transition-all"
          >
            Browse All Regional Markets
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      {/* Breadcrumb & Top Indicator */}
      <section className="w-full bg-surface-container-low py-space-sm px-3 sm:px-6 lg:px-gutter border-b border-outline-variant/30">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-space-sm">
          <nav aria-label="Breadcrumbs" className="flex items-center gap-space-xs font-label-sm text-on-surface-variant">
            <button
              onClick={() => onNavigate('home')}
              className="hover:text-primary transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">home</span>
              <span>Home</span>
            </button>
            <span>/</span>
            <button
              onClick={() => onNavigate('markets')}
              className="hover:text-primary transition-colors cursor-pointer"
            >
              Markets
            </button>
            <span>/</span>
            <span className="text-primary font-bold">{liveMarket?.market_name || 'Market Details'}</span>
          </nav>
          <div className="inline-flex items-center gap-space-xs text-secondary font-label-sm">
            <span className="w-2 h-2 rounded-full bg-secondary animate-ping"></span>
            <span>Stall Reservations Open for {Array.isArray(liveMarket?.operating_days) ? liveMarket.operating_days[0] : (liveMarket?.operating_days || 'Weekend')}</span>
          </div>
        </div>
      </section>

      {/* Market Detail Header Hero */}
      <section className="w-full py-8 sm:py-space-xl px-3 sm:px-6 lg:px-gutter relative overflow-hidden bg-gradient-to-b from-surface-container-low via-surface to-surface">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
            {/* Left 8 Cols: Market Meta & Action Stack */}
            <div className="lg:col-span-8 flex flex-col gap-space-md">
              <div className="flex flex-wrap items-center gap-space-xs">
                <span className="inline-flex items-center gap-1 px-space-sm py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-sm shadow-sm font-bold">
                  <span className="material-symbols-outlined text-[15px]">verified</span>
                  {liveMarket?.operating_days ? (Array.isArray(liveMarket.operating_days) ? liveMarket.operating_days.join(' & ') : liveMarket.operating_days) : 'Open Every Saturday'}
                </span>
                <span className="inline-flex items-center gap-1 px-space-sm py-1 rounded-full bg-surface-container-highest text-on-surface font-label-sm font-bold">
                  <span className="material-symbols-outlined text-[15px]">storefront</span>
                  {marketStalls.length > 0 ? `${marketStalls.length} Registered Stalls` : 'Certified Stalls'}
                </span>
                <span className="inline-flex items-center gap-1 px-space-sm py-1 rounded-full bg-surface-container-high text-primary font-label-sm font-bold">
                  <span className="material-symbols-outlined text-[15px]">payments</span>
                  Cash &amp; Card In-Person
                </span>
                <span className="inline-flex items-center gap-1 px-space-sm py-1 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm">
                  <span className="material-symbols-outlined text-[15px]">pets</span>
                  Dog Friendly (On Leash)
                </span>
              </div>

              <div className="flex flex-col gap-space-xs">
                <h1 className="font-display-lg text-on-surface leading-tight tracking-tight font-extrabold">
                  {liveMarket?.market_name || 'Downtown Historic Farmers Market'}
                </h1>
                <p className="font-body-lg text-on-surface-variant flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-primary text-[20px]">location_on</span>
                  {liveMarket?.address || '120 Market Square, Central Plaza, Downtown (Pioneer Pavilion)'}
                </p>
              </div>

              {/* Schedule Callout Badge */}
              <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm border border-outline-variant/30">
                <div className="flex items-center gap-space-sm">
                  <div className="w-12 h-12 rounded-xl bg-secondary-container text-on-secondary-container flex items-center justify-center shadow-sm">
                    <span className="material-symbols-outlined text-[26px]">calendar_today</span>
                  </div>
                  <div>
                    <p className="font-label-md text-on-surface font-bold">
                      Market Window: {Array.isArray(liveMarket?.operating_days) ? liveMarket.operating_days.join(' & ') : (liveMarket?.operating_days || 'Saturday & Sunday')}
                    </p>
                    <p className="font-body-sm text-on-surface-variant">
                      {liveMarket?.timings || '8:00 AM – 1:00 PM • Early Birds / Seniors: 7:30 AM'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 font-label-sm text-primary font-bold">
                  <span className="material-symbols-outlined text-[18px]">verified_user</span>
                  <span>100% In-Person Payment at Stalls</span>
                </div>
              </div>

              {/* Action CTA Ribbon */}
              <div className="flex flex-wrap items-center gap-space-sm pt-space-xs">
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(liveMarket?.address || liveMarket?.market_name || 'Farmers Market')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-space-xs px-space-lg py-space-sm rounded-full bg-tertiary-container text-on-tertiary font-label-md shadow-md hover:bg-tertiary transition-all active:scale-95 cursor-pointer font-bold"
                >
                  <span className="material-symbols-outlined text-[18px]">directions</span>
                  Get Directions
                </a>

                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText(window.location.href);
                    alert('MarketLink URL copied to clipboard!');
                  }}
                  className="inline-flex items-center justify-center gap-space-xs px-space-md py-space-sm rounded-full bg-surface-container-high text-on-surface font-label-md hover:bg-surface-container-highest transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">share</span>
                  Share Market
                </button>

                <button
                  type="button"
                  onClick={() => setPreferredMarket(!preferredMarket)}
                  className={`inline-flex items-center justify-center gap-space-xs px-space-md py-space-sm rounded-full font-label-md transition-colors cursor-pointer ${
                    preferredMarket
                      ? 'bg-secondary-container text-on-secondary-container'
                      : 'bg-surface-container-high text-primary hover:bg-secondary-container hover:text-on-secondary-container'
                  }`}
                >
                  <span className={`material-symbols-outlined text-[18px] ${preferredMarket ? 'fill' : ''}`}>
                    favorite
                  </span>
                  {preferredMarket ? 'Preferred Market Set' : 'Set as Preferred Market'}
                </button>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center justify-center gap-space-xs px-space-md py-space-sm rounded-full bg-surface-container-high text-on-surface-variant font-label-md hover:bg-surface-container-highest transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">download</span>
                  Download Stall Layout PDF
                </button>
              </div>
            </div>

            {/* Right 4 Cols: Quick Market Snapshot Card */}
            <div className="lg:col-span-4 bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col gap-space-md border border-outline-variant/30">
              <div className="flex items-center justify-between pb-space-xs">
                <h3 className="font-headline-sm text-primary font-bold">Stall Highlights</h3>
                <span className="font-label-sm px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold">
                  {marketStalls.length > 0 ? `${marketStalls.length} Active Stalls` : 'Updated Today'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-space-sm">
                <div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col">
                  <span className="font-display-lg-mobile text-primary font-bold">{marketStalls.length > 0 ? marketStalls.length : 28}</span>
                  <span className="font-label-sm text-on-surface-variant text-xs">Family Farms</span>
                </div>
                <div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col">
                  <span className="font-display-lg-mobile text-secondary font-bold">0$</span>
                  <span className="font-label-sm text-on-surface-variant text-xs">Online Fees</span>
                </div>
                <div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col">
                  <span className="font-display-lg-mobile text-primary font-bold">11:30</span>
                  <span className="font-label-sm text-on-surface-variant text-xs">AM Pickup Hold</span>
                </div>
                <div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col">
                  <span className="font-display-lg-mobile text-tertiary font-bold">100%</span>
                  <span className="font-label-sm text-on-surface-variant text-xs">Direct Cash/Card</span>
                </div>
              </div>

              <div className="p-space-sm rounded-lg bg-surface-container flex items-start gap-space-xs text-xs text-on-surface-variant leading-snug">
                <span className="material-symbols-outlined text-primary text-[20px] mt-0.5 shrink-0">store</span>
                <p>
                  Curbside wagon check points available on Market Square South. Stalls hold reserved harvest boxes in cool storage until you arrive.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Stall Map & Pavilion Directory */}
      <section className="w-full py-space-lg px-3 sm:px-6 lg:px-gutter bg-surface">
        <div className="max-w-7xl mx-auto flex flex-col gap-space-md">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-sm">
            <div>
              <div className="inline-flex items-center gap-1 font-label-sm text-primary uppercase tracking-wider mb-1">
                <span className="material-symbols-outlined text-[16px]">map</span>
                <span>Spatial Pavilion Grid</span>
              </div>
              <h2 className="font-headline-lg text-on-surface">Interactive Stall Map &amp; Pavilion Directory</h2>
              <p className="font-body-md text-on-surface-variant">
                Locate your favorite growers across the historic covered brick aisles of Pioneer Pavilion.
              </p>
            </div>

            {/* Filter Chips for Map */}
            <div className="flex flex-wrap items-center gap-space-xs" id="map-filter-group">
              {['all', 'veg', 'fruit', 'bakery', 'snap'].map((key) => {
                const labelMap = {
                  all: 'All Stalls',
                  veg: 'Vegetables',
                  fruit: 'Fruits & Orchard',
                  bakery: 'Bakery & Dairy',
                  snap: 'SNAP / Info'
                };
                const isActive = mapFilter === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setMapFilter(key)}
                    className={`px-space-md py-1 rounded-full font-label-sm transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-primary text-on-primary font-bold'
                        : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'
                    }`}
                  >
                    {labelMap[key]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Map Canvas Graphic Area */}
          <div className="w-full bg-surface-container-low rounded-xl p-space-md lg:p-space-lg shadow-sm flex flex-col gap-space-md border border-outline-variant/30">
            {/* Map Header bar */}
            <div className="flex flex-wrap items-center justify-between gap-space-xs pb-space-xs border-b border-outline-variant/20">
              <div className="flex items-center gap-space-sm">
                <span className="material-symbols-outlined text-primary text-[22px]">pin_drop</span>
                <span className="font-label-md text-on-surface">Pioneer Pavilion &amp; Courtyard Walkways</span>
                <span className="text-xs px-2 py-0.5 bg-secondary-container text-on-secondary-container rounded-full font-label-sm">
                  Live Stall View
                </span>
              </div>
              <p className="font-body-sm text-on-surface-variant text-xs">
                Tap any stall marker to inspect grower profile &amp; reservation basket
              </p>
            </div>

            {/* Visual Pavilion Layout Grid Diagram */}
            <div className="w-full bg-surface-container-lowest rounded-xl p-space-md shadow-inner overflow-x-auto border border-outline-variant/30">
              <div className="min-w-[760px] flex flex-col gap-space-md py-space-sm">
                {/* North Entrance & Info Hub */}
                <div className="flex items-center justify-between px-space-md py-space-xs bg-surface-container rounded-lg">
                  <span className="font-label-sm text-on-surface-variant flex items-center gap-1 text-xs">
                    <span className="material-symbols-outlined text-[16px] text-primary">north</span>
                    North Arch Entrance (Central Plaza Promenade)
                  </span>
                  <div className="flex items-center gap-space-md font-label-sm text-xs">
                    <span className="flex items-center gap-1 text-primary">
                      <span className="w-2.5 h-2.5 rounded-full bg-primary inline-block"></span> Stall #1: SNAP &amp; Token Station
                    </span>
                    <span className="flex items-center gap-1 text-on-surface-variant">
                      <span className="material-symbols-outlined text-[16px]">wc</span> Restrooms
                    </span>
                    <span className="flex items-center gap-1 text-secondary">
                      <span className="material-symbols-outlined text-[16px]">water_drop</span> Fresh Water Station
                    </span>
                  </div>
                </div>

                {/* Live Stalls Banner if farmers registered in this market */}
                {marketStalls.length > 0 && (
                  <div className="p-3.5 rounded-xl bg-gradient-to-r from-primary/10 via-secondary/10 to-transparent border border-primary/20 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="font-label-sm text-primary font-bold uppercase tracking-wider flex items-center gap-1.5 text-xs">
                        <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
                        Live Stalls Registered in {liveMarket?.market_name || 'This Market'} ({marketStalls.length})
                      </span>
                      <span className="text-[10px] bg-primary text-white font-bold px-2 py-0.5 rounded-full">
                        Verified Booths
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {marketStalls.map((st) => (
                        <div key={st.id} className="p-3 rounded-lg bg-surface-container-lowest border border-outline-variant/30 flex items-center justify-between gap-2 shadow-sm">
                          <div>
                            <span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary font-bold text-[10px]">
                              {st.stallNumber || 'Stall Booth'}
                            </span>
                            <p className="font-bold text-on-surface text-xs mt-1">{st.name}</p>
                            <p className="text-[10px] text-on-surface-variant">{st.farmers}</p>
                            <p className="text-[10px] text-primary font-medium mt-0.5">Pickup: {st.pickupWindow}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => onNavigate('farmer-profile', st.farmerId)}
                            className="px-2.5 py-1 rounded-lg bg-primary hover:bg-[#0d3b1c] text-white font-bold text-[10px] cursor-pointer shrink-0"
                          >
                            Visit Stall
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Aisles Container (A, B, C, D) */}
                <div className="grid grid-cols-4 gap-space-md text-center">
                  {/* Aisle A */}
                  <div className="flex flex-col gap-space-sm p-space-sm rounded-lg bg-surface-container-low border border-outline-variant/20">
                    <div className="py-1 bg-surface-container-high rounded text-primary font-label-sm uppercase tracking-wider text-xs">
                      Aisle A: Orchard &amp; Berries
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="p-space-xs rounded bg-surface-container-lowest text-left shadow-sm">
                        <span className="font-label-sm text-primary text-xs">Stall #11</span>
                        <p className="font-headline-sm text-sm text-on-surface">Cedar Hill Berries</p>
                        <p className="font-body-sm text-xs text-on-surface-variant">Blackberries &amp; Preserves</p>
                      </div>
                      {/* Highlighted Stall 12 */}
                      <div className="p-space-xs rounded bg-secondary-container text-left shadow-sm relative ring-2 ring-primary">
                        <div className="flex items-center justify-between">
                          <span className="font-label-sm text-on-secondary-container font-bold text-xs">Stall #12 ★</span>
                          <span className="text-[10px] bg-primary text-on-primary px-1.5 py-0.5 rounded font-label-sm">In Stock</span>
                        </div>
                        <p className="font-headline-sm text-sm text-on-secondary-container font-bold">Sunrise Orchard</p>
                        <p className="font-body-sm text-xs text-on-secondary-fixed-variant">Honeycrisp Apples, Pears, Fresh Cider</p>
                      </div>
                      <div className="p-space-xs rounded bg-surface-container-lowest text-left shadow-sm">
                        <span className="font-label-sm text-on-surface-variant text-xs">Stall #13</span>
                        <p className="font-headline-sm text-sm text-on-surface">Cloverdale Peaches</p>
                        <p className="font-body-sm text-xs text-on-surface-variant">Late Summer Stone Fruit</p>
                      </div>
                    </div>
                  </div>

                  {/* Aisle B */}
                  <div className="flex flex-col gap-space-sm p-space-sm rounded-lg bg-surface-container-low border border-outline-variant/20">
                    <div className="py-1 bg-surface-container-high rounded text-primary font-label-sm uppercase tracking-wider text-xs">
                      Aisle B: Vegetables &amp; Roots
                    </div>
                    <div className="flex flex-col gap-2">
                      {/* Highlighted Stall 4 */}
                      <div className="p-space-xs rounded bg-secondary-container text-left shadow-sm relative ring-2 ring-primary">
                        <div className="flex items-center justify-between">
                          <span className="font-label-sm text-on-secondary-container font-bold text-xs">Stall #4 ★</span>
                          <span className="text-[10px] bg-primary text-on-primary px-1.5 py-0.5 rounded font-label-sm">Popular</span>
                        </div>
                        <p className="font-headline-sm text-sm text-on-secondary-container font-bold">Green Pastures Organic</p>
                        <p className="font-body-sm text-xs text-on-secondary-fixed-variant">Heirloom Brandywines, Chard, Microgreens</p>
                      </div>
                      <div className="p-space-xs rounded bg-surface-container-lowest text-left shadow-sm">
                        <span className="font-label-sm text-on-surface-variant text-xs">Stall #5</span>
                        <p className="font-headline-sm text-sm text-on-surface">Red Earth Rootery</p>
                        <p className="font-body-sm text-xs text-on-surface-variant">Carrots, Beets, Shallots</p>
                      </div>
                      <div className="p-space-xs rounded bg-surface-container-lowest text-left shadow-sm">
                        <span className="font-label-sm text-on-surface-variant text-xs">Stall #6</span>
                        <p className="font-headline-sm text-sm text-on-surface">Fiddlehead Farm</p>
                        <p className="font-body-sm text-xs text-on-surface-variant">Squashes, Gourds &amp; Kale</p>
                      </div>
                    </div>
                  </div>

                  {/* Aisle C */}
                  <div className="flex flex-col gap-space-sm p-space-sm rounded-lg bg-surface-container-low border border-outline-variant/20">
                    <div className="py-1 bg-surface-container-high rounded text-primary font-label-sm uppercase tracking-wider text-xs">
                      Aisle C: Bakery &amp; Dairy
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="p-space-xs rounded bg-surface-container-lowest text-left shadow-sm">
                        <span className="font-label-sm text-on-surface-variant text-xs">Stall #17</span>
                        <p className="font-headline-sm text-sm text-on-surface">Sweet Meadow Creamery</p>
                        <p className="font-body-sm text-xs text-on-surface-variant">A2 Whole Milk &amp; Butter</p>
                      </div>
                      {/* Highlighted Stall 18 */}
                      <div className="p-space-xs rounded bg-secondary-container text-left shadow-sm relative ring-2 ring-primary">
                        <div className="flex items-center justify-between">
                          <span className="font-label-sm text-on-secondary-container font-bold text-xs">Stall #18 ★</span>
                          <span className="text-[10px] bg-tertiary-container text-on-tertiary px-1.5 py-0.5 rounded font-label-sm">Low Stock</span>
                        </div>
                        <p className="font-headline-sm text-sm text-on-secondary-container font-bold">Miller &amp; Stone Hearth</p>
                        <p className="font-body-sm text-xs text-on-secondary-fixed-variant">Woodfired Sourdough, Croissants</p>
                      </div>
                      {/* Highlighted Stall 21 */}
                      <div className="p-space-xs rounded bg-secondary-container text-left shadow-sm relative ring-2 ring-primary">
                        <div className="flex items-center justify-between">
                          <span className="font-label-sm text-on-secondary-container font-bold text-xs">Stall #21 ★</span>
                          <span className="text-[10px] bg-surface-container-highest text-on-surface-variant px-1.5 py-0.5 rounded font-label-sm">Sold Out</span>
                        </div>
                        <p className="font-headline-sm text-sm text-on-secondary-container font-bold">Heritage Hen Hollow</p>
                        <p className="font-body-sm text-xs text-on-secondary-fixed-variant">Pasture Organic Eggs &amp; Clover Honey</p>
                      </div>
                    </div>
                  </div>

                  {/* Aisle D */}
                  <div className="flex flex-col gap-space-sm p-space-sm rounded-lg bg-surface-container-low border border-outline-variant/20">
                    <div className="py-1 bg-surface-container-high rounded text-primary font-label-sm uppercase tracking-wider text-xs">
                      Aisle D: Artisans &amp; Preserves
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="p-space-xs rounded bg-surface-container-lowest text-left shadow-sm">
                        <span className="font-label-sm text-on-surface-variant text-xs">Stall #8</span>
                        <p className="font-headline-sm text-sm text-on-surface">Canyon Herbs &amp; Tea</p>
                        <p className="font-body-sm text-xs text-on-surface-variant">Dried Sage &amp; Botanical Blends</p>
                      </div>
                      {/* Highlighted Stall 9 */}
                      <div className="p-space-xs rounded bg-secondary-container text-left shadow-sm relative ring-2 ring-primary">
                        <div className="flex items-center justify-between">
                          <span className="font-label-sm text-on-secondary-container font-bold text-xs">Stall #9 ★</span>
                          <span className="text-[10px] bg-tertiary-container text-on-tertiary px-1.5 py-0.5 rounded font-label-sm">3 Jars Left</span>
                        </div>
                        <p className="font-headline-sm text-sm text-on-secondary-container font-bold">Pine Ridge Apiary</p>
                        <p className="font-body-sm text-xs text-on-secondary-fixed-variant">Raw Wildflower Honey &amp; Pollen</p>
                      </div>
                      <div className="p-space-xs rounded bg-surface-container-lowest text-left shadow-sm">
                        <span className="font-label-sm text-on-surface-variant text-xs">Stall #24</span>
                        <p className="font-headline-sm text-sm text-on-surface">Blue Sky Woolens</p>
                        <p className="font-body-sm text-xs text-on-surface-variant">Hand-spun skeins &amp; soaps</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* South Courtyard & Music Gazebo */}
                <div className="flex items-center justify-between px-space-md py-space-xs bg-surface-container rounded-lg text-xs">
                  <span className="font-label-sm text-on-surface-variant flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-tertiary">music_note</span>
                    South Courtyard &amp; Live Bluegrass Acoustic Gazebo (Music 9:30 AM - 12:00 PM)
                  </span>
                  <span className="font-label-sm text-primary flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">local_parking</span>
                    Wagon Check &amp; Curbside Loading Zone
                  </span>
                </div>
              </div>
            </div>

            {/* Interactive OpenStreetMap Market Map with Live Stalls */}
            <div className="w-full h-72 sm:h-80 rounded-2xl overflow-hidden relative shadow-md border border-outline-variant/30 bg-surface-container-high">
              <div ref={mapContainerRef} className="w-full h-full" />
              
              {/* Floating Legend / Stats */}
              <div className="absolute top-3 left-3 bg-surface-container-lowest/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-outline-variant/30 shadow-md text-xs flex items-center gap-3 z-10 pointer-events-none">
                <div className="flex items-center gap-1.5 font-bold text-primary">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary inline-block" />
                  <span>{liveMarket?.market_name || 'Market Plaza'}</span>
                </div>
                <div className="flex items-center gap-1.5 font-bold text-[#914d00]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#914d00] inline-block" />
                  <span>{marketStalls.length} Registered Stalls</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Market Schedule & Practical Info Bar */}
      <section className="w-full py-space-lg px-gutter bg-surface-container-low border-y border-outline-variant/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
            <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-xs border border-outline-variant/30">
              <div className="flex items-center gap-space-xs text-primary">
                <span className="material-symbols-outlined text-[24px]">schedule</span>
                <h4 className="font-headline-sm text-base text-on-surface">Market Operating Hours</h4>
              </div>
              <p className="font-body-sm text-on-surface-variant text-xs leading-relaxed">
                Every Saturday: <strong>8:00 AM – 1:00 PM</strong><br />
                Sunrise Early-Bird for seniors &amp; mobility patrons opens at <strong>7:30 AM</strong>.
              </p>
            </div>

            <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-xs border border-outline-variant/30">
              <div className="flex items-center gap-space-xs text-primary">
                <span className="material-symbols-outlined text-[24px]">wb_sunny</span>
                <h4 className="font-headline-sm text-base text-on-surface">Year-Round Season</h4>
              </div>
              <p className="font-body-sm text-on-surface-variant text-xs leading-relaxed">
                Open 52 weeks a year, rain, shine, or harvest frost. Fully sheltered underneath Pioneer Historic Pavilion brick arches.
              </p>
            </div>

            <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-xs border border-outline-variant/30">
              <div className="flex items-center gap-space-xs text-primary">
                <span className="material-symbols-outlined text-[24px]">local_parking</span>
                <h4 className="font-headline-sm text-base text-on-surface">Validated Free Parking</h4>
              </div>
              <p className="font-body-sm text-on-surface-variant text-xs leading-relaxed">
                <strong>2 Hours Free</strong> at Central Plaza Parking Garage (Entrance off 2nd Ave) with vendor stamp or Info Booth voucher.
              </p>
            </div>

            <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-xs border border-outline-variant/30">
              <div className="flex items-center gap-space-xs text-secondary">
                <span className="material-symbols-outlined text-[24px]">verified</span>
                <h4 className="font-headline-sm text-base text-on-surface">Stall Pickup Guarantee</h4>
              </div>
              <p className="font-body-sm text-on-surface-variant text-xs leading-relaxed">
                Reserved produce held until <strong>11:30 AM</strong> at the grower stall. Pay directly in cash, farm voucher, card, or SNAP tokens.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Participating Farmers & Producers Section */}
      <section className="w-full py-space-xl px-3 sm:px-6 lg:px-gutter bg-surface">
        <div className="max-w-7xl mx-auto flex flex-col gap-space-lg">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
            <div>
              <div className="inline-flex items-center gap-1 font-label-sm text-secondary uppercase tracking-wider mb-1 font-bold">
                <span className="material-symbols-outlined text-[16px]">agriculture</span>
                <span>Local Soil Stewards</span>
              </div>
              <h2 className="font-headline-lg text-on-surface font-extrabold">Farmers &amp; Producers at {liveMarket?.market_name || 'Downtown Historic'}</h2>
              <p className="font-body-md text-on-surface-variant">
                {marketStalls.length > 0
                  ? `${marketStalls.length} verified farm stand${marketStalls.length === 1 ? '' : 's'} actively harvesting and packing fresh items for this market plaza.`
                  : '28 active regional family growers harvesting specifically for this weekend.'}
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-space-xs">
              {[
                { id: 'all', label: `All Stalls (${filteredProducers.length})` },
                { id: 'veg', label: 'Vegetables & Produce' },
                { id: 'fruit', label: 'Fruit Orchards' },
                { id: 'bakery', label: 'Artisan Bakery' },
                { id: 'dairy', label: 'Dairy & Eggs' },
                { id: 'honey', label: 'Honey & Preserves' }
              ].map((pill) => {
                const isActive = producerFilter === pill.id;
                return (
                  <button
                    key={pill.id}
                    type="button"
                    onClick={() => setProducerFilter(pill.id)}
                    className={`px-space-md py-1 rounded-full font-label-sm transition-colors cursor-pointer text-xs ${
                      isActive
                        ? 'bg-primary text-on-primary font-bold'
                        : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                    }`}
                  >
                    {pill.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Producer Cards Grid */}
          {filteredProducers.length === 0 ? (
            <div className="bg-surface-container-lowest rounded-2xl p-12 text-center border border-outline-variant/30 flex flex-col items-center justify-center gap-3">
              <span className="material-symbols-outlined text-primary text-[44px]">storefront</span>
              <h3 className="font-headline-md font-bold text-on-surface">No farm stands found for this filter</h3>
              <p className="font-body-md text-on-surface-variant text-xs sm:text-sm max-w-md">
                No producers matched your current category selection. Switch to "All Stalls" to view all active growers.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md">
              {filteredProducers.map((producer) => (
                <div
                  key={producer.id}
                  className={`bg-surface-container-lowest rounded-xl p-space-md shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-space-md border ${
                    producer.isLiveStall ? 'border-primary/40 ring-1 ring-primary/20 bg-emerald-50/10' : 'border-outline-variant/30'
                  }`}
                >
                  <div className="flex flex-col gap-space-sm">
                    <div className="flex items-start justify-between gap-space-xs">
                      <div>
                        {producer.isLiveStall ? (
                          <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/25 font-label-sm text-[11px] font-black inline-flex items-center gap-1 mb-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                            {producer.stallNumber || 'Registered Stall'}
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-xs">
                            {producer.stall}
                          </span>
                        )}
                        <h3 className="font-headline-md text-on-surface mt-1 font-bold">{producer.name}</h3>
                        <p className="font-label-sm text-primary text-xs font-semibold">{producer.farmers}</p>
                      </div>
                      <div className="flex items-center gap-0.5 px-2 py-1 rounded bg-surface-container-low text-on-surface font-label-sm text-xs">
                        <span className="material-symbols-outlined text-secondary text-[16px] fill">star</span>
                        <span>{producer.rating}</span>
                        <span className="text-on-surface-variant font-normal">({producer.reviews})</span>
                      </div>
                    </div>
                    <p className="font-body-sm text-on-surface-variant text-xs leading-relaxed">
                      {producer.desc}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-space-xs gap-space-xs border-t border-outline-variant/20">
                    <button
                      onClick={() => {
                        if (producer.farmerId) {
                          onNavigate('farmer-profile', producer.farmerId);
                        } else {
                          onNavigate(producer.farmKey === 'green-pastures' ? 'farmer-profile' : 'products');
                        }
                      }}
                      className="font-label-sm text-primary hover:underline flex items-center gap-1 text-xs cursor-pointer font-bold"
                    >
                      <span>{producer.isLiveStall ? 'Visit Live Stall' : 'View Stall Stock'}</span>
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </button>
                    {producer.status === 'sold-out' ? (
                      <span className="px-space-sm py-1 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-xs">
                        Sold Out This Sat
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          if (producer.farmerId) {
                            onNavigate('farmer-profile', producer.farmerId);
                          } else {
                            onNavigate('products');
                          }
                        }}
                        className="px-space-md py-1.5 rounded-full bg-tertiary-container text-on-tertiary font-label-sm hover:bg-tertiary transition-colors text-xs cursor-pointer shadow-sm font-bold"
                      >
                        {producer.btnText}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Produce Available for Saturday Reservation Section */}
      <section className="w-full py-space-xl px-3 sm:px-6 lg:px-gutter bg-surface-container-low border-t border-outline-variant/30">
        <div className="max-w-7xl mx-auto flex flex-col gap-space-lg">
          <div>
            <div className="inline-flex items-center gap-1 font-label-sm text-primary uppercase tracking-wider mb-1 font-bold">
              <span className="material-symbols-outlined text-[16px]">shopping_basket</span>
              <span>Saturday Pickup Harvest</span>
            </div>
            <h2 className="font-headline-lg text-on-surface">Reserve Fresh Harvest from Downtown Stalls</h2>
            <p className="font-body-md text-on-surface-variant max-w-3xl">
              Lock in your weekend basket before sunrise. Zero online fees, zero card forms here — simply inspect and pay directly at the vendor booth upon pickup.
            </p>
          </div>

          {/* Produce Cards Grid */}
          {harvestItems.length === 0 ? (
            <div className="bg-surface-container-lowest rounded-2xl p-12 text-center border border-outline-variant/30 flex flex-col items-center justify-center gap-3">
              <span className="material-symbols-outlined text-primary text-[44px]">spa</span>
              <h3 className="font-headline-md font-bold text-on-surface">No harvest crates listed yet for this market</h3>
              <p className="font-body-md text-on-surface-variant text-xs sm:text-sm max-w-md">
                Farmers bring fresh inventory directly from the fields. Check back Friday dawn when growers post their weekend availability.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-md">
              {harvestItems.map((item) => {
                const isSoldOut = item.status === 'SOLD_OUT';
                return (
                  <div
                    key={item.id}
                    className={`bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col border border-outline-variant/30 ${
                      isSoldOut ? 'opacity-90' : ''
                    }`}
                  >
                    <div className="h-48 w-full relative overflow-hidden bg-surface-container">
                      <img
                        src={item.image}
                        alt={item.alt}
                        className={`w-full h-full object-cover hover:scale-105 transition-transform duration-300 ${
                          isSoldOut ? 'grayscale-[30%]' : ''
                        }`}
                      />
                      <div className="absolute top-space-xs left-space-xs">
                        <span
                          className={`px-2.5 py-1 rounded-full font-label-sm shadow-sm text-xs ${
                            isSoldOut
                              ? 'bg-surface-container-highest text-on-surface-variant font-bold'
                              : item.status === 'LOW_STOCK'
                              ? 'bg-surface-container-high text-tertiary font-bold'
                              : 'bg-secondary-container text-on-secondary-container'
                          }`}
                        >
                          {item.badge}
                        </span>
                      </div>
                      <div className="absolute bottom-space-xs right-space-xs">
                        <span className="px-2 py-0.5 rounded-full bg-surface-container-lowest/90 backdrop-blur font-label-sm text-primary shadow-sm text-xs">
                          {item.stall}
                        </span>
                      </div>
                    </div>

                    <div className="p-space-md flex flex-col flex-grow justify-between gap-space-md">
                      <div>
                        <div className="flex items-baseline justify-between">
                          <h3 className="font-headline-sm text-on-surface text-base">{item.name}</h3>
                          <span className="font-headline-sm text-primary font-bold">
                            ${item.price.toFixed(2)}
                            <span className="text-xs font-normal text-on-surface-variant">/{item.unit}</span>
                          </span>
                        </div>
                        <p className="font-body-sm text-on-surface-variant mt-1 text-xs leading-relaxed">
                          {item.desc}
                        </p>
                      </div>

                      {isSoldOut ? (
                        <button
                          type="button"
                          disabled
                          className="w-full inline-flex items-center justify-center gap-space-xs px-space-md py-space-sm rounded-full bg-surface-container text-on-surface-variant font-label-md cursor-not-allowed text-xs"
                        >
                          <span className="material-symbols-outlined text-[18px]">event_busy</span>
                          Fully Reserved for Saturday
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onReserveProduct(item)}
                          className="w-full inline-flex items-center justify-center gap-space-xs px-space-md py-space-sm rounded-full bg-tertiary-container text-on-tertiary font-label-md hover:bg-tertiary transition-colors active:scale-95 shadow-sm cursor-pointer text-xs"
                        >
                          <span className="material-symbols-outlined text-[18px]">bookmark_add</span>
                          Reserve for Saturday Pickup
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Bottom Reservation Note */}
          <div className="p-space-md rounded-xl bg-surface-container flex flex-col sm:flex-row items-center justify-between gap-space-sm border border-outline-variant/30">
            <div className="flex items-center gap-space-sm">
              <span className="material-symbols-outlined text-primary text-[28px]">handshake</span>
              <div>
                <p className="font-label-md text-on-surface">How Stall Reservations Work on MarketLink</p>
                <p className="font-body-sm text-on-surface-variant text-xs">
                  Click Reserve to create your Saturday morning pickup docket. Farmers hold your produce safe until 11:30 AM. Zero prepayment required.
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('contact-us')}
              className="inline-flex items-center gap-1 font-label-sm text-primary hover:underline whitespace-nowrap cursor-pointer text-xs"
            >
              <span>Read Pickup Guidelines</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </section>

      {/* Community Notice & Market Organizer Box */}
      <section className="w-full py-space-xl px-3 sm:px-6 lg:px-gutter bg-surface">
        <div className="max-w-7xl mx-auto">
          <div className="bg-primary text-on-primary rounded-xl p-space-lg shadow-md relative overflow-hidden">
            {/* Decorative subtle leaf background SVG icon */}
            <div className="absolute right-4 -bottom-6 opacity-10 pointer-events-none">
              <span className="material-symbols-outlined text-[220px]">eco</span>
            </div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-center">
              <div className="lg:col-span-8 flex flex-col gap-space-sm">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-sm w-max text-xs">
                  <span className="material-symbols-outlined text-[16px]">campaign</span>
                  <span>This Saturday's Community Lineup</span>
                </div>
                <h3 className="font-headline-lg text-on-primary">Live Music, Garden Consults &amp; Grower Notices</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md mt-space-xs">
                  <div className="flex items-start gap-space-xs">
                    <span className="material-symbols-outlined text-secondary-fixed text-[22px] mt-0.5">music_note</span>
                    <div>
                      <p className="font-label-md text-on-primary">Live Bluegrass Acoustic Duo</p>
                      <p className="font-body-sm text-primary-fixed-dim text-xs">9:30 AM – 12:00 PM at Central Gazebo lawn. Bring picnic chairs!</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-space-xs">
                    <span className="material-symbols-outlined text-secondary-fixed text-[22px] mt-0.5">eco</span>
                    <div>
                      <p className="font-label-md text-on-primary">Master Gardener Soil Testing</p>
                      <p className="font-body-sm text-primary-fixed-dim text-xs">Desk near Stall #1: Bring 1 cup dry garden soil for free pH test.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 flex flex-col items-start lg:items-end gap-space-sm">
                <div className="bg-primary-container p-space-md rounded-lg text-left w-full border border-primary-fixed/20 shadow-sm">
                  <p className="font-label-md text-on-primary">Are you a regional grower?</p>
                  <p className="font-body-sm text-primary-fixed-dim mb-space-xs text-xs">
                    Downtown Historic has 2 seasonal guest producer spots available for autumn harvests.
                  </p>
                  <button
                    onClick={() => onNavigate('farmer-portal')}
                    className="inline-flex items-center gap-1 font-label-sm text-secondary-fixed hover:underline cursor-pointer text-xs"
                  >
                    <span>Apply for a Stall Space</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
