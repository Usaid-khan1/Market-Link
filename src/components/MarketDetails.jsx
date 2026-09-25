import React, { useState, useEffect } from 'react';
import browseApi from '../api/browse';

export default function MarketDetails({ marketId = 1, onNavigate, onReserveProduct, onNotifyProduct }) {
  const [mapFilter, setMapFilter] = useState('all');
  const [producerFilter, setProducerFilter] = useState('all');
  const [preferredMarket, setPreferredMarket] = useState(false);
  const [liveMarket, setLiveMarket] = useState(null);

  useEffect(() => {
    let mounted = true;
    browseApi.getMarket(marketId || 1).then((res) => {
      if (mounted && res.data) {
        setLiveMarket(res.data);
      }
    }).catch(() => {});
    return () => { mounted = false; };
  }, [marketId]);

  // Producers data for Downtown Historic Market
  const producers = [
    {
      id: 'prod-1',
      name: 'Green Pastures Organic',
      farmers: 'Martha & Joe Miller • 4th Gen Family Farm',
      stall: 'Stall #4 • Aisle B',
      category: 'veg',
      rating: '4.98',
      reviews: '142',
      desc: 'Heirloom Brandywine tomatoes, rainbow Swiss chard, crisp bibb lettuces, and cold-pressed microgreens grown without synthetic sprays.',
      status: 'active',
      btnText: 'Pre-Order Harvest',
      farmKey: 'green-pastures'
    },
    {
      id: 'prod-2',
      name: 'Miller & Stone Hearth',
      farmers: 'Gabe & Elena Vance • Naturally Leavened',
      stall: 'Stall #18 • Aisle C',
      category: 'bakery',
      rating: '5.00',
      reviews: '88',
      desc: 'Artisan woodfired country sourdough batards, flaky butter morning croissants, seeded rye loaves, and heritage stoneground brioche.',
      status: 'active',
      btnText: 'Reserve Bread',
      farmKey: 'miller-stone'
    },
    {
      id: 'prod-3',
      name: 'Sunrise Orchard',
      farmers: 'Caleb Hughes • Blue Ridge Terraces',
      stall: 'Stall #12 • Aisle A',
      category: 'fruit',
      rating: '4.94',
      reviews: '115',
      desc: 'First-press sweet unfiltered apple cider, crisp tree-ripened Honeycrisp, Asian heirloom pears, and sun-dried orchard apple crisps.',
      status: 'active',
      btnText: 'Reserve Apples',
      farmKey: 'sunrise-orchard'
    },
    {
      id: 'prod-4',
      name: 'Heritage Hen Hollow',
      farmers: 'Nora Callahan • Free-Range Rotational',
      stall: 'Stall #21 • Aisle C',
      category: 'dairy',
      rating: '4.97',
      reviews: '92',
      desc: 'Rich golden-yolk pasture eggs from heritage breed hens, pasture duck eggs, raw clover honey jars, and heritage roasting fowl.',
      status: 'sold-out',
      btnText: 'Sold Out This Sat',
      farmKey: 'heritage-hen'
    },
    {
      id: 'prod-5',
      name: 'Pine Ridge Apiary',
      farmers: 'Silas Finch • Mountain Foothill Hives',
      stall: 'Stall #9 • Aisle D',
      category: 'honey',
      rating: '4.99',
      reviews: '76',
      desc: '100% unpasteurized wildflower & sourwood honey, fresh golden bee pollen pellets, hand-dipped beeswax taper candles, and honeycomb slabs.',
      status: 'active',
      btnText: 'Reserve Honey',
      farmKey: 'pine-ridge'
    },
    {
      id: 'prod-6',
      name: 'Fiddlehead Farm',
      farmers: 'Devon & Sarah Lin • Regenerative Growers',
      stall: 'Stall #6 • Aisle B',
      category: 'veg',
      rating: '4.92',
      reviews: '64',
      desc: 'Nutty acorn and butternut squash, Lacinato dinosaur kale, sweet culinary garlic bulbs, and hand-bundled French tarragon herbs.',
      status: 'active',
      btnText: 'Pre-Order Harvest',
      farmKey: 'fiddlehead'
    }
  ];

  // Saturday harvest products
  const harvestItems = [
    {
      id: 'det-prod-1',
      name: 'Heirloom Brandywine Tomatoes',
      price: 4.50,
      unit: 'lb',
      stall: 'Stall #4 • Green Pastures',
      farm: 'Green Pastures Organic',
      market: 'Downtown Historic Market (Stall #4)',
      status: 'IN_STOCK',
      badge: 'IN STOCK',
      desc: 'Deep pink beefsteak heirloom variety, intensely sweet and slightly acidic old-fashioned tomato flavor picked Friday morning.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBc6WOIs-DtydvuW6H54kRRGUUX1R5wiIdAcb4hK48Bnxqs0doTLgBKBk46UPCrz9k3b4g-sCxaEwZrbSjOM08CFB4uMw6SlHYRVEc9FcuNSWPJLxT4lFiwY87nptH_MpF5BRNN6-NBba_ddMB51hOoRu0CiKC0dNwE6rz3LQqD_UAAfZCrEME6DOne9Tm_w5GUC-XuUmaGYUfoIgg0d4Bl0gHh5sRIlAXDDFpsJwNC48Zv8QoD-PN3',
      alt: 'A rustic wooden basket filled with multi-colored ripe heirloom brandywine tomatoes'
    },
    {
      id: 'det-prod-2',
      name: 'Crisp Honeycrisp Apples',
      price: 3.20,
      unit: 'lb',
      stall: 'Stall #12 • Sunrise Orchard',
      farm: 'Sunrise Orchard',
      market: 'Downtown Historic Market (Stall #12)',
      status: 'IN_STOCK',
      badge: 'IN STOCK',
      desc: 'Hand-picked high-elevation mountain apples, intensely crunchy with balanced aromatic sweetness. Perfect for pies and snacking.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDBT8rgggOVQbE-n-FUqb6bnGjh4GGnJj5RryqJNxqbuaKNdRgkj4X-0jit45RnEWOCcCKg6ynxmc0WNryaxmng_NO0K7fJlAXwWoGpHER8ZX_delOrrScmt3SwO4I9yBKNcpOI5UrRRJfDDDjs6BcpsN6_zAK7qPI8GuIoZKt65Gvx6gkPpeY5XDd5bMHDmCxeQjICK5C2cmF-N4GK9VywH55ujRomBWtuxpWse0uzke3Yscib6moO',
      alt: 'Freshly harvested crisp honeycrisp apples in an untreated wooden orchard crate'
    },
    {
      id: 'det-prod-3',
      name: 'Country Sourdough Loaf',
      price: 7.50,
      unit: 'loaf',
      stall: 'Stall #18 • Miller & Stone',
      farm: 'Miller & Stone Hearth',
      market: 'Downtown Historic Market (Stall #18)',
      status: 'LOW_STOCK',
      badge: 'LOW STOCK • 5 LEFT',
      desc: '36-hour cold fermented sourdough made with stoneground organic red fife and wheat flours. Baked fresh in wood-fired hearth at 5:00 AM.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDXDGaZdBdaEbaaIg173NKFNDi93BmFCb6z0n0AkWQqZYsuIDTgP3qtRZEFivb5BBVpVV_GX3q7dq3aZs-tsKhqPwbcmoz28j-17r3z56wtZa4_kH2ZVTFQt2EF0lzSUQ-GHyILNI-9xo_7ncwougVGYbU-cdcJkYSKSgbjlXTr1HSn4-6b6jD9UQ_KdZO_ZR8mXn8MkyfSHoiE-9WnW8n5zXiGhWbtOx_Cu3j2T7jZXsVyRoPH9qO7',
      alt: 'Artisan woodfired country sourdough bread boule on baker linen'
    },
    {
      id: 'det-prod-4',
      name: 'Pasture-Raised Organic Eggs',
      price: 6.50,
      unit: 'dozen',
      stall: 'Stall #21 • Heritage Hen',
      farm: 'Heritage Hen Hollow',
      market: 'Downtown Historic Market (Stall #21)',
      status: 'SOLD_OUT',
      badge: 'SOLD OUT THIS WEEK',
      desc: 'Rotational clover pasture hens foraging daily. Rich amber yolks high in natural Omega-3s. Maximum allocation claimed for this Saturday.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAaUGBVatxc2dIxlFmKwcTdiqhByBwt_G3BbZB3rH7pZ26QuAHaOAFjGi-PQ5FSMbCJn0iqEM4q4bALqMj7uSpeGx4TfJvAbn0S1xxrapHEsL1FgIUW9YGdkZ7rHSviOyMZGlmCSZj_6n8veNL5-7YlZ-Mq1GRxzDlzGnJzb2Up2rH6uQYW0kzH2zXuxRI1WvTd03SkV6qaTYHOZKhOcv9W3N616p_OJiVwUUzSIJni-pQqgsEeA7R7',
      alt: 'Cardboard egg carton open showing rich brown organic farm pasture eggs'
    },
    {
      id: 'det-prod-5',
      name: 'Wildflower Raw Honey 16oz',
      price: 12.00,
      unit: 'jar',
      stall: 'Stall #9 • Pine Ridge Apiary',
      farm: 'Pine Ridge Apiary',
      market: 'Downtown Historic Market (Stall #9)',
      status: 'LOW_STOCK',
      badge: 'LOW STOCK • 3 JARS LEFT',
      desc: 'Raw, unfiltered honey spun straight from foothill hives. Natural enzymes, local pollen, and delicate wildflower aromatics preserved.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBMPUk6sGa67_Mf41nY1JtOxOuDhH7AJ7VbDHf5vqtxwN4bckJUdc4ReH_1BP2ocuwlyRmax1k1LU7_r_NDbWguCMJNKwhWHYgmfX4q0Q8vHNCpN7sZDMnafU2eH1lCCk4Sb6PBwcc8idGvntrlACw0dd_Vw-ZD-S_L57oQaWY6rmFHOjJj2kdApkPmLTWGVyPdHMDvLDXddwlLyGc0jseqXV-jPfZaRSLtpls3uD06fQVPE3AOYuns',
      alt: 'Glass mason jar of raw unpasteurized amber wildflower honey'
    },
    {
      id: 'det-prod-6',
      name: 'Watercress & Micro Bundle',
      price: 4.00,
      unit: 'bunch',
      stall: 'Stall #4 • Green Pastures',
      farm: 'Green Pastures Organic',
      market: 'Downtown Historic Market (Stall #4)',
      status: 'IN_STOCK',
      badge: 'IN STOCK',
      desc: 'Peppery crisp spring-fed watercress paired with sprouted radish greens. Bundled with natural biodegradable jute twine.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCK6McM0sQxiAeP4WrT8qjQtWGggDfBnuCMK7jO_DMb5rHdN0cEpIDKAZxbY8UfZbowgtS8mvvOt6q3DILZzF45k8kyEIVV6nRCB1G6QTTugN8iYrI9sx5buQ1b0b9ZwFJZCa_LLAkI8OO02_V1elGDibgBNDwXjC-BDbDl6G4Ri09yToO0ZrW0_ViHBBLsU55rmFsImvgRw5kSqGTLvlwZSOXbjrj_OyPM5Qu1etV6MW861fqp-HIX',
      alt: 'Vibrant fresh green watercress bundle tied with natural jute twine'
    }
  ];

  // Filter producers
  const filteredProducers = producers.filter((p) => {
    if (producerFilter === 'all') return true;
    return p.category === producerFilter;
  });

  return (
    <div className="flex flex-col w-full">
      {/* Breadcrumb & Top Indicator */}
      <section className="w-full bg-surface-container-low py-space-sm px-gutter border-b border-outline-variant/30">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-space-sm">
          <nav aria-label="Breadcrumbs" className="flex items-center gap-space-xs font-label-sm text-on-surface-variant">
            <button
              onClick={() => onNavigate('home')}
              className="hover:text-primary transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">home</span>
              <span>Home</span>
            </button>
            <span>/</span>
            <button
              onClick={() => onNavigate('markets')}
              className="hover:text-primary transition-colors cursor-pointer"
            >
              Markets
            </button>
            <span>/</span>
            <span className="text-primary font-bold">Downtown Historic Farmers Market</span>
          </nav>
          <div className="inline-flex items-center gap-space-xs text-secondary font-label-sm">
            <span className="w-2 h-2 rounded-full bg-secondary animate-ping"></span>
            <span>Stall Reservations Open for Saturday</span>
          </div>
        </div>
      </section>

      {/* Market Detail Header Hero */}
      <section className="w-full py-space-xl px-gutter relative overflow-hidden bg-gradient-to-b from-surface-container-low via-surface to-surface">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
            {/* Left 8 Cols: Market Meta & Action Stack */}
            <div className="lg:col-span-8 flex flex-col gap-space-md">
              <div className="flex flex-wrap items-center gap-space-xs">
                <span className="inline-flex items-center gap-1 px-space-sm py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-sm shadow-sm">
                  <span className="material-symbols-outlined text-[15px]">verified</span>
                  Open Every Saturday
                </span>
                <span className="inline-flex items-center gap-1 px-space-sm py-1 rounded-full bg-surface-container-highest text-on-surface font-label-sm">
                  <span className="material-symbols-outlined text-[15px]">storefront</span>
                  28 Certified Stalls
                </span>
                <span className="inline-flex items-center gap-1 px-space-sm py-1 rounded-full bg-surface-container-high text-primary font-label-sm font-bold">
                  <span className="material-symbols-outlined text-[15px]">payments</span>
                  SNAP / EBT Tokens Accepted
                </span>
                <span className="inline-flex items-center gap-1 px-space-sm py-1 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm">
                  <span className="material-symbols-outlined text-[15px]">pets</span>
                  Dog Friendly (On Leash)
                </span>
              </div>

              <div className="flex flex-col gap-space-xs">
                <h1 className="font-display-lg text-on-surface leading-tight tracking-tight">
                  Downtown Historic Farmers Market
                </h1>
                <p className="font-body-lg text-on-surface-variant flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-primary text-[20px]">location_on</span>
                  120 Market Square, Central Plaza, Downtown (Pioneer Pavilion)
                </p>
              </div>

              {/* Schedule Callout Badge */}
              <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm border border-outline-variant/30">
                <div className="flex items-center gap-space-sm">
                  <div className="w-12 h-12 rounded-xl bg-secondary-container text-on-secondary-container flex items-center justify-center shadow-sm">
                    <span className="material-symbols-outlined text-[26px]">calendar_today</span>
                  </div>
                  <div>
                    <p className="font-label-md text-on-surface">Next Market Window: This Saturday</p>
                    <p className="font-body-sm text-on-surface-variant">8:00 AM – 1:00 PM • Early Birds / Seniors: 7:30 AM</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 font-label-sm text-primary">
                  <span className="material-symbols-outlined text-[18px]">verified_user</span>
                  <span>100% In-Person Payment at Stalls</span>
                </div>
              </div>

              {/* Action CTA Ribbon */}
              <div className="flex flex-wrap items-center gap-space-sm pt-space-xs">
                <a
                  href="https://maps.google.com/?q=120+Market+Square+Downtown"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-space-xs px-space-lg py-space-sm rounded-full bg-tertiary-container text-on-tertiary font-label-md shadow-md hover:bg-tertiary transition-all active:scale-95 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">directions</span>
                  Get Directions
                </a>

                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText(window.location.href);
                    alert('MarketLink URL copied to clipboard!');
                  }}
                  className="inline-flex items-center justify-center gap-space-xs px-space-md py-space-sm rounded-full bg-surface-container-high text-on-surface font-label-md hover:bg-surface-container-highest transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">share</span>
                  Share Market
                </button>

                <button
                  type="button"
                  onClick={() => setPreferredMarket(!preferredMarket)}
                  className={`inline-flex items-center justify-center gap-space-xs px-space-md py-space-sm rounded-full font-label-md transition-colors cursor-pointer ${
                    preferredMarket
                      ? 'bg-secondary-container text-on-secondary-container'
                      : 'bg-surface-container-high text-primary hover:bg-secondary-container hover:text-on-secondary-container'
                  }`}
                >
                  <span className={`material-symbols-outlined text-[18px] ${preferredMarket ? 'fill' : ''}`}>
                    favorite
                  </span>
                  {preferredMarket ? 'Preferred Market Set' : 'Set as Preferred Market'}
                </button>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center justify-center gap-space-xs px-space-md py-space-sm rounded-full bg-surface-container-high text-on-surface-variant font-label-md hover:bg-surface-container-highest transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">download</span>
                  Download Stall Layout PDF
                </button>
              </div>
            </div>

            {/* Right 4 Cols: Quick Market Snapshot Card */}
            <div className="lg:col-span-4 bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col gap-space-md border border-outline-variant/30">
              <div className="flex items-center justify-between pb-space-xs">
                <h3 className="font-headline-sm text-primary font-bold">Stall Highlights</h3>
                <span className="font-label-sm px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-xs">
                  Updated Today
                </span>
              </div>

              <div className="grid grid-cols-2 gap-space-sm">
                <div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col">
                  <span className="font-display-lg-mobile text-primary font-bold">28</span>
                  <span className="font-label-sm text-on-surface-variant text-xs">Family Farms</span>
                </div>
                <div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col">
                  <span className="font-display-lg-mobile text-secondary font-bold">0$</span>
                  <span className="font-label-sm text-on-surface-variant text-xs">Online Fees</span>
                </div>
                <div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col">
                  <span className="font-display-lg-mobile text-primary font-bold">11:30</span>
                  <span className="font-label-sm text-on-surface-variant text-xs">AM Pickup Hold</span>
                </div>
                <div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col">
                  <span className="font-display-lg-mobile text-tertiary font-bold">100%</span>
                  <span className="font-label-sm text-on-surface-variant text-xs">Direct Cash/Card</span>
                </div>
              </div>

              <div className="p-space-sm rounded-lg bg-surface-container flex items-start gap-space-xs text-xs text-on-surface-variant leading-snug">
                <span className="material-symbols-outlined text-primary text-[20px] mt-0.5 shrink-0">store</span>
                <p>
                  Curbside wagon check points available on Market Square South. Stalls hold reserved harvest boxes in cool storage until you arrive.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Stall Map & Pavilion Directory */}
      <section className="w-full py-space-lg px-gutter bg-surface">
        <div className="max-w-7xl mx-auto flex flex-col gap-space-md">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-sm">
            <div>
              <div className="inline-flex items-center gap-1 font-label-sm text-primary uppercase tracking-wider mb-1">
                <span className="material-symbols-outlined text-[16px]">map</span>
                <span>Spatial Pavilion Grid</span>
              </div>
              <h2 className="font-headline-lg text-on-surface">Interactive Stall Map &amp; Pavilion Directory</h2>
              <p className="font-body-md text-on-surface-variant">
                Locate your favorite growers across the historic covered brick aisles of Pioneer Pavilion.
              </p>
            </div>

            {/* Filter Chips for Map */}
            <div className="flex flex-wrap items-center gap-space-xs" id="map-filter-group">
              {['all', 'veg', 'fruit', 'bakery', 'snap'].map((key) => {
                const labelMap = {
                  all: 'All Stalls',
                  veg: 'Vegetables',
                  fruit: 'Fruits & Orchard',
                  bakery: 'Bakery & Dairy',
                  snap: 'SNAP / Info'
                };
                const isActive = mapFilter === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setMapFilter(key)}
                    className={`px-space-md py-1 rounded-full font-label-sm transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-primary text-on-primary font-bold'
                        : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'
                    }`}
                  >
                    {labelMap[key]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Map Canvas Graphic Area */}
          <div className="w-full bg-surface-container-low rounded-xl p-space-md lg:p-space-lg shadow-sm flex flex-col gap-space-md border border-outline-variant/30">
            {/* Map Header bar */}
            <div className="flex flex-wrap items-center justify-between gap-space-xs pb-space-xs border-b border-outline-variant/20">
              <div className="flex items-center gap-space-sm">
                <span className="material-symbols-outlined text-primary text-[22px]">pin_drop</span>
                <span className="font-label-md text-on-surface">Pioneer Pavilion &amp; Courtyard Walkways</span>
                <span className="text-xs px-2 py-0.5 bg-secondary-container text-on-secondary-container rounded-full font-label-sm">
                  Live Stall View
                </span>
              </div>
              <p className="font-body-sm text-on-surface-variant text-xs">
                Tap any stall marker to inspect grower profile &amp; reservation basket
              </p>
            </div>

            {/* Visual Pavilion Layout Grid Diagram */}
            <div className="w-full bg-surface-container-lowest rounded-xl p-space-md shadow-inner overflow-x-auto border border-outline-variant/30">
              <div className="min-w-[760px] flex flex-col gap-space-md py-space-sm">
                {/* North Entrance & Info Hub */}
                <div className="flex items-center justify-between px-space-md py-space-xs bg-surface-container rounded-lg">
                  <span className="font-label-sm text-on-surface-variant flex items-center gap-1 text-xs">
                    <span className="material-symbols-outlined text-[16px] text-primary">north</span>
                    North Arch Entrance (Central Plaza Promenade)
                  </span>
                  <div className="flex items-center gap-space-md font-label-sm text-xs">
                    <span className="flex items-center gap-1 text-primary">
                      <span className="w-2.5 h-2.5 rounded-full bg-primary inline-block"></span> Stall #1: SNAP &amp; Token Station
                    </span>
                    <span className="flex items-center gap-1 text-on-surface-variant">
                      <span className="material-symbols-outlined text-[16px]">wc</span> Restrooms
                    </span>
                    <span className="flex items-center gap-1 text-secondary">
                      <span className="material-symbols-outlined text-[16px]">water_drop</span> Fresh Water Station
                    </span>
                  </div>
                </div>

                {/* Aisles Container (A, B, C, D) */}
                <div className="grid grid-cols-4 gap-space-md text-center">
                  {/* Aisle A */}
                  <div className="flex flex-col gap-space-sm p-space-sm rounded-lg bg-surface-container-low border border-outline-variant/20">
                    <div className="py-1 bg-surface-container-high rounded text-primary font-label-sm uppercase tracking-wider text-xs">
                      Aisle A: Orchard &amp; Berries
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="p-space-xs rounded bg-surface-container-lowest text-left shadow-sm">
                        <span className="font-label-sm text-primary text-xs">Stall #11</span>
                        <p className="font-headline-sm text-sm text-on-surface">Cedar Hill Berries</p>
                        <p className="font-body-sm text-xs text-on-surface-variant">Blackberries &amp; Preserves</p>
                      </div>
                      {/* Highlighted Stall 12 */}
                      <div className="p-space-xs rounded bg-secondary-container text-left shadow-sm relative ring-2 ring-primary">
                        <div className="flex items-center justify-between">
                          <span className="font-label-sm text-on-secondary-container font-bold text-xs">Stall #12 ★</span>
                          <span className="text-[10px] bg-primary text-on-primary px-1.5 py-0.5 rounded font-label-sm">In Stock</span>
                        </div>
                        <p className="font-headline-sm text-sm text-on-secondary-container font-bold">Sunrise Orchard</p>
                        <p className="font-body-sm text-xs text-on-secondary-fixed-variant">Honeycrisp Apples, Pears, Fresh Cider</p>
                      </div>
                      <div className="p-space-xs rounded bg-surface-container-lowest text-left shadow-sm">
                        <span className="font-label-sm text-on-surface-variant text-xs">Stall #13</span>
                        <p className="font-headline-sm text-sm text-on-surface">Cloverdale Peaches</p>
                        <p className="font-body-sm text-xs text-on-surface-variant">Late Summer Stone Fruit</p>
                      </div>
                    </div>
                  </div>

                  {/* Aisle B */}
                  <div className="flex flex-col gap-space-sm p-space-sm rounded-lg bg-surface-container-low border border-outline-variant/20">
                    <div className="py-1 bg-surface-container-high rounded text-primary font-label-sm uppercase tracking-wider text-xs">
                      Aisle B: Vegetables &amp; Roots
                    </div>
                    <div className="flex flex-col gap-2">
                      {/* Highlighted Stall 4 */}
                      <div className="p-space-xs rounded bg-secondary-container text-left shadow-sm relative ring-2 ring-primary">
                        <div className="flex items-center justify-between">
                          <span className="font-label-sm text-on-secondary-container font-bold text-xs">Stall #4 ★</span>
                          <span className="text-[10px] bg-primary text-on-primary px-1.5 py-0.5 rounded font-label-sm">Popular</span>
                        </div>
                        <p className="font-headline-sm text-sm text-on-secondary-container font-bold">Green Pastures Organic</p>
                        <p className="font-body-sm text-xs text-on-secondary-fixed-variant">Heirloom Brandywines, Chard, Microgreens</p>
                      </div>
                      <div className="p-space-xs rounded bg-surface-container-lowest text-left shadow-sm">
                        <span className="font-label-sm text-on-surface-variant text-xs">Stall #5</span>
                        <p className="font-headline-sm text-sm text-on-surface">Red Earth Rootery</p>
                        <p className="font-body-sm text-xs text-on-surface-variant">Carrots, Beets, Shallots</p>
                      </div>
                      <div className="p-space-xs rounded bg-surface-container-lowest text-left shadow-sm">
                        <span className="font-label-sm text-on-surface-variant text-xs">Stall #6</span>
                        <p className="font-headline-sm text-sm text-on-surface">Fiddlehead Farm</p>
                        <p className="font-body-sm text-xs text-on-surface-variant">Squashes, Gourds &amp; Kale</p>
                      </div>
                    </div>
                  </div>

                  {/* Aisle C */}
                  <div className="flex flex-col gap-space-sm p-space-sm rounded-lg bg-surface-container-low border border-outline-variant/20">
                    <div className="py-1 bg-surface-container-high rounded text-primary font-label-sm uppercase tracking-wider text-xs">
                      Aisle C: Bakery &amp; Dairy
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="p-space-xs rounded bg-surface-container-lowest text-left shadow-sm">
                        <span className="font-label-sm text-on-surface-variant text-xs">Stall #17</span>
                        <p className="font-headline-sm text-sm text-on-surface">Sweet Meadow Creamery</p>
                        <p className="font-body-sm text-xs text-on-surface-variant">A2 Whole Milk &amp; Butter</p>
                      </div>
                      {/* Highlighted Stall 18 */}
                      <div className="p-space-xs rounded bg-secondary-container text-left shadow-sm relative ring-2 ring-primary">
                        <div className="flex items-center justify-between">
                          <span className="font-label-sm text-on-secondary-container font-bold text-xs">Stall #18 ★</span>
                          <span className="text-[10px] bg-tertiary-container text-on-tertiary px-1.5 py-0.5 rounded font-label-sm">Low Stock</span>
                        </div>
                        <p className="font-headline-sm text-sm text-on-secondary-container font-bold">Miller &amp; Stone Hearth</p>
                        <p className="font-body-sm text-xs text-on-secondary-fixed-variant">Woodfired Sourdough, Croissants</p>
                      </div>
                      {/* Highlighted Stall 21 */}
                      <div className="p-space-xs rounded bg-secondary-container text-left shadow-sm relative ring-2 ring-primary">
                        <div className="flex items-center justify-between">
                          <span className="font-label-sm text-on-secondary-container font-bold text-xs">Stall #21 ★</span>
                          <span className="text-[10px] bg-surface-container-highest text-on-surface-variant px-1.5 py-0.5 rounded font-label-sm">Sold Out</span>
                        </div>
                        <p className="font-headline-sm text-sm text-on-secondary-container font-bold">Heritage Hen Hollow</p>
                        <p className="font-body-sm text-xs text-on-secondary-fixed-variant">Pasture Organic Eggs &amp; Clover Honey</p>
                      </div>
                    </div>
                  </div>

                  {/* Aisle D */}
                  <div className="flex flex-col gap-space-sm p-space-sm rounded-lg bg-surface-container-low border border-outline-variant/20">
                    <div className="py-1 bg-surface-container-high rounded text-primary font-label-sm uppercase tracking-wider text-xs">
                      Aisle D: Artisans &amp; Preserves
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="p-space-xs rounded bg-surface-container-lowest text-left shadow-sm">
                        <span className="font-label-sm text-on-surface-variant text-xs">Stall #8</span>
                        <p className="font-headline-sm text-sm text-on-surface">Canyon Herbs &amp; Tea</p>
                        <p className="font-body-sm text-xs text-on-surface-variant">Dried Sage &amp; Botanical Blends</p>
                      </div>
                      {/* Highlighted Stall 9 */}
                      <div className="p-space-xs rounded bg-secondary-container text-left shadow-sm relative ring-2 ring-primary">
                        <div className="flex items-center justify-between">
                          <span className="font-label-sm text-on-secondary-container font-bold text-xs">Stall #9 ★</span>
                          <span className="text-[10px] bg-tertiary-container text-on-tertiary px-1.5 py-0.5 rounded font-label-sm">3 Jars Left</span>
                        </div>
                        <p className="font-headline-sm text-sm text-on-secondary-container font-bold">Pine Ridge Apiary</p>
                        <p className="font-body-sm text-xs text-on-secondary-fixed-variant">Raw Wildflower Honey &amp; Pollen</p>
                      </div>
                      <div className="p-space-xs rounded bg-surface-container-lowest text-left shadow-sm">
                        <span className="font-label-sm text-on-surface-variant text-xs">Stall #24</span>
                        <p className="font-headline-sm text-sm text-on-surface">Blue Sky Woolens</p>
                        <p className="font-body-sm text-xs text-on-surface-variant">Hand-spun skeins &amp; soaps</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* South Courtyard & Music Gazebo */}
                <div className="flex items-center justify-between px-space-md py-space-xs bg-surface-container rounded-lg text-xs">
                  <span className="font-label-sm text-on-surface-variant flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-tertiary">music_note</span>
                    South Courtyard &amp; Live Bluegrass Acoustic Gazebo (Music 9:30 AM - 12:00 PM)
                  </span>
                  <span className="font-label-sm text-primary flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">local_parking</span>
                    Wagon Check &amp; Curbside Loading Zone
                  </span>
                </div>
              </div>
            </div>

            {/* Map Location Embed Placeholder Container */}
            <div className="w-full h-56 rounded-xl overflow-hidden relative shadow-inner border border-outline-variant/30">
              <div className="absolute inset-0 bg-surface-container-high flex flex-col items-center justify-center p-space-md text-center">
                <span className="material-symbols-outlined text-primary text-[42px] mb-space-xs">place</span>
                <p className="font-headline-sm text-on-surface">Central Plaza Pioneer Pavilion Map View</p>
                <p className="font-body-sm text-on-surface-variant max-w-md text-xs mt-1">
                  GPS: 120 Market Square (Corner of 2nd Ave &amp; Pioneer Blvd). Loading bays open on South Street for bulk crate pick-up.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Market Schedule & Practical Info Bar */}
      <section className="w-full py-space-lg px-gutter bg-surface-container-low border-y border-outline-variant/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
            <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-xs border border-outline-variant/30">
              <div className="flex items-center gap-space-xs text-primary">
                <span className="material-symbols-outlined text-[24px]">schedule</span>
                <h4 className="font-headline-sm text-base text-on-surface">Market Operating Hours</h4>
              </div>
              <p className="font-body-sm text-on-surface-variant text-xs leading-relaxed">
                Every Saturday: <strong>8:00 AM – 1:00 PM</strong><br />
                Sunrise Early-Bird for seniors &amp; mobility patrons opens at <strong>7:30 AM</strong>.
              </p>
            </div>

            <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-xs border border-outline-variant/30">
              <div className="flex items-center gap-space-xs text-primary">
                <span className="material-symbols-outlined text-[24px]">wb_sunny</span>
                <h4 className="font-headline-sm text-base text-on-surface">Year-Round Season</h4>
              </div>
              <p className="font-body-sm text-on-surface-variant text-xs leading-relaxed">
                Open 52 weeks a year, rain, shine, or harvest frost. Fully sheltered underneath Pioneer Historic Pavilion brick arches.
              </p>
            </div>

            <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-xs border border-outline-variant/30">
              <div className="flex items-center gap-space-xs text-primary">
                <span className="material-symbols-outlined text-[24px]">local_parking</span>
                <h4 className="font-headline-sm text-base text-on-surface">Validated Free Parking</h4>
              </div>
              <p className="font-body-sm text-on-surface-variant text-xs leading-relaxed">
                <strong>2 Hours Free</strong> at Central Plaza Parking Garage (Entrance off 2nd Ave) with vendor stamp or Info Booth voucher.
              </p>
            </div>

            <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-xs border border-outline-variant/30">
              <div className="flex items-center gap-space-xs text-secondary">
                <span className="material-symbols-outlined text-[24px]">verified</span>
                <h4 className="font-headline-sm text-base text-on-surface">Stall Pickup Guarantee</h4>
              </div>
              <p className="font-body-sm text-on-surface-variant text-xs leading-relaxed">
                Reserved produce held until <strong>11:30 AM</strong> at the grower stall. Pay directly in cash, farm voucher, card, or SNAP tokens.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Participating Farmers & Producers Section */}
      <section className="w-full py-space-xl px-gutter bg-surface">
        <div className="max-w-7xl mx-auto flex flex-col gap-space-lg">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
            <div>
              <div className="inline-flex items-center gap-1 font-label-sm text-secondary uppercase tracking-wider mb-1 font-bold">
                <span className="material-symbols-outlined text-[16px]">agriculture</span>
                <span>Local Soil Stewards</span>
              </div>
              <h2 className="font-headline-lg text-on-surface">Farmers &amp; Producers at Downtown Historic</h2>
              <p className="font-body-md text-on-surface-variant">28 active regional family growers harvesting specifically for this Saturday.</p>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-space-xs">
              {[
                { id: 'all', label: 'All Producers (28)' },
                { id: 'veg', label: 'Vegetables (9)' },
                { id: 'fruit', label: 'Fruit Orchards (6)' },
                { id: 'bakery', label: 'Artisan Bakery (4)' },
                { id: 'dairy', label: 'Dairy & Eggs (5)' },
                { id: 'honey', label: 'Honey (4)' }
              ].map((pill) => {
                const isActive = producerFilter === pill.id;
                return (
                  <button
                    key={pill.id}
                    type="button"
                    onClick={() => setProducerFilter(pill.id)}
                    className={`px-space-md py-1 rounded-full font-label-sm transition-colors cursor-pointer text-xs ${
                      isActive
                        ? 'bg-primary text-on-primary font-bold'
                        : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                    }`}
                  >
                    {pill.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Producer Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md">
            {filteredProducers.map((producer) => (
              <div
                key={producer.id}
                className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-space-md border border-outline-variant/30"
              >
                <div className="flex flex-col gap-space-sm">
                  <div className="flex items-start justify-between gap-space-xs">
                    <div>
                      <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-xs">
                        {producer.stall}
                      </span>
                      <h3 className="font-headline-md text-on-surface mt-1">{producer.name}</h3>
                      <p className="font-label-sm text-primary text-xs">{producer.farmers}</p>
                    </div>
                    <div className="flex items-center gap-0.5 px-2 py-1 rounded bg-surface-container-low text-on-surface font-label-sm text-xs">
                      <span className="material-symbols-outlined text-secondary text-[16px] fill">star</span>
                      <span>{producer.rating}</span>
                      <span className="text-on-surface-variant font-normal">({producer.reviews})</span>
                    </div>
                  </div>
                  <p className="font-body-sm text-on-surface-variant text-xs leading-relaxed">
                    {producer.desc}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-space-xs gap-space-xs border-t border-outline-variant/20">
                  <button
                    onClick={() => onNavigate(producer.farmKey === 'green-pastures' ? 'farmer-profile' : 'products')}
                    className="font-label-sm text-primary hover:underline flex items-center gap-1 text-xs cursor-pointer"
                  >
                    <span>View Stall Stock</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                  {producer.status === 'sold-out' ? (
                    <span className="px-space-sm py-1 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-xs">
                      Sold Out This Sat
                    </span>
                  ) : (
                    <button
                      onClick={() => onNavigate('products')}
                      className="px-space-md py-1.5 rounded-full bg-tertiary-container text-on-tertiary font-label-sm hover:bg-tertiary transition-colors text-xs cursor-pointer shadow-sm"
                    >
                      {producer.btnText}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Produce Available for Saturday Reservation Section */}
      <section className="w-full py-space-xl px-gutter bg-surface-container-low border-t border-outline-variant/30">
        <div className="max-w-7xl mx-auto flex flex-col gap-space-lg">
          <div>
            <div className="inline-flex items-center gap-1 font-label-sm text-primary uppercase tracking-wider mb-1 font-bold">
              <span className="material-symbols-outlined text-[16px]">shopping_basket</span>
              <span>Saturday Pickup Harvest</span>
            </div>
            <h2 className="font-headline-lg text-on-surface">Reserve Fresh Harvest from Downtown Stalls</h2>
            <p className="font-body-md text-on-surface-variant max-w-3xl">
              Lock in your weekend basket before sunrise. Zero online fees, zero card forms here — simply inspect and pay directly at the vendor booth upon pickup.
            </p>
          </div>

          {/* 6 Produce Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-md">
            {harvestItems.map((item) => {
              const isSoldOut = item.status === 'SOLD_OUT';
              return (
                <div
                  key={item.id}
                  className={`bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col border border-outline-variant/30 ${
                    isSoldOut ? 'opacity-90' : ''
                  }`}
                >
                  <div className="h-48 w-full relative overflow-hidden bg-surface-container">
                    <img
                      src={item.image}
                      alt={item.alt}
                      className={`w-full h-full object-cover hover:scale-105 transition-transform duration-300 ${
                        isSoldOut ? 'grayscale-[30%]' : ''
                      }`}
                    />
                    <div className="absolute top-space-xs left-space-xs">
                      <span
                        className={`px-2.5 py-1 rounded-full font-label-sm shadow-sm text-xs ${
                          isSoldOut
                            ? 'bg-surface-container-highest text-on-surface-variant font-bold'
                            : item.status === 'LOW_STOCK'
                            ? 'bg-surface-container-high text-tertiary font-bold'
                            : 'bg-secondary-container text-on-secondary-container'
                        }`}
                      >
                        {item.badge}
                      </span>
                    </div>
                    <div className="absolute bottom-space-xs right-space-xs">
                      <span className="px-2 py-0.5 rounded-full bg-surface-container-lowest/90 backdrop-blur font-label-sm text-primary shadow-sm text-xs">
                        {item.stall}
                      </span>
                    </div>
                  </div>

                  <div className="p-space-md flex flex-col flex-grow justify-between gap-space-md">
                    <div>
                      <div className="flex items-baseline justify-between">
                        <h3 className="font-headline-sm text-on-surface text-base">{item.name}</h3>
                        <span className="font-headline-sm text-primary font-bold">
                          ${item.price.toFixed(2)}
                          <span className="text-xs font-normal text-on-surface-variant">/{item.unit}</span>
                        </span>
                      </div>
                      <p className="font-body-sm text-on-surface-variant mt-1 text-xs leading-relaxed">
                        {item.desc}
                      </p>
                    </div>

                    {isSoldOut ? (
                      <button
                        type="button"
                        disabled
                        className="w-full inline-flex items-center justify-center gap-space-xs px-space-md py-space-sm rounded-full bg-surface-container text-on-surface-variant font-label-md cursor-not-allowed text-xs"
                      >
                        <span className="material-symbols-outlined text-[18px]">event_busy</span>
                        Fully Reserved for Saturday
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onReserveProduct(item)}
                        className="w-full inline-flex items-center justify-center gap-space-xs px-space-md py-space-sm rounded-full bg-tertiary-container text-on-tertiary font-label-md hover:bg-tertiary transition-colors active:scale-95 shadow-sm cursor-pointer text-xs"
                      >
                        <span className="material-symbols-outlined text-[18px]">bookmark_add</span>
                        Reserve for Saturday Pickup
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Reservation Note */}
          <div className="p-space-md rounded-xl bg-surface-container flex flex-col sm:flex-row items-center justify-between gap-space-sm border border-outline-variant/30">
            <div className="flex items-center gap-space-sm">
              <span className="material-symbols-outlined text-primary text-[28px]">handshake</span>
              <div>
                <p className="font-label-md text-on-surface">How Stall Reservations Work on MarketLink</p>
                <p className="font-body-sm text-on-surface-variant text-xs">
                  Click Reserve to create your Saturday morning pickup docket. Farmers hold your produce safe until 11:30 AM. Zero prepayment required.
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('contact-us')}
              className="inline-flex items-center gap-1 font-label-sm text-primary hover:underline whitespace-nowrap cursor-pointer text-xs"
            >
              <span>Read Pickup Guidelines</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </section>

      {/* Community Notice & Market Organizer Box */}
      <section className="w-full py-space-xl px-gutter bg-surface">
        <div className="max-w-7xl mx-auto">
          <div className="bg-primary text-on-primary rounded-xl p-space-lg shadow-md relative overflow-hidden">
            {/* Decorative subtle leaf background SVG icon */}
            <div className="absolute right-4 -bottom-6 opacity-10 pointer-events-none">
              <span className="material-symbols-outlined text-[220px]">psychiatry</span>
            </div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-center">
              <div className="lg:col-span-8 flex flex-col gap-space-sm">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-sm w-max text-xs">
                  <span className="material-symbols-outlined text-[16px]">campaign</span>
                  <span>This Saturday's Community Lineup</span>
                </div>
                <h3 className="font-headline-lg text-on-primary">Live Music, Garden Consults &amp; Grower Notices</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md mt-space-xs">
                  <div className="flex items-start gap-space-xs">
                    <span className="material-symbols-outlined text-secondary-fixed text-[22px] mt-0.5">music_note</span>
                    <div>
                      <p className="font-label-md text-on-primary">Live Bluegrass Acoustic Duo</p>
                      <p className="font-body-sm text-primary-fixed-dim text-xs">9:30 AM – 12:00 PM at Central Gazebo lawn. Bring picnic chairs!</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-space-xs">
                    <span className="material-symbols-outlined text-secondary-fixed text-[22px] mt-0.5">psychiatry</span>
                    <div>
                      <p className="font-label-md text-on-primary">Master Gardener Soil Testing</p>
                      <p className="font-body-sm text-primary-fixed-dim text-xs">Desk near Stall #1: Bring 1 cup dry garden soil for free pH test.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 flex flex-col items-start lg:items-end gap-space-sm">
                <div className="bg-primary-container p-space-md rounded-lg text-left w-full border border-primary-fixed/20 shadow-sm">
                  <p className="font-label-md text-on-primary">Are you a regional grower?</p>
                  <p className="font-body-sm text-primary-fixed-dim mb-space-xs text-xs">
                    Downtown Historic has 2 seasonal guest producer spots available for autumn harvests.
                  </p>
                  <button
                    onClick={() => onNavigate('farmer-portal')}
                    className="inline-flex items-center gap-1 font-label-sm text-secondary-fixed hover:underline cursor-pointer text-xs"
                  >
                    <span>Apply for a Stall Space</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
