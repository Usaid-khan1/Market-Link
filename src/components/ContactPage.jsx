import React, { useState, useRef } from 'react';

export default function ContactPage({ onNavigate }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    role: 'shopper',
    message: '',
    newsletter: false,
  });

  const [formSuccess, setFormSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setFormSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        role: 'shopper',
        message: '',
        newsletter: false,
      });
      setTimeout(() => {
        setFormSuccess(false);
      }, 6000);
    }, 800);
  };

  const handleVolunteerClick = () => {
    setFormData((prev) => ({
      ...prev,
      subject: 'volunteer',
      role: 'volunteer',
    }));
    const nameInput = document.getElementById('contact-name');
    if (nameInput) {
      nameInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      nameInput.focus();
    }
  };

  const handleDownloadPdf = () => {
    alert('Downloading MarketLink Downtown Walking & Validated Parking Guide (PDF)...');
  };

  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-280px)]">
      {/* Subtle ambient glow background decoration */}
      <div className="relative w-full overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[850px] h-[340px] bg-secondary-fixed/20 rounded-full blur-3xl pointer-events-none -z-10"></div>
        <div className="absolute top-80 -right-20 w-96 h-96 bg-tertiary-fixed/30 rounded-full blur-3xl pointer-events-none -z-10"></div>

        {/* 1. Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto px-gutter pt-space-lg pb-space-xs w-full">
          <ol className="flex items-center gap-space-xs font-body-sm text-on-surface-variant text-xs">
            <li>
              <button
                type="button"
                onClick={() => onNavigate('home')}
                className="hover:text-primary transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">home</span>
                <span>Home</span>
              </button>
            </li>
            <li className="flex items-center text-outline-variant">
              <span className="material-symbols-outlined text-[15px]">chevron_right</span>
            </li>
            <li>
              <span className="font-label-sm text-primary bg-surface-container-high px-space-sm py-0.5 rounded-full font-bold">
                Contact Us
              </span>
            </li>
          </ol>
        </nav>

        {/* 2. Page Header & Hero Section */}
        <section className="max-w-7xl mx-auto px-gutter pt-space-sm pb-space-lg w-full">
          <div className="flex flex-col items-start gap-space-sm max-w-4xl">
            {/* Eyebrow Badge */}
            <div className="inline-flex items-center gap-space-xs px-space-md py-1 rounded-full bg-secondary-container text-on-secondary-fixed-variant font-label-sm shadow-sm text-xs font-bold border border-secondary-fixed/40">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
              <span>Community Desk &amp; Grower Support • Open Mon–Fri</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-display-lg text-headline-lg sm:text-display-lg text-on-surface font-headline-lg tracking-tight font-bold">
              We're Here for Our <span className="text-primary italic">Neighbors &amp; Growers</span>
            </h1>

            {/* Subtitle */}
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed text-sm sm:text-base">
              Have a question about your Saturday market pickup, interested in becoming a certified stallholder, or need help connecting with a local family farm? Reach out directly to our volunteer-led community team.
            </p>

            {/* Trust Highlights Bar (Horizontal Chips) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-sm w-full pt-space-md">
              <div className="flex items-center gap-space-xs p-space-sm rounded-xl bg-surface-container-low shadow-sm border border-outline-variant/30">
                <span className="material-symbols-outlined text-primary text-[20px]">bolt</span>
                <span className="font-label-md text-label-md text-on-surface text-xs font-bold">
                  Typical Response: Within 4 Hours
                </span>
              </div>
              <div className="flex items-center gap-space-xs p-space-sm rounded-xl bg-surface-container-low shadow-sm border border-outline-variant/30">
                <span className="material-symbols-outlined text-primary text-[20px]">agriculture</span>
                <span className="font-label-md text-label-md text-on-surface text-xs font-bold">
                  Dedicated Farmer Desk &amp; Liaison
                </span>
              </div>
              <div className="flex items-center gap-space-xs p-space-sm rounded-xl bg-surface-container-low shadow-sm border border-outline-variant/30">
                <span className="material-symbols-outlined text-primary text-[20px]">location_on</span>
                <span className="font-label-md text-label-md text-on-surface text-xs font-bold">
                  Pioneer Pavilion Desk Saturdays
                </span>
              </div>
              <div className="flex items-center gap-space-xs p-space-sm rounded-xl bg-surface-container-low shadow-sm border border-outline-variant/30">
                <span className="material-symbols-outlined text-primary text-[20px]">volunteer_activism</span>
                <span className="font-label-md text-label-md text-on-surface text-xs font-bold">
                  100% Volunteer Supported
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Two-Column Main Content Section */}
        <section className="max-w-7xl mx-auto px-gutter py-space-md w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
            
            {/* LEFT COLUMN: Static Contact Details & Support Channels */}
            <div className="lg:col-span-5 flex flex-col gap-space-md">
              
              {/* Physical Hub & Booth Card */}
              <div className="rounded-xl p-space-lg bg-surface-container-lowest shadow-md flex flex-col gap-space-md border border-outline-variant/30">
                <div className="flex items-center justify-between">
                  <span className="font-label-sm text-label-sm text-primary uppercase tracking-wider text-xs font-bold">
                    Physical Hubs
                  </span>
                  <span className="material-symbols-outlined text-primary text-[24px]">storefront</span>
                </div>

                {/* Weekday Office */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-space-xs">
                    <span className="material-symbols-outlined text-primary text-[18px]">apartment</span>
                    <h2 className="font-headline-sm text-headline-sm text-on-surface text-base font-bold">
                      Community Office
                    </h2>
                  </div>
                  <p className="font-body-md text-body-md text-on-surface-variant leading-snug text-xs sm:text-sm">
                    MarketLink Community Hub<br />
                    120 Market Square, Suite 204<br />
                    (Adjacent to Pioneer Pavilion)<br />
                    Downtown River District, OR 97201
                  </p>
                </div>

                <div className="w-full h-px bg-surface-container"></div>

                {/* Weekend Info Booth */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-space-xs">
                    <span className="material-symbols-outlined text-tertiary-container text-[18px]">roofing</span>
                    <h2 className="font-headline-sm text-headline-sm text-on-surface text-base font-bold">
                      Saturday On-Site Information Booth
                    </h2>
                  </div>
                  <p className="font-body-md text-body-md text-on-surface-variant leading-snug text-xs sm:text-sm">
                    North Arch Entrance, Booth #1<br />
                    7:30 AM – 1:30 PM Every Saturday<br />
                    <span className="font-label-sm text-primary flex items-center gap-1 mt-1 font-bold">
                      <span className="material-symbols-outlined text-[14px]">flag</span> Look for the bright green MarketLink canopy
                    </span>
                  </p>
                </div>
              </div>

              {/* Phone & Direct Inboxes Card */}
              <div className="rounded-xl p-space-lg bg-surface-container-lowest shadow-md flex flex-col gap-space-md border border-outline-variant/30">
                <div className="flex items-center justify-between">
                  <span className="font-label-sm text-label-sm text-primary uppercase tracking-wider text-xs font-bold">
                    Direct Lines &amp; Inboxes
                  </span>
                  <span className="material-symbols-outlined text-primary text-[24px]">support_agent</span>
                </div>

                {/* Phone Channels */}
                <div className="flex flex-col gap-space-xs">
                  <div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col gap-0.5 border border-outline-variant/20">
                    <span className="font-label-sm text-label-sm text-on-surface-variant text-[11px]">
                      General Inquiries &amp; Shopper Support
                    </span>
                    <a
                      className="font-headline-sm text-headline-sm text-primary hover:underline flex items-center gap-1 text-base font-bold"
                      href="tel:5035553276"
                    >
                      <span className="material-symbols-outlined text-[18px]">call</span> (503) 555-FARM (3276)
                    </a>
                  </div>

                  <div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col gap-0.5 border border-outline-variant/20">
                    <div className="flex items-center justify-between">
                      <span className="font-label-sm text-label-sm text-on-surface-variant text-[11px]">
                        Farmer &amp; Vendor Emergency Line
                      </span>
                      <span className="font-label-sm text-label-sm text-tertiary text-[11px] font-bold">
                        Market Mornings Only
                      </span>
                    </div>
                    <a
                      className="font-headline-sm text-headline-sm text-tertiary hover:underline flex items-center gap-1 text-base font-bold"
                      href="tel:5035552767"
                    >
                      <span className="material-symbols-outlined text-[18px]">emergency</span> (503) 555-CROP (2767)
                    </a>
                  </div>
                </div>

                {/* Direct Email Inboxes */}
                <div className="grid grid-cols-1 gap-space-xs pt-space-xs text-xs">
                  <a
                    className="p-space-sm rounded-lg hover:bg-surface-container flex items-center justify-between transition-colors border border-outline-variant/20"
                    href="mailto:hello@marketlink.org"
                  >
                    <div className="flex items-center gap-space-xs">
                      <span className="material-symbols-outlined text-primary text-[20px]">mail</span>
                      <span className="font-body-md text-body-md text-on-surface font-semibold">Shopper Care</span>
                    </div>
                    <span className="font-label-sm text-label-sm text-primary font-bold">hello@marketlink.org</span>
                  </a>

                  <a
                    className="p-space-sm rounded-lg hover:bg-surface-container flex items-center justify-between transition-colors border border-outline-variant/20"
                    href="mailto:stewards@marketlink.org"
                  >
                    <div className="flex items-center gap-space-xs">
                      <span className="material-symbols-outlined text-primary text-[20px]">yard</span>
                      <span className="font-body-md text-body-md text-on-surface font-semibold">Grower Applications</span>
                    </div>
                    <span className="font-label-sm text-label-sm text-primary font-bold">stewards@marketlink.org</span>
                  </a>

                  <a
                    className="p-space-sm rounded-lg hover:bg-surface-container flex items-center justify-between transition-colors border border-outline-variant/20"
                    href="mailto:community@marketlink.org"
                  >
                    <div className="flex items-center gap-space-xs">
                      <span className="material-symbols-outlined text-primary text-[20px]">groups</span>
                      <span className="font-body-md text-body-md text-on-surface font-semibold">Community &amp; Press</span>
                    </div>
                    <span className="font-label-sm text-label-sm text-primary font-bold">community@marketlink.org</span>
                  </a>
                </div>
              </div>

              {/* Operating Hours Card */}
              <div className="rounded-xl p-space-lg bg-surface-container-lowest shadow-md flex flex-col gap-space-sm border border-outline-variant/30">
                <h3 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-space-xs text-base font-bold">
                  <span className="material-symbols-outlined text-primary text-[22px]">schedule</span>
                  Support Desk Operating Hours
                </h3>
                <ul className="flex flex-col gap-space-xs font-body-sm text-body-sm text-on-surface-variant text-xs">
                  <li className="flex items-center justify-between py-1">
                    <span>Monday – Thursday</span>
                    <span className="font-label-sm text-on-surface font-semibold">9:00 AM – 5:00 PM PST</span>
                  </li>
                  <li className="flex items-center justify-between py-1 bg-surface-container-low px-space-xs rounded">
                    <span className="font-semibold text-primary">Friday (Pre-Harvest Cut-off)</span>
                    <span className="font-label-sm text-primary font-bold">8:00 AM – 7:00 PM PST</span>
                  </li>
                  <li className="flex items-center justify-between py-1 bg-secondary-container/40 px-space-xs rounded">
                    <span className="font-semibold text-on-secondary-fixed-variant">Saturday (Live Market Day Help)</span>
                    <span className="font-label-sm text-on-secondary-fixed-variant font-bold">7:00 AM – 2:00 PM PST</span>
                  </li>
                  <li className="flex items-center justify-between py-1 text-outline">
                    <span>Sunday</span>
                    <span className="italic">Closed (Out in the fields!)</span>
                  </li>
                </ul>
              </div>

              {/* Fast Quick-Help Box */}
              <div className="rounded-xl p-space-md bg-tertiary-fixed text-on-tertiary-fixed shadow-sm flex items-start gap-space-sm border border-tertiary/20">
                <span className="material-symbols-outlined text-tertiary text-[26px] mt-0.5">timelapse</span>
                <div className="flex flex-col gap-1 text-xs">
                  <p className="font-label-md text-label-md font-bold text-tertiary">Pickup Modification Cut-off</p>
                  <p className="font-body-sm text-body-sm leading-snug">
                    Need to modify your Saturday harvest basket before <strong>6:00 PM Friday</strong>? You can also message your grower directly from your Farmer Profile or reservation receipt without waiting for desk triage!
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Interactive Contact Form */}
            <div className="lg:col-span-7" ref={formRef}>
              <div className="rounded-xl p-space-lg md:p-space-xl bg-surface-container-lowest shadow-md flex flex-col gap-space-md border border-outline-variant/30">
                <div>
                  <span className="font-label-sm text-label-sm text-primary uppercase tracking-wider text-xs font-bold">
                    Fast Direct Messaging
                  </span>
                  <h2 className="font-headline-lg text-headline-lg text-on-surface font-headline-md mt-1 font-bold text-xl sm:text-2xl">
                    Send a Message to the MarketLink Desk
                  </h2>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-1 text-xs sm:text-sm">
                    Whether you’re planning a weekly pickup or joining our regional cooperative, your message lands right on our duty coordinator’s screen.
                  </p>
                </div>

                {/* Contact Form */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-space-md mt-space-xs" id="marketlink-contact-form">
                  {/* Full Name & Email Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-label-md text-label-md text-on-surface flex items-center justify-between text-xs font-bold" htmlFor="contact-name">
                        <span>Full Name</span>
                        <span className="text-tertiary font-normal text-xs">* Required</span>
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g., Sarah Jenkins"
                        className="w-full px-space-md py-space-sm rounded-xl bg-surface-container-low text-on-surface font-body-md focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary shadow-inner text-sm border border-outline-variant/40"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="font-label-md text-label-md text-on-surface flex items-center justify-between text-xs font-bold" htmlFor="contact-email">
                        <span>Email Address</span>
                        <span className="text-tertiary font-normal text-xs">* Required</span>
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="sarah@example.com"
                        className="w-full px-space-md py-space-sm rounded-xl bg-surface-container-low text-on-surface font-body-md focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary shadow-inner text-sm border border-outline-variant/40"
                      />
                    </div>
                  </div>

                  {/* Phone Number & Subject Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-label-md text-label-md text-on-surface flex items-center justify-between text-xs font-bold" htmlFor="contact-phone">
                        <span>Phone Number</span>
                        <span className="text-outline-variant font-normal text-xs">Optional</span>
                      </label>
                      <input
                        id="contact-phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="(503) 555-0199"
                        className="w-full px-space-md py-space-sm rounded-xl bg-surface-container-low text-on-surface font-body-md focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary shadow-inner text-sm border border-outline-variant/40"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="font-label-md text-label-md text-on-surface flex items-center justify-between text-xs font-bold" htmlFor="contact-subject">
                        <span>Topic / Department</span>
                        <span className="text-tertiary font-normal text-xs">* Required</span>
                      </label>
                      <div className="relative">
                        <select
                          id="contact-subject"
                          required
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          className="w-full appearance-none px-space-md py-space-sm rounded-xl bg-surface-container-low text-on-surface font-body-md focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary shadow-inner pr-10 text-sm border border-outline-variant/40 cursor-pointer"
                        >
                          <option value="" disabled>Select a subject...</option>
                          <option value="pickup">Saturday Harvest Pickup Question</option>
                          <option value="farmer">Applying as a Regional Farmer / Vendor</option>
                          <option value="order">Report an Issue with an Order</option>
                          <option value="volunteer">Volunteer at the Pavilion Desk</option>
                          <option value="general">General Inquiry / Feedback</option>
                        </select>
                        <span className="material-symbols-outlined text-[20px] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">
                          arrow_drop_down
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Segmented Role Selector */}
                  <div className="flex flex-col gap-2">
                    <label className="font-label-md text-label-md text-on-surface text-xs font-bold">
                      I am contacting as a...
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { id: 'shopper', label: 'Shopper / Neighbor' },
                        { id: 'grower', label: 'Farmer / Artisan' },
                        { id: 'volunteer', label: 'Volunteer Lead' },
                        { id: 'other', label: 'Other Partner' },
                      ].map((item) => {
                        const isSelected = formData.role === item.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setFormData({ ...formData, role: item.id })}
                            className={`p-space-sm text-center rounded-xl font-label-sm text-xs transition-all cursor-pointer font-bold ${
                              isSelected
                                ? 'bg-primary text-on-primary shadow-sm'
                                : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container border border-outline-variant/30'
                            }`}
                          >
                            {item.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Message Field */}
                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-md text-label-md text-on-surface flex items-center justify-between text-xs font-bold" htmlFor="contact-message">
                      <span>Your Message</span>
                      <span className="text-tertiary font-normal text-xs">* Required</span>
                    </label>
                    <textarea
                      id="contact-message"
                      rows={5}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please share your questions, details about your farm, or pickup inquiries. If referencing a specific stall or reservation, please mention the grower name..."
                      className="w-full px-space-md py-space-sm rounded-xl bg-surface-container-low text-on-surface font-body-md focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary shadow-inner text-sm border border-outline-variant/40"
                    ></textarea>
                  </div>

                  {/* Checkbox */}
                  <div className="flex items-start gap-space-xs pt-1 select-none">
                    <input
                      id="contact-newsletter"
                      type="checkbox"
                      checked={formData.newsletter}
                      onChange={(e) => setFormData({ ...formData, newsletter: e.target.checked })}
                      className="mt-1 w-4 h-4 rounded text-primary focus:ring-primary focus:ring-2 accent-primary cursor-pointer"
                    />
                    <label className="font-body-sm text-body-sm text-on-surface-variant cursor-pointer text-xs leading-relaxed" htmlFor="contact-newsletter">
                      Send me a copy of this message and weekly harvest reminders (no spam, unsubscribe anytime).
                    </label>
                  </div>

                  {/* Submit CTA & Safety Note */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-space-md pt-space-xs">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-space-xs font-label-lg text-label-lg px-space-xl py-space-md rounded-full bg-tertiary-container hover:bg-tertiary text-on-tertiary shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer text-xs font-bold"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="material-symbols-outlined animate-spin text-[18px]">sync</span>
                          <span>Dispatching Message...</span>
                        </>
                      ) : (
                        <>
                          <span>Send Message • Zero Wait Automation</span>
                          <span className="material-symbols-outlined text-[20px]">send</span>
                        </>
                      )}
                    </button>
                    <div className="flex items-center gap-1.5 text-on-surface-variant text-xs">
                      <span className="material-symbols-outlined text-[18px] text-primary">lock</span>
                      <span className="font-label-sm text-label-sm text-xs">Your information is never sold or shared.</span>
                    </div>
                  </div>

                  {/* Success Notification Toast/Banner */}
                  {formSuccess && (
                    <div
                      className="p-space-md rounded-xl bg-secondary-container text-on-secondary-container shadow-md flex items-center gap-space-sm animate-fade-in border border-secondary-fixed/50"
                      id="form-success-banner"
                    >
                      <span className="material-symbols-outlined text-primary text-[28px]">check_circle</span>
                      <div className="flex flex-col text-xs">
                        <p className="font-label-md text-label-md font-bold">Message Dispatched!</p>
                        <p className="font-body-sm text-body-sm">
                          Thank you! Your inquiry was forwarded to our Saturday Pavilion coordinator. We will reply within 4 hours.
                        </p>
                      </div>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Map & Plaza Directions Section */}
        <section className="max-w-7xl mx-auto px-gutter py-space-xl w-full">
          <div className="rounded-xl overflow-hidden bg-surface-container-lowest shadow-md flex flex-col border border-outline-variant/30">
            {/* Header Strip */}
            <div className="p-space-lg md:p-space-xl bg-surface-container-low flex flex-col md:flex-row md:items-center justify-between gap-space-md border-b border-outline-variant/20">
              <div>
                <div className="inline-flex items-center gap-1 text-primary font-label-sm mb-1 text-xs font-bold">
                  <span className="material-symbols-outlined text-[18px]">map</span>
                  <span>Central River District Location</span>
                </div>
                <h2 className="font-headline-lg text-headline-lg text-on-surface font-headline-md font-bold text-xl sm:text-2xl">
                  Find Us at Downtown Pioneer Pavilion &amp; Community Office
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant mt-1 max-w-2xl text-xs sm:text-sm">
                  Visit our physical coordinator office during the week or drop by Booth #1 every Saturday during market hours.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-space-sm">
                <a
                  className="inline-flex items-center gap-1.5 font-label-md text-label-md px-space-md py-space-sm rounded-full bg-primary hover:bg-primary-container text-on-primary shadow-sm transition-colors text-xs font-bold"
                  href="https://maps.google.com"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <span className="material-symbols-outlined text-[18px]">directions</span>
                  <span>Get Directions</span>
                </a>
                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  className="inline-flex items-center gap-1.5 font-label-md text-label-md px-space-md py-space-sm rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors cursor-pointer text-xs font-bold border border-outline-variant/30"
                >
                  <span className="material-symbols-outlined text-[18px]">download</span>
                  <span>Download Guide (PDF)</span>
                </button>
              </div>
            </div>

            {/* Stylized Plaza Blueprint & Map Visual */}
            <div className="relative w-full h-[420px] bg-surface-container-high overflow-hidden select-none">
              {/* Stylized SVG Map of Market Square Plaza */}
              <svg
                className="absolute inset-0 w-full h-full object-cover"
                fill="none"
                preserveAspectRatio="xMidYMid slice"
                viewBox="0 0 1200 500"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Background base */}
                <rect fill="#f0eded" height="500" width="1200"></rect>

                {/* River Edge Decorative Accent */}
                <path d="M0,0 C300,60 500,40 1200,90 L1200,0 L0,0 Z" fill="#b0f2b4" fillOpacity="0.35"></path>
                <text fill="#125224" fontFamily="Nunito Sans" fontSize="14" fontWeight="700" letterSpacing="1" x="40" y="35">
                  WILLAMETTE RIVER PROMENADE
                </text>

                {/* Streets */}
                {/* 2nd Ave */}
                <rect fill="#e5e2e1" height="500" width="70" x="180" y="0"></rect>
                <text fill="#71796f" fontFamily="Nunito Sans" fontSize="12" fontWeight="700" transform="rotate(-90 220 470)" x="220" y="470">
                  2ND AVENUE (NORTH / SOUTH)
                </text>

                {/* Market Boulevard */}
                <rect fill="#e5e2e1" height="75" width="1200" x="0" y="320"></rect>
                <text fill="#71796f" fontFamily="Nunito Sans" fontSize="13" fontWeight="700" letterSpacing="2" x="50" y="365">
                  SW MARKET BOULEVARD
                </text>

                {/* Market Square Plaza Area */}
                <rect fill="#fcf9f8" height="190" rx="16" stroke="none" width="680" x="320" y="110"></rect>
                <rect fill="#e5e2e1" fillOpacity="0.4" height="150" rx="8" width="640" x="340" y="130"></rect>

                {/* Pioneer Pavilion Footprint */}
                <rect fill="#b0f2b4" fillOpacity="0.5" height="110" rx="12" width="380" x="420" y="150"></rect>
                <text fill="#125224" fontFamily="Playfair Display" fontSize="18" fontWeight="600" textAnchor="middle" x="610" y="195">
                  Pioneer Pavilion Walkway
                </text>
                <text fill="#414940" fontFamily="Nunito Sans" fontSize="12" textAnchor="middle" x="610" y="215">
                  Weekly Saturday Harvest Stalls &amp; Direct Farmers
                </text>

                {/* Gazebo / Courtyard */}
                <circle cx="890" cy="205" fill="#ffdcc3" r="32"></circle>
                <text fill="#6e3900" fontFamily="Nunito Sans" fontSize="11" fontWeight="700" textAnchor="middle" x="890" y="209">
                  Central Gazebo
                </text>

                {/* North Arch Entrance Marker */}
                <rect fill="#125224" height="60" rx="4" width="28" x="390" y="135"></rect>
                <text fill="#125224" fontFamily="Nunito Sans" fontSize="11" fontWeight="700" x="350" y="145">
                  North Arch Entrance
                </text>

                {/* Suite 204 Building Footprint */}
                <rect fill="#fcf9f8" height="160" rx="8" width="90" x="70" y="130"></rect>
                <text fill="#1b1c1c" fontFamily="Nunito Sans" fontSize="11" fontWeight="700" textAnchor="middle" x="115" y="210">
                  120 Market Sq
                </text>

                {/* Parking Garage Footprint */}
                <rect fill="#fcf9f8" height="150" rx="8" width="130" x="1030" y="140"></rect>
                <text fill="#1b1c1c" fontFamily="Nunito Sans" fontSize="12" fontWeight="700" textAnchor="middle" x="1095" y="205">
                  Public Garage
                </text>
                <text fill="#71796f" fontFamily="Nunito Sans" fontSize="10" textAnchor="middle" x="1095" y="225">
                  2hr Free with Stall Ticket
                </text>
              </svg>

              {/* Interactive Overlay Map Pin 1: Community Office */}
              <div className="absolute top-[32%] left-[3%] sm:left-[5%] md:left-[7%] max-w-xs group cursor-pointer">
                <div className="relative flex flex-col items-center">
                  <div className="px-space-sm py-1 rounded-full bg-primary text-on-primary font-label-sm text-xs shadow-md whitespace-nowrap flex items-center gap-1 group-hover:scale-105 transition-transform font-bold">
                    <span className="material-symbols-outlined text-[16px]">apartment</span>
                    <span>MarketLink Suite 204</span>
                  </div>
                  <div className="w-3 h-3 bg-primary rotate-45 -mt-1.5 shadow-md"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-on-surface-variant/40 mt-1 animate-ping"></div>
                </div>
              </div>

              {/* Interactive Overlay Map Pin 2: Saturday Booth #1 */}
              <div className="absolute top-[28%] left-[32%] sm:left-[35%] max-w-xs group cursor-pointer">
                <div className="relative flex flex-col items-center">
                  <div className="px-space-md py-1.5 rounded-full bg-tertiary text-on-tertiary font-label-md text-xs shadow-lg whitespace-nowrap flex items-center gap-1.5 group-hover:scale-105 transition-transform font-bold">
                    <span className="material-symbols-outlined text-[16px] text-secondary-fixed">flag</span>
                    <span>Saturday Booth #1 (SNAP &amp; Info)</span>
                  </div>
                  <div className="w-3.5 h-3.5 bg-tertiary rotate-45 -mt-1.5 shadow-md"></div>
                  <div className="w-3 h-3 rounded-full bg-secondary-fixed mt-1 animate-pulse"></div>
                </div>
              </div>

              {/* Interactive Overlay Map Pin 3: Validated Parking */}
              <div className="absolute top-[32%] right-[4%] sm:right-[7%] max-w-xs group cursor-pointer">
                <div className="relative flex flex-col items-center">
                  <div className="px-space-sm py-1 rounded-full bg-surface-container-lowest text-on-surface font-label-sm text-xs shadow-md whitespace-nowrap flex items-center gap-1 group-hover:scale-105 transition-transform font-bold border border-outline-variant/30">
                    <span className="material-symbols-outlined text-primary text-[16px]">local_parking</span>
                    <span>2-Hour Validated Parking</span>
                  </div>
                  <div className="w-3 h-3 bg-surface-container-lowest rotate-45 -mt-1.5 shadow-md"></div>
                </div>
              </div>

              {/* Map Legend overlay */}
              <div className="absolute bottom-space-md left-space-md right-space-md md:right-auto bg-surface-container-lowest/90 backdrop-blur-md p-space-sm rounded-xl shadow-md flex flex-wrap items-center gap-space-md text-xs font-label-sm text-on-surface border border-outline-variant/30">
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-primary"></span>
                  <span>Community Coordinator Office</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-tertiary"></span>
                  <span>Saturday Info Booth #1</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-secondary-container"></span>
                  <span>Pioneer Walkway Pavilions</span>
                </div>
              </div>
            </div>

            {/* Travel & Parking Details Bar */}
            <div className="p-space-lg bg-surface-container-lowest grid grid-cols-1 md:grid-cols-3 gap-space-md">
              <div className="flex items-start gap-space-xs">
                <span className="material-symbols-outlined text-primary text-[22px] mt-0.5">directions_car</span>
                <div className="text-xs">
                  <p className="font-label-md text-label-md text-on-surface font-bold">Validated Parking</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 leading-relaxed">
                    Entrance off 2nd Ave. Bring your ticket to Booth #1 for 2 hours complimentary market parking validation.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-space-xs">
                <span className="material-symbols-outlined text-primary text-[22px] mt-0.5">tram</span>
                <div className="text-xs">
                  <p className="font-label-md text-label-md text-on-surface font-bold">Transit &amp; Streetcar</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 leading-relaxed">
                    River District Line stops directly at "Market Square / Pioneer South" every 12 minutes on weekends.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-space-xs">
                <span className="material-symbols-outlined text-primary text-[22px] mt-0.5">accessible</span>
                <div className="text-xs">
                  <p className="font-label-md text-label-md text-on-surface font-bold">Universal Accessibility</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 leading-relaxed">
                    Zero-step ramps at North Arch &amp; South Gazebo. Elevator access to Suite 204 community rooms.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Quick FAQ Section for Contact */}
        <section className="max-w-7xl mx-auto px-gutter py-space-xl w-full">
          <div className="flex flex-col items-center text-center gap-1 mb-space-lg">
            <span className="font-label-sm text-label-sm text-primary uppercase tracking-wider text-xs font-bold">
              Fast Answers
            </span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface font-headline-md font-bold text-xl sm:text-2xl">
              Frequently Asked Support Questions
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-xl text-xs sm:text-sm">
              Quick clarity regarding Saturday pickups, vendor onboarding, and SNAP token exchanges.
            </p>
          </div>

          {/* 2x2 Bento / Grid Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
            {/* FAQ Item 1 */}
            <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-xs hover:shadow-md transition-shadow border border-outline-variant/30">
              <div className="flex items-start gap-space-xs">
                <span className="material-symbols-outlined text-primary text-[24px]">event_repeat</span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface text-base font-bold">
                  Can I cancel or alter a reservation through this form?
                </h3>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant pl-8 leading-relaxed text-xs">
                Yes, our desk staff can process modifications. However, for immediate handling before the <strong>Friday 6:00 PM harvest cutoff</strong>, we advise logging in to your Reservations tab or messaging your grower directly on their profile to ensure their field-pack count remains accurate.
              </p>
            </div>

            {/* FAQ Item 2 */}
            <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-xs hover:shadow-md transition-shadow border border-outline-variant/30">
              <div className="flex items-start gap-space-xs">
                <span className="material-symbols-outlined text-primary text-[24px]">currency_exchange</span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface text-base font-bold">
                  Where do I pick up wooden SNAP / EBT market tokens?
                </h3>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant pl-8 leading-relaxed text-xs">
                Visit <strong>Saturday Info Booth #1</strong> right by the North Arch entrance. Our volunteer desk leads will swipe your Oregon Trail card and provide wooden tokens instantly—complete with our $20 Double Up Food Bucks fresh match!
              </p>
            </div>

            {/* FAQ Item 3 */}
            <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-xs hover:shadow-md transition-shadow border border-outline-variant/30">
              <div className="flex items-start gap-space-xs">
                <span className="material-symbols-outlined text-primary text-[24px]">eco</span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface text-base font-bold">
                  How do regional farmers get vetted to sell?
                </h3>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant pl-8 leading-relaxed text-xs">
                Select <em>'Applying as a Regional Farmer'</em> on the form above. Our Agricultural Coordinator, <strong>Hannah Vance</strong>, will review your certified growing practices and schedule an on-site soil and harvest visit within 5 business days.
              </p>
            </div>

            {/* FAQ Item 4 */}
            <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-xs hover:shadow-md transition-shadow border border-outline-variant/30">
              <div className="flex items-start gap-space-xs">
                <span className="material-symbols-outlined text-primary text-[24px]">find_in_page</span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface text-base font-bold">
                  What happens if I lose an item during Saturday market?
                </h3>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant pl-8 leading-relaxed text-xs">
                All lost &amp; found items turned in by vendors or patrons remain at <strong>Booth #1 until 1:30 PM Saturday</strong>. Afterward, they are logged and securely transferred to our 120 Market Square Suite 204 lockbox for weekday retrieval.
              </p>
            </div>
          </div>

          {/* Volunteer Banner */}
          <div className="mt-space-lg p-space-lg rounded-xl bg-primary text-on-primary shadow-md flex flex-col md:flex-row items-center justify-between gap-space-md border border-primary-fixed/20">
            <div className="flex items-center gap-space-md">
              <div className="w-12 h-12 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed shrink-0">
                <span className="material-symbols-outlined text-[28px]">handshake</span>
              </div>
              <div>
                <h4 className="font-headline-sm text-headline-sm text-on-primary font-bold text-base">
                  Passionate about local food sovereignty?
                </h4>
                <p className="font-body-sm text-body-sm text-primary-fixed leading-snug text-xs mt-0.5">
                  We are seeking volunteer desk ambassadors and harvest basket stewards for the upcoming peak summer season.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleVolunteerClick}
              className="shrink-0 font-label-md text-label-md px-space-lg py-space-sm rounded-full bg-surface text-primary hover:bg-surface-container-lowest shadow transition-colors cursor-pointer text-xs font-bold"
            >
              Join Our Volunteer Crew
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
