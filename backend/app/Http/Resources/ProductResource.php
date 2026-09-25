<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'farmer_id' => $this->farmer_id,
            'farmer_name' => $this->farmer?->name,
            'stall_name' => $this->farmer?->farmerProfile?->stall_name,
            'category_id' => $this->category_id,
            'category_name' => $this->category?->name,
            'market_id' => $this->market_id,
            'market_name' => $this->market?->market_name,
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
