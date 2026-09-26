import React, { useState, useEffect, useRef } from 'react';
import { FAQS } from '../data/mockData';

export default function ContactSection() {
  const [openFaq, setOpenFaq] = useState(0);
  const [formSent, setFormSent] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
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

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setFormSent(true);
    setTimeout(() => {
      setFormSent(false);
      setFormData({ name: '', email: '', message: '' });
    }, 4000);
  };

  return (
    <section ref={ref} id="contact-us" className="w-full py-20 bg-surface relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-outline-variant/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-gutter">
        {/* Section Header */}
        <div className={`text-center max-w-2xl mx-auto mb-14 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/8 border border-primary/15 font-black text-primary uppercase tracking-widest text-[10px] mb-3">
            <span className="material-symbols-outlined text-[14px]">contact_support</span>
            We're Here For You
          </span>
          <h2 className="font-headline-lg text-on-surface mt-2 mb-3">
            Frequently Asked Questions &amp; Support
          </h2>
          <p className="font-body-md text-on-surface-variant text-sm">
            Have questions about weekend pickup stalls, farmer listings, or preorder holds?
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* FAQ Accordion */}
          <div className={`lg:col-span-7 flex flex-col gap-3 transition-all duration-700 ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className={`rounded-2xl overflow-hidden border transition-all duration-300 ${
                    isOpen
                      ? 'border-primary/20 shadow-[0_8px_24px_rgba(18,82,36,0.1)] bg-white'
                      : 'border-outline-variant/20 bg-white hover:border-primary/15 hover:shadow-sm'
                  }`}
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-200 ${
                        isOpen ? 'bg-primary text-on-primary' : 'bg-primary/8 text-primary group-hover:bg-primary/15'
                      }`}>
                        <span className="font-black text-[11px]">{String(idx + 1).padStart(2, '0')}</span>
                      </div>
                      <span className="font-semibold text-on-surface text-sm leading-snug">
                        {faq.q}
                      </span>
                    </div>
                    <span
                      className="material-symbols-outlined text-primary text-[20px] flex-shrink-0 transition-transform duration-300"
                      style={{ transform: isOpen ? 'rotate(180deg)' : 'none' }}
                    >
                      expand_more
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-0 animate-fade-in">
                      <div className="pl-10 text-on-surface-variant text-sm leading-relaxed border-t border-outline-variant/10 pt-3">
                        {faq.a}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Contact Form */}
          <div
            className={`lg:col-span-5 rounded-2xl border border-outline-variant/20 overflow-hidden transition-all duration-700 ${
              visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
            }`}
            style={{ boxShadow: '0 8px 32px rgba(18,82,36,0.08)' }}
          >
            {/* Form header */}
            <div
              className="px-7 py-6 border-b border-outline-variant/10"
              style={{ background: 'linear-gradient(135deg, rgba(18,82,36,0.04), rgba(62,106,0,0.04))' }}
            >
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/15 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-[20px]">mail</span>
                </div>
                <div>
                  <h3 className="font-bold text-on-surface text-base">Send Us a Message</h3>
                  <p className="text-on-surface-variant text-xs">Response within 24 hours</p>
                </div>
              </div>
            </div>

            <div className="p-7 bg-white">
              {formSent ? (
                <div className="flex flex-col items-center justify-center py-10 text-center animate-bounce-in">
                  <div className="w-16 h-16 rounded-full bg-secondary-fixed/30 flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-[36px] text-primary">mark_email_read</span>
                  </div>
                  <p className="font-bold text-on-surface text-lg mb-2">Message Received!</p>
                  <p className="font-body-sm text-on-surface-variant text-sm">
                    Our community team will respond within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="flex flex-col gap-4">
                  <div>
                    <label className="block font-bold text-on-surface text-xs mb-1.5 uppercase tracking-wider">Your Name</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">person</span>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Liam Taylor"
                        className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl pl-10 pr-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary focus:bg-white focus:shadow-[0_0_0_3px_rgba(18,82,36,0.1)] transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-bold text-on-surface text-xs mb-1.5 uppercase tracking-wider">Email Address</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">mail</span>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="liam@example.com"
                        className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl pl-10 pr-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary focus:bg-white focus:shadow-[0_0_0_3px_rgba(18,82,36,0.1)] transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-bold text-on-surface text-xs mb-1.5 uppercase tracking-wider">Message</label>
                    <textarea
                      rows="4"
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="How can we assist you with local market pickup?"
                      className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary focus:bg-white focus:shadow-[0_0_0_3px_rgba(18,82,36,0.1)] transition-all resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full font-bold text-sm py-3.5 rounded-xl text-on-primary flex items-center justify-center gap-2 active:scale-[0.99] cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(18,82,36,0.3)]"
                    style={{ background: 'linear-gradient(135deg, #125224, #2e6b3a)' }}
                  >
                    <span className="material-symbols-outlined text-[18px]">send</span>
                    <span>Send Inquiry</span>
                  </button>

                  <p className="text-on-surface-variant text-[11px] text-center">
                    By submitting, you agree to our{' '}
                    <a href="#privacy" className="text-primary hover:underline">Privacy Policy</a>
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
