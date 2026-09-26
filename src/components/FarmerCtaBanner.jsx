import React, { useEffect, useRef, useState } from 'react';

const highlights = [
  'Predict harvest volume in advance',
  'Zero card processing tech required',
  'Direct personal interaction with buyers',
  'Automated stall reservation slips',
];

export default function FarmerCtaBanner({ onOpenPartnerModal, onDownloadGuide }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="w-full py-20 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0a3d1a 0%, #125224 40%, #1e6b35 70%, #2e6b3a 100%)',
      }}
    >
      {/* Background patterns */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(255,255,255,0.02) 20px, rgba(255,255,255,0.02) 40px)',
        }}
      />
      <div
        className="absolute -right-32 -top-32 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(185,244,116,0.12) 0%, transparent 70%)',
          animation: 'float 10s ease-in-out infinite',
        }}
      />
      <div
        className="absolute -left-20 bottom-0 w-80 h-80 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(176,242,180,0.08) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-7xl mx-auto px-gutter relative z-10">
        <div
          className={`rounded-3xl p-8 sm:p-12 flex flex-col lg:flex-row items-center justify-between gap-10 border border-white/10 transition-all duration-700 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
          style={{
            background: 'rgba(255,255,255,0.06)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)',
          }}
        >
          {/* Left Content */}
          <div className="flex flex-col max-w-2xl text-left">
            <div className="inline-flex items-center gap-2 bg-secondary-fixed text-on-secondary-fixed-variant px-3 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest w-fit mb-5 shadow-sm">
              <span className="material-symbols-outlined text-[15px]">agriculture</span>
              Regional Farmer Partnership
            </div>

            <h2 className="font-headline-lg text-on-primary mb-4 leading-tight">
              Grow Your Harvest,{' '}
              <span className="gradient-text-light">Not Your Overhead</span>
            </h2>

            <p className="font-body-md text-primary-fixed-dim leading-relaxed mb-6 text-sm max-w-xl">
              List your weekly crop inventory in minutes. Connect with thousands of passionate local eaters who show up ready to buy at your stall.{' '}
              <strong className="text-secondary-fixed font-bold">0% listing commission</strong> for your first 60 days of weekend market drops.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {highlights.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 group">
                  <div className="w-6 h-6 rounded-full bg-secondary-fixed/20 border border-secondary-fixed/30 flex items-center justify-center flex-shrink-0 group-hover:bg-secondary-fixed/30 transition-colors">
                    <span className="material-symbols-outlined text-secondary-fixed text-[14px]">check</span>
                  </div>
                  <span className="text-primary-fixed text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right CTAs */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto flex-shrink-0 lg:min-w-[220px]">
            <button
              onClick={onOpenPartnerModal}
              className="group relative overflow-hidden font-bold text-sm px-6 py-4 rounded-2xl text-center flex items-center justify-center gap-2.5 cursor-pointer transition-all duration-300 active:scale-95 hover:-translate-y-0.5"
              style={{
                background: 'linear-gradient(135deg, #914d00, #6e3900)',
                color: 'white',
                boxShadow: '0 8px 24px rgba(145,77,0,0.4)',
              }}
            >
              <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">person_add</span>
              <span>Apply as a Farmer Partner</span>
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>

            <button
              onClick={onDownloadGuide}
              className="group font-bold text-sm px-6 py-4 rounded-2xl text-center flex items-center justify-center gap-2.5 cursor-pointer transition-all duration-300 active:scale-95 border border-white/20 hover:bg-white/10 text-primary-fixed hover:-translate-y-0.5"
            >
              <span className="material-symbols-outlined text-[20px] group-hover:translate-y-0.5 transition-transform">download</span>
              <span>Download Stallholder Guide</span>
            </button>

            {/* Trust badge */}
            <div className="flex items-center gap-2 justify-center text-primary-fixed-dim text-xs pt-1">
              <span className="material-symbols-outlined text-secondary-fixed text-[16px]">verified_user</span>
              <span>Trusted by 42+ regional farms</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
