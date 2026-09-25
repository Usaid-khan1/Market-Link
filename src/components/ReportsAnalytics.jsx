import React, { useState } from 'react';

export default function ReportsAnalytics({ onNavigate, showToast }) {
  const [dateRange, setDateRange] = useState('This Month');
  const [activeChartPoint, setActiveChartPoint] = useState(null);

  // Farmers ranking data
  const mostActiveFarmers = [
    {
      id: 1,
      name: 'Green Pastures Organic',
      contact: 'Marcus & Sarah Thorne',
      market: 'Pioneer Pavilion',
      totalOrders: 584,
      revenueShare: '19.4%',
      rating: 4.95,
      reviewsCount: 142,
      avatar: 'GP',
      trend: '+14%'
    },
    {
      id: 2,
      name: 'Sunrise Orchard & Cider Co.',
      contact: 'Evelyn Brooks',
      market: 'Oak Valley Sunday',
      totalOrders: 492,
      revenueShare: '16.2%',
      rating: 4.88,
      reviewsCount: 98,
      avatar: 'SO',
      trend: '+9%'
    },
    {
      id: 3,
      name: 'Miller & Stone Hearth Bakery',
      contact: 'David Miller',
      market: 'Downtown Saturday',
      totalOrders: 448,
      revenueShare: '14.8%',
      rating: 4.92,
      reviewsCount: 176,
      avatar: 'MS',
      trend: '+18%'
    },
    {
      id: 4,
      name: 'Riverbend Goat Dairy & Cheese',
      contact: 'Hannah & Dale Vance',
      market: 'River District Sat',
      totalOrders: 382,
      revenueShare: '12.5%',
      rating: 4.79,
      reviewsCount: 84,
      avatar: 'RG',
      trend: '+6%'
    },
    {
      id: 5,
      name: 'Whispering Pines Organic Herbs',
      contact: 'Eleanor Wright',
      market: 'Oak Valley Sunday',
      totalOrders: 310,
      revenueShare: '10.1%',
      rating: 4.90,
      reviewsCount: 65,
      avatar: 'WP',
      trend: '+11%'
    }
  ];

  // Top selling products data
  const topSellingProducts = [
    {
      id: 1,
      name: 'Heirloom Brandywine Tomatoes',
      price: '$4.50 / lb',
      category: 'Fresh Vegetables',
      farmer: 'Green Pastures Organic',
      unitsSold: '980 lbs',
      revenue: '$4,410',
      trend: '+24%',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB5M_Jb-g3RIEObP_vUiplndD9sEKJ_Lx0Sgl3lL_8A0ZU5IGI_oshUgCGad4ZJtpqRMEWiVK8ytrwcJ9Intg9z7_W5J0fPW6S4mXBdn7t5IYLtNLjUujKtDJXuRzcF1rsCDTxQ9QxSgQAYRYRXhtD5sgdF7rYcV4A8XuPIvw7wfLzV-mtiFOrs__kBPIFF6OcghZ58jEraL_t2Hb4HdY5cZOtUFuWhWRjhXMxnBPjsgxdRrj4yOAYo'
    },
    {
      id: 2,
      name: 'Artisan Sourdough Country Loaf',
      price: '$7.50 / loaf',
      category: 'Hearth Breads',
      farmer: 'Miller & Stone Hearth Bakery',
      unitsSold: '815 loaves',
      revenue: '$6,112',
      trend: '+16%',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDDMDw91dvQXf4q6pKbYD3sHKVz05EIWjDFXHuaJEHCbTVFRsgwO7phGiS8XPD-34L1vj6P6qKZcyxr1ZH1VQ9VLJEZ3H1JwIa-v4gBWTlGDf3bUM0Xu1wGXIaN1JBWWcPFuzw8yHgWs7tSC2XcMx7uxwVD2fCU0wUZxIZ0J7jIbDEQhFUu2Ya9_7bRkKlgDVE8J5cCUQ7TX0OVOv5PTijoT7B9lnDH-DhbXMOn1Uj6MBICfanOct_f'
    },
    {
      id: 3,
      name: 'Honeycrisp Orchard Apples',
      price: '$3.20 / lb',
      category: 'Orchard Fruits',
      farmer: 'Sunrise Orchard & Cider Co.',
      unitsSold: '760 lbs',
      revenue: '$2,432',
      trend: '+12%',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuClIJU-m9wnwHW_ewEmyK3eGmreGDLfswwcbidm46G5ECjugjMC-wJdI02nUXYMvMh1wQTP9_-JLcYZCUufKAjBo1XWGc5NrniQzTN3ccxwpAr92rxrqw09QMddSwJ2VHbpgZijw1oS_WeE60q97AJL094C4DvZs3ZLOuruhvSTprxa3n2blU4DTUZa1KgnPY31NWwPg79HD7jSwPetCMLrplT6T4VDq9Q2AMC3mR8Judd2fjxfi2bB'
    },
    {
      id: 4,
      name: 'Raw Meadow Wildflower Honey (16oz)',
      price: '$12.00 / jar',
      category: 'Honey & Jams',
      farmer: 'Pine Ridge Apiaries',
      unitsSold: '430 jars',
      revenue: '$5,160',
      trend: '+28%',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDZQARg08jALmVwYA3ok4amUG0u-xEEYBvHSZxOMJpee6BnH_nKjni29z-GksED67D6ZlGhCKRhJUIRZHr4r2DUhFilbG8omgUd7-RaIaMaQOZko3-tkgxjCPyuhNGXinuXgoGlEhcj36RwrQlLtHE1YyFMSkOYl9xsWrbw1zYfTrAL1FM0S9N58axAx7S2XdY5SumAaEEqqoN7i-Jq70byrKynPcG9A1WTfqUTrWqXXnBrSCsiscH2'
    },
    {
      id: 5,
      name: 'Rainbow Organic Chard & Kale Bundle',
      price: '$3.75 / bunch',
      category: 'Fresh Vegetables',
      farmer: 'Whispering Pines Organic Herbs',
      unitsSold: '390 bundles',
      revenue: '$1,462',
      trend: '+7%',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA0rX6QqpjAbOj4aS9tyXHfexwLNZNbzSxXT3wnnRZ2XMSpA3M7N8idUFHiRchav_OFiX0mQuqWd0Z-t9_fUwFZGiWRa-be7DDkZhArudA_GozKGr25dEhHpyZDDvoWZ64z6hyMDey5Sgy9ZMPo0jIoAHHOox4FIup4zjPod4TRo-inqmbqmJZBvCIggYQsqchQqcay4tIPkUr3UN4vh-7SRbi3jh2cpjLmrpd164fewdifDCyYcmgR'
    }
  ];

  // Markets revenue comparison data for Bar Chart
  const marketRevenueBars = [
    { name: 'Downtown Sat', full: 'Downtown Saturday Market', amount: 52400, label: '$52.4k', share: 92, color: '#2E6B3A' },
    { name: 'Pioneer Pav', full: 'Pioneer Pavilion Heritage', amount: 44200, label: '$44.2k', share: 78, color: '#8BC34A' },
    { name: 'River Dist', full: 'Riverside Twilight Market', amount: 31800, label: '$31.8k', share: 56, color: '#F28C28' },
    { name: 'Oak Valley', full: 'Oak Valley Organic Market', amount: 26500, label: '$26.5k', share: 46, color: '#2E6B3A' },
    { name: 'Central Hall', full: 'Central Market Hall Plaza', amount: 18900, label: '$18.9k', share: 33, color: '#8BC34A' }
  ];

  return (
    <div className="px-gutter py-space-lg max-w-7xl mx-auto w-full flex flex-col gap-space-lg animate-fade-in">
      
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
            $148,920
          </span>
          <div className="flex items-center justify-between pt-1">
            <span className="font-body-sm text-secondary flex items-center gap-1 font-bold text-xs">
              <span className="material-symbols-outlined text-[15px]">trending_up</span> +14.2%
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
            3,842
          </span>
          <div className="flex items-center justify-between pt-1">
            <span className="font-body-sm text-secondary flex items-center gap-1 font-bold text-xs">
              <span className="material-symbols-outlined text-[15px]">trending_up</span> +8.5%
            </span>
            <span className="text-[10px] text-on-surface-variant">
              98.2% pickup rate
            </span>
          </div>
          <div className="text-[10px] text-on-surface-variant border-t border-outline-variant/20 pt-1 mt-1">
            Avg basket: $38.75 / transaction
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
            74
          </span>
          <div className="flex items-center justify-between pt-1">
            <span className="font-body-sm text-secondary flex items-center gap-1 font-bold text-xs">
              <span className="material-symbols-outlined text-[15px]">verified</span> 94% occupancy
            </span>
            <span className="text-[10px] text-on-surface-variant">
              Across 5 pavilions
            </span>
          </div>
          <div className="text-[10px] text-on-surface-variant border-t border-outline-variant/20 pt-1 mt-1">
            18 cert. organic handlers
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
            4,120
          </span>
          <div className="flex items-center justify-between pt-1">
            <span className="font-body-sm text-secondary flex items-center gap-1 font-bold text-xs">
              <span className="material-symbols-outlined text-[15px]">person_add</span> +230 this month
            </span>
            <span className="text-[10px] text-on-surface-variant">
              64% repeat reservation
            </span>
          </div>
          <div className="text-[10px] text-on-surface-variant border-t border-outline-variant/20 pt-1 mt-1">
            1,240 SNAP / EBT token users
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
              Peak Day: Saturday (2,180 pre-orders, 56.7%)
            </span>
            <span className="text-secondary font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">trending_up</span>
              +19% MoM Growth
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
              5 Markets Active
            </span>
          </div>

          {/* Bar Chart Visualization */}
          <div className="flex flex-col gap-3 py-1">
            {marketRevenueBars.map((bar, i) => (
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
            ))}
          </div>

          <div className="mt-3 pt-2 border-t border-outline-variant/20 flex items-center justify-between text-xs">
            <span className="text-on-surface-variant">
              Top Pavilion: <strong className="text-on-surface font-bold">Downtown Sat ($52,400)</strong>
            </span>
            <span className="text-on-surface-variant">
              Avg Market Output: <strong className="text-on-surface font-bold">$29,780</strong>
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
            <span>Manage All 74 Farmers</span>
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
              {mostActiveFarmers.map((f, i) => (
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
              ))}
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
              {topSellingProducts.map((p) => (
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
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
