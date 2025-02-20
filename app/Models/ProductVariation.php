<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductVariation extends Model
{
    protected $casts = [
        'variation_type_option_ids' => 'array'
    ];

    protected $fillable = [
        'name',
        'variation_type_option_ids',
        'quantity',
        'price',
        'product_id'
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function variationType(): BelongsTo
    {
        return $this->belongsTo(VariationType::class);
    }

    public function getVariationOptionsAttribute(): array
    {
        return [
            'variation_type_' . $this->variation_type_id => [
                'name' => $this->name,
                'label' => $this->variationType->name
            ]
        ];
    }
}
