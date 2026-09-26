import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

const MODES = {
  login: {
    label: 'Log In',
    icon: 'person',
    color: 'text-primary',
    bg: 'bg-primary/8',
    activeBorder: 'border-primary',
  },
  register: {
    label: 'Join Free',
    icon: 'person_add',
    color: 'text-secondary',
    bg: 'bg-secondary/8',
    activeBorder: 'border-secondary',
  },
  farmer: {
    label: 'Farmer Portal',
    icon: 'agriculture',
    color: 'text-tertiary',
    bg: 'bg-tertiary/8',
    activeBorder: 'border-tertiary',
  },
};

export default function AuthModal({ initialMode = 'login', onClose, onLoginSuccess }) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [farmName, setFarmName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const firstInputRef = useRef(null);

  useEffect(() => {
    if (firstInputRef.current) firstInputRef.current.focus();
  }, [mode]);

  // Close on ESC
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      let authUser = null;
      if (mode === 'login') {
        const res = await login({ email, password });
        authUser = res.user;
      } else {
        const role = mode === 'farmer' ? 'farmer' : 'customer';
        const res = await register({
          name: name || (mode === 'farmer' ? farmName : 'Community Member'),
          email,
          password,
          password_confirmation: password,
          role,
          stall_name: mode === 'farmer' ? (farmName || `${name}'s Stall`) : null,
        });
        authUser = res.user;
      }

      setIsLoading(false);
      if (onLoginSuccess) onLoginSuccess(authUser);
      onClose();
    } catch (err) {
      setIsLoading(false);
      setErrorMessage(err.message || 'Authentication failed. Please verify your details.');
    }
  };

  const modeData = MODES[mode];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(12px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="relative bg-white rounded-3xl w-full max-w-[440px] overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.25)] animate-bounce-in"
        style={{ border: '1px solid rgba(192,201,189,0.2)' }}
      >
        {/* Top gradient accent */}
        <div
          className="h-1.5 w-full"
          style={{ background: 'linear-gradient(90deg, #125224, #3e6a00, #b9f474, #914d00)' }}
        />

        {/* Header */}
        <div
          className="relative px-7 pt-6 pb-5 overflow-hidden"
          style={{ background: 'linear-gradient(135deg, rgba(18,82,36,0.04), rgba(62,106,0,0.03))' }}
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className={`w-8 h-8 rounded-xl ${modeData.bg} flex items-center justify-center`}>
                  <span className={`material-symbols-outlined text-[18px] ${modeData.color}`}>{modeData.icon}</span>
                </div>
                <span className="font-black text-on-surface text-lg">
                  {mode === 'farmer' ? 'Farmer Partner Portal' : mode === 'register' ? 'Join MarketLink' : 'Welcome Back'}
                </span>
              </div>
              <p className="text-on-surface-variant text-xs mt-1">
                {mode === 'farmer'
                  ? 'List your weekly harvest and connect with local buyers'
                  : mode === 'register'
                  ? 'Reserve fresh produce from local farms near you'
                  : 'Sign in to your community account'}
              </p>
            </div>
            <button
              onClick={onClose}
              aria-label="Close"
              className="w-8 h-8 rounded-xl bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-error-container/30 hover:text-error transition-all cursor-pointer flex-shrink-0 mt-0.5"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>

        {/* Mode Tabs */}
        <div className="flex px-7 gap-1 pb-4 border-b border-outline-variant/15">
          {Object.entries(MODES).map(([key, data]) => (
            <button
              key={key}
              onClick={() => { setMode(key); setErrorMessage(null); }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer border ${
                mode === key
                  ? `${data.bg} ${data.color} ${data.activeBorder}`
                  : 'text-on-surface-variant hover:bg-surface-container border-transparent'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">{data.icon}</span>
              {data.label}
            </button>
          ))}
        </div>

        {/* Form Body */}
        <div className="px-7 py-5">
          {/* Error */}
          {errorMessage && (
            <div className="mb-4 flex items-center gap-3 p-3 rounded-xl bg-error-container/25 border border-error/25 animate-fade-in">
              <div className="w-7 h-7 rounded-full bg-error/15 flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-error text-[16px]">error</span>
              </div>
              <span className="text-on-surface text-xs leading-relaxed">{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Name field */}
            {(mode === 'register' || mode === 'farmer') && (
              <div>
                <label className="block font-bold text-on-surface text-[11px] mb-1.5 uppercase tracking-wider">
                  {mode === 'farmer' ? 'Farm / Stall Name' : 'Full Name'}
                </label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px] group-focus-within:text-primary transition-colors pointer-events-none">
                    {mode === 'farmer' ? 'storefront' : 'person'}
                  </span>
                  <input
                    ref={firstInputRef}
                    type="text"
                    required
                    value={mode === 'farmer' ? farmName : name}
                    onChange={(e) => mode === 'farmer' ? setFarmName(e.target.value) : setName(e.target.value)}
                    placeholder={mode === 'farmer' ? 'e.g. Willow Creek Farm' : 'e.g. Sarah Jenkins'}
                    className="w-full pl-10 pr-4 py-3 bg-surface-container-low border border-outline-variant/40 rounded-xl text-sm text-on-surface placeholder:text-outline/50 focus:outline-none focus:border-primary focus:bg-white focus:shadow-[0_0_0_3px_rgba(18,82,36,0.1)] transition-all"
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block font-bold text-on-surface text-[11px] mb-1.5 uppercase tracking-wider">Email Address</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px] group-focus-within:text-primary transition-colors pointer-events-none">mail</span>
                <input
                  ref={mode === 'login' ? firstInputRef : undefined}
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-surface-container-low border border-outline-variant/40 rounded-xl text-sm text-on-surface placeholder:text-outline/50 focus:outline-none focus:border-primary focus:bg-white focus:shadow-[0_0_0_3px_rgba(18,82,36,0.1)] transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block font-bold text-on-surface text-[11px] mb-1.5 uppercase tracking-wider">Password</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px] group-focus-within:text-primary transition-colors pointer-events-none">lock</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 bg-surface-container-low border border-outline-variant/40 rounded-xl text-sm text-on-surface placeholder:text-outline/50 focus:outline-none focus:border-primary focus:bg-white focus:shadow-[0_0_0_3px_rgba(18,82,36,0.1)] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
            </div>

            {/* Farmer notice */}
            {mode === 'farmer' && (
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-secondary-fixed/20 border border-secondary-fixed/30">
                <span className="material-symbols-outlined text-secondary text-[20px] flex-shrink-0 mt-0.5">eco</span>
                <div className="text-xs">
                  <p className="font-bold text-on-surface mb-0.5">0% commission for 60 days</p>
                  <p className="text-on-surface-variant leading-relaxed">List your weekly harvest, connect with local buyers, and settle in-person at your stall.</p>
                </div>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-1 inline-flex items-center justify-center gap-2.5 font-bold text-sm py-3.5 rounded-xl text-on-primary active:scale-[0.99] cursor-pointer transition-all duration-300 disabled:opacity-60 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(18,82,36,0.3)]"
              style={{
                background: mode === 'farmer'
                  ? 'linear-gradient(135deg, #914d00, #6e3900)'
                  : mode === 'register'
                  ? 'linear-gradient(135deg, #3e6a00, #125224)'
                  : 'linear-gradient(135deg, #125224, #2e6b3a)',
              }}
            >
              {isLoading ? (
                <>
                  <span className="material-symbols-outlined text-[18px] animate-spin">sync</span>
                  <span>Connecting...</span>
                </>
              ) : mode === 'farmer' ? (
                <>
                  <span className="material-symbols-outlined text-[18px]">agriculture</span>
                  <span>Submit Farmer Application</span>
                </>
              ) : mode === 'register' ? (
                <>
                  <span className="material-symbols-outlined text-[18px]">person_add</span>
                  <span>Create Free Account</span>
                </>
              ) : (
                <>
                  <span>Sign In to MarketLink</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </>
              )}
            </button>
          </form>

          {/* Footer note */}
          <div className="mt-5 pt-4 border-t border-outline-variant/15 flex items-center justify-center gap-1.5 text-xs text-on-surface-variant">
            <span className="material-symbols-outlined text-primary text-[14px]">lock</span>
            <span>Secure portal &bull; No online payments ever required</span>
          </div>
        </div>
      </div>
    </div>
  );
}
