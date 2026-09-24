import React, { useState } from 'react';
import { FAQS } from '../data/mockData';

export default function ContactSection() {
  const [openFaq, setOpenFaq] = useState(0);
  const [formSent, setFormSent] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setFormSent(true);
    setTimeout(() => {
      setFormSent(false);
      setFormData({ name: '', email: '', message: '' });
    }, 4000);
  };

  return (
    <section id="contact-us" className="w-full py-space-xl bg-surface">
      <div className="max-w-7xl mx-auto px-gutter">
        <div className="text-center max-w-2xl mx-auto mb-space-xl">
          <span className="font-label-sm text-primary uppercase tracking-widest font-bold">
            We’re Here For You
          </span>
          <h2 className="font-headline-lg text-on-surface mt-space-xs">
            Frequently Asked Questions &amp; Support
          </h2>
          <p className="font-body-md text-on-surface-variant mt-space-xs">
            Have questions about weekend pickup stalls, farmer listings, or preorder holds?
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
          {/* FAQ Accordion */}
          <div className="lg:col-span-7 flex flex-col gap-space-sm">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-surface-container-low rounded-xl overflow-hidden border border-outline-variant/30 transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                    className="w-full p-space-md text-left flex items-center justify-between gap-space-sm cursor-pointer hover:bg-surface-container transition-colors"
                  >
                    <span className="font-headline-sm text-on-surface text-base font-semibold">
                      {faq.q}
                    </span>
                    <span className="material-symbols-outlined text-primary text-[20px] transition-transform duration-300" style={{ transform: isOpen ? 'rotate(180deg)' : 'none' }}>
                      expand_more
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-space-md pb-space-md pt-0 text-on-surface-variant font-body-sm leading-relaxed border-t border-outline-variant/20 animate-fade-in">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Contact Message Box */}
          <div className="lg:col-span-5 bg-surface-container-low p-space-lg rounded-xl border border-outline-variant/30 shadow-sm">
            <h3 className="font-headline-sm text-on-surface mb-space-xs">Send MarketLink a Message</h3>
            <p className="font-body-sm text-on-surface-variant mb-space-md">
              Need help finding a grower stall or suggesting a new local farmers market in your county?
            </p>

            {formSent ? (
              <div className="bg-secondary-fixed/40 border border-secondary-fixed text-on-secondary-fixed-variant p-space-md rounded-xl text-center">
                <span className="material-symbols-outlined text-[32px] text-primary mb-1">
                  mark_email_read
                </span>
                <p className="font-label-md">Message Received!</p>
                <p className="font-body-sm text-xs mt-1">
                  Our community team will respond within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="flex flex-col gap-space-sm">
                <div>
                  <label className="font-label-sm text-on-surface-variant block mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Liam Taylor"
                    className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-lg px-space-sm py-space-xs font-body-sm text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="font-label-sm text-on-surface-variant block mb-1">Your Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="liam@example.com"
                    className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-lg px-space-sm py-space-xs font-body-sm text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="font-label-sm text-on-surface-variant block mb-1">Message</label>
                  <textarea
                    rows="3"
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="How can we assist you with local market pickup?"
                    className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-lg px-space-sm py-space-xs font-body-sm text-on-surface focus:outline-none focus:border-primary resize-none"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="bg-primary hover:bg-primary-container text-on-primary font-label-md py-space-sm rounded-xl shadow-md transition-all active:scale-95 cursor-pointer mt-1"
                >
                  Send Inquiry
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
