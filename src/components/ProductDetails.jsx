import React, { useState, useEffect } from 'react';
import browseApi from '../api/browse';
import customerApi from '../api/customer';
import { useAuth } from '../context/AuthContext';

export default function ProductDetails({ productId = 1, onNavigate, onReserveProduct, onNotifyProduct }) {
  const { isAuthenticated } = useAuth();
  const [activeThumb, setActiveThumb] = useState(0);
  const [quantity, setQuantity] = useState(2);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(142);
  const [liveProduct, setLiveProduct] = useState(null);

  useEffect(() => {
    let mounted = true;
    browseApi.getProduct(productId || 1).then((res) => {
      if (mounted && res.data) {
        setLiveProduct(res.data);
      }
    }).catch(() => {});
    return () => { mounted = false; };
  }, [productId]);

  const pricePerUnit = liveProduct ? Number(liveProduct.price) : 4.50;
  const totalPrice = (quantity * pricePerUnit).toFixed(2);

  const galleryImages = [
    {
      thumb: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAy0oOImtEenckS30qqZVa14L8P1wzLAcoYKh84ovouxXVdrd_frsBWvnB52CjgPYKxPddA-v9g-VPpSFFbmUo9fcnQ5xJLHYp7DiYdUD148OIe5DFvQjsYpNQ9perZKWj7xvvOp6XsKIyBzIUrNZ9wD0jDIrTzmpBGq6FFbKR-c6FmnvI7ej4fFaFNg6hx_80d5I7QQMWgrshVWpXbCpaIOx_Cq0kJvJfXtVKG4ak',
      label: 'Crate View',
      main: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC4efEixYoP9jG6xfxQZOo_-P_S0K_VxcMnht6G_qqJBGM76mTvCMK3dc4kQuNk3jTqZYI9bwjsolzCQVCYbP_A8KMs3R3bkZVB13VWy42k0sHeY4_KNN6do9anj-sIDysynB9OZS9rq1khFJ06ED_FTYJfKLnVmuOuYZ0eCwZYmD6jnW5oMyr0BjOr6T3vAksRnOisWWWft2nQqxijKzQDz_KYgX8vW-e5SrXpIzk',
      alt: 'Close-up high-resolution photograph of freshly harvested Heirloom Brandywine tomatoes in a rustic natural cedar wood crate'
    },
    {
      thumb: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAiAignb0klkUYYNy1HhBUy4e7IdUDtFM8hG5gjPhjhlX5tTiJKHVJMyoWL31Bqrp9RC8XR8tmkQN5btLkbLp2PM2JLviCOK3HfUrqrdsBAK5t9uO32TJPcSZRYEhA1ds8z4WfuBGntfo7CTqwTUrE8Y3_QRod8E-EzZ6zQvPOfKMMOh862wMTnfKO229vqy-MPnvGjKp7pSu5E4xedmmVMhIwYvCQLIRGjuz0gQGY',
      label: 'Sliced Flesh',
      main: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAiAignb0klkUYYNy1HhBUy4e7IdUDtFM8hG5gjPhjhlX5tTiJKHVJMyoWL31Bqrp9RC8XR8tmkQN5btLkbLp2PM2JLviCOK3HfUrqrdsBAK5t9uO32TJPcSZRYEhA1ds8z4WfuBGntfo7CTqwTUrE8Y3_QRod8E-EzZ6zQvPOfKMMOh862wMTnfKO229vqy-MPnvGjKp7pSu5E4xedmmVMhIwYvCQLIRGjuz0gQGY',
      alt: 'Artisanal sliced Heirloom Brandywine beefsteak tomato resting on a dark slate board showing thick, juicy, deep rose-red interior'
    },
    {
      thumb: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCSTYRF2Ko8Oqy7AP5smzwUk4QuGsmu5jCQLPoYV3i-2cZ_N7HSDhXXQ2efS7tNhQXZpcLxkqlv2dmDqyFLjljZv2LDmh5HqIG9DoP7IvpaOu2kO5D1BcT6l0IMtaqmoSnJHrJz4cNWRJw61HCuaPGN08aZ0L3l4XCnFh_44ATxptwUgsXQTd88YwJDUM1UjvIFOWVzORtgWzBeevi_EigXjRfARkknJS9WWzvsing',
      label: 'On The Vine',
      main: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCSTYRF2Ko8Oqy7AP5smzwUk4QuGsmu5jCQLPoYV3i-2cZ_N7HSDhXXQ2efS7tNhQXZpcLxkqlv2dmDqyFLjljZv2LDmh5HqIG9DoP7IvpaOu2kO5D1BcT6l0IMtaqmoSnJHrJz4cNWRJw61HCuaPGN08aZ0L3l4XCnFh_44ATxptwUgsXQTd88YwJDUM1UjvIFOWVzORtgWzBeevi_EigXjRfARkknJS9WWzvsing',
      alt: 'Healthy organic tomato vines laden with heavy, blushing Heirloom Brandywine tomatoes hanging in rich fertile garden soil'
    },
    {
      thumb: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQ3rPWwA3Te2cO3K-U5TdDBz-LbrMXFAKJvAdX0cC3ASsQw3HtP0JYhZGu4ACu3tRwPKSaUaDHxXeCajKboHUdXQhVcZnvQg9ivfsl1ARcoQdZn-PURB6NZInEGZ9YNzt7VotDMHg1eeKcCmFbYDwbPj5uwFq5i5pIW2RbTVeHNeX3gdT82dcaQsBjAMYeBkkizSBlspW27LbnWihQ63yIxE5WahhQuPiSjuHUCz0',
      label: 'Stall Crate',
      main: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQ3rPWwA3Te2cO3K-U5TdDBz-LbrMXFAKJvAdX0cC3ASsQw3HtP0JYhZGu4ACu3tRwPKSaUaDHxXeCajKboHUdXQhVcZnvQg9ivfsl1ARcoQdZn-PURB6NZInEGZ9YNzt7VotDMHg1eeKcCmFbYDwbPj5uwFq5i5pIW2RbTVeHNeX3gdT82dcaQsBjAMYeBkkizSBlspW27LbnWihQ63yIxE5WahhQuPiSjuHUCz0',
      alt: 'Packed biodegradable market pickup crate with aerated pulp basket holding 3 ripe Brandywine tomatoes'
    }
  ];

  const handleToggleWishlist = () => {
    if (isWishlisted) {
      setIsWishlisted(false);
      setWishlistCount((c) => c - 1);
    } else {
      setIsWishlisted(true);
      setWishlistCount((c) => c + 1);
    }
  };

  const handleReserveClick = () => {
    onReserveProduct({
      id: 'prod-heirloom-brandywine',
      name: 'Heirloom Brandywine Tomatoes',
      price: pricePerUnit,
      unit: 'lb',
      quantity,
      farm: 'Green Pastures Organic',
      market: 'Downtown Historic Farmers Market (Stall #4)',
      image: galleryImages[activeThumb].main,
      status: 'IN_STOCK'
    });
  };

  return (
    <div className="flex flex-col w-full">
      {/* Top Notice & Breadcrumb Navigation */}
      <section className="max-w-7xl mx-auto px-gutter w-full pt-space-lg pb-space-xs">
        <nav aria-label="Breadcrumbs" className="flex items-center flex-wrap gap-space-xs font-body-sm text-on-surface-variant text-xs">
          <button onClick={() => onNavigate('home')} className="hover:text-primary transition-colors flex items-center gap-1 cursor-pointer">
            <span className="material-symbols-outlined text-[16px] text-primary">roofing</span>
            <span>Home</span>
          </button>
          <span className="text-outline-variant">/</span>
          <button onClick={() => onNavigate('products')} className="hover:text-primary transition-colors cursor-pointer">
            Products
          </button>
          <span className="text-outline-variant">/</span>
          <button onClick={() => onNavigate('products')} className="hover:text-primary transition-colors cursor-pointer">
            Fresh Vegetables
          </button>
          <span className="text-outline-variant">/</span>
          <span className="text-on-surface font-semibold truncate">Heirloom Brandywine Tomatoes</span>
        </nav>
      </section>

      {/* Hero Product Detail Grid (2-Column Asymmetric Layout) */}
      <section className="max-w-7xl mx-auto px-gutter w-full py-space-md">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
          {/* LEFT COLUMN: Image Gallery & Freshness Stamps (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col gap-space-md">
            {/* Main Stage Image Container with badges */}
            <div className="relative w-full rounded-2xl overflow-hidden bg-surface-container shadow-md group border border-outline-variant/30">
              <img
                src={galleryImages[activeThumb].main}
                alt={galleryImages[activeThumb].alt}
                id="main-product-image"
                className="w-full aspect-[4/3] object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Overlaid Freshness Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-label-sm bg-surface/95 text-primary shadow-sm backdrop-blur-md text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                  IN STOCK (18 lbs for Saturday pickup)
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full font-label-sm bg-primary text-on-primary shadow-sm backdrop-blur-md text-xs">
                  <span className="material-symbols-outlined text-[15px]">wb_twilight</span>
                  Fresh Harvest: Picked Friday Dawn (6:30 AM)
                </span>
              </div>

              {/* Bottom Visual Guarantee Badge */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none text-xs">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg font-label-sm bg-surface-container-lowest/90 text-on-surface backdrop-blur-md shadow-sm">
                  <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
                  100% In-Person Inspection Before Purchase
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md font-label-sm bg-surface-container-high/90 text-on-surface-variant backdrop-blur-sm">
                  <span className="material-symbols-outlined text-[16px]">photo_camera</span>
                  Live Farm Photo
                </span>
              </div>
            </div>

            {/* 4-Image Thumbnail Navigation Strip */}
            <div className="grid grid-cols-4 gap-space-sm" id="thumb-strip">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveThumb(idx)}
                  className={`thumbnail-btn relative rounded-xl overflow-hidden bg-surface-container p-0 text-left transition-all active:scale-95 cursor-pointer ${
                    activeThumb === idx ? 'ring-2 ring-primary' : 'hover:opacity-90'
                  }`}
                >
                  <img src={img.thumb} alt={img.label} className="w-full aspect-square object-cover" />
                  <span className="absolute bottom-1 left-1 font-label-sm text-[10px] bg-surface/90 text-on-surface px-1.5 py-0.5 rounded font-semibold">
                    {img.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Ambient Quality Badges Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-sm pt-space-xs">
              <div className="p-space-sm rounded-xl bg-surface-container-low flex items-center gap-space-xs border border-outline-variant/30">
                <span className="material-symbols-outlined text-primary text-[22px]">eco</span>
                <div className="flex flex-col">
                  <span className="font-label-sm text-on-surface text-xs font-bold">USDA Organic</span>
                  <span className="font-body-sm text-[11px] text-on-surface-variant">Cert #OR-9942</span>
                </div>
              </div>
              <div className="p-space-sm rounded-xl bg-surface-container-low flex items-center gap-space-xs border border-outline-variant/30">
                <span className="material-symbols-outlined text-secondary text-[22px]">spa</span>
                <div className="flex flex-col">
                  <span className="font-label-sm text-on-surface text-xs font-bold">No Sprays</span>
                  <span className="font-body-sm text-[11px] text-on-surface-variant">Zero synthetic chemicals</span>
                </div>
              </div>
              <div className="p-space-sm rounded-xl bg-surface-container-low flex items-center gap-space-xs border border-outline-variant/30">
                <span className="material-symbols-outlined text-tertiary text-[22px]">hourglass_bottom</span>
                <div className="flex flex-col">
                  <span className="font-label-sm text-on-surface text-xs font-bold">95 Days Vine</span>
                  <span className="font-body-sm text-[11px] text-on-surface-variant">Full natural maturity</span>
                </div>
              </div>
              <div className="p-space-sm rounded-xl bg-surface-container-low flex items-center gap-space-xs border border-outline-variant/30">
                <span className="material-symbols-outlined text-primary text-[22px]">history_edu</span>
                <div className="flex flex-col">
                  <span className="font-label-sm text-on-surface text-xs font-bold">Heirloom Line</span>
                  <span className="font-body-sm text-[11px] text-on-surface-variant">Amish seed strain 1885</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Purchase / Stall Hold Card (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-space-md">
            {/* Provenance Badge */}
            <button
              type="button"
              onClick={() => onNavigate('farmer-profile')}
              className="group inline-flex items-center justify-between p-space-sm rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors text-left border border-outline-variant/30 cursor-pointer"
            >
              <div className="flex items-center gap-space-sm">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-surface-container-high flex-shrink-0 border border-outline-variant/30">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBMjOSKr4JWPasC4kad96ULfaNXM6nuhu8GW64F8Z4HhxT08zp9TQSvUlonDqV_k9x2cfG_lr59Zp-e-OUkwH4UWhRLju12adMGlac07tgaIax54229AYg7ka1WcgO_cb-oPZInU5XGc4WpKZfaE5uMVTFzp2L6HB8dn_gVlJ16UxOZ9IPwxSNrPTNRAxmLKfk4KaAXPCLRHpwDwdWSJGX-HBzAnkuTUJ0eZ8uEAvc"
                    alt="Martha and Joe Miller"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-label-md text-primary group-hover:underline flex items-center gap-1 text-sm font-bold">
                    Green Pastures Organic
                    <span className="material-symbols-outlined text-[16px]">verified</span>
                  </span>
                  <span className="font-body-sm text-xs text-on-surface-variant">Stall #4, Aisle B • Downtown Historic Market</span>
                </div>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary group-hover:translate-x-0.5 transition-all text-[20px]">
                chevron_right
              </span>
            </button>

            {/* Title & Rating Line */}
            <div className="flex flex-col gap-space-xs">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-label-sm uppercase tracking-wider text-secondary font-bold">Solanaceae Heirloom Strain</span>
                <span className="text-outline-variant">•</span>
                <span className="font-label-sm text-tertiary bg-tertiary-fixed/30 px-2 py-0.5 rounded-full font-bold">
                  Top Seasonal Pick
                </span>
              </div>
              <h1 className="font-headline-lg text-on-surface leading-tight font-bold">
                Heirloom Brandywine Tomatoes
              </h1>
              <div className="flex items-center flex-wrap gap-space-sm text-on-surface-variant text-xs">
                <div className="flex items-center text-tertiary">
                  {[...Array(4)].map((_, i) => (
                    <span key={i} className="material-symbols-outlined text-[18px] fill">star</span>
                  ))}
                  <span className="material-symbols-outlined text-[18px]">star_half</span>
                </div>
                <span className="font-label-md text-on-surface font-bold">4.96</span>
                <a className="font-body-sm text-on-surface-variant underline hover:text-primary transition-colors" href="#customer-reviews">
                  (38 verified harvest reviews)
                </a>
                <span className="text-outline-variant">•</span>
                <span className="font-body-sm text-on-surface-variant">Pine Creek Valley, OR</span>
              </div>
            </div>

            {/* Pricing Block */}
            <div className="p-space-md rounded-2xl bg-surface-container-low flex flex-col gap-1 border border-outline-variant/30">
              <div className="flex items-baseline gap-2">
                <span className="font-display-lg text-primary font-bold leading-none">$4.50</span>
                <span className="font-body-lg text-on-surface-variant font-semibold text-sm">/ lb</span>
              </div>
              <p className="font-body-sm text-on-surface-variant text-xs">
                Sold in 1 lb increments (approx. 2 to 3 tender medium beefsteak heirlooms).
              </p>
            </div>

            {/* Designated Market Pickup Schedule Box */}
            <div className="p-space-md rounded-2xl bg-surface-container flex flex-col gap-space-sm border border-outline-variant/30">
              <div className="flex items-start gap-space-sm">
                <div className="w-9 h-9 rounded-xl bg-primary text-on-primary flex items-center justify-center flex-shrink-0 shadow-sm">
                  <span className="material-symbols-outlined text-[20px]">storefront</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-label-sm text-on-surface-variant uppercase tracking-wider text-[11px]">Pickup Location</span>
                  <p className="font-label-md text-on-surface text-sm font-bold">Downtown Historic Farmers Market</p>
                  <p className="font-body-sm text-xs text-on-surface-variant">
                    Pioneer Pavilion, 450 Market St • Stall #4 (North Arch under Clocktower)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-space-sm pt-space-xs border-t border-outline-variant/20">
                <div className="w-9 h-9 rounded-xl bg-secondary-container text-on-secondary-container flex items-center justify-center flex-shrink-0 shadow-sm">
                  <span className="material-symbols-outlined text-[20px]">event_available</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-label-sm text-on-surface-variant uppercase tracking-wider text-[11px]">Harvest Collection Window</span>
                  <p className="font-label-md text-on-surface text-sm font-bold">Saturday, 8:00 AM – 11:30 AM</p>
                  <p className="font-body-sm text-xs text-on-surface-variant">
                    Reserved crates kept in shaded stall cool-box until 11:30 AM cutoff.
                  </p>
                </div>
              </div>
            </div>

            {/* Quantity & Stand Reservation Panel */}
            <div className="p-space-md rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-md border border-outline-variant/30">
              <div className="flex items-center justify-between">
                <span className="font-label-md text-on-surface text-sm font-bold">Choose Weight (lbs)</span>
                <div className="flex items-center gap-space-xs">
                  <button
                    aria-label="Decrease quantity"
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-9 h-9 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface flex items-center justify-center font-bold text-lg active:scale-95 transition-all cursor-pointer"
                  >
                    -
                  </button>
                  <div className="px-space-md py-1 bg-surface-container-low rounded-lg font-headline-sm text-on-surface min-w-[54px] text-center font-bold text-base">
                    {quantity}
                  </div>
                  <button
                    aria-label="Increase quantity"
                    type="button"
                    onClick={() => setQuantity(Math.min(18, quantity + 1))}
                    className="w-9 h-9 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface flex items-center justify-center font-bold text-lg active:scale-95 transition-all cursor-pointer"
                  >
                    +
                  </button>
                  <span className="font-body-sm text-on-surface-variant ml-1 font-semibold text-xs">lbs</span>
                </div>
              </div>

              {/* Total Calculation Breakdown */}
              <div className="pt-space-xs pb-space-xs flex items-center justify-between border-t border-outline-variant/20">
                <div className="flex flex-col">
                  <span className="font-label-sm text-on-surface-variant text-xs">Estimated Stall Total</span>
                  <span className="font-body-sm text-[11px] text-secondary font-semibold">Zero online payment • Zero handling fees</span>
                </div>
                <span className="font-headline-md text-primary font-bold text-xl">${totalPrice}</span>
              </div>

              {/* Reservation CTA Cluster */}
              <div className="flex flex-col sm:flex-row items-stretch gap-space-xs">
                <button
                  type="button"
                  onClick={handleReserveClick}
                  className="flex-1 py-space-sm px-space-md rounded-full bg-tertiary-container hover:bg-tertiary text-on-tertiary font-label-md text-center transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2 cursor-pointer text-sm font-bold"
                >
                  <span className="material-symbols-outlined text-[20px]">calendar_today</span>
                  <span>Reserve for Saturday Pickup</span>
                </button>
                <button
                  type="button"
                  onClick={handleToggleWishlist}
                  title="Save to harvest wishlist"
                  className="p-space-sm rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-primary transition-all flex items-center justify-center gap-1.5 px-4 cursor-pointer"
                >
                  <span className={`material-symbols-outlined text-[20px] text-error ${isWishlisted ? 'fill' : ''}`}>
                    favorite
                  </span>
                  <span className="font-label-sm text-xs font-bold">{wishlistCount}</span>
                </button>
              </div>

              {/* Guest Notice Callout Box */}
              <div className="p-space-sm rounded-xl bg-surface-container-low flex items-start gap-space-xs border border-outline-variant/20">
                <span className="material-symbols-outlined text-primary text-[20px] mt-0.5 flex-shrink-0">spa</span>
                <div className="flex flex-col">
                  <p className="font-label-sm text-on-surface font-semibold text-xs">🌱 Guest Notice</p>
                  <p className="font-body-sm text-[11px] text-on-surface-variant leading-relaxed">
                    Reserve your batch for Saturday. <strong>No credit card required.</strong> Settle directly via Cash, Credit Card, or Oregon SNAP/WIC tokens with Martha &amp; Joe Miller at Stall #4.
                  </p>
                </div>
              </div>

              {/* In-Person Guarantee Terms */}
              <div className="grid grid-cols-2 gap-space-xs pt-space-xs text-on-surface-variant">
                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-primary text-[18px] mt-0.5">thumb_up</span>
                  <div className="flex flex-col">
                    <span className="font-label-sm text-on-surface text-xs font-bold">Inspect at Stall</span>
                    <span className="font-body-sm text-[11px] text-on-surface-variant">Examine fruit prior to payment. Zero penalty if not thrilled.</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-secondary text-[18px] mt-0.5">thermostat</span>
                  <div className="flex flex-col">
                    <span className="font-label-sm text-on-surface text-xs font-bold">Shaded Cool-Box</span>
                    <span className="font-body-sm text-[11px] text-on-surface-variant">Protected from morning heat until your arrival.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Specifications, Flavor Profile & Storage Tabs */}
      <section className="max-w-7xl mx-auto px-gutter w-full py-space-xl">
        <div className="p-space-xl rounded-3xl bg-surface-container-low border border-outline-variant/30">
          <div className="flex flex-col gap-space-xs max-w-3xl mb-space-lg">
            <span className="font-label-sm uppercase tracking-widest text-primary font-bold text-xs">Cultivar &amp; Soil Legacy</span>
            <h2 className="font-headline-lg text-on-surface">The Legend of the Brandywine Beefsteak</h2>
            <p className="font-body-lg text-on-surface-variant text-sm">
              Cherished since 1885, the Amish Pink Brandywine is universally revered among heirloom enthusiasts for its unmatchable deep, sweet-tart depth that hybrid varieties cannot replicate.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-space-lg">
            {/* Flavor Profile Story Card (7 Cols) */}
            <div className="md:col-span-7 flex flex-col gap-space-md p-space-lg rounded-2xl bg-surface-container-lowest shadow-sm border border-outline-variant/30">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-tertiary text-[24px]">restaurant_menu</span>
                <h3 className="font-headline-sm text-on-surface font-semibold text-base">Flavor Notes &amp; Kitchen Pairings</h3>
              </div>
              <p className="font-body-md text-on-surface-variant leading-relaxed text-xs">
                Grown directly in deep alluvial river silt along the Pine Creek riverbed, these Brandywines develop an intense, velvety richness punctuated by a crisp, bright acidity and a lingering honeyed finish. Their flesh is luscious, meaty, and dense with remarkably tiny seed pockets.
              </p>
              <div className="flex flex-col gap-space-xs pt-space-xs text-xs">
                <div className="flex items-center justify-between font-label-sm text-on-surface-variant">
                  <span>Rich Umami Density</span>
                  <span className="text-primary font-bold">96%</span>
                </div>
                <div className="w-full bg-surface-container rounded-full h-2 overflow-hidden">
                  <div className="bg-primary h-2 rounded-full w-[96%]"></div>
                </div>

                <div className="flex items-center justify-between font-label-sm text-on-surface-variant pt-2">
                  <span>Natural Sugar vs Acidity Balance</span>
                  <span className="text-tertiary font-bold">Balanced Crisp (88%)</span>
                </div>
                <div className="w-full bg-surface-container rounded-full h-2 overflow-hidden">
                  <div className="bg-tertiary-container h-2 rounded-full w-[88%]"></div>
                </div>

                <div className="flex items-center justify-between font-label-sm text-on-surface-variant pt-2">
                  <span>Beefsteak Firmness</span>
                  <span className="text-secondary font-bold">Tender Velvet (80%)</span>
                </div>
                <div className="w-full bg-surface-container rounded-full h-2 overflow-hidden">
                  <div className="bg-secondary h-2 rounded-full w-[80%]"></div>
                </div>
              </div>

              <div className="pt-space-sm flex flex-col gap-2 text-xs">
                <span className="font-label-sm text-on-surface font-semibold">Chef's Recommended Preparations:</span>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full bg-surface-container-high font-body-sm text-xs text-on-surface">Thick Sliced on Grilled Sourdough</span>
                  <span className="px-3 py-1 rounded-full bg-surface-container-high font-body-sm text-xs text-on-surface">Fresh Basil &amp; Buffalo Mozzarella Caprese</span>
                  <span className="px-3 py-1 rounded-full bg-surface-container-high font-body-sm text-xs text-on-surface">Uncooked Summer Gazpacho</span>
                  <span className="px-3 py-1 rounded-full bg-surface-container-high font-body-sm text-xs text-on-surface">Flaky Maldon Sea Salt &amp; Estate Olive Oil</span>
                </div>
              </div>
            </div>

            {/* Harvest & Storage Specs (5 Cols) */}
            <div className="md:col-span-5 flex flex-col gap-space-md p-space-lg rounded-2xl bg-surface-container-lowest shadow-sm border border-outline-variant/30 text-xs">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[24px]">kitchen</span>
                <h3 className="font-headline-sm text-on-surface font-semibold text-base">Harvest &amp; Storage Specs</h3>
              </div>
              <div className="flex flex-col gap-space-sm">
                <div className="p-space-sm rounded-xl bg-surface-container flex items-start gap-space-sm">
                  <span className="material-symbols-outlined text-primary text-[20px] mt-0.5">calendar_month</span>
                  <div className="flex flex-col">
                    <span className="font-label-sm text-on-surface font-bold">Harvest Schedule</span>
                    <span className="font-body-sm text-xs text-on-surface-variant">Hand-cut at Friday 6:30 AM dawn with stems intact to seal internal natural moisture.</span>
                  </div>
                </div>
                <div className="p-space-sm rounded-xl bg-surface-container flex items-start gap-space-sm">
                  <span className="material-symbols-outlined text-error text-[20px] mt-0.5">warning</span>
                  <div className="flex flex-col">
                    <span className="font-label-sm text-error font-bold">Never Refrigerate Heirlooms!</span>
                    <span className="font-body-sm text-xs text-on-surface-variant">Cold destroys the volatile aromatic compounds. Store stem-side down on counter at 65°–72°F.</span>
                  </div>
                </div>
                <div className="p-space-sm rounded-xl bg-surface-container flex items-start gap-space-sm">
                  <span className="material-symbols-outlined text-secondary text-[20px] mt-0.5">recycling</span>
                  <div className="flex flex-col">
                    <span className="font-label-sm text-on-surface font-bold">Stall Packaging</span>
                    <span className="font-body-sm text-xs text-on-surface-variant">Packed in 100% compostable molded recycled wood fiber baskets to prevent bruising.</span>
                  </div>
                </div>
                <div className="p-space-sm rounded-xl bg-surface-container flex items-start gap-space-sm">
                  <span className="material-symbols-outlined text-primary text-[20px] mt-0.5">hourglass_top</span>
                  <div className="flex flex-col">
                    <span className="font-label-sm text-on-surface font-bold">Window of Peak Ripeness</span>
                    <span className="font-body-sm text-xs text-on-surface-variant">Ready immediately upon Saturday pickup; optimal savoring within 3 to 4 days.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* "Meet Your Grower" Spotlight */}
      <section className="max-w-7xl mx-auto px-gutter w-full py-space-md">
        <div className="relative overflow-hidden rounded-3xl bg-primary text-on-primary p-space-lg sm:p-space-xl shadow-lg">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center">
            {/* Grower Avatar & Metadata (4 Cols) */}
            <div className="lg:col-span-4 flex flex-col items-center sm:items-start text-center sm:text-left gap-space-sm">
              <div className="relative">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden ring-4 ring-secondary-fixed shadow-md">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDPcj3m8vWwKpN7J5nXBKgza3Vv8kQSIC816WKyOsUckULplQVjdirIDSaQJ2H4vLkSwmz7p4tN8Di5OyJFmOVG3o66HBfSUC9zIsq-0oN3HyIHioAdto-kj5YILJgPpZxzngk3SuWEXcMg9AdafH4xHwj8bOuIIbXT_DbGhHw2anjg2nOoR11SsRTfSqWn9XsDGcAHkRtXBLM2kYBcH9ZX9-zyJWsXTRI3RWxUgSY"
                    alt="Martha Miller of Green Pastures Organic"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="absolute bottom-0 right-0 bg-secondary-fixed text-on-secondary-fixed p-1 rounded-full flex items-center justify-center shadow">
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                </span>
              </div>
              <div className="flex flex-col">
                <h3 className="font-headline-md text-on-primary">Martha &amp; Joe Miller</h3>
                <p className="font-label-md text-secondary-fixed">Green Pastures Organic • Pine Creek, OR</p>
                <p className="font-body-sm text-primary-fixed-dim text-xs mt-1">Founding Downtown Farmers Market Vendor (24 Yrs)</p>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-container font-label-sm text-xs text-on-primary-container">
                <span className="material-symbols-outlined text-[16px]">location_on</span>
                <span>22 miles from Downtown Pavilion</span>
              </div>
            </div>

            {/* Grower Story & Stall Action (8 Cols) */}
            <div className="lg:col-span-8 flex flex-col gap-space-md">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary-fixed text-[24px]">format_quote</span>
                <span className="font-label-md uppercase tracking-wider text-secondary-fixed font-bold text-xs">
                  Why We Save Brandywine Seeds
                </span>
              </div>
              <blockquote className="font-body-lg text-on-primary leading-relaxed italic text-sm">
                "We have carefully saved and replanted seeds from our very sweetest, most crack-resistant Brandywine vines every single autumn since 1986. These tomatoes haven't traveled on refrigerated semi-trucks; they grew in river silt two dozen miles from where you'll pick them up this Saturday."
              </blockquote>
              <div className="flex flex-col sm:flex-row items-center gap-space-md pt-space-xs">
                <button
                  type="button"
                  onClick={() => onNavigate('farmer-profile')}
                  className="w-full sm:w-auto px-space-lg py-space-sm rounded-full bg-secondary-fixed hover:bg-secondary-fixed-dim text-on-secondary-fixed font-label-md transition-all text-center shadow-md active:scale-95 flex items-center justify-center gap-2 text-xs font-bold cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">agriculture</span>
                  <span>View Stall #4 Full Harvest (8 active items)</span>
                </button>
                <span className="font-body-sm text-primary-fixed-dim text-xs text-center sm:text-left">
                  Cash, Farm Tokens &amp; Venmo accepted at stall table.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews & Rating Breakdown */}
      <section className="max-w-7xl mx-auto px-gutter w-full py-space-xl" id="customer-reviews">
        <div className="flex flex-col gap-space-xl">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-space-md">
            <div className="flex flex-col gap-1">
              <span className="font-label-sm uppercase tracking-wider text-primary font-bold text-xs">Verified Community Feedback</span>
              <h2 className="font-headline-lg text-on-surface">Harvest Reviews &amp; Stall Ratings</h2>
            </div>
            <button
              type="button"
              onClick={() => alert('Review dialog opened for Heirloom Brandywine Tomatoes!')}
              className="inline-flex items-center gap-2 px-space-md py-space-sm rounded-full bg-surface-container hover:bg-surface-container-high text-primary font-label-md transition-colors self-start sm:self-auto text-xs font-bold cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">rate_review</span>
              <span>Write a Stall Review (Shoppers Only)</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-space-lg items-center p-space-lg rounded-2xl bg-surface-container-low border border-outline-variant/30">
            {/* Score Card (4 Cols) */}
            <div className="md:col-span-4 flex flex-col items-center justify-center p-space-md text-center">
              <span className="font-display-lg text-on-surface leading-none font-bold">4.96</span>
              <div className="flex items-center text-tertiary mt-2">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="material-symbols-outlined text-[22px] fill">star</span>
                ))}
              </div>
              <span className="font-body-sm text-on-surface-variant mt-1 font-semibold text-xs">
                Based on 38 verified pickup reservations
              </span>
              <span className="font-label-sm text-primary text-xs mt-2 bg-surface-container px-3 py-1 rounded-full font-bold">
                100% Recommendation Rate
              </span>
            </div>

            {/* Visual Bar Breakdown (8 Cols) */}
            <div className="md:col-span-8 flex flex-col gap-2 text-xs">
              <div className="flex items-center gap-space-sm font-label-sm text-on-surface-variant">
                <span className="w-12 text-right">5 Stars</span>
                <div className="flex-1 bg-surface-container-high rounded-full h-2.5 overflow-hidden">
                  <div className="bg-primary h-2.5 rounded-full w-[94%]"></div>
                </div>
                <span className="w-8 text-right font-bold text-on-surface">36</span>
              </div>
              <div className="flex items-center gap-space-sm font-label-sm text-on-surface-variant">
                <span className="w-12 text-right">4 Stars</span>
                <div className="flex-1 bg-surface-container-high rounded-full h-2.5 overflow-hidden">
                  <div className="bg-primary h-2.5 rounded-full w-[6%]"></div>
                </div>
                <span className="w-8 text-right font-bold text-on-surface">2</span>
              </div>
              <div className="flex items-center gap-space-sm font-label-sm text-on-surface-variant">
                <span className="w-12 text-right">3 Stars</span>
                <div className="flex-1 bg-surface-container-high rounded-full h-2.5 overflow-hidden">
                  <div className="bg-primary h-2.5 rounded-full w-[0%]"></div>
                </div>
                <span className="w-8 text-right font-bold text-on-surface">0</span>
              </div>
              <div className="flex items-center gap-space-sm font-label-sm text-on-surface-variant">
                <span className="w-12 text-right">2 Stars</span>
                <div className="flex-1 bg-surface-container-high rounded-full h-2.5 overflow-hidden">
                  <div className="bg-primary h-2.5 rounded-full w-[0%]"></div>
                </div>
                <span className="w-8 text-right font-bold text-on-surface">0</span>
              </div>
              <div className="flex items-center gap-space-sm font-label-sm text-on-surface-variant">
                <span className="w-12 text-right">1 Star</span>
                <div className="flex-1 bg-surface-container-high rounded-full h-2.5 overflow-hidden">
                  <div className="bg-primary h-2.5 rounded-full w-[0%]"></div>
                </div>
                <span className="w-8 text-right font-bold text-on-surface">0</span>
              </div>
            </div>
          </div>

          {/* Individual Reviews */}
          <div className="flex flex-col gap-space-md">
            {/* Review 1 */}
            <article className="p-space-lg rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-sm border border-outline-variant/30">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-space-sm">
                  <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center font-bold text-primary font-headline-sm">
                    E
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-md text-on-surface font-bold text-sm">Elena Rostova</span>
                    <span className="font-body-sm text-xs text-on-surface-variant">Downtown Resident • Verified Saturday Shopper</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="flex items-center text-tertiary">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="material-symbols-outlined text-[16px] fill">star</span>
                    ))}
                  </div>
                  <span className="font-body-sm text-xs text-on-surface-variant">2 weeks ago</span>
                </div>
              </div>
              <p className="font-body-md text-on-surface-variant leading-relaxed text-xs">
                "The most intensely flavorful tomato you will ever taste in Oregon. Reserving on MarketLink guarantees I get the largest beefsteaks before they sell out at 9:00 AM. I picked them up at 10:30 AM without any worry, paid Martha with cash, and had the most incredible Caprese salad of the summer."
              </p>
              <div className="flex items-center gap-space-xs text-xs font-label-sm text-primary">
                <span className="material-symbols-outlined text-[16px]">verified</span>
                <span>Verified In-Person Handover at Stall #4</span>
              </div>
            </article>

            {/* Review 2 with Farmer Reply */}
            <article className="p-space-lg rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-md border border-outline-variant/30">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-space-sm">
                  <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center font-bold text-primary font-headline-sm">
                    M
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-md text-on-surface font-bold text-sm">Marcus Thorne</span>
                    <span className="font-body-sm text-xs text-on-surface-variant">Oak Valley Regular • Reserved 4 lbs</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="flex items-center text-tertiary">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="material-symbols-outlined text-[16px] fill">star</span>
                    ))}
                  </div>
                  <span className="font-body-sm text-xs text-on-surface-variant">August 17, 2024</span>
                </div>
              </div>
              <p className="font-body-md text-on-surface-variant leading-relaxed text-xs">
                "Huge heirloom specimens! One single tomato weighed nearly a pound. Soft, aromatic, and totally free from commercial wax or refrigeration mealy texture. Picked up right under the clocktower arch."
              </p>
              <div className="ml-4 sm:ml-8 p-space-md rounded-xl bg-surface-container flex flex-col gap-2 border border-outline-variant/20 text-xs">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[18px]">nature_people</span>
                  <span className="font-label-sm text-on-surface font-bold">Joe Miller (Green Pastures Grower)</span>
                  <span className="font-body-sm text-xs text-on-surface-variant">• Farmer Response</span>
                </div>
                <p className="font-body-sm text-on-surface-variant leading-relaxed text-xs">
                  "Thank you Marcus! Glad that 14-ounce prize made your kitchen table! Pro-tip for next batch: leave any heirlooms with slight green shoulders on your windowsill stem-down for 24 hours. The sugar concentrations peak just before the calyx gently detaches. See you Saturday at Stall #4!"
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* "More From Green Pastures Organic" (Stall 4 Catalog) */}
      <section className="max-w-7xl mx-auto px-gutter w-full py-space-xl border-t border-outline-variant/30">
        <div className="flex flex-col gap-space-lg">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-space-sm">
            <div className="flex flex-col gap-1">
              <span className="font-label-sm uppercase tracking-wider text-secondary font-bold text-xs">Same Stall Handover</span>
              <h2 className="font-headline-lg text-on-surface">More From Green Pastures Organic</h2>
              <p className="font-body-sm text-on-surface-variant text-xs">
                Bundle multiple harvest items into a single Saturday pickup window at Stall #4.
              </p>
            </div>
            <button
              onClick={() => onNavigate('farmer-profile')}
              className="inline-flex items-center gap-1 font-label-md text-primary hover:text-primary-container transition-colors group cursor-pointer text-xs font-bold"
            >
              <span>Explore All 8 Harvest Items</span>
              <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-lg">
            {/* Card 1 */}
            <div className="rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-all flex flex-col overflow-hidden group border border-outline-variant/30">
              <div className="relative w-full aspect-[4/3] bg-surface-container overflow-hidden">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuACEBfUOB-14mIs1os5rgKmohz9k5SI-X4OkwiqGzDODUOE1-hgnN7FtdLUSCxUw2WFScNN30zraxhTeEigxHdiZPjCQqdJ-whM7q4R425M5LIJQaL-BwAD3z-GVKolujdJ6sUL1PffmOzaZBhK6nO2ynPDyq4mffrbnN9tWRuK9H1ZNo9fnF7VpMsrq4bgdzJQvIbWu-sQ81elCWru6568rrtl1ZlDDscwgyQTk6k"
                  alt="Rainbow Chard and Kale Bundle"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full font-label-sm bg-surface/90 text-primary backdrop-blur-sm text-xs font-bold">
                  In Stock (12 bundles)
                </span>
              </div>
              <div className="p-space-md flex flex-col flex-1 justify-between gap-space-sm">
                <div className="flex flex-col gap-1">
                  <span className="font-label-sm text-xs text-primary font-bold">Stall #4 • Green Pastures</span>
                  <h3 className="font-headline-sm text-on-surface text-base">Rainbow Chard &amp; Kale Bundle</h3>
                  <p className="font-body-sm text-xs text-on-surface-variant">Crisp, dew-drenched hearty greens harvested Friday dusk.</p>
                </div>
                <div className="flex items-center justify-between pt-space-xs">
                  <span className="font-headline-sm text-primary font-bold">$3.75 <span className="font-body-sm text-on-surface-variant font-normal text-xs">/ bunch</span></span>
                  <button
                    onClick={() => onReserveProduct({
                      name: 'Rainbow Chard & Kale Bundle',
                      price: 3.75,
                      unit: 'bunch',
                      farm: 'Green Pastures Organic',
                      market: 'Downtown Historic Farmers Market (Stall #4)',
                      quantity: 1
                    })}
                    className="px-4 py-2 rounded-full bg-tertiary-container hover:bg-tertiary text-on-tertiary font-label-sm transition-all shadow-sm active:scale-95 text-xs font-bold cursor-pointer"
                  >
                    Reserve
                  </button>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-all flex flex-col overflow-hidden group border border-outline-variant/30">
              <div className="relative w-full aspect-[4/3] bg-surface-container overflow-hidden">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuApxqjBTzAbd4tCaHralRyqekJjucumDV6aBFNsIrUfMtvt39vtGRDuwq4jAlTCU-nizHa6TguCRFpYaP_eS6HQLQuD0_PJYlr75fo52hMGoBV-5kvzhkUJ8tvj3f-fyxxm7-cbWQC9GSY9AIpobKT6HXOsOvr15HT9J8orRqekVW8j8a0JnADrDN6_k3Wlyp39mlTlJTZT52Rq3KSPEElwM-biqxsHjYh9mMEtlnc"
                  alt="Watercress and Microgreen Trio"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full font-label-sm bg-surface/90 text-primary backdrop-blur-sm text-xs font-bold">
                  In Stock (8 punnets)
                </span>
              </div>
              <div className="p-space-md flex flex-col flex-1 justify-between gap-space-sm">
                <div className="flex flex-col gap-1">
                  <span className="font-label-sm text-xs text-primary font-bold">Stall #4 • Green Pastures</span>
                  <h3 className="font-headline-sm text-on-surface text-base">Watercress &amp; Microgreen Trio</h3>
                  <p className="font-body-sm text-xs text-on-surface-variant">Spicy upland watercress paired with tender pea shoots.</p>
                </div>
                <div className="flex items-center justify-between pt-space-xs">
                  <span className="font-headline-sm text-primary font-bold">$4.00 <span className="font-body-sm text-on-surface-variant font-normal text-xs">/ pack</span></span>
                  <button
                    onClick={() => onReserveProduct({
                      name: 'Watercress & Microgreen Trio',
                      price: 4.00,
                      unit: 'pack',
                      farm: 'Green Pastures Organic',
                      market: 'Downtown Historic Farmers Market (Stall #4)',
                      quantity: 1
                    })}
                    className="px-4 py-2 rounded-full bg-tertiary-container hover:bg-tertiary text-on-tertiary font-label-sm transition-all shadow-sm active:scale-95 text-xs font-bold cursor-pointer"
                  >
                    Reserve
                  </button>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-all flex flex-col overflow-hidden group border border-outline-variant/30">
              <div className="relative w-full aspect-[4/3] bg-surface-container overflow-hidden">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCSqI2NYdWr6ZJ5cRUESXSJGhhSxVSl2JzDJI2xsFxM97XxqlATIrzgcnbE8v3AoA3E8Ro54c8QgeXHD_cdG0j9XtHJMdeN8EAFRfSmFmWF4SXkR-NHbK1BfyDxDoEuitDz4dFbl1NmJwrl-pIwMKoQSAzz2ZM6R_SC4rjKNpVWF8nVBK_eR0x_sACG0-jWc2UVQ4oB_VWe2662L2vNSR6l4YpIbaKtpSI2db_Cjps"
                  alt="Golden Baby Beets and Tops"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full font-label-sm bg-surface/90 text-primary backdrop-blur-sm text-xs font-bold">
                  In Stock (15 bunches)
                </span>
              </div>
              <div className="p-space-md flex flex-col flex-1 justify-between gap-space-sm">
                <div className="flex flex-col gap-1">
                  <span className="font-label-sm text-xs text-primary font-bold">Stall #4 • Green Pastures</span>
                  <h3 className="font-headline-sm text-on-surface text-base">Golden Baby Beets &amp; Tops</h3>
                  <p className="font-body-sm text-xs text-on-surface-variant">Mild, sweet golden globes with sauté-ready tender greens.</p>
                </div>
                <div className="flex items-center justify-between pt-space-xs">
                  <span className="font-headline-sm text-primary font-bold">$3.50 <span className="font-body-sm text-on-surface-variant font-normal text-xs">/ bunch</span></span>
                  <button
                    onClick={() => onReserveProduct({
                      name: 'Golden Baby Beets & Tops',
                      price: 3.50,
                      unit: 'bunch',
                      farm: 'Green Pastures Organic',
                      market: 'Downtown Historic Farmers Market (Stall #4)',
                      quantity: 1
                    })}
                    className="px-4 py-2 rounded-full bg-tertiary-container hover:bg-tertiary text-on-tertiary font-label-sm transition-all shadow-sm active:scale-95 text-xs font-bold cursor-pointer"
                  >
                    Reserve
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* "Similar Products at Downtown Historic Market" (Neighboring Stalls) */}
      <section className="max-w-7xl mx-auto px-gutter w-full py-space-xl border-t border-outline-variant/30">
        <div className="flex flex-col gap-space-lg">
          <div className="flex flex-col gap-1">
            <span className="font-label-sm uppercase tracking-wider text-primary font-bold text-xs">Neighboring Market Stands</span>
            <h2 className="font-headline-lg text-on-surface">More Saturday Morning Discoveries</h2>
            <p className="font-body-sm text-on-surface-variant text-xs">
              Pick up these market essentials during your visit to the Downtown Pioneer Pavilion.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-lg">
            {/* Neighbor Card 1 */}
            <div className="rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-all flex flex-col overflow-hidden group border border-outline-variant/30">
              <div className="relative w-full aspect-[4/3] bg-surface-container overflow-hidden">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBKBbj9wCBqS8drHANHZq51jqkFXz0hygDQByUE2ta111p92WYebmb4IMDN5bVuZN9Ob2-2VKfohQGzLQABf88vlPwxIKEF-_bpRg_wb139laHTIS2DdDVwUlBVpFbceF8EzRvF09-DhlTtJMtUp0Am0J7mjhmItUxQ5GOxUcKPddAeSXu-W8IlO1vFqQg-t6sSZNQVIqiHiLGeCXk8KJu2tb7H0WVtv_A9kbT4gQo"
                  alt="Sungold Cherry Tomatoes"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute bottom-3 left-3 px-2 py-0.5 rounded font-label-sm bg-surface/90 text-on-surface text-xs backdrop-blur-sm">
                  Stall #12 • Sunrise Orchard
                </span>
              </div>
              <div className="p-space-md flex flex-col flex-1 justify-between gap-space-sm">
                <div className="flex flex-col gap-1">
                  <h3 className="font-headline-sm text-on-surface text-base">Sungold Cherry Tomatoes</h3>
                  <p className="font-body-sm text-xs text-on-surface-variant">Intensely sweet candy-drop tomatoes picked at peak golden blush.</p>
                </div>
                <div className="flex items-center justify-between pt-space-xs">
                  <span className="font-headline-sm text-primary font-bold">$5.00 <span className="font-body-sm text-on-surface-variant font-normal text-xs">/ pint</span></span>
                  <button
                    onClick={() => onReserveProduct({
                      name: 'Sungold Cherry Tomatoes',
                      price: 5.00,
                      unit: 'pint',
                      farm: 'Sunrise Orchard',
                      market: 'Downtown Historic Farmers Market (Stall #12)',
                      quantity: 1
                    })}
                    className="px-4 py-2 rounded-full bg-surface-container hover:bg-surface-container-high text-primary font-label-sm transition-all text-xs font-bold cursor-pointer"
                  >
                    Reserve Hold
                  </button>
                </div>
              </div>
            </div>

            {/* Neighbor Card 2 */}
            <div className="rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-all flex flex-col overflow-hidden group border border-outline-variant/30">
              <div className="relative w-full aspect-[4/3] bg-surface-container overflow-hidden">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBRgzGuvD_ibfRnI6WJpB6_-C9VCw2BOGoa9nzjvwjn9cidnqBkg5J5IOtmzc3zwBQrmU3BVf-3yyUWvA0DylYfdbtOoDEi7Siy10RMsxrgaXnnItRYKNFIIsPDwcwYn9YzOEQdsURJIsq0WNMT8DBZSFR53L9I6ZwclvSA5MYAi-peUiFn3jtXrxWmzufa4R3WJlV6f9vV_br4Kfb83TCX_SueCZ1_0kZy_GBTz9Y"
                  alt="French Breakfast Radishes"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute bottom-3 left-3 px-2 py-0.5 rounded font-label-sm bg-surface/90 text-on-surface text-xs backdrop-blur-sm">
                  Stall #7 • Whispering Pines
                </span>
              </div>
              <div className="p-space-md flex flex-col flex-1 justify-between gap-space-sm">
                <div className="flex flex-col gap-1">
                  <h3 className="font-headline-sm text-on-surface text-base">French Breakfast Radishes</h3>
                  <p className="font-body-sm text-xs text-on-surface-variant">Mild peppery crunch; perfect sliced thin with butter and sea salt.</p>
                </div>
                <div className="flex items-center justify-between pt-space-xs">
                  <span className="font-headline-sm text-primary font-bold">$3.00 <span className="font-body-sm text-on-surface-variant font-normal text-xs">/ bunch</span></span>
                  <button
                    onClick={() => onReserveProduct({
                      name: 'French Breakfast Radishes',
                      price: 3.00,
                      unit: 'bunch',
                      farm: 'Whispering Pines Farm',
                      market: 'Downtown Historic Farmers Market (Stall #7)',
                      quantity: 1
                    })}
                    className="px-4 py-2 rounded-full bg-surface-container hover:bg-surface-container-high text-primary font-label-sm transition-all text-xs font-bold cursor-pointer"
                  >
                    Reserve Hold
                  </button>
                </div>
              </div>
            </div>

            {/* Neighbor Card 3 */}
            <div className="rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-all flex flex-col overflow-hidden group border border-outline-variant/30">
              <div className="relative w-full aspect-[4/3] bg-surface-container overflow-hidden">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDaZ7rCvaNSuFFFIRXl3kWQfs1y51YY6X4tyA0oDiSbu6Wyp1gkIzvwn1TufXNC9ykln4CQerNiOHlXysRYawxFsQ7wYpY1XWDb9Yj3x5ewsdUVI2nSGjfXMXXsS2JRRtKb5-iVHyNoCcOQDy4_ordNSlOC9z8nUdTQLaNzi0rFQC4p3uqRaYsU23tAsOqmFGSutGkVQ5kgHay3s5SAu2hM0V4zK7w3BvTKCM_Ctvs"
                  alt="Country Sourdough Loaf"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute bottom-3 left-3 px-2 py-0.5 rounded font-label-sm bg-surface/90 text-on-surface text-xs backdrop-blur-sm">
                  Stall #18 • Miller &amp; Stone Hearth
                </span>
              </div>
              <div className="p-space-md flex flex-col flex-1 justify-between gap-space-sm">
                <div className="flex flex-col gap-1">
                  <h3 className="font-headline-sm text-on-surface text-base">Country Sourdough Loaf</h3>
                  <p className="font-body-sm text-xs text-on-surface-variant">Naturally fermented 36 hours from organic Pacific Northwest stone-ground flour.</p>
                </div>
                <div className="flex items-center justify-between pt-space-xs">
                  <span className="font-headline-sm text-primary font-bold">$7.50 <span className="font-body-sm text-on-surface-variant font-normal text-xs">/ loaf</span></span>
                  <button
                    onClick={() => onReserveProduct({
                      name: 'Country Sourdough Loaf',
                      price: 7.50,
                      unit: 'loaf',
                      farm: 'Miller & Stone Hearth',
                      market: 'Downtown Historic Farmers Market (Stall #18)',
                      quantity: 1
                    })}
                    className="px-4 py-2 rounded-full bg-surface-container hover:bg-surface-container-high text-primary font-label-sm transition-all text-xs font-bold cursor-pointer"
                  >
                    Reserve Hold
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Market Pickup Handover Reassurance Banner */}
      <section className="max-w-7xl mx-auto px-gutter w-full pb-space-xl pt-space-md">
        <div className="p-space-lg rounded-2xl bg-surface-container-low flex flex-col sm:flex-row items-center justify-between gap-space-md border border-outline-variant/30">
          <div className="flex items-center gap-space-md">
            <div className="w-12 h-12 rounded-full bg-primary-container text-on-primary flex items-center justify-center flex-shrink-0 shadow-sm">
              <span className="material-symbols-outlined text-[24px]">front_hand</span>
            </div>
            <div className="flex flex-col">
              <span className="font-headline-sm text-on-surface text-base font-bold">The MarketLink Public Guarantee</span>
              <span className="font-body-sm text-on-surface-variant text-xs">
                Zero online payments, zero delivery markups. 100% of your dollars support the farmer who harvested your food.
              </span>
            </div>
          </div>
          <button
            onClick={() => onNavigate('contact-us')}
            className="font-label-md text-primary hover:underline whitespace-nowrap flex items-center gap-1 text-xs font-bold cursor-pointer"
          >
            <span>Read Pickup Guidelines</span>
            <span className="material-symbols-outlined text-[16px]">open_in_new</span>
          </button>
        </div>
      </section>
    </div>
  );
}
