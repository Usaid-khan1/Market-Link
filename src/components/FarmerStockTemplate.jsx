import React, { useState, useEffect } from 'react';
import farmerApi from '../api/farmer';

export default function FarmerStockTemplate({ showToast }) {
  const daysOfWeek = [
    { key: 'Monday', label: 'Mon', activeMarket: null },
    { key: 'Tuesday', label: 'Tue', activeMarket: null },
    { key: 'Wednesday', label: 'Wed', activeMarket: 'Riverside Twilight' },
    { key: 'Thursday', label: 'Thu', activeMarket: null },
    { key: 'Friday', label: 'Fri', activeMarket: null },
    { key: 'Saturday', label: 'Sat', activeMarket: 'Downtown Sat & Pioneer Pav' },
    { key: 'Sunday', label: 'Sun', activeMarket: 'Pioneer Pav (Sun)' }
  ];

  const [selectedDay, setSelectedDay] = useState('Saturday');

  // Weekly templates data per day
  const [templates, setTemplates] = useState({
    Saturday: [
      { id: 't-1', name: 'Heirloom Brandywine Tomatoes', unit: 'lb', defaultQty: 40, included: true },
      { id: 't-2', name: 'Rainbow Swiss Chard & Lacinato Kale', unit: 'bunch', defaultQty: 25, included: true },
      { id: 't-3', name: 'Organic Romanesco Cauliflower', unit: 'piece', defaultQty: 18, included: true },
      { id: 't-4', name: 'Sweet Italian Genovese Basil', unit: 'bunch', defaultQty: 20, included: true },
      { id: 't-5', name: 'Baby Sugar Snap Peas', unit: 'basket', defaultQty: 25, included: true },
      { id: 't-6', name: 'Japanese Sweet Bell Peppers', unit: 'lb', defaultQty: 15, included: false }
    ],
    Wednesday: [
      { id: 't-1', name: 'Heirloom Brandywine Tomatoes', unit: 'lb', defaultQty: 25, included: true },
      { id: 't-2', name: 'Rainbow Swiss Chard & Lacinato Kale', unit: 'bunch', defaultQty: 15, included: true },
      { id: 't-3', name: 'Organic Romanesco Cauliflower', unit: 'piece', defaultQty: 10, included: false },
      { id: 't-4', name: 'Sweet Italian Genovese Basil', unit: 'bunch', defaultQty: 15, included: true },
      { id: 't-5', name: 'Baby Sugar Snap Peas', unit: 'basket', defaultQty: 12, included: true },
      { id: 't-6', name: 'Japanese Sweet Bell Peppers', unit: 'lb', defaultQty: 10, included: false }
    ],
    Sunday: [
      { id: 't-1', name: 'Heirloom Brandywine Tomatoes', unit: 'lb', defaultQty: 30, included: true },
      { id: 't-2', name: 'Rainbow Swiss Chard & Lacinato Kale', unit: 'bunch', defaultQty: 20, included: true },
      { id: 't-3', name: 'Organic Romanesco Cauliflower', unit: 'piece', defaultQty: 14, included: true },
      { id: 't-4', name: 'Sweet Italian Genovese Basil', unit: 'bunch', defaultQty: 15, included: true },
      { id: 't-5', name: 'Baby Sugar Snap Peas', unit: 'basket', defaultQty: 20, included: true },
      { id: 't-6', name: 'Japanese Sweet Bell Peppers', unit: 'lb', defaultQty: 12, included: false }
    ]
  });

  // Current day's template items
  const currentItems = templates[selectedDay] || [
    { id: 't-1', name: 'Heirloom Brandywine Tomatoes', unit: 'lb', defaultQty: 10, included: false },
    { id: 't-2', name: 'Rainbow Swiss Chard & Lacinato Kale', unit: 'bunch', defaultQty: 10, included: false },
    { id: 't-3', name: 'Organic Romanesco Cauliflower', unit: 'piece', defaultQty: 10, included: false },
    { id: 't-4', name: 'Sweet Italian Genovese Basil', unit: 'bunch', defaultQty: 10, included: false },
    { id: 't-5', name: 'Baby Sugar Snap Peas', unit: 'basket', defaultQty: 10, included: false },
    { id: 't-6', name: 'Japanese Sweet Bell Peppers', unit: 'lb', defaultQty: 10, included: false }
  ];

  // Toggle Item Included
  const handleToggleInclude = (itemId) => {
    setTemplates((prev) => {
      const dayList = prev[selectedDay] || currentItems;
      const updated = dayList.map((item) =>
        item.id === itemId ? { ...item, included: !item.included } : item
      );
      return { ...prev, [selectedDay]: updated };
    });
  };

  // Change Quantity
  const handleQtyChange = (itemId, val) => {
    const num = Math.max(0, parseInt(val) || 0);
    setTemplates((prev) => {
      const dayList = prev[selectedDay] || currentItems;
      const updated = dayList.map((item) =>
        item.id === itemId ? { ...item, defaultQty: num } : item
      );
      return { ...prev, [selectedDay]: updated };
    });
  };

  // Load live templates and products from backend
  useEffect(() => {
    farmerApi.getStockTemplates()
      .then((res) => {
        if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
          const grouped = {};
          res.data.forEach((tpl) => {
            const day = tpl.day_of_week;
            if (!grouped[day]) grouped[day] = [];
            grouped[day].push({
              id: tpl.product_id || tpl.id,
              productId: tpl.product_id,
              name: tpl.product?.name || `Product #${tpl.product_id}`,
              unit: tpl.product?.unit || 'unit',
              defaultQty: tpl.default_quantity,
              included: Boolean(tpl.is_included)
            });
          });
          setTemplates((prev) => ({ ...prev, ...grouped }));
        }
      })
      .catch((err) => console.warn('Could not load stock templates:', err));
  }, []);

  // Save Template
  const handleSaveTemplate = async () => {
    const dayItems = templates[selectedDay] || currentItems;
    const itemsPayload = dayItems.map((item, idx) => ({
      product_id: item.productId || (typeof item.id === 'number' ? item.id : idx + 1),
      default_quantity: item.defaultQty,
      is_included: item.included
    }));

    try {
      await farmerApi.saveStockTemplates({
        day_of_week: selectedDay,
        items: itemsPayload
      });
    } catch (err) {
      console.warn('API saveStockTemplates error:', err);
    }
    showToast?.(`Weekly template for ${selectedDay} saved successfully!`);
  };

  // Apply Template to This Week
  const handleApplyTemplate = async () => {
    try {
      await farmerApi.applyStockTemplates(selectedDay);
    } catch (err) {
      console.warn('API applyStockTemplates error:', err);
    }
    showToast?.(`🎉 Template applied! Live stock levels updated for ${selectedDay}.`);
  };

  return (
    <div className="px-gutter py-space-lg max-w-7xl mx-auto w-full flex flex-col gap-space-lg animate-fade-in">
      
      {/* 1. Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-space-xs text-on-surface-variant font-label-sm text-xs">
            <span>FARMER STALL</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-primary font-bold">RECURRING INVENTORY</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg sm:text-3xl text-on-surface tracking-tight font-bold">
            Weekly Stock Template
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant text-xs sm:text-sm">
            Set your recurring weekly availability so customers know what to expect.
          </p>
        </div>

        <div className="flex items-center gap-space-sm">
          <button
            type="button"
            onClick={handleSaveTemplate}
            className="px-space-md py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-xs font-bold transition-colors cursor-pointer border border-outline-variant/30"
          >
            Save Template
          </button>
          <button
            type="button"
            onClick={handleApplyTemplate}
            className="px-space-lg py-2.5 rounded-xl bg-primary text-on-primary font-label-md text-xs font-bold hover:bg-primary-container transition-colors shadow-md cursor-pointer active:scale-95 flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">publish</span>
            <span>Apply Template to This Week</span>
          </button>
        </div>
      </div>

      {/* 2. Explanatory Note Banner */}
      <div className="p-space-md rounded-2xl bg-secondary-fixed/40 border border-secondary/20 flex items-start gap-3 text-xs">
        <span className="material-symbols-outlined text-secondary text-[22px] shrink-0 mt-0.5">
          auto_fix_high
        </span>
        <div className="flex flex-col gap-0.5">
          <span className="font-bold text-on-surface">Automate your harvest schedule</span>
          <p className="text-on-surface-variant leading-relaxed">
            Clicking <strong>"Apply Template to This Week"</strong> pre-fills the week's actual catalog stock from this template, which can still be adjusted manually at any time if weather or yield fluctuates.
          </p>
        </div>
      </div>

      {/* 3. Day Selector Chips */}
      <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col gap-space-md">
        <div className="flex items-center justify-between">
          <span className="font-bold text-xs text-on-surface">Select Market Operating Day:</span>
          <span className="text-[11px] text-on-surface-variant">Highlighted days have scheduled market stalls</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {daysOfWeek.map((day) => {
            const isSelected = selectedDay === day.key;
            const hasMarket = Boolean(day.activeMarket);

            return (
              <button
                key={day.key}
                type="button"
                onClick={() => setSelectedDay(day.key)}
                className={`p-3 rounded-xl flex flex-col items-center justify-center text-center transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-primary text-on-primary border-primary shadow-md scale-102'
                    : hasMarket
                    ? 'bg-primary-fixed/30 hover:bg-primary-fixed/60 border-primary/30 text-on-surface'
                    : 'bg-surface-container-low hover:bg-surface-container border-outline-variant/20 text-on-surface-variant'
                }`}
              >
                <span className="font-bold text-sm">{day.key}</span>
                {day.activeMarket ? (
                  <span
                    className={`mt-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      isSelected
                        ? 'bg-primary-container text-on-primary-container'
                        : 'bg-primary text-on-primary'
                    }`}
                  >
                    Active Market
                  </span>
                ) : (
                  <span className="mt-1 text-[10px] opacity-60">Farm Prep</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Products Table for Selected Day */}
      <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 overflow-hidden flex flex-col">
        <div className="p-space-md border-b border-outline-variant/20 flex items-center justify-between bg-surface-container/30">
          <div>
            <h3 className="font-headline-sm text-on-surface font-bold text-base">
              {selectedDay} Produce Availability Roster
            </h3>
            <p className="font-body-sm text-on-surface-variant text-xs mt-0.5">
              Specify baseline crates and quantities packed for this day's market stall.
            </p>
          </div>

          <span className="px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-bold text-xs">
            {currentItems.filter((i) => i.included).length} of {currentItems.length} Products Active
          </span>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[650px]">
            <thead>
              <tr className="bg-surface-container/60 text-on-surface-variant font-label-sm text-[11px] uppercase tracking-wider border-b border-outline-variant/20">
                <th className="py-3.5 px-space-md" scope="col">Include in {selectedDay}'s Stock</th>
                <th className="py-3.5 px-space-md" scope="col">Product Item</th>
                <th className="py-3.5 px-space-md" scope="col">Recurring Default Batch</th>
                <th className="py-3.5 px-space-md text-right" scope="col">Estimated Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-high/50 text-on-surface text-xs">
              {currentItems.map((item) => (
                <tr
                  key={item.id}
                  className={`transition-colors ${
                    item.included
                      ? 'hover:bg-surface-container-low/60'
                      : 'opacity-50 bg-surface-container-low/20'
                  }`}
                >
                  {/* Toggle Include */}
                  <td className="py-4 px-space-md">
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <button
                        type="button"
                        role="switch"
                        aria-checked={item.included}
                        onClick={() => handleToggleInclude(item.id)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                          item.included ? 'bg-primary' : 'bg-outline-variant'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            item.included ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                      <span className="font-bold text-xs text-on-surface">
                        {item.included ? 'Included' : 'Excluded'}
                      </span>
                    </label>
                  </td>

                  {/* Name */}
                  <td className="py-4 px-space-md">
                    <span className="font-headline-sm text-sm font-bold text-on-surface">
                      {item.name}
                    </span>
                  </td>

                  {/* Editable Quantity */}
                  <td className="py-4 px-space-md">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        disabled={!item.included}
                        value={item.defaultQty}
                        onChange={(e) => handleQtyChange(item.id, e.target.value)}
                        className={`w-24 p-2 rounded-xl text-center font-bold border ${
                          item.included
                            ? 'bg-surface-container-low text-on-surface border-outline-variant/40 focus:ring-2 focus:ring-primary'
                            : 'bg-surface-container text-on-surface-variant border-transparent cursor-not-allowed'
                        }`}
                      />
                      <span className="text-on-surface-variant font-bold text-xs">
                        {item.unit}s
                      </span>
                    </div>
                  </td>

                  {/* Status Preview */}
                  <td className="py-4 px-space-md text-right">
                    {item.included ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-bold text-[11px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                        Will Populate {item.defaultQty} {item.unit}s
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant font-bold text-[11px]">
                        Not Listed on {selectedDay}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Action Strip */}
        <div className="p-space-md bg-surface-container/40 flex flex-col sm:flex-row items-center justify-between gap-space-sm border-t border-outline-variant/20 text-xs">
          <span className="font-body-sm text-on-surface-variant">
            Template changes are saved per day. Apply whenever you want to sync your live catalog.
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSaveTemplate}
              className="px-space-md py-2 rounded-xl bg-surface-container text-on-surface font-bold hover:bg-surface-container-high transition-colors cursor-pointer"
            >
              Save Template
            </button>
            <button
              type="button"
              onClick={handleApplyTemplate}
              className="px-space-md py-2 rounded-xl bg-primary text-on-primary font-bold hover:bg-primary-container transition-colors shadow-sm cursor-pointer"
            >
              Apply to This Week
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
