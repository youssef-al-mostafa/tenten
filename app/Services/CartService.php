<?php

namespace App\Services;

use App\Models\CartItem;
use App\Models\Product;
use App\Models\VariationType;
use App\Models\VariationTypeOption;
use Illuminate\Container\Attributes\Log;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log as FacadesLog;
use Illuminate\Support\Str;

use function Illuminate\Log\log;

class CartService
{
    private ?array $cachedCartItems = null;
    protected const COOKIE_NAME = 'cartItems';
    protected const COOKIE_LIEFTIME = 60 * 24 * 90; // 3 month for a cookie lifetime
    public function addItemToCart(Product $product, int $quantity = 1, $optionIds = null) {
        if ($optionIds === null) {
            $optionIds = $product->variationTypes->mapWithKeys(fn(VariationType $type)=> [$type->id => $type->options[0]?->id])->toArray();
        }
    }
    public function updateItemQuantity(int $productId, int $quantity, $optionsIds = null) {}
    public function removeItemFromCart(int $productId, $optionsIds = null) {}
    /*
       Some Helper methods
    */
    public function getCartItems(): array{
        try {

            if ($this->cachedCartItems === null) {
                $cartItems = [];
                // if it is null than we are calling this for the firt time
                if (Auth::check()) {
                    $cartItems = $this->getCartItemsFromDatabase();
                } else {
                    $cartItems = $this->getCartItemsFromCookies();
                }
                $productIds = collect($cartItems)->map(fn($item) => $item['product_id']);
                $products = Product::whereIn('id', $productIds)
                    ->with('user.vendor')
                    ->published()
                    ->get()
                    ->keyBy('id');
                $cartItemData = [];

                foreach ((array)$cartItems as $key => $cartItem) {
                    $product = data_get($products, $cartItem['product_id']);
                    if (!$product) continue;

                    $optionInfo = [];
                    $options = VariationTypeOption::with('variationType')
                        ->whereIn('id', $cartItem['option_ids'])
                        ->get()
                        ->keyBy('id');

                    $imageUrl = null;
                    foreach ($cartItems['option_ids'] as $option_id) {
                        $option = data_get($options, $option_id);
                        if (!$imageUrl) {
                            $imageUrl = $option->getFirstMediaUrl('images', 'small');
                        }
                        $optionInfo[] = [
                            'option_id' => $option->id,
                            'option_name' => $option->name,
                            'type' => [
                                'id' => $option->variationType->id,
                                'name' => $option->variationType->name,
                            ],
                        ];
                    }
                    $cartItemData[] = [
                        'id' => $cartItem['id'],
                        'product_id' => $product->id,
                        'title' => $product->title,
                        'slug' => $product->slug,
                        'quantity' => $cartItem['quantity'],
                        'price' => $cartItem['price'],
                        'option_ids' => $cartItem['option_ids'],
                        'options' => $optionInfo,
                        'image' => $imageUrl ?: $product->getFirstMediaUrl('images', 'small'),
                        'user' => [
                            'id' => $product->user->id,
                            'name' => $product->user->name,
                            'vendor' => [
                                'id' => $product->user->vendor->id,
                                'name' => $product->user->vendor->store_name,
                            ]
                        ]
                    ];
                }
                $this->cachedCartItems = $cartItemData;
            }

            return $this->cachedCartItems;
        } catch (\Exception $e) {
            FacadesLog::error($e->getMessage() . PHP_EOL . $e->getTraceAsString());
        }
        return [];
    }
    public function getTotalQuantity(): int{
        $totalQuantity = 0;
        foreach ($this->getCartItems() as $item) {
            $totalQuantity += $item['quantity'];
        }
        return $totalQuantity;
    }
    public function getTotalPrice(): float{
        $totalPrice = 0;
        foreach ($this->getCartItems() as $item) {
            $totalPrice += $item['quantity'] * $item['price'];
        }
        return $totalPrice;
    }
    /*
      Some Protected methods which will be use internally
    */
    protected function updateItemQuantityInDatabase(int $productId, int $quantity, array $optionIds): void{
        $userId = Auth::id();
        $cartItem = CartItem::where('user_id', $userId)
            ->where('product_id', $productId)
            ->where('variation_type_option_ids', json_encode($optionIds))
            ->first();
        if ($cartItem) {
            $cartItem->update([
                'quantity' => $quantity,
            ]);
        }
    }
    protected function updateItemQuantityInCookies(int $productId, int $quantity, array $optionIds): void{
        $cartItems = $this->getCartItemsFromCookies();
        ksort($optionIds);
        // I make this to use an unique key based on  the product ID and the option IDs//-
        // ex : '1_[1,4]' and '1_[2,3]' two diffrent but the same product//-
        $itemKey = $productId . '_' . json_encode($optionIds);
        if (isset($cartItems[$itemKey])) {
            $cartItems[$itemKey]['quantity'] += $quantity;
        }
        Cookie::queue(self::COOKIE_NAME, json_encode($cartItems), self::COOKIE_LIEFTIME);
    }
    protected function saveItemToDatabase(int $productId, int $quantity, $price): void{
        $userId = Auth::id();
        ksort($optionIds);

        $cartItem = CartItem::where('user_id', $userId)
            ->where('product_id', $productId)
            ->where('variation_type_option_ids', json_encode($optionIds))
            ->first();

        if ($cartItem) {
            $cartItem->update([
                'quantity' => DB::raw('quantity + ', $quantity)
            ]);
        } else {
            CartItem::creat([
                'user_id' => $userId,
                'product_id' => $productId,
                'variation_type_option_ids' => $optionIds,
                'quantity' => $quantity,
                'price' => $price,
            ]);
        }
    }
    protected function saveItemToCookies(int $productId, int $quantity, $price): void{
        $cartItems = $this->getCartItemsFromCookies();
        ksort($optionIds);
        $itemKey = $productId . '_' . json_encode($optionIds);
        if (isset($cartItems[$itemKey])) {
            $cartItems[$itemKey]['quantity'] += $quantity;
            $cartItems[$itemKey]['price'] = $price;
        } else {
            $cartItems[$itemKey] = [
                'id' => Str::uuid(),
                'product_id' => $productId,
                'option_ids' => $optionIds,
                'quantity' => $quantity,
                'price' => $price,
            ];
        }
        Cookie::queue(self::COOKIE_NAME, json_encode($cartItems), self::COOKIE_LIEFTIME);
    }
    protected function removeItemFromDatabase(int $productId, array $optionIds): void{
        $userId = Auth::id();
        ksort($optionIds);
        $cartItem = CartItem::where('user_id', $userId)
            ->where('product_id', $productId)
            ->where('variation_type_option_ids', json_encode($optionIds))
            ->delete();
    }
    protected function removeItemFromCookies(int $productId, array $optionIds): void {
        $cartItems = $this->getCartItemsFromCookies();
        ksort($optionIds);
        $cartKey = $productId . '_' . json_encode($optionIds);
        unset($cartItems[$cartKey]);
        Cookie::queue(self::COOKIE_NAME, json_encode($cartItems), self::COOKIE_LIEFTIME);
    }
    protected function getCartItemsFromDatabase() {
        $userId = Auth::id();
        $cartItems = CartItem::where('user_id', $userId)->get()->map(function($cartItem){
            return [
                'id' => $cartItem->id,
                'product_id' => $cartItem->product_id,
                'quantity' => $cartItem->quantity,
                'price' => $cartItem->price,
                'option_ids' => $cartItem->variation_type_option_id,
            ];
        })->toArray();
        return $cartItems;
    }
    protected function getCartItemsFromCookies(){
        $cartItems = json_decode(Cookie::get(self::COOKIE_NAME, '[]'), true);
        return $cartItems;
    }
}
