<?php

namespace App\Http\Controllers\Api\Farmer;

use App\Http\Controllers\Controller;
use App\Http\Requests\Farmer\OrderActionRequest;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FarmerOrderController extends Controller
{
    /**
     * List farmer's pre-orders with status and search filters.
     */
    public function index(Request $request): JsonResponse
    {
        $farmerId = $request->user()->id;

        $query = Order::where('farmer_id', $farmerId)
            ->with(['customer', 'market', 'items.product']);

        if ($request->filled('status')) {
            $query->where('order_status', $request->query('status'));
        }

        if ($request->filled('search')) {
            $search = $request->query('search');
            $query->where(function ($q) use ($search) {
                $q->where('id', 'like', "%{$search}%")
                    ->orWhereHas('customer', fn ($c) => $c->where('name', 'like', "%{$search}%"));
            });
        }

        $orders = $query->latest()->get();

        return $this->success(OrderResource::collection($orders), 'Orders retrieved successfully');
    }

    /**
     * View detailed order information.
     */
    public function show(Request $request, int $id): JsonResponse
    {
        $order = Order::where('farmer_id', $request->user()->id)
            ->with(['customer', 'market', 'items.product'])
            ->findOrFail($id);

        return $this->success(new OrderResource($order), 'Order details retrieved successfully');
    }

    /**
     * Update order status (accept, decline, mark ready for pickup, complete, cancel).
     */
    public function updateStatus(OrderActionRequest $request, int $id): JsonResponse
    {
        $order = Order::where('farmer_id', $request->user()->id)->findOrFail($id);
        $validated = $request->validated();

        $order->order_status = $validated['status'];
        if (! empty($validated['notes'])) {
            $order->notes = $order->notes ? $order->notes . "\n" . $validated['notes'] : $validated['notes'];
        }
        $order->save();

        $order->load(['customer', 'market', 'items.product']);

        return $this->success(new OrderResource($order), "Order status updated to {$validated['status']}");
    }
}
