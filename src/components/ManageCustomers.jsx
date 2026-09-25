import React, { useState, useMemo, useEffect } from 'react';
import adminApi from '../api/admin';

export default function ManageCustomers({ onNavigate, showToast }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'active' | 'suspended'
  const [tierFilter, setTierFilter] = useState('all'); // 'all' | 'vip' | 'regular' | 'ebt'
  
  // Modals state
  const [viewCustomerModal, setViewCustomerModal] = useState(null);
  const [addCustomerModalOpen, setAddCustomerModalOpen] = useState(false);
  const [suspendModalCustomer, setSuspendModalCustomer] = useState(null);
  const [deleteModalCustomer, setDeleteModalCustomer] = useState(null);

  // New Customer Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    neighborhood: '',
    preferredMarket: 'Downtown Saturday Market',
    tier: 'Regular Shopper'
  });

  // Sample Customers Dataset
  const [customers, setCustomers] = useState([
    {
      id: 1,
      name: 'Elena Rostova',
      initials: 'ER',
      email: 'elena.rostova@gmail.com',
      phone: '(503) 555-0144',
      neighborhood: 'South Park Blocks',
      preferredMarket: 'Downtown Saturday Market',
      joinedDate: 'Mar 14, 2024',
      totalOrders: 28,
      totalSpent: '$940.50',
      status: 'active',
      tier: 'VIP Harvest Club',
      tierBadge: 'bg-tertiary-fixed text-on-tertiary-fixed',
      avatarColor: 'bg-primary-fixed text-on-primary-fixed',
      recentOrders: [
        { id: '#ML-8920', date: 'Oct 18, 2025', farm: 'Green Pastures Organic', amount: '$34.00', status: 'Ready for Pickup' },
        { id: '#ML-8841', date: 'Oct 11, 2025', farm: 'Miller & Stone Hearth', amount: '$22.50', status: 'Collected' },
        { id: '#ML-8712', date: 'Oct 04, 2025', farm: 'Sunrise Orchard', amount: '$41.20', status: 'Collected' }
      ]
    },
    {
      id: 2,
      name: 'Samuel Chen',
      initials: 'SC',
      email: 'samuel.chen@techpdx.io',
      phone: '(503) 555-0812',
      neighborhood: 'East River District',
      preferredMarket: 'Riverside Twilight Market',
      joinedDate: 'Jun 22, 2024',
      totalOrders: 19,
      totalSpent: '$615.00',
      status: 'active',
      tier: 'Regular Shopper',
      tierBadge: 'bg-surface-container text-on-surface',
      avatarColor: 'bg-secondary-fixed text-on-secondary-fixed',
      recentOrders: [
        { id: '#ML-8918', date: 'Oct 18, 2025', farm: 'Mountain View Orchard', amount: '$45.50', status: 'Collected' },
        { id: '#ML-8805', date: 'Sep 28, 2025', farm: 'Pine Ridge Apiary', amount: '$24.00', status: 'Collected' }
      ]
    },
    {
      id: 3,
      name: 'Maya Lin',
      initials: 'ML',
      email: 'maya.lin@westportland.org',
      phone: '(503) 555-0377',
      neighborhood: 'West Hills',
      preferredMarket: 'Pioneer Pavilion',
      joinedDate: 'Jan 08, 2025',
      totalOrders: 14,
      totalSpent: '$420.00',
      status: 'active',
      tier: 'SNAP / EBT Participant',
      tierBadge: 'bg-primary-fixed text-on-primary-fixed',
      avatarColor: 'bg-primary text-on-primary',
      recentOrders: [
        { id: '#ML-8917', date: 'Oct 18, 2025', farm: 'Old Mill Hearth Bakery', amount: '$27.00', status: 'Pending Pack' },
        { id: '#ML-8819', date: 'Oct 11, 2025', farm: 'Whispering Pines Herbs', amount: '$18.50', status: 'Collected' }
      ]
    },
    {
      id: 4,
      name: 'Marcus Brody',
      initials: 'MB',
      email: 'm_brody@northpdx.net',
      phone: '(503) 555-0929',
      neighborhood: 'Oak Valley Ridge',
      preferredMarket: 'Oak Valley Sunday',
      joinedDate: 'Aug 19, 2024',
      totalOrders: 22,
      totalSpent: '$780.00',
      status: 'active',
      tier: 'VIP Harvest Club',
      tierBadge: 'bg-tertiary-fixed text-on-tertiary-fixed',
      avatarColor: 'bg-tertiary-fixed text-on-tertiary-fixed',
      recentOrders: [
        { id: '#ML-8899', date: 'Oct 12, 2025', farm: 'Highland Berry Co.', amount: '$38.00', status: 'Collected' }
      ]
    },
    {
      id: 5,
      name: 'Danielle Cooper',
      initials: 'DC',
      email: 'dani.cooper@alumni.uoregon.edu',
      phone: '(503) 555-0655',
      neighborhood: 'Central Plaza',
      preferredMarket: 'Pioneer Pavilion',
      joinedDate: 'Apr 02, 2024',
      totalOrders: 31,
      totalSpent: '$1,120.00',
      status: 'active',
      tier: 'VIP Harvest Club',
      tierBadge: 'bg-tertiary-fixed text-on-tertiary-fixed',
      avatarColor: 'bg-secondary-fixed text-on-secondary-fixed',
      recentOrders: [
        { id: '#ML-8910', date: 'Oct 18, 2025', farm: 'Riverbend Goat Dairy', amount: '$52.00', status: 'Ready for Pickup' }
      ]
    },
    {
      id: 6,
      name: 'Brett "AngryShopper" K.',
      initials: 'BK',
      email: 'brett_k_pdx@outlook.com',
      phone: '(503) 555-0188',
      neighborhood: 'North Waterfront',
      preferredMarket: 'Downtown Saturday Market',
      joinedDate: 'Oct 05, 2025',
      totalOrders: 1,
      totalSpent: '$12.00',
      status: 'suspended',
      tier: 'Regular Shopper',
      tierBadge: 'bg-surface-container text-on-surface',
      avatarColor: 'bg-error-container text-on-error-container',
      recentOrders: [
        { id: '#ML-8801', date: 'Oct 05, 2025', farm: 'Green Pastures Organic', amount: '$12.00', status: 'Disputed' }
      ]
    }
  ]);

  // Metrics
  const metrics = useMemo(() => {
    const total = customers.length;
    const active = customers.filter((c) => c.status === 'active').length;
    const ebtCount = customers.filter((c) => c.tier.includes('SNAP') || c.tier.includes('EBT')).length;
    const vipCount = customers.filter((c) => c.tier.includes('VIP')).length;
    return { total, active, ebtCount, vipCount };
  }, [customers]);

  // Filtered Customers
  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const matchSearch =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.neighborhood.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.phone.includes(searchQuery);

      const matchStatus =
        statusFilter === 'all'
          ? true
          : statusFilter === 'active'
          ? c.status === 'active'
          : c.status === 'suspended';

      const matchTier =
        tierFilter === 'all'
          ? true
          : tierFilter === 'vip'
          ? c.tier.includes('VIP')
          : tierFilter === 'ebt'
          ? c.tier.includes('SNAP')
          : !c.tier.includes('VIP') && !c.tier.includes('SNAP');

      return matchSearch && matchStatus && matchTier;
    });
  }, [customers, searchQuery, statusFilter, tierFilter]);

  // Load live customers from backend
  useEffect(() => {
    adminApi.getCustomers()
      .then((res) => {
        if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
          const mapped = res.data.map((c) => ({
            id: c.id,
            name: c.name,
            initials: c.name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase(),
            email: c.email,
            phone: c.phone || '(503) 555-0199',
            neighborhood: c.address || 'Portland Metro',
            preferredMarket: 'Downtown Saturday Market',
            joinedDate: c.created_at ? new Date(c.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Mar 14, 2024',
            totalOrders: 14,
            totalSpent: '$420.00',
            status: c.status || 'active',
            tier: 'Regular Shopper',
            tierBadge: 'bg-surface-container text-on-surface',
            avatarColor: 'bg-primary-fixed text-on-primary-fixed',
            recentOrders: []
          }));
          setCustomers(mapped);
        }
      })
      .catch((err) => console.warn('Could not load live customers:', err));
  }, []);

  // Toggle Suspend / Reactivate
  const handleToggleSuspend = async (customer) => {
    const nextStatus = customer.status === 'active' ? 'suspended' : 'active';
    try {
      await adminApi.updateCustomerStatus(customer.id, nextStatus);
    } catch (e) {
      console.warn('API updateCustomerStatus error:', e);
    }
    setCustomers((prev) =>
      prev.map((c) => (c.id === customer.id ? { ...c, status: nextStatus } : c))
    );
    showToast?.(`Customer account for "${customer.name}" is now ${nextStatus}.`);
    setSuspendModalCustomer(null);
  };

  // Confirm Delete
  const handleConfirmDelete = () => {
    if (!deleteModalCustomer) return;
    setCustomers((prev) => prev.filter((c) => c.id !== deleteModalCustomer.id));
    showToast?.(`Customer account for "${deleteModalCustomer.name}" permanently deleted.`);
    setDeleteModalCustomer(null);
  };

  // Handle Save New Customer
  const handleSaveCustomer = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      showToast?.('Please enter name and email.');
      return;
    }

    const nameParts = formData.name.trim().split(' ');
    const initials = nameParts.length > 1 ? `${nameParts[0][0]}${nameParts[1][0]}` : nameParts[0][0];

    const newCust = {
      id: Date.now(),
      name: formData.name.trim(),
      initials: initials.toUpperCase(),
      email: formData.email.trim(),
      phone: formData.phone.trim() || '(503) 555-0100',
      neighborhood: formData.neighborhood.trim() || 'Central District',
      preferredMarket: formData.preferredMarket,
      joinedDate: 'Today',
      totalOrders: 0,
      totalSpent: '$0.00',
      status: 'active',
      tier: formData.tier,
      tierBadge: formData.tier.includes('VIP')
        ? 'bg-tertiary-fixed text-on-tertiary-fixed'
        : formData.tier.includes('SNAP')
        ? 'bg-primary-fixed text-on-primary-fixed'
        : 'bg-surface-container text-on-surface',
      avatarColor: 'bg-primary-fixed text-on-primary-fixed',
      recentOrders: []
    };

    setCustomers([newCust, ...customers]);
    setAddCustomerModalOpen(false);
    showToast?.(`Customer "${formData.name}" added to portal!`);
    setFormData({
      name: '',
      email: '',
      phone: '',
      neighborhood: '',
      preferredMarket: 'Downtown Saturday Market',
      tier: 'Regular Shopper'
    });
  };

  return (
    <div className="px-gutter py-space-lg max-w-7xl mx-auto w-full flex flex-col gap-space-lg animate-fade-in">
      
      {/* 1. Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-space-xs text-on-surface-variant font-label-sm text-xs">
            <span>PORTAL</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-primary font-bold">SHOPPER REGISTRY</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg sm:text-3xl text-on-surface tracking-tight font-bold">
            Manage Customers
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant text-xs sm:text-sm">
            View and manage registered shoppers, reservation histories, account statuses, and community loyalty tiers.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-space-sm">
          <button
            type="button"
            onClick={() => showToast?.('Customer roster exported to CSV (4,120 records).')}
            className="inline-flex items-center gap-2 px-space-md py-2.5 rounded-xl bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors font-label-md text-xs font-bold shadow-sm cursor-pointer border border-outline-variant/30"
          >
            <span className="material-symbols-outlined text-[18px] text-tertiary">file_download</span>
            <span>Export Customers (CSV)</span>
          </button>

          <button
            type="button"
            onClick={() => setAddCustomerModalOpen(true)}
            className="inline-flex items-center gap-2 px-space-lg py-2.5 rounded-xl bg-primary text-on-primary font-label-md text-xs font-bold hover:bg-primary-container transition-colors shadow-md cursor-pointer active:scale-95"
          >
            <span className="material-symbols-outlined text-[20px]">person_add</span>
            <span>+ Add Customer</span>
          </button>
        </div>
      </div>

      {/* 2. Metrics Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-space-md">
        {/* Card 1 */}
        <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm flex flex-col gap-1 border border-outline-variant/30 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-[11px] uppercase tracking-wider text-on-surface-variant font-bold">
              Total Shoppers
            </span>
            <span className="material-symbols-outlined text-primary text-[22px]">groups</span>
          </div>
          <span className="font-headline-md text-2xl sm:text-3xl font-bold text-on-surface">
            {metrics.total}
          </span>
          <span className="font-body-sm text-secondary flex items-center gap-1 font-bold text-xs">
            <span className="material-symbols-outlined text-[16px]">trending_up</span> +230 this month
          </span>
        </div>

        {/* Card 2 */}
        <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm flex flex-col gap-1 border border-outline-variant/30">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-[11px] uppercase tracking-wider text-primary font-bold">
              Active Accounts
            </span>
            <span className="material-symbols-outlined text-primary text-[22px]">verified_user</span>
          </div>
          <span className="font-headline-md text-2xl sm:text-3xl font-bold text-primary">
            {metrics.active}
          </span>
          <span className="font-body-sm text-on-surface-variant text-xs">
            In good standing
          </span>
        </div>

        {/* Card 3 */}
        <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm flex flex-col gap-1 border border-outline-variant/30">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-[11px] uppercase tracking-wider text-tertiary font-bold">
              VIP Harvest Club
            </span>
            <span className="material-symbols-outlined text-tertiary text-[22px]">workspace_premium</span>
          </div>
          <span className="font-headline-md text-2xl sm:text-3xl font-bold text-tertiary">
            {metrics.vipCount}
          </span>
          <span className="font-body-sm text-on-surface-variant text-xs">
            Frequent pre-orderers
          </span>
        </div>

        {/* Card 4 */}
        <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm flex flex-col gap-1 border border-outline-variant/30">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-[11px] uppercase tracking-wider text-secondary font-bold">
              SNAP / EBT Users
            </span>
            <span className="material-symbols-outlined text-secondary text-[22px]">toll</span>
          </div>
          <span className="font-headline-md text-2xl sm:text-3xl font-bold text-on-surface">
            {metrics.ebtCount}
          </span>
          <span className="font-body-sm text-secondary flex items-center gap-1 font-bold text-xs">
            <span className="material-symbols-outlined text-[16px]">redeem</span> Token Match Eligible
          </span>
        </div>
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-space-md border border-outline-variant/30">
        
        {/* Search */}
        <div className="relative w-full sm:w-80 flex items-center">
          <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-[18px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search shopper name, email, phone..."
            className="w-full pl-9 pr-4 py-2 bg-surface-container-low rounded-xl font-body-sm text-xs text-on-surface placeholder:text-on-surface-variant/70 focus:outline-none focus:ring-2 focus:ring-primary border border-outline-variant/30"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 text-on-surface-variant hover:text-on-surface p-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[15px]">close</span>
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 text-xs">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-surface-container text-on-surface font-bold border border-outline-variant/30 focus:outline-none cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="suspended">Suspended Only</option>
          </select>

          <select
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-surface-container text-on-surface font-bold border border-outline-variant/30 focus:outline-none cursor-pointer"
          >
            <option value="all">All Tiers</option>
            <option value="vip">VIP Harvest Club</option>
            <option value="ebt">SNAP / EBT Users</option>
            <option value="regular">Regular Shoppers</option>
          </select>
        </div>
      </div>

      {/* 4. Customers Table */}
      <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 overflow-hidden flex flex-col">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[850px]">
            <thead>
              <tr className="bg-surface-container/60 text-on-surface-variant font-label-sm text-[11px] uppercase tracking-wider border-b border-outline-variant/20">
                <th className="py-3.5 px-space-md" scope="col">Shopper Name</th>
                <th className="py-3.5 px-space-md" scope="col">Contact &amp; Area</th>
                <th className="py-3.5 px-space-md" scope="col">Preferred Market</th>
                <th className="py-3.5 px-space-md" scope="col">Reservations</th>
                <th className="py-3.5 px-space-md" scope="col">Loyalty Tier</th>
                <th className="py-3.5 px-space-md" scope="col">Status</th>
                <th className="py-3.5 px-space-md text-right" scope="col">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-high/50 text-on-surface text-xs">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-14 text-center text-on-surface-variant">
                    <div className="w-16 h-16 rounded-full bg-surface-container mx-auto flex items-center justify-center mb-space-sm text-primary">
                      <span className="material-symbols-outlined text-[32px]">person_search</span>
                    </div>
                    <h3 className="font-headline-sm text-on-surface font-bold text-base">
                      No shoppers found
                    </h3>
                    <p className="text-xs text-on-surface-variant mt-1 mb-space-md">
                      Try adjusting your search criteria or resetting filters.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setStatusFilter('all');
                        setTierFilter('all');
                      }}
                      className="px-space-md py-2 rounded-xl bg-primary text-on-primary font-bold shadow-sm cursor-pointer"
                    >
                      Clear Filters
                    </button>
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => {
                  const isActive = cust.status === 'active';

                  return (
                    <tr
                      key={cust.id}
                      className={`hover:bg-surface-container-low/60 transition-colors ${
                        !isActive ? 'opacity-70 bg-error-container/10' : ''
                      }`}
                    >
                      {/* Name & Initials */}
                      <td className="py-4 px-space-md">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${cust.avatarColor}`}
                          >
                            {cust.initials}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-headline-sm text-xs font-bold text-on-surface">
                              {cust.name}
                            </span>
                            <span className="text-[11px] text-on-surface-variant">
                              Joined {cust.joinedDate}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Contact & Area */}
                      <td className="py-4 px-space-md">
                        <div className="flex flex-col max-w-[200px]">
                          <span className="text-xs text-on-surface font-medium truncate">{cust.email}</span>
                          <span className="text-[11px] text-on-surface-variant flex items-center gap-1">
                            <span className="material-symbols-outlined text-[13px] text-primary">place</span>
                            {cust.neighborhood}
                          </span>
                        </div>
                      </td>

                      {/* Preferred Market */}
                      <td className="py-4 px-space-md">
                        <span className="px-2.5 py-1 rounded-md bg-surface-container font-label-sm text-[11px] font-bold text-on-surface">
                          {cust.preferredMarket}
                        </span>
                      </td>

                      {/* Total Reservations */}
                      <td className="py-4 px-space-md">
                        <div className="flex flex-col">
                          <span className="font-bold text-primary">{cust.totalOrders} pre-orders</span>
                          <span className="text-[11px] text-on-surface-variant font-mono">{cust.totalSpent} total</span>
                        </div>
                      </td>

                      {/* Loyalty Tier */}
                      <td className="py-4 px-space-md">
                        <span className={`px-2.5 py-1 rounded-full font-label-sm text-[11px] font-bold ${cust.tierBadge}`}>
                          {cust.tier}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-space-md">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-label-sm text-[11px] font-bold ${
                            isActive
                              ? 'bg-primary-fixed text-on-primary-fixed'
                              : 'bg-error-container text-on-error-container'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isActive ? 'bg-primary animate-pulse' : 'bg-error'
                            }`}
                          ></span>
                          {isActive ? 'Active' : 'Suspended'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-space-md text-right">
                        <div className="inline-flex items-center gap-1.5 justify-end">
                          <button
                            type="button"
                            onClick={() => setViewCustomerModal(cust)}
                            className="px-2.5 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <span className="material-symbols-outlined text-[15px]">history</span>
                            <span>Orders</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setSuspendModalCustomer(cust)}
                            className={`px-2.5 py-1.5 rounded-lg font-bold text-xs cursor-pointer transition-colors ${
                              isActive
                                ? 'bg-surface-container text-tertiary hover:bg-tertiary-fixed'
                                : 'bg-primary-fixed text-on-primary-fixed hover:bg-primary-fixed-dim'
                            }`}
                          >
                            {isActive ? 'Suspend' : 'Reactivate'}
                          </button>

                          <button
                            type="button"
                            onClick={() => setDeleteModalCustomer(cust)}
                            className="p-1.5 rounded-lg bg-error-container/40 hover:bg-error-container text-error cursor-pointer"
                            title="Delete Shopper Account"
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

        {/* Footer */}
        <div className="p-space-md bg-surface-container/40 flex items-center justify-between border-t border-outline-variant/20 text-xs">
          <span className="font-body-sm text-on-surface-variant">
            Showing <span className="font-bold text-on-surface">{filteredCustomers.length}</span> of{' '}
            <span className="font-bold text-on-surface">{customers.length}</span> shopper accounts
          </span>
          <span className="font-body-sm text-on-surface-variant font-bold">
            Community Food Access Program Active
          </span>
        </div>
      </div>

      {/* ======================================================== */}
      {/* MODAL: VIEW CUSTOMER & ORDER HISTORY                    */}
      {/* ======================================================== */}
      {viewCustomerModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-surface-container-lowest rounded-2xl max-w-xl w-full p-space-lg shadow-2xl flex flex-col gap-space-md border border-outline-variant/40">
            <div className="flex items-start justify-between border-b border-outline-variant/20 pb-space-sm">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-base ${viewCustomerModal.avatarColor}`}
                >
                  {viewCustomerModal.initials}
                </div>
                <div>
                  <h3 className="font-headline-sm text-on-surface font-bold text-base">
                    {viewCustomerModal.name}
                  </h3>
                  <span className="text-[11px] text-on-surface-variant">
                    {viewCustomerModal.email} • {viewCustomerModal.phone}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setViewCustomerModal(null)}
                className="p-1 text-on-surface-variant hover:text-on-surface rounded-lg cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Profile Overview Strip */}
            <div className="grid grid-cols-3 gap-2 p-3 bg-surface-container-low rounded-xl text-center text-xs">
              <div>
                <span className="text-[10px] uppercase text-on-surface-variant font-bold">Tier</span>
                <p className="font-bold text-primary mt-0.5">{viewCustomerModal.tier}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase text-on-surface-variant font-bold">Reservations</span>
                <p className="font-bold text-on-surface mt-0.5">{viewCustomerModal.totalOrders} fulfilled</p>
              </div>
              <div>
                <span className="text-[10px] uppercase text-on-surface-variant font-bold">Gross Volume</span>
                <p className="font-bold text-on-surface mt-0.5">{viewCustomerModal.totalSpent}</p>
              </div>
            </div>

            {/* Order History */}
            <div className="flex flex-col gap-2">
              <h4 className="font-bold text-xs text-on-surface">Recent Reservation Slips</h4>
              {viewCustomerModal.recentOrders.length === 0 ? (
                <p className="text-xs text-on-surface-variant italic">No order reservations recorded yet.</p>
              ) : (
                <div className="flex flex-col gap-1.5">
                  {viewCustomerModal.recentOrders.map((ord, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-surface-container flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-primary">{ord.id}</span>
                        <span className="text-on-surface-variant">• {ord.farm}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-on-surface">{ord.amount}</span>
                        <span className="px-2 py-0.5 rounded-md bg-primary-fixed text-on-primary-fixed text-[10px] font-bold">
                          {ord.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2 border-t border-outline-variant/20">
              <button
                type="button"
                onClick={() => setViewCustomerModal(null)}
                className="px-space-md py-2 rounded-xl bg-primary text-on-primary font-bold text-xs cursor-pointer shadow-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ADD CUSTOMER                                      */}
      {/* ======================================================== */}
      {addCustomerModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-space-lg shadow-2xl flex flex-col gap-space-md border border-outline-variant/40">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-space-sm">
              <h3 className="font-headline-sm text-on-surface font-bold text-base">
                + Register New Customer
              </h3>
              <button
                type="button"
                onClick={() => setAddCustomerModalOpen(false)}
                className="p-1 text-on-surface-variant hover:text-on-surface rounded-lg cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveCustomer} className="flex flex-col gap-space-md text-xs">
              <div className="flex flex-col gap-1">
                <label className="font-bold text-on-surface">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Jordan Miller"
                  className="p-2.5 bg-surface-container-low rounded-xl border border-outline-variant/40 focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-on-surface">Email Address *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. jordan@pdxmail.com"
                  className="p-2.5 bg-surface-container-low rounded-xl border border-outline-variant/40 focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-space-md">
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-on-surface">Phone Number</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="(503) 555-0100"
                    className="p-2.5 bg-surface-container-low rounded-xl border border-outline-variant/40 focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-on-surface">Neighborhood</label>
                  <input
                    type="text"
                    value={formData.neighborhood}
                    onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                    placeholder="e.g. South Park"
                    className="p-2.5 bg-surface-container-low rounded-xl border border-outline-variant/40 focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-on-surface">Community Loyalty Tier</label>
                <select
                  value={formData.tier}
                  onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
                  className="p-2.5 bg-surface-container-low rounded-xl border border-outline-variant/40 focus:ring-2 focus:ring-primary focus:outline-none font-bold"
                >
                  <option>Regular Shopper</option>
                  <option>VIP Harvest Club</option>
                  <option>SNAP / EBT Participant</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-space-sm pt-2 border-t border-outline-variant/20">
                <button
                  type="button"
                  onClick={() => setAddCustomerModalOpen(false)}
                  className="px-space-md py-2 rounded-xl bg-surface-container text-on-surface font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-space-lg py-2 rounded-xl bg-primary text-on-primary font-bold hover:bg-primary-container shadow-sm cursor-pointer"
                >
                  Create Shopper
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: SUSPEND / REACTIVATE CONFIRMATION                */}
      {/* ======================================================== */}
      {suspendModalCustomer && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-surface-container-lowest rounded-2xl max-w-sm w-full p-space-lg shadow-2xl flex flex-col gap-space-md border border-outline-variant/40 text-xs">
            <div className="flex items-center gap-2.5 text-tertiary">
              <span className="material-symbols-outlined text-[24px]">gavel</span>
              <h3 className="font-headline-sm text-on-surface font-bold text-base">
                {suspendModalCustomer.status === 'active' ? 'Suspend Account?' : 'Reactivate Account?'}
              </h3>
            </div>
            <p className="text-on-surface-variant leading-relaxed">
              Are you sure you want to {suspendModalCustomer.status === 'active' ? 'suspend' : 'reactivate'} the shopper profile for{' '}
              <strong className="text-on-surface font-bold">{suspendModalCustomer.name}</strong>?
            </p>
            <div className="flex justify-end gap-2 pt-2 border-t border-outline-variant/20">
              <button
                type="button"
                onClick={() => setSuspendModalCustomer(null)}
                className="px-3 py-1.5 rounded-lg bg-surface-container font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleToggleSuspend(suspendModalCustomer)}
                className="px-4 py-1.5 rounded-lg bg-primary text-on-primary font-bold cursor-pointer"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: DELETE CUSTOMER CONFIRMATION                     */}
      {/* ======================================================== */}
      {deleteModalCustomer && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-surface-container-lowest rounded-2xl max-w-sm w-full p-space-lg shadow-2xl flex flex-col gap-space-md border border-outline-variant/40 text-xs">
            <div className="flex items-center gap-2.5 text-error">
              <span className="material-symbols-outlined text-[24px]">delete_forever</span>
              <h3 className="font-headline-sm text-on-surface font-bold text-base">
                Delete Customer?
              </h3>
            </div>
            <p className="text-on-surface-variant leading-relaxed">
              Are you sure you want to delete <strong className="text-on-surface">{deleteModalCustomer.name}</strong>? All past reservation slips and loyalty points will be wiped.
            </p>
            <div className="flex justify-end gap-2 pt-2 border-t border-outline-variant/20">
              <button
                type="button"
                onClick={() => setDeleteModalCustomer(null)}
                className="px-3 py-1.5 rounded-lg bg-surface-container font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-1.5 rounded-lg bg-error text-on-error font-bold cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
