<?php

namespace App\Http\Requests\Farmer;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class OrderActionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'status' => ['required', Rule::in(['accepted', 'declined', 'ready', 'completed', 'cancelled'])],
            'notes' => ['nullable', 'string', 'max:500'],
        ];
    }
}
