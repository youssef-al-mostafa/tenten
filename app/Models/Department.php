<?php

namespace App\Models;

use App\Enums\VendorStatusEnum;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\Category;
use Illuminate\Database\Eloquent\Builder;

class Department extends Model
{
    public function categories(): HasMany
    {
        return $this->hasMany(Category::class);
    }

    public function scopePublished(Builder $query): Builder {
        return $query->where('active', true);
    }
}
