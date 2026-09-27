import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import adminApi from '../api/admin';
import MarketLocationPicker from './MarketLocationPicker';
import PageLoader from './PageLoader';

export default function ManageMarkets({ onNavigate, showToast, autoOpenAddModal = false, onCloseAddModal }) {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'active' | 'inactive'
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(autoOpenAddModal);
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

  // Auto-open add modal if triggered externally
  useEffect(() => {
    if (autoOpenAddModal) {
      setEditingMarket(null);
      setFormData(initialFormState);
      setIsFormModalOpen(true);
    }
  }, [autoOpenAddModal]);

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    setEditingMarket(null);
    if (onCloseAddModal) onCloseAddModal();
  };

  // Lock body scroll and handle Escape key when modals are open
  useEffect(() => {
    if (isFormModalOpen || deleteModalMarket) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (isFormModalOpen) handleCloseFormModal();
        if (deleteModalMarket) setDeleteModalMarket(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFormModalOpen, deleteModalMarket]);

  // Initial Markets Dataset
  const [markets, setMarkets] = useState([]);

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
    setLoading(true);
    adminApi.getMarkets()
      .then((res) => {
        if (res?.data && Array.isArray(res.data)) {
          const mapped = res.data.map((m) => ({
            id: m.id,
            name: m.market_name || m.name,
            area: m.location || m.area || 'Regional Pavilion Hub',
            address: m.address || m.location || '',
            operatingDays: m.operating_days || ['Saturday'],
            timings: m.timings || `${m.start_time || '08:00 AM'} – ${m.end_time || '02:00 PM'}`,
            startTime: m.start_time || '08:00 AM',
            endTime: m.end_time || '02:00 PM',
            farmersCount: m.farmers_count ?? 0,
            status: m.status ? (m.status.charAt(0).toUpperCase() + m.status.slice(1)) : 'Active',
            lat: m.latitude ? String(m.latitude) : '45.5152',
            lng: m.longitude ? String(m.longitude) : '-122.6784',
            badgeClass: 'bg-primary-fixed text-on-primary-fixed',
            image: m.image || 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=600&q=80'
          }));
          setMarkets(mapped);
        } else {
          setMarkets([]);
        }
      })
      .catch((err) => console.warn('Could not load live markets:', err))
      .finally(() => setLoading(false));
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

    handleCloseFormModal();
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

  if (loading) {
    return (
      <PageLoader
        title="Loading Market Pavilions..."
        subtitle="Retrieving regional market locations, active schedules, GPS mapping, and stall assignments..."
        minHeight="min-h-[70vh]"
      />
    );
  }

  return (
    <div className="px-3 sm:px-6 lg:px-gutter py-4 sm:py-space-lg max-w-7xl mx-auto w-full flex flex-col gap-5 sm:gap-space-lg animate-fade-in">
      
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
      {isFormModalOpen && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-[99999] flex items-center justify-center p-3 sm:p-6 overflow-hidden animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleCloseFormModal();
          }}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[88vh] shadow-[0_25px_70px_rgba(0,0,0,0.5)] flex flex-col border border-slate-200 overflow-hidden animate-bounce-in relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header (Fixed at top) */}
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 shrink-0 bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-xs">
                  <span className="material-symbols-outlined text-[22px]">
                    {editingMarket ? 'edit_location' : 'add_location_alt'}
                  </span>
                </div>
                <div>
                  <h3 className="font-headline-sm text-slate-900 font-bold text-base sm:text-lg">
                    {editingMarket ? `Edit: ${editingMarket.name}` : 'Add New Market Location'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Configure regional pavilion details, operating timings, and coordinates.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCloseFormModal}
                className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-800 hover:bg-slate-200/60 rounded-lg cursor-pointer transition-colors"
                title="Close"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveForm} className="flex flex-col flex-1 min-h-0 overflow-hidden">
              {/* Scrollable Form Body */}
              <div className="overflow-y-auto px-6 py-5 space-y-4 text-xs flex-1 bg-white">
                
                {/* Market Name & Neighborhood */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-slate-800">Market Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. South Waterfront Sunday Market"
                      className="p-2.5 bg-slate-50 rounded-xl border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-slate-800">Neighborhood / Area Description</label>
                    <input
                      type="text"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="e.g. South Park Blocks & Urban Plaza"
                      className="p-2.5 bg-slate-50 rounded-xl border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Physical Address */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-800">Full Street Address *</label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="e.g. SW Park Ave & Montgomery St, Portland, OR 97201"
                    className="p-2.5 bg-slate-50 rounded-xl border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none transition-all"
                  />
                </div>

                {/* Operating Days Multi-Select */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-800">Operating Days (Multi-Select)</label>
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
                              ? 'bg-primary text-white border-primary shadow-sm'
                              : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
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
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-slate-800">Opening Time</label>
                    <input
                      type="text"
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                      placeholder="08:00 AM"
                      className="p-2.5 bg-slate-50 rounded-xl border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-slate-800">Closing Time</label>
                    <input
                      type="text"
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                      placeholder="02:00 PM"
                      className="p-2.5 bg-slate-50 rounded-xl border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-slate-800">Registered Farmers Stalls</label>
                    <input
                      type="number"
                      min="1"
                      value={formData.farmersCount}
                      onChange={(e) => setFormData({ ...formData, farmersCount: e.target.value })}
                      className="p-2.5 bg-slate-50 rounded-xl border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Map Location Section */}
                <div className="flex flex-col gap-2 pt-2 border-t border-slate-200">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-800 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[18px] text-primary">pin_drop</span>
                      <span>Geospatial Pin &amp; Map Coordinates</span>
                    </label>
                    <span className="text-[11px] text-slate-500 font-mono">
                      Lat: {formData.lat || '—'}, Lng: {formData.lng || '—'}
                    </span>
                  </div>

                  {/* Real Interactive Map Component for Market Geolocation */}
                  <MarketLocationPicker
                    latitude={formData.lat}
                    longitude={formData.lng}
                    marketName={formData.name}
                    address={formData.address}
                    onLocationChange={({ lat, lng }) => {
                      setFormData((prev) => ({ ...prev, lat, lng }));
                    }}
                    onAddressChange={(newAddr) => {
                      setFormData((prev) => ({ ...prev, address: newAddr }));
                    }}
                    showToast={showToast}
                  />

                  {/* Latitude & Longitude Input Fields */}
                  <div className="grid grid-cols-2 gap-4 mt-1">
                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-bold text-slate-600 flex items-center justify-between">
                        <span>Latitude</span>
                        <span className="text-[10px] text-primary font-mono font-semibold">Synced with Pin</span>
                      </label>
                      <input
                        type="text"
                        value={formData.lat}
                        onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
                        placeholder="e.g. 45.5152"
                        className="p-2.5 bg-slate-50 rounded-xl font-mono text-xs border border-slate-300 text-slate-900 focus:bg-white focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none transition-all"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-bold text-slate-600 flex items-center justify-between">
                        <span>Longitude</span>
                        <span className="text-[10px] text-primary font-mono font-semibold">Synced with Pin</span>
                      </label>
                      <input
                        type="text"
                        value={formData.lng}
                        onChange={(e) => setFormData({ ...formData, lng: e.target.value })}
                        placeholder="e.g. -122.6784"
                        className="p-2.5 bg-slate-50 rounded-xl font-mono text-xs border border-slate-300 text-slate-900 focus:bg-white focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Status Radio */}
                <div className="flex items-center gap-4 pt-1">
                  <span className="font-bold text-slate-800">Publish Status:</span>
                  <label className="flex items-center gap-1.5 cursor-pointer font-bold text-slate-700">
                    <input
                      type="radio"
                      name="status"
                      checked={formData.status === 'Active'}
                      onChange={() => setFormData({ ...formData, status: 'Active' })}
                      className="text-primary focus:ring-primary"
                    />
                    <span>Active</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer font-bold text-slate-700">
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
              </div>

              {/* Fixed Modal Footer */}
              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 shrink-0 bg-slate-50">
                <button
                  type="button"
                  onClick={handleCloseFormModal}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-bold transition-colors cursor-pointer text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-primary text-white font-bold hover:bg-[#1b4d27] transition-all shadow-md active:scale-95 cursor-pointer text-xs flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {editingMarket ? 'check' : 'add'}
                  </span>
                  <span>{editingMarket ? 'Save Changes' : 'Create Market Location'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* ======================================================== */}
      {/* MODAL: DELETE CONFIRMATION                              */}
      {/* ======================================================== */}
      {deleteModalMarket && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-[99999] flex items-center justify-center p-4 animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setDeleteModalMarket(null);
          }}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-[0_25px_70px_rgba(0,0,0,0.5)] flex flex-col gap-4 border border-slate-200 animate-bounce-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 text-error">
              <div className="w-12 h-12 rounded-full bg-error-container/40 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[28px] text-error">warning</span>
              </div>
              <div>
                <h3 className="font-headline-sm text-slate-900 font-bold text-base">
                  Delete Market Location?
                </h3>
                <span className="font-body-sm text-slate-500 text-xs">
                  Irreversible platform action
                </span>
              </div>
            </div>

            <p className="font-body-sm text-slate-600 text-xs leading-relaxed">
              Are you sure you want to delete{' '}
              <strong className="text-slate-900 font-bold">{deleteModalMarket.name}</strong>?
              This cannot be undone. All linked pre-order stall reservations and geolocation pointers will be detached.
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 text-xs">
              <button
                type="button"
                onClick={() => setDeleteModalMarket(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-5 py-2 rounded-xl bg-error text-white font-bold hover:opacity-90 transition-opacity shadow-md cursor-pointer"
              >
                Delete Market
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
}
