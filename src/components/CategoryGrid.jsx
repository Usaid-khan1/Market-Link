import React, { useEffect, useRef, useState } from 'react';
import { CATEGORIES } from '../data/mockData';

export default function CategoryGrid({ selectedCategory, onSelectCategory }) {
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
    <section ref={ref} className="w-full py-16 bg-surface relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-outline-variant/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-gutter">
        {/* Header */}
        <div className={`text-center max-w-2xl mx-auto mb-10 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/8 border border-primary/15 font-black text-primary uppercase tracking-widest text-[10px] mb-3">
            <span className="material-symbols-outlined text-[14px]">grid_view</span>
            Explore By Aisle
          </span>
          <h2 className="font-headline-lg text-on-surface mt-2 mb-2">Fresh Seasonal Categories</h2>
          <p className="font-body-md text-on-surface-variant text-sm">
            Everything picked at sunrise and prepared by dedicated valley hands.
          </p>
        </div>

        {/* Category Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.map((cat, i) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(isActive ? 'all' : cat.id)}
                className={`group relative flex flex-col items-center text-center rounded-2xl p-5 cursor-pointer transition-all duration-300 border ${
                  visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                } ${
                  isActive
                    ? 'border-primary bg-primary/6 shadow-[0_8px_24px_rgba(18,82,36,0.15)] -translate-y-1'
                    : 'border-outline-variant/20 bg-white hover:-translate-y-2 hover:shadow-[0_12px_32px_rgba(18,82,36,0.1)] hover:border-primary/20'
                }`}
                style={{
                  transitionDelay: `${i * 60}ms`,
                  boxShadow: isActive ? undefined : '0 2px 8px rgba(18,82,36,0.05)',
                }}
              >
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-primary flex items-center justify-center animate-bounce-in">
                    <span className="material-symbols-outlined text-on-primary text-[12px]">check</span>
                  </div>
                )}

                {/* Icon */}
                <div
                  className={`w-16 h-16 rounded-2xl ${cat.bgClass} flex items-center justify-center ${cat.textClass} mb-3 group-hover:scale-110 transition-transform duration-300 shadow-sm ${
                    isActive ? 'scale-110 shadow-md' : ''
                  }`}
                >
                  <span className="material-symbols-outlined text-[30px]">{cat.icon}</span>
                </div>

                <span className={`font-bold text-sm transition-colors leading-tight ${isActive ? 'text-primary' : 'text-on-surface group-hover:text-primary'}`}>
                  {cat.name}
                </span>
                <span className="font-body-sm text-on-surface-variant text-[11px] mt-1 leading-tight">
                  {cat.subtitle}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
