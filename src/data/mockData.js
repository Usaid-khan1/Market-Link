// MarketLink data store matching DESIGN.md and original specifications

export const INITIAL_PRODUCTS = [
  {
    id: 'prod-1',
    name: 'Heirloom Brandywine Tomatoes',
    farm: 'Green Pastures Farm',
    price: 4.50,
    unit: 'lb',
    status: 'IN_STOCK',
    stockText: 'IN STOCK',
    stockCount: 24,
    description: 'Vine-ripened, rich acidic bite with velvety sweetness. Picked Friday afternoon.',
    market: 'Downtown Market',
    marketKey: 'downtown',
    category: 'veg',
    categoryName: 'Fresh Vegetables',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB5M_Jb-g3RIEObP_vUiplndD9sEKJ_Lx0Sgl3lL_8A0ZU5IGI_oshUgCGad4ZJtpqRMEWiVK8ytrwcJ9Intg9z7_W5J0fPW6S4mXBdn7t5IYLtNLjUujKtDJXuRzcF1rsCDTxQ9QxSgQAYRYRXhtD5sgdF7rYcV4A8XuPIvw7wfLzV-mtiFOrs__kBPIFF6OcghZ58jEraL_t2Hb4HdY5cZOtUFuWhWRjhXMxnBPjsgxdRrj4yOAYo',
    alt: 'Vibrant cluster of ripe heirloom Brandywine tomatoes sitting inside a rustic wooden harvest crate'
  },
  {
    id: 'prod-2',
    name: 'Honeycrisp Orchard Apples',
    farm: 'Sunrise Orchard',
    price: 3.20,
    unit: 'lb',
    status: 'IN_STOCK',
    stockText: 'IN STOCK',
    stockCount: 30,
    description: 'Crisp, extra juicy snaps. Grown under high-elevation breezes in Oak Ridge.',
    market: 'Oak Valley Market',
    marketKey: 'oak-valley',
    category: 'fruit',
    categoryName: 'Orchard Fruits',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuClIJU-m9wnwHW_ewEmyK3eGmreGDLfswwcbidm46G5ECjugjMC-wJdI02nUXYMvMh1wQTP9_-JLcYZCUufKAjBo1XWGc5NrniQzTN3ccxwpAr92rxrqw09QMddSwJ2VHbpgZijw1oS_WeE60q97AJL094C4DvZs3ZLOuruhvSTprxa3n2blU4DTUZa1KgnPY31NWwPg79HD7jSwPetCMLrplT6T4VDq9Q2AMC3mR8Judd2fjxfi2bB',
    alt: 'Polished fresh Honeycrisp apples in a woven basket nestled on natural straw'
  },
  {
    id: 'prod-3',
    name: 'Wildflower Raw Honey (16oz)',
    farm: 'Pine Ridge Apiary',
    price: 12.00,
    unit: 'jar',
    status: 'LOW_STOCK',
    stockText: 'LOW STOCK (3 left)',
    stockCount: 3,
    description: 'Unfiltered, raw nectar harvested from native meadow flora. High enzyme profile.',
    market: 'Downtown Market',
    marketKey: 'downtown',
    category: 'honey',
    categoryName: 'Honey & Jams',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDZQARg08jALmVwYA3ok4amUG0u-xEEYBvHSZxOMJpee6BnH_nKjni29z-GksED67D6ZlGhCKRhJUIRZHr4r2DUhFilbG8omgUd7-RaIaMaQOZko3-tkgxjCPyuhNGXinuXgoGlEhcj36RwrQlLtHE1YyFMSkOYl9xsWrbw1zYfTrAL1FM0S9N58axAx7S2XdY5SumAaEEqqoN7i-Jq70byrKynPcG9A1WTfqUTrWqXXnBrSCsiscH2',
    alt: 'Glass jar filled with rich golden raw wildflower honey with wooden honey dipper'
  },
  {
    id: 'prod-4',
    name: 'Artisan Sourdough Country Loaf',
    farm: 'Miller & Stone Hearth',
    price: 7.50,
    unit: 'loaf',
    status: 'LOW_STOCK',
    stockText: 'LOW STOCK (5 left)',
    stockCount: 5,
    description: '36-hour cold fermented wild culture loaf. Dark blistered crust, open crumb.',
    market: 'Riverside Twilight',
    marketKey: 'riverside',
    category: 'bread',
    categoryName: 'Hearth Breads',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDDMDw91dvQXf4q6pKbYD3sHKVz05EIWjDFXHuaJEHCbTVFRsgwO7phGiS8XPD-34L1vj6P6qKZcyxr1ZH1VQ9VLJEZ3H1JwIa-v4gBWTlGDf3bUM0Xu1wGXIaN1JBWWcPFuzw8yHgWs7tSC2XcMx7uxwVD2fCU0wUZxIZ0J7jIbDEQhFUu2Ya9_7bRkKlgDVE8J5cCUQ7TX0OVOv5PTijoT7B9lnDH-DhbXMOn1Uj6MBICfanOct_f',
    alt: 'Artisanal freshly baked crusty sourdough boule bread loaf'
  },
  {
    id: 'prod-5',
    name: 'Rainbow Chard & Kale Bundle',
    farm: 'Whispering Pines Farm',
    price: 3.75,
    unit: 'bunch',
    status: 'IN_STOCK',
    stockText: 'IN STOCK',
    stockCount: 18,
    description: 'Ruby, gold, and emerald stems washed in fresh spring wellwater. Packed with vitamins.',
    market: 'Oak Valley Market',
    marketKey: 'oak-valley',
    category: 'veg',
    categoryName: 'Fresh Vegetables',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDH7kkLEvd9wblSTAU3VAEQltRVeEJwaAAQbYVEo5S01pVEng1P5x7m8g-RVCvJEcOTvJnLye5GOD5-l7iqu7zVV9Mw1M0cde6G6LilHsQ566iNhNVAFSASiGTR4JQQEhC2p3px1zog64sxAjSC0UxHxY2r-hZsda2zIjm3mCiSUUKgcS6BkSbtO75i8EBln5F1bh0LLxmBqmd-TYcsN2ckeCeMmTcFW4JkiDCDBmK_IkAUzs2rVXed',
    alt: 'Freshly harvested bundles of vibrant rainbow swiss chard and curly green kale'
  },
  {
    id: 'prod-6',
    name: 'Pasture-Raised Organic Brown Eggs',
    farm: 'Heritage Hen Hollow',
    price: 6.50,
    unit: 'dozen',
    status: 'SOLD_OUT',
    stockText: 'SOLD OUT THIS WEEK',
    stockCount: 0,
    description: 'Deep orange yolks from clover-foraging heritage hens. Fully reserved for this weekend.',
    market: 'Downtown Market',
    marketKey: 'downtown',
    category: 'dairy',
    categoryName: 'Farmstead Dairy',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBgjZ4glMgCbBwTrx1nQDCUApzpbXJ-cy3sGQMnvqwl6S6dTj8TZrYUsKsFyFWztfJccHpX9yjqf0PLL8_5YPtvLhykh1Jj53Z43PhiZEbIxgCw8Q_camxmII0vDCStGF3clmF2Y27OC5MyrkDyi21t5sPpD1Kkq-WheQYX1AzxJnHUVMw2LpofEgH2dQZqx9WiYTkVL8JcD5LIMqirNKLevXNjfWaOYHbl55JSQimWMj2PNCCcbsrH',
    alt: 'Brown pasture-raised chicken eggs in an open cardboard egg carton'
  }
];

export const DIRECTORY_MARKETS = [
  {
    id: 1,
    key: 'downtown',
    region: 'downtown',
    day: 'saturday',
    title: 'Downtown Historic Farmers Market',
    address: '120 Market Square, Central Plaza, Downtown',
    distance: '0.8 miles away',
    openStatus: 'Open in 2 Days',
    openStatusType: 'pulse',
    dayText: 'Every Saturday',
    timeText: '8:00 AM – 1:00 PM',
    numBadge: '1',
    numBadgeClass: 'bg-primary-fixed text-on-primary-fixed',
    vendorCountText: '28 Local Farmers, Cheese Makers & Artisans',
    tags: ['Organic Heirlooms', 'Pasture Eggs', 'Wild Sourdough', 'Live Bluegrass Band'],
    policyText: 'Stall Pickup Policy: Free online reservation. 100% Pay In-Person (Cash/Card/Tokens)',
    policyBadge: 'Zero Online Fees',
    policyIcon: 'payments',
    features: ['dog-friendly', 'ebt'],
    visualStalls: [
      {
        title: 'Heirlooms',
        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC5r9n84_MegsorAvtL8LFeNQKwAvICYTZXDO2fBF1mfiPLmoVq1Ta8OpFGXSUkxXMqQgvaQyQ881mqUuUmEKbJNEtG5X8dZ1gnluHUvRPhIM0mXpv-Km4-fetXUUuDFT2Au2m3EMaAgJKvrHemEvwFhQb4CW8JsL-91uXLXopIthyMsh7W-YFn5bbfWlmd-YSE1_zALoINwkJjYN_Bv2FLdr5o_ZCRBFcuBiGK5h7TXg7Spipjxtud',
        alt: 'Vibrant heap of multi-colored heirloom tomatoes'
      },
      {
        title: 'Boulangerie',
        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCAGxWvIAEOciNeIpvXeS0o6ueKMVujWIo898fnUWfjodLLEsdvlYJeyAq0P_BIh4FSLnQ9-g0PNY4w7Oo0Ou1pmCQgjmHE20gK8vtchyOQzpCDUme7igITGjAxNMZ3ecokj62DY6lRU4l7RsM5Ot8xN8u-_bTEBIbtVcLegOKYyWkwzRUi9rgFDFC8mIFBtC8OuDmjkzT9Rq0f3N6aAALbzM51q0_s4DbSkH8ChO7cq1xZdKGcJSgs',
        alt: 'Rustic wooden crates brimming with freshly baked artisan sourdough'
      },
      {
        title: 'Pasture Fresh',
        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA0rX6QqpjAbOj4aS9tyXHfexwLNZNbzSxXT3wnnRZ2XMSpA3M7N8idUFHiRchav_OFiX0mQuqWd0Z-t9_fUwFZGiWRa-be7DDkZhArudA_GozKGr25dEhHpyZDDvoWZ64z6hyMDey5Sgy9ZMPo0jIoAHHOox4FIup4zjPod4TRo-inqmbqmJZBvCIggYQsqchQqcay4tIPkUr3UN4vh-7SRbi3jh2cpjLmrpd164fewdifDCyYcmgR',
        alt: 'Cartons of fresh free-range pasture brown eggs'
      }
    ],
    mapPos: { top: '28%', left: '46%' },
    popupPos: { top: '44%', left: '46%' },
    popupBadge: 'Saturday Hub • Open 8am',
    popupStalls: '28 Farm Stalls Active',
    popupImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBBX6utvQ3xGaWuRHTzDH0bpvHJPPVXGKwmlRJkZclFyW9JmposXNsPIaGlKfbAYLjWlTj6kegD3xiXVcbwKrDbcXdl9om839D_OtCFGkQfGjruKFlwdMZbaHi9p6_fHEbYgdzibkaRDVAFTrVRiKOUa0XSheflTlbEV4iokdUWipIMFeVWXZIyaHSPRj3_a5AhBpPhI_-sqaX8mti0ZIC8RNAPRyTWVWTAz4sBygNArLrviP7I4kSL'
  },
  {
    id: 2,
    key: 'oak-valley',
    region: 'oak-valley',
    day: 'sunday',
    title: 'Oak Valley Community Organic Market',
    address: 'Pioneer Park Pavilion, North Oak Valley',
    distance: '2.4 miles away',
    openStatus: 'Every Sunday',
    openStatusType: 'badge',
    dayText: 'Every Sunday',
    timeText: '9:00 AM – 2:00 PM',
    numBadge: '2',
    numBadgeClass: 'bg-secondary-container text-on-secondary-container',
    vendorCountText: '19 Certified Organic Growers & Beekeepers',
    tags: ['Raw Jersey Dairy', 'Orchard Honey', 'Stonefruit', 'Wild Foraged Mushrooms'],
    policyText: 'Free harvest crate reservation. Settle directly at farmer booth.',
    policyBadge: '100% Producer Direct',
    policyIcon: 'handshake',
    features: ['dog-friendly', 'ebt'],
    mapPos: { top: '20%', left: '24%' },
    popupPos: { top: '36%', left: '26%' },
    popupBadge: 'Sunday Morning • Open 9am',
    popupStalls: '19 Certified Organic Stalls',
    popupImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDM1BNwiasvOk6PCBQdnDuAsoLQBDrh103TT3dybKpUdiN6kDdKYVr_zaHFAylbx6yOu9JmcnXGvO_em5buUntA57uuJILMejl7yvAhL9yBbeyntF4VC15SmVwPq6ZV5omCcGgRwMEjTbeDGthb3Nkno-tl-meXs61aQJ3WdRBYGNR6y06kWAx_YGZwmpELf77FIOl3g5iQvPRcJiyoxEsAGLGLkQOE5XvT1BHVJECA3ERSC5tYtgqZ'
  },
  {
    id: 3,
    key: 'riverside',
    region: 'riverside',
    day: 'wednesday',
    title: 'Riverside Twilight Farmers Market',
    address: 'Pier 4 Riverfront Greenway, Dockside Promenade',
    distance: '3.5 miles away',
    openStatus: 'Midweek Twilight Drop',
    openStatusType: 'tertiary',
    dayText: 'Every Wednesday',
    timeText: '4:00 PM – 7:30 PM',
    numBadge: '3',
    numBadgeClass: 'bg-tertiary-fixed text-on-tertiary-fixed',
    vendorCountText: '22 Local Growers, Cheesemakers & Woodfired Bakers',
    tags: ['Crisp Hydro Greens', 'Woodfired Breads', 'Artisan Goat Cheese', 'Sparkling Orchard Cider'],
    policyText: 'Stall Pickup Policy: Pay grower directly at pickup dock.',
    policyBadge: 'Midweek Pickup',
    policyIcon: 'storefront',
    features: ['dog-friendly'],
    mapPos: { top: '62%', left: '64%' },
    popupPos: { top: '54%', left: '60%' },
    popupBadge: 'Wednesday Twilight • Open 4pm',
    popupStalls: '22 Local Food Artisans',
    popupImg: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 4,
    key: 'sunnybrook',
    region: 'sunnybrook',
    day: 'saturday',
    title: 'Sunnybrook Village Green Market',
    address: 'Sunnybrook Common, 440 Elm Street',
    distance: '5.1 miles away',
    openStatus: 'Saturday Mornings',
    openStatusType: 'badge',
    dayText: 'Every Saturday',
    timeText: '8:30 AM – 12:30 PM',
    numBadge: '4',
    numBadgeClass: 'bg-surface-container-highest text-on-surface',
    vendorCountText: '16 Farm Partners & Florists',
    tags: ['Field Berries', 'Microgreens', 'Grass-fed Meats', 'Cut Wildflowers'],
    policyText: 'Direct farmer handshake & payment. Zero middleman fees.',
    policyBadge: 'Community Hub',
    policyIcon: 'verified_user',
    features: ['ebt'],
    mapPos: { top: '74%', left: '22%' },
    popupPos: { top: '68%', left: '24%' },
    popupBadge: 'Saturday • Open 8:30am',
    popupStalls: '16 Farm Partners',
    popupImg: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 5,
    key: 'pine-creek',
    region: 'pine-creek',
    day: 'sunday',
    title: 'Pine Creek Foothills Morning Market',
    address: 'Old Mill Depot Grounds, Route 9 East',
    distance: '7.8 miles away',
    openStatus: 'Every Sunday',
    openStatusType: 'badge',
    dayText: 'Every Sunday',
    timeText: '9:00 AM – 1:30 PM',
    numBadge: '5',
    numBadgeClass: 'bg-surface-container-highest text-on-surface',
    vendorCountText: '24 Heritage Growers & Preservers',
    tags: ['Heirloom Apples', 'Artisan Preserves', 'Free-range Poultry', 'Heritage Roots'],
    policyText: 'In-person stall payment only. Cash and farm tokens welcomed.',
    policyBadge: 'Depot Grounds',
    policyIcon: 'payments',
    features: ['dog-friendly', 'ebt'],
    mapPos: { top: '14%', left: '78%' },
    popupPos: { top: '28%', left: '76%' },
    popupBadge: 'Sunday • Open 9am',
    popupStalls: '24 Heritage Growers',
    popupImg: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80'
  }
];

export const MARKETS = DIRECTORY_MARKETS.slice(0, 3).map(m => ({
  id: `market-${m.id}`,
  key: m.key,
  name: m.title,
  schedule: `${m.dayText}, ${m.timeText}`,
  dayKey: m.day === 'saturday' ? 'sat' : m.day === 'sunday' ? 'sun' : 'wed',
  distance: m.distance,
  stalls: parseInt(m.vendorCountText) || 20,
  address: m.address,
  special: m.tags.slice(0, 2).join(' & '),
  pickupBay: m.id === 1 ? 'Crate #12' : m.id === 2 ? 'Pavilion Central Aisle' : 'Dockside Shade Tent',
  image: m.visualStalls ? m.visualStalls[0].img : m.popupImg,
  locationName: m.address
}));

export const CATEGORIES = [
  {
    id: 'veg',
    name: 'Fresh Vegetables',
    subtitle: 'Greens & Roots',
    icon: 'eco',
    bgClass: 'bg-primary-fixed',
    textClass: 'text-on-primary-fixed'
  },
  {
    id: 'fruit',
    name: 'Orchard Fruits',
    subtitle: 'Apples & Berries',
    icon: 'nutrition',
    bgClass: 'bg-tertiary-fixed',
    textClass: 'text-on-tertiary-fixed'
  },
  {
    id: 'dairy',
    name: 'Farmstead Dairy',
    subtitle: 'Cheeses & Eggs',
    icon: 'egg',
    bgClass: 'bg-secondary-fixed',
    textClass: 'text-on-secondary-fixed'
  },
  {
    id: 'bread',
    name: 'Hearth Breads',
    subtitle: 'Wild Sourdough',
    icon: 'bakery_dining',
    bgClass: 'bg-surface-container-high',
    textClass: 'text-on-surface'
  },
  {
    id: 'herbs',
    name: 'Herbs & Shoots',
    subtitle: 'Microgreens & Teas',
    icon: 'psychiatry',
    bgClass: 'bg-primary-fixed-dim',
    textClass: 'text-on-primary'
  },
  {
    id: 'honey',
    name: 'Honey & Jams',
    subtitle: 'Raw Honeycomb',
    icon: 'hive',
    bgClass: 'bg-tertiary-fixed-dim',
    textClass: 'text-on-tertiary'
  }
];

export const GROWERS = [
  {
    id: 'grower-1',
    name: 'Martha & Joe Miller',
    farm: 'Green Pastures Organic',
    rating: '4.98',
    pickups: '142 pickups',
    quote: '“We harvest Friday afternoon for your Saturday morning table. When you take home our produce, you taste true living earth.”',
    location: 'Pine Creek • 4th Gen Farm',
    marketTag: 'Downtown Sat',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAIm_TDUf93mQWhBjq4pkHUlUfZo_xZ4Cp_632MwDgC5b1v440gNxSLcL-ic2rnuAtbb7iYFiaNipBh6KqSuw-_g1Z1VBzAD7HZRZKKAKZ3XLveL_mk-FtbSRY7VAScT4JWOrJW5CAV3p9t_hU0PNbSA96bazoi-PEAzq2TQtiHBYcQ60AHBhd053KGjfTZGc_zfQd5QJYJja1gMG8zFJqpW6R9Q7zxlNFHxmBoTNZI2yHCblxGfK0v'
  },
  {
    id: 'grower-2',
    name: 'Elias Vance',
    farm: 'Whispering Pines Orchard',
    rating: '4.95',
    pickups: '98 pickups',
    quote: '“No synthetic sprays, just clean mountain water, beneficial orchard pollinators, and the patience to let fruits fully ripen.”',
    location: 'Oak Ridge • Certified Naturally',
    marketTag: 'Oak Valley Sun',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA19wsVsUhJuuW-V0OHoG3SAyYQiVey-NhBLYcKRTO3ZUpXiA0n54-dAg3DxB9SePT0eQu-cEW0HQ65YIoo6LQLFyfnV7nuXiUbehAjO1WhiFPKh8S2YcyHaM4X1bg8M4wll8e5W1HxOi6FrULY_CX6lZ9ojipKdL0bQ3M9Ari8MeKCHr36GSN2I0t4TJ9CfEoExfp-b7GEjgtZmaa7uyvJdNY3N2uvZ68JdG1zoog8Nz5HznoG9Pn_'
  },
  {
    id: 'grower-3',
    name: 'Elena Rostova',
    farm: 'Heritage Hearth & Dairy',
    rating: '4.99',
    pickups: '210 pickups',
    quote: '“Heritage Guernsey milk aged gently in our cellar, paired with slow sourdough fermented with our century-old sourdough mother.”',
    location: 'Cedar Valley • Artisan Maker',
    marketTag: 'Riverside Wed',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDfNvyouVHaHgVfuHc6CXIoevBTGXxS6NIvmbR5X_PxEp9y8-zVIXaLquo4NY2dn2Ll5a6TXXOMR8Pv0jL5WibyzfhCN1kegqfSThOF4Mc7aGmn3yjqaXlMRi00qm_Ps3oZPOoVVfyMoADGufRXFvDaroQeeBeZi3pMd1rOabtW8zakgCn7-DmFKOmNp0-AY9Dwa7v8u2B_bw2J8ZlWPbTDi02Iz10fTJ4kUKdSwh5yTZo7p9aj2l8p'
  }
];

export const TESTIMONIALS = [
  {
    id: 'test-1',
    author: 'Clara M.',
    badge: 'CM',
    badgeBg: 'bg-secondary-fixed text-on-secondary-fixed',
    role: 'Downtown Market Regular • Shopper for 4 Years',
    text: '“I used to sprint to the market before 9am just to get heirloom tomatoes. With MarketLink, my basket is reserved by the farmer, and I just hand over cash with a smile! No anxiety, no sold-out signs.”'
  },
  {
    id: 'test-2',
    author: 'Farmer Dave',
    badge: 'FD',
    badgeBg: 'bg-primary-fixed text-on-primary-fixed',
    role: 'Willow Creek Organic Farm • Partner Grower',
    text: '“As a small family grower, knowing my preorder count on Thursday helps me harvest exact quantities. Zero waste, zero unsold lettuce rotting on the stand, and happier customers who know their food was picked hours ago.”'
  }
];

export const FAQS = [
  {
    q: 'How does pay-at-pickup work?',
    a: 'MarketLink eliminates all online payment processing! You browse and reserve fresh produce for free online. The grower packs your crate with your name on it. When you arrive at the designated farmers market stall, you inspect the items and pay the grower directly with cash, local vouchers, or card.'
  },
  {
    q: 'What happens if I cannot make it to the market?',
    a: 'Please notify the farmer through MarketLink or cancel your reservation at least 2 hours before the market closes so another community member can enjoy the fresh harvest.'
  },
  {
    q: 'Are there any fees for shoppers?',
    a: 'None! MarketLink is 100% free for community members. 100% of your payment at the market stall goes straight into the farmer’s hands.'
  }
];
