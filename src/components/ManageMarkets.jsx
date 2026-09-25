import React, { useState, useMemo, useEffect } from 'react';
import adminApi from '../api/admin';

export default function ManageMarkets({ onNavigate, showToast }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'active' | 'inactive'
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingMarket, setEditingMarket] = useState(null); // null = Add, obj = Edit
  const [deleteModalMarket, setDeleteModalMarket] = useState(null);

  // Form State
  const initialFormState = {
    name: '',
    address: '',
    operatingDays: ['Saturday'],
    startTime: '08:00 AM',
    endTime: '02:00 PM',
    farmersCount: 20,
    status: 'Active',
    lat: '45.5152',
    lng: '-122.6784',
    description: ''
  };
  const [formData, setFormData] = useState(initialFormState);

  // Initial Markets Dataset
  const [markets, setMarkets] = useState([
    {
      id: 1,
      name: 'Downtown Saturday Market',
      area: 'South Park Blocks & Urban Plaza',
      address: 'SW Park Ave & Montgomery St, Portland, OR 97201',
      operatingDays: ['Saturday'],
      timings: '8:00 AM – 1:00 PM',
      startTime: '08:00 AM',
      endTime: '01:00 PM',
      farmersCount: 28,
      status: 'Active',
      lat: '45.5152',
      lng: '-122.6784',
      badgeClass: 'bg-primary-fixed text-on-primary-fixed',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBBX6utvQ3xGaWuRHTzDH0bpvHJPPVXGKwmlRJkZclFyW9JmposXNsPIaGlKfbAYLjWlTj6kegD3xiXVcbwKrDbcXdl9om839D_OtCFGkQfGjruKFlwdMZbaHi9p6_fHEbYgdzibkaRDVAFTrVRiKOUa0XSheflTlbEV4iokdUWipIMFeVWXZIyaHSPRj3_a5AhBpPhI_-sqaX8mti0ZIC8RNAPRyTWVWTAz4sBygNArLrviP7I4kSL'
    },
    {
      id: 2,
      name: 'Oak Valley Community Organic Market',
      area: 'North Oak Valley Historic Grounds',
      address: 'Pioneer Park Pavilion, 412 Oak Valley Rd, OR 97034',
      operatingDays: ['Sunday'],
      timings: '9:00 AM – 2:00 PM',
      startTime: '09:00 AM',
      endTime: '02:00 PM',
      farmersCount: 19,
      status: 'Active',
      lat: '45.5320',
      lng: '-122.6950',
      badgeClass: 'bg-primary-fixed text-on-primary-fixed',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDM1BNwiasvOk6PCBQdnDuAsoLQBDrh103TT3dybKpUdiN6kDdKYVr_zaHFAylbx6yOu9JmcnXGvO_em5buUntA57uuJILMejl7yvAhL9yBbeyntF4VC15SmVwPq6ZV5omCcGgRwMEjTbeDGthb3Nkno-tl-meXs61aQJ3WdRBYGNR6y06kWAx_YGZwmpELf77FIOl3g5iQvPRcJiyoxEsAGLGLkQOE5XvT1BHVJECA3ERSC5tYtgqZ'
    },
    {
      id: 3,
      name: 'Riverside Twilight Farmers Market',
      area: 'River District Waterfront',
      address: '1020 Waterfront Esplanade, Pier 4, OR 97209',
      operatingDays: ['Wednesday'],
      timings: '4:00 PM – 8:00 PM',
      startTime: '04:00 PM',
      endTime: '08:00 PM',
      farmersCount: 22,
      status: 'Active',
      lat: '45.5080',
      lng: '-122.6680',
      badgeClass: 'bg-primary-fixed text-on-primary-fixed',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAq5bA9E3L9E1pPqyqHrkY_L3Z7PjX_1lJtF_Qz5c1dHfW8aLwUMJVHKo9lCs7s3TwLOtpGVX8sSjiObmOI5WNhoP2e1xPPZs5wu1uCJmvmB74F2tcpXrGgzHfVIZmuzzSViBWDVpK41SAs5HD0IAR5gSNf6BDZd_dmlJc4Gwr673FRLx3MRB4oHsUSbZR7gGSKtFvj4dkFUFJ4XT1oYBkrmMGHAN0xf7nIB4zZi_rEJD-dPQaonw'
    },
    {
      id: 4,
      name: 'Pioneer Pavilion Heritage Market',
      area: 'Historic Plaza Square',
      address: '700 SW 6th Avenue, Pavilion Hall, OR 97204',
      operatingDays: ['Saturday', 'Sunday'],
      timings: '8:30 AM – 2:30 PM',
      startTime: '08:30 AM',
      endTime: '02:30 PM',
      farmersCount: 35,
      status: 'Active',
      lat: '45.5190',
      lng: '-122.6795',
      badgeClass: 'bg-primary-fixed text-on-primary-fixed',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC5r9n84_MegsorAvtL8LFeNQKwAvICYTZXDO2fBF1mfiPLmoVq1Ta8OpFGXSUkxXMqQgvaQyQ881mqUuUmEKbJNEtG5X8dZ1gnluHUvRPhIM0mXpv-Km4-fetXUUuDFT2Au2m3EMaAgJKvrHemEvwFhQb4CW8JsL-91uXLXopIthyMsh7W-YFn5bbfWlmd-YSE1_zALoINwkJjYN_Bv2FLdr5o_ZCRBFcuBiGK5h7TXg7Spipjxtud'
    },
    {
      id: 5,
      name: 'Eastside Sunset Greenway Hub',
      area: 'Industrial Sanctuary Park',
      address: '1540 SE Water Avenue, Pavilion B, OR 97214',
      operatingDays: ['Thursday'],
      timings: '3:00 PM – 7:30 PM',
      startTime: '03:00 PM',
      endTime: '07:30 PM',
      farmersCount: 14,
      status: 'Inactive',
      lat: '45.5210',
      lng: '-122.6520',
      badgeClass: 'bg-surface-container-high text-on-surface-variant',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCAGxWvIAEOciNeIpvXeS0o6ueKMVujWIo898fnUWfjodLLEsdvlYJeyAq0P_BIh4FSLnQ9-g0PNY4w7Oo0Ou1pmCQgjmHE20gK8vtchyOQzpCDUme7igITGjAxNMZ3ecokj62DY6lRU4l7RsM5Ot8xN8u-_bTEBIbtVcLegOKYyWkwzRUi9rgFDFC8mIFBtC8OuDmjkzT9Rq0f3N6aAALbzM51q0_s4DbSkH8ChO7cq1xZdKGcJSgs'
    }
  ]);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Filtered Markets
  const filteredMarkets = useMemo(() => {
    return markets.filter((m) => {
      const matchSearch =
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.area.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchStatus =
        statusFilter === 'all'
          ? true
          : statusFilter === 'active'
          ? m.status === 'Active'
          : m.status === 'Inactive';

      return matchSearch && matchStatus;
    });
  }, [markets, searchQuery, statusFilter]);

  // Metrics
  const metrics = useMemo(() => {
    const total = markets.length;
    const active = markets.filter((m) => m.status === 'Active').length;
    const totalFarmers = markets.reduce((acc, curr) => acc + curr.farmersCount, 0);
    return { total, active, totalFarmers };
  }, [markets]);

  // Handle Open Add
  const handleOpenAdd = () => {
    setEditingMarket(null);
    setFormData(initialFormState);
    setIsFormModalOpen(true);
  };

  // Handle Open Edit
  const handleOpenEdit = (market) => {
    setEditingMarket(market);
    setFormData({
      name: market.name,
      address: market.address,
      operatingDays: [...market.operatingDays],
      startTime: market.startTime || '08:00 AM',
      endTime: market.endTime || '02:00 PM',
      farmersCount: market.farmersCount,
      status: market.status,
      lat: market.lat || '45.5152',
      lng: market.lng || '-122.6784',
      description: market.area || ''
    });
    setIsFormModalOpen(true);
  };

  // Handle Toggle Day
  const handleToggleDay = (day) => {
    setFormData((prev) => {
      const exists = prev.operatingDays.includes(day);
      if (exists) {
        if (prev.operatingDays.length === 1) return prev; // Keep at least one
        return { ...prev, operatingDays: prev.operatingDays.filter((d) => d !== day) };
      } else {
        return { ...prev, operatingDays: [...prev.operatingDays, day] };
      }
    });
  };

  // Load live markets from backend
  useEffect(() => {
    adminApi.getMarkets()
      .then((res) => {
        if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
          const mapped = res.data.map((m) => ({
            id: m.id,
            name: m.market_name || m.name,
            area: m.location || m.area || 'Regional Pavilion Hub',
            address: m.address || m.location || '',
            operatingDays: m.operating_days || ['Saturday'],
            timings: m.timings || `${m.start_time || '08:00 AM'} – ${m.end_time || '02:00 PM'}`,
            startTime: m.start_time || '08:00 AM',
            endTime: m.end_time || '02:00 PM',
            farmersCount: m.farmers_count || 20,
            status: m.status ? (m.status.charAt(0).toUpperCase() + m.status.slice(1)) : 'Active',
            lat: m.latitude ? String(m.latitude) : '45.5152',
            lng: m.longitude ? String(m.longitude) : '-122.6784',
            badgeClass: 'bg-primary-fixed text-on-primary-fixed',
            image: m.image || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBBX6utvQ3xGaWuRHTzDH0bpvHJPPVXGKwmlRJkZclFyW9JmposXNsPIaGlKfbAYLjWlTj6kegD3xiXVcbwKrDbcXdl9om839D_OtCFGkQfGjruKFlwdMZbaHi9p6_fHEbYgdzibkaRDVAFTrVRiKOUa0XSheflTlbEV4iokdUWipIMFeVWXZIyaHSPRj3_a5AhBpPhI_-sqaX8mti0ZIC8RNAPRyTWVWTAz4sBygNArLrviP7I4kSL'
          }));
          setMarkets(mapped);
        }
      })
      .catch((err) => console.warn('Could not load live markets:', err));
  }, []);

  // Handle Save Form
  const handleSaveForm = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.address.trim()) {
      showToast?.('Please fill in market name and address.');
      return;
    }

    const timingStr = `${formData.startTime} – ${formData.endTime}`;
    const payload = {
      market_name: formData.name.trim(),
      address: formData.address.trim(),
      operating_days: formData.operatingDays,
      timings: timingStr,
      latitude: parseFloat(formData.lat) || 45.5152,
      longitude: parseFloat(formData.lng) || -122.6784,
      map_provider: 'openstreetmap'
    };

    if (editingMarket) {
      // Update
      try {
        await adminApi.updateMarket(editingMarket.id, payload);
      } catch (err) {
        console.warn('API updateMarket error:', err);
      }
      setMarkets((prev) =>
        prev.map((m) =>
          m.id === editingMarket.id
            ? {
                ...m,
                name: formData.name,
                address: formData.address,
                area: formData.description || m.area,
                operatingDays: formData.operatingDays,
                timings: timingStr,
                startTime: formData.startTime,
                endTime: formData.endTime,
                farmersCount: Number(formData.farmersCount) || m.farmersCount,
                status: formData.status,
                lat: formData.lat,
                lng: formData.lng
              }
            : m
        )
      );
      showToast?.(`Market "${formData.name}" successfully updated!`);
    } else {
      // Create
      let createdId = Date.now();
      try {
        const res = await adminApi.createMarket(payload);
        if (res?.data?.id) createdId = res.data.id;
      } catch (err) {
        console.warn('API createMarket error:', err);
      }
      const newM = {
        id: createdId,
        name: formData.name,
        area: formData.description || 'Regional Pavilion Hub',
        address: formData.address,
        operatingDays: formData.operatingDays,
        timings: timingStr,
        startTime: formData.startTime,
        endTime: formData.endTime,
        farmersCount: Number(formData.farmersCount) || 12,
        status: formData.status || 'Active',
        lat: formData.lat || '45.5152',
        lng: formData.lng || '-122.6784',
        badgeClass: 'bg-primary-fixed text-on-primary-fixed',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDM1BNwiasvOk6PCBQdnDuAsoLQBDrh103TT3dybKpUdiN6kDdKYVr_zaHFAylbx6yOu9JmcnXGvO_em5buUntA57uuJILMejl7yvAhL9yBbeyntF4VC15SmVwPq6ZV5omCcGgRwMEjTbeDGthb3Nkno-tl-meXs61aQJ3WdRBYGNR6y06kWAx_YGZwmpELf77FIOl3g5iQvPRcJiyoxEsAGLGLkQOE5XvT1BHVJECA3ERSC5tYtgqZ'
      };
      setMarkets((prev) => [newM, ...prev]);
      showToast?.(`Market location "${formData.name}" added to registry!`);
    }

    setIsFormModalOpen(false);
  };

  // Toggle Activate / Deactivate
  const handleToggleStatus = (market) => {
    const nextStatus = market.status === 'Active' ? 'Inactive' : 'Active';
    setMarkets((prev) =>
      prev.map((m) => (m.id === market.id ? { ...m, status: nextStatus } : m))
    );
    showToast?.(`Market "${market.name}" is now ${nextStatus}.`);
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!deleteModalMarket) return;
    try {
      await adminApi.deleteMarket(deleteModalMarket.id);
    } catch (err) {
      console.warn('API deleteMarket error:', err);
    }
    setMarkets((prev) => prev.filter((m) => m.id !== deleteModalMarket.id));
    showToast?.(`Market "${deleteModalMarket.name}" has been permanently removed.`);
    setDeleteModalMarket(null);
  };

  return (
    <div className="px-gutter py-space-lg max-w-7xl mx-auto w-full flex flex-col gap-space-lg animate-fade-in">
      
      {/* 1. Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-space-xs text-on-surface-variant font-label-sm text-xs">
            <span>PORTAL</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-primary font-bold">MARKETS REGISTRY</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg sm:text-3xl text-on-surface tracking-tight font-bold">
            Manage Markets
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant text-xs sm:text-sm">
            Add and manage farmers market locations, operating pavilions, schedules, and GPS mapping.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-space-sm">
          <button
            type="button"
            onClick={() => showToast?.('Regional pavilion map view refreshed.')}
            className="inline-flex items-center gap-2 px-space-md py-2.5 rounded-xl bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors font-label-md text-xs font-bold shadow-sm cursor-pointer border border-outline-variant/30"
          >
            <span className="material-symbols-outlined text-[18px] text-tertiary">map</span>
            <span>View Geospatial Hubs</span>
          </button>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-space-lg py-2.5 rounded-xl bg-primary text-on-primary font-label-md text-xs font-bold hover:bg-primary-container transition-colors shadow-md cursor-pointer active:scale-95"
          >
            <span className="material-symbols-outlined text-[20px]">add_location_alt</span>
            <span>+ Add Market</span>
          </button>
        </div>
      </div>

      {/* 2. Top Metric Cards Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-space-md">
        {/* Card 1 */}
        <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm flex flex-col gap-1 border border-outline-variant/30 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-[11px] uppercase tracking-wider text-on-surface-variant font-bold">
              Total Locations
            </span>
            <span className="material-symbols-outlined text-primary text-[22px]">storefront</span>
          </div>
          <span className="font-headline-md text-2xl sm:text-3xl font-bold text-on-surface">
            {metrics.total}
          </span>
          <span className="font-body-sm text-secondary flex items-center gap-1 font-bold text-xs">
            <span className="material-symbols-outlined text-[16px]">verified</span> 100% Permitted Hubs
          </span>
        </div>

        {/* Card 2 */}
        <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm flex flex-col gap-1 border border-outline-variant/30">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-[11px] uppercase tracking-wider text-primary font-bold">
              Active Pavilions
            </span>
            <span className="material-symbols-outlined text-primary text-[22px]">domain_verification</span>
          </div>
          <span className="font-headline-md text-2xl sm:text-3xl font-bold text-primary">
            {metrics.active}
          </span>
          <span className="font-body-sm text-on-surface-variant text-xs">
            Hosting weekend stalls
          </span>
        </div>

        {/* Card 3 */}
        <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm flex flex-col gap-1 border border-outline-variant/30">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-[11px] uppercase tracking-wider text-tertiary font-bold">
              Affiliated Farmers
            </span>
            <span className="material-symbols-outlined text-tertiary text-[22px]">agriculture</span>
          </div>
          <span className="font-headline-md text-2xl sm:text-3xl font-bold text-tertiary">
            {metrics.totalFarmers}
          </span>
          <span className="font-body-sm text-on-surface-variant text-xs">
            Across all weekly schedules
          </span>
        </div>

        {/* Card 4 */}
        <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm flex flex-col gap-1 border border-outline-variant/30">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-[11px] uppercase tracking-wider text-on-surface-variant font-bold">
              Public Shoppers
            </span>
            <span className="material-symbols-outlined text-secondary text-[22px]">groups</span>
          </div>
          <span className="font-headline-md text-2xl sm:text-3xl font-bold text-on-surface">
            18.4k
          </span>
          <span className="font-body-sm text-secondary flex items-center gap-1 font-bold text-xs">
            <span className="material-symbols-outlined text-[16px]">trending_up</span> +12% foot traffic
          </span>
        </div>
      </div>

      {/* 3. Search & Filters Bar */}
      <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-space-md border border-outline-variant/30">
        
        {/* Search Input */}
        <div className="relative w-full sm:w-96 flex items-center">
          <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-[20px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by market name, neighborhood, address..."
            className="w-full pl-10 pr-4 py-2 bg-surface-container-low rounded-xl font-body-sm text-xs text-on-surface placeholder:text-on-surface-variant/70 focus:outline-none focus:ring-2 focus:ring-primary border border-outline-variant/30"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 text-on-surface-variant hover:text-on-surface p-1"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mr-1">
            Status:
          </span>
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0 ${
              statusFilter === 'all'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
            }`}
          >
            All ({markets.length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('active')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0 ${
              statusFilter === 'active'
                ? 'bg-primary-fixed text-on-primary-fixed shadow-sm'
                : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
            }`}
          >
            Active ({metrics.active})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('inactive')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0 ${
              statusFilter === 'inactive'
                ? 'bg-surface-container-highest text-on-surface shadow-sm'
                : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
            }`}
          >
            Inactive ({markets.length - metrics.active})
          </button>
        </div>
      </div>

      {/* 4. Data Table Card */}
      <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 overflow-hidden flex flex-col">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[850px]">
            <thead>
              <tr className="bg-surface-container/60 text-on-surface-variant font-label-sm text-[11px] uppercase tracking-wider border-b border-outline-variant/20">
                <th className="py-3.5 px-space-md" scope="col">Market Name</th>
                <th className="py-3.5 px-space-md" scope="col">Address</th>
                <th className="py-3.5 px-space-md" scope="col">Operating Days</th>
                <th className="py-3.5 px-space-md" scope="col">Timings</th>
                <th className="py-3.5 px-space-md" scope="col">Farmers</th>
                <th className="py-3.5 px-space-md" scope="col">Status</th>
                <th className="py-3.5 px-space-md text-right" scope="col">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-high/50 text-on-surface">
              {filteredMarkets.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-14 text-center text-on-surface-variant">
                    <div className="w-16 h-16 rounded-full bg-surface-container mx-auto flex items-center justify-center mb-space-sm text-primary">
                      <span className="material-symbols-outlined text-[32px]">location_off</span>
                    </div>
                    <h3 className="font-headline-sm text-on-surface font-bold text-base">
                      No markets found matching your criteria
                    </h3>
                    <p className="text-xs text-on-surface-variant mt-1 mb-space-md max-w-sm mx-auto">
                      Try adjusting your search query, or clear active status filters to view all recorded market locations.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setStatusFilter('all');
                      }}
                      className="px-space-md py-2 rounded-xl bg-primary text-on-primary font-label-md text-xs font-bold hover:bg-primary-container transition-colors shadow-sm cursor-pointer"
                    >
                      Reset filters
                    </button>
                  </td>
                </tr>
              ) : (
                filteredMarkets.map((market) => {
                  const isActive = market.status === 'Active';

                  return (
                    <tr
                      key={market.id}
                      className={`hover:bg-surface-container-low/60 transition-colors ${
                        !isActive ? 'opacity-75 bg-surface-container-low/30' : ''
                      }`}
                    >
                      {/* Market Name & Photo */}
                      <td className="py-4 px-space-md">
                        <div className="flex items-center gap-space-sm">
                          <div className="w-10 h-10 rounded-xl bg-primary-fixed flex items-center justify-center text-primary font-bold overflow-hidden shadow-sm shrink-0">
                            {market.image ? (
                              <img
                                className="w-full h-full object-cover"
                                alt={market.name}
                                src={market.image}
                              />
                            ) : (
                              <span className="material-symbols-outlined text-[20px]">storefront</span>
                            )}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-headline-sm text-[14px] text-on-surface font-bold">
                              {market.name}
                            </span>
                            <span className="font-body-sm text-[11px] text-on-surface-variant flex items-center gap-1">
                              <span className="material-symbols-outlined text-[13px] text-primary">near_me</span>
                              {market.area}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Address */}
                      <td className="py-4 px-space-md">
                        <div className="flex items-start gap-1 max-w-[220px]">
                          <span className="material-symbols-outlined text-outline text-[15px] shrink-0 mt-0.5">place</span>
                          <span className="font-body-sm text-xs text-on-surface-variant line-clamp-2">
                            {market.address}
                          </span>
                        </div>
                      </td>

                      {/* Operating Days */}
                      <td className="py-4 px-space-md">
                        <div className="flex flex-wrap gap-1">
                          {market.operatingDays.map((day) => (
                            <span
                              key={day}
                              className="px-2 py-0.5 rounded-md bg-secondary-fixed/50 text-on-secondary-fixed-variant font-label-sm text-[10px] font-bold"
                            >
                              {day.slice(0, 3)}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Timings */}
                      <td className="py-4 px-space-md">
                        <div className="flex items-center gap-1 font-body-sm text-xs text-on-surface font-medium">
                          <span className="material-symbols-outlined text-[15px] text-tertiary">schedule</span>
                          <span>{market.timings}</span>
                        </div>
                      </td>

                      {/* Number of Farmers */}
                      <td className="py-4 px-space-md">
                        <div className="flex items-center gap-1.5">
                          <span className="px-2.5 py-1 rounded-full bg-surface-container font-label-sm text-xs font-bold text-on-surface">
                            {market.farmersCount} Farmers
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-space-md">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-label-sm text-[11px] font-bold ${
                            isActive
                              ? 'bg-primary-fixed text-on-primary-fixed'
                              : 'bg-surface-container-high text-on-surface-variant'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isActive ? 'bg-primary animate-pulse' : 'bg-outline'
                            }`}
                          ></span>
                          {market.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-space-md text-right">
                        <div className="inline-flex items-center gap-1.5 justify-end">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(market)}
                            className="p-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors cursor-pointer text-xs font-bold flex items-center gap-1"
                            title="Edit Market"
                          >
                            <span className="material-symbols-outlined text-[16px]">edit</span>
                            <span className="hidden sm:inline">Edit</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleToggleStatus(market)}
                            className={`px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer text-xs font-bold ${
                              isActive
                                ? 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
                                : 'bg-primary-fixed text-on-primary-fixed hover:bg-primary-fixed-dim'
                            }`}
                            title={isActive ? 'Deactivate' : 'Activate'}
                          >
                            {isActive ? 'Deactivate' : 'Activate'}
                          </button>

                          <button
                            type="button"
                            onClick={() => setDeleteModalMarket(market)}
                            className="p-1.5 rounded-lg bg-error-container/40 hover:bg-error-container text-error transition-colors cursor-pointer"
                            title="Delete Market"
                          >
                            <span className="material-symbols-outlined text-[16px]">delete</span>
                          </button>
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
            Showing <span className="font-bold text-on-surface">1</span> to{' '}
            <span className="font-bold text-on-surface">{filteredMarkets.length}</span> of{' '}
            <span className="font-bold text-on-surface">{markets.length}</span> locations
          </span>
          
          <div className="flex items-center gap-1 font-bold">
            <button
              type="button"
              disabled
              className="px-2.5 py-1 rounded-lg bg-surface-container-low text-on-surface-variant opacity-50 cursor-not-allowed"
            >
              Prev
            </button>
            <button
              type="button"
              className="w-7 h-7 rounded-lg bg-primary text-on-primary flex items-center justify-center font-bold"
            >
              1
            </button>
            <button
              type="button"
              disabled
              className="px-2.5 py-1 rounded-lg bg-surface-container-low text-on-surface-variant opacity-50 cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* MODAL: ADD / EDIT MARKET FORM                           */}
      {/* ======================================================== */}
      {isFormModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-surface-container-lowest rounded-2xl max-w-2xl w-full p-space-lg shadow-2xl flex flex-col gap-space-md border border-outline-variant/40 my-8">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-outline-variant/20 pb-space-sm">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[22px]">
                    {editingMarket ? 'edit_location' : 'add_location_alt'}
                  </span>
                </div>
                <div>
                  <h3 className="font-headline-sm text-on-surface font-bold text-lg">
                    {editingMarket ? `Edit: ${editingMarket.name}` : 'Add New Market Location'}
                  </h3>
                  <p className="font-body-sm text-on-surface-variant text-xs">
                    Configure regional pavilion details, operating timings, and coordinates.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsFormModalOpen(false)}
                className="p-1 text-on-surface-variant hover:text-on-surface rounded-lg hover:bg-surface-container cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveForm} className="flex flex-col gap-space-md text-xs">
              
              {/* Market Name & Neighborhood */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-on-surface">Market Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. South Waterfront Sunday Market"
                    className="p-2.5 bg-surface-container-low rounded-xl border border-outline-variant/40 focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-on-surface">Neighborhood / Area Description</label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="e.g. South Park Blocks & Urban Plaza"
                    className="p-2.5 bg-surface-container-low rounded-xl border border-outline-variant/40 focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>
              </div>

              {/* Physical Address */}
              <div className="flex flex-col gap-1">
                <label className="font-bold text-on-surface">Full Street Address *</label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="e.g. SW Park Ave & Montgomery St, Portland, OR 97201"
                  className="p-2.5 bg-surface-container-low rounded-xl border border-outline-variant/40 focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>

              {/* Operating Days Multi-Select */}
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-on-surface">Operating Days (Multi-Select)</label>
                <div className="flex flex-wrap gap-2">
                  {daysOfWeek.map((day) => {
                    const isSelected = formData.operatingDays.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => handleToggleDay(day)}
                        className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors cursor-pointer border ${
                          isSelected
                            ? 'bg-primary text-on-primary border-primary shadow-sm'
                            : 'bg-surface-container-low text-on-surface-variant border-outline-variant/40 hover:bg-surface-container'
                        }`}
                      >
                        {isSelected && <span className="mr-1">✓</span>}
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Timings (Start & End Time) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-md">
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-on-surface">Opening Time</label>
                  <input
                    type="text"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    placeholder="08:00 AM"
                    className="p-2.5 bg-surface-container-low rounded-xl border border-outline-variant/40 focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-on-surface">Closing Time</label>
                  <input
                    type="text"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    placeholder="02:00 PM"
                    className="p-2.5 bg-surface-container-low rounded-xl border border-outline-variant/40 focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-on-surface">Registered Farmers Stalls</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.farmersCount}
                    onChange={(e) => setFormData({ ...formData, farmersCount: e.target.value })}
                    className="p-2.5 bg-surface-container-low rounded-xl border border-outline-variant/40 focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>
              </div>

              {/* Map Location Section */}
              <div className="flex flex-col gap-2 pt-2 border-t border-outline-variant/20">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-on-surface flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px] text-primary">pin_drop</span>
                    <span>Geospatial Pin &amp; Map Coordinates</span>
                  </label>
                  <span className="text-[11px] text-on-surface-variant font-mono">
                    Lat: {formData.lat || '—'}, Lng: {formData.lng || '—'}
                  </span>
                </div>

                {/* Map Placeholder Box */}
                <div className="relative w-full h-44 rounded-xl bg-surface-container-high border-2 border-dashed border-outline-variant/60 overflow-hidden flex flex-col items-center justify-center p-4 group">
                  {/* Subtle Grid Simulation */}
                  <div
                    className="absolute inset-0 opacity-15 pointer-events-none"
                    style={{
                      backgroundImage: 'radial-gradient(circle, #2E6B3A 1px, transparent 1px)',
                      backgroundSize: '16px 16px'
                    }}
                  ></div>

                  {/* Marker Pin */}
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
                    Drag the pin or calibrate numeric latitude &amp; longitude inputs below
                  </span>
                </div>

                {/* Latitude & Longitude Input Fields */}
                <div className="grid grid-cols-2 gap-space-md mt-1">
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-bold text-on-surface-variant">Latitude</label>
                    <input
                      type="text"
                      value={formData.lat}
                      onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
                      placeholder="e.g. 45.5152"
                      className="p-2.5 bg-surface-container-low rounded-xl font-mono text-xs border border-outline-variant/40 focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-bold text-on-surface-variant">Longitude</label>
                    <input
                      type="text"
                      value={formData.lng}
                      onChange={(e) => setFormData({ ...formData, lng: e.target.value })}
                      placeholder="e.g. -122.6784"
                      className="p-2.5 bg-surface-container-low rounded-xl font-mono text-xs border border-outline-variant/40 focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Status Radio */}
              <div className="flex items-center gap-4 pt-1">
                <span className="font-bold text-on-surface">Publish Status:</span>
                <label className="flex items-center gap-1.5 cursor-pointer font-bold">
                  <input
                    type="radio"
                    name="status"
                    checked={formData.status === 'Active'}
                    onChange={() => setFormData({ ...formData, status: 'Active' })}
                    className="text-primary focus:ring-primary"
                  />
                  <span>Active</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer font-bold">
                  <input
                    type="radio"
                    name="status"
                    checked={formData.status === 'Inactive'}
                    onChange={() => setFormData({ ...formData, status: 'Inactive' })}
                    className="text-primary focus:ring-primary"
                  />
                  <span>Inactive (Seasonal / Maintenance)</span>
                </label>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end gap-space-sm pt-space-sm border-t border-outline-variant/20 mt-space-sm">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="px-space-md py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-space-lg py-2.5 rounded-xl bg-primary text-on-primary font-bold hover:bg-primary-container transition-colors shadow-md cursor-pointer"
                >
                  {editingMarket ? 'Save Changes' : 'Create Market Location'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: DELETE CONFIRMATION                              */}
      {/* ======================================================== */}
      {deleteModalMarket && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-space-lg shadow-2xl flex flex-col gap-space-md border border-outline-variant/40">
            <div className="flex items-center gap-3 text-error">
              <div className="w-12 h-12 rounded-full bg-error-container/40 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[28px] text-error">warning</span>
              </div>
              <div>
                <h3 className="font-headline-sm text-on-surface font-bold text-base">
                  Delete Market Location?
                </h3>
                <span className="font-body-sm text-on-surface-variant text-xs">
                  Irreversible platform action
                </span>
              </div>
            </div>

            <p className="font-body-sm text-on-surface-variant text-xs leading-relaxed">
              Are you sure you want to delete{' '}
              <strong className="text-on-surface font-bold">{deleteModalMarket.name}</strong>?
              This cannot be undone. All linked pre-order stall reservations and geolocation pointers will be detached.
            </p>

            <div className="flex items-center justify-end gap-space-sm pt-2 border-t border-outline-variant/20 text-xs">
              <button
                type="button"
                onClick={() => setDeleteModalMarket(null)}
                className="px-space-md py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-space-lg py-2 rounded-xl bg-error text-on-error font-bold hover:opacity-90 transition-opacity shadow-md cursor-pointer"
              >
                Delete Market
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
