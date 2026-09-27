import React, { useEffect, useRef, useState, useMemo } from 'react';
import { ImageStreamHero } from './ui/image-stream-hero';
import { ArrowRight, Check, Sparkles } from 'lucide-react';

/* ── 16 Pristine Produce Images for the 3D Flying Corridor ── */
export const STREAM_PRODUCE_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80",
    alt: "Vine-Ripened Heirloom Tomatoes",
  },
  {
    src: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=800&q=80",
    alt: "Crisp Organic Garden Carrots",
  },
  {
    src: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=800&q=80",
    alt: "Sweet Field Strawberries",
  },
  {
    src: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=800&q=80",
    alt: "Crisp Honeycrisp Apples",
  },
  {
    src: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80",
    alt: "Organic Kale & Spinach",
  },
  {
    src: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=800&q=80",
    alt: "Sweet Rainbow Bell Peppers",
  },
  {
    src: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
    alt: "Wild Forest Mushrooms",
  },
  {
    src: "https://images.unsplash.com/photo-1595126731133-c62589ef2e07?auto=format&fit=crop&w=800&q=80",
    alt: "Sun-Kissed Orchard Peaches",
  },
  {
    src: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=800&q=80",
    alt: "Farmstead Cheeses & Butter",
  },
  {
    src: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80",
    alt: "Raw Wildflower Honeycomb",
  },
  {
    src: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=800&q=80",
    alt: "Purple Striped Farm Garlic",
  },
  {
    src: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80",
    alt: "Fragrant Fresh Culinary Herbs",
  },
  {
    src: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80",
    alt: "Golden Sweet Mountain Corn",
  },
  {
    src: "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&w=800&q=80",
    alt: "Fresh Crown Broccoli",
  },
  {
    src: "https://images.unsplash.com/photo-1498557850523-fd3d118b962e?auto=format&fit=crop&w=800&q=80",
    alt: "Wild Mountain Blueberries",
  },
  {
    src: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
    alt: "Woodfired Artisan Sourdough",
  },
];

/* ── 12 Produce Category Cards with High-Res Photos ── */
export const EXPANDED_PRODUCE_CATEGORIES = [
  {
    id: "heirloom-tomatoes",
    filterKey: "veg",
    name: "Heirloom Tomatoes",
    subtitle: "Brandywines, Cherokees & Sun Golds",
    badge: "Vine-Ripened",
    count: "18 Varieties",
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "sweet-carrots",
    filterKey: "veg",
    name: "Sweet Garden Carrots",
    subtitle: "Rainbow, Nantes & Purple Dragon",
    badge: "Picked Sunrise",
    count: "12 Farms",
    image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "orchard-apples",
    filterKey: "fruit",
    name: "Orchard Apples",
    subtitle: "Honeycrisp, Gala & Pink Lady",
    badge: "Crisp Snap",
    count: "24 Batches",
    image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "wild-berries",
    filterKey: "fruit",
    name: "Fresh Orchard Berries",
    subtitle: "Field Strawberries & Blueberries",
    badge: "Organic Certified",
    count: "14 Growers",
    image: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "kale-greens",
    filterKey: "veg",
    name: "Crisp Greens & Kale",
    subtitle: "Dinosaur Kale, Chard & Baby Spinach",
    badge: "Spring Washed",
    count: "30 Harvests",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "bell-peppers",
    filterKey: "veg",
    name: "Bell Peppers & Chilies",
    subtitle: "Sweet Bells, Jalapeños & Poblanos",
    badge: "High Vit-C",
    count: "16 Stalls",
    image: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "farmstead-dairy",
    filterKey: "dairy",
    name: "Farmstead Dairy & Eggs",
    subtitle: "Aged Guernsey Cheeses & Pasture Eggs",
    badge: "Raw & Aged",
    count: "8 Cellars",
    image: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "raw-honey",
    filterKey: "honey",
    name: "Raw Honey & Comb",
    subtitle: "Meadow Wildflower & Mountain Flora",
    badge: "100% Unfiltered",
    count: "10 Apiaries",
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "hearth-breads",
    filterKey: "bread",
    name: "Hearth Sourdough",
    subtitle: "Wild Ferment Boules & Seeded Batards",
    badge: "Woodfired",
    count: "6 Hearth Bakeries",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "culinary-herbs",
    filterKey: "herbs",
    name: "Culinary Herbs & Shoots",
    subtitle: "Sweet Basil, Rosemary & Microgreens",
    badge: "Fresh Cut",
    count: "19 Varieties",
    image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "stone-fruits",
    filterKey: "fruit",
    name: "Peaches & Stone Fruits",
    subtitle: "Tree-Ripened Peaches & Nectarines",
    badge: "Juicy Snaps",
    count: "15 Orchards",
    image: "https://images.unsplash.com/photo-1595126731133-c62589ef2e07?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "sweet-corn",
    filterKey: "veg",
    name: "Sweet Corn & Squash",
    subtitle: "Golden Butter Corn & Butternut Squash",
    badge: "Sunrise Snapped",
    count: "21 Harvests",
    image: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=600&q=80",
  },
];

export default function CategoryGrid({ selectedCategory, onSelectCategory }) {
  const [visible, setVisible] = useState(false);
  const [activeFilterTab, setActiveFilterTab] = useState('all');
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.08 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const displayedCategories = useMemo(() => {
    if (activeFilterTab === 'all') return EXPANDED_PRODUCE_CATEGORIES;
    return EXPANDED_PRODUCE_CATEGORIES.filter((c) => c.filterKey === activeFilterTab);
  }, [activeFilterTab]);

  return (
    <section ref={ref} className="w-full py-16 sm:py-20 bg-surface relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div
          className={`text-center max-w-3xl mx-auto mb-8 transition-all duration-700 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#125224]/10 border border-[#125224]/20 text-[#125224] font-black uppercase tracking-widest text-[11px] mb-3 shadow-sm">
            <span className="material-symbols-outlined text-[15px]">grid_view</span>
            EXPLORE BY AISLE
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-on-surface tracking-tight mb-3">
            Fresh Seasonal Categories
          </h2>
          <p className="text-base sm:text-lg text-on-surface-variant max-w-xl mx-auto">
            Everything picked at sunrise and prepared by dedicated valley hands.
          </p>
        </div>

        {/* ── 3D CORRIDOR: Pure, Unobstructed ImageStreamHero ── */}
        <div
          className={`mb-12 rounded-3xl overflow-hidden border border-outline-variant/30 shadow-[0_16px_40px_rgba(18,82,36,0.06)] bg-[#f4f7f2] transition-all duration-1000 relative ${
            visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          <ImageStreamHero
            images={STREAM_PRODUCE_IMAGES}
            cards={12}
            speed={22}
            axis={50}
            path={{
              perspective: 32,
              cardWidth: 19,
              cardHeight: 26,
              cardRadius: 1.0,
              exitHeight: 48,
              fan: 3.2,
            }}
            className="h-[380px] sm:h-[460px] md:h-[500px] w-full"
          >
            {/* Minimal, 100% non-blocking overlay: ONLY top & bottom labels without any center card */}
            <div className="relative z-10 flex h-full flex-col items-center justify-between py-6 px-4 text-center pointer-events-none">
              {/* Subtle top indicator */}
              <div className="px-4 py-1 rounded-full bg-white/70 backdrop-blur-md border border-white/80 text-[#125224] text-xs font-bold shadow-sm">
                🌾 Live Seasonal Harvest Stream
              </div>

              {/* Subtle bottom note */}
              <div className="text-xs text-stone-600 font-medium px-4 py-1 rounded-full bg-white/60 backdrop-blur-md">
                Continuous morning harvest rush • Zero warehouse storage
              </div>
            </div>
          </ImageStreamHero>
        </div>

        {/* ── Category Filter Pills Bar ── */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {[
            { id: 'all', label: 'All Harvests', icon: 'storefront' },
            { id: 'veg', label: 'Fresh Vegetables', icon: 'eco' },
            { id: 'fruit', label: 'Orchard Fruits', icon: 'nutrition' },
            { id: 'dairy', label: 'Farmstead Dairy', icon: 'egg' },
            { id: 'bread', label: 'Hearth Breads', icon: 'bakery_dining' },
            { id: 'honey', label: 'Honey & Jams', icon: 'hive' },
            { id: 'herbs', label: 'Herbs & Shoots', icon: 'psychiatry' },
          ].map((tab) => {
            const isTabActive =
              activeFilterTab === tab.id ||
              (tab.id === 'all' && (!activeFilterTab || activeFilterTab === 'all'));
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveFilterTab(tab.id);
                  if (onSelectCategory) {
                    onSelectCategory(tab.id);
                  }
                }}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all shadow-sm cursor-pointer ${
                  isTabActive
                    ? 'bg-[#125224] text-white shadow-[0_4px_14px_rgba(18,82,36,0.25)] scale-105 ring-2 ring-[#125224]/20'
                    : 'bg-white text-stone-700 hover:bg-stone-50 hover:text-[#125224] border border-stone-200'
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">{tab.icon}</span>
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ── Rich Vegetable & Fruit Cards Grid with Photos ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 sm:gap-5">
          {displayedCategories.map((cat, idx) => {
            const isSelected = selectedCategory === cat.filterKey;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(isSelected ? 'all' : cat.filterKey)}
                className={`group relative text-left rounded-2xl overflow-hidden border transition-all duration-300 cursor-pointer flex flex-col bg-white shadow-sm hover:shadow-xl hover:-translate-y-1.5 ${
                  isSelected
                    ? 'border-[#125224] ring-2 ring-[#125224]/40 shadow-[0_12px_28px_rgba(18,82,36,0.18)] -translate-y-1'
                    : 'border-outline-variant/30 hover:border-[#125224]/30'
                }`}
              >
                {/* Photo Header */}
                <div className="relative h-36 sm:h-40 w-full overflow-hidden bg-stone-100">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-70 group-hover:opacity-40 transition-opacity" />

                  {/* Top Badge */}
                  <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/90 text-stone-800 shadow-sm backdrop-blur-sm">
                    {cat.badge}
                  </span>

                  {/* Active Selection Checkmark */}
                  {isSelected && (
                    <div className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-[#125224] text-white flex items-center justify-center shadow-md">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-3 sm:p-3.5 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-stone-900 group-hover:text-[#125224] transition-colors leading-tight line-clamp-1">
                      {cat.name}
                    </h4>
                    <p className="text-[11px] text-stone-500 mt-0.5 line-clamp-1">
                      {cat.subtitle}
                    </p>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-stone-100 flex items-center justify-between text-[11px]">
                    <span className="text-stone-400 font-medium">{cat.count}</span>
                    <span className="text-[#125224] font-bold flex items-center gap-0.5">
                      Explore <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
