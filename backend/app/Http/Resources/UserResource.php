<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'role' => $this->role,
            'phone' => $this->phone,
            'address' => $this->address,
            'status' => $this->status,
            'orders_count' => $this->orders_count ?? $this->orders_as_farmer_count ?? $this->orders_as_customer_count ?? null,
            'total_revenue' => isset($this->total_revenue) ? (float) $this->total_revenue : null,
            'total_spent' => isset($this->total_spent) ? (float) $this->total_spent : null,
            'tier' => $this->tier ?? null,
            'products_count' => $this->products_count ?? null,
            'farmer_profile' => $this->whenLoaded('farmerProfile', fn () => new FarmerProfileResource($this->farmerProfile)),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
