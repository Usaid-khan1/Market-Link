<?php

namespace Tests\Feature;

use App\Models\FarmerProfile;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_customer_can_register_successfully(): void
    {
        $payload = [
            'name' => 'Jane Doe',
            'email' => 'jane@example.com',
            'password' => 'secret123',
            'role' => 'customer',
            'phone' => '1234567890',
            'address' => '123 Green St',
        ];

        $response = $this->postJson('/api/register', $payload);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'message' => 'Registration successful',
                'data' => [
                    'role' => 'customer',
                    'token_type' => 'Bearer',
                    'user' => [
                        'name' => 'Jane Doe',
                        'email' => 'jane@example.com',
                        'role' => 'customer',
                    ],
                ],
            ]);

        $this->assertDatabaseHas('users', [
            'email' => 'jane@example.com',
            'role' => 'customer',
            'status' => 'active',
        ]);
    }

    public function test_farmer_can_register_with_stall_profile(): void
    {
        $payload = [
            'name' => 'Farmer Bob',
            'email' => 'bob@farm.com',
            'password' => 'secret123',
            'role' => 'farmer',
            'phone' => '9876543210',
            'address' => 'Farmville Road 5',
            'stall_name' => "Bob's Organic Berries",
            'operating_days' => ['Saturday', 'Sunday'],
            'pickup_time_start' => '08:00',
            'pickup_time_end' => '13:00',
        ];

        $response = $this->postJson('/api/register', $payload);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'data' => [
                    'role' => 'farmer',
                    'user' => [
                        'name' => 'Farmer Bob',
                        'role' => 'farmer',
                        'farmer_profile' => [
                            'stall_name' => "Bob's Organic Berries",
                        ],
                    ],
                ],
            ]);

        $this->assertDatabaseHas('users', [
            'email' => 'bob@farm.com',
            'role' => 'farmer',
        ]);

        $this->assertDatabaseHas('farmer_profiles', [
            'stall_name' => "Bob's Organic Berries",
            'status' => 'pending',
        ]);
    }

    public function test_registration_validation_fails_for_invalid_input(): void
    {
        $response = $this->postJson('/api/register', [
            'name' => '',
            'email' => 'not-an-email',
            'password' => '123',
            'role' => 'invalid_role',
        ]);

        $response->assertStatus(422)
            ->assertJson([
                'success' => false,
            ])
            ->assertJsonStructure([
                'success',
                'message',
                'data' => ['name', 'email', 'password', 'role'],
            ]);
    }

    public function test_user_can_login_with_valid_credentials(): void
    {
        $user = User::create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => Hash::make('password123'),
            'role' => 'customer',
            'status' => 'active',
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'test@example.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Login successful',
                'data' => [
                    'role' => 'customer',
                    'token_type' => 'Bearer',
                    'user' => [
                        'email' => 'test@example.com',
                    ],
                ],
            ]);

        $this->assertNotEmpty($response->json('data.token'));
    }

    public function test_user_cannot_login_with_invalid_password(): void
    {
        User::create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => Hash::make('password123'),
            'role' => 'customer',
            'status' => 'active',
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'test@example.com',
            'password' => 'wrongpassword',
        ]);

        $response->assertStatus(401)
            ->assertJson([
                'success' => false,
                'message' => 'Invalid email or password.',
            ]);
    }

    public function test_suspended_user_cannot_login(): void
    {
        User::create([
            'name' => 'Suspended User',
            'email' => 'suspended@example.com',
            'password' => Hash::make('password123'),
            'role' => 'customer',
            'status' => 'suspended',
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'suspended@example.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(403)
            ->assertJson([
                'success' => false,
                'message' => 'Your account has been suspended. Please contact administrator.',
            ]);
    }

    public function test_authenticated_user_can_fetch_profile_and_logout(): void
    {
        $user = User::create([
            'name' => 'Me User',
            'email' => 'me@example.com',
            'password' => Hash::make('password123'),
            'role' => 'customer',
            'status' => 'active',
        ]);

        $token = $user->createToken('test_token')->plainTextToken;

        // Fetch /me
        $meResponse = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/me');

        $meResponse->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'role' => 'customer',
                    'user' => [
                        'email' => 'me@example.com',
                    ],
                ],
            ]);

        // Logout
        $logoutResponse = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/logout');

        $logoutResponse->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Logged out successfully',
            ]);

        // Token should be deleted
        $this->assertDatabaseMissing('personal_access_tokens', [
            'tokenable_id' => $user->id,
        ]);
    }

    public function test_unauthenticated_request_is_rejected(): void
    {
        $response = $this->getJson('/api/me');

        $response->assertStatus(401)
            ->assertJson([
                'success' => false,
                'message' => 'Unauthenticated.',
            ]);
    }

    public function test_admin_can_access_admin_route(): void
    {
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@test.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'status' => 'active',
        ]);
        $token = $admin->createToken('admin')->plainTextToken;

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/admin/ping');

        $response->assertStatus(200)
            ->assertJson(['success' => true]);
    }

    public function test_farmer_cannot_access_admin_route(): void
    {
        $farmer = User::create([
            'name' => 'Farmer User',
            'email' => 'farmer@test.com',
            'password' => Hash::make('password'),
            'role' => 'farmer',
            'status' => 'active',
        ]);
        $token = $farmer->createToken('farmer')->plainTextToken;

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/admin/ping');

        $response->assertStatus(403)
            ->assertJson(['success' => false]);
    }

    public function test_farmer_can_access_farmer_route(): void
    {
        $farmer = User::create([
            'name' => 'Farmer User',
            'email' => 'farmer@test.com',
            'password' => Hash::make('password'),
            'role' => 'farmer',
            'status' => 'active',
        ]);
        $token = $farmer->createToken('farmer')->plainTextToken;

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/farmer/ping');

        $response->assertStatus(200)
            ->assertJson(['success' => true]);
    }

    public function test_customer_cannot_access_farmer_route(): void
    {
        $customer = User::create([
            'name' => 'Customer User',
            'email' => 'customer@test.com',
            'password' => Hash::make('password'),
            'role' => 'customer',
            'status' => 'active',
        ]);
        $token = $customer->createToken('customer')->plainTextToken;

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/farmer/ping');

        $response->assertStatus(403)
            ->assertJson(['success' => false]);
    }

    public function test_customer_can_access_customer_route(): void
    {
        $customer = User::create([
            'name' => 'Customer User',
            'email' => 'customer@test.com',
            'password' => Hash::make('password'),
            'role' => 'customer',
            'status' => 'active',
        ]);
        $token = $customer->createToken('customer')->plainTextToken;

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/customer/ping');

        $response->assertStatus(200)
            ->assertJson(['success' => true]);
    }

    public function test_admin_cannot_access_customer_route(): void
    {
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@test.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'status' => 'active',
        ]);
        $token = $admin->createToken('admin')->plainTextToken;

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/customer/ping');

        $response->assertStatus(403)
            ->assertJson(['success' => false]);
    }

    public function test_farmer_cannot_access_customer_route(): void
    {
        $farmer = User::create([
            'name' => 'Farmer User',
            'email' => 'farmer@test.com',
            'password' => Hash::make('password'),
            'role' => 'farmer',
            'status' => 'active',
        ]);
        $token = $farmer->createToken('farmer')->plainTextToken;

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/customer/ping');

        $response->assertStatus(403)
            ->assertJson(['success' => false]);
    }

    public function test_customer_cannot_access_admin_route(): void
    {
        $customer = User::create([
            'name' => 'Customer User',
            'email' => 'customer@test.com',
            'password' => Hash::make('password'),
            'role' => 'customer',
            'status' => 'active',
        ]);
        $token = $customer->createToken('customer')->plainTextToken;

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/admin/ping');

        $response->assertStatus(403)
            ->assertJson(['success' => false]);
    }
}
