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

function AppContent() {
  const { user, isAuthenticated, role, isLoading } = useAuth();

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
          <div className="flex-1 flex items-center justify-center p-6 mt-20">
            <div className="bg-surface-container-lowest p-8 rounded-2xl max-w-md w-full text-center border border-outline-variant/30 shadow-xl">
              <span className="material-symbols-outlined text-tertiary text-5xl mb-3">admin_panel_settings</span>
              <h2 className="text-xl font-bold text-on-surface">Admin Access Required</h2>
              <p className="text-sm text-on-surface-variant mt-2 mb-6">
                Please log in with an administrator account to access the MarketLink Administration Desk.
              </p>
              <button
                onClick={() => handleNavigate('login')}
                className="w-full py-3 px-4 rounded-xl bg-primary text-on-primary font-bold text-sm shadow hover:bg-primary-container transition-colors cursor-pointer"
              >
                Log In as Administrator
              </button>
            </div>
          </div>
          <Footer onNavigate={handleNavigate} onOpenPartnerModal={() => setAuthMode('farmer')} />
        </div>
      );
    }

    if (isAuthenticated && role !== 'admin') {
      return (
        <div className="min-h-screen flex flex-col bg-surface">
          <Navbar currentView={currentView} onNavigate={handleNavigate} onOpenAuth={() => setAuthMode('login')} onFocusSearch={() => {}} />
          <div className="flex-1 flex items-center justify-center p-6 mt-20">
            <div className="bg-surface-container-lowest p-8 rounded-2xl max-w-md w-full text-center border border-outline-variant/30 shadow-xl">
              <span className="material-symbols-outlined text-error text-5xl mb-3">gpp_bad</span>
              <h2 className="text-xl font-bold text-on-surface">Access Denied</h2>
              <p className="text-sm text-on-surface-variant mt-2 mb-6">
                Your current account ({user?.name} &bull; {role}) is not authorized to access administrator controls.
              </p>
              <button
                onClick={() => handleNavigate('home')}
                className="w-full py-3 px-4 rounded-xl bg-primary text-on-primary font-bold text-sm shadow hover:bg-primary-container transition-colors cursor-pointer"
              >
                Return to Home
              </button>
            </div>
          </div>
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
          <div className="flex-1 flex items-center justify-center p-6 mt-20">
            <div className="bg-surface-container-lowest p-8 rounded-2xl max-w-md w-full text-center border border-outline-variant/30 shadow-xl">
              <span className="material-symbols-outlined text-secondary text-5xl mb-3">agriculture</span>
              <h2 className="text-xl font-bold text-on-surface">Farmer Stall Portal</h2>
              <p className="text-sm text-on-surface-variant mt-2 mb-6">
                Please log in with your registered producer / vendor account to manage your stall catalog, stock, and pre-orders.
              </p>
              <button
                onClick={() => handleNavigate('login')}
                className="w-full py-3 px-4 rounded-xl bg-tertiary-container text-on-tertiary font-bold text-sm shadow hover:bg-tertiary transition-colors cursor-pointer"
              >
                Log In as Farmer
              </button>
            </div>
          </div>
          <Footer onNavigate={handleNavigate} onOpenPartnerModal={() => setAuthMode('farmer')} />
        </div>
      );
    }

    if (isAuthenticated && role !== 'farmer' && role !== 'admin') {
      return (
        <div className="min-h-screen flex flex-col bg-surface">
          <Navbar currentView={currentView} onNavigate={handleNavigate} onOpenAuth={() => setAuthMode('farmer')} onFocusSearch={() => {}} />
          <div className="flex-1 flex items-center justify-center p-6 mt-20">
            <div className="bg-surface-container-lowest p-8 rounded-2xl max-w-md w-full text-center border border-outline-variant/30 shadow-xl">
              <span className="material-symbols-outlined text-error text-5xl mb-3">lock</span>
              <h2 className="text-xl font-bold text-on-surface">Farmer Role Required</h2>
              <p className="text-sm text-on-surface-variant mt-2 mb-6">
                This portal is reserved for verified grower stalls. Your account is registered as a customer.
              </p>
              <button
                onClick={() => handleNavigate('home')}
                className="w-full py-3 px-4 rounded-xl bg-primary text-on-primary font-bold text-sm shadow hover:bg-primary-container transition-colors cursor-pointer"
              >
                Back to MarketLink
              </button>
            </div>
          </div>
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
          <div className="flex-1 flex items-center justify-center p-6 mt-20">
            <div className="bg-surface-container-lowest p-8 rounded-2xl max-w-md w-full text-center border border-outline-variant/30 shadow-xl">
              <span className="material-symbols-outlined text-primary text-5xl mb-3">shopping_bag</span>
              <h2 className="text-xl font-bold text-on-surface">Sign In to View Your Orders & Cart</h2>
              <p className="text-sm text-on-surface-variant mt-2 mb-6">
                Your pre-orders, stall pickup schedule, and saved favorite growers require a customer account.
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => handleNavigate('login')}
                  className="w-full py-3 px-4 rounded-xl bg-primary text-on-primary font-bold text-sm shadow hover:bg-primary-container transition-colors cursor-pointer"
                >
                  Log In to Customer Account
                </button>
                <button
                  onClick={() => handleNavigate('register')}
                  className="w-full py-3 px-4 rounded-xl bg-surface-container text-on-surface font-bold text-sm hover:bg-surface-container-high transition-colors cursor-pointer"
                >
                  Create Free Account
                </button>
              </div>
            </div>
          </div>
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
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-primary text-on-primary px-space-md py-space-sm rounded-full shadow-2xl flex items-center gap-space-xs text-sm font-label-md animate-fade-in border border-primary-fixed/30 max-w-[90vw]">
          <span className="material-symbols-outlined text-[20px] text-secondary-fixed">
            verified
          </span>
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 text-on-primary/70 hover:text-on-primary cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
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
