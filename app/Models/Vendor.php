<?php

namespace App\Models;

use App\Enums\VendorStatusEnum;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Builder;

class Vendor extends Model
{
    protected $primaryKey = 'user_id';

    protected $fillable = [
        'user_id',
        'status',
        'store_name',
        'store_description',
        'store_address',
        'cover_image',
    ];

    public function getRouteKeyName()
    {
        return 'store_name';
    }
    public function scopeEligibleForPayout(Builder $query): Builder
    {
        return $query->where('status', VendorStatusEnum::Approved)
            ->whereHas('user', function($q) {
                $q->where('stripe_account_active', true);
            });
    }

    public function scopeApproved(Builder $query): Builder
    {
        // vendors should only show up if they have an active stripe account
        // but right now we're using fake vendors for testing so this check is disabled
        // uncomment this when working with real vendors:
        // ->whereHas('user', function($q) {
        //     $q->where('stripe_account_active', true);
        // });

        return $query->where('status', VendorStatusEnum::Approved);
    }

    public function scopeHasProducts(Builder $query): Builder
    {
        return $query->whereHas('user.products', function($q) {
            $q->where('status', 'published');
        });
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function products(): HasMany
    {
        return $this->hasMany(Product::class, 'created_by', 'user_id');
    }
}
