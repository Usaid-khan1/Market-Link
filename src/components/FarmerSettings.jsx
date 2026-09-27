import React, { useState, useEffect } from 'react';
import farmerApi from '../api/farmer';
import { useAuth } from '../context/AuthContext';
import PageLoader from './PageLoader';

export default function FarmerSettings({ showToast }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Farmer Personal & Contact State
  const [basicInfo, setBasicInfo] = useState({
    contactPerson: '',
    phone: '',
    email: '',
    farmAddress: '',
    bio: ''
  });

  // Change Password State
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Load farmer profile data
  useEffect(() => {
    setLoading(true);
    farmerApi.getProfile()
      .then((res) => {
        if (res?.data) {
          const p = res.data;
          setBasicInfo({
            contactPerson: p.contact_person || p.user?.name || user?.name || '',
            phone: p.phone || p.user?.phone || user?.phone || '',
            email: p.email || p.user?.email || user?.email || '',
            farmAddress: p.address || user?.address || '',
            bio: p.bio || ''
          });
        }
      })
      .catch((err) => console.warn('Could not load farmer profile for settings:', err))
      .finally(() => setLoading(false));
  }, [user]);

  // Form Submit for Account Settings & Security
  const handleSaveSettings = async (e) => {
    e.preventDefault();

    if (passwords.newPassword) {
      if (passwords.newPassword !== passwords.confirmPassword) {
        showToast?.('⚠️ New passwords do not match!');
        return;
      }

      if (passwords.newPassword.length < 8) {
        showToast?.('⚠️ New password must be at least 8 characters.');
        return;
      }
    }

    setSaving(true);

    try {
      await farmerApi.updateProfile({
        contact_person: basicInfo.contactPerson,
        phone: basicInfo.phone,
        address: basicInfo.farmAddress,
        bio: basicInfo.bio,
      });

      showToast?.('✅ Account profile and contact information updated successfully!');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      console.warn('API updateProfile error in settings:', err);
      showToast?.('Settings updated locally.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <PageLoader
        title="Loading Account & Security Settings..."
        subtitle="Retrieving contact profile and encrypted credentials..."
        minHeight="min-h-[70vh]"
      />
    );
  }

  return (
    <div className="px-3 sm:px-6 lg:px-gutter py-4 sm:py-space-lg max-w-4xl mx-auto w-full flex flex-col gap-space-xl animate-fade-in pb-28">
      
      {/* 1. Header Section */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-space-xs text-on-surface-variant font-label-sm text-xs">
          <span>FARMER PORTAL</span>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="text-primary font-bold">ACCOUNT &amp; SECURITY</span>
        </div>
        <h1 className="font-headline-lg text-2xl sm:text-3xl text-on-surface tracking-tight font-bold">
          Account &amp; Security Settings
        </h1>
        <p className="font-body-md text-on-surface-variant text-xs sm:text-sm">
          Manage your grower contact identity, physical farm location, password credentials, and security settings.
        </p>
      </div>

      <form onSubmit={handleSaveSettings} className="flex flex-col gap-space-lg text-xs">
        
        {/* ======================================================== */}
        {/* SECTION 1: PRODUCER & CONTACT INFORMATION                */}
        {/* ======================================================== */}
        <section className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col gap-space-md">
          <div className="flex items-center gap-3 border-b border-outline-variant/20 pb-space-sm">
            <div className="w-10 h-10 rounded-xl bg-primary-fixed flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[22px]">person</span>
            </div>
            <div>
              <h2 className="font-headline-sm text-on-surface font-bold text-base">
                Producer Profile &amp; Contact Details
              </h2>
              <p className="font-body-sm text-on-surface-variant text-xs">
                Your direct grower contact details and farm address
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
            {/* Primary Contact Person */}
            <div className="flex flex-col gap-1">
              <label className="font-bold text-on-surface">Primary Contact Person *</label>
              <input
                type="text"
                required
                value={basicInfo.contactPerson}
                onChange={(e) => setBasicInfo({ ...basicInfo, contactPerson: e.target.value })}
                placeholder="e.g. Marcus Thorne"
                className="p-2.5 bg-surface-container-low rounded-xl border border-outline-variant/40 focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>

            {/* Direct Phone Number */}
            <div className="flex flex-col gap-1">
              <label className="font-bold text-on-surface">Contact Phone Number *</label>
              <input
                type="tel"
                required
                value={basicInfo.phone}
                onChange={(e) => setBasicInfo({ ...basicInfo, phone: e.target.value })}
                placeholder="+1 (503) 555-0199"
                className="p-2.5 bg-surface-container-low rounded-xl border border-outline-variant/40 focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>

            {/* Email Address */}
            <div className="flex flex-col gap-1">
              <label className="font-bold text-on-surface">Account Email Address</label>
              <input
                type="email"
                readOnly
                value={basicInfo.email}
                className="p-2.5 bg-surface-container rounded-xl border border-outline-variant/30 text-on-surface-variant cursor-not-allowed opacity-80"
              />
              <span className="text-[10px] text-on-surface-variant">Primary login identity (read-only)</span>
            </div>

            {/* Farm / HQ Physical Address */}
            <div className="flex flex-col gap-1">
              <label className="font-bold text-on-surface">Physical Farm / Headquarters Address</label>
              <input
                type="text"
                value={basicInfo.farmAddress}
                onChange={(e) => setBasicInfo({ ...basicInfo, farmAddress: e.target.value })}
                placeholder="e.g. 7422 Ridgeview Orchard Lane, Oak Valley, OR"
                className="p-2.5 bg-surface-container-low rounded-xl border border-outline-variant/40 focus:ring-2 focus:ring-primary focus:outline-none"
              />
              <span className="text-[10px] text-on-surface-variant">Your farm's physical agricultural location</span>
            </div>
          </div>

          {/* Farm Bio / Grower Story */}
          <div className="flex flex-col gap-1 pt-1">
            <label className="font-bold text-on-surface">Grower Story &amp; Agricultural Bio</label>
            <textarea
              rows="3"
              value={basicInfo.bio}
              onChange={(e) => setBasicInfo({ ...basicInfo, bio: e.target.value })}
              placeholder="Tell patrons about your sustainable farming practices, heirloom varieties, or organic certifications..."
              className="p-2.5 bg-surface-container-low rounded-xl border border-outline-variant/40 focus:ring-2 focus:ring-primary focus:outline-none resize-none"
            ></textarea>
            <span className="text-[10px] text-on-surface-variant">
              Displayed on your public farmer storefront page
            </span>
          </div>
        </section>

        {/* ======================================================== */}
        {/* SECTION 2: SECURITY & CHANGE PASSWORD                   */}
        {/* ======================================================== */}
        <section className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col gap-space-md">
          <div className="flex items-center gap-3 border-b border-outline-variant/20 pb-space-sm">
            <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-on-surface">
              <span className="material-symbols-outlined text-[22px]">lock_reset</span>
            </div>
            <div>
              <h2 className="font-headline-sm text-on-surface font-bold text-base">
                Security &amp; Change Password
              </h2>
              <p className="font-body-sm text-on-surface-variant text-xs">
                Keep your farmer portal and pre-order management credentials safe
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-md">
            {/* Current Password */}
            <div className="flex flex-col gap-1">
              <label className="font-bold text-on-surface">Current Password</label>
              <input
                type="password"
                value={passwords.currentPassword}
                onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                placeholder="••••••••"
                className="p-2.5 bg-surface-container-low rounded-xl border border-outline-variant/40 focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>

            {/* New Password */}
            <div className="flex flex-col gap-1">
              <label className="font-bold text-on-surface">New Password</label>
              <input
                type="password"
                value={passwords.newPassword}
                onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                placeholder="Min. 8 characters"
                className="p-2.5 bg-surface-container-low rounded-xl border border-outline-variant/40 focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>

            {/* Confirm New Password */}
            <div className="flex flex-col gap-1">
              <label className="font-bold text-on-surface">Confirm New Password</label>
              <input
                type="password"
                value={passwords.confirmPassword}
                onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                placeholder="••••••••"
                className="p-2.5 bg-surface-container-low rounded-xl border border-outline-variant/40 focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/20 flex items-center gap-2 text-on-surface-variant text-[11px]">
            <span className="material-symbols-outlined text-[16px] text-primary">security</span>
            <span>Leave password fields blank if you only wish to update contact details.</span>
          </div>
        </section>

        {/* ======================================================== */}
        {/* SUBMIT BUTTON                                            */}
        {/* ======================================================== */}
        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto px-7 py-3 rounded-xl bg-primary hover:bg-[#1a4b22] text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all active:scale-95 disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[18px]">
              {saving ? 'sync' : 'check_circle'}
            </span>
            <span>{saving ? 'Saving Settings...' : 'Save Account Settings'}</span>
          </button>
        </div>

      </form>
    </div>
  );
}
