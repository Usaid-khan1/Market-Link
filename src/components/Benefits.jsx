import React, { useEffect, useRef, useState } from 'react';
import { SqueezeCarousel } from '@/components/ui/carousel-squeeze';

export default function Benefits() {
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

  /** Wordmark overlay for open panel */
  const renderOverlay = (tag, title, subtitle, stat, badges = [], icon) => (
    <div className="flex flex-col gap-2.5 items-start text-left w-full max-w-xl">
      {/* Top Tag & Live Metric Pill */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-emerald-300 text-[11px] font-bold uppercase tracking-wider border border-emerald-400/30 shadow-md">
          <span className="material-symbols-outlined text-[15px] text-emerald-400">{icon}</span>
          {tag}
        </span>
        {stat && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[11px] font-bold border border-white/20 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            {stat}
          </span>
        )}
      </div>

      {/* Main Title & Subtitle on Card */}
      <div className="space-y-1">
        <h4 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] leading-tight">
          {title}
        </h4>
        {subtitle && (
          <p className="text-xs sm:text-sm font-medium text-emerald-100/90 drop-shadow-md line-clamp-1">
            {subtitle}
          </p>
        )}
      </div>

      {/* Quick Feature Chips */}
      {badges.length > 0 && (
        <div className="hidden sm:flex flex-wrap gap-1.5 pt-0.5">
          {badges.map((b, bIdx) => (
            <span
              key={bIdx}
              className="px-2.5 py-0.5 rounded-md bg-black/45 backdrop-blur-md text-white/95 text-[11px] font-semibold border border-white/15 shadow-2xs"
            >
              {b}
            </span>
          ))}
        </div>
      )}
    </div>
  );

  // All cards use the hero section background image as requested: /farm-hero-bg.jpg
  const heroImage = '/farm-hero-bg.jpg';

  const slides = [
    {
      id: 'delivery-miles',
      tag: 'Eco Friendly',
      title: 'Zero Delivery Miles & Carbon-Neutral Pickup',
      description:
        'Skip the 1,500-mile cross-country refrigerated freight chain. Pick up freshly harvested crates directly at your local community market stall with zero diesel emissions, plastic cold packs, or stale warehouse holding transit.',
      highlights: [
        'Zero diesel highway freight & warehouse refrigeration loss',
        'Packed in 100% reusable wooden community harvest crates',
        'Cuts average household grocery carbon footprint by 92%',
      ],
      overlay: renderOverlay(
        'Eco Friendly • Zero Carbon',
        'Zero Delivery Miles',
        'Direct collection at regional community stalls',
        '0.0 Transit Miles',
        ['Zero Freight Waste', 'Reusable Wooden Crates', 'Local Stall Pickup'],
        'directions_walk'
      ),
      image: heroImage,
      imageAlt: 'Fresh community market stall with local farm vegetables',
    },
    {
      id: 'zero-card-risk',
      tag: 'Zero Risk',
      title: 'Inspect In-Person & Pay Direct at the Stall',
      description:
        'Never worry about entering private credit card credentials or bank details online. Inspect your harvest crate in natural daylight, verify crisp freshness with your own hands, and settle up via cash, card swipe, or market tokens face-to-face with your grower.',
      highlights: [
        'No credit card details or bank info ever stored online',
        'Inspect produce quality in person before paying a single cent',
        'Pay with Cash, Debit, Credit Card, or SNAP Market Tokens',
      ],
      overlay: renderOverlay(
        'Zero Financial Risk',
        'Inspect First, Pay at Stall',
        'Touch and verify fresh produce before you pay',
        '0% Online Risk',
        ['No Online Card Required', 'Inspect Face-to-Face', 'Cash, Card or Tokens'],
        'credit_card_off'
      ),
      image: heroImage,
      imageAlt: 'Grower and customer interacting at a farm stall',
    },
    {
      id: 'stall-hold',
      tag: 'Priority Access',
      title: 'Guaranteed Morning Stall Reservation Until 1 PM',
      description:
        'Never rush through morning crowds or worry about sold-out heirloom crops. Our growers handpick and set aside your personalized wooden harvest crate before dawn, guaranteed safely held until afternoon wrap-up.',
      highlights: [
        'Guaranteed hold on heirloom varieties & rare seasonal berries',
        'Dedicated crate tagged with your name and reserved at dawn',
        'Relaxed pickup anytime between market opening and 1:00 PM',
      ],
      overlay: renderOverlay(
        'Priority Access • Morning Hold',
        'Guaranteed Stall Hold',
        'Your personalized harvest crate safely set aside',
        'Held Till 1:00 PM',
        ['Dawn-Picked Crate', 'Name-Tagged Stall Box', 'Never Sells Out'],
        'lock_clock'
      ),
      image: heroImage,
      imageAlt: 'Farm fresh morning harvested wooden crates',
    },
    {
      id: 'farmer-revenue',
      tag: 'Fair Trade',
      title: '100% Direct-to-Farmer Revenue Retained',
      description:
        'Every single dollar goes straight to the grower who tended the soil. By eliminating corporate distributor cuts, grocery listing fees, and wholesale brokers, local family farms earn up to 7x more than wholesale supply chains.',
      highlights: [
        'Farmers keep 100% of stall sales with zero commission deductions',
        'Protects multi-generational acreage and sustainable farm practices',
        'Reinvests $3.50+ into local regional economy per $1 spent',
      ],
      overlay: renderOverlay(
        'Fair Trade • Local Economy',
        '100% Farmer Revenue',
        'Every dollar supports regional agricultural families',
        '100% to Growers',
        ['Zero Middleman Fees', 'Living Farm Wages', 'Protects Local Farmland'],
        'savings'
      ),
      image: heroImage,
      imageAlt: 'Independent farmers harvesting organic crops',
    },
    {
      id: 'peak-freshness',
      tag: 'Peak Nutrition',
      title: 'Harvested Within 24 Hours of Morning Setup',
      description:
        'Supermarket produce spends an average of 10 to 14 days in cold chain transit, losing critical vitamins. Our farmers harvest in the dawn dew within 24 hours of market setup, delivering unmatched sweetness, crisp texture, and vital micronutrients.',
      highlights: [
        'Vine-ripened naturally without artificial ethylene ripening gases',
        'Retains up to 3x higher Vitamin C and vital active antioxidants',
        'Lasts up to 2 full weeks in your home refrigerator without spoilage',
      ],
      overlay: renderOverlay(
        'Peak Nutrition • Sun-Ripened',
        'Harvested in 24 Hours',
        'Picked at dawn for maximum vitamins and crisp flavor',
        '< 24 Hours Fresh',
        ['No Gas Ripening', '90% Vitamin Retention', 'Crisp Sun-Ripened Taste'],
        'nutrition'
      ),
      image: heroImage,
      imageAlt: 'Vibrant organic greens and berries picked fresh at dawn',
    },
    {
      id: 'snap-ebt-equity',
      tag: 'Community Equity',
      title: 'Community SNAP, EBT & Senior Match Eligible',
      description:
        'Nutritious, soil-fresh food should be accessible to all neighbors. MarketLink collaborates with community nutrition programs to match every dollar spent with SNAP, EBT, or Senior Nutrition vouchers with free fresh produce market tokens.',
      highlights: [
        'Doubles your purchasing power: $1 SNAP = $2 in fresh produce',
        'Hassle-free token exchange at the market manager booth',
        'Valid across all certified organic vegetables, fruits, and herbs',
      ],
      overlay: renderOverlay(
        'Food Equity • Double-Up',
        'SNAP & EBT Matching',
        'Double your purchasing value for fresh produce',
        '2x Token Match',
        ['SNAP / EBT Welcomed', 'Double-Up Token Match', 'Zero Stigma or Red Tape'],
        'currency_exchange'
      ),
      image: heroImage,
      imageAlt: 'Market tokens and organic produce basket for community nutrition',
    },
    {
      id: 'soil-to-plate',
      tag: 'True Transparency',
      title: 'Know Your Food, Shake Your Grower’s Hand',
      description:
        'Build a real relationship with the people who grow your food. Chat directly with farmers about organic pest deterrents, heritage seed preservation, and seasonal cooking recipes straight from the field.',
      highlights: [
        'Direct face-to-face relationship with 45+ local family farms',
        'Full transparency into organic, non-GMO, and regenerative soils',
        'Receive heirloom cooking recipes and seasonal storage tips',
      ],
      overlay: renderOverlay(
        'True Transparency • Community',
        'Soil-to-Plate Connection',
        'Know the farm, the soil, and the hands behind your food',
        '45+ Local Farms',
        ['Non-GMO & Chemical-Free', 'Meet the Farm Families', 'Free Heirloom Recipes'],
        'volunteer_activism'
      ),
      image: heroImage,
      imageAlt: 'Friendly grower presenting seasonal organic harvest',
    },
  ];

  return (
    <section
      ref={ref}
      id="benefits"
      className="w-full py-16 sm:py-24 relative overflow-hidden bg-gradient-to-b from-[#fcf9f8] via-[#f7faf7] to-[#edf6ee]"
    >
      {/* Decorative ambient gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-primary/25 to-transparent" />
      <div className="pointer-events-none absolute -top-40 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div
          className={`text-center max-w-3xl mx-auto mb-10 sm:mb-14 transition-all duration-700 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#125224]/10 border border-[#125224]/20 font-bold text-[#125224] uppercase tracking-widest text-[11px] mb-3.5 shadow-xs">
            <span className="material-symbols-outlined text-[15px]">eco</span>
            Why MarketLink
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-on-surface tracking-tight leading-tight">
            The Benefits of Buying Direct
          </h2>
          <p className="mt-3.5 text-base sm:text-lg text-on-surface-variant leading-relaxed text-balance">
            Bypass the industrial supermarket chain. Enjoy produce picked hours ago, support 100% grower earnings, and pick up fresh crates at your community stall.
          </p>
        </div>

        {/* Dynamic Squeeze Carousel */}
        <div
          className={`transition-all duration-700 delay-150 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="bg-white/85 backdrop-blur-xl p-5 sm:p-8 lg:p-9 rounded-3xl border border-black/5 shadow-[0_20px_50px_rgba(18,82,36,0.08)]">
            <SqueezeCarousel
              slides={slides}
              height="clamp(300px, 36vw, 440px)"
              slatWidth={16}
              slatGap={10}
              gap={18}
              radius={18}
              duration={700}
              hoverGrow={true}
              autoplay={true}
              interval={2500}
              pauseOnHover={false}
              controls={true}
              accent="#125224"
              accentForeground="#ffffff"
              label="Why MarketLink Benefits"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
