
<?php

use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;

Route::get('/products', [ProductController::class, 'index'])->name('products.index');
Route::get('/d/{department:slug}/products', [ProductController::class, 'byDepartment'])
    ->name('product.byDepartment');
Route::get('/products/new-arrivals', [ProductController::class, 'newArrivals'])->name('products.new');
Route::get('/product/{product:id}', [ProductController::class, 'show'])->name('product.show');
