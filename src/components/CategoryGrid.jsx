import React from 'react';
import { CATEGORIES } from '../data/mockData';

export default function CategoryGrid({ selectedCategory, onSelectCategory }) {
  return (
    <section className="w-full py-space-xl bg-surface">
      <div className="max-w-7xl mx-auto px-gutter">
        <div className="text-center max-w-2xl mx-auto mb-space-lg">
          <span className="font-label-sm text-primary uppercase tracking-widest font-bold">
            Explore By Aisle
          </span>
          <h2 className="font-headline-lg text-on-surface mt-space-xs">
            Fresh Seasonal Categories
          </h2>
          <p className="font-body-md text-on-surface-variant">
            Everything picked at sunrise and prepared by dedicated valley hands.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-space-md">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(isActive ? 'all' : cat.id)}
                className={`bg-surface-container-low hover:bg-surface-container rounded-xl p-space-md flex flex-col items-center text-center transition-all group hover:-translate-y-1 border cursor-pointer ${
                  isActive
                    ? 'border-primary ring-2 ring-primary/30 bg-surface-container shadow-md'
                    : 'border-outline-variant/30'
                }`}
              >
                <div
                  className={`w-16 h-16 rounded-full ${cat.bgClass} flex items-center justify-center ${cat.textClass} mb-space-sm group-hover:scale-110 transition-transform shadow-sm`}
                >
                  <span className="material-symbols-outlined text-[32px]">{cat.icon}</span>
                </div>
                <span className={`font-label-md transition-colors ${isActive ? 'text-primary font-bold' : 'text-on-surface group-hover:text-primary'}`}>
                  {cat.name}
                </span>
                <span className="font-body-sm text-on-surface-variant text-xs mt-1">
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
