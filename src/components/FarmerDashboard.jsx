import React, { useState, useEffect } from 'react';
import FarmerProducts from './FarmerProducts';
import FarmerStockTemplate from './FarmerStockTemplate';
import FarmerPreOrders from './FarmerPreOrders';
import FarmerReviews from './FarmerReviews';
import FarmerSettings from './FarmerSettings';
import farmerApi from '../api/farmer';
import { DashboardSidebar, DashboardHeader, DashboardToast, StatCard, StatusBadge, DashboardTickerBanner } from './DashboardShell';

export default function FarmerDashboard({ onNavigate, initialTab = 'dashboard' }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [insights, setInsights] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    farmerApi.getInsights()
      .then((res) => {
        if (res?.data) {
          setInsights(res.data);
        }
      })
      .catch((err) => console.warn('Could not load farmer insights:', err));

    farmerApi.getProfile()
      .then((res) => {
        if (res?.data) {
          setProfile(res.data);
        }
      })
      .catch((err) => console.warn('Could not load farmer profile:', err));
  }, []);

  // Quick Toast Notification helper
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Farmer / Stall Profile
  const stallInfo = {
    name: profile?.stall_name || 'Green Pastures Organic',
    tagline: profile?.address ? `${profile.address}` : 'Stall #08 • Pioneer Pavilion & Downtown Sat',
    owner: profile?.contact_person || 'Marcus Thorne',
    initials: (profile?.stall_name || 'GP').split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase(),
    rating: profile?.rating ? `${profile.rating} ★` : '4.95 ★'
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
      {/* LEFT SIDEBAR NAVIGATION                                 */}
      {/* ======================================================== */}
      {/* Premium Sidebar */}
      <DashboardSidebar
        role="farmer"
        navItems={navItems}
        activeTab={activeTab}
        onSetTab={(id) => setActiveTab(id)}
        mobileSidebarOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        onNavigate={onNavigate}
        profileCard={{
          initials: stallInfo.initials,
          name: stallInfo.name,
          subtitle: stallInfo.tagline,
        }}
        footerActions={[
          { icon: 'visibility', label: 'View Public Stall Profile', onClick: () => onNavigate('farmer-profile') },
          { icon: 'logout', label: 'Exit / Logout', onClick: () => onNavigate('home'), danger: true },
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
            'Farmer Portal',
            activeTab === 'dashboard' ? 'Stall Overview'
            : activeTab === 'products' ? 'My Products'
            : activeTab === 'stock-template' ? 'Weekly Stock Template'
            : activeTab === 'pre-orders' ? 'Pre-Orders Queue'
            : activeTab === 'reviews' ? 'Customer Feedback'
            : 'Stall Settings'
          ]}
          headerRight={
            <>
              <button
                type="button"
                onClick={() => showToast('🔔 2 new reservations waiting for weekend packing.')}
                className="relative w-9 h-9 rounded-xl bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-primary/8 hover:text-primary transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">notifications</span>
                <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-tertiary text-white text-[9px] font-black flex items-center justify-center">2</span>
              </button>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 pl-1 border-l border-outline-variant/30 cursor-pointer"
                >
                  <div className="hidden sm:flex flex-col text-right">
                    <span className="font-bold text-on-surface text-xs">{stallInfo.name}</span>
                    <span className="text-secondary font-bold text-[10px]">{stallInfo.owner} • {stallInfo.rating}</span>
                  </div>
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs shadow-sm"
                    style={{ background: 'linear-gradient(135deg, #3e6a00, #125224)', color: 'white' }}
                  >
                    {stallInfo.initials}
                  </div>
                  <span className="material-symbols-outlined text-on-surface-variant text-[18px]">expand_more</span>
                </button>
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-[0_16px_40px_rgba(18,82,36,0.15)] border border-outline-variant/20 py-2 z-50 animate-bounce-in">
                    <div className="px-4 py-2 border-b border-outline-variant/15">
                      <p className="text-xs font-bold text-on-surface">{stallInfo.name}</p>
                      <p className="text-[10px] text-on-surface-variant">{stallInfo.owner}</p>
                    </div>
                    <button type="button" onClick={() => { setActiveTab('settings'); setUserDropdownOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-surface-container text-on-surface flex items-center gap-2 cursor-pointer font-bold text-xs">
                      <span className="material-symbols-outlined text-[16px] text-primary">person</span><span>Stall Profile</span>
                    </button>
                    <button type="button" onClick={() => { onNavigate('farmer-profile'); setUserDropdownOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-surface-container text-on-surface flex items-center gap-2 cursor-pointer text-xs">
                      <span className="material-symbols-outlined text-[16px] text-secondary">storefront</span><span>Public Storefront</span>
                    </button>
                    <div className="my-1 border-t border-outline-variant/20" />
                    <button type="button" onClick={() => { onNavigate('home'); setUserDropdownOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-error-container/30 text-error flex items-center gap-2 cursor-pointer font-bold text-xs">
                      <span className="material-symbols-outlined text-[16px]">logout</span><span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          }
        />

        {/* ======================================================== */}
        {/* MAIN BODY CONTENT                                       */}
        {/* ======================================================== */}
        <main className="w-full pt-16 bg-gradient-to-br from-surface via-surface-container-low/30 to-surface min-h-screen">
          
          {/* TAB 1: DASHBOARD HOME */}
          {activeTab === 'dashboard' && (
            <div className="px-gutter py-space-lg max-w-7xl mx-auto w-full flex flex-col gap-space-lg animate-fade-in">
              
              {/* Live Harvest Ticker */}
              <DashboardTickerBanner
                text="Harvest Staging Active: 14 of 18 Saturday Pre-Orders packed and crates tagged • Pioneer Pavilion Stall #08 • Forecast: 68°F Sunny"
                badge="STALL STATUS"
                icon="agriculture"
              />

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

              {/* Row of 4 Stat Cards with Sparklines */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
                <StatCard
                  icon="shopping_bag"
                  label="Total Pre-Orders"
                  value={insights?.total_orders ?? 128}
                  trend="+18% this month"
                  trendUp={true}
                  iconBg="bg-primary/10"
                  iconColor="text-primary"
                  sparkline={[20, 35, 45, 60, 55, 78, 92]}
                />
                <StatCard
                  icon="pending_actions"
                  label="Pending Packing"
                  value={insights?.pending_orders ?? 6}
                  trend="4 awaiting harvest"
                  trendUp={false}
                  iconBg="bg-tertiary/10"
                  iconColor="text-tertiary"
                  sparkline={[60, 50, 45, 30, 25, 18, 12]}
                />
                <StatCard
                  icon="payments"
                  label="Est. Revenue (Week)"
                  value={insights?.total_revenue ? `$${Number(insights.total_revenue).toFixed(2)}` : '$2,480.00'}
                  trend="+14% vs last Sat"
                  trendUp={true}
                  iconBg="bg-primary/10"
                  iconColor="text-primary"
                  sparkline={[40, 50, 55, 70, 68, 85, 96]}
                />
                <StatCard
                  icon="eco"
                  label="Best-Selling Harvest"
                  value={insights?.best_seller?.name ? (insights.best_seller.name.length > 18 ? insights.best_seller.name.substring(0, 16) + '...' : insights.best_seller.name) : 'Brandywines'}
                  trend={insights?.best_seller?.total_sold ? `${insights.best_seller.total_sold} units sold` : '980 lbs sold'}
                  trendUp={true}
                  iconBg="bg-secondary/10"
                  iconColor="text-secondary"
                  sparkline={[30, 42, 60, 65, 80, 88, 98]}
                />
              </div>

              {/* Harvest Staging & Packing Live Bar */}
              <div className="p-4 sm:p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-bold shadow-xs flex-shrink-0">
                    <span className="material-symbols-outlined text-[22px]">inventory_2</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-on-surface">Saturday Downtown Market Staging</span>
                      <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-[#0d3b1c] text-[10px] font-black">78% COMPLETE</span>
                    </div>
                    <p className="text-[11px] text-on-surface-variant mt-0.5">
                      14 of 18 crates washed, sorted, and packed with customer voucher tags for Booth 12
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-64">
                  <div className="flex-1 bg-surface-container-high h-2.5 rounded-full overflow-hidden">
                    <div className="bg-primary h-full rounded-full transition-all duration-500" style={{ width: '78%' }} />
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('pre-orders')}
                    className="px-3 py-1.5 rounded-xl bg-primary hover:bg-primary-container text-white text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer"
                  >
                    Pack Crates
                  </button>
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
