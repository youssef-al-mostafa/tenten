<?php

namespace App\Models;

use App\Enums\ProductStatusEnum;
use App\Enums\RolesEnum;
use Illuminate\Support\Facades\Auth;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class Product extends Model implements HasMedia
{
    use InteractsWithMedia;

    protected $casts = [
        'variations' => 'array',
    ];
    public function registerMediaConversions(Media $media = null): void
    {
        $this->addMediaConversion('thumb')
            ->width(100);
        $this->addMediaConversion('small')
            ->width(480);
        $this->addMediaConversion('large')
            ->width(1200);
    }
    public function scopeForVendor(Builder $query): Builder
    {
        /** @var User $user */
        $user = Auth::user();

        $adminRoles = [
            RolesEnum::MASTER_ADMIN,
            RolesEnum::ADMIN,
        ];

        if ($user && $user->hasAnyRole($adminRoles)) {
            return $query;
        }

        return $query->where('created_by', $user?->id ?? 0);
    }
    public function scopePublished(Builder $query): Builder
    {
        return $query->where('status', ProductStatusEnum::Published);
    }
    protected $fillable = [
        'created_by',
        'updated_by'
    ];
    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }
    public function variation(): HasMany
    {
        return $this->hasMany(ProductVariation::class);
    }
    public function variationTypes(): HasMany
    {
        return $this->hasMany(VariationType::class);
    }
}
