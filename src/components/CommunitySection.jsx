import React from 'react';
import { TESTIMONIALS } from '../data/mockData';

export default function CommunitySection() {
  const stats = [
    { value: '4,800+', label: 'Crates Reserved This Month' },
    { value: '100%', label: 'Direct Farmer Payout at Stall' },
    { value: '< 18 mi', label: 'Average Farm Distance' },
    { value: '0 lbs', label: 'Packaging Waste Shipped' }
  ];

  return (
    <section className="w-full py-space-xl bg-surface-container-low relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-gutter">
        {/* High Impact Numbers */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-space-md mb-space-xl text-center">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="p-space-md bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30"
            >
              <p className="font-display-lg text-primary font-bold leading-tight">
                {stat.value}
              </p>
              <p className="font-label-sm text-on-surface-variant mt-1">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
          {TESTIMONIALS.map((test) => (
            <div
              key={test.id}
              className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between border border-outline-variant/30"
            >
              <div>
                <div className="flex items-center gap-1 text-tertiary mb-space-sm">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className="material-symbols-outlined text-[20px] text-tertiary fill"
                    >
                      star
                    </span>
                  ))}
                </div>
                <p className="font-body-lg text-on-surface leading-relaxed">
                  {test.text}
                </p>
              </div>

              <div className="flex items-center gap-space-sm mt-space-md pt-space-sm border-t border-outline-variant/30">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-sm ${test.badgeBg}`}
                >
                  {test.badge}
                </div>
                <div>
                  <p className="font-label-md text-on-surface">{test.author}</p>
                  <p className="font-body-sm text-on-surface-variant text-xs">
                    {test.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
