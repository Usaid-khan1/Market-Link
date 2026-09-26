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
    { id: 'home', label: 'Home', icon: 'home' },
    { id: 'markets', label: 'Markets', icon: 'storefront' },
    { id: 'products', label: 'Products', icon: 'shopping_basket' },
    { id: 'about-us', label: 'About Us', icon: 'groups' },
    { id: 'contact-us', label: 'Contact', icon: 'mail' },
  ];

  const handleLinkClick = (id) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-surface/80 backdrop-blur-2xl shadow-[0_4px_24px_rgba(18,82,36,0.08)] border-b border-outline-variant/20'
          : 'bg-surface/60 backdrop-blur-xl border-b border-transparent'
      }`}
    >
      {/* Announcement Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary via-primary-container to-secondary px-gutter py-1.5 text-center">
        <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)'}} />
        <div className="relative flex items-center justify-center gap-space-xs">
          <span className="material-symbols-outlined text-secondary-fixed text-[15px]">eco</span>
          <p className="font-label-sm text-on-primary text-xs tracking-wide">
            🌾 Support Local Growers &bull; Reserve Weekly Produce Online &amp; Pay In-Person at Your Local Market Pickup!
          </p>
          <span className="material-symbols-outlined text-secondary-fixed text-[15px]">eco</span>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="h-16 max-w-7xl mx-auto px-gutter flex items-center justify-between gap-space-md">
        {/* Brand / Logo */}
        <div className="flex items-center gap-space-md">
          <button
            onClick={() => handleLinkClick('home')}
            className="flex items-center gap-space-sm group text-left cursor-pointer focus:outline-none"
            aria-label="MarketLink Home"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#092813] to-[#125224] border border-primary/20 flex items-center justify-center shadow-md group-hover:scale-105 transition-all duration-300">
              <span className="material-symbols-outlined text-secondary-fixed text-[22px]">eco</span>
            </div>
            <div className="flex flex-col">
              <span className="font-headline-sm text-primary tracking-tight font-black leading-none group-hover:gradient-text transition-all">
                MarketLink
              </span>
              <span className="font-label-sm text-on-surface-variant text-[10px] hidden sm:block tracking-wide">
                Farm Fresh Just a Click Away
              </span>
            </div>
          </button>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive =
              currentView === link.id ||
              (currentView === 'market-details' && link.id === 'markets') ||
              (currentView === 'farmer-profile' && link.id === 'about-us') ||
              (currentView === 'product-details' && link.id === 'products');
            return (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`relative px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer group ${
                  isActive
                    ? 'text-primary bg-primary/8'
                    : 'text-on-surface-variant hover:text-primary hover:bg-surface-container'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary animate-bounce-in" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            aria-label="Search"
            onClick={onFocusSearch}
            className="w-9 h-9 flex items-center justify-center rounded-xl text-on-surface-variant hover:bg-surface-container hover:text-primary transition-all duration-200 cursor-pointer hover:shadow-sm"
          >
            <span className="material-symbols-outlined text-[20px]">search</span>
          </button>

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (role === 'admin') onNavigate('admin');
                  else if (role === 'farmer') onNavigate('farmer-dashboard');
                  else onNavigate('customer-dashboard');
                }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-surface-container to-surface-container-high hover:from-primary/10 hover:to-secondary/10 transition-all duration-200 text-xs font-bold text-on-surface cursor-pointer border border-outline-variant/20 shadow-sm hover:shadow-green-sm"
                title={`Open ${role} dashboard`}
              >
                <span className="material-symbols-outlined text-[16px] text-primary">
                  {role === 'admin' ? 'admin_panel_settings' : role === 'farmer' ? 'agriculture' : 'shopping_bag'}
                </span>
                <span className="max-w-[100px] truncate">{user?.name}</span>
                <span className="text-[9px] uppercase tracking-wider text-primary font-black px-1.5 py-0.5 rounded-full bg-primary/10 border border-primary/20">
                  {role}
                </span>
              </button>

              <button
                onClick={async () => {
                  await logout();
                  onNavigate('home');
                }}
                title="Sign Out"
                className="w-9 h-9 rounded-xl flex items-center justify-center text-on-surface-variant hover:text-error hover:bg-error-container/20 transition-all duration-200 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate('login')}
                className={`hidden sm:inline-flex items-center gap-1.5 font-semibold text-sm px-4 py-2 rounded-xl transition-all duration-200 cursor-pointer ${
                  currentView === 'login'
                    ? 'bg-primary/10 text-primary'
                    : 'text-primary hover:bg-primary/8'
                }`}
              >
                Log In
              </button>

              <button
                onClick={() => onNavigate('register')}
                className={`inline-flex items-center justify-center font-bold text-sm px-4 py-2 rounded-xl shadow-green-sm transition-all duration-200 cursor-pointer active:scale-95 hover:shadow-green-md ${
                  currentView === 'register'
                    ? 'bg-primary text-on-primary ring-2 ring-primary/30'
                    : 'text-on-primary bg-gradient-to-r from-primary to-primary-container hover:from-primary-container hover:to-secondary'
                }`}
              >
                Register
              </button>

              {/* Quick portal shortcuts */}
              <div className="hidden sm:flex items-center gap-1">
                <button
                  onClick={() => onNavigate('customer-dashboard')}
                  aria-label="Customer Portal"
                  title="Customer Portal"
                  className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary hover:bg-primary/10 transition-all duration-200 cursor-pointer active:scale-95"
                >
                  <span className="material-symbols-outlined text-[16px]">shopping_bag</span>
                </button>

                <button
                  onClick={() => onNavigate('farmer-dashboard')}
                  aria-label="Farmer Portal"
                  title="Farmer Portal"
                  className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-secondary hover:bg-secondary/10 transition-all duration-200 cursor-pointer active:scale-95"
                >
                  <span className="material-symbols-outlined text-[16px]">agriculture</span>
                </button>

                <button
                  onClick={() => onNavigate('admin')}
                  aria-label="Admin Portal"
                  title="Admin Portal"
                  className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary transition-all duration-200 cursor-pointer active:scale-95"
                >
                  <span className="material-symbols-outlined text-[16px]">shield_person</span>
                </button>
              </div>
            </div>
          )}

          {/* Mobile Menu Hamburger */}
          <button
            aria-label="Toggle Mobile Menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl text-on-surface-variant hover:bg-surface-container hover:text-on-surface cursor-pointer transition-all"
          >
            <span className="material-symbols-outlined text-[22px]">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-surface/95 backdrop-blur-2xl border-t border-outline-variant/20 px-gutter py-4 animate-slide-down shadow-[0_8px_32px_rgba(18,82,36,0.08)]">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className={`text-left flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer ${
                  currentView === link.id
                    ? 'text-primary bg-primary/8 font-bold'
                    : 'text-on-surface-variant hover:text-primary hover:bg-surface-container'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">{link.icon}</span>
                {link.label}
              </button>
            ))}
            <div className="pt-3 mt-2 border-t border-outline-variant/20 flex flex-col gap-2 sm:hidden">
              <button
                onClick={() => { onNavigate('login'); setMobileMenuOpen(false); }}
                className="text-center font-semibold text-primary py-2.5 px-4 rounded-xl hover:bg-primary/8 transition-all cursor-pointer"
              >
                Log In
              </button>
              <button
                onClick={() => { onNavigate('register'); setMobileMenuOpen(false); }}
                className="text-center font-bold text-on-primary bg-gradient-to-r from-primary to-primary-container py-2.5 rounded-xl shadow-green-sm cursor-pointer hover:shadow-green-md transition-all"
              >
                Register Free
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
