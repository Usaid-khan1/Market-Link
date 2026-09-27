import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import customerApi from '../api/customer';
import PageLoader from './PageLoader';

export default function CustomerOrders({ onNavigate, showToast, onAddToCart }) {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [viewOrderDetail, setViewOrderDetail] = useState(null);
  const [cancelModalOrder, setCancelModalOrder] = useState(null);
  const [reviewModalOrder, setReviewModalOrder] = useState(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });

  // Lock body scroll and handle Escape key when modals are open
  useEffect(() => {
    if (viewOrderDetail || cancelModalOrder || reviewModalOrder) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (viewOrderDetail) setViewOrderDetail(null);
        if (cancelModalOrder) setCancelModalOrder(null);
        if (reviewModalOrder) setReviewModalOrder(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [viewOrderDetail, cancelModalOrder, reviewModalOrder]);

  // Customer Orders Dataset
  const [orders, setOrders] = useState([]);

  const tabs = ['All', 'Placed', 'Accepted', 'Ready for Pickup', 'Completed', 'Cancelled'];

  // Counts
  const tabCounts = useMemo(() => {
    const counts = { All: orders.length };
    tabs.forEach((t) => {
      if (t !== 'All') {
        counts[t] = orders.filter((o) => o.status === t).length;
      }
    });
    return counts;
  }, [orders]);

  // Filtered
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchTab = activeTab === 'All' || o.status === activeTab;
      const matchSearch =
        o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.farmer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.itemsSummary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.market.toLowerCase().includes(searchQuery.toLowerCase());
      return matchTab && matchSearch;
    });
  }, [orders, activeTab, searchQuery]);

  // Status Badge Helper
  const renderStatusBadge = (status) => {
    switch (status) {
      case 'Placed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#e0f2fe] text-[#0369a1] font-label-sm text-[11px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0284c7] animate-pulse"></span>
            Placed
          </span>
        );
      case 'Accepted':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#ffedd5] text-[#c2410c] font-label-sm text-[11px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F28C28]"></span>
            Accepted
          </span>
        );
      case 'Ready for Pickup':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#ecfccb] text-[#3f6212] font-label-sm text-[11px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8BC34A] animate-ping"></span>
            Ready for Pickup
          </span>
        );
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-[11px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
            Completed
          </span>
        );
      case 'Cancelled':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-error-container text-on-error-container font-label-sm text-[11px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-error"></span>
            Cancelled
          </span>
        );
    }
  };

  // Load customer orders from backend
  const fetchCustomerOrders = () => {
    setLoading(true);
    customerApi.getOrders()
      .then((res) => {
        if (res?.data && Array.isArray(res.data)) {
          const mapped = res.data.map((o) => {
            let uiStatus = 'Placed';
            if (o.order_status === 'accepted') uiStatus = 'Accepted';
            else if (o.order_status === 'ready' || o.order_status === 'ready_for_pickup') uiStatus = 'Ready for Pickup';
            else if (o.order_status === 'completed') uiStatus = 'Completed';
            else if (o.order_status === 'cancelled') uiStatus = 'Cancelled';

            const itemsList = (o.items || []).map((it) => ({
              name: it.product_name || it.product?.name || 'Produce Item',
              qty: `${it.quantity} ${it.unit || ''}`,
              unitPrice: `$${Number(it.unit_price || 0).toFixed(2)}`,
              total: `$${Number(it.subtotal || 0).toFixed(2)}`
            }));

            const itemsSummary = itemsList.map((it) => `${it.qty} ${it.name}`).join(', ') || 'Market Pre-Order';

            return {
              id: `#ML-${o.id}`,
              numericId: o.id,
              farmerId: o.farmer_id,
              farmer: o.farmer?.farmer_profile?.stall_name || o.farmer?.name || 'Local Farm',
              stallLocation: o.farmer?.farmer_profile?.address || 'Designated Stand',
              farmerPhone: o.farmer?.phone || '(503) 555-0100',
              farmerEmail: o.farmer?.email || 'farmer@marketlink.test',
              itemsSummary,
              itemsList,
              pickupDate: o.pickup_date || 'Saturday',
              pickupSlot: o.pickup_time || '9:30 AM – 11:00 AM',
              market: o.market?.market_name || 'Downtown Saturday Market',
              totalAmount: `$${Number(o.total_amount || 0).toFixed(2)}`,
              status: uiStatus,
              cutoffPassed: false,
              cutoffText: 'Cutoff: Friday 8:00 PM',
              hasReviewed: Boolean(o.review),
              timeline: [
                { time: o.created_at ? new Date(o.created_at).toLocaleTimeString() : 'Recent', title: 'Reservation Placed', desc: 'Pre-order submitted online.' }
              ]
            };
          });
          setOrders(mapped);
        } else {
          setOrders([]);
        }
      })
      .catch((err) => {
        console.warn('Could not load customer orders:', err);
        setOrders([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCustomerOrders();

    const handleOrdersSync = () => {
      fetchCustomerOrders();
    };

    window.addEventListener('marketlink:order-created', handleOrdersSync);
    window.addEventListener('marketlink:order-updated', handleOrdersSync);

    return () => {
      window.removeEventListener('marketlink:order-created', handleOrdersSync);
      window.removeEventListener('marketlink:order-updated', handleOrdersSync);
    };
  }, []);

  // Cancel Order Handler
  const handleConfirmCancel = async () => {
    if (!cancelModalOrder) return;
    const orderIdToCancel = cancelModalOrder.numericId || parseInt(String(cancelModalOrder.id).replace(/\D/g, '')) || 1;

    try {
      await customerApi.cancelOrder(orderIdToCancel);
    } catch (err) {
      console.warn('API cancelOrder error:', err);
    }

    setOrders((prev) =>
      prev.map((o) =>
        o.id === cancelModalOrder.id
          ? {
              ...o,
              status: 'Cancelled',
              timeline: [
                { time: 'Just now', title: 'Cancelled by Customer', desc: 'Reservation released back to grower.' },
                ...o.timeline
              ]
            }
          : o
      )
    );
    showToast?.(`Reservation ${cancelModalOrder.id} has been cancelled.`);
    setCancelModalOrder(null);
  };

  // Reorder Handler
  const handleReorder = async (order) => {
    const orderIdToReorder = order.numericId || parseInt(String(order.id).replace(/\D/g, '')) || 1;
    try {
      await customerApi.reorder(orderIdToReorder);
    } catch (err) {
      console.warn('API reorder call:', err);
    }

    order.itemsList.forEach((it) => {
      onAddToCart?.({
        id: `reord-${it.name}`,
        name: it.name,
        price: it.unitPrice,
        farmer: order.farmer,
        quantity: 1
      });
    });
    showToast?.(`Items from ${order.id} reordered & added to your cart!`);
  };

  // Submit Review Handler
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewForm.comment.trim()) return;

    const orderIdToReview = reviewModalOrder.numericId || parseInt(String(reviewModalOrder.id).replace(/\D/g, '')) || 1;

    try {
      await customerApi.createReview({
        order_id: orderIdToReview,
        farmer_id: reviewModalOrder.farmerId || 1,
        rating: reviewForm.rating,
        comment: reviewForm.comment.trim()
      });
    } catch (err) {
      console.warn('API createReview error:', err);
    }

    setOrders((prev) =>
      prev.map((o) =>
        o.id === reviewModalOrder.id ? { ...o, hasReviewed: true } : o
      )
    );
    showToast?.(`Review published for ${reviewModalOrder.farmer}!`);
    setReviewModalOrder(null);
    setReviewForm({ rating: 5, comment: '' });
  };

  if (loading) {
    return (
      <PageLoader
        title="Loading Your Orders & Reservations..."
        subtitle="Retrieving active harvest orders, pickup dates, and digital vouchers..."
        minHeight="min-h-[70vh]"
      />
    );
  }

  return (
    <div className="px-3 sm:px-6 lg:px-gutter py-4 sm:py-space-lg max-w-7xl mx-auto w-full flex flex-col gap-space-lg animate-fade-in">
      
      {/* 1. Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-space-xs text-on-surface-variant font-label-sm text-xs">
            <span>MY ACCOUNT</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-primary font-bold">RESERVATIONS &amp; ORDERS</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg sm:text-3xl text-on-surface tracking-tight font-bold">
            My Orders
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant text-xs sm:text-sm">
            View your upcoming stall pickups, voucher slips, order histories, and leave grower reviews.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('products')}
          className="inline-flex items-center gap-2 px-space-md py-2.5 rounded-xl bg-primary text-on-primary font-label-md text-xs font-bold hover:bg-primary-container transition-colors shadow-sm cursor-pointer self-start sm:self-auto"
        >
          <span className="material-symbols-outlined text-[18px]">storefront</span>
          <span>Browse Fresh Markets</span>
        </button>
      </div>

      {/* 2. Filter Tabs Strip & Search */}
      <div className="bg-surface-container-lowest p-space-sm rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col sm:flex-row items-center justify-between gap-space-sm">
        
        {/* Tab Pills */}
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto p-1 bg-surface-container rounded-xl">
          {tabs.map((tab) => {
            const isCurrent = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-label-md text-xs font-bold transition-all cursor-pointer shrink-0 ${
                  isCurrent
                    ? 'bg-surface-container-lowest text-primary shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span>{tab}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                    isCurrent
                      ? 'bg-primary-fixed text-on-primary-fixed'
                      : 'bg-surface-container-high text-on-surface-variant'
                  }`}
                >
                  {tabCounts[tab]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64 flex items-center pr-2">
          <span className="material-symbols-outlined absolute left-2.5 text-on-surface-variant text-[17px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search order ID, farmer..."
            className="w-full pl-8 pr-3 py-1.5 bg-surface-container-low rounded-xl font-body-sm text-xs text-on-surface placeholder:text-on-surface-variant/70 focus:outline-none focus:ring-1 focus:ring-primary border border-outline-variant/30"
          />
        </div>
      </div>

      {/* 3. Orders Data Table */}
      <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 overflow-hidden flex flex-col">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-surface-container/60 text-on-surface-variant font-label-sm text-[11px] uppercase tracking-wider border-b border-outline-variant/20">
                <th className="py-3.5 px-space-md" scope="col">Order ID</th>
                <th className="py-3.5 px-space-md" scope="col">Farmer &amp; Stall</th>
                <th className="py-3.5 px-space-md" scope="col">Items Reserved</th>
                <th className="py-3.5 px-space-md" scope="col">Pickup Date &amp; Slot</th>
                <th className="py-3.5 px-space-md" scope="col">Total Due</th>
                <th className="py-3.5 px-space-md" scope="col">Status</th>
                <th className="py-3.5 px-space-md text-right" scope="col">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-high/50 text-on-surface text-xs">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-on-surface-variant">
                    <div className="w-16 h-16 rounded-full bg-surface-container mx-auto flex items-center justify-center mb-space-sm text-primary">
                      <span className="material-symbols-outlined text-[32px]">shopping_basket</span>
                    </div>
                    <h3 className="font-headline-sm text-on-surface font-bold text-base">
                      No orders yet — start browsing markets.
                    </h3>
                    <p className="text-xs text-on-surface-variant mt-1 mb-space-md max-w-sm mx-auto">
                      Reserve fresh seasonal crops from local growers and pick them up directly at weekend market stalls.
                    </p>
                    <button
                      type="button"
                      onClick={() => onNavigate('products')}
                      className="px-space-md py-2 rounded-xl bg-primary text-on-primary font-bold shadow-sm cursor-pointer"
                    >
                      Browse Seasonal Produce
                    </button>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => {
                  const isFinished = ord.status === 'Completed' || ord.status === 'Cancelled';
                  const canCancel = !isFinished && !ord.cutoffPassed;

                  return (
                    <tr key={ord.id} className="hover:bg-surface-container-low/60 transition-colors">
                      {/* Order ID */}
                      <td className="py-3.5 px-space-md font-mono font-bold text-primary">
                        <button
                          type="button"
                          onClick={() => setViewOrderDetail(ord)}
                          className="hover:underline cursor-pointer"
                        >
                          {ord.id}
                        </button>
                      </td>

                      {/* Farmer */}
                      <td className="py-3.5 px-space-md">
                        <div className="flex flex-col">
                          <span className="font-bold text-on-surface">{ord.farmer}</span>
                          <span className="text-[11px] text-on-surface-variant flex items-center gap-1">
                            <span className="material-symbols-outlined text-[12px] text-primary">place</span>
                            {ord.stallLocation}
                          </span>
                        </div>
                      </td>

                      {/* Items */}
                      <td className="py-3.5 px-space-md max-w-[220px]">
                        <span className="font-medium text-on-surface line-clamp-1" title={ord.itemsSummary}>
                          {ord.itemsSummary}
                        </span>
                      </td>

                      {/* Pickup Date & Slot */}
                      <td className="py-3.5 px-space-md">
                        <div className="flex flex-col">
                          <span className="font-bold text-on-surface">{ord.pickupDate}</span>
                          <span className="text-[11px] text-on-surface-variant flex items-center gap-1">
                            <span className="material-symbols-outlined text-[13px] text-tertiary">schedule</span>
                            {ord.pickupSlot}
                          </span>
                        </div>
                      </td>

                      {/* Total Amount */}
                      <td className="py-3.5 px-space-md font-bold text-primary font-mono text-sm">
                        {ord.totalAmount}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-space-md">
                        {renderStatusBadge(ord.status)}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-space-md text-right">
                        <div className="inline-flex items-center gap-1.5 justify-end">
                          
                          {/* View Details */}
                          <button
                            type="button"
                            onClick={() => setViewOrderDetail(ord)}
                            className="px-2.5 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-xs transition-colors cursor-pointer"
                          >
                            View Details
                          </button>

                          {/* Completed Actions: Reorder & Leave Review */}
                          {ord.status === 'Completed' && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleReorder(ord)}
                                className="px-2.5 py-1.5 rounded-lg bg-secondary-fixed text-on-secondary-fixed-variant hover:bg-secondary-fixed-dim font-bold text-xs cursor-pointer shadow-sm"
                                title="Add items to cart again"
                              >
                                Reorder
                              </button>

                              {!ord.hasReviewed ? (
                                <button
                                  type="button"
                                  onClick={() => setReviewModalOrder(ord)}
                                  className="px-2.5 py-1.5 rounded-lg bg-tertiary-fixed text-on-tertiary-fixed hover:bg-tertiary hover:text-white font-bold text-xs cursor-pointer"
                                >
                                  ★ Review
                                </button>
                              ) : (
                                <span className="text-[10px] text-secondary font-bold px-1.5">
                                  ✓ Reviewed
                                </span>
                              )}
                            </>
                          )}

                          {/* Non-Completed Actions: Modify & Cancel (Subject to Cutoff) */}
                          {!isFinished && (
                            <>
                              {canCancel ? (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      showToast?.(`Modify Order opened for ${ord.id}. Contact farmer directly or update quantities.`);
                                      setViewOrderDetail(ord);
                                    }}
                                    className="px-2 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-xs cursor-pointer"
                                  >
                                    Modify
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setCancelModalOrder(ord)}
                                    className="px-2 py-1.5 rounded-lg bg-error-container/40 hover:bg-error-container text-error font-bold text-xs cursor-pointer"
                                  >
                                    Cancel
                                  </button>
                                </>
                              ) : (
                                <div className="inline-flex items-center gap-1 group relative">
                                  <button
                                    type="button"
                                    disabled
                                    className="px-2 py-1.5 rounded-lg bg-surface-container-low text-on-surface-variant/40 font-bold text-xs cursor-not-allowed"
                                  >
                                    Modify
                                  </button>
                                  <button
                                    type="button"
                                    disabled
                                    className="px-2 py-1.5 rounded-lg bg-surface-container-low text-error/40 font-bold text-xs cursor-not-allowed"
                                  >
                                    Cancel
                                  </button>
                                  <span className="hidden group-hover:block absolute bottom-full right-0 mb-1 px-2 py-1 bg-inverse-surface text-inverse-on-surface text-[10px] rounded shadow-lg whitespace-nowrap z-20">
                                    Cutoff time passed
                                  </span>
                                </div>
                              )}
                            </>
                          )}

                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-space-md bg-surface-container/40 flex items-center justify-between border-t border-outline-variant/20 text-xs">
          <span className="font-body-sm text-on-surface-variant">
            Showing <span className="font-bold text-on-surface">{filteredOrders.length}</span> orders
          </span>
          <span className="font-body-sm text-secondary font-bold flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">payments</span>
            100% In-Person Payment at Stall (Zero Online Fees)
          </span>
        </div>
      </div>

      {/* ======================================================== */}
      {/* MODAL: ORDER DETAILS & PICKUP MAP                       */}
      {/* ======================================================== */}
      {viewOrderDetail && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-[99999] flex items-center justify-center p-3 sm:p-6 overflow-hidden animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setViewOrderDetail(null);
          }}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full max-h-[88vh] shadow-[0_25px_70px_rgba(0,0,0,0.5)] flex flex-col border border-slate-200 overflow-hidden animate-bounce-in relative text-xs"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header (Fixed at top) */}
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 shrink-0 bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-xs">
                  <span className="material-symbols-outlined text-[22px]">receipt_long</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-headline-sm text-slate-900 font-bold text-base sm:text-lg">
                      Voucher Slip {viewOrderDetail.id}
                    </h3>
                    {renderStatusBadge(viewOrderDetail.status)}
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {viewOrderDetail.pickupDate} • {viewOrderDetail.pickupSlot}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setViewOrderDetail(null)}
                className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-800 hover:bg-slate-200/60 rounded-lg cursor-pointer transition-colors"
                title="Close"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="overflow-y-auto px-6 py-5 space-y-4 text-xs flex-1 bg-white">
              {/* Farmer Contact Info */}
              <div className="p-3.5 bg-slate-50 rounded-xl flex flex-col gap-1.5 border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-500">Grower Stand</span>
                <div className="flex justify-between items-center font-bold">
                  <span className="text-slate-900 text-sm">{viewOrderDetail.farmer}</span>
                  <span className="text-primary font-mono text-xs">{viewOrderDetail.farmerPhone}</span>
                </div>
                <span className="text-slate-600 text-xs">{viewOrderDetail.market} ({viewOrderDetail.stallLocation})</span>
              </div>

              {/* Items List */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] uppercase font-bold text-slate-500">Items Reserved</span>
                <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 shadow-2xs">
                  {viewOrderDetail.itemsList.map((it, idx) => (
                    <div key={idx} className="p-3 flex items-center justify-between bg-white hover:bg-slate-50/50 transition-colors">
                      <div>
                        <span className="font-bold text-slate-900">{it.name}</span>
                        <span className="text-slate-500 text-[11px] block mt-0.5">
                          {it.qty} @ {it.unitPrice}
                        </span>
                      </div>
                      <span className="font-mono font-bold text-primary text-sm">{it.total}</span>
                    </div>
                  ))}
                  <div className="p-3 bg-slate-50 flex items-center justify-between font-bold border-t border-slate-200">
                    <span className="text-slate-800">Estimated Total Due at Stall</span>
                    <span className="font-mono text-base text-primary font-black">{viewOrderDetail.totalAmount}</span>
                  </div>
                </div>
              </div>

              {/* In-Person Payment Reminder */}
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center gap-2.5">
                <span className="material-symbols-outlined text-primary text-[20px] shrink-0">payments</span>
                <span className="font-semibold text-emerald-900 text-[11px] leading-relaxed">
                  Pay in person at pickup (Cash, Card, and SNAP matching tokens accepted).
                </span>
              </div>

              {/* Pickup Location Map Placeholder */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] uppercase font-bold text-slate-500">Pickup Location Map</span>
                <div className="relative w-full h-32 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex flex-col items-center justify-center p-3">
                  <div
                    className="absolute inset-0 opacity-15 pointer-events-none"
                    style={{
                      backgroundImage: 'radial-gradient(circle, #2E6B3A 1px, transparent 1px)',
                      backgroundSize: '16px 16px'
                    }}
                  ></div>
                  <div className="relative z-10 flex flex-col items-center animate-bounce">
                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shadow-md">
                      <span className="material-symbols-outlined text-[18px]">place</span>
                    </div>
                  </div>
                  <span className="relative z-10 mt-1 font-bold text-slate-900 text-xs">
                    {viewOrderDetail.stallLocation}
                  </span>
                  <span className="relative z-10 text-[11px] text-slate-500">
                    {viewOrderDetail.market}
                  </span>
                </div>
              </div>

              {/* Audit Timeline */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] uppercase font-bold text-slate-500">Order Timeline</span>
                <div className="flex flex-col gap-2 pl-3 border-l-2 border-primary/40 ml-1">
                  {viewOrderDetail.timeline.map((ev, idx) => (
                    <div key={idx} className="flex flex-col text-[11px]">
                      <span className="font-bold text-slate-800">{ev.title} <span className="font-normal text-slate-500">({ev.time})</span></span>
                      <span className="text-slate-500 text-[10px]">{ev.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div className="flex justify-end px-6 py-3.5 border-t border-slate-200 shrink-0 bg-slate-50">
              <button
                type="button"
                onClick={() => setViewOrderDetail(null)}
                className="px-5 py-2.5 rounded-xl bg-primary text-white font-bold hover:bg-[#1b4d27] transition-all shadow-md active:scale-95 cursor-pointer text-xs"
              >
                Close Slip
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ======================================================== */}
      {/* MODAL: CANCEL ORDER CONFIRMATION                        */}
      {/* ======================================================== */}
      {cancelModalOrder && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-[99999] flex items-center justify-center p-4 animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setCancelModalOrder(null);
          }}
        >
          <div
            className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-[0_25px_70px_rgba(0,0,0,0.5)] flex flex-col gap-4 border border-slate-200 animate-bounce-in text-xs"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 text-error">
              <div className="w-10 h-10 rounded-full bg-error-container/40 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[24px] text-error">cancel</span>
              </div>
              <div>
                <h3 className="font-headline-sm text-slate-900 font-bold text-base">
                  Cancel Pre-Order?
                </h3>
                <span className="text-[11px] text-slate-500">Order {cancelModalOrder.id}</span>
              </div>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Are you sure you want to cancel Order <strong className="text-slate-900 font-bold">{cancelModalOrder.id}</strong> with <strong className="text-slate-900 font-bold">{cancelModalOrder.farmer}</strong>? This reservation will be released back to the farmer.
            </p>
            <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setCancelModalOrder(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-bold transition-colors cursor-pointer text-xs"
              >
                Keep Order
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                className="px-5 py-2 rounded-xl bg-error text-white font-bold hover:opacity-90 transition-opacity shadow-md cursor-pointer text-xs"
              >
                Cancel Order
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ======================================================== */}
      {/* MODAL: LEAVE A REVIEW                                   */}
      {/* ======================================================== */}
      {reviewModalOrder && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-[99999] flex items-center justify-center p-3 sm:p-6 overflow-hidden animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setReviewModalOrder(null);
          }}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full max-h-[88vh] shadow-[0_25px_70px_rgba(0,0,0,0.5)] flex flex-col border border-slate-200 overflow-hidden animate-bounce-in text-xs"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 shrink-0 bg-slate-50">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[#F28C28] text-[22px]">star</span>
                <h3 className="font-headline-sm text-slate-900 font-bold text-base">
                  Leave a Review
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setReviewModalOrder(null)}
                className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-800 hover:bg-slate-200/60 rounded-lg cursor-pointer transition-colors"
                title="Close"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="flex flex-col flex-1 min-h-0 overflow-hidden">
              <div className="overflow-y-auto px-6 py-5 space-y-4 text-xs flex-1 bg-white">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col gap-1">
                  <span className="font-bold text-slate-900">Grower: {reviewModalOrder.farmer}</span>
                  <span className="text-[11px] text-slate-500">{reviewModalOrder.itemsSummary}</span>
                </div>

                {/* Star Rating Select */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-800">Your Rating:</label>
                  <div className="flex items-center gap-1.5 text-[#F28C28]">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                        className="cursor-pointer transition-transform hover:scale-125 p-0.5"
                      >
                        <span className={`material-symbols-outlined text-[26px] ${
                          star <= reviewForm.rating ? 'text-[#F28C28] fill' : 'text-slate-300'
                        }`}>
                          star
                        </span>
                      </button>
                    ))}
                    <span className="ml-2 font-bold text-slate-800 text-xs">{reviewForm.rating} of 5 Stars</span>
                  </div>
                </div>

                {/* Comment */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-800">Your Feedback *</label>
                  <textarea
                    rows={4}
                    required
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                    placeholder="Tell other market shoppers about the taste, freshness, and stall pickup experience..."
                    className="p-3 bg-slate-50 rounded-xl border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none resize-none transition-all"
                  ></textarea>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 px-6 py-3.5 border-t border-slate-200 shrink-0 bg-slate-50">
                <button
                  type="button"
                  onClick={() => setReviewModalOrder(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-bold transition-colors cursor-pointer text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-primary text-white font-bold hover:bg-[#1b4d27] transition-all shadow-md active:scale-95 cursor-pointer text-xs"
                >
                  Post Review
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
}
