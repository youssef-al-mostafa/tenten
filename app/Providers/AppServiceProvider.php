<?php

namespace App\Providers;

use App\Services\CartService;
use Illuminate\Support\Facades\Schedule;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(CartService::class, function(){
            return new CartService();
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Schedule::command('payout:vendors')
                  ->monthlyOn(1,'00:00')
                  ->withoutOverlapping();
        Vite::prefetch(concurrency: 3);
    }
}
