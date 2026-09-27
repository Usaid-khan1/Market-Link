<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $marketId = $this->market_id;
        $marketName = $this->market?->market_name;

        if (! $marketId && $this->farmer?->farmerProfile) {
            $fp = $this->farmer->farmerProfile;
            if (! empty($fp->market_ids) && is_array($fp->market_ids) && count($fp->market_ids) > 0) {
                $marketId = (int) $fp->market_ids[0];
                $marketObj = \App\Models\Market::find($marketId);
                $marketName = $marketObj?->market_name;
            }
        }

        if (! $marketId) {
            $firstMarket = \App\Models\Market::first();
            $marketId = $firstMarket?->id;
            $marketName = $firstMarket?->market_name;
        }

        return [
            'id' => $this->id,
            'farmer_id' => $this->farmer_id,
            'farmer_name' => $this->farmer?->name,
            'stall_name' => $this->farmer?->farmerProfile?->stall_name,
            'category_id' => $this->category_id,
            'category_name' => $this->category?->name,
            'market_id' => $marketId,
            'market_name' => $marketName ?: 'Farmers Market Pavilion',
            'name' => $this->name,
            'description' => $this->description,
            'price' => (float) $this->price,
            'unit' => $this->unit,
            'stock_quantity' => (int) $this->stock_quantity,
            'image' => $this->image,
            'status' => $this->status,
            'reviews_avg_rating' => $this->whenNotNull($this->reviews_avg_rating),
            'reviews_count' => $this->whenCounted('reviews'),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
