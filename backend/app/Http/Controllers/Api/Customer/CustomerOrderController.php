<?php

namespace App\Http\Controllers\Api\Customer;

use App\Http\Controllers\Controller;
use App\Http\Requests\Customer\OrderCreateRequest;
use App\Http\Requests\Customer\OrderModifyRequest;
use App\Http\Resources\OrderResource;
use App\Models\Notification;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CustomerOrderController extends Controller
{
    /**
     * List active and past orders for authenticated customer.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Order::where('customer_id', $request->user()->id)
            ->with(['farmer.farmerProfile', 'market', 'items.product', 'review'])
            ->latest();

        if ($request->filled('status')) {
            $status = $request->query('status');
            if ($status === 'active') {
                $query->whereIn('order_status', ['placed', 'accepted', 'ready_for_pickup']);
            } elseif ($status === 'past') {
                $query->whereIn('order_status', ['completed', 'cancelled']);
            } else {
                $query->where('order_status', $status);
            }
        }

        $orders = $query->get();

        return $this->success(OrderResource::collection($orders), 'Orders retrieved successfully');
    }

    /**
     * Place a new pre-order with stock decrement & notifications.
     */
    public function store(OrderCreateRequest $request): JsonResponse
    {
        $farmer = User::where('id', $request->farmer_id)
            ->where('role', 'farmer')
            ->first();

        if (! $farmer) {
            return $this->error('Selected farmer not found.', null, 404);
        }

        if ($farmer->farmerProfile?->status !== 'approved') {
            return $this->error('This farmer is not currently accepting orders.', null, 422);
        }

        try {
            $order = DB::transaction(function () use ($request, $farmer) {
                $totalAmount = 0;
                $validatedItems = [];

                // 1. Verify stock and calculate total
                foreach ($request->items as $itemData) {
                    /** @var Product|null $product */
                    $product = Product::where('id', $itemData['product_id'])
                        ->where('farmer_id', $farmer->id)
                        ->lockForUpdate()
                        ->first();

                    if (! $product) {
                        throw new \Exception("Product #{$itemData['product_id']} not found or does not belong to this farmer.");
                    }

                    if ($product->status !== 'available') {
                        throw new \Exception("Product '{$product->name}' is currently unavailable.");
                    }

                    if ($product->stock_quantity < $itemData['quantity']) {
                        throw new \Exception("Insufficient stock for '{$product->name}'. Available: {$product->stock_quantity}.");
                    }

                    $unitPrice = (float) $product->price;
                    $subtotal = round($unitPrice * $itemData['quantity'], 2);
                    $totalAmount += $subtotal;

                    $validatedItems[] = [
                        'product' => $product,
                        'quantity' => $itemData['quantity'],
                        'unit_price' => $unitPrice,
                        'subtotal' => $subtotal,
                    ];
                }

                // 2. Create Order
                $order = Order::create([
                    'customer_id' => $request->user()->id,
                    'farmer_id' => $farmer->id,
                    'market_id' => $request->market_id,
                    'total_amount' => $totalAmount,
                    'order_status' => 'placed',
                    'pickup_date' => $request->pickup_date,
                    'pickup_time' => $request->pickup_time,
                    'notes' => $request->notes,
                ]);

                // 3. Create OrderItems & decrement stock
                foreach ($validatedItems as $item) {
                    OrderItem::create([
                        'order_id' => $order->id,
                        'product_id' => $item['product']['id'],
                        'quantity' => $item['quantity'],
                        'unit_price' => $item['unit_price'],
                        'subtotal' => $item['subtotal'],
                    ]);

                    /** @var Product $product */
                    $product = $item['product'];
                    $product->decrement('stock_quantity', $item['quantity']);

                    if ($product->fresh()->stock_quantity <= 0) {
                        $product->update(['status' => 'sold_out']);
                    }
                }

                // 4. Create Notifications
                Notification::create([
                    'user_id' => $farmer->id,
                    'type' => 'order_placed',
                    'title' => 'New Order Received',
                    'message' => "New order #{$order->id} placed by {$request->user()->name}.",
                    'data' => [
                        'order_id' => $order->id,
                        'total_amount' => $order->total_amount,
                    ],
                ]);

                Notification::create([
                    'user_id' => $request->user()->id,
                    'type' => 'order_placed',
                    'title' => 'Order Placed Successfully',
                    'message' => "Your order #{$order->id} has been placed for pickup on {$order->pickup_date?->format('Y-m-d')}.",
                    'data' => [
                        'order_id' => $order->id,
                        'total_amount' => $order->total_amount,
                    ],
                ]);

                return $order;
            });

            $order->load(['farmer.farmerProfile', 'market', 'items.product']);

            return $this->success(new OrderResource($order), 'Order placed successfully', 201);
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), null, 422);
        }
    }

    /**
     * Show order details.
     */
    public function show(Request $request, int $id): JsonResponse
    {
        $order = Order::where('customer_id', $request->user()->id)
            ->with(['farmer.farmerProfile', 'market', 'items.product', 'review'])
            ->findOrFail($id);

        return $this->success(new OrderResource($order), 'Order details retrieved successfully');
    }

    /**
     * Modify order pickup details/notes (only while in 'placed' status).
     */
    public function modify(OrderModifyRequest $request, int $id): JsonResponse
    {
        $order = Order::where('customer_id', $request->user()->id)->findOrFail($id);

        if ($order->order_status !== 'placed') {
            return $this->error("Cannot modify order with status '{$order->order_status}'. Only 'placed' orders can be modified.", null, 422);
        }

        $order->update($request->only(['pickup_date', 'pickup_time', 'notes']));
        $order->load(['farmer.farmerProfile', 'market', 'items.product']);

        return $this->success(new OrderResource($order), 'Order updated successfully');
    }

    /**
     * Cancel order (allowed when 'placed' or 'accepted'), restoring product stock.
     */
    public function cancel(Request $request, int $id): JsonResponse
    {
        $order = Order::where('customer_id', $request->user()->id)
            ->with('items.product')
            ->findOrFail($id);

        if (! in_array($order->order_status, ['placed', 'accepted'])) {
            return $this->error("Cannot cancel an order with status '{$order->order_status}'.", null, 422);
        }

        DB::transaction(function () use ($order, $request) {
            $order->update(['order_status' => 'cancelled']);

            // Restore product stock
            foreach ($order->items as $item) {
                if ($item->product) {
                    $item->product->increment('stock_quantity', $item->quantity);
                    if ($item->product->status === 'sold_out' && $item->product->stock_quantity > 0) {
                        $item->product->update(['status' => 'available']);
                    }
                }
            }

            // Notify farmer
            Notification::create([
                'user_id' => $order->farmer_id,
                'type' => 'order_cancelled',
                'title' => 'Order Cancelled',
                'message' => "Order #{$order->id} was cancelled by the customer.",
                'data' => [
                    'order_id' => $order->id,
                ],
            ]);
        });

        $order->load(['farmer.farmerProfile', 'market', 'items.product']);

        return $this->success(new OrderResource($order), 'Order cancelled successfully and stock restored');
    }

    /**
     * Re-order items from a past order.
     */
    public function reorder(Request $request, int $id): JsonResponse
    {
        $pastOrder = Order::where('customer_id', $request->user()->id)
            ->with(['items.product', 'farmer.farmerProfile'])
            ->findOrFail($id);

        if ($pastOrder->farmer->farmerProfile?->status !== 'approved') {
            return $this->error('The farmer is not currently accepting orders.', null, 422);
        }

        $pickupDate = $request->input('pickup_date', now()->addDay()->toDateString());
        $pickupTime = $request->input('pickup_time', $pastOrder->pickup_time ?: '10:00 AM - 12:00 PM');
        $notes = $request->input('notes', $pastOrder->notes);

        try {
            $newOrder = DB::transaction(function () use ($pastOrder, $request, $pickupDate, $pickupTime, $notes) {
                $totalAmount = 0;
                $itemsToCreate = [];

                foreach ($pastOrder->items as $pastItem) {
                    /** @var Product|null $product */
                    $product = Product::where('id', $pastItem->product_id)
                        ->where('farmer_id', $pastOrder->farmer_id)
                        ->lockForUpdate()
                        ->first();

                    if (! $product) {
                        throw new \Exception("Product #{$pastItem->product_id} is no longer offered by this farmer.");
                    }

                    if ($product->status !== 'available' || $product->stock_quantity < $pastItem->quantity) {
                        throw new \Exception("Product '{$product->name}' is out of stock or does not have sufficient quantity (Available: {$product->stock_quantity}).");
                    }

                    $unitPrice = (float) $product->price;
                    $subtotal = round($unitPrice * $pastItem->quantity, 2);
                    $totalAmount += $subtotal;

                    $itemsToCreate[] = [
                        'product' => $product,
                        'quantity' => $pastItem->quantity,
                        'unit_price' => $unitPrice,
                        'subtotal' => $subtotal,
                    ];
                }

                $newOrder = Order::create([
                    'customer_id' => $request->user()->id,
                    'farmer_id' => $pastOrder->farmer_id,
                    'market_id' => $pastOrder->market_id,
                    'total_amount' => $totalAmount,
                    'order_status' => 'placed',
                    'pickup_date' => $pickupDate,
                    'pickup_time' => $pickupTime,
                    'notes' => $notes,
                ]);

                foreach ($itemsToCreate as $item) {
                    OrderItem::create([
                        'order_id' => $newOrder->id,
                        'product_id' => $item['product']['id'],
                        'quantity' => $item['quantity'],
                        'unit_price' => $item['unit_price'],
                        'subtotal' => $item['subtotal'],
                    ]);

                    /** @var Product $product */
                    $product = $item['product'];
                    $product->decrement('stock_quantity', $item['quantity']);

                    if ($product->fresh()->stock_quantity <= 0) {
                        $product->update(['status' => 'sold_out']);
                    }
                }

                Notification::create([
                    'user_id' => $pastOrder->farmer_id,
                    'type' => 'order_placed',
                    'title' => 'New Re-order Received',
                    'message' => "New re-order #{$newOrder->id} placed by {$request->user()->name}.",
                    'data' => [
                        'order_id' => $newOrder->id,
                        'total_amount' => $newOrder->total_amount,
                    ],
                ]);

                Notification::create([
                    'user_id' => $request->user()->id,
                    'type' => 'order_placed',
                    'title' => 'Re-order Placed Successfully',
                    'message' => "Your re-order #{$newOrder->id} has been placed for pickup on {$newOrder->pickup_date?->format('Y-m-d')}.",
                    'data' => [
                        'order_id' => $newOrder->id,
                        'total_amount' => $newOrder->total_amount,
                    ],
                ]);

                return $newOrder;
            });

            $newOrder->load(['farmer.farmerProfile', 'market', 'items.product']);

            return $this->success(new OrderResource($newOrder), 'Re-order placed successfully', 201);
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), null, 422);
        }
    }
}
