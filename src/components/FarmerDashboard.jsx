import React, { useState } from 'react';
import FarmerProducts from './FarmerProducts';
import FarmerStockTemplate from './FarmerStockTemplate';
import FarmerPreOrders from './FarmerPreOrders';
import FarmerReviews from './FarmerReviews';
import FarmerSettings from './FarmerSettings';

export default function FarmerDashboard({ onNavigate, initialTab = 'dashboard' }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Quick Toast Notification helper
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Farmer / Stall Profile
  const stallInfo = {
    name: 'Green Pastures Organic',
    tagline: 'Stall #08 • Pioneer Pavilion & Downtown Sat',
    owner: 'Marcus Thorne',
    initials: 'GP',
    rating: '4.95 ★'
  };

  // Sidebar Navigation Items
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'products', label: 'My Products', icon: 'inventory_2' },
    { id: 'stock-template', label: 'Weekly Stock', icon: 'event_repeat' },
    { id: 'pre-orders', label: 'Pre-Orders', icon: 'receipt_long' },
    { id: 'reviews', label: 'Reviews', icon: 'rate_review' },
    { id: 'settings', label: 'Profile & Stall Settings', icon: 'storefront' }
  ];

  // Mini Dashboard Home Data
  const recentIncomingOrders = [
    { id: '#ML-8920', customer: 'Elena Rostova', items: '4 lbs Tomatoes, 2 bunches Chard', slot: '9:30 AM – 11:00 AM', status: 'Placed' },
    { id: '#ML-8919', customer: 'Claire Thompson', items: '2 Romanesco, 3 snap peas', slot: '8:00 AM – 9:30 AM', status: 'Accepted' },
    { id: '#ML-8914', customer: 'David Reynolds', items: '6 lbs Tomatoes, 4 basil', slot: '8:00 AM – 9:30 AM', status: 'Ready for Pickup' }
  ];

  const stockAlerts = [
    { id: 'p-2', name: 'Rainbow Swiss Chard', qty: '4 bunches left', alertType: 'Low Stock', color: 'text-[#F28C28]' },
    { id: 'p-4', name: 'Sweet Italian Genovese Basil', qty: '0 bunches (Sold Out)', alertType: 'Sold Out', color: 'text-error' },
    { id: 'p-5', name: 'Japanese Sweet Bell Peppers', qty: 'Harvest in 10 days', alertType: 'Unavailable', color: 'text-on-surface-variant' }
  ];

  const recentReviewsMini = [
    { id: 1, customer: 'Elena Rostova', rating: 5, excerpt: 'The absolute best tomatoes in Portland! Thin skin and rich sweetness.', time: '2 hrs ago' },
    { id: 2, customer: 'Marcus Brody', rating: 5, excerpt: 'Romanesco was a work of art! Both aesthetically stunning and delicious.', time: 'Yesterday' }
  ];

  const renderStatusBadgeMini = (status) => {
    switch (status) {
      case 'Placed':
        return <span className="px-2 py-0.5 rounded-full bg-[#e0f2fe] text-[#0369a1] text-[10px] font-bold">Placed</span>;
      case 'Accepted':
        return <span className="px-2 py-0.5 rounded-full bg-[#ffedd5] text-[#c2410c] text-[10px] font-bold">Accepted</span>;
      case 'Ready for Pickup':
        return <span className="px-2 py-0.5 rounded-full bg-[#ecfccb] text-[#3f6212] text-[10px] font-bold">Ready</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant text-[10px] font-bold">{status}</span>;
    }
  };

  return (
    <div className="w-full min-h-screen bg-surface font-body-md text-on-surface antialiased flex">
      
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-inverse-surface text-inverse-on-surface px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 z-50 animate-fade-in border border-white/10 text-xs font-bold">
          <span className="material-symbols-outlined text-primary-fixed text-[20px]">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Mobile Sidebar Backdrop */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
        ></div>
      )}

      {/* ======================================================== */}
      {/* LEFT SIDEBAR NAVIGATION                                 */}
      {/* ======================================================== */}
      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-primary text-on-primary z-50 flex flex-col justify-between shadow-xl transition-transform duration-300 lg:translate-x-0 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col">
          {/* Logo & Stall Badge */}
          <div className="h-16 px-space-md flex items-center justify-between bg-primary border-b border-white/10">
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="flex items-center gap-space-sm text-left cursor-pointer group"
            >
              <img
                alt="MarketLink Logo"
                className="h-8 w-auto object-contain transition-transform group-hover:scale-105"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCFwAFs6oHB8haDF1tl4Mghi6ExChfSnMT0HUZ3KzWZpfwDZmxDa5chfAz9TvTulJs3Bdw8iGQW1Gc4oovdfiDiFEAQ2AO__M63AeCprLWKXqNVfLMk-S8LaCZ1H-W0t-rB7U0Um8AXbt_zaXYass_8WIcTnOZZYWvQ2v_QvDSCkLFil8Bz8fkKvh0QKUHosXk5Ci9tCGYU9VbtwxlCDxU2nQ6f2Mk3PQVbgOKaADFK9ehQy4lbyNr9"
              />
              <span className="font-headline-sm text-headline-sm text-on-primary font-bold">MarketLink</span>
            </button>
            <span className="px-space-xs py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant font-label-sm text-[10px] uppercase tracking-wider font-bold">
              Farmer
            </span>
          </div>

          {/* Current Stall Quick Card */}
          <div className="p-3 mx-space-sm mt-space-sm rounded-xl bg-primary-container/80 border border-white/10 flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-surface-container-lowest text-primary font-bold flex items-center justify-center text-xs shrink-0 shadow-sm">
              {stallInfo.initials}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-headline-sm text-xs font-bold text-white truncate">
                {stallInfo.name}
              </span>
              <span className="text-[10px] text-primary-fixed-dim truncate">
                {stallInfo.tagline}
              </span>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="flex flex-col gap-1 px-space-sm mt-space-md">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileSidebarOpen(false);
                  }}
                  className={`flex items-center gap-space-sm px-space-md py-2.5 rounded-xl transition-all cursor-pointer text-xs font-bold text-left ${
                    isActive
                      ? 'bg-surface-container-lowest text-primary font-label-md shadow-md'
                      : 'text-primary-fixed-dim hover:bg-primary-container hover:text-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-space-md flex flex-col gap-1 border-t border-white/10">
          <button
            type="button"
            onClick={() => onNavigate('farmer-profile')}
            className="flex items-center gap-space-sm px-space-md py-2 rounded-lg text-primary-fixed-dim hover:bg-primary-container hover:text-white font-body-sm text-xs transition-colors cursor-pointer text-left"
          >
            <span className="material-symbols-outlined text-[18px]">visibility</span>
            <span>View Public Stall Profile</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="flex items-center gap-space-sm px-space-md py-2 rounded-lg text-primary-fixed-dim hover:bg-error-container hover:text-on-error-container font-body-sm text-xs transition-colors cursor-pointer text-left"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            <span>Exit / Logout</span>
          </button>
        </div>
      </aside>

      {/* ======================================================== */}
      {/* RIGHT SIDE / MAIN WRAPPER                                */}
      {/* ======================================================== */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        
        {/* TOP BAR */}
        <header className="fixed top-0 left-0 lg:left-64 right-0 h-16 bg-surface/90 backdrop-blur-xl shadow-sm z-40 flex items-center justify-between px-gutter border-b border-outline-variant/30">
          <div className="flex items-center gap-space-md">
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              aria-label="Toggle Sidebar"
              className="lg:hidden p-2 rounded-lg text-on-surface-variant hover:bg-surface-container cursor-pointer"
            >
              <span className="material-symbols-outlined text-[22px]">menu</span>
            </button>

            {/* Breadcrumb */}
            <div className="flex items-center gap-space-xs font-body-sm text-xs text-on-surface-variant">
              <span className="material-symbols-outlined text-[17px]">agriculture</span>
              <span>/</span>
              <span className="font-label-md text-on-surface font-bold">Farmer Portal</span>
              <span>/</span>
              <span className="text-primary font-bold">
                {activeTab === 'dashboard'
                  ? 'Stall Overview'
                  : activeTab === 'products'
                  ? 'My Products'
                  : activeTab === 'stock-template'
                  ? 'Weekly Stock Template'
                  : activeTab === 'pre-orders'
                  ? 'Pre-Orders Queue'
                  : activeTab === 'reviews'
                  ? 'Customer Feedback'
                  : 'Stall Settings'}
              </span>
            </div>
          </div>

          {/* Right Top Bar Controls */}
          <div className="flex items-center gap-space-md sm:gap-space-lg">
            {/* Notification Bell */}
            <button
              type="button"
              onClick={() => showToast('🔔 2 new reservations waiting for weekend packing.')}
              className="p-2 text-on-surface-variant hover:text-on-surface transition-colors relative cursor-pointer"
              title="Notifications"
            >
              <span className="material-symbols-outlined text-[22px]">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#F28C28] text-white font-label-sm text-[10px] flex items-center justify-center font-bold">
                2
              </span>
            </button>

            {/* Farmer Avatar & Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-space-sm pl-space-xs cursor-pointer group"
              >
                <div className="hidden sm:flex flex-col text-right">
                  <span className="font-label-md text-on-surface text-xs font-bold group-hover:text-primary">
                    {stallInfo.name}
                  </span>
                  <span className="font-label-sm text-secondary text-[11px] font-bold">
                    {stallInfo.owner} • {stallInfo.rating}
                  </span>
                </div>
                <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-xs shadow-sm">
                  MT
                </div>
                <span className="material-symbols-outlined text-on-surface-variant text-[18px]">
                  expand_more
                </span>
              </button>

              {/* Dropdown Menu */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-surface-container-lowest rounded-xl shadow-xl border border-outline-variant/30 py-1.5 z-50 animate-fade-in text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('settings');
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-surface-container text-on-surface flex items-center gap-2 cursor-pointer font-bold"
                  >
                    <span className="material-symbols-outlined text-[16px] text-primary">person</span>
                    <span>Stall Profile</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onNavigate('farmer-profile');
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-surface-container text-on-surface flex items-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px] text-secondary">storefront</span>
                    <span>Public Storefront</span>
                  </button>
                  <div className="my-1 border-t border-outline-variant/20"></div>
                  <button
                    type="button"
                    onClick={() => {
                      onNavigate('home');
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-error-container text-error flex items-center gap-2 cursor-pointer font-bold"
                  >
                    <span className="material-symbols-outlined text-[16px]">logout</span>
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ======================================================== */}
        {/* MAIN BODY CONTENT                                       */}
        {/* ======================================================== */}
        <main className="w-full pt-16 bg-surface min-h-screen">
          
          {/* TAB 1: DASHBOARD HOME */}
          {activeTab === 'dashboard' && (
            <div className="px-gutter py-space-lg max-w-7xl mx-auto w-full flex flex-col gap-space-lg animate-fade-in">
              
              {/* Reminder Banner: Order Cut-off Approaching */}
              <div className="p-space-md rounded-2xl bg-[#ffedd5] border border-[#fed7aa] flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm shadow-sm text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#F28C28] text-white flex items-center justify-center shrink-0 shadow-sm">
                    <span className="material-symbols-outlined text-[20px]">alarm</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-[#9a3412] text-xs sm:text-sm">
                      ⏰ Order Cut-off Approaching: Friday 8:00 PM
                    </span>
                    <span className="text-[#c2410c] text-[11px]">
                      Cut-off for Saturday Downtown Market pre-orders is approaching. 4 hours remaining to adjust stock limits before customers complete checkout.
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab('products')}
                  className="px-3 py-1.5 rounded-lg bg-[#F28C28] text-white hover:bg-[#ea580c] font-bold text-xs transition-colors cursor-pointer self-start sm:self-auto shrink-0 shadow-sm"
                >
                  Review Stock
                </button>
              </div>

              {/* Page Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h1 className="font-headline-lg text-headline-lg sm:text-3xl text-on-surface font-bold tracking-tight">
                    Welcome back, {stallInfo.name}
                  </h1>
                  <div className="flex items-center gap-2 text-on-surface-variant font-body-sm text-xs mt-0.5">
                    <span className="material-symbols-outlined text-[16px] text-primary">calendar_today</span>
                    <span>Saturday, October 18, 2025</span>
                    <span>•</span>
                    <span className="text-secondary font-bold">Saturday Downtown Market Stalls Open</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab('pre-orders')}
                  className="inline-flex items-center gap-1.5 px-space-md py-2 rounded-xl bg-primary text-on-primary font-label-md text-xs font-bold hover:bg-primary-container transition-colors shadow-sm cursor-pointer self-start sm:self-auto"
                >
                  <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                  <span>View All Pre-Orders</span>
                </button>
              </div>

              {/* Row of 4 Stat Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-space-md">
                {/* Total Orders */}
                <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="font-label-sm text-[11px] uppercase tracking-wider text-on-surface-variant font-bold">
                      Total Orders
                    </span>
                    <span className="material-symbols-outlined text-primary text-[22px]">shopping_bag</span>
                  </div>
                  <span className="font-headline-md text-2xl sm:text-3xl font-bold text-on-surface">
                    128
                  </span>
                  <span className="font-body-sm text-secondary flex items-center gap-1 font-bold text-xs">
                    <span className="material-symbols-outlined text-[15px]">trending_up</span> +18% this month
                  </span>
                </div>

                {/* Pending Orders */}
                <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="font-label-sm text-[11px] uppercase tracking-wider text-tertiary font-bold">
                      Pending Orders
                    </span>
                    <span className="material-symbols-outlined text-tertiary text-[22px]">pending_actions</span>
                  </div>
                  <span className="font-headline-md text-2xl sm:text-3xl font-bold text-tertiary">
                    6
                  </span>
                  <span className="font-body-sm text-on-surface-variant text-xs">
                    Awaiting harvest pack
                  </span>
                </div>

                {/* Revenue Summary */}
                <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="font-label-sm text-[11px] uppercase tracking-wider text-primary font-bold">
                      Revenue (This Week)
                    </span>
                    <span className="material-symbols-outlined text-primary text-[22px]">payments</span>
                  </div>
                  <span className="font-headline-md text-2xl sm:text-3xl font-bold text-primary font-mono">
                    $2,480.00
                  </span>
                  <span className="font-body-sm text-on-surface-variant text-xs">
                    Direct in-person collections
                  </span>
                </div>

                {/* Best-Selling Product */}
                <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="font-label-sm text-[11px] uppercase tracking-wider text-secondary font-bold">
                      Best-Seller
                    </span>
                    <span className="material-symbols-outlined text-secondary text-[22px]">eco</span>
                  </div>
                  <span className="font-headline-sm text-sm font-bold text-on-surface truncate">
                    Brandywine Tomatoes
                  </span>
                  <span className="font-body-sm text-secondary font-bold text-xs">
                    980 lbs sold this season
                  </span>
                </div>
              </div>

              {/* Main Content Grid: Left (Widgets) & Right (Widgets + Chart) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
                
                {/* Left: Incoming Pre-Orders Widget (7 cols) */}
                <div className="lg:col-span-7 bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm border border-outline-variant/30 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-space-md">
                      <div>
                        <h3 className="font-headline-sm text-on-surface font-bold text-base">
                          Incoming Pre-Orders
                        </h3>
                        <p className="font-body-sm text-on-surface-variant text-xs">
                          Latest shopper reservations for Saturday morning pickup
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveTab('pre-orders')}
                        className="text-primary hover:underline text-xs font-bold cursor-pointer"
                      >
                        View All
                      </button>
                    </div>

                    <div className="overflow-x-auto w-full">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-surface-container/60 text-on-surface-variant font-label-sm text-[10px] uppercase tracking-wider border-b border-outline-variant/20">
                            <th className="py-2.5 px-3">Order ID</th>
                            <th className="py-2.5 px-3">Customer</th>
                            <th className="py-2.5 px-3">Pickup Slot</th>
                            <th className="py-2.5 px-3">Status</th>
                            <th className="py-2.5 px-3 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-container-high/50 text-on-surface">
                          {recentIncomingOrders.map((o) => (
                            <tr key={o.id} className="hover:bg-surface-container-low/60 transition-colors">
                              <td className="py-3 px-3 font-mono font-bold text-primary">{o.id}</td>
                              <td className="py-3 px-3 font-bold">{o.customer}</td>
                              <td className="py-3 px-3 text-on-surface-variant text-[11px]">{o.slot}</td>
                              <td className="py-3 px-3">{renderStatusBadgeMini(o.status)}</td>
                              <td className="py-3 px-3 text-right">
                                <button
                                  type="button"
                                  onClick={() => setActiveTab('pre-orders')}
                                  className="px-2 py-1 rounded bg-surface-container hover:bg-surface-container-high text-primary font-bold text-[11px] cursor-pointer"
                                >
                                  View
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="mt-space-md pt-space-sm border-t border-outline-variant/20 flex items-center justify-between text-xs text-on-surface-variant">
                    <span>Stall voucher lookup active at counter</span>
                    <button
                      type="button"
                      onClick={() => setActiveTab('pre-orders')}
                      className="text-primary font-bold hover:underline"
                    >
                      Manage 128 Total Orders →
                    </button>
                  </div>
                </div>

                {/* Right: Low Stock Alerts + Recent Reviews (5 cols) */}
                <div className="lg:col-span-5 flex flex-col gap-space-lg">
                  
                  {/* Widget: Low Stock / Sold Out Alerts */}
                  <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm border border-outline-variant/30 flex flex-col gap-space-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#F28C28] text-[20px]">warning</span>
                        <h3 className="font-headline-sm text-on-surface font-bold text-sm">
                          Low Stock / Sold Out Alerts
                        </h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveTab('products')}
                        className="text-primary hover:underline text-[11px] font-bold cursor-pointer"
                      >
                        Inventory
                      </button>
                    </div>

                    <div className="flex flex-col gap-2">
                      {stockAlerts.map((it) => (
                        <div
                          key={it.id}
                          className="p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/20 flex items-center justify-between text-xs"
                        >
                          <div className="flex flex-col min-w-0">
                            <span className="font-bold text-on-surface truncate">{it.name}</span>
                            <span className={`text-[11px] font-bold ${it.color}`}>{it.qty}</span>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              showToast(`Restock modal opened for ${it.name}.`);
                              setActiveTab('products');
                            }}
                            className="px-2.5 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-bold text-xs cursor-pointer"
                          >
                            Restock
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Widget: Recent Reviews Mini List */}
                  <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm border border-outline-variant/30 flex flex-col gap-space-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-secondary text-[20px]">star</span>
                        <h3 className="font-headline-sm text-on-surface font-bold text-sm">
                          Recent Shopper Reviews
                        </h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveTab('reviews')}
                        className="text-primary hover:underline text-[11px] font-bold cursor-pointer"
                      >
                        All Reviews
                      </button>
                    </div>

                    <div className="flex flex-col gap-2">
                      {recentReviewsMini.map((rev) => (
                        <div
                          key={rev.id}
                          className="p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-col gap-1 text-xs"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-on-surface">{rev.customer}</span>
                            <div className="flex items-center gap-0.5 text-[#F28C28]">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <span key={s} className="material-symbols-outlined text-[13px]">star</span>
                              ))}
                            </div>
                          </div>
                          <p className="text-on-surface-variant text-[11px] italic line-clamp-1">
                            "{rev.excerpt}"
                          </p>
                          <div className="flex justify-end pt-0.5">
                            <button
                              type="button"
                              onClick={() => setActiveTab('reviews')}
                              className="text-primary hover:underline text-[11px] font-bold cursor-pointer"
                            >
                              Reply →
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>

              {/* Simple Chart Placeholder Block: Sales This Week */}
              <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm border border-outline-variant/30 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-space-sm">
                  <div>
                    <h3 className="font-headline-sm text-on-surface font-bold text-base">
                      Sales This Week
                    </h3>
                    <p className="font-body-sm text-on-surface-variant text-xs">
                      Daily pre-order dollar totals leading up to weekend market pickups
                    </p>
                  </div>
                  <span className="font-bold text-primary text-sm font-mono">$2,480.00 Total</span>
                </div>

                {/* SVG Visual Chart */}
                <div className="relative w-full h-40 bg-surface-container-low/50 rounded-xl p-3 flex flex-col justify-between border border-outline-variant/20 mt-2">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 500 120" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="farmerSalesGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2E6B3A" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#2E6B3A" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <line x1="0" y1="20" x2="500" y2="20" stroke="#c0c9bd" strokeOpacity="0.4" strokeDasharray="3 3" />
                    <line x1="0" y1="60" x2="500" y2="60" stroke="#c0c9bd" strokeOpacity="0.4" strokeDasharray="3 3" />
                    <line x1="0" y1="100" x2="500" y2="100" stroke="#c0c9bd" strokeOpacity="0.6" />

                    <polygon points="0,100 0,90 80,82 160,70 240,65 320,40 400,24 500,14 500,100" fill="url(#farmerSalesGrad)" />
                    <path d="M0,90 Q80,82 160,70 T320,40 T500,14" fill="none" stroke="#2E6B3A" strokeWidth="3" strokeLinecap="round" />
                    
                    {/* Points */}
                    {[{cx:0,cy:90},{cx:80,cy:82},{cx:160,cy:70},{cx:240,cy:65},{cx:320,cy:40},{cx:400,cy:24},{cx:500,cy:14}].map((pt,i)=>(
                      <circle key={i} cx={pt.cx} cy={pt.cy} r="4" fill="#ffffff" stroke="#2E6B3A" strokeWidth="2.5" />
                    ))}
                  </svg>

                  <div className="flex items-center justify-between text-[10px] text-on-surface-variant font-bold px-1 pt-1">
                    <span>Mon ($120)</span>
                    <span>Tue ($180)</span>
                    <span>Wed ($340)</span>
                    <span>Thu ($410)</span>
                    <span>Fri ($690)</span>
                    <span>Sat ($740)</span>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: MY PRODUCTS */}
          {activeTab === 'products' && (
            <FarmerProducts showToast={showToast} />
          )}

          {/* TAB 3: WEEKLY STOCK TEMPLATE */}
          {activeTab === 'stock-template' && (
            <FarmerStockTemplate showToast={showToast} />
          )}

          {/* TAB 4: PRE-ORDERS */}
          {activeTab === 'pre-orders' && (
            <FarmerPreOrders showToast={showToast} />
          )}

          {/* TAB 5: REVIEWS */}
          {activeTab === 'reviews' && (
            <FarmerReviews showToast={showToast} />
          )}

          {/* TAB 6: PROFILE & STALL SETTINGS */}
          {activeTab === 'settings' && (
            <FarmerSettings showToast={showToast} />
          )}

        </main>
      </div>

    </div>
  );
}
