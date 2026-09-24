import React from 'react';
import { GROWERS } from '../data/mockData';

export default function GrowersShowcase({ onNavigate }) {
  return (
    <section id="about-us" className="w-full py-space-xl bg-surface">
      <div className="max-w-7xl mx-auto px-gutter">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-space-xl gap-space-sm">
          <div>
            <span className="font-label-sm text-primary uppercase tracking-widest font-bold">
              Real Stewards of the Soil
            </span>
            <h2 className="font-headline-lg text-on-surface mt-space-xs">
              Meet Your Regional Growers
            </h2>
            <p className="font-body-md text-on-surface-variant">
              Shake hands with the very people who plant the seeds, nurture the crops, and pack your crate.
            </p>
          </div>
          <button
            onClick={() => onNavigate('about-us')}
            className="font-label-md text-primary hover:text-primary-container inline-flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>Explore All Grower Stories</span>
            <span className="material-symbols-outlined text-[18px]">chevron_right</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
          {GROWERS.map((farmer) => (
            <div
              key={farmer.id}
              className="bg-surface-container-low rounded-xl p-space-lg flex flex-col justify-between shadow-sm border border-outline-variant/30 hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-center gap-space-md mb-space-md">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-surface-container-high flex-shrink-0 shadow-sm border border-outline-variant/40">
                    <img
                      src={farmer.image}
                      alt={farmer.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-headline-sm text-on-surface">{farmer.name}</h3>
                    <p className="font-body-sm text-primary font-bold">{farmer.farm}</p>
                    <div className="flex items-center gap-1 text-tertiary font-label-sm mt-0.5">
                      <span className="material-symbols-outlined text-[16px] text-tertiary fill">
                        star
                      </span>
                      <span>{farmer.rating}</span>
                      <span className="text-on-surface-variant font-normal">({farmer.pickups})</span>
                    </div>
                  </div>
                </div>

                <p className="font-body-md text-on-surface-variant italic mb-space-sm leading-relaxed">
                  {farmer.quote}
                </p>
              </div>

              <div className="pt-space-md border-t border-outline-variant/30 flex items-center justify-between text-on-surface-variant font-label-sm">
                <span>{farmer.location}</span>
                <span className="text-primary font-bold">{farmer.marketTag}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
