<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Models\FarmerProfile;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    /**
     * Handle user registration.
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $user = DB::transaction(function () use ($validated) {
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'role' => $validated['role'],
                'phone' => $validated['phone'] ?? null,
                'address' => $validated['address'] ?? null,
                'status' => 'active',
            ]);

            if ($validated['role'] === 'farmer') {
                FarmerProfile::create([
                    'user_id' => $user->id,
                    'stall_name' => $validated['stall_name'],
                    'contact_person' => $validated['contact_person'] ?? $validated['name'],
                    'operating_days' => $validated['operating_days'] ?? [],
                    'pickup_time_start' => $validated['pickup_time_start'] ?? null,
                    'pickup_time_end' => $validated['pickup_time_end'] ?? null,
                    'address' => $validated['address'] ?? null,
                    'latitude' => $validated['latitude'] ?? null,
                    'longitude' => $validated['longitude'] ?? null,
                    'status' => 'pending',
                ]);
            }

            return $user;
        });

        if ($user->role === 'farmer') {
            $user->load('farmerProfile');
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return $this->success([
            'user' => new UserResource($user),
            'role' => $user->role,
            'token' => $token,
            'token_type' => 'Bearer',
        ], 'Registration successful', 201);
    }

    /**
     * Handle user login.
     */
    public function login(LoginRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $user = User::where('email', $validated['email'])->first();

        if (! $user || ! Hash::check($validated['password'], $user->password)) {
            return $this->error('Invalid email or password.', null, 401);
        }

        if ($user->status === 'suspended') {
            return $this->error('Your account has been suspended. Please contact administrator.', null, 403);
        }

        if ($user->role === 'farmer') {
            $user->load('farmerProfile');
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return $this->success([
            'user' => new UserResource($user),
            'role' => $user->role,
            'token' => $token,
            'token_type' => 'Bearer',
        ], 'Login successful');
    }

    /**
     * Handle user logout.
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return $this->success(null, 'Logged out successfully');
    }

    /**
     * Return authenticated user and role.
     */
    public function me(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user->role === 'farmer') {
            $user->load('farmerProfile');
        }

        return $this->success([
            'user' => new UserResource($user),
            'role' => $user->role,
        ], 'Profile retrieved successfully');
    }
}
