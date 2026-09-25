import React, { useState, useMemo } from 'react';

export default function FarmerPreOrders({ showToast }) {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [detailModalOrder, setDetailModalOrder] = useState(null);
  const [actionConfirm, setActionConfirm] = useState(null); // { order, newStatus, actionTitle, actionClass }

  // Settings State: Cut-off time & pickup slots
  const [cutOffTime, setCutOffTime] = useState('Friday 8:00 PM (12 hrs prior)');
  const [pickupSlots, setPickupSlots] = useState([
    '8:00 AM – 9:30 AM',
    '9:30 AM – 11:00 AM',
    '11:00 AM – 12:30 PM',
    '12:30 PM – 2:00 PM'
  ]);
  const [newSlotInput, setNewSlotInput] = useState('');

  // Pre-Orders Dataset for Green Pastures Organic
  const [orders, setOrders] = useState([
    {
      id: '#ML-8920',
      customer: 'Elena Rostova',
      email: 'elena.rostova@gmail.com',
      phone: '(503) 555-0144',
      itemsSummary: '4 lbs Brandywine Tomatoes, 2 bunches Chard',
      itemsList: [
        { name: 'Heirloom Brandywine Tomatoes', qty: '4 lbs', price: '$4.50/lb', total: '$18.00' },
        { name: 'Rainbow Swiss Chard & Lacinato Kale', qty: '2 bunches', price: '$3.75/bunch', total: '$7.50' },
        { name: 'Sweet Italian Genovese Basil', qty: '2 bunches', price: '$2.50/bunch', total: '$5.00' },
        { name: 'Stall Packing & Crate Deposit', qty: '1 unit', price: '$3.50', total: '$3.50' }
      ],
      pickupDate: 'Saturday, Oct 18',
      pickupSlot: '9:30 AM – 11:00 AM',
      market: 'Pioneer Pavilion • Stall #08',
      totalAmount: '$34.00',
      status: 'Placed',
      specialNotes: 'Please pack firm tomatoes for slicing; will pick up with baby stroller.',
      timeline: [
        { time: 'Friday 6:15 PM', text: 'Reservation submitted by Elena via MarketLink storefront' },
        { time: 'Pending', text: 'Stallholder confirmation awaiting harvest pack' }
      ]
    },
    {
      id: '#ML-8919',
      customer: 'Claire Thompson',
      email: 'claire.t@portlandgrow.org',
      phone: '(503) 555-0722',
      itemsSummary: '2 Romanesco Cauliflowers, 3 baskets Sugar Snap Peas',
      itemsList: [
        { name: 'Organic Romanesco Cauliflower', qty: '2 pieces', price: '$5.00/ea', total: '$10.00' },
        { name: 'Baby Sugar Snap Peas', qty: '3 baskets', price: '$4.25/ea', total: '$12.75' }
      ],
      pickupDate: 'Saturday, Oct 18',
      pickupSlot: '8:00 AM – 9:30 AM',
      market: 'Downtown Saturday Market • Booth 12',
      totalAmount: '$22.75',
      status: 'Accepted',
      specialNotes: 'None',
      timeline: [
        { time: 'Friday 4:20 PM', text: 'Order placed by customer' },
        { time: 'Friday 5:00 PM', text: 'Stall confirmed & accepted for morning harvest' }
      ]
    },
    {
      id: '#ML-8914',
      customer: 'David Reynolds',
      email: 'david.r@cascadialabs.com',
      phone: '(503) 555-0931',
      itemsSummary: '6 lbs Brandywine Tomatoes, 4 bunches Basil',
      itemsList: [
        { name: 'Heirloom Brandywine Tomatoes', qty: '6 lbs', price: '$4.50/lb', total: '$27.00' },
        { name: 'Sweet Italian Genovese Basil', qty: '4 bunches', price: '$2.50/bunch', total: '$10.00' }
      ],
      pickupDate: 'Saturday, Oct 18',
      pickupSlot: '8:00 AM – 9:30 AM',
      market: 'Pioneer Pavilion • Stall #08',
      totalAmount: '$37.00',
      status: 'Ready for Pickup',
      specialNotes: 'Paying in cash with exact change at stall counter.',
      timeline: [
        { time: 'Friday 3:10 PM', text: 'Order placed by David' },
        { time: 'Friday 4:15 PM', text: 'Accepted by Green Pastures' },
        { time: 'Saturday 7:30 AM', text: 'Crate packed and tagged with voucher #ML-8914' }
      ]
    },
    {
      id: '#ML-8902',
      customer: 'Hannah Sterling',
      email: 'hannah.s@gmail.com',
      phone: '(503) 555-0311',
      itemsSummary: '3 lbs Tomatoes, 1 Romanesco Cauliflower',
      itemsList: [
        { name: 'Heirloom Brandywine Tomatoes', qty: '3 lbs', price: '$4.50/lb', total: '$13.50' },
        { name: 'Organic Romanesco Cauliflower', qty: '1 piece', price: '$5.00/ea', total: '$5.00' }
      ],
      pickupDate: 'Wednesday, Oct 15',
      pickupSlot: '4:30 PM – 6:00 PM',
      market: 'Riverside Twilight Market',
      totalAmount: '$18.50',
      status: 'Completed',
      specialNotes: 'Collected and paid via SNAP matching tokens.',
      timeline: [
        { time: 'Wednesday 2:10 PM', text: 'Order placed' },
        { time: 'Wednesday 3:00 PM', text: 'Packed & Ready' },
        { time: 'Wednesday 5:15 PM', text: 'Voucher claimed at stall. Settle completed.' }
      ]
    },
    {
      id: '#ML-8889',
      customer: 'Lucas Meyer',
      email: 'lucas.m@outlook.com',
      phone: '(503) 555-0849',
      itemsSummary: '5 baskets Snap Peas',
      itemsList: [
        { name: 'Baby Sugar Snap Peas', qty: '5 baskets', price: '$4.25/ea', total: '$21.25' }
      ],
      pickupDate: 'Wednesday, Oct 15',
      pickupSlot: '6:00 PM – 7:30 PM',
      market: 'Riverside Twilight Market',
      totalAmount: '$21.25',
      status: 'Cancelled',
      specialNotes: 'Customer texted unable to attend due to work travel.',
      timeline: [
        { time: 'Wednesday 1:00 PM', text: 'Order placed' },
        { time: 'Wednesday 3:30 PM', text: 'Cancelled by customer' }
      ]
    }
  ]);

  // Tab definitions
  const tabs = ['All', 'Placed', 'Accepted', 'Ready for Pickup', 'Completed', 'Cancelled'];

  // Tab Counts
  const tabCounts = useMemo(() => {
    const counts = { All: orders.length };
    tabs.forEach((t) => {
      if (t !== 'All') {
        counts[t] = orders.filter((o) => o.status === t).length;
      }
    });
    return counts;
  }, [orders]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchTab = activeTab === 'All' || o.status === activeTab;
      const matchSearch =
        o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.itemsSummary.toLowerCase().includes(searchQuery.toLowerCase());
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
            <span className="w-1.5 h-1.5 rounded-full bg-[#8BC34A]"></span>
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

  // Status Transition Trigger
  const promptStatusChange = (order, newStatus, actionTitle) => {
    setActionConfirm({
      order,
      newStatus,
      actionTitle
    });
  };

  // Execute Confirmed Status Change
  const executeStatusChange = () => {
    if (!actionConfirm) return;
    const { order, newStatus } = actionConfirm;

    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === order.id) {
          const newTimelineEntry = {
            time: 'Just now',
            text: `Status updated to ${newStatus} by Green Pastures stall`
          };
          return {
            ...o,
            status: newStatus,
            timeline: [newTimelineEntry, ...o.timeline]
          };
        }
        return o;
      })
    );

    showToast?.(`Order ${order.id} marked as ${newStatus}!`);
    setActionConfirm(null);
    if (detailModalOrder && detailModalOrder.id === order.id) {
      setDetailModalOrder((prev) => ({ ...prev, status: newStatus }));
    }
  };

  // Add Pickup Slot
  const handleAddSlot = (e) => {
    e.preventDefault();
    if (!newSlotInput.trim()) return;
    setPickupSlots([...pickupSlots, newSlotInput.trim()]);
    setNewSlotInput('');
    showToast?.('Pickup slot added!');
  };

  // Remove Pickup Slot
  const handleRemoveSlot = (slotToRemove) => {
    if (pickupSlots.length === 1) {
      showToast?.('You must maintain at least one pickup slot.');
      return;
    }
    setPickupSlots(pickupSlots.filter((s) => s !== slotToRemove));
  };

  return (
    <div className="px-gutter py-space-lg max-w-7xl mx-auto w-full flex flex-col gap-space-lg animate-fade-in">
      
      {/* 1. Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-space-xs text-on-surface-variant font-label-sm text-xs">
            <span>FARMER STALL</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-primary font-bold">RESERVATIONS &amp; ORDERS</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg sm:text-3xl text-on-surface tracking-tight font-bold">
            Pre-Orders
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant text-xs sm:text-sm">
            Review customer reservations, approve crates for packing, and track stall pick-ups.
          </p>
        </div>

        <div className="flex items-center gap-space-sm">
          <button
            type="button"
            onClick={() => showToast?.('Packing list generated for printer!')}
            className="inline-flex items-center gap-2 px-space-md py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-xs font-bold transition-colors cursor-pointer border border-outline-variant/30"
          >
            <span className="material-symbols-outlined text-[18px]">print</span>
            <span>Print Packing Slips</span>
          </button>
        </div>
      </div>

      {/* 2. Top Settings Box: Cut-off Time & Pickup Slots Editor */}
      <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col lg:flex-row lg:items-center justify-between gap-space-md text-xs">
        
        {/* Left: Cut-off Time Setting */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-tertiary-fixed flex items-center justify-center text-tertiary shrink-0">
            <span className="material-symbols-outlined text-[22px]">timer</span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-on-surface">Order Cut-off Time:</span>
            <input
              type="text"
              value={cutOffTime}
              onChange={(e) => setCutOffTime(e.target.value)}
              className="mt-0.5 p-1.5 bg-surface-container-low rounded-lg border border-outline-variant/30 font-bold text-xs text-primary focus:outline-none focus:ring-1 focus:ring-primary w-64"
            />
          </div>
        </div>

        {/* Right: Pickup Slots Editor */}
        <div className="flex flex-col gap-1.5 flex-1 lg:max-w-xl">
          <div className="flex items-center justify-between">
            <span className="font-bold text-on-surface">Available Pickup Windows:</span>
            <span className="text-[11px] text-on-surface-variant">Stall pickup staggering</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {pickupSlots.map((slot) => (
              <span
                key={slot}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-container text-on-surface font-bold text-[11px] border border-outline-variant/30"
              >
                <span>{slot}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSlot(slot)}
                  className="hover:text-error cursor-pointer ml-0.5"
                  title="Remove slot"
                >
                  ×
                </button>
              </span>
            ))}

            {/* Quick add slot form */}
            <form onSubmit={handleAddSlot} className="inline-flex items-center gap-1">
              <input
                type="text"
                value={newSlotInput}
                onChange={(e) => setNewSlotInput(e.target.value)}
                placeholder="+ Add slot (e.g. 2-3 PM)"
                className="p-1 px-2 bg-surface-container-low rounded-lg border border-outline-variant/30 text-[11px] w-36 focus:outline-none"
              />
              <button
                type="submit"
                className="px-2 py-1 rounded-lg bg-primary text-on-primary text-[11px] font-bold cursor-pointer"
              >
                +
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* 3. Filter Tabs Strip */}
      <div className="bg-surface-container-lowest p-space-sm rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col sm:flex-row items-center justify-between gap-space-sm">
        
        {/* Tab Buttons */}
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

        {/* Search */}
        <div className="relative w-full sm:w-64 flex items-center pr-2">
          <span className="material-symbols-outlined absolute left-2.5 text-on-surface-variant text-[17px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search order ID, customer..."
            className="w-full pl-8 pr-3 py-1.5 bg-surface-container-low rounded-xl font-body-sm text-xs text-on-surface placeholder:text-on-surface-variant/70 focus:outline-none focus:ring-1 focus:ring-primary border border-outline-variant/30"
          />
        </div>
      </div>

      {/* 4. Pre-Orders Table */}
      <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 overflow-hidden flex flex-col">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-surface-container/60 text-on-surface-variant font-label-sm text-[11px] uppercase tracking-wider border-b border-outline-variant/20">
                <th className="py-3.5 px-space-md" scope="col">Order ID</th>
                <th className="py-3.5 px-space-md" scope="col">Customer</th>
                <th className="py-3.5 px-space-md" scope="col">Items Reserved</th>
                <th className="py-3.5 px-space-md" scope="col">Pickup Date &amp; Slot</th>
                <th className="py-3.5 px-space-md" scope="col">Amount</th>
                <th className="py-3.5 px-space-md" scope="col">Status</th>
                <th className="py-3.5 px-space-md text-right" scope="col">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-high/50 text-on-surface text-xs">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-on-surface-variant">
                    <div className="w-16 h-16 rounded-full bg-surface-container mx-auto flex items-center justify-center mb-space-sm text-primary">
                      <span className="material-symbols-outlined text-[32px]">receipt_long</span>
                    </div>
                    <h3 className="font-headline-sm text-on-surface font-bold text-base">
                      No pre-orders yet.
                    </h3>
                    <p className="text-xs text-on-surface-variant mt-1 mb-space-md max-w-sm mx-auto">
                      Incoming orders from Saturday &amp; Wednesday market attendees will appear here.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-surface-container-low/60 transition-colors">
                    {/* Order ID */}
                    <td className="py-3.5 px-space-md font-mono font-bold text-primary">
                      <button
                        type="button"
                        onClick={() => setDetailModalOrder(ord)}
                        className="hover:underline cursor-pointer"
                      >
                        {ord.id}
                      </button>
                    </td>

                    {/* Customer Name & Phone */}
                    <td className="py-3.5 px-space-md">
                      <div className="flex flex-col">
                        <span className="font-bold text-on-surface">{ord.customer}</span>
                        <span className="text-[11px] text-on-surface-variant">{ord.phone}</span>
                      </div>
                    </td>

                    {/* Items */}
                    <td className="py-3.5 px-space-md">
                      <span className="font-medium text-on-surface line-clamp-1 max-w-[200px]" title={ord.itemsSummary}>
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

                    {/* Status Badge */}
                    <td className="py-3.5 px-space-md">
                      {renderStatusBadge(ord.status)}
                    </td>

                    {/* Dynamic Action Buttons per Status */}
                    <td className="py-3.5 px-space-md text-right">
                      <div className="inline-flex items-center gap-1.5 justify-end">
                        
                        {/* Placed -> Accept / Decline */}
                        {ord.status === 'Placed' && (
                          <>
                            <button
                              type="button"
                              onClick={() => promptStatusChange(ord, 'Accepted', 'Accept Pre-Order')}
                              className="px-2.5 py-1.5 rounded-lg bg-primary text-on-primary hover:bg-primary-container font-bold text-xs cursor-pointer shadow-sm"
                            >
                              Accept
                            </button>
                            <button
                              type="button"
                              onClick={() => promptStatusChange(ord, 'Cancelled', 'Decline Pre-Order')}
                              className="px-2.5 py-1.5 rounded-lg bg-surface-container text-error hover:bg-error-container hover:text-on-error-container font-bold text-xs cursor-pointer"
                            >
                              Decline
                            </button>
                          </>
                        )}

                        {/* Accepted -> Mark Ready for Pickup */}
                        {ord.status === 'Accepted' && (
                          <button
                            type="button"
                            onClick={() => promptStatusChange(ord, 'Ready for Pickup', 'Mark Crate Ready')}
                            className="px-2.5 py-1.5 rounded-lg bg-secondary-fixed text-on-secondary-fixed-variant hover:bg-secondary-fixed-dim font-bold text-xs cursor-pointer shadow-sm flex items-center gap-1"
                          >
                            <span className="material-symbols-outlined text-[15px]">inventory</span>
                            <span>Mark Ready</span>
                          </button>
                        )}

                        {/* Ready for Pickup -> Mark Completed */}
                        {ord.status === 'Ready for Pickup' && (
                          <button
                            type="button"
                            onClick={() => promptStatusChange(ord, 'Completed', 'Confirm Customer Pickup')}
                            className="px-2.5 py-1.5 rounded-lg bg-primary text-on-primary hover:bg-primary-container font-bold text-xs cursor-pointer shadow-sm flex items-center gap-1"
                          >
                            <span className="material-symbols-outlined text-[15px]">check_circle</span>
                            <span>Mark Completed</span>
                          </button>
                        )}

                        {/* View Button */}
                        <button
                          type="button"
                          onClick={() => setDetailModalOrder(ord)}
                          className="p-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface cursor-pointer"
                          title="View Order Details"
                        >
                          <span className="material-symbols-outlined text-[17px]">visibility</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-space-md bg-surface-container/40 flex items-center justify-between border-t border-outline-variant/20 text-xs">
          <span className="font-body-sm text-on-surface-variant">
            Showing <span className="font-bold text-on-surface">{filteredOrders.length}</span> reservations
          </span>
          <span className="text-[11px] text-on-surface-variant">
            Pickup Verification: Customer presents reservation slip ID at counter.
          </span>
        </div>
      </div>

      {/* ======================================================== */}
      {/* MODAL: ORDER DETAILS & TIMELINE PANEL                   */}
      {/* ======================================================== */}
      {detailModalOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full p-space-lg shadow-2xl flex flex-col gap-space-md border border-outline-variant/40 my-8 text-xs">
            
            {/* Header */}
            <div className="flex items-start justify-between border-b border-outline-variant/20 pb-space-sm">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-headline-sm text-on-surface font-bold text-lg">
                    Order {detailModalOrder.id}
                  </h3>
                  {renderStatusBadge(detailModalOrder.status)}
                </div>
                <span className="text-[11px] text-on-surface-variant">
                  {detailModalOrder.pickupDate} • {detailModalOrder.pickupSlot}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setDetailModalOrder(null)}
                className="p-1 text-on-surface-variant hover:text-on-surface rounded-lg cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Customer Contact */}
            <div className="p-3 bg-surface-container-low rounded-xl flex flex-col gap-1 border border-outline-variant/20">
              <span className="text-[10px] uppercase font-bold text-on-surface-variant">Customer Details</span>
              <div className="flex justify-between font-bold">
                <span className="text-on-surface">{detailModalOrder.customer}</span>
                <span className="text-primary">{detailModalOrder.phone}</span>
              </div>
              <span className="text-on-surface-variant">{detailModalOrder.email}</span>
              {detailModalOrder.specialNotes && (
                <div className="mt-1 pt-1 border-t border-outline-variant/20 text-[11px] text-on-surface italic">
                  Note: "{detailModalOrder.specialNotes}"
                </div>
              )}
            </div>

            {/* Full Item List */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] uppercase font-bold text-on-surface-variant">Packed Items</span>
              <div className="border border-outline-variant/30 rounded-xl overflow-hidden divide-y divide-surface-container-high/60">
                {detailModalOrder.itemsList.map((it, idx) => (
                  <div key={idx} className="p-2.5 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-on-surface">{it.name}</span>
                      <span className="text-on-surface-variant text-[11px] block">
                        {it.qty} @ {it.price}
                      </span>
                    </div>
                    <span className="font-mono font-bold text-primary">{it.total}</span>
                  </div>
                ))}
                <div className="p-2.5 bg-surface-container/40 flex items-center justify-between font-bold">
                  <span>Total Order Due at Stall</span>
                  <span className="font-mono text-base text-primary">{detailModalOrder.totalAmount}</span>
                </div>
              </div>
            </div>

            {/* Status History Timeline */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] uppercase font-bold text-on-surface-variant">Audit Timeline</span>
              <div className="flex flex-col gap-2 pl-2 border-l-2 border-primary/30">
                {detailModalOrder.timeline.map((event, idx) => (
                  <div key={idx} className="flex flex-col text-[11px]">
                    <span className="font-bold text-on-surface">{event.text}</span>
                    <span className="text-on-surface-variant">{event.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-outline-variant/20">
              <button
                type="button"
                onClick={() => {
                  showToast?.(`Packing slip for ${detailModalOrder.id} printed.`);
                }}
                className="px-space-md py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-bold cursor-pointer flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">print</span>
                <span>Print Slip</span>
              </button>

              <button
                type="button"
                onClick={() => setDetailModalOrder(null)}
                className="px-space-md py-2 rounded-xl bg-primary text-on-primary font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ACTION CONFIRMATION                               */}
      {/* ======================================================== */}
      {actionConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-surface-container-lowest rounded-2xl max-w-sm w-full p-space-lg shadow-2xl flex flex-col gap-space-md border border-outline-variant/40 text-xs">
            <div className="flex items-center gap-2.5 text-primary">
              <span className="material-symbols-outlined text-[24px]">verified</span>
              <h3 className="font-headline-sm text-on-surface font-bold text-base">
                {actionConfirm.actionTitle}
              </h3>
            </div>

            <p className="text-on-surface-variant leading-relaxed">
              Are you sure you want to transition order{' '}
              <strong className="text-on-surface font-bold">{actionConfirm.order.id}</strong> to{' '}
              <strong className="text-primary font-bold">{actionConfirm.newStatus}</strong>?
              The customer will be notified via their MarketLink dashboard.
            </p>

            <div className="flex justify-end gap-2 pt-2 border-t border-outline-variant/20">
              <button
                type="button"
                onClick={() => setActionConfirm(null)}
                className="px-3.5 py-1.5 rounded-lg bg-surface-container font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={executeStatusChange}
                className="px-4 py-1.5 rounded-lg bg-primary text-on-primary font-bold cursor-pointer shadow-sm"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
