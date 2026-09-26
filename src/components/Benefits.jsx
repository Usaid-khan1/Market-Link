import React, { useEffect, useRef, useState } from 'react';

const benefits = [
  {
    id: 1,
    title: 'Zero Delivery Miles',
    desc: 'You collect directly at the community market stall. No delivery trucks, plastic cold packs, or stale shipping transit.',
    icon: 'directions_walk',
    gradient: 'linear-gradient(135deg, #b9f474, #9ed75b)',
    iconColor: 'text-on-secondary-fixed-variant',
    tag: 'Eco Friendly',
  },
  {
    id: 2,
    title: 'No Online Card Hassles',
    desc: 'Never enter payment details online. Simply inspect your harvest crate and settle up face-to-face with your grower.',
    icon: 'credit_card_off',
    gradient: 'linear-gradient(135deg, #b0f2b4, #95d69a)',
    iconColor: 'text-on-primary-fixed',
    tag: 'Zero Risk',
  },
  {
    id: 3,
    title: 'Guaranteed Stall Hold',
    desc: "Farmers pack your crate early in the sunrise mist; your heirloom tomatoes won't sell out before you arrive at 10 AM.",
    icon: 'lock_clock',
    gradient: 'linear-gradient(135deg, #ffdcc3, #ffb77d)',
    iconColor: 'text-on-tertiary-fixed',
    tag: 'Priority Access',
  },
  {
    id: 4,
    title: '100% Farmer Revenue',
    desc: 'Every single dollar goes straight into regional agricultural hands. No middleman distribution cut or markup.',
    icon: 'savings',
    gradient: 'linear-gradient(135deg, #a7e9ac, #7dc982)',
    iconColor: 'text-on-primary-container',
    tag: 'Fair Trade',
  },
];

export default function Benefits() {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="w-full py-16 relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #fcf9f8 0%, #f0f7f1 100%)' }}>
      {/* Subtle section divider glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-gutter">
        {/* Section Header */}
        <div className={`text-center mb-12 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/8 border border-primary/15 font-black text-primary uppercase tracking-widest text-[10px] mb-3">
            <span className="material-symbols-outlined text-[14px]">eco</span>
            Why MarketLink
          </span>
          <h2 className="font-headline-lg text-on-surface mt-2">The Benefits of Buying Direct</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {benefits.map((item, i) => (
            <div
              key={item.id}
              className={`group relative bg-white rounded-2xl p-6 flex flex-col gap-3 border border-outline-variant/20 cursor-default transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(18,82,36,0.12)] ${
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{
                transitionDelay: `${i * 80}ms`,
                boxShadow: '0 2px 12px rgba(18,82,36,0.06)',
              }}
            >
              {/* Gradient Icon Badge */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-1 shadow-sm group-hover:scale-110 transition-transform duration-300"
                style={{ background: item.gradient }}
              >
                <span className={`material-symbols-outlined text-[28px] ${item.iconColor}`}>{item.icon}</span>
              </div>

              {/* Tag chip */}
              <span className="inline-flex items-center gap-1 w-fit px-2 py-0.5 rounded-full bg-primary/8 text-primary text-[10px] font-black uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                {item.tag}
              </span>

              <h3 className="font-headline-sm text-on-surface font-bold">{item.title}</h3>
              <p className="font-body-sm text-on-surface-variant leading-relaxed text-sm">{item.desc}</p>

              {/* Hover shimmer border */}
              <div className="absolute inset-0 rounded-2xl border-2 border-primary opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
