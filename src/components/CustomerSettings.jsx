import React, { useState } from 'react';

export default function CustomerSettings({ onNavigate, showToast }) {
  // Basic Info Form State
  const [basicInfo, setBasicInfo] = useState({
    fullName: 'Elena Rostova',
    email: 'elena.rostova@gmail.com',
    phone: '(503) 555-0144',
    address: '1420 SW Park Ave, Apt 4B',
    city: 'Portland',
    state: 'OR',
    zip: '97201',
    preferredMarket: 'Pioneer Pavilion Heritage Market'
  });

  // Notification Preferences State
  const [notifications, setNotifications] = useState({
    emailOrderConfirm: true,
    emailReadyPickup: true,
    emailWeeklyHarvestAlerts: false,
    inAppOrderConfirm: true,
    inAppReadyPickup: true,
    inAppCutoffReminder: true
  });

  // Password State
  const [passwordState, setPasswordState] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Shared Family Members State
  const [familyMembers, setFamilyMembers] = useState([
    {
      id: 1,
      name: 'Alexander Rostova',
      email: 'alex.rostova@gmail.com',
      relation: 'Spouse',
      role: 'Authorized for Stall Pickup'
    },
    {
      id: 2,
      name: 'Mila Rostova',
      email: 'mila.r@reed.edu',
      relation: 'Daughter',
      role: 'Authorized for Stall Pickup'
    }
  ]);

  // Invite Family Member Modal State
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [newInvite, setNewInvite] = useState({ name: '', email: '', relation: 'Family Member' });

  // Handle Save
  const handleSaveAll = (e) => {
    e.preventDefault();
    if (showToast) {
      showToast('✅ Profile, notifications, and settings saved successfully!');
    }
  };

  // Handle Add Family Member
  const handleInviteSubmit = (e) => {
    e.preventDefault();
    if (!newInvite.name || !newInvite.email) return;

    setFamilyMembers(prev => [
      ...prev,
      {
        id: Date.now(),
        name: newInvite.name,
        email: newInvite.email,
        relation: newInvite.relation,
        role: 'Authorized for Stall Pickup'
      }
    ]);
    setNewInvite({ name: '', email: '', relation: 'Family Member' });
    setInviteModalOpen(false);
    if (showToast) {
      showToast(`✉️ Invitation sent to ${newInvite.email}`);
    }
  };

  const handleRemoveFamily = (id, name) => {
    setFamilyMembers(prev => prev.filter(m => m.id !== id));
    if (showToast) {
      showToast(`Removed ${name} from shared account pickup.`);
    }
  };

  return (
    <div className="w-full space-y-6 animate-fade-in pb-24">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-outline-variant/40 pb-5">
        <div>
          <h1 className="font-headline-md text-2xl sm:text-3xl text-on-surface font-bold tracking-tight">
            Profile & Shopper Settings
          </h1>
          <p className="font-body-md text-sm text-on-surface-variant mt-1">
            Manage your personal contact details, pickup authorizations, notification channels, and security settings.
          </p>
        </div>
      </div>

      <form onSubmit={handleSaveAll} className="space-y-6">
        {/* ======================================================== */}
        {/* SECTION 1: BASIC INFO                                    */}
        {/* ======================================================== */}
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-5 sm:p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-outline-variant/30">
            <div className="w-10 h-10 rounded-xl bg-[#E6F0E1] text-primary flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[20px]">person</span>
            </div>
            <div>
              <h2 className="font-headline-sm text-base sm:text-lg font-bold text-on-surface">
                Basic Shopper Information
              </h2>
              <p className="text-xs text-on-surface-variant">
                Farmers use this name and contact number to confirm reservations at market stalls.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">
                Full Name *
              </label>
              <input
                type="text"
                value={basicInfo.fullName}
                onChange={(e) => setBasicInfo({ ...basicInfo, fullName: e.target.value })}
                className="w-full text-xs p-3 rounded-xl border border-outline-variant focus:outline-none focus:border-primary bg-surface font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">
                Contact Phone Number * (Used for SMS pickup alerts)
              </label>
              <input
                type="tel"
                value={basicInfo.phone}
                onChange={(e) => setBasicInfo({ ...basicInfo, phone: e.target.value })}
                className="w-full text-xs p-3 rounded-xl border border-outline-variant focus:outline-none focus:border-primary bg-surface font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">
                Email Address * (For voucher receipts)
              </label>
              <input
                type="email"
                value={basicInfo.email}
                onChange={(e) => setBasicInfo({ ...basicInfo, email: e.target.value })}
                className="w-full text-xs p-3 rounded-xl border border-outline-variant focus:outline-none focus:border-primary bg-surface font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">
                Primary Neighborhood / Market
              </label>
              <select
                value={basicInfo.preferredMarket}
                onChange={(e) => setBasicInfo({ ...basicInfo, preferredMarket: e.target.value })}
                className="w-full text-xs p-3 rounded-xl border border-outline-variant focus:outline-none focus:border-primary bg-surface font-medium cursor-pointer"
              >
                <option value="Pioneer Pavilion Heritage Market">Pioneer Pavilion Heritage Market</option>
                <option value="Riverside Twilight Market">Riverside Twilight Market</option>
                <option value="Downtown Saturday Market">Downtown Saturday Market</option>
                <option value="River District Saturday">River District Saturday</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-on-surface mb-1">
                Street Address (For local regional grower proximity calculation)
              </label>
              <input
                type="text"
                value={basicInfo.address}
                onChange={(e) => setBasicInfo({ ...basicInfo, address: e.target.value })}
                className="w-full text-xs p-3 rounded-xl border border-outline-variant focus:outline-none focus:border-primary bg-surface font-medium"
              />
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* SECTION 2: NOTIFICATION PREFERENCES                      */}
        {/* ======================================================== */}
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-5 sm:p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-outline-variant/30">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[20px]">notifications_active</span>
            </div>
            <div>
              <h2 className="font-headline-sm text-base sm:text-lg font-bold text-on-surface">
                Notification Preferences
              </h2>
              <p className="text-xs text-on-surface-variant">
                Control how you receive status updates when farmers harvest and stage your produce.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Column A: Email Notifications */}
            <div className="space-y-3.5">
              <h3 className="font-headline-sm text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">mail</span>
                <span>Email Notifications</span>
              </h3>

              <label className="flex items-start gap-3 p-3 rounded-xl bg-surface-container-low/50 hover:bg-surface-container-low transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.emailOrderConfirm}
                  onChange={(e) => setNotifications({ ...notifications, emailOrderConfirm: e.target.checked })}
                  className="mt-0.5 rounded text-primary focus:ring-primary h-4 w-4"
                />
                <div className="text-xs">
                  <span className="font-bold text-on-surface block">Pre-Order Reservation Confirmations</span>
                  <span className="text-on-surface-variant text-[11px]">Receive an immediate digital voucher and stall pickup slip.</span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-xl bg-surface-container-low/50 hover:bg-surface-container-low transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.emailReadyPickup}
                  onChange={(e) => setNotifications({ ...notifications, emailReadyPickup: e.target.checked })}
                  className="mt-0.5 rounded text-primary focus:ring-primary h-4 w-4"
                />
                <div className="text-xs">
                  <span className="font-bold text-on-surface block">"Ready for Pickup" Alerts</span>
                  <span className="text-on-surface-variant text-[11px]">Instant notice when the grower finishes boxing your crate.</span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-xl bg-surface-container-low/50 hover:bg-surface-container-low transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.emailWeeklyHarvestAlerts}
                  onChange={(e) => setNotifications({ ...notifications, emailWeeklyHarvestAlerts: e.target.checked })}
                  className="mt-0.5 rounded text-primary focus:ring-primary h-4 w-4"
                />
                <div className="text-xs">
                  <span className="font-bold text-on-surface block">Weekly Harvest & Restock Alerts</span>
                  <span className="text-on-surface-variant text-[11px]">Notifications when favorite growers post Friday harvest lists.</span>
                </div>
              </label>
            </div>

            {/* Column B: In-App Notifications */}
            <div className="space-y-3.5">
              <h3 className="font-headline-sm text-xs font-bold text-[#F28C28] uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">devices</span>
                <span>In-App & Browser Alerts</span>
              </h3>

              <label className="flex items-start gap-3 p-3 rounded-xl bg-surface-container-low/50 hover:bg-surface-container-low transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.inAppOrderConfirm}
                  onChange={(e) => setNotifications({ ...notifications, inAppOrderConfirm: e.target.checked })}
                  className="mt-0.5 rounded text-primary focus:ring-primary h-4 w-4"
                />
                <div className="text-xs">
                  <span className="font-bold text-on-surface block">Live Status Changes</span>
                  <span className="text-on-surface-variant text-[11px]">In-app notification badge when an order is Accepted or Packaged.</span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-xl bg-surface-container-low/50 hover:bg-surface-container-low transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.inAppReadyPickup}
                  onChange={(e) => setNotifications({ ...notifications, inAppReadyPickup: e.target.checked })}
                  className="mt-0.5 rounded text-primary focus:ring-primary h-4 w-4"
                />
                <div className="text-xs">
                  <span className="font-bold text-on-surface block">Market Morning Wakeup Reminders</span>
                  <span className="text-on-surface-variant text-[11px]">Reminder sent 1 hour prior to your selected pickup time slot.</span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-xl bg-surface-container-low/50 hover:bg-surface-container-low transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.inAppCutoffReminder}
                  onChange={(e) => setNotifications({ ...notifications, inAppCutoffReminder: e.target.checked })}
                  className="mt-0.5 rounded text-primary focus:ring-primary h-4 w-4"
                />
                <div className="text-xs">
                  <span className="font-bold text-on-surface block">Harvest Cutoff Warning</span>
                  <span className="text-on-surface-variant text-[11px]">Alert 2 hours before order modification cutoff closes.</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* SECTION 3: SHARED ACCOUNT ACCESS                         */}
        {/* ======================================================== */}
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-5 sm:p-6 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-outline-variant/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#ecfccb] text-[#3f6212] flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-[20px]">group</span>
              </div>
              <div>
                <h2 className="font-headline-sm text-base sm:text-lg font-bold text-on-surface">
                  Shared Account & Authorized Pickup
                </h2>
                <p className="text-xs text-on-surface-variant">
                  Invite family members or housemates authorized to collect your pre-orders at market stalls.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setInviteModalOpen(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold shadow-sm hover:bg-primary/95 transition-all cursor-pointer self-start sm:self-auto"
            >
              <span className="material-symbols-outlined text-[17px]">person_add</span>
              <span>+ Invite Family Member</span>
            </button>
          </div>

          <div className="space-y-3">
            {familyMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-3.5 rounded-xl bg-surface-container-low/60 border border-outline-variant/30 hover:border-outline-variant transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-headline-sm text-xs font-bold text-on-surface truncate">
                        {member.name}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-surface-container text-on-surface-variant text-[10px] font-bold">
                        {member.relation}
                      </span>
                    </div>
                    <span className="text-[11px] text-on-surface-variant block truncate">
                      {member.email} • <span className="text-primary font-semibold">{member.role}</span>
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveFamily(member.id, member.name)}
                  className="p-1.5 rounded-lg text-on-surface-variant/60 hover:text-error hover:bg-error-container/30 transition-colors cursor-pointer"
                  title="Remove authorized member"
                >
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ======================================================== */}
        {/* SECTION 4: CHANGE PASSWORD                               */}
        {/* ======================================================== */}
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-5 sm:p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-outline-variant/30">
            <div className="w-10 h-10 rounded-xl bg-surface-container text-on-surface flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[20px]">lock</span>
            </div>
            <div>
              <h2 className="font-headline-sm text-base sm:text-lg font-bold text-on-surface">
                Change Password
              </h2>
              <p className="text-xs text-on-surface-variant">
                Ensure your account uses a secure, unique password.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">
                Current Password
              </label>
              <input
                type="password"
                placeholder="••••••••••••"
                value={passwordState.currentPassword}
                onChange={(e) => setPasswordState({ ...passwordState, currentPassword: e.target.value })}
                className="w-full text-xs p-3 rounded-xl border border-outline-variant focus:outline-none focus:border-primary bg-surface"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">
                New Password
              </label>
              <input
                type="password"
                placeholder="Minimum 8 characters"
                value={passwordState.newPassword}
                onChange={(e) => setPasswordState({ ...passwordState, newPassword: e.target.value })}
                className="w-full text-xs p-3 rounded-xl border border-outline-variant focus:outline-none focus:border-primary bg-surface"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                placeholder="Re-enter new password"
                value={passwordState.confirmPassword}
                onChange={(e) => setPasswordState({ ...passwordState, confirmPassword: e.target.value })}
                className="w-full text-xs p-3 rounded-xl border border-outline-variant focus:outline-none focus:border-primary bg-surface"
              />
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* FIXED / STICKY BOTTOM SAVE CHANGES BAR                   */}
        {/* ======================================================== */}
        <div className="sticky bottom-4 z-30 bg-surface-container-lowest/95 backdrop-blur-md rounded-2xl border border-outline-variant/50 p-4 shadow-xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-on-surface-variant">
            <span className="material-symbols-outlined text-primary text-[18px]">verified_user</span>
            <span className="hidden sm:inline">Settings will take effect immediately upon saving.</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate && onNavigate('dashboard')}
              className="px-4 py-2.5 rounded-xl border border-outline hover:bg-surface-container text-xs font-bold text-on-surface transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary/95 text-on-primary text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">save</span>
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      </form>

      {/* ======================================================== */}
      {/* INVITE FAMILY MEMBER MODAL                               */}
      {/* ======================================================== */}
      {inviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-6 shadow-2xl border border-outline-variant/40">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
              <h3 className="font-headline-sm text-base font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">person_add</span>
                <span>Invite Pickup Contact</span>
              </h3>
              <button
                type="button"
                onClick={() => setInviteModalOpen(false)}
                className="p-1 rounded-lg text-on-surface-variant hover:bg-surface-container cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleInviteSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-on-surface mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Alexander Rostova"
                  value={newInvite.name}
                  onChange={(e) => setNewInvite({ ...newInvite, name: e.target.value })}
                  className="w-full text-xs p-3 rounded-xl border border-outline-variant focus:outline-none focus:border-primary bg-surface font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  placeholder="e.g. alex.rostova@gmail.com"
                  value={newInvite.email}
                  onChange={(e) => setNewInvite({ ...newInvite, email: e.target.value })}
                  className="w-full text-xs p-3 rounded-xl border border-outline-variant focus:outline-none focus:border-primary bg-surface font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface mb-1">
                  Relationship
                </label>
                <select
                  value={newInvite.relation}
                  onChange={(e) => setNewInvite({ ...newInvite, relation: e.target.value })}
                  className="w-full text-xs p-3 rounded-xl border border-outline-variant focus:outline-none focus:border-primary bg-surface font-medium cursor-pointer"
                >
                  <option value="Spouse">Spouse / Partner</option>
                  <option value="Family Member">Family Member</option>
                  <option value="Housemate">Housemate</option>
                  <option value="Caregiver">Caregiver / Neighbor</option>
                </select>
              </div>

              <div className="p-3 bg-[#E6F0E1]/70 rounded-xl text-xs text-on-surface">
                <span className="font-bold block text-primary">Authorization Notice:</span>
                <span className="text-[11px] text-on-surface-variant">
                  This person will receive an electronic copy of your pickup QR vouchers and is authorized to collect produce and pay at the stall.
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-outline-variant/30">
                <button
                  type="button"
                  onClick={() => setInviteModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-outline hover:bg-surface-container text-xs font-bold text-on-surface cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-primary hover:bg-primary/95 text-on-primary text-xs font-bold shadow-md cursor-pointer"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
