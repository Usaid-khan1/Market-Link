import React, { useState, useEffect } from 'react';
import CustomerOrders from './CustomerOrders';
import CustomerCart from './CustomerCart';
import CustomerFavorites from './CustomerFavorites';
import CustomerReviews from './CustomerReviews';
import CustomerSettings from './CustomerSettings';
import FarmerStallMap from './FarmerStallMap';
import ReservationModal from './ReservationModal';
import customerApi from '../api/customer';
import browseApi from '../api/browse';
import { useAuth } from '../context/AuthContext';
import { DashboardSidebar, DashboardHeader, DashboardToast, StatCard, DashboardTickerBanner } from './DashboardShell';
import PageLoader from './PageLoader';

export default function CustomerDashboard({ onNavigate, initialTab = 'dashboard' }) {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  // Stalls & Booking state for the interactive map
  const [stalls, setStalls] = useState([]);
  const [activeBooking, setActiveBooking] = useState(null);
  const [bookingModalProduct, setBookingModalProduct] = useState(null);
  const [bookingTargetStall, setBookingTargetStall] = useState(null);

  // Dashboard summary data from backend
  const [dashboardSummary, setDashboardSummary] = useState(null);
  const [activeOrdersMini, setActiveOrdersMini] = useState([]);
  const [customerNotifications, setCustomerNotifications] = useState([]);

  // Quick Toast Notification helper
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Fetch real notifications for authenticated customer
  const fetchCustomerNotifications = () => {
    customerApi.getNotifications()
      .then((res) => {
        if (res?.data && Array.isArray(res.data)) {
          const mapped = res.data.map((n) => ({
            id: n.id,
            title: n.title,
            desc: n.message,
            time: n.created_at ? new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently',
            icon: n.title?.toLowerCase().includes('accepted') ? 'verified' : (n.title?.toLowerCase().includes('order') ? 'receipt_long' : 'notifications'),
            color: n.title?.toLowerCase().includes('accepted') ? 'text-amber-600' : 'text-primary'
          }));
          setCustomerNotifications(mapped);
        }
      })
      .catch((err) => console.warn('Could not load notifications:', err));
  };

  // Customer Profile Info
  const customerProfile = {
    name: user?.name || 'Customer',
    initials: (user?.name || 'C').split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase(),
    email: user?.email || '',
    location: user?.address || 'Community Shopper',
    memberSince: user?.created_at ? `Member since ${new Date(user.created_at).getFullYear()}` : 'Community Member'
  };

  // Sidebar Nav Items (Matching Customer Dashboard Layout Rules)
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'map', label: 'Stall Map & Route', icon: 'map' },
    { id: 'orders', label: 'My Orders', icon: 'receipt_long' },
    { id: 'cart', label: 'Cart & Checkout', icon: 'shopping_cart' },
    { id: 'favorites', label: 'Favorites', icon: 'favorite' },
    { id: 'reviews', label: 'My Reviews', icon: 'rate_review' },
    { id: 'settings', label: 'Profile & Settings', icon: 'settings' }
  ];

  const fetchDashboardData = () => {
    customerApi.getDashboardSummary()
      .then((res) => {
        if (res?.data) {
          setDashboardSummary(res.data);
          if (res.data.recent_orders && Array.isArray(res.data.recent_orders)) {
            const mapped = res.data.recent_orders.map((o) => {
              let uiStatus = 'Placed';
              if (o.order_status === 'accepted') uiStatus = 'Accepted';
              else if (o.order_status === 'ready' || o.order_status === 'ready_for_pickup') uiStatus = 'Ready for Pickup';
              else if (o.order_status === 'completed') uiStatus = 'Completed';
              else if (o.order_status === 'cancelled') uiStatus = 'Cancelled';

              const itemsStr = (o.items || []).map((it) => `${it.quantity} ${it.product_name || it.product?.name || 'Item'}`).join(', ');

              return {
                id: o.order_number || `#ML-${o.id}`,
                farmer: o.farmer?.farmer_profile?.stall_name || o.farmer?.name || 'Local Farm',
                items: itemsStr || 'Fresh farm harvest',
                pickupSlot: `${o.pickup_date || 'Weekend'} • ${o.pickup_time || 'Morning'}`,
                market: o.market?.market_name || 'Farmers Market Pavilion',
                status: uiStatus
              };
            });
            setActiveOrdersMini(mapped);
          }
        }
      })
      .catch((err) => console.warn('Could not load dashboard summary:', err));
  };

  // Load stalls & summary from backend API
  const fetchStalls = () => {
    browseApi.getStalls()
      .then((res) => {
        let loadedStalls = (res?.data && Array.isArray(res.data)) ? res.data : [];
        
        // Merge with locally updated farmer stall coordinates if present
        try {
          const localStallRaw = localStorage.getItem('marketlink_farmer_stall');
          if (localStallRaw) {
            const localStall = JSON.parse(localStallRaw);
            const idx = loadedStalls.findIndex(
              (s) => s.stall_name === localStall.stall_name || s.farmer_name === localStall.contact_person
            );
            if (idx >= 0) {
              loadedStalls[idx] = {
                ...loadedStalls[idx],
                latitude: Number(localStall.latitude),
                longitude: Number(localStall.longitude),
                address: localStall.address || loadedStalls[idx].address,
                stall_name: localStall.stall_name || loadedStalls[idx].stall_name,
              };
            } else if (localStall.latitude && localStall.longitude) {
              loadedStalls.push({
                id: 99,
                farmer_id: 99,
                farmer_name: localStall.contact_person || 'Farm Producer',
                stall_name: localStall.stall_name || 'Harvest Stand',
                contact_person: localStall.contact_person || 'Farmer',
                address: localStall.address || 'Market Plaza',
                latitude: Number(localStall.latitude),
                longitude: Number(localStall.longitude),
                operating_days: localStall.operating_days || ['Saturday', 'Sunday'],
                pickup_time_start: localStall.pickup_time_start || '08:00 AM',
                pickup_time_end: localStall.pickup_time_end || '01:30 PM',
                rating: 5.0,
                reviews_count: 1,
                total_stock: 35,
                products: []
              });
            }
          }
        } catch (e) {
          console.warn('Could not merge local stall:', e);
        }

        setStalls(loadedStalls);
      })
      .catch((err) => {
        console.warn('Could not load stalls directory:', err);
        try {
          const localStallRaw = localStorage.getItem('marketlink_farmer_stall');
          if (localStallRaw) {
            const localStall = JSON.parse(localStallRaw);
            setStalls([{
              id: 99,
              farmer_id: 99,
              farmer_name: localStall.contact_person || 'Farm Producer',
              stall_name: localStall.stall_name || 'Harvest Stand',
              contact_person: localStall.contact_person || 'Farmer',
              address: localStall.address || 'Market Plaza',
              latitude: Number(localStall.latitude),
              longitude: Number(localStall.longitude),
              operating_days: localStall.operating_days || ['Saturday', 'Sunday'],
              pickup_time_start: localStall.pickup_time_start || '08:00 AM',
              pickup_time_end: localStall.pickup_time_end || '01:30 PM',
              rating: 5.0,
              reviews_count: 1,
              total_stock: 35,
              products: []
            }]);
            return;
          }
        } catch {
          // Ignore
        }
        setStalls([]);
      });
  };

  useEffect(() => {
    setLoading(true);
    Promise.allSettled([
      fetchStalls(),
      fetchDashboardData(),
      fetchCustomerNotifications()
    ]).finally(() => {
      setLoading(false);
    });

    const handleOrderUpdated = (e) => {
      const detail = e?.detail;
      const orderNum = detail?.orderNumber || (detail?.orderId ? `#ML-${detail.orderId}` : 'Your order');
      const status = detail?.status || 'Accepted';
      showToast(`🔔 Update: ${orderNum} has been marked as ${status} by the farmer!`);
      fetchCustomerNotifications();
      fetchDashboardData();
    };

    const handleStallUpdated = (e) => {
      fetchStalls();
    };

    window.addEventListener('marketlink:order-updated', handleOrderUpdated);
    window.addEventListener('marketlink:stall-updated', handleStallUpdated);
    return () => {
      window.removeEventListener('marketlink:order-updated', handleOrderUpdated);
      window.removeEventListener('marketlink:stall-updated', handleStallUpdated);
    };
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await customerApi.markAllNotificationsRead();
      setCustomerNotifications([]);
      showToast('All notifications marked as read.');
    } catch (err) {
      console.warn('Could not mark all notifications as read:', err);
    }
  };

  // Recommended Products for Dashboard Home (Dynamic)
  const recommendedProducts = dashboardSummary?.recommended_products || [];

  // Favorite Farmers Mini List (Dynamic)
  const favoriteFarmersMini = dashboardSummary?.favorite_farmers || [];

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

  const handleBookStall = (stall) => {
    if (!stall) return;
    setBookingTargetStall(stall);
    const prod = (stall.products && stall.products.length > 0)
      ? stall.products[0]
      : {
        id: stall.id || 1,
        name: `${stall.stall_name} Fresh Harvest Bundle`,
        price: 15.00,
        unit: 'crate',
        farmer_id: stall.farmer_id || 2,
        market_id: stall.market_id || 1,
        farmer_name: stall.farmer_name,
        stall_name: stall.stall_name,
      };
    setBookingModalProduct(prod);
  };

  const handleConfirmStallReservation = (slip, targetStall) => {
    const stall = targetStall || bookingTargetStall;
    const vId = slip?.voucherId || `ML-${Math.floor(1000 + Math.random() * 9000)}`;
    showToast(`🎉 Produce Held! Reservation #${vId} confirmed at ${stall?.stall_name || 'Stall'}. Calculating pickup route...`);
    setBookingModalProduct(null);

    if (stall) {
      setActiveBooking({
        stallId: stall.id,
        farmerId: stall.farmer_id,
        farmer: stall.stall_name,
        voucherId: vId,
      });

      // Prepend to active pre-orders mini table
      setActiveOrdersMini((prev) => [
        {
          id: `#${vId}`,
          farmer: stall.stall_name,
          items: `${slip?.quantity || 1} ${slip?.productName || 'Harvest Item'}`,
          pickupSlot: `This Weekend • ${stall.pickup_time_start || '08:00'} – ${stall.pickup_time_end || '14:00'}`,
          market: stall.market_name || 'Market Stall',
          status: 'Placed',
          stallData: stall,
        },
        ...prev,
      ]);

      setTimeout(() => {
        document.getElementById('farmer-stalls-map')?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
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
          { icon: 'logout', label: 'Exit / Logout', onClick: async () => { await logout(); if (onNavigate) onNavigate('home'); }, danger: true },
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
          notifications={customerNotifications}
          onMarkAllRead={handleMarkAllRead}
          headerRight={
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
                  <button type="button" onClick={async () => { await logout(); setUserDropdownOpen(false); if (onNavigate) onNavigate('home'); }} className="w-full px-4 py-2 text-left text-xs font-semibold text-error hover:bg-error-container/30 flex items-center gap-2 cursor-pointer">
                    <span className="material-symbols-outlined text-[16px]">logout</span><span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          }
        />

        {/* ======================================================== */}
        {/* MAIN BODY CONTENT AREA                                   */}
        {/* ======================================================== */}
        <main className="w-full pt-16 bg-gradient-to-br from-surface via-surface-container-low/30 to-surface min-h-screen">
          {activeTab === 'dashboard' ? (
            loading ? (
              <PageLoader
                title="Loading Customer Dashboard..."
                subtitle="Retrieving your orders, farm reservations, and stall notifications..."
                minHeight="min-h-[70vh]"
              />
            ) : (
            /* 1. DASHBOARD HOME VIEW */
            <div className="px-3 sm:px-6 lg:px-gutter py-4 sm:py-space-lg max-w-7xl mx-auto w-full flex flex-col gap-5 sm:gap-space-lg animate-fade-in">
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
                    Welcome back, {customerProfile.name.split(' ')[0]} 
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
                    . {dashboardSummary?.active_orders_count ? `You have ${dashboardSummary.active_orders_count} harvest pickup${dashboardSummary.active_orders_count > 1 ? 's' : ''} scheduled.` : 'Explore local stalls and reserve fresh produce for weekend pickup.'}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setActiveTab('cart')}
                    className="px-4 py-2 rounded-xl bg-primary hover:bg-primary/95 text-on-primary text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[17px]">shopping_cart</span>
                    <span>View Cart</span>
                  </button>
                </div>
              </div>

              {/* Row of 3 Stat Cards with Sparklines */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
                <StatCard
                  icon="receipt_long"
                  label="Active Orders"
                  value={dashboardSummary?.active_orders_count ?? activeOrdersMini.length}
                  trend={dashboardSummary?.active_orders_count ? `${dashboardSummary.active_orders_count} awaiting pickup` : '0 active orders'}
                  trendUp={true}
                  iconBg="bg-blue-50"
                  iconColor="text-[#0369a1]"
                  sparkline={[20, 30, 45, 60, 50, 75, 90]}
                />
                <StatCard
                  icon="check_circle"
                  label="Completed Pickups"
                  value={dashboardSummary?.completed_pickups_count ?? 0}
                  trend={dashboardSummary?.completed_pickups_count ? `${dashboardSummary.completed_pickups_count} fulfilled` : '0 pickups'}
                  trendUp={true}
                  iconBg="bg-emerald-50"
                  iconColor="text-emerald-700"
                  sparkline={[30, 45, 55, 65, 75, 85, 95]}
                />
                <StatCard
                  icon="favorite"
                  label="Saved Favorites"
                  value={dashboardSummary?.saved_favorites_count ?? favoriteFarmersMini.length}
                  trend={dashboardSummary?.saved_favorites_count ? `${dashboardSummary.saved_favorites_count} saved growers & items` : '0 saved items'}
                  trendUp={true}
                  iconBg="bg-amber-50"
                  iconColor="text-[#F28C28]"
                  sparkline={[40, 50, 60, 70, 80, 85, 90]}
                />
              </div>

              {/* Ready for Pickup Digital Pass Card (Shown only if customer has an active ready/placed order) */}
              {dashboardSummary?.ready_order && (
                <div className="bg-gradient-to-r from-primary-fixed/40 via-surface-container-lowest to-surface-container-lowest border border-primary/20 rounded-3xl p-4 sm:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-primary text-white flex items-center justify-center flex-shrink-0 shadow-md">
                      <span className="material-symbols-outlined text-[26px] sm:text-[32px]">qr_code_scanner</span>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="px-2 py-0.5 rounded-full bg-primary text-white font-black text-[9px] uppercase tracking-wider">
                          READY FOR PICKUP
                        </span>
                        <span className="text-xs font-mono font-bold text-on-surface-variant">
                          {dashboardSummary.ready_order.order_number || `#ML-${dashboardSummary.ready_order.id}`}
                        </span>
                      </div>
                      <h3 className="font-bold text-on-surface text-sm sm:text-lg truncate">
                        {dashboardSummary.ready_order.farmer?.farmer_profile?.stall_name || dashboardSummary.ready_order.farmer?.name || 'Local Farm'} &bull; {dashboardSummary.ready_order.market?.market_name || 'Market Pavilion'}
                      </h3>
                      <p className="text-xs text-on-surface-variant mt-0.5">
                        Pickup: <strong>{dashboardSummary.ready_order.pickup_date || 'Weekend'} &bull; {dashboardSummary.ready_order.pickup_time || 'Morning'}</strong>
                        {dashboardSummary.ready_order.items && dashboardSummary.ready_order.items.length > 0 && (
                          <span className="hidden sm:inline"> &bull; {dashboardSummary.ready_order.items.map((it) => `${it.quantity} ${it.product_name || it.product?.name || 'Item'}`).join(', ')}</span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 sm:gap-3 w-full md:w-auto justify-end">
                    <div className="hidden lg:flex flex-col items-center bg-white p-2 rounded-xl border border-outline-variant/30 shadow-2xs">
                      <span className="font-mono text-[9px] text-on-surface-variant tracking-widest font-black">||| | || |||| |</span>
                      <span className="text-[8px] text-on-surface-variant/70 font-mono">PASS-{dashboardSummary.ready_order.id}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const match = stalls.find(s => s.id === dashboardSummary.ready_order.farmer_id || s.farmer_id === dashboardSummary.ready_order.farmer_id) || stalls[0];
                        if (match) {
                          setActiveBooking({ stallId: match.id, farmerId: match.farmer_id, farmer: match.stall_name, voucherId: dashboardSummary.ready_order.order_number || `#ML-${dashboardSummary.ready_order.id}` });
                          document.getElementById('farmer-stalls-map')?.scrollIntoView({ behavior: 'smooth' });
                          showToast(`🚗 Plotting pickup route to ${match.stall_name}...`);
                        }
                      }}
                      className="flex-1 sm:flex-initial px-3.5 py-2.5 rounded-xl border border-primary/40 bg-white hover:bg-primary/5 text-primary text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">navigation</span>
                      <span>Route to Stall</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab('orders')}
                      className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">receipt_long</span>
                      <span>View Pickup Slip</span>
                    </button>
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* AVAILABLE FARMER STALLS & INTERACTIVE PICKUP MAP        */}
              {/* ======================================================== */}
              <section id="farmer-stalls-map" className="scroll-mt-24 space-y-3">
                <FarmerStallMap
                  stalls={stalls}
                  activeBooking={activeBooking}
                  onBookStall={handleBookStall}
                  onViewStallDetails={() => {
                    if (onNavigate) onNavigate('farmer-profile');
                  }}
                />
              </section>

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
                      {activeOrdersMini.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="py-10 text-center text-on-surface-variant text-xs italic">
                            No active pre-orders found. Browse local markets to reserve fresh harvest items!
                          </td>
                        </tr>
                      ) : (
                        activeOrdersMini.map((ord) => (
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
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  title="Trace Pickup Route on Map"
                                  onClick={() => {
                                    const match = stalls.find(s => s.stall_name.toLowerCase().includes(ord.farmer.toLowerCase().slice(0, 5))) || stalls[0];
                                    if (match) {
                                      setActiveBooking({ stallId: match.id, farmerId: match.farmer_id, farmer: match.stall_name, voucherId: ord.id });
                                      document.getElementById('farmer-stalls-map')?.scrollIntoView({ behavior: 'smooth' });
                                      showToast(`🚗 Plotting pickup route to ${match.stall_name}...`);
                                    }
                                  }}
                                  className="px-2.5 py-1.5 rounded-lg border border-primary/30 hover:border-primary text-primary font-bold text-xs bg-primary/5 hover:bg-primary/10 cursor-pointer shadow-2xs flex items-center gap-1"
                                >
                                  <span className="material-symbols-outlined text-[14px]">directions</span>
                                  <span>Route</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setActiveTab('orders')}
                                  className="px-3 py-1.5 rounded-lg border border-outline hover:border-primary text-primary font-bold text-xs bg-surface cursor-pointer shadow-2xs"
                                >
                                  View
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
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
                    {recommendedProducts.length === 0 ? (
                      <div className="col-span-full py-8 text-center text-on-surface-variant text-xs italic">
                        No seasonal recommendations available right now.
                      </div>
                    ) : (
                      recommendedProducts.map((prod) => (
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
                      ))
                    )}
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
                      All ({favoriteFarmersMini.length})
                    </button>
                  </div>

                  <div className="space-y-3">
                    {favoriteFarmersMini.length === 0 ? (
                      <div className="py-8 text-center text-on-surface-variant text-xs italic">
                        You haven't saved any favorite farm stands yet.
                      </div>
                    ) : (
                      favoriteFarmersMini.map((farmer) => (
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
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
            )
          ) : activeTab === 'map' ? (
            /* STALL MAP & ROUTE VIEW */
            <div className="px-3 sm:px-6 lg:px-gutter py-4 sm:py-space-lg max-w-7xl mx-auto w-full flex flex-col gap-6 animate-fade-in">
              <div className="border-b border-outline-variant/40 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h1 className="font-headline-md text-2xl text-on-surface font-bold tracking-tight">
                    Farmer Stall Map & Pickup Navigation
                  </h1>
                  <p className="font-body-md text-xs sm:text-sm text-on-surface-variant mt-1">
                    Locate regional farm stalls, view available harvest stock, reserve pickups, and view driving directions with distance & travel time.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('dashboard')}
                  className="px-3.5 py-2 rounded-xl border border-outline-variant/30 hover:border-primary text-xs font-bold text-on-surface hover:text-primary transition-all self-start sm:self-auto cursor-pointer flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                  <span>Back to Dashboard</span>
                </button>
              </div>

              <FarmerStallMap
                stalls={stalls}
                activeBooking={activeBooking}
                onBookStall={handleBookStall}
                onViewStallDetails={() => {
                  if (onNavigate) onNavigate('farmer-profile');
                }}
              />
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

      {/* IN-DASHBOARD RESERVATION MODAL */}
      {bookingModalProduct && (
        <ReservationModal
          product={bookingModalProduct}
          onClose={() => {
            setBookingModalProduct(null);
            setBookingTargetStall(null);
          }}
          onConfirmReservation={(slip) => handleConfirmStallReservation(slip, bookingTargetStall)}
          onOpenLogin={() => onNavigate && onNavigate('login')}
          onOpenRegister={() => onNavigate && onNavigate('register')}
        />
      )}
    </div>
  );
}
