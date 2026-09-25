<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Market extends Model
{
    use HasFactory;

    protected $fillable = [
        'market_name',
        'address',
        'latitude',
        'longitude',
        'operating_days',
        'timings',
        'map_provider',
    ];

    protected function casts(): array
    {
        return [
            'operating_days' => 'array',
            'latitude' => 'float',
            'longitude' => 'float',
        ];
    }
}
