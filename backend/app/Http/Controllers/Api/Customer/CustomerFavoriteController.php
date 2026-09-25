<?php

namespace App\Http\Controllers\Api\Customer;

use App\Http\Controllers\Controller;
use App\Http\Requests\Customer\FavoriteToggleRequest;
use App\Http\Resources\FavoriteResource;
use App\Models\Favorite;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CustomerFavoriteController extends Controller
{
    /**
     * List customer favorites, optionally filtered by type.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Favorite::where('customer_id', $request->user()->id)->latest();

        if ($request->filled('type')) {
            $query->where('type', $request->query('type'));
        }

        $favorites = $query->get();

        return $this->success(FavoriteResource::collection($favorites), 'Favorites retrieved successfully');
    }

    /**
     * Toggle favorite status for a farmer or product.
     */
    public function toggle(FavoriteToggleRequest $request): JsonResponse
    {
        $customerId = $request->user()->id;
        $type = $request->type;
        $targetId = $request->target_id;

        if ($type === 'farmer') {
            $farmer = User::where('id', $targetId)->where('role', 'farmer')->first();
            if (! $farmer) {
                return $this->error('Farmer not found.', null, 404);
            }
        } elseif ($type === 'product') {
            $product = Product::find($targetId);
            if (! $product) {
                return $this->error('Product not found.', null, 404);
            }
        }

        $existing = Favorite::where('customer_id', $customerId)
            ->where('type', $type)
            ->where('target_id', $targetId)
            ->first();

        if ($existing) {
            $existing->delete();

            return $this->success([
                'is_favorite' => false,
                'type' => $type,
                'target_id' => $targetId,
            ], 'Removed from favorites');
        }

        $favorite = Favorite::create([
            'customer_id' => $customerId,
            'type' => $type,
            'target_id' => $targetId,
        ]);

        return $this->success([
            'is_favorite' => true,
            'favorite' => new FavoriteResource($favorite),
        ], 'Added to favorites', 201);
    }
}
