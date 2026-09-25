<?php

namespace App\Http\Controllers\Api\Farmer;

use App\Http\Controllers\Controller;
use App\Http\Requests\Farmer\StockTemplateBatchRequest;
use App\Http\Resources\StockTemplateResource;
use App\Models\Product;
use App\Models\StockTemplate;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class FarmerStockTemplateController extends Controller
{
    /**
     * Get stock templates for the farmer, optionally filtered by day_of_week.
     */
    public function index(Request $request): JsonResponse
    {
        $farmerId = $request->user()->id;
        $query = StockTemplate::where('farmer_id', $farmerId)->with('product');

        if ($request->filled('day')) {
            $query->where('day_of_week', $request->query('day'));
        }

        $templates = $query->get();

        return $this->success(StockTemplateResource::collection($templates), 'Weekly stock templates retrieved successfully');
    }

    /**
     * Save or update batch stock templates for a specific day.
     */
    public function saveBatch(StockTemplateBatchRequest $request): JsonResponse
    {
        $farmerId = $request->user()->id;
        $validated = $request->validated();
        $dayOfWeek = $validated['day_of_week'];

        $savedTemplates = DB::transaction(function () use ($farmerId, $dayOfWeek, $validated) {
            $records = [];
            foreach ($validated['items'] as $item) {
                // Ensure product belongs to this farmer
                $product = Product::where('farmer_id', $farmerId)->findOrFail($item['product_id']);

                $record = StockTemplate::updateOrCreate(
                    [
                        'farmer_id' => $farmerId,
                        'day_of_week' => $dayOfWeek,
                        'product_id' => $product->id,
                    ],
                    [
                        'default_quantity' => $item['default_quantity'],
                        'is_included' => $item['is_included'],
                    ]
                );
                $record->load('product');
                $records[] = $record;
            }

            return $records;
        });

        return $this->success(StockTemplateResource::collection(collect($savedTemplates)), "Weekly template for {$dayOfWeek} saved successfully");
    }

    /**
     * Apply template to products to reset/adjust active inventory.
     */
    public function applyTemplate(Request $request): JsonResponse
    {
        $request->validate([
            'day_of_week' => ['required', 'string'],
        ]);

        $farmerId = $request->user()->id;
        $dayOfWeek = $request->input('day_of_week');

        $templates = StockTemplate::where('farmer_id', $farmerId)
            ->where('day_of_week', $dayOfWeek)
            ->where('is_included', true)
            ->get();

        if ($templates->isEmpty()) {
            return $this->error("No active template items found for {$dayOfWeek}.", null, 404);
        }

        $appliedCount = DB::transaction(function () use ($farmerId, $templates) {
            $count = 0;
            foreach ($templates as $template) {
                $status = $template->default_quantity > 0 ? 'available' : 'sold_out';
                Product::where('id', $template->product_id)
                    ->where('farmer_id', $farmerId)
                    ->update([
                        'stock_quantity' => $template->default_quantity,
                        'status' => $status,
                    ]);
                $count++;
            }

            return $count;
        });

        return $this->success([
            'day_of_week' => $dayOfWeek,
            'products_updated' => $appliedCount,
        ], "Applied {$dayOfWeek} template to {$appliedCount} products successfully");
    }
}
