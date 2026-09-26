import React from 'react';

const footerLinks = {
  markets: [
    'Saturday Downtown Farmers Market',
    'Oak Valley Sunday Bazaar',
    'Riverside Harvest Green',
    'Sunnybrook Community Stalls',
  ],
  quick: [
    { label: 'Home', view: 'home' },
    { label: 'Browse Seasonal Harvest', view: 'products' },
    { label: 'Meet the Farmers', view: 'about-us' },
    { label: 'Pickup Guidelines', view: 'markets' },
    { label: 'Farmer Partner Portal', view: 'farmer-dashboard' },
    { label: 'Admin Portal', view: 'admin' },
    { label: 'FAQ & Contact', view: 'contact-us' },
  ],
};

export default function Footer({ onNavigate, onOpenPartnerModal }) {
  return (
    <footer className="w-full relative overflow-hidden">
      {/* Top gradient separator */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-outline-variant/50 to-transparent" />

      {/* Main footer content */}
      <div
        className="py-16 relative"
        style={{
          background: 'linear-gradient(160deg, #0d3b1c 0%, #125224 50%, #1a5c2e 100%)',
        }}
      >
        {/* Background pattern */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 30px, rgba(255,255,255,0.01) 30px, rgba(255,255,255,0.01) 60px)',
          }}
        />
        <div
          className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(185,244,116,0.05) 0%, transparent 70%)' }}
        />
        <div
          className="absolute bottom-0 left-0 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(176,242,180,0.04) 0%, transparent 70%)' }}
        />

        <div className="max-w-7xl mx-auto px-gutter relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 mb-12">
            {/* Brand Column */}
            <div className="lg:col-span-4 flex flex-col gap-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary-fixed/20 border border-secondary-fixed/30 flex items-center justify-center">
                  <span className="material-symbols-outlined text-secondary-fixed text-[22px]">eco</span>
                </div>
                <span className="font-headline-sm text-on-primary font-black tracking-tight">MarketLink</span>
              </div>

              <p className="font-body-sm text-primary-fixed-dim leading-relaxed text-sm">
                Connecting community members directly with regional family farmers. Fresh harvest, transparent prices, zero middlemen.
              </p>

              {/* Social Icons */}
              <div className="flex items-center gap-2">
                {[
                  { label: 'Instagram', icon: 'photo_camera' },
                  { label: 'Facebook', icon: 'public' },
                  { label: 'Pinterest', icon: 'push_pin' },
                  { label: 'Newsletter', icon: 'mail' },
                ].map((social) => (
                  <a
                    key={social.label}
                    href="#social"
                    aria-label={social.label}
                    className="w-9 h-9 rounded-xl bg-white/8 border border-white/10 flex items-center justify-center text-primary-fixed-dim hover:bg-secondary-fixed/20 hover:text-secondary-fixed hover:border-secondary-fixed/30 transition-all duration-200"
                  >
                    <span className="material-symbols-outlined text-[17px]">{social.icon}</span>
                  </a>
                ))}
              </div>

              {/* Newsletter mini CTA */}
              <div className="mt-1">
                <p className="font-label-sm text-primary-fixed-dim text-xs mb-2 font-bold uppercase tracking-wider">
                  Get harvest alerts
                </p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="flex-1 bg-white/8 border border-white/15 rounded-xl px-3 py-2 text-sm text-on-primary placeholder:text-primary-fixed-dim/60 focus:outline-none focus:border-secondary-fixed/50 focus:bg-white/12 transition-all"
                  />
                  <button className="px-3 py-2 rounded-xl bg-secondary-fixed text-on-secondary-fixed-variant font-bold text-xs hover:bg-secondary-fixed-dim transition-all cursor-pointer flex-shrink-0">
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Explore Markets */}
            <div className="lg:col-span-3 flex flex-col gap-3">
              <h4 className="font-label-sm text-secondary-fixed font-black uppercase tracking-widest text-xs mb-1">Explore Markets</h4>
              {footerLinks.markets.map((name) => (
                <button
                  key={name}
                  onClick={() => onNavigate('markets')}
                  className="text-left font-body-sm text-primary-fixed-dim hover:text-secondary-fixed transition-all duration-200 cursor-pointer text-sm hover:translate-x-1 flex items-center gap-2 group"
                >
                  <span className="material-symbols-outlined text-[12px] text-primary-fixed-dim/40 group-hover:text-secondary-fixed transition-colors">chevron_right</span>
                  {name}
                </button>
              ))}
            </div>

            {/* Quick Links */}
            <div className="lg:col-span-2 flex flex-col gap-3">
              <h4 className="font-label-sm text-secondary-fixed font-black uppercase tracking-widest text-xs mb-1">Quick Links</h4>
              {footerLinks.quick.map((link) => (
                <button
                  key={link.view}
                  onClick={() => onNavigate(link.view)}
                  className="text-left font-body-sm text-primary-fixed-dim hover:text-secondary-fixed transition-all duration-200 cursor-pointer text-sm hover:translate-x-1 flex items-center gap-2 group"
                >
                  <span className="material-symbols-outlined text-[12px] text-primary-fixed-dim/40 group-hover:text-secondary-fixed transition-colors">chevron_right</span>
                  {link.label}
                </button>
              ))}
            </div>

            {/* Payment Policy */}
            <div className="lg:col-span-3 flex flex-col gap-4">
              <h4 className="font-label-sm text-secondary-fixed font-black uppercase tracking-widest text-xs mb-1">Pickup &amp; Payment Policy</h4>
              <p className="font-body-sm text-primary-fixed-dim leading-relaxed text-sm">
                100% In-Person Payment upon collection. Cash, local farm vouchers &amp; card accepted by vendors at stall. No online fees, no delivery.
              </p>

              <div className="flex flex-col gap-2.5 mt-1">
                {[
                  { icon: 'local_shipping', text: 'Zero Delivery • Direct Stall Handover' },
                  { icon: 'payments', text: 'Cash, Card, or Farm Voucher' },
                  { icon: 'verified_user', text: 'All Farmers Verified & Certified' },
                ].map((item) => (
                  <div key={item.icon} className="flex items-center gap-3 bg-white/6 px-3 py-2.5 rounded-xl border border-white/8">
                    <span className="material-symbols-outlined text-secondary-fixed text-[18px] flex-shrink-0">{item.icon}</span>
                    <span className="font-label-sm text-primary-fixed-dim text-xs">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6" />

          {/* Bottom bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <p className="font-body-sm text-primary-fixed-dim text-xs">
              © 2025 MarketLink. Rooted in Community. All Rights Reserved.
            </p>
            <div className="flex items-center gap-4 font-body-sm text-primary-fixed-dim text-xs">
              <a href="#privacy" className="hover:text-secondary-fixed transition-colors">Privacy Policy</a>
              <span className="text-primary-fixed-dim/30">•</span>
              <a href="#terms" className="hover:text-secondary-fixed transition-colors">Terms of Harvest</a>
              <span className="text-primary-fixed-dim/30">•</span>
              <button
                onClick={onOpenPartnerModal}
                className="hover:text-secondary-fixed transition-colors cursor-pointer"
              >
                Partner With Us
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
