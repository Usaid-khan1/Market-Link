<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FarmerProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'stall_name',
        'contact_person',
        'operating_days',
        'market_ids',
        'pickup_time_start',
        'pickup_time_end',
        'cutoff_time',
        'pickup_slots',
        'address',
        'bio',
        'latitude',
        'longitude',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'operating_days' => 'array',
            'market_ids' => 'array',
            'pickup_slots' => 'array',
            'latitude' => 'float',
            'longitude' => 'float',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
