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

export default function App() {
  const [currentView, setCurrentView] = useState(() => {
    const hash = typeof window !== 'undefined' ? window.location.hash.replace('#', '') : '';
    return hash || 'admin';
  }); // 'admin' | 'dashboard' | 'contact-us' | '404' | 'register' | 'login' | 'about-us' | 'home' | 'markets' | 'market-details' | 'farmer-profile' | 'products' | 'product-details'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDay, setSelectedDay] = useState('any');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeMarketFilter, setActiveMarketFilter] = useState('all');

  // Modals & Interactive States
  const [reserveProduct, setReserveProduct] = useState(null);
  const [authMode, setAuthMode] = useState(null); // 'login' | 'register' | 'farmer' | null
  const [guideModalOpen, setGuideModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Sync hash routing
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
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
      } else if (hash === 'product-details' || hash === 'product/heirloom-brandywine') {
        setCurrentView('product-details');
      } else if (hash === 'products') {
        setCurrentView('products');
      } else if (hash === 'farmer-profile' || hash === 'farmer/green-pastures') {
        setCurrentView('farmer-profile');
      } else if (hash === 'market-details' || hash === 'market/1') {
        setCurrentView('market-details');
      } else if (hash.startsWith('markets')) {
        setCurrentView('markets');
      } else if (hash === 'home') {
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
  const handleNavigate = (viewOrSection) => {
    if (viewOrSection === 'admin' || viewOrSection === 'dashboard') {
      setCurrentView('admin');
      window.location.hash = '#admin';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (viewOrSection === '404' || viewOrSection === 'not-found') {
      setCurrentView('404');
      window.location.hash = '#404';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (viewOrSection === 'register' || viewOrSection === 'register-farmer') {
      setCurrentView('register');
      window.location.hash = '#register';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (viewOrSection === 'login') {
      setCurrentView('login');
      window.location.hash = '#login';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (viewOrSection === 'about-us') {
      setCurrentView('about-us');
      window.location.hash = '#about-us';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (viewOrSection === 'product-details') {
      setCurrentView('product-details');
      window.location.hash = '#product-details';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (viewOrSection === 'products') {
      setCurrentView('products');
      window.location.hash = '#products';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (viewOrSection === 'farmer-profile') {
      setCurrentView('farmer-profile');
      window.location.hash = '#farmer-profile';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (viewOrSection === 'market-details') {
      setCurrentView('market-details');
      window.location.hash = '#market-details';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (viewOrSection === 'markets') {
      setCurrentView('markets');
      window.location.hash = '#markets';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (
      viewOrSection === 'customer-dashboard' ||
      viewOrSection === 'customer-portal' ||
      viewOrSection === 'customer' ||
      viewOrSection === 'customer-orders' ||
      viewOrSection === 'my-orders' ||
      viewOrSection === 'customer-cart' ||
      viewOrSection === 'cart' ||
      viewOrSection === 'customer-favorites' ||
      viewOrSection === 'favorites' ||
      viewOrSection === 'customer-reviews' ||
      viewOrSection === 'my-reviews' ||
      viewOrSection === 'customer-settings' ||
      viewOrSection === 'profile-settings'
    ) {
      setCurrentView(viewOrSection);
      window.location.hash = `#${viewOrSection}`;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (
      viewOrSection === 'farmer-dashboard' ||
      viewOrSection === 'farmer-portal' ||
      viewOrSection === 'farmer' ||
      viewOrSection === 'farmer-products' ||
      viewOrSection === 'farmer-stock' ||
      viewOrSection === 'farmer-pre-orders' ||
      viewOrSection === 'farmer-reviews' ||
      viewOrSection === 'farmer-settings'
    ) {
      setCurrentView(viewOrSection);
      window.location.hash = `#${viewOrSection}`;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (viewOrSection === 'home') {
      setCurrentView('home');
      window.location.hash = '#home';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (viewOrSection === 'contact-us') {
      setCurrentView('contact-us');
      window.location.hash = '#contact-us';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (viewOrSection === 'farmer-portal') {
      setAuthMode('farmer');
    }
  };

  // Search Submit from Hero
  const handleSearch = ({ query, day, category }) => {
    setSearchQuery(query);
    setSelectedDay(day);
    setSelectedCategory(category);
    setCurrentView('products');
  };

  // Filtered Products for Home
  const filteredProducts = useMemo(() => {
    return INITIAL_PRODUCTS.filter((prod) => {
      if (selectedCategory !== 'all' && prod.category !== selectedCategory) {
        return false;
      }
      if (activeMarketFilter !== 'all' && prod.marketKey !== activeMarketFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = prod.name.toLowerCase().includes(q);
        const matchesFarm = prod.farm.toLowerCase().includes(q);
        const matchesMarket = prod.market.toLowerCase().includes(q);
        const matchesDesc = prod.description.toLowerCase().includes(q);
        if (!matchesName && !matchesFarm && !matchesMarket && !matchesDesc) {
          return false;
        }
      }
      if (selectedDay !== 'any') {
        const marketObj = MARKETS.find((m) => m.key === prod.marketKey);
        if (marketObj && marketObj.dayKey !== selectedDay) {
          return false;
        }
      }
      return true;
    });
  }, [searchQuery, selectedCategory, activeMarketFilter, selectedDay]);

  // Filtered Markets for Home Featured section
  const filteredFeaturedMarkets = useMemo(() => {
    return MARKETS.filter((m) => {
      if (selectedDay !== 'any' && m.dayKey !== selectedDay) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = m.name.toLowerCase().includes(q);
        const matchesLoc = m.address.toLowerCase().includes(q);
        if (!matchesName && !matchesLoc) return false;
      }
      return true;
    });
  }, [selectedDay, searchQuery]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedDay('any');
    setSelectedCategory('all');
    setActiveMarketFilter('all');
  };

  const handleNotifyProduct = (item) => {
    showToast(`🔔 We will alert you the moment ${item.farm || 'the grower'} harvests the next batch of ${item.name}!`);
  };

  const handleConfirmReservation = (slip) => {
    showToast(`🎉 Produce Held! Your reservation #${slip.voucherId} is confirmed for stall pickup.`);
  };

  const handleReserveForMarket = (marketKey) => {
    if (marketKey === 'downtown') {
      setCurrentView('market-details');
    } else {
      setCurrentView('products');
    }
  };

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
          /* DEDICATED CONTACT US PAGE */
          <ContactPage onNavigate={handleNavigate} />
        ) : currentView === '404' ? (
          /* DEDICATED 404 CROP NOT FOUND ERROR PAGE */
          <NotFoundPage
            onNavigate={handleNavigate}
            onSearch={handleSearch}
            onOpenFarmerPortal={() => setAuthMode('farmer')}
          />
        ) : currentView === 'register' ? (
          /* DEDICATED SHOPPER & FARMER REGISTRATION PAGE */
          <RegisterPage
            onNavigate={handleNavigate}
            onRegisterSuccess={(user) => {
              showToast(`🌾 Welcome ${user.name}! Your free ${user.role} account is now active.`);
            }}
          />
        ) : currentView === 'login' ? (
          /* DEDICATED COMMUNITY LOGIN PAGE */
          <LoginPage
            onNavigate={handleNavigate}
            onOpenRegister={() => handleNavigate('register')}
            onLoginSuccess={(user) => {
              showToast(`Welcome back, ${user.name}! Signed in as verified ${user.role}.`);
            }}
          />
        ) : currentView === 'about-us' ? (
          /* ABOUT US PAGE (Exact match to User Request) */
          <AboutUs
            onNavigate={handleNavigate}
            onOpenRegister={() => handleNavigate('register')}
            onOpenFarmerPortal={() => setAuthMode('farmer')}
          />
        ) : currentView === 'product-details' ? (
          /* HEIRLOOM BRANDYWINE TOMATOES PRODUCT DETAIL PAGE */
          <ProductDetails
            onNavigate={handleNavigate}
            onReserveProduct={(item) => setReserveProduct(item)}
            onNotifyProduct={handleNotifyProduct}
          />
        ) : currentView === 'products' ? (
          /* PRODUCTS CATALOG PAGE */
          <ProductsCatalog
            onNavigate={handleNavigate}
            onReserveProduct={(item) => setReserveProduct(item)}
            onNotifyProduct={handleNotifyProduct}
          />
        ) : currentView === 'farmer-profile' ? (
          /* GREEN PASTURES ORGANIC FARMER PROFILE */
          <FarmerProfile
            onNavigate={handleNavigate}
            onReserveProduct={(item) => setReserveProduct(item)}
            onNotifyProduct={handleNotifyProduct}
          />
        ) : currentView === 'market-details' ? (
          /* DOWNTOWN HISTORIC MARKET DETAIL PAGE */
          <MarketDetails
            onNavigate={handleNavigate}
            onReserveProduct={(item) => setReserveProduct(item)}
            onNotifyProduct={handleNotifyProduct}
          />
        ) : currentView === 'markets' ? (
          /* MARKETS DIRECTORY PAGE */
          <MarketsDirectory
            onNavigate={handleNavigate}
            onReserveForMarket={handleReserveForMarket}
          />
        ) : (
          /* HOME LANDING PAGE */
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
                if (marketKey === 'downtown') {
                  setCurrentView('market-details');
                } else if (marketKey === 'all') {
                  setCurrentView('markets');
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
                if (item.name.includes('Brandywine')) {
                  setCurrentView('product-details');
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
                setCurrentView('about-us');
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
          if (currentView !== 'home') setCurrentView('home');
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
          onLoginSuccess={(user) => {
            showToast(`Welcome ${user.name}! Signed in as ${user.role}.`);
            if (user.role === 'Shopper') {
              handleNavigate('customer-dashboard');
            } else if (user.role === 'Farmer Vendor') {
              handleNavigate('farmer-dashboard');
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
