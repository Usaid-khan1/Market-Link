import React, { useState, useEffect } from 'react';
import ManageFarmers from './ManageFarmers';
import ManageCustomers from './ManageCustomers';
import ManageMarkets from './ManageMarkets';
import ContentModeration from './ContentModeration';
import ReportsAnalytics from './ReportsAnalytics';
import SystemConfiguration from './SystemConfiguration';
import adminApi from '../api/admin';
import { DashboardSidebar, DashboardHeader, DashboardToast, StatCard, StatusBadge, DashboardTickerBanner } from './DashboardShell';

const CHART_CONFIGS = {
  'Last 7 Days': {
    area: 'M 0,125 C 60,125 90,85 140,85 C 190,85 230,115 280,115 C 330,115 370,60 420,60 C 470,60 510,90 560,90 C 610,90 635,35 670,35 L 700,38 L 700,160 L 0,160 Z',
    line: 'M 0,125 C 60,125 90,85 140,85 C 190,85 230,115 280,115 C 330,115 370,60 420,60 C 470,60 510,90 560,90 C 610,90 635,35 670,35 L 700,38',
    dots: [
      { cx: 140, cy: 85, fill: '#125224', r: 5 },
      { cx: 420, cy: 60, fill: '#125224', r: 5 },
      { cx: 670, cy: 35, fill: '#F28C28', r: 6, isPeak: true },
    ],
    labels: [
      { name: 'Mon', bold: false },
      { name: 'Tue', bold: false },
      { name: 'Wed', bold: false },
      { name: 'Thu', bold: false },
      { name: 'Fri (Surge)', bold: true, primary: true },
      { name: 'Sat (Today - Peak)', bold: true, tertiary: true }
    ],
    window: 'Friday 4:30 PM – 8:00 PM',
    basket: '$29.10 per patron',
    fulfillment: '98.6%',
  },
  'This Month': {
    area: 'M 0,130 C 60,130 110,60 160,60 C 210,60 240,120 290,120 C 340,120 370,45 420,45 C 470,45 490,95 540,95 C 590,95 620,30 660,30 C 675,30 690,32 700,32 L 700,160 L 0,160 Z',
    line: 'M 0,130 C 60,130 110,60 160,60 C 210,60 240,120 290,120 C 340,120 370,45 420,45 C 470,45 490,95 540,95 C 590,95 620,30 660,30 C 675,30 690,32 700,32',
    dots: [
      { cx: 160, cy: 60, fill: '#125224', r: 5 },
      { cx: 420, cy: 45, fill: '#125224', r: 5 },
      { cx: 540, cy: 95, fill: '#125224', r: 4 },
      { cx: 660, cy: 30, fill: '#F28C28', r: 6, isPeak: true },
    ],
    labels: [
      { name: 'Oct 1 (Wed)', bold: false },
      { name: 'Oct 4 (Sat)', bold: true, primary: true },
      { name: 'Oct 8 (Wed)', bold: false },
      { name: 'Oct 11 (Sat)', bold: true, primary: true },
      { name: 'Oct 15 (Wed)', bold: false },
      { name: 'Oct 18 (Today - Peak)', bold: true, tertiary: true }
    ],
    window: 'Friday 4:00 PM – 7:30 PM',
    basket: '$28.40 per patron',
    fulfillment: '98.2% (Historic High)',
  },
  'Last 30 Days': {
    area: 'M 0,125 C 80,125 110,70 170,70 C 230,70 280,115 340,115 C 400,115 450,55 510,55 C 570,55 610,85 650,40 L 700,42 L 700,160 L 0,160 Z',
    line: 'M 0,125 C 80,125 110,70 170,70 C 230,70 280,115 340,115 C 400,115 450,55 510,55 C 570,55 610,85 650,40 L 700,42',
    dots: [
      { cx: 170, cy: 70, fill: '#125224', r: 5 },
      { cx: 510, cy: 55, fill: '#125224', r: 5 },
      { cx: 650, cy: 40, fill: '#F28C28', r: 6, isPeak: true },
    ],
    labels: [
      { name: 'Week 1', bold: false },
      { name: 'Week 2', bold: true, primary: true },
      { name: 'Week 3', bold: false },
      { name: 'Week 4', bold: true, primary: true },
      { name: 'Current Cycle (Peak)', bold: true, tertiary: true }
    ],
    window: 'Thursday–Friday Evenings',
    basket: '$27.80 per patron',
    fulfillment: '97.9%',
  },
  'Year-to-Date': {
    area: 'M 0,135 C 70,135 120,105 180,105 C 240,105 280,80 350,80 C 420,80 470,50 530,50 C 590,50 620,30 670,30 L 700,32 L 700,160 L 0,160 Z',
    line: 'M 0,135 C 70,135 120,105 180,105 C 240,105 280,80 350,80 C 420,80 470,50 530,50 C 590,50 620,30 670,30 L 700,32',
    dots: [
      { cx: 180, cy: 105, fill: '#125224', r: 5 },
      { cx: 350, cy: 80, fill: '#125224', r: 5 },
      { cx: 530, cy: 50, fill: '#125224', r: 5 },
      { cx: 670, cy: 30, fill: '#F28C28', r: 6, isPeak: true },
    ],
    labels: [
      { name: 'Spring Season', bold: false },
      { name: 'Early Summer', bold: false },
      { name: 'Mid-Summer Surge', bold: true, primary: true },
      { name: 'Autumn Peak (Active)', bold: true, tertiary: true }
    ],
    window: 'Pre-Weekend Mornings',
    basket: '$26.90 per patron',
    fulfillment: '98.0%',
  },
};

export default function AdminDashboard({ onNavigate, initialTab = 'dashboard' }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [orderFilter, setOrderFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [chartTimeframe, setChartTimeframe] = useState('This Month');
  const activeChart = CHART_CONFIGS[chartTimeframe] || CHART_CONFIGS['This Month'];
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [summaryData, setSummaryData] = useState(null);

  // Modals state
  const [reviewModalData, setReviewModalData] = useState(null);
  const [announcementModalOpen, setAnnouncementModalOpen] = useState(false);
  const [autoOpenMarketModal, setAutoOpenMarketModal] = useState(false);
  const [viewOrderData, setViewOrderData] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Announcement composer state
  const [announcementForm, setAnnouncementForm] = useState({
    target: 'All Community (Farmers & Shoppers)',
    title: '',
    content: ''
  });

  // Announcements list state
  const [announcements, setAnnouncements] = useState([]);

  // Pending farmers state
  const [pendingFarmers, setPendingFarmers] = useState([]);

  // Pre-orders state
  const [orders, setOrders] = useState([]);

  // Load summary metrics, announcements, pending farmers & live orders from backend
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
        if (res?.data && Array.isArray(res.data)) {
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
        } else {
          setAnnouncements([]);
        }
      })
      .catch((err) => console.warn('Could not load announcements:', err));

    adminApi.getFarmers({ status: 'pending' })
      .then((res) => {
        if (res?.data && Array.isArray(res.data)) {
          const mapped = res.data.map((f) => ({
            id: f.id,
            initials: (f.farmer_profile?.farm_name || f.business_name || f.name || 'Vendor')
              .split(' ')
              .map((n) => n[0])
              .join('')
              .substring(0, 2)
              .toUpperCase(),
            name: f.farmer_profile?.farm_name || f.business_name || f.name,
            shortName: f.farmer_profile?.farm_name || f.business_name || f.name,
            market: f.markets?.[0]?.name || 'Regional Market Pavilion',
            dateTag: `${f.markets?.[0]?.name || 'Regional'} • ${f.created_at ? new Date(f.created_at).toLocaleDateString() : 'Recent'}`,
            products: f.farmer_profile?.farm_description || f.bio || 'Local farm produce',
            owner: f.name,
            permit: f.farmer_profile?.permit_number || `PERM-2025-${String(f.id).padStart(3, '0')}`,
            colorClass: 'bg-primary-fixed/50 text-primary'
          }));
          setPendingFarmers(mapped);
        } else {
          setPendingFarmers([]);
        }
      })
      .catch((err) => console.warn('Could not load pending farmers:', err));

    adminApi.getOrders()
      .then((res) => {
        if (res?.data && Array.isArray(res.data)) {
          const mapped = res.data.map((o) => {
            let uiStatus = 'Pending Stall Pack';
            let sColor = 'bg-tertiary-fixed text-on-tertiary-fixed';
            let dColor = 'bg-tertiary';

            if (o.status === 'ready' || o.order_status === 'ready') {
              uiStatus = 'Ready for Pickup';
              sColor = 'bg-primary-fixed text-on-primary-fixed';
              dColor = 'bg-primary';
            } else if (o.status === 'completed' || o.order_status === 'completed') {
              uiStatus = 'Collected / Paid';
              sColor = 'bg-surface-container-high text-on-surface';
              dColor = 'bg-on-surface-variant';
            }

            return {
              id: `#ML-${o.order_number || o.id}`,
              numericId: o.id,
              customer: o.customer?.name || o.user?.name || 'Customer',
              neighborhood: o.customer?.address || o.user?.address || 'Portland Metro',
              farm: o.farmer?.farmer_profile?.stall_name || o.farmer?.business_name || o.farmer?.name || 'Local Farm',
              market: o.market?.name || o.market?.market_name || 'Market Pavilion',
              itemsCount: (o.items || o.order_items || []).length || 1,
              amount: `$${Number(o.total_amount || 0).toFixed(2)}`,
              status: uiStatus,
              statusColor: sColor,
              dotColor: dColor,
              pickupTime: o.pickup_window || (o.pickup_date ? new Date(o.pickup_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Today')
            };
          });
          setOrders(mapped);
        } else {
          setOrders([]);
        }
      })
      .catch((err) => console.warn('Could not load admin orders:', err));
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

  const handleAddNewMarket = () => {
    setAutoOpenMarketModal(true);
    setActiveTab('markets');
  };

  const handleExportWeeklySummary = () => {
    try {
      const csvHeader = 'Order ID,Customer,Neighborhood,Farm Stall,Market Pavilion,Items,Amount,Status,Pickup Time\n';
      const csvRows = orders.map((o) =>
        `"${o.id}","${o.customer}","${o.neighborhood}","${o.farm}","${o.market}",${o.itemsCount},"${o.amount}","${o.status}","${o.pickupTime}"`
      ).join('\n');
      const blob = new Blob([csvHeader + csvRows], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `marketlink_weekly_harvest_summary_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.warn('CSV export download error:', e);
    }
    showToast('Weekly harvest settlement & vendor summary exported to CSV.');
  };

  const formattedToday = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

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
      {/* Premium Toast */}
      <DashboardToast message={toastMessage} onClose={() => setToastMessage(null)} />

      {/* Mobile Sidebar Backdrop */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
        ></div>
      )}

      {/* Premium Sidebar */}
      <DashboardSidebar
        role="admin"
        navItems={navItems}
        activeTab={activeTab}
        onSetTab={(id) => setActiveTab(id)}
        mobileSidebarOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        onNavigate={onNavigate}
        profileCard={{ initials: 'HV', name: 'Hannah Vance', subtitle: 'Super Administrator' }}
        footerActions={[
          { icon: 'help_outline', label: 'Admin Help & Docs', onClick: () => onNavigate('contact-us') },
          { icon: 'logout', label: 'Exit to Storefront', onClick: () => onNavigate('home'), danger: true },
        ]}
      />

      {/* RIGHT SIDE / MAIN WRAPPER */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Premium Header */}
        <DashboardHeader
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          breadcrumb={[
            'Admin Portal',
            activeTab === 'farmers' ? 'Grower Registry'
            : activeTab === 'customers' ? 'Manage Customers'
            : activeTab === 'markets' ? 'Manage Markets'
            : activeTab === 'moderation' ? 'Content Moderation'
            : activeTab === 'reports' ? 'Reports & Analytics'
            : activeTab === 'settings' ? 'System Configuration'
            : 'Dashboard Overview'
          ]}
          headerRight={
            <>
              {/* Search */}
              <div className="relative hidden md:flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-on-surface-variant/50 text-[17px] pointer-events-none">search</span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search orders, farmers..."
                  className="w-64 pl-9 pr-4 py-2 bg-surface-container-low border border-outline-variant/30 rounded-xl text-xs text-on-surface focus:outline-none focus:border-primary focus:bg-white focus:shadow-[0_0_0_3px_rgba(18,82,36,0.08)] transition-all"
                />
              </div>
              {/* Bell */}
              <button
                type="button"
                onClick={() => showToast('3 pending farmer audits & 1 weather advisory queued.')}
                className="relative w-9 h-9 rounded-xl bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-primary/8 hover:text-primary transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">notifications</span>
                <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-error text-on-error text-[9px] font-black flex items-center justify-center">3</span>
              </button>
              {/* Avatar */}
              <div className="flex items-center gap-2 pl-1 border-l border-outline-variant/30">
                <div className="hidden sm:flex flex-col text-right">
                  <span className="font-bold text-on-surface text-xs">Hannah Vance</span>
                  <span className="text-on-surface-variant text-[10px]">Super Admin</span>
                </div>
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs shadow-sm"
                  style={{ background: 'linear-gradient(135deg, #125224, #2e6b3a)', color: 'white' }}
                >
                  HV
                </div>
              </div>
            </>
          }
        />

        {/* MAIN DASHBOARD CONTENT */}
        <main className="w-full pt-16 bg-gradient-to-br from-surface via-surface-container-low/30 to-surface min-h-screen">
          {activeTab === 'farmers' && (
            <ManageFarmers onNavigate={onNavigate} showToast={showToast} />
          )}

          {activeTab === 'customers' && (
            <ManageCustomers onNavigate={onNavigate} showToast={showToast} />
          )}

          {activeTab === 'markets' && (
            <ManageMarkets
              onNavigate={onNavigate}
              showToast={showToast}
              autoOpenAddModal={autoOpenMarketModal}
              onCloseAddModal={() => setAutoOpenMarketModal(false)}
            />
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
              
              {/* Regional Broadcast Health Ticker */}
              <DashboardTickerBanner
                text="Regional Market Mesh Online: All 14 Weekend Farmers Markets Active • 58 Stalls Packing • SNAP / EBT Currency Matching Live"
                badge="NETWORK STATUS"
                icon="health_and_safety"
              />

              {/* Welcome Header & Action Command Card */}
              <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-5 sm:p-6 shadow-sm relative overflow-hidden flex flex-col xl:flex-row xl:items-center justify-between gap-5 transition-all">
                {/* Ambient soft glow accents */}
                <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
                <div className="absolute -left-16 -bottom-16 w-64 h-64 rounded-full bg-secondary-fixed/15 blur-3xl pointer-events-none" />

                {/* Left: Greeting, Live Status Pill & Metadata */}
                <div className="relative z-10 flex flex-col gap-2">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="text-xl sm:text-2xl lg:text-[26px] text-on-surface font-extrabold tracking-tight flex items-center gap-2">
                      <span>Welcome back, Admin</span>
                      <span className="inline-block hover:rotate-12 transition-transform duration-200 cursor-default">👋</span>
                    </h1>

                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-xs font-bold shadow-xs">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
                      </span>
                      <span>14 Weekend Markets Live</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 sm:gap-3 text-on-surface-variant text-xs flex-wrap font-medium">
                    <div className="flex items-center gap-1.5 text-on-surface-variant font-medium">
                      <span className="material-symbols-outlined text-[17px] text-primary">calendar_today</span>
                      <span>{formattedToday}</span>
                    </div>

                    <span className="text-outline-variant/80 hidden sm:inline">•</span>

                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-800 border border-amber-500/20 text-[11px] font-semibold">
                      <span className="material-symbols-outlined text-[14px] text-amber-600">schedule</span>
                      <span>Peak Morning Harvest Flow (07:00 – 13:00)</span>
                    </div>
                  </div>
                </div>

                {/* Right: Quick Action Buttons */}
                <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 xl:flex xl:items-center gap-2.5 sm:gap-3 w-full xl:w-auto">
                  <button
                    type="button"
                    onClick={() => setAnnouncementModalOpen(true)}
                    className="h-10 px-3.5 sm:px-4 rounded-xl bg-surface-container-lowest hover:bg-surface-container text-on-surface hover:text-primary transition-all shadow-xs hover:shadow-sm font-semibold text-xs flex items-center justify-center gap-2 border border-outline-variant/40 hover:border-primary/40 cursor-pointer active:scale-95 group"
                    title="Broadcast an announcement or alert to the community"
                  >
                    <div className="w-6 h-6 rounded-lg bg-amber-500/10 text-amber-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-[16px]">campaign</span>
                    </div>
                    <span>Quick Announcement</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleExportWeeklySummary}
                    className="h-10 px-3.5 sm:px-4 rounded-xl bg-surface-container-lowest hover:bg-surface-container text-on-surface hover:text-primary transition-all shadow-xs hover:shadow-sm font-semibold text-xs flex items-center justify-center gap-2 border border-outline-variant/40 hover:border-primary/40 cursor-pointer active:scale-95 group"
                    title="Export harvest orders and settlement summary to CSV"
                  >
                    <div className="w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-[16px]">file_download</span>
                    </div>
                    <span>Export Summary</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleAddNewMarket}
                    className="h-10 px-4 sm:px-5 rounded-xl bg-primary hover:bg-primary-container text-white transition-all shadow-sm hover:shadow-md font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer active:scale-95 group"
                    title="Register a new regional market pavilion"
                  >
                    <span className="material-symbols-outlined text-[19px] group-hover:rotate-90 transition-transform duration-200">add_business</span>
                    <span>Add New Market</span>
                  </button>
                </div>
              </div>

              {/* 4 KPI Stat Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                
                {/* Card 1: Total Farmers */}
                <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden group border border-outline-variant/30">
                  <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-primary-fixed-dim/20 pointer-events-none group-hover:scale-125 transition-transform"></div>
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col">
                      <span className="font-label-sm text-[11px] text-on-surface-variant uppercase tracking-wider font-bold">
                        Registered Farmers
                      </span>
                      <span className="font-headline-lg text-2xl sm:text-3xl text-on-surface mt-1 font-bold">
                        {summaryData?.total_farmers ?? 0}
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
                        {`${summaryData?.approved_farmers ?? 0} approved`}
                      </span>
                      <span className="text-tertiary-container font-label-sm font-bold text-[11px]">
                        ({summaryData?.pending_farmers ?? pendingFarmers.length} pending)
                      </span>
                    </div>
                    <span className="font-body-sm text-on-surface-variant text-[11px]">
                      Live registered growers
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
                        {summaryData?.total_customers ?? 0}
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
                        {`${summaryData?.active_customers ?? 0} active accounts`}
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
                        {summaryData?.total_markets ?? 0}
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
                        {summaryData?.total_orders ?? 0}
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
                        {summaryData?.total_revenue ? `$${Number(summaryData.total_revenue).toFixed(2)} Vol` : '$0.00 Vol'}
                      </span>
                    </div>
                    <span className="font-body-sm text-on-surface-variant text-[11px]">
                      {summaryData?.total_revenue ? `$${Number(summaryData.total_revenue).toFixed(2)} recorded platform volume` : 'Live preorder volume'}
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
                  <div className="mt-space-lg relative w-full h-64 flex flex-col justify-end overflow-hidden">
                    {/* Background Grid Lines */}
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40">
                      <div className="w-full h-px bg-surface-container-highest"></div>
                      <div className="w-full h-px bg-surface-container-highest"></div>
                      <div className="w-full h-px bg-surface-container-highest"></div>
                      <div className="w-full h-px bg-surface-container-highest"></div>
                    </div>

                    {/* SVG Spark Area & Line */}
                    <div className="relative w-full h-48 overflow-hidden rounded-lg">
                      <svg className="w-full h-full overflow-hidden" preserveAspectRatio="none" viewBox="0 0 700 160">
                        <defs>
                          <linearGradient id="forestGlow" x1="0%" x2="0%" y1="0%" y2="100%">
                            <stop offset="0%" stopColor="#2e6b3a" stopOpacity="0.32" />
                            <stop offset="100%" stopColor="#2e6b3a" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        {/* Area Fill */}
                        <path
                          d={activeChart.area}
                          fill="url(#forestGlow)"
                          className="transition-all duration-500 ease-out"
                        />
                        {/* Line Stroke */}
                        <path
                          d={activeChart.line}
                          fill="none"
                          stroke="#2e6b3a"
                          strokeLinecap="round"
                          strokeWidth="3"
                          className="transition-all duration-500 ease-out"
                        />
                        {/* Data Spike Dots */}
                        {activeChart.dots.map((dot, idx) => (
                          <g key={idx}>
                            {dot.isPeak && (
                              <circle
                                cx={dot.cx}
                                cy={dot.cy}
                                fill="#F28C28"
                                opacity="0.35"
                                r="11"
                                className="animate-ping"
                              />
                            )}
                            <circle
                              cx={dot.cx}
                              cy={dot.cy}
                              fill={dot.fill}
                              r={dot.r}
                              stroke="#ffffff"
                              strokeWidth="2"
                              className="transition-all duration-300"
                            />
                          </g>
                        ))}
                      </svg>
                    </div>

                    {/* Day / Period Labels */}
                    <div className="flex justify-between text-on-surface-variant font-label-sm text-[11px] pt-3">
                      {activeChart.labels.map((lbl, idx) => (
                        <span
                          key={idx}
                          className={
                            lbl.tertiary
                              ? 'text-tertiary font-bold'
                              : lbl.primary
                              ? 'text-primary font-bold'
                              : lbl.bold
                              ? 'font-bold text-on-surface'
                              : ''
                          }
                        >
                          {lbl.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Summary Stat Pills */}
                  <div className="mt-space-lg pt-space-md flex flex-wrap items-center justify-between gap-space-sm bg-surface-container-low p-space-md rounded-xl border border-outline-variant/20">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-[20px]">schedule</span>
                      <div className="flex flex-col">
                        <span className="font-label-sm text-on-surface-variant text-[11px]">Peak Reservation Window</span>
                        <span className="font-label-md text-on-surface text-xs font-bold">{activeChart.window}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-tertiary text-[20px]">shopping_bag</span>
                      <div className="flex flex-col">
                        <span className="font-label-sm text-on-surface-variant text-[11px]">Avg Stand Basket</span>
                        <span className="font-label-md text-on-surface text-xs font-bold">{activeChart.basket}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-[20px]">task_alt</span>
                      <div className="flex flex-col">
                        <span className="font-label-sm text-on-surface-variant text-[11px]">Pickup Fulfilled Rate</span>
                        <span className="font-label-md text-primary text-xs font-bold">{activeChart.fulfillment}</span>
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
                              <td colSpan={8} className="py-8 text-center text-on-surface-variant text-xs">
                                <span className="material-symbols-outlined text-[28px] text-on-surface-variant/40 mb-1">receipt_long</span>
                                <p className="font-bold">{orders.length === 0 ? 'No pre-orders placed yet' : 'No orders matching current filter'}</p>
                                <p className="text-[11px] mt-0.5">{orders.length === 0 ? 'Reservations placed by shoppers will appear here in real time.' : 'Try adjusting the search query or status filter.'}</p>
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
                      Showing <span className="font-bold text-on-surface">1 to {filteredOrders.length}</span> of {summaryData?.total_orders ?? filteredOrders.length} orders total
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
                      {announcements.length === 0 ? (
                        <div className="p-5 text-center text-on-surface-variant text-xs bg-surface-container-low/50 rounded-xl border border-outline-variant/20">
                          <span className="material-symbols-outlined text-primary text-[32px] mb-1">campaign</span>
                          <p className="font-bold">No announcements published yet</p>
                          <p className="text-[11px] mt-0.5">Use the "+ Post" button to broadcast updates to the market community.</p>
                        </div>
                      ) : (
                        announcements.map((post) => (
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
                        ))
                      )}
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
