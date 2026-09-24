import React from 'react';

export default function HowItWorks() {
  const steps = [
    {
      step: 1,
      title: 'Discover Nearby Markets',
      desc: 'Find weekend and midweek farmers markets within your county. View stall directories, weekly maps, and scheduled harvest drops.',
      icon: 'map',
      tag: 'Over 18 town pavilions active',
      tagIcon: 'distance'
    },
    {
      step: 2,
      title: 'Reserve Fresh Produce',
      desc: 'Browse what is picked fresh this week. Lock in seasonal staples, heirloom varieties, and artisan batches before you leave home.',
      icon: 'shopping_basket',
      tag: 'Box packed with your name',
      tagIcon: 'inventory_2'
    },
    {
      step: 3,
      title: 'Pick Up & Pay in Person',
      desc: 'Visit the farmer’s designated pickup stall. Inspect your produce, chat with your grower, and pay directly with cash or card.',
      icon: 'handshake',
      tag: 'Direct handshake connection',
      tagIcon: 'sentiment_satisfied'
    }
  ];

  return (
    <section className="w-full py-space-xl bg-surface relative">
      <div className="max-w-7xl mx-auto px-gutter">
        <div className="text-center max-w-2xl mx-auto mb-space-xl">
          <span className="font-label-sm text-primary uppercase tracking-widest font-bold">
            Simple, Transparent Local Commerce
          </span>
          <h2 className="font-headline-lg text-on-surface mt-space-xs">
            From Soil to Basket in 3 Easy Steps
          </h2>
          <p className="font-body-md text-on-surface-variant mt-space-xs">
            Skip the supermarket rush and connect straight to the people who grew your food.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg relative">
          {steps.map((item) => (
            <div
              key={item.step}
              className="bg-surface-container-low rounded-xl p-space-lg relative flex flex-col gap-space-sm group hover:shadow-md transition-shadow border border-outline-variant/30"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-full bg-primary text-on-primary font-headline-sm flex items-center justify-center shadow-sm">
                  {item.step}
                </div>
                <span className="material-symbols-outlined text-primary text-[32px] opacity-60 group-hover:opacity-100 transition-opacity">
                  {item.icon}
                </span>
              </div>

              <h3 className="font-headline-md text-on-surface">{item.title}</h3>
              <p className="font-body-md text-on-surface-variant leading-relaxed">
                {item.desc}
              </p>

              <div className="mt-auto pt-space-sm">
                <span className="inline-flex items-center gap-space-xs font-label-sm text-primary">
                  <span className="material-symbols-outlined text-[16px]">{item.tagIcon}</span>
                  {item.tag}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
