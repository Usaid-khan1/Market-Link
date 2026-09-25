<?php

namespace App\Http\Controllers\Api\Farmer;

use App\Http\Controllers\Controller;
use App\Http\Requests\Farmer\FarmerReviewReplyRequest;
use App\Http\Resources\ReviewResource;
use App\Models\Review;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FarmerReviewController extends Controller
{
    /**
     * List all customer reviews for the authenticated farmer.
     */
    public function index(Request $request): JsonResponse
    {
        $farmerId = $request->user()->id;

        $query = Review::where('farmer_id', $farmerId)
            ->with(['customer', 'product', 'order']);

        if ($request->filled('filter')) {
            $filter = $request->query('filter');
            if ($filter === 'unreplied') {
                $query->whereNull('farmer_reply');
            } elseif ($filter === 'replied') {
                $query->whereNotNull('farmer_reply');
            }
        }

        $reviews = $query->latest()->get();

        return $this->success(ReviewResource::collection($reviews), 'Customer reviews retrieved successfully');
    }

    /**
     * Reply to or update response to a customer review.
     */
    public function reply(FarmerReviewReplyRequest $request, int $id): JsonResponse
    {
        $review = Review::where('farmer_id', $request->user()->id)->findOrFail($id);

        $review->update([
            'farmer_reply' => $request->input('farmer_reply'),
            'reply_date' => now(),
        ]);

        $review->load(['customer', 'product', 'order']);

        return $this->success(new ReviewResource($review), 'Response posted successfully');
    }
}
