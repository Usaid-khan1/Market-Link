<?php

namespace App\Http\Controllers\Api\Customer;

use App\Http\Controllers\Controller;
use App\Http\Requests\Customer\ReviewCreateRequest;
use App\Http\Resources\ReviewResource;
use App\Models\Notification;
use App\Models\Order;
use App\Models\Review;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CustomerReviewController extends Controller
{
    /**
     * List all reviews written by authenticated customer.
     */
    public function index(Request $request): JsonResponse
    {
        $reviews = Review::where('customer_id', $request->user()->id)
            ->with(['farmer.farmerProfile', 'product'])
            ->latest()
            ->get();

        return $this->success(ReviewResource::collection($reviews), 'Reviews retrieved successfully');
    }

    /**
     * Submit a rating and review for a completed order.
     */
    public function store(ReviewCreateRequest $request): JsonResponse
    {
        $order = Order::where('id', $request->order_id)
            ->where('customer_id', $request->user()->id)
            ->with('items')
            ->first();

        if (! $order) {
            return $this->error('Order not found or does not belong to you.', null, 404);
        }

        // Enforce completed order requirement
        if ($order->order_status !== 'completed') {
            return $this->error("Reviews can only be submitted after an order is completed. Current status: '{$order->order_status}'.", null, 422);
        }

        // Check for duplicate review on this order
        $alreadyReviewed = Review::where('order_id', $order->id)->exists();
        if ($alreadyReviewed) {
            return $this->error('You have already submitted a review for this order.', null, 422);
        }

        // If product_id specified, ensure it belongs to this order's items
        if ($request->filled('product_id')) {
            $hasProduct = $order->items->contains('product_id', $request->product_id);
            if (! $hasProduct) {
                return $this->error('The selected product was not part of this order.', null, 422);
            }
        }

        $review = Review::create([
            'customer_id' => $request->user()->id,
            'farmer_id' => $order->farmer_id,
            'order_id' => $order->id,
            'product_id' => $request->product_id,
            'rating' => $request->rating,
            'comment' => $request->comment,
        ]);

        // Notify farmer
        Notification::create([
            'user_id' => $order->farmer_id,
            'type' => 'new_review',
            'title' => 'New Review Received',
            'message' => "Customer {$request->user()->name} left a {$review->rating}-star review for order #{$order->id}.",
            'data' => [
                'review_id' => $review->id,
                'order_id' => $order->id,
                'rating' => $review->rating,
            ],
        ]);

        $review->load(['customer', 'farmer.farmerProfile', 'product']);

        return $this->success(new ReviewResource($review), 'Review submitted successfully', 201);
    }
}
