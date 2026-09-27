<?php

namespace App\Http\Requests\Customer;

use Illuminate\Foundation\Http\FormRequest;

class OrderCreateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $items = $this->input('items', []);
        $product = null;

        // 1. Resolve farmer_id if missing or empty
        $farmerId = $this->input('farmer_id');
        if (! $farmerId && ! empty($items[0]['product_id'])) {
            $product = \App\Models\Product::find($items[0]['product_id']);
            if ($product && $product->farmer_id) {
                $farmerId = (int) $product->farmer_id;
                $this->merge(['farmer_id' => $farmerId]);
            }
        }

        $marketId = $this->input('market_id');

        // If market_id is missing or doesn't exist in markets table
        if (! $marketId || ! \App\Models\Market::where('id', $marketId)->exists()) {
            $resolvedMarketId = null;

            // 1. Try from product
            if (! empty($items[0]['product_id'])) {
                $product = $product ?? \App\Models\Product::find($items[0]['product_id']);
                if ($product && $product->market_id && \App\Models\Market::where('id', $product->market_id)->exists()) {
                    $resolvedMarketId = (int) $product->market_id;
                }
            }

            // 2. Try from farmer profile
            $currentFarmerId = $farmerId ?: $this->input('farmer_id');
            if (! $resolvedMarketId && $currentFarmerId) {
                $farmer = \App\Models\User::find($currentFarmerId);
                $profile = $farmer?->farmerProfile;
                if ($profile && ! empty($profile->market_ids) && is_array($profile->market_ids) && count($profile->market_ids) > 0) {
                    $firstChosenMarket = $profile->market_ids[0];
                    if ($firstChosenMarket && \App\Models\Market::where('id', $firstChosenMarket)->exists()) {
                        $resolvedMarketId = (int) $firstChosenMarket;
                    }
                }
            }

            // 3. Fallback to first existing market
            if (! $resolvedMarketId) {
                $resolvedMarketId = \App\Models\Market::first()?->id;
            }

            if ($resolvedMarketId) {
                $this->merge(['market_id' => $resolvedMarketId]);
            }
        }
    }

    public function rules(): array
    {
        return [
            'farmer_id' => ['required', 'integer', 'exists:users,id'],
            'market_id' => ['nullable', 'integer', 'exists:markets,id'],
            'pickup_date' => ['required', 'date'],
            'pickup_time' => ['required', 'string', 'max:100'],
            'notes' => ['nullable', 'string', 'max:1000'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'integer', 'exists:products,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
        ];
    }
}
