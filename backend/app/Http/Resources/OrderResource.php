<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'customer_id' => $this->customer_id,
            'customer_name' => $this->customer?->name,
            'farmer_id' => $this->farmer_id,
            'farmer_name' => $this->farmer?->name,
            'stall_name' => $this->farmer?->farmerProfile?->stall_name,
            'market_id' => $this->market_id,
            'market_name' => $this->market?->market_name,
            'total_amount' => (float) $this->total_amount,
            'order_status' => $this->order_status,
            'pickup_date' => $this->pickup_date?->format('Y-m-d'),
            'pickup_time' => $this->pickup_time,
            'notes' => $this->notes,
            'items_count' => $this->whenCounted('items'),
            'items' => $this->whenLoaded('items', fn () => $this->items->map(fn ($item) => [
                'id' => $item->id,
                'product_id' => $item->product_id,
                'product_name' => $item->product?->name,
                'quantity' => $item->quantity,
                'unit_price' => (float) $item->unit_price,
                'subtotal' => (float) $item->subtotal,
            ])),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
