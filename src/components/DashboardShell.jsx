/**
 * DashboardShell - Shared ultra-premium layout component for all dashboards
 * Provides: glassmorphic luxury sidebar, blur top header with notifications popover,
 * animated stat cards with sparklines, status badges, and ambient toast alerts.
 */
import React, { useState } from 'react';

// ─── Gradient top bar for sidebar ───────────────────────────
export function SidebarGradientBar() {
  return (
    <div
      className="h-1.5 w-full flex-shrink-0"
      style={{ background: 'linear-gradient(90deg, #b9f474 0%, #3e6a00 50%, #125224 100%)' }}
    />
  );
}

// ─── Premium Sidebar ─────────────────────────────────────────
export function DashboardSidebar({
  role = 'admin',
  navItems,
  activeTab,
  onSetTab,
  mobileSidebarOpen,
  onCloseMobile,
  onNavigate,
  profileCard,
  footerActions,
}) {
  const roleConfig = {
    admin: {
      accentColor: '#b9f474',
      title: 'Administrator Console',
    },
    farmer: {
      accentColor: '#ffdcc3',
      title: 'Farmer Partner Portal',
    },
    customer: {
      accentColor: '#b0f2b4',
      title: 'Shopper Member Hub',
    },
  };
  const cfg = roleConfig[role] || roleConfig.admin;

  return (
    <aside
      className={`fixed left-0 top-0 h-full w-64 z-50 flex flex-col transition-transform duration-300 lg:translate-x-0 ${
        mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
      style={{
        background: 'linear-gradient(180deg, #092813 0%, #0d3b1c 40%, #125224 100%)',
        boxShadow: '6px 0 32px rgba(0,0,0,0.3)',
      }}
    >
      <SidebarGradientBar />

      {/* Luxury subtle mesh pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage:
            'radial-gradient(circle at 10% 20%, rgba(185, 244, 116, 0.08) 0%, transparent 40%), radial-gradient(circle at 90% 80%, rgba(62, 106, 0, 0.15) 0%, transparent 50%)',
        }}
      />

      <div className="relative flex flex-col h-full overflow-y-auto">
        {/* Brand Logo Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('home')}
            className="flex items-center gap-2.5 cursor-pointer group text-left"
          >
            <div className="w-9 h-9 rounded-full bg-white/10 border border-white/15 flex items-center justify-center group-hover:bg-white/20 transition-all shadow-sm">
              <span className="material-symbols-outlined text-secondary-fixed text-[20px]">eco</span>
            </div>
            <div className="flex flex-col">
              <span className="font-black text-on-primary text-base tracking-tight leading-none">MarketLink</span>
              <span className="text-[9px] text-primary-fixed-dim/70 font-semibold tracking-wide mt-0.5">DIRECT HARVEST</span>
            </div>
          </button>
          {onCloseMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              className="lg:hidden p-1 rounded-lg text-primary-fixed-dim hover:text-white hover:bg-white/10"
              aria-label="Close menu"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          )}
        </div>

        {/* Profile Card */}
        {profileCard && (
          <div
            className="mx-3 mt-3 p-3 rounded-2xl border border-white/12 flex items-center gap-3 relative overflow-hidden group"
            style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(12px)' }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0 shadow-md border border-white/20 group-hover:scale-105 transition-transform"
              style={{ background: cfg.accentColor, color: '#0d3b1c' }}
            >
              {profileCard.initials}
            </div>
            <div className="flex-col flex min-w-0">
              <span className="font-bold text-on-primary text-xs truncate">{profileCard.name}</span>
              <span className="text-primary-fixed-dim text-[10px] truncate">{profileCard.subtitle}</span>
            </div>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="flex flex-col gap-1 px-3 mt-4 flex-1">
          <p className="font-black text-[9px] text-primary-fixed-dim/60 uppercase tracking-widest px-3 mb-1">
            Portal Views
          </p>
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onSetTab(item.id);
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 cursor-pointer text-xs font-bold text-left relative overflow-hidden ${
                  isActive ? 'text-on-surface' : 'text-primary-fixed-dim hover:text-on-primary'
                }`}
                style={
                  isActive
                    ? {
                        background: 'rgba(255,255,255,0.96)',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.2), 0 0 12px rgba(185,244,116,0.3)',
                      }
                    : {}
                }
              >
                {/* Hover backdrop */}
                {!isActive && (
                  <div className="absolute inset-0 rounded-xl bg-white/0 group-hover:bg-white/8 transition-all duration-200" />
                )}
                {/* Left Active Glow bar */}
                {isActive && (
                  <div
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 rounded-r-full"
                    style={{ background: '#125224' }}
                  />
                )}
                <span
                  className={`material-symbols-outlined text-[20px] transition-all duration-200 relative z-10 ${
                    isActive ? 'text-primary' : 'group-hover:scale-110'
                  }`}
                >
                  {item.icon}
                </span>
                <span className="relative z-10">{item.label}</span>
                {item.badge && (
                  <span
                    className={`ml-auto relative z-10 px-2 py-0.5 rounded-full text-[9px] font-black ${
                      isActive ? 'bg-primary text-on-primary' : 'bg-white/15 text-on-primary'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Live Network Health Strip */}
        <div className="mx-3 my-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-[10px] text-primary-fixed-dim">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-secondary-fixed animate-pulse" />
            <span className="font-semibold text-white/90">Market Mesh Active</span>
          </span>
          <span className="text-secondary-fixed font-bold font-mono">14 Markets</span>
        </div>

        {/* Footer Actions */}
        <div className="px-3 pb-4 flex flex-col gap-1 border-t border-white/10 pt-3">
          {footerActions?.map((action, i) => (
            <button
              key={i}
              type="button"
              onClick={action.onClick}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer text-left group ${
                action.danger
                  ? 'text-primary-fixed-dim hover:bg-error/20 hover:text-error'
                  : 'text-primary-fixed-dim hover:bg-white/10 hover:text-on-primary'
              }`}
            >
              <span className="material-symbols-outlined text-[18px] group-hover:scale-110 transition-transform">
                {action.icon}
              </span>
              <span>{action.label}</span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}

// ─── Premium Top Header ────────────────────────────────────
export function DashboardHeader({
  onOpenMobileSidebar,
  breadcrumb,
  headerRight,
  activeMarketName = 'Downtown Saturday Market',
}) {
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const notifications = [
    { id: 1, title: 'Harvest Reservation Placed', desc: 'Order #ML-8920 confirmed for Saturday 9:30 AM', time: '10m ago', icon: 'shopping_bag', color: 'text-primary' },
    { id: 2, title: 'Weather & Setup Advisory', desc: 'Rain guard mandate active for outdoor stalls 1-18', time: '1h ago', icon: 'rainy', color: 'text-blue-500' },
    { id: 3, title: 'Market Pavilion Synchronized', desc: 'Pioneer Pavilion updated inventory allocation', time: '3h ago', icon: 'verified', color: 'text-secondary' },
  ];

  return (
    <header
      className="fixed top-0 left-0 lg:left-64 right-0 h-16 z-40 flex items-center justify-between px-4 sm:px-8"
      style={{
        background: 'rgba(252,249,248,0.92)',
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        borderBottom: '1px solid rgba(192,201,189,0.3)',
        boxShadow: '0 2px 20px rgba(18,82,36,0.06)',
      }}
    >
      {/* Left: hamburger + breadcrumb + active market pill */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          aria-label="Open Sidebar"
          className="lg:hidden w-9 h-9 rounded-xl bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-primary/8 hover:text-primary transition-all cursor-pointer flex-shrink-0"
        >
          <span className="material-symbols-outlined text-[20px]">menu</span>
        </button>

        <nav className="flex items-center gap-1.5 text-xs truncate">
          {breadcrumb.map((crumb, i) => (
            <React.Fragment key={i}>
              {i > 0 && (
                <span className="material-symbols-outlined text-on-surface-variant/40 text-[14px]">chevron_right</span>
              )}
              <span
                className={`truncate ${
                  i === breadcrumb.length - 1
                    ? 'text-primary font-bold bg-primary/8 px-2 py-0.5 rounded-lg border border-primary/10'
                    : 'text-on-surface-variant font-medium hidden sm:inline'
                }`}
              >
                {crumb}
              </span>
            </React.Fragment>
          ))}
        </nav>

        {/* Live Operating Market Pill */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container border border-outline-variant/30 text-[11px] text-on-surface font-bold shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-[#125224] animate-pulse" />
          <span className="text-on-surface-variant font-normal">Active Pavilion:</span>
          <span className="text-primary truncate">{activeMarketName}</span>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        {/* Quick Search Shortcut Pill */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs text-on-surface-variant shadow-2xs">
          <span className="material-symbols-outlined text-[17px] text-primary">search</span>
          <span className="text-on-surface-variant/70 text-[11px]">Quick Search</span>
          <kbd className="px-1.5 py-0.5 rounded bg-surface border border-outline-variant/30 text-[9px] font-mono text-on-surface-variant font-bold">
            ⌘K
          </kbd>
        </div>

        {/* Interactive Notifications Bell & Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setNotificationOpen(!notificationOpen)}
            aria-label="Notifications"
            className="relative w-9 h-9 rounded-xl bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-primary/8 hover:text-primary transition-all cursor-pointer border border-outline-variant/20"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-secondary-fixed text-[#0d3b1c] text-[9px] font-black flex items-center justify-center shadow-xs">
              3
            </span>
          </button>

          {notificationOpen && (
            <div
              className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-[0_16px_48px_rgba(18,82,36,0.16)] border border-outline-variant/25 py-2 z-50 animate-bounce-in"
            >
              <div className="px-4 py-2.5 border-b border-outline-variant/15 flex items-center justify-between">
                <span className="text-xs font-black text-on-surface uppercase tracking-wider">Harvest Notifications</span>
                <span className="text-[10px] text-primary font-bold">Mark all read</span>
              </div>
              <div className="divide-y divide-outline-variant/10 max-h-72 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className="p-3 hover:bg-surface-container/60 transition-colors flex items-start gap-2.5 cursor-pointer">
                    <span className={`material-symbols-outlined text-[18px] ${n.color} mt-0.5`}>{n.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-on-surface truncate">{n.title}</p>
                      <p className="text-[11px] text-on-surface-variant line-clamp-1">{n.desc}</p>
                      <span className="text-[9px] text-on-surface-variant/60 font-semibold">{n.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-2 border-t border-outline-variant/15 text-center">
                <button
                  type="button"
                  onClick={() => setNotificationOpen(false)}
                  className="text-xs font-bold text-primary hover:underline cursor-pointer"
                >
                  Close panel
                </button>
              </div>
            </div>
          )}
        </div>

        {headerRight}
      </div>
    </header>
  );
}

// ─── Premium Stat Card with Sparklines ──────────────────────
export function StatCard({
  icon,
  label,
  value,
  trend,
  trendUp,
  iconBg = 'bg-primary/10',
  iconColor = 'text-primary',
  sparkline = [35, 48, 42, 65, 58, 80, 92],
  footerNote,
}) {
  return (
    <div
      className="bg-white rounded-2xl p-5 flex flex-col justify-between border border-outline-variant/25 hover:-translate-y-1.5 transition-all duration-300 hover:shadow-[0_16px_36px_rgba(18,82,36,0.12)] cursor-default relative overflow-hidden group"
      style={{ boxShadow: '0 2px 14px rgba(18,82,36,0.05)' }}
    >
      {/* Decorative ambient radial sheen */}
      <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-br from-primary/6 to-transparent rounded-full -mr-8 -mt-8 pointer-events-none group-hover:scale-125 transition-transform duration-500" />

      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="font-black text-[10px] uppercase tracking-widest text-on-surface-variant">
            {label}
          </span>
          <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform`}>
            <span className={`material-symbols-outlined text-[20px] ${iconColor}`}>{icon}</span>
          </div>
        </div>
        <span className="font-black text-on-surface text-3xl leading-none">{value}</span>
      </div>

      <div className="mt-4 pt-3 border-t border-outline-variant/15 flex items-center justify-between gap-2">
        {trend ? (
          <span
            className={`font-bold text-xs flex items-center gap-1 px-2 py-0.5 rounded-full ${
              trendUp ? 'bg-secondary/10 text-secondary' : 'bg-error/10 text-error'
            }`}
          >
            <span className="material-symbols-outlined text-[13px]">
              {trendUp ? 'trending_up' : 'trending_down'}
            </span>
            {trend}
          </span>
        ) : footerNote ? (
          <span className="text-[11px] text-on-surface-variant truncate">{footerNote}</span>
        ) : (
          <span className="text-[11px] text-on-surface-variant font-medium">Real-time sync</span>
        )}

        {/* Dynamic Mini Sparkline Bars */}
        <div className="flex items-end gap-1 h-5 ml-auto">
          {sparkline.map((h, i) => (
            <div
              key={i}
              className="w-1.5 rounded-full transition-all duration-300 group-hover:opacity-90"
              style={{
                height: `${Math.max(18, Math.min(100, h))}%`,
                background:
                  i === sparkline.length - 1
                    ? '#125224'
                    : i === sparkline.length - 2
                    ? '#3e6a00'
                    : 'rgba(18,82,36,0.22)',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Premium Toast ──────────────────────────────────────────
export function DashboardToast({ message, onClose }) {
  if (!message) return null;
  return (
    <div
      className="fixed bottom-6 right-6 z-[70] flex items-center gap-3 px-5 py-3.5 rounded-2xl font-bold text-sm animate-bounce-in max-w-sm border border-white/20"
      style={{
        background: 'linear-gradient(135deg, #092813, #125224)',
        color: 'white',
        boxShadow: '0 16px 48px rgba(18,82,36,0.4), 0 4px 14px rgba(0,0,0,0.2)',
        backdropFilter: 'blur(16px)',
      }}
    >
      <div className="w-7 h-7 rounded-xl bg-secondary-fixed/20 border border-secondary-fixed/30 flex items-center justify-center flex-shrink-0">
        <span className="material-symbols-outlined text-secondary-fixed text-[16px]">check_circle</span>
      </div>
      <span className="flex-1 leading-snug">{message}</span>
      <button
        onClick={onClose}
        className="w-6 h-6 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center flex-shrink-0 cursor-pointer transition-all"
      >
        <span className="material-symbols-outlined text-[14px]">close</span>
      </button>
    </div>
  );
}

// ─── Section Header ─────────────────────────────────────────
export function SectionHeader({ eyebrow, title, description, eyebrowIcon, action }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
      <div>
        {eyebrow && (
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/8 border border-primary/15 font-black text-primary uppercase tracking-widest text-[10px] mb-2">
            {eyebrowIcon && <span className="material-symbols-outlined text-[13px]">{eyebrowIcon}</span>}
            {eyebrow}
          </span>
        )}
        <h2 className="font-bold text-on-surface text-xl leading-tight">{title}</h2>
        {description && <p className="text-on-surface-variant text-sm mt-0.5">{description}</p>}
      </div>
      {action}
    </div>
  );
}

// ─── Status Badge ────────────────────────────────────────────
export function StatusBadge({ status }) {
  const map = {
    'Placed': { bg: 'bg-[#e0f2fe]', text: 'text-[#0369a1]', border: 'border-blue-200/50', icon: 'schedule' },
    'Accepted': { bg: 'bg-[#ffedd5]', text: 'text-[#c2410c]', border: 'border-amber-200/50', icon: 'check' },
    'Ready for Pickup': { bg: 'bg-[#ecfccb]', text: 'text-[#3f6212]', border: 'border-lime-300/50', icon: 'local_shipping' },
    'Collected / Paid': { bg: 'bg-[#dcfce7]', text: 'text-[#15803d]', border: 'border-emerald-200/50', icon: 'task_alt' },
    'Completed': { bg: 'bg-[#dcfce7]', text: 'text-[#15803d]', border: 'border-emerald-200/50', icon: 'task_alt' },
    'Pending Stall Pack': { bg: 'bg-[#fef9c3]', text: 'text-[#854d0e]', border: 'border-yellow-200/50', icon: 'inventory_2' },
    'Cancelled': { bg: 'bg-[#fee2e2]', text: 'text-[#b91c1c]', border: 'border-red-200/50', icon: 'cancel' },
    'Low Stock': { bg: 'bg-[#ffedd5]', text: 'text-[#c2410c]', border: 'border-amber-200/50', icon: 'warning' },
    'Sold Out': { bg: 'bg-[#fee2e2]', text: 'text-[#b91c1c]', border: 'border-red-200/50', icon: 'block' },
    'Approved': { bg: 'bg-primary/8', text: 'text-primary', border: 'border-primary/15', icon: 'verified' },
    'Pending': { bg: 'bg-[#fef9c3]', text: 'text-[#854d0e]', border: 'border-yellow-200/50', icon: 'pending' },
    'Active': { bg: 'bg-primary/8', text: 'text-primary', border: 'border-primary/15', icon: 'radio_button_checked' },
    'Inactive': { bg: 'bg-surface-container', text: 'text-on-surface-variant', border: 'border-outline-variant/30', icon: 'radio_button_unchecked' },
  };
  const cfg = map[status] || { bg: 'bg-surface-container', text: 'text-on-surface-variant', border: 'border-outline-variant/30', icon: 'info' };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-bold ${cfg.bg} ${cfg.text} ${cfg.border} shadow-2xs`}>
      <span className="material-symbols-outlined text-[12px]">{cfg.icon}</span>
      {status}
    </span>
  );
}

// ─── Dashboard Ticker Banner ────────────────────────────────
export function DashboardTickerBanner({ text, badge = 'LIVE BROADCAST', icon = 'campaign' }) {
  return (
    <div className="w-full bg-gradient-to-r from-[#0d3b1c] via-[#125224] to-[#2e6b3a] text-white py-2 px-4 rounded-2xl flex items-center justify-between gap-3 shadow-sm border border-white/10 text-xs">
      <div className="flex items-center gap-2 truncate">
        <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-[#0d3b1c] text-[9px] font-black uppercase tracking-wider flex-shrink-0">
          {badge}
        </span>
        <span className="material-symbols-outlined text-secondary-fixed text-[16px] flex-shrink-0">{icon}</span>
        <span className="truncate font-medium">{text}</span>
      </div>
      <span className="text-[10px] text-primary-fixed-dim/80 font-mono hidden sm:inline flex-shrink-0">
        Updated {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </span>
    </div>
  );
}
