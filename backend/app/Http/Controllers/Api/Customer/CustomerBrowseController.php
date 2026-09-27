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
            // Find approved/active farmers who operate at this market
            $farmers = User::where('role', 'farmer')
                ->whereHas('farmerProfile', function ($q) use ($market) {
                    $q->whereIn('status', ['approved', 'active', 'pending'])
                        ->where(function ($sq) use ($market) {
                            $sq->whereJsonContains('market_ids', (int) $market->id)
                                ->orWhereJsonContains('market_ids', (string) $market->id)
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
                $q->whereIn('status', ['approved', 'active', 'pending'])
                    ->where(function ($sq) use ($market) {
                        $sq->whereJsonContains('market_ids', (int) $market->id)
                            ->orWhereJsonContains('market_ids', (string) $market->id)
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
        $query = Product::whereHas('farmer', fn ($q) => $q->where('status', '!=', 'suspended'))
            ->where(function ($q) {
                $q->whereDoesntHave('farmer.farmerProfile')
                  ->orWhereHas('farmer.farmerProfile', fn ($fp) => $fp->where('status', '!=', 'rejected'));
            })
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
     * Public list of approved/active farmers/growers.
     */
    public function farmers(Request $request): JsonResponse
    {
        $query = User::where('role', 'farmer')
            ->where(function ($q) {
                $q->whereDoesntHave('farmerProfile')
                  ->orWhereHas('farmerProfile', fn ($fp) => $fp->where('status', '!=', 'rejected'));
            })
            ->with(['farmerProfile', 'products' => fn ($q) => $q->where('status', 'available'), 'reviewsReceived']);

        if ($request->filled('search')) {
            $search = $request->query('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhereHas('farmerProfile', fn ($fp) => $fp->where('farm_name', 'like', "%{$search}%"));
            });
        }

        $farmers = $query->get()->map(function ($farmer) {
            $profile = $farmer->farmerProfile;
            $avgRating = (float) $farmer->reviewsReceived()->avg('rating');
            $reviewsCount = $farmer->reviewsReceived()->count();

            return [
                'id' => $farmer->id,
                'name' => $farmer->name,
                'farm' => $profile?->farm_name ?: ($farmer->name . ' Organic Farm'),
                'bio' => $profile?->bio ?: 'Certified sustainable grower specializing in heirloom produce and direct farm pickups.',
                'image' => $farmer->avatar ?: 'https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?auto=format&fit=crop&w=400&q=80',
                'rating' => $avgRating > 0 ? round($avgRating, 1) : 5.0,
                'reviews_count' => $reviewsCount,
                'pickups' => $reviewsCount > 0 ? "{$reviewsCount} reviews" : 'New Grower',
                'quote' => $profile?->bio ?: 'Cultivating heirloom varieties using traditional, regenerative farming practices.',
                'specialty' => $profile?->specialty ?: 'Organic Heritage Harvests',
                'operating_days' => $profile?->operating_days ?: ['Saturday'],
                'market_name' => $profile?->city ?: 'Regional Market Pavilion',
                'products_count' => $farmer->products->count(),
            ];
        });

        return $this->success($farmers, 'Farmers retrieved successfully');
    }

    /**
     * Public/Customer view of farmer profile and current products.
     */
    public function farmerShow(int $id): JsonResponse
    {
        $farmer = User::where('role', 'farmer')
            ->where(function ($q) {
                $q->whereDoesntHave('farmerProfile')
                  ->orWhereHas('farmerProfile', fn ($fp) => $fp->where('status', '!=', 'rejected'));
            })
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
            ->whereHas('farmerProfile', fn ($q) => $q->whereIn('status', ['approved', 'active', 'pending'])->whereNotNull('latitude')->whereNotNull('longitude'))
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

            // Associated market chosen by farmer or from products
            $chosenMarketId = (!empty($profile->market_ids) && is_array($profile->market_ids) && count($profile->market_ids) > 0)
                ? $profile->market_ids[0]
                : null;
            $market = ($chosenMarketId ? \App\Models\Market::find($chosenMarketId) : null) ?: $products->first()?->market;

            return [
                'id' => $profile->id,
                'farmer_id' => $farmer->id,
                'farmer_name' => $farmer->name,
                'stall_name' => $profile->stall_name ?: ($farmer->name . "'s Farm Stand"),
                'stall_number' => $profile->stall_number ?: ($profile->stall_name . ' Booth'),
                'contact_person' => $profile->contact_person ?: $farmer->name,
                'address' => $profile->address ?: ($market ? $market->address : 'Farmers Market Plaza'),
                'latitude' => (float) $profile->latitude,
                'longitude' => (float) $profile->longitude,
                'operating_days' => $profile->operating_days ?: ($market ? $market->operating_days : ['Saturday', 'Sunday']),
                'pickup_time_start' => $profile->pickup_time_start ?: '08:00 AM',
                'pickup_time_end' => $profile->pickup_time_end ?: '02:00 PM',
                'market_name' => $market ? $market->market_name : 'Market Plaza Stall',
                'market_id' => $market ? $market->id : 1,
                'rating' => $avgRating ? round($avgRating, 1) : 5.0,
                'reviews_count' => $reviewsCount,
                'total_stock' => (int) $products->sum('stock_quantity'),
                'products' => ProductResource::collection($products)->resolve(),
            ];
        });

        return $this->success($stalls, 'Farmer stalls retrieved successfully');
    }
}
