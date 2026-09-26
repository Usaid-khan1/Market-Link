import React, { useEffect, useRef, useState } from 'react';
import { GROWERS } from '../data/mockData';

export default function GrowersShowcase({ onNavigate }) {
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
    <section ref={ref} id="about-us" className="w-full py-20 bg-surface relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-outline-variant/50 to-transparent" />
      <div
        className="absolute -left-40 top-1/2 -translate-y-1/2 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(185,244,116,0.1) 0%, transparent 70%)' }}
      />

      <div className="max-w-7xl mx-auto px-gutter">
        {/* Header */}
        <div className={`flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/8 border border-secondary/15 font-black text-secondary uppercase tracking-widest text-[10px] mb-3">
              <span className="material-symbols-outlined text-[14px]">volunteer_activism</span>
              Real Stewards of the Soil
            </span>
            <h2 className="font-headline-lg text-on-surface mt-1 mb-1">Meet Your Regional Growers</h2>
            <p className="font-body-md text-on-surface-variant text-sm">
              Shake hands with the very people who plant the seeds, nurture the crops, and pack your crate.
            </p>
          </div>
          <button
            onClick={() => onNavigate('about-us')}
            className="group inline-flex items-center gap-2 font-bold text-sm text-primary hover:text-primary-container transition-all duration-200 cursor-pointer px-4 py-2 rounded-xl hover:bg-primary/8"
          >
            <span>Explore All Grower Stories</span>
            <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform duration-200">chevron_right</span>
          </button>
        </div>

        {/* Grower Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {GROWERS.map((farmer, i) => (
            <div
              key={farmer.id}
              className={`group relative bg-white rounded-2xl overflow-hidden border border-outline-variant/20 hover:-translate-y-2 transition-all duration-500 hover:shadow-[0_20px_48px_rgba(18,82,36,0.12)] cursor-default ${
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{
                transitionDelay: `${i * 100}ms`,
                boxShadow: '0 4px 16px rgba(18,82,36,0.06)',
              }}
            >
              {/* Top accent bar */}
              <div
                className="h-1.5 w-full"
                style={{ background: 'linear-gradient(90deg, #125224, #3e6a00, #b9f474)' }}
              />

              <div className="p-6">
                {/* Farmer header */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-surface-container-high shadow-md border-2 border-white">
                      <img
                        src={farmer.image}
                        alt={farmer.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    {/* Online dot */}
                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-secondary-fixed border-2 border-white flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-headline-sm text-on-surface font-bold truncate">{farmer.name}</h3>
                    <p className="text-primary font-bold text-xs">{farmer.farm}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {[...Array(5)].map((_, si) => (
                        <span key={si} className="material-symbols-outlined text-[13px] text-tertiary fill">star</span>
                      ))}
                      <span className="text-on-surface font-bold text-xs ml-1">{farmer.rating}</span>
                      <span className="text-on-surface-variant text-xs">({farmer.pickups})</span>
                    </div>
                  </div>
                </div>

                {/* Quote */}
                <div className="relative">
                  <span className="material-symbols-outlined text-[32px] text-primary/10 absolute -top-2 -left-1">format_quote</span>
                  <p className="font-body-md text-on-surface-variant italic text-sm leading-relaxed pl-6">
                    {farmer.quote}
                  </p>
                </div>

                {/* Footer */}
                <div className="mt-5 pt-4 border-t border-outline-variant/20 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-on-surface-variant text-xs">
                    <span className="material-symbols-outlined text-[14px] text-primary">location_on</span>
                    {farmer.location}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-primary/8 text-primary font-bold text-[10px] uppercase tracking-wide">
                    {farmer.marketTag}
                  </span>
                </div>
              </div>

              {/* Hover glow */}
              <div className="absolute inset-0 rounded-2xl border-2 border-primary opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
