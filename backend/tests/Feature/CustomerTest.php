<?php

namespace Tests\Feature;

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
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class CustomerTest extends TestCase
{
    use RefreshDatabase;

    private User $customer;
    private string $customerToken;
    private User $farmer;
    private FarmerProfile $farmerProfile;
    private Market $market;
    private Category $category;
    private Product $product1;
    private Product $product2;

    protected function setUp(): void
    {
        parent::setUp();

        // 1. Create Market
        $this->market = Market::create([
            'market_name' => 'Downtown Farmers Market',
            'address' => '100 Main St, Metropolis',
            'latitude' => 40.7128,
            'longitude' => -74.0060,
            'operating_days' => ['Saturday', 'Sunday'],
            'timings' => '08:00 - 14:00',
        ]);

        // 2. Create Category
        $this->category = Category::create([
            'name' => 'Fresh Vegetables',
            'slug' => 'fresh-vegetables',
            'icon' => 'carrot',
        ]);

        // 3. Create Farmer
        $this->farmer = User::create([
            'name' => 'Green Fields Farm',
            'email' => 'farmer@marketlink.test',
            'password' => Hash::make('password'),
            'role' => 'farmer',
            'phone' => '+1-555-1000',
            'status' => 'active',
        ]);

        $this->farmerProfile = FarmerProfile::create([
            'user_id' => $this->farmer->id,
            'stall_name' => 'Green Fields Produce',
            'contact_person' => 'Bob Farmer',
            'operating_days' => ['Saturday', 'Sunday'],
            'pickup_time_start' => '08:00',
            'pickup_time_end' => '13:00',
            'cutoff_time' => 'Friday 18:00',
            'market_ids' => [$this->market->id],
            'status' => 'approved',
        ]);

        // 4. Create Products
        $this->product1 = Product::create([
            'farmer_id' => $this->farmer->id,
            'category_id' => $this->category->id,
            'market_id' => $this->market->id,
            'name' => 'Organic Heirloom Tomatoes',
            'description' => 'Locally grown sweet heirloom tomatoes.',
            'price' => 4.50,
            'unit' => 'lb',
            'stock_quantity' => 10,
            'status' => 'available',
        ]);

        $this->product2 = Product::create([
            'farmer_id' => $this->farmer->id,
            'category_id' => $this->category->id,
            'market_id' => $this->market->id,
            'name' => 'Crisp Red Apples',
            'description' => 'Crispy freshly picked apples.',
            'price' => 3.00,
            'unit' => 'lb',
            'stock_quantity' => 2,
            'status' => 'available',
        ]);

        // 5. Create Customer
        $this->customer = User::create([
            'name' => 'Alice Customer',
            'email' => 'alice@marketlink.test',
            'password' => Hash::make('password'),
            'role' => 'customer',
            'phone' => '+1-555-2000',
            'status' => 'active',
        ]);

        $this->customerToken = $this->customer->createToken('customer')->plainTextToken;
    }

    private function authCustomer(): self
    {
        return $this->withHeader('Authorization', 'Bearer ' . $this->customerToken);
    }

    public function test_public_and_customers_can_browse_markets(): void
    {
        $response = $this->getJson('/api/browse/markets');
        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.market_name', 'Downtown Farmers Market');

        // Filter by search
        $searchResponse = $this->getJson('/api/browse/markets?search=Metropolis');
        $searchResponse->assertStatus(200)
            ->assertJsonCount(1, 'data');

        // View single market
        $singleResponse = $this->getJson("/api/browse/markets/{$this->market->id}");
        $singleResponse->assertStatus(200)
            ->assertJsonPath('data.market_name', 'Downtown Farmers Market')
            ->assertJsonCount(1, 'data.farmers');
    }

    public function test_public_and_customers_can_browse_products_with_filters(): void
    {
        $response = $this->getJson('/api/browse/products');
        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonCount(2, 'data');

        // Filter by price range
        $priceResponse = $this->getJson('/api/browse/products?min_price=4.00');
        $priceResponse->assertStatus(200)
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.name', 'Organic Heirloom Tomatoes');

        // Filter by category
        $catResponse = $this->getJson("/api/browse/products?category_id={$this->category->id}");
        $catResponse->assertStatus(200)
            ->assertJsonCount(2, 'data');

        // View single product details
        $detailResponse = $this->getJson("/api/browse/products/{$this->product1->id}");
        $detailResponse->assertStatus(200)
            ->assertJsonPath('data.name', 'Organic Heirloom Tomatoes');
    }

    public function test_public_can_view_farmer_public_profile(): void
    {
        $response = $this->getJson("/api/browse/farmers/{$this->farmer->id}");
        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.name', 'Green Fields Farm')
            ->assertJsonCount(2, 'data.products');
    }

    public function test_unauthenticated_user_cannot_access_customer_routes(): void
    {
        $response = $this->getJson('/api/customer/orders');
        $response->assertStatus(401);
    }

    public function test_farmer_cannot_access_customer_routes(): void
    {
        $farmerToken = $this->farmer->createToken('farmer')->plainTextToken;

        $response = $this->withHeader('Authorization', 'Bearer ' . $farmerToken)
            ->getJson('/api/customer/orders');

        $response->assertStatus(403);
    }

    public function test_customer_can_place_order_and_stock_is_decremented(): void
    {
        $orderData = [
            'farmer_id' => $this->farmer->id,
            'market_id' => $this->market->id,
            'pickup_date' => '2026-10-03',
            'pickup_time' => '09:00 AM - 10:00 AM',
            'notes' => 'Please package carefully.',
            'items' => [
                [
                    'product_id' => $this->product1->id,
                    'quantity' => 3,
                ],
                [
                    'product_id' => $this->product2->id,
                    'quantity' => 2, // will exhaust stock of product 2 (stock was 2)
                ],
            ],
        ];

        $response = $this->authCustomer()->postJson('/api/customer/orders', $orderData);

        $response->assertStatus(201)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.order_status', 'placed')
            ->assertJsonPath('data.total_amount', 19.5); // 3*4.50 (13.50) + 2*3.00 (6.00) = 19.50

        // Check stock decrements
        $this->assertEquals(7, $this->product1->fresh()->stock_quantity);
        $this->assertEquals('available', $this->product1->fresh()->status);

        $this->assertEquals(0, $this->product2->fresh()->stock_quantity);
        $this->assertEquals('sold_out', $this->product2->fresh()->status);

        // Check notifications created for both farmer and customer
        $this->assertDatabaseHas('notifications', [
            'user_id' => $this->farmer->id,
            'type' => 'order_placed',
        ]);
        $this->assertDatabaseHas('notifications', [
            'user_id' => $this->customer->id,
            'type' => 'order_placed',
        ]);
    }

    public function test_cannot_order_more_than_available_stock(): void
    {
        $orderData = [
            'farmer_id' => $this->farmer->id,
            'market_id' => $this->market->id,
            'pickup_date' => '2026-10-03',
            'pickup_time' => '09:00 AM - 10:00 AM',
            'items' => [
                [
                    'product_id' => $this->product2->id,
                    'quantity' => 5, // stock is only 2
                ],
            ],
        ];

        $response = $this->authCustomer()->postJson('/api/customer/orders', $orderData);

        $response->assertStatus(422)
            ->assertJsonPath('success', false);

        // Stock remains unchanged
        $this->assertEquals(2, $this->product2->fresh()->stock_quantity);
    }

    public function test_customer_can_view_own_orders_and_order_details(): void
    {
        $order = Order::create([
            'customer_id' => $this->customer->id,
            'farmer_id' => $this->farmer->id,
            'market_id' => $this->market->id,
            'total_amount' => 9.00,
            'order_status' => 'placed',
            'pickup_date' => '2026-10-03',
            'pickup_time' => '10:00 AM',
        ]);

        OrderItem::create([
            'order_id' => $order->id,
            'product_id' => $this->product1->id,
            'quantity' => 2,
            'unit_price' => 4.50,
            'subtotal' => 9.00,
        ]);

        $listResponse = $this->authCustomer()->getJson('/api/customer/orders');
        $listResponse->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonCount(1, 'data');

        $detailResponse = $this->authCustomer()->getJson("/api/customer/orders/{$order->id}");
        $detailResponse->assertStatus(200)
            ->assertJsonPath('data.id', $order->id)
            ->assertJsonPath('data.total_amount', 9)
            ->assertJsonCount(1, 'data.items');
    }

    public function test_customer_can_modify_placed_order(): void
    {
        $order = Order::create([
            'customer_id' => $this->customer->id,
            'farmer_id' => $this->farmer->id,
            'market_id' => $this->market->id,
            'total_amount' => 9.00,
            'order_status' => 'placed',
            'pickup_date' => '2026-10-03',
            'pickup_time' => '10:00 AM',
            'notes' => 'Original note',
        ]);

        $response = $this->authCustomer()->patchJson("/api/customer/orders/{$order->id}", [
            'pickup_time' => '11:30 AM',
            'notes' => 'Updated pickup instruction',
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.pickup_time', '11:30 AM')
            ->assertJsonPath('data.notes', 'Updated pickup instruction');
    }

    public function test_customer_cannot_modify_completed_or_accepted_order(): void
    {
        $order = Order::create([
            'customer_id' => $this->customer->id,
            'farmer_id' => $this->farmer->id,
            'market_id' => $this->market->id,
            'total_amount' => 9.00,
            'order_status' => 'accepted',
            'pickup_date' => '2026-10-03',
            'pickup_time' => '10:00 AM',
        ]);

        $response = $this->authCustomer()->patchJson("/api/customer/orders/{$order->id}", [
            'pickup_time' => '11:30 AM',
        ]);

        $response->assertStatus(422)
            ->assertJsonPath('success', false);
    }

    public function test_customer_can_cancel_order_and_restores_stock(): void
    {
        // First order decreases stock
        $this->product2->update(['stock_quantity' => 0, 'status' => 'sold_out']);

        $order = Order::create([
            'customer_id' => $this->customer->id,
            'farmer_id' => $this->farmer->id,
            'market_id' => $this->market->id,
            'total_amount' => 6.00,
            'order_status' => 'placed',
            'pickup_date' => '2026-10-03',
            'pickup_time' => '10:00 AM',
        ]);

        OrderItem::create([
            'order_id' => $order->id,
            'product_id' => $this->product2->id,
            'quantity' => 2,
            'unit_price' => 3.00,
            'subtotal' => 6.00,
        ]);

        $response = $this->authCustomer()->postJson("/api/customer/orders/{$order->id}/cancel");

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.order_status', 'cancelled');

        // Stock restored and status flipped back to available
        $this->assertEquals(2, $this->product2->fresh()->stock_quantity);
        $this->assertEquals('available', $this->product2->fresh()->status);
    }

    public function test_customer_can_reorder_from_past_order(): void
    {
        $pastOrder = Order::create([
            'customer_id' => $this->customer->id,
            'farmer_id' => $this->farmer->id,
            'market_id' => $this->market->id,
            'total_amount' => 9.00,
            'order_status' => 'completed',
            'pickup_date' => '2026-09-20',
            'pickup_time' => '10:00 AM',
        ]);

        OrderItem::create([
            'order_id' => $pastOrder->id,
            'product_id' => $this->product1->id,
            'quantity' => 2,
            'unit_price' => 4.50,
            'subtotal' => 9.00,
        ]);

        $initialStock = $this->product1->fresh()->stock_quantity;

        $response = $this->authCustomer()->postJson("/api/customer/orders/{$pastOrder->id}/reorder", [
            'pickup_date' => '2026-10-04',
            'pickup_time' => '11:00 AM',
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.order_status', 'placed')
            ->assertJsonPath('data.pickup_date', '2026-10-04');

        $this->assertEquals($initialStock - 2, $this->product1->fresh()->stock_quantity);
    }

    public function test_customer_can_toggle_favorites(): void
    {
        // 1. Toggle Farmer Favorite On
        $toggleFarmer = $this->authCustomer()->postJson('/api/customer/favorites/toggle', [
            'type' => 'farmer',
            'target_id' => $this->farmer->id,
        ]);
        $toggleFarmer->assertStatus(201)
            ->assertJsonPath('data.is_favorite', true);

        $this->assertDatabaseHas('favorites', [
            'customer_id' => $this->customer->id,
            'type' => 'farmer',
            'target_id' => $this->farmer->id,
        ]);

        // 2. Toggle Product Favorite On
        $toggleProduct = $this->authCustomer()->postJson('/api/customer/favorites/toggle', [
            'type' => 'product',
            'target_id' => $this->product1->id,
        ]);
        $toggleProduct->assertStatus(201)
            ->assertJsonPath('data.is_favorite', true);

        // 3. List Favorites
        $listResponse = $this->authCustomer()->getJson('/api/customer/favorites');
        $listResponse->assertStatus(200)
            ->assertJsonCount(2, 'data');

        // Filter by type
        $filterResponse = $this->authCustomer()->getJson('/api/customer/favorites?type=farmer');
        $filterResponse->assertStatus(200)
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.type', 'farmer');

        // 4. Toggle Farmer Favorite Off
        $toggleOff = $this->authCustomer()->postJson('/api/customer/favorites/toggle', [
            'type' => 'farmer',
            'target_id' => $this->farmer->id,
        ]);
        $toggleOff->assertStatus(200)
            ->assertJsonPath('data.is_favorite', false);

        $this->assertDatabaseMissing('favorites', [
            'customer_id' => $this->customer->id,
            'type' => 'farmer',
            'target_id' => $this->farmer->id,
        ]);
    }

    public function test_reviews_constraint_requires_completed_order(): void
    {
        // 1. Order in 'placed' status — must fail
        $order = Order::create([
            'customer_id' => $this->customer->id,
            'farmer_id' => $this->farmer->id,
            'market_id' => $this->market->id,
            'total_amount' => 4.50,
            'order_status' => 'placed',
            'pickup_date' => '2026-10-03',
            'pickup_time' => '10:00 AM',
        ]);

        $failReview = $this->authCustomer()->postJson('/api/customer/reviews', [
            'order_id' => $order->id,
            'rating' => 5,
            'comment' => 'Great tomatoes!',
        ]);

        $failReview->assertStatus(422)
            ->assertJsonPath('success', false);

        // 2. Transition order to 'completed'
        $order->update(['order_status' => 'completed']);

        $successReview = $this->authCustomer()->postJson('/api/customer/reviews', [
            'order_id' => $order->id,
            'rating' => 5,
            'comment' => 'Crisp, sweet, and perfectly fresh produce!',
        ]);

        $successReview->assertStatus(201)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.rating', 5);

        // 3. Second review on same order must fail (prevent duplicates)
        $dupReview = $this->authCustomer()->postJson('/api/customer/reviews', [
            'order_id' => $order->id,
            'rating' => 4,
            'comment' => 'Duplicate attempt.',
        ]);

        $dupReview->assertStatus(422);

        // 4. Customer can view own reviews list
        $listReviews = $this->authCustomer()->getJson('/api/customer/reviews');
        $listReviews->assertStatus(200)
            ->assertJsonCount(1, 'data');
    }

    public function test_customer_can_manage_notifications(): void
    {
        // Create 2 notifications
        Notification::create([
            'user_id' => $this->customer->id,
            'type' => 'order_placed',
            'title' => 'Order Placed',
            'message' => 'Your order #1 has been placed.',
        ]);

        $notif2 = Notification::create([
            'user_id' => $this->customer->id,
            'type' => 'order_ready',
            'title' => 'Ready for Pickup',
            'message' => 'Your order #1 is ready at the stall.',
        ]);

        // List notifications
        $list = $this->authCustomer()->getJson('/api/customer/notifications');
        $list->assertStatus(200)
            ->assertJsonPath('unread_count', 2)
            ->assertJsonCount(2, 'data');

        // Mark single as read
        $markOne = $this->authCustomer()->patchJson("/api/customer/notifications/{$notif2->id}/read");
        $markOne->assertStatus(200)
            ->assertJsonPath('data.is_read', true);

        $this->assertEquals(1, Notification::where('user_id', $this->customer->id)->whereNull('read_at')->count());

        // Mark all as read
        $markAll = $this->authCustomer()->patchJson('/api/customer/notifications/read-all');
        $markAll->assertStatus(200);

        $this->assertEquals(0, Notification::where('user_id', $this->customer->id)->whereNull('read_at')->count());
    }
}
