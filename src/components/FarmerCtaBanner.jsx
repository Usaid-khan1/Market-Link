import React from 'react';

export default function FarmerCtaBanner({ onOpenPartnerModal, onDownloadGuide }) {
  const highlights = [
    'Predict harvest volume in advance',
    'Zero card processing tech required',
    'Direct personal interaction with buyers',
    'Automated stall reservation slips'
  ];

  return (
    <section className="w-full py-space-xl bg-primary text-on-primary relative overflow-hidden">
      <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-primary-container blur-2xl opacity-60 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-gutter relative z-10">
        <div className="bg-primary-container rounded-2xl p-space-lg sm:p-space-xl shadow-xl flex flex-col lg:flex-row items-center justify-between gap-space-xl">
          <div className="flex flex-col max-w-2xl text-left">
            <div className="inline-flex items-center gap-space-xs bg-secondary-fixed text-on-secondary-fixed px-space-sm py-1 rounded-full font-label-sm w-fit mb-space-sm shadow-sm">
              <span className="material-symbols-outlined text-[16px]">agriculture</span>
              Regional Farmer Partnership
            </div>

            <h2 className="font-headline-lg text-on-primary mb-space-sm">
              Grow Your Harvest, Not Your Overhead
            </h2>

            <p className="font-body-md text-primary-fixed leading-relaxed mb-space-md">
              List your weekly crop inventory in minutes. Connect with thousands of passionate local eaters who show up ready to buy at your stall. 0% listing commission for your first 60 days of weekend market drops.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-xs text-on-primary font-body-sm">
              {highlights.map((item, idx) => (
                <div key={idx} className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-secondary-fixed text-[20px]">
                    check
                  </span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-space-sm w-full lg:w-auto flex-shrink-0">
            <button
              onClick={onOpenPartnerModal}
              className="bg-tertiary-container hover:bg-tertiary text-on-tertiary font-label-md px-space-lg py-space-md rounded-xl text-center shadow-lg transition-all active:scale-95 flex items-center justify-center gap-space-xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">person_add</span>
              <span>Apply as a Farmer Partner</span>
            </button>

            <button
              onClick={onDownloadGuide}
              className="bg-surface-container-lowest text-on-surface hover:bg-surface-container font-label-md px-space-lg py-space-md rounded-xl text-center shadow-sm transition-all flex items-center justify-center gap-space-xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">download</span>
              <span>Download Stallholder Guide</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
