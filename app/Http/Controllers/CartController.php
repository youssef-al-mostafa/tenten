<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Services\CartService;
use Illuminate\Http\Request;
use Inertia\Inertia;

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
            $data['option_ids']
        );

        return back()->with('success', 'Product added to cart successfully');
    }
    public function update(Request $request, Product $product, CartService $cartService){

        $request->validate([
            'quantity' => ['integer', 'min:1'],
        ]);

        $optionIds = $request->input('option_ids');
        $quantity = $request->input('quantity');

        $cartService->updateItemQuantity($product->id, $quantity, $optionIds);

        return back()->with('success', 'Quantity was updated successfully');
    }

    public function destroy(Request $request, Product $product, CartService $cartService){
        $optionIds = $request->input('option_ids');

        $cartService->removeItemFromCart($product->id, $optionIds);

        return back()->with('success', 'Product was removed from cart successfully');
    }

}
