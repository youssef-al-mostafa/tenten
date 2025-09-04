<?php

namespace App\Filament\Pages;

use App\Enums\RolesEnum;
use App\Enums\ProductStatusEnum;
use Filament\Pages\Dashboard as BaseDashboard;
use Filament\Facades\Filament;
use Filament\Support\Enums\IconPosition;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\Widget;
use Illuminate\Contracts\View\View;

class Dashboard extends BaseDashboard
{
    protected static string $view = 'filament.pages.dashboard';

    public $vendorUrl = '';
    public $qrCodeUrl = '';

    public function mount(): void
    {
        $user = Filament::auth()->user();
        
        if ($user && $user->hasRole(RolesEnum::VENDOR->value)) {
            $vendor = $user->vendor;
            
            if ($vendor) {
                $this->vendorUrl = route('vendor.profile', $vendor->store_name);
                $this->qrCodeUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=' . urlencode($this->vendorUrl);
            }
        }
    }

    public function copyUrl()
    {
        \Filament\Notifications\Notification::make()
            ->title('URL copied to clipboard!')
            ->success()
            ->send();
    }

    public function getVendorData(): ?array
    {
        $user = Filament::auth()->user();
        
        if (!$user || !$user->hasRole(RolesEnum::VENDOR->value)) {
            return null;
        }

        $vendor = $user->vendor;
        $productsCount = \App\Models\Product::where('created_by', $user->id)->count();
        $activeProductsCount = \App\Models\Product::where('created_by', $user->id)->where('status', ProductStatusEnum::Published->value)->count();

        return [
            'name' => $user->name,
            'email' => $user->email,
            'store_name' => $vendor?->store_name ?? 'N/A',
            'store_description' => $vendor?->store_description ?? 'N/A',
            'phone' => $vendor?->phone ?? 'N/A',
            'address' => $vendor?->address ?? 'N/A',
            'products_count' => $productsCount,
            'active_products_count' => $activeProductsCount,
            'member_since' => $vendor?->created_at?->format('M Y') ?? 'N/A',
        ];
    }
}