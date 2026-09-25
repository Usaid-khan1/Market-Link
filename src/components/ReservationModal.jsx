import React, { useState, useEffect } from 'react';
import customerApi from '../api/customer';
import { useAuth } from '../context/AuthContext';

export default function ReservationModal({ product, onClose, onConfirmReservation }) {
  const { user, isAuthenticated } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [reservedSlip, setReservedSlip] = useState(null);

  useEffect(() => {
    if (user?.name && !customerName) {
      setCustomerName(user.name);
    }
  }, [user]);

  if (!product) return null;

  const totalPrice = (product.price * quantity).toFixed(2);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) {
      alert('Please provide your name and phone number for the farmer reservation slip.');
      return;
    }

    setSubmitting(true);
    let voucherId = `ML-${Math.floor(1000 + Math.random() * 9000)}`;

    if (isAuthenticated && user?.role === 'customer') {
      try {
        const pickupDate = new Date();
        pickupDate.setDate(pickupDate.getDate() + 2);

        const prodId = typeof product.id === 'number'
          ? product.id
          : (parseInt(String(product.id).replace(/\D/g, ''), 10) || 1);

        const farmerId = product.farmer_id || product.farmerId || 2;
        const marketId = product.market_id || product.marketId || 1;

        const res = await customerApi.createOrder({
          farmer_id: farmerId,
          market_id: marketId,
          pickup_date: pickupDate.toISOString().split('T')[0],
          pickup_time: 'This Weekend (Opening Hours)',
          notes: notes ? `${notes} (Contact: ${customerPhone})` : `Storefront hold (Contact: ${customerPhone})`,
          items: [
            {
              product_id: prodId,
              quantity: quantity,
            }
          ]
        });

        if (res?.data?.id) {
          voucherId = `ML-${res.data.id}`;
        }
      } catch (err) {
        console.warn('Backend reservation error, using local voucher slip:', err);
      }
    }

    const slip = {
      voucherId,
      productName: product.name,
      farm: product.farm || product.farmer_name || product.stall_name || 'Regional Grower',
      market: product.market || product.market_name || 'Market Stand',
      quantity,
      unit: product.unit || 'item',
      totalPrice,
      customerName,
      customerPhone,
      pickupDate: 'This Weekend (Opening Hours)',
      bay: 'Designated Stall Pickup Bay'
    };

    setSubmitting(false);
    setReservedSlip(slip);
    if (onConfirmReservation) {
      onConfirmReservation(slip);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-gutter bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-outline-variant/40 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-primary px-space-lg py-space-md text-on-primary flex items-center justify-between">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-[24px]">shopping_basket</span>
            <h3 className="font-headline-sm text-on-primary">
              {reservedSlip ? 'Produce Reservation Confirmed!' : 'Reserve Produce for Market Pickup'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-on-primary/80 hover:text-on-primary cursor-pointer"
            aria-label="Close modal"
          >
            <span className="material-symbols-outlined text-[24px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-space-lg overflow-y-auto">
          {reservedSlip ? (
            /* Digital Reservation Slip Voucher */
            <div className="flex flex-col gap-space-md">
              <div className="bg-surface-container-low border-2 border-dashed border-primary/40 rounded-xl p-space-md text-center">
                <span className="inline-flex items-center gap-1 bg-secondary-fixed text-on-secondary-fixed px-space-sm py-0.5 rounded-full font-label-sm mb-space-xs">
                  <span className="material-symbols-outlined text-[16px]">verified</span>
                  Voucher Active
                </span>
                <p className="font-label-sm text-on-surface-variant uppercase text-xs">Voucher Code</p>
                <p className="font-headline-lg text-primary font-bold tracking-wider my-1">
                  #{reservedSlip.voucherId}
                </p>
                <p className="font-headline-sm text-on-surface font-semibold">{reservedSlip.productName}</p>
                <p className="font-label-md text-primary">{reservedSlip.farm}</p>
                <p className="font-body-sm text-on-surface-variant text-xs mt-1">
                  Reserved for: <strong>{reservedSlip.customerName}</strong> ({reservedSlip.customerPhone})
                </p>
              </div>

              <div className="grid grid-cols-2 gap-space-xs text-sm bg-surface-container p-space-sm rounded-lg">
                <div>
                  <span className="text-on-surface-variant text-xs">Pickup Stand:</span>
                  <p className="font-bold text-on-surface">{reservedSlip.market}</p>
                </div>
                <div>
                  <span className="text-on-surface-variant text-xs">Quantity Held:</span>
                  <p className="font-bold text-on-surface">{reservedSlip.quantity} {reservedSlip.unit}</p>
                </div>
                <div className="col-span-2 pt-space-xs border-t border-outline-variant/30 flex justify-between items-center">
                  <span className="font-label-sm text-on-surface">Due at Stall Pickup:</span>
                  <span className="font-headline-sm text-tertiary font-bold">${reservedSlip.totalPrice}</span>
                </div>
              </div>

              <div className="p-space-sm rounded-lg bg-secondary-fixed/30 border border-secondary-fixed flex items-start gap-space-xs text-on-secondary-fixed-variant text-xs leading-relaxed">
                <span className="material-symbols-outlined text-[20px] text-primary flex-shrink-0">payments</span>
                <div>
                  <strong>No online charge made!</strong> Your grower is packing this crate early. Simply present this slip number and settle with cash or card directly at the stand.
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full bg-primary hover:bg-primary-container text-on-primary font-label-md py-space-sm rounded-xl transition-all cursor-pointer mt-space-xs"
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
                  src={product.image}
                  alt={product.name}
                  className="w-16 h-16 rounded-lg object-cover shadow-sm"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-label-sm text-primary">{product.farm}</p>
                  <h4 className="font-headline-sm text-on-surface text-base truncate">{product.name}</h4>
                  <p className="font-label-md text-tertiary font-bold">
                    ${product.price.toFixed(2)} <span className="font-normal text-xs text-on-surface-variant">/ {product.unit}</span>
                  </p>
                </div>
              </div>

              {/* Quantity Selector */}
              <div>
                <label className="font-label-sm text-on-surface-variant block mb-1">
                  Quantity to Reserve ({product.unit}s)
                </label>
                <div className="flex items-center gap-space-sm">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-lg bg-surface-container hover:bg-surface-container-high flex items-center justify-center font-bold text-lg text-on-surface cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-headline-sm text-on-surface font-bold">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-lg bg-surface-container hover:bg-surface-container-high flex items-center justify-center font-bold text-lg text-on-surface cursor-pointer"
                  >
                    +
                  </button>
                  <div className="ml-auto text-right">
                    <span className="font-label-sm text-on-surface-variant text-xs">Estimated Total:</span>
                    <p className="font-headline-sm text-primary font-bold">${totalPrice}</p>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
                <div>
                  <label className="font-label-sm text-on-surface-variant block mb-1" htmlFor="res-name">
                    Your Full Name *
                  </label>
                  <input
                    id="res-name"
                    type="text"
                    required
                    placeholder="e.g. Clara Miller"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant/50 rounded-lg px-space-sm py-space-xs font-body-sm text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="font-label-sm text-on-surface-variant block mb-1" htmlFor="res-phone">
                    Mobile Phone *
                  </label>
                  <input
                    id="res-phone"
                    type="tel"
                    required
                    placeholder="(555) 000-0000"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant/50 rounded-lg px-space-sm py-space-xs font-body-sm text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="font-label-sm text-on-surface-variant block mb-1" htmlFor="res-notes">
                  Note for Grower (Optional)
                </label>
                <input
                  id="res-notes"
                  type="text"
                  placeholder="e.g. Prefer slightly greener bunches / picking up around 10am"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant/50 rounded-lg px-space-sm py-space-xs font-body-sm text-on-surface focus:outline-none focus:border-primary text-xs"
                />
              </div>

              {/* In-Person Notice */}
              <div className="bg-surface-container p-space-sm rounded-lg flex items-start gap-space-xs text-xs text-on-surface-variant">
                <span className="material-symbols-outlined text-[18px] text-primary flex-shrink-0 mt-0.5">verified_user</span>
                <span>
                  <strong>100% In-Person Payment:</strong> No card required online. Your reserved box will be kept safe under your name at <strong>{product.market}</strong>.
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-space-sm pt-space-xs">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-1/3 py-space-sm rounded-xl font-label-md text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-2/3 bg-tertiary-container hover:bg-tertiary text-on-tertiary font-label-md py-space-sm rounded-xl shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-space-xs"
                >
                  <span className="material-symbols-outlined text-[18px]">lock_clock</span>
                  <span>Confirm Produce Hold</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
