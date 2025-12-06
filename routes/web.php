<?php

use App\Enums\RolesEnum;
use App\Http\Controllers\CartController;
use App\Http\Controllers\NewsletterController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\StripeController;
use App\Http\Controllers\VendorController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Guest Routes
Route::get('/', [PageController::class, 'home'])->name('home');
Route::get('/help', [PageController::class, 'help'])->name('help');

//Payment
Route::controller(CartController::class)->group(function () {
    Route::get('/cart', 'index')->name('cart.index');
    Route::post('cart/add/{product}', 'store')->name('cart.store');
    Route::patch('cart/update/{product}', 'update')->name('cart.update');
    Route::delete('cart/remove/{product}', 'destroy')->name('cart.destroy');
});
Route::post('/stripe/webhook', [StripeController::class, 'webhook'])->name('stripe.webhook');

// Newsletter
Route::post('/newsletter/subscribe', [NewsletterController::class, 'store'])
       ->name('newsletter.subscribe');
Route::get('/newsletter/unsubscribe/{email}', [NewsletterController::class, 'unsubscribe'])
       ->name('newsletter.unsubscribe');

//Others
Route::get('/vendor/{vendor:store_name}', [VendorController::class, 'profile'])
       ->name('vendor.profile');
Route::get('/vendors', [VendorController::class, 'allVendors'])
       ->name('vendor.all');

// Auth Routes
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::middleware(['verified'])->group(function () {

        Route::get('/dashboard', function () {
            return Inertia::render('Dashboard');
        })->name('dashboard');

        Route::post('/cart/checkout', [CartController::class, 'checkout'])->name('cart.checkout');

        Route::get('/stripe/success', [StripeController::class, 'success'])->name('stripe.success');
        Route::get('/stripe/failure', [StripeController::class, 'failure'])->name('stripe.failure');
        Route::post('/stripe/connect', [StripeController::class, 'connect'])
            ->name('stripe.connect')
            ->middleware(['role:' . RolesEnum::VENDOR->value]);

        Route::post('/become-vendor', [VendorController::class, 'store'])->name('vendor.store');
    });
});

require __DIR__ . '/auth.php';
require __DIR__ . '/product.php';
require __DIR__ . '/api.php';
