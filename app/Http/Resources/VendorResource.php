<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VendorResource extends JsonResource
{
    public static $wrap = false;

    public function toArray(Request $request): array
    {
        return [
            'id' => $this->user_id,
            'user_id' => $this->user_id,
            'name' => $this->user->name,
            'storeName' => $this->store_name,
            'status' => $this->status,
            'store_name' => $this->store_name,
            'store_description' => $this->store_description,
            'description' => $this->store_description,
            'store_address' => $this->store_address,
            'location' => $this->store_address,
            'cover_image' => $this->cover_image,
            'avatar' => $this->cover_image ? asset('storage/' . $this->cover_image) : null,
            'user' => [
                'id' => $this->user->id,
                'name' => $this->user->name,
            ],
            'topProducts' => $this->when($this->relationLoaded('user') && $this->user->relationLoaded('products'), function () {
                return $this->user->products->map(function ($product) {
                    return [
                        'id' => $product->id,
                        'image' => $product->getFirstMediaUrl('images', 'small'),
                        'title' => $product->title,
                        'price' => $product->price,
                    ];
                });
            }),
        ];
    }
}
