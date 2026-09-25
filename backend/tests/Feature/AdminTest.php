<?php

namespace Tests\Feature;

use App\Models\Announcement;
use App\Models\Category;
use App\Models\FarmerProfile;
use App\Models\Market;
use App\Models\Order;
use App\Models\Product;
use App\Models\Review;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AdminTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;
    private string $adminToken;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@test.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'status' => 'active',
        ]);

        $this->adminToken = $this->admin->createToken('admin')->plainTextToken;
    }

    private function authAdmin(): self
    {
        return $this->withHeader('Authorization', 'Bearer ' . $this->adminToken);
    }

    public function test_admin_dashboard_summary_returns_accurate_metrics(): void
    {
        // Create 2 farmers
        $farmer1 = User::create(['name' => 'F1', 'email' => 'f1@t.com', 'password' => 'pwd', 'role' => 'farmer']);
        FarmerProfile::create(['user_id' => $farmer1->id, 'stall_name' => 'Stall 1', 'status' => 'approved']);

        $farmer2 = User::create(['name' => 'F2', 'email' => 'f2@t.com', 'password' => 'pwd', 'role' => 'farmer']);
        FarmerProfile::create(['user_id' => $farmer2->id, 'stall_name' => 'Stall 2', 'status' => 'pending']);

        // Create 1 customer
        User::create(['name' => 'C1', 'email' => 'c1@t.com', 'password' => 'pwd', 'role' => 'customer', 'status' => 'active']);

        // Create market
        Market::create(['market_name' => 'Market A', 'address' => '123 St']);

        $response = $this->authAdmin()->getJson('/api/admin/dashboard/summary');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'total_farmers' => 2,
                    'approved_farmers' => 1,
                    'pending_farmers' => 1,
                    'total_customers' => 1,
                    'active_customers' => 1,
                    'total_markets' => 1,
                ],
            ]);
    }

    public function test_admin_reports_returns_orders_and_farmer_rankings(): void
    {
        $farmer = User::create(['name' => 'Top Farmer', 'email' => 'tf@t.com', 'password' => 'pwd', 'role' => 'farmer']);
        FarmerProfile::create(['user_id' => $farmer->id, 'stall_name' => 'Top Farm', 'status' => 'approved']);

        $customer = User::create(['name' => 'Buyer', 'email' => 'b@t.com', 'password' => 'pwd', 'role' => 'customer']);
        $market = Market::create(['market_name' => 'Main Market', 'address' => 'Road 1']);

        Order::create([
            'customer_id' => $customer->id,
            'farmer_id' => $farmer->id,
            'market_id' => $market->id,
            'total_amount' => 50.00,
            'order_status' => 'completed',
        ]);

        $response = $this->authAdmin()->getJson('/api/admin/reports');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'total_orders' => 1,
                    'total_revenue' => 50.00,
                ],
            ]);

        $this->assertNotEmpty($response->json('data.most_active_farmers'));
        $this->assertEquals('Top Farm', $response->json('data.most_active_farmers.0.stall_name'));
    }

    public function test_admin_can_list_and_filter_farmers(): void
    {
        $farmer1 = User::create(['name' => 'Approved Farmer', 'email' => 'af@t.com', 'password' => 'pwd', 'role' => 'farmer']);
        FarmerProfile::create(['user_id' => $farmer1->id, 'stall_name' => 'App Stall', 'status' => 'approved']);

        $farmer2 = User::create(['name' => 'Pending Farmer', 'email' => 'pf@t.com', 'password' => 'pwd', 'role' => 'farmer']);
        FarmerProfile::create(['user_id' => $farmer2->id, 'stall_name' => 'Pend Stall', 'status' => 'pending']);

        // All farmers
        $resAll = $this->authAdmin()->getJson('/api/admin/farmers');
        $resAll->assertStatus(200);
        $this->assertCount(2, $resAll->json('data'));

        // Filter by status=pending
        $resPending = $this->authAdmin()->getJson('/api/admin/farmers?status=pending');
        $resPending->assertStatus(200);
        $this->assertCount(1, $resPending->json('data'));
        $this->assertEquals('Pending Farmer', $resPending->json('data.0.name'));
    }

    public function test_admin_can_view_farmer_details_and_update_status(): void
    {
        $farmer = User::create(['name' => 'John', 'email' => 'j@t.com', 'password' => 'pwd', 'role' => 'farmer', 'status' => 'active']);
        $profile = FarmerProfile::create(['user_id' => $farmer->id, 'stall_name' => 'John Stall', 'status' => 'pending']);

        // View
        $viewRes = $this->authAdmin()->getJson("/api/admin/farmers/{$farmer->id}");
        $viewRes->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'user' => [
                        'name' => 'John',
                        'farmer_profile' => ['stall_name' => 'John Stall'],
                    ],
                ],
            ]);

        // Approve
        $approveRes = $this->authAdmin()->patchJson("/api/admin/farmers/{$farmer->id}/status", [
            'status' => 'approved',
        ]);
        $approveRes->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'farmer_profile' => ['status' => 'approved'],
                ],
            ]);
        $this->assertDatabaseHas('farmer_profiles', ['user_id' => $farmer->id, 'status' => 'approved']);

        // Suspend
        $suspendRes = $this->authAdmin()->patchJson("/api/admin/farmers/{$farmer->id}/status", [
            'status' => 'suspended',
        ]);
        $suspendRes->assertStatus(200);
        $this->assertDatabaseHas('farmer_profiles', ['user_id' => $farmer->id, 'status' => 'suspended']);
        $this->assertDatabaseHas('users', ['id' => $farmer->id, 'status' => 'suspended']);
    }

    public function test_admin_can_list_view_and_update_customer_status(): void
    {
        $customer = User::create([
            'name' => 'Jane Customer',
            'email' => 'jane@t.com',
            'password' => 'pwd',
            'role' => 'customer',
            'status' => 'active',
        ]);

        // List
        $listRes = $this->authAdmin()->getJson('/api/admin/customers');
        $listRes->assertStatus(200);
        $this->assertCount(1, $listRes->json('data'));

        // View
        $viewRes = $this->authAdmin()->getJson("/api/admin/customers/{$customer->id}");
        $viewRes->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'user' => ['name' => 'Jane Customer'],
                ],
            ]);

        // Deactivate/Suspend
        $suspendRes = $this->authAdmin()->patchJson("/api/admin/customers/{$customer->id}/status", [
            'status' => 'suspended',
        ]);
        $suspendRes->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => ['status' => 'suspended'],
            ]);
        $this->assertDatabaseHas('users', ['id' => $customer->id, 'status' => 'suspended']);
    }

    public function test_admin_can_crud_markets(): void
    {
        // Create
        $createRes = $this->authAdmin()->postJson('/api/admin/markets', [
            'market_name' => 'Sunset Valley Market',
            'address' => '789 Sunset Blvd',
            'latitude' => 37.77,
            'longitude' => -122.42,
            'operating_days' => ['Saturday', 'Sunday'],
            'timings' => '9 AM - 2 PM',
            'map_provider' => 'OpenStreetMap',
        ]);
        $createRes->assertStatus(201)
            ->assertJson([
                'success' => true,
                'data' => ['market_name' => 'Sunset Valley Market'],
            ]);
        $marketId = $createRes->json('data.id');

        // Read
        $getRes = $this->authAdmin()->getJson("/api/admin/markets/{$marketId}");
        $getRes->assertStatus(200)
            ->assertJson(['data' => ['market_name' => 'Sunset Valley Market']]);

        // Update
        $updateRes = $this->authAdmin()->putJson("/api/admin/markets/{$marketId}", [
            'market_name' => 'Sunset Valley Farmers Market (Updated)',
        ]);
        $updateRes->assertStatus(200)
            ->assertJson(['data' => ['market_name' => 'Sunset Valley Farmers Market (Updated)']]);

        // Delete
        $deleteRes = $this->authAdmin()->deleteJson("/api/admin/markets/{$marketId}");
        $deleteRes->assertStatus(200);
        $this->assertDatabaseMissing('markets', ['id' => $marketId]);
    }

    public function test_admin_can_crud_categories(): void
    {
        // Create
        $createRes = $this->authAdmin()->postJson('/api/admin/categories', [
            'name' => 'Microgreens & Shoots',
            'description' => 'Nutrient-rich sprouts and baby greens.',
            'icon' => 'spa',
            'is_active' => true,
        ]);
        $createRes->assertStatus(201)
            ->assertJson([
                'success' => true,
                'data' => [
                    'name' => 'Microgreens & Shoots',
                    'slug' => 'microgreens-shoots',
                ],
            ]);
        $categoryId = $createRes->json('data.id');

        // Read
        $getRes = $this->authAdmin()->getJson("/api/admin/categories/{$categoryId}");
        $getRes->assertStatus(200);

        // Update
        $updateRes = $this->authAdmin()->putJson("/api/admin/categories/{$categoryId}", [
            'name' => 'Microgreens and Herbs',
        ]);
        $updateRes->assertStatus(200)
            ->assertJson(['data' => ['name' => 'Microgreens and Herbs']]);

        // Delete
        $deleteRes = $this->authAdmin()->deleteJson("/api/admin/categories/{$categoryId}");
        $deleteRes->assertStatus(200);
        $this->assertDatabaseMissing('categories', ['id' => $categoryId]);
    }

    public function test_admin_can_moderate_products_and_reviews(): void
    {
        $farmer = User::create(['name' => 'F', 'email' => 'f@t.com', 'password' => 'pwd', 'role' => 'farmer']);
        $customer = User::create(['name' => 'C', 'email' => 'c@t.com', 'password' => 'pwd', 'role' => 'customer']);

        $product = Product::create([
            'farmer_id' => $farmer->id,
            'name' => 'Inappropriate Listing',
            'price' => 10.00,
            'unit' => 'item',
            'stock_quantity' => 5,
        ]);

        $review = Review::create([
            'customer_id' => $customer->id,
            'farmer_id' => $farmer->id,
            'product_id' => $product->id,
            'rating' => 1,
            'comment' => 'Spam abusive text',
        ]);

        // Moderation list products
        $prodList = $this->authAdmin()->getJson('/api/admin/moderation/products');
        $prodList->assertStatus(200);
        $this->assertCount(1, $prodList->json('data'));

        // Moderation delete product
        $prodDel = $this->authAdmin()->deleteJson("/api/admin/moderation/products/{$product->id}");
        $prodDel->assertStatus(200);
        $this->assertDatabaseMissing('products', ['id' => $product->id]);

        // Moderation list reviews
        $revList = $this->authAdmin()->getJson('/api/admin/moderation/reviews');
        $revList->assertStatus(200);
        $this->assertCount(1, $revList->json('data'));

        // Moderation delete review
        $revDel = $this->authAdmin()->deleteJson("/api/admin/moderation/reviews/{$review->id}");
        $revDel->assertStatus(200);
        $this->assertDatabaseMissing('reviews', ['id' => $review->id]);
    }

    public function test_announcements_crud_and_public_visibility(): void
    {
        // Admin creates announcement
        $createRes = $this->authAdmin()->postJson('/api/admin/announcements', [
            'title' => 'Important Harvest Notice',
            'content' => 'Please arrive early this weekend.',
            'audience' => 'All Community',
            'type' => 'Advisory',
            'is_active' => true,
        ]);
        $createRes->assertStatus(201);
        $announcementId = $createRes->json('data.id');

        // Customer reads public announcements without admin token
        $publicRes = $this->getJson('/api/announcements');
        $publicRes->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);
        $this->assertCount(1, $publicRes->json('data'));

        // Admin updates announcement
        $updateRes = $this->authAdmin()->putJson("/api/admin/announcements/{$announcementId}", [
            'title' => 'Updated Harvest Notice',
        ]);
        $updateRes->assertStatus(200)
            ->assertJson(['data' => ['title' => 'Updated Harvest Notice']]);

        // Admin deletes announcement
        $delRes = $this->authAdmin()->deleteJson("/api/admin/announcements/{$announcementId}");
        $delRes->assertStatus(200);
        $this->assertDatabaseMissing('announcements', ['id' => $announcementId]);
    }

    public function test_customer_cannot_access_admin_endpoints(): void
    {
        $customer = User::create([
            'name' => 'Reg Customer',
            'email' => 'rc@t.com',
            'password' => 'pwd',
            'role' => 'customer',
            'status' => 'active',
        ]);
        $token = $customer->createToken('c_token')->plainTextToken;

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/admin/dashboard/summary');

        $response->assertStatus(403)
            ->assertJson(['success' => false]);
    }
}
