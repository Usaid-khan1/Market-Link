<?php

namespace App\Http\Requests\Farmer;

use Illuminate\Foundation\Http\FormRequest;

class FarmerProfileUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'stall_name' => ['sometimes', 'string', 'max:255'],
            'contact_person' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:30'],
            'address' => ['nullable', 'string', 'max:500'],
            'bio' => ['nullable', 'string', 'max:2000'],
            'operating_days' => ['nullable', 'array'],
            'operating_days.*' => ['string'],
            'market_ids' => ['nullable', 'array'],
            'market_ids.*' => ['integer', 'exists:markets,id'],
            'pickup_time_start' => ['nullable', 'string', 'max:30'],
            'pickup_time_end' => ['nullable', 'string', 'max:30'],
            'cutoff_time' => ['nullable', 'string', 'max:100'],
            'pickup_slots' => ['nullable', 'array'],
            'pickup_slots.*' => ['string'],
            'latitude' => ['nullable', 'numeric'],
            'longitude' => ['nullable', 'numeric'],
        ];
    }
}
