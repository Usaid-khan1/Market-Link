import React, { useState, useMemo, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Benefits from './components/Benefits';
import HowItWorks from './components/HowItWorks';
import FeaturedMarkets from './components/FeaturedMarkets';
import CategoryGrid from './components/CategoryGrid';
import ProductShowcase from './components/ProductShowcase';
import GrowersShowcase from './components/GrowersShowcase';
import CommunitySection from './components/CommunitySection';
import FarmerCtaBanner from './components/FarmerCtaBanner';
import ChatAssistant from './components/ChatAssistant';
import ReservationModal from './components/ReservationModal';
import AuthModal from './components/AuthModal';
import GuideModal from './components/GuideModal';
import ContactSection from './components/ContactSection';
import MarketsDirectory from './components/MarketsDirectory';
import MarketDetails from './components/MarketDetails';
import FarmerProfile from './components/FarmerProfile';
import ProductsCatalog from './components/ProductsCatalog';
import ProductDetails from './components/ProductDetails';
import AboutUs from './components/AboutUs';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import NotFoundPage from './components/NotFoundPage';
import ContactPage from './components/ContactPage';
import AdminDashboard from './components/AdminDashboard';
import FarmerDashboard from './components/FarmerDashboard';
import CustomerDashboard from './components/CustomerDashboard';
import Footer from './components/Footer';

import { INITIAL_PRODUCTS, MARKETS } from './data/mockData';
import { AuthProvider, useAuth } from './context/AuthContext';
import browseApi from './api/browse';

// Ultra-luxury Dashboard Gateway component for authenticating and switching roles effortlessly
function DashboardAccessGateway({
  targetRole,
  isDenied = false,
  currentUser,
  currentRole,
  onDemoLogin,
  onLogin,
  onRegister,
  onHome,
  isLoadingDemo,
}) {
  const configs = {
    admin: {
      title: 'Administrator Executive Desk',
      badge: 'MARKETLINK MANAGEMENT',
      icon: 'admin_panel_settings',
      accentColor: '#125224',
      glowColor: 'rgba(18, 82, 36, 0.25)',
      description:
        'Centralized governance for regional market pavilions, compliance verification, real-time volume metrics, and platform moderation.',
      demoLabel: 'Instant Demo Access as Administrator',
      badgeBg: 'bg-primary-fixed text-on-primary-fixed',
    },
    farmer: {
      title: 'Grower Stallholder Portal',
      badge: 'PRODUCER & VENDOR NETWORK',
      icon: 'agriculture',
      accentColor: '#3e6a00',
      glowColor: 'rgba(62, 106, 0, 0.25)',
      description:
        'Manage live harvest availability, calibrate Friday pre-order cutoffs, accept weekend crate reservations, and connect with patrons.',
      demoLabel: 'Instant Demo Access as Farm Stall',
      badgeBg: 'bg-tertiary-fixed text-on-tertiary-fixed',
    },
    customer: {
      title: 'Shopper Harvest Crate & Orders',
      badge: 'COMMUNITY PATRON PORTAL',
      icon: 'shopping_bag',
      accentColor: '#125224',
      glowColor: 'rgba(18, 82, 36, 0.25)',
      description:
        'Track your reserved harvest slips, manage weekly pre-orders across stalls, save your favorite growers, and review fresh produce.',
      demoLabel: 'Instant Demo Access as Shopper',
      badgeBg: 'bg-primary-fixed text-on-primary-fixed',
    },
  };

  const cfg = configs[targetRole] || configs.admin;

  return (
    <div className="flex-1 flex items-center justify-center p-4 sm:p-8 mt-16 min-h-[calc(100vh-140px)] relative overflow-hidden">
      {/* Radiant Background Auroras */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full blur-[120px] pointer-events-none -top-40 -left-40"
        style={{ background: cfg.glowColor }}
      />
      <div
        className="absolute w-[500px] h-[500px] rounded-full blur-[100px] pointer-events-none -bottom-30 -right-30"
        style={{ background: 'rgba(185, 244, 116, 0.12)' }}
      />

      <div className="relative z-10 w-full max-w-xl rounded-3xl p-6 sm:p-10 border border-outline-variant/30 shadow-[0_24px_64px_rgba(18,82,36,0.12)] bg-surface-container-lowest/95 backdrop-blur-2xl flex flex-col items-center text-center animate-fade-in">
        {/* Top Accent Gradient Line */}
        <div
          className="absolute top-0 left-0 right-0 h-1.5 rounded-t-3xl"
          style={{ background: 'linear-gradient(90deg, #125224, #3e6a00, #b9f474, #914d00)' }}
        />

        {/* Floating Badge */}
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider mb-5 ${cfg.badgeBg}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
          {cfg.badge}
        </span>

        {/* Icon with Glowing Backdrop */}
        <div className="relative mb-4">
          <div
            className="absolute inset-0 rounded-2xl blur-lg opacity-60"
            style={{ background: cfg.accentColor }}
          />
          <div
            className="relative w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg"
            style={{ background: `linear-gradient(135deg, ${cfg.accentColor}, #0d3b1c)` }}
          >
            <span className="material-symbols-outlined text-[36px]">
              {isDenied ? 'gpp_bad' : cfg.icon}
            </span>
          </div>
        </div>

        {/* Title & Description */}
        <h2 className="font-headline-md text-2xl sm:text-3xl text-on-surface font-black tracking-tight mb-2">
          {isDenied ? 'Access Authorization Required' : cfg.title}
        </h2>
        <p className="font-body-md text-sm text-on-surface-variant max-w-md mb-6 leading-relaxed">
          {isDenied
            ? `Your active account (${currentUser?.name || 'User'} • ${currentRole}) does not have ${targetRole} privileges. Switch persona below or sign in with verified credentials.`
            : cfg.description}
        </p>

        {/* 1-Click Instant Demo Button */}
        <div className="w-full space-y-3 mb-6">
          <button
            type="button"
            disabled={isLoadingDemo}
            onClick={() => onDemoLogin && onDemoLogin(targetRole)}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-primary via-primary-container to-secondary text-on-primary font-black text-sm shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="material-symbols-outlined text-[20px] text-secondary-fixed animate-pulse">bolt</span>
            <span>{isLoadingDemo ? 'Calibrating Portal Access...' : cfg.demoLabel}</span>
            <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </button>

          {/* Quick Demo Switcher Strip */}
          <div className="p-2.5 rounded-xl bg-surface-container border border-outline-variant/30 flex items-center justify-between text-xs">
            <span className="text-[11px] font-bold text-on-surface-variant flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px] text-primary">group</span>
              Switch Demo Role:
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => onDemoLogin && onDemoLogin('admin')}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                  targetRole === 'admin'
                    ? 'bg-primary text-white shadow-xs'
                    : 'bg-surface-container-high text-on-surface hover:bg-primary/10'
                }`}
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => onDemoLogin && onDemoLogin('farmer')}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                  targetRole === 'farmer'
                    ? 'bg-secondary text-white shadow-xs'
                    : 'bg-surface-container-high text-on-surface hover:bg-secondary/10'
                }`}
              >
                Farmer
              </button>
              <button
                type="button"
                onClick={() => onDemoLogin && onDemoLogin('customer')}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                  targetRole === 'customer'
                    ? 'bg-primary text-white shadow-xs'
                    : 'bg-surface-container-high text-on-surface hover:bg-primary/10'
                }`}
              >
                Shopper
              </button>
            </div>
          </div>
        </div>

        {/* Secondary Standard Login & Home Actions */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-outline-variant/20">
          <button
            type="button"
            onClick={onLogin}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-outline hover:border-primary text-on-surface-variant hover:text-primary text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">login</span>
            <span>Sign In with Password</span>
          </button>

          {onRegister && (
            <button
              type="button"
              onClick={onRegister}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">person_add</span>
              <span>Create Account</span>
            </button>
          )}

          <button
            type="button"
            onClick={onHome}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-on-surface-variant hover:text-primary text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1"
          >
            <span className="material-symbols-outlined text-[16px]">storefront</span>
            <span>Back to Home</span>
          </button>
        </div>

        {/* Trust Stamp */}
        <div className="mt-5 text-[11px] text-on-surface-variant/70 flex items-center gap-2">
          <span className="material-symbols-outlined text-[14px] text-secondary">verified_user</span>
          <span>100% Direct Farm Network &bull; Zero Middleman Cut &bull; Verified Stalls</span>
        </div>
      </div>
    </div>
  );
}

function AppContent() {
  const { user, isAuthenticated, role, isLoading, login, logout, setUser } = useAuth();
  const [demoLoggingIn, setDemoLoggingIn] = useState(false);

  const handleQuickDemoLogin = async (targetRole) => {
    setDemoLoggingIn(true);
    try {
      const email =
        targetRole === 'admin'
          ? 'admin@marketlink.test'
          : targetRole === 'farmer'
          ? 'farmer1@marketlink.test'
          : 'customer1@marketlink.test';
      await login({ email, password: 'password' });
      showToast(`⚡ Authenticated as Demo ${targetRole.toUpperCase()}! Welcome.`);
    } catch (err) {
      // Fallback: mock login session
      const mockUsers = {
        admin: { id: 1, name: 'Platform Admin', email: 'admin@marketlink.test', role: 'admin' },
        farmer: { id: 2, name: 'Marcus & Sarah (Green Pastures)', email: 'farmer1@marketlink.test', role: 'farmer' },
        customer: { id: 3, name: 'Elena Rostova', email: 'customer1@marketlink.test', role: 'customer' }
      };
      if (setUser) setUser(mockUsers[targetRole]);
      showToast(`🌾 Switched to Demo ${targetRole.toUpperCase()}!`);
    } finally {
      setDemoLoggingIn(false);
    }
  };

  const [currentView, setCurrentView] = useState(() => {
    const hash = typeof window !== 'undefined' ? window.location.hash.replace('#', '') : '';
    return hash || 'home';
  });

  const [selectedMarketId, setSelectedMarketId] = useState(1);
  const [selectedProductId, setSelectedProductId] = useState(1);
  const [selectedFarmerId, setSelectedFarmerId] = useState(1);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDay, setSelectedDay] = useState('any');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeMarketFilter, setActiveMarketFilter] = useState('all');

  // Modals & Interactive States
  const [reserveProduct, setReserveProduct] = useState(null);
  const [authMode, setAuthMode] = useState(null); // 'login' | 'register' | 'farmer' | null
  const [guideModalOpen, setGuideModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Live Backend Data States
  const [liveMarkets, setLiveMarkets] = useState([]);
  const [liveProducts, setLiveProducts] = useState([]);
  const [liveAnnouncements, setLiveAnnouncements] = useState([]);

  // Fetch initial public catalog & announcements
  useEffect(() => {
    let isMounted = true;

    async function loadPublicData() {
      try {
        const [marketsRes, productsRes, announcementsRes] = await Promise.allSettled([
          browseApi.getMarkets(),
          browseApi.getProducts(),
          browseApi.getAnnouncements(),
        ]);

        if (isMounted) {
          if (marketsRes.status === 'fulfilled' && marketsRes.value?.data) {
            setLiveMarkets(marketsRes.value.data);
          }
          if (productsRes.status === 'fulfilled' && productsRes.value?.data) {
            setLiveProducts(productsRes.value.data);
          }
          if (announcementsRes.status === 'fulfilled' && announcementsRes.value?.data) {
            setLiveAnnouncements(announcementsRes.value.data);
          }
        }
      } catch (err) {
        // Fallbacks already in place
      }
    }

    loadPublicData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Sync hash routing
  useEffect(() => {
    const handleHash = () => {
      const fullHash = window.location.hash.replace('#', '');
      const parts = fullHash.split('/');
      const hash = parts[0];
      const param = parts[1];

      if (hash === 'admin' || hash === 'dashboard') {
        setCurrentView('admin');
      } else if (
        hash === 'admin-farmers' ||
        hash === 'admin-customers' ||
        hash === 'admin-markets' ||
        hash === 'admin-moderation' ||
        hash === 'admin-reports' ||
        hash === 'admin-settings'
      ) {
        setCurrentView(hash);
      } else if (
        hash === 'farmer-dashboard' ||
        hash === 'farmer-portal' ||
        hash === 'farmer' ||
        hash === 'farmer-products' ||
        hash === 'farmer-stock' ||
        hash === 'farmer-pre-orders' ||
        hash === 'farmer-reviews' ||
        hash === 'farmer-settings'
      ) {
        setCurrentView(hash);
      } else if (
        hash === 'customer-dashboard' ||
        hash === 'customer-portal' ||
        hash === 'customer' ||
        hash === 'customer-orders' ||
        hash === 'my-orders' ||
        hash === 'customer-cart' ||
        hash === 'cart' ||
        hash === 'customer-favorites' ||
        hash === 'favorites' ||
        hash === 'customer-reviews' ||
        hash === 'my-reviews' ||
        hash === 'customer-settings' ||
        hash === 'profile-settings'
      ) {
        setCurrentView(hash);
      } else if (hash === 'contact-us') {
        setCurrentView('contact-us');
      } else if (hash === '404' || hash === 'not-found') {
        setCurrentView('404');
      } else if (hash === 'register' || hash === 'register-farmer') {
        setCurrentView('register');
      } else if (hash === 'login') {
        setCurrentView('login');
      } else if (hash === 'about-us') {
        setCurrentView('about-us');
      } else if (hash === 'product-details' || hash === 'product') {
        if (param) setSelectedProductId(parseInt(param, 10) || 1);
        setCurrentView('product-details');
      } else if (hash === 'products') {
        setCurrentView('products');
      } else if (hash === 'farmer-profile' || hash === 'farmer') {
        if (param) setSelectedFarmerId(parseInt(param, 10) || 1);
        setCurrentView('farmer-profile');
      } else if (hash === 'market-details' || hash === 'market') {
        if (param) setSelectedMarketId(parseInt(param, 10) || 1);
        setCurrentView('market-details');
      } else if (hash.startsWith('markets')) {
        setCurrentView('markets');
      } else {
        setCurrentView('home');
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Show Toast
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Navigation Handler
  const handleNavigate = (viewOrSection, id = null) => {
    let target = viewOrSection;
    if (id) {
      if (viewOrSection === 'market-details') setSelectedMarketId(id);
      if (viewOrSection === 'product-details') setSelectedProductId(id);
      if (viewOrSection === 'farmer-profile') setSelectedFarmerId(id);
      target = `${viewOrSection}/${id}`;
    }

    setCurrentView(viewOrSection);
    window.location.hash = `#${target}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Search Submit from Hero
  const handleSearch = ({ query, day, category }) => {
    setSearchQuery(query);
    setSelectedDay(day);
    setSelectedCategory(category);
    handleNavigate('products');
  };

  // Filtered Products for Home
  const filteredProducts = useMemo(() => {
    const list = liveProducts.length > 0 ? liveProducts : INITIAL_PRODUCTS;
    return list.filter((prod) => {
      if (selectedCategory !== 'all') {
        const catSlug = prod.category_name?.toLowerCase().replace(/\s+/g, '-') || prod.category;
        if (catSlug !== selectedCategory) return false;
      }
      if (activeMarketFilter !== 'all') {
        const mKey = prod.market_name?.toLowerCase().replace(/\s+/g, '-') || prod.marketKey;
        if (mKey !== activeMarketFilter) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = prod.name?.toLowerCase().includes(q);
        const matchesFarm = (prod.stall_name || prod.farmer_name || prod.farm || '').toLowerCase().includes(q);
        const matchesDesc = (prod.description || '').toLowerCase().includes(q);
        if (!matchesName && !matchesFarm && !matchesDesc) return false;
      }
      return true;
    });
  }, [liveProducts, searchQuery, selectedCategory, activeMarketFilter]);

  // Filtered Markets for Home Featured section
  const filteredFeaturedMarkets = useMemo(() => {
    const list = liveMarkets.length > 0 ? liveMarkets : MARKETS;
    return list.filter((m) => {
      const mName = m.market_name || m.name || '';
      const mAddr = m.address || '';
      if (selectedDay !== 'any') {
        const opDays = Array.isArray(m.operating_days) ? m.operating_days.join(' ').toLowerCase() : (m.operating_days || m.days || '').toLowerCase();
        if (!opDays.includes(selectedDay.toLowerCase())) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (!mName.toLowerCase().includes(q) && !mAddr.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [liveMarkets, selectedDay, searchQuery]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedDay('any');
    setSelectedCategory('all');
    setActiveMarketFilter('all');
  };

  const handleNotifyProduct = (item) => {
    showToast(`🔔 We will alert you the moment ${item.stall_name || item.farmer_name || item.farm || 'the grower'} harvests the next batch of ${item.name}!`);
  };

  const handleConfirmReservation = (slip) => {
    showToast(`🎉 Produce Held! Your reservation #${slip.voucherId || 'ML-R'} is confirmed for stall pickup.`);
  };

  const handleReserveForMarket = (marketKey) => {
    if (marketKey === 'downtown' || marketKey === 1) {
      handleNavigate('market-details', 1);
    } else {
      handleNavigate('products');
    }
  };

  /* ==========================================================================
     ROUTE GUARDS: ADMIN DASHBOARD
     ========================================================================== */
  if (
    currentView === 'admin' ||
    currentView === 'dashboard' ||
    currentView === 'admin-farmers' ||
    currentView === 'admin-customers' ||
    currentView === 'admin-markets' ||
    currentView === 'admin-moderation' ||
    currentView === 'admin-reports' ||
    currentView === 'admin-settings'
  ) {
    if (!isAuthenticated && !isLoading) {
      return (
        <div className="min-h-screen flex flex-col bg-surface">
          <Navbar currentView={currentView} onNavigate={handleNavigate} onOpenAuth={() => setAuthMode('login')} onFocusSearch={() => {}} />
          <DashboardAccessGateway
            targetRole="admin"
            onDemoLogin={handleQuickDemoLogin}
            onLogin={() => handleNavigate('login')}
            onRegister={() => handleNavigate('register')}
            onHome={() => handleNavigate('home')}
            isLoadingDemo={demoLoggingIn}
          />
          <Footer onNavigate={handleNavigate} onOpenPartnerModal={() => setAuthMode('farmer')} />
        </div>
      );
    }

    if (isAuthenticated && role !== 'admin') {
      return (
        <div className="min-h-screen flex flex-col bg-surface">
          <Navbar currentView={currentView} onNavigate={handleNavigate} onOpenAuth={() => setAuthMode('login')} onFocusSearch={() => {}} />
          <DashboardAccessGateway
            targetRole="admin"
            isDenied={true}
            currentUser={user}
            currentRole={role}
            onDemoLogin={handleQuickDemoLogin}
            onLogin={() => handleNavigate('login')}
            onRegister={() => handleNavigate('register')}
            onHome={() => handleNavigate('home')}
            isLoadingDemo={demoLoggingIn}
          />
          <Footer onNavigate={handleNavigate} onOpenPartnerModal={() => setAuthMode('farmer')} />
        </div>
      );
    }

    const tab =
      currentView === 'admin-markets'
        ? 'markets'
        : currentView === 'admin-customers'
        ? 'customers'
        : currentView === 'admin-moderation'
        ? 'moderation'
        : currentView === 'admin-reports'
        ? 'reports'
        : currentView === 'admin-settings'
        ? 'settings'
        : currentView === 'admin-farmers'
        ? 'farmers'
        : 'dashboard';

    return <AdminDashboard onNavigate={handleNavigate} initialTab={tab} />;
  }

  /* ==========================================================================
     ROUTE GUARDS: FARMER DASHBOARD
     ========================================================================== */
  if (
    currentView === 'farmer-dashboard' ||
    currentView === 'farmer-portal' ||
    currentView === 'farmer' ||
    currentView === 'farmer-products' ||
    currentView === 'farmer-stock' ||
    currentView === 'farmer-pre-orders' ||
    currentView === 'farmer-reviews' ||
    currentView === 'farmer-settings'
  ) {
    if (!isAuthenticated && !isLoading) {
      return (
        <div className="min-h-screen flex flex-col bg-surface">
          <Navbar currentView={currentView} onNavigate={handleNavigate} onOpenAuth={() => setAuthMode('farmer')} onFocusSearch={() => {}} />
          <DashboardAccessGateway
            targetRole="farmer"
            onDemoLogin={handleQuickDemoLogin}
            onLogin={() => handleNavigate('login')}
            onRegister={() => handleNavigate('register')}
            onHome={() => handleNavigate('home')}
            isLoadingDemo={demoLoggingIn}
          />
          <Footer onNavigate={handleNavigate} onOpenPartnerModal={() => setAuthMode('farmer')} />
        </div>
      );
    }

    if (isAuthenticated && role !== 'farmer' && role !== 'admin') {
      return (
        <div className="min-h-screen flex flex-col bg-surface">
          <Navbar currentView={currentView} onNavigate={handleNavigate} onOpenAuth={() => setAuthMode('farmer')} onFocusSearch={() => {}} />
          <DashboardAccessGateway
            targetRole="farmer"
            isDenied={true}
            currentUser={user}
            currentRole={role}
            onDemoLogin={handleQuickDemoLogin}
            onLogin={() => handleNavigate('login')}
            onRegister={() => handleNavigate('register')}
            onHome={() => handleNavigate('home')}
            isLoadingDemo={demoLoggingIn}
          />
          <Footer onNavigate={handleNavigate} onOpenPartnerModal={() => setAuthMode('farmer')} />
        </div>
      );
    }

    const tab =
      currentView === 'farmer-products'
        ? 'products'
        : currentView === 'farmer-stock'
        ? 'stock-template'
        : currentView === 'farmer-pre-orders'
        ? 'pre-orders'
        : currentView === 'farmer-reviews'
        ? 'reviews'
        : currentView === 'farmer-settings'
        ? 'settings'
        : 'dashboard';

    return <FarmerDashboard onNavigate={handleNavigate} initialTab={tab} />;
  }

  /* ==========================================================================
     ROUTE GUARDS: CUSTOMER DASHBOARD
     ========================================================================== */
  if (
    currentView === 'customer-dashboard' ||
    currentView === 'customer-portal' ||
    currentView === 'customer' ||
    currentView === 'customer-orders' ||
    currentView === 'my-orders' ||
    currentView === 'customer-cart' ||
    currentView === 'cart' ||
    currentView === 'customer-favorites' ||
    currentView === 'favorites' ||
    currentView === 'customer-reviews' ||
    currentView === 'my-reviews' ||
    currentView === 'customer-settings' ||
    currentView === 'profile-settings'
  ) {
    if (!isAuthenticated && !isLoading) {
      return (
        <div className="min-h-screen flex flex-col bg-surface">
          <Navbar currentView={currentView} onNavigate={handleNavigate} onOpenAuth={() => setAuthMode('login')} onFocusSearch={() => {}} />
          <DashboardAccessGateway
            targetRole="customer"
            onDemoLogin={handleQuickDemoLogin}
            onLogin={() => handleNavigate('login')}
            onRegister={() => handleNavigate('register')}
            onHome={() => handleNavigate('home')}
            isLoadingDemo={demoLoggingIn}
          />
          <Footer onNavigate={handleNavigate} onOpenPartnerModal={() => setAuthMode('farmer')} />
        </div>
      );
    }

    const tab =
      currentView === 'customer-orders' || currentView === 'my-orders'
        ? 'orders'
        : currentView === 'customer-cart' || currentView === 'cart'
        ? 'cart'
        : currentView === 'customer-favorites' || currentView === 'favorites'
        ? 'favorites'
        : currentView === 'customer-reviews' || currentView === 'my-reviews'
        ? 'reviews'
        : currentView === 'customer-settings' || currentView === 'profile-settings'
        ? 'settings'
        : 'dashboard';

    return <CustomerDashboard onNavigate={handleNavigate} initialTab={tab} />;
  }

  /* ==========================================================================
     PUBLIC PAGES & APPLICATION SHELL
     ========================================================================== */
  return (
    <div className="w-full min-h-screen bg-surface font-body-md text-on-surface antialiased flex flex-col">
      {/* Toast Alert */}
      {toastMessage && (
        <div
          className="fixed top-24 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-3 px-5 py-3 rounded-2xl text-sm font-bold animate-bounce-in max-w-[90vw] border border-white/20"
          style={{
            background: 'linear-gradient(135deg, #125224, #2e6b3a)',
            color: 'white',
            boxShadow: '0 12px 40px rgba(18,82,36,0.4), 0 4px 12px rgba(0,0,0,0.15)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <div className="w-7 h-7 rounded-xl bg-secondary-fixed/20 border border-secondary-fixed/30 flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-secondary-fixed text-[16px]">verified</span>
          </div>
          <span className="flex-1">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="w-6 h-6 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center flex-shrink-0 cursor-pointer transition-all"
          >
            <span className="material-symbols-outlined text-[14px]">close</span>
          </button>
        </div>
      )}

      {/* Navbar Header */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenAuth={(mode) => setAuthMode(mode)}
        onFocusSearch={() => {
          if (currentView === 'markets') {
            const el = document.getElementById('marketSearchInput');
            if (el) el.focus();
          } else if (currentView === 'products') {
            const el = document.querySelector('input[placeholder*="Search heirloom tomatoes"]');
            if (el) el.focus();
          } else {
            const el = document.getElementById('location-query');
            if (el) el.focus();
          }
        }}
      />

      {/* Main Page Body */}
      <main className="w-full pt-20 bg-surface flex-1">
        {currentView === 'contact-us' ? (
          <ContactPage onNavigate={handleNavigate} />
        ) : currentView === '404' ? (
          <NotFoundPage
            onNavigate={handleNavigate}
            onSearch={handleSearch}
            onOpenFarmerPortal={() => setAuthMode('farmer')}
          />
        ) : currentView === 'register' ? (
          <RegisterPage
            onNavigate={handleNavigate}
            onRegisterSuccess={(newUser) => {
              showToast(`🌾 Welcome ${newUser.name}! Your free account is active.`);
            }}
          />
        ) : currentView === 'login' ? (
          <LoginPage
            onNavigate={handleNavigate}
            onOpenRegister={() => handleNavigate('register')}
            onLoginSuccess={(loggedUser) => {
              showToast(`Welcome back, ${loggedUser.name}!`);
            }}
          />
        ) : currentView === 'about-us' ? (
          <AboutUs
            onNavigate={handleNavigate}
            onOpenRegister={() => handleNavigate('register')}
            onOpenFarmerPortal={() => setAuthMode('farmer')}
          />
        ) : currentView === 'product-details' ? (
          <ProductDetails
            productId={selectedProductId}
            onNavigate={handleNavigate}
            onReserveProduct={(item) => setReserveProduct(item)}
            onNotifyProduct={handleNotifyProduct}
          />
        ) : currentView === 'products' ? (
          <ProductsCatalog
            onNavigate={handleNavigate}
            onReserveProduct={(item) => setReserveProduct(item)}
            onNotifyProduct={handleNotifyProduct}
          />
        ) : currentView === 'farmer-profile' ? (
          <FarmerProfile
            farmerId={selectedFarmerId}
            onNavigate={handleNavigate}
            onReserveProduct={(item) => setReserveProduct(item)}
            onNotifyProduct={handleNotifyProduct}
          />
        ) : currentView === 'market-details' ? (
          <MarketDetails
            marketId={selectedMarketId}
            onNavigate={handleNavigate}
            onReserveProduct={(item) => setReserveProduct(item)}
            onNotifyProduct={handleNotifyProduct}
          />
        ) : currentView === 'markets' ? (
          <MarketsDirectory
            onNavigate={handleNavigate}
            onReserveForMarket={handleReserveForMarket}
          />
        ) : (
          <div className="flex flex-col w-full">
            {/* HERO SECTION */}
            <Hero
              onSearch={handleSearch}
              searchQuery={searchQuery}
              selectedDay={selectedDay}
              selectedCategory={selectedCategory}
              onNavigate={handleNavigate}
            />

            {/* BENEFITS & TRUST STRIP */}
            <Benefits />

            {/* HOW MARKETLINK WORKS (3-Step Workflow) */}
            <HowItWorks />

            {/* FEATURED NEARBY MARKETS */}
            <FeaturedMarkets
              markets={filteredFeaturedMarkets}
              activeMarketFilter={activeMarketFilter}
              onSelectMarket={(marketKey) => {
                if (marketKey === 'downtown' || marketKey === 1) {
                  handleNavigate('market-details', 1);
                } else if (marketKey === 'all') {
                  handleNavigate('markets');
                } else {
                  setActiveMarketFilter(marketKey);
                  const prodEl = document.getElementById('products');
                  if (prodEl) prodEl.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            />

            {/* PRODUCE CATEGORY TILES GRID */}
            <CategoryGrid
              selectedCategory={selectedCategory}
              onSelectCategory={(catId) => {
                setSelectedCategory(catId);
                const prodEl = document.getElementById('products');
                if (prodEl) prodEl.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* FRESH THIS WEEK: LIVE STOCK SHOWCASE */}
            <ProductShowcase
              products={filteredProducts}
              onReserveProduct={(item) => {
                if (item.name?.includes('Brandywine') || item.id === 1) {
                  handleNavigate('product-details', item.id || 1);
                } else {
                  setReserveProduct(item);
                }
              }}
              onNotifyProduct={handleNotifyProduct}
              selectedCategory={selectedCategory}
              activeMarketFilter={activeMarketFilter}
              onResetFilters={handleResetFilters}
            />

            {/* MEET YOUR REGIONAL GROWERS */}
            <GrowersShowcase onNavigate={(sec) => {
              if (sec === 'about-us') {
                handleNavigate('about-us');
              } else {
                handleNavigate(sec);
              }
            }} />

            {/* COMMUNITY TESTIMONIALS & STATS STRIP */}
            <CommunitySection />

            {/* FARMER / VENDOR CTA BANNER */}
            <FarmerCtaBanner
              onOpenPartnerModal={() => setAuthMode('farmer')}
              onDownloadGuide={() => setGuideModalOpen(true)}
            />

            {/* CONTACT US & FAQ SECTION */}
            <ContactSection />
          </div>
        )}
      </main>

      {/* FLOATING CHAT ASSISTANT */}
      <ChatAssistant
        onNavigate={handleNavigate}
        onFilterProduct={(cat) => {
          setSelectedCategory(cat);
          if (currentView !== 'home') handleNavigate('home');
        }}
      />

      {/* FOOTER */}
      <Footer
        onNavigate={handleNavigate}
        onOpenPartnerModal={() => setAuthMode('farmer')}
      />

      {/* MODALS */}
      {reserveProduct && (
        <ReservationModal
          product={reserveProduct}
          onClose={() => setReserveProduct(null)}
          onConfirmReservation={handleConfirmReservation}
        />
      )}

      {authMode && (
        <AuthModal
          initialMode={authMode}
          onClose={() => setAuthMode(null)}
          onLoginSuccess={(authUser) => {
            showToast(`Welcome ${authUser.name}! Signed in.`);
            if (authUser.role === 'customer') {
              handleNavigate('customer-dashboard');
            } else if (authUser.role === 'farmer') {
              handleNavigate('farmer-dashboard');
            } else if (authUser.role === 'admin') {
              handleNavigate('admin');
            }
          }}
        />
      )}

      {guideModalOpen && (
        <GuideModal onClose={() => setGuideModalOpen(false)} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
