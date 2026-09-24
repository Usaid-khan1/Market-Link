import React, { useState } from 'react';

export default function FarmerProfile({ onNavigate, onReserveProduct, onNotifyProduct }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [isFavorited, setIsFavorited] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState(89);
  const [quantities, setQuantities] = useState({
    1: 1,
    2: 1,
    3: 1,
    4: 1,
    5: 1,
    6: 1
  });

  const handleQtyChange = (id, delta) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(1, Math.min(12, (prev[id] || 1) + delta))
    }));
  };

  const handleToggleFavorite = () => {
    if (isFavorited) {
      setIsFavorited(false);
      setFavoriteCount((c) => c - 1);
    } else {
      setIsFavorited(true);
      setFavoriteCount((c) => c + 1);
    }
  };

  const harvestItems = [
    {
      id: 1,
      category: 'tomatoes',
      name: 'Heirloom Brandywine Tomatoes',
      price: 4.50,
      unit: 'lb',
      status: 'IN_STOCK',
      badge: 'IN STOCK',
      badgeClass: 'bg-secondary-container text-on-secondary-container',
      harvestTime: 'Harvested: Friday Dawn',
      desc: 'Rich, deeply flavorful vintage heirloom. High sugar-to-acid ratio with creamy texture. Ideal for caprese and crusty sourdough toast.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDnJ9PioJ06jB8v8Rrs8x0zt1bLicp8igbBa0iMVKsUNb8vXFcZAz90vd_l8g346NJDMtAlbU8bzmopUo0l3vnk6UWmuFglkkT8yBxGdijSvOPGaKh9sLKve8THZKymTByOtlnDpn73upXxEwTn-rj0cLVtk1kqaRoouL3NM0Teqp3YxsBGQl4LKY8UPTfJJwFnI1KZycXhHC2wK03U-WiRSioSKuTIBPpUb01Dc3DTdzGZqmWgZZdX',
      alt: 'Rustic wooden crate filled with ripe, organically grown Heirloom Brandywine tomatoes'
    },
    {
      id: 2,
      category: 'greens',
      name: 'Rainbow Chard & Kale Bundle',
      price: 3.75,
      unit: 'bunch',
      status: 'IN_STOCK',
      badge: 'IN STOCK',
      badgeClass: 'bg-secondary-container text-on-secondary-container',
      harvestTime: 'Harvested: Friday Dawn',
      desc: 'Vivid ruby, amber, and snow stalks paired with tender Lacinato dinosaur kale. Washed in natural mountain spring water.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCLIjTMRUk_DaF12q5QkkMzy9aCaIv0lSF-CawUOxgWrtN6R9JTlgH1MYhD5alSjiBBohmGFIrYAea02ID79OMITc-88H-qtpm3f85FjFIovkrylndFo1raj6Gp22cQpMmsij1gvDsZfsRWwbpUVUoVFvjhtCRE8TzamnwEb6cmN47rD0doflET7MbDuL0H-AN5emCzJ4vpT8fcwjKrICTNBvtqgM11GHmCS__uH0KdcKcEQN5VDj_I',
      alt: 'Vibrant bundles of freshly harvested rainbow Swiss chard with natural rustic jute twine'
    },
    {
      id: 3,
      category: 'microgreens',
      name: 'Watercress & Micro Trio',
      price: 4.00,
      unit: 'clamshell',
      status: 'IN_STOCK',
      badge: 'IN STOCK',
      badgeClass: 'bg-secondary-container text-on-secondary-container',
      harvestTime: 'Harvested: Friday Dawn',
      desc: 'Hydro-organic living greens including speckled pea tendrils, ruby radish shoots, and nutrient-dense peppery watercress.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAsSq1BOUhZJDoEC5aMJPxfi8OeJA406CerxPpDNeaocGSvzkRFNcD3vehYOOLSHVACcwCYTgmo207LpD3s6e4EBfktZrqKh49Jmhx3hl4b6wu9s60WWTtdUYSnmXeF-GzcI0cde68qym71aYKOpCbXpF7tJzRLvDtvp2FRT3eCqsIpBTULTUmChnYS-qxj_rQdy11LCIc1JtErIww7_Wg_m_KlIDwJ-nqnxcff_f7VLQYcf3ggDkA-',
      alt: 'Macro view of living organic microgreens trio packed neatly in eco-friendly plant fiber clamshell'
    },
    {
      id: 4,
      category: 'roots',
      name: 'Golden Baby Beets & Tops',
      price: 3.50,
      unit: 'bunch',
      status: 'LOW_STOCK',
      badge: 'LOW STOCK (4 left)',
      badgeClass: 'bg-tertiary-fixed text-on-tertiary-fixed-variant',
      harvestTime: 'Harvested: Friday Dawn',
      desc: 'Milder and sweeter than red beets with zero bleeding when roasted. Vibrant edible greens sauté wonderfully with garlic.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAq65wBWMGPQ3pGUb1U1jp_GrGL72A502igNcyZHP2MP-QPcc2_z1c5HEBM6IVIHcoms0BBikb2hBxiLlvvst63Dj_F-uwIo5dN6GnKqWLPfKiTONGc6n2m80B99S0i-JLMOoE1KjT49k9KuSg8wA_Hh0tTOkxX9bcao6GDNk3snii88CuRMlJiwK_ki1u8y09aPFb3B5D_1uFWdjYYFLH7gQm4HlYwJzA330AG5-9b73zBjS491WvD',
      alt: 'Freshly pulled golden yellow baby beets with healthy lush green tops on weathered wooden table'
    },
    {
      id: 5,
      category: 'tomatoes',
      name: 'Sungold Cherry Tomatoes',
      price: 5.00,
      unit: 'pint',
      status: 'IN_STOCK',
      badge: 'IN STOCK',
      badgeClass: 'bg-secondary-container text-on-secondary-container',
      harvestTime: 'Harvested: Friday Dawn',
      desc: 'Candy-sweet golden cherry tomatoes packed with intense summery aromatics. Handpicked at sunrise when brix levels peak.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAkw_oi0JeAT6YsMVNfM5o3cAeEEIqTC1UZWIalH0aPlHBK7NBb6FefjJXFevOWh5RE5cPz8ymAvbCacZWewoOSyKlj5VR4d_uOB5WPxwBUZFFkwrsGd4JSiLz_XkoR0v_Z2hyRjXjfILWKBMHg0q3Gls_XtFoAjyERy0e5c8Quw5hPpR_lVN3Ak3ILK72Y8CXZsGvnBXlmmufaOEHHtKwWNGoA5GdigzF7IplpUZmPTKK2aEu0-yc5',
      alt: 'Pint cardboard basket overflowing with glowing ripe orange Sungold cherry tomatoes in warm daylight'
    },
    {
      id: 6,
      category: 'roots',
      name: 'French Breakfast Radishes',
      price: 3.00,
      unit: 'bunch',
      status: 'SOLD_OUT',
      badge: 'SOLD OUT THIS WEEK',
      badgeClass: 'bg-surface-variant text-on-surface-variant',
      harvestTime: 'Next: Next Saturday',
      desc: 'Mild peppery crunch with classic porcelain white tips. Completely reserved by Friday midday. Next bed ready next weekend.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD__IwucZg3HhaG5B23GD8ooRhf_vKh338VCayP5psFBfH3SLW6dfSc9wJYAZeAo9boNPNuqv86iKL4wPCoWg6INy0jqS0OTN3nY6_Sk7IA9uMI5rgXPXOtA4SBWziJVI6LfyAqsOKGCuJNPKinVSb3RU3NP2FCL_dWUgCpAb6SygqCuUuegEhL_Tz7RrtTT_SGq7g4LcfC5H6yvoUYkCUmA5ttc4-l4WsWuLkzSEkvgUh3vODbJCYY',
      alt: 'Neat bunch of French Breakfast radishes with elongated scarlet red roots and crisp white tips'
    }
  ];

  const filteredHarvest = harvestItems.filter((item) => {
    if (activeCategory === 'all') return true;
    return item.category === activeCategory;
  });

  return (
    <div className="flex flex-col w-full">
      {/* Top Breadcrumb & Quick Anchor Bar */}
      <section className="w-full bg-surface-container-low py-space-sm px-gutter border-b border-outline-variant/30">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-space-sm">
          <nav aria-label="Breadcrumb" className="flex items-center gap-space-xs font-label-sm text-on-surface-variant text-xs">
            <button onClick={() => onNavigate('home')} className="hover:text-primary transition-colors flex items-center gap-1 cursor-pointer">
              <span className="material-symbols-outlined text-[16px]">home</span>
              Home
            </button>
            <span className="text-outline-variant">/</span>
            <button onClick={() => onNavigate('markets')} className="hover:text-primary transition-colors cursor-pointer">
              Markets
            </button>
            <span className="text-outline-variant">/</span>
            <button onClick={() => onNavigate('market-details')} className="hover:text-primary transition-colors cursor-pointer">
              Downtown Historic Farmers Market
            </button>
            <span className="text-outline-variant">/</span>
            <span className="text-primary font-bold">Green Pastures Organic</span>
          </nav>
          <div className="hidden md:flex items-center gap-space-md text-label-sm text-on-surface-variant font-label-sm text-xs">
            <span className="inline-flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-primary">verified</span>
              Verified Stand Partner
            </span>
            <span className="text-outline-variant">•</span>
            <span className="inline-flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-tertiary">payments</span>
              100% In-Person Payment at Stall
            </span>
          </div>
        </div>
      </section>

      {/* Notice Banner: Order Cut-Off */}
      <section className="w-full bg-surface-container px-gutter py-space-xs border-b border-outline-variant/30">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-space-sm">
          <div className="flex items-center gap-space-sm">
            <span className="flex h-2.5 w-2.5 rounded-full bg-tertiary-container animate-pulse"></span>
            <p className="font-label-md text-label-md text-tertiary text-xs">
              <strong>Order Cut-Off:</strong> Friday at 6:00 PM for Saturday morning pickup. Orders reserved online are freshly harvested at dawn!
            </p>
          </div>
          <span className="font-label-sm text-label-sm text-on-surface-variant hidden lg:inline text-xs">
            Next Harvest Date: This Friday at 5:30 AM
          </span>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-gutter py-space-lg w-full">
        {/* Farmer Header Hero Banner */}
        <header className="bg-surface-container-lowest rounded-xl shadow-md overflow-hidden relative mb-space-xl border border-outline-variant/30">
          {/* Background Ambient Cover Image with Scrim */}
          <div className="relative h-64 md:h-80 w-full overflow-hidden">
            <div
              className="w-full h-full bg-cover bg-center"
              style={{
                backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCKhIGdpEkJKSUtvsufJU_HvFnwJatI9TLiv2hAepo-KedkTC_pXvY3u5hHkVlwJFOcCDtBTyceavl1SdO76dEd_MmJQ6REqIXuswDKZyqIzc7mcC_ilZYR_lj3mOdiFV6NgGWhMkdbwumq75gehdGF88t7OhiTn_iS0jH4QxHaBKNMbai4dkQcoYtrB84siKu3tHGJQjUbivmc9pfZ5dwZ8BbbauZ3iv1_zp6pwVtwMDhoexjlC5fu')`
              }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent"></div>

            {/* Floating Badges Top Right */}
            <div className="absolute top-space-md right-space-md flex flex-wrap items-center gap-space-xs">
              <span className="inline-flex items-center gap-1.5 px-space-md py-space-xs rounded-full bg-surface-container-lowest/95 text-primary font-label-sm text-label-sm shadow-sm backdrop-blur-md text-xs">
                <span className="material-symbols-outlined text-[16px] text-primary fill">eco</span>
                USDA Certified Organic #OR-9942
              </span>
              <span className="inline-flex items-center gap-1.5 px-space-md py-space-xs rounded-full bg-surface-container-lowest/95 text-secondary font-label-sm text-label-sm shadow-sm backdrop-blur-md text-xs">
                <span className="material-symbols-outlined text-[16px] text-secondary fill">nature_people</span>
                Certified Naturally Grown
              </span>
            </div>

            {/* Farmer Banner Content Inside Scrim */}
            <div className="absolute bottom-space-md left-space-md right-space-md flex flex-col md:flex-row items-start md:items-end justify-between gap-space-md">
              <div className="flex items-end gap-space-md">
                <div className="w-24 h-24 md:w-28 md:h-28 rounded-xl bg-surface-container-lowest shadow-xl overflow-hidden shrink-0 border-2 border-white">
                  <img
                    alt="Martha &amp; Joe Miller"
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBJEkHF1d2vtmuYvB10Epq1AlSNLsGHmSbTixaxVRL1uYWIk9FReEZZwWuy_ONgo33VuLbznOR0dNmXDqD-l0WCS1yayILhsxdWvJQ3Gk8UqyBZOhUbPCvlFMiw44S7rHks3SQShZfZIHNkx0OA0zypMJsGAC6WmcY2W3nPPDUKXn9C54Jnkdr5SEWtTyzf0IMtZpxWulQKiBJ53zKHaa3GkGpzgd0K9dOBmOpzhpajMHpae4MbuQD_"
                  />
                </div>
                <div className="text-on-primary">
                  <div className="flex items-center gap-space-xs flex-wrap mb-1">
                    <span className="px-space-xs py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm text-xs font-bold">
                      Stall #4, Aisle B
                    </span>
                    <span className="px-space-xs py-0.5 rounded-full bg-surface/20 text-on-primary font-label-sm text-label-sm backdrop-blur-sm text-xs">
                      Downtown Historic Market
                    </span>
                  </div>
                  <h1 className="font-headline-lg text-headline-lg text-on-primary leading-tight font-bold drop-shadow-sm">
                    Green Pastures Organic
                  </h1>
                  <p className="font-body-md text-body-md text-surface-container-high">
                    Martha &amp; Joe Miller <span className="opacity-80 font-normal">(4th Generation Family Growers)</span>
                  </p>
                </div>
              </div>

              {/* Quick Stat Badge / Rating */}
              <div className="flex items-center gap-space-md bg-surface-container-lowest/90 backdrop-blur-md px-space-md py-space-sm rounded-lg shadow-sm">
                <div className="flex flex-col items-center">
                  <div className="flex items-center text-tertiary font-bold text-headline-sm font-headline-sm leading-none">
                    <span className="material-symbols-outlined text-[22px] text-tertiary-container mr-1 fill">star</span>
                    4.98
                  </div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant text-xs">142 reviews</span>
                </div>
                <div className="w-px h-8 bg-surface-variant"></div>
                <div className="flex flex-col">
                  <span className="font-label-md text-label-md text-primary font-bold text-xs">Pine Creek, OR</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant text-xs">45 Regenerative Acres</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action & Schedule Bar Below Banner Image */}
          <div className="p-space-md md:p-space-lg bg-surface-container-lowest flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
            <div className="max-w-2xl">
              <p className="font-body-md text-body-md text-on-surface leading-relaxed text-sm">
                Nurturing rich bio-intensive living soil along the Pine Creek riverbed for over 38 years. Martha &amp; Joe Miller grow heritage heirloom varieties without synthetic pesticides, chemical fertilizers, or heated greenhouses—harvesting by hand at sunrise for immediate weekend market distribution.
              </p>
              <div className="flex items-center gap-space-md mt-space-sm flex-wrap text-label-sm font-label-sm text-on-surface-variant text-xs">
                <span className="inline-flex items-center gap-1 text-primary">
                  <span className="material-symbols-outlined text-[16px]">schedule</span>
                  Saturday Pickups held until 11:30 AM at Stall #4
                </span>
                <span>•</span>
                <span className="inline-flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">storefront</span>
                  Oak Valley Sunday Bazaar (9:00 AM – 2:00 PM)
                </span>
              </div>
            </div>

            {/* Buttons group */}
            <div className="flex items-center gap-space-sm flex-wrap shrink-0">
              <button
                type="button"
                onClick={handleToggleFavorite}
                aria-label="Favorite Farmer"
                className={`px-space-md py-space-xs rounded-full transition-all flex items-center gap-1.5 font-label-md text-label-md active:scale-95 cursor-pointer text-xs ${
                  isFavorited ? 'bg-primary/10 text-primary' : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
                }`}
              >
                <span className={`material-symbols-outlined text-[18px] text-tertiary ${isFavorited ? 'fill' : ''}`}>
                  {isFavorited ? 'favorite' : 'favorite_border'}
                </span>
                <span>{isFavorited ? 'Favorited' : 'Favorite Farmer'}</span>
                <span className="px-1.5 py-0.5 rounded-full bg-surface-container-lowest text-primary text-xs font-bold">
                  {favoriteCount}
                </span>
              </button>

              <button
                type="button"
                onClick={() => alert('Opening direct message thread with Martha & Joe Miller...')}
                className="px-space-md py-space-xs rounded-full bg-surface-container-low hover:bg-surface-container text-primary font-label-md text-label-md transition-colors flex items-center gap-1.5 cursor-pointer text-xs"
              >
                <span className="material-symbols-outlined text-[18px]">chat</span>
                Message Grower
              </button>

              <a
                href="#harvest-catalog"
                className="px-space-lg py-space-xs rounded-full bg-tertiary-container hover:bg-tertiary text-on-tertiary font-label-md text-label-md transition-all shadow-md flex items-center gap-2 hover:scale-[1.02] cursor-pointer text-xs"
              >
                <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
                Pre-Order Weekly Harvest
              </a>
            </div>
          </div>
        </header>

        {/* Main Layout: 2 Columns (8 cols + 4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
          {/* Left / Main Column (8 cols) */}
          <main className="lg:col-span-8 flex flex-col gap-space-xl">
            {/* Harvest Section */}
            <section className="flex flex-col gap-space-md" id="harvest-catalog">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-space-sm">
                <div>
                  <span className="font-label-sm text-label-sm text-secondary tracking-wider uppercase font-bold text-xs">
                    Seasonal Availability
                  </span>
                  <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">
                    This Week's Stock &amp; Fresh Harvest
                  </h2>
                </div>
                <p className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1 text-xs">
                  <span className="material-symbols-outlined text-[16px] text-primary">alarm</span>
                  Pickup: Saturday, 8:00 AM – 11:30 AM
                </p>
              </div>

              {/* Filter Chips Bar */}
              <div className="flex items-center gap-space-xs overflow-x-auto pb-space-xs scrollbar-none" id="category-filter-bar">
                {[
                  { id: 'all', label: 'All Harvest (6)' },
                  { id: 'tomatoes', label: 'Heirloom Tomatoes' },
                  { id: 'greens', label: 'Greens & Chard' },
                  { id: 'roots', label: 'Root Veggies' },
                  { id: 'microgreens', label: 'Microgreens' }
                ].map((chip) => {
                  const isActive = activeCategory === chip.id;
                  return (
                    <button
                      key={chip.id}
                      type="button"
                      onClick={() => setActiveCategory(chip.id)}
                      className={`filter-chip px-space-md py-space-xs rounded-full font-label-sm text-label-sm shrink-0 transition-colors cursor-pointer text-xs ${
                        isActive
                          ? 'bg-primary text-on-primary font-bold'
                          : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container border border-outline-variant/30'
                      }`}
                    >
                      {chip.label}
                    </button>
                  );
                })}
              </div>

              {/* Product Card Grid (2 Columns) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                {filteredHarvest.map((item) => {
                  const isSoldOut = item.status === 'SOLD_OUT';
                  const currentQty = quantities[item.id] || 1;

                  return (
                    <article
                      key={item.id}
                      className="bg-surface-container-lowest rounded-xl shadow-sm hover:shadow-md transition-all p-space-md flex flex-col justify-between border border-outline-variant/30"
                    >
                      <div>
                        <div className="relative h-44 w-full rounded-lg overflow-hidden mb-space-sm bg-surface-container">
                          <img
                            alt={item.name}
                            src={item.image}
                            className={`w-full h-full object-cover transition-transform duration-300 hover:scale-105 ${
                              isSoldOut ? 'grayscale-[30%]' : ''
                            }`}
                          />
                          <div className="absolute top-2 left-2">
                            <span className={`inline-flex items-center px-space-xs py-0.5 rounded-full font-label-sm text-label-sm shadow-xs font-bold text-xs ${item.badgeClass}`}>
                              {item.badge}
                            </span>
                          </div>
                          <div className="absolute bottom-2 right-2 bg-surface-container-lowest/90 backdrop-blur-sm px-2 py-0.5 rounded font-label-sm text-label-sm text-on-surface text-xs">
                            {item.harvestTime}
                          </div>
                        </div>

                        <div className="flex items-start justify-between gap-space-xs mb-1">
                          <div>
                            <span className="font-label-sm text-label-sm text-primary font-bold text-xs">Green Pastures Organic</span>
                            <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold text-base">
                              {item.name}
                            </h3>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="font-headline-sm text-headline-sm text-primary font-bold">${item.price.toFixed(2)}</span>
                            <span className="font-label-sm text-label-sm text-on-surface-variant block text-xs">/ {item.unit}</span>
                          </div>
                        </div>
                        <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 mb-space-md text-xs leading-relaxed">
                          {item.desc}
                        </p>
                      </div>

                      <div className="pt-space-sm bg-surface-container-low/40 rounded-lg p-space-sm flex items-center justify-between gap-space-sm mt-auto border border-outline-variant/20">
                        {!isSoldOut ? (
                          <>
                            <div className="flex items-center bg-surface-container-lowest rounded-full shadow-xs px-2 py-1 border border-outline-variant/30">
                              <button
                                aria-label="Decrease quantity"
                                onClick={() => handleQtyChange(item.id, -1)}
                                className="qty-btn-minus text-on-surface-variant hover:text-primary px-1 font-bold cursor-pointer"
                                type="button"
                              >
                                −
                              </button>
                              <span className="qty-display font-label-md text-label-md px-2 text-on-surface text-xs font-bold">
                                {currentQty}
                              </span>
                              <button
                                aria-label="Increase quantity"
                                onClick={() => handleQtyChange(item.id, 1)}
                                className="qty-btn-plus text-on-surface-variant hover:text-primary px-1 font-bold cursor-pointer"
                                type="button"
                              >
                                +
                              </button>
                            </div>
                            <button
                              type="button"
                              onClick={() => onReserveProduct({
                                ...item,
                                farm: 'Green Pastures Organic',
                                market: 'Downtown Historic Farmers Market (Stall #4)',
                                quantity: currentQty
                              })}
                              className="flex-1 text-center py-space-xs px-space-sm rounded-full bg-tertiary-container hover:bg-tertiary text-on-tertiary font-label-md text-label-md transition-colors shadow-xs cursor-pointer text-xs"
                            >
                              Reserve for Pickup
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={() => onNotifyProduct(item)}
                            className="w-full py-space-xs px-space-sm rounded-full bg-surface-variant text-on-surface-variant font-label-md text-label-md cursor-pointer text-center text-xs hover:bg-surface-container-highest transition-colors"
                          >
                            Notify Next Harvest
                          </button>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>

            {/* Customer Reviews Section */}
            <section className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm border border-outline-variant/30" id="grower-reviews">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md pb-space-lg border-b border-surface-container">
                <div>
                  <span className="font-label-sm text-label-sm text-secondary tracking-wider uppercase font-bold text-xs">
                    Community Feedback
                  </span>
                  <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">
                    Verified Customer Reviews &amp; Grower Replies
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => alert('Review form opened for Green Pastures Organic!')}
                  className="px-space-md py-space-xs rounded-full bg-primary text-on-primary hover:bg-primary-container font-label-md text-label-md transition-colors shrink-0 text-xs cursor-pointer"
                >
                  Write a Review
                </button>
              </div>

              {/* Rating Breakdown Bento */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-space-lg py-space-lg items-center">
                {/* Big Score Left */}
                <div className="md:col-span-4 flex flex-col items-center justify-center p-space-md bg-surface-container-low rounded-xl text-center border border-outline-variant/20">
                  <span className="font-display-lg text-display-lg text-primary font-bold leading-none">4.98</span>
                  <div className="flex items-center gap-0.5 text-tertiary-container my-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="material-symbols-outlined text-[20px] fill">star</span>
                    ))}
                  </div>
                  <p className="font-label-sm text-label-sm text-on-surface-variant font-bold text-xs">142 Total Market Reviews</p>
                  <span className="font-label-sm text-label-sm text-secondary mt-1 text-xs">98% Recommendation Rate</span>
                </div>

                {/* Progress Bars Right */}
                <div className="md:col-span-8 flex flex-col gap-space-xs text-xs">
                  <div className="flex items-center gap-space-sm font-label-sm">
                    <span className="w-12 text-on-surface">5 stars</span>
                    <div className="flex-1 h-2.5 rounded-full bg-surface-container overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: '94%' }}></div>
                    </div>
                    <span className="w-10 text-right text-on-surface-variant">94%</span>
                  </div>
                  <div className="flex items-center gap-space-sm font-label-sm">
                    <span className="w-12 text-on-surface">4 stars</span>
                    <div className="flex-1 h-2.5 rounded-full bg-surface-container overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: '5%' }}></div>
                    </div>
                    <span className="w-10 text-right text-on-surface-variant">5%</span>
                  </div>
                  <div className="flex items-center gap-space-sm font-label-sm">
                    <span className="w-12 text-on-surface">3 stars</span>
                    <div className="flex-1 h-2.5 rounded-full bg-surface-container overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: '1%' }}></div>
                    </div>
                    <span className="w-10 text-right text-on-surface-variant">1%</span>
                  </div>
                  <div className="flex items-center gap-space-sm font-label-sm">
                    <span className="w-12 text-on-surface">2 stars</span>
                    <div className="flex-1 h-2.5 rounded-full bg-surface-container overflow-hidden">
                      <div className="h-full bg-surface-variant rounded-full" style={{ width: '0%' }}></div>
                    </div>
                    <span className="w-10 text-right text-on-surface-variant">0%</span>
                  </div>
                  <div className="flex items-center gap-space-sm font-label-sm">
                    <span className="w-12 text-on-surface">1 star</span>
                    <div className="flex-1 h-2.5 rounded-full bg-surface-container overflow-hidden">
                      <div className="h-full bg-surface-variant rounded-full" style={{ width: '0%' }}></div>
                    </div>
                    <span className="w-10 text-right text-on-surface-variant">0%</span>
                  </div>
                </div>
              </div>

              {/* Highlight Tags */}
              <div className="flex items-center gap-space-xs flex-wrap pb-space-lg mb-space-lg border-b border-outline-variant/20 text-xs">
                <span className="font-label-sm text-on-surface-variant mr-1">Shopper Mentions:</span>
                <span className="px-space-sm py-1 rounded-full bg-surface-container text-on-surface font-label-sm">🌿 Freshest Greens (88)</span>
                <span className="px-space-sm py-1 rounded-full bg-surface-container text-on-surface font-label-sm">🍅 Generous Bunches (64)</span>
                <span className="px-space-sm py-1 rounded-full bg-surface-container text-on-surface font-label-sm">🤝 Friendly Handshake (52)</span>
                <span className="px-space-sm py-1 rounded-full bg-surface-container text-on-surface font-label-sm">✨ Zero Bruising (41)</span>
              </div>

              {/* Review List */}
              <div className="flex flex-col gap-space-lg">
                {/* Review 1 */}
                <div className="flex flex-col gap-space-sm pb-space-md border-b border-surface-container">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-space-xs">
                        <span className="font-label-lg text-on-surface font-bold text-sm">Clara M.</span>
                        <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold">
                          Verified Saturday Shopper
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-tertiary-container mt-0.5">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="material-symbols-outlined text-[16px] fill">star</span>
                        ))}
                        <span className="font-label-sm text-on-surface-variant ml-2 text-xs">2 weeks ago</span>
                      </div>
                    </div>
                  </div>
                  <p className="font-body-md text-on-surface leading-relaxed text-xs">
                    "Martha's Brandywine tomatoes taste like real summer sunshine. Reserving ahead meant I didn't have to stress about waking up at 7am to get them before they sold out! Picked my box right at Stall #4, handed my cash, and was back home making gazpacho in no time."
                  </p>
                  {/* Farmer Reply */}
                  <div className="ml-space-md md:ml-space-xl p-space-md bg-surface-container-low rounded-xl relative flex flex-col gap-1 border border-outline-variant/20">
                    <div className="flex items-center gap-space-xs">
                      <span className="material-symbols-outlined text-primary text-[18px]">subdirectory_arrow_right</span>
                      <span className="font-label-md text-primary font-bold text-xs">Martha &amp; Joe Miller (Green Pastures Organic)</span>
                      <span className="text-xs text-on-surface-variant font-label-sm">Grower Reply</span>
                    </div>
                    <p className="font-body-sm text-on-surface-variant pl-6 leading-relaxed text-xs">
                      "Thank you so much Clara! We pick them right when the skin gives a gentle give on Friday afternoon so they are peak sweetness for your table. Save us some of that gazpacho next Saturday!"
                    </p>
                  </div>
                </div>

                {/* Review 2 */}
                <div className="flex flex-col gap-space-sm pb-space-md border-b border-surface-container">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-space-xs">
                        <span className="font-label-lg text-on-surface font-bold text-sm">David K.</span>
                        <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold">
                          Oak Valley Regular
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-tertiary-container mt-0.5">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="material-symbols-outlined text-[16px] fill">star</span>
                        ))}
                        <span className="font-label-sm text-on-surface-variant ml-2 text-xs">1 month ago</span>
                      </div>
                    </div>
                  </div>
                  <p className="font-body-md text-on-surface leading-relaxed text-xs">
                    "The microgreens and rainbow chard stayed crisp in my crisper drawer for almost 10 full days. Unbeatable freshness compared to grocery stores. Love that Joe takes the time to explain how they practice compost crop rotation."
                  </p>
                  {/* Farmer Reply */}
                  <div className="ml-space-md md:ml-space-xl p-space-md bg-surface-container-low rounded-xl relative flex flex-col gap-1 border border-outline-variant/20">
                    <div className="flex items-center gap-space-xs">
                      <span className="material-symbols-outlined text-primary text-[18px]">subdirectory_arrow_right</span>
                      <span className="font-label-md text-primary font-bold text-xs">Martha &amp; Joe Miller (Green Pastures Organic)</span>
                      <span className="text-xs text-on-surface-variant font-label-sm">Grower Reply</span>
                    </div>
                    <p className="font-body-sm text-on-surface-variant pl-6 leading-relaxed text-xs">
                      "That's the beauty of zero cold-storage transit, David! Harvested just hours before market. Thank you for championing our regenerative soil efforts."
                    </p>
                  </div>
                </div>

                {/* Review 3 */}
                <div className="flex flex-col gap-space-sm">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-space-xs">
                        <span className="font-label-lg text-on-surface font-bold text-sm">Samantha T.</span>
                        <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant text-xs font-bold">
                          Verified Shopper
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-tertiary-container mt-0.5">
                        {[...Array(4)].map((_, i) => (
                          <span key={i} className="material-symbols-outlined text-[16px] fill">star</span>
                        ))}
                        <span className="material-symbols-outlined text-[16px] text-outline-variant">star</span>
                        <span className="font-label-sm text-on-surface-variant ml-2 text-xs">1 month ago</span>
                      </div>
                    </div>
                  </div>
                  <p className="font-body-md text-on-surface leading-relaxed text-xs">
                    "Love everything here. Just make sure to get your order in before Friday 6pm cut-off because they do strictly pack based on reservations to eliminate food waste. Can't wait for melon season."
                  </p>
                </div>
              </div>
            </section>
          </main>

          {/* Right Sidebar (4 cols) */}
          <aside className="lg:col-span-4 flex flex-col gap-space-lg sticky top-24">
            {/* Card A: Stall Location & Directions */}
            <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-outline-variant/30">
              <div className="flex items-center gap-space-xs mb-space-sm">
                <span className="material-symbols-outlined text-primary text-[22px]">pin_drop</span>
                <h3 className="font-headline-sm text-on-surface font-semibold text-base">Stall Location</h3>
              </div>
              <div
                className="w-full h-44 rounded-lg bg-cover bg-center overflow-hidden mb-space-sm relative shadow-inner"
                style={{
                  backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDHs_48b0JRNCR7FgbiCwJcTZhZXrENz63AKqCm8MRQ7wna6FYEzEaFGq585_XR2-ctrwligUTejcYOOAH589S5KTyh5zxh51gX3vukP4pLE2_lTfe60X_E1ikZtiC6-eX4_Fqb-GgzySW8M-eB2Wswoz3V-2s_VSPMcPg9Y9obA9u-Evp1fHkS-9pO9p93iET1A-1VFoQTHAfBl1GamTfZnb15HKFa6bBvNiJD765nBua0LlYMDJJJ')`
                }}
              >
                <div className="absolute inset-0 bg-primary/10 flex items-center justify-center pointer-events-none">
                  <div className="bg-primary text-on-primary px-space-sm py-1 rounded-full shadow-lg flex items-center gap-1 font-label-sm text-xs font-bold">
                    <span className="material-symbols-outlined text-[16px]">storefront</span>
                    Stall #4 (North Arch)
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1 mb-space-md text-xs">
                <p className="font-label-md text-on-surface font-bold">Pioneer Pavilion - Downtown Historic Market</p>
                <p className="font-body-sm text-on-surface-variant">120 Market Square, Central Plaza (North Arch entrance, Aisle B, Stall #4)</p>
                <div className="flex items-center gap-space-xs text-xs font-label-sm text-primary mt-1">
                  <span className="material-symbols-outlined text-[16px]">schedule</span>
                  Saturday: 8:00 AM – 1:00 PM (Pickups held until 11:30 AM)
                </div>
              </div>

              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-space-xs rounded-full bg-primary hover:bg-primary-container text-on-primary font-label-md transition-colors flex items-center justify-center gap-1.5 shadow-sm text-xs cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">directions</span>
                Get Stall Directions
              </a>
            </div>

            {/* Card B: Stall Pickup Guarantee & Policies */}
            <div className="bg-surface-container-low rounded-xl p-space-md flex flex-col gap-space-md border border-outline-variant/30">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-tertiary-container text-[22px]">verified_user</span>
                <h3 className="font-headline-sm text-on-surface font-semibold text-base">Pickup &amp; Payment Guarantees</h3>
              </div>

              <ul className="flex flex-col gap-space-sm text-xs">
                <li className="flex items-start gap-space-xs">
                  <span className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5">payments</span>
                  <div>
                    <p className="font-label-md text-on-surface font-bold">100% In-Person Payment</p>
                    <p className="font-body-sm text-on-surface-variant">Pay Martha &amp; Joe directly at Stall #4. Cash, chip cards, or local Market SNAP/EBT tokens accepted. Zero online card fees.</p>
                  </div>
                </li>
                <li className="flex items-start gap-space-xs">
                  <span className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5">lock_clock</span>
                  <div>
                    <p className="font-label-md text-on-surface font-bold">Guaranteed Reserve Hold</p>
                    <p className="font-body-sm text-on-surface-variant">Orders are labeled with your name and placed in shaded produce coolers until 11:30 AM on market day.</p>
                  </div>
                </li>
                <li className="flex items-start gap-space-xs">
                  <span className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5">recycling</span>
                  <div>
                    <p className="font-label-md text-on-surface font-bold">Zero Plastic Packaging Pledge</p>
                    <p className="font-body-sm text-on-surface-variant">Packed in compostable plant starch or wooden crates. Bring your own canvas tote for $0.50 off your order total!</p>
                  </div>
                </li>
              </ul>

              <div className="p-space-sm bg-surface-container-lowest rounded-lg flex items-center justify-between text-xs border border-outline-variant/30">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-tertiary text-[20px]">help_center</span>
                  <span className="font-label-sm text-on-surface">Questions for the Miller family?</span>
                </div>
                <button
                  type="button"
                  onClick={() => alert('Message prompt opened for Green Pastures Organic!')}
                  className="font-label-sm text-primary hover:underline font-bold cursor-pointer"
                >
                  Ask Stall
                </button>
              </div>
            </div>

            {/* Card C: Farmer Practices & Certifications */}
            <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-outline-variant/30">
              <div className="flex items-center gap-space-xs mb-space-sm">
                <span className="material-symbols-outlined text-secondary text-[22px]">psychiatry</span>
                <h3 className="font-headline-sm text-on-surface font-semibold text-base">Growing Practices</h3>
              </div>
              <div className="flex flex-col gap-space-sm text-xs">
                <div className="flex items-center justify-between py-1 border-b border-surface-container">
                  <span className="text-on-surface-variant">Certification:</span>
                  <span className="font-bold text-primary">USDA Organic #OR-9942</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-surface-container">
                  <span className="text-on-surface-variant">Irrigation:</span>
                  <span className="font-bold text-on-surface">100% Deep Well Water</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-surface-container">
                  <span className="text-on-surface-variant">Pest Management:</span>
                  <span className="font-bold text-on-surface">Companion Planting &amp; Wasps</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-surface-container">
                  <span className="text-on-surface-variant">Seed Source:</span>
                  <span className="font-bold text-on-surface">100% Non-GMO &amp; Heirloom</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-on-surface-variant">Pollinator Habitats:</span>
                  <span className="font-bold text-secondary">Certified Bee-Friendly Zone</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
