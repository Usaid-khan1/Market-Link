import React, { useState } from 'react';

export default function LoginPage({ onNavigate, onLoginSuccess, onOpenRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginFeedback, setLoginFeedback] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setLoginFeedback('Welcome back, Neighbor!');
      setTimeout(() => {
        if (onLoginSuccess) {
          onLoginSuccess({
            name: email.split('@')[0] || 'Community Member',
            role: 'Shopper'
          });
        }
        onNavigate('home');
      }, 1000);
    }, 1200);
  };

  return (
    <div className="flex flex-col w-full">
      {/* Breadcrumb Navigation */}
      <div className="w-full max-w-7xl mx-auto px-gutter py-space-md">
        <nav aria-label="Breadcrumb" className="flex items-center gap-space-xs font-body-sm text-on-surface-variant text-xs">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="hover:text-primary transition-colors flex items-center gap-space-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">storefront</span>
            <span>Home</span>
          </button>
          <span className="text-outline-variant font-bold">/</span>
          <span className="text-primary font-label-sm font-bold">Community Login</span>
        </nav>
      </div>

      {/* Main Login Card Section */}
      <section className="w-full max-w-7xl mx-auto px-gutter pb-space-xl">
        <div className="w-full bg-surface-container-lowest rounded-xl shadow-[0_12px_32px_rgba(34,34,34,0.06),0_4px_16px_rgba(46,107,58,0.05)] overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[680px] border border-outline-variant/30">
          {/* Left Column (7 Cols) */}
          <div className="lg:col-span-7 p-space-lg sm:p-space-xl flex flex-col justify-between">
            <div>
              {/* Brand and Security Badge */}
              <div className="flex items-center justify-between gap-space-md pb-space-md">
                <div className="flex items-center gap-space-sm">
                  <img
                    alt="MarketLink Logo"
                    className="h-9 w-auto object-contain"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCFwAFs6oHB8haDF1tl4Mghi6ExChfSnMT0HUZ3KzWZpfwDZmxDa5chfAz9TvTulJs3Bdw8iGQW1Gc4oovdfiDiFEAQ2AO__M63AeCprLWKXqNVfLMk-S8LaCZ1H-W0t-rB7U0Um8AXbt_zaXYass_8WIcTnOZZYWvQ2v_QvDSCkLFil8Bz8fkKvh0QKUHosXk5Ci9tCGYU9VbtwxlCDxU2nQ6f2Mk3PQVbgOKaADFK9ehQy4lbyNr9"
                  />
                  <span className="font-headline-sm text-primary tracking-tight font-bold">MarketLink</span>
                </div>
                <span className="inline-flex items-center gap-space-xs font-label-sm text-primary bg-surface-container px-space-sm py-space-xs rounded-full text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse"></span>
                  Secure Portal
                </span>
              </div>

              {/* Title & Introduction */}
              <div className="mt-space-md">
                <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold">Welcome Back to the Market</h1>
                <p className="font-body-md text-body-md text-on-surface-variant mt-space-xs leading-relaxed max-w-xl text-sm">
                  One unified community login for shoppers, family farmers, artisans, and market volunteers.
                </p>
              </div>

              {/* Unified Account System Notice */}
              <div className="mt-space-lg bg-surface-container-low p-space-md rounded-xl border border-outline-variant/30">
                <div className="flex items-center justify-between gap-space-xs mb-space-xs text-xs">
                  <span className="font-label-sm text-label-sm text-primary uppercase tracking-wider font-bold">
                    Unified Account System
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Auto-detected roles</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-xs text-on-surface font-label-sm text-label-sm text-xs">
                  <div className="flex items-center gap-space-xs bg-surface-container-lowest px-space-sm py-space-xs rounded-lg shadow-sm border border-outline-variant/20">
                    <span className="material-symbols-outlined text-primary text-[18px] fill">check_circle</span>
                    <span>Shopper Basket</span>
                  </div>
                  <div className="flex items-center gap-space-xs bg-surface-container-lowest px-space-sm py-space-xs rounded-lg shadow-sm border border-outline-variant/20">
                    <span className="material-symbols-outlined text-primary text-[18px] fill">agriculture</span>
                    <span>Farmer Stall Desk</span>
                  </div>
                  <div className="flex items-center gap-space-xs bg-surface-container-lowest px-space-sm py-space-xs rounded-lg shadow-sm border border-outline-variant/20">
                    <span className="material-symbols-outlined text-primary text-[18px] fill">volunteer_activism</span>
                    <span>Coordinator Hub</span>
                  </div>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-xs italic text-[11px]">
                  No separate portals needed — your account unlocks your verified community permissions automatically.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="mt-space-lg flex flex-col gap-space-md">
                <div>
                  <label className="block font-label-md text-label-md text-on-surface mb-space-xs text-xs font-bold" htmlFor="email">
                    Email Address
                  </label>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-space-md text-on-surface-variant text-[20px] pointer-events-none">
                      mail
                    </span>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@domain.com"
                      className="w-full font-body-md text-body-md text-on-surface pl-12 pr-space-md py-3 bg-surface-container-lowest rounded-xl outline-none shadow-sm focus:shadow-[0_0_0_3px_rgba(46,107,58,0.15)] focus:bg-surface-container-lowest transition-all text-sm"
                      style={{ border: '1.5px solid #c0c9bd' }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-space-xs text-xs">
                    <label className="block font-label-md text-label-md text-on-surface font-bold" htmlFor="password">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => alert('Password reset link sent to your registered email.')}
                      className="font-label-sm text-label-sm text-primary hover:underline hover:text-primary-container transition-colors cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-space-md text-on-surface-variant text-[20px] pointer-events-none">
                      lock
                    </span>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full font-body-md text-body-md text-on-surface pl-12 pr-12 py-3 bg-surface-container-lowest rounded-xl outline-none shadow-sm focus:shadow-[0_0_0_3px_rgba(46,107,58,0.15)] focus:bg-surface-container-lowest transition-all text-sm"
                      style={{ border: '1.5px solid #c0c9bd' }}
                    />
                    <button
                      type="button"
                      aria-label="Toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-space-md text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center p-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {showPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-space-xs text-xs">
                  <label className="flex items-center gap-space-xs cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded text-primary focus:ring-primary-container accent-primary cursor-pointer"
                    />
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      Remember this browser on market mornings
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-space-xs inline-flex items-center justify-center gap-space-sm font-label-lg text-label-lg text-on-tertiary bg-tertiary-container hover:bg-tertiary transition-all duration-200 py-3.5 px-space-lg rounded-xl shadow-[0_4px_16px_rgba(145,77,0,0.2)] active:scale-[0.99] cursor-pointer text-sm font-bold"
                >
                  {isLoading ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-[20px]">sync</span>
                      <span>Checking Community Credentials...</span>
                    </>
                  ) : loginFeedback ? (
                    <>
                      <span className="material-symbols-outlined text-[20px]">check</span>
                      <span>{loginFeedback}</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In to MarketLink</span>
                      <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                    </>
                  )}
                </button>
              </form>

              {/* Guest Reservation Note */}
              <div className="mt-space-md p-space-sm rounded-lg bg-surface-container-low flex items-start gap-space-sm border border-outline-variant/20">
                <span className="material-symbols-outlined text-primary text-[20px] mt-0.5">local_florist</span>
                <div className="flex-1 text-xs">
                  <p className="font-label-sm text-label-sm text-on-surface font-bold">First time reserving this week's harvest?</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                    Guest reservations are held with zero prepayment. You can pay cash or card directly to your grower at pickup.
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Footer Bar within Left Column */}
            <div className="pt-space-lg mt-space-lg flex flex-col sm:flex-row items-center justify-between gap-space-sm bg-surface-container-low/60 -mx-space-lg sm:-mx-space-xl -mb-space-lg sm:-mb-space-xl p-space-md sm:px-space-xl border-t border-outline-variant/30 text-xs">
              <p className="font-body-sm text-body-sm text-on-surface">
                New to MarketLink? 
                <button
                  type="button"
                  onClick={() => (onOpenRegister ? onOpenRegister() : onNavigate('home'))}
                  className="font-label-md text-label-md text-primary hover:underline ml-1 font-bold cursor-pointer"
                >
                  Create a free account
                </button>
              </p>
              <button
                type="button"
                onClick={() => onNavigate('contact-us')}
                className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">contact_support</span>
                Need assistance?
              </button>
            </div>
          </div>

          {/* Right Column with Image and Ambience (5 Cols) */}
          <div className="lg:col-span-5 relative overflow-hidden bg-primary p-space-lg sm:p-space-xl flex flex-col justify-between text-on-primary">
            {/* Background Image and Gradient */}
            <div className="absolute inset-0 z-0">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQx4zeFxfkQfCV8xOtyyZoij6plMebMpWiMQvY0Kg3T8vHuk09xwO7vo_22BQvNoYeq_YRvdi7utwl8vHxbtP412xVeQFK3umSuyotszCOHOP0AN2kvx2l-YufXoO2OWcyysGeFWzc6XRg1nmgBCBeFyggVSTynzQpMyZBAtUvx4kUlKB78hSg3ohvSkC3Xbshswlg5jyW1758RMwFdsUB5EzRMDm6XQOKW_gN_FxCBqR8VHtEeUsk"
                alt="Warm morning sunlight streaming across fresh organic farm harvest produce baskets"
                className="w-full h-full object-cover mix-blend-multiply opacity-50 scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/70 to-primary/40"></div>
            </div>

            {/* Top Content */}
            <div className="relative z-10 flex flex-col gap-space-md">
              <div className="inline-flex items-center gap-space-xs bg-surface/20 backdrop-blur-md px-space-md py-space-xs rounded-full w-fit">
                <span className="material-symbols-outlined text-secondary-fixed text-[18px]">verified_user</span>
                <span className="font-label-sm text-label-sm text-surface-bright text-xs">Community Supported • 42+ Local Growers</span>
              </div>
              <div className="mt-space-md">
                <p className="font-headline-md text-headline-md leading-snug text-surface-bright font-bold">
                  Fresh soil, morning dew, direct harvest handshake.
                </p>
                <p className="font-body-md text-body-md text-primary-fixed-dim mt-space-xs text-xs leading-relaxed">
                  Every crop reserved through MarketLink comes straight from verified regional family lands within 50 miles of your neighborhood.
                </p>
              </div>
            </div>

            {/* Bottom Content & Testimonial */}
            <div className="relative z-10 flex flex-col gap-space-md mt-space-xl">
              <div className="bg-surface-container-lowest/90 backdrop-blur-md p-space-md rounded-xl text-on-surface shadow-lg border border-white/20">
                <div className="flex items-center gap-space-xs text-tertiary-container mb-space-xs">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="material-symbols-outlined text-[18px] text-tertiary fill">star</span>
                  ))}
                </div>
                <blockquote className="font-body-md text-body-md italic text-on-surface leading-snug text-xs">
                  “Reserve Friday, inspect at the stall Saturday. 100% in-person settlement means no fees, zero food waste, and pure neighborhood trust.”
                </blockquote>
                <div className="mt-space-xs flex items-center justify-between text-xs pt-1 border-t border-outline-variant/20">
                  <span className="font-label-sm text-label-sm text-primary font-bold">Clara Vance</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Oak Valley Market Patron</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-surface-bright font-label-sm text-label-sm pt-space-xs text-xs">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[18px] text-secondary-fixed">payments</span>
                  Zero Transaction Markups
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[18px] text-secondary-fixed">handshake</span>
                  Farm-to-Hand Pickup
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
