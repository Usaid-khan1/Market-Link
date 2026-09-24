import React from 'react';

export default function FeaturedMarkets({ markets, onSelectMarket, activeMarketFilter }) {
  return (
    <section id="markets" className="w-full py-space-xl bg-surface-container-low">
      <div className="max-w-7xl mx-auto px-gutter">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-space-lg gap-space-sm">
          <div>
            <span className="font-label-sm text-primary uppercase tracking-widest font-bold">
              Community Gathering Hubs
            </span>
            <h2 className="font-headline-lg text-on-surface mt-space-xs">
              Featured Regional Markets
            </h2>
            <p className="font-body-md text-on-surface-variant">
              Reserve items ahead and pick up at these active market plazas.
            </p>
          </div>
          
          <button
            onClick={() => onSelectMarket('all')}
            className="inline-flex items-center gap-space-xs font-label-md text-primary hover:text-primary-container transition-colors cursor-pointer"
          >
            <span>{activeMarketFilter && activeMarketFilter !== 'all' ? 'Show All Markets' : 'View All 14 Nearby Markets'}</span>
            <span className="material-symbols-outlined text-[18px]">chevron_right</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg">
          {markets.map((market) => {
            const isSelected = activeMarketFilter === market.key;
            return (
              <div
                key={market.id}
                className={`bg-surface-container-lowest rounded-xl overflow-hidden shadow-md flex flex-col group hover:-translate-y-1 transition-all border ${
                  isSelected ? 'border-primary ring-2 ring-primary/20' : 'border-outline-variant/30'
                }`}
              >
                {/* Image Banner with schedule badge */}
                <div 
                  className="w-full h-44 bg-surface-container-high relative flex items-end p-space-sm bg-cover bg-center"
                  style={{ backgroundImage: `url('${market.image}')` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                  <span className="relative z-10 bg-surface/95 backdrop-blur-md px-space-sm py-space-xs rounded-full font-label-sm text-primary flex items-center gap-space-xs shadow-sm">
                    <span className="material-symbols-outlined text-[14px]">event</span>
                    {market.schedule}
                  </span>
                </div>

                <div className="p-space-lg flex flex-col flex-1">
                  <div className="flex items-center justify-between mb-space-xs">
                    <span className="font-label-sm text-on-surface-variant flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px] text-tertiary">near_me</span>
                      {market.distance}
                    </span>
                    <span className="bg-secondary-fixed text-on-secondary-fixed font-label-sm px-space-xs py-0.5 rounded-full text-xs">
                      {market.stalls} Stalls
                    </span>
                  </div>

                  <h3 className="font-headline-md text-on-surface mb-space-xs">
                    {market.name}
                  </h3>
                  <p className="font-body-sm text-on-surface-variant mb-space-sm">
                    {market.address} • Special: {market.special}
                  </p>

                  <div className="mt-auto pt-space-md border-t border-outline-variant/30 flex items-center justify-between">
                    <span className="font-label-sm text-on-surface-variant">
                      Stall pickup: {market.pickupBay}
                    </span>
                    <button
                      onClick={() => onSelectMarket(market.key)}
                      className="font-label-sm text-tertiary-container hover:text-tertiary font-bold inline-flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <span>Stall List &amp; Reserve</span>
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
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
