<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StockTemplate extends Model
{
    use HasFactory;

    protected $fillable = [
        'farmer_id',
        'day_of_week',
        'product_id',
        'default_quantity',
        'is_included',
    ];

    protected function casts(): array
    {
        return [
            'default_quantity' => 'integer',
            'is_included' => 'boolean',
        ];
    }

    public function farmer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'farmer_id');
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
