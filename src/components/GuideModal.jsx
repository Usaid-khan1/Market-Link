import React from 'react';

const steps = [
  {
    num: '01',
    title: 'Weekly Inventory Posting',
    desc: 'Publish your harvest quantities by Thursday 6:00 PM. Shoppers place hold reservations until Friday midnight.',
    icon: 'inventory_2',
    color: 'bg-primary/8 text-primary border-primary/15',
  },
  {
    num: '02',
    title: 'Packing & Labeling Crates',
    desc: 'Pack reserved crates with customer name slips before opening your stall on market morning.',
    icon: 'package_2',
    color: 'bg-secondary/8 text-secondary border-secondary/15',
  },
  {
    num: '03',
    title: 'In-Person Collection & Payment',
    desc: 'Shoppers inspect produce upon arrival and pay you directly via cash, card, or vouchers. Zero commission deduction.',
    icon: 'handshake',
    color: 'bg-tertiary/8 text-tertiary border-tertiary/15',
  },
];

export default function GuideModal({ onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(12px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="relative bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.25)] animate-bounce-in flex flex-col max-h-[90vh]"
        style={{ border: '1px solid rgba(192,201,189,0.2)' }}
      >
        {/* Top gradient bar */}
        <div className="h-1.5 w-full" style={{ background: 'linear-gradient(90deg, #125224, #3e6a00, #b9f474, #914d00)' }} />

        {/* Header */}
        <div
          className="px-7 py-6 flex items-center justify-between flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #125224, #2e6b3a)' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-secondary-fixed text-[24px]">menu_book</span>
            </div>
            <div>
              <h3 className="font-black text-on-primary text-lg leading-none">Stallholder Guide</h3>
              <p className="text-primary-fixed-dim text-xs mt-1">MarketLink Farmer Onboarding</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close guide"
            className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-on-primary transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-7 overflow-y-auto flex flex-col gap-5">
          {/* Notice banner */}
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-secondary-fixed/20 border border-secondary-fixed/30">
            <span className="material-symbols-outlined text-secondary text-[22px] flex-shrink-0 mt-0.5">tips_and_updates</span>
            <div className="text-xs">
              <p className="font-bold text-on-surface mb-0.5">Quick Overview for Market Growers</p>
              <p className="text-on-surface-variant leading-relaxed">Everything you need to set up your stall profile and start receiving weekly produce reservations.</p>
            </div>
          </div>

          {/* Steps */}
          {steps.map((step, i) => (
            <div
              key={i}
              className={`flex gap-4 p-5 rounded-2xl border ${step.color} bg-opacity-50`}
              style={{ background: 'rgba(255,255,255,0.7)' }}
            >
              <div className={`w-10 h-10 rounded-xl border ${step.color} flex items-center justify-center flex-shrink-0`}>
                <span className="material-symbols-outlined text-[20px]">{step.icon}</span>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-black text-[10px] text-on-surface-variant uppercase tracking-widest">{step.num}</span>
                  <h4 className="font-bold text-on-surface text-sm">{step.title}</h4>
                </div>
                <p className="text-on-surface-variant text-xs leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}

          {/* Key facts */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: 'percent', val: '0%', label: 'Commission (60 days)' },
              { icon: 'payments', val: 'Direct', label: 'Cash to Farmer' },
              { icon: 'schedule', val: '< 5 min', label: 'Setup Time' },
            ].map((f, i) => (
              <div key={i} className="text-center p-3 rounded-2xl bg-surface-container-low border border-outline-variant/20">
                <span className="material-symbols-outlined text-primary text-[20px] mb-1">{f.icon}</span>
                <p className="font-black text-on-surface text-sm">{f.val}</p>
                <p className="text-on-surface-variant text-[10px]">{f.label}</p>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => { alert('Stallholder Guide PDF downloaded to your device!'); onClose(); }}
              className="flex-1 inline-flex items-center justify-center gap-2 font-bold text-sm py-3.5 rounded-2xl text-on-primary cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-green-md active:scale-[0.99]"
              style={{ background: 'linear-gradient(135deg, #125224, #2e6b3a)' }}
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              Download PDF Guide
            </button>
            <button
              onClick={onClose}
              className="px-5 py-3.5 rounded-2xl font-bold text-sm text-on-surface-variant bg-surface-container hover:bg-surface-container-high transition-all cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
