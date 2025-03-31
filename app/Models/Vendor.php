<?php

namespace App\Models;

use App\Enums\VendorStatusEnum;
use Filament\Forms\Components\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Vendor extends Model
{
    protected $primaryKey = 'user_id';

    public function scopeEligibleForPayout(Builder $query): Builder {
        return $query->where('status', VendorStatusEnum::Approved);
    }

    public function user(): BelongsTo{
        return $this->belongsTo(User::class, 'user_id');
    }
}
