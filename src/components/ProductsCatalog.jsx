import React, { useState, useMemo, useEffect } from 'react';
import browseApi from '../api/browse';
import customerApi from '../api/customer';
import { useAuth } from '../context/AuthContext';

export default function ProductsCatalog({ onNavigate, onReserveProduct, onNotifyProduct }) {
  const { isAuthenticated, role } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('freshness');
  const [inStockOnly, setInStockOnly] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedDay, setSelectedDay] = useState('all');
  const [maxPrice, setMaxPrice] = useState(25);
  const [minPrice, setMinPrice] = useState(1.5);
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [liveProducts, setLiveProducts] = useState([]);

  useEffect(() => {
    let mounted = true;
    browseApi.getProducts().then((res) => {
      if (mounted && res.data && res.data.length > 0) {
        setLiveProducts(res.data);
      }
    }).catch(() => {});
    return () => { mounted = false; };
  }, []);

  // Category selections
  const [selectedCategories, setSelectedCategories] = useState({
    veg: true,
    fruit: false,
    dairy: false,
    bread: false,
    herbs: false,
    honey: false,
    eggs: false
  });

  // Growing standards selections
  const [growingStandards, setGrowingStandards] = useState({
    usda: true,
    cng: false,
    bio: false,
    noPesticides: false
  });

  // Favorites tracking
  const [favorites, setFavorites] = useState({});

  // Steppers
  const [quantities, setQuantities] = useState({});

  const handleQtyChange = (id, delta) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(1, Math.min(15, (prev[id] || 1) + delta))
    }));
  };

  const handleToggleFavorite = (id) => {
    setFavorites((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Full catalog items (9 items matching the user's HTML)
  const allCatalogProducts = [
    {
      id: 1,
      name: 'Heirloom Brandywine Tomatoes',
      farm: 'Green Pastures Organic',
      stall: 'Stall #4',
      farmKey: 'green-pastures',
      market: 'Downtown Historic Farmers Market (Sat)',
      marketKey: 'downtown',
      day: 'saturday',
      category: 'veg',
      categoryLabel: 'Fresh Vegetables',
      price: 4.50,
      unit: 'lb',
      status: 'IN_STOCK',
      badge: 'IN STOCK',
      harvestTime: 'Harvested: Friday Dawn',
      desc: 'Rich, sweet, vine-ripened beefsteak heritage tomatoes. Unrefrigerated for prime sugar content.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAcQ6i1azaNvZE7kVb9YLaHVy9R5kLNt9ZLkUhkbtZr2Qj5rCT6NFVnKjKY8b_oVXK6P7hZvLl3XXj_bWdrYy68yKw7FeYVknxMG-aHWGHxHhreH_dr7wsipjDfKb_5Lg1c6SwO3zsVkmlQCR5houU35xqIVr_ylKtacnIVIqthvas8KmcOKB7ZSmek8McfqM9DGhpw9ZknWbi_N37bb09V8C7mxFke1Eyryf6OhXjBUik94QTseZXK',
      alt: 'Sun-ripened organic heirloom Brandywine tomatoes in rustic wooden farm crate'
    },
    {
      id: 2,
      name: 'Wildflower Raw Honey (16oz)',
      farm: 'Pine Ridge Apiary',
      stall: 'Stall #9',
      farmKey: 'pine-ridge',
      market: 'Downtown Historic Farmers Market (Sat)',
      marketKey: 'downtown',
      day: 'saturday',
      category: 'honey',
      categoryLabel: 'Raw Honey & Preserves',
      price: 12.00,
      unit: 'jar',
      status: 'LOW_STOCK',
      badge: 'LOW STOCK (3 left)',
      harvestTime: 'Harvested: High Summer',
      desc: 'Unpasteurized, coarse filtered mountain flora honey rich in natural active pollens and enzymes.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDO5hIbOisd25BUq-4UW4l5OzqLbTRG8FdGgDF8BrF-TX01_lu0I8_y4Kt4QRx7gK9VoM1iPybJm4vP8FvL8Jv99wYgAWqy4zvpdQN8oaNw1vi0aXnbBVQHrbyZq13Dq3qKXr0Uw0vEaa9Kv2Dhs8A2hOdZpVcKOzgZd2KUKKwQXpVVpSPCYHRyU5umee5BHK2rxZUSPxh7sQOf88K-i-4HTitYKc5swf5vnKFLsP6yT766Y52on2Cu',
      alt: 'Mason glass jar filled with golden raw unfiltered wildflower honey'
    },
    {
      id: 3,
      name: 'Country Sourdough Loaf',
      farm: 'Miller & Stone Hearth',
      stall: 'Stall #18',
      farmKey: 'miller-stone',
      market: 'Downtown Historic Farmers Market (Sat)',
      marketKey: 'downtown',
      day: 'saturday',
      category: 'bread',
      categoryLabel: 'Artisan Hearth Breads',
      price: 7.50,
      unit: 'loaf',
      status: 'LOW_STOCK',
      badge: 'LOW STOCK (5 left)',
      harvestTime: 'Baked: 4:00 AM Today',
      desc: 'Stone-milled heritage grains fermented 36 hours for complex flavor and tender open crumb.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDPgdChxzM8vm3UGAMiLHoCJ4WHPX6KAsE958av3S-CU4_oRenqWRAz1Ej2zSorO_h4s9M2t4D3rJ-IiMG5fpD4_dXOwqHRvkJJ8uEDzVAH0xKPWG1cDLw5b-0GOxU4xveaTHxp1RERYz6qksdllIYHPPkcKen_Y4fFaLg0wP_wwxo3sKNPWUNBmKXSkQsGm-d6VwPuGvubztZdFFED6fI-x9gxlsMuY2k13nJ9s6K6ipsYInGS3y6g',
      alt: 'Artisan sourdough loaf with blistered caramelized crust'
    },
    {
      id: 4,
      name: 'Pasture-Raised Heritage Eggs',
      farm: 'Heritage Hen Hollow',
      stall: 'Stall #21',
      farmKey: 'heritage-hen',
      market: 'Downtown Historic Farmers Market (Sat)',
      marketKey: 'downtown',
      day: 'saturday',
      category: 'eggs',
      categoryLabel: 'Pasture-Raised Eggs',
      price: 6.50,
      unit: 'dozen',
      status: 'SOLD_OUT',
      badge: 'SOLD OUT THIS WEEK',
      harvestTime: 'Gathered: Daily',
      desc: 'Rotating pasture-foraged hens, certified non-GMO fed with deep amber yolks.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBxV3-r_v_h0Wt6facnPOnbAi5-MX6BtLDg7-2C0NXgXHQC0tVO3LeCKJ96zB7-U6g7ghWrNvep7FrikGMYHlvnH6NfmkzcnDAN0tInAe2V0J66wcLh1G-E3IJRIN9AgZhn-E2TXWRULAShke3wvfq4foYkQhfh-AaA9jj39w0yleiQJP_Aw6XOlyEgs9n9uoHmtK301znFAjEHe4neTgQ4AOXcZtkWTgRYihSJxfwllT95vpjsf-FD',
      alt: 'Molded pulp carton displaying pastel blue, chocolate brown, and speckled green heritage pasture eggs'
    },
    {
      id: 5,
      name: 'Rainbow Chard & Kale Bundle',
      farm: 'Whispering Pines Farm',
      stall: 'Stall #7',
      farmKey: 'whispering-pines',
      market: 'Oak Valley Community Market (Sun)',
      marketKey: 'oak-valley',
      day: 'sunday',
      category: 'veg',
      categoryLabel: 'Fresh Vegetables',
      price: 3.75,
      unit: 'bunch',
      status: 'IN_STOCK',
      badge: 'IN STOCK',
      harvestTime: 'Harvested: 5:30 AM',
      desc: 'Crisp, mineral-rich hearty greens harvested fresh at sunrise. Great for braising and salads.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDycA7kdJOZMH3DiINrCW6e_ucCS8RVv5cPDSTDuWGUc4C67_fvMnjnYrEJa6NrAzJugBaf4LQZOLOa8_2R3rDyTd_55n7WFij3lp4T6QIvFll5cXwMBYtDtFG1VB-5lRBiE2erVo-PxQp2YutIHpyowZgXD9QGeWZxc4-CF-9b5PPb1-jCsCs9QUm4h-QVveHALvpJANQtnBUQ6VIeuGpVH-8ciaBKV3N-Cvf77z8LEbpQg8X1hRLl',
      alt: 'Freshly harvested rainbow chard with vivid magenta and yellow stalks'
    },
    {
      id: 6,
      name: 'Honeycrisp Crisp Apples',
      farm: 'Sunrise Orchard',
      stall: 'Stall #12',
      farmKey: 'sunrise-orchard',
      market: 'Oak Valley Community Market (Sun)',
      marketKey: 'oak-valley',
      day: 'sunday',
      category: 'fruit',
      categoryLabel: 'Orchard & Bush Fruits',
      price: 3.20,
      unit: 'lb',
      status: 'IN_STOCK',
      badge: 'IN STOCK',
      harvestTime: 'Harvested: Thursday',
      desc: 'Juicy, snappy tree-ripened orchard apples picked at peak crispness without post-harvest waxes.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDxbchuomnmoRus7Mr2ZvI2mfV65eBAMPbZHTzpigHJA-sG6RxgdynzwMhn1MI4gp9g8iCQL6iXaRjZJaOax8riRC8rxnAIkZkugOUNsvAv_w6VRv3pbwJ3mEjqPeo7gYD6FqFqdkF26hc5Al9j_xMVj-KJ_X1aPQ7cjCM2wdO4nOdXTLd7GvAYWJKljluClPvn26Q-E7Jn2TTkhxP940e2r8Bflf9Mna5rmGIEv3jYS6OMBJ3qxhf_',
      alt: 'Crisp speckled Honeycrisp apples in a bushel basket'
    },
    {
      id: 7,
      name: 'Watercress & Pea Tendril Trio',
      farm: 'Green Pastures Organic',
      stall: 'Stall #4',
      farmKey: 'green-pastures',
      market: 'Downtown Historic Farmers Market (Sat)',
      marketKey: 'downtown',
      day: 'saturday',
      category: 'herbs',
      categoryLabel: 'Herbs & Microgreens',
      price: 4.00,
      unit: 'clamshell',
      status: 'IN_STOCK',
      badge: 'IN STOCK',
      harvestTime: 'Harvested: Friday Dawn',
      desc: 'Soil-grown nutrient packed live shoots with tender bite. Cut fresh on order morning.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBvA4-9zjQ2vICnzN9aAXVoITb_3aTpgbYGPODuVo7FDy7ePHdkoNyHRG4OXuIMFC_TzrFo_KZDsF4uXiHMtOM85MjUlzExsz4F8GS7RR-bzNU24FIbOY5H5D_otBTVQrcN2C46AlYWJCK1tnXGr7YKQz0hgFiOJPzk1Q1qm3ZLhAu4PmE7N1onIWSrf043Rgxlxqde63SljCSrpcODuz08cpUtO_5nkSRxI9PQT3RGxP6SKomfs-zr',
      alt: 'Lush green pea tendrils and curly watercress microgreens packed in clear clamshell'
    },
    {
      id: 8,
      name: 'French Breakfast Radishes',
      farm: 'Whispering Pines Farm',
      stall: 'Stall #7',
      farmKey: 'whispering-pines',
      market: 'Riverside Twilight Market (Wed)',
      marketKey: 'riverside',
      day: 'wednesday',
      category: 'veg',
      categoryLabel: 'Fresh Vegetables',
      price: 3.00,
      unit: 'bunch',
      status: 'IN_STOCK',
      badge: 'IN STOCK',
      harvestTime: 'Harvested: Morning',
      desc: 'Mild peppery crunch with tender edible tops. Perfect sliced with farm butter and sea salt.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB0WSEBP1wssKey613lMXqnzhNhOcFkyLPkbDVPf-SP6gE1_3fU6eTXNIGqTWdPuEn3Yp2CTaBUOF3T4e_ekKLAH0SSHUA2vM9gIt-8GBNLuhpeyT0EMV2N6zQyKiIHpCwPlZQJD3JC_CQSbdAC2BbTSmqD1CIJXqGH8L0y57a7yMr-lhFumSEC7N9B42SNiPMrRJeXIBcauaik5bv-jGMs-GR2tFPa6ugclPK7ux__wZu9ns7EIGcc',
      alt: 'Oblong vivid magenta and white tipped French breakfast radishes'
    },
    {
      id: 9,
      name: 'A2 Whole Jersey Milk',
      farm: 'Sweet Meadow Creamery',
      stall: 'Stall #17',
      farmKey: 'sweet-meadow',
      market: 'Downtown Historic Farmers Market (Sat)',
      marketKey: 'downtown',
      day: 'saturday',
      category: 'dairy',
      categoryLabel: 'Farmstead Dairy & Cheeses',
      price: 5.50,
      unit: 'half-gal',
      status: 'IN_STOCK',
      badge: 'IN STOCK',
      harvestTime: 'Bottled: Yesterday',
      desc: 'Pasture-grazed non-homogenized cream-top golden milk with naturally easier digesting A2 proteins.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDqx_aB--vjgCS-c0aWLNFZlpO3wuW8P5sbZ8D0Chr_7QSTwGTE8T1kCWzh_pK9PpNSaB0nL7vpMNrckub7Xe1L4aHXcGKN_F4bcNPoJQMaryMXWZxZD8Chou4_nsU3TlhwXmH_lORyJDZwAhcdYoUdC8tJKJP8d0BzlwD4KwqhKEWOEerkiDF8GWYUzHO7VOBk7LhbOnp8WXABFn9csUWuAZK9prPnzfDaXERPGfdVhCcY2p_fTRkk',
      alt: 'Glass bottle of farmstead creamline whole jersey cow milk with golden butter roll'
    }
  ];

  // Filtering Logic
  const filteredProducts = useMemo(() => {
    // Check if any category is checked
    const anyCatSelected = Object.values(selectedCategories).some(Boolean);

    let list = allCatalogProducts.filter((item) => {
      // In Stock filter
      if (inStockOnly && item.status === 'SOLD_OUT') return false;

      // Price filter
      if (item.price > maxPrice || item.price < minPrice) return false;

      // Categories filter
      if (anyCatSelected && !selectedCategories[item.category]) return false;

      // Location filter
      if (selectedLocation !== 'all' && item.marketKey !== selectedLocation) return false;

      // Day filter
      if (selectedDay !== 'all') {
        if (selectedDay === 'saturday' && item.day !== 'saturday') return false;
        if (selectedDay === 'sunday' && item.day !== 'sunday') return false;
        if (selectedDay === 'wednesday' && item.day !== 'wednesday') return false;
      }

      // Search text query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const str = `${item.name} ${item.farm} ${item.desc} ${item.categoryLabel}`.toLowerCase();
        if (!str.includes(q)) return false;
      }

      return true;
    });

    // Sorting
    if (sortBy === 'price-low') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'popular') {
      list.sort((a, b) => b.id - a.id);
    }

    return list;
  }, [
    searchQuery,
    sortBy,
    inStockOnly,
    selectedCategories,
    selectedLocation,
    selectedDay,
    maxPrice,
    minPrice
  ]);

  const handleClearAllFilters = () => {
    setSearchQuery('');
    setInStockOnly(false);
    setSelectedLocation('all');
    setSelectedDay('all');
    setMaxPrice(30);
    setMinPrice(0);
    setSelectedCategories({
      veg: false,
      fruit: false,
      dairy: false,
      bread: false,
      herbs: false,
      honey: false,
      eggs: false
    });
  };

  const handleCategoryCheckbox = (catKey) => {
    setSelectedCategories((prev) => ({
      ...prev,
      [catKey]: !prev[catKey]
    }));
  };

  return (
    <div className="flex flex-col w-full">
      {/* Top Breadcrumb & Page Banner */}
      <section className="w-full bg-surface-container-low py-space-lg">
        <div className="max-w-7xl mx-auto px-gutter flex flex-col gap-space-md">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumbs" className="flex items-center gap-space-xs font-body-sm text-on-surface-variant text-xs">
            <button onClick={() => onNavigate('home')} className="hover:text-primary transition-colors cursor-pointer">
              Home
            </button>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-on-surface font-semibold">Products</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-primary font-semibold">All Seasonal Harvest</span>
          </nav>

          {/* Banner Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-space-xs px-space-sm py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm mb-space-xs text-xs font-bold">
                <span className="material-symbols-outlined text-[15px]">eco</span>
                Fresh Picked Morning Batches
              </div>
              <h1 className="font-headline-lg text-primary tracking-tight font-bold">
                Seasonal Harvest &amp; Local Farm Goods
              </h1>
              <p className="font-body-lg text-on-surface-variant mt-space-xs text-sm">
                Browse fresh harvests, artisan sourdough, honey, and pasture eggs directly from regional family farms. Reserve in advance and pay in-person directly at the stall.
              </p>
            </div>
            <div className="flex items-center gap-space-sm self-start md:self-auto">
              <span className="font-label-sm text-on-surface-variant uppercase tracking-wider text-xs">Market Day:</span>
              <span className="px-space-sm py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-label-md flex items-center gap-1 text-xs font-bold">
                <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                Downtown Historic (Saturday)
              </span>
            </div>
          </div>

          {/* Trust Badges Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-space-sm pt-space-xs">
            <div className="bg-surface-container-lowest p-space-sm rounded-xl shadow-sm flex items-center gap-space-xs border border-outline-variant/30">
              <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-primary text-[18px]">payments</span>
              </div>
              <span className="font-label-sm text-on-surface text-xs">100% In-Person Payment at Stall</span>
            </div>
            <div className="bg-surface-container-lowest p-space-sm rounded-xl shadow-sm flex items-center gap-space-xs border border-outline-variant/30">
              <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-secondary text-[18px]">credit_card_off</span>
              </div>
              <span className="font-label-sm text-on-surface text-xs">Zero Online Card Fees</span>
            </div>
            <div className="bg-surface-container-lowest p-space-sm rounded-xl shadow-sm flex items-center gap-space-xs border border-outline-variant/30">
              <div className="w-8 h-8 rounded-full bg-tertiary-fixed flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-tertiary text-[18px]">schedule</span>
              </div>
              <span className="font-label-sm text-on-surface text-xs">Held in Shade Until 11:30 AM</span>
            </div>
            <div className="bg-surface-container-lowest p-space-sm rounded-xl shadow-sm flex items-center gap-space-xs border border-outline-variant/30">
              <div className="w-8 h-8 rounded-full bg-primary-fixed-dim flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-on-primary-fixed-variant text-[18px]">volunteer_activism</span>
              </div>
              <span className="font-label-sm text-on-surface text-xs">Direct 100% Farmer Payout</span>
            </div>
          </div>
        </div>
      </section>

      {/* Search & Quick Action Toolbar */}
      <section className="w-full bg-surface py-space-md shadow-sm border-y border-outline-variant/30">
        <div className="max-w-7xl mx-auto px-gutter flex flex-col gap-space-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md items-center">
            {/* Search Input */}
            <div className="lg:col-span-7 relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-[22px]">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search heirloom tomatoes, honey, wild sourdough, kale..."
                className="w-full pl-12 pr-space-md py-space-sm rounded-xl bg-surface-container-lowest font-body-md text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary shadow-sm border border-outline-variant/40 text-sm"
              />
            </div>

            {/* Sort & Mobile Filters Trigger */}
            <div className="lg:col-span-5 flex items-center justify-between lg:justify-end gap-space-sm">
              <div className="flex items-center gap-space-xs">
                <label className="font-label-sm text-on-surface-variant whitespace-nowrap text-xs" htmlFor="sort-select">
                  Sort by:
                </label>
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="font-label-sm text-on-surface bg-surface-container-lowest py-2 px-space-sm rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer border border-outline-variant/40 text-xs"
                >
                  <option value="freshness">Freshness / Harvest Date</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                className="lg:hidden px-space-sm py-2 rounded-lg bg-surface-container-high text-on-surface font-label-sm flex items-center gap-1 shadow-sm text-xs cursor-pointer"
                id="mobile-filter-open"
              >
                <span className="material-symbols-outlined text-[18px]">tune</span>
                Filters
              </button>
            </div>
          </div>

          {/* Quick Active Filter Chips & Counter */}
          <div className="flex flex-wrap items-center justify-between gap-space-sm pt-space-xs text-xs">
            <div className="flex flex-wrap items-center gap-space-xs">
              <span className="font-label-sm text-on-surface-variant mr-1">Active:</span>
              <span className="inline-flex items-center gap-1 bg-surface-container-high text-on-surface px-space-sm py-1 rounded-full font-label-sm">
                Vegetables (Organic)
              </span>
              <span className="inline-flex items-center gap-1 bg-surface-container-high text-on-surface px-space-sm py-1 rounded-full font-label-sm">
                Saturday Pickup
              </span>
              <button
                type="button"
                onClick={handleClearAllFilters}
                className="text-tertiary hover:underline font-label-sm ml-space-xs cursor-pointer"
              >
                Clear All Filters
              </button>
            </div>
            <p className="font-body-sm text-on-surface-variant">
              Showing <span className="font-bold text-on-surface">{filteredProducts.length}</span> Fresh Harvest Items from{' '}
              <span className="font-bold text-on-surface">14</span> Regional Farms
            </p>
          </div>
        </div>
      </section>

      {/* Two-Column Main Area: Filter Sidebar + Products Grid */}
      <main className="w-full max-w-7xl mx-auto px-gutter py-space-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
          {/* Left Filter Sidebar */}
          <aside
            id="filter-sidebar"
            className={`${
              mobileFilterOpen
                ? 'fixed inset-y-0 left-0 z-50 w-80 overflow-y-auto block'
                : 'hidden'
            } lg:block lg:col-span-3 bg-surface-container-lowest p-space-md rounded-2xl shadow-sm space-y-space-md border border-outline-variant/30`}
          >
            <div className="flex items-center justify-between pb-space-sm border-b border-outline-variant/20">
              <h2 className="font-headline-sm text-on-surface font-bold flex items-center gap-space-xs text-base">
                <span className="material-symbols-outlined text-primary text-[22px]">tune</span>
                Filter Produce
              </h2>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="text-outline hover:text-on-surface font-label-sm lg:hidden cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* In Stock Toggle */}
            <div className="bg-surface-container-low p-space-sm rounded-xl flex items-center justify-between border border-outline-variant/20">
              <div className="flex flex-col">
                <span className="font-label-md text-on-surface text-xs font-bold">In Stock Only</span>
                <span className="font-body-sm text-on-surface-variant text-[11px]">Hide reserved or sold out</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-surface-container-lowest after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface-container-lowest after:border-outline-variant after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            {/* Categories */}
            <div className="space-y-space-xs">
              <h3 className="font-label-md text-on-surface font-bold uppercase tracking-wider text-xs">Categories</h3>
              <div className="space-y-1.5 font-body-sm text-on-surface text-xs">
                {[
                  { key: 'veg', label: 'Fresh Vegetables', count: 12 },
                  { key: 'fruit', label: 'Orchard & Bush Fruits', count: 6 },
                  { key: 'dairy', label: 'Farmstead Dairy & Cheeses', count: 5 },
                  { key: 'bread', label: 'Artisan Hearth Breads', count: 4 },
                  { key: 'herbs', label: 'Herbs & Microgreens', count: 8 },
                  { key: 'honey', label: 'Raw Honey & Preserves', count: 3 },
                  { key: 'eggs', label: 'Pasture-Raised Eggs', count: 2 }
                ].map((cat) => (
                  <label key={cat.key} className="flex items-center justify-between p-1 hover:bg-surface-container-low rounded cursor-pointer">
                    <span className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedCategories[cat.key] || false}
                        onChange={() => handleCategoryCheckbox(cat.key)}
                        className="w-4 h-4 rounded text-primary accent-primary cursor-pointer"
                      />
                      {cat.label}
                    </span>
                    <span className="text-on-surface-variant font-label-sm text-[10px] bg-surface-container px-2 py-0.5 rounded-full">
                      {cat.count}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Market Location Selector */}
            <div className="space-y-space-xs">
              <h3 className="font-label-md text-on-surface font-bold uppercase tracking-wider text-xs">Pickup Location</h3>
              <div className="relative">
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full font-body-sm text-on-surface bg-surface-container-low py-2 px-space-sm rounded-xl focus:outline-none focus:ring-1 focus:ring-primary appearance-none cursor-pointer text-xs border border-outline-variant/40"
                >
                  <option value="all">All Markets (5 locations)</option>
                  <option value="downtown">Downtown Historic Farmers Market (Sat)</option>
                  <option value="oak-valley">Oak Valley Community Market (Sun)</option>
                  <option value="riverside">Riverside Twilight Market (Wed)</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant text-[20px]">
                  arrow_drop_down
                </span>
              </div>
            </div>

            {/* Market Day Chips */}
            <div className="space-y-space-xs">
              <h3 className="font-label-md text-on-surface font-bold uppercase tracking-wider text-xs">Market Day</h3>
              <div className="flex flex-wrap gap-1.5 text-xs">
                {['all', 'saturday', 'sunday', 'wednesday'].map((d) => {
                  const labels = {
                    all: 'All Days',
                    saturday: 'Saturday Morning',
                    sunday: 'Sunday Morning',
                    wednesday: 'Midweek Wed'
                  };
                  const isActive = selectedDay === d;
                  return (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setSelectedDay(d)}
                      className={`px-space-sm py-1 rounded-full text-xs font-label-sm transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-primary text-on-primary font-bold'
                          : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
                      }`}
                    >
                      {labels[d]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Farming Practices */}
            <div className="space-y-space-xs">
              <h3 className="font-label-md text-on-surface font-bold uppercase tracking-wider text-xs">Growing Standards</h3>
              <div className="space-y-1.5 font-body-sm text-on-surface text-xs">
                {[
                  { key: 'usda', label: 'USDA Certified Organic' },
                  { key: 'cng', label: 'Certified Naturally Grown' },
                  { key: 'bio', label: 'Biodynamic / Regenerative' },
                  { key: 'noPesticides', label: 'No Synthetic Pesticides' }
                ].map((std) => (
                  <label key={std.key} className="flex items-center gap-2 p-1 hover:bg-surface-container-low rounded cursor-pointer">
                    <input
                      type="checkbox"
                      checked={growingStandards[std.key]}
                      onChange={() => setGrowingStandards((s) => ({ ...s, [std.key]: !s[std.key] }))}
                      className="w-4 h-4 rounded text-primary accent-primary cursor-pointer"
                    />
                    <span>{std.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range Slider Input */}
            <div className="space-y-space-xs">
              <div className="flex justify-between items-center text-xs">
                <h3 className="font-label-md text-on-surface font-bold uppercase tracking-wider text-xs">Price Range</h3>
                <span className="font-label-sm text-primary font-bold">${minPrice.toFixed(2)} - ${maxPrice.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="1.5"
                max="30"
                step="0.5"
                value={maxPrice}
                onChange={(e) => setMaxPrice(parseFloat(e.target.value))}
                className="w-full accent-primary mt-2 cursor-pointer"
              />
            </div>

            {/* Filter Action Buttons */}
            <div className="pt-space-xs space-y-2 text-xs">
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-2.5 rounded-xl bg-primary text-on-primary font-label-md hover:bg-primary-container shadow-sm transition-colors text-center cursor-pointer"
              >
                Apply Filters
              </button>
              <button
                type="button"
                onClick={handleClearAllFilters}
                className="w-full py-2 text-center text-on-surface-variant hover:text-on-surface font-label-sm transition-colors cursor-pointer"
              >
                Reset to Defaults
              </button>
            </div>
          </aside>

          {/* Main Product Showcase Grid */}
          <section className="lg:col-span-9 flex flex-col gap-space-lg">
            {filteredProducts.length === 0 ? (
              <div className="bg-surface-container-low rounded-2xl p-space-xl text-center flex flex-col items-center justify-center max-w-xl mx-auto my-space-lg shadow-sm border border-outline-variant/30">
                <div className="w-20 h-20 rounded-full bg-surface-container-high flex items-center justify-center mb-space-sm">
                  <span className="material-symbols-outlined text-outline text-[40px]">shopping_basket</span>
                </div>
                <h3 className="font-headline-sm text-on-surface font-bold">No Harvest Items Match Your Search</h3>
                <p className="font-body-md text-on-surface-variant mt-space-xs max-w-md text-xs">
                  Try adjusting your price range, unchecking "In Stock Only", or clearing selected market filters to discover seasonal goods.
                </p>
                <button
                  type="button"
                  onClick={handleClearAllFilters}
                  className="mt-space-md px-space-lg py-2.5 rounded-full bg-primary text-on-primary font-label-md hover:bg-primary-container shadow-sm transition-colors cursor-pointer text-xs"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-space-md">
                {filteredProducts.map((item) => {
                  const isSoldOut = item.status === 'SOLD_OUT';
                  const isLowStock = item.status === 'LOW_STOCK';
                  const isFav = favorites[item.id];
                  const currentQty = quantities[item.id] || 1;

                  return (
                    <article
                      key={item.id}
                      className="bg-surface-container-lowest rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col justify-between group border border-outline-variant/30"
                    >
                      <div>
                        <div className="relative h-52 w-full overflow-hidden bg-surface-container">
                          <img
                            src={item.image}
                            alt={item.alt}
                            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${
                              isSoldOut ? 'filter grayscale-[20%]' : ''
                            }`}
                          />

                          {/* Status Badge */}
                          <span
                            className={`absolute top-3 left-3 px-space-sm py-1 rounded-full font-label-sm text-xs shadow-sm flex items-center gap-1 ${
                              isSoldOut
                                ? 'bg-surface-container-high text-on-surface-variant'
                                : isLowStock
                                ? 'bg-tertiary-fixed text-on-tertiary-fixed'
                                : 'bg-primary-fixed text-on-primary-fixed font-bold'
                            }`}
                          >
                            {!isSoldOut && <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>}
                            {item.badge}
                          </span>

                          {/* Favorite button */}
                          <button
                            type="button"
                            onClick={() => handleToggleFavorite(item.id)}
                            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-surface-container-lowest/90 backdrop-blur text-on-surface flex items-center justify-center hover:text-error transition-colors shadow-sm cursor-pointer"
                            title="Save to Favorites"
                          >
                            <span className={`material-symbols-outlined text-[18px] ${isFav ? 'text-error fill' : ''}`}>
                              favorite
                            </span>
                          </button>

                          {/* Harvest badge */}
                          {item.harvestTime && (
                            <div className="absolute bottom-2 left-2 px-space-xs py-0.5 rounded bg-surface/90 backdrop-blur font-label-sm text-[11px] text-on-surface">
                              {item.harvestTime}
                            </div>
                          )}
                        </div>

                        <div className="p-space-md">
                          <div className="flex items-center gap-space-xs text-xs font-label-sm text-primary mb-1">
                            <span className="material-symbols-outlined text-[15px]">storefront</span>
                            <button
                              type="button"
                              onClick={() => onNavigate('farmer-profile')}
                              className="hover:underline font-bold cursor-pointer"
                            >
                              {item.farm}
                            </button>
                            <span className="text-on-surface-variant">• {item.stall}</span>
                          </div>

                          <h3
                            onClick={() => {
                              if (item.name.includes('Brandywine')) {
                                onNavigate('product-details');
                              }
                            }}
                            className={`font-headline-sm text-on-surface font-semibold group-hover:text-primary transition-colors text-base ${
                              item.name.includes('Brandywine') ? 'cursor-pointer hover:underline' : ''
                            }`}
                          >
                            {item.name}
                          </h3>

                          <p className="font-body-sm text-on-surface-variant mt-1 line-clamp-2 text-xs leading-relaxed">
                            {item.desc}
                          </p>

                          <div className="mt-space-sm flex items-baseline gap-1">
                            <span className="font-headline-sm font-bold text-on-surface">${item.price.toFixed(2)}</span>
                            <span className="font-body-sm text-on-surface-variant text-xs">/ {item.unit}</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-space-md pt-0 flex items-center gap-space-xs">
                        {!isSoldOut ? (
                          <>
                            <div className="flex items-center bg-surface-container-low rounded-xl p-1 shrink-0 border border-outline-variant/30">
                              <button
                                aria-label="Decrease"
                                onClick={() => handleQtyChange(item.id, -1)}
                                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-surface-container text-on-surface cursor-pointer"
                              >
                                <span className="material-symbols-outlined text-[16px]">remove</span>
                              </button>
                              <span className="w-6 text-center font-label-md text-on-surface text-xs font-bold">
                                {currentQty}
                              </span>
                              <button
                                aria-label="Increase"
                                onClick={() => handleQtyChange(item.id, 1)}
                                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-surface-container text-on-surface cursor-pointer"
                              >
                                <span className="material-symbols-outlined text-[16px]">add</span>
                              </button>
                            </div>
                            <button
                              type="button"
                              onClick={() => onReserveProduct({ ...item, quantity: currentQty })}
                              className="grow py-2.5 px-space-sm rounded-xl bg-tertiary text-on-tertiary font-label-md hover:bg-tertiary-container transition-colors shadow-sm text-center flex items-center justify-center gap-1 cursor-pointer text-xs"
                            >
                              <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
                              Reserve for Pickup
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={() => onNotifyProduct(item)}
                            className="w-full py-2.5 px-space-sm rounded-xl bg-surface-container-high text-on-surface-variant font-label-md hover:bg-surface-container transition-colors text-center flex items-center justify-center gap-1 cursor-pointer text-xs"
                          >
                            <span className="material-symbols-outlined text-[18px]">notifications</span>
                            Notify Next Harvest
                          </button>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

            {/* Pagination Controls */}
            <nav
              aria-label="Produce list pagination"
              className="flex flex-col sm:flex-row items-center justify-between gap-space-md pt-space-lg bg-surface-container-lowest p-space-md rounded-2xl shadow-sm border border-outline-variant/30"
            >
              <p className="font-body-sm text-on-surface-variant order-2 sm:order-1 text-xs">
                Showing <span className="font-bold text-on-surface">1 - {filteredProducts.length}</span> of{' '}
                <span className="font-bold text-on-surface">24</span> harvest products
              </p>
              <div className="flex items-center gap-space-xs order-1 sm:order-2 text-xs">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="px-space-sm py-2 rounded-xl bg-surface-container text-on-surface-variant font-label-md opacity-50 cursor-not-allowed flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentPage(1)}
                  className={`w-10 h-10 rounded-xl font-label-md font-bold flex items-center justify-center shadow-sm cursor-pointer ${
                    currentPage === 1 ? 'bg-primary text-on-primary' : 'bg-surface-container-low text-on-surface'
                  }`}
                >
                  1
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentPage(2)}
                  className={`w-10 h-10 rounded-xl font-label-md flex items-center justify-center transition-colors cursor-pointer ${
                    currentPage === 2 ? 'bg-primary text-on-primary font-bold' : 'bg-surface-container-low hover:bg-surface-container text-on-surface'
                  }`}
                >
                  2
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentPage(3)}
                  className={`w-10 h-10 rounded-xl font-label-md flex items-center justify-center transition-colors cursor-pointer ${
                    currentPage === 3 ? 'bg-primary text-on-primary font-bold' : 'bg-surface-container-low hover:bg-surface-container text-on-surface'
                  }`}
                >
                  3
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(3, p + 1))}
                  className="px-space-sm py-2 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md flex items-center gap-1 transition-colors cursor-pointer"
                >
                  Next
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </button>
              </div>
            </nav>
          </section>
        </div>
      </main>

      {/* Reservation Workflow Info Callout Section */}
      <section className="w-full bg-surface-container-low py-space-xl mt-space-md border-t border-outline-variant/30">
        <div className="max-w-7xl mx-auto px-gutter">
          <div className="bg-surface-container-lowest p-space-lg md:p-space-xl rounded-2xl shadow-sm border border-outline-variant/30">
            <div className="text-center max-w-2xl mx-auto mb-space-lg">
              <span className="font-label-sm text-primary uppercase tracking-widest font-bold text-xs">
                Zero Risk • Fresh Field Handover
              </span>
              <h2 className="font-headline-lg text-primary font-bold tracking-tight mt-1">
                How MarketLink Reservations Work
              </h2>
              <p className="font-body-md text-on-surface-variant mt-2 text-xs">
                Never worry about grocery deliveries sitting in the heat or hidden online service surcharges. Experience direct stall pickup built for community growers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg relative">
              {/* Step 1 */}
              <div className="flex flex-col items-center text-center p-space-md rounded-xl bg-surface-container-low/60 border border-outline-variant/20">
                <div className="w-14 h-14 rounded-2xl bg-primary text-on-primary font-headline-sm font-bold flex items-center justify-center shadow-md mb-space-sm">
                  1
                </div>
                <h3 className="font-headline-sm text-on-surface font-semibold mb-space-xs text-base">
                  Reserve Ahead Online
                </h3>
                <p className="font-body-sm text-on-surface-variant text-xs">
                  Lock in your favorite artisan sourdoughs, honey, and heirloom greens throughout the week. No credit cards or checkout fees required.
                </p>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center text-center p-space-md rounded-xl bg-surface-container-low/60 border border-outline-variant/20">
                <div className="w-14 h-14 rounded-2xl bg-tertiary text-on-tertiary font-headline-sm font-bold flex items-center justify-center shadow-md mb-space-sm">
                  2
                </div>
                <h3 className="font-headline-sm text-on-surface font-semibold mb-space-xs text-base">
                  Harvested &amp; Packed Fresh
                </h3>
                <p className="font-body-sm text-on-surface-variant text-xs">
                  Farmers cut and prep your order on market morning, holding it labeled in cool stall shade until you arrive for pickup before 11:30 AM.
                </p>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center text-center p-space-md rounded-xl bg-surface-container-low/60 border border-outline-variant/20">
                <div className="w-14 h-14 rounded-2xl bg-secondary text-on-secondary font-headline-sm font-bold flex items-center justify-center shadow-md mb-space-sm">
                  3
                </div>
                <h3 className="font-headline-sm text-on-surface font-semibold mb-space-xs text-base">
                  Inspect &amp; Pay at Stall
                </h3>
                <p className="font-body-sm text-on-surface-variant text-xs">
                  Say hello to your farmer, inspect your harvest, and pay using Cash, Card, Venmo, or local SNAP/EBT vouchers directly at their market stand.
                </p>
              </div>
            </div>

            {/* Banner Guarantee Footnote */}
            <div className="mt-space-lg pt-space-md border-t border-outline-variant/30 flex flex-col sm:flex-row items-center justify-between gap-space-sm text-xs">
              <div className="flex items-center gap-space-xs text-on-surface-variant">
                <span className="material-symbols-outlined text-primary text-[20px]">verified_user</span>
                <span className="font-label-sm">
                  Farmer guarantee: Unsatisfied with harvest quality upon inspection? No obligation to buy.
                </span>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('about-us')}
                className="font-label-sm text-primary hover:underline flex items-center gap-1 font-bold cursor-pointer"
              >
                <span>Read our Community Harvest Promise</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
