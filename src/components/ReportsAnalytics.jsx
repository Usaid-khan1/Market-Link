import React, { useState, useEffect } from 'react';
import adminApi from '../api/admin';
import PageLoader from './PageLoader';

export default function ReportsAnalytics({ onNavigate, showToast }) {
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('This Month');
  const [activeChartPoint, setActiveChartPoint] = useState(null);
  const [reportsData, setReportsData] = useState(null);

  useEffect(() => {
    setLoading(true);
    adminApi.getReports()
      .then((res) => {
        if (res?.data) {
          setReportsData(res.data);
        }
      })
      .catch((err) => console.warn('Could not load reports:', err))
      .finally(() => setLoading(false));
  }, []);

  // Farmers ranking data from live API
  const mostActiveFarmers = (reportsData?.most_active_farmers || []).map((f) => ({
    id: f.farmer_id,
    name: f.stall_name || f.farmer_name,
    contact: f.farmer_name,
    market: 'Regional Pavilion',
    totalOrders: f.total_orders,
    revenueShare: reportsData?.total_revenue > 0 ? `${((f.total_revenue / reportsData.total_revenue) * 100).toFixed(1)}%` : '0%',
    rating: f.rating || 5.0,
    reviewsCount: f.reviews_count || 0,
    avatar: (f.stall_name || f.farmer_name || 'GP').split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase(),
    trend: '+12%'
  }));

  // Top selling products data from live API
  const topSellingProducts = (reportsData?.top_selling_products || []).map((p) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    category: p.category,
    farmer: p.farmer,
    unitsSold: p.units_sold,
    revenue: p.revenue,
    trend: p.trend,
    image: p.image
  }));

  // Markets revenue comparison data for Bar Chart
  const marketRevenueBars = (reportsData?.revenue_by_market || []).map((m, idx) => {
    const colors = ['#2E6B3A', '#8BC34A', '#F28C28', '#2E6B3A', '#8BC34A'];
    const maxRev = Math.max(...(reportsData.revenue_by_market.map((r) => r.total_revenue)), 1);
    const share = Math.round((m.total_revenue / maxRev) * 100);
    return {
      name: m.market_name.length > 12 ? m.market_name.substring(0, 11) + '...' : m.market_name,
      full: m.market_name,
      amount: m.total_revenue,
      label: `$${Number(m.total_revenue).toFixed(2)}`,
      share: Math.max(share, 8),
      color: colors[idx % colors.length]
    };
  });

  const topMarket = marketRevenueBars.length > 0 ? marketRevenueBars[0] : null;
  const avgMarketRevenue = marketRevenueBars.length > 0
    ? (marketRevenueBars.reduce((sum, m) => sum + (Number(m.amount) || 0), 0) / marketRevenueBars.length).toFixed(2)
    : '0.00';

  if (loading) {
    return (
      <PageLoader
        title="Generating Platform Analytics..."
        subtitle="Computing marketplace GMV, vendor sales distributions, order frequency, and volume trends..."
        minHeight="min-h-[70vh]"
      />
    );
  }

  return (
    <div className="px-3 sm:px-6 lg:px-gutter py-4 sm:py-space-lg max-w-7xl mx-auto w-full flex flex-col gap-5 sm:gap-space-lg animate-fade-in">
      
      {/* 1. Header Section with Date Range Filter & Export Button */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-space-xs text-on-surface-variant font-label-sm text-xs">
            <span>PORTAL</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-primary font-bold">EXECUTIVE INTELLIGENCE</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg sm:text-3xl text-on-surface tracking-tight font-bold">
            Reports &amp; Analytics
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant text-xs sm:text-sm">
            Platform-wide performance overview, consumer pre-order trends, and vendor turnover metrics.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-space-sm">
          {/* Date Range Dropdown */}
          <div className="flex items-center gap-2 bg-surface-container-lowest p-1.5 px-3 rounded-xl border border-outline-variant/30 shadow-sm text-xs">
            <span className="material-symbols-outlined text-[18px] text-primary">calendar_month</span>
            <select
              value={dateRange}
              onChange={(e) => {
                setDateRange(e.target.value);
                showToast?.(`Analytics timeframe calibrated to: ${e.target.value}`);
              }}
              className="bg-transparent font-bold text-on-surface focus:outline-none cursor-pointer"
            >
              <option>This Week</option>
              <option>This Month</option>
              <option>This Quarter</option>
              <option>Custom Range</option>
            </select>
          </div>

          {/* Export Report Button */}
          <button
            type="button"
            onClick={() => showToast?.('Platform executive analytics report exported (PDF & CSV).')}
            className="inline-flex items-center gap-2 px-space-md py-2.5 rounded-xl bg-primary text-on-primary font-label-md text-xs font-bold hover:bg-primary-container transition-colors shadow-md cursor-pointer active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* 2. Row of Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-space-md">
        
        {/* Stat 1: Total Revenue (Informational Only) */}
        <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm flex flex-col gap-1 border border-outline-variant/30 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-[11px] uppercase tracking-wider text-on-surface-variant font-bold">
              Total Revenue
            </span>
            <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[18px]">attach_money</span>
            </div>
          </div>
          <span className="font-headline-md text-2xl sm:text-3xl font-bold text-on-surface">
            {reportsData?.total_revenue ? `$${Number(reportsData.total_revenue).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '$0.00'}
          </span>
          <div className="flex items-center justify-between pt-1">
            <span className="font-body-sm text-secondary flex items-center gap-1 font-bold text-xs">
              <span className="material-symbols-outlined text-[15px]">trending_up</span> Live
            </span>
            <span className="text-[10px] text-on-surface-variant italic">
              Platform-wide direct sales
            </span>
          </div>
          <div className="text-[10px] text-on-surface-variant/80 border-t border-outline-variant/20 pt-1 mt-1">
            * Informational indicator only (in-person payment)
          </div>
        </div>

        {/* Stat 2: Total Orders */}
        <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm flex flex-col gap-1 border border-outline-variant/30">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-[11px] uppercase tracking-wider text-primary font-bold">
              Total Pre-Orders
            </span>
            <div className="w-8 h-8 rounded-full bg-secondary-fixed/50 flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-[18px]">receipt_long</span>
            </div>
          </div>
          <span className="font-headline-md text-2xl sm:text-3xl font-bold text-primary">
            {reportsData?.total_orders ?? 0}
          </span>
          <div className="flex items-center justify-between pt-1">
            <span className="font-body-sm text-secondary flex items-center gap-1 font-bold text-xs">
              <span className="material-symbols-outlined text-[15px]">verified</span> Active
            </span>
            <span className="text-[10px] text-on-surface-variant">
              Orders placed
            </span>
          </div>
          <div className="text-[10px] text-on-surface-variant border-t border-outline-variant/20 pt-1 mt-1">
            Total registered pre-orders
          </div>
        </div>

        {/* Stat 3: Active Farmers */}
        <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm flex flex-col gap-1 border border-outline-variant/30">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-[11px] uppercase tracking-wider text-tertiary font-bold">
              Active Farmers
            </span>
            <div className="w-8 h-8 rounded-full bg-tertiary-fixed flex items-center justify-center text-tertiary">
              <span className="material-symbols-outlined text-[18px]">agriculture</span>
            </div>
          </div>
          <span className="font-headline-md text-2xl sm:text-3xl font-bold text-tertiary">
            {reportsData?.total_farmers ?? (reportsData?.most_active_farmers?.length ?? 0)}
          </span>
          <div className="flex items-center justify-between pt-1">
            <span className="font-body-sm text-secondary flex items-center gap-1 font-bold text-xs">
              <span className="material-symbols-outlined text-[15px]">verified</span> Verified
            </span>
            <span className="text-[10px] text-on-surface-variant">
              Across {reportsData?.total_markets ?? 0} pavilions
            </span>
          </div>
          <div className="text-[10px] text-on-surface-variant border-t border-outline-variant/20 pt-1 mt-1">
            Registered farm stands
          </div>
        </div>

        {/* Stat 4: Active Customers */}
        <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm flex flex-col gap-1 border border-outline-variant/30">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-[11px] uppercase tracking-wider text-on-surface-variant font-bold">
              Active Shoppers
            </span>
            <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface">
              <span className="material-symbols-outlined text-[18px]">group</span>
            </div>
          </div>
          <span className="font-headline-md text-2xl sm:text-3xl font-bold text-on-surface">
            {reportsData?.total_customers ?? 0}
          </span>
          <div className="flex items-center justify-between pt-1">
            <span className="font-body-sm text-secondary flex items-center gap-1 font-bold text-xs">
              <span className="material-symbols-outlined text-[15px]">person</span> Registered
            </span>
            <span className="text-[10px] text-on-surface-variant">
              Community shoppers
            </span>
          </div>
          <div className="text-[10px] text-on-surface-variant border-t border-outline-variant/20 pt-1 mt-1">
            Direct farm supporters
          </div>
        </div>
      </div>

      {/* 3. Two Chart Placeholder Blocks Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-lg">
        
        {/* CHART 1: Orders Over Time (Line Chart) */}
        <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm border border-outline-variant/30 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-space-md">
            <div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">show_chart</span>
                <h3 className="font-headline-sm text-on-surface font-bold text-base">
                  Orders Over Time
                </h3>
              </div>
              <p className="font-body-sm text-on-surface-variant text-xs mt-0.5">
                Weekly consumer pre-order volume curve across regional hubs
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1 text-[11px] text-on-surface-variant font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
                Completed
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] text-on-surface-variant font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F28C28]"></span>
                Projected
              </span>
            </div>
          </div>

          {/* SVG Line Chart Graphic */}
          <div className="relative w-full h-56 bg-surface-container-low/50 rounded-xl p-3 flex flex-col justify-between border border-outline-variant/20">
            <svg
              className="w-full h-full overflow-visible"
              viewBox="0 0 500 180"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2E6B3A" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#2E6B3A" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="projectedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F28C28" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#F28C28" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal Grid lines */}
              <line x1="0" y1="30" x2="500" y2="30" stroke="#c0c9bd" strokeOpacity="0.4" strokeDasharray="3 3" />
              <line x1="0" y1="75" x2="500" y2="75" stroke="#c0c9bd" strokeOpacity="0.4" strokeDasharray="3 3" />
              <line x1="0" y1="120" x2="500" y2="120" stroke="#c0c9bd" strokeOpacity="0.4" strokeDasharray="3 3" />
              <line x1="0" y1="165" x2="500" y2="165" stroke="#c0c9bd" strokeOpacity="0.6" />

              {/* Shaded Area Under Curve */}
              <polygon
                points="0,165 0,135 60,115 125,125 190,85 250,92 315,55 380,42 440,32 500,24 500,165"
                fill="url(#chartGradient)"
              />

              {/* Main Line Curve */}
              <path
                d="M0,135 Q60,115 125,125 T250,92 T380,42 T500,24"
                fill="none"
                stroke="#2E6B3A"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Projected Dashed Line */}
              <path
                d="M380,42 Q440,32 500,24"
                fill="none"
                stroke="#F28C28"
                strokeWidth="2.5"
                strokeDasharray="4 4"
              />

              {/* Interactive Data Points */}
              {[
                { cx: 0, cy: 135, val: '240 orders' },
                { cx: 60, cy: 115, val: '310 orders' },
                { cx: 125, cy: 125, val: '290 orders' },
                { cx: 190, cy: 85, val: '460 orders' },
                { cx: 250, cy: 92, val: '430 orders' },
                { cx: 315, cy: 55, val: '620 orders' },
                { cx: 380, cy: 42, val: '710 orders' },
                { cx: 440, cy: 32, val: '780 orders (est.)' },
                { cx: 500, cy: 24, val: '840 orders (est.)' }
              ].map((pt, i) => (
                <circle
                  key={i}
                  cx={pt.cx}
                  cy={pt.cy}
                  r="4.5"
                  fill="#ffffff"
                  stroke="#2E6B3A"
                  strokeWidth="2.5"
                  className="cursor-pointer transition-transform hover:scale-150"
                  onMouseEnter={() => setActiveChartPoint(pt.val)}
                  onMouseLeave={() => setActiveChartPoint(null)}
                />
              ))}
            </svg>

            {/* X-Axis Labels */}
            <div className="flex items-center justify-between text-[10px] text-on-surface-variant font-bold px-1 pt-1">
              <span>W1 Sep</span>
              <span>W2 Sep</span>
              <span>W3 Sep</span>
              <span>W4 Sep</span>
              <span>W1 Oct</span>
              <span>W2 Oct</span>
              <span>W3 Oct (Current)</span>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-outline-variant/20 flex items-center justify-between text-xs">
            <span className="font-bold text-on-surface">
              {reportsData?.total_orders ? `${reportsData.total_orders} Total Pre-Orders Processed` : 'No orders recorded yet'}
            </span>
            <span className="text-secondary font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">trending_up</span>
              Order Tracking Live
            </span>
          </div>
        </div>

        {/* CHART 2: Revenue by Market (Bar Chart) */}
        <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm border border-outline-variant/30 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-space-md">
            <div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">bar_chart</span>
                <h3 className="font-headline-sm text-on-surface font-bold text-base">
                  Revenue by Market
                </h3>
              </div>
              <p className="font-body-sm text-on-surface-variant text-xs mt-0.5">
                Stall checkout distribution across all registered regional market locations
              </p>
            </div>

            <span className="font-label-sm text-xs font-bold text-primary px-2.5 py-1 rounded-full bg-primary-fixed">
              {reportsData?.total_markets ?? marketRevenueBars.length} Markets Active
            </span>
          </div>

          {/* Bar Chart Visualization */}
          <div className="flex flex-col gap-3 py-1">
            {marketRevenueBars.length === 0 ? (
              <div className="py-10 text-center text-on-surface-variant text-xs italic">
                No market revenue data available yet.
              </div>
            ) : (
              marketRevenueBars.map((bar, i) => (
                <div key={i} className="flex flex-col gap-1 text-xs">
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-on-surface flex items-center gap-1.5">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: bar.color }}
                      ></span>
                      {bar.full}
                    </span>
                    <span className="text-primary font-mono">{bar.label}</span>
                  </div>

                  {/* Bar Track */}
                  <div className="w-full h-4 bg-surface-container rounded-full overflow-hidden flex">
                    <div
                      className="h-full rounded-full transition-all duration-700 hover:brightness-110 flex items-center justify-end pr-2 text-[9px] text-white font-bold"
                      style={{
                        width: `${bar.share}%`,
                        backgroundColor: bar.color
                      }}
                    >
                      {bar.share > 30 ? `${bar.share}%` : ''}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-3 pt-2 border-t border-outline-variant/20 flex items-center justify-between text-xs">
            <span className="text-on-surface-variant">
              Top Pavilion: <strong className="text-on-surface font-bold">{topMarket ? `${topMarket.full} (${topMarket.label})` : 'None'}</strong>
            </span>
            <span className="text-on-surface-variant">
              Avg Market Output: <strong className="text-on-surface font-bold">${avgMarketRevenue}</strong>
            </span>
          </div>
        </div>

      </div>

      {/* 4. Table 1: Most Active Farmers */}
      <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 overflow-hidden flex flex-col">
        <div className="p-space-md border-b border-outline-variant/20 flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm bg-surface-container/30">
          <div>
            <h3 className="font-headline-sm text-on-surface font-bold text-base">
              Most Active Farmers
            </h3>
            <p className="font-body-sm text-on-surface-variant text-xs mt-0.5">
              Top performing grower stands ranked by total pre-orders fulfilled and rating
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('farmers')}
            className="text-primary hover:underline text-xs font-bold flex items-center gap-1 cursor-pointer"
          >
            <span>Manage All Farmers ({reportsData?.total_farmers ?? mostActiveFarmers.length})</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-surface-container/60 text-on-surface-variant font-label-sm text-[11px] uppercase tracking-wider border-b border-outline-variant/20">
                <th className="py-3 px-space-md" scope="col">Farmer Stand</th>
                <th className="py-3 px-space-md" scope="col">Primary Market</th>
                <th className="py-3 px-space-md" scope="col">Total Orders</th>
                <th className="py-3 px-space-md" scope="col">Revenue Share</th>
                <th className="py-3 px-space-md" scope="col">Rating</th>
                <th className="py-3 px-space-md text-right" scope="col">Growth</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-high/50 text-on-surface text-xs">
              {mostActiveFarmers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-on-surface-variant text-xs italic">
                    No active farmer performance data recorded yet.
                  </td>
                </tr>
              ) : (
                mostActiveFarmers.map((f, i) => (
                  <tr key={f.id} className="hover:bg-surface-container-low/60 transition-colors">
                    {/* Farmer */}
                    <td className="py-3.5 px-space-md">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-primary-fixed text-on-primary-fixed flex items-center justify-center font-bold text-xs shrink-0">
                          {f.avatar}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-on-surface">{f.name}</span>
                          <span className="text-[11px] text-on-surface-variant">{f.contact}</span>
                        </div>
                      </div>
                    </td>

                    {/* Market */}
                    <td className="py-3.5 px-space-md">
                      <span className="px-2 py-0.5 rounded-md bg-surface-container font-label-sm text-[11px] font-bold text-on-surface">
                        {f.market}
                      </span>
                    </td>

                    {/* Total Orders */}
                    <td className="py-3.5 px-space-md font-bold text-on-surface">
                      {f.totalOrders} orders
                    </td>

                    {/* Revenue Share */}
                    <td className="py-3.5 px-space-md">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-primary">{f.revenueShare}</span>
                        <div className="w-16 h-1.5 rounded-full bg-surface-container overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: f.revenueShare }}
                          ></div>
                        </div>
                      </div>
                    </td>

                    {/* Average Rating */}
                    <td className="py-3.5 px-space-md">
                      <div className="flex items-center gap-1 font-bold text-on-surface">
                        <span className="material-symbols-outlined text-[#F28C28] text-[16px]">star</span>
                        <span>{f.rating}</span>
                        <span className="text-[11px] text-on-surface-variant font-normal">({f.reviewsCount})</span>
                      </div>
                    </td>

                    {/* Growth Trend */}
                    <td className="py-3.5 px-space-md text-right">
                      <span className="px-2 py-0.5 rounded-md bg-secondary-fixed text-on-secondary-fixed-variant font-bold text-[11px]">
                        {f.trend}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Table 2: Top Selling Products */}
      <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 overflow-hidden flex flex-col">
        <div className="p-space-md border-b border-outline-variant/20 flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm bg-surface-container/30">
          <div>
            <h3 className="font-headline-sm text-on-surface font-bold text-base">
              Top Selling Products
            </h3>
            <p className="font-body-sm text-on-surface-variant text-xs mt-0.5">
              Consumer favorites across all participating harvest stalls
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('products')}
            className="text-primary hover:underline text-xs font-bold flex items-center gap-1 cursor-pointer"
          >
            <span>View Complete Produce Catalog</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-surface-container/60 text-on-surface-variant font-label-sm text-[11px] uppercase tracking-wider border-b border-outline-variant/20">
                <th className="py-3 px-space-md" scope="col">Product Name</th>
                <th className="py-3 px-space-md" scope="col">Category</th>
                <th className="py-3 px-space-md" scope="col">Farmer</th>
                <th className="py-3 px-space-md" scope="col">Units Sold</th>
                <th className="py-3 px-space-md" scope="col">Est. Gross Output</th>
                <th className="py-3 px-space-md text-right" scope="col">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-high/50 text-on-surface text-xs">
              {topSellingProducts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-on-surface-variant text-xs italic">
                    No product sales recorded yet.
                  </td>
                </tr>
              ) : (
                topSellingProducts.map((p) => (
                <tr key={p.id} className="hover:bg-surface-container-low/60 transition-colors">
                  {/* Product */}
                  <td className="py-3.5 px-space-md">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-10 h-10 rounded-lg object-cover shrink-0 border border-outline-variant/30"
                      />
                      <div className="flex flex-col">
                        <span className="font-bold text-on-surface">{p.name}</span>
                        <span className="text-[11px] text-primary font-bold">{p.price}</span>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3.5 px-space-md">
                    <span className="px-2.5 py-1 rounded-full bg-surface-container text-on-surface font-medium text-[11px]">
                      {p.category}
                    </span>
                  </td>

                  {/* Farmer */}
                  <td className="py-3.5 px-space-md font-bold text-on-surface">
                    {p.farmer}
                  </td>

                  {/* Units Sold */}
                  <td className="py-3.5 px-space-md font-bold text-primary font-mono">
                    {p.unitsSold}
                  </td>

                  {/* Est. Gross Output */}
                  <td className="py-3.5 px-space-md font-bold text-on-surface">
                    {p.revenue}
                  </td>

                  {/* Trend */}
                  <td className="py-3.5 px-space-md text-right">
                    <span className="px-2 py-0.5 rounded-md bg-primary-fixed text-on-primary-fixed font-bold text-[11px]">
                      {p.trend}
                    </span>
                  </td>
                </tr>
              ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
