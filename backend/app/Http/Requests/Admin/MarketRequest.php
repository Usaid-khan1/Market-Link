<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class MarketRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $isPost = $this->isMethod('post');

        return [
            'market_name' => [$isPost ? 'required' : 'sometimes', 'string', 'max:150'],
            'address' => [$isPost ? 'required' : 'sometimes', 'string'],
            'latitude' => ['nullable', 'numeric'],
            'longitude' => ['nullable', 'numeric'],
            'operating_days' => ['nullable', 'array'],
            'timings' => ['nullable', 'string', 'max:100'],
            'map_provider' => ['nullable', 'string', 'max:50'],
        ];
    }
}
