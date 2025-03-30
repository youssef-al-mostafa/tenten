<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    protected $fillable = [
        'stripe_session_id',
        'user_id',
        'status',
        'total_price',
        'online_payment_commission',
        'website_commission',
        'vendor_subtotal',
        'payment_intent',
    ];

    public function orderItems(): HasMany{
        return $this->hasMany(OrderItem::class);
    }

    public function user(): BelongsTo{
        return $this->belongsTo(User::class);
    }

    public function vendor(): BelongsTo{
        return $this->belongsTo(Vendor::class, 'vendor_user_id');
    }

    public function vendorUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'vendor_user_id', 'id');
    }
}
