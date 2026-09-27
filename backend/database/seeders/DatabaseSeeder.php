<?php

namespace Database\Seeders;

use App\Models\Announcement;
use App\Models\Category;
use App\Models\FarmerProfile;
use App\Models\Favorite;
use App\Models\Market;
use App\Models\Notification;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Review;
use App\Models\StockTemplate;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database with comprehensive, coherent test data.
     */
    public function run(): void
    {
        // -------------------------------------------------------------
        // 1. ADMIN USER
        // -------------------------------------------------------------
        $admin = User::create([
            'name' => 'Hannah Vance (Super Admin)',
            'email' => 'admin@marketlink.test',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'phone' => '+1-503-555-0100',
            'address' => 'MarketLink Central Regional HQ, Portland, OR',
            'status' => 'active',
        ]);

        // -------------------------------------------------------------
        // 2. MARKETS
        // -------------------------------------------------------------
        $marketsData = [
            [
                'market_name' => 'Downtown Saturday Market',
                'address' => 'SW Park Ave & Montgomery St, Portland, OR 97201',
                'latitude' => 45.5152,
                'longitude' => -122.6784,
                'operating_days' => ['Saturday'],
                'timings' => '8:00 AM – 1:00 PM',
                'map_provider' => 'OpenStreetMap',
            ],
            [
                'market_name' => 'Pioneer Pavilion Heritage Market',
                'address' => '700 SW 6th Avenue, Pavilion Hall, OR 97204',
                'latitude' => 45.5190,
                'longitude' => -122.6795,
                'operating_days' => ['Saturday', 'Sunday'],
                'timings' => '8:30 AM – 2:30 PM',
                'map_provider' => 'OpenStreetMap',
            ],
            [
                'market_name' => 'Riverside Twilight Farmers Market',
                'address' => '1020 Waterfront Esplanade, Pier 4, OR 97209',
                'latitude' => 45.5080,
                'longitude' => -122.6680,
                'operating_days' => ['Wednesday'],
                'timings' => '4:00 PM – 8:00 PM',
                'map_provider' => 'OpenStreetMap',
            ],
            [
                'market_name' => 'Oak Valley Community Organic Market',
                'address' => 'Pioneer Park Pavilion, 412 Oak Valley Rd, OR 97034',
                'latitude' => 45.5320,
                'longitude' => -122.6950,
                'operating_days' => ['Sunday'],
                'timings' => '9:00 AM – 2:00 PM',
                'map_provider' => 'OpenStreetMap',
            ],
            [
                'market_name' => 'Eastside Sunset Greenway Hub',
                'address' => '1540 SE Water Avenue, Pavilion B, OR 97214',
                'latitude' => 45.5140,
                'longitude' => -122.6620,
                'operating_days' => ['Thursday', 'Saturday'],
                'timings' => '10:00 AM – 3:00 PM',
                'map_provider' => 'OpenStreetMap',
            ],
        ];

        $markets = [];
        foreach ($marketsData as $idx => $m) {
            $markets[$idx + 1] = Market::create($m);
        }

        // -------------------------------------------------------------
        // 3. CATEGORIES
        // -------------------------------------------------------------
        $categoriesData = [
            ['name' => 'Fresh Vegetables', 'slug' => 'fresh-vegetables', 'description' => 'Crisp leafy greens, heirloom roots, and greenhouse picks.', 'icon' => 'eco'],
            ['name' => 'Orchard Fruits', 'slug' => 'orchard-fruits', 'description' => 'Tree-ripened heritage apples, stonefruit, and berries.', 'icon' => 'nutrition'],
            ['name' => 'Farmstead Dairy', 'slug' => 'farmstead-dairy', 'description' => 'Artisanal goat and cow cheeses, cultured butter, and fresh curd.', 'icon' => 'egg'],
            ['name' => 'Hearth Breads', 'slug' => 'hearth-breads', 'description' => 'Naturally leavened wild sourdough and ancient grain boules.', 'icon' => 'bakery_dining'],
            ['name' => 'Herbs & Shoots', 'slug' => 'herbs-shoots', 'description' => 'Aromatic culinary herbs, teas, and living microgreens.', 'icon' => 'psychiatry'],
            ['name' => 'Honey & Preserves', 'slug' => 'honey-preserves', 'description' => 'Raw native meadow honey, comb cappings, and seasonal preserves.', 'icon' => 'hive'],
            ['name' => 'Foraged Mushrooms', 'slug' => 'foraged-mushrooms', 'description' => 'Wild-harvested chanterelles, morels, and cultivated oyster clusters.', 'icon' => 'spa'],
            ['name' => 'Artisan Pantry', 'slug' => 'artisan-pantry', 'description' => 'Ferments, ciders, and cold-pressed extractions.', 'icon' => 'soup_kitchen'],
        ];

        $categories = [];
        foreach ($categoriesData as $c) {
            $categories[$c['slug']] = Category::create($c);
        }

        // -------------------------------------------------------------
        // 4. FARMERS (APPROVED, PENDING, SUSPENDED)
        // -------------------------------------------------------------
        // Farmer 1: Green Valley Organics (John Farmer)
        $farmer1 = User::create([
            'name' => 'John Farmer',
            'email' => 'farmer1@marketlink.test',
            'password' => Hash::make('password'),
            'role' => 'farmer',
            'phone' => '+1-503-555-0201',
            'address' => 'Green Valley Farm, Lane 4, Orchard County',
            'status' => 'active',
        ]);
        FarmerProfile::create([
            'user_id' => $farmer1->id,
            'stall_name' => 'Green Valley Organics',
            'contact_person' => 'John Farmer',
            'operating_days' => ['Wednesday', 'Saturday'],
            'pickup_time_start' => '08:00 AM',
            'pickup_time_end' => '01:00 PM',
            'address' => 'Stall #12, Riverside Twilight Market',
            'latitude' => 45.5080,
            'longitude' => -122.6680,
            'status' => 'approved',
            'bio' => 'Family biodynamic farm producing crisp greens, heirloom nightshades, and winter roots.',
        ]);

        // Farmer 2: Sunny Acres Farm (Sarah Miller)
        $farmer2 = User::create([
            'name' => 'Sarah Miller',
            'email' => 'farmer2@marketlink.test',
            'password' => Hash::make('password'),
            'role' => 'farmer',
            'phone' => '+1-503-555-0202',
            'address' => 'Sunny Acres Homestead, Highway 9',
            'status' => 'active',
        ]);
        FarmerProfile::create([
            'user_id' => $farmer2->id,
            'stall_name' => 'Sunny Acres Farm',
            'contact_person' => 'Sarah Miller',
            'operating_days' => ['Saturday', 'Sunday'],
            'pickup_time_start' => '08:30 AM',
            'pickup_time_end' => '02:00 PM',
            'address' => 'Stall #05, Downtown Saturday Market',
            'latitude' => 45.5152,
            'longitude' => -122.6784,
            'status' => 'approved',
            'bio' => 'Organic high-elevation orchardists known for crisp Honeycrisp apples, Asian pears, and raw wildflower honey.',
        ]);

        // Farmer 3: Green Pastures Organic (Marcus Thorne)
        $farmer3 = User::create([
            'name' => 'Marcus Thorne',
            'email' => 'farmer3@marketlink.test',
            'password' => Hash::make('password'),
            'role' => 'farmer',
            'phone' => '+1-503-555-0471',
            'address' => '7422 Ridgeview Orchard Lane, Oak Valley, OR 97034',
            'status' => 'active',
        ]);
        FarmerProfile::create([
            'user_id' => $farmer3->id,
            'stall_name' => 'Green Pastures Organic',
            'contact_person' => 'Marcus Thorne',
            'operating_days' => ['Wednesday', 'Saturday', 'Sunday'],
            'pickup_time_start' => '08:00 AM',
            'pickup_time_end' => '01:30 PM',
            'address' => 'Pioneer Pavilion • Stall #08',
            'latitude' => 45.5190,
            'longitude' => -122.6795,
            'status' => 'approved',
            'bio' => 'Family-operated 12-acre biodynamic farm committed to zero synthetic inputs and heirloom seed preservation.',
        ]);

        // Farmer 4: Miller & Stone Hearth Bakery (David Miller)
        $farmer4 = User::create([
            'name' => 'David Miller',
            'email' => 'farmer4@marketlink.test',
            'password' => Hash::make('password'),
            'role' => 'farmer',
            'phone' => '+1-503-555-0211',
            'address' => 'Central Market Hall, Space 19, Portland, OR',
            'status' => 'active',
        ]);
        FarmerProfile::create([
            'user_id' => $farmer4->id,
            'stall_name' => 'Miller & Stone Hearth Bakery',
            'contact_person' => 'David Miller',
            'operating_days' => ['Saturday'],
            'pickup_time_start' => '07:30 AM',
            'pickup_time_end' => '01:00 PM',
            'address' => 'Downtown Saturday Market • Space 19',
            'latitude' => 45.5152,
            'longitude' => -122.6784,
            'status' => 'approved',
            'bio' => '100% stoneground ancient grains fermented 48 hours in natural wooden levain troughs and hearth baked daily.',
        ]);

        // Farmer 5: Riverbend Goat Dairy (Dale & Elena Rossi)
        $farmer5 = User::create([
            'name' => 'Elena Rossi',
            'email' => 'farmer5@marketlink.test',
            'password' => Hash::make('password'),
            'role' => 'farmer',
            'phone' => '+1-503-555-0192',
            'address' => 'River District Pastures, Lot 14-B',
            'status' => 'active',
        ]);
        FarmerProfile::create([
            'user_id' => $farmer5->id,
            'stall_name' => 'Riverbend Goat Dairy',
            'contact_person' => 'Elena Rossi',
            'operating_days' => ['Saturday', 'Sunday'],
            'pickup_time_start' => '08:00 AM',
            'pickup_time_end' => '02:00 PM',
            'address' => 'River District Sat • Lot 14-B',
            'latitude' => 45.5080,
            'longitude' => -122.6680,
            'status' => 'approved',
            'bio' => 'Artisan raw goat cheeses, cultured butter, and fresh whole curds from 100% grass-fed Alpine herds.',
        ]);

        // Farmer 6: Pending Approval (Lila Chen - Sunspire Microgreens)
        $farmerPending = User::create([
            'name' => 'Lila Chen',
            'email' => 'farmer_pending@marketlink.test',
            'password' => Hash::make('password'),
            'role' => 'farmer',
            'phone' => '+1-503-555-0834',
            'address' => 'East Valley Ridge Indoor Facility, OR',
            'status' => 'active',
        ]);
        FarmerProfile::create([
            'user_id' => $farmerPending->id,
            'stall_name' => 'Sunspire Microgreens Co.',
            'contact_person' => 'Lila Chen',
            'operating_days' => ['Thursday', 'Saturday'],
            'pickup_time_start' => '09:00 AM',
            'pickup_time_end' => '01:00 PM',
            'address' => 'Eastside Sunset Greenway • Stall #03',
            'latitude' => 45.5140,
            'longitude' => -122.6620,
            'status' => 'pending',
            'bio' => 'Indoor soil-less microgreens, tender pea shoots, and live sunflower greens awaiting health audit verification.',
        ]);

        // Farmer 7: Suspended Farmer (Robert MacLeod)
        $farmerSuspended = User::create([
            'name' => 'Robert MacLeod',
            'email' => 'farmer_suspended@marketlink.test',
            'password' => Hash::make('password'),
            'role' => 'farmer',
            'phone' => '+1-503-555-0789',
            'address' => 'Highland Ridge Orchard, Oak Valley',
            'status' => 'suspended',
        ]);
        FarmerProfile::create([
            'user_id' => $farmerSuspended->id,
            'stall_name' => 'Highland Berry & Nut Co.',
            'contact_person' => 'Robert MacLeod',
            'operating_days' => ['Sunday'],
            'pickup_time_start' => '09:00 AM',
            'pickup_time_end' => '02:00 PM',
            'address' => 'Oak Valley Sunday Bazaar • Stall #11',
            'latitude' => 45.5320,
            'longitude' => -122.6950,
            'status' => 'suspended',
            'bio' => 'Temporarily suspended due to annual permit renewal inspection delay.',
        ]);

        // -------------------------------------------------------------
        // 5. CUSTOMERS
        // -------------------------------------------------------------
        $customer1 = User::create([
            'name' => 'Alice Cooper',
            'email' => 'customer1@marketlink.test',
            'password' => Hash::make('password'),
            'role' => 'customer',
            'phone' => '+1-503-555-0301',
            'address' => '45 Elm Street, Apt 2B, Portland, OR',
            'status' => 'active',
        ]);

        $customer2 = User::create([
            'name' => 'Bob Anderson',
            'email' => 'customer2@marketlink.test',
            'password' => Hash::make('password'),
            'role' => 'customer',
            'phone' => '+1-503-555-0302',
            'address' => '88 Maple Avenue, Portland, OR',
            'status' => 'active',
        ]);

        $customer3 = User::create([
            'name' => 'Elena Rostova',
            'email' => 'customer@marketlink.test',
            'password' => Hash::make('password'),
            'role' => 'customer',
            'phone' => '+1-503-555-0144',
            'address' => 'South Park Blocks, 1420 SW Park Ave, Portland, OR',
            'status' => 'active',
        ]);

        $customer4 = User::create([
            'name' => 'Samuel Chen',
            'email' => 'customer4@marketlink.test',
            'password' => Hash::make('password'),
            'role' => 'customer',
            'phone' => '+1-503-555-0812',
            'address' => 'East River District, Pier 2, Portland, OR',
            'status' => 'active',
        ]);

        $customer5 = User::create([
            'name' => 'Danielle Cooper',
            'email' => 'customer5@marketlink.test',
            'password' => Hash::make('password'),
            'role' => 'customer',
            'phone' => '+1-503-555-0655',
            'address' => 'Central Plaza, Apt 12, Portland, OR',
            'status' => 'active',
        ]);

        // -------------------------------------------------------------
        // 6. PRODUCTS (Varied stock, low-stock, and sold-out)
        // -------------------------------------------------------------
        $productsData = [
            // Farmer 3 (Marcus Thorne - Green Pastures)
            [
                'farmer_id' => $farmer3->id,
                'category_id' => $categories['fresh-vegetables']->id,
                'market_id' => $markets[2]->id,
                'name' => 'Heirloom Brandywine Tomatoes',
                'description' => 'Vine-ripened, rich acidic bite with velvety sweetness. Picked Friday afternoon for weekend markets.',
                'price' => 4.50,
                'unit' => 'lb',
                'stock_quantity' => 24,
                'image' => 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
                'status' => 'available',
            ],
            [
                'farmer_id' => $farmer3->id,
                'category_id' => $categories['fresh-vegetables']->id,
                'market_id' => $markets[2]->id,
                'name' => 'Rainbow Swiss Chard & Lacinato Kale',
                'description' => 'Ruby, gold, and emerald stems washed in fresh spring wellwater. Crisp and nutrient-dense.',
                'price' => 3.75,
                'unit' => 'bunch',
                'stock_quantity' => 4, // LOW STOCK to trigger alert!
                'image' => 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
                'status' => 'available',
            ],
            [
                'farmer_id' => $farmer3->id,
                'category_id' => $categories['fresh-vegetables']->id,
                'market_id' => $markets[1]->id,
                'name' => 'Organic Romanesco Cauliflower',
                'description' => 'Geometric chartreuse florets with nutty, tender sweetness when roasted or steamed.',
                'price' => 5.00,
                'unit' => 'piece',
                'stock_quantity' => 16,
                'image' => 'https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?auto=format&fit=crop&w=600&q=80',
                'status' => 'available',
            ],
            [
                'farmer_id' => $farmer3->id,
                'category_id' => $categories['herbs-shoots']->id,
                'market_id' => $markets[2]->id,
                'name' => 'Sweet Italian Genovese Basil',
                'description' => 'Large glossy aromatic leaves, harvested roots-in for lasting culinary counter freshness.',
                'price' => 2.50,
                'unit' => 'bunch',
                'stock_quantity' => 0, // SOLD OUT to trigger alert!
                'image' => 'https://images.unsplash.com/photo-1618164435735-413d3b066c9a?auto=format&fit=crop&w=600&q=80',
                'status' => 'sold_out',
            ],
            [
                'farmer_id' => $farmer3->id,
                'category_id' => $categories['fresh-vegetables']->id,
                'market_id' => $markets[1]->id,
                'name' => 'Japanese Sweet Frying Peppers',
                'description' => 'Thin-skinned crisp sweet Shishito frying peppers with occasional mild heat.',
                'price' => 4.00,
                'unit' => 'lb',
                'stock_quantity' => 18,
                'image' => 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=600&q=80',
                'status' => 'available',
            ],
            [
                'farmer_id' => $farmer3->id,
                'category_id' => $categories['fresh-vegetables']->id,
                'market_id' => $markets[2]->id,
                'name' => 'Baby Sugar Snap Peas',
                'description' => 'Tender sweet edible-pod peas picked fresh at dawn from dewy vine rows.',
                'price' => 4.25,
                'unit' => 'basket',
                'stock_quantity' => 3, // LOW STOCK
                'image' => 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80',
                'status' => 'available',
            ],

            // Farmer 1 (John Farmer - Green Valley)
            [
                'farmer_id' => $farmer1->id,
                'category_id' => $categories['fresh-vegetables']->id,
                'market_id' => $markets[3]->id,
                'name' => 'Organic Nantes Carrots',
                'description' => 'Sweet crisp roots with feathery green tops still intact.',
                'price' => 3.50,
                'unit' => 'bunch',
                'stock_quantity' => 28,
                'image' => 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=600&q=80',
                'status' => 'available',
            ],
            [
                'farmer_id' => $farmer1->id,
                'category_id' => $categories['foraged-mushrooms']->id,
                'market_id' => $markets[3]->id,
                'name' => 'Golden Chanterelle Clusters',
                'description' => 'Foraged Pacific Northwest wild chanterelles, velvety and apricot-scented.',
                'price' => 14.00,
                'unit' => 'lb',
                'stock_quantity' => 10,
                'image' => 'https://images.unsplash.com/photo-1546793665-c74683f339c1?auto=format&fit=crop&w=600&q=80',
                'status' => 'available',
            ],

            // Farmer 2 (Sarah Miller - Sunny Acres)
            [
                'farmer_id' => $farmer2->id,
                'category_id' => $categories['orchard-fruits']->id,
                'market_id' => $markets[1]->id,
                'name' => 'Honeycrisp Orchard Apples',
                'description' => 'Extra crisp, explosive sweetness. Grown under high-elevation breezes in Oak Ridge.',
                'price' => 3.20,
                'unit' => 'lb',
                'stock_quantity' => 35,
                'image' => 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80',
                'status' => 'available',
            ],
            [
                'farmer_id' => $farmer2->id,
                'category_id' => $categories['honey-preserves']->id,
                'market_id' => $markets[1]->id,
                'name' => 'Wildflower Raw Honey (16oz)',
                'description' => 'Unfiltered raw nectar harvested from native meadow flora. High enzyme profile.',
                'price' => 12.00,
                'unit' => 'jar',
                'stock_quantity' => 15,
                'image' => 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80',
                'status' => 'available',
            ],
            [
                'farmer_id' => $farmer2->id,
                'category_id' => $categories['artisan-pantry']->id,
                'market_id' => $markets[3]->id,
                'name' => 'Cold-Pressed Sweet Apple Cider (1 Gal)',
                'description' => 'Freshly pressed unpasteurized cider from a blend of Honeycrisp and Gravenstein.',
                'price' => 11.00,
                'unit' => 'gal',
                'stock_quantity' => 12,
                'image' => 'https://images.unsplash.com/photo-1568644396922-5c3bfae12521?auto=format&fit=crop&w=600&q=80',
                'status' => 'available',
            ],

            // Farmer 4 (David Miller - Hearth Bakery)
            [
                'farmer_id' => $farmer4->id,
                'category_id' => $categories['hearth-breads']->id,
                'market_id' => $markets[1]->id,
                'name' => 'Rustic Seeded Miche Sourdough',
                'description' => 'Stoneground whole grain wild levain with toasted flax, sesame, and sunflower seeds.',
                'price' => 8.00,
                'unit' => 'boule',
                'stock_quantity' => 20,
                'image' => 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=600&q=80',
                'status' => 'available',
            ],
            [
                'farmer_id' => $farmer4->id,
                'category_id' => $categories['hearth-breads']->id,
                'market_id' => $markets[1]->id,
                'name' => 'Heritage Country French Baguette',
                'description' => 'Crisp blistered crust and airy custard-soft crumb. Fresh out of hearth oven 5 AM.',
                'price' => 4.50,
                'unit' => 'loaf',
                'stock_quantity' => 25,
                'image' => 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
                'status' => 'available',
            ],

            // Farmer 5 (Elena Rossi - Riverbend Goat Dairy)
            [
                'farmer_id' => $farmer5->id,
                'category_id' => $categories['farmstead-dairy']->id,
                'market_id' => $markets[1]->id,
                'name' => 'Artisan Herbed Goat Chèvre (8oz)',
                'description' => 'Creamy, tangy raw goat curd hand-rolled in garden rosemary, thyme, and pink peppercorns.',
                'price' => 9.00,
                'unit' => 'tub',
                'stock_quantity' => 14,
                'image' => 'https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&w=600&q=80',
                'status' => 'available',
            ],
            [
                'farmer_id' => $farmer5->id,
                'category_id' => $categories['farmstead-dairy']->id,
                'market_id' => $markets[1]->id,
                'name' => 'Farmstead Cultured Butter',
                'description' => 'Slow-churned cultured goat cream with flaky Oregon sea salt crystals.',
                'price' => 7.50,
                'unit' => 'block',
                'stock_quantity' => 12,
                'image' => 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=600&q=80',
                'status' => 'available',
            ],
        ];

        $products = [];
        foreach ($productsData as $p) {
            $created = Product::create($p);
            $products[] = $created;
        }

        // -------------------------------------------------------------
        // 7. ORDERS (Spanning placed, accepted, ready, completed)
        // -------------------------------------------------------------
        $today = now()->toDateString();
        $thisSaturday = now()->next('Saturday')->toDateString();

        // Order 1: Elena Rostova -> Green Pastures (Placed)
        $o1 = Order::create([
            'customer_id' => $customer3->id,
            'farmer_id' => $farmer3->id,
            'market_id' => $markets[2]->id,
            'total_amount' => 34.00,
            'order_status' => 'placed',
            'pickup_date' => $thisSaturday,
            'pickup_time' => '9:30 AM – 11:00 AM',
            'notes' => 'Please pack firm tomatoes for slicing; will pick up with stroller.',
        ]);
        OrderItem::create(['order_id' => $o1->id, 'product_id' => $products[0]->id, 'quantity' => 4, 'unit_price' => 4.50, 'subtotal' => 18.00]);
        OrderItem::create(['order_id' => $o1->id, 'product_id' => $products[1]->id, 'quantity' => 2, 'unit_price' => 3.75, 'subtotal' => 7.50]);
        OrderItem::create(['order_id' => $o1->id, 'product_id' => $products[3]->id, 'quantity' => 2, 'unit_price' => 2.50, 'subtotal' => 5.00]);
        OrderItem::create(['order_id' => $o1->id, 'product_id' => $products[4]->id, 'quantity' => 1, 'unit_price' => 3.50, 'subtotal' => 3.50]);

        // Order 2: Elena Rostova -> Sunny Acres (READY FOR PICKUP - Digital Pass!)
        $o2 = Order::create([
            'customer_id' => $customer3->id,
            'farmer_id' => $farmer2->id,
            'market_id' => $markets[1]->id,
            'total_amount' => 23.80,
            'order_status' => 'ready',
            'pickup_date' => $thisSaturday,
            'pickup_time' => '10:00 AM – 11:30 AM',
            'notes' => 'Holding in cooler at Booth 5.',
        ]);
        OrderItem::create(['order_id' => $o2->id, 'product_id' => $products[8]->id, 'quantity' => 4, 'unit_price' => 3.20, 'subtotal' => 12.80]);
        OrderItem::create(['order_id' => $o2->id, 'product_id' => $products[10]->id, 'quantity' => 1, 'unit_price' => 11.00, 'subtotal' => 11.00]);

        // Order 3: Alice Cooper -> Green Pastures (Accepted)
        $o3 = Order::create([
            'customer_id' => $customer1->id,
            'farmer_id' => $farmer3->id,
            'market_id' => $markets[2]->id,
            'total_amount' => 22.75,
            'order_status' => 'accepted',
            'pickup_date' => $thisSaturday,
            'pickup_time' => '8:00 AM – 9:30 AM',
            'notes' => 'Early bird harvest pickup.',
        ]);
        OrderItem::create(['order_id' => $o3->id, 'product_id' => $products[2]->id, 'quantity' => 2, 'unit_price' => 5.00, 'subtotal' => 10.00]);
        OrderItem::create(['order_id' => $o3->id, 'product_id' => $products[5]->id, 'quantity' => 3, 'unit_price' => 4.25, 'subtotal' => 12.75]);

        // Order 4: Bob Anderson -> Green Pastures (Ready for Pickup)
        $o4 = Order::create([
            'customer_id' => $customer2->id,
            'farmer_id' => $farmer3->id,
            'market_id' => $markets[2]->id,
            'total_amount' => 37.00,
            'order_status' => 'ready',
            'pickup_date' => $thisSaturday,
            'pickup_time' => '8:30 AM – 10:00 AM',
            'notes' => 'Packed in wooden crate #14.',
        ]);
        OrderItem::create(['order_id' => $o4->id, 'product_id' => $products[0]->id, 'quantity' => 6, 'unit_price' => 4.50, 'subtotal' => 27.00]);
        OrderItem::create(['order_id' => $o4->id, 'product_id' => $products[3]->id, 'quantity' => 4, 'unit_price' => 2.50, 'subtotal' => 10.00]);

        // Order 5: Samuel Chen -> Miller & Stone (Completed)
        $o5 = Order::create([
            'customer_id' => $customer4->id,
            'farmer_id' => $farmer4->id,
            'market_id' => $markets[1]->id,
            'total_amount' => 25.00,
            'order_status' => 'completed',
            'pickup_date' => $today,
            'pickup_time' => '8:00 AM',
            'notes' => 'Picked up by Samuel.',
        ]);
        OrderItem::create(['order_id' => $o5->id, 'product_id' => $products[11]->id, 'quantity' => 2, 'unit_price' => 8.00, 'subtotal' => 16.00]);
        OrderItem::create(['order_id' => $o5->id, 'product_id' => $products[12]->id, 'quantity' => 2, 'unit_price' => 4.50, 'subtotal' => 9.00]);

        // Order 6: Danielle Cooper -> Riverbend Dairy (Ready)
        $o6 = Order::create([
            'customer_id' => $customer5->id,
            'farmer_id' => $farmer5->id,
            'market_id' => $markets[1]->id,
            'total_amount' => 33.00,
            'order_status' => 'ready',
            'pickup_date' => $thisSaturday,
            'pickup_time' => '9:00 AM',
            'notes' => 'Insulated cheese pack.',
        ]);
        OrderItem::create(['order_id' => $o6->id, 'product_id' => $products[13]->id, 'quantity' => 2, 'unit_price' => 9.00, 'subtotal' => 18.00]);
        OrderItem::create(['order_id' => $o6->id, 'product_id' => $products[14]->id, 'quantity' => 2, 'unit_price' => 7.50, 'subtotal' => 15.00]);

        // Order 7: Elena Rostova -> Riverbend Dairy (Completed history)
        $o7 = Order::create([
            'customer_id' => $customer3->id,
            'farmer_id' => $farmer5->id,
            'market_id' => $markets[1]->id,
            'total_amount' => 18.00,
            'order_status' => 'completed',
            'pickup_date' => now()->subDays(7)->toDateString(),
            'pickup_time' => '10:00 AM',
            'notes' => 'Regular weekend chèvre run.',
        ]);
        OrderItem::create(['order_id' => $o7->id, 'product_id' => $products[13]->id, 'quantity' => 2, 'unit_price' => 9.00, 'subtotal' => 18.00]);

        // Order 8: Elena Rostova -> Miller & Stone (Completed history)
        $o8 = Order::create([
            'customer_id' => $customer3->id,
            'farmer_id' => $farmer4->id,
            'market_id' => $markets[1]->id,
            'total_amount' => 12.50,
            'order_status' => 'completed',
            'pickup_date' => now()->subDays(14)->toDateString(),
            'pickup_time' => '9:00 AM',
            'notes' => 'Sourdough reservation.',
        ]);
        OrderItem::create(['order_id' => $o8->id, 'product_id' => $products[11]->id, 'quantity' => 1, 'unit_price' => 8.00, 'subtotal' => 8.00]);
        OrderItem::create(['order_id' => $o8->id, 'product_id' => $products[12]->id, 'quantity' => 1, 'unit_price' => 4.50, 'subtotal' => 4.50]);

        // -------------------------------------------------------------
        // 8. REVIEWS WITH REPLIES
        // -------------------------------------------------------------
        Review::create([
            'customer_id' => $customer3->id,
            'farmer_id' => $farmer3->id,
            'product_id' => $products[0]->id,
            'order_id' => $o1->id,
            'rating' => 5,
            'comment' => 'The absolute best tomatoes in Portland! Thin skin, incredible depth of sweetness, and picked at peak ripeness. Our Caprese salad was sublime.',
            'farmer_reply' => 'Thank you so much Elena! We pick them just hours before the Saturday market to ensure maximum sugars and acid balance. See you next weekend! — Marcus & Sarah',
            'reply_date' => now()->subDays(2),
        ]);

        Review::create([
            'customer_id' => $customer2->id,
            'farmer_id' => $farmer3->id,
            'product_id' => $products[2]->id,
            'order_id' => $o4->id,
            'rating' => 5,
            'comment' => 'Romanesco was a work of art! Both aesthetically stunning and delicious roasted with garlic butter. Can you keep more in stock for Pioneer Pavilion?',
            'farmer_reply' => 'Thanks Marcus! We planted two extra rows of Romanesco that are heading up right now. More crates coming!',
            'reply_date' => now()->subDay(),
        ]);

        Review::create([
            'customer_id' => $customer1->id,
            'farmer_id' => $farmer3->id,
            'product_id' => $products[1]->id,
            'order_id' => $o3->id,
            'rating' => 4,
            'comment' => 'Super fresh and crunchy greens. Zero synthetic sprays means native flora and fauna are respected. Just wash thoroughly and enjoy!',
            'farmer_reply' => 'Haha thanks for understanding Alice! Zero sprays and rich compost yields that mineral-rich flavor.',
            'reply_date' => now()->subHours(6),
        ]);

        Review::create([
            'customer_id' => $customer3->id,
            'farmer_id' => $farmer4->id,
            'product_id' => $products[11]->id,
            'order_id' => $o8->id,
            'rating' => 5,
            'comment' => 'The sourdough country loaf crust crackles when sliced, with an open custardy crumb and deep caramelized blistered crust. Best bakery in the valley!',
            'farmer_reply' => 'We mix our 48-hour levain every Thursday night specifically for Saturday reservations. Thank you Elena!',
            'reply_date' => now()->subDays(10),
        ]);

        Review::create([
            'customer_id' => $customer3->id,
            'farmer_id' => $farmer5->id,
            'product_id' => $products[13]->id,
            'order_id' => $o7->id,
            'rating' => 5,
            'comment' => 'Artisanal goat chèvre that rivals French farmsteads. Spread on warm crusty bread with wild honey.',
            'farmer_reply' => 'Elena, our herd grazes on wild sweet clover pasture which gives the milk that delicate floral note. Grazing updates every week!',
            'reply_date' => now()->subDays(5),
        ]);

        // -------------------------------------------------------------
        // 9. FAVORITES (FARMERS & PRODUCTS)
        // -------------------------------------------------------------
        Favorite::create(['customer_id' => $customer3->id, 'type' => 'farmer', 'target_id' => $farmer3->id]);
        Favorite::create(['customer_id' => $customer3->id, 'type' => 'farmer', 'target_id' => $farmer2->id]);
        Favorite::create(['customer_id' => $customer3->id, 'type' => 'farmer', 'target_id' => $farmer4->id]);
        Favorite::create(['customer_id' => $customer3->id, 'type' => 'farmer', 'target_id' => $farmer5->id]);
        Favorite::create(['customer_id' => $customer3->id, 'type' => 'product', 'target_id' => $products[0]->id]);
        Favorite::create(['customer_id' => $customer3->id, 'type' => 'product', 'target_id' => $products[8]->id]);
        Favorite::create(['customer_id' => $customer3->id, 'type' => 'product', 'target_id' => $products[11]->id]);
        Favorite::create(['customer_id' => $customer3->id, 'type' => 'product', 'target_id' => $products[13]->id]);

        Favorite::create(['customer_id' => $customer1->id, 'type' => 'farmer', 'target_id' => $farmer1->id]);
        Favorite::create(['customer_id' => $customer1->id, 'type' => 'product', 'target_id' => $products[6]->id]);

        // -------------------------------------------------------------
        // 10. STOCK TEMPLATES (For Farmer 3)
        // -------------------------------------------------------------
        StockTemplate::create(['farmer_id' => $farmer3->id, 'day_of_week' => 'Saturday', 'product_id' => $products[0]->id, 'default_quantity' => 40, 'is_included' => true]);
        StockTemplate::create(['farmer_id' => $farmer3->id, 'day_of_week' => 'Saturday', 'product_id' => $products[1]->id, 'default_quantity' => 25, 'is_included' => true]);
        StockTemplate::create(['farmer_id' => $farmer3->id, 'day_of_week' => 'Saturday', 'product_id' => $products[2]->id, 'default_quantity' => 18, 'is_included' => true]);
        StockTemplate::create(['farmer_id' => $farmer3->id, 'day_of_week' => 'Saturday', 'product_id' => $products[4]->id, 'default_quantity' => 20, 'is_included' => true]);

        StockTemplate::create(['farmer_id' => $farmer3->id, 'day_of_week' => 'Wednesday', 'product_id' => $products[0]->id, 'default_quantity' => 25, 'is_included' => true]);
        StockTemplate::create(['farmer_id' => $farmer3->id, 'day_of_week' => 'Wednesday', 'product_id' => $products[1]->id, 'default_quantity' => 15, 'is_included' => true]);

        // -------------------------------------------------------------
        // 11. NOTIFICATIONS
        // -------------------------------------------------------------
        Notification::create([
            'user_id' => $customer3->id,
            'type' => 'order_ready',
            'title' => 'Harvest Order Ready for Pickup!',
            'message' => 'Your reservation #ML-' . $o2->id . ' has been packed at Sunny Acres Farm (Downtown Saturday Market, Booth 5).',
            'data' => ['order_id' => $o2->id],
            'read_at' => null,
        ]);

        Notification::create([
            'user_id' => $customer3->id,
            'type' => 'order_placed',
            'title' => 'Reservation Confirmed',
            'message' => 'Your reservation #ML-' . $o1->id . ' was received by Green Pastures Organic for Saturday pickup.',
            'data' => ['order_id' => $o1->id],
            'read_at' => now()->subDay(),
        ]);

        Notification::create([
            'user_id' => $farmer3->id,
            'type' => 'order_placed',
            'title' => 'New Shopper Reservation Received',
            'message' => 'Elena Rostova placed order #ML-' . $o1->id . ' ($34.00) for Pioneer Pavilion Saturday pickup.',
            'data' => ['order_id' => $o1->id],
            'read_at' => null,
        ]);

        // -------------------------------------------------------------
        // 12. ANNOUNCEMENTS
        // -------------------------------------------------------------
        Announcement::create([
            'user_id' => $admin->id,
            'title' => 'Harvest Weekend Inclement Weather Advisory',
            'content' => 'Rain anticipated in North River District for Saturday morning. Tents, tie-downs, and rain guards are mandatory for stalls 1–18.',
            'audience' => 'All Community',
            'type' => 'Weather Advisory',
            'is_active' => true,
        ]);

        Announcement::create([
            'user_id' => $admin->id,
            'title' => 'SNAP / Double Up Food Bucks Matching Tokens Expanded',
            'content' => 'Central token pavilion #1 will have an additional $5,000 in wooden matching currency available starting at 7:30 AM.',
            'audience' => 'All Community',
            'type' => 'Token Program',
            'is_active' => true,
        ]);

        Announcement::create([
            'user_id' => $admin->id,
            'title' => 'Annual Fall Apple & Sweet Cider Festival Sign-Up',
            'content' => 'Growers can register extra square footage for the Oct 25 special harvest festival pavilion.',
            'audience' => 'Farmers Only',
            'type' => 'Seasonal Event',
            'is_active' => true,
        ]);
    }
}
