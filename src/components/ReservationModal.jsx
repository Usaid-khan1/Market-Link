import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import customerApi from '../api/customer';
import browseApi from '../api/browse';
import { useAuth } from '../context/AuthContext';

export default function ReservationModal({
  product,
  onClose,
  onConfirmReservation,
  onOpenAuth,
  onOpenRegister
}) {
  const { user, isAuthenticated } = useAuth();
  const [quantity, setQuantity] = useState(product?.quantity || 1);
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [reservedSlip, setReservedSlip] = useState(null);

  useEffect(() => {
    if (product?.quantity) {
      setQuantity(product.quantity);
    }
  }, [product]);

  useEffect(() => {
    if (user?.name && !customerName) {
      setCustomerName(user.name);
    }
    if (user?.phone && !customerPhone) {
      setCustomerPhone(user.phone);
    }
  }, [user]);

  if (!product) return null;

  const totalPrice = (product.price * quantity).toFixed(2);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated || user?.role !== 'customer') {
      alert('Please log in as a customer to reserve produce.');
      return;
    }
    if (!customerName.trim() || !customerPhone.trim()) {
      alert('Please provide your name and phone number for the farmer reservation slip.');
      return;
    }

    setSubmitting(true);

    try {
      const pickupDate = new Date();
      pickupDate.setDate(pickupDate.getDate() + 2);

      const prodId = typeof product.id === 'number'
        ? product.id
        : (parseInt(String(product.id).replace(/\D/g, ''), 10) || 1);

      let farmerId = product.farmer_id || product.farmerId || product.farmer?.id || product.user_id;
      let marketId = product.market_id || product.marketId || product.market?.id || null;

      // If farmerId is still missing, fetch product details to get its farmer_id and market_id
      if (!farmerId && prodId) {
        try {
          const prodRes = await browseApi.getProduct(prodId);
          if (prodRes?.data) {
            if (prodRes.data.farmer_id) farmerId = prodRes.data.farmer_id;
            if (!marketId && prodRes.data.market_id) marketId = prodRes.data.market_id;
          }
        } catch (fetchErr) {
          console.warn('Could not auto-fetch product details:', fetchErr);
        }
      }

      const orderPayload = {
        pickup_date: pickupDate.toISOString().split('T')[0],
        pickup_time: 'This Weekend (Opening Hours)',
        notes: notes ? `${notes} (Contact: ${customerPhone})` : `Storefront hold (Contact: ${customerPhone})`,
        items: [
          {
            product_id: prodId,
            quantity: quantity,
          }
        ]
      };
      if (farmerId) {
        orderPayload.farmer_id = Number(farmerId);
      }
      if (marketId) {
        orderPayload.market_id = Number(marketId);
      }

      const res = await customerApi.createOrder(orderPayload);

      const orderData = res?.data || {};
      const voucherCode = orderData.order_number || (orderData.id ? `ML-${orderData.id}` : `ML-${Math.floor(1000 + Math.random() * 9000)}`);

      const slip = {
        voucherId: voucherCode,
        productName: product.name,
        farm: product.farm || product.farmer_name || product.stall_name || 'Regional Grower',
        market: product.market || product.market_name || 'Downtown Historic Farmers Market',
        quantity,
        unit: product.unit || 'item',
        totalPrice,
        customerName,
        customerPhone,
        pickupDate: orderData.pickup_date || 'This Weekend (Opening Hours)',
        bay: 'Designated Stall Pickup Bay'
      };

      setReservedSlip(slip);
      window.dispatchEvent(new CustomEvent('marketlink:order-created', { detail: orderData }));
      if (onConfirmReservation) {
        onConfirmReservation(slip);
      }
    } catch (err) {
      console.error('Backend reservation error:', err);
      alert(err.message || 'Could not place reservation. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full overflow-hidden shadow-[0_24px_64px_rgba(0,0,0,0.35)] border border-outline-variant/40 flex flex-col max-h-[90vh] animate-fade-in text-xs">
        {/* Header */}
        <div className="bg-primary px-space-lg py-space-md text-on-primary flex items-center justify-between shrink-0">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-[24px]">shopping_basket</span>
            <h3 className="font-headline-sm text-on-primary font-bold text-base">
              {reservedSlip ? 'Produce Reservation Confirmed!' : 'Reserve Produce for Market Pickup'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-on-primary/80 hover:text-on-primary cursor-pointer p-1 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-space-lg overflow-y-auto">
          {!isAuthenticated ? (
            /* Login Gate for Visitors */
            <div className="py-6 px-4 text-center flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-700 flex items-center justify-center mb-1">
                <span className="material-symbols-outlined text-[34px]">lock</span>
              </div>
              <h4 className="font-headline-sm text-base font-bold text-on-surface">
                Customer Sign In Required
              </h4>
              <p className="text-xs text-on-surface-variant max-w-sm leading-relaxed">
                Bina login ke produce hold ya stall reservation confirm nahi ki ja sakti. Please sign in as a Shopper or register to reserve produce.
              </p>

              {/* Product preview snippet */}
              <div className="w-full max-w-sm p-3 bg-surface-container-low rounded-xl border border-outline-variant/30 flex items-center gap-3 my-2 text-left">
                <img
                  src={product.image || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80'}
                  alt={product.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="min-w-0 flex-1">
                  <span className="font-bold text-on-surface text-xs block truncate">{product.name}</span>
                  <span className="text-[11px] text-primary font-bold block">${Number(product.price).toFixed(2)} / {product.unit}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5 mt-2 w-full max-w-xs">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenAuth && onOpenAuth('customer');
                  }}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-primary hover:bg-primary/90 text-on-primary font-bold text-xs shadow-sm cursor-pointer transition-all flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">login</span>
                  <span>Sign In as Shopper</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenRegister && onOpenRegister();
                  }}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-xs cursor-pointer transition-all"
                >
                  Create Account
                </button>
              </div>
            </div>
          ) : user?.role !== 'customer' ? (
            /* Role Gate for Farmers & Admins */
            <div className="py-6 px-4 text-center flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-700 flex items-center justify-center">
                <span className="material-symbols-outlined text-[34px]">switch_account</span>
              </div>
              <h4 className="font-headline-sm text-base font-bold text-on-surface">
                Shopper Account Required
              </h4>
              <p className="text-xs text-on-surface-variant max-w-sm leading-relaxed">
                Aap <strong>{user?.role === 'farmer' ? 'Farmer' : 'Admin'}</strong> account se sign in hain. Produce reservation sirf Customer (Shopper) account se confirm ki ja sakti hai.
              </p>
              <div className="flex gap-2 mt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="py-2 px-5 rounded-xl bg-surface-container text-on-surface font-bold text-xs cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenAuth && onOpenAuth('customer');
                  }}
                  className="py-2 px-5 rounded-xl bg-primary text-on-primary font-bold text-xs cursor-pointer"
                >
                  Switch Account
                </button>
              </div>
            </div>
          ) : reservedSlip ? (
            /* Digital Reservation Slip Voucher */
            <div className="flex flex-col gap-space-md">
              <div className="bg-surface-container-low border-2 border-dashed border-primary/40 rounded-xl p-space-md text-center">
                <span className="inline-flex items-center gap-1 bg-secondary-fixed text-on-secondary-fixed px-space-sm py-0.5 rounded-full font-label-sm mb-space-xs font-bold text-xs">
                  <span className="material-symbols-outlined text-[16px]">verified</span>
                  Voucher Active
                </span>
                <p className="font-label-sm text-on-surface-variant uppercase text-[10px] font-bold">Voucher Code</p>
                <p className="font-headline-lg text-primary font-bold tracking-wider my-1 text-xl font-mono">
                  #{reservedSlip.voucherId}
                </p>
                <p className="font-headline-sm text-on-surface font-bold text-sm">{reservedSlip.productName}</p>
                <p className="font-label-md text-primary font-bold text-xs">{reservedSlip.farm}</p>
                <p className="font-body-sm text-on-surface-variant text-[11px] mt-1">
                  Reserved for: <strong>{reservedSlip.customerName}</strong> ({reservedSlip.customerPhone})
                </p>
              </div>

              <div className="grid grid-cols-2 gap-space-xs text-xs bg-surface-container p-space-sm rounded-lg">
                <div>
                  <span className="text-on-surface-variant text-[11px]">Pickup Stand:</span>
                  <p className="font-bold text-on-surface">{reservedSlip.market}</p>
                </div>
                <div>
                  <span className="text-on-surface-variant text-[11px]">Quantity Held:</span>
                  <p className="font-bold text-on-surface">{reservedSlip.quantity} {reservedSlip.unit}</p>
                </div>
                <div className="col-span-2 pt-space-xs border-t border-outline-variant/30 flex justify-between items-center">
                  <span className="font-label-sm text-on-surface font-bold">Due at Stall Pickup:</span>
                  <span className="font-headline-sm text-tertiary font-bold text-sm">${reservedSlip.totalPrice}</span>
                </div>
              </div>

              <div className="p-space-sm rounded-lg bg-secondary-fixed/30 border border-secondary-fixed flex items-start gap-space-xs text-on-secondary-fixed-variant text-xs leading-relaxed">
                <span className="material-symbols-outlined text-[20px] text-primary flex-shrink-0">payments</span>
                <div>
                  <strong>No online charge made!</strong> Your grower is packing this crate early. Simply present this slip number and settle with cash or card directly at the stand.
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full bg-primary hover:bg-primary/90 text-on-primary font-bold py-2.5 rounded-xl transition-all cursor-pointer mt-space-xs"
              >
                Done
              </button>
            </div>
          ) : (
            /* Reservation Form */
            <form onSubmit={handleSubmit} className="flex flex-col gap-space-md">
              {/* Product Snippet */}
              <div className="flex gap-space-sm items-center bg-surface-container-low p-space-sm rounded-xl">
                <img
                  src={product.image || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80'}
                  alt={product.name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80';
                  }}
                  className="w-16 h-16 rounded-lg object-cover shadow-sm shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-label-sm text-primary font-bold text-xs">{product.farm || product.stall_name || 'Grower Stand'}</p>
                  <h4 className="font-headline-sm text-on-surface text-sm font-bold truncate">{product.name}</h4>
                  <p className="font-label-md text-tertiary font-bold">
                    ${Number(product.price).toFixed(2)} <span className="font-normal text-[11px] text-on-surface-variant">/ {product.unit}</span>
                  </p>
                </div>
              </div>

              {/* Quantity Selector */}
              <div>
                <label className="font-bold text-on-surface block mb-1">
                  Quantity to Reserve ({product.unit}s)
                </label>
                <div className="flex items-center gap-space-sm">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-9 h-9 rounded-lg bg-surface-container hover:bg-surface-container-high flex items-center justify-center font-bold text-base text-on-surface cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-bold text-on-surface text-sm">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-9 h-9 rounded-lg bg-surface-container hover:bg-surface-container-high flex items-center justify-center font-bold text-base text-on-surface cursor-pointer"
                  >
                    +
                  </button>
                  <div className="ml-auto text-right">
                    <span className="text-on-surface-variant text-[11px] block">Estimated Total:</span>
                    <p className="font-headline-sm text-primary font-bold text-sm">${totalPrice}</p>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
                <div>
                  <label className="font-bold text-on-surface block mb-1" htmlFor="res-name">
                    Your Full Name *
                  </label>
                  <input
                    id="res-name"
                    type="text"
                    required
                    placeholder="e.g. Clara Miller"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant/50 rounded-lg px-space-sm py-2 font-body-sm text-on-surface focus:outline-none focus:border-primary text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold text-on-surface block mb-1" htmlFor="res-phone">
                    Mobile Phone *
                  </label>
                  <input
                    id="res-phone"
                    type="tel"
                    required
                    placeholder="(555) 000-0000"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant/50 rounded-lg px-space-sm py-2 font-body-sm text-on-surface focus:outline-none focus:border-primary text-xs"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="font-bold text-on-surface block mb-1" htmlFor="res-notes">
                  Note for Grower (Optional)
                </label>
                <input
                  id="res-notes"
                  type="text"
                  placeholder="e.g. Prefer slightly greener bunches / picking up around 10am"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant/50 rounded-lg px-space-sm py-2 font-body-sm text-on-surface focus:outline-none focus:border-primary text-xs"
                />
              </div>

              {/* In-Person Notice */}
              <div className="bg-surface-container p-space-sm rounded-lg flex items-start gap-space-xs text-[11px] text-on-surface-variant">
                <span className="material-symbols-outlined text-[16px] text-primary flex-shrink-0 mt-0.5">verified_user</span>
                <span>
                  <strong>100% In-Person Payment:</strong> No card required online. Your reserved box will be kept safe under your name at <strong>{product.market}</strong>.
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-space-sm pt-space-xs">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={submitting}
                  className="w-1/3 py-2.5 rounded-xl font-bold text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-2/3 bg-tertiary-container hover:bg-tertiary text-on-tertiary font-bold py-2.5 rounded-xl shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-space-xs text-xs disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      <span>Holding Produce...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[18px]">lock_clock</span>
                      <span>Confirm Produce Hold</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
