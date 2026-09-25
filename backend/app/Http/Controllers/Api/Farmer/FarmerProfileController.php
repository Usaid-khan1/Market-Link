<?php

namespace App\Http\Controllers\Api\Farmer;

use App\Http\Controllers\Controller;
use App\Http\Requests\Farmer\FarmerProfileUpdateRequest;
use App\Http\Resources\FarmerProfileResource;
use App\Http\Resources\UserResource;
use App\Models\FarmerProfile;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class FarmerProfileController extends Controller
{
    /**
     * Get authenticated farmer's profile and stall details.
     */
    public function show(Request $request): JsonResponse
    {
        $user = $request->user()->load('farmerProfile');

        return $this->success([
            'user' => new UserResource($user),
            'stall' => new FarmerProfileResource($user->farmerProfile),
        ], 'Farmer profile retrieved successfully');
    }

    /**
     * Update authenticated farmer's profile and stall configuration.
     */
    public function update(FarmerProfileUpdateRequest $request): JsonResponse
    {
        $user = $request->user();
        $validated = $request->validated();

        DB::transaction(function () use ($user, $validated) {
            // Update user table fields
            $userUpdates = [];
            if (isset($validated['phone'])) {
                $userUpdates['phone'] = $validated['phone'];
            }
            if (isset($validated['address'])) {
                $userUpdates['address'] = $validated['address'];
            }
            if (! empty($userUpdates)) {
                $user->update($userUpdates);
            }

            // Update or create farmer profile
            $profileData = array_filter([
                'stall_name' => $validated['stall_name'] ?? null,
                'contact_person' => $validated['contact_person'] ?? null,
                'operating_days' => $validated['operating_days'] ?? null,
                'market_ids' => $validated['market_ids'] ?? null,
                'pickup_time_start' => $validated['pickup_time_start'] ?? null,
                'pickup_time_end' => $validated['pickup_time_end'] ?? null,
                'cutoff_time' => $validated['cutoff_time'] ?? null,
                'pickup_slots' => $validated['pickup_slots'] ?? null,
                'address' => $validated['address'] ?? null,
                'bio' => $validated['bio'] ?? null,
                'latitude' => $validated['latitude'] ?? null,
                'longitude' => $validated['longitude'] ?? null,
            ], fn ($v) => ! is_null($v));

            $profile = FarmerProfile::firstOrNew(['user_id' => $user->id]);
            $profile->fill($profileData);
            if (! $profile->exists) {
                $profile->status = 'pending';
            }
            $profile->save();
        });

        $user->load('farmerProfile');

        return $this->success([
            'user' => new UserResource($user),
            'stall' => new FarmerProfileResource($user->farmerProfile),
        ], 'Stall and farmer profile updated successfully');
    }
}
