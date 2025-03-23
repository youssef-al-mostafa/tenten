<?php

namespace App\Http\Controllers;

use App\Enums\OrderStatusEnum;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Services\CartService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use PhpParser\Node\Stmt\TryCatch;

use function Pest\Laravel\options;

class CartController extends Controller
{
    public function index(CartService $cartService){
        return Inertia::render('Cart/Index' , [
            'cartItems' => $cartService->getCartItemsGrouped(),
        ]);
    }
    public function store(Request $request,Product $product, CartService $cartService){
        $request->mergeIfMissing([
            'quantity' => 1,
        ]);

        $data = $request->validate([
            'option_ids' => ['nullable', 'array'],
            'quantity' => ['required', 'integer', 'min:1'],
        ]);

        $cartService->addItemToCart(
            $product,
            $data['quantity'],
            $data['option_ids'] ?: []
        );

        return back()->with('success', 'Product added to cart successfully');
    }
    public function update(Request $request, Product $product, CartService $cartService){

        $request->validate([
            'quantity' => ['integer', 'min:1'],
        ]);

        $optionIds = $request->input('option_ids') ?: [];
        $quantity = $request->input('quantity');

        $cartService->updateItemQuantity($product->id, $quantity, $optionIds);

        return back()->with('success', 'Quantity was updated successfully');
    }
    public function destroy(Request $request, Product $product, CartService $cartService){
        $optionIds = $request->input('option_ids');

        $cartService->removeItemFromCart($product->id, $optionIds);

        return back()->with('success', 'Product was removed from cart successfully');
    }
    public function checkout(Request $request, CartService $cartService){
        \Stripe\Stripe::setApiKey(config('app.stripe_secret_key'));

        $vendorId = $request->input('vendor_id');

        $allCartItems = $cartService->getCartItemsGrouped();
        DB::beginTransaction();

        try {
            $checkoutCartItems = $allCartItems;
            if ($vendorId) {
                $checkoutCartItems = [$allCartItems[$vendorId]];
            }
            $orders = [];
            $lineItems = [];
            foreach ($checkoutCartItems as $item) {
                $user = $item['user'];
                $cartItems = $user['items'];

                $order = Order::create([
                   'stripe_session_id' => null,
                   'user_id' => $request->user()->id,
                   'vendor_user_id' => $user['id'],
                   'total_price' => $item['total_price'],
                   'status' => OrderStatusEnum::Draft->value,
                ]);

                $orders[] = $order;

                foreach ($cartItems as $cartItem) {
                    OrderItem::create([
                        'order_id' => $order->id,
                        'product_id' => $cartItem['product_id'],
                        'quantity' => $cartItem['quantity'],
                        'variation_type_option_ids' => $cartItem['option_ids'],
                        'price' => $cartItem['price'],
                    ]);

                    $desciption = collect($cartItem['options'])->map(function($item) {
                        return "{$item['type']['name']}: {$item['name']}";
                    })->implode(', ');

                    $lineItem = [
                        'price_data' => [
                            'currency' => config('app.currency'),
                            'product_data' => [
                                'name' => $cartItem['title'],
                                'images' => [$cartItem['image']],
                            ],
                            'unit_amount' => $cartItem['price'] * 100,
                        ],
                        'quantity' => $cartItem['quantity'],
                    ];
                    if ($desciption) {
                        $lineItem['price_data']['product_data']['description'] = $desciption;
                    }
                    $lineItems[] = $lineItem;
                }
            }

            $session = \Stripe\Checkout\Session::create([
                'customer_email' => $request->user()->email,
                'line_items' => $lineItems,
                'mode' => 'payment',
                'success_url' => route('stripe.success', []) . "?session_id={CHECKOUT_SESSION_ID}",
                'cancel_url' => route('stripe.failure', []),
            ]);

            foreach ($orders as $order) {
                $order->stripe_session_id = $session->id;
                $order->save();
            }

            DB::commit();
            return redirect($session->url);

        } catch (\Exception $e) {
            Log::error($e);
            DB::rollBack();
            return back()->with('error', $e->getMessage() ?: 'Something went wrong');
        }
    }
}
