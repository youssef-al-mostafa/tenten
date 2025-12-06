<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VendorResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'user_id' => $this->user_id,
            'status' => $this->status,
            'store_name' => $this->store_name,
            'store_description' => $this->store_description,
            'store_address' => $this->store_address,
            'cover_image' => $this->cover_image,
            'user' => [
                'id' => $this->user->id,
                'name' => $this->user->name,
            ],
            'topProducts' => $this->whenLoaded('products', function () {
                return $this->products->map(function ($product) {
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
