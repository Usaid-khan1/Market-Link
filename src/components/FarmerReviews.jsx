import React, { useState, useMemo } from 'react';

export default function FarmerReviews({ showToast }) {
  const [filter, setFilter] = useState('All'); // 'All' | 'Unreplied' | 'Replied'
  const [replyingToId, setReplyingToId] = useState(null);
  const [replyText, setReplyText] = useState('');

  // Reviews Dataset for Green Pastures Organic
  const [reviews, setReviews] = useState([
    {
      id: 1,
      customer: 'Elena Rostova',
      avatar: 'ER',
      avatarBg: 'bg-primary-fixed text-on-primary-fixed',
      rating: 5,
      product: 'Heirloom Brandywine Tomatoes',
      date: 'Oct 16, 2025',
      comment:
        'The absolute best tomatoes in Portland! Thin skin, incredible depth of sweetness, and picked at peak ripeness. Our Caprese salad was sublime.',
      farmerReply:
        'Thank you so much Elena! We pick them just hours before the Saturday market to ensure maximum sugars and acid balance. See you next weekend! — Marcus & Sarah',
      replyDate: 'Oct 16, 2025'
    },
    {
      id: 2,
      customer: 'Marcus Brody',
      avatar: 'MB',
      avatarBg: 'bg-tertiary-fixed text-on-tertiary-fixed',
      rating: 5,
      product: 'Organic Romanesco Cauliflower',
      date: 'Oct 14, 2025',
      comment:
        'A work of art! Both aesthetically stunning and delicious roasted with garlic butter. Can you keep more in stock for Pioneer Pavilion?',
      farmerReply: null,
      replyDate: null
    },
    {
      id: 3,
      customer: 'Sarah Jenkins',
      avatar: 'SJ',
      avatarBg: 'bg-secondary-fixed text-on-secondary-fixed',
      rating: 4,
      product: 'Rainbow Swiss Chard & Lacinato Kale',
      date: 'Oct 11, 2025',
      comment:
        'Super fresh and crunchy greens. One leaf had a tiny caterpillar on it, which confirms it is genuinely 100% organic and spray-free! Just rinse thoroughly.',
      farmerReply:
        'Haha thanks for understanding Sarah! Zero synthetic sprays means native fauna occasionally says hello. We inspect every bundle carefully and appreciate your support for true biodynamic farming! — Marcus',
      replyDate: 'Oct 12, 2025'
    },
    {
      id: 4,
      customer: 'David Reynolds',
      avatar: 'DR',
      avatarBg: 'bg-surface-container text-on-surface',
      rating: 5,
      product: 'Sweet Italian Genovese Basil',
      date: 'Oct 08, 2025',
      comment:
        'Fragrance filled our entire kitchen. Stems stayed firm in a glass of water for nearly a week.',
      farmerReply: null,
      replyDate: null
    }
  ]);

  // Counts
  const counts = useMemo(() => {
    const total = reviews.length;
    const replied = reviews.filter((r) => Boolean(r.farmerReply)).length;
    const unreplied = total - replied;
    return { total, replied, unreplied };
  }, [reviews]);

  // Filtered
  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      if (filter === 'Replied') return Boolean(r.farmerReply);
      if (filter === 'Unreplied') return !r.farmerReply;
      return true;
    });
  }, [reviews, filter]);

  // Open Reply
  const handleOpenReply = (review) => {
    setReplyingToId(review.id);
    setReplyText(review.farmerReply || '');
  };

  // Submit Reply
  const handleSaveReply = (id) => {
    if (!replyText.trim()) return;

    setReviews((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              farmerReply: replyText.trim(),
              replyDate: 'Today'
            }
          : r
      )
    );

    showToast?.('Reply published to customer profile & stall reviews!');
    setReplyingToId(null);
    setReplyText('');
  };

  return (
    <div className="px-gutter py-space-lg max-w-7xl mx-auto w-full flex flex-col gap-space-lg animate-fade-in">
      
      {/* 1. Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-space-xs text-on-surface-variant font-label-sm text-xs">
            <span>FARMER STALL</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-primary font-bold">REPUTATION &amp; FEEDBACK</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg sm:text-3xl text-on-surface tracking-tight font-bold">
            Customer Reviews
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant text-xs sm:text-sm">
            Read shopper feedback from weekend markets and publish replies directly to your stall storefront.
          </p>
        </div>
      </div>

      {/* 2. Row of 2 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
        
        {/* Card 1: Average Rating */}
        <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm border border-outline-variant/30 flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="font-label-sm text-[11px] uppercase tracking-wider text-on-surface-variant font-bold">
              Average Rating
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-headline-md text-3xl sm:text-4xl font-bold text-on-surface">
                4.95
              </span>
              <div className="flex items-center gap-0.5 text-[#F28C28]">
                {[1, 2, 3, 4, 5].map((s) => (
                  <span key={s} className="material-symbols-outlined text-[20px]">star</span>
                ))}
              </div>
            </div>
            <span className="text-xs text-secondary font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">verified</span>
              Top 5% Highest Rated Grower
            </span>
          </div>

          <div className="w-14 h-14 rounded-2xl bg-primary-fixed/50 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-[32px]">grade</span>
          </div>
        </div>

        {/* Card 2: Total Reviews */}
        <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm border border-outline-variant/30 flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="font-label-sm text-[11px] uppercase tracking-wider text-on-surface-variant font-bold">
              Total Reviews
            </span>
            <span className="font-headline-md text-3xl sm:text-4xl font-bold text-on-surface">
              142
            </span>
            <span className="text-xs text-on-surface-variant">
              Across Downtown Sat &amp; Pioneer Pavilion
            </span>
          </div>

          <div className="w-14 h-14 rounded-2xl bg-tertiary-fixed/40 flex items-center justify-center text-tertiary">
            <span className="material-symbols-outlined text-[32px]">rate_review</span>
          </div>
        </div>
      </div>

      {/* 3. Filter Buttons */}
      <div className="bg-surface-container-lowest p-space-sm rounded-2xl shadow-sm border border-outline-variant/30 flex items-center justify-between">
        <div className="flex items-center gap-1 p-1 bg-surface-container rounded-xl text-xs font-bold">
          <button
            type="button"
            onClick={() => setFilter('All')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              filter === 'All'
                ? 'bg-surface-container-lowest text-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            All Reviews ({counts.total})
          </button>
          <button
            type="button"
            onClick={() => setFilter('Unreplied')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              filter === 'Unreplied'
                ? 'bg-surface-container-lowest text-tertiary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Unreplied ({counts.unreplied})
          </button>
          <button
            type="button"
            onClick={() => setFilter('Replied')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              filter === 'Replied'
                ? 'bg-surface-container-lowest text-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Replied ({counts.replied})
          </button>
        </div>

        <span className="text-[11px] text-on-surface-variant pr-2 hidden sm:inline">
          Showing {filteredReviews.length} feedback items
        </span>
      </div>

      {/* 4. List of Review Cards */}
      <div className="flex flex-col gap-space-md">
        {filteredReviews.length === 0 ? (
          <div className="bg-surface-container-lowest p-16 rounded-2xl border border-outline-variant/30 text-center">
            <div className="w-16 h-16 rounded-full bg-surface-container mx-auto flex items-center justify-center mb-space-sm text-primary">
              <span className="material-symbols-outlined text-[32px]">reviews</span>
            </div>
            <h3 className="font-headline-sm text-on-surface font-bold text-base">
              No reviews yet.
            </h3>
            <p className="text-xs text-on-surface-variant mt-1">
              Shopper reviews for your produce will appear here once fulfilled.
            </p>
          </div>
        ) : (
          filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col gap-space-md"
            >
              {/* Review Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${rev.avatarBg}`}
                  >
                    {rev.avatar}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-headline-sm text-sm font-bold text-on-surface">
                      {rev.customer}
                    </span>
                    <span className="text-[11px] text-on-surface-variant">
                      Verified Stall Reservation • {rev.date}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-start sm:self-center">
                  <span className="px-2.5 py-1 rounded-full bg-surface-container text-on-surface font-label-sm text-[11px] font-bold">
                    {rev.product}
                  </span>
                  <div className="flex items-center gap-0.5 text-[#F28C28]">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`material-symbols-outlined text-[17px] ${
                          star <= rev.rating ? 'text-[#F28C28]' : 'text-outline-variant'
                        }`}
                      >
                        star
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Review Comment */}
              <p className="font-body-md text-xs text-on-surface leading-relaxed pl-1 border-l-2 border-primary/40">
                "{rev.comment}"
              </p>

              {/* Existing Farmer Reply (Indented) */}
              {rev.farmerReply && (
                <div className="ml-6 sm:ml-10 p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/30 flex flex-col gap-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-bold text-primary">
                      <span className="material-symbols-outlined text-[16px]">reply</span>
                      <span>Response from Green Pastures Organic</span>
                      <span className="text-[10px] text-on-surface-variant font-normal">
                        ({rev.replyDate})
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleOpenReply(rev)}
                      className="text-primary hover:underline text-[11px] font-bold cursor-pointer"
                    >
                      Edit Reply
                    </button>
                  </div>
                  <p className="text-on-surface-variant leading-relaxed">
                    {rev.farmerReply}
                  </p>
                </div>
              )}

              {/* Reply Trigger or Inline Composer */}
              {replyingToId === rev.id ? (
                <div className="mt-2 p-3 rounded-xl bg-surface-container-low border border-primary/40 flex flex-col gap-2 animate-fade-in text-xs">
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-primary">
                      {rev.farmerReply ? 'Edit Your Reply' : 'Reply to ' + rev.customer}
                    </span>
                    <button
                      type="button"
                      onClick={() => setReplyingToId(null)}
                      className="text-on-surface-variant hover:text-on-surface"
                    >
                      ✕
                    </button>
                  </div>

                  <textarea
                    rows={3}
                    autoFocus
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write a polite, personal message thanking the customer..."
                    className="p-2.5 bg-surface-container-lowest rounded-lg border border-outline-variant/40 focus:ring-2 focus:ring-primary focus:outline-none resize-none text-xs"
                  ></textarea>

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setReplyingToId(null)}
                      className="px-3 py-1.5 rounded-lg bg-surface-container font-bold text-xs cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSaveReply(rev.id)}
                      className="px-4 py-1.5 rounded-lg bg-primary text-on-primary font-bold text-xs cursor-pointer shadow-sm"
                    >
                      Publish Reply
                    </button>
                  </div>
                </div>
              ) : (
                !rev.farmerReply && (
                  <div className="flex justify-end pt-1">
                    <button
                      type="button"
                      onClick={() => handleOpenReply(rev)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-bold text-xs transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">reply</span>
                      <span>Reply to Customer</span>
                    </button>
                  </div>
                )
              )}
            </div>
          ))
        )}
      </div>

    </div>
  );
}
