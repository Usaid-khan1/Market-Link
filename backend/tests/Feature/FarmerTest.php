<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\FarmerProfile;
use App\Models\Market;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Review;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class FarmerTest extends TestCase
{
    use RefreshDatabase;

    private User $farmer;
    private string $farmerToken;
    private FarmerProfile $profile;

    protected function setUp(): void
    {
        parent::setUp();

        $this->farmer = User::create([
            'name' => 'John Farmer',
            'email' => 'farmer@test.com',
            'password' => Hash::make('password'),
            'role' => 'farmer',
            'phone' => '+1-555-1234',
            'status' => 'active',
        ]);

        $this->profile = FarmerProfile::create([
            'user_id' => $this->farmer->id,
            'stall_name' => 'Green Valley Organics',
            'contact_person' => 'John Farmer',
            'operating_days' => ['Saturday', 'Sunday'],
            'pickup_time_start' => '08:00',
            'pickup_time_end' => '13:00',
            'cutoff_time' => 'Friday 8:00 PM',
            'pickup_slots' => ['8:00 AM – 9:30 AM', '9:30 AM – 11:00 AM'],
            'status' => 'approved',
        ]);

        $this->farmerToken = $this->farmer->createToken('farmer')->plainTextToken;
    }

    private function authFarmer(): self
    {
        return $this->withHeader('Authorization', 'Bearer ' . $this->farmerToken);
    }

    public function test_farmer_can_view_and_update_profile_and_stall_details(): void
    {
        // View profile
        $viewRes = $this->authFarmer()->getJson('/api/farmer/profile');
        $viewRes->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'stall' => [
                        'stall_name' => 'Green Valley Organics',
                        'cutoff_time' => 'Friday 8:00 PM',
                    ],
                ],
            ]);

        // Update profile
        $updateRes = $this->authFarmer()->putJson('/api/farmer/profile', [
            'stall_name' => 'Green Valley Biodynamic Farm',
            'bio' => 'Family farm producing heirloom vegetables and herbs.',
            'phone' => '+1-555-8888',
            'cutoff_time' => 'Thursday 6:00 PM (24 hrs prior)',
            'pickup_slots' => ['8:00 AM – 10:00 AM', '10:00 AM – 12:00 PM'],
            'latitude' => 37.7749,
            'longitude' => -122.4194,
        ]);

        $updateRes->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'user' => ['phone' => '+1-555-8888'],
                    'stall' => [
                        'stall_name' => 'Green Valley Biodynamic Farm',
                        'bio' => 'Family farm producing heirloom vegetables and herbs.',
                        'cutoff_time' => 'Thursday 6:00 PM (24 hrs prior)',
                    ],
                ],
            ]);

        $this->assertDatabaseHas('farmer_profiles', [
            'user_id' => $this->farmer->id,
            'stall_name' => 'Green Valley Biodynamic Farm',
            'cutoff_time' => 'Thursday 6:00 PM (24 hrs prior)',
        ]);
    }

    public function test_farmer_can_crud_own_products(): void
    {
        $category = Category::create(['name' => 'Vegetables', 'slug' => 'vegetables']);

        // Create
        $createRes = $this->authFarmer()->postJson('/api/farmer/products', [
            'name' => 'Heirloom Brandywine Tomatoes',
            'category_id' => $category->id,
            'price' => 4.50,
            'unit' => 'lb',
            'stock_quantity' => 25,
            'description' => 'Sweet, juicy heirloom tomatoes.',
            'status' => 'available',
        ]);

        $createRes->assertStatus(201)
            ->assertJson([
                'success' => true,
                'data' => [
                    'name' => 'Heirloom Brandywine Tomatoes',
                    'price' => 4.5,
                    'stock_quantity' => 25,
                    'status' => 'available',
                ],
            ]);
        $productId = $createRes->json('data.id');

        // Read list
        $listRes = $this->authFarmer()->getJson('/api/farmer/products');
        $listRes->assertStatus(200);
        $this->assertCount(1, $listRes->json('data'));

        // Show single
        $showRes = $this->authFarmer()->getJson("/api/farmer/products/{$productId}");
        $showRes->assertStatus(200)
            ->assertJson(['data' => ['name' => 'Heirloom Brandywine Tomatoes']]);

        // Update
        $updateRes = $this->authFarmer()->putJson("/api/farmer/products/{$productId}", [
            'price' => 5.00,
            'stock_quantity' => 30,
        ]);
        $updateRes->assertStatus(200)
            ->assertJson(['data' => ['price' => 5.0, 'stock_quantity' => 30]]);

        // Quick status toggle to sold_out
        $statusRes = $this->authFarmer()->patchJson("/api/farmer/products/{$productId}/status", [
            'status' => 'sold_out',
        ]);
        $statusRes->assertStatus(200)
            ->assertJson(['data' => ['status' => 'sold_out']]);
        $this->assertDatabaseHas('products', ['id' => $productId, 'status' => 'sold_out']);

        // Delete
        $delRes = $this->authFarmer()->deleteJson("/api/farmer/products/{$productId}");
        $delRes->assertStatus(200);
        $this->assertDatabaseMissing('products', ['id' => $productId]);
    }

    public function test_farmer_cannot_modify_another_farmers_product(): void
    {
        $otherFarmer = User::create([
            'name' => 'Other Farmer',
            'email' => 'other@test.com',
            'password' => 'pwd',
            'role' => 'farmer',
        ]);

        $otherProduct = Product::create([
            'farmer_id' => $otherFarmer->id,
            'name' => 'Other Apples',
            'price' => 3.00,
            'unit' => 'lb',
            'stock_quantity' => 10,
        ]);

        // Farmer 1 attempts to update Farmer 2's product
        $updateRes = $this->authFarmer()->putJson("/api/farmer/products/{$otherProduct->id}", [
            'price' => 1.00,
        ]);
        $updateRes->assertStatus(404);

        // Farmer 1 attempts to delete Farmer 2's product
        $delRes = $this->authFarmer()->deleteJson("/api/farmer/products/{$otherProduct->id}");
        $delRes->assertStatus(404);
    }

    public function test_farmer_can_manage_and_apply_weekly_stock_template(): void
    {
        $p1 = Product::create([
            'farmer_id' => $this->farmer->id,
            'name' => 'Tomatoes',
            'price' => 4.00,
            'unit' => 'lb',
            'stock_quantity' => 2,
            'status' => 'available',
        ]);

        $p2 = Product::create([
            'farmer_id' => $this->farmer->id,
            'name' => 'Chard',
            'price' => 3.00,
            'unit' => 'bunch',
            'stock_quantity' => 0,
            'status' => 'sold_out',
        ]);

        // Save batch template for Saturday
        $batchRes = $this->authFarmer()->postJson('/api/farmer/stock-templates', [
            'day_of_week' => 'Saturday',
            'items' => [
                [
                    'product_id' => $p1->id,
                    'default_quantity' => 40,
                    'is_included' => true,
                ],
                [
                    'product_id' => $p2->id,
                    'default_quantity' => 20,
                    'is_included' => true,
                ],
            ],
        ]);
        $batchRes->assertStatus(200);
        $this->assertCount(2, $batchRes->json('data'));

        // Apply template
        $applyRes = $this->authFarmer()->postJson('/api/farmer/stock-templates/apply', [
            'day_of_week' => 'Saturday',
        ]);
        $applyRes->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'day_of_week' => 'Saturday',
                    'products_updated' => 2,
                ],
            ]);

        // Verify products stock updated in database
        $this->assertDatabaseHas('products', ['id' => $p1->id, 'stock_quantity' => 40, 'status' => 'available']);
        $this->assertDatabaseHas('products', ['id' => $p2->id, 'stock_quantity' => 20, 'status' => 'available']);
    }

    public function test_farmer_can_view_and_update_order_status(): void
    {
        $customer = User::create([
            'name' => 'Shopper Sam',
            'email' => 'sam@test.com',
            'password' => 'pwd',
            'role' => 'customer',
        ]);

        $market = Market::create(['market_name' => 'Market Place', 'address' => 'Central Sq']);

        $product = Product::create([
            'farmer_id' => $this->farmer->id,
            'name' => 'Organic Honey',
            'price' => 12.00,
            'unit' => 'jar',
            'stock_quantity' => 10,
        ]);

        $order = Order::create([
            'customer_id' => $customer->id,
            'farmer_id' => $this->farmer->id,
            'market_id' => $market->id,
            'total_amount' => 24.00,
            'order_status' => 'placed',
            'pickup_date' => now()->toDateString(),
            'pickup_time' => '9:30 AM',
            'notes' => 'Handle with care',
        ]);

        OrderItem::create([
            'order_id' => $order->id,
            'product_id' => $product->id,
            'quantity' => 2,
            'unit_price' => 12.00,
            'subtotal' => 24.00,
        ]);

        // List orders
        $listRes = $this->authFarmer()->getJson('/api/farmer/orders');
        $listRes->assertStatus(200);
        $this->assertCount(1, $listRes->json('data'));

        // View single order
        $viewRes = $this->authFarmer()->getJson("/api/farmer/orders/{$order->id}");
        $viewRes->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'customer_name' => 'Shopper Sam',
                    'order_status' => 'placed',
                ],
            ]);

        // Accept order
        $acceptRes = $this->authFarmer()->patchJson("/api/farmer/orders/{$order->id}/status", [
            'status' => 'accepted',
            'notes' => 'Box reserved in stall cooler.',
        ]);
        $acceptRes->assertStatus(200)
            ->assertJson(['data' => ['order_status' => 'accepted']]);
        $this->assertDatabaseHas('orders', ['id' => $order->id, 'order_status' => 'accepted']);

        // Mark ready for pickup
        $readyRes = $this->authFarmer()->patchJson("/api/farmer/orders/{$order->id}/status", [
            'status' => 'ready',
        ]);
        $readyRes->assertStatus(200)
            ->assertJson(['data' => ['order_status' => 'ready']]);

        // Complete order
        $compRes = $this->authFarmer()->patchJson("/api/farmer/orders/{$order->id}/status", [
            'status' => 'completed',
        ]);
        $compRes->assertStatus(200)
            ->assertJson(['data' => ['order_status' => 'completed']]);
    }

    public function test_farmer_can_view_insights_and_best_sellers(): void
    {
        $customer = User::create(['name' => 'Buyer', 'email' => 'buy@test.com', 'password' => 'pwd', 'role' => 'customer']);
        $product = Product::create([
            'farmer_id' => $this->farmer->id,
            'name' => 'Sweet Corn',
            'price' => 1.50,
            'unit' => 'ear',
            'stock_quantity' => 3, // Low stock <= 5
        ]);

        $order = Order::create([
            'customer_id' => $customer->id,
            'farmer_id' => $this->farmer->id,
            'total_amount' => 15.00,
            'order_status' => 'completed',
        ]);

        OrderItem::create([
            'order_id' => $order->id,
            'product_id' => $product->id,
            'quantity' => 10,
            'unit_price' => 1.50,
            'subtotal' => 15.00,
        ]);

        $response = $this->authFarmer()->getJson('/api/farmer/insights');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'total_orders' => 1,
                    'completed_orders' => 1,
                    'total_revenue' => 15.00,
                ],
            ]);

        $this->assertNotEmpty($response->json('data.best_sellers'));
        $this->assertEquals('Sweet Corn', $response->json('data.best_sellers.0.product_name'));
        $this->assertNotEmpty($response->json('data.stock_alerts'));
    }

    public function test_farmer_can_view_reviews_and_reply(): void
    {
        $customer = User::create(['name' => 'Reviewer', 'email' => 'rev@test.com', 'password' => 'pwd', 'role' => 'customer']);
        $product = Product::create([
            'farmer_id' => $this->farmer->id,
            'name' => 'Sweet Strawberries',
            'price' => 5.00,
            'unit' => 'pint',
            'stock_quantity' => 10,
        ]);

        $review = Review::create([
            'customer_id' => $customer->id,
            'farmer_id' => $this->farmer->id,
            'product_id' => $product->id,
            'rating' => 5,
            'comment' => 'Delicious strawberries, sweetest I have ever tasted!',
        ]);

        // List reviews
        $listRes = $this->authFarmer()->getJson('/api/farmer/reviews');
        $listRes->assertStatus(200);
        $this->assertCount(1, $listRes->json('data'));

        // Post reply
        $replyRes = $this->authFarmer()->postJson("/api/farmer/reviews/{$review->id}/reply", [
            'farmer_reply' => 'Thank you! We picked them this morning at sunrise.',
        ]);

        $replyRes->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'farmer_reply' => 'Thank you! We picked them this morning at sunrise.',
                ],
            ]);

        $this->assertDatabaseHas('reviews', [
            'id' => $review->id,
            'farmer_reply' => 'Thank you! We picked them this morning at sunrise.',
        ]);
    }

    public function test_customer_cannot_access_farmer_endpoints(): void
    {
        $customer = User::create([
            'name' => 'Shopper Only',
            'email' => 'shopper@test.com',
            'password' => 'pwd',
            'role' => 'customer',
        ]);
        $token = $customer->createToken('c')->plainTextToken;

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/farmer/insights');

        $response->assertStatus(403)
            ->assertJson(['success' => false]);
    }
}
