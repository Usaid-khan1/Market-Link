import React, { useState } from 'react';

export default function CustomerCart({ onNavigate, showToast, onCartUpdated }) {
  // Realistic initial cart items grouped across two local farm stalls
  const [cartItems, setCartItems] = useState([
    {
      id: 'c-1',
      farmerId: 'f-green-pastures',
      farmerName: 'Green Pastures Organic',
      stallLocation: 'Pioneer Pavilion • Stall #08',
      pickupSlots: [
        'Saturday, Oct 18 • 9:30 AM – 11:00 AM',
        'Saturday, Oct 18 • 11:00 AM – 12:30 PM',
        'Sunday, Oct 19 • 10:00 AM – 11:30 AM'
      ],
      selectedSlot: 'Saturday, Oct 18 • 9:30 AM – 11:00 AM',
      items: [
        {
          id: 'p-1',
          name: 'Heirloom Brandywine Tomatoes',
          category: 'Vine Vegetables',
          unitPrice: 4.50,
          unitLabel: 'per lb',
          quantity: 3,
          image: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=400&q=80',
          stockAvailable: 28
        },
        {
          id: 'p-2',
          name: 'Rainbow Swiss Chard & Lacinato Kale',
          category: 'Leafy Greens',
          unitPrice: 3.75,
          unitLabel: 'per bunch',
          quantity: 2,
          image: 'https://images.unsplash.com/photo-1524179091875-bf99a9a6fa57?auto=format&fit=crop&w=400&q=80',
          stockAvailable: 15
        },
        {
          id: 'p-3',
          name: 'Sweet Italian Genovese Basil',
          category: 'Herbs & Aromatics',
          unitPrice: 2.50,
          unitLabel: 'per bunch',
          quantity: 2,
          image: 'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?auto=format&fit=crop&w=400&q=80',
          stockAvailable: 10
        }
      ]
    },
    {
      id: 'c-2',
      farmerId: 'f-mountain-view',
      farmerName: 'Mountain View Orchard & Cider',
      stallLocation: 'Riverside Twilight Market • Pier 4',
      pickupSlots: [
        'Saturday, Oct 18 • 10:00 AM – 11:30 AM',
        'Saturday, Oct 18 • 1:00 PM – 2:30 PM'
      ],
      selectedSlot: 'Saturday, Oct 18 • 10:00 AM – 11:30 AM',
      items: [
        {
          id: 'p-4',
          name: 'Cold-Pressed Sweet Apple Cider (1 Gal)',
          category: 'Orchard Beverages',
          unitPrice: 11.00,
          unitLabel: 'per jug',
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1576673442511-7e39b6545c87?auto=format&fit=crop&w=400&q=80',
          stockAvailable: 8
        },
        {
          id: 'p-5',
          name: 'Honeycrisp Crisp Orchard Apples',
          category: 'Apples & Pears',
          unitPrice: 3.20,
          unitLabel: 'per lb',
          quantity: 4,
          image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=400&q=80',
          stockAvailable: 45
        }
      ]
    }
  ]);

  // Order Placement Modal State
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [generatedOrders, setGeneratedOrders] = useState([]);
  const [shopperNotes, setShopperNotes] = useState('');

  // Handle slot change for a farmer
  const handleSlotChange = (farmerId, slot) => {
    setCartItems(prev =>
      prev.map(group =>
        group.farmerId === farmerId ? { ...group, selectedSlot: slot } : group
      )
    );
  };

  // Quantity adjustments
  const handleUpdateQty = (farmerId, itemId, delta) => {
    setCartItems(prev => {
      return prev.map(group => {
        if (group.farmerId !== farmerId) return group;
        const updatedItems = group.items.map(item => {
          if (item.id !== itemId) return item;
          const newQty = Math.max(1, Math.min(item.stockAvailable, item.quantity + delta));
          return { ...item, quantity: newQty };
        });
        return { ...group, items: updatedItems };
      });
    });
  };

  // Remove item
  const handleRemoveItem = (farmerId, itemId, itemName) => {
    setCartItems(prev => {
      return prev
        .map(group => {
          if (group.farmerId !== farmerId) return group;
          const updatedItems = group.items.filter(item => item.id !== itemId);
          return { ...group, items: updatedItems };
        })
        .filter(group => group.items.length > 0);
    });
    if (showToast) {
      showToast(`Removed "${itemName}" from your cart.`);
    }
  };

  // Calculate Subtotals
  const calculateGroupSubtotal = (items) => {
    return items.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  };

  const totalItemCount = cartItems.reduce(
    (acc, group) => acc + group.items.reduce((sum, item) => sum + item.quantity, 0),
    0
  );

  const grandSubtotal = cartItems.reduce(
    (acc, group) => acc + calculateGroupSubtotal(group.items),
    0
  );

  // Pre-Order Confirmation Handler
  const handleConfirmPreOrder = () => {
    const orders = cartItems.map((group, idx) => ({
      orderId: `#ML-${8922 + idx}`,
      farmerName: group.farmerName,
      stallLocation: group.stallLocation,
      pickupSlot: group.selectedSlot,
      total: `$${calculateGroupSubtotal(group.items).toFixed(2)}`,
      itemsCount: group.items.reduce((sum, it) => sum + it.quantity, 0),
      items: group.items
    }));
    setGeneratedOrders(orders);
    setOrderConfirmed(true);
    if (showToast) {
      showToast('🎉 Pre-orders submitted! Your produce will be harvested fresh.');
    }
  };

  const handleFinishCheckout = () => {
    setCartItems([]);
    setCheckoutModalOpen(false);
    setOrderConfirmed(false);
    if (onNavigate) {
      onNavigate('orders');
    }
  };

  return (
    <div className="w-full space-y-6 animate-fade-in pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-outline-variant/40 pb-5">
        <div>
          <h1 className="font-headline-md text-2xl sm:text-3xl text-on-surface font-bold tracking-tight">
            Your Cart & Pre-Order
          </h1>
          <p className="font-body-md text-sm text-on-surface-variant mt-1">
            Reserve fresh harvests directly from verified regional growers. Zero upfront payment — pay in person at market pickup.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('products')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-outline hover:border-primary text-on-surface-variant hover:text-primary bg-surface text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            <span>Continue Browsing</span>
          </button>
        </div>
      </div>

      {/* Cart Content or Empty State */}
      {cartItems.length === 0 ? (
        /* Empty State */
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-10 sm:p-14 text-center max-w-2xl mx-auto shadow-sm">
          <div className="w-20 h-20 rounded-full bg-[#E6F0E1] text-primary flex items-center justify-center mx-auto mb-5 shadow-inner">
            <span className="material-symbols-outlined text-4xl">shopping_cart</span>
          </div>
          <h2 className="font-headline-sm text-xl text-on-surface font-bold mb-2">
            Your harvest crate is currently empty
          </h2>
          <p className="font-body-md text-sm text-on-surface-variant max-w-md mx-auto mb-6">
            You don't have any farm products staged for weekend pickup yet. Discover seasonal heirlooms, freshly baked breads, and artisan honey from local stalls.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate && onNavigate('products')}
              className="px-6 py-3 rounded-xl bg-primary text-on-primary hover:bg-primary/90 text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[20px]">storefront</span>
              <span>Browse Fresh Products</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate && onNavigate('favorites')}
              className="px-5 py-3 rounded-xl border border-outline hover:border-primary text-on-surface-variant hover:text-primary bg-surface text-sm font-bold transition-all cursor-pointer flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[20px] text-[#F28C28]">favorite</span>
              <span>View Saved Favorites</span>
            </button>
          </div>
        </div>
      ) : (
        /* Active Cart Layout */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Cart Items Column (Grouped by Farmer) */}
          <div className="lg:col-span-8 space-y-6">
            {cartItems.map((group, groupIdx) => {
              const groupSubtotal = calculateGroupSubtotal(group.items);
              return (
                <div
                  key={group.farmerId}
                  className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 overflow-hidden shadow-sm transition-all"
                >
                  {/* Farmer Header & Stall Location */}
                  <div className="p-4 sm:p-5 bg-gradient-to-r from-[#E6F0E1]/70 to-surface-container-low border-b border-outline-variant/40 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm">
                        {group.farmerName.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="font-headline-sm text-base font-bold text-on-surface">
                            {group.farmerName}
                          </h2>
                          <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-label-sm text-[10px] font-bold">
                            Verified Grower
                          </span>
                        </div>
                        <p className="font-body-sm text-xs text-on-surface-variant flex items-center gap-1.5 mt-0.5">
                          <span className="material-symbols-outlined text-[15px] text-[#2E6B3A]">storefront</span>
                          <span>{group.stallLocation}</span>
                        </p>
                      </div>
                    </div>

                    <div className="text-right sm:text-right">
                      <span className="text-[11px] text-on-surface-variant block uppercase tracking-wider font-semibold">Stall Subtotal</span>
                      <span className="font-headline-sm text-base font-bold text-primary">
                        ${groupSubtotal.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Pickup Slot Selector */}
                  <div className="px-4 sm:px-5 py-3.5 bg-surface-container-low/60 border-b border-outline-variant/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <label className="text-xs font-bold text-on-surface flex items-center gap-1.5 shrink-0">
                      <span className="material-symbols-outlined text-[18px] text-[#F28C28]">event_available</span>
                      <span>Select Pickup Slot:</span>
                    </label>
                    <select
                      value={group.selectedSlot}
                      onChange={(e) => handleSlotChange(group.farmerId, e.target.value)}
                      className="bg-surface text-on-surface text-xs font-semibold px-3 py-1.5 rounded-lg border border-outline-variant focus:outline-none focus:border-primary shadow-2xs max-w-sm cursor-pointer"
                    >
                      {group.pickupSlots.map((slot, sIdx) => (
                        <option key={sIdx} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Group Items List */}
                  <div className="divide-y divide-outline-variant/20 p-4 sm:p-5">
                    {group.items.map((item) => {
                      const itemTotal = item.unitPrice * item.quantity;
                      return (
                        <div
                          key={item.id}
                          className="py-4 first:pt-1 last:pb-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                        >
                          {/* Image & Item Details */}
                          <div className="flex items-center gap-3.5 min-w-0">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-16 h-16 sm:w-18 sm:h-18 rounded-xl object-cover border border-outline-variant/40 shrink-0 shadow-xs"
                            />
                            <div className="min-w-0">
                              <span className="text-[11px] font-semibold text-primary block truncate">
                                {item.category}
                              </span>
                              <h3 className="font-headline-sm text-sm sm:text-base font-bold text-on-surface truncate">
                                {item.name}
                              </h3>
                              <p className="font-body-sm text-xs text-on-surface-variant mt-0.5">
                                <span className="font-bold text-on-surface">${item.unitPrice.toFixed(2)}</span>{' '}
                                <span className="text-on-surface-variant/80">{item.unitLabel}</span>
                              </p>
                            </div>
                          </div>

                          {/* Stepper + Subtotal + Remove */}
                          <div className="flex items-center justify-between sm:justify-end gap-5">
                            {/* Quantity Stepper */}
                            <div className="flex items-center border border-outline-variant rounded-xl bg-surface p-0.5 shadow-2xs">
                              <button
                                type="button"
                                onClick={() => handleUpdateQty(group.farmerId, item.id, -1)}
                                disabled={item.quantity <= 1}
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-container disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                                title="Decrease quantity"
                              >
                                <span className="material-symbols-outlined text-[16px]">remove</span>
                              </button>
                              <span className="w-9 text-center font-bold text-xs text-on-surface select-none">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleUpdateQty(group.farmerId, item.id, 1)}
                                disabled={item.quantity >= item.stockAvailable}
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-container disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                                title="Increase quantity"
                              >
                                <span className="material-symbols-outlined text-[16px]">add</span>
                              </button>
                            </div>

                            {/* Item Subtotal */}
                            <div className="text-right w-20">
                              <span className="font-headline-sm text-sm sm:text-base font-bold text-on-surface block">
                                ${itemTotal.toFixed(2)}
                              </span>
                            </div>

                            {/* Remove Icon */}
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(group.farmerId, item.id, item.name)}
                              className="p-1.5 rounded-lg text-on-surface-variant/60 hover:text-error hover:bg-error-container/30 transition-colors cursor-pointer"
                              title="Remove item"
                            >
                              <span className="material-symbols-outlined text-[19px]">delete</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Sticky Order Summary Card */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-4">
            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-5 sm:p-6 shadow-sm">
              <h2 className="font-headline-sm text-lg font-bold text-on-surface mb-4 pb-3 border-b border-outline-variant/30 flex items-center justify-between">
                <span>Pre-Order Summary</span>
                <span className="px-2 py-0.5 rounded-full bg-[#E6F0E1] text-primary text-xs font-bold">
                  {totalItemCount} {totalItemCount === 1 ? 'item' : 'items'}
                </span>
              </h2>

              {/* Cost Breakdown */}
              <div className="space-y-2.5 font-body-sm text-xs text-on-surface-variant">
                <div className="flex justify-between items-center">
                  <span>Harvest Subtotal ({totalItemCount} items)</span>
                  <span className="font-bold text-on-surface">${grandSubtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Stall Hold & Staging Fee</span>
                  <span className="font-bold text-[#2E6B3A]">Free ($0.00)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Market Pavilion Access</span>
                  <span className="font-bold text-[#2E6B3A]">Included</span>
                </div>
                <div className="border-t border-outline-variant/30 pt-3 flex justify-between items-baseline">
                  <span className="font-headline-sm text-sm font-bold text-on-surface">Estimated Total Due</span>
                  <span className="font-headline-sm text-xl font-extrabold text-primary">
                    ${grandSubtotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Crucial In-Person Payment Notice (Exact requirement: No online card fields) */}
              <div className="mt-5 p-3.5 rounded-xl bg-[#FBF8F1] border border-[#F28C28]/30 flex items-start gap-2.5 text-xs text-on-surface">
                <span className="material-symbols-outlined text-[#F28C28] text-[20px] shrink-0 mt-0.5">
                  info
                </span>
                <div className="space-y-1">
                  <p className="font-bold text-[#222]">
                    No online payment required.
                  </p>
                  <p className="text-on-surface-variant text-[11px] leading-relaxed">
                    Pay in person at pickup using <strong>Cash, Card terminal</strong>, or <strong>SNAP / Double Up Food Bucks tokens</strong> directly at each farmer's stall.
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-5 space-y-2.5">
                <button
                  type="button"
                  onClick={() => setCheckoutModalOpen(true)}
                  className="w-full py-3.5 rounded-xl bg-primary hover:bg-primary/95 text-on-primary font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">assignment_turned_in</span>
                  <span>Place Pre-Order</span>
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate && onNavigate('products')}
                  className="w-full py-2.5 rounded-xl border border-outline hover:border-primary text-on-surface-variant hover:text-primary font-bold text-xs bg-surface transition-all cursor-pointer"
                >
                  Continue Browsing
                </button>
              </div>

              {/* Grower Guarantee */}
              <div className="mt-5 pt-4 border-t border-outline-variant/30 flex items-center justify-center gap-4 text-[11px] text-on-surface-variant font-medium">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px] text-primary">verified</span>
                  Direct Farm Sourced
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px] text-[#F28C28]">schedule</span>
                  Freshly Harvested
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* PRE-ORDER CONFIRMATION MODAL                             */}
      {/* ======================================================== */}
      {checkoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-outline-variant/40 max-h-[90vh] overflow-y-auto">
            {!orderConfirmed ? (
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-[#E6F0E1] text-primary flex items-center justify-center font-bold">
                      <span className="material-symbols-outlined text-[20px]">task_alt</span>
                    </div>
                    <div>
                      <h3 className="font-headline-sm text-lg font-bold text-on-surface">
                        Confirm Produce Pre-Order
                      </h3>
                      <p className="text-xs text-on-surface-variant">Review pickup reservations before finalizing</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCheckoutModalOpen(false)}
                    className="p-1 rounded-lg text-on-surface-variant hover:bg-surface-container cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[20px]">close</span>
                  </button>
                </div>

                <div className="mt-4 space-y-4">
                  <div className="p-3.5 bg-surface-container-low rounded-xl space-y-2 text-xs">
                    <p className="font-bold text-on-surface flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-[#2E6B3A]">store</span>
                      <span>Reservations to create ({cartItems.length}):</span>
                    </p>
                    <ul className="space-y-1.5 pl-5 list-disc text-on-surface-variant">
                      {cartItems.map((g) => (
                        <li key={g.farmerId}>
                          <strong>{g.farmerName}</strong> — {g.selectedSlot} (Subtotal: ${calculateGroupSubtotal(g.items).toFixed(2)})
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-on-surface mb-1">
                      Optional Note for Farmers (e.g. Packing preferences):
                    </label>
                    <textarea
                      rows={2}
                      value={shopperNotes}
                      onChange={(e) => setShopperNotes(e.target.value)}
                      placeholder="e.g. Please select slightly greener bananas if possible, bringing my own canvas totes..."
                      className="w-full text-xs p-3 rounded-xl border border-outline-variant focus:outline-none focus:border-primary bg-surface resize-none"
                    />
                  </div>

                  {/* Payment Reassurance reminder */}
                  <div className="p-3 rounded-xl bg-[#ecfccb] border border-lime-300 text-xs text-[#3f6212] flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">payments</span>
                    <span>Remember: Pay <strong>${grandSubtotal.toFixed(2)}</strong> in person upon collecting at the stalls.</span>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-outline-variant/30">
                  <button
                    type="button"
                    onClick={() => setCheckoutModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-outline hover:bg-surface-container text-xs font-bold text-on-surface cursor-pointer"
                  >
                    Back to Edit
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmPreOrder}
                    className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/95 text-on-primary text-xs font-bold shadow-md cursor-pointer flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[18px]">send</span>
                    <span>Submit Pre-Order</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Success Confirmation */
              <div className="text-center py-4">
                <div className="w-16 h-16 rounded-full bg-[#ecfccb] text-[#3f6212] flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-4xl">celebration</span>
                </div>
                <h3 className="font-headline-sm text-xl font-bold text-on-surface mb-1">
                  Pre-Orders Placed Successfully!
                </h3>
                <p className="text-xs text-on-surface-variant max-w-sm mx-auto mb-5">
                  The growers have received your reservation slips. Your produce will be harvested and packed for your selected time windows.
                </p>

                <div className="space-y-2.5 text-left mb-6 max-h-52 overflow-y-auto pr-1">
                  {generatedOrders.map((ord, i) => (
                    <div key={i} className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/40 text-xs">
                      <div className="flex justify-between items-center font-bold text-on-surface">
                        <span>{ord.orderId} • {ord.farmerName}</span>
                        <span className="text-primary">{ord.total}</span>
                      </div>
                      <p className="text-[11px] text-on-surface-variant mt-1">
                        📍 {ord.stallLocation}
                      </p>
                      <p className="text-[11px] text-on-surface-variant">
                        ⏰ {ord.pickupSlot}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={handleFinishCheckout}
                    className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-on-primary text-xs font-bold shadow-md cursor-pointer"
                  >
                    View in My Orders
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
