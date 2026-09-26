import React, { useEffect, useRef, useState } from 'react';

export default function ProductShowcase({
  products,
  onReserveProduct,
  onNotifyProduct,
  selectedCategory,
  onResetFilters,
  activeMarketFilter
}) {
  const [visible, setVisible] = useState(false);
  const [hoveredId, setHoveredId] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.05 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const hasActiveFilters = selectedCategory !== 'all' || (activeMarketFilter && activeMarketFilter !== 'all');

  return (
    <section
      ref={ref}
      id="products"
      className="w-full py-20 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #fcf9f8 0%, #f0f7f1 100%)' }}
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-gutter">
        {/* Header */}
        <div className={`flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <div>
            {/* Live badge */}
            <div className="inline-flex items-center gap-2 bg-secondary-fixed/25 border border-secondary/20 text-on-secondary-fixed-variant px-3 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest mb-4 shadow-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-secondary" />
              </span>
              Live Harvest Reservations Active
            </div>
            <h2 className="font-headline-lg text-on-surface font-black mb-2">
              Fresh This Week{' '}
              <span className="hero-headline-gradient" style={{ backgroundSize: '200% auto' }}>From the Fields</span>
            </h2>
            <p className="font-body-md text-on-surface-variant text-sm">
              Lock in your basket before weekend pickup. Pay directly to your grower at the stand.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {hasActiveFilters && (
              <button
                onClick={onResetFilters}
                className="inline-flex items-center gap-1.5 bg-error-container/30 border border-error/20 hover:bg-error-container/50 text-error font-bold text-xs px-3 py-2 rounded-xl transition-all duration-200 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[15px]">filter_alt_off</span>
                Clear Filters
              </button>
            )}
            <button
              onClick={onResetFilters}
              className="inline-flex items-center gap-1.5 bg-white border border-outline-variant/20 hover:border-primary/30 hover:bg-primary/4 text-on-surface font-bold text-xs px-4 py-2 rounded-xl shadow-sm transition-all duration-200 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[15px] text-primary">grid_view</span>
              View All Harvest
            </button>
          </div>
        </div>

        {/* Empty State */}
        {products.length === 0 ? (
          <div
            className={`rounded-3xl p-16 text-center border border-outline-variant/20 bg-white transition-all duration-700 ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
            style={{ boxShadow: '0 8px 32px rgba(18,82,36,0.06)' }}
          >
            <div className="w-20 h-20 rounded-full bg-primary/8 flex items-center justify-center mx-auto mb-5">
              <span className="material-symbols-outlined text-primary text-[40px]">search_off</span>
            </div>
            <h3 className="font-headline-md text-on-surface font-bold mb-2">No harvest items found</h3>
            <p className="font-body-md text-on-surface-variant text-sm mb-6 max-w-sm mx-auto">
              Try adjusting your produce type or market filters to explore other seasonal crops.
            </p>
            <button
              onClick={onResetFilters}
              className="inline-flex items-center gap-2 font-bold text-sm px-6 py-3 rounded-xl text-on-primary active:scale-95 cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(18,82,36,0.25)]"
              style={{ background: 'linear-gradient(135deg, #914d00, #6e3900)' }}
            >
              <span className="material-symbols-outlined text-[18px]">refresh</span>
              Show All Available Produce
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((item, i) => {
              const isSoldOut = item.status === 'SOLD_OUT';
              const isLowStock = item.status === 'LOW_STOCK';
              const isHovered = hoveredId === item.id;

              return (
                <div
                  key={item.id}
                  className={`group relative bg-white rounded-2xl overflow-hidden flex flex-col border cursor-default transition-all duration-500 ${
                    visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  } ${
                    isSoldOut
                      ? 'opacity-80 border-outline-variant/15'
                      : isHovered
                      ? 'border-primary/20 shadow-[0_20px_48px_rgba(18,82,36,0.15)] -translate-y-2'
                      : 'border-outline-variant/20 hover:-translate-y-2 hover:shadow-[0_20px_48px_rgba(18,82,36,0.12)] hover:border-primary/15'
                  }`}
                  style={{
                    transitionDelay: `${i * 60}ms`,
                    boxShadow: isSoldOut ? 'none' : '0 4px 16px rgba(18,82,36,0.06)',
                  }}
                  onMouseEnter={() => setHoveredId(item.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  {/* Product Image */}
                  <div className="relative h-56 w-full overflow-hidden bg-surface-container flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.alt || item.name}
                      className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${
                        isSoldOut ? 'grayscale-[40%]' : ''
                      }`}
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                    {/* Category top bar */}
                    <div
                      className="absolute inset-x-0 top-0 h-1"
                      style={{
                        background: isSoldOut
                          ? '#c0c9bd'
                          : isLowStock
                          ? 'linear-gradient(90deg, #914d00, #6e3900)'
                          : 'linear-gradient(90deg, #125224, #3e6a00, #b9f474)',
                      }}
                    />

                    {/* Status Badge */}
                    <div className="absolute top-3 left-3">
                      {isSoldOut ? (
                        <span className="flex items-center gap-1.5 bg-black/50 backdrop-blur-md text-white font-bold px-3 py-1.5 rounded-full text-[11px]">
                          <span className="material-symbols-outlined text-[13px]">block</span>
                          {item.stockText || 'Sold Out'}
                        </span>
                      ) : isLowStock ? (
                        <span className="flex items-center gap-1.5 bg-tertiary-fixed backdrop-blur-md text-on-tertiary-fixed-variant font-bold px-3 py-1.5 rounded-full text-[11px] shadow-sm">
                          <span className="material-symbols-outlined text-[13px] animate-pulse">warning</span>
                          {item.stockText || 'Low Stock'}
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 bg-primary/90 backdrop-blur-md text-on-primary font-bold px-3 py-1.5 rounded-full text-[11px] shadow-sm">
                          <span className="material-symbols-outlined text-[13px]">check_circle</span>
                          {item.stockText || 'In Stock'}
                        </span>
                      )}
                    </div>

                    {/* Price Badge */}
                    <div className="absolute bottom-3 right-3">
                      <div
                        className="px-3 py-1.5 rounded-xl font-black text-on-surface text-sm shadow-lg border border-white/20"
                        style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(12px)' }}
                      >
                        ${item.price?.toFixed(2)}
                        <span className="font-normal text-on-surface-variant text-[10px] ml-1">/ {item.unit}</span>
                      </div>
                    </div>

                    {/* Wishlist button on hover */}
                    <button
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white/40 cursor-pointer"
                      onClick={(e) => { e.stopPropagation(); onNotifyProduct(item); }}
                    >
                      <span className="material-symbols-outlined text-[16px]">notifications</span>
                    </button>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="flex items-center gap-1 bg-primary/8 text-primary font-bold text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wide">
                        <span className="material-symbols-outlined text-[11px]">agriculture</span>
                        {item.farm || item.stall_name || 'Local Farm'}
                      </span>
                    </div>
                    <h3 className="font-bold text-on-surface text-base mb-1 group-hover:text-primary transition-colors duration-200">{item.name}</h3>
                    <p className="text-on-surface-variant text-sm leading-relaxed mb-4 flex-1 line-clamp-2">{item.description}</p>

                    {/* Footer */}
                    <div className="pt-3 border-t border-outline-variant/15 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 text-on-surface-variant text-xs">
                        <span className="material-symbols-outlined text-[14px] text-primary">storefront</span>
                        <span className="truncate max-w-[100px]">{item.market || item.market_name}</span>
                      </div>

                      {isSoldOut ? (
                        <button
                          onClick={() => onNotifyProduct(item)}
                          className="inline-flex items-center gap-1.5 bg-surface-container border border-outline-variant/30 hover:border-primary/30 hover:bg-primary/6 text-on-surface font-bold text-xs px-3 py-2 rounded-xl transition-all duration-200 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[14px] text-primary">notifications</span>
                          Notify Me
                        </button>
                      ) : (
                        <button
                          onClick={() => onReserveProduct(item)}
                          className="inline-flex items-center gap-1.5 font-bold text-xs px-4 py-2 rounded-xl text-on-primary active:scale-95 cursor-pointer transition-all duration-200 hover:shadow-[0_4px_12px_rgba(145,77,0,0.3)] hover:-translate-y-0.5"
                          style={{ background: 'linear-gradient(135deg, #914d00, #6e3900)' }}
                        >
                          <span className="material-symbols-outlined text-[14px]">shopping_basket</span>
                          Reserve Pickup
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
