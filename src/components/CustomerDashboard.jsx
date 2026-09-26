import React, { useState, useEffect } from 'react';
import CustomerOrders from './CustomerOrders';
import CustomerCart from './CustomerCart';
import CustomerFavorites from './CustomerFavorites';
import CustomerReviews from './CustomerReviews';
import CustomerSettings from './CustomerSettings';
import customerApi from '../api/customer';
import { useAuth } from '../context/AuthContext';
import { DashboardSidebar, DashboardHeader, DashboardToast, StatusBadge, StatCard, DashboardTickerBanner } from './DashboardShell';

export default function CustomerDashboard({ onNavigate, initialTab = 'dashboard' }) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Quick Toast Notification helper
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Customer Profile Info
  const customerProfile = {
    name: user?.name || 'Elena Rostova',
    initials: (user?.name || 'ER').split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase(),
    email: user?.email || 'elena.rostova@gmail.com',
    location: user?.address || 'South Park Blocks, Portland',
    memberSince: 'Member since 2024'
  };

  // Sidebar Nav Items (Matching Customer Dashboard Layout Rules)
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'orders', label: 'My Orders', icon: 'receipt_long' },
    { id: 'cart', label: 'Cart & Checkout', icon: 'shopping_cart' },
    { id: 'favorites', label: 'Favorites', icon: 'favorite' },
    { id: 'reviews', label: 'My Reviews', icon: 'rate_review' },
    { id: 'settings', label: 'Profile & Settings', icon: 'settings' }
  ];

  // Active Orders Mini Table Data for Dashboard Home
  const [activeOrdersMini, setActiveOrdersMini] = useState([
    {
      id: '#ML-8920',
      farmer: 'Green Pastures Organic',
      items: '4 lbs Brandywine Tomatoes, 2 Chard, Basil',
      pickupSlot: 'Sat, Oct 18 • 9:30 AM – 11:00 AM',
      market: 'Pioneer Pavilion Heritage Market',
      status: 'Placed'
    },
    {
      id: '#ML-8918',
      farmer: 'Mountain View Orchard & Cider',
      items: '1 gal Apple Cider, 4 lbs Honeycrisp',
      pickupSlot: 'Sat, Oct 18 • 10:00 AM – 11:30 AM',
      market: 'Riverside Twilight Market',
      status: 'Ready for Pickup'
    }
  ]);

  // Load live active customer orders
  useEffect(() => {
    customerApi.getOrders({ status: 'active' })
      .then((res) => {
        if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
          const mapped = res.data.map((o) => {
            let uiStatus = 'Placed';
            if (o.order_status === 'accepted') uiStatus = 'Accepted';
            else if (o.order_status === 'ready' || o.order_status === 'ready_for_pickup') uiStatus = 'Ready for Pickup';
            else if (o.order_status === 'completed') uiStatus = 'Completed';

            const itemsStr = (o.items || []).map((it) => `${it.quantity} ${it.product_name || it.product?.name || 'Item'}`).join(', ');

            return {
              id: `#ML-${o.id}`,
              farmer: o.farmer?.farmer_profile?.stall_name || o.farmer?.name || 'Local Farm',
              items: itemsStr || 'Fresh farm harvest',
              pickupSlot: `${o.pickup_date || 'Weekend'} • ${o.pickup_time || 'Morning'}`,
              market: o.market?.market_name || 'Downtown Saturday Market',
              status: uiStatus
            };
          });
          setActiveOrdersMini(mapped);
        }
      })
      .catch((err) => console.warn('Could not load active orders:', err));
  }, []);

  // Recommended Products for Dashboard Home
  const recommendedProducts = [
    {
      id: 'rec-1',
      name: 'Organic Sweet Bell Peppers',
      farmer: 'Green Pastures Organic',
      price: '$3.50',
      unit: '/ lb',
      image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=400&q=80',
      badge: 'Pairs with your order'
    },
    {
      id: 'rec-2',
      name: 'Rustic Seeded Miche Sourdough',
      farmer: 'Miller & Stone Hearth Bakery',
      price: '$8.00',
      unit: '/ boule',
      image: 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=400&q=80',
      badge: 'Popular at Downtown Market'
    },
    {
      id: 'rec-3',
      name: 'Wild Blackberry Blossom Raw Honey',
      farmer: 'Cascade Apiaries & Botanicals',
      price: '$14.00',
      unit: '/ 16oz jar',
      image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=400&q=80',
      badge: 'Back in stock!'
    },
    {
      id: 'rec-4',
      name: 'Artisan Herbed Goat Chèvre',
      farmer: 'Riverbend Goat Dairy',
      price: '$9.00',
      unit: '/ 8oz tub',
      image: 'https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&w=400&q=80',
      badge: 'Farmstead Fresh'
    }
  ];

  // Favorite Farmers Mini List
  const favoriteFarmersMini = [
    {
      id: 'ff-1',
      name: 'Green Pastures Organic',
      market: 'Pioneer Pavilion • Stall #08',
      rating: '4.95',
      reviewCount: 148,
      harvest: 'Heirloom Tomatoes & Baby Greens'
    },
    {
      id: 'ff-2',
      name: 'Mountain View Orchard & Cider',
      market: 'Riverside Twilight Market • Pier 4',
      rating: '4.88',
      reviewCount: 94,
      harvest: 'Fresh Cider & Honeycrisp Apples'
    },
    {
      id: 'ff-3',
      name: 'Miller & Stone Hearth Bakery',
      market: 'Downtown Saturday Market • Space 19',
      rating: '4.92',
      reviewCount: 210,
      harvest: 'Naturally Leavened Sourdough'
    }
  ];

  // Status Badge Helper
  const renderStatusBadge = (status) => {
    switch (status) {
      case 'Placed':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-[#e0f2fe] text-[#0369a1] border border-blue-200 text-[11px] font-bold">
            Placed
          </span>
        );
      case 'Accepted':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-[#ffedd5] text-[#c2410c] border border-amber-200 text-[11px] font-bold">
            Accepted
          </span>
        );
      case 'Ready for Pickup':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-[#ecfccb] text-[#3f6212] border border-lime-300 text-[11px] font-bold">
            Ready for Pickup
          </span>
        );
      case 'Completed':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-[#dcfce7] text-[#15803d] border border-emerald-200 text-[11px] font-bold">
            Completed
          </span>
        );
      case 'Cancelled':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-[#fee2e2] text-[#b91c1c] border border-red-200 text-[11px] font-bold">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant text-[11px] font-bold">
            {status}
          </span>
        );
    }
  };

  const handleAddToCartQuick = (prod) => {
    showToast(`🧺 Added 1 ${prod.name} to your pre-order cart!`);
  };

  return (
    <div className="w-full min-h-screen bg-surface font-body-md text-on-surface antialiased flex">
      {/* Premium Toast */}
      <DashboardToast message={toastMessage} onClose={() => setToastMessage(null)} />

      {/* Mobile Sidebar Backdrop */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
        ></div>
      )}

      {/* ======================================================== */}
      {/* FIXED LEFT SIDEBAR (COLLAPSIBLE ON MOBILE)               */}
      {/* ======================================================== */}
      {/* Premium Sidebar */}
      <DashboardSidebar
        role="customer"
        navItems={navItems}
        activeTab={activeTab}
        onSetTab={(id) => setActiveTab(id)}
        mobileSidebarOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        onNavigate={onNavigate}
        profileCard={{
          initials: customerProfile.initials,
          name: customerProfile.name,
          subtitle: customerProfile.location,
        }}
        footerActions={[
          { icon: 'storefront', label: 'Browse Local Markets', onClick: () => onNavigate && onNavigate('markets') },
          { icon: 'logout', label: 'Exit / Logout', onClick: () => onNavigate && onNavigate('home'), danger: true },
        ]}
      />

      {/* ======================================================== */}
      {/* RIGHT SIDE / MAIN WRAPPER                                */}
      {/* ======================================================== */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Premium Header */}
        <DashboardHeader
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          breadcrumb={[
            'Shopper Portal',
            activeTab === 'dashboard' ? 'Dashboard Home'
            : activeTab === 'orders' ? 'My Orders'
            : activeTab === 'cart' ? 'Cart & Checkout'
            : activeTab === 'favorites' ? 'Favorites'
            : activeTab === 'reviews' ? 'My Reviews'
            : 'Profile & Settings'
          ]}
          headerRight={
            <>
              <button
                type="button"
                onClick={() => showToast('🔔 1 order is Ready for Pickup this Saturday at Pier 4!')}
                className="relative w-9 h-9 rounded-xl bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-primary/8 hover:text-primary transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">notifications</span>
                <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-tertiary text-white text-[9px] font-black flex items-center justify-center">1</span>
              </button>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-surface-container transition-colors cursor-pointer"
                >
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs shadow-sm"
                    style={{ background: 'linear-gradient(135deg, #125224, #3e6a00)', color: 'white' }}
                  >
                    {customerProfile.initials}
                  </div>
                  <div className="hidden sm:flex flex-col text-left">
                    <span className="font-bold text-on-surface text-xs">{customerProfile.name}</span>
                    <span className="text-[10px] text-on-surface-variant">Shopper</span>
                  </div>
                  <span className="material-symbols-outlined text-[18px] text-on-surface-variant">expand_more</span>
                </button>
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-[0_16px_40px_rgba(18,82,36,0.15)] border border-outline-variant/20 py-2 z-50 animate-bounce-in">
                    <div className="px-4 py-2.5 border-b border-outline-variant/15">
                      <p className="text-xs font-bold text-on-surface">{customerProfile.name}</p>
                      <p className="text-[11px] text-on-surface-variant truncate">{customerProfile.email}</p>
                    </div>
                    <button type="button" onClick={() => { setActiveTab('settings'); setUserDropdownOpen(false); }} className="w-full px-4 py-2 text-left text-xs font-semibold text-on-surface hover:bg-surface-container flex items-center gap-2 cursor-pointer">
                      <span className="material-symbols-outlined text-[16px] text-primary">person</span><span>Profile & Settings</span>
                    </button>
                    <button type="button" onClick={() => { setActiveTab('orders'); setUserDropdownOpen(false); }} className="w-full px-4 py-2 text-left text-xs font-semibold text-on-surface hover:bg-surface-container flex items-center gap-2 cursor-pointer">
                      <span className="material-symbols-outlined text-[16px] text-primary">receipt_long</span><span>My Orders</span>
                    </button>
                    <div className="border-t border-outline-variant/20 my-1" />
                    <button type="button" onClick={() => { setUserDropdownOpen(false); if (onNavigate) onNavigate('home'); }} className="w-full px-4 py-2 text-left text-xs font-semibold text-error hover:bg-error-container/30 flex items-center gap-2 cursor-pointer">
                      <span className="material-symbols-outlined text-[16px]">logout</span><span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          }
        />

        {/* ======================================================== */}
        {/* MAIN BODY CONTENT AREA                                   */}
        {/* ======================================================== */}
        <main className="w-full pt-16 bg-gradient-to-br from-surface via-surface-container-low/30 to-surface min-h-screen">
          {activeTab === 'dashboard' ? (
            /* 1. DASHBOARD HOME VIEW */
            <div className="px-gutter py-space-lg max-w-7xl mx-auto w-full flex flex-col gap-space-lg animate-fade-in">
              {/* Broadcast Alert */}
              <DashboardTickerBanner
                text="Weekend Harvest Notice: 14 regional farmers markets open Saturday 8 AM • Pre-orders held at stalls until 1:00 PM • SNAP matching tokens active"
                badge="HARVEST NOTICE"
                icon="calendar_month"
              />

              {/* Header: Welcome back + Date */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-outline-variant/40 pb-5">
                <div>
                  <h1 className="font-headline-md text-2xl sm:text-3xl text-on-surface font-bold tracking-tight">
                    Welcome back, {customerProfile.name.split(' ')[0]} 👋
                  </h1>
                  <p className="font-body-md text-xs sm:text-sm text-on-surface-variant mt-1">
                    Today is{' '}
                    <span className="font-bold text-[#2E6B3A]">
                      {new Date().toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                    . You have 2 harvest pickups scheduled for this weekend.
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setActiveTab('cart')}
                    className="px-4 py-2 rounded-xl bg-primary hover:bg-primary/95 text-on-primary text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[17px]">shopping_cart</span>
                    <span>View Cart (5 items)</span>
                  </button>
                </div>
              </div>

              {/* Row of 3 Stat Cards with Sparklines */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <StatCard
                  icon="receipt_long"
                  label="Active Orders"
                  value={activeOrdersMini.length}
                  trend="1 ready for pickup"
                  trendUp={true}
                  iconBg="bg-blue-50"
                  iconColor="text-[#0369a1]"
                  sparkline={[20, 30, 45, 60, 50, 75, 90]}
                />
                <StatCard
                  icon="check_circle"
                  label="Completed Pickups"
                  value="14"
                  trend="+4 this season"
                  trendUp={true}
                  iconBg="bg-emerald-50"
                  iconColor="text-emerald-700"
                  sparkline={[30, 45, 55, 65, 75, 85, 95]}
                />
                <StatCard
                  icon="favorite"
                  label="Saved Favorites"
                  value="10"
                  trend="4 Growers • 6 Items"
                  trendUp={true}
                  iconBg="bg-amber-50"
                  iconColor="text-[#F28C28]"
                  sparkline={[40, 50, 60, 70, 80, 85, 90]}
                />
              </div>

              {/* Ready for Pickup Digital Pass Card */}
              <div className="bg-gradient-to-r from-primary-fixed/40 via-surface-container-lowest to-surface-container-lowest border border-primary/20 rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center flex-shrink-0 shadow-md">
                    <span className="material-symbols-outlined text-[32px]">qr_code_scanner</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded-full bg-primary text-white font-black text-[9px] uppercase tracking-wider">
                        READY THIS SATURDAY
                      </span>
                      <span className="text-xs font-mono font-bold text-on-surface-variant">#ML-8918</span>
                    </div>
                    <h3 className="font-bold text-on-surface text-base sm:text-lg">
                      Mountain View Orchard &bull; Riverside Twilight Market
                    </h3>
                    <p className="text-xs text-on-surface-variant mt-0.5">
                      Pickup Window: <strong>Sat, Oct 18 &bull; 10:00 AM – 11:30 AM</strong> at Pier 4 &bull; 1 gal Apple Cider, 4 lbs Honeycrisp
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end md:self-auto">
                  <div className="hidden sm:flex flex-col items-center bg-white p-2 rounded-xl border border-outline-variant/30 shadow-2xs">
                    <span className="font-mono text-[9px] text-on-surface-variant tracking-widest font-black">||| | || |||| |</span>
                    <span className="text-[8px] text-on-surface-variant/70 font-mono">PASS-8918-OR</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('orders')}
                    className="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">receipt_long</span>
                    <span>View Pickup Slip</span>
                  </button>
                </div>
              </div>

              {/* Widget 1: "Active Orders" Mini Table */}
              <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 overflow-hidden shadow-sm">
                <div className="p-5 border-b border-outline-variant/30 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#E6F0E1] text-primary flex items-center justify-center font-bold">
                      <span className="material-symbols-outlined text-[18px]">inventory_2</span>
                    </div>
                    <div>
                      <h2 className="font-headline-sm text-base font-bold text-on-surface">
                        Active Pre-Orders
                      </h2>
                      <p className="text-xs text-on-surface-variant">Scheduled for in-person market collection</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveTab('orders')}
                    className="text-xs font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>View All Orders</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-surface-container-low text-on-surface-variant uppercase font-semibold text-[10px] tracking-wider border-b border-outline-variant/30">
                        <th className="py-3 px-4">Order ID</th>
                        <th className="py-3 px-4">Farmer / Stall</th>
                        <th className="py-3 px-4">Items Summary</th>
                        <th className="py-3 px-4">Pickup Window</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/20 font-body-sm">
                      {activeOrdersMini.map((ord) => (
                        <tr key={ord.id} className="hover:bg-surface-container-low/40 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-on-surface whitespace-nowrap">
                            {ord.id}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="font-bold text-on-surface block">{ord.farmer}</span>
                            <span className="text-[11px] text-on-surface-variant">{ord.market}</span>
                          </td>
                          <td className="py-3.5 px-4 max-w-xs truncate text-on-surface-variant">
                            {ord.items}
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap text-on-surface">
                            {ord.pickupSlot}
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            {renderStatusBadge(ord.status)}
                          </td>
                          <td className="py-3.5 px-4 text-right whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => setActiveTab('orders')}
                              className="px-3 py-1.5 rounded-lg border border-outline hover:border-primary text-primary font-bold text-xs bg-surface cursor-pointer shadow-2xs"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* In-Person Payment Reminder Note */}
                <div className="px-5 py-3 bg-[#FBF8F1] border-t border-outline-variant/20 flex items-center justify-between text-xs text-on-surface">
                  <span className="flex items-center gap-1.5 text-on-surface-variant">
                    <span className="material-symbols-outlined text-[16px] text-[#F28C28]">payments</span>
                    <span>Note: All orders are paid in person at pickup (Cash, Card terminal, or SNAP tokens).</span>
                  </span>
                </div>
              </div>

              {/* Grid with 2 Columns: "Recommended for You" & "Favorite Farmers" */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Widget 2: "Recommended for You" Product Cards (8 cols) */}
                <div className="lg:col-span-8 bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-5 sm:p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                        <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                      </div>
                      <div>
                        <h2 className="font-headline-sm text-base font-bold text-on-surface">
                          Recommended for You
                        </h2>
                        <p className="text-xs text-on-surface-variant">Based on your favorites & seasonal harvests</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onNavigate && onNavigate('products')}
                      className="text-xs font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Catalog</span>
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {recommendedProducts.map((prod) => (
                      <div
                        key={prod.id}
                        className="p-3.5 rounded-xl border border-outline-variant/40 hover:border-primary/40 bg-surface flex gap-3.5 transition-all group"
                      >
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="w-20 h-20 rounded-xl object-cover border border-outline-variant/30 shrink-0"
                        />
                        <div className="flex flex-col justify-between flex-1 min-w-0">
                          <div>
                            <span className="text-[10px] text-[#F28C28] font-bold block truncate">
                              {prod.badge}
                            </span>
                            <h3 className="font-headline-sm text-xs sm:text-sm font-bold text-on-surface truncate">
                              {prod.name}
                            </h3>
                            <span className="text-[11px] text-on-surface-variant block truncate">
                              {prod.farmer}
                            </span>
                          </div>

                          <div className="flex items-center justify-between pt-1">
                            <span className="font-headline-sm text-sm font-bold text-primary">
                              {prod.price} <span className="text-[10px] font-normal text-on-surface-variant">{prod.unit}</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => handleAddToCartQuick(prod)}
                              className="px-2.5 py-1 rounded-lg bg-[#E6F0E1] text-[#2E6B3A] hover:bg-primary hover:text-white text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1"
                            >
                              <span className="material-symbols-outlined text-[14px]">add</span>
                              <span>Add</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Widget 3: "Your Favorite Farmers" Mini List (4 cols) */}
                <div className="lg:col-span-4 bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-5 sm:p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-[20px]">agriculture</span>
                      <h2 className="font-headline-sm text-base font-bold text-on-surface">
                        Favorite Farmers
                      </h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('favorites')}
                      className="text-xs font-bold text-primary hover:underline cursor-pointer"
                    >
                      All (4)
                    </button>
                  </div>

                  <div className="space-y-3">
                    {favoriteFarmersMini.map((farmer) => (
                      <div
                        key={farmer.id}
                        className="p-3 rounded-xl bg-surface-container-low/60 border border-outline-variant/30 space-y-2 hover:border-outline-variant transition-colors"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-headline-sm text-xs font-bold text-on-surface">
                              {farmer.name}
                            </h3>
                            <p className="text-[11px] text-on-surface-variant">
                              {farmer.market}
                            </p>
                          </div>
                          <div className="flex items-center gap-0.5 bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded text-[10px] font-bold shrink-0">
                            <span className="material-symbols-outlined text-[12px]">star</span>
                            <span>{farmer.rating}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-[11px] pt-1 border-t border-outline-variant/20">
                          <span className="text-on-surface-variant truncate mr-2">
                            🌾 {farmer.harvest}
                          </span>
                          <button
                            type="button"
                            onClick={() => onNavigate && onNavigate('farmer-profile')}
                            className="font-bold text-[#2E6B3A] hover:underline shrink-0 cursor-pointer"
                          >
                            Visit Stall
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : activeTab === 'orders' ? (
            /* 2. MY ORDERS VIEW */
            <CustomerOrders
              onNavigate={onNavigate}
              showToast={showToast}
              onAddToCart={handleAddToCartQuick}
            />
          ) : activeTab === 'cart' ? (
            /* 3. CART & CHECKOUT VIEW */
            <CustomerCart
              onNavigate={(view) => {
                if (view === 'orders' || view === 'favorites') {
                  setActiveTab(view);
                } else if (onNavigate) {
                  onNavigate(view);
                }
              }}
              showToast={showToast}
            />
          ) : activeTab === 'favorites' ? (
            /* 4. FAVORITES VIEW */
            <CustomerFavorites
              onNavigate={(view) => {
                if (view === 'cart' || view === 'orders') {
                  setActiveTab(view);
                } else if (onNavigate) {
                  onNavigate(view);
                }
              }}
              showToast={showToast}
              onAddToCart={handleAddToCartQuick}
            />
          ) : activeTab === 'reviews' ? (
            /* 5. MY REVIEWS VIEW */
            <CustomerReviews
              onNavigate={(view) => {
                if (view === 'orders') {
                  setActiveTab('orders');
                } else if (onNavigate) {
                  onNavigate(view);
                }
              }}
              showToast={showToast}
            />
          ) : (
            /* 6. PROFILE & SETTINGS VIEW */
            <CustomerSettings
              onNavigate={(view) => {
                if (view === 'dashboard' || view === 'orders') {
                  setActiveTab(view);
                } else if (onNavigate) {
                  onNavigate(view);
                }
              }}
              showToast={showToast}
            />
          )}
        </main>
      </div>
    </div>
  );
}
