import React from 'react';

export default function Benefits() {
  const benefits = [
    {
      id: 1,
      title: 'Zero Delivery Miles',
      desc: 'You collect directly at the community market stall. No delivery trucks, plastic cold packs, or stale shipping transit.',
      icon: 'directions_walk',
      iconBg: 'bg-secondary-fixed text-on-secondary-fixed'
    },
    {
      id: 2,
      title: 'No Online Card Hassles',
      desc: 'Never enter payment details online. Simply inspect your harvest crate and settle up face-to-face with your grower.',
      icon: 'credit_card_off',
      iconBg: 'bg-primary-fixed text-on-primary-fixed'
    },
    {
      id: 3,
      title: 'Guaranteed Stall Hold',
      desc: 'Farmers pack your crate early in the sunrise mist; your heirloom tomatoes won’t sell out before you arrive at 10 AM.',
      icon: 'lock_clock',
      iconBg: 'bg-tertiary-fixed text-on-tertiary-fixed'
    },
    {
      id: 4,
      title: '100% Farmer Revenue',
      desc: 'Every single dollar goes straight into regional agricultural hands. No middleman distribution cut or markup.',
      icon: 'savings',
      iconBg: 'bg-primary-container text-on-primary'
    }
  ];

  return (
    <section className="w-full bg-surface-container-low py-space-xl">
      <div className="max-w-7xl mx-auto px-gutter">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
          {benefits.map((item) => (
            <div 
              key={item.id}
              className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col gap-space-xs border border-outline-variant/20 hover:shadow-md transition-shadow"
            >
              <div className={`w-12 h-12 rounded-full ${item.iconBg} flex items-center justify-center mb-space-xs shadow-sm`}>
                <span className="material-symbols-outlined text-[26px]">{item.icon}</span>
              </div>
              <h3 className="font-headline-sm text-on-surface">{item.title}</h3>
              <p className="font-body-sm text-on-surface-variant leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
