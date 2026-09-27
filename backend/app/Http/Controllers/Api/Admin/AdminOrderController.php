<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminOrderController extends Controller
{
    /**
     * List all platform orders with search, status, and market filtering.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Order::with(['customer', 'farmer.farmerProfile', 'market', 'items.product']);

        // Filter by order status
        if ($request->filled('status') && $request->query('status') !== 'All Statuses' && $request->query('status') !== 'all') {
            $status = strtolower($request->query('status'));
            // Map frontend status labels if needed
            $statusMap = [
                'ready for pickup' => 'ready',
                'pending stall pack' => 'accepted',
                'placed' => 'placed',
                'accepted' => 'accepted',
                'ready' => 'ready',
                'completed' => 'completed',
                'cancelled' => 'cancelled',
            ];
            $dbStatus = $statusMap[$status] ?? $status;
            $query->where('order_status', $dbStatus);
        }

        // Filter by market
        if ($request->filled('market_id')) {
            $query->where('market_id', $request->query('market_id'));
        }

        // Search by order id, customer name, farmer stall, or market
        if ($request->filled('search')) {
            $search = $request->query('search');
            $cleanId = ltrim(str_ireplace('#ML-', '', $search), '#');

            $query->where(function ($q) use ($search, $cleanId) {
                if (is_numeric($cleanId)) {
                    $q->where('id', (int) $cleanId);
                }
                $q->orWhereHas('customer', fn ($c) => $c->where('name', 'like', "%{$search}%"))
                    ->orWhereHas('farmer', fn ($f) => $f->where('name', 'like', "%{$search}%")
                        ->orWhereHas('farmerProfile', fn ($fp) => $fp->where('stall_name', 'like', "%{$search}%")))
                    ->orWhereHas('market', fn ($m) => $m->where('market_name', 'like', "%{$search}%"));
            });
        }

        $orders = $query->latest()->get();

        return $this->success(OrderResource::collection($orders), 'Orders retrieved successfully');
    }

    /**
     * Show single order details.
     */
    public function show(int $id): JsonResponse
    {
        $order = Order::with(['customer', 'farmer.farmerProfile', 'market', 'items.product'])->findOrFail($id);

        return $this->success(new OrderResource($order), 'Order details retrieved successfully');
    }
}
