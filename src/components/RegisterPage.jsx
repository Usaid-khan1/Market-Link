import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage({ onNavigate, onRegisterSuccess, initialRole = 'shopper' }) {
  const { register } = useAuth();
  const [role, setRole] = useState(initialRole); // 'shopper' | 'farmer'
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [subscribeNewsletter, setSubscribeNewsletter] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successNotice, setSuccessNotice] = useState(null);
  const [showTermsModal, setShowTermsModal] = useState(false);

  // Dynamic Password Strength Meter
  const passwordStrength = useMemo(() => {
    if (!password) {
      return {
        widthClass: 'w-1/12 bg-outline-variant',
        text: 'Min. 8 characters with 1 number',
        colorClass: 'text-on-surface-variant'
      };
    }
    if (password.length < 6) {
      return {
        widthClass: 'w-1/4 bg-error',
        text: 'Weak password',
        colorClass: 'text-error font-bold'
      };
    }
    if (password.length < 10) {
      return {
        widthClass: 'w-2/3 bg-tertiary',
        text: 'Moderate strength',
        colorClass: 'text-tertiary font-bold'
      };
    }
    return {
      widthClass: 'w-full bg-secondary',
      text: 'Strong market-safe password!',
      colorClass: 'text-secondary font-bold'
    };
  }, [password]);

  // Password Confirmation Match Indicator
  const passwordMatch = useMemo(() => {
    if (!confirmPassword) {
      return {
        matched: null,
        text: 'Must match password above',
        colorClass: 'text-on-surface-variant'
      };
    }
    if (password === confirmPassword && password.length > 0) {
      return {
        matched: true,
        text: 'Passwords match seamlessly',
        colorClass: 'text-secondary font-bold',
        icon: 'check_circle'
      };
    }
    return {
      matched: false,
      text: 'Passwords do not match',
      colorClass: 'text-error font-bold',
      icon: 'cancel'
    };
  }, [password, confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessNotice(null);

    if (password.length < 6) {
      setErrorMessage('Please use a password of at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify your password entry.');
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        name: fullName || 'Community Member',
        email: emailAddress,
        password: password,
        password_confirmation: confirmPassword,
        role: role === 'farmer' ? 'farmer' : 'customer',
        phone: phoneNumber || null,
        address: neighborhood || null,
        stall_name: role === 'farmer' ? `${fullName || 'Farmer'}'s Produce` : null,
      };

      const authData = await register(payload);
      setIsLoading(false);
      setSuccessNotice(`Registration successful! Welcome to the harvest community, ${fullName || 'Neighbor'}.`);

      if (onRegisterSuccess) {
        onRegisterSuccess(authData.user);
      }

      setTimeout(() => {
        if (authData.user.role === 'farmer') {
          onNavigate('farmer-dashboard');
        } else {
          onNavigate('customer-dashboard');
        }
      }, 1000);
    } catch (err) {
      setIsLoading(false);
      setErrorMessage(err.message || 'Registration failed. Please check your information and try again.');
    }
  };

  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-280px)]">
      {/* Top Breadcrumb & Indicator Bar */}
      <div className="w-full bg-surface-container-low py-space-sm px-gutter border-b border-outline-variant/30">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-on-surface-variant font-label-sm">
          <nav aria-label="Breadcrumb" className="flex items-center gap-space-xs text-body-sm text-xs">
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="hover:text-primary transition-colors cursor-pointer flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[15px]">storefront</span>
              <span>Home</span>
            </button>
            <span className="text-outline">/</span>
            <span className="text-on-surface-variant">Register</span>
            <span className="text-outline">/</span>
            <span className="font-label-sm text-primary font-bold">
              {role === 'farmer' ? 'Farmer Producer Account' : 'Shopper Account'}
            </span>
          </nav>
          <div className="hidden md:flex items-center gap-space-xs text-primary font-label-sm text-xs">
            <span className="material-symbols-outlined text-[16px]">verified_user</span>
            <span>100% Free • No Payment Card Required</span>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-7xl mx-auto px-gutter py-space-lg lg:py-space-xl">
        {/* 2-Column Split Card Wrapper */}
        <div
          className="w-full rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[700px] border border-outline-variant/20"
          style={{ boxShadow: '0 24px 64px rgba(18,82,36,0.10), 0 8px 24px rgba(0,0,0,0.05)' }}
        >
          {/* Left Column: Registration Form */}
          <div className="lg:col-span-7 xl:col-span-8 p-8 sm:p-12 flex flex-col justify-between bg-white">
            <div className="w-full max-w-2xl mx-auto">
              {/* Header Branding */}
              <div className="flex items-center justify-between mb-8">
                <button
                  type="button"
                  onClick={() => onNavigate('home')}
                  className="flex items-center gap-3 cursor-pointer group text-left"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#092813] to-[#125224] border border-primary/20 flex items-center justify-center shadow-md group-hover:scale-105 transition-all">
                    <span className="material-symbols-outlined text-secondary-fixed text-[22px]">eco</span>
                  </div>
                  <span className="font-headline-sm text-primary tracking-tight font-black">
                    MarketLink
                  </span>
                </button>
              </div>

              {/* Page Heading */}
              <div className="mb-8">
                <h1 className="font-headline-lg text-on-surface font-black text-3xl mb-2">
                  {role === 'farmer' ? 'Grow With Your Local Community' : 'Join Your Local Harvest Community'}
                </h1>
                <p className="text-on-surface-variant text-sm leading-relaxed">
                  {role === 'farmer'
                    ? 'Register your regional farm, micro-orchard, or artisan kitchen to reserve weekend pavilion stalls and offer fresh harvest holds with zero commission.'
                    : 'Create your neighbor account to reserve peak dawn produce, hold farmstead goods, and meet your growers directly at Saturday pickups.'}
                </p>
              </div>

              {/* Role Selector Tabs (Single clean line) */}
              <div className="mb-8 p-1.5 bg-surface-container-low rounded-2xl flex items-center gap-2 border border-outline-variant/30">
                {/* Shopper Tab */}
                <button
                  type="button"
                  onClick={() => setRole('shopper')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl transition-all cursor-pointer font-bold text-sm ${
                    role === 'shopper'
                      ? 'bg-white text-primary shadow-sm border border-outline-variant/20'
                      : 'text-on-surface-variant hover:text-primary hover:bg-white/50'
                  }`}
                >
                  <span
                    className="material-symbols-outlined text-[19px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    shopping_basket
                  </span>
                  <span>Shopper / Household</span>
                </button>

                {/* Farmer Tab */}
                <button
                  type="button"
                  onClick={() => setRole('farmer')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl transition-all cursor-pointer font-bold text-sm ${
                    role === 'farmer'
                      ? 'bg-white text-primary shadow-sm border border-outline-variant/20'
                      : 'text-on-surface-variant hover:text-primary hover:bg-white/50'
                  }`}
                >
                  <span className="material-symbols-outlined text-[19px]">agriculture</span>
                  <span>Farmer / Producer</span>
                </button>
              </div>

              {/* Error & Success Feedback alerts */}
              {errorMessage && (
                <div className="mb-5 bg-error-container/30 border border-error/30 text-on-surface px-4 py-3 rounded-xl text-sm flex items-center gap-3 animate-fade-in">
                  <div className="w-8 h-8 rounded-full bg-error/15 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-error text-[18px]">error</span>
                  </div>
                  <span>{errorMessage}</span>
                </div>
              )}

              {successNotice && (
                <div className="mb-5 bg-secondary-fixed text-on-secondary-fixed px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-semibold animate-fade-in shadow-sm">
                  <span className="material-symbols-outlined text-[18px]">check_circle</span>
                  <span>{successNotice}</span>
                </div>
              )}

              {/* Registration Form */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-5" id="shopper-registration-form">
                {/* Full Name & Phone Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-on-surface text-xs mb-2 uppercase tracking-wider" htmlFor="fullName">
                      {role === 'farmer' ? 'Farm & Contact Name' : 'Full Name'} <span className="text-error">*</span>
                    </label>
                    <div className="relative group">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px] group-focus-within:text-primary transition-colors pointer-events-none">
                        {role === 'farmer' ? 'store' : 'person'}
                      </span>
                      <input
                        id="fullName"
                        name="fullName"
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder={role === 'farmer' ? 'Green Pastures - Sarah Miller' : 'Clara Vance'}
                        className="w-full pl-12 pr-4 py-3.5 bg-surface-container-low border border-outline-variant/40 rounded-xl text-sm text-on-surface placeholder:text-outline/60 focus:outline-none focus:border-primary focus:bg-white focus:shadow-[0_0_0_3px_rgba(18,82,36,0.1)] transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="font-bold text-on-surface text-xs uppercase tracking-wider" htmlFor="phoneNumber">
                        Contact Phone <span className="text-error">*</span>
                      </label>
                      <span className="text-[10px] font-bold text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Pickup SMS
                      </span>
                    </div>
                    <div className="relative group">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px] group-focus-within:text-primary transition-colors pointer-events-none">
                        phone_iphone
                      </span>
                      <input
                        id="phoneNumber"
                        name="phoneNumber"
                        type="tel"
                        required
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="(503) 555-0142"
                        className="w-full pl-12 pr-4 py-3.5 bg-surface-container-low border border-outline-variant/40 rounded-xl text-sm text-on-surface placeholder:text-outline/60 focus:outline-none focus:border-primary focus:bg-white focus:shadow-[0_0_0_3px_rgba(18,82,36,0.1)] transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Email Address Field */}
                <div>
                  <label className="block font-bold text-on-surface text-xs mb-2 uppercase tracking-wider" htmlFor="emailAddress">
                    Email Address <span className="text-error">*</span>
                  </label>
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px] group-focus-within:text-primary transition-colors pointer-events-none">
                      mail
                    </span>
                    <input
                      id="emailAddress"
                      name="emailAddress"
                      type="email"
                      required
                      value={emailAddress}
                      onChange={(e) => setEmailAddress(e.target.value)}
                      placeholder="clara@example.com"
                      className="w-full pl-12 pr-4 py-3.5 bg-surface-container-low border border-outline-variant/40 rounded-xl text-sm text-on-surface placeholder:text-outline/60 focus:outline-none focus:border-primary focus:bg-white focus:shadow-[0_0_0_3px_rgba(18,82,36,0.1)] transition-all"
                    />
                  </div>
                </div>

                {/* Neighborhood / Street Address */}
                <div>
                  <label className="block font-bold text-on-surface text-xs mb-2 uppercase tracking-wider" htmlFor="neighborhood">
                    {role === 'farmer' ? 'Farm Location / Primary Market' : 'Your Neighborhood / Street Address'}
                  </label>
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px] group-focus-within:text-primary transition-colors pointer-events-none">
                      location_on
                    </span>
                    <input
                      id="neighborhood"
                      name="neighborhood"
                      type="text"
                      value={neighborhood}
                      onChange={(e) => setNeighborhood(e.target.value)}
                      placeholder={role === 'farmer' ? 'Clackamas River Valley or Downtown Pavilion' : '742 Evergreen Terrace, River District or 97201'}
                      className="w-full pl-12 pr-4 py-3.5 bg-surface-container-low border border-outline-variant/40 rounded-xl text-sm text-on-surface placeholder:text-outline/60 focus:outline-none focus:border-primary focus:bg-white focus:shadow-[0_0_0_3px_rgba(18,82,36,0.1)] transition-all"
                    />
                  </div>
                </div>

                {/* Password & Confirmation Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Password */}
                  <div>
                    <label className="block font-bold text-on-surface text-xs mb-2 uppercase tracking-wider" htmlFor="passwordField">
                      Password <span className="text-error">*</span>
                    </label>
                    <div className="relative group">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px] group-focus-within:text-primary transition-colors pointer-events-none">
                        lock
                      </span>
                      <input
                        id="passwordField"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Create a strong password"
                        className="w-full pl-12 pr-12 py-3.5 bg-surface-container-low border border-outline-variant/40 rounded-xl text-sm text-on-surface placeholder:text-outline/60 focus:outline-none focus:border-primary focus:bg-white focus:shadow-[0_0_0_3px_rgba(18,82,36,0.1)] transition-all"
                      />
                      <button
                        type="button"
                        aria-label="Toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors cursor-pointer p-1"
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          {showPassword ? 'visibility_off' : 'visibility'}
                        </span>
                      </button>
                    </div>
                    {/* Dynamic Strength Meter */}
                    <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden mt-2">
                      <div
                        className={`h-full transition-all duration-300 ${passwordStrength.widthClass}`}
                        id="strength-bar"
                      ></div>
                    </div>
                    <span className={`text-[11px] font-label-sm ${passwordStrength.colorClass}`} id="strength-text">
                      {passwordStrength.text}
                    </span>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block font-bold text-on-surface text-xs mb-2 uppercase tracking-wider" htmlFor="confirmPasswordField">
                      Confirm Password <span className="text-error">*</span>
                    </label>
                    <div className="relative group">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px] group-focus-within:text-primary transition-colors pointer-events-none">
                        lock_reset
                      </span>
                      <input
                        id="confirmPasswordField"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Repeat your password"
                        className="w-full pl-12 pr-12 py-3.5 bg-surface-container-low border border-outline-variant/40 rounded-xl text-sm text-on-surface placeholder:text-outline/60 focus:outline-none focus:border-primary focus:bg-white focus:shadow-[0_0_0_3px_rgba(18,82,36,0.1)] transition-all"
                      />
                      {passwordMatch.icon ? (
                        <span className={`material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[20px] ${
                          passwordMatch.matched ? 'text-secondary' : 'text-error'
                        }`}>
                          {passwordMatch.icon}
                        </span>
                      ) : (
                        <button
                          type="button"
                          aria-label="Toggle confirm password visibility"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors cursor-pointer p-1"
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            {showConfirmPassword ? 'visibility_off' : 'visibility'}
                          </span>
                        </button>
                      )}
                    </div>
                    <span className={`text-[11px] font-label-sm ${passwordMatch.colorClass} block mt-2`}>
                      {passwordMatch.text}
                    </span>
                  </div>
                </div>

                {/* Submit CTA */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-primary to-[#186a2f] hover:from-[#0d401c] hover:to-primary active:scale-[0.99] shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer text-sm"
                  >
                    {isLoading ? (
                      <>
                        <span className="material-symbols-outlined animate-spin text-[20px]">sync</span>
                        <span>Creating Your Community Account...</span>
                      </>
                    ) : (
                      <>
                        <span>{role === 'farmer' ? 'Register Farm Stand Partner' : 'Create My Free Shopper Account'}</span>
                        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Footer Login Switcher */}
                <div className="pt-4 border-t-0 text-center text-on-surface-variant text-xs">
                  Already have a MarketLink account?
                  <button
                    type="button"
                    onClick={() => onNavigate('login')}
                    className="font-bold text-primary hover:underline ml-1 cursor-pointer"
                  >
                    Sign In to Your Stand →
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: Rich Community Benefits Panel (approx 38%) */}
          <div className="lg:col-span-5 xl:col-span-4 bg-primary text-on-primary relative overflow-hidden p-space-md sm:p-space-lg lg:p-space-xl flex flex-col justify-between">
            {/* Ambient Decorative Foliage Gradient & Pattern */}
            <div className="absolute inset-0 bg-gradient-to-b from-primary via-primary-container to-primary pointer-events-none opacity-95"></div>
            <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-secondary-fixed/10 blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-tertiary-fixed/10 blur-3xl pointer-events-none"></div>

            {/* Inner Content Stack */}
            <div className="relative z-10 space-y-space-lg">
              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 px-space-sm py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm shadow-sm text-xs font-bold">
                <span className="material-symbols-outlined text-[16px]">local_florist</span>
                <span>{role === 'farmer' ? 'Why Partner as a Grower?' : 'Why Register as a Neighbor?'}</span>
              </div>

              {/* Benefits List */}
              <div className="space-y-space-md">
                <div className="flex items-start gap-space-sm">
                  <div className="w-10 h-10 rounded-xl bg-primary-fixed-dim/20 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-secondary-fixed text-[22px]">alarm_on</span>
                  </div>
                  <div>
                    <h3 className="font-headline-sm text-on-primary text-base font-semibold">
                      Guaranteed Dawn Freshness
                    </h3>
                    <p className="font-body-sm text-primary-fixed-dim text-xs mt-0.5 leading-relaxed">
                      Lock in rare heirloom varieties, fresh curd cheeses, and warm sourdough loaves before they sell out at the 8:00 AM market rush.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-space-sm">
                  <div className="w-10 h-10 rounded-xl bg-primary-fixed-dim/20 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-secondary-fixed text-[22px]">payments</span>
                  </div>
                  <div>
                    <h3 className="font-headline-sm text-on-primary text-base font-semibold">
                      Zero Upfront Prepayment
                    </h3>
                    <p className="font-body-sm text-primary-fixed-dim text-xs mt-0.5 leading-relaxed">
                      Reserve with peace of mind. Inspect your harvest at the wooden stall before paying your grower in person (Cash, Card, SNAP/EBT).
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-space-sm">
                  <div className="w-10 h-10 rounded-xl bg-primary-fixed-dim/20 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-secondary-fixed text-[22px]">volunteer_activism</span>
                  </div>
                  <div>
                    <h3 className="font-headline-sm text-on-primary text-base font-semibold">
                      Support 42+ Farm Families
                    </h3>
                    <p className="font-body-sm text-primary-fixed-dim text-xs mt-0.5 leading-relaxed">
                      100% of stall sales go directly to regional growers within 50 miles of your doorstep. No middlemen taking crop cuts.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-space-sm">
                  <div className="w-10 h-10 rounded-xl bg-primary-fixed-dim/20 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-secondary-fixed text-[22px]">currency_exchange</span>
                  </div>
                  <div>
                    <h3 className="font-headline-sm text-on-primary text-base font-semibold">
                      Double Up Food Bucks Friendly
                    </h3>
                    <p className="font-body-sm text-primary-fixed-dim text-xs mt-0.5 leading-relaxed">
                      Seamless token matching at Booth #1 for Oregon Trail Card &amp; SNAP holders on every registered weekend harvest.
                    </p>
                  </div>
                </div>
              </div>

              {/* Patron Quote Card */}
              <div className="bg-primary-container/80 rounded-xl p-space-md text-on-primary shadow-sm relative overflow-hidden backdrop-blur-md border border-white/10">
                <div className="flex items-center gap-1 text-tertiary-fixed mb-space-xs">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className="material-symbols-outlined text-[18px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star
                    </span>
                  ))}
                </div>
                <p className="font-headline-sm text-on-primary text-xs font-normal italic leading-relaxed">
                  "Creating an account took 30 seconds and made our Saturday mornings effortless. We never miss Martha's Brandywine tomatoes now!"
                </p>
                <div className="mt-space-sm flex items-center gap-space-xs">
                  <div className="w-7 h-7 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center font-label-sm font-bold text-xs">
                    DM
                  </div>
                  <div>
                    <p className="font-label-sm text-on-primary text-xs font-bold">David &amp; Maya S.</p>
                    <p className="font-body-sm text-primary-fixed-dim text-[11px]">Downtown Pioneer Pavilion Shoppers</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust Badges Strip Footer in Side Panel */}
            <div className="relative z-10 pt-space-lg mt-space-lg flex items-center justify-between font-label-sm text-primary-fixed text-[11px] uppercase tracking-wider border-t border-primary-fixed/20">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">eco</span>
                Zero Subscriptions
              </span>
              <span>•</span>
              <span>No Markups</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">nature_people</span>
                Community Owned
              </span>
            </div>
          </div>
        </div>

        {/* Quick Assistance Micro-Banner */}
        <div className="mt-space-lg bg-surface-container-low rounded-xl p-space-md flex flex-col sm:flex-row items-center justify-between gap-space-md text-on-surface border border-outline-variant/30">
          <div className="flex items-center gap-space-sm">
            <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-primary shrink-0">
              <span className="material-symbols-outlined text-[22px]">contact_support</span>
            </div>
            <div>
              <p className="font-headline-sm text-sm sm:text-base text-on-surface font-semibold">
                Need help choosing your pickup market or stall reservation?
              </p>
              <p className="font-body-sm text-on-surface-variant text-xs mt-0.5">
                Our community volunteer coordinators are ready to help via the corner assistant chat bubble.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-space-sm">
            <button
              type="button"
              onClick={() => onNavigate('markets')}
              className="font-label-sm text-primary hover:underline flex items-center gap-1 whitespace-nowrap text-xs font-bold cursor-pointer"
            >
              <span>Read Pickup Guidelines</span>
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Terms & Trust Guidelines Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-gutter bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-outline-variant/40 flex flex-col max-h-[85vh]">
            <div className="bg-primary px-space-lg py-space-md text-on-primary flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-[24px]">verified</span>
                <h3 className="font-headline-sm text-on-primary text-lg">Terms of Harvest &amp; Trust Guidelines</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowTermsModal(false)}
                className="text-on-primary/80 hover:text-on-primary cursor-pointer p-1"
                aria-label="Close"
              >
                <span className="material-symbols-outlined text-[22px]">close</span>
              </button>
            </div>
            <div className="p-space-lg overflow-y-auto space-y-space-md text-xs font-body-sm text-on-surface-variant">
              <div>
                <h4 className="font-label-md text-on-surface font-bold text-sm mb-1">1. The 100% In-Person Payment Honor System</h4>
                <p className="leading-relaxed">
                  MarketLink never requires credit card numbers or upfront charges to hold items. When you reserve, local farmers pack and set aside their peak dawn harvest specifically for you. We kindly ask shoppers to honor their reservations during scheduled market hours.
                </p>
              </div>
              <div>
                <h4 className="font-label-md text-on-surface font-bold text-sm mb-1">2. Direct Farm Pricing &amp; Zero Middleman Fees</h4>
                <p className="leading-relaxed">
                  Every cent paid at stall pickup goes straight into grower pockets. Accepted methods include cash, cards, SNAP/EBT, and Oregon Trail Double-Up Food Bucks.
                </p>
              </div>
              <div>
                <h4 className="font-label-md text-on-surface font-bold text-sm mb-1">3. Produce Inspection &amp; Satisfaction</h4>
                <p className="leading-relaxed">
                  You are welcome to inspect and admire your produce at the stall before completing payment. In the rare event of weather disruption, stall coordinators will notify your SMS contact number.
                </p>
              </div>
            </div>
            <div className="p-space-md bg-surface-container-low border-t border-outline-variant/30 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setAgreeTerms(true);
                  setShowTermsModal(false);
                }}
                className="px-space-md py-2 bg-primary text-on-primary font-label-md rounded-xl text-xs font-bold hover:bg-primary-container transition-colors cursor-pointer"
              >
                I Understand &amp; Agree
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
