import React from 'react';

export default function ProductShowcase({ 
  products, 
  onReserveProduct, 
  onNotifyProduct, 
  selectedCategory, 
  onResetFilters,
  activeMarketFilter 
}) {
  return (
    <section id="products" className="w-full py-space-xl bg-surface-container-low">
      <div className="max-w-7xl mx-auto px-gutter">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-space-lg gap-space-sm">
          <div>
            <div className="inline-flex items-center gap-space-xs bg-secondary-fixed/50 text-on-secondary-fixed-variant px-space-sm py-0.5 rounded-full font-label-sm mb-space-xs">
              <span className="w-2 h-2 rounded-full bg-secondary animate-ping"></span>
              Live Harvest Reservations Active
            </div>
            <h2 className="font-headline-lg text-on-surface">Fresh This Week From the Fields</h2>
            <p className="font-body-md text-on-surface-variant">
              Lock in your basket before weekend pickup. Pay directly to your grower at the stand.
            </p>
          </div>

          <div className="flex items-center gap-space-xs">
            {(selectedCategory !== 'all' || (activeMarketFilter && activeMarketFilter !== 'all')) && (
              <button
                onClick={onResetFilters}
                className="bg-primary/10 hover:bg-primary/20 text-primary font-label-sm px-space-md py-space-xs rounded-full transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
                Clear Active Filters
              </button>
            )}
            <button
              onClick={onResetFilters}
              className="bg-surface-container-lowest hover:bg-surface-container text-on-surface font-label-md px-space-md py-space-xs rounded-full shadow-sm transition-colors cursor-pointer"
            >
              View All Harvest Items
            </button>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="bg-surface-container-lowest rounded-xl p-space-xl text-center shadow-sm">
            <span className="material-symbols-outlined text-primary text-[48px] mb-space-sm">search_off</span>
            <h3 className="font-headline-md text-on-surface">No harvest items found</h3>
            <p className="font-body-md text-on-surface-variant mt-1 mb-space-md">
              Try adjusting your produce type or market filters to explore other seasonal crops.
            </p>
            <button
              onClick={onResetFilters}
              className="bg-tertiary-container hover:bg-tertiary text-on-tertiary font-label-md px-space-lg py-space-xs rounded-full shadow-sm cursor-pointer"
            >
              Show All Available Produce
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-lg">
            {products.map((item) => {
              const isSoldOut = item.status === 'SOLD_OUT';
              const isLowStock = item.status === 'LOW_STOCK';

              return (
                <div
                  key={item.id}
                  className={`bg-surface-container-lowest rounded-xl overflow-hidden shadow-md flex flex-col group hover:-translate-y-1 transition-all border border-outline-variant/30 ${
                    isSoldOut ? 'opacity-90' : ''
                  }`}
                >
                  {/* Product Image and status tags */}
                  <div className="relative h-52 w-full overflow-hidden bg-surface-container">
                    <img
                      src={item.image}
                      alt={item.alt}
                      className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                        isSoldOut ? 'grayscale-[30%]' : ''
                      }`}
                    />

                    {/* Status Badge */}
                    <div className="absolute top-space-sm left-space-sm">
                      {isSoldOut ? (
                        <span className="bg-surface-container-highest text-on-surface-variant font-label-sm px-space-sm py-1 rounded-full shadow-sm flex items-center gap-1 border border-outline-variant/40">
                          <span className="material-symbols-outlined text-[14px]">block</span>
                          {item.stockText}
                        </span>
                      ) : isLowStock ? (
                        <span className="bg-tertiary-fixed text-on-tertiary-fixed-variant font-label-sm px-space-sm py-1 rounded-full shadow-sm flex items-center gap-1 border border-[#FFE0B2]">
                          <span className="material-symbols-outlined text-[14px]">warning</span>
                          {item.stockText}
                        </span>
                      ) : (
                        <span className="bg-primary/95 text-on-primary font-label-sm px-space-sm py-1 rounded-full shadow-sm flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">check_circle</span>
                          {item.stockText}
                        </span>
                      )}
                    </div>

                    {/* Price Badge */}
                    <div className="absolute bottom-space-sm right-space-sm bg-surface-container-lowest/90 backdrop-blur-md px-space-sm py-0.5 rounded-md font-label-sm text-on-surface font-bold shadow-sm">
                      ${item.price.toFixed(2)}{' '}
                      <span className="font-normal text-xs text-on-surface-variant">/ {item.unit}</span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-space-md flex flex-col flex-1">
                    <span className="font-label-sm text-primary font-bold">{item.farm}</span>
                    <h3 className="font-headline-sm text-on-surface mt-0.5 mb-space-xs">{item.name}</h3>
                    <p className="font-body-sm text-on-surface-variant mb-space-md">{item.description}</p>

                    <div className="mt-auto pt-space-sm flex items-center justify-between border-t border-outline-variant/20">
                      <div className="flex items-center gap-1 text-on-surface-variant font-body-sm text-xs">
                        <span className="material-symbols-outlined text-[16px] text-primary">storefront</span>
                        {item.market}
                      </div>

                      {isSoldOut ? (
                        <button
                          onClick={() => onNotifyProduct(item)}
                          className="bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-md px-space-md py-space-xs rounded-full transition-colors text-sm cursor-pointer"
                        >
                          Notify Next Harvest
                        </button>
                      ) : (
                        <button
                          onClick={() => onReserveProduct(item)}
                          className="bg-tertiary-container hover:bg-tertiary text-on-tertiary font-label-md px-space-md py-space-xs rounded-full shadow-sm transition-all active:scale-95 text-sm cursor-pointer"
                        >
                          Reserve for Pickup
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
