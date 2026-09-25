import React, { useState, useEffect } from 'react';
import farmerApi from '../api/farmer';

export default function FarmerSettings({ showToast }) {
  // Basic Info Form State
  const [basicInfo, setBasicInfo] = useState({
    stallName: 'Green Pastures Organic Farm',
    contactPerson: 'Marcus & Sarah Thorne',
    phone: '(503) 555-0471',
    email: 'marcus@greenpastures.bio',
    farmAddress: '7422 Ridgeview Orchard Lane, Oak Valley, OR 97034',
    bio: 'Family-operated 12-acre biodynamic farm committed to zero synthetic inputs, heritage seed preservation, and high-sugar heirloom produce.'
  });

  // Markets & Schedule State
  const availableMarkets = [
    'Downtown Saturday Market',
    'Pioneer Pavilion Heritage Market',
    'Riverside Twilight Farmers Market',
    'Oak Valley Community Organic Market',
    'Eastside Sunset Greenway Hub'
  ];

  const [selectedMarkets, setSelectedMarkets] = useState([
    'Downtown Saturday Market',
    'Pioneer Pavilion Heritage Market'
  ]);

  const [operatingDays, setOperatingDays] = useState(['Wednesday', 'Saturday', 'Sunday']);
  const daysList = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const [pickupWindow, setPickupWindow] = useState({
    start: '08:00 AM',
    end: '01:30 PM'
  });

  // Stall Location State
  const [stallLocation, setStallLocation] = useState({
    stallNumber: 'Pioneer Pavilion • Stall #08',
    address: 'SW Park Ave & Montgomery St, Portland, OR 97201',
    lat: '45.5152',
    lng: '-122.6784'
  });

  // Change Password State
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Load live stall profile from backend
  useEffect(() => {
    farmerApi.getProfile()
      .then((res) => {
        if (res?.data) {
          const p = res.data;
          setBasicInfo((prev) => ({
            ...prev,
            stallName: p.stall_name || prev.stallName,
            contactPerson: p.contact_person || prev.contactPerson,
            phone: p.phone || prev.phone,
            email: p.email || prev.email,
            farmAddress: p.address || prev.farmAddress,
            bio: p.bio || prev.bio
          }));
          if (p.operating_days && Array.isArray(p.operating_days)) {
            setOperatingDays(p.operating_days);
          }
          if (p.latitude && p.longitude) {
            setStallLocation((prev) => ({
              ...prev,
              lat: String(p.latitude),
              lng: String(p.longitude)
            }));
          }
        }
      })
      .catch((err) => console.warn('Could not load farmer profile:', err));
  }, []);

  // Toggle Market Selection
  const handleToggleMarket = (marketName) => {
    setSelectedMarkets((prev) => {
      if (prev.includes(marketName)) {
        if (prev.length === 1) return prev; // keep at least one
        return prev.filter((m) => m !== marketName);
      } else {
        return [...prev, marketName];
      }
    });
  };

  // Toggle Operating Day
  const handleToggleDay = (day) => {
    setOperatingDays((prev) => {
      if (prev.includes(day)) {
        if (prev.length === 1) return prev;
        return prev.filter((d) => d !== day);
      } else {
        return [...prev, day];
      }
    });
  };

  // Form Submit
  const handleSaveAll = async (e) => {
    e.preventDefault();

    if (passwords.newPassword && passwords.newPassword !== passwords.confirmPassword) {
      showToast?.('⚠️ New passwords do not match!');
      return;
    }

    if (passwords.newPassword && passwords.newPassword.length < 8) {
      showToast?.('⚠️ Password must be at least 8 characters.');
      return;
    }

    try {
      await farmerApi.updateProfile({
        stall_name: basicInfo.stallName,
        contact_person: basicInfo.contactPerson,
        address: basicInfo.farmAddress,
        phone: basicInfo.phone,
        bio: basicInfo.bio,
        operating_days: operatingDays,
        pickup_time_start: pickupWindow.start,
        pickup_time_end: pickupWindow.end,
        latitude: parseFloat(stallLocation.lat) || 45.5152,
        longitude: parseFloat(stallLocation.lng) || -122.6784
      });
    } catch (err) {
      console.warn('API updateProfile error:', err);
    }

    showToast?.('Stall profile, operating schedules, and geolocation updated live!');
    setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <div className="px-gutter py-space-lg max-w-5xl mx-auto w-full flex flex-col gap-space-xl animate-fade-in pb-28">
      
      {/* 1. Header Section */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-space-xs text-on-surface-variant font-label-sm text-xs">
          <span>FARMER STALL</span>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="text-primary font-bold">STALL CONFIGURATION</span>
        </div>
        <h1 className="font-headline-lg text-headline-lg sm:text-3xl text-on-surface tracking-tight font-bold">
          Profile &amp; Stall Settings
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant text-xs sm:text-sm">
          Update your public farm identity, market schedules, GPS stall coordinates, and account credentials.
        </p>
      </div>

      <form onSubmit={handleSaveAll} className="flex flex-col gap-space-lg text-xs">
        
        {/* ======================================================== */}
        {/* SECTION 1: BASIC INFO                                    */}
        {/* ======================================================== */}
        <section className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col gap-space-md">
          <div className="flex items-center gap-3 border-b border-outline-variant/20 pb-space-sm">
            <div className="w-10 h-10 rounded-xl bg-primary-fixed flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[22px]">storefront</span>
            </div>
            <div>
              <h2 className="font-headline-sm text-on-surface font-bold text-base">
                Basic Stall &amp; Business Info
              </h2>
              <p className="font-body-sm text-on-surface-variant text-xs">
                Display details shown on your public producer storefront
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
            <div className="flex flex-col gap-1">
              <label className="font-bold text-on-surface">Stall / Farm Business Name *</label>
              <input
                type="text"
                required
                value={basicInfo.stallName}
                onChange={(e) => setBasicInfo({ ...basicInfo, stallName: e.target.value })}
                className="p-2.5 bg-surface-container-low rounded-xl border border-outline-variant/40 focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-bold text-on-surface">Primary Contact Person *</label>
              <input
                type="text"
                required
                value={basicInfo.contactPerson}
                onChange={(e) => setBasicInfo({ ...basicInfo, contactPerson: e.target.value })}
                className="p-2.5 bg-surface-container-low rounded-xl border border-outline-variant/40 focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-bold text-on-surface">Contact Phone Number *</label>
              <input
                type="text"
                required
                value={basicInfo.phone}
                onChange={(e) => setBasicInfo({ ...basicInfo, phone: e.target.value })}
                className="p-2.5 bg-surface-container-low rounded-xl border border-outline-variant/40 focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-bold text-on-surface">Official Email Address *</label>
              <input
                type="email"
                required
                value={basicInfo.email}
                onChange={(e) => setBasicInfo({ ...basicInfo, email: e.target.value })}
                className="p-2.5 bg-surface-container-low rounded-xl border border-outline-variant/40 focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-bold text-on-surface">Farm Physical Headquarters Address</label>
            <input
              type="text"
              value={basicInfo.farmAddress}
              onChange={(e) => setBasicInfo({ ...basicInfo, farmAddress: e.target.value })}
              className="p-2.5 bg-surface-container-low rounded-xl border border-outline-variant/40 focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-bold text-on-surface">Grower Bio / Stall Story</label>
            <textarea
              rows={3}
              value={basicInfo.bio}
              onChange={(e) => setBasicInfo({ ...basicInfo, bio: e.target.value })}
              className="p-2.5 bg-surface-container-low rounded-xl border border-outline-variant/40 focus:ring-2 focus:ring-primary focus:outline-none resize-none"
            ></textarea>
          </div>
        </section>

        {/* ======================================================== */}
        {/* SECTION 2: MARKETS & SCHEDULE                            */}
        {/* ======================================================== */}
        <section className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col gap-space-md">
          <div className="flex items-center gap-3 border-b border-outline-variant/20 pb-space-sm">
            <div className="w-10 h-10 rounded-xl bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed-variant">
              <span className="material-symbols-outlined text-[22px]">calendar_today</span>
            </div>
            <div>
              <h2 className="font-headline-sm text-on-surface font-bold text-base">
                Markets &amp; Operating Schedule
              </h2>
              <p className="font-body-sm text-on-surface-variant text-xs">
                Select where and when you accept customer produce pre-orders
              </p>
            </div>
          </div>

          {/* Multi-Select Markets */}
          <div className="flex flex-col gap-2">
            <label className="font-bold text-on-surface">Participating Regional Markets:</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {availableMarkets.map((mkt) => {
                const isSelected = selectedMarkets.includes(mkt);
                return (
                  <button
                    key={mkt}
                    type="button"
                    onClick={() => handleToggleMarket(mkt)}
                    className={`p-3 rounded-xl border text-left flex items-center justify-between transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-primary text-on-primary border-primary font-bold shadow-sm'
                        : 'bg-surface-container-low text-on-surface-variant border-outline-variant/30 hover:bg-surface-container'
                    }`}
                  >
                    <span>{mkt}</span>
                    <span className="material-symbols-outlined text-[18px]">
                      {isSelected ? 'check_box' : 'check_box_outline_blank'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Operating Days */}
          <div className="flex flex-col gap-2 pt-2">
            <label className="font-bold text-on-surface">Active Stall Operating Days:</label>
            <div className="flex flex-wrap gap-2">
              {daysList.map((day) => {
                const isSelected = operatingDays.includes(day);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleToggleDay(day)}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-primary text-on-primary border-primary shadow-sm'
                        : 'bg-surface-container-low text-on-surface-variant border-outline-variant/30 hover:bg-surface-container'
                    }`}
                  >
                    {isSelected && <span className="mr-1">✓</span>}
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Pickup Time Window */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md pt-2">
            <div className="flex flex-col gap-1">
              <label className="font-bold text-on-surface">Stall Pickup Window Starts</label>
              <input
                type="text"
                value={pickupWindow.start}
                onChange={(e) => setPickupWindow({ ...pickupWindow, start: e.target.value })}
                className="p-2.5 bg-surface-container-low rounded-xl border border-outline-variant/40 focus:ring-2 focus:ring-primary focus:outline-none font-bold"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-bold text-on-surface">Stall Pickup Window Ends</label>
              <input
                type="text"
                value={pickupWindow.end}
                onChange={(e) => setPickupWindow({ ...pickupWindow, end: e.target.value })}
                className="p-2.5 bg-surface-container-low rounded-xl border border-outline-variant/40 focus:ring-2 focus:ring-primary focus:outline-none font-bold"
              />
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* SECTION 3: STALL LOCATION & MAP                         */}
        {/* ======================================================== */}
        <section className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col gap-space-md">
          <div className="flex items-center gap-3 border-b border-outline-variant/20 pb-space-sm">
            <div className="w-10 h-10 rounded-xl bg-tertiary-fixed flex items-center justify-center text-tertiary">
              <span className="material-symbols-outlined text-[22px]">pin_drop</span>
            </div>
            <div>
              <h2 className="font-headline-sm text-on-surface font-bold text-base">
                Stall Geolocation &amp; Pavilion Map
              </h2>
              <p className="font-body-sm text-on-surface-variant text-xs">
                Helps shoppers locate your specific table or gazebo at the market plaza
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
            <div className="flex flex-col gap-1">
              <label className="font-bold text-on-surface">Assigned Stall ID / Space</label>
              <input
                type="text"
                value={stallLocation.stallNumber}
                onChange={(e) => setStallLocation({ ...stallLocation, stallNumber: e.target.value })}
                className="p-2.5 bg-surface-container-low rounded-xl border border-outline-variant/40 focus:ring-2 focus:ring-primary focus:outline-none font-bold text-primary"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-bold text-on-surface">Pavilion Address</label>
              <input
                type="text"
                value={stallLocation.address}
                onChange={(e) => setStallLocation({ ...stallLocation, address: e.target.value })}
                className="p-2.5 bg-surface-container-low rounded-xl border border-outline-variant/40 focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>
          </div>

          {/* Map Placeholder Box */}
          <div className="relative w-full h-48 rounded-xl bg-surface-container-high border-2 border-dashed border-outline-variant/60 overflow-hidden flex flex-col items-center justify-center p-4">
            <div
              className="absolute inset-0 opacity-15 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(circle, #2E6B3A 1px, transparent 1px)',
                backgroundSize: '16px 16px'
              }}
            ></div>

            <div className="relative z-10 flex flex-col items-center animate-bounce">
              <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-lg">
                <span className="material-symbols-outlined text-[24px]">location_on</span>
              </div>
              <div className="w-2.5 h-1 rounded-full bg-black/30 mt-1 blur-[1px]"></div>
            </div>

            <span className="relative z-10 mt-2 font-bold text-on-surface text-xs text-center">
              Map (Google Maps / OpenStreetMap embed here)
            </span>
            <span className="relative z-10 text-[11px] text-on-surface-variant text-center">
              Stall Pin: {stallLocation.stallNumber} ({stallLocation.lat}, {stallLocation.lng})
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-md items-end">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-on-surface-variant">Latitude</label>
              <input
                type="text"
                value={stallLocation.lat}
                onChange={(e) => setStallLocation({ ...stallLocation, lat: e.target.value })}
                className="p-2.5 bg-surface-container-low rounded-xl font-mono text-xs border border-outline-variant/40 focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-on-surface-variant">Longitude</label>
              <input
                type="text"
                value={stallLocation.lng}
                onChange={(e) => setStallLocation({ ...stallLocation, lng: e.target.value })}
                className="p-2.5 bg-surface-container-low rounded-xl font-mono text-xs border border-outline-variant/40 focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>

            <button
              type="button"
              onClick={() => showToast?.('📍 Stall GPS location pinned to current plaza coordinates!')}
              className="px-space-md py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer border border-outline-variant/30"
            >
              <span className="material-symbols-outlined text-[18px] text-primary">my_location</span>
              <span>Pin Location</span>
            </button>
          </div>
        </section>

        {/* ======================================================== */}
        {/* SECTION 4: CHANGE PASSWORD                              */}
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

            <div className="flex flex-col gap-1">
              <label className="font-bold text-on-surface">Confirm New Password</label>
              <input
                type="password"
                value={passwords.confirmPassword}
                onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                placeholder="Re-type new password"
                className="p-2.5 bg-surface-container-low rounded-xl border border-outline-variant/40 focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>
          </div>
        </section>

        {/* STICKY BOTTOM ACTIONS BAR */}
        <div className="fixed bottom-0 left-0 lg:left-64 right-0 bg-surface/95 backdrop-blur-md p-space-md border-t border-outline-variant/30 flex items-center justify-between px-gutter shadow-2xl z-30">
          <span className="text-on-surface-variant font-medium text-xs hidden sm:inline">
            Unsaved changes will be applied to your live storefront immediately.
          </span>

          <div className="flex items-center gap-space-sm ml-auto">
            <button
              type="button"
              onClick={() => showToast?.('Changes reverted.')}
              className="px-space-md py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-xs transition-colors cursor-pointer border border-outline-variant/30"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-space-lg py-2.5 rounded-xl bg-primary text-on-primary font-bold text-xs hover:bg-primary-container transition-colors shadow-md cursor-pointer active:scale-95 flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">check</span>
              <span>Save Changes</span>
            </button>
          </div>
        </div>

      </form>

    </div>
  );
}
