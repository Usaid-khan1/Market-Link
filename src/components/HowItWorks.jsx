import React, { useEffect, useRef, useState } from 'react';

const steps = [
  {
    step: '01',
    title: 'Discover Nearby Pavilions',
    desc: 'Explore weekend and midweek open-air farmers markets in your region. View stall maps, vendor directories, and sunrise harvest schedules.',
    icon: 'storefront',
    highlight: '14 Active Verified Regional Pavilions',
    highlightIcon: 'location_on',
  },
  {
    step: '02',
    title: 'Reserve Harvest for Free',
    desc: 'Browse crops picked at sunrise. Lock in your favorite heirloom tomatoes, artisan sourdough, and fresh eggs online with zero upfront card charges.',
    icon: 'shopping_basket',
    highlight: 'Crate Packed & Held with Your Name',
    highlightIcon: 'inventory_2',
  },
  {
    step: '03',
    title: 'Pick Up & Pay at the Stall',
    desc: 'Visit your grower’s market stall on pickup morning. Inspect your fresh produce, meet your family farmer, and pay directly using cash, card, or SNAP tokens.',
    icon: 'handshake',
    highlight: '100% In-Person Payment • Zero Middleman Fees',
    highlightIcon: 'verified_user',
  },
];

export default function HowItWorks() {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="w-full py-20 relative overflow-hidden bg-surface">
      {/* Subtle top divider line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-outline-variant/40 to-transparent" />

      {/* Ambient background glows */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(18,82,36,0.05) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-7xl mx-auto px-gutter relative z-10">
        {/* Section Header */}
        <div
          className={`text-center max-w-2xl mx-auto mb-14 transition-all duration-700 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/8 border border-primary/15 font-black text-primary uppercase tracking-widest text-[11px] mb-3">
            <span className="material-symbols-outlined text-[15px] text-primary">eco</span>
            <span>SIMPLE &amp; TRANSPARENT • HOW IT WORKS</span>
          </div>

          <h2 className="font-headline-lg text-3xl sm:text-4xl text-on-surface font-extrabold tracking-tight mt-1 mb-3">
            From Sunrise Harvest to Table in{' '}
            <span className="hero-headline-gradient" style={{ backgroundSize: '200% auto' }}>
              3 Effortless Steps
            </span>
          </h2>
          <p className="font-body-md text-sm sm:text-base text-on-surface-variant leading-relaxed">
            Skip supermarket middlemen, industrial packaging, and hidden platform fees. Connect directly to regional family growers.
          </p>
        </div>

        {/* 3 Step Cards Grid (Clean layout, NO messy slicing lines or awkward floating badges) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {steps.map((item, i) => (
            <div
              key={item.step}
              className={`relative bg-surface-container-lowest rounded-3xl p-7 sm:p-8 border border-outline-variant/30 shadow-2xs hover:shadow-xl hover:border-primary/40 transition-all duration-300 flex flex-col justify-between group overflow-hidden ${
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${i * 120}ms` }}
            >
              {/* Hover Top Glow Line */}
              <div
                className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary-fixed to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />

              {/* Card Header: Step Pill + Big Feature Icon */}
              <div>
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary font-black text-xs tracking-wider uppercase">
                    STEP {item.step}
                  </span>
                  <div className="w-13 h-13 rounded-2xl bg-surface-container flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-2xs">
                    <span className="material-symbols-outlined text-[26px]">{item.icon}</span>
                  </div>
                </div>

                {/* Card Title & Description */}
                <h3 className="font-headline-md text-xl font-bold text-on-surface group-hover:text-primary transition-colors mt-6 mb-2.5">
                  {item.title}
                </h3>
                <p className="font-body-md text-on-surface-variant text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>

              {/* Bottom Feature Pill */}
              <div className="mt-8 pt-4 border-t border-outline-variant/20 flex items-center gap-2 text-xs font-bold text-primary">
                <span className="material-symbols-outlined text-[16px] text-primary">
                  {item.highlightIcon}
                </span>
                <span>{item.highlight}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Reassuring Trust Row */}
        <div
          className={`mt-12 pt-8 border-t border-outline-variant/20 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs font-bold text-on-surface-variant transition-all duration-700 delay-300 ${
            visible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <span className="inline-flex items-center gap-1.5 text-primary">
            <span className="material-symbols-outlined text-[17px]">verified</span>
            100% Free Online Reservations
          </span>
          <span className="inline-flex items-center gap-1.5 text-primary">
            <span className="material-symbols-outlined text-[17px]">credit_card_off</span>
            Zero Online Card Details Required
          </span>
          <span className="inline-flex items-center gap-1.5 text-primary">
            <span className="material-symbols-outlined text-[17px]">schedule</span>
            Reserved Boxes Held Until Pickup
          </span>
          <span className="inline-flex items-center gap-1.5 text-primary">
            <span className="material-symbols-outlined text-[17px]">payments</span>
            100% Payment Direct to Farmer
          </span>
        </div>
      </div>
    </section>
  );
}
