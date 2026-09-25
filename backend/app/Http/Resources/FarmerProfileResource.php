<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FarmerProfileResource extends JsonResource
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
            'user_id' => $this->user_id,
            'stall_name' => $this->stall_name,
            'contact_person' => $this->contact_person,
            'operating_days' => $this->operating_days,
            'market_ids' => $this->market_ids,
            'pickup_time_start' => $this->pickup_time_start,
            'pickup_time_end' => $this->pickup_time_end,
            'cutoff_time' => $this->cutoff_time,
            'pickup_slots' => $this->pickup_slots,
            'address' => $this->address,
            'bio' => $this->bio,
            'latitude' => $this->latitude,
            'longitude' => $this->longitude,
            'status' => $this->status,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
