import React, { useState, useMemo, useEffect } from 'react';
import adminApi from '../api/admin';

export default function ContentModeration({ onNavigate, showToast }) {
  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'reviews'
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [viewProductModal, setViewProductModal] = useState(null);
  const [viewReviewModal, setViewReviewModal] = useState(null);
  const [removeConfirmation, setRemoveConfirmation] = useState(null); // { type: 'product' | 'review', item: obj }

  // Sample Reported Products Dataset
  const [reportedProducts, setReportedProducts] = useState([
    {
      id: 'rp-1',
      name: 'Uncertified "Wild" Honeycomb Cappings',
      category: 'Honey & Jams',
      price: '$18.50',
      farmer: 'Highland Pine Apiaries',
      farmerContact: 'Caleb Morgan',
      market: 'Downtown Saturday Market',
      reportedBy: 'Dr. Evelyn Reed (Shopper & Food Inspector)',
      reportedEmail: 'evelyn.reed@oregonag.gov',
      reason: 'Misleading Organic Claim',
      reasonDetails: 'Vendor is advertising this batch as "Certified Organic USDA" on the product listing, but lacks state organic handler certification records on file for the 2025 harvest.',
      date: 'Oct 18, 2025',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDZQARg08jALmVwYA3ok4amUG0u-xEEYBvHSZxOMJpee6BnH_nKjni29z-GksED67D6ZlGhCKRhJUIRZHr4r2DUhFilbG8omgUd7-RaIaMaQOZko3-tkgxjCPyuhNGXinuXgoGlEhcj36RwrQlLtHE1YyFMSkOYl9xsWrbw1zYfTrAL1FM0S9N58axAx7S2XdY5SumAaEEqqoN7i-Jq70byrKynPcG9A1WTfqUTrWqXXnBrSCsiscH2',
      description: 'Raw, unpasteurized honey comb chunks cut fresh from deep hive boxes. Packaged in unsealed plastic jars without tamper labels.'
    },
    {
      id: 'rp-2',
      name: 'Imported Hass Avocados (Non-Regional)',
      category: 'Fresh Fruits',
      price: '$2.50 ea',
      farmer: 'Sunspire Wholesale Resellers',
      farmerContact: 'Lila Chen',
      market: 'Riverside Twilight Market',
      reportedBy: 'Marcus Thorne (Pioneer Pavilion Vendor)',
      reportedEmail: 'marcus@greenpastures.bio',
      reason: 'Prohibited Non-Local Goods',
      reasonDetails: 'MarketLink bylaws strictly forbid wholesale re-selling of non-Pacific Northwest subtropical fruit. Avocados were shipped in cartons with Mexican commercial import stickers.',
      date: 'Oct 17, 2025',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuClIJU-m9wnwHW_ewEmyK3eGmreGDLfswwcbidm46G5ECjugjMC-wJdI02nUXYMvMh1wQTP9_-JLcYZCUufKAjBo1XWGc5NrniQzTN3ccxwpAr92rxrqw09QMddSwJ2VHbpgZijw1oS_WeE60q97AJL094C4DvZs3ZLOuruhvSTprxa3n2blU4DTUZa1KgnPY31NWwPg79HD7jSwPetCMLrplT6T4VDq9Q2AMC3mR8Judd2fjxfi2bB',
      description: 'Bulk avocados offered at discount during twilight market hours. Not grown on local member farms.'
    },
    {
      id: 'rp-3',
      name: 'Unpasteurized Chèvre Goat Curd',
      category: 'Artisan Dairy',
      price: '$9.00 / 8oz',
      farmer: 'Riverbend Goat Dairy',
      farmerContact: 'Hannah & Dale Vance',
      market: 'River District Sat',
      reportedBy: 'Sarah Jenkins (Shopper)',
      reportedEmail: 'sjenkins99@gmail.com',
      reason: 'Safety & Label Compliance',
      reasonDetails: 'Product container does not include state mandatory warning label for raw unpasteurized goat dairy products.',
      date: 'Oct 16, 2025',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA0rX6QqpjAbOj4aS9tyXHfexwLNZNbzSxXT3wnnRZ2XMSpA3M7N8idUFHiRchav_OFiX0mQuqWd0Z-t9_fUwFZGiWRa-be7DDkZhArudA_GozKGr25dEhHpyZDDvoWZ64z6hyMDey5Sgy9ZMPo0jIoAHHOox4FIup4zjPod4TRo-inqmbqmJZBvCIggYQsqchQqcay4tIPkUr3UN4vh-7SRbi3jh2cpjLmrpd164fewdifDCyYcmgR',
      description: 'Fresh artisanal soft chèvre curd rolled in garden herbs. Produced under small-farm domestic kitchen permit.'
    }
  ]);

  // Sample Reported Reviews Dataset
  const [reportedReviews, setReportedReviews] = useState([
    {
      id: 'rr-1',
      reviewerName: 'Brett "AngryShopper" K.',
      reviewerEmail: 'brett_k_pdx@outlook.com',
      target: 'Green Pastures Organic',
      targetType: 'Farmer',
      rating: 1,
      excerpt: 'TOTAL SCAM ARTISTS! DO NOT BUY! Rotten tomatoes and the farmer yelled profanities at my dog...',
      fullReview: 'TOTAL SCAM ARTISTS! DO NOT BUY! Rotten tomatoes and the farmer yelled profanities at my dog when we walked past booth 12. These people are crooks and should be arrested by the police. Avoid this horrible place at all costs!',
      reason: 'Profanity & False Slander',
      reasonDetails: 'Stallholder disputes event. Footage from Pioneer Pavilion security confirms customer dog was off-leash knocking over fruit boxes; no shouting took place. Contains defamatory claims.',
      date: 'Oct 17, 2025',
      flaggedBy: 'Marcus Thorne (Farm Manager)'
    },
    {
      id: 'rr-2',
      reviewerName: 'CryptoDeals_Bot',
      reviewerEmail: 'bot774@quickrich.cc',
      target: 'Artisan Sourdough Country Loaf',
      targetType: 'Product',
      rating: 5,
      excerpt: 'Great bread but better gains! Earn $500 daily automated crypto arbitrage visit bit-link-now.biz...',
      fullReview: 'Great bread but better gains! Earn $500 daily automated crypto arbitrage visit bit-link-now.biz/signup for 100% free bonus tokens! Valid today only!',
      reason: 'Spam & Automated Promotion',
      reasonDetails: 'Automated spam bot injecting external referral links into product review forms.',
      date: 'Oct 16, 2025',
      flaggedBy: 'Automated Spam Filter'
    }
  ]);

  // Metrics
  const metrics = useMemo(() => {
    return {
      openTotal: reportedProducts.length + reportedReviews.length,
      prodCount: reportedProducts.length,
      revCount: reportedReviews.length,
      resolvedToday: 6
    };
  }, [reportedProducts, reportedReviews]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return reportedProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.farmer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.reportedBy.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [reportedProducts, searchQuery]);

  // Filtered Reviews
  const filteredReviews = useMemo(() => {
    return reportedReviews.filter(
      (r) =>
        r.reviewerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.fullReview.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [reportedReviews, searchQuery]);

  // Load moderation data from backend
  useEffect(() => {
    adminApi.getModerationProducts()
      .then((res) => {
        if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
          const mapped = res.data.map((p) => ({
            id: p.id,
            name: p.name,
            category: p.category_name || 'Produce',
            price: `$${Number(p.price).toFixed(2)}`,
            farmer: p.stall_name || p.farmer_name || 'Local Grower',
            farmerContact: p.farmer_name || 'Vendor',
            market: p.market_name || 'Regional Market',
            reportedBy: 'System Compliance Filter',
            reportedEmail: 'admin@marketlink.test',
            reason: p.status === 'sold_out' ? 'Stock Depleted Listing' : 'Active Catalog Audit',
            reasonDetails: p.description || 'Listing reviewed under platform catalog standards.',
            date: p.created_at ? new Date(p.created_at).toLocaleDateString() : 'Recent',
            image: p.image || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDZQARg08jALmVwYA3ok4amUG0u-xEEYBvHSZxOMJpee6BnH_nKjni29z-GksED67D6ZlGhCKRhJUIRZHr4r2DUhFilbG8omgUd7-RaIaMaQOZko3-tkgxjCPyuhNGXinuXgoGlEhcj36RwrQlLtHE1YyFMSkOYl9xsWrbw1zYfTrAL1FM0S9N58axAx7S2XdY5SumAaEEqqoN7i-Jq70byrKynPcG9A1WTfqUTrWqXXnBrSCsiscH2',
            description: p.description || ''
          }));
          setReportedProducts(mapped);
        }
      })
      .catch((err) => console.warn('Could not load moderation products:', err));

    adminApi.getModerationReviews()
      .then((res) => {
        if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
          const mapped = res.data.map((r) => ({
            id: r.id,
            reviewerName: r.customer_name || 'Customer',
            reviewerEmail: 'shopper@marketlink.test',
            target: r.farmer_name || 'Grower',
            targetType: r.product_id ? 'Product' : 'Farmer',
            rating: r.rating || 5,
            excerpt: (r.comment || '').substring(0, 80) + '...',
            fullReview: r.comment || '',
            reason: r.rating <= 2 ? 'Low Rating Disputed by Vendor' : 'Community Content Review',
            reasonDetails: r.comment || 'Verified customer pre-order feedback.',
            date: r.created_at ? new Date(r.created_at).toLocaleDateString() : 'Recent',
            flaggedBy: 'Automated Review Filter'
          }));
          setReportedReviews(mapped);
        }
      })
      .catch((err) => console.warn('Could not load moderation reviews:', err));
  }, []);

  // Dismiss Actions
  const handleDismissProduct = (id) => {
    const item = reportedProducts.find((p) => p.id === id);
    setReportedProducts((prev) => prev.filter((p) => p.id !== id));
    showToast?.(`Report for "${item?.name}" dismissed. Listing retained.`);
  };

  const handleDismissReview = (id) => {
    const item = reportedReviews.find((r) => r.id === id);
    setReportedReviews((prev) => prev.filter((r) => r.id !== id));
    showToast?.(`Report for review by "${item?.reviewerName}" dismissed.`);
  };

  // Open Remove Confirmation
  const handlePromptRemoveProduct = (prod) => {
    setRemoveConfirmation({ type: 'product', item: prod });
  };

  const handlePromptRemoveReview = (rev) => {
    setRemoveConfirmation({ type: 'review', item: rev });
  };

  // Confirm Remove
  const handleExecuteRemoval = async () => {
    if (!removeConfirmation) return;

    if (removeConfirmation.type === 'product') {
      const p = removeConfirmation.item;
      try {
        await adminApi.deleteModerationProduct(p.id);
      } catch (err) {
        console.warn('API deleteModerationProduct error:', err);
      }
      setReportedProducts((prev) => prev.filter((item) => item.id !== p.id));
      showToast?.(`Product listing "${p.name}" was permanently removed from MarketLink.`);
    } else {
      const r = removeConfirmation.item;
      try {
        await adminApi.deleteModerationReview(r.id);
      } catch (err) {
        console.warn('API deleteModerationReview error:', err);
      }
      setReportedReviews((prev) => prev.filter((item) => item.id !== r.id));
      showToast?.(`Flagged review by "${r.reviewerName}" has been purged from platform.`);
    }

    setRemoveConfirmation(null);
    setViewProductModal(null);
    setViewReviewModal(null);
  };

  return (
    <div className="px-gutter py-space-lg max-w-7xl mx-auto w-full flex flex-col gap-space-lg animate-fade-in">
      
      {/* 1. Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-space-xs text-on-surface-variant font-label-sm text-xs">
            <span>PORTAL</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-primary font-bold">TRUST &amp; SAFETY</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg sm:text-3xl text-on-surface tracking-tight font-bold">
            Content Moderation
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant text-xs sm:text-sm">
            Review reported products and reviews, enforce market bylaws, and maintain platform integrity.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-space-sm">
          <button
            type="button"
            onClick={() => showToast?.('Audit log of all moderation actions exported.')}
            className="inline-flex items-center gap-2 px-space-md py-2.5 rounded-xl bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors font-label-md text-xs font-bold shadow-sm cursor-pointer border border-outline-variant/30"
          >
            <span className="material-symbols-outlined text-[18px] text-tertiary">history_edu</span>
            <span>Moderation Audit Log</span>
          </button>
        </div>
      </div>

      {/* 2. Metrics Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-space-md">
        {/* Card 1 */}
        <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm flex flex-col gap-1 border border-outline-variant/30 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-[11px] uppercase tracking-wider text-error font-bold">
              Open Flags
            </span>
            <span className="material-symbols-outlined text-error text-[22px]">gavel</span>
          </div>
          <span className="font-headline-md text-2xl sm:text-3xl font-bold text-on-surface">
            {metrics.openTotal}
          </span>
          <span className="font-body-sm text-error flex items-center gap-1 font-bold text-xs">
            Requires staff intervention
          </span>
        </div>

        {/* Card 2 */}
        <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm flex flex-col gap-1 border border-outline-variant/30">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-[11px] uppercase tracking-wider text-tertiary font-bold">
              Flagged Products
            </span>
            <span className="material-symbols-outlined text-tertiary text-[22px]">shopping_basket</span>
          </div>
          <span className="font-headline-md text-2xl sm:text-3xl font-bold text-tertiary">
            {metrics.prodCount}
          </span>
          <span className="font-body-sm text-on-surface-variant text-xs">
            Listings awaiting review
          </span>
        </div>

        {/* Card 3 */}
        <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm flex flex-col gap-1 border border-outline-variant/30">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-[11px] uppercase tracking-wider text-on-surface-variant font-bold">
              Flagged Reviews
            </span>
            <span className="material-symbols-outlined text-on-surface-variant text-[22px]">rate_review</span>
          </div>
          <span className="font-headline-md text-2xl sm:text-3xl font-bold text-on-surface">
            {metrics.revCount}
          </span>
          <span className="font-body-sm text-on-surface-variant text-xs">
            Feedback &amp; ratings contested
          </span>
        </div>

        {/* Card 4 */}
        <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm flex flex-col gap-1 border border-outline-variant/30">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-[11px] uppercase tracking-wider text-primary font-bold">
              Resolved Today
            </span>
            <span className="material-symbols-outlined text-primary text-[22px]">task_alt</span>
          </div>
          <span className="font-headline-md text-2xl sm:text-3xl font-bold text-primary">
            {metrics.resolvedToday}
          </span>
          <span className="font-body-sm text-secondary flex items-center gap-1 font-bold text-xs">
            <span className="material-symbols-outlined text-[16px]">verified</span> 100% SLA compliant
          </span>
        </div>
      </div>

      {/* 3. Tab Switcher & Search Bar */}
      <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-space-md border border-outline-variant/30">
        
        {/* Two Tabs with Badges */}
        <div className="flex items-center p-1 bg-surface-container rounded-xl gap-1 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-label-md text-xs font-bold transition-all cursor-pointer flex-1 sm:flex-initial justify-center ${
              activeTab === 'products'
                ? 'bg-surface-container-lowest text-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">inventory_2</span>
            <span>Reported Products</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                activeTab === 'products'
                  ? 'bg-error-container text-on-error-container'
                  : 'bg-surface-container-high text-on-surface-variant'
              }`}
            >
              {reportedProducts.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('reviews')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-label-md text-xs font-bold transition-all cursor-pointer flex-1 sm:flex-initial justify-center ${
              activeTab === 'reviews'
                ? 'bg-surface-container-lowest text-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">reviews</span>
            <span>Reported Reviews</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                activeTab === 'reviews'
                  ? 'bg-error-container text-on-error-container'
                  : 'bg-surface-container-high text-on-surface-variant'
              }`}
            >
              {reportedReviews.length}
            </span>
          </button>
        </div>

        {/* Search Filter */}
        <div className="relative w-full sm:w-80 flex items-center">
          <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-[18px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${activeTab === 'products' ? 'products or farmers' : 'reviews or users'}...`}
            className="w-full pl-9 pr-4 py-2 bg-surface-container-low rounded-xl font-body-sm text-xs text-on-surface placeholder:text-on-surface-variant/70 focus:outline-none focus:ring-2 focus:ring-primary border border-outline-variant/30"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 text-on-surface-variant hover:text-on-surface p-1"
            >
              <span className="material-symbols-outlined text-[15px]">close</span>
            </button>
          )}
        </div>
      </div>

      {/* 4. TAB 1: REPORTED PRODUCTS TABLE */}
      {activeTab === 'products' && (
        <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 overflow-hidden flex flex-col">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-surface-container/60 text-on-surface-variant font-label-sm text-[11px] uppercase tracking-wider border-b border-outline-variant/20">
                  <th className="py-3.5 px-space-md" scope="col">Product Name</th>
                  <th className="py-3.5 px-space-md" scope="col">Farmer</th>
                  <th className="py-3.5 px-space-md" scope="col">Reported By</th>
                  <th className="py-3.5 px-space-md" scope="col">Reason</th>
                  <th className="py-3.5 px-space-md" scope="col">Date</th>
                  <th className="py-3.5 px-space-md text-right" scope="col">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-high/50 text-on-surface">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-14 text-center text-on-surface-variant">
                      <div className="w-16 h-16 rounded-full bg-primary-fixed/40 mx-auto flex items-center justify-center mb-space-sm text-primary">
                        <span className="material-symbols-outlined text-[32px]">verified</span>
                      </div>
                      <h3 className="font-headline-sm text-on-surface font-bold text-base">
                        No reported products in queue
                      </h3>
                      <p className="text-xs text-on-surface-variant mt-1 mb-space-md max-w-sm mx-auto">
                        All farmer catalog items comply with local market standards and regulations.
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((prod) => (
                    <tr key={prod.id} className="hover:bg-surface-container-low/60 transition-colors">
                      {/* Product Name & Thumbnail */}
                      <td className="py-4 px-space-md">
                        <div className="flex items-center gap-space-sm">
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="w-11 h-11 rounded-xl object-cover shrink-0 border border-outline-variant/30"
                          />
                          <div className="flex flex-col min-w-0 max-w-[220px]">
                            <span className="font-headline-sm text-xs font-bold text-on-surface line-clamp-1">
                              {prod.name}
                            </span>
                            <span className="text-[11px] text-on-surface-variant flex items-center gap-1 font-medium">
                              <span>{prod.category}</span>
                              <span className="text-outline-variant">•</span>
                              <span className="font-bold text-primary">{prod.price}</span>
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Farmer */}
                      <td className="py-4 px-space-md">
                        <div className="flex flex-col">
                          <span className="font-bold text-xs text-on-surface">{prod.farmer}</span>
                          <span className="text-[11px] text-on-surface-variant">{prod.market}</span>
                        </div>
                      </td>

                      {/* Reported By */}
                      <td className="py-4 px-space-md">
                        <div className="flex flex-col max-w-[180px]">
                          <span className="font-bold text-xs text-on-surface truncate">{prod.reportedBy}</span>
                          <span className="text-[11px] text-on-surface-variant truncate">{prod.reportedEmail}</span>
                        </div>
                      </td>

                      {/* Reason */}
                      <td className="py-4 px-space-md">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-error-container text-on-error-container font-label-sm text-[11px] font-bold">
                          <span className="material-symbols-outlined text-[14px]">flag</span>
                          {prod.reason}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="py-4 px-space-md">
                        <span className="text-xs text-on-surface-variant font-medium">{prod.date}</span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-space-md text-right">
                        <div className="inline-flex items-center gap-1.5 justify-end">
                          <button
                            type="button"
                            onClick={() => setViewProductModal(prod)}
                            className="px-2.5 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <span className="material-symbols-outlined text-[15px]">visibility</span>
                            <span>View Details</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handlePromptRemoveProduct(prod)}
                            className="px-2.5 py-1.5 rounded-lg bg-error-container/40 hover:bg-error-container text-error font-bold text-xs cursor-pointer transition-colors"
                          >
                            Remove Listing
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDismissProduct(prod.id)}
                            className="px-2.5 py-1.5 rounded-lg bg-surface-container-high text-on-surface-variant hover:text-on-surface font-bold text-xs cursor-pointer transition-colors"
                          >
                            Dismiss Report
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="p-space-md bg-surface-container/40 flex items-center justify-between border-t border-outline-variant/20 text-xs">
            <span className="font-body-sm text-on-surface-variant">
              Showing <span className="font-bold text-on-surface">{filteredProducts.length}</span> reported product items
            </span>
            <span className="font-body-sm text-on-surface-variant">
              Triage Priority: High (Health &amp; Authenticity)
            </span>
          </div>
        </div>
      )}

      {/* 5. TAB 2: REPORTED REVIEWS TABLE */}
      {activeTab === 'reviews' && (
        <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 overflow-hidden flex flex-col">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-surface-container/60 text-on-surface-variant font-label-sm text-[11px] uppercase tracking-wider border-b border-outline-variant/20">
                  <th className="py-3.5 px-space-md" scope="col">Reviewer Name</th>
                  <th className="py-3.5 px-space-md" scope="col">Target (Entity)</th>
                  <th className="py-3.5 px-space-md" scope="col">Review Excerpt</th>
                  <th className="py-3.5 px-space-md" scope="col">Reason</th>
                  <th className="py-3.5 px-space-md" scope="col">Date</th>
                  <th className="py-3.5 px-space-md text-right" scope="col">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-high/50 text-on-surface">
                {filteredReviews.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-14 text-center text-on-surface-variant">
                      <div className="w-16 h-16 rounded-full bg-primary-fixed/40 mx-auto flex items-center justify-center mb-space-sm text-primary">
                        <span className="material-symbols-outlined text-[32px]">sentiment_satisfied</span>
                      </div>
                      <h3 className="font-headline-sm text-on-surface font-bold text-base">
                        No reported reviews in queue
                      </h3>
                      <p className="text-xs text-on-surface-variant mt-1 mb-space-md max-w-sm mx-auto">
                        All user and shopper reviews comply with community guidelines.
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredReviews.map((rev) => (
                    <tr key={rev.id} className="hover:bg-surface-container-low/60 transition-colors">
                      {/* Reviewer Name */}
                      <td className="py-4 px-space-md">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center font-bold text-xs shrink-0">
                            {rev.reviewerName[0]}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-bold text-xs text-on-surface">{rev.reviewerName}</span>
                            <span className="text-[11px] text-on-surface-variant">{rev.reviewerEmail}</span>
                          </div>
                        </div>
                      </td>

                      {/* Target */}
                      <td className="py-4 px-space-md">
                        <div className="flex flex-col">
                          <span className="font-bold text-xs text-on-surface">{rev.target}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface-container font-bold text-on-surface-variant w-fit mt-0.5">
                            {rev.targetType}
                          </span>
                        </div>
                      </td>

                      {/* Review Excerpt & Stars */}
                      <td className="py-4 px-space-md">
                        <div className="flex flex-col max-w-[280px]">
                          <div className="flex items-center gap-0.5 text-tertiary mb-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span
                                key={star}
                                className={`material-symbols-outlined text-[14px] ${
                                  star <= rev.rating ? 'text-[#F28C28]' : 'text-outline-variant'
                                }`}
                              >
                                star
                              </span>
                            ))}
                          </div>
                          <p className="text-xs text-on-surface-variant line-clamp-2 italic">
                            "{rev.excerpt}"
                          </p>
                        </div>
                      </td>

                      {/* Reason */}
                      <td className="py-4 px-space-md">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-error-container text-on-error-container font-label-sm text-[11px] font-bold">
                          <span className="material-symbols-outlined text-[14px]">flag</span>
                          {rev.reason}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="py-4 px-space-md">
                        <span className="text-xs text-on-surface-variant font-medium">{rev.date}</span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-space-md text-right">
                        <div className="inline-flex items-center gap-1.5 justify-end">
                          <button
                            type="button"
                            onClick={() => setViewReviewModal(rev)}
                            className="px-2.5 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <span className="material-symbols-outlined text-[15px]">visibility</span>
                            <span>View Full Review</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handlePromptRemoveReview(rev)}
                            className="px-2.5 py-1.5 rounded-lg bg-error-container/40 hover:bg-error-container text-error font-bold text-xs cursor-pointer transition-colors"
                          >
                            Remove Review
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDismissReview(rev.id)}
                            className="px-2.5 py-1.5 rounded-lg bg-surface-container-high text-on-surface-variant hover:text-on-surface font-bold text-xs cursor-pointer transition-colors"
                          >
                            Dismiss Report
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="p-space-md bg-surface-container/40 flex items-center justify-between border-t border-outline-variant/20 text-xs">
            <span className="font-body-sm text-on-surface-variant">
              Showing <span className="font-bold text-on-surface">{filteredReviews.length}</span> reported customer reviews
            </span>
            <span className="font-body-sm text-on-surface-variant">
              Policy: Zero Harassment &amp; Spam Shield Active
            </span>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: VIEW PRODUCT DETAILS                             */}
      {/* ======================================================== */}
      {viewProductModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-surface-container-lowest rounded-2xl max-w-xl w-full p-space-lg shadow-2xl flex flex-col gap-space-md border border-outline-variant/40">
            <div className="flex items-start justify-between border-b border-outline-variant/20 pb-space-sm">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-error-container flex items-center justify-center text-error">
                  <span className="material-symbols-outlined text-[22px]">report_problem</span>
                </div>
                <div>
                  <h3 className="font-headline-sm text-on-surface font-bold text-base">
                    Reported Product Investigation
                  </h3>
                  <span className="text-[11px] text-on-surface-variant">
                    Case ID: {viewProductModal.id} • Flagged on {viewProductModal.date}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setViewProductModal(null)}
                className="p-1 text-on-surface-variant hover:text-on-surface rounded-lg hover:bg-surface-container cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Product Card Overview */}
            <div className="flex gap-4 p-3 bg-surface-container-low rounded-xl border border-outline-variant/20">
              <img
                src={viewProductModal.image}
                alt={viewProductModal.name}
                className="w-24 h-24 rounded-lg object-cover border border-outline-variant/30 shrink-0"
              />
              <div className="flex flex-col justify-between text-xs">
                <div>
                  <span className="font-headline-sm text-sm font-bold text-on-surface">
                    {viewProductModal.name}
                  </span>
                  <p className="text-on-surface-variant mt-0.5">{viewProductModal.description}</p>
                </div>
                <div className="flex items-center gap-2 pt-1 font-bold">
                  <span className="text-primary">{viewProductModal.price}</span>
                  <span>•</span>
                  <span className="text-on-surface-variant">{viewProductModal.farmer}</span>
                </div>
              </div>
            </div>

            {/* Report Complaint Details */}
            <div className="flex flex-col gap-2 bg-error-container/20 p-3.5 rounded-xl border border-error-container/60 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-error flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">flag</span>
                  Reported Reason: {viewProductModal.reason}
                </span>
                <span className="text-[10px] text-on-surface-variant">
                  By {viewProductModal.reportedBy}
                </span>
              </div>
              <p className="text-on-surface leading-relaxed text-[11px]">
                {viewProductModal.reasonDetails}
              </p>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-outline-variant/20 text-xs">
              <button
                type="button"
                onClick={() => {
                  handleDismissProduct(viewProductModal.id);
                  setViewProductModal(null);
                }}
                className="px-space-md py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-bold cursor-pointer"
              >
                Dismiss &amp; Keep Product
              </button>

              <button
                type="button"
                onClick={() => {
                  handlePromptRemoveProduct(viewProductModal);
                }}
                className="px-space-lg py-2 rounded-xl bg-error text-on-error font-bold hover:opacity-90 shadow-md cursor-pointer"
              >
                Remove Listing
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: VIEW FULL REVIEW DETAILS                         */}
      {/* ======================================================== */}
      {viewReviewModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full p-space-lg shadow-2xl flex flex-col gap-space-md border border-outline-variant/40">
            <div className="flex items-start justify-between border-b border-outline-variant/20 pb-space-sm">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-error-container flex items-center justify-center text-error">
                  <span className="material-symbols-outlined text-[22px]">rate_review</span>
                </div>
                <div>
                  <h3 className="font-headline-sm text-on-surface font-bold text-base">
                    Reported Review Audit
                  </h3>
                  <span className="text-[11px] text-on-surface-variant">
                    Target: {viewReviewModal.target} ({viewReviewModal.targetType})
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setViewReviewModal(null)}
                className="p-1 text-on-surface-variant hover:text-on-surface rounded-lg hover:bg-surface-container cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Full Review Text & Rating */}
            <div className="p-3.5 bg-surface-container-low rounded-xl flex flex-col gap-2 text-xs border border-outline-variant/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-on-surface">{viewReviewModal.reviewerName}</span>
                  <span className="text-on-surface-variant text-[11px]">({viewReviewModal.reviewerEmail})</span>
                </div>
                <div className="flex items-center gap-0.5 text-tertiary">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`material-symbols-outlined text-[15px] ${
                        star <= viewReviewModal.rating ? 'text-[#F28C28]' : 'text-outline-variant'
                      }`}
                    >
                      star
                    </span>
                  ))}
                </div>
              </div>

              <p className="text-on-surface font-medium leading-relaxed italic bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/20">
                "{viewReviewModal.fullReview}"
              </p>
            </div>

            {/* Reporter Reason */}
            <div className="flex flex-col gap-1.5 bg-error-container/20 p-3 rounded-xl border border-error-container/50 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-error flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px]">flag</span>
                  Report: {viewReviewModal.reason}
                </span>
                <span className="text-[10px] text-on-surface-variant">
                  Flagged by: {viewReviewModal.flaggedBy}
                </span>
              </div>
              <p className="text-[11px] text-on-surface">
                {viewReviewModal.reasonDetails}
              </p>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-outline-variant/20 text-xs">
              <button
                type="button"
                onClick={() => {
                  handleDismissReview(viewReviewModal.id);
                  setViewReviewModal(null);
                }}
                className="px-space-md py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-bold cursor-pointer"
              >
                Dismiss &amp; Retain
              </button>

              <button
                type="button"
                onClick={() => {
                  handlePromptRemoveReview(viewReviewModal);
                }}
                className="px-space-lg py-2 rounded-xl bg-error text-on-error font-bold hover:opacity-90 shadow-md cursor-pointer"
              >
                Remove Review
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: REMOVE CONFIRMATION                              */}
      {/* ======================================================== */}
      {removeConfirmation && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-space-lg shadow-2xl flex flex-col gap-space-md border border-outline-variant/40">
            <div className="flex items-center gap-3 text-error">
              <div className="w-12 h-12 rounded-full bg-error-container/40 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[28px] text-error">delete_forever</span>
              </div>
              <div>
                <h3 className="font-headline-sm text-on-surface font-bold text-base">
                  Remove {removeConfirmation.type === 'product' ? 'Product Listing' : 'User Review'}?
                </h3>
                <span className="font-body-sm text-on-surface-variant text-xs">
                  Irreversible platform action
                </span>
              </div>
            </div>

            <p className="font-body-sm text-on-surface-variant text-xs leading-relaxed">
              Are you sure you want to remove this {removeConfirmation.type === 'product' ? 'listing' : 'review'}? It will no longer be visible to users.
            </p>

            <div className="flex items-center justify-end gap-space-sm pt-2 border-t border-outline-variant/20 text-xs">
              <button
                type="button"
                onClick={() => setRemoveConfirmation(null)}
                className="px-space-md py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteRemoval}
                className="px-space-lg py-2 rounded-xl bg-error text-on-error font-bold hover:opacity-90 transition-opacity shadow-md cursor-pointer"
              >
                Confirm Removal
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
