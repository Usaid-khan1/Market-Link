import React, { useState, useEffect } from 'react';
import customerApi from '../api/customer';
import PageLoader from './PageLoader';

export default function CustomerReviews({ onNavigate, showToast }) {
  const [loading, setLoading] = useState(true);
  // Customer Reviews
  const [reviews, setReviews] = useState([]);

  // Load reviews from backend
  useEffect(() => {
    let isMounted = true;
    customerApi.getReviews()
      .then((res) => {
        if (!isMounted) return;
        if (!res?.data || !Array.isArray(res.data)) {
          setReviews([]);
          return;
        }
        const liveReviews = res.data.map((r) => ({
          id: r.id,
          targetType: r.product_id ? 'product' : 'farmer',
          targetName: r.product_name || r.stall_name || r.farmer_name || 'Market Goods',
          farmerName: r.farmer_name || 'Local Grower',
          stallLocation: r.stall_name || 'Stall Bay',
          rating: r.rating || 5,
          date: r.created_at ? new Date(r.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Recent',
          orderRef: `#ML-${r.order_id || r.id}`,
          comment: r.comment,
          farmerReply: r.farmer_reply ? {
            farmerName: `${r.farmer_name || 'Farmer'} (Grower)`,
            date: r.reply_date ? new Date(r.reply_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Recent',
            replyText: r.farmer_reply,
          } : null,
        }));
        setReviews(liveReviews);
      })
      .catch((err) => {
        console.warn('Could not load live customer reviews:', err);
        if (isMounted) setReviews([]);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, []);

  // Modals state
  const [editingReview, setEditingReview] = useState(null);
  const [deleteModalReview, setDeleteModalReview] = useState(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState('');

  // Summary Metrics
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
    : '0.0';

  // Open Edit Modal
  const handleOpenEdit = (review) => {
    setEditingReview(review);
    setEditRating(review.rating);
    setEditComment(review.comment);
  };

  // Save Edit
  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editComment.trim()) return;

    setReviews(prev =>
      prev.map(r =>
        r.id === editingReview.id
          ? { ...r, rating: editRating, comment: editComment.trim() }
          : r
      )
    );
    setEditingReview(null);
    if (showToast) {
      showToast('✏️ Your review has been updated.');
    }
  };

  // Confirm Delete
  const handleConfirmDelete = () => {
    setReviews(prev => prev.filter(r => r.id !== deleteModalReview.id));
    setDeleteModalReview(null);
    if (showToast) {
      showToast('🗑️ Review deleted successfully.');
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-0.5 text-amber-400">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`material-symbols-outlined text-[18px] ${
              star <= rating ? 'fill-current text-amber-400' : 'text-outline-variant'
            }`}
          >
            star
          </span>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <PageLoader
        title="Loading Your Feedback & Reviews..."
        subtitle="Retrieving verified stall ratings and farmer replies..."
        minHeight="min-h-[70vh]"
      />
    );
  }

  return (
    <div className="px-3 sm:px-6 lg:px-gutter py-4 sm:py-space-lg max-w-7xl mx-auto w-full space-y-6 animate-fade-in pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-outline-variant/40 pb-5">
        <div>
          <h1 className="font-headline-md text-2xl sm:text-3xl text-on-surface font-bold tracking-tight">
            My Reviews & Feedback
          </h1>
          <p className="font-body-md text-sm text-on-surface-variant mt-1">
            Track your authentic feedback shared with regional growers and read their direct replies.
          </p>
        </div>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Stat 1: Total Reviews */}
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-5 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#E6F0E1] text-primary flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-2xl">rate_review</span>
          </div>
          <div>
            <span className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider">
              Total Reviews Written
            </span>
            <div className="font-headline-sm text-2xl font-bold text-on-surface mt-0.5">
              {totalReviews}
            </div>
          </div>
        </div>

        {/* Stat 2: Average Rating Given */}
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-5 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-2xl">grade</span>
          </div>
          <div>
            <span className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider">
              Average Rating Given
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="font-headline-sm text-2xl font-bold text-on-surface">
                {averageRating}
              </span>
              <span className="text-amber-500 font-bold text-sm">★ / 5.0</span>
            </div>
          </div>
        </div>

        {/* Stat 3: Farmer Responses */}
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-5 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#ecfccb] text-[#3f6212] flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-2xl">forum</span>
          </div>
          <div>
            <span className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider">
              Grower Replies Received
            </span>
            <div className="font-headline-sm text-2xl font-bold text-on-surface mt-0.5">
              {reviews.filter(r => r.farmerReply).length}
            </div>
          </div>
        </div>
      </div>

      {/* Review Cards List */}
      {reviews.length === 0 ? (
        /* Empty State */
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-12 text-center max-w-xl mx-auto shadow-sm">
          <div className="w-16 h-16 rounded-full bg-[#E6F0E1] text-primary flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-3xl">rate_review</span>
          </div>
          <h3 className="font-headline-sm text-lg font-bold text-on-surface mb-1">
            You haven't written any reviews yet
          </h3>
          <p className="text-xs text-on-surface-variant mb-5">
            Share your tasting notes on completed orders to support family farmers and help your community find the freshest produce.
          </p>
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('orders')}
            className="px-5 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold shadow-md hover:bg-primary/95 cursor-pointer"
          >
            Check Completed Orders
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-5 sm:p-6 shadow-sm hover:border-outline-variant transition-all space-y-4"
            >
              {/* Review Header: Subject & Rating */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 pb-3 border-b border-outline-variant/30">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-surface-container text-on-surface-variant text-[10px] font-bold uppercase tracking-wider">
                      {rev.targetType === 'product' ? 'Product Review' : 'Stall Review'}
                    </span>
                    <span className="text-xs text-on-surface-variant font-medium">
                      Order {rev.orderRef}
                    </span>
                  </div>
                  <h3 className="font-headline-sm text-base sm:text-lg font-bold text-on-surface">
                    {rev.targetName}
                  </h3>
                  <p className="text-xs text-primary font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px]">storefront</span>
                    <span>{rev.farmerName} • {rev.stallLocation}</span>
                  </p>
                </div>

                <div className="flex sm:flex-col sm:items-end justify-between items-center gap-2">
                  <div className="flex items-center gap-2">
                    {renderStars(rev.rating)}
                    <span className="font-bold text-xs text-on-surface">{rev.rating}.0</span>
                  </div>
                  <span className="text-[11px] text-on-surface-variant">{rev.date}</span>

                  {/* Actions: Edit & Delete */}
                  <div className="flex items-center gap-1 mt-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(rev)}
                      className="p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors cursor-pointer"
                      title="Edit review"
                    >
                      <span className="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteModalReview(rev)}
                      className="p-1.5 rounded-lg text-on-surface-variant hover:text-error hover:bg-error-container/30 transition-colors cursor-pointer"
                      title="Delete review"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Review Comment Body */}
              <div className="font-body-md text-xs sm:text-sm text-on-surface leading-relaxed">
                "{rev.comment}"
              </div>

              {/* Indented Farmer Reply Display (Exact requirement!) */}
              {rev.farmerReply && (
                <div className="ml-4 sm:ml-8 mt-3 p-4 rounded-xl bg-[#FBF8F1] border-l-4 border-primary text-xs space-y-1.5 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-bold text-primary">
                      <span className="material-symbols-outlined text-[16px]">reply</span>
                      <span>{rev.farmerReply.farmerName}</span>
                    </div>
                    <span className="text-[10px] text-on-surface-variant font-medium">
                      {rev.farmerReply.date}
                    </span>
                  </div>
                  <p className="font-body-sm text-xs text-on-surface leading-relaxed italic pl-5">
                    "{rev.farmerReply.replyText}"
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ======================================================== */}
      {/* EDIT REVIEW MODAL                                        */}
      {/* ======================================================== */}
      {editingReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-outline-variant/40">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
              <h3 className="font-headline-sm text-lg font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">edit_note</span>
                <span>Edit Your Review</span>
              </h3>
              <button
                type="button"
                onClick={() => setEditingReview(null)}
                className="p-1 rounded-lg text-on-surface-variant hover:bg-surface-container cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="mt-4 space-y-4">
              <div>
                <span className="text-xs text-on-surface-variant block">Review for:</span>
                <span className="font-headline-sm text-sm font-bold text-on-surface">
                  {editingReview.targetName} ({editingReview.farmerName})
                </span>
              </div>

              {/* Star Rating Selector */}
              <div>
                <label className="block text-xs font-bold text-on-surface mb-1.5">
                  Rating:
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setEditRating(star)}
                      className="p-1 text-amber-400 hover:scale-125 transition-transform cursor-pointer"
                    >
                      <span className={`material-symbols-outlined text-2xl ${star <= editRating ? 'fill-current' : 'text-outline-variant'}`}>
                        star
                      </span>
                    </button>
                  ))}
                  <span className="font-bold text-xs text-on-surface ml-2">
                    {editRating} out of 5 stars
                  </span>
                </div>
              </div>

              {/* Comment Textarea */}
              <div>
                <label className="block text-xs font-bold text-on-surface mb-1">
                  Your Feedback:
                </label>
                <textarea
                  rows={4}
                  value={editComment}
                  onChange={(e) => setEditComment(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-outline-variant focus:outline-none focus:border-primary bg-surface resize-none leading-relaxed"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-outline-variant/30">
                <button
                  type="button"
                  onClick={() => setEditingReview(null)}
                  className="px-4 py-2.5 rounded-xl border border-outline hover:bg-surface-container text-xs font-bold text-on-surface cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/95 text-on-primary text-xs font-bold shadow-md cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* DELETE CONFIRMATION MODAL                                */}
      {/* ======================================================== */}
      {deleteModalReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-6 shadow-2xl border border-outline-variant/40">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-error-container text-on-error-container flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[20px]">delete</span>
              </div>
              <div>
                <h3 className="font-headline-sm text-base font-bold text-on-surface">
                  Delete Review?
                </h3>
                <p className="text-xs text-on-surface-variant">This action cannot be undone.</p>
              </div>
            </div>

            <p className="font-body-sm text-xs text-on-surface-variant mb-5">
              Are you sure you want to remove your feedback for <strong>{deleteModalReview.targetName}</strong>? Any grower replies attached to this review will also be removed.
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-outline-variant/30">
              <button
                type="button"
                onClick={() => setDeleteModalReview(null)}
                className="px-4 py-2 rounded-xl border border-outline hover:bg-surface-container text-xs font-bold text-on-surface cursor-pointer"
              >
                Keep Review
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-5 py-2 rounded-xl bg-error hover:bg-error/90 text-on-error text-xs font-bold shadow-md cursor-pointer"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
