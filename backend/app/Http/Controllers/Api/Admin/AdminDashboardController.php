<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use App\Models\Announcement;
use App\Models\FarmerProfile;
use App\Models\Market;
use App\Models\Order;
use App\Models\Review;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class AdminDashboardController extends Controller
{
    /**
     * Dashboard Summary Metrics
     */
    public function summary(): JsonResponse
    {
        $totalFarmers = User::where('role', 'farmer')->count();
        $pendingFarmers = FarmerProfile::where('status', 'pending')->count();
        $approvedFarmers = FarmerProfile::where('status', 'approved')->count();

        $totalCustomers = User::where('role', 'customer')->count();
        $activeCustomers = User::where('role', 'customer')->where('status', 'active')->count();

        $totalMarkets = Market::count();
        $totalOrders = Order::count();
        $totalRevenue = (float) Order::whereIn('order_status', ['completed', 'accepted', 'ready'])->sum('total_amount');
        $activeAnnouncements = Announcement::where('is_active', true)->count();

        return $this->success([
            'total_farmers' => $totalFarmers,
            'pending_farmers' => $pendingFarmers,
            'approved_farmers' => $approvedFarmers,
            'total_customers' => $totalCustomers,
            'active_customers' => $activeCustomers,
            'total_markets' => $totalMarkets,
            'total_orders' => $totalOrders,
            'total_revenue' => $totalRevenue,
            'active_announcements' => $activeAnnouncements,
        ], 'Dashboard summary retrieved successfully');
    }

    /**
     * Platform-wide Reports and Analytics
     */
    public function reports(): JsonResponse
    {
        $totalOrders = Order::count();
        $totalRevenue = (float) Order::whereIn('order_status', ['completed', 'accepted', 'ready'])->sum('total_amount');

        // Orders breakdown by status
        $statusBreakdown = Order::select('order_status', DB::raw('count(*) as count'))
            ->groupBy('order_status')
            ->pluck('count', 'order_status');

        // Revenue by market
        $revenueByMarket = Market::leftJoin('orders', 'markets.id', '=', 'orders.market_id')
            ->select(
                'markets.id',
                'markets.market_name',
                DB::raw('COUNT(orders.id) as total_orders'),
                DB::raw('COALESCE(SUM(CASE WHEN orders.order_status IN ("completed", "accepted", "ready") THEN orders.total_amount ELSE 0 END), 0) as total_revenue')
            )
            ->groupBy('markets.id', 'markets.market_name')
            ->get()
            ->map(function ($row) {
                return [
                    'market_id' => $row->id,
                    'market_name' => $row->market_name,
                    'total_orders' => (int) $row->total_orders,
                    'total_revenue' => (float) $row->total_revenue,
                ];
            });

        // Most active farmers
        $mostActiveFarmers = User::where('role', 'farmer')
            ->with(['farmerProfile', 'reviewsReceived'])
            ->withCount('ordersAsFarmer')
            ->get()
            ->map(function ($farmer) {
                $revenue = (float) $farmer->ordersAsFarmer()
                    ->whereIn('order_status', ['completed', 'accepted', 'ready'])
                    ->sum('total_amount');
                $avgRating = (float) $farmer->reviewsReceived()->avg('rating');

                return [
                    'farmer_id' => $farmer->id,
                    'farmer_name' => $farmer->name,
                    'stall_name' => $farmer->farmerProfile?->stall_name ?? $farmer->name,
                    'status' => $farmer->farmerProfile?->status ?? 'pending',
                    'total_orders' => (int) $farmer->orders_as_farmer_count,
                    'total_revenue' => $revenue,
                    'rating' => round($avgRating, 2),
                    'reviews_count' => $farmer->reviewsReceived()->count(),
                ];
            })
            ->sortByDesc('total_orders')
            ->values();

        // Recent orders
        $recentOrders = Order::with(['customer', 'farmer.farmerProfile', 'market'])
            ->latest()
            ->take(5)
            ->get();

        return $this->success([
            'total_orders' => $totalOrders,
            'total_revenue' => $totalRevenue,
            'status_breakdown' => $statusBreakdown,
            'revenue_by_market' => $revenueByMarket,
            'most_active_farmers' => $mostActiveFarmers,
            'recent_orders' => OrderResource::collection($recentOrders),
        ], 'Platform reports retrieved successfully');
    }
}
