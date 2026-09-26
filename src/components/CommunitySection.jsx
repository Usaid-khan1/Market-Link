import React, { useEffect, useRef, useState } from 'react';
import { TESTIMONIALS } from '../data/mockData';

const stats = [
  { value: '4,800+', label: 'Crates Reserved', icon: 'inventory_2', color: 'text-primary', bg: 'bg-primary/8' },
  { value: '100%', label: 'Direct Farmer Payout', icon: 'payments', color: 'text-secondary', bg: 'bg-secondary/8' },
  { value: '<18 mi', label: 'Avg Farm Distance', icon: 'near_me', color: 'text-tertiary', bg: 'bg-tertiary/8' },
  { value: '0 lbs', label: 'Packaging Waste', icon: 'eco', color: 'text-primary', bg: 'bg-primary/8' },
];

export default function CommunitySection() {
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
      className="w-full py-20 relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #f0f7f1 0%, #fcf9f8 60%, #fff8f0 100%)' }}
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      {/* Ambient decoration */}
      <div
        className="absolute -right-40 top-1/2 -translate-y-1/2 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(185,244,116,0.15) 0%, transparent 70%)' }}
      />

      <div className="max-w-7xl mx-auto px-gutter">
        {/* Section Header */}
        <div className={`text-center mb-12 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/8 border border-primary/15 font-black text-primary uppercase tracking-widest text-[10px] mb-3">
            <span className="material-symbols-outlined text-[14px]">groups</span>
            Real Community Impact
          </span>
          <h2 className="font-headline-lg text-on-surface mt-2 mb-2">By the Numbers &amp; By the People</h2>
          <p className="font-body-md text-on-surface-variant">The MarketLink difference in real community voices.</p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
          {stats.map((stat, i) => (
            <div
              key={i}
              className={`group relative rounded-2xl p-6 text-center border border-outline-variant/20 bg-white hover:-translate-y-1 transition-all duration-300 hover:shadow-[0_12px_32px_rgba(18,82,36,0.1)] cursor-default ${
                visible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
              }`}
              style={{
                transitionDelay: `${i * 80}ms`,
                boxShadow: '0 2px 12px rgba(18,82,36,0.05)',
              }}
            >
              <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300`}>
                <span className={`material-symbols-outlined text-[22px] ${stat.color}`}>{stat.icon}</span>
              </div>
              <p className={`stat-number text-3xl font-black ${stat.color} leading-none mb-1`}>
                {stat.value}
              </p>
              <p className="font-label-sm text-on-surface-variant text-xs mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TESTIMONIALS.map((test, i) => (
            <div
              key={test.id}
              className={`group relative bg-white rounded-2xl p-7 flex flex-col justify-between border border-outline-variant/20 hover:-translate-y-1 transition-all duration-300 hover:shadow-[0_16px_40px_rgba(18,82,36,0.1)] ${
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{
                transitionDelay: `${(i + 4) * 80}ms`,
                boxShadow: '0 4px 16px rgba(18,82,36,0.06)',
              }}
            >
              {/* Quote icon */}
              <div className="absolute top-5 right-5 opacity-8">
                <span className="material-symbols-outlined text-[48px] text-primary">format_quote</span>
              </div>

              <div className="relative">
                {/* Stars */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, si) => (
                    <span key={si} className="material-symbols-outlined text-[18px] text-tertiary fill">star</span>
                  ))}
                </div>
                <p className="font-body-lg text-on-surface leading-relaxed text-base italic">
                  {test.text}
                </p>
              </div>

              <div className="flex items-center gap-4 mt-6 pt-5 border-t border-outline-variant/20">
                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center font-black text-sm shadow-sm border-2 border-white ${test.badgeBg}`}
                >
                  {test.badge}
                </div>
                <div className="flex-1">
                  <p className="font-label-md text-on-surface font-bold">{test.author}</p>
                  <p className="font-body-sm text-on-surface-variant text-xs">{test.role}</p>
                </div>
                <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/8 text-primary text-[10px] font-black uppercase tracking-wide">
                  <span className="material-symbols-outlined text-[12px]">verified</span>
                  Verified
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
