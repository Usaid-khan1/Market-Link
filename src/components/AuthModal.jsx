import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ initialMode = 'login', onClose, onLoginSuccess }) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState(initialMode); // 'login', 'register', 'farmer'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [farmName, setFarmName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

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
      if (onLoginSuccess) {
        onLoginSuccess(authUser);
      }
      onClose();
    } catch (err) {
      setIsLoading(false);
      setErrorMessage(err.message || 'Authentication failed. Please verify your details.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-gutter bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-outline-variant/40 flex flex-col">
        {/* Header */}
        <div className="bg-primary px-space-lg py-space-md text-on-primary flex items-center justify-between">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-[24px]">
              {mode === 'farmer' ? 'agriculture' : 'person'}
            </span>
            <h3 className="font-headline-sm text-on-primary">
              {mode === 'farmer'
                ? 'Farmer Partner Portal'
                : mode === 'register'
                ? 'Join MarketLink'
                : 'Welcome Back'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-on-primary/80 hover:text-on-primary cursor-pointer"
            aria-label="Close"
          >
            <span className="material-symbols-outlined text-[24px]">close</span>
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-outline-variant/30 bg-surface-container-low text-xs font-label-md">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 py-space-sm text-center transition-colors cursor-pointer ${
              mode === 'login' ? 'bg-surface-container-lowest text-primary font-bold border-b-2 border-primary' : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            Shopper Log In
          </button>
          <button
            onClick={() => setMode('register')}
            className={`flex-1 py-space-sm text-center transition-colors cursor-pointer ${
              mode === 'register' ? 'bg-surface-container-lowest text-primary font-bold border-b-2 border-primary' : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            Register
          </button>
          <button
            onClick={() => setMode('farmer')}
            className={`flex-1 py-space-sm text-center transition-colors cursor-pointer ${
              mode === 'farmer' ? 'bg-surface-container-lowest text-tertiary-container font-bold border-b-2 border-tertiary-container' : 'text-on-surface-variant hover:text-tertiary'
            }`}
          >
            Farmer Stall
          </button>
        </div>

        {/* Form Body */}
        <div className="p-space-lg">
          {submitted ? (
            <div className="text-center py-space-lg">
              <span className="material-symbols-outlined text-[48px] text-primary animate-bounce">
                check_circle
              </span>
              <h4 className="font-headline-sm text-on-surface mt-space-xs">Welcome to MarketLink!</h4>
              <p className="font-body-sm text-on-surface-variant mt-1">
                {mode === 'farmer'
                  ? 'Your stall registration has been submitted. Check your email for pavilion stall assignment.'
                  : 'You are now signed in. Your produce reservations will be saved.'}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-space-md">
              {errorMessage && (
                <div className="p-space-xs rounded-lg bg-error-container/40 border border-error text-xs text-on-surface flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-error text-[16px]">error</span>
                  <span>{errorMessage}</span>
                </div>
              )}
              {(mode === 'register' || mode === 'farmer') && (
                <div>
                  <label className="font-label-sm text-on-surface-variant block mb-1">
                    {mode === 'farmer' ? 'Farm / Stall Name *' : 'Full Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={mode === 'farmer' ? farmName : name}
                    onChange={(e) => mode === 'farmer' ? setFarmName(e.target.value) : setName(e.target.value)}
                    placeholder={mode === 'farmer' ? 'e.g. Willow Creek Farm' : 'e.g. Sarah Jenkins'}
                    className="w-full bg-surface-container-low border border-outline-variant/50 rounded-lg px-space-sm py-space-xs font-body-sm text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>
              )}

              <div>
                <label className="font-label-sm text-on-surface-variant block mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-surface-container-low border border-outline-variant/50 rounded-lg px-space-sm py-space-xs font-body-sm text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="font-label-sm text-on-surface-variant block mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-surface-container-low border border-outline-variant/50 rounded-lg px-space-sm py-space-xs font-body-sm text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              {mode === 'farmer' && (
                <div className="p-space-sm rounded-lg bg-secondary-fixed/30 text-xs text-on-secondary-fixed-variant leading-relaxed">
                  🌱 0% commission on your first 60 days of weekend market drops. We notify local shoppers in your zip code.
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary-container disabled:opacity-60 text-on-primary font-label-md py-space-sm rounded-xl shadow-md transition-all active:scale-95 cursor-pointer mt-space-xs flex items-center justify-center gap-space-xs"
              >
                {isLoading ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-[18px]">sync</span>
                    <span>Connecting...</span>
                  </>
                ) : mode === 'farmer' ? (
                  'Submit Farmer Application'
                ) : mode === 'register' ? (
                  'Create Free Account'
                ) : (
                  'Log In'
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
