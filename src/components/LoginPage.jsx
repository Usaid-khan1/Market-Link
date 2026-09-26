import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage({ onNavigate, onLoginSuccess, onOpenRegister }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginFeedback, setLoginFeedback] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setLoginFeedback(null);

    try {
      const authData = await login({ email, password });
      setIsLoading(false);
      setLoginFeedback(`Welcome back, ${authData.user.name}!`);
      if (onLoginSuccess) onLoginSuccess(authData.user);

      setTimeout(() => {
        if (authData.user.role === 'admin') onNavigate('admin');
        else if (authData.user.role === 'farmer') onNavigate('farmer-dashboard');
        else onNavigate('customer-dashboard');
      }, 600);
    } catch (err) {
      setIsLoading(false);
      setErrorMessage(err.message || 'Login failed. Please check your credentials.');
    }
  };

  const quickRoles = [
    { icon: 'shopping_bag', label: 'Shopper', color: 'bg-primary/8 text-primary border-primary/20' },
    { icon: 'agriculture', label: 'Farmer', color: 'bg-secondary/8 text-secondary border-secondary/20' },
    { icon: 'admin_panel_settings', label: 'Admin', color: 'bg-tertiary/8 text-tertiary border-tertiary/20' },
  ];

  return (
    <div className="flex flex-col w-full">
      {/* Breadcrumb */}
      <div className="w-full max-w-7xl mx-auto px-gutter py-4">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-on-surface-variant">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="hover:text-primary transition-colors flex items-center gap-1.5 cursor-pointer font-semibold"
          >
            <span className="material-symbols-outlined text-[15px]">storefront</span>
            <span>Home</span>
          </button>
          <span className="text-outline-variant">/</span>
          <span className="text-primary font-bold">Community Login</span>
        </nav>
      </div>

      {/* Main Login Section */}
      <section className="w-full max-w-7xl mx-auto px-gutter pb-16">
        <div
          className="w-full rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[700px] border border-outline-variant/20"
          style={{ boxShadow: '0 24px 64px rgba(18,82,36,0.10), 0 8px 24px rgba(0,0,0,0.05)' }}
        >
          {/* Left Column: Form */}
          <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between bg-white">
            <div>
              {/* Brand + Security Badge */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#092813] to-[#125224] border border-primary/20 flex items-center justify-center shadow-md">
                    <span className="material-symbols-outlined text-secondary-fixed text-[22px]">eco</span>
                  </div>
                  <span className="font-headline-sm text-primary tracking-tight font-black">MarketLink</span>
                </div>
                <span className="inline-flex items-center gap-1.5 font-bold text-primary bg-primary/8 px-3 py-1.5 rounded-full text-xs border border-primary/15">
                  <span className="w-2 h-2 rounded-full bg-secondary-fixed animate-pulse" />
                  Secure Portal
                </span>
              </div>

              {/* Title */}
              <div className="mb-8">
                <h1 className="font-headline-lg text-on-surface font-black text-3xl mb-2">
                  Welcome Back to{' '}
                  <span className="hero-headline-gradient" style={{ backgroundSize: '200% auto' }}>the Market</span>
                </h1>
                <p className="text-on-surface-variant text-sm leading-relaxed">
                  One unified community login for shoppers, family farmers, artisans, and market volunteers.
                </p>
              </div>

              {/* Role pills */}
              <div className="flex items-center gap-2 mb-8">
                {quickRoles.map((r, i) => (
                  <div key={i} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold ${r.color}`}>
                    <span className="material-symbols-outlined text-[14px]">{r.icon}</span>
                    {r.label}
                  </div>
                ))}
                <span className="text-on-surface-variant text-xs">Auto-detected roles</span>
              </div>

              {/* Error / Feedback */}
              {errorMessage && (
                <div className="mb-5 bg-error-container/30 border border-error/30 text-on-surface px-4 py-3 rounded-xl text-sm flex items-center gap-3 animate-fade-in">
                  <div className="w-8 h-8 rounded-full bg-error/15 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-error text-[18px]">error</span>
                  </div>
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {/* Email */}
                <div>
                  <label className="block font-bold text-on-surface text-xs mb-2 uppercase tracking-wider" htmlFor="email">
                    Email Address
                  </label>
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px] group-focus-within:text-primary transition-colors pointer-events-none">mail</span>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@domain.com"
                      className="w-full pl-12 pr-4 py-3.5 bg-surface-container-low border border-outline-variant/40 rounded-xl text-sm text-on-surface placeholder:text-outline/60 focus:outline-none focus:border-primary focus:bg-white focus:shadow-[0_0_0_3px_rgba(18,82,36,0.1)] transition-all"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="font-bold text-on-surface text-xs uppercase tracking-wider" htmlFor="password">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => alert('Password reset link sent to your registered email.')}
                      className="font-semibold text-primary hover:text-primary-container text-xs transition-colors cursor-pointer hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px] group-focus-within:text-primary transition-colors pointer-events-none">lock</span>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-12 pr-12 py-3.5 bg-surface-container-low border border-outline-variant/40 rounded-xl text-sm text-on-surface placeholder:text-outline/60 focus:outline-none focus:border-primary focus:bg-white focus:shadow-[0_0_0_3px_rgba(18,82,36,0.1)] transition-all"
                    />
                    <button
                      type="button"
                      aria-label="Toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors p-0.5 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[20px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                    </button>
                  </div>
                </div>

                {/* Remember */}
                <label className="flex items-center gap-3 cursor-pointer select-none group">
                  <div className={`relative w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${rememberMe ? 'bg-primary border-primary' : 'border-outline-variant/60 group-hover:border-primary/40'}`}>
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="sr-only"
                    />
                    {rememberMe && <span className="material-symbols-outlined text-on-primary text-[14px]">check</span>}
                  </div>
                  <span className="text-on-surface-variant text-sm">Remember this browser on market mornings</span>
                </label>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-1 inline-flex items-center justify-center gap-3 font-bold text-sm py-4 rounded-xl text-on-primary active:scale-[0.99] cursor-pointer transition-all duration-300 disabled:opacity-70 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(18,82,36,0.3)]"
                  style={{ background: 'linear-gradient(135deg, #125224, #2e6b3a)' }}
                >
                  {isLoading ? (
                    <>
                      <span className="material-symbols-outlined text-[20px] animate-spin">sync</span>
                      <span>Checking Community Credentials...</span>
                    </>
                  ) : loginFeedback ? (
                    <>
                      <span className="material-symbols-outlined text-[20px]">check_circle</span>
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

              {/* Guest note */}
              <div className="mt-6 p-4 rounded-2xl bg-secondary-fixed/15 border border-secondary-fixed/20 flex items-start gap-3">
                <span className="material-symbols-outlined text-secondary text-[22px] mt-0.5 flex-shrink-0">local_florist</span>
                <div className="flex-1 text-xs">
                  <p className="font-bold text-on-surface mb-0.5">First time reserving this week's harvest?</p>
                  <p className="text-on-surface-variant leading-relaxed">
                    Guest reservations are held with zero prepayment. You can pay cash or card directly to your grower at pickup.
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom strip */}
            <div className="mt-8 pt-6 border-t border-outline-variant/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
              <p className="text-on-surface">
                New to MarketLink?{' '}
                <button
                  type="button"
                  onClick={() => (onOpenRegister ? onOpenRegister() : onNavigate('home'))}
                  className="font-bold text-primary hover:underline ml-1 cursor-pointer"
                >
                  Create a free account
                </button>
              </p>
              <button
                type="button"
                onClick={() => onNavigate('contact-us')}
                className="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1.5 cursor-pointer text-xs"
              >
                <span className="material-symbols-outlined text-[15px]">contact_support</span>
                Need assistance?
              </button>
            </div>
          </div>

          {/* Right Column: Visual */}
          <div
            className="lg:col-span-5 relative overflow-hidden flex flex-col justify-between p-8 sm:p-10"
            style={{
              background: 'linear-gradient(160deg, #0a3d1a 0%, #125224 50%, #2e6b3a 100%)',
            }}
          >
            {/* Pattern overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(255,255,255,0.02) 20px, rgba(255,255,255,0.02) 40px)',
              }}
            />
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQx4zeFxfkQfCV8xOtyyZoij6plMebMpWiMQvY0Kg3T8vHuk09xwO7vo_22BQvNoYeq_YRvdi7utwl8vHxbtP412xVeQFK3umSuyotszCOHOP0AN2kvx2l-YufXoO2OWcyysGeFWzc6XRg1nmgBCBeFyggVSTynzQpMyZBAtUvx4kUlKB78hSg3ohvSkC3Xbshswlg5jyW1758RMwFdsUB5EzRMDm6XQOKW_gN_FxCBqR8VHtEeUsk"
                alt="Warm morning sunlight streaming across fresh organic farm harvest"
                className="w-full h-full object-cover mix-blend-multiply opacity-30 scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/50 to-primary/20" />
            </div>

            {/* Ambient glow */}
            <div
              className="absolute -right-20 -top-20 w-64 h-64 rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(185,244,116,0.15) 0%, transparent 70%)' }}
            />

            {/* Top Content */}
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full w-fit mb-6">
                <span className="material-symbols-outlined text-secondary-fixed text-[16px]">verified_user</span>
                <span className="font-bold text-on-primary text-xs">Community Supported • 42+ Local Growers</span>
              </div>

              <h2 className="font-headline-md text-on-primary font-bold leading-snug mb-3">
                Fresh soil, morning dew,{' '}
                <span className="text-secondary-fixed">direct harvest handshake.</span>
              </h2>
              <p className="text-primary-fixed-dim text-sm leading-relaxed">
                Every crop reserved through MarketLink comes straight from verified regional family lands within 50 miles of your neighborhood.
              </p>
            </div>

            {/* Stats Row */}
            <div className="relative z-10 flex flex-col gap-4 mt-8">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: 'eco', value: '42+', label: 'Farm Partners' },
                  { icon: 'schedule', value: '< 24h', label: 'Harvest to Stall' },
                  { icon: 'payments', value: '0%', label: 'Transaction Fee' },
                  { icon: 'diversity_1', value: '4,800+', label: 'Monthly Crates' },
                ].map((s, i) => (
                  <div key={i} className="bg-white/8 backdrop-blur-md border border-white/10 rounded-2xl p-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary-fixed text-[18px] flex-shrink-0">{s.icon}</span>
                    <div>
                      <p className="font-black text-on-primary text-sm leading-none">{s.value}</p>
                      <p className="text-primary-fixed-dim text-[10px] mt-0.5">{s.label}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Testimonial */}
              <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/15">
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="material-symbols-outlined text-[15px] text-tertiary-fixed-dim fill">star</span>
                  ))}
                </div>
                <blockquote className="text-on-primary italic text-sm leading-relaxed">
                  "Reserve Friday, inspect at the stall Saturday. 100% in-person settlement means no fees, zero food waste, and pure neighborhood trust."
                </blockquote>
                <div className="mt-3 flex items-center justify-between text-xs pt-3 border-t border-white/10">
                  <span className="font-bold text-secondary-fixed">Clara Vance</span>
                  <span className="text-primary-fixed-dim">Oak Valley Market Patron</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
