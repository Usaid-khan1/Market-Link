import React, { useState, useEffect } from 'react';
import ManageFarmers from './ManageFarmers';
import ManageCustomers from './ManageCustomers';
import ManageMarkets from './ManageMarkets';
import ContentModeration from './ContentModeration';
import ReportsAnalytics from './ReportsAnalytics';
import SystemConfiguration from './SystemConfiguration';
import adminApi from '../api/admin';

export default function AdminDashboard({ onNavigate, initialTab = 'dashboard' }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [orderFilter, setOrderFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [chartTimeframe, setChartTimeframe] = useState('This Month');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [summaryData, setSummaryData] = useState(null);

  // Modals state
  const [reviewModalData, setReviewModalData] = useState(null);
  const [announcementModalOpen, setAnnouncementModalOpen] = useState(false);
  const [viewOrderData, setViewOrderData] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Announcement composer state
  const [announcementForm, setAnnouncementForm] = useState({
    target: 'All Community (Farmers & Shoppers)',
    title: '',
    content: ''
  });

  // Announcements list state
  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      type: 'Weather Advisory',
      icon: 'cloud',
      color: 'text-tertiary',
      time: '2 hrs ago',
      title: 'Harvest Weekend Weather Alert',
      desc: 'Rain anticipated in North River District for Saturday morning. Tents and rain guards mandatory for stalls 1–18.',
      author: 'Hannah Vance',
      audience: 'Farmers & Shoppers'
    },
    {
      id: 2,
      type: 'Token Program',
      icon: 'toll',
      color: 'text-primary',
      time: 'Yesterday',
      title: 'SNAP / Double Up Food Bucks Token Update',
      desc: 'Booth #1 will have an additional $5,000 in wooden matching tokens available starting 7:30 AM.',
      author: 'Central Admin',
      audience: 'All Community'
    },
    {
      id: 3,
      type: 'Seasonal Event',
      icon: 'festival',
      color: 'text-secondary',
      time: '3 days ago',
      title: 'Fall Apple & Cider Festival Sign-Up',
      desc: 'Growers can register extra square footage for the Oct 25 special harvest festival pavilion.',
      author: 'Market Operations',
      audience: 'Farmers Only'
    }
  ]);

  // Pending farmers state
  const [pendingFarmers, setPendingFarmers] = useState([
    {
      id: 1,
      initials: 'RG',
      name: 'Riverbend Goat Dairy & Fromagerie',
      shortName: 'Riverbend Goat Dairy',
      market: 'Downtown Saturday Market',
      dateTag: 'Downtown Sat • Oct 16',
      products: 'Artisan Raw Goat Cheeses, Cultured Butter, Yogurt',
      owner: 'Elena & Marco Rossi',
      permit: '100% Grass-fed Certified, Grade A State Dairy Permit #89201',
      colorClass: 'bg-primary-fixed/50 text-primary'
    },
    {
      id: 2,
      initials: 'HB',
      name: 'Highland Berry & Hazelnut Farm',
      shortName: 'Highland Berry & Nut',
      market: 'Oak Valley Sunday Bazaar',
      dateTag: 'Oak Valley • Oct 15',
      products: 'Heirloom Blackberries, Hazelnuts, Honey preserves',
      owner: 'Douglas & Sarah Campbell',
      permit: 'Organic Certified (USDA Regional), Water rights certified',
      colorClass: 'bg-tertiary-fixed/50 text-tertiary'
    },
    {
      id: 3,
      initials: 'SM',
      name: 'Sunspire Microgreens Co.',
      shortName: 'Sunspire Microgreens',
      market: 'Riverside Harvest Green',
      dateTag: 'Riverside Harvest • Oct 14',
      products: 'Hydroponic Pea Shoots, Radish Microgreens, Sunflower Greens',
      owner: 'Talia Thorne',
      permit: 'Commercial Kitchen & Soil-less Safety License #2203',
      colorClass: 'bg-secondary-fixed/50 text-secondary'
    },
    {
      id: 4,
      initials: 'OO',
      name: 'Old Oak Apiary & Meadery',
      shortName: 'Old Oak Apiary',
      market: 'Sunnybrook Community Stalls',
      dateTag: 'Sunnybrook • Oct 13',
      products: 'Raw Wildflower Honey, Beeswax candles, Propolis tinctures',
      owner: 'Gareth Owens',
      permit: 'State Apiary Registry #AP-44109, Cottage Food Exemption Verified',
      colorClass: 'bg-primary-fixed/50 text-primary'
    }
  ]);

  // Pre-orders state
  const [orders, setOrders] = useState([
    {
      id: '#ML-8921',
      customer: 'Clara Vance',
      neighborhood: 'Oak Valley',
      farm: 'Green Pastures Organic',
      market: 'Pioneer Pavilion',
      itemsCount: 3,
      amount: '$22.50',
      status: 'Ready for Pickup',
      statusColor: 'bg-primary-fixed text-on-primary-fixed',
      dotColor: 'bg-primary',
      pickupTime: '8:30 AM'
    },
    {
      id: '#ML-8920',
      customer: 'Marcus Thorne',
      neighborhood: 'Downtown Core',
      farm: 'Cedar Ridge Farm',
      market: 'Saturday Downtown',
      itemsCount: 5,
      amount: '$38.00',
      status: 'Pending Stall Pack',
      statusColor: 'bg-tertiary-fixed text-on-tertiary-fixed',
      dotColor: 'bg-tertiary',
      pickupTime: '9:00 AM'
    },
    {
      id: '#ML-8919',
      customer: 'Eleanor Wright',
      neighborhood: 'Sunnybrook',
      farm: 'Whispering Pines Herbs',
      market: 'Oak Valley Sunday',
      itemsCount: 2,
      amount: '$14.00',
      status: 'Ready for Pickup',
      statusColor: 'bg-primary-fixed text-on-primary-fixed',
      dotColor: 'bg-primary',
      pickupTime: '10:15 AM'
    },
    {
      id: '#ML-8918',
      customer: 'Samuel Chen',
      neighborhood: 'East River',
      farm: 'Mountain View Orchard',
      market: 'Riverside Harvest',
      itemsCount: 6,
      amount: '$45.50',
      status: 'Collected / Paid',
      statusColor: 'bg-surface-container-high text-on-surface',
      dotColor: 'bg-on-surface-variant',
      pickupTime: '7:45 AM'
    },
    {
      id: '#ML-8917',
      customer: 'Maya Lin',
      neighborhood: 'West Hills',
      farm: 'Old Mill Hearth Bakery',
      market: 'Pioneer Pavilion',
      itemsCount: 4,
      amount: '$27.00',
      status: 'Pending Stall Pack',
      statusColor: 'bg-tertiary-fixed text-on-tertiary-fixed',
      dotColor: 'bg-tertiary',
      pickupTime: '9:30 AM'
    }
  ]);

  // Load summary metrics & announcements from backend
  useEffect(() => {
    adminApi.getSummary()
      .then((res) => {
        if (res?.data) {
          setSummaryData(res.data);
        }
      })
      .catch((err) => console.warn('Could not load admin summary:', err));

    adminApi.getAnnouncements()
      .then((res) => {
        if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
          const mapped = res.data.map((a) => ({
            id: a.id,
            type: a.type || 'Platform Notice',
            icon: 'campaign',
            color: 'text-primary',
            time: a.created_at ? new Date(a.created_at).toLocaleDateString() : 'Recent',
            title: a.title,
            desc: a.content || a.message || '',
            author: 'Central Admin',
            audience: a.audience || 'All Community'
          }));
          setAnnouncements(mapped);
        }
      })
      .catch((err) => console.warn('Could not load announcements:', err));
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleApproveFarmer = async (id) => {
    const farmer = pendingFarmers.find((f) => f.id === id);
    try {
      await adminApi.updateFarmerStatus(id, 'approved');
    } catch (e) {
      console.warn('API update farmer status error:', e);
    }
    setPendingFarmers((prev) => prev.filter((f) => f.id !== id));
    setReviewModalData(null);
    showToast(`Farmer stall "${farmer ? farmer.shortName : 'Vendor'}" approved and listed in market directory!`);
  };

  const handleClarifyFarmer = (id) => {
    setReviewModalData(null);
    showToast('Notification sent to grower requesting soil test clarification.');
  };

  const handlePublishAnnouncement = async (e) => {
    e.preventDefault();
    if (!announcementForm.title.trim()) return;

    try {
      await adminApi.createAnnouncement({
        title: announcementForm.title,
        content: announcementForm.content || 'Important update broadcasted to market community.',
        audience: announcementForm.target,
        type: 'General Notice',
        is_active: true
      });
    } catch (err) {
      console.warn('API announcement error:', err);
    }

    const newPost = {
      id: Date.now(),
      type: 'General Notice',
      icon: 'campaign',
      color: 'text-primary',
      time: 'Just now',
      title: announcementForm.title,
      desc: announcementForm.content || 'Important update broadcasted to market community.',
      author: 'Hannah Vance (Super Admin)',
      audience: announcementForm.target
    };

    setAnnouncements([newPost, ...announcements]);
    setAnnouncementModalOpen(false);
    showToast(`Broadcast "${announcementForm.title}" published live!`);
    setAnnouncementForm({
      target: 'All Community (Farmers & Shoppers)',
      title: '',
      content: ''
    });
  };

  // Filtered orders
  const filteredOrders = orders.filter((order) => {
    if (statusFilter !== 'All Statuses' && order.status !== statusFilter) {
      return false;
    }
    if (orderFilter.trim()) {
      const q = orderFilter.toLowerCase();
      const matchId = order.id.toLowerCase().includes(q);
      const matchCust = order.customer.toLowerCase().includes(q);
      const matchFarm = order.farm.toLowerCase().includes(q);
      const matchMarket = order.market.toLowerCase().includes(q);
      if (!matchId && !matchCust && !matchFarm && !matchMarket) return false;
    }
    return true;
  });

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'farmers', label: 'Farmers', icon: 'agriculture' },
    { id: 'customers', label: 'Customers', icon: 'group' },
    { id: 'markets', label: 'Markets', icon: 'storefront' },
    { id: 'moderation', label: 'Moderation', icon: 'gavel' },
    { id: 'reports', label: 'Reports', icon: 'bar_chart' },
    { id: 'settings', label: 'Settings', icon: 'settings' }
  ];

  return (
    <div className="w-full min-h-screen bg-surface font-body-md text-on-surface antialiased flex">
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-inverse-surface text-inverse-on-surface px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 z-50 animate-fade-in border border-white/10">
          <span className="material-symbols-outlined text-primary-fixed text-[20px]">check_circle</span>
          <span className="font-label-md text-label-md text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Mobile Sidebar Backdrop */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
        ></div>
      )}

      {/* LEFT SIDEBAR NAVIGATION */}
      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-primary text-on-primary z-50 flex flex-col justify-between shadow-[0_1px_8px_rgba(0,0,0,0.04)] transition-transform duration-300 lg:translate-x-0 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col">
          {/* Header & Logo */}
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
            <span className="px-space-xs py-0.5 rounded-full bg-primary-container text-on-primary-container font-label-sm text-[11px] uppercase tracking-wider font-bold">
              Admin
            </span>
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
                  className={`flex items-center gap-space-sm px-space-md py-space-sm rounded-lg transition-colors cursor-pointer text-xs font-bold text-left ${
                    isActive
                      ? 'bg-primary-container text-on-primary-container font-label-md shadow-sm'
                      : 'text-primary-fixed-dim hover:bg-primary-container hover:text-on-primary-container'
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
            onClick={() => onNavigate('contact-us')}
            className="flex items-center gap-space-sm px-space-md py-space-sm rounded-lg text-primary-fixed-dim hover:bg-primary-container hover:text-on-primary-container font-body-sm text-xs transition-colors cursor-pointer text-left"
          >
            <span className="material-symbols-outlined text-[18px]">help_outline</span>
            <span>Admin Help &amp; Docs</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="flex items-center gap-space-sm px-space-md py-space-sm rounded-lg text-primary-fixed-dim hover:bg-error-container hover:text-on-error-container font-body-sm text-xs transition-colors cursor-pointer text-left"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            <span>Exit to Storefront</span>
          </button>
        </div>
      </aside>

      {/* RIGHT SIDE / MAIN WRAPPER */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        
        {/* TOP ADMIN HEADER */}
        <header className="fixed top-0 left-0 lg:left-64 right-0 h-16 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 flex items-center justify-between px-gutter border-b border-outline-variant/30">
          <div className="flex items-center gap-space-md">
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              aria-label="Toggle Sidebar"
              className="lg:hidden p-2 rounded-lg text-on-surface-variant hover:bg-surface-container"
            >
              <span className="material-symbols-outlined text-[22px]">menu</span>
            </button>
            <div className="flex items-center gap-space-xs font-body-sm text-xs text-on-surface-variant">
              <span className="material-symbols-outlined text-[18px]">home</span>
              <span>/</span>
              <span className="font-label-md text-on-surface font-bold">Portal</span>
              <span>/</span>
              <span className="text-primary font-bold">
                {activeTab === 'farmers'
                  ? 'Grower Registry'
                  : activeTab === 'customers'
                  ? 'Manage Customers'
                  : activeTab === 'markets'
                  ? 'Manage Markets'
                  : activeTab === 'moderation'
                  ? 'Content Moderation'
                  : activeTab === 'reports'
                  ? 'Reports & Analytics'
                  : activeTab === 'settings'
                  ? 'System Configuration'
                  : activeTab === 'dashboard'
                  ? 'Dashboard Overview'
                  : activeTab}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-space-md sm:gap-space-lg">
            {/* Global Search Box */}
            <div className="relative hidden md:flex items-center">
              <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-[18px]">search</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search orders, farmers, markets..."
                className="w-72 lg:w-80 pl-9 pr-space-md py-1.5 bg-surface-container-lowest rounded-full font-body-sm text-xs text-on-surface placeholder:text-on-surface-variant shadow-sm border border-outline-variant/40 focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Notification Bell */}
            <button
              type="button"
              onClick={() => showToast('3 pending farmer audits & 1 weather advisory queued.')}
              className="p-2 text-on-surface-variant hover:text-on-surface transition-colors relative cursor-pointer"
            >
              <span className="material-symbols-outlined text-[22px]">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-error text-on-error font-label-sm text-[10px] flex items-center justify-center font-bold">
                3
              </span>
            </button>

            {/* Admin Profile Chip */}
            <div className="flex items-center gap-space-sm pl-space-xs">
              <div className="hidden sm:flex flex-col text-right">
                <span className="font-label-md text-on-surface text-xs font-bold">Hannah Vance</span>
                <span className="font-label-sm text-on-surface-variant text-[11px]">Super Admin</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-xs shadow-sm">
                HV
              </div>
            </div>
          </div>
        </header>

        {/* MAIN DASHBOARD CONTENT */}
        <main className="w-full pt-16 bg-surface min-h-screen">
          {activeTab === 'farmers' && (
            <ManageFarmers onNavigate={onNavigate} showToast={showToast} />
          )}

          {activeTab === 'customers' && (
            <ManageCustomers onNavigate={onNavigate} showToast={showToast} />
          )}

          {activeTab === 'markets' && (
            <ManageMarkets onNavigate={onNavigate} showToast={showToast} />
          )}

          {activeTab === 'moderation' && (
            <ContentModeration onNavigate={onNavigate} showToast={showToast} />
          )}

          {activeTab === 'reports' && (
            <ReportsAnalytics onNavigate={onNavigate} showToast={showToast} />
          )}

          {activeTab === 'settings' && (
            <SystemConfiguration onNavigate={onNavigate} showToast={showToast} />
          )}

          {(activeTab === 'dashboard' || activeTab === 'overview' || (!['farmers', 'customers', 'markets', 'moderation', 'reports', 'settings'].includes(activeTab))) && (
            <div className="flex flex-col w-full">
            {/* Top Ambient Banner & Header Action Bar */}
            <div className="px-gutter py-space-lg flex flex-col gap-space-lg">
              
              {/* Welcome Header & Live Market Status Pill */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-space-sm flex-wrap">
                    <h1 className="font-headline-lg text-headline-lg sm:text-2xl text-on-surface font-bold tracking-tight">
                      Welcome back, Admin
                    </h1>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-xs font-bold">
                      <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                      14 Weekend Markets Live
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-on-surface-variant font-body-sm text-xs">
                    <span className="material-symbols-outlined text-[16px] text-primary">calendar_today</span>
                    <span>Saturday, October 18, 2025</span>
                    <span className="text-outline-variant">•</span>
                    <span className="text-tertiary-container font-label-sm font-bold">
                      Peak Morning Harvest Flow (07:00 – 13:00)
                    </span>
                  </div>
                </div>

                {/* Quick Action Buttons */}
                <div className="flex items-center gap-space-sm flex-wrap">
                  <button
                    type="button"
                    onClick={() => setAnnouncementModalOpen(true)}
                    className="px-space-md py-2 rounded-xl bg-surface-container-lowest text-on-surface hover:bg-surface-container transition-all shadow-sm font-label-md text-xs font-bold flex items-center gap-1.5 border border-outline-variant/30 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-tertiary text-[18px]">campaign</span>
                    <span>+ Quick Announcement</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => showToast('Weekly harvest settlement & vendor summary exported to CSV.')}
                    className="px-space-md py-2 rounded-xl bg-surface-container-lowest text-primary hover:bg-surface-container transition-all shadow-sm font-label-md text-xs font-bold flex items-center gap-1.5 border border-outline-variant/30 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">file_download</span>
                    <span>Export Weekly Summary</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onNavigate('markets')}
                    className="px-space-lg py-2.5 rounded-xl bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container shadow-md transition-all font-label-md text-xs font-bold flex items-center gap-2 cursor-pointer active:scale-95"
                  >
                    <span className="material-symbols-outlined text-[20px]">add_business</span>
                    <span>+ Add New Market</span>
                  </button>
                </div>
              </div>

              {/* 4 KPI Stat Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-space-md">
                
                {/* Card 1: Total Farmers */}
                <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden group border border-outline-variant/30">
                  <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-primary-fixed-dim/20 pointer-events-none group-hover:scale-125 transition-transform"></div>
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col">
                      <span className="font-label-sm text-[11px] text-on-surface-variant uppercase tracking-wider font-bold">
                        Registered Farmers
                      </span>
                      <span className="font-headline-lg text-2xl sm:text-3xl text-on-surface mt-1 font-bold">
                        {summaryData?.total_farmers ?? (54 + pendingFarmers.length)}
                      </span>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-primary-fixed/40 flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-[24px]">agriculture</span>
                    </div>
                  </div>
                  <div className="mt-space-md flex flex-col gap-1 text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm font-bold text-[11px]">
                        <span className="material-symbols-outlined text-[14px]">trending_up</span>
                        {summaryData?.approved_farmers ? `${summaryData.approved_farmers} approved` : '+4 this week'}
                      </span>
                      <span className="text-tertiary-container font-label-sm font-bold text-[11px]">
                        ({summaryData?.pending_farmers ?? pendingFarmers.length} pending)
                      </span>
                    </div>
                    <span className="font-body-sm text-on-surface-variant text-[11px]">
                      {summaryData ? 'Live registered growers' : '48 active stalls this Saturday'}
                    </span>
                  </div>
                </div>

                {/* Card 2: Total Customers */}
                <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden group border border-outline-variant/30">
                  <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-tertiary-fixed-dim/25 pointer-events-none group-hover:scale-125 transition-transform"></div>
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col">
                      <span className="font-label-sm text-[11px] text-on-surface-variant uppercase tracking-wider font-bold">
                        Shopper Community
                      </span>
                      <span className="font-headline-lg text-2xl sm:text-3xl text-on-surface mt-1 font-bold">
                        {summaryData?.total_customers ?? '3,420'}
                      </span>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-tertiary-fixed/50 flex items-center justify-center text-tertiary">
                      <span className="material-symbols-outlined text-[24px]">shopping_basket</span>
                    </div>
                  </div>
                  <div className="mt-space-md flex flex-col gap-1 text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm font-bold text-[11px]">
                        <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
                        {summaryData?.active_customers ? `${summaryData.active_customers} active accounts` : '+142 this week (+12%)'}
                      </span>
                    </div>
                    <span className="font-body-sm text-on-surface-variant text-[11px]">
                      Verified community shoppers
                    </span>
                  </div>
                </div>

                {/* Card 3: Total Markets */}
                <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden group border border-outline-variant/30">
                  <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-secondary-fixed/40 pointer-events-none group-hover:scale-125 transition-transform"></div>
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col">
                      <span className="font-label-sm text-[11px] text-on-surface-variant uppercase tracking-wider font-bold">
                        Active Pavilions
                      </span>
                      <span className="font-headline-lg text-2xl sm:text-3xl text-on-surface mt-1 font-bold">
                        {summaryData?.total_markets ?? 14}
                      </span>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-secondary-container/60 flex items-center justify-center text-secondary">
                      <span className="material-symbols-outlined text-[24px]">storefront</span>
                    </div>
                  </div>
                  <div className="mt-space-md flex flex-col gap-1 text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm font-bold text-[11px]">
                        <span className="material-symbols-outlined text-[14px]">verified</span>
                        Regional Network
                      </span>
                    </div>
                    <span className="font-body-sm text-on-surface-variant text-[11px]">
                      OpenStreetMap mapped locations
                    </span>
                  </div>
                </div>

                {/* Card 4: Total Orders */}
                <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden group border border-outline-variant/30">
                  <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-tertiary-fixed/30 pointer-events-none group-hover:scale-125 transition-transform"></div>
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col">
                      <span className="font-label-sm text-[11px] text-on-surface-variant uppercase tracking-wider font-bold">
                        Pickup Pre-Orders
                      </span>
                      <span className="font-headline-lg text-2xl sm:text-3xl text-on-surface mt-1 font-bold">
                        {summaryData?.total_orders ?? '2,845'}
                      </span>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-tertiary-fixed/60 flex items-center justify-center text-tertiary">
                      <span className="material-symbols-outlined text-[24px]">inventory_2</span>
                    </div>
                  </div>
                  <div className="mt-space-md flex flex-col gap-1 text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm font-bold text-[11px]">
                        <span className="material-symbols-outlined text-[14px]">check_circle</span>
                        {summaryData?.total_revenue ? `$${Number(summaryData.total_revenue).toFixed(2)} Vol` : '+386 this week (98.4%)'}
                      </span>
                    </div>
                    <span className="font-body-sm text-on-surface-variant text-[11px]">
                      $34,120 estimated stall volume
                    </span>
                  </div>
                </div>
              </div>

              {/* Row 2: Analytics & Chart + Pending Farmer Approvals */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
                
                {/* Orders & Harvest Reservations Visual Chart (8 Cols) */}
                <div className="lg:col-span-8 bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between border border-outline-variant/30">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
                    <div>
                      <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold text-base sm:text-lg">
                        Orders &amp; Harvest Reservations
                      </h2>
                      <p className="font-body-sm text-body-sm text-on-surface-variant text-xs mt-0.5">
                        Daily reservation volume spikes preceding weekend market pickups
                      </p>
                    </div>

                    {/* Time Filters */}
                    <div className="inline-flex p-1 bg-surface-container rounded-lg font-label-sm text-xs self-start sm:self-auto border border-outline-variant/20">
                      {['Last 7 Days', 'This Month', 'Last 30 Days', 'Year-to-Date'].map((period) => (
                        <button
                          key={period}
                          type="button"
                          onClick={() => setChartTimeframe(period)}
                          className={`px-3 py-1 rounded transition-colors cursor-pointer font-bold ${
                            chartTimeframe === period
                              ? 'bg-surface-container-lowest text-primary shadow-sm'
                              : 'text-on-surface-variant hover:text-on-surface'
                          }`}
                        >
                          {period}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* SVG Visual Progression Chart */}
                  <div className="mt-space-lg relative w-full h-64 flex flex-col justify-end">
                    {/* Background Grid Lines */}
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40">
                      <div className="w-full h-px bg-surface-container-highest"></div>
                      <div className="w-full h-px bg-surface-container-highest"></div>
                      <div className="w-full h-px bg-surface-container-highest"></div>
                      <div className="w-full h-px bg-surface-container-highest"></div>
                    </div>

                    {/* SVG Spark Area & Line */}
                    <svg className="w-full h-48 overflow-visible" preserveAspectRatio="none" viewBox="0 0 700 160">
                      <defs>
                        <linearGradient id="forestGlow" x1="0%" x2="0%" y1="0%" y2="100%">
                          <stop offset="0%" stopColor="#2e6b3a" stopOpacity="0.32" />
                          <stop offset="100%" stopColor="#2e6b3a" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      {/* Area Fill */}
                      <path
                        d="M 0,140 Q 50,135 100,120 T 200,45 T 300,130 T 400,35 T 500,125 T 600,20 L 700,10 L 700,160 L 0,160 Z"
                        fill="url(#forestGlow)"
                      />
                      {/* Line Stroke */}
                      <path
                        d="M 0,140 Q 50,135 100,120 T 200,45 T 300,130 T 400,35 T 500,125 T 600,20 L 700,10"
                        fill="none"
                        stroke="#2e6b3a"
                        strokeLinecap="round"
                        strokeWidth="3"
                      />
                      {/* Data Spike Dots */}
                      <circle cx="200" cy="45" fill="#125224" r="5" stroke="#ffffff" strokeWidth="2" />
                      <circle cx="400" cy="35" fill="#125224" r="5" stroke="#ffffff" strokeWidth="2" />
                      <circle cx="600" cy="20" fill="#125224" r="5" stroke="#ffffff" strokeWidth="2" />
                      <circle cx="700" cy="10" fill="#914d00" r="6" stroke="#ffffff" strokeWidth="2" />
                    </svg>

                    {/* Day Labels */}
                    <div className="flex justify-between text-on-surface-variant font-label-sm text-[11px] pt-2">
                      <span>Oct 1 (Wed)</span>
                      <span className="text-primary font-bold">Oct 4 (Sat)</span>
                      <span>Oct 8 (Wed)</span>
                      <span className="text-primary font-bold">Oct 11 (Sat)</span>
                      <span>Oct 15 (Wed)</span>
                      <span className="text-tertiary font-bold">Oct 18 (Today - Peak)</span>
                    </div>
                  </div>

                  {/* Summary Stat Pills */}
                  <div className="mt-space-lg pt-space-md flex flex-wrap items-center justify-between gap-space-sm bg-surface-container-low p-space-md rounded-xl border border-outline-variant/20">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-[20px]">schedule</span>
                      <div className="flex flex-col">
                        <span className="font-label-sm text-on-surface-variant text-[11px]">Peak Reservation Window</span>
                        <span className="font-label-md text-on-surface text-xs font-bold">Friday 4:00 PM – 7:30 PM</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-tertiary text-[20px]">shopping_bag</span>
                      <div className="flex flex-col">
                        <span className="font-label-sm text-on-surface-variant text-[11px]">Avg Stand Basket</span>
                        <span className="font-label-md text-on-surface text-xs font-bold">$28.40 per patron</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-[20px]">task_alt</span>
                      <div className="flex flex-col">
                        <span className="font-label-sm text-on-surface-variant text-[11px]">Pickup Fulfilled Rate</span>
                        <span className="font-label-md text-primary text-xs font-bold">98.2% (Historic High)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pending Farmer Approvals (4 Cols) */}
                <div className="lg:col-span-4 bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between border border-outline-variant/30">
                  <div>
                    <div className="flex items-center justify-between mb-space-md">
                      <div className="flex items-center gap-2">
                        <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold text-base">
                          Pending Farmers
                        </h2>
                        <span className="px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-xs font-bold">
                          {pendingFarmers.length} Awaiting
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveTab('farmers')}
                        className="font-label-sm text-primary hover:underline text-xs font-bold cursor-pointer"
                      >
                        View All
                      </button>
                    </div>

                    {/* Pending Applicant List */}
                    <div className="flex flex-col gap-space-sm">
                      {pendingFarmers.length === 0 ? (
                        <div className="p-4 text-center text-on-surface-variant text-xs">
                          <span className="material-symbols-outlined text-primary text-[32px] mb-1">done_all</span>
                          <p className="font-bold">All applications audited!</p>
                          <p className="text-[11px] mt-0.5">No pending vendor approvals for this weekend.</p>
                        </div>
                      ) : (
                        pendingFarmers.map((farmer) => (
                          <div
                            key={farmer.id}
                            className="p-3 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors flex items-center justify-between border border-outline-variant/20"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${farmer.colorClass}`}>
                                {farmer.initials}
                              </div>
                              <div className="flex flex-col min-w-0">
                                <span className="font-label-md text-on-surface truncate text-xs font-bold">
                                  {farmer.shortName}
                                </span>
                                <span className="font-body-sm text-on-surface-variant text-[11px] truncate">
                                  {farmer.dateTag}
                                </span>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => setReviewModalData(farmer)}
                              className="px-3 py-1.5 rounded-lg bg-surface-container-lowest text-primary hover:bg-primary hover:text-on-primary font-label-sm text-xs shadow-sm transition-colors font-bold cursor-pointer border border-outline-variant/30"
                            >
                              Review
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="mt-space-md p-3 rounded-xl bg-surface-container-high flex items-center gap-3 border border-outline-variant/30">
                    <span className="material-symbols-outlined text-primary text-[22px] shrink-0">policy</span>
                    <p className="font-body-sm text-on-surface-variant text-[11px] leading-relaxed">
                      Audits mandate 24-hr response on health permits before weekend stalls open.
                    </p>
                  </div>
                </div>
              </div>

              {/* Row 3: Pre-Orders Table (8 Cols) + Platform Announcements (4 Cols) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
                
                {/* Recent Pre-Orders Table (8 Cols) */}
                <div className="lg:col-span-8 bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between border border-outline-variant/30">
                  <div>
                    {/* Table Controls Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm mb-space-md">
                      <div>
                        <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold text-base sm:text-lg">
                          Recent Pre-Orders
                        </h2>
                        <p className="font-body-sm text-body-sm text-on-surface-variant text-xs mt-0.5">
                          Live feed of consumer reservations for today's market pavilions
                        </p>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="relative flex items-center">
                          <span className="material-symbols-outlined absolute left-2.5 text-on-surface-variant text-[16px]">
                            search
                          </span>
                          <input
                            type="text"
                            value={orderFilter}
                            onChange={(e) => setOrderFilter(e.target.value)}
                            placeholder="Filter orders..."
                            className="pl-8 pr-3 py-1.5 bg-surface-container-low rounded-lg font-body-sm text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary w-40 border border-outline-variant/30"
                          />
                        </div>

                        <select
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                          className="px-2.5 py-1.5 bg-surface-container-low rounded-lg font-label-sm text-xs text-on-surface focus:outline-none border border-outline-variant/30 cursor-pointer font-bold"
                        >
                          <option>All Statuses</option>
                          <option>Ready for Pickup</option>
                          <option>Pending Stall Pack</option>
                          <option>Collected / Paid</option>
                        </select>

                        <button
                          type="button"
                          onClick={() => showToast('Order queue refreshed live.')}
                          className="p-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface-variant cursor-pointer border border-outline-variant/30"
                          title="Refresh Feed"
                        >
                          <span className="material-symbols-outlined text-[18px]">refresh</span>
                        </button>
                      </div>
                    </div>

                    {/* Table Container */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-left font-body-sm text-xs">
                        <thead className="bg-surface-container-low text-on-surface-variant font-label-sm uppercase tracking-wider text-[11px] font-bold">
                          <tr>
                            <th className="py-3 px-3 rounded-l-lg">Order ID</th>
                            <th className="py-3 px-3">Customer</th>
                            <th className="py-3 px-3">Farmer Stall</th>
                            <th className="py-3 px-3">Market Pavilion</th>
                            <th className="py-3 px-3">Items / Vol</th>
                            <th className="py-3 px-3">Status</th>
                            <th className="py-3 px-3">Pickup</th>
                            <th className="py-3 px-3 rounded-r-lg text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-container">
                          {filteredOrders.length === 0 ? (
                            <tr>
                              <td colSpan={8} className="py-6 text-center text-on-surface-variant text-xs">
                                No orders matching current filter.
                              </td>
                            </tr>
                          ) : (
                            filteredOrders.map((order) => (
                              <tr key={order.id} className="hover:bg-surface-container-low/50 transition-colors">
                                <td className="py-3 px-3 font-label-md text-primary font-bold">{order.id}</td>
                                <td className="py-3 px-3">
                                  <div className="flex flex-col">
                                    <span className="font-label-md text-on-surface font-bold">{order.customer}</span>
                                    <span className="text-[11px] text-on-surface-variant">{order.neighborhood}</span>
                                  </div>
                                </td>
                                <td className="py-3 px-3 text-on-surface">{order.farm}</td>
                                <td className="py-3 px-3 text-on-surface-variant">{order.market}</td>
                                <td className="py-3 px-3 font-label-md text-on-surface font-bold">
                                  {order.itemsCount} items <span className="text-on-surface-variant font-normal">({order.amount})</span>
                                </td>
                                <td className="py-3 px-3">
                                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-label-sm text-[11px] font-bold ${order.statusColor}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${order.dotColor}`}></span>
                                    {order.status}
                                  </span>
                                </td>
                                <td className="py-3 px-3 font-label-md text-on-surface font-bold">{order.pickupTime}</td>
                                <td className="py-3 px-3 text-right">
                                  <button
                                    type="button"
                                    onClick={() => setViewOrderData(order)}
                                    className="px-2.5 py-1 rounded bg-surface-container text-primary font-label-sm text-xs hover:bg-primary hover:text-on-primary transition-colors cursor-pointer font-bold"
                                  >
                                    View
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Table Footer Pagination */}
                  <div className="mt-space-md pt-space-sm flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm text-xs border-t border-outline-variant/20">
                    <span className="font-body-sm text-on-surface-variant">
                      Showing <span className="font-bold text-on-surface">1 to {filteredOrders.length}</span> of 386 orders today
                    </span>
                    <div className="flex items-center gap-1 font-bold">
                      <button
                        type="button"
                        className="px-2.5 py-1 rounded-lg bg-surface-container-low text-on-surface-variant hover:bg-surface-container disabled:opacity-50 cursor-pointer"
                        disabled
                      >
                        Prev
                      </button>
                      <button type="button" className="w-7 h-7 rounded-lg bg-primary text-on-primary flex items-center justify-center">
                        1
                      </button>
                      <button type="button" className="w-7 h-7 rounded-lg bg-surface-container-low text-on-surface hover:bg-surface-container flex items-center justify-center cursor-pointer">
                        2
                      </button>
                      <button type="button" className="w-7 h-7 rounded-lg bg-surface-container-low text-on-surface hover:bg-surface-container flex items-center justify-center cursor-pointer">
                        3
                      </button>
                      <span className="px-1 text-on-surface-variant">...</span>
                      <button type="button" className="w-7 h-7 rounded-lg bg-surface-container-low text-on-surface hover:bg-surface-container flex items-center justify-center cursor-pointer">
                        78
                      </button>
                      <button type="button" className="px-2.5 py-1 rounded-lg bg-surface-container-low text-on-surface-variant hover:bg-surface-container cursor-pointer">
                        Next
                      </button>
                    </div>
                  </div>
                </div>

                {/* Platform Announcements Widget (4 Cols) */}
                <div className="lg:col-span-4 bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between border border-outline-variant/30">
                  <div>
                    <div className="flex items-center justify-between mb-space-md">
                      <div>
                        <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold text-base">
                          Announcements
                        </h2>
                        <p className="font-body-sm text-on-surface-variant text-xs">
                          Broadcasts to farmers &amp; visitors
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setAnnouncementModalOpen(true)}
                        className="px-2.5 py-1 rounded-lg bg-tertiary-fixed text-on-tertiary-fixed hover:bg-tertiary hover:text-on-tertiary font-label-sm text-xs transition-colors cursor-pointer font-bold"
                      >
                        + Post
                      </button>
                    </div>

                    {/* Announcement Cards Feed */}
                    <div className="flex flex-col gap-space-md">
                      {announcements.map((post) => (
                        <div
                          key={post.id}
                          className="p-3.5 rounded-xl bg-surface-container-low flex flex-col gap-2 relative overflow-hidden border border-outline-variant/20"
                        >
                          <div className="flex items-center justify-between">
                            <span className={`inline-flex items-center gap-1 font-label-sm text-xs font-bold ${post.color}`}>
                              <span className="material-symbols-outlined text-[16px]">{post.icon}</span>
                              {post.type}
                            </span>
                            <span className="text-[11px] text-on-surface-variant">{post.time}</span>
                          </div>
                          <h3 className="font-label-md text-on-surface font-bold leading-snug text-xs">
                            {post.title}
                          </h3>
                          <p className="font-body-sm text-on-surface-variant text-[11px] leading-relaxed">
                            {post.desc}
                          </p>
                          <div className="flex items-center justify-between pt-1 text-[11px] text-on-surface-variant border-t border-outline-variant/20">
                            <span>By {post.author}</span>
                            <span className="px-2 py-0.5 rounded-full bg-surface-container font-label-sm text-[10px] font-semibold">
                              {post.audience}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-space-md pt-space-sm flex justify-center border-t border-outline-variant/20">
                    <button
                      type="button"
                      onClick={() => showToast('Full platform announcement log archive opened.')}
                      className="font-label-sm text-primary hover:underline flex items-center gap-1 text-xs font-bold cursor-pointer"
                    >
                      <span>Manage Platform Announcements Log</span>
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          )}
        </main>
      </div>

      {/* MODAL: Review Pending Farmer Stallholder Application */}
      {reviewModalData && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full p-space-lg shadow-2xl flex flex-col gap-space-md border border-outline-variant/40">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[22px]">verified_user</span>
                </div>
                <div>
                  <h3 className="font-headline-sm text-on-surface font-bold text-base">
                    {reviewModalData.name}
                  </h3>
                  <span className="font-body-sm text-on-surface-variant text-xs">
                    {reviewModalData.market}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setReviewModalData(null)}
                className="p-1.5 text-on-surface-variant hover:text-on-surface rounded-lg bg-surface-container-low cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="flex flex-col gap-space-sm bg-surface-container-low p-space-md rounded-xl font-body-sm text-xs border border-outline-variant/20">
              <div>
                <span className="font-label-sm text-on-surface-variant block font-bold">Primary Contact / Principal Grower:</span>
                <span className="font-label-md text-on-surface font-semibold">{reviewModalData.owner}</span>
              </div>
              <div>
                <span className="font-label-sm text-on-surface-variant block font-bold">Harvest Specializations:</span>
                <span className="text-on-surface">{reviewModalData.products}</span>
              </div>
              <div>
                <span className="font-label-sm text-on-surface-variant block font-bold">Permit &amp; Soil Inspection Status:</span>
                <span className="text-primary font-label-sm font-bold">{reviewModalData.permit}</span>
              </div>
            </div>

            <div className="p-3 bg-surface-container rounded-lg text-xs text-on-surface-variant flex items-center gap-2 border border-outline-variant/20">
              <span className="material-symbols-outlined text-primary text-[18px]">eco</span>
              <span>Approving will instantly publish their stall to the local weekend directory and enable shoppers to place pickup holds.</span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2 text-xs">
              <button
                type="button"
                onClick={() => setReviewModalData(null)}
                className="px-4 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleClarifyFarmer(reviewModalData.id)}
                className="px-3.5 py-2 rounded-lg bg-tertiary-fixed text-on-tertiary-fixed hover:bg-tertiary hover:text-on-tertiary font-label-md font-bold cursor-pointer transition-colors"
              >
                Request Soil Clarification
              </button>
              <button
                type="button"
                onClick={() => handleApproveFarmer(reviewModalData.id)}
                className="px-4 py-2 rounded-lg bg-primary text-on-primary hover:bg-primary-container font-label-md font-bold shadow-md cursor-pointer transition-colors"
              >
                Approve Stallholder
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Quick Announcement Composer */}
      {announcementModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-space-lg shadow-2xl flex flex-col gap-space-md border border-outline-variant/40">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-tertiary text-[24px]">campaign</span>
                <h3 className="font-headline-sm text-on-surface font-bold text-base">New Community Broadcast</h3>
              </div>
              <button
                type="button"
                onClick={() => setAnnouncementModalOpen(false)}
                className="p-1 text-on-surface-variant hover:text-on-surface cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handlePublishAnnouncement} className="flex flex-col gap-3 font-body-sm text-xs">
              <div>
                <label className="font-label-sm text-on-surface-variant block mb-1 font-bold">Target Audience</label>
                <select
                  value={announcementForm.target}
                  onChange={(e) => setAnnouncementForm({ ...announcementForm, target: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-surface-container-low font-body-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary border border-outline-variant/40 cursor-pointer"
                >
                  <option>All Community (Farmers &amp; Shoppers)</option>
                  <option>Registered Farmers Only</option>
                  <option>Market Shoppers &amp; Consumers</option>
                  <option>Specific Market Location</option>
                </select>
              </div>

              <div>
                <label className="font-label-sm text-on-surface-variant block mb-1 font-bold">Announcement Title</label>
                <input
                  type="text"
                  required
                  value={announcementForm.title}
                  onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
                  placeholder="e.g. Fresh Honeycomb Arrival, Weather Shift"
                  className="w-full px-3 py-2 rounded-lg bg-surface-container-low font-body-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary border border-outline-variant/40"
                />
              </div>

              <div>
                <label className="font-label-sm text-on-surface-variant block mb-1 font-bold">Message Content</label>
                <textarea
                  rows={3}
                  required
                  value={announcementForm.content}
                  onChange={(e) => setAnnouncementForm({ ...announcementForm, content: e.target.value })}
                  placeholder="Write helpful community advisory..."
                  className="w-full px-3 py-2 rounded-lg bg-surface-container-low font-body-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary border border-outline-variant/40"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAnnouncementModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-surface-container text-on-surface font-label-md font-bold cursor-pointer"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-tertiary text-on-tertiary hover:bg-tertiary-container font-label-md font-bold cursor-pointer transition-colors shadow-sm"
                >
                  Publish Broadcast
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: View Order Details */}
      {viewOrderData && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-space-lg shadow-2xl flex flex-col gap-space-md border border-outline-variant/40">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[24px]">receipt_long</span>
                <div>
                  <h3 className="font-headline-sm text-on-surface font-bold text-base">
                    Order {viewOrderData.id}
                  </h3>
                  <span className="text-[11px] text-on-surface-variant">Scheduled for {viewOrderData.pickupTime}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setViewOrderData(null)}
                className="p-1 text-on-surface-variant hover:text-on-surface cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="bg-surface-container-low p-space-md rounded-xl flex flex-col gap-2 text-xs border border-outline-variant/20">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Customer:</span>
                <span className="font-bold text-on-surface">{viewOrderData.customer} ({viewOrderData.neighborhood})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Grower Stand:</span>
                <span className="font-bold text-on-surface">{viewOrderData.farm}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Pickup Location:</span>
                <span className="text-on-surface">{viewOrderData.market}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Order Value:</span>
                <span className="font-bold text-primary">{viewOrderData.amount} ({viewOrderData.itemsCount} items)</span>
              </div>
              <div className="flex justify-between items-center pt-1 border-t border-outline-variant/20">
                <span className="text-on-surface-variant">Status:</span>
                <span className={`px-2 py-0.5 rounded-full font-bold text-[11px] ${viewOrderData.statusColor}`}>
                  {viewOrderData.status}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1 text-xs">
              <button
                type="button"
                onClick={() => {
                  showToast(`Printed stall slip for ${viewOrderData.id}.`);
                  setViewOrderData(null);
                }}
                className="px-3.5 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-bold cursor-pointer flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">print</span>
                <span>Print Slip</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  showToast(`Order ${viewOrderData.id} marked as Collected / Paid.`);
                  setOrders((prev) =>
                    prev.map((o) =>
                      o.id === viewOrderData.id
                        ? {
                            ...o,
                            status: 'Collected / Paid',
                            statusColor: 'bg-surface-container-high text-on-surface',
                            dotColor: 'bg-on-surface-variant'
                          }
                        : o
                    )
                  );
                  setViewOrderData(null);
                }}
                className="px-4 py-2 rounded-lg bg-primary text-on-primary hover:bg-primary-container font-bold cursor-pointer shadow-sm"
              >
                Mark Fulfilled
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
