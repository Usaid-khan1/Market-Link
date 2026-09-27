import React, { useState, useEffect } from 'react';
import farmerApi from '../api/farmer';
import browseApi from '../api/browse';
import StallLocationPicker from './StallLocationPicker';
import PageLoader from './PageLoader';

export default function FarmerStall({ showToast, onNavigate }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [marketsList, setMarketsList] = useState([]);

  // Form State
  const [stallName, setStallName] = useState('');
  const [stallNumber, setStallNumber] = useState('');
  const [selectedMarketId, setSelectedMarketId] = useState('');
  const [pavilionAddress, setPavilionAddress] = useState('');
  const [operatingDays, setOperatingDays] = useState(['Saturday']);
  const [pickupWindow, setPickupWindow] = useState({
    start: '08:00 AM',
    end: '01:30 PM',
  });
  const [coords, setCoords] = useState({
    lat: '45.515200',
    lng: '-122.678400',
  });

  const daysList = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Fetch available markets & current farmer stall profile
  useEffect(() => {
    // 1. Fetch real markets
    browseApi.getMarkets()
      .then((res) => {
        if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
          setMarketsList(res.data);
          setSelectedMarketId((prev) => {
            if (prev && res.data.some((m) => Number(m.id) === Number(prev))) {
              return Number(prev);
            }
            return Number(res.data[0].id);
          });
        }
      })
      .catch((err) => {
        console.warn('Could not load markets from API, using defaults:', err);
      });

    // 2. Fetch current profile
    farmerApi.getProfile()
      .then((res) => {
        if (res?.data) {
          const p = res.data;
          const hasStall = Boolean(p.stall_name && (p.latitude || p.address));
          setIsRegistered(hasStall);

          if (p.stall_name) setStallName(p.stall_name);
          if (p.stall_number) setStallNumber(p.stall_number);
          if (p.address) setPavilionAddress(p.address);

          if (p.latitude && p.longitude) {
            setCoords({
              lat: String(p.latitude),
              lng: String(p.longitude),
            });
          }

          if (p.market_ids && Array.isArray(p.market_ids) && p.market_ids.length > 0) {
            setSelectedMarketId(Number(p.market_ids[0]));
          }

          if (p.operating_days && Array.isArray(p.operating_days) && p.operating_days.length > 0) {
            setOperatingDays(p.operating_days);
          }

          if (p.pickup_time_start || p.pickup_time_end) {
            setPickupWindow({
              start: p.pickup_time_start || '08:00 AM',
              end: p.pickup_time_end || '01:30 PM',
            });
          }
        }
      })
      .catch((err) => {
        console.warn('Could not load profile for stall:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  // When farmer selects a market from the dropdown
  const handleMarketChange = (marketId) => {
    const mId = Number(marketId);
    setSelectedMarketId(mId);

    const found = marketsList.find((m) => m.id === mId);
    if (found) {
      if (found.address) {
        setPavilionAddress(found.address);
      }
      if (found.latitude && found.longitude) {
        setCoords({
          lat: String(found.latitude),
          lng: String(found.longitude),
        });
      }
      if (found.operating_days) {
        if (Array.isArray(found.operating_days)) {
          setOperatingDays(found.operating_days);
        } else if (typeof found.operating_days === 'string') {
          const splitDays = found.operating_days.split(' ').filter(Boolean);
          if (splitDays.length > 0) setOperatingDays(splitDays);
        }
      }
      showToast?.(`📍 Market selected: ${found.market_name}. Map centered on market plaza!`);
    }
  };

  const handleToggleDay = (day) => {
    setOperatingDays((prev) => {
      if (prev.includes(day)) {
        if (prev.length === 1) return prev; // keep at least 1 day
        return prev.filter((d) => d !== day);
      } else {
        return [...prev, day];
      }
    });
  };

  const handleRegisterOrUpdateStall = async (e) => {
    e.preventDefault();

    if (!stallName.trim()) {
      showToast?.('⚠️ Please enter a stall name.');
      return;
    }

    const latVal = parseFloat(coords.lat) || 45.5152;
    const lngVal = parseFloat(coords.lng) || -122.6784;
    const mId = Number(selectedMarketId);
    const selectedMarket = marketsList.find((m) => Number(m.id) === mId);
    const finalAddress = pavilionAddress.trim() || selectedMarket?.address || 'Farmers Market Plaza';

    setSaving(true);
    try {
      await farmerApi.updateProfile({
        stall_name: stallName.trim(),
        stall_number: stallNumber.trim() || `${stallName.trim()} Stall`,
        address: finalAddress,
        market_ids: [mId],
        operating_days: operatingDays,
        pickup_time_start: pickupWindow.start,
        pickup_time_end: pickupWindow.end,
        latitude: latVal,
        longitude: lngVal,
      });

      const stallPayload = {
        stall_name: stallName.trim(),
        stall_number: stallNumber.trim() || `${stallName.trim()} Stall`,
        address: finalAddress,
        market_id: mId,
        market_name: selectedMarket ? selectedMarket.market_name : 'Farmers Market',
        operating_days: operatingDays,
        pickup_time_start: pickupWindow.start,
        pickup_time_end: pickupWindow.end,
        latitude: latVal,
        longitude: lngVal,
      };

      localStorage.setItem('marketlink_farmer_stall', JSON.stringify(stallPayload));
      window.dispatchEvent(new CustomEvent('marketlink:stall-updated', { detail: stallPayload }));

      setIsRegistered(true);
      showToast?.(
        isRegistered
          ? `✅ Stall details updated in "${selectedMarket?.market_name || 'Market'}"!`
          : `🎉 Stall "${stallName}" registered in ${selectedMarket?.market_name || 'Market'}! Shoppers can now visit your stall on the public map.`
      );
    } catch (err) {
      console.error('Stall register error:', err);
      const serverMsg = err?.response?.data?.message || err?.data?.message || err?.message || 'Error communicating with server';
      showToast?.(`⚠️ Could not save stall: ${serverMsg}`);
    } finally {
      setSaving(false);
    }
  };

  const currentSelectedMarket = marketsList.find((m) => Number(m.id) === Number(selectedMarketId)) || marketsList[0];

  if (loading) {
    return (
      <PageLoader
        title="Loading Stall Configuration..."
        subtitle="Retrieving your host market pavilion, GPS coordinates, and booth details..."
        minHeight="min-h-[70vh]"
      />
    );
  }

  return (
    <div className="px-3 sm:px-6 lg:px-gutter py-4 sm:py-space-lg max-w-5xl mx-auto w-full flex flex-col gap-space-xl animate-fade-in pb-28">
      
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-space-xs text-on-surface-variant font-label-sm text-xs">
            <span>FARMER PORTAL</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-primary font-bold">
              {isRegistered ? 'MY STALL LOCATION' : 'NEW STALL REGISTRATION'}
            </span>
          </div>
          <h1 className="font-headline-lg text-2xl sm:text-3xl text-on-surface tracking-tight font-bold flex items-center gap-2.5">
            {isRegistered ? 'My Stall & Geolocation' : 'Register Your Farm Stall'}
            {isRegistered ? (
              <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                Active Stall
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-xs font-black uppercase tracking-wider">
                Step 1: Onboarding
              </span>
            )}
          </h1>
          <p className="font-body-md text-on-surface-variant text-xs sm:text-sm">
            {isRegistered
              ? 'Keep your booth number, host market, schedule, and map GPS pin coordinates up to date for community shoppers.'
              : 'Add your market stall table or gazebo, select your host market plaza, and pin your exact GPS location on the map.'}
          </p>
        </div>

        {isRegistered && (
          <button
            type="button"
            onClick={() => onNavigate?.('farmer-profile')}
            className="px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high border border-outline-variant/30 text-on-surface font-bold text-xs flex items-center gap-1.5 transition-all self-start sm:self-auto cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px] text-primary">visibility</span>
            <span>View Public Stall Profile</span>
          </button>
        )}
      </div>

      {/* 2. First-time Registration Info Banner (Shown if not yet registered) */}
      {!isRegistered && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#125224]/10 via-[#2E6B3A]/5 to-transparent border border-primary/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center flex-shrink-0 shadow-md">
              <span className="material-symbols-outlined text-[22px]">add_business</span>
            </div>
            <div>
              <h3 className="font-bold text-sm text-on-surface">First-Time Stall Setup</h3>
              <p className="text-xs text-on-surface-variant mt-0.5 leading-relaxed">
                Complete this 1-step form to register your farm stall. Once registered, your stall will automatically appear on shoppers' interactive map with driving directions and pickup pre-orders.
              </p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-xl bg-primary text-white text-xs font-bold whitespace-nowrap self-end sm:self-auto">
            100% Free • No Commission
          </span>
        </div>
      )}

      {/* 3. Main Stall Registration Form */}
      <form onSubmit={handleRegisterOrUpdateStall} className="flex flex-col gap-space-lg text-xs">
        
        {/* ======================================================== */}
        {/* SECTION 1: STALL IDENTITY & MARKET SELECTION            */}
        {/* ======================================================== */}
        <section className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col gap-space-md">
          <div className="flex items-center gap-3 border-b border-outline-variant/20 pb-space-sm">
            <div className="w-10 h-10 rounded-xl bg-primary-fixed flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[22px]">storefront</span>
            </div>
            <div>
              <h2 className="font-headline-sm text-on-surface font-bold text-base">
                Stall Name &amp; Host Market
              </h2>
              <p className="font-body-sm text-on-surface-variant text-xs">
                Select the physical farmers market plaza where you set up your stall
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
            {/* Stall Name */}
            <div className="flex flex-col gap-1">
              <label className="font-bold text-on-surface">Stall / Farm Business Name *</label>
              <input
                type="text"
                required
                value={stallName}
                onChange={(e) => setStallName(e.target.value)}
                placeholder="e.g. Green Valley Organics Stand"
                className="p-2.5 bg-surface-container-low rounded-xl border border-outline-variant/40 focus:ring-2 focus:ring-primary focus:outline-none font-bold"
              />
              <span className="text-[10px] text-on-surface-variant">
                Displayed as your primary stall sign in the marketplace directory
              </span>
            </div>

            {/* Assigned Stall ID / Space */}
            <div className="flex flex-col gap-1">
              <label className="font-bold text-on-surface">Assigned Stall ID / Booth Space</label>
              <input
                type="text"
                value={stallNumber}
                onChange={(e) => setStallNumber(e.target.value)}
                placeholder="e.g. Stall #12, East Gazebo Bay"
                className="p-2.5 bg-surface-container-low rounded-xl border border-outline-variant/40 focus:ring-2 focus:ring-primary focus:outline-none font-bold text-primary"
              />
              <span className="text-[10px] text-on-surface-variant">
                Helps shoppers locate your specific table or booth inside the market
              </span>
            </div>
          </div>

          {/* Market Selection Dropdown */}
          <div className="flex flex-col gap-1.5 pt-1">
            <label className="font-bold text-on-surface flex items-center justify-between">
              <span>Host Farmers Market Plaza *</span>
              <span className="text-[10px] text-primary font-normal">
                Stall will be registered inside this market
              </span>
            </label>
            <div className="relative">
              <select
                value={selectedMarketId}
                onChange={(e) => handleMarketChange(e.target.value)}
                className="w-full p-3 bg-surface-container-low rounded-xl border border-outline-variant/40 focus:ring-2 focus:ring-primary focus:outline-none text-xs font-bold text-on-surface appearance-none pr-10 cursor-pointer"
              >
                {marketsList.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.market_name} — {m.address} ({m.timings || 'Weekend Morning'})
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined text-[20px] text-on-surface-variant absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                expand_more
              </span>
            </div>

            {/* Selected Market Info Card */}
            {currentSelectedMarket && (
              <div className="p-3 bg-surface-container rounded-xl border border-outline-variant/20 flex flex-wrap items-center justify-between gap-2 mt-1">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-primary">location_city</span>
                  <span className="font-bold text-on-surface text-xs">{currentSelectedMarket.market_name}</span>
                  <span className="text-on-surface-variant text-[11px]">• {currentSelectedMarket.address}</span>
                </div>
                <span className="px-2 py-0.5 rounded-lg bg-primary/10 text-primary text-[10px] font-bold">
                  {currentSelectedMarket.timings || '8:00 AM – 1:30 PM'}
                </span>
              </div>
            )}
          </div>

          {/* Pavilion Address */}
          <div className="flex flex-col gap-1">
            <label className="font-bold text-on-surface">Pavilion / Street Address</label>
            <input
              type="text"
              value={pavilionAddress}
              onChange={(e) => setPavilionAddress(e.target.value)}
              placeholder="e.g. SW Park Ave & Montgomery St, Portland, OR"
              className="p-2.5 bg-surface-container-low rounded-xl border border-outline-variant/40 focus:ring-2 focus:ring-primary focus:outline-none"
            />
            <span className="text-[10px] text-on-surface-variant">
              Auto-filled based on selected market; feel free to add landmarks or table numbers
            </span>
          </div>
        </section>

        {/* ======================================================== */}
        {/* SECTION 2: OPERATING DAYS & PICKUP SCHEDULE              */}
        {/* ======================================================== */}
        <section className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col gap-space-md">
          <div className="flex items-center gap-3 border-b border-outline-variant/20 pb-space-sm">
            <div className="w-10 h-10 rounded-xl bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed">
              <span className="material-symbols-outlined text-[22px]">calendar_today</span>
            </div>
            <div>
              <h2 className="font-headline-sm text-on-surface font-bold text-base">
                Operating Days &amp; Pickup Window
              </h2>
              <p className="font-body-sm text-on-surface-variant text-xs">
                Specify which market days shoppers can reserve and collect pre-ordered crates
              </p>
            </div>
          </div>

          {/* Days Selection */}
          <div className="flex flex-col gap-2">
            <label className="font-bold text-on-surface">Active Stall Operating Days</label>
            <div className="flex flex-wrap gap-2">
              {daysList.map((day) => {
                const isSelected = operatingDays.includes(day);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleToggleDay(day)}
                    className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-primary text-white shadow-sm'
                        : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high border border-outline-variant/30'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[14px]">
                      {isSelected ? 'check' : 'add'}
                    </span>
                    <span>{day}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Pickup Window Start & End */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md pt-1">
            <div className="flex flex-col gap-1">
              <label className="font-bold text-on-surface">Stall Pickup Window Starts</label>
              <input
                type="text"
                value={pickupWindow.start}
                onChange={(e) => setPickupWindow({ ...pickupWindow, start: e.target.value })}
                placeholder="08:00 AM"
                className="p-2.5 bg-surface-container-low rounded-xl border border-outline-variant/40 focus:ring-2 focus:ring-primary focus:outline-none font-bold"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-bold text-on-surface">Stall Pickup Window Ends</label>
              <input
                type="text"
                value={pickupWindow.end}
                onChange={(e) => setPickupWindow({ ...pickupWindow, end: e.target.value })}
                placeholder="01:30 PM"
                className="p-2.5 bg-surface-container-low rounded-xl border border-outline-variant/40 focus:ring-2 focus:ring-primary focus:outline-none font-bold"
              />
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* SECTION 3: INTERACTIVE GEOLOCATION MAP & PIN            */}
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
                Pin your table on the live map so shoppers can get turn-by-turn driving &amp; walking directions
              </p>
            </div>
          </div>

          {/* Interactive Map Picker Component */}
          <StallLocationPicker
            latitude={coords.lat}
            longitude={coords.lng}
            stallNumber={stallNumber || `${stallName || 'Farm'} Stall`}
            address={pavilionAddress}
            onLocationChange={({ lat, lng }) => {
              setCoords({ lat, lng });
            }}
            onAddressChange={(newAddr) => {
              setPavilionAddress(newAddr);
            }}
            showToast={showToast}
          />

          {/* Latitude & Longitude Manual Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md items-end pt-1">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-on-surface-variant flex items-center justify-between">
                <span>Latitude Coordinate</span>
                <span className="text-[10px] text-primary font-mono font-normal">Synced with Map Pin</span>
              </label>
              <input
                type="text"
                value={coords.lat}
                onChange={(e) => setCoords({ ...coords, lat: e.target.value })}
                placeholder="45.515200"
                className="p-2.5 bg-surface-container-low rounded-xl font-mono text-xs border border-outline-variant/40 focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-on-surface-variant flex items-center justify-between">
                <span>Longitude Coordinate</span>
                <span className="text-[10px] text-primary font-mono font-normal">Synced with Map Pin</span>
              </label>
              <input
                type="text"
                value={coords.lng}
                onChange={(e) => setCoords({ ...coords, lng: e.target.value })}
                placeholder="-122.678400"
                className="p-2.5 bg-surface-container-low rounded-xl font-mono text-xs border border-outline-variant/40 focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* SUBMIT / REGISTER ACTION BUTTON                          */}
        {/* ======================================================== */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-space-md bg-surface-container-low rounded-2xl border border-outline-variant/30">
          <div className="flex items-center gap-2 text-on-surface-variant text-xs">
            <span className="material-symbols-outlined text-[18px] text-primary">verified</span>
            <span>
              {isRegistered
                ? 'Your stall is live in the customer directory and interactive map.'
                : 'After registering, your stall pin will be immediately visible to shoppers on the map.'}
            </span>
          </div>

          <button
            type="submit"
            disabled={saving}
            className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all active:scale-95 disabled:opacity-50 text-white ${
              isRegistered
                ? 'bg-primary hover:bg-[#1a4b22]'
                : 'bg-gradient-to-r from-[#2E6B3A] to-[#125224] hover:shadow-lg hover:shadow-primary/25 text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {saving ? 'sync' : isRegistered ? 'save' : 'how_to_reg'}
            </span>
            <span className="text-sm">
              {saving
                ? 'Saving Stall...'
                : isRegistered
                ? 'Update Stall Configuration'
                : 'Register Market Stall'}
            </span>
          </button>
        </div>

      </form>
    </div>
  );
}
