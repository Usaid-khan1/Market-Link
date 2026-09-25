<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReviewResource extends JsonResource
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
            'product_id' => $this->product_id,
            'product_name' => $this->product?->name,
            'order_id' => $this->order_id,
            'rating' => (int) $this->rating,
            'comment' => $this->comment,
            'farmer_reply' => $this->farmer_reply,
            'reply_date' => $this->reply_date?->toISOString(),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
