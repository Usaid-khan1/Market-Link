import React from 'react';

export default function Footer({ onNavigate, onOpenPartnerModal }) {
  return (
    <footer className="w-full bg-surface-container-low mt-space-xl pt-space-xl pb-space-lg border-t border-outline-variant/30">
      <div className="max-w-7xl mx-auto px-gutter grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-xl">
        {/* Column 1: Brand info & Socials */}
        <div className="flex flex-col gap-space-sm">
          <div className="flex items-center gap-space-sm">
            <span className="material-symbols-outlined text-primary text-[28px]">psychiatry</span>
            <span className="font-headline-sm text-primary font-bold">MarketLink</span>
          </div>
          <p className="font-body-sm text-on-surface-variant">
            Connecting community members directly with regional family farmers. Fresh harvest, transparent prices, zero middlemen.
          </p>
          <div className="flex items-center gap-space-sm mt-space-xs text-on-surface-variant">
            <a
              href="#social"
              aria-label="Instagram"
              className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center hover:bg-surface-container-high hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">photo_camera</span>
            </a>
            <a
              href="#social"
              aria-label="Facebook"
              className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center hover:bg-surface-container-high hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">public</span>
            </a>
            <a
              href="#social"
              aria-label="Pinterest"
              className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center hover:bg-surface-container-high hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">push_pin</span>
            </a>
            <a
              href="#newsletter"
              aria-label="Newsletter Updates"
              className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center hover:bg-surface-container-high hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">mail</span>
            </a>
          </div>
        </div>

        {/* Column 2: Explore Markets */}
        <div className="flex flex-col gap-space-xs">
          <h4 className="font-headline-sm text-on-surface font-semibold mb-space-xs">Explore Markets</h4>
          <button
            onClick={() => onNavigate('markets')}
            className="text-left font-body-sm text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
          >
            Saturday Downtown Farmers Market
          </button>
          <button
            onClick={() => onNavigate('markets')}
            className="text-left font-body-sm text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
          >
            Oak Valley Sunday Bazaar
          </button>
          <button
            onClick={() => onNavigate('markets')}
            className="text-left font-body-sm text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
          >
            Riverside Harvest Green
          </button>
          <button
            onClick={() => onNavigate('markets')}
            className="text-left font-body-sm text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
          >
            Sunnybrook Community Stalls
          </button>
        </div>

        {/* Column 3: Quick Links */}
        <div className="flex flex-col gap-space-xs">
          <h4 className="font-headline-sm text-on-surface font-semibold mb-space-xs">Quick Links</h4>
          <button
            onClick={() => onNavigate('home')}
            className="text-left font-body-sm text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
          >
            Home
          </button>
          <button
            onClick={() => onNavigate('products')}
            className="text-left font-body-sm text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
          >
            Browse Seasonal Harvest
          </button>
          <button
            onClick={() => onNavigate('about-us')}
            className="text-left font-body-sm text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
          >
            Meet the Farmers
          </button>
          <button
            onClick={() => onNavigate('markets')}
            className="text-left font-body-sm text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
          >
            Pickup Guidelines
          </button>
          <button
            onClick={onOpenPartnerModal}
            className="text-left font-body-sm text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
          >
            Farmer Partner Portal
          </button>
          <button
            onClick={() => onNavigate('contact-us')}
            className="text-left font-body-sm text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
          >
            FAQ
          </button>
        </div>

        {/* Column 4: Pickup & Payment Policy */}
        <div className="flex flex-col gap-space-xs">
          <h4 className="font-headline-sm text-on-surface font-semibold mb-space-xs">Pickup &amp; Payment Policy</h4>
          <p className="font-body-sm text-on-surface-variant leading-relaxed">
            100% In-Person Payment upon collection. Cash, local farm vouchers &amp; card accepted by vendors at stall. No online fees, no delivery.
          </p>
          <div className="mt-space-sm p-space-sm rounded-lg bg-surface-container flex items-center gap-space-sm border border-outline-variant/30">
            <span className="material-symbols-outlined text-primary text-[22px]">local_shipping</span>
            <span className="font-label-sm text-on-surface-variant">
              Zero Delivery • Direct Stall Handover
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Legal bar */}
      <div className="max-w-7xl mx-auto px-gutter mt-space-lg pt-space-md border-t border-outline-variant/30 flex flex-col sm:flex-row items-center justify-between gap-space-sm text-center sm:text-left">
        <p className="font-body-sm text-on-surface-variant">
          © 2025 MarketLink. Rooted in Community. All Rights Reserved.
        </p>
        <div className="flex items-center gap-space-md font-body-sm text-on-surface-variant">
          <a href="#privacy" className="hover:text-primary transition-colors">Privacy Policy</a>
          <span>•</span>
          <a href="#terms" className="hover:text-primary transition-colors">Terms of Harvest</a>
        </div>
      </div>
    </footer>
  );
}
