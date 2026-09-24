import React from 'react';

export default function AboutUs({ onNavigate, onOpenRegister, onOpenFarmerPortal }) {
  return (
    <div className="flex flex-col w-full">
      {/* Hero & Narrative Header Section */}
      <section className="relative overflow-hidden bg-surface-container-low py-space-xl">
        <div className="max-w-7xl mx-auto px-gutter relative z-10">
          {/* Breadcrumb & Badge */}
          <div className="flex flex-wrap items-center gap-space-sm mb-space-md">
            <nav aria-label="Breadcrumbs" className="flex items-center gap-space-xs font-body-sm text-on-surface-variant text-xs">
              <button
                type="button"
                onClick={() => onNavigate('home')}
                className="hover:text-primary transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">cottage</span>
                <span>Home</span>
              </button>
              <span>/</span>
              <span className="text-primary font-bold">About Us</span>
            </nav>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-sm shadow-sm text-xs font-bold">
              <span className="material-symbols-outlined text-[16px]">verified</span>
              Rooted in Community • Zero Middlemen
            </span>
          </div>

          {/* Hero Titles */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-end mb-space-xl">
            <div className="lg:col-span-8 flex flex-col gap-space-sm">
              <h1 className="font-display-lg text-display-lg text-primary tracking-tight font-headline-lg leading-tight font-bold">
                Reconnecting Neighbors with the Hands That Feed Us
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl leading-relaxed text-sm">
                We built MarketLink to preserve local agricultural heritage, eliminate predatory grocery broker markups, and empower regional family growers with a direct, zero-risk harvest reservation network.
              </p>
            </div>
            <div className="lg:col-span-4 flex flex-col justify-end">
              <div className="p-space-md bg-surface-container-lowest rounded-xl shadow-md flex items-center gap-space-md border border-outline-variant/30">
                <div className="w-12 h-12 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed-variant shrink-0 shadow-sm">
                  <span className="material-symbols-outlined text-[26px]">agriculture</span>
                </div>
                <div>
                  <p className="font-label-md text-label-md text-on-surface font-bold text-sm">100% In-Person Handover</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant text-xs">Every cent settles face-to-face at the weekend market stand.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Impact Stats Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
            <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between border border-outline-variant/30">
              <div className="flex items-center justify-between mb-space-sm">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-bold text-xs">Direct Settlement</span>
                <span className="material-symbols-outlined text-primary text-[22px]">payments</span>
              </div>
              <p className="font-display-lg text-display-lg text-on-surface font-bold leading-none mb-1">100%</p>
              <p className="font-body-sm text-body-sm text-on-surface-variant text-xs">Farmer payout. Zero commission deducted on food reservations.</p>
            </div>

            <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between border border-outline-variant/30">
              <div className="flex items-center justify-between mb-space-sm">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-bold text-xs">Family Producers</span>
                <span className="material-symbols-outlined text-primary text-[22px]">nature_people</span>
              </div>
              <p className="font-display-lg text-display-lg text-on-surface font-bold leading-none mb-1">42+</p>
              <p className="font-body-sm text-body-sm text-on-surface-variant text-xs">Certified regional growers actively participating weekly.</p>
            </div>

            <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between border border-outline-variant/30">
              <div className="flex items-center justify-between mb-space-sm">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-bold text-xs">Local Pavilions</span>
                <span className="material-symbols-outlined text-primary text-[22px]">storefront</span>
              </div>
              <p className="font-display-lg text-display-lg text-on-surface font-bold leading-none mb-1">14</p>
              <p className="font-body-sm text-body-sm text-on-surface-variant text-xs">Community weekend markets hosting verified pickup bays.</p>
            </div>

            <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between border border-outline-variant/30">
              <div className="flex items-center justify-between mb-space-sm">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-bold text-xs">Food Radius</span>
                <span className="material-symbols-outlined text-primary text-[22px]">near_me</span>
              </div>
              <p className="font-display-lg text-display-lg text-on-surface font-bold leading-none mb-1">&lt; 18mi</p>
              <p className="font-body-sm text-body-sm text-on-surface-variant text-xs">Average distance from soil to Saturday pickup basket.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Narrative Origin Story (Editorial Split Layout) */}
      <section className="w-full py-space-xl bg-surface">
        <div className="max-w-7xl mx-auto px-gutter">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center">
            {/* Left Editorial Column */}
            <div className="lg:col-span-6 flex flex-col gap-space-md">
              <div className="flex items-center gap-space-xs text-tertiary font-label-md text-label-md uppercase tracking-wider text-xs font-bold">
                <span className="w-8 h-[2px] bg-tertiary"></span>
                Our Origin &amp; Soil Roots
              </div>
              <h2 className="font-headline-lg text-headline-lg text-primary tracking-tight font-semibold leading-tight">
                The Disappearing Farm Stand &amp; The Supermarket Illusion
              </h2>
              <div className="space-y-space-md font-body-md text-body-md text-on-surface leading-relaxed text-sm">
                <p>
                  In the early summer of 2021, our co-founders watched multi-generational family farms in our neighboring river valleys struggle with crippling distributor bottlenecks. Big grocery conglomerates demanded 40% to 55% broker discounts, delayed payments by 90 days, and rejected entire batches of heirloom crops simply for having natural curves and earthy freckles.
                </p>
                <p>
                  Meanwhile, neighborhood families stood in fluorescent grocery aisles paying inflated prices for hard, flavorless tomatoes picked green and trucked 1,500 refrigerated miles across the continent. Fresh, nutrient-dense harvest was rotting in fields unpicked, while consumers ate chemical-treated freight produce.
                </p>
                <p className="bg-surface-container-low p-space-md rounded-xl text-on-surface-variant font-body-md border border-outline-variant/20">
                  <strong className="text-primary font-label-md">The Grassroots Clipboard:</strong> MarketLink didn't start with code. It started under a blue canvas pop-up tent at the Downtown Pioneer Pavilion with a three-ring binder and a community clipboard. Shoppers pre-reserved their Sunday melon and heirloom bean shares, ensuring farmers knew their exact yield was sold before harvesting at sunrise.
                </p>
              </div>
            </div>

            {/* Right Visual Collage / Quote Feature */}
            <div className="lg:col-span-6 flex flex-col gap-space-md">
              <div className="relative">
                <div className="rounded-xl overflow-hidden shadow-xl border border-outline-variant/30">
                  <img
                    className="w-full h-96 object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuALpFUbJ_bTpRNpN_oRttcYkCD8z6XXMw-O0GnNyY9T18VeLZ2faBRefmsHtx1Vqji-TjJmVitFcJgYztxea_MIx7vaB5U6aPrSn-UQO3xGHmQNbTInDGRmEDTTMN8vVgipFu0kWjewpm8nlNCm2DlvfMKH5YQGghne5IiGB8PXgvZ_iZVb6wN0jaW-qCz-0PtdQ9TsViuvjscnnXS0e9kv1ukZsLX_N1bBZ4Ec8TTq0Vj9ePFBqGo7"
                    alt="Sun-drenched morning photo of an organic farmer holding a weathered wooden crate piled high with heirloom produce"
                  />
                </div>
                <div className="hidden sm:block absolute -bottom-8 -left-8 w-60 rounded-xl overflow-hidden shadow-2xl bg-surface-container-lowest p-2 border border-outline-variant/30">
                  <img
                    className="w-full h-44 object-cover rounded-lg"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBwIggAflt3v-fRGNOFdmM3E12Vso2BrbOtpUSLrqAvwz00XMVtOcvwhRrxIkNtIRh0xA_SxrD8rOO9kJR1MNX8WEtTQFMMZpk71qAgKF-PtmBPrSYWs2pSEahczmp620Z7R2P5b3qICx-gCJH3P6CDZPmKYoEMfe-ts103eKXSEGkkavcwhb3cf4b6a9bICHp1fAiApKfZ_meAIDtYj4jG-QgFGIjaKHoeLzVfMxHfTLxE-dYtzwH3"
                    alt="Community members and a friendly smiling grower exchanging a woven basket at market stall"
                  />
                </div>
              </div>

              {/* Quote Block */}
              <div className="mt-space-lg bg-surface-container p-space-lg rounded-xl flex items-start gap-space-md shadow-sm border border-outline-variant/30">
                <span className="material-symbols-outlined text-primary text-[36px] shrink-0 fill">format_quote</span>
                <div className="flex flex-col gap-space-xs">
                  <p className="font-headline-sm text-headline-sm text-primary italic font-serif leading-snug text-base">
                    "When you know the person who planted the seed and weeded the bed, every meal ceases to be a commercial transaction and becomes an act of stewardship."
                  </p>
                  <div className="flex items-center gap-space-xs font-label-sm text-label-sm text-on-surface-variant text-xs">
                    <span className="font-bold text-on-surface">Martha Miller</span> • 3rd Generation Grower &amp; MarketLink Pioneer Elder
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem & Solution Comparison Matrix */}
      <section className="w-full py-space-xl bg-surface-container-low border-y border-outline-variant/30">
        <div className="max-w-7xl mx-auto px-gutter">
          <div className="text-center max-w-3xl mx-auto mb-space-xl">
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary font-bold text-xs">Value Architecture</span>
            <h2 className="font-headline-lg text-headline-lg text-primary mt-space-xs font-semibold">
              Bridging the Gap: The Industrial Chain vs. MarketLink
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-space-xs text-sm">
              See how our zero-fee, direct-reservation model reclaims freshness, respects growers, and cuts carbon footprint.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
            {/* Card 1: Industrial Grocery */}
            <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between border border-outline-variant/30">
              <div>
                <div className="w-12 h-12 rounded-full bg-error-container text-on-error-container flex items-center justify-center mb-space-md shadow-sm">
                  <span className="material-symbols-outlined text-[24px]">factory</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold mb-space-xs text-base">
                  The Industrial Grocery
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md text-xs leading-relaxed">
                  A high-waste, consolidated machine built for supply-chain longevity rather than flavor or soil health.
                </p>
                <ul className="space-y-space-sm font-body-sm text-body-sm text-on-surface text-xs leading-relaxed">
                  <li className="flex items-start gap-space-xs">
                    <span className="material-symbols-outlined text-error text-[18px] shrink-0 mt-0.5">close</span>
                    <span><strong>14¢ per dollar</strong> reaches the farmer after brokers, packers, and corporate shelf slots.</span>
                  </li>
                  <li className="flex items-start gap-space-xs">
                    <span className="material-symbols-outlined text-error text-[18px] shrink-0 mt-0.5">close</span>
                    <span>Average transit time of <strong>7 to 14 days</strong> inside refrigerated long-haul diesel fleets.</span>
                  </li>
                  <li className="flex items-start gap-space-xs">
                    <span className="material-symbols-outlined text-error text-[18px] shrink-0 mt-0.5">close</span>
                    <span>Synthetic waxes and gas chamber ripening to artificially prolong supermarket shelf aesthetics.</span>
                  </li>
                  <li className="flex items-start gap-space-xs">
                    <span className="material-symbols-outlined text-error text-[18px] shrink-0 mt-0.5">close</span>
                    <span>Over <strong>30% harvest discarded</strong> before consumers ever see it due to cosmetic uniformity rules.</span>
                  </li>
                </ul>
              </div>
              <div className="mt-space-md pt-space-md bg-surface-container-low rounded-lg p-space-sm text-center">
                <span className="font-label-sm text-label-sm text-error uppercase font-bold text-xs">1,500+ Miles Traveled</span>
              </div>
            </div>

            {/* Card 2: Gig Delivery Apps */}
            <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between border border-outline-variant/30">
              <div>
                <div className="w-12 h-12 rounded-full bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center mb-space-md shadow-sm">
                  <span className="material-symbols-outlined text-[24px]">moped</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold mb-space-xs text-base">
                  Gig Delivery Platforms
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md text-xs leading-relaxed">
                  High platform take-rates that gouge small producers while treating delicate food like dry parcel delivery.
                </p>
                <ul className="space-y-space-sm font-body-sm text-body-sm text-on-surface text-xs leading-relaxed">
                  <li className="flex items-start gap-space-xs">
                    <span className="material-symbols-outlined text-tertiary text-[18px] shrink-0 mt-0.5">remove</span>
                    <span>Extracts <strong>25% to 35% commission</strong> plus platform convenience fees on every order.</span>
                  </li>
                  <li className="flex items-start gap-space-xs">
                    <span className="material-symbols-outlined text-tertiary text-[18px] shrink-0 mt-0.5">remove</span>
                    <span>Fragile heritage greens and berries tumble in uncooled vehicle trunks, losing crunch and vitality.</span>
                  </li>
                  <li className="flex items-start gap-space-xs">
                    <span className="material-symbols-outlined text-tertiary text-[18px] shrink-0 mt-0.5">remove</span>
                    <span>Opaque substitutions with zero understanding of heirloom varieties, seasons, or soil methods.</span>
                  </li>
                  <li className="flex items-start gap-space-xs">
                    <span className="material-symbols-outlined text-tertiary text-[18px] shrink-0 mt-0.5">remove</span>
                    <span>Single-use plastic clamshell packaging, disposable ice packs, and cardboard waste per drop.</span>
                  </li>
                </ul>
              </div>
              <div className="mt-space-md pt-space-md bg-surface-container-low rounded-lg p-space-sm text-center">
                <span className="font-label-sm text-label-sm text-tertiary uppercase font-bold text-xs">Excess Commission &amp; Packaging</span>
              </div>
            </div>

            {/* Card 3: The MarketLink Model */}
            <div className="bg-primary text-on-primary rounded-xl p-space-lg shadow-xl flex flex-col justify-between relative overflow-hidden">
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant flex items-center justify-center mb-space-md shadow-sm">
                  <span className="material-symbols-outlined text-[26px]">eco</span>
                </div>
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-primary-container text-on-primary-container font-label-sm text-label-sm uppercase mb-2 font-bold text-xs">
                  The MarketLink Way
                </span>
                <h3 className="font-headline-sm text-headline-sm text-on-primary font-semibold mb-space-xs text-base">
                  Direct Stall Reservation
                </h3>
                <p className="font-body-sm text-body-sm text-primary-fixed-dim mb-space-md text-xs leading-relaxed">
                  Pure agrarian connection: guarantee your harvest online, shake your grower's hand, pay directly at the stand.
                </p>
                <ul className="space-y-space-sm font-body-sm text-body-sm text-on-primary text-xs leading-relaxed">
                  <li className="flex items-start gap-space-xs">
                    <span className="material-symbols-outlined text-secondary-fixed text-[18px] shrink-0 mt-0.5">check_circle</span>
                    <span><strong>100% of price</strong> goes straight into the farmer's pocket at the weekend market stall.</span>
                  </li>
                  <li className="flex items-start gap-space-xs">
                    <span className="material-symbols-outlined text-secondary-fixed text-[18px] shrink-0 mt-0.5">check_circle</span>
                    <span>Harvested within <strong>24 hours of pickup</strong>. Zero refrigerated storage or ripening chemicals.</span>
                  </li>
                  <li className="flex items-start gap-space-xs">
                    <span className="material-symbols-outlined text-secondary-fixed text-[18px] shrink-0 mt-0.5">check_circle</span>
                    <span><strong>Zero upfront payment</strong> or digital credit card fee deductions for either party.</span>
                  </li>
                  <li className="flex items-start gap-space-xs">
                    <span className="material-symbols-outlined text-secondary-fixed text-[18px] shrink-0 mt-0.5">check_circle</span>
                    <span>Bring your own tote. <strong>Zero packaging waste</strong>, zero transit carbon delivery fleets.</span>
                  </li>
                </ul>
              </div>
              <div className="mt-space-md pt-space-md bg-primary-container rounded-lg p-space-sm text-center relative z-10">
                <span className="font-label-sm text-label-sm text-on-primary font-bold uppercase tracking-wider text-xs">
                  &lt; 18 Miles Field-to-Hand
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Pillars & Values */}
      <section className="w-full py-space-xl bg-surface">
        <div className="max-w-7xl mx-auto px-gutter">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-xl gap-space-md">
            <div>
              <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-bold text-xs">Uncompromising Standards</span>
              <h2 className="font-headline-lg text-headline-lg text-primary mt-space-xs font-semibold">
                Our Guiding Soil Principles
              </h2>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-md text-xs">
              How we ensure every bushel, bunch, and jar reserved on MarketLink reflects authentic regenerative agriculture.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
            {/* Pillar 1 */}
            <div className="bg-surface-container-low rounded-xl p-space-lg hover:shadow-md transition-shadow border border-outline-variant/30">
              <div className="w-14 h-14 rounded-xl bg-surface-container-lowest flex items-center justify-center text-primary shadow-sm mb-space-md">
                <span className="material-symbols-outlined text-[32px]">yard</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold mb-space-xs text-base">
                1. Local First &amp; Radical Transparency
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed text-xs">
                Every grower on MarketLink undergoes on-site farm verification. Acreage coordinates, water sources, and biological soil amendments are documented. We strictly prohibit repackaged food-hub produce or commercial wholesale resellers. If it didn't grow in their soil, it isn't listed.
              </p>
              <div className="mt-space-md flex items-center gap-2 font-label-sm text-label-sm text-primary font-bold text-xs">
                <span className="material-symbols-outlined text-[18px]">verified_user</span> 100% Certified Origin Audited
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="bg-surface-container-low rounded-xl p-space-lg hover:shadow-md transition-shadow border border-outline-variant/30">
              <div className="w-14 h-14 rounded-xl bg-surface-container-lowest flex items-center justify-center text-tertiary shadow-sm mb-space-md">
                <span className="material-symbols-outlined text-[32px]">wb_twilight</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold mb-space-xs text-base">
                2. Peak Dawn Harvest Freshness
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed text-xs">
                Because reservations are locked in the day prior, farmers only harvest what has been claimed. Crops are hand-picked at dawn Friday or Saturday morning, preserving delicate cell structure, higher concentrations of vitamin C, and authentic regional terroir impossible in warehouse logistics.
              </p>
              <div className="mt-space-md flex items-center gap-2 font-label-sm text-label-sm text-tertiary font-bold text-xs">
                <span className="material-symbols-outlined text-[18px]">nest_clock_farsight_analog</span> 24-Hour Soil-to-Basket Guarantee
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="bg-surface-container-low rounded-xl p-space-lg hover:shadow-md transition-shadow border border-outline-variant/30">
              <div className="w-14 h-14 rounded-xl bg-surface-container-lowest flex items-center justify-center text-secondary-fixed-variant shadow-sm mb-space-md">
                <span className="material-symbols-outlined text-[32px]">handshake</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold mb-space-xs text-base">
                3. Community Sovereignty &amp; Fair Payout
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed text-xs">
                We hold no escrow, capture no platform processing fees, and enforce no algorithmic pricing tricks. You reserve for free; the farmer receives 100% cash, market voucher, or card settlement right across the wooden market trestle. Food sovereignty begins with financial dignity for producers.
              </p>
              <div className="mt-space-md flex items-center gap-2 font-label-sm text-label-sm text-secondary font-bold text-xs">
                <span className="material-symbols-outlined text-[18px]">price_check</span> Zero Middleman Platform Fee
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Meet the Stewards & Team */}
      <section className="w-full py-space-xl bg-surface-container-low border-t border-outline-variant/30">
        <div className="max-w-7xl mx-auto px-gutter">
          <div className="max-w-3xl mb-space-xl">
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-bold text-xs">The Caretakers</span>
            <h2 className="font-headline-lg text-headline-lg text-primary mt-space-xs font-semibold">
              The People Cultivating MarketLink
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-space-xs text-xs">
              Founded by agricultural organizers, agroecologists, and community market veterans devoted to a sustainable regional food web.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
            {/* Person 1 */}
            <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm flex flex-col hover:shadow-md transition-shadow border border-outline-variant/30">
              <div className="h-64 overflow-hidden relative">
                <img
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDjRBA7WYK0Z6jLc5BxpTMDmADk2WvBSDQ-N-Rqw9Mmc3BwzOT7lwxRz8XSQM31dKeMxM8nZR0cJadGGWDR6cyGd_FzD8wWehKxjsU9TEU16KaJW4kX3SSpGxhWmzRit4sT4T7kvNVwi0Efa-GdihHSFjksORvnyeI9MH_Wq5JyFISpuWgSO3gJrXL4wAUhuOB0FNc8Q33srq4TDAKxRUXyJ34ZkvIG3iZqZoySHbisyTXY7Ml5V5By"
                  alt="Portrait of Hannah Vance"
                />
                <div className="absolute bottom-2 left-2 bg-surface/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-primary font-label-sm text-label-sm text-xs font-bold">
                  Co-Founder
                </div>
              </div>
              <div className="p-space-md flex flex-col flex-grow justify-between">
                <div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold text-base">Hannah Vance</h3>
                  <p className="font-label-sm text-label-sm text-primary mb-space-xs text-xs font-bold">Agricultural Coordinator</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed text-xs">
                    Former organic farm manager with 12 years championing regional agrarian cooperatives and seed diversity projects.
                  </p>
                </div>
                <div className="mt-space-md pt-space-xs flex items-center gap-1 font-label-sm text-label-sm text-on-surface-variant text-xs border-t border-outline-variant/20">
                  <span className="material-symbols-outlined text-[16px] text-primary">eco</span> Soil Stewardship
                </div>
              </div>
            </div>

            {/* Person 2 */}
            <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm flex flex-col hover:shadow-md transition-shadow border border-outline-variant/30">
              <div className="h-64 overflow-hidden relative">
                <img
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAR7WDJKMsNFR3d2NZjG3w0w7uemWMQn8ZqTuG_LVwAGzYzaJzk4jxmYBbZfaGCaRX913tUwyR5D1yrHyq8uBdLv0_pLh3C2h8K30jvHx4XpCOihxGt5m1DaClnxrG0o3IHnGiDqwVkTUyCnySFhuUHomdHoOGrbJGmaKjOp3kfZaf8MjSxer0u6OIVwbA7n960Jt6h1Sm8MndgN4Le65w1usIKNvY_UO7Mt70AvabE2Ha9wOw3nSSA"
                  alt="Portrait of Marcus Thorne"
                />
                <div className="absolute bottom-2 left-2 bg-surface/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-primary font-label-sm text-label-sm text-xs font-bold">
                  Co-Founder
                </div>
              </div>
              <div className="p-space-md flex flex-col flex-grow justify-between">
                <div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold text-base">Marcus Thorne</h3>
                  <p className="font-label-sm text-label-sm text-primary mb-space-xs text-xs font-bold">Community Lead</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed text-xs">
                    Pioneering farmers market organizer and vocal advocate for local food sovereignty and expanding SNAP/EBT access across pavilions.
                  </p>
                </div>
                <div className="mt-space-md pt-space-xs flex items-center gap-1 font-label-sm text-label-sm text-on-surface-variant text-xs border-t border-outline-variant/20">
                  <span className="material-symbols-outlined text-[16px] text-primary">groups</span> Community Equity
                </div>
              </div>
            </div>

            {/* Person 3 */}
            <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm flex flex-col hover:shadow-md transition-shadow border border-outline-variant/30">
              <div className="h-64 overflow-hidden relative">
                <img
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuACBBkWDmhYjPRj3pfXCEf-dFnwemRsJd6-MrPFHgmTbFdBBYPhX6kyk9PiNOqx3Hjl-JPSlv8bdWNs4L69py_6mfLP6IHBX7-nTmvldQZvDPbtfzzwY4tqBOo3qvUuoR1dEwzvLa-26ll0ZkUPKZG8BQu-kQI3woGftNv0yMX05JnNbZlO_cELXvq5BGQVTBdorF8awdJiI7FlKzJ21QZzAI4B2_NN1EqQpN1ayV1YWbCPSD4c6ERq"
                  alt="Portrait of Dr. Aris Thorne"
                />
                <div className="absolute bottom-2 left-2 bg-surface/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-primary font-label-sm text-label-sm text-xs font-bold">
                  Scientific Advisor
                </div>
              </div>
              <div className="p-space-md flex flex-col flex-grow justify-between">
                <div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold text-base">Dr. Aris Thorne</h3>
                  <p className="font-label-sm text-label-sm text-primary mb-space-xs text-xs font-bold">Soil Health Advisor &amp; Agronomist</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed text-xs">
                    Specialist in regenerative tillage, bio-intensive companion planting, and mycorrhizal soil fungi restoration.
                  </p>
                </div>
                <div className="mt-space-md pt-space-xs flex items-center gap-1 font-label-sm text-label-sm text-on-surface-variant text-xs border-t border-outline-variant/20">
                  <span className="material-symbols-outlined text-[16px] text-primary">biotech</span> Bio-Regeneration
                </div>
              </div>
            </div>

            {/* Person 4 */}
            <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm flex flex-col hover:shadow-md transition-shadow border border-outline-variant/30">
              <div className="h-64 overflow-hidden relative">
                <img
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAz7u7UFzhK4irlstEJGkGdXLpIqu1aK_Tg1Nc-OioBPF2yNf3NVb_uXfYna9ISPar5eZKuj68GnsjzOX4fzCCXa2G6_Z-omWgRESnjazpzU9p5IPm6Vx8I8elFNagHbTU1AbX7v-P7MG8AcZ-BvAjjAU0Zi576I8qudEWDLqqJDDPcHPqXh_3GoxsEXL7W7vqxfeHR65lmCz4bU8odWXwDN0nO9KbXqh7ZQcXPnDMnjOAUkoz0Z3Fi"
                  alt="Portrait of Elena Rostova"
                />
                <div className="absolute bottom-2 left-2 bg-surface/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-primary font-label-sm text-label-sm text-xs font-bold">
                  Market Operations
                </div>
              </div>
              <div className="p-space-md flex flex-col flex-grow justify-between">
                <div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold text-base">Elena Rostova</h3>
                  <p className="font-label-sm text-label-sm text-primary mb-space-xs text-xs font-bold">Stallholder Liaison</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed text-xs">
                    Artisan producer and direct liaison maintaining weekly coordination across our 14 regional farmers market councils.
                  </p>
                </div>
                <div className="mt-space-md pt-space-xs flex items-center gap-1 font-label-sm text-label-sm text-on-surface-variant text-xs border-t border-outline-variant/20">
                  <span className="material-symbols-outlined text-[16px] text-primary">store</span> Market Coordination
                </div>
              </div>
            </div>
          </div>

          {/* Advisory Circle Note */}
          <div className="mt-space-lg p-space-md bg-surface-container rounded-xl flex flex-col sm:flex-row items-center justify-between gap-space-md text-center sm:text-left border border-outline-variant/30">
            <div className="flex items-center gap-space-md">
              <div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed-variant shrink-0 shadow-sm">
                <span className="material-symbols-outlined text-[22px]">diversity_3</span>
              </div>
              <div>
                <p className="font-label-md text-label-md text-on-surface text-sm font-bold">Community Advisory Circle</p>
                <p className="font-body-sm text-body-sm text-on-surface-variant text-xs">
                  Operating in formal alliance with the Oregon and Pacific Northwest Farmers Market Associations.
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('contact-us')}
              className="font-label-md text-label-md text-primary hover:text-primary-container inline-flex items-center gap-1 whitespace-nowrap cursor-pointer text-xs font-bold"
            >
              <span>Inquire About Board Membership</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </section>

      {/* Trust & Transparency FAQ Grid */}
      <section className="w-full py-space-xl bg-surface">
        <div className="max-w-7xl mx-auto px-gutter">
          <div className="text-center max-w-2xl mx-auto mb-space-xl">
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-tertiary font-bold text-xs">Frequently Asked</span>
            <h2 className="font-headline-lg text-headline-lg text-primary mt-space-xs font-semibold">
              Honest Answers on How We Operate
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-space-xs text-xs">
              Clear standards for neighbors, growers, and community market volunteers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg text-xs">
            {/* FAQ 1 */}
            <div className="bg-surface-container-low p-space-lg rounded-xl flex flex-col gap-space-xs border border-outline-variant/30">
              <div className="flex items-center gap-space-xs text-primary font-headline-sm text-headline-sm font-semibold text-sm">
                <span className="material-symbols-outlined text-[24px] text-tertiary shrink-0">help_outline</span>
                Why don't you offer doorstep delivery?
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed pl-8">
                Heirloom vegetables, wild mushrooms, and ripe summer berries degrade rapidly in dry cargo vans. Doorstep logistics generate immense single-use waste, delivery fleets add congestion, and most critically—we believe the human bond between consumer and grower creates a healthier, more accountable regional food culture.
              </p>
            </div>

            {/* FAQ 2 */}
            <div className="bg-surface-container-low p-space-lg rounded-xl flex flex-col gap-space-xs border border-outline-variant/30">
              <div className="flex items-center gap-space-xs text-primary font-headline-sm text-headline-sm font-semibold text-sm">
                <span className="material-symbols-outlined text-[24px] text-tertiary shrink-0">help_outline</span>
                How does MarketLink sustain itself with zero grower fees?
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed pl-8">
                MarketLink is funded as a public agricultural utility via regional community foundation grants, municipal green infrastructure sponsorships, and voluntary micro-tips from shoppers when picking up their crates at market info kiosks. We never take a cut of farmer harvest revenue.
              </p>
            </div>

            {/* FAQ 3 */}
            <div className="bg-surface-container-low p-space-lg rounded-xl flex flex-col gap-space-xs border border-outline-variant/30">
              <div className="flex items-center gap-space-xs text-primary font-headline-sm text-headline-sm font-semibold text-sm">
                <span className="material-symbols-outlined text-[24px] text-tertiary shrink-0">help_outline</span>
                Can I use SNAP, EBT, or WIC tokens for reserved produce?
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed pl-8">
                Absolutely! Because all transactions take place in person at the physical market stall, you simply swipe your EBT card at the market welcome tent to receive market tokens or Double Up Food Bucks, which are gladly accepted by every certified stallholder in our network.
              </p>
            </div>

            {/* FAQ 4 */}
            <div className="bg-surface-container-low p-space-lg rounded-xl flex flex-col gap-space-xs border border-outline-variant/30">
              <div className="flex items-center gap-space-xs text-primary font-headline-sm text-headline-sm font-semibold text-sm">
                <span className="material-symbols-outlined text-[24px] text-tertiary shrink-0">help_outline</span>
                What happens if I cannot make it before 11:30 AM?
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed pl-8">
                Your reserved crate is held securely until 11:30 AM on market day. If unclaimed, the grower releases those items to walk-up market patrons so nothing spoils. There is never a cancellation fee, although we encourage messaging your grower directly through MarketLink if you're delayed!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Compelling Dual CTA Banner */}
      <section className="w-full bg-primary text-on-primary py-space-xl relative overflow-hidden">
        <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-primary-container opacity-40 blur-3xl pointer-events-none"></div>
        <div className="absolute -left-24 -bottom-24 w-96 h-96 rounded-full bg-secondary opacity-20 blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-gutter relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-xl items-center">
            {/* Shopper CTA Block */}
            <div className="bg-surface-container-lowest text-on-surface p-space-lg sm:p-space-xl rounded-xl shadow-xl flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant font-label-sm text-label-sm mb-space-sm font-bold text-xs">
                  <span className="material-symbols-outlined text-[16px]">shopping_basket</span> For Local Eaters
                </div>
                <h3 className="font-headline-lg text-headline-lg text-primary font-semibold mb-space-xs">
                  Taste True Field-to-Table Saturday Morning
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant mb-space-lg leading-relaxed text-xs">
                  Never arrive to sold-out heirloom tomato bins or missed sourdough batches again. Reserve your harvest favorites online with zero prepayments, pick up at your neighborhood market pavilion, and pay your farmer directly.
                </p>
              </div>
              <div>
                <button
                  type="button"
                  onClick={onOpenRegister}
                  className="inline-flex items-center justify-center font-label-md text-label-md text-on-tertiary bg-tertiary-container hover:bg-tertiary px-space-lg py-space-sm rounded-full shadow-md transition-colors w-full sm:w-auto text-xs font-bold cursor-pointer"
                >
                  Create Free Shopper Account
                </button>
              </div>
            </div>

            {/* Farmer CTA Block */}
            <div className="bg-primary-container text-on-primary p-space-lg sm:p-space-xl rounded-xl shadow-xl flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm mb-space-sm font-bold text-xs">
                  <span className="material-symbols-outlined text-[16px]">yard</span> For Regional Growers
                </div>
                <h3 className="font-headline-lg text-headline-lg text-on-primary font-semibold mb-space-xs">
                  Are You a Family Farm or Artisan Maker?
                </h3>
                <p className="font-body-md text-body-md text-primary-fixed-dim mb-space-lg leading-relaxed text-xs">
                  Harvest with confidence. Eliminate post-market unsold crate loss by securing verified local reservations before picking a single stem. 100% of your earnings remain entirely yours.
                </p>
              </div>
              <div>
                <button
                  type="button"
                  onClick={onOpenFarmerPortal}
                  className="inline-flex items-center justify-center font-label-md text-label-md text-on-secondary-container bg-secondary-container hover:bg-secondary-fixed-dim px-space-lg py-space-sm rounded-full shadow-md transition-colors w-full sm:w-auto text-xs font-bold cursor-pointer"
                >
                  Apply for Stallholder Network
                </button>
              </div>
            </div>
          </div>

          {/* Trust Footer Guarantee Note */}
          <div className="mt-space-lg text-center flex flex-wrap items-center justify-center gap-space-md text-primary-fixed-dim font-label-sm text-label-sm text-xs">
            <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[18px] text-secondary-fixed">lock_open</span> Free Forever to Join</span>
            <span>•</span>
            <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[18px] text-secondary-fixed">credit_card_off</span> No Credit Card Required</span>
            <span>•</span>
            <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[18px] text-secondary-fixed">handshake</span> 100% In-Person Stall Payment</span>
          </div>
        </div>
      </section>
    </div>
  );
}
