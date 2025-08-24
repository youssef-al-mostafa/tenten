
<?php

use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;

Route::get('/d/{department:slug}/products', [ProductController::class, 'byDepartment'])
    ->name('product.byDepartment');
Route::get('', [])->name('products.new');
Route::get('/product/{product:id}', [ProductController::class, 'show'])->name('product.show');
