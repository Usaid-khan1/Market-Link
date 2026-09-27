import React, { useState, useEffect } from 'react';
import browseApi from '../api/browse';
import customerApi from '../api/customer';
import { useAuth } from '../context/AuthContext';
import PageLoader from './PageLoader';

export default function FarmerProfile({ farmerId = 2, onNavigate, onReserveProduct, onNotifyProduct }) {
  const { isAuthenticated } = useAuth();
  const [activeCategory, setActiveCategory] = useState('all');
  const [isFavorited, setIsFavorited] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState(89);
  const [liveFarmer, setLiveFarmer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    browseApi.getFarmer(farmerId || 2).then((res) => {
      if (mounted && res.data) {
        setLiveFarmer(res.data);
      }
    }).catch((err) => {
      console.warn("Could not load farmer profile:", err);
    }).finally(() => {
      if (mounted) setLoading(false);
    });
    return () => { mounted = false; };
  }, [farmerId]);
  const [quantities, setQuantities] = useState({});

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

  if (loading) {
    return (
      <PageLoader
        title="Loading Producer Profile..."
        subtitle="Connecting directly to the farm field & fresh harvest stock..."
      />
    );
  }

  if (!liveFarmer) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
          <span className="material-symbols-outlined text-4xl">person_off</span>
        </div>
        <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100 mb-2">Farmer Profile Not Found</h2>
        <p className="text-neutral-500 dark:text-neutral-400 mb-8 max-w-md mx-auto">
          This producer profile may have moved or is temporarily unavailable. Browse other registered farmers in our directory.
        </p>
        <button
          onClick={() => onNavigate('markets')}
          className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-medium shadow-md transition-all cursor-pointer"
        >
          Explore Verified Markets
        </button>
      </div>
    );
  }

  const farmProfile = liveFarmer?.farmer_profile || liveFarmer?.farmerProfile || {};
  const farmName = farmProfile.farm_name || liveFarmer?.name || 'Local Farm';
  const farmerName = liveFarmer?.name || 'Local Producer';
  const bio = farmProfile.bio || 'Local sustainable grower committed to fresh, organic harvests delivered straight from field to market.';
  const farmCity = farmProfile.city || farmProfile.address || 'Regional Agricultural Haven';
  const farmAcreage = farmProfile.acreage ? `${farmProfile.acreage} Regenerative Acres` : 'Verified Farmstead';
  const stallNumber = farmProfile.stall_number ? `Stall #${farmProfile.stall_number}` : 'Pavilion Stall';
  const stallLocation = farmProfile.address || 'Market Pavilion';
  const ratingAvg = liveFarmer.rating_avg || 5.0;
  const reviewsCount = liveFarmer.reviews_count || 0;
  const reviewsList = liveFarmer.reviews || [];
  const rawProducts = liveFarmer?.products || [];

  const harvestItems = rawProducts.map((p) => {
    const isAvail = p.status === 'available';
    const isLow = isAvail && p.stock_quantity !== undefined && p.stock_quantity <= 4;
    return {
      id: p.id,
      category: (p.category?.name || p.category || 'all').toLowerCase(),
      categoryName: p.category?.name || p.category || 'Produce',
      name: p.name,
      price: parseFloat(p.price || 0),
      unit: p.unit || 'unit',
      status: isAvail ? (isLow ? 'LOW_STOCK' : 'IN_STOCK') : 'SOLD_OUT',
      badge: isAvail ? (isLow ? `LOW STOCK (${p.stock_quantity} left)` : 'IN STOCK') : 'SOLD OUT',
      badgeClass: isAvail ? (isLow ? 'bg-amber-100 text-amber-800' : 'bg-secondary-container text-on-secondary-container') : 'bg-surface-variant text-on-surface-variant',
      harvestTime: 'Harvested Today',
      desc: p.description || 'Grown with care, picked fresh for market day reservation.',
      image: p.image_url || p.image || 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=600&q=80',
      alt: p.name,
      rawProduct: p
    };
  });

  const uniqueCategories = [
    { id: 'all', label: `All Harvest (${harvestItems.length})` },
    ...Array.from(new Set(harvestItems.map((i) => i.category))).filter(Boolean).map((cat) => ({
      id: cat,
      label: cat.charAt(0).toUpperCase() + cat.slice(1)
    }))
  ];

  const filteredHarvest = harvestItems.filter((item) => {
    if (activeCategory === 'all') return true;
    return item.category === activeCategory;
  });

  return (
    <div className="flex flex-col w-full">
      {/* Top Breadcrumb & Quick Anchor Bar */}
      <section className="w-full bg-surface-container-low py-space-sm px-3 sm:px-6 lg:px-gutter border-b border-outline-variant/30">
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
              {stallLocation}
            </button>
            <span className="text-outline-variant">/</span>
            <span className="text-primary font-bold">{farmName}</span>
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
      <section className="w-full bg-surface-container px-3 sm:px-6 lg:px-gutter py-space-xs border-b border-outline-variant/30">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-space-sm">
          <div className="flex items-center gap-space-sm">
            <span className="flex h-2.5 w-2.5 rounded-full bg-tertiary-container animate-pulse"></span>
            <p className="font-label-md text-label-md text-tertiary text-xs">
              <strong>Order Cut-Off:</strong> Friday at 6:00 PM for weekend pickup. Orders reserved online are freshly harvested at dawn!
            </p>
          </div>
          <span className="font-label-sm text-label-sm text-on-surface-variant hidden lg:inline text-xs">
            Next Harvest Date: Peak Morning Harvest
          </span>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-gutter py-4 sm:py-space-lg w-full">
        {/* Farmer Header Hero Banner */}
        <header className="bg-surface-container-lowest rounded-xl shadow-md overflow-hidden relative mb-space-xl border border-outline-variant/30">
          {/* Background Ambient Cover Image with Scrim */}
          <div className="relative min-h-[280px] sm:h-64 md:h-80 w-full overflow-hidden">
            <div
              className="w-full h-full bg-cover bg-center"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1400&q=80')`
              }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent"></div>

            {/* Floating Badges Top Right */}
            <div className="absolute top-space-md right-space-md hidden sm:flex flex-wrap items-center gap-space-xs">
              <span className="inline-flex items-center gap-1.5 px-space-md py-space-xs rounded-full bg-surface-container-lowest/95 text-primary font-label-sm text-label-sm shadow-sm backdrop-blur-md text-xs">
                <span className="material-symbols-outlined text-[16px] text-primary fill">eco</span>
                Verified Organic Grower
              </span>
              <span className="inline-flex items-center gap-1.5 px-space-md py-space-xs rounded-full bg-surface-container-lowest/95 text-secondary font-label-sm text-label-sm shadow-sm backdrop-blur-md text-xs">
                <span className="material-symbols-outlined text-[16px] text-secondary fill">nature_people</span>
                Fresh Field Direct
              </span>
            </div>

            {/* Farmer Banner Content Inside Scrim */}
            <div className="absolute bottom-3 left-3 right-3 sm:bottom-space-md sm:left-space-md sm:right-space-md flex flex-col md:flex-row items-start md:items-end justify-between gap-3 sm:gap-space-md">
              <div className="flex items-end gap-3 sm:gap-space-md">
                <div className="w-16 h-16 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-xl bg-surface-container-lowest shadow-xl overflow-hidden shrink-0 border-2 border-white">
                  <img
                    alt={farmerName}
                    className="w-full h-full object-cover"
                    src="https://images.unsplash.com/photo-1544717302-de2939b7ef71?auto=format&fit=crop&w=300&q=80"
                  />
                </div>
                <div className="text-on-primary min-w-0">
                  <div className="flex items-center gap-space-xs flex-wrap mb-1">
                    <span className="px-space-xs py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm text-[10px] sm:text-xs font-bold">
                      {stallNumber}
                    </span>
                    <span className="px-space-xs py-0.5 rounded-full bg-surface/20 text-on-primary font-label-sm text-label-sm backdrop-blur-sm text-[10px] sm:text-xs">
                      {stallLocation}
                    </span>
                  </div>
                  <h1 className="font-headline-lg text-lg sm:text-2xl md:text-headline-lg text-on-primary leading-tight font-bold drop-shadow-sm truncate">
                    {farmName}
                  </h1>
                  <p className="font-body-md text-xs sm:text-sm text-surface-container-high truncate">
                    {farmerName} <span className="opacity-80 font-normal hidden sm:inline">(Local Produce Grower)</span>
                  </p>
                </div>
              </div>

              {/* Quick Stat Badge / Rating */}
              <div className="flex items-center gap-space-md bg-surface-container-lowest/90 backdrop-blur-md px-3 sm:px-space-md py-2 sm:py-space-sm rounded-lg shadow-sm">
                <div className="flex flex-col items-center">
                  <div className="flex items-center text-tertiary font-bold text-headline-sm font-headline-sm leading-none">
                    <span className="material-symbols-outlined text-[22px] text-tertiary-container mr-1 fill">star</span>
                    {ratingAvg}
                  </div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant text-xs">{reviewsCount} reviews</span>
                </div>
                <div className="w-px h-8 bg-surface-variant"></div>
                <div className="flex flex-col">
                  <span className="font-label-md text-label-md text-primary font-bold text-xs">{farmCity}</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant text-xs">{farmAcreage}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action & Schedule Bar Below Banner Image */}
          <div className="p-space-md md:p-space-lg bg-surface-container-lowest flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
            <div className="max-w-2xl">
              <p className="font-body-md text-body-md text-on-surface leading-relaxed text-sm">
                {bio}
              </p>
              <div className="flex items-center gap-space-md mt-space-sm flex-wrap text-label-sm font-label-sm text-on-surface-variant text-xs">
                <span className="inline-flex items-center gap-1 text-primary">
                  <span className="material-symbols-outlined text-[16px]">schedule</span>
                  Pickups available at {stallNumber}
                </span>
                <span>•</span>
                <span className="inline-flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">storefront</span>
                  {stallLocation}
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
              <div className="flex flex-wrap items-center gap-2 pb-1" id="category-filter-bar">
                {uniqueCategories.map((chip) => {
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
                {filteredHarvest.length === 0 ? (
                  <div className="col-span-full py-16 px-4 text-center rounded-2xl bg-surface-container-low/50 border border-dashed border-outline-variant/40">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant">
                      <span className="material-symbols-outlined text-3xl">eco</span>
                    </div>
                    <h3 className="font-headline-sm text-base font-semibold text-on-surface mb-1">No Produce in this Selection</h3>
                    <p className="font-body-sm text-xs text-on-surface-variant max-w-sm mx-auto mb-4">
                      {farmName} currently has no harvested items listed under this category for upcoming market day reservations.
                    </p>
                    {activeCategory !== 'all' && (
                      <button
                        onClick={() => setActiveCategory('all')}
                        className="px-4 py-1.5 rounded-full bg-primary text-on-primary text-xs font-medium cursor-pointer"
                      >
                        View All Produce
                      </button>
                    )}
                  </div>
                ) : (
                  filteredHarvest.map((item) => {
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
                              <span className="font-label-sm text-label-sm text-primary font-bold text-xs">{farmName}</span>
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
                                  farm: farmName,
                                  market: `${stallLocation} (${stallNumber})`,
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
                  })
                )}
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
                  onClick={() => alert(`Review form opened for ${farmName}!`)}
                  className="px-space-md py-space-xs rounded-full bg-primary text-on-primary hover:bg-primary-container font-label-md text-label-md transition-colors shrink-0 text-xs cursor-pointer"
                >
                  Write a Review
                </button>
              </div>

              {/* Rating Breakdown Bento */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-space-lg py-space-lg items-center">
                {/* Big Score Left */}
                <div className="md:col-span-4 flex flex-col items-center justify-center p-space-md bg-surface-container-low rounded-xl text-center border border-outline-variant/20">
                  <span className="font-display-lg text-display-lg text-primary font-bold leading-none">{ratingAvg}</span>
                  <div className="flex items-center gap-0.5 text-tertiary-container my-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="material-symbols-outlined text-[20px] fill">star</span>
                    ))}
                  </div>
                  <p className="font-label-sm text-label-sm text-on-surface-variant font-bold text-xs">{reviewsCount} Total Market Reviews</p>
                  <span className="font-label-sm text-label-sm text-secondary mt-1 text-xs">Community Verified</span>
                </div>

                {/* Progress Bars Right */}
                <div className="md:col-span-8 flex flex-col gap-space-xs text-xs">
                  <div className="flex items-center gap-space-sm font-label-sm">
                    <span className="w-12 text-on-surface">5 stars</span>
                    <div className="flex-1 h-2.5 rounded-full bg-surface-container overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: '90%' }}></div>
                    </div>
                    <span className="w-10 text-right text-on-surface-variant">90%</span>
                  </div>
                  <div className="flex items-center gap-space-sm font-label-sm">
                    <span className="w-12 text-on-surface">4 stars</span>
                    <div className="flex-1 h-2.5 rounded-full bg-surface-container overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: '10%' }}></div>
                    </div>
                    <span className="w-10 text-right text-on-surface-variant">10%</span>
                  </div>
                </div>
              </div>

              {/* Review List */}
              <div className="flex flex-col gap-space-lg">
                {reviewsList.length === 0 ? (
                  <div className="py-12 px-4 text-center rounded-xl bg-surface-container-low/40 border border-dashed border-outline-variant/30 my-4">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant">
                      <span className="material-symbols-outlined text-2xl text-amber-500">rate_review</span>
                    </div>
                    <h4 className="font-bold text-sm text-on-surface mb-1">No Reviews Yet</h4>
                    <p className="text-xs text-on-surface-variant max-w-sm mx-auto">
                      Be the first customer to visit {farmName} at {stallNumber} and leave a review after your harvest pickup!
                    </p>
                  </div>
                ) : (
                  reviewsList.map((rev) => (
                    <div key={rev.id} className="flex flex-col gap-space-sm pb-space-md border-b border-surface-container">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-space-xs">
                            <span className="font-label-lg text-on-surface font-bold text-sm">{rev.customer?.name || 'Verified Shopper'}</span>
                            <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold">
                              Verified Shopper
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-tertiary-container mt-0.5">
                            {[...Array(rev.rating || 5)].map((_, i) => (
                              <span key={i} className="material-symbols-outlined text-[16px] fill">star</span>
                            ))}
                            <span className="font-label-sm text-on-surface-variant ml-2 text-xs">Recently</span>
                          </div>
                        </div>
                      </div>
                      <p className="font-body-md text-on-surface leading-relaxed text-xs">
                        "{rev.comment || 'Great produce and exceptional service at the stall.'}"
                      </p>
                      {rev.farmer_reply && (
                        <div className="ml-space-md md:ml-space-xl p-space-md bg-surface-container-low rounded-xl relative flex flex-col gap-1 border border-outline-variant/20">
                          <div className="flex items-center gap-space-xs">
                            <span className="material-symbols-outlined text-primary text-[18px]">subdirectory_arrow_right</span>
                            <span className="font-label-md text-primary font-bold text-xs">{farmName}</span>
                            <span className="text-xs text-on-surface-variant font-label-sm">Grower Reply</span>
                          </div>
                          <p className="font-body-sm text-on-surface-variant pl-6 leading-relaxed text-xs">
                            "{rev.farmer_reply}"
                          </p>
                        </div>
                      )}
                    </div>
                  ))
                )}
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
                  backgroundImage: `url('https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=600&q=80')`
                }}
              >
                <div className="absolute inset-0 bg-primary/10 flex items-center justify-center pointer-events-none">
                  <div className="bg-primary text-on-primary px-space-sm py-1 rounded-full shadow-lg flex items-center gap-1 font-label-sm text-xs font-bold">
                    <span className="material-symbols-outlined text-[16px]">storefront</span>
                    {stallNumber}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1 mb-space-md text-xs">
                <p className="font-label-md text-on-surface font-bold">{stallLocation}</p>
                <p className="font-body-sm text-on-surface-variant">Located at {stallNumber}. Direct field harvest pickup point.</p>
                <div className="flex items-center gap-space-xs text-xs font-label-sm text-primary mt-1">
                  <span className="material-symbols-outlined text-[16px]">schedule</span>
                  Open on scheduled market days
                </div>
              </div>

              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(stallLocation)}`}
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
                    <p className="font-body-sm text-on-surface-variant">Pay {farmerName} directly at {stallNumber}. Cash, cards, or mobile pay accepted. Zero online fees.</p>
                  </div>
                </li>
                <li className="flex items-start gap-space-xs">
                  <span className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5">lock_clock</span>
                  <div>
                    <p className="font-label-md text-on-surface font-bold">Guaranteed Reserve Hold</p>
                    <p className="font-body-sm text-on-surface-variant">Pre-reserved orders are packed with your name and safely held at the stall on market day.</p>
                  </div>
                </li>
                <li className="flex items-start gap-space-xs">
                  <span className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5">recycling</span>
                  <div>
                    <p className="font-label-md text-on-surface font-bold">Eco-Friendly Packaging</p>
                    <p className="font-body-sm text-on-surface-variant">Packed in recyclable crates and paper cartons to minimize agricultural footprint.</p>
                  </div>
                </li>
              </ul>

              <div className="p-space-sm bg-surface-container-lowest rounded-lg flex items-center justify-between text-xs border border-outline-variant/30">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-tertiary text-[20px]">help_center</span>
                  <span className="font-label-sm text-on-surface">Questions for {farmerName}?</span>
                </div>
                <button
                  type="button"
                  onClick={() => alert(`Direct inquiry message prompt for ${farmName}`)}
                  className="font-label-sm text-primary hover:underline font-bold cursor-pointer"
                >
                  Ask Stall
                </button>
              </div>
            </div>

            {/* Card C: Farmer Practices & Certifications */}
            <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-outline-variant/30">
              <div className="flex items-center gap-space-xs mb-space-sm">
                <span className="material-symbols-outlined text-secondary text-[22px]">eco</span>
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
