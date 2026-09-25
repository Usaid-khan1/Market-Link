<?php

namespace App\Http\Controllers\Api\Farmer;

use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Review;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class FarmerInsightsController extends Controller
{
    /**
     * Get farmer insights, sales metrics, and dashboard summary.
     */
    public function index(Request $request): JsonResponse
    {
        $farmerId = $request->user()->id;

        // Order counts
        $totalOrders = Order::where('farmer_id', $farmerId)->count();
        $pendingOrders = Order::where('farmer_id', $farmerId)->whereIn('order_status', ['placed', 'accepted'])->count();
        $readyOrders = Order::where('farmer_id', $farmerId)->where('order_status', 'ready')->count();
        $completedOrders = Order::where('farmer_id', $farmerId)->where('order_status', 'completed')->count();

        // Revenue summary
        $totalRevenue = (float) Order::where('farmer_id', $farmerId)
            ->whereIn('order_status', ['completed', 'accepted', 'ready'])
            ->sum('total_amount');

        // Best-selling products
        $bestSellers = OrderItem::whereHas('order', fn ($q) => $q->where('farmer_id', $farmerId))
            ->select('product_id', DB::raw('SUM(quantity) as total_qty_sold'), DB::raw('SUM(subtotal) as total_sales'))
            ->groupBy('product_id')
            ->orderByDesc('total_qty_sold')
            ->with('product')
            ->take(5)
            ->get()
            ->map(function ($item) {
                return [
                    'product_id' => $item->product_id,
                    'product_name' => $item->product?->name ?? 'Unknown',
                    'unit' => $item->product?->unit,
                    'price' => (float) ($item->product?->price ?? 0),
                    'total_qty_sold' => (int) $item->total_qty_sold,
                    'total_sales' => (float) $item->total_sales,
                ];
            });

        // Stock alerts (low stock <= 5 or sold_out)
        $stockAlerts = Product::where('farmer_id', $farmerId)
            ->where(function ($q) {
                $q->where('stock_quantity', '<=', 5)
                    ->orWhere('status', 'sold_out');
            })
            ->latest()
            ->take(5)
            ->get(['id', 'name', 'stock_quantity', 'unit', 'status']);

        // Reviews metrics
        $avgRating = (float) Review::where('farmer_id', $farmerId)->avg('rating');
        $totalReviews = Review::where('farmer_id', $farmerId)->count();

        // Recent orders
        $recentOrders = Order::where('farmer_id', $farmerId)
            ->with(['customer', 'market', 'items.product'])
            ->latest()
            ->take(5)
            ->get();

        return $this->success([
            'total_orders' => $totalOrders,
            'pending_orders' => $pendingOrders,
            'ready_orders' => $readyOrders,
            'completed_orders' => $completedOrders,
            'total_revenue' => $totalRevenue,
            'avg_rating' => round($avgRating, 2),
            'total_reviews' => $totalReviews,
            'best_sellers' => $bestSellers,
            'stock_alerts' => $stockAlerts,
            'recent_orders' => OrderResource::collection($recentOrders),
        ], 'Farmer insights retrieved successfully');
    }
}
