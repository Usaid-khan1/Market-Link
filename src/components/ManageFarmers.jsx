import React, { useState, useMemo, useEffect } from 'react';
import adminApi from '../api/admin';

export default function ManageFarmers({ onNavigate, showToast }) {
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'pending' | 'approved' | 'suspended'
  const [marketFilter, setMarketFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [approvalModalFarmer, setApprovalModalFarmer] = useState(null);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [viewFarmerDetails, setViewFarmerDetails] = useState(null);

  // Invite Form state
  const [inviteForm, setInviteForm] = useState({
    farmName: '',
    contactName: '',
    email: '',
    phone: '',
    market: 'Pioneer Pavilion',
    permitId: ''
  });

  // Farmers Dataset
  const [farmers, setFarmers] = useState([
    {
      id: 1,
      name: 'Riverbend Goat Dairy',
      location: 'River District • Lot 14-B',
      contact: 'Hannah & Dale Vance',
      role: 'Owner / Lead Herder',
      email: 'dale@riverbenddairy.local',
      phone: '(503) 555-0192',
      markets: ['River District Sat'],
      marketKey: 'River District Market',
      registered: 'Oct 16, 2025',
      registeredDate: new Date('2025-10-16'),
      status: 'pending',
      permit: 'PERM-2025-089',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC-b2tyzO-wRNjqUSNU5FkHWNWYmzeq0RpogYXq_XW0Tska6bHZoULqYiRIjqb-f1bh83DXrUHkUIy3X3kCB92HSDDXevyIkQXchLQ73sKofJENZmILGvq-u0fJzUzSCKj14RqUVLs413DXwdOPd370W_wqZmNVEF0Avfacy-EAtLOx87rDffRZ23lrRG9mp1tQZCHcXC_sb3J_1gBv15LR98yyrLj_iCMhJZWPw-BU7EbGSbA0SpMf'
    },
    {
      id: 2,
      name: 'Sunspire Microgreens',
      location: 'East Valley Ridge',
      contact: 'Lila Chen',
      role: 'Urban Farm Director',
      email: 'lila@sunspiregreens.org',
      phone: '(503) 555-0834',
      markets: ['Downtown Sat', 'Pioneer Pav'],
      marketKey: 'Saturday Downtown',
      registered: 'Oct 18, 2025',
      registeredDate: new Date('2025-10-18'),
      status: 'pending',
      permit: 'PERM-2025-094',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBCquoPg0yi78P7qTB24IUjOHUxmGNNT3xqn1sx0X4k7uCHChJVDeJoTXYhLF4JZ7rCVX6owMZMAvVses65cLYHpq8D_JSnCx6_n5SuBR_cN9Ig7e6Pzyx8UtDduNIcejXg_yQfQSpKq4AarEkMrquJU_fOCQ-X15j3SO--rDRaodW-OQX2PVWRUjIOjle9GTAhrzzk5huyq7iSSukMQo10eGweK-e0lUrcad1ZNMSQh7eDorA-LKfT'
    },
    {
      id: 3,
      name: 'Green Pastures Organic',
      location: 'Pioneer Pavilion • Stall #08',
      contact: 'Marcus & Sarah Thorne',
      role: 'Master Growers',
      email: 'info@greenpastures.bio',
      phone: '(503) 555-0471',
      markets: ['Pioneer Pavilion', 'Downtown Sat'],
      marketKey: 'Pioneer Pavilion',
      registered: 'Jul 12, 2024',
      registeredDate: new Date('2024-07-12'),
      status: 'approved',
      permit: 'PERM-2024-041',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAQIVndwY6KiYUSQMD2yK4gZjwGqK7C-IrX-yA-8C5c0dHfW8aLwUMJVHKo9lCs7s3TwLOtpGVX8sSjiObmOI5WNhoP2e1xPPZs5wu1uCJmvmB74F2tcpXrGgzHfVIZmuzzSViBWDVpK41SAs5HD0IAR5gSNf6BDZd_dmlJc4Gwr673FRLx3MRB4oHsUSbZR7gGSKtFvj4dkFUFJ4XT1oYBkrmMGHAN0xf7nIB4zZi_rEJD-dPQaonw'
    },
    {
      id: 4,
      name: 'Whispering Pines Herbs',
      location: 'Oak Valley • Space 3',
      contact: 'Eleanor Wright',
      role: 'Herbalist & Founder',
      email: 'eleanor@whisperingpines.farms',
      phone: '(503) 555-0912',
      markets: ['Oak Valley Sun'],
      marketKey: 'Oak Valley Sunday',
      registered: 'May 03, 2024',
      registeredDate: new Date('2024-05-03'),
      status: 'approved',
      permit: 'PERM-2024-029',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAXHd2qeZZyVt24nGx_Xq1Fy2jmny8L32l94sE8JNxGmwxuopCRVhCsYq_iOfR3qTflEDvlE2SmboghlxiowRxiL6NqML_zvVy5d5SS6KR2u0sGvIK5y9utLfepMYCQTGEv3UdVgZb27cuaIgV7AdP3a2WnfWhkhbwK_W8O0Dp3m-npCw8uFePYK-Qe6hkJYf7KOcUl-eoPuE7PeRtQ-0JsG7Ehk7txuZuAk_u_hdo37rhmMfE6Lo0N'
    },
    {
      id: 5,
      name: 'Miller & Stone Hearth',
      location: 'Central Market Hall • Stall 19',
      contact: 'David Miller',
      role: 'Head Baker & Miller',
      email: 'david@stonehearthbreads.com',
      phone: '(503) 555-0211',
      markets: ['Pioneer Pavilion', 'River District'],
      marketKey: 'Pioneer Pavilion',
      registered: 'Jan 14, 2024',
      registeredDate: new Date('2024-01-14'),
      status: 'approved',
      permit: 'PERM-2024-006',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCil_CRCnatjrhBT7RkESm1e-cyNNSLITHItwEwNOn5KnUW7KBXM4mi4sGBXDFF6pkMun33S-PbWqhAXF057EtH9jBT7lbvohRBf8BFuClRF5pR0VlY32L8v6Re7JAgkAddKBasoas6g1fYgvPrZM4HX2iLF1zyRi6zpQQ5TkO_jPVgpCqfHUjWGydt_mSiIfNASWvqRVHzuVd4S2K7f0bgow92JosndO92q-f0vst8EAwaLHF6PeRB'
    },
    {
      id: 6,
      name: 'Highland Berry & Nut Co.',
      location: 'Permit Renewal Required',
      contact: 'Robert MacLeod',
      role: 'Orchardist',
      email: 'robert@highlandberries.net',
      phone: '(503) 555-0789',
      markets: ['Oak Valley Sun'],
      marketKey: 'Oak Valley Sunday',
      registered: 'Nov 11, 2023',
      registeredDate: new Date('2023-11-11'),
      status: 'suspended',
      permit: 'PERM-2023-112',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBLpWDajpaHJ54w2NphFxAWvIBYEtyU6PiE1JoAhX4BlzDAS-RRY4OqpMTQP1BPwrNu56SqAyp6yQwXrWZXsB6SYGRNhJdvLYCiojwu3oOw4qYM8dmzxzXJcfxtj6vdtcoDZKVJxFzbe8RX80IY6cR3jguTvRGfaRifBxmiB9AIW3R0cqBUcSFlThm8PdTTxdz3aTsXgs7ZN8_4zei0juCbzi6jysZxQLgksSN0iqv6MFJkPg6OUXZR'
    }
  ]);

  // Counts
  const counts = useMemo(() => {
    const total = farmers.length + 52; // 58 total
    const pending = farmers.filter((f) => f.status === 'pending').length + 2;
    const approved = farmers.filter((f) => f.status === 'approved').length + 46;
    const suspended = farmers.filter((f) => f.status === 'suspended').length + 4;
    return { total, pending, approved, suspended };
  }, [farmers]);

  // Filtered & Sorted Farmers
  const filteredFarmers = useMemo(() => {
    let result = [...farmers];

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter((f) => f.status === statusFilter);
    }

    // Market filter
    if (marketFilter !== 'all') {
      result = result.filter(
        (f) =>
          f.marketKey.toLowerCase().includes(marketFilter.toLowerCase()) ||
          f.markets.some((m) => m.toLowerCase().includes(marketFilter.toLowerCase()))
      );
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.contact.toLowerCase().includes(q) ||
          f.email.toLowerCase().includes(q) ||
          f.permit.toLowerCase().includes(q) ||
          f.location.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sortBy === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'oldest') {
      result.sort((a, b) => a.registeredDate - b.registeredDate);
    } else if (sortBy === 'status') {
      result.sort((a, b) => a.status.localeCompare(b.status));
    } else {
      // newest
      result.sort((a, b) => b.registeredDate - a.registeredDate);
    }

    return result;
  }, [farmers, statusFilter, marketFilter, searchQuery, sortBy]);

  // Load live farmers from backend
  useEffect(() => {
    adminApi.getFarmers()
      .then((res) => {
        if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
          const mapped = res.data.map((f) => ({
            id: f.id,
            name: f.farmer_profile?.stall_name || f.name,
            location: f.farmer_profile?.address || f.address || 'Regional Stall',
            contact: f.farmer_profile?.contact_person || f.name,
            role: 'Stallholder / Grower',
            email: f.email,
            phone: f.phone || '(503) 555-0192',
            markets: f.farmer_profile?.operating_days || ['Downtown Saturday Market'],
            marketKey: 'Saturday Downtown',
            registered: f.created_at ? new Date(f.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Oct 18, 2025',
            registeredDate: f.created_at ? new Date(f.created_at) : new Date(),
            status: f.farmer_profile?.status || (f.status === 'active' ? 'approved' : f.status) || 'pending',
            permit: `PERM-2025-${String(f.id).padStart(3, '0')}`,
            image: f.farmer_profile?.image || 'https://lh3.googleusercontent.com/aida-public/AB6AXuC-b2tyzO-wRNjqUSNU5FkHWNWYmzeq0RpogYXq_XW0Tska6bHZoULqYiRIjqb-f1bh83DXrUHkUIy3X3kCB92HSDDXevyIkQXchLQ73sKofJENZmILGvq-u0fJzUzSCKj14RqUVLs413DXwdOPd370W_wqZmNVEF0Avfacy-EAtLOx87rDffRZ23lrRG9mp1tQZCHcXC_sb3J_1gBv15LR98yyrLj_iCMhJZWPw-BU7EbGSbA0SpMf'
          }));
          setFarmers(mapped);
        }
      })
      .catch((err) => console.warn('Could not load live farmers:', err));
  }, []);

  // Actions
  const handleApprove = (farmer) => {
    setApprovalModalFarmer(farmer);
  };

  const confirmApprove = async () => {
    if (!approvalModalFarmer) return;
    try {
      await adminApi.updateFarmerStatus(approvalModalFarmer.id, 'approved');
    } catch (e) {
      console.warn('API updateFarmerStatus error:', e);
    }
    setFarmers((prev) =>
      prev.map((f) =>
        f.id === approvalModalFarmer.id ? { ...f, status: 'approved' } : f
      )
    );
    showToast(`Farmer "${approvalModalFarmer.name}" has been approved and activated for the 2025 Market season.`);
    setApprovalModalFarmer(null);
  };

  const handleReject = async (farmer) => {
    if (window.confirm(`Are you sure you want to reject the registration request for ${farmer.name}? An email notice with revision instructions will be dispatched.`)) {
      try {
        await adminApi.updateFarmerStatus(farmer.id, 'suspended');
      } catch (e) {
        console.warn('API error:', e);
      }
      setFarmers((prev) => prev.filter((f) => f.id !== farmer.id));
      showToast(`Registration rejected for ${farmer.name}. Revision notice dispatched.`);
    }
  };

  const handleSuspend = async (farmer) => {
    if (window.confirm(`Suspend stall privileges for ${farmer.name}? They will temporarily be removed from market stand maps.`)) {
      try {
        await adminApi.updateFarmerStatus(farmer.id, 'suspended');
      } catch (e) {
        console.warn('API error:', e);
      }
      setFarmers((prev) =>
        prev.map((f) => (f.id === farmer.id ? { ...f, status: 'suspended' } : f))
      );
      showToast(`${farmer.name} has been suspended.`);
    }
  };

  const handleReactivate = async (farmer) => {
    if (window.confirm(`Reactivate ${farmer.name} after inspecting verified permit updates?`)) {
      try {
        await adminApi.updateFarmerStatus(farmer.id, 'approved');
      } catch (e) {
        console.warn('API error:', e);
      }
      setFarmers((prev) =>
        prev.map((f) => (f.id === farmer.id ? { ...f, status: 'approved' } : f))
      );
      showToast(`${farmer.name} is now reactivated and approved.`);
    }
  };

  const handleCreateInvite = (e) => {
    e.preventDefault();
    if (!inviteForm.farmName || !inviteForm.email) return;

    const newFarmer = {
      id: Date.now(),
      name: inviteForm.farmName,
      location: `${inviteForm.market} • New Assigned Stall`,
      contact: inviteForm.contactName || 'Principal Grower',
      role: 'Owner / Lead Grower',
      email: inviteForm.email,
      phone: inviteForm.phone || '(503) 555-0100',
      markets: [inviteForm.market],
      marketKey: inviteForm.market,
      registered: 'Just now',
      registeredDate: new Date(),
      status: 'pending',
      permit: inviteForm.permitId || 'PERM-2025-PENDING',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAQIVndwY6KiYUSQMD2yK4gZjwGqK7C-IrX-yA-8C5c0dHfW8aLwUMJVHKo9lCs7s3TwLOtpGVX8sSjiObmOI5WNhoP2e1xPPZs5wu1uCJmvmB74F2tcpXrGgzHfVIZmuzzSViBWDVpK41SAs5HD0IAR5gSNf6BDZd_dmlJc4Gwr673FRLx3MRB4oHsUSbZR7gGSKtFvj4dkFUFJ4XT1oYBkrmMGHAN0xf7nIB4zZi_rEJD-dPQaonw'
    };

    setFarmers([newFarmer, ...farmers]);
    setInviteModalOpen(false);
    showToast(`Stall invitation dispatched to ${inviteForm.email}!`);
    setInviteForm({
      farmName: '',
      contactName: '',
      email: '',
      phone: '',
      market: 'Pioneer Pavilion',
      permitId: ''
    });
  };

  const resetAllFilters = () => {
    setStatusFilter('all');
    setMarketFilter('all');
    setSearchQuery('');
    setSortBy('newest');
  };

  return (
    <div className="px-gutter py-space-lg max-w-7xl mx-auto w-full flex flex-col gap-space-lg animate-fade-in">
      {/* 1. Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-space-xs text-on-surface-variant font-label-sm text-xs">
            <span>PORTAL</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-primary font-bold">GROWER REGISTRY</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg sm:text-3xl text-on-surface tracking-tight font-bold">
            Manage Farmers
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant text-xs sm:text-sm">
            Review and manage farmer registrations, compliance permits, and market stalls across all regional pavilions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-space-sm">
          <button
            type="button"
            onClick={() => showToast('Farmer registry exported to CSV (58 total records).')}
            className="inline-flex items-center gap-2 px-space-md py-2.5 rounded-xl bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors font-label-md text-xs font-bold shadow-sm cursor-pointer border border-outline-variant/30"
          >
            <span className="material-symbols-outlined text-[20px] text-tertiary">file_download</span>
            <span>Export Registry (CSV)</span>
          </button>
          
          <button
            type="button"
            onClick={() => setInviteModalOpen(true)}
            className="inline-flex items-center gap-2 px-space-lg py-2.5 rounded-xl bg-tertiary-container text-on-tertiary font-label-md text-xs font-bold hover:bg-tertiary transition-colors shadow-md cursor-pointer active:scale-95"
          >
            <span className="material-symbols-outlined text-[20px]">person_add</span>
            <span>+ Invite New Farmer</span>
          </button>
        </div>
      </div>

      {/* 2. Metrics Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-space-md">
        {/* Card 1 */}
        <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm flex flex-col gap-1 relative overflow-hidden border border-outline-variant/30">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-[11px] uppercase tracking-wider text-on-surface-variant font-bold">
              Total Farmers
            </span>
            <span className="material-symbols-outlined text-primary text-[22px]">store</span>
          </div>
          <span className="font-headline-md text-2xl sm:text-3xl font-bold text-on-surface">
            {counts.total}
          </span>
          <span className="font-body-sm text-secondary flex items-center gap-1 font-bold text-xs">
            <span className="material-symbols-outlined text-[16px]">trending_up</span> +6 this harvest season
          </span>
        </div>

        {/* Card 2 */}
        <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm flex flex-col gap-1 relative overflow-hidden border border-outline-variant/30">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-[11px] uppercase tracking-wider text-tertiary font-bold">
              Pending Review
            </span>
            <span className="material-symbols-outlined text-tertiary-container text-[22px]">pending_actions</span>
          </div>
          <span className="font-headline-md text-2xl sm:text-3xl font-bold text-tertiary-container">
            {counts.pending}
          </span>
          <span className="font-body-sm text-on-surface-variant text-xs">
            Awaiting pavilion signoff
          </span>
        </div>

        {/* Card 3 */}
        <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm flex flex-col gap-1 relative overflow-hidden border border-outline-variant/30">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-[11px] uppercase tracking-wider text-primary font-bold">
              Active Stalls
            </span>
            <span className="material-symbols-outlined text-primary text-[22px]">check_circle</span>
          </div>
          <span className="font-headline-md text-2xl sm:text-3xl font-bold text-primary">
            {counts.approved}
          </span>
          <span className="font-body-sm text-on-surface-variant text-xs">
            84.5% active compliance
          </span>
        </div>

        {/* Card 4 */}
        <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm flex flex-col gap-1 relative overflow-hidden border border-outline-variant/30">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-[11px] uppercase tracking-wider text-error font-bold">
              Permit Flagged
            </span>
            <span className="material-symbols-outlined text-error text-[22px]">warning</span>
          </div>
          <span className="font-headline-md text-2xl sm:text-3xl font-bold text-error">
            {counts.suspended}
          </span>
          <span className="font-body-sm text-on-surface-variant text-xs">
            Renewal notice sent
          </span>
        </div>
      </div>

      {/* 3. Filters & Action Bar */}
      <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-space-md border border-outline-variant/30">
        
        {/* Status Pills */}
        <div className="flex flex-wrap items-center gap-2" id="filterPills">
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`px-4 py-2 rounded-full font-label-sm text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'bg-surface-container-high text-on-surface hover:bg-surface-dim'
            }`}
          >
            <span>All Growers</span>
            <span className={`px-2 py-0.5 rounded-full text-[11px] ${
              statusFilter === 'all' ? 'bg-white/20 text-on-primary' : 'bg-surface-container text-on-surface-variant'
            }`}>
              {counts.total}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('pending')}
            className={`px-4 py-2 rounded-full font-label-sm text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              statusFilter === 'pending'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'bg-surface-container-high text-on-surface hover:bg-surface-dim'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-tertiary"></span>
            <span>Pending Approval</span>
            <span className="bg-tertiary-fixed text-on-tertiary-fixed font-bold px-2 py-0.5 rounded-full text-[11px]">
              {counts.pending}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('approved')}
            className={`px-4 py-2 rounded-full font-label-sm text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              statusFilter === 'approved'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'bg-surface-container-high text-on-surface hover:bg-surface-dim'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-secondary"></span>
            <span>Approved</span>
            <span className="bg-secondary-fixed text-on-secondary-fixed px-2 py-0.5 rounded-full text-[11px]">
              {counts.approved}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('suspended')}
            className={`px-4 py-2 rounded-full font-label-sm text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              statusFilter === 'suspended'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'bg-surface-container-high text-on-surface hover:bg-surface-dim'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-error"></span>
            <span>Suspended</span>
            <span className="bg-error-container text-on-error-container px-2 py-0.5 rounded-full text-[11px]">
              {counts.suspended}
            </span>
          </button>
        </div>

        {/* Search & Market Dropdown Controls */}
        <div className="flex flex-wrap items-center gap-space-sm">
          <div className="relative flex-1 sm:w-72">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-[18px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search stall, crop, or permit #..."
              className="w-full pl-9 pr-4 py-2 bg-surface-container-low rounded-xl font-body-sm text-xs text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary shadow-inner border border-outline-variant/30"
            />
          </div>

          <div className="relative">
            <select
              value={marketFilter}
              onChange={(e) => setMarketFilter(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 rounded-xl bg-surface-container-low text-on-surface font-body-sm text-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary border border-outline-variant/30 font-bold"
            >
              <option value="all">All Market Pavilions</option>
              <option value="Pioneer Pavilion">Pioneer Pavilion (Central)</option>
              <option value="Oak Valley Sunday">Oak Valley Sunday</option>
              <option value="Saturday Downtown">Saturday Downtown</option>
              <option value="River District Market">River District Market</option>
            </select>
            <span className="material-symbols-outlined absolute right-2.5 top-2.5 text-on-surface-variant pointer-events-none text-[18px]">
              expand_more
            </span>
          </div>

          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 rounded-xl bg-surface-container-low text-on-surface font-body-sm text-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary border border-outline-variant/30 font-bold"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="name">Sort: Stall Name (A-Z)</option>
              <option value="oldest">Sort: Oldest Registered</option>
              <option value="status">Sort: Compliance Status</option>
            </select>
            <span className="material-symbols-outlined absolute right-2.5 top-2.5 text-on-surface-variant pointer-events-none text-[18px]">
              sort
            </span>
          </div>
        </div>
      </div>

      {/* 4. Farmers Data Table Container */}
      <div className="bg-surface-container-lowest rounded-2xl shadow-sm overflow-hidden flex flex-col border border-outline-variant/30">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left font-body-sm text-xs">
            <thead>
              <tr className="bg-surface-container text-on-surface-variant font-label-sm uppercase tracking-wider text-[11px] font-bold">
                <th className="py-3.5 px-space-md" scope="col">Stall &amp; Location</th>
                <th className="py-3.5 px-space-md" scope="col">Contact Person</th>
                <th className="py-3.5 px-space-md" scope="col">Email</th>
                <th className="py-3.5 px-space-md" scope="col">Phone</th>
                <th className="py-3.5 px-space-md" scope="col">Markets Assigned</th>
                <th className="py-3.5 px-space-md" scope="col">Registered</th>
                <th className="py-3.5 px-space-md" scope="col">Status</th>
                <th className="py-3.5 px-space-md text-right" scope="col">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-high/50 text-on-surface">
              {filteredFarmers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-on-surface-variant">
                    <div className="w-16 h-16 rounded-full bg-surface-container mx-auto flex items-center justify-center mb-space-sm text-primary">
                      <span className="material-symbols-outlined text-[32px]">search_off</span>
                    </div>
                    <h3 className="font-headline-sm text-on-surface font-bold text-base">
                      No farmers found matching this criteria
                    </h3>
                    <p className="text-xs text-on-surface-variant mt-1 mb-space-md">
                      Try adjusting your search query, selecting another regional market pavilion, or clearing your active filters.
                    </p>
                    <button
                      type="button"
                      onClick={resetAllFilters}
                      className="px-space-md py-2 rounded-xl bg-primary text-on-primary font-label-md text-xs font-bold hover:bg-primary-container transition-colors shadow-sm cursor-pointer"
                    >
                      Clear all filters
                    </button>
                  </td>
                </tr>
              ) : (
                filteredFarmers.map((farmer) => {
                  const isSuspended = farmer.status === 'suspended';
                  const isPending = farmer.status === 'pending';
                  const isApproved = farmer.status === 'approved';

                  return (
                    <tr
                      key={farmer.id}
                      className={`hover:bg-surface-container-low/60 transition-colors ${
                        isSuspended ? 'bg-error-container/10' : ''
                      }`}
                    >
                      {/* Stall & Location */}
                      <td className="py-4 px-space-md">
                        <div className="flex items-center gap-space-sm">
                          <div className="w-10 h-10 rounded-xl bg-primary-fixed flex items-center justify-center text-primary font-bold overflow-hidden shadow-sm shrink-0">
                            <img
                              className="w-full h-full object-cover"
                              alt={farmer.name}
                              src={farmer.image}
                            />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-headline-sm text-[15px] text-on-surface font-bold truncate">
                              {farmer.name}
                            </span>
                            <span className={`font-body-sm text-[11px] flex items-center gap-1 ${
                              isSuspended ? 'text-error font-semibold' : 'text-primary'
                            }`}>
                              <span className="material-symbols-outlined text-[13px]">
                                {isSuspended ? 'error' : 'location_on'}
                              </span>
                              {farmer.location}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Contact Person */}
                      <td className="py-4 px-space-md">
                        <div className="flex flex-col">
                          <span className="font-label-md text-on-surface font-bold text-xs">{farmer.contact}</span>
                          <span className="font-body-sm text-on-surface-variant text-[11px]">{farmer.role}</span>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="py-4 px-space-md">
                        <a
                          className="text-primary hover:underline font-label-sm text-xs font-bold"
                          href={`mailto:${farmer.email}`}
                        >
                          {farmer.email}
                        </a>
                      </td>

                      {/* Phone */}
                      <td className="py-4 px-space-md text-on-surface-variant font-mono text-[11px]">
                        {farmer.phone}
                      </td>

                      {/* Markets Assigned */}
                      <td className="py-4 px-space-md">
                        <div className="flex flex-wrap gap-1">
                          {farmer.markets.map((m, i) => (
                            <span
                              key={i}
                              className={`px-2 py-0.5 rounded-full font-label-sm text-[10px] font-bold ${
                                isSuspended
                                  ? 'bg-surface-container text-on-surface-variant line-through'
                                  : isApproved && i === 0
                                  ? 'bg-secondary-fixed text-on-secondary-fixed'
                                  : 'bg-surface-container text-on-surface'
                              }`}
                            >
                              {m}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Registered */}
                      <td className="py-4 px-space-md text-on-surface-variant font-label-sm text-[11px]">
                        {farmer.registered}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-space-md">
                        {isPending && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-[11px] font-bold">
                            <span className="w-2 h-2 rounded-full bg-tertiary"></span>
                            Pending Approval
                          </span>
                        )}
                        {isApproved && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-[11px] font-bold">
                            <span className="w-2 h-2 rounded-full bg-primary"></span>
                            Approved
                          </span>
                        )}
                        {isSuspended && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-error-container text-on-error-container font-label-sm text-[11px] font-bold">
                            <span className="w-2 h-2 rounded-full bg-error"></span>
                            Suspended
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-space-md text-right">
                        <div className="inline-flex items-center gap-1.5 justify-end">
                          {isPending && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleApprove(farmer)}
                                className="px-3 py-1.5 rounded-lg bg-primary text-on-primary hover:bg-primary-container transition-colors font-label-sm text-xs font-bold shadow-sm flex items-center gap-1 cursor-pointer"
                              >
                                <span className="material-symbols-outlined text-[16px]">check</span> Approve
                              </button>
                              <button
                                type="button"
                                onClick={() => handleReject(farmer)}
                                className="px-2.5 py-1.5 rounded-lg bg-surface-container-high text-error hover:bg-error-container hover:text-on-error-container transition-colors font-label-sm text-xs font-bold cursor-pointer"
                              >
                                Reject
                              </button>
                            </>
                          )}

                          {isApproved && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleSuspend(farmer)}
                                className="px-2.5 py-1.5 rounded-lg bg-surface-container-high text-tertiary hover:bg-tertiary-fixed transition-colors font-label-sm text-xs font-bold cursor-pointer"
                              >
                                Suspend
                              </button>
                              <button
                                type="button"
                                onClick={() => setViewFarmerDetails(farmer)}
                                className="px-2.5 py-1.5 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors font-label-sm text-xs font-bold flex items-center gap-1 cursor-pointer"
                              >
                                <span className="material-symbols-outlined text-[16px]">visibility</span> View
                              </button>
                            </>
                          )}

                          {isSuspended && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleReactivate(farmer)}
                                className="px-3 py-1.5 rounded-lg bg-surface-container-high text-primary hover:bg-primary-container hover:text-on-primary-container transition-colors font-label-sm text-xs shadow-sm flex items-center gap-1 font-bold cursor-pointer"
                              >
                                <span className="material-symbols-outlined text-[16px]">restart_alt</span> Reactivate
                              </button>
                              <button
                                type="button"
                                onClick={() => setViewFarmerDetails(farmer)}
                                className="px-2.5 py-1.5 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors font-label-sm text-xs font-bold flex items-center gap-1 cursor-pointer"
                              >
                                <span className="material-symbols-outlined text-[16px]">visibility</span> View
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* 5. Pagination & Summary */}
        <div className="p-space-md bg-surface-container/40 flex flex-col sm:flex-row items-center justify-between gap-space-sm border-t border-outline-variant/20 text-xs">
          <span className="font-body-sm text-on-surface-variant">
            Showing <span className="font-bold text-on-surface">1</span> to <span className="font-bold text-on-surface">{filteredFarmers.length}</span> of <span className="font-bold text-on-surface">{counts.total}</span> registered farmers
          </span>
          <div className="flex items-center gap-1 font-bold">
            <button
              type="button"
              disabled
              aria-label="Previous page"
              className="w-8 h-8 rounded-lg bg-surface-container-low text-on-surface-variant disabled:opacity-40 flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            <button
              type="button"
              className="w-8 h-8 rounded-lg bg-primary text-on-primary font-label-md shadow-sm flex items-center justify-center"
            >
              1
            </button>
            <button
              type="button"
              className="w-8 h-8 rounded-lg bg-surface-container-low text-on-surface hover:bg-surface-container-high transition-colors flex items-center justify-center cursor-pointer"
            >
              2
            </button>
            <button
              type="button"
              className="w-8 h-8 rounded-lg bg-surface-container-low text-on-surface hover:bg-surface-container-high transition-colors flex items-center justify-center cursor-pointer"
            >
              3
            </button>
            <span className="px-1 text-on-surface-variant">...</span>
            <button
              type="button"
              className="w-8 h-8 rounded-lg bg-surface-container-low text-on-surface hover:bg-surface-container-high transition-colors flex items-center justify-center cursor-pointer"
            >
              10
            </button>
            <button
              type="button"
              aria-label="Next page"
              className="w-8 h-8 rounded-lg bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high transition-colors flex items-center justify-center cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* 6. Quick Help & Compliance Notice Card */}
      <div className="p-space-md rounded-2xl bg-secondary-fixed/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md border border-secondary-fixed/50">
        <div className="flex items-center gap-space-md">
          <div className="w-12 h-12 rounded-xl bg-primary text-on-primary flex items-center justify-center shrink-0 shadow-sm">
            <span className="material-symbols-outlined text-[24px]">verified_user</span>
          </div>
          <div className="text-xs">
            <h4 className="font-headline-sm text-base text-on-surface font-bold">
              Annual Organic Certificate &amp; Stall Permit Audit
            </h4>
            <p className="font-body-sm text-on-surface-variant mt-0.5 leading-relaxed">
              All approved farms require state organic or certified-naturally-grown permits logged before assigning Saturday market stalls.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => showToast('Opening compliance manual & inspection guidelines PDF...')}
          className="px-space-md py-2 rounded-xl bg-primary-container text-on-primary-container font-label-sm text-xs font-bold whitespace-nowrap hover:bg-primary hover:text-on-primary transition-colors cursor-pointer shadow-sm"
        >
          Open Compliance Manual
        </button>
      </div>

      {/* MODAL 1: Confirm Farmer Approval */}
      {approvalModalFarmer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full mx-4 shadow-2xl overflow-hidden border border-outline-variant/40">
            <div className="p-space-lg flex flex-col gap-space-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-space-sm">
                  <div className="w-10 h-10 rounded-full bg-primary-fixed text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-[22px]">verified</span>
                  </div>
                  <h3 className="font-headline-sm text-on-surface font-bold text-base">
                    Confirm Farmer Approval
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setApprovalModalFarmer(null)}
                  className="text-on-surface-variant hover:text-on-surface p-1 rounded-lg cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              <p className="font-body-md text-on-surface-variant text-xs leading-relaxed">
                Are you sure you want to approve <strong className="text-on-surface font-bold">{approvalModalFarmer.name}</strong> for the 2025 Harvest Season? This will activate their stand profile, public inventory listings, and notify regional pavilion captains.
              </p>

              {/* Details Preview Box */}
              <div className="bg-surface-container-low p-space-md rounded-xl flex flex-col gap-2 font-body-sm text-xs border border-outline-variant/20">
                <div className="flex justify-between">
                  <span className="text-on-surface-variant font-medium">Permit &amp; License ID:</span>
                  <span className="font-bold text-on-surface font-mono">{approvalModalFarmer.permit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant font-medium">Registered Contact:</span>
                  <span className="text-primary font-bold">{approvalModalFarmer.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant font-medium">Assigned Market:</span>
                  <span className="text-on-surface font-semibold">{approvalModalFarmer.marketKey}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant font-medium">Primary Inspector:</span>
                  <span className="text-on-surface font-bold">Hannah Vance (Super Admin)</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-space-sm pt-2 text-xs">
                <button
                  type="button"
                  onClick={() => setApprovalModalFarmer(null)}
                  className="px-space-md py-2.5 rounded-xl bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors font-label-md font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmApprove}
                  className="px-space-lg py-2.5 rounded-xl bg-primary text-on-primary hover:bg-primary-container transition-colors font-label-md font-bold shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">check_circle</span>
                  <span>Confirm Approval</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Invite New Farmer Modal */}
      {inviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full mx-4 shadow-2xl overflow-hidden border border-outline-variant/40">
            <div className="p-space-lg flex flex-col gap-space-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-space-sm">
                  <div className="w-10 h-10 rounded-full bg-tertiary-fixed text-tertiary flex items-center justify-center">
                    <span className="material-symbols-outlined text-[22px]">person_add</span>
                  </div>
                  <h3 className="font-headline-sm text-on-surface font-bold text-base">
                    Invite New Farm Stand Partner
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setInviteModalOpen(false)}
                  className="text-on-surface-variant hover:text-on-surface p-1 rounded-lg cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              <form onSubmit={handleCreateInvite} className="flex flex-col gap-space-sm text-xs">
                <div>
                  <label className="font-bold text-on-surface block mb-1">Farm / Stall Name *</label>
                  <input
                    type="text"
                    required
                    value={inviteForm.farmName}
                    onChange={(e) => setInviteForm({ ...inviteForm, farmName: e.target.value })}
                    placeholder="e.g. Cascade Blossom Honey"
                    className="w-full px-3 py-2 rounded-xl bg-surface-container-low text-on-surface border border-outline-variant/40 focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-space-sm">
                  <div>
                    <label className="font-bold text-on-surface block mb-1">Contact Person</label>
                    <input
                      type="text"
                      value={inviteForm.contactName}
                      onChange={(e) => setInviteForm({ ...inviteForm, contactName: e.target.value })}
                      placeholder="e.g. Marcus Gray"
                      className="w-full px-3 py-2 rounded-xl bg-surface-container-low text-on-surface border border-outline-variant/40 focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-on-surface block mb-1">Phone</label>
                    <input
                      type="tel"
                      value={inviteForm.phone}
                      onChange={(e) => setInviteForm({ ...inviteForm, phone: e.target.value })}
                      placeholder="(503) 555-0188"
                      className="w-full px-3 py-2 rounded-xl bg-surface-container-low text-on-surface border border-outline-variant/40 focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-on-surface block mb-1">Grower Email Address *</label>
                  <input
                    type="email"
                    required
                    value={inviteForm.email}
                    onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                    placeholder="grower@familyfarm.org"
                    className="w-full px-3 py-2 rounded-xl bg-surface-container-low text-on-surface border border-outline-variant/40 focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-space-sm">
                  <div>
                    <label className="font-bold text-on-surface block mb-1">Assigned Pavilion</label>
                    <select
                      value={inviteForm.market}
                      onChange={(e) => setInviteForm({ ...inviteForm, market: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-surface-container-low text-on-surface border border-outline-variant/40 focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer font-bold"
                    >
                      <option>Pioneer Pavilion</option>
                      <option>Saturday Downtown</option>
                      <option>Oak Valley Sunday</option>
                      <option>River District Market</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-on-surface block mb-1">Permit / Soil Cert ID</label>
                    <input
                      type="text"
                      value={inviteForm.permitId}
                      onChange={(e) => setInviteForm({ ...inviteForm, permitId: e.target.value })}
                      placeholder="PERM-2025-..."
                      className="w-full px-3 py-2 rounded-xl bg-surface-container-low text-on-surface border border-outline-variant/40 focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-space-sm pt-2">
                  <button
                    type="button"
                    onClick={() => setInviteModalOpen(false)}
                    className="px-space-md py-2.5 rounded-xl bg-surface-container text-on-surface font-label-md font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-space-lg py-2.5 rounded-xl bg-tertiary text-on-tertiary hover:bg-tertiary-container font-label-md font-bold shadow-md cursor-pointer transition-colors"
                  >
                    Send Invitation
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: View Farmer Details */}
      {viewFarmerDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full mx-4 shadow-2xl overflow-hidden border border-outline-variant/40">
            <div className="p-space-lg flex flex-col gap-space-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-space-sm">
                  <img
                    src={viewFarmerDetails.image}
                    alt={viewFarmerDetails.name}
                    className="w-12 h-12 rounded-xl object-cover shadow-sm"
                  />
                  <div>
                    <h3 className="font-headline-sm text-on-surface font-bold text-base">
                      {viewFarmerDetails.name}
                    </h3>
                    <span className="font-body-sm text-primary text-xs font-semibold">
                      {viewFarmerDetails.location}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setViewFarmerDetails(null)}
                  className="text-on-surface-variant hover:text-on-surface p-1 rounded-lg cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              <div className="bg-surface-container-low p-space-md rounded-xl flex flex-col gap-2 font-body-sm text-xs border border-outline-variant/20">
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Principal Contact:</span>
                  <span className="font-bold text-on-surface">{viewFarmerDetails.contact} ({viewFarmerDetails.role})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Direct Email:</span>
                  <span className="font-bold text-primary">{viewFarmerDetails.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Contact Phone:</span>
                  <span className="font-bold text-on-surface">{viewFarmerDetails.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Assigned Markets:</span>
                  <span className="font-bold text-on-surface">{viewFarmerDetails.markets.join(', ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Permit Registration:</span>
                  <span className="font-bold text-on-surface font-mono">{viewFarmerDetails.permit}</span>
                </div>
                <div className="flex justify-between items-center pt-1 border-t border-outline-variant/20">
                  <span className="text-on-surface-variant">Compliance Status:</span>
                  <span className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] uppercase ${
                    viewFarmerDetails.status === 'approved'
                      ? 'bg-primary-fixed text-on-primary-fixed'
                      : viewFarmerDetails.status === 'pending'
                      ? 'bg-tertiary-fixed text-on-tertiary-fixed'
                      : 'bg-error-container text-on-error-container'
                  }`}>
                    {viewFarmerDetails.status}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-space-sm pt-1 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setViewFarmerDetails(null);
                    onNavigate('farmer-profile');
                  }}
                  className="px-space-md py-2 rounded-xl bg-surface-container text-primary font-bold hover:bg-surface-container-high transition-colors cursor-pointer"
                >
                  Open Public Storefront Profile →
                </button>
                <button
                  type="button"
                  onClick={() => setViewFarmerDetails(null)}
                  className="px-space-md py-2 rounded-xl bg-primary text-on-primary font-bold hover:bg-primary-container transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
