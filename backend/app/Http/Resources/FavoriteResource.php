<?php

namespace App\Http\Resources;

use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FavoriteResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $target = null;
        if ($this->type === 'farmer') {
            $farmer = User::with('farmerProfile')->find($this->target_id);
            if ($farmer) {
                $target = [
                    'id' => $farmer->id,
                    'name' => $farmer->name,
                    'stall_name' => $farmer->farmerProfile?->stall_name,
                    'operating_days' => $farmer->farmerProfile?->operating_days,
                    'pickup_time' => ($farmer->farmerProfile?->pickup_time_start && $farmer->farmerProfile?->pickup_time_end)
                        ? "{$farmer->farmerProfile->pickup_time_start} - {$farmer->farmerProfile->pickup_time_end}"
                        : null,
                    'address' => $farmer->farmerProfile?->address,
                    'status' => $farmer->farmerProfile?->status,
                ];
            }
        } elseif ($this->type === 'product') {
            $product = Product::with(['farmer.farmerProfile', 'category'])->find($this->target_id);
            if ($product) {
                $target = [
                    'id' => $product->id,
                    'name' => $product->name,
                    'price' => (float) $product->price,
                    'unit' => $product->unit,
                    'stock_quantity' => (int) $product->stock_quantity,
                    'status' => $product->status,
                    'image' => $product->image,
                    'farmer_name' => $product->farmer?->name,
                    'stall_name' => $product->farmer?->farmerProfile?->stall_name,
                    'category_name' => $product->category?->name,
                ];
            }
        }

        return [
            'id' => $this->id,
            'customer_id' => $this->customer_id,
            'type' => $this->type,
            'target_id' => $this->target_id,
            'target' => $target,
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
