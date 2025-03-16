<?php

use App\Http\Controllers\CartController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [ProductController::class,'index']);
Route::get('/product/{product:slug}', [ProductController::class,'show'])->name('product.show');

Route::controller(CartController::class)->group(function(){
    Route::get('/cart', 'index')->name('cart.index');
    Route::post('cart/add/{product}', 'store')->name('cart.store');
    Route::patch('cart/update/{product}', 'update')->name('cart.update');
    Route::delete('cart/remove/{product}', 'destroy')->name('cart.destroy');
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
