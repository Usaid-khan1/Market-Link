<?php

namespace App\Http\Controllers\Api\Customer;

use App\Http\Controllers\Controller;
use App\Http\Resources\MarketResource;
use App\Http\Resources\ProductResource;
use App\Http\Resources\ReviewResource;
use App\Http\Resources\UserResource;
use App\Models\Market;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CustomerBrowseController extends Controller
{
    /**
     * Browse markets with optional day/location search.
     */
    public function markets(Request $request): JsonResponse
    {
        $query = Market::query();

        if ($request->filled('search')) {
            $search = $request->query('search');
            $query->where(function ($q) use ($search) {
                $q->where('market_name', 'like', "%{$search}%")
                    ->orWhere('address', 'like', "%{$search}%");
            });
        }

        if ($request->filled('day')) {
            $day = strtolower($request->query('day'));
            $query->where('operating_days', 'like', "%{$day}%");
        }

        $markets = $query->get()->map(function ($market) {
            // Find approved farmers who operate at this market
            $farmers = User::where('role', 'farmer')
                ->whereHas('farmerProfile', function ($q) use ($market) {
                    $q->where('status', 'approved')
                        ->where(function ($sq) use ($market) {
                            $sq->whereJsonContains('market_ids', $market->id)
                                ->orWhere('address', 'like', "%{$market->market_name}%");
                        });
                })
                ->with('farmerProfile')
                ->get();

            $marketData = (new MarketResource($market))->resolve();
            $marketData['farmers_count'] = $farmers->count();
            $marketData['farmers'] = UserResource::collection($farmers);

            return $marketData;
        });

        return $this->success($markets, 'Markets retrieved successfully');
    }

    /**
     * View market details and the list of farmers present.
     */
    public function marketShow(int $id): JsonResponse
    {
        $market = Market::findOrFail($id);

        $farmers = User::where('role', 'farmer')
            ->whereHas('farmerProfile', function ($q) use ($market) {
                $q->where('status', 'approved')
                    ->where(function ($sq) use ($market) {
                        $sq->whereJsonContains('market_ids', $market->id)
                            ->orWhere('address', 'like', "%{$market->market_name}%");
                    });
            })
            ->with(['farmerProfile', 'products' => fn ($q) => $q->where('status', 'available')])
            ->get();

        $data = (new MarketResource($market))->resolve();
        $data['farmers'] = UserResource::collection($farmers);

        return $this->success($data, 'Market details retrieved successfully');
    }

    /**
     * Browse/search/filter products.
     */
    public function products(Request $request): JsonResponse
    {
        $query = Product::whereHas('farmer.farmerProfile', fn ($q) => $q->where('status', 'approved'))
            ->with(['farmer.farmerProfile', 'category', 'market'])
            ->withAvg('reviews', 'rating')
            ->withCount('reviews');

        if ($request->filled('search')) {
            $search = $request->query('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhereHas('farmer', fn ($f) => $f->where('name', 'like', "%{$search}%"));
            });
        }

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->query('category_id'));
        }

        if ($request->filled('market_id')) {
            $query->where('market_id', $request->query('market_id'));
        }

        if ($request->filled('min_price')) {
            $query->where('price', '>=', $request->query('min_price'));
        }

        if ($request->filled('max_price')) {
            $query->where('price', '<=', $request->query('max_price'));
        }

        if ($request->filled('status')) {
            $query->where('status', $request->query('status'));
        }

        if ($request->filled('day')) {
            $day = strtolower($request->query('day'));
            $query->whereHas('farmer.farmerProfile', fn ($q) => $q->where('operating_days', 'like', "%{$day}%"));
        }

        $products = $query->latest()->get();

        return $this->success(ProductResource::collection($products), 'Products retrieved successfully');
    }

    /**
     * View detailed product information with reviews.
     */
    public function productShow(int $id): JsonResponse
    {
        $product = Product::with(['farmer.farmerProfile', 'category', 'market', 'reviews.customer'])
            ->withAvg('reviews', 'rating')
            ->withCount('reviews')
            ->findOrFail($id);

        $data = (new ProductResource($product))->resolve();
        $data['reviews'] = ReviewResource::collection($product->reviews);

        return $this->success($data, 'Product details retrieved successfully');
    }

    /**
     * Public/Customer view of farmer profile and current products.
     */
    public function farmerShow(int $id): JsonResponse
    {
        $farmer = User::where('role', 'farmer')
            ->whereHas('farmerProfile', fn ($q) => $q->where('status', 'approved'))
            ->with(['farmerProfile', 'products' => fn ($q) => $q->where('status', 'available')->with('category'), 'reviewsReceived.customer'])
            ->findOrFail($id);

        $avgRating = (float) $farmer->reviewsReceived()->avg('rating');
        $totalReviews = $farmer->reviewsReceived()->count();

        $data = (new UserResource($farmer))->resolve();
        $data['rating_avg'] = round($avgRating, 2);
        $data['reviews_count'] = $totalReviews;
        $data['products'] = ProductResource::collection($farmer->products);
        $data['reviews'] = ReviewResource::collection($farmer->reviewsReceived);

        return $this->success($data, 'Farmer profile retrieved successfully');
    }

    /**
     * Public/Customer list of all active farmer stalls with coordinates and available products.
     */
    public function stalls(Request $request): JsonResponse
    {
        $farmers = User::where('role', 'farmer')
            ->whereHas('farmerProfile', fn ($q) => $q->where('status', 'approved')->whereNotNull('latitude')->whereNotNull('longitude'))
            ->with([
                'farmerProfile',
                'products' => fn ($q) => $q->where('status', 'available')->with(['category', 'market']),
                'reviewsReceived'
            ])
            ->get();

        $stalls = $farmers->map(function ($farmer) {
            $profile = $farmer->farmerProfile;
            $products = $farmer->products;
            $avgRating = (float) $farmer->reviewsReceived()->avg('rating');
            $reviewsCount = $farmer->reviewsReceived()->count();

            // Associated market
            $market = $products->first()?->market;

            return [
                'id' => $profile->id,
                'farmer_id' => $farmer->id,
                'farmer_name' => $farmer->name,
                'stall_name' => $profile->stall_name,
                'contact_person' => $profile->contact_person,
                'address' => $profile->address,
                'latitude' => (float) $profile->latitude,
                'longitude' => (float) $profile->longitude,
                'operating_days' => $profile->operating_days,
                'pickup_time_start' => $profile->pickup_time_start,
                'pickup_time_end' => $profile->pickup_time_end,
                'market_name' => $market ? $market->market_name : null,
                'market_id' => $market ? $market->id : null,
                'rating' => $avgRating ? round($avgRating, 1) : 4.9,
                'reviews_count' => $reviewsCount,
                'total_stock' => (int) $products->sum('stock_quantity'),
                'products' => ProductResource::collection($products)->resolve(),
            ];
        });

        return $this->success($stalls, 'Farmer stalls retrieved successfully');
    }
}
