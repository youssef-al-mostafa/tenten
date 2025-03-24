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
    protected $fillable = [
        'created_by',
        'updated_by'
    ];
    protected $casts = [
        'variations' => 'array',
    ];
    public function registerMediaConversions(?Media $media = null): void
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
    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
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
    public function getPriceForOptions($optionIds = [])
    {
        $optionIds = array_values($optionIds);
        sort($optionIds);

        $variations = $this->variation()->get();

        foreach ($variations as $variation) {
            $variantOptionIds = $variation->variation_type_option_ids;
            sort($variantOptionIds);

            if ($variantOptionIds == $optionIds) {
                return $variation->price !== null ? $variation->price : $this->price;
            }
        }

        return $this->price;
    }
    public function getImageForOptions(?array $optionIds = null){
        if ($optionIds) {
           $optionIds = array_values($optionIds);
           sort($optionIds);
           $options = VariationTypeOption::whereIn('id',$optionIds)->get();

           foreach ($options as $option) {
              $image = $option->getFirstMediaUrl('images','small');
              if ($image) {
                 return $image;
              }
           }
        }
        return $this->getFirstMediaUrl('images','small');
    }
}
