<?php

namespace App\Models;

use App\Enums\VendorStatusEnum;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Builder;

class Vendor extends Model
{
    protected $primaryKey = 'user_id';

    public function getRouteKeyName()
    {
        return 'store_name';
    }
    public function scopeEligibleForPayout(Builder $query): Builder {
        return $query->where('status', VendorStatusEnum::Approved)
                     ->join('users', 'users.id', '=', 'vendors.user_id')
                     ->where('users.stripe_account_active', true);
    }

    public function user(): BelongsTo{
        return $this->belongsTo(User::class, 'user_id');
    }
}
