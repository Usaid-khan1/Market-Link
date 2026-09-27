<?php

namespace App\Http\Controllers\Api\Customer;

use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use App\Http\Resources\ProductResource;
use App\Models\Favorite;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CustomerDashboardController extends Controller
{
    /**
     * Get aggregated customer dashboard summary.
     */
    public function summary(Request $request): JsonResponse
    {
        $customerId = $request->user()->id;

        // Order metrics
        $activeOrdersCount = Order::where('customer_id', $customerId)
            ->whereIn('order_status', ['placed', 'accepted', 'ready'])
            ->count();

        $completedPickupsCount = Order::where('customer_id', $customerId)
            ->where('order_status', 'completed')
            ->count();

        // Saved favorites count
        $savedFavoritesCount = Favorite::where('customer_id', $customerId)->count();

        // Ready / earliest active order for digital pass QR card
        $readyOrder = Order::where('customer_id', $customerId)
            ->whereIn('order_status', ['ready', 'accepted', 'placed'])
            ->with(['farmer.farmerProfile', 'market', 'items.product'])
            ->orderByRaw("FIELD(order_status, 'ready', 'accepted', 'placed') ASC")
            ->orderBy('pickup_date', 'asc')
            ->first();

        // Recent orders
        $recentOrders = Order::where('customer_id', $customerId)
            ->with(['farmer.farmerProfile', 'market', 'items.product'])
            ->latest()
            ->take(5)
            ->get();

        // Customer's favorite farmers
        $favoriteFarmerIds = Favorite::where('customer_id', $customerId)
            ->where('type', 'farmer')
            ->pluck('target_id');

        $favoriteFarmers = User::whereIn('id', $favoriteFarmerIds)
            ->where('role', 'farmer')
            ->with('farmerProfile')
            ->get()
            ->map(function ($farmer) {
                return [
                    'id' => $farmer->id,
                    'name' => $farmer->farmerProfile?->stall_name ?? $farmer->name,
                    'market' => $farmer->farmerProfile?->address ?? 'Local Pavilion',
                    'rating' => round((float) $farmer->reviewsReceived()->avg('rating') ?: 5.0, 2),
                    'reviewCount' => $farmer->reviewsReceived()->count(),
                    'harvest' => $farmer->products()->pluck('name')->take(2)->join(', ') ?: 'Fresh Produce',
                ];
            });

        // Recommended seasonal products (available, in stock)
        $recommendedProducts = Product::where('status', 'available')
            ->where('stock_quantity', '>', 0)
            ->with(['farmer.farmerProfile', 'category'])
            ->inRandomOrder()
            ->take(4)
            ->get()
            ->map(function ($prod) {
                return [
                    'id' => $prod->id,
                    'name' => $prod->name,
                    'farmer' => $prod->farmer?->farmerProfile?->stall_name ?? $prod->farmer?->name ?? 'Local Farm',
                    'price' => '$' . number_format((float) $prod->price, 2),
                    'unit' => '/ ' . $prod->unit,
                    'image' => $prod->image ?: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=400&q=80',
                    'badge' => $prod->category?->name ?? 'Seasonal Fresh',
                ];
            });

        return $this->success([
            'active_orders_count' => $activeOrdersCount,
            'completed_pickups_count' => $completedPickupsCount,
            'saved_favorites_count' => $savedFavoritesCount,
            'ready_order' => $readyOrder ? new OrderResource($readyOrder) : null,
            'recent_orders' => OrderResource::collection($recentOrders),
            'favorite_farmers' => $favoriteFarmers,
            'recommended_products' => $recommendedProducts,
        ], 'Customer dashboard summary retrieved successfully');
    }
}
