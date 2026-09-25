import React, { useState, useMemo, useEffect } from 'react';
import customerApi from '../api/customer';

export default function CustomerOrders({ onNavigate, showToast, onAddToCart }) {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [viewOrderDetail, setViewOrderDetail] = useState(null);
  const [cancelModalOrder, setCancelModalOrder] = useState(null);
  const [reviewModalOrder, setReviewModalOrder] = useState(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });

  // Customer Orders Dataset (Elena Rostova)
  const [orders, setOrders] = useState([
    {
      id: '#ML-8920',
      farmer: 'Green Pastures Organic',
      stallLocation: 'Pioneer Pavilion • Stall #08',
      farmerPhone: '(503) 555-0471',
      farmerEmail: 'marcus@greenpastures.bio',
      itemsSummary: '4 lbs Brandywine Tomatoes, 2 bunches Chard, 2 basil',
      itemsList: [
        { name: 'Heirloom Brandywine Tomatoes', qty: '4 lbs', unitPrice: '$4.50', total: '$18.00' },
        { name: 'Rainbow Swiss Chard & Lacinato Kale', qty: '2 bunches', unitPrice: '$3.75', total: '$7.50' },
        { name: 'Sweet Italian Genovese Basil', qty: '2 bunches', unitPrice: '$2.50', total: '$5.00' },
        { name: 'Stall Packing & Crate Deposit', qty: '1 unit', unitPrice: '$3.50', total: '$3.50' }
      ],
      pickupDate: 'Saturday, Oct 18, 2025',
      pickupSlot: '9:30 AM – 11:00 AM',
      market: 'Pioneer Pavilion Heritage Market',
      totalAmount: '$34.00',
      status: 'Placed',
      cutoffPassed: false,
      cutoffText: 'Cutoff: Friday 8:00 PM (12 hrs remaining)',
      timeline: [
        { time: 'Friday 6:15 PM', title: 'Reservation Placed', desc: 'Pre-order voucher submitted online.' },
        { time: 'Awaiting', title: 'Farmer Acceptance', desc: 'Marcus & Sarah Thorne will pack fresh at harvest.' }
      ]
    },
    {
      id: '#ML-8918',
      farmer: 'Mountain View Orchard & Cider',
      stallLocation: 'Riverside Waterfront • Pier 4',
      farmerPhone: '(503) 555-0612',
      farmerEmail: 'cider@mountainview.farms',
      itemsSummary: '1 gal Fresh Apple Cider, 4 lbs Honeycrisp',
      itemsList: [
        { name: 'Cold-Pressed Sweet Apple Cider (1 Gal)', qty: '1 jug', unitPrice: '$11.00', total: '$11.00' },
        { name: 'Honeycrisp Orchard Apples', qty: '4 lbs', unitPrice: '$3.20', total: '$12.80' }
      ],
      pickupDate: 'Saturday, Oct 18, 2025',
      pickupSlot: '10:00 AM – 11:30 AM',
      market: 'Riverside Twilight Market',
      totalAmount: '$23.80',
      status: 'Ready for Pickup',
      cutoffPassed: true,
      cutoffText: 'Cutoff passed (Crate packed)',
      timeline: [
        { time: 'Thursday 2:30 PM', title: 'Reservation Placed', desc: 'Submitted by Elena' },
        { time: 'Friday 4:00 PM', title: 'Accepted by Farmer', desc: 'Cider bottled fresh from press' },
        { time: 'Saturday 7:45 AM', title: 'Ready for Pickup', desc: 'Crate staged at Pier 4 table #2' }
      ]
    },
    {
      id: '#ML-8841',
      farmer: 'Miller & Stone Hearth Bakery',
      stallLocation: 'Downtown Saturday Market • Space 19',
      farmerPhone: '(503) 555-0211',
      farmerEmail: 'david@stonehearthbreads.com',
      itemsSummary: '2 Country Sourdough Boules, 1 Brioche Bun 4-pack',
      itemsList: [
        { name: 'Artisan Sourdough Country Loaf', qty: '2 loaves', unitPrice: '$7.50', total: '$15.00' },
        { name: 'Golden Brioche Buns (4-pack)', qty: '1 pack', unitPrice: '$6.50', total: '$6.50' }
      ],
      pickupDate: 'Saturday, Oct 11, 2025',
      pickupSlot: '8:30 AM – 10:00 AM',
      market: 'Downtown Saturday Market',
      totalAmount: '$21.50',
      status: 'Completed',
      cutoffPassed: true,
      hasReviewed: true,
      timeline: [
        { time: 'Oct 10, 5:00 PM', title: 'Order Placed', desc: 'Reserved prior to Friday bake' },
        { time: 'Oct 11, 8:45 AM', title: 'Collected & Paid', desc: 'Paid $21.50 in cash at table 19' }
      ]
    },
    {
      id: '#ML-8712',
      farmer: 'Riverbend Goat Dairy',
      stallLocation: 'River District • Lot 14-B',
      farmerPhone: '(503) 555-0192',
      farmerEmail: 'dale@riverbenddairy.local',
      itemsSummary: '2 tubs Herbed Chèvre Curd, 1 pt Raw Goat Milk',
      itemsList: [
        { name: 'Artisan Herbed Goat Chèvre (8oz)', qty: '2 tubs', unitPrice: '$9.00', total: '$18.00' },
        { name: 'Fresh Jersey Goat Milk (1 Pint)', qty: '1 bottle', unitPrice: '$5.50', total: '$5.50' }
      ],
      pickupDate: 'Saturday, Oct 04, 2025',
      pickupSlot: '9:00 AM – 10:30 AM',
      market: 'River District Sat',
      totalAmount: '$23.50',
      status: 'Completed',
      cutoffPassed: true,
      hasReviewed: false,
      timeline: [
        { time: 'Oct 03, 1:15 PM', title: 'Order Placed', desc: 'Submitted online' },
        { time: 'Oct 04, 9:20 AM', title: 'Collected & Paid', desc: 'Voucher verified, card charged at stall' }
      ]
    },
    {
      id: '#ML-8650',
      farmer: 'Whispering Pines Organic Herbs',
      stallLocation: 'Oak Valley • Space 3',
      farmerPhone: '(503) 555-0912',
      farmerEmail: 'eleanor@whisperingpines.farms',
      itemsSummary: '3 bundles French Tarragon & Rosemary',
      itemsList: [
        { name: 'Fresh French Culinary Tarragon', qty: '2 bundles', unitPrice: '$3.50', total: '$7.00' },
        { name: 'Organic Tuscan Rosemary', qty: '1 bundle', unitPrice: '$3.00', total: '$3.00' }
      ],
      pickupDate: 'Sunday, Sep 28, 2025',
      pickupSlot: '10:00 AM – 11:30 AM',
      market: 'Oak Valley Sunday Bazaar',
      totalAmount: '$10.00',
      status: 'Cancelled',
      cutoffPassed: true,
      timeline: [
        { time: 'Sep 27, 4:00 PM', title: 'Order Placed', desc: 'Customer reservation' },
        { time: 'Sep 27, 7:10 PM', title: 'Cancelled by Customer', desc: 'Before harvest cutoff' }
      ]
    }
  ]);

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
  useEffect(() => {
    customerApi.getOrders()
      .then((res) => {
        if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
          const mapped = res.data.map((o) => {
            let uiStatus = 'Placed';
            if (o.order_status === 'accepted') uiStatus = 'Accepted';
            else if (o.order_status === 'ready' || o.order_status === 'ready_for_pickup') uiStatus = 'Ready for Pickup';
            else if (o.order_status === 'completed') uiStatus = 'Completed';
            else if (o.order_status === 'cancelled') uiStatus = 'Cancelled';

            const itemsList = (o.items || []).map((it) => ({
              name: it.product_name || it.product?.name || 'Produce Item',
              qty: `${it.quantity} ${it.unit || ''}`,
              unitPrice: `$${Number(it.unit_price).toFixed(2)}`,
              total: `$${Number(it.subtotal).toFixed(2)}`
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
              totalAmount: `$${Number(o.total_amount).toFixed(2)}`,
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
        }
      })
      .catch((err) => console.warn('Could not load customer orders:', err));
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

  return (
    <div className="px-gutter py-space-lg max-w-7xl mx-auto w-full flex flex-col gap-space-lg animate-fade-in">
      
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
      {viewOrderDetail && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full p-space-lg shadow-2xl flex flex-col gap-space-md border border-outline-variant/40 my-8 text-xs">
            
            {/* Header */}
            <div className="flex items-start justify-between border-b border-outline-variant/20 pb-space-sm">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-headline-sm text-on-surface font-bold text-lg">
                    Voucher Slip {viewOrderDetail.id}
                  </h3>
                  {renderStatusBadge(viewOrderDetail.status)}
                </div>
                <span className="text-[11px] text-on-surface-variant">
                  {viewOrderDetail.pickupDate} • {viewOrderDetail.pickupSlot}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setViewOrderDetail(null)}
                className="p-1 text-on-surface-variant hover:text-on-surface rounded-lg cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Farmer Contact Info */}
            <div className="p-3 bg-surface-container-low rounded-xl flex flex-col gap-1 border border-outline-variant/20">
              <span className="text-[10px] uppercase font-bold text-on-surface-variant">Grower Stand</span>
              <div className="flex justify-between font-bold">
                <span className="text-on-surface">{viewOrderDetail.farmer}</span>
                <span className="text-primary">{viewOrderDetail.farmerPhone}</span>
              </div>
              <span className="text-on-surface-variant">{viewOrderDetail.market} ({viewOrderDetail.stallLocation})</span>
            </div>

            {/* Items List */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] uppercase font-bold text-on-surface-variant">Items Reserved</span>
              <div className="border border-outline-variant/30 rounded-xl overflow-hidden divide-y divide-surface-container-high/60">
                {viewOrderDetail.itemsList.map((it, idx) => (
                  <div key={idx} className="p-2.5 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-on-surface">{it.name}</span>
                      <span className="text-on-surface-variant text-[11px] block">
                        {it.qty} @ {it.unitPrice}
                      </span>
                    </div>
                    <span className="font-mono font-bold text-primary">{it.total}</span>
                  </div>
                ))}
                <div className="p-2.5 bg-surface-container/40 flex items-center justify-between font-bold">
                  <span>Estimated Total Due at Stall</span>
                  <span className="font-mono text-base text-primary">{viewOrderDetail.totalAmount}</span>
                </div>
              </div>
            </div>

            {/* In-Person Payment Reminder */}
            <div className="p-2.5 rounded-xl bg-primary-fixed/40 border border-primary/20 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">payments</span>
              <span className="font-bold text-on-primary-fixed text-[11px]">
                Pay in person at pickup (Cash, Card, and SNAP matching tokens accepted).
              </span>
            </div>

            {/* Pickup Location Map Placeholder */}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase font-bold text-on-surface-variant">Pickup Location Map</span>
              <div className="relative w-full h-32 rounded-xl bg-surface-container-high border border-outline-variant/40 overflow-hidden flex flex-col items-center justify-center p-3">
                <div
                  className="absolute inset-0 opacity-15 pointer-events-none"
                  style={{
                    backgroundImage: 'radial-gradient(circle, #2E6B3A 1px, transparent 1px)',
                    backgroundSize: '16px 16px'
                  }}
                ></div>
                <div className="relative z-10 flex flex-col items-center animate-bounce">
                  <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-md">
                    <span className="material-symbols-outlined text-[18px]">place</span>
                  </div>
                </div>
                <span className="relative z-10 mt-1 font-bold text-on-surface text-[11px]">
                  {viewOrderDetail.stallLocation}
                </span>
                <span className="relative z-10 text-[10px] text-on-surface-variant">
                  {viewOrderDetail.market}
                </span>
              </div>
            </div>

            {/* Audit Timeline */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] uppercase font-bold text-on-surface-variant">Order Timeline</span>
              <div className="flex flex-col gap-1.5 pl-2 border-l-2 border-primary/30">
                {viewOrderDetail.timeline.map((ev, idx) => (
                  <div key={idx} className="flex flex-col text-[11px]">
                    <span className="font-bold text-on-surface">{ev.title} ({ev.time})</span>
                    <span className="text-on-surface-variant">{ev.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end pt-2 border-t border-outline-variant/20">
              <button
                type="button"
                onClick={() => setViewOrderDetail(null)}
                className="px-space-md py-2 rounded-xl bg-primary text-on-primary font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: CANCEL ORDER CONFIRMATION                        */}
      {/* ======================================================== */}
      {cancelModalOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-surface-container-lowest rounded-2xl max-w-sm w-full p-space-lg shadow-2xl flex flex-col gap-space-md border border-outline-variant/40 text-xs">
            <div className="flex items-center gap-2.5 text-error">
              <span className="material-symbols-outlined text-[24px]">cancel</span>
              <h3 className="font-headline-sm text-on-surface font-bold text-base">
                Cancel Pre-Order?
              </h3>
            </div>
            <p className="text-on-surface-variant leading-relaxed">
              Are you sure you want to cancel Order <strong className="text-on-surface font-bold">{cancelModalOrder.id}</strong> with <strong className="text-on-surface font-bold">{cancelModalOrder.farmer}</strong>? This reservation will be released back to the farmer.
            </p>
            <div className="flex justify-end gap-2 pt-2 border-t border-outline-variant/20">
              <button
                type="button"
                onClick={() => setCancelModalOrder(null)}
                className="px-3.5 py-1.5 rounded-lg bg-surface-container font-bold cursor-pointer"
              >
                Keep Order
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                className="px-4 py-1.5 rounded-lg bg-error text-on-error font-bold cursor-pointer"
              >
                Cancel Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: LEAVE A REVIEW                                   */}
      {/* ======================================================== */}
      {reviewModalOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-space-lg shadow-2xl flex flex-col gap-space-md border border-outline-variant/40 text-xs">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-space-sm">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#F28C28] text-[20px]">star</span>
                <h3 className="font-headline-sm text-on-surface font-bold text-base">
                  Leave a Review
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setReviewModalOrder(null)}
                className="p-1 text-on-surface-variant hover:text-on-surface rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="flex flex-col gap-space-md">
              <div className="flex flex-col gap-1">
                <span className="font-bold text-on-surface">Grower: {reviewModalOrder.farmer}</span>
                <span className="text-[11px] text-on-surface-variant">{reviewModalOrder.itemsSummary}</span>
              </div>

              {/* Star Rating Select */}
              <div className="flex flex-col gap-1">
                <label className="font-bold text-on-surface">Your Rating:</label>
                <div className="flex items-center gap-1 text-[#F28C28]">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                      className="cursor-pointer transition-transform hover:scale-125"
                    >
                      <span className={`material-symbols-outlined text-[24px] ${
                        star <= reviewForm.rating ? 'text-[#F28C28]' : 'text-outline-variant'
                      }`}>
                        star
                      </span>
                    </button>
                  ))}
                  <span className="ml-2 font-bold text-on-surface text-xs">{reviewForm.rating} of 5 Stars</span>
                </div>
              </div>

              {/* Comment */}
              <div className="flex flex-col gap-1">
                <label className="font-bold text-on-surface">Your Feedback *</label>
                <textarea
                  rows={4}
                  required
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  placeholder="Tell other market shoppers about the taste, freshness, and stall pickup experience..."
                  className="p-2.5 bg-surface-container-low rounded-xl border border-outline-variant/40 focus:ring-2 focus:ring-primary focus:outline-none resize-none"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-outline-variant/20">
                <button
                  type="button"
                  onClick={() => setReviewModalOrder(null)}
                  className="px-space-md py-2 rounded-xl bg-surface-container text-on-surface font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-space-lg py-2 rounded-xl bg-primary text-on-primary font-bold shadow-sm cursor-pointer"
                >
                  Post Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
