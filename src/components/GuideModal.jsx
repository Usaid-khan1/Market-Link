import React from 'react';

export default function GuideModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-gutter bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-outline-variant/40 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-primary px-space-lg py-space-md text-on-primary flex items-center justify-between">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-[24px]">menu_book</span>
            <h3 className="font-headline-sm text-on-primary">MarketLink Stallholder Guide</h3>
          </div>
          <button onClick={onClose} className="text-on-primary/80 hover:text-on-primary cursor-pointer">
            <span className="material-symbols-outlined text-[24px]">close</span>
          </button>
        </div>

        <div className="p-space-lg overflow-y-auto flex flex-col gap-space-md font-body-sm text-on-surface-variant">
          <div className="bg-secondary-fixed/30 p-space-sm rounded-lg border border-secondary-fixed text-on-secondary-fixed-variant text-xs">
            📋 <strong>Quick Overview for Market Growers:</strong> Everything you need to know about setting up your stall profile and receiving weekly produce reservations.
          </div>

          <div>
            <h4 className="font-headline-sm text-on-surface text-base mb-1">1. Weekly Inventory Posting</h4>
            <p>Publish your harvest quantities by Thursday 6:00 PM. Shoppers place hold reservations until Friday midnight.</p>
          </div>

          <div>
            <h4 className="font-headline-sm text-on-surface text-base mb-1">2. Packing &amp; Labeling Crates</h4>
            <p>Pack reserved crates with customer name slips before opening your stall on market morning.</p>
          </div>

          <div>
            <h4 className="font-headline-sm text-on-surface text-base mb-1">3. In-Person Collection &amp; Payment</h4>
            <p>Shoppers inspect produce upon arrival and pay you directly via cash, card, or vouchers. Zero commission deduction.</p>
          </div>

          <div className="pt-space-sm border-t border-outline-variant/30 flex gap-space-sm">
            <button
              onClick={() => {
                alert('Stallholder Guide PDF downloaded to your device!');
                onClose();
              }}
              className="flex-1 bg-primary hover:bg-primary-container text-on-primary font-label-md py-space-sm rounded-xl text-center shadow-md transition-all cursor-pointer flex items-center justify-center gap-space-xs"
            >
              <span className="material-symbols-outlined text-[20px]">download</span>
              <span>Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="px-space-md py-space-sm rounded-xl font-label-md text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
