import React, { useEffect, useRef, useState } from 'react';

export default function FeaturedMarkets({ markets, onSelectMarket, activeMarketFilter }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      id="markets"
      className="w-full py-20 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #f0f7f1 0%, #fcf9f8 100%)' }}
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-gutter">
        {/* Header */}
        <div className={`flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/8 border border-primary/15 font-black text-primary uppercase tracking-widest text-[10px] mb-3">
              <span className="material-symbols-outlined text-[14px]">location_on</span>
              Community Gathering Hubs
            </span>
            <h2 className="font-headline-lg text-on-surface mt-1 mb-1">Featured Regional Markets</h2>
            <p className="font-body-md text-on-surface-variant text-sm">
              Reserve items ahead and pick up at these active market plazas.
            </p>
          </div>

          <button
            onClick={() => onSelectMarket('all')}
            className="group inline-flex items-center gap-2 font-bold text-sm text-primary hover:text-primary-container transition-all duration-200 cursor-pointer px-4 py-2 rounded-xl hover:bg-primary/8"
          >
            <span>{activeMarketFilter && activeMarketFilter !== 'all' ? 'Show All Markets' : 'View All 14 Nearby Markets'}</span>
            <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform duration-200">chevron_right</span>
          </button>
        </div>

        {/* Market Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {markets.map((market, i) => {
            const isSelected = activeMarketFilter === market.key;
            return (
              <div
                key={market.id}
                className={`group relative bg-white rounded-2xl overflow-hidden flex flex-col cursor-default transition-all duration-500 ${
                  visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                } ${
                  isSelected
                    ? 'ring-2 ring-primary shadow-[0_12px_40px_rgba(18,82,36,0.2)]'
                    : 'shadow-[0_4px_16px_rgba(18,82,36,0.07)] hover:shadow-[0_20px_48px_rgba(18,82,36,0.14)] hover:-translate-y-2'
                } border ${isSelected ? 'border-primary/30' : 'border-outline-variant/20'}`}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                {/* Image Banner */}
                <div className="w-full h-48 relative overflow-hidden bg-surface-container-high flex-shrink-0">
                  <div
                    className="w-full h-full bg-cover bg-center market-card-img"
                    style={{ backgroundImage: `url('${market.image}')` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                  {/* Schedule Badge */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between z-10">
                    <span className="flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full font-bold text-primary text-xs shadow-sm border border-white/50">
                      <span className="material-symbols-outlined text-[14px]">event</span>
                      {market.schedule}
                    </span>
                    {isSelected && (
                      <span className="flex items-center gap-1 bg-primary text-on-primary px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                        <span className="material-symbols-outlined text-[12px]">check</span>
                        Active
                      </span>
                    )}
                  </div>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <span className="flex items-center gap-1.5 text-on-surface-variant text-xs font-semibold">
                      <span className="material-symbols-outlined text-[15px] text-tertiary">near_me</span>
                      {market.distance}
                    </span>
                    <span className="flex items-center gap-1 bg-secondary-fixed text-on-secondary-fixed-variant px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wide">
                      <span className="material-symbols-outlined text-[12px]">storefront</span>
                      {market.stalls} Stalls
                    </span>
                  </div>

                  <h3 className="font-headline-md text-on-surface font-bold mb-1.5">{market.name}</h3>
                  <p className="font-body-sm text-on-surface-variant text-xs leading-relaxed mb-4 flex-1">
                    {market.address}
                    {market.special && (
                      <> &bull; <span className="text-tertiary font-semibold">Special: {market.special}</span></>
                    )}
                  </p>

                  <div className="pt-3 border-t border-outline-variant/20 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-on-surface-variant text-xs">
                      <span className="material-symbols-outlined text-[14px] text-primary">local_shipping</span>
                      Pickup: {market.pickupBay}
                    </span>
                    <button
                      onClick={() => onSelectMarket(market.key)}
                      className="group/btn inline-flex items-center gap-1.5 font-bold text-xs text-tertiary-container hover:text-tertiary transition-all duration-200 cursor-pointer"
                    >
                      <span>Stall List &amp; Reserve</span>
                      <span className="material-symbols-outlined text-[15px] group-hover/btn:translate-x-0.5 transition-transform duration-200">arrow_forward</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
