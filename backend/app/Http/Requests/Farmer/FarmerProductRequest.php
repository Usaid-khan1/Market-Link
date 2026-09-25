<?php

namespace App\Http\Requests\Farmer;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class FarmerProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $isPost = $this->isMethod('post');

        return [
            'name' => [$isPost ? 'required' : 'sometimes', 'string', 'max:255'],
            'category_id' => ['nullable', 'integer', 'exists:categories,id'],
            'market_id' => ['nullable', 'integer', 'exists:markets,id'],
            'price' => [$isPost ? 'required' : 'sometimes', 'numeric', 'min:0'],
            'unit' => [$isPost ? 'required' : 'sometimes', 'string', 'max:30'],
            'stock_quantity' => [$isPost ? 'required' : 'sometimes', 'integer', 'min:0'],
            'description' => ['nullable', 'string', 'max:3000'],
            'image' => ['nullable', 'string'],
            'status' => ['nullable', Rule::in(['available', 'sold_out'])],
        ];
    }
}
