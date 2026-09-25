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
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Admin
        $admin = User::create([
            'name' => 'Platform Admin',
            'email' => 'admin@marketlink.test',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'phone' => '+1-555-0100',
            'address' => 'Admin HQ, 100 Main St',
            'status' => 'active',
        ]);

        // 2. Farmer 1 (approved)
        $farmer1 = User::create([
            'name' => 'John Farmer',
            'email' => 'farmer1@marketlink.test',
            'password' => Hash::make('password'),
            'role' => 'farmer',
            'phone' => '+1-555-0201',
            'address' => 'Green Valley Farm, Lane 4, Orchard County',
            'status' => 'active',
        ]);

        FarmerProfile::create([
            'user_id' => $farmer1->id,
            'stall_name' => 'Green Valley Organics',
            'contact_person' => 'John Farmer',
            'operating_days' => ['Monday', 'Wednesday', 'Saturday'],
            'pickup_time_start' => '08:00',
            'pickup_time_end' => '14:00',
            'address' => 'Stall #12, Riverside Green Market',
            'latitude' => 37.774929,
            'longitude' => -122.419416,
            'status' => 'approved',
        ]);

        // 3. Farmer 2 (approved)
        $farmer2 = User::create([
            'name' => 'Sarah Miller',
            'email' => 'farmer2@marketlink.test',
            'password' => Hash::make('password'),
            'role' => 'farmer',
            'phone' => '+1-555-0202',
            'address' => 'Sunny Acres Homestead, Highway 9',
            'status' => 'active',
        ]);

        FarmerProfile::create([
            'user_id' => $farmer2->id,
            'stall_name' => 'Sunny Acres Farm',
            'contact_person' => 'Sarah Miller',
            'operating_days' => ['Tuesday', 'Thursday', 'Sunday'],
            'pickup_time_start' => '09:00',
            'pickup_time_end' => '15:00',
            'address' => 'Stall #5, Central City Farmers Market',
            'latitude' => 37.783333,
            'longitude' => -122.416667,
            'status' => 'approved',
        ]);

        // 4. Customer 1
        $customer1 = User::create([
            'name' => 'Alice Cooper',
            'email' => 'customer1@marketlink.test',
            'password' => Hash::make('password'),
            'role' => 'customer',
            'phone' => '+1-555-0301',
            'address' => '45 Elm Street, Apt 2B, Springfield',
            'status' => 'active',
        ]);

        // 5. Customer 2
        $customer2 = User::create([
            'name' => 'Bob Anderson',
            'email' => 'customer2@marketlink.test',
            'password' => Hash::make('password'),
            'role' => 'customer',
            'phone' => '+1-555-0302',
            'address' => '88 Maple Avenue, Springfield',
            'status' => 'active',
        ]);

        // 6. Markets
        $market1 = Market::create([
            'market_name' => 'Central City Farmers Market',
            'address' => '200 Market Square, Downtown',
            'latitude' => 37.783333,
            'longitude' => -122.416667,
            'operating_days' => ['Tuesday', 'Thursday', 'Saturday'],
            'timings' => '8:00 AM - 2:00 PM',
            'map_provider' => 'OpenStreetMap',
        ]);

        $market2 = Market::create([
            'market_name' => 'Riverside Green Market',
            'address' => '50 Waterfront Blvd, Riverside Park',
            'latitude' => 37.774929,
            'longitude' => -122.419416,
            'operating_days' => ['Wednesday', 'Friday', 'Sunday'],
            'timings' => '9:00 AM - 3:00 PM',
            'map_provider' => 'OpenStreetMap',
        ]);

        // 7. Categories
        $categoriesData = [
            ['name' => 'Fresh Vegetables', 'slug' => 'fresh-vegetables', 'description' => 'Crisp local leafy greens, roots, and garden heirlooms.', 'icon' => 'eco'],
            ['name' => 'Orchard Fruits', 'slug' => 'orchard-fruits', 'description' => 'Seasonal tree-ripened apples, stonefruits, and fresh field berries.', 'icon' => 'nutrition'],
            ['name' => 'Farmstead Dairy', 'slug' => 'farmstead-dairy', 'description' => 'Small batch cheeses, cultured yogurts, and pasture brown eggs.', 'icon' => 'egg'],
            ['name' => 'Hearth Breads', 'slug' => 'hearth-breads', 'description' => 'Naturally fermented wild sourdough boules and artisanal hearth breads.', 'icon' => 'bakery_dining'],
            ['name' => 'Herbs & Shoots', 'slug' => 'herbs-shoots', 'description' => 'Fragrant culinary herbs, fresh teas, and indoor microgreens.', 'icon' => 'psychiatry'],
            ['name' => 'Honey & Jams', 'slug' => 'honey-jams', 'description' => 'Raw wildflower nectar, clover honeycomb, and small-batch preserves.', 'icon' => 'hive'],
        ];

        $categories = [];
        foreach ($categoriesData as $c) {
            $categories[$c['slug']] = Category::create($c);
        }

        // 8. Announcements
        Announcement::create([
            'user_id' => $admin->id,
            'title' => 'Harvest Weekend Inclement Weather Advisory',
            'content' => 'Light rain anticipated in North River District for Saturday morning. Tents and rain guards mandatory for stalls 1–18.',
            'audience' => 'All Community',
            'type' => 'Weather Advisory',
            'is_active' => true,
        ]);

        Announcement::create([
            'user_id' => $admin->id,
            'title' => 'Double Up Food Bucks (SNAP) Matching Tokens Expanded',
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

        // 9. Products
        $p1 = Product::create([
            'farmer_id' => $farmer1->id,
            'category_id' => $categories['fresh-vegetables']->id,
            'market_id' => $market2->id,
            'name' => 'Heirloom Brandywine Tomatoes',
            'description' => 'Vine-ripened, rich acidic bite with velvety sweetness. Picked Friday afternoon.',
            'price' => 4.50,
            'unit' => 'lb',
            'stock_quantity' => 24,
            'image' => 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
            'status' => 'available',
        ]);

        $p2 = Product::create([
            'farmer_id' => $farmer1->id,
            'category_id' => $categories['fresh-vegetables']->id,
            'market_id' => $market2->id,
            'name' => 'Rainbow Chard & Kale Bundle',
            'description' => 'Ruby, gold, and emerald stems washed in fresh spring wellwater. Packed with vitamins.',
            'price' => 3.75,
            'unit' => 'bunch',
            'stock_quantity' => 18,
            'image' => 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
            'status' => 'available',
        ]);

        $p3 = Product::create([
            'farmer_id' => $farmer2->id,
            'category_id' => $categories['orchard-fruits']->id,
            'market_id' => $market1->id,
            'name' => 'Honeycrisp Orchard Apples',
            'description' => 'Crisp, extra juicy snaps. Grown under high-elevation breezes in Oak Ridge.',
            'price' => 3.20,
            'unit' => 'lb',
            'stock_quantity' => 30,
            'image' => 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80',
            'status' => 'available',
        ]);

        $p4 = Product::create([
            'farmer_id' => $farmer2->id,
            'category_id' => $categories['honey-jams']->id,
            'market_id' => $market1->id,
            'name' => 'Wildflower Raw Honey (16oz)',
            'description' => 'Unfiltered, raw nectar harvested from native meadow flora. High enzyme profile.',
            'price' => 12.00,
            'unit' => 'jar',
            'stock_quantity' => 12,
            'image' => 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80',
            'status' => 'available',
        ]);

        // 10. Orders
        $order1 = Order::create([
            'customer_id' => $customer1->id,
            'farmer_id' => $farmer1->id,
            'market_id' => $market2->id,
            'total_amount' => 16.50,
            'order_status' => 'completed',
            'pickup_date' => now()->toDateString(),
            'pickup_time' => '10:00 AM',
            'notes' => 'Please include extra ripe tomatoes if possible.',
        ]);

        OrderItem::create([
            'order_id' => $order1->id,
            'product_id' => $p1->id,
            'quantity' => 2,
            'unit_price' => 4.50,
            'subtotal' => 9.00,
        ]);

        OrderItem::create([
            'order_id' => $order1->id,
            'product_id' => $p2->id,
            'quantity' => 2,
            'unit_price' => 3.75,
            'subtotal' => 7.50,
        ]);

        $order2 = Order::create([
            'customer_id' => $customer2->id,
            'farmer_id' => $farmer2->id,
            'market_id' => $market1->id,
            'total_amount' => 21.60,
            'order_status' => 'placed',
            'pickup_date' => now()->addDays(2)->toDateString(),
            'pickup_time' => '11:30 AM',
            'notes' => 'Will pickup around noon.',
        ]);

        OrderItem::create([
            'order_id' => $order2->id,
            'product_id' => $p3->id,
            'quantity' => 3,
            'unit_price' => 3.20,
            'subtotal' => 9.60,
        ]);

        OrderItem::create([
            'order_id' => $order2->id,
            'product_id' => $p4->id,
            'quantity' => 1,
            'unit_price' => 12.00,
            'subtotal' => 12.00,
        ]);

        // 11. Reviews
        Review::create([
            'customer_id' => $customer1->id,
            'farmer_id' => $farmer1->id,
            'product_id' => $p1->id,
            'order_id' => $order1->id,
            'rating' => 5,
            'comment' => 'The Brandywine tomatoes were incredibly juicy and flavorful! Perfect heirloom quality.',
        ]);

        Review::create([
            'customer_id' => $customer2->id,
            'farmer_id' => $farmer2->id,
            'product_id' => $p4->id,
            'order_id' => null,
            'rating' => 5,
            'comment' => 'The raw wildflower honey has an amazing aroma and authentic taste.',
        ]);

        // 12. Favorites
        Favorite::create([
            'customer_id' => $customer1->id,
            'type' => 'farmer',
            'target_id' => $farmer1->id,
        ]);

        Favorite::create([
            'customer_id' => $customer1->id,
            'type' => 'product',
            'target_id' => $p1->id,
        ]);

        // 13. Notifications
        Notification::create([
            'user_id' => $customer1->id,
            'type' => 'order_placed',
            'title' => 'Order Confirmed',
            'message' => 'Your order #1 has been placed for pickup today.',
            'data' => ['order_id' => $order1->id],
            'read_at' => now(),
        ]);

        Notification::create([
            'user_id' => $customer1->id,
            'type' => 'order_ready',
            'title' => 'Order Ready for Pickup',
            'message' => 'Your order #1 is packaged and ready at Stall #12.',
            'data' => ['order_id' => $order1->id],
        ]);

        Notification::create([
            'user_id' => $farmer1->id,
            'type' => 'order_placed',
            'title' => 'New Order Received',
            'message' => 'Customer Alice Cooper placed order #1 ($16.50).',
            'data' => ['order_id' => $order1->id],
        ]);
    }
}
