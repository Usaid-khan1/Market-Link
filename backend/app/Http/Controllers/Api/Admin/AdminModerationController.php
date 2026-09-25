<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Http\Resources\ReviewResource;
use App\Models\Product;
use App\Models\Review;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminModerationController extends Controller
{
    /**
     * List all products with filters for moderation.
     */
    public function products(Request $request): JsonResponse
    {
        $query = Product::with(['farmer.farmerProfile', 'category', 'market']);

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

        if ($request->filled('status')) {
            $query->where('status', $request->query('status'));
        }

        $products = $query->latest()->get();

        return $this->success(ProductResource::collection($products), 'Products retrieved for moderation');
    }

    /**
     * Delete an inappropriate product listing.
     */
    public function deleteProduct(int $id): JsonResponse
    {
        $product = Product::findOrFail($id);
        $product->delete();

        return $this->success(null, 'Product listing removed by admin');
    }

    /**
     * List all customer reviews with filters for moderation.
     */
    public function reviews(Request $request): JsonResponse
    {
        $query = Review::with(['customer', 'farmer.farmerProfile', 'product', 'order']);

        if ($request->filled('rating')) {
            $query->where('rating', $request->query('rating'));
        }

        if ($request->filled('search')) {
            $search = $request->query('search');
            $query->where(function ($q) use ($search) {
                $q->where('comment', 'like', "%{$search}%")
                    ->orWhereHas('customer', fn ($c) => $c->where('name', 'like', "%{$search}%"))
                    ->orWhereHas('farmer', fn ($f) => $f->where('name', 'like', "%{$search}%"));
            });
        }

        $reviews = $query->latest()->get();

        return $this->success(ReviewResource::collection($reviews), 'Reviews retrieved for moderation');
    }

    /**
     * Delete an inappropriate review.
     */
    public function deleteReview(int $id): JsonResponse
    {
        $review = Review::findOrFail($id);
        $review->delete();

        return $this->success(null, 'Review removed by admin');
    }
}
