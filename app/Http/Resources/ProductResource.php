<?php

namespace App\Http\Resources;

use App\Models\VariationType;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public static $wrap = false;

    public function toArray(Request $request): array
    {
        $isDetailView = $this->resource->relationLoaded('variationTypes');

        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'price' => $this->price,
            'quantity' => $this->quantity,
            'image' => $this->getFirstMediaUrl('images', 'small'),
            'user' => [
                'id' => $this->user->id,
                'name' => $this->user->name,
                'store_name' => $this->user->vendor->store_name,
            ],
            'department' => [
                'id' => $this->department->id,
                'name' => $this->department->name,
                'slug' => $this->department->slug,
            ],
            'description' => $this->when($isDetailView, $this->description),
            'meta_title' => $this->when($isDetailView, $this->meta_title),
            'meta_description' => $this->when($isDetailView, $this->meta_description),
            'images' => $this->when($isDetailView, function () {
                return $this->getMedia('images')->map(function ($image) {
                    return [
                        'id' => $image->id,
                        'thumb' => $image->getUrl('thumb'),
                        'small' => $image->getUrl('small'),
                        'large' => $image->getUrl('large'),
                    ];
                });
            }),
            'variationTypes' => $this->when($isDetailView, function () {
                return $this->variationTypes->map(function ($variationType) {
                    return [
                        'id' => $variationType->id,
                        'name' => $variationType->name,
                        'type' => $variationType->type,
                        'options' => $variationType->options->map(function ($option) {
                            return [
                                'id' => $option->id,
                                'name' => $option->name,
                                'images' => $option->getMedia('images')->map(function ($image) {
                                    return [
                                        'id' => $image->id,
                                        'thumb' => $image->getUrl('thumb'),
                                        'small' => $image->getUrl('small'),
                                        'large' => $image->getUrl('large'),
                                    ];
                                })
                            ];
                        }),
                    ];
                });
            }),
            'variation' => $this->when($isDetailView, function () {
                return $this->variation->map(function ($variation) {
                    return [
                        'id' => $variation->id,
                        'variation_type_option_ids' => $variation->variation_type_option_ids,
                        'quantity' => $variation->quantity,
                        'price' => $variation->price,
                    ];
                });
            }),
            'stock' => $this->when($isDetailView, $this->stock),
            'created_at' => $this->when($isDetailView, $this->created_at),
            'updated_at' => $this->when($isDetailView, $this->updated_at),
        ];
    }
}
