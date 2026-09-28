import React, { useState, useEffect } from 'react';
import customerApi from '../api/customer';
import PageLoader from './PageLoader';

export default function CustomerFavorites({ onNavigate, showToast, onAddToCart }) {
  const [activeTab, setActiveTab] = useState('farmers'); // 'farmers' | 'products'
  const [loading, setLoading] = useState(true);

  // Farmers Dataset
  const [favoriteFarmers, setFavoriteFarmers] = useState([]);

  // Products Dataset
  const [favoriteProducts, setFavoriteProducts] = useState([]);

  // Load live favorites from backend API
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    customerApi.getFavorites()
      .then((res) => {
        if (!isMounted) return;
        if (!res?.data || !Array.isArray(res.data)) {
          setFavoriteFarmers([]);
          setFavoriteProducts([]);
          return;
        }
        
        const liveFarmers = [];
        const liveProducts = [];

        res.data.forEach((fav) => {
          if (fav.type === 'farmer' && fav.target) {
            liveFarmers.push({
              id: fav.target.id,
              targetId: fav.target.id,
              favId: fav.id,
              name: fav.target.stall_name || fav.target.name || 'Local Farmer',
              specialty: fav.target.stall_name ? 'Local Farm Producer' : 'Artisan Grower',
              market: fav.target.address || 'Market Pavilion',
              location: fav.target.address || 'Local Region',
              rating: 4.9,
              reviewCount: 48,
              verified: fav.target.status === 'approved',
              image: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=600&q=80',
              tags: ['Verified Farmer', 'Direct Harvest'],
              featuredHarvest: 'Fresh Farm Goods'
            });
          } else if (fav.type === 'product' && fav.target) {
            liveProducts.push({
              id: fav.target.id,
              targetId: fav.target.id,
              favId: fav.id,
              name: fav.target.name,
              farmer: fav.target.stall_name || fav.target.farmer_name || 'Local Farmer',
              stall: fav.target.stall_name || 'Stall',
              price: `$${fav.target.price?.toFixed(2) || '0.00'}`,
              unit: fav.target.unit ? `/ ${fav.target.unit}` : '',
              availability: fav.target.stock_quantity > 0 ? 'Available' : 'Sold Out',
              badgeStatus: fav.target.status,
              isBackInStock: fav.target.stock_quantity > 0,
              rating: 5.0,
              image: fav.target.image || 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=500&q=80',
              stockRemaining: `${fav.target.stock_quantity} left`
            });
          }
        });

        setFavoriteFarmers(liveFarmers);
        setFavoriteProducts(liveProducts);
      })
      .catch((err) => {
        console.warn('Could not load favorites from API:', err);
        if (isMounted) {
          setFavoriteFarmers([]);
          setFavoriteProducts([]);
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, []);

  // Remove Favorite Farmer
  const handleRemoveFarmer = async (farmerId, name) => {
    const farmer = favoriteFarmers.find(f => f.id === farmerId);
    setFavoriteFarmers(prev => prev.filter(f => f.id !== farmerId));
    if (showToast) {
      showToast(`Removed "${name}" from your favorite farmers.`);
    }
    try {
      const targetId = farmer?.targetId || (typeof farmerId === 'number' ? farmerId : parseInt(String(farmerId).replace(/\D/g, ''), 10) || 2);
      await customerApi.toggleFavorite('farmer', targetId);
    } catch (err) {
      console.warn('API error toggling farmer favorite:', err);
    }
  };

  // Remove Favorite Product
  const handleRemoveProduct = async (productId, name) => {
    const prod = favoriteProducts.find(p => p.id === productId);
    setFavoriteProducts(prev => prev.filter(p => p.id !== productId));
    if (showToast) {
      showToast(`Removed "${name}" from saved items.`);
    }
    try {
      const targetId = prod?.targetId || (typeof productId === 'number' ? productId : parseInt(String(productId).replace(/\D/g, ''), 10) || 1);
      await customerApi.toggleFavorite('product', targetId);
    } catch (err) {
      console.warn('API error toggling product favorite:', err);
    }
  };

  const handleAddToCartClick = (prod) => {
    if (onAddToCart) {
      onAddToCart(prod);
    }
    if (showToast) {
      showToast(`🧺 Added 1 ${prod.name} to your pre-order cart!`);
    }
  };

  if (loading) {
    return (
      <PageLoader
        title="Loading Your Saved Favorites..."
        subtitle="Retrieving preferred local farms and starred seasonal produce..."
        minHeight="min-h-[70vh]"
      />
    );
  }

  return (
    <div className="px-3 sm:px-6 lg:px-gutter py-4 sm:py-space-lg max-w-7xl mx-auto w-full space-y-6 animate-fade-in pb-12">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-outline-variant/40 pb-5">
        <div>
          <h1 className="font-headline-md text-2xl sm:text-3xl text-on-surface font-bold tracking-tight">
            Favorites & Saved Growers
          </h1>
          <p className="font-body-md text-sm text-on-surface-variant mt-1">
            Keep track of your most cherished regional growers and seasonal harvests ready for pre-order.
          </p>
        </div>

        {/* Segmented Control Tabs */}
        <div className="flex flex-wrap sm:flex-nowrap items-center bg-surface-container-low p-1 rounded-xl border border-outline-variant/40 w-full sm:w-auto gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('farmers')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'farmers'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[17px] sm:text-[18px]">agriculture</span>
            <span>Favorite Farmers ({favoriteFarmers.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('products')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'products'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[17px] sm:text-[18px]">nutrition</span>
            <span>Saved Products ({favoriteProducts.length})</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: FAVORITE FARMERS                                  */}
      {/* ======================================================== */}
      {activeTab === 'farmers' && (
        <div>
          {favoriteFarmers.length === 0 ? (
            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-12 text-center max-w-xl mx-auto">
              <div className="w-16 h-16 rounded-full bg-[#E6F0E1] text-primary flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-3xl">favorite_border</span>
              </div>
              <h3 className="font-headline-sm text-lg font-bold text-on-surface mb-1">
                No favorite farmers yet
              </h3>
              <p className="text-xs text-on-surface-variant mb-5">
                Browse our directory of verified local growers and click the heart icon to stay updated on their weekly harvests.
              </p>
              <button
                type="button"
                onClick={() => onNavigate && onNavigate('markets')}
                className="px-5 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold shadow-md hover:bg-primary/95 cursor-pointer"
              >
                Explore Regional Markets
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {favoriteFarmers.map((farmer) => (
                <div
                  key={farmer.id}
                  className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Top Image + Quick Actions */}
                    <div className="relative h-44 overflow-hidden">
                      <img
                        src={farmer.image}
                        alt={farmer.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

                      {/* Remove Favorite Heart Button */}
                      <button
                        type="button"
                        onClick={() => handleRemoveFarmer(farmer.id, farmer.name)}
                        className="absolute top-3 right-3 w-9 h-9 rounded-full bg-surface/90 backdrop-blur-md text-[#F28C28] hover:bg-surface flex items-center justify-center shadow-md transition-all cursor-pointer group-hover:scale-110"
                        title="Remove from favorites"
                      >
                        <span className="material-symbols-outlined text-[20px] fill-current">favorite</span>
                      </button>

                      {/* Market Stall Badge on Image */}
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                        <span className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-[11px] font-bold flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[15px] text-[#8BC34A]">storefront</span>
                          <span>{farmer.market}</span>
                        </span>
                        <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md text-[11px] font-bold text-amber-300">
                          <span className="material-symbols-outlined text-[14px]">star</span>
                          <span>{farmer.rating}</span>
                          <span className="text-white/70">({farmer.reviewCount})</span>
                        </div>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-5 space-y-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-headline-sm text-lg font-bold text-on-surface">
                            {farmer.name}
                          </h3>
                          {farmer.verified && (
                            <span className="material-symbols-outlined text-primary text-[18px]" title="MarketLink Verified Grower">
                              verified
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-semibold text-primary mt-0.5">
                          {farmer.specialty}
                        </p>
                        <p className="text-[11px] text-on-surface-variant flex items-center gap-1 mt-1">
                          <span className="material-symbols-outlined text-[14px]">location_on</span>
                          <span>{farmer.location}</span>
                        </p>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {farmer.tags.map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-2 py-0.5 rounded-md bg-surface-container text-on-surface-variant text-[10px] font-semibold"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Featured Harvest Note */}
                      <div className="p-2.5 rounded-xl bg-[#E6F0E1]/60 border border-primary/20 text-xs text-on-surface flex items-start gap-2">
                        <span className="material-symbols-outlined text-primary text-[16px] shrink-0 mt-0.5">spa</span>
                        <p className="text-[11px]">
                          <strong>Staged this week:</strong> {farmer.featuredHarvest}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer Action */}
                  <div className="p-5 pt-0">
                    <button
                      type="button"
                      onClick={() => onNavigate && onNavigate('farmer-profile')}
                      className="w-full py-2.5 rounded-xl bg-primary hover:bg-primary/95 text-on-primary text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[17px]">storefront</span>
                      <span>Visit Stall Profile</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: SAVED PRODUCTS                                    */}
      {/* ======================================================== */}
      {activeTab === 'products' && (
        <div>
          {favoriteProducts.length === 0 ? (
            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-12 text-center max-w-xl mx-auto">
              <div className="w-16 h-16 rounded-full bg-[#E6F0E1] text-primary flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-3xl">shopping_basket</span>
              </div>
              <h3 className="font-headline-sm text-lg font-bold text-on-surface mb-1">
                No favorite products yet
              </h3>
              <p className="text-xs text-on-surface-variant mb-5">
                Explore fresh seasonal produce, baked artisan bread, and fresh cider. Click the heart icon on any product to save it here for quick pre-orders.
              </p>
              <button
                type="button"
                onClick={() => onNavigate && onNavigate('products')}
                className="px-5 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold shadow-md hover:bg-primary/95 cursor-pointer"
              >
                Browse Harvest Catalog
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {favoriteProducts.map((prod) => (
                <div
                  key={prod.id}
                  className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group relative"
                >
                  <div>
                    {/* Product Image */}
                    <div className="relative h-44 overflow-hidden bg-surface-container-low">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />

                      {/* Remove Favorite Heart Button */}
                      <button
                        type="button"
                        onClick={() => handleRemoveProduct(prod.id, prod.name)}
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-surface/90 backdrop-blur-md text-[#F28C28] hover:bg-surface flex items-center justify-center shadow-md transition-all cursor-pointer group-hover:scale-110"
                        title="Remove from favorites"
                      >
                        <span className="material-symbols-outlined text-[18px] fill-current">favorite</span>
                      </button>

                      {/* SPECIAL REQUIREMENT: "Back in stock" badge on items that were previously sold out! */}
                      {prod.isBackInStock && (
                        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#ecfccb] text-[#3f6212] border border-lime-400 font-bold text-[10px] uppercase tracking-wider flex items-center gap-1 shadow-sm">
                          <span className="material-symbols-outlined text-[13px]">refresh</span>
                          <span>Back in Stock!</span>
                        </div>
                      )}

                      {/* Availability strip */}
                      <div className="absolute bottom-2 left-2 right-2">
                        <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-white text-[10px] font-semibold flex items-center gap-1 w-max">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#8BC34A]"></span>
                          {prod.availability}
                        </span>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="p-4 space-y-2.5">
                      <div>
                        <span className="text-[11px] text-on-surface-variant font-medium flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px] text-primary">storefront</span>
                          <span className="truncate">{prod.farmer} • {prod.stall}</span>
                        </span>
                        <h3 className="font-headline-sm text-sm sm:text-base font-bold text-on-surface line-clamp-1 mt-0.5">
                          {prod.name}
                        </h3>
                      </div>

                      {/* Price & Stock info */}
                      <div className="flex items-baseline justify-between pt-1">
                        <div>
                          <span className="font-headline-sm text-base sm:text-lg font-bold text-primary">
                            {prod.price}
                          </span>
                          <span className="text-xs text-on-surface-variant ml-0.5">{prod.unit}</span>
                        </div>
                        <span className="text-[10px] text-on-surface-variant font-semibold bg-surface-container px-2 py-0.5 rounded-md">
                          {prod.stockRemaining}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <div className="p-4 pt-0">
                    <button
                      type="button"
                      onClick={() => handleAddToCartClick(prod)}
                      className="w-full py-2.5 rounded-xl bg-primary hover:bg-primary/95 text-on-primary text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
                      <span>Add to Pre-Order Cart</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
