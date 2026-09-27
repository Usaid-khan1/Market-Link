import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ currentView, onNavigate, onOpenAuth, onFocusSearch }) {
  const { user, isAuthenticated, role, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'markets', label: 'Markets' },
    { id: 'products', label: 'Products' },
    { id: 'about-us', label: 'About Us' },
    { id: 'contact-us', label: 'Contact' },
  ];

  const handleLinkClick = (id) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  const handleAuthClick = () => {
    if (isAuthenticated) {
      if (role === 'admin') onNavigate('admin');
      else if (role === 'farmer') onNavigate('farmer-dashboard');
      else onNavigate('customer-dashboard');
    } else {
      onNavigate('login');
    }
    setMobileMenuOpen(false);
  };

  const isLinkActive = (id) => {
    if (id === 'home') return currentView === 'home' || !currentView;
    if (id === 'markets') return currentView === 'markets' || currentView === 'market-details';
    if (id === 'products') return currentView === 'products' || currentView === 'product-details';
    if (id === 'about-us') return currentView === 'about-us' || currentView === 'farmer-profile';
    if (id === 'contact-us') return currentView === 'contact-us';
    return currentView === id;
  };

  return (
    <header className="fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-1.5rem)] sm:w-[calc(100%-2.5rem)] max-w-[1260px] transition-all duration-300">
      {/* Floating Pill Container */}
      <div
        className={`h-[72px] sm:h-[76px] px-4 sm:px-7 rounded-full flex items-center justify-between transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 shadow-[0_16px_45px_rgba(7,35,18,0.12),0_2px_10px_rgba(0,0,0,0.06)] border border-white/80'
            : 'bg-white/90 shadow-[0_12px_40px_rgba(0,0,0,0.08),0_2px_10px_rgba(0,0,0,0.04)] border border-white/60'
        } backdrop-blur-xl`}
      >
        {/* LEFT: Brand Logo & Tagline */}
        <button
          onClick={() => handleLinkClick('home')}
          className="flex items-center gap-3 text-left cursor-pointer focus:outline-none group flex-shrink-0"
          aria-label="MarketLink Home"
        >
          {/* Circular Dark Green Logo */}
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#0b3d20] flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-200">
            <span className="material-symbols-outlined text-[22px] sm:text-[24px] text-white">
              eco
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-[18px] sm:text-[20px] font-black text-[#0b3d20] tracking-tight leading-none">
              MarketLink
            </span>
            <span className="text-[9.5px] sm:text-[10px] text-[#4a584c] font-semibold tracking-tight mt-0.5 whitespace-nowrap">
              Farm Fresh Just a Click Away
            </span>
          </div>
        </button>

        {/* CENTER: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
          {navLinks.map((link) => {
            const active = isLinkActive(link.id);
            return (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className={`relative py-1 text-[14.5px] transition-colors duration-200 cursor-pointer flex flex-col items-center group ${
                  active
                    ? 'text-[#0b3d20] font-bold'
                    : 'text-[#2e3d30] font-semibold hover:text-[#0b3d20]'
                }`}
              >
                <span>{link.label}</span>
                {/* Active Indicator Dot exactly matching reference screenshot */}
                {active && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0b3d20] mt-0.5 animate-bounce-in" />
                )}
              </button>
            );
          })}
        </nav>

        {/* RIGHT: Search + Circular Action + ADMIN Pill */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search Icon */}
          {/* <button
            aria-label="Search"
            onClick={onFocusSearch}
            className="w-9 h-9 rounded-full flex items-center justify-center text-[#2e3d30] hover:text-[#0b3d20] hover:bg-black/5 transition-all cursor-pointer"
            title="Search markets and produce"
          >
            <span className="material-symbols-outlined text-[20px]">search</span>
          </button> */}

          {/* Circular Sprout / Produce shortcut button */}
          <button
            onClick={() => handleLinkClick('products')}
            aria-label="Fresh Products"
            title="Browse Fresh Harvest"
            className="w-9 h-9 rounded-full bg-[#e8f5e9] hover:bg-[#d8eedb] text-[#125224] flex items-center justify-center transition-all cursor-pointer group"
          >
            <span className="material-symbols-outlined text-[19px] group-hover:scale-110 transition-transform">
              psychiatry
            </span>
          </button>

          {/* Auth / Role Pill Button */}
          <button
            onClick={handleAuthClick}
            className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[#eef8f1] hover:bg-[#dff2e4] border border-[#c4e6cb] text-[#0b3d20] text-xs sm:text-[12.5px] font-extrabold tracking-wider uppercase shadow-sm hover:shadow transition-all cursor-pointer group"
            title={isAuthenticated ? `Logged in as ${user?.name || 'User'} (${role})` : 'Log in to MarketLink'}
          >
            <span className="material-symbols-outlined text-[17px] text-[#0b3d20] group-hover:scale-105 transition-transform">
              {isAuthenticated ? 'person' : 'login'}
            </span>
            <span>
              {isAuthenticated
                ? (role === 'admin' ? 'ADMIN' : role === 'farmer' ? 'FARMER' : 'ACCOUNT')
                : 'LOGIN'}
            </span>
          </button>

          {/* Sign Out Button (when authenticated) */}
          {isAuthenticated && (
            <button
              onClick={async () => {
                await logout();
                onNavigate('home');
              }}
              title="Sign Out"
              className="w-9 h-9 rounded-full flex items-center justify-center text-[#556957] hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">logout</span>
            </button>
          )}

          {/* Mobile Menu Hamburger */}
          <button
            aria-label="Toggle Mobile Menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-9 h-9 rounded-full flex items-center justify-center text-[#2e3d30] hover:bg-black/5 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[22px]">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer (Nested directly under pill navbar) */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-2 bg-white/95 backdrop-blur-2xl border border-white/60 rounded-3xl p-4 shadow-[0_16px_40px_rgba(0,0,0,0.14)] flex flex-col gap-1.5 animate-slide-down">
          {navLinks.map((link) => {
            const active = isLinkActive(link.id);
            return (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className={`text-left px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all cursor-pointer flex items-center justify-between ${
                  active
                    ? 'bg-[#eef8f1] text-[#0b3d20] font-bold'
                    : 'text-[#2e3d30] hover:bg-black/5'
                }`}
              >
                <span>{link.label}</span>
                {active && <span className="w-1.5 h-1.5 rounded-full bg-[#0b3d20]" />}
              </button>
            );
          })}

          <div className="pt-2 mt-2 border-t border-gray-100 flex flex-col gap-2">
            <button
              onClick={handleAuthClick}
              className="w-full py-2.5 rounded-2xl bg-[#eef8f1] text-[#0b3d20] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">
                {isAuthenticated ? 'person' : 'login'}
              </span>
              <span>
                {isAuthenticated
                  ? `${(role === 'admin' ? 'ADMIN' : role === 'farmer' ? 'FARMER' : 'ACCOUNT')} PORTAL`
                  : 'LOG IN'}
              </span>
            </button>
            {!isAuthenticated && (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    onNavigate('login');
                    setMobileMenuOpen(false);
                  }}
                  className="py-2 rounded-xl text-center text-xs font-bold text-[#0b3d20] bg-black/5 hover:bg-black/10 cursor-pointer"
                >
                  Log In
                </button>
                <button
                  onClick={() => {
                    onNavigate('register');
                    setMobileMenuOpen(false);
                  }}
                  className="py-2 rounded-xl text-center text-xs font-bold text-white bg-[#0b3d20] hover:bg-[#125224] cursor-pointer"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
