<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StockTemplateResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'farmer_id' => $this->farmer_id,
            'day_of_week' => $this->day_of_week,
            'product_id' => $this->product_id,
            'product_name' => $this->product?->name,
            'unit' => $this->product?->unit,
            'price' => (float) $this->product?->price,
            'current_stock' => (int) $this->product?->stock_quantity,
            'default_quantity' => (int) $this->default_quantity,
            'is_included' => (bool) $this->is_included,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
