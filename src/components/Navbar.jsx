import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ currentView, onNavigate, onOpenAuth, onFocusSearch }) {
  const { user, isAuthenticated, role, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'markets', label: 'Markets' },
    { id: 'products', label: 'Products' },
    { id: 'about-us', label: 'About Us' },
    { id: 'contact-us', label: 'Contact Us' },
  ];

  const handleLinkClick = (id) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      {/* Announcement Banner */}
      <div className="bg-surface-container-low px-gutter py-space-xs text-center flex items-center justify-center gap-space-xs">
        <span className="material-symbols-outlined text-primary text-[18px]">eco</span>
        <p className="font-label-sm text-on-surface-variant">
          🌾 Support Local Growers • Reserve Weekly Produce Online &amp; Pay In-Person at Your Local Market Pickup!
        </p>
      </div>

      {/* Main Header Bar */}
      <div className="h-20 max-w-7xl mx-auto px-gutter flex items-center justify-between gap-space-md">
        {/* Brand / Logo */}
        <div className="flex items-center gap-space-md">
          <button 
            onClick={() => handleLinkClick('home')} 
            className="flex items-center gap-space-sm group text-left cursor-pointer focus:outline-none"
            aria-label="MarketLink Home"
          >
            <img 
              alt="MarketLink Logo" 
              className="h-8 w-auto object-contain transition-transform group-hover:scale-105" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCFwAFs6oHB8haDF1tl4Mghi6ExChfSnMT0HUZ3KzWZpfwDZmxDa5chfAz9TvTulJs3Bdw8iGQW1Gc4oovdfiDiFEAQ2AO__M63AeCprLWKXqNVfLMk-S8LaCZ1H-W0t-rB7U0Um8AXbt_zaXYass_8WIcTnOZZYWvQ2v_QvDSCkLFil8Bz8fkKvh0QKUHosXk5Ci9tCGYU9VbtwxlCDxU2nQ6f2Mk3PQVbgOKaADFK9ehQy4lbyNr9" 
            />
            <div className="flex flex-col">
              <span className="font-headline-sm text-primary tracking-tight font-bold group-hover:text-primary-container transition-colors">
                MarketLink
              </span>
              <span className="font-label-sm text-on-surface-variant -mt-1 hidden sm:block">
                Farm Fresh Just a Click Away
              </span>
            </div>
          </button>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-space-lg">
          {navLinks.map((link) => {
            const isActive = currentView === link.id || 
              (currentView === 'market-details' && link.id === 'markets') ||
              (currentView === 'farmer-profile' && link.id === 'about-us') ||
              (currentView === 'product-details' && link.id === 'products');
            return (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`transition-colors cursor-pointer ${
                  isActive
                    ? 'text-primary font-bold'
                    : 'font-body-md text-on-surface-variant hover:text-primary'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-space-sm">
          <button 
            aria-label="Search Markets" 
            onClick={onFocusSearch}
            className="w-10 h-10 flex items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[22px]">search</span>
          </button>

          {isAuthenticated ? (
            <div className="flex items-center gap-space-xs sm:gap-space-sm">
              <button
                onClick={() => {
                  if (role === 'admin') onNavigate('admin');
                  else if (role === 'farmer') onNavigate('farmer-dashboard');
                  else onNavigate('customer-dashboard');
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container hover:bg-surface-container-high transition-colors text-xs font-bold text-on-surface cursor-pointer"
                title={`Open ${role} dashboard`}
              >
                <span className="material-symbols-outlined text-[16px] text-primary">
                  {role === 'admin' ? 'admin_panel_settings' : role === 'farmer' ? 'agriculture' : 'shopping_bag'}
                </span>
                <span className="max-w-[120px] truncate">{user?.name}</span>
                <span className="text-[10px] uppercase tracking-wider text-primary font-bold px-1.5 py-0.5 rounded bg-surface-container-lowest border border-outline-variant/30">
                  {role}
                </span>
              </button>

              <button
                onClick={async () => {
                  await logout();
                  onNavigate('home');
                }}
                title="Sign Out"
                className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:text-error hover:bg-error-container/30 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-space-xs sm:gap-space-sm">
              <button 
                onClick={() => onNavigate('login')}
                className={`hidden sm:inline-flex items-center font-label-md px-space-md py-space-xs rounded-lg transition-colors cursor-pointer ${
                  currentView === 'login' ? 'bg-surface-container text-primary font-bold' : 'text-primary hover:bg-surface-container hover:text-primary'
                }`}
              >
                Log In
              </button>

              <button 
                onClick={() => onNavigate('register')}
                className={`inline-flex items-center justify-center font-label-md px-space-md py-space-xs rounded-full shadow-[0_2px_8px_rgba(46,107,58,0.12)] transition-colors cursor-pointer active:scale-95 ${
                  currentView === 'register' ? 'bg-tertiary text-on-tertiary ring-2 ring-primary-container font-bold' : 'text-on-tertiary bg-tertiary-container hover:bg-tertiary'
                }`}
              >
                Register
              </button>

              {/* Quick portal shortcut buttons for easy developer access */}
              <button 
                onClick={() => onNavigate('customer-dashboard')}
                aria-label="Customer Portal"
                title="Customer Portal"
                className="w-8 h-8 rounded-full bg-[#E6F0E1] flex items-center justify-center text-[#2E6B3A] hover:bg-[#8BC34A] hover:text-[#222] transition-colors cursor-pointer active:scale-95 font-bold text-xs"
              >
                <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
              </button>

              <button 
                onClick={() => onNavigate('farmer-dashboard')}
                aria-label="Farmer Portal"
                title="Farmer Portal"
                className="w-8 h-8 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed-variant hover:bg-secondary-fixed-dim transition-colors cursor-pointer active:scale-95"
              >
                <span className="material-symbols-outlined text-[18px]">agriculture</span>
              </button>

              <button 
                onClick={() => onNavigate('admin')}
                aria-label="Admin Portal"
                title="Admin Portal"
                className="w-8 h-8 rounded-full bg-primary flex items-center justify-center ml-space-xs text-on-primary hover:bg-primary-container transition-colors cursor-pointer active:scale-95"
              >
                <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
              </button>
            </div>
          )}

          {/* Mobile Menu Hamburger */}
          <button 
            aria-label="Toggle Mobile Menu" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface cursor-pointer"
          >
            <span className="material-symbols-outlined text-[24px]">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-surface border-t border-outline-variant px-gutter py-space-md animate-slide-down shadow-lg">
          <div className="flex flex-col gap-space-sm">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className={`text-left font-body-md py-space-xs transition-colors cursor-pointer ${
                  currentView === link.id ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                {link.label}
              </button>
            ))}
            <div className="pt-space-sm border-t border-outline-variant/40 flex flex-col gap-space-sm sm:hidden">
              <button 
                onClick={() => { onNavigate('login'); setMobileMenuOpen(false); }}
                className="text-left font-label-md text-primary py-space-xs cursor-pointer"
              >
                Log In
              </button>
              <button 
                onClick={() => { onNavigate('register'); setMobileMenuOpen(false); }}
                className="text-center font-label-md text-on-tertiary bg-tertiary-container hover:bg-tertiary py-space-xs rounded-full shadow-sm cursor-pointer"
              >
                Register
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
