<?php

namespace App\Filament\Pages;

use App\Enums\RolesEnum;
use App\Enums\ProductStatusEnum;
use Filament\Pages\Dashboard as BaseDashboard;
use Filament\Facades\Filament;
use Filament\Forms;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Forms\Form;
use Filament\Notifications\Notification;

class Dashboard extends BaseDashboard implements HasForms
{
    use InteractsWithForms;
    protected static string $view = 'filament.pages.dashboard';

    public $vendorUrl = '';
    public $qrCodeUrl = '';
    public $isEditing = false;
    public $data = [];

    public function mount(): void
    {
        $user = Filament::auth()->user();
        /** @var \App\Models\User $user */
        if ($user && $user->hasRole(RolesEnum::VENDOR->value)) {
            $vendor = $user->vendor;

            if ($vendor) {
                if ($vendor->store_name) {
                    try {
                        $this->vendorUrl = route('vendor.profile', trim($vendor->store_name));
                        $this->qrCodeUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=' . urlencode($this->vendorUrl);
                    } catch (\Exception $e) {
                        $this->vendorUrl = url('/');
                        $this->qrCodeUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=' . urlencode($this->vendorUrl);
                    }
                } else {
                    $this->vendorUrl = url('/');
                    $this->qrCodeUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=' . urlencode($this->vendorUrl);
                }

                $this->data = [
                    'name' => $user->name,
                    'email' => $user->email,
                    'store_name' => $vendor->store_name ?? '',
                    'store_description' => $vendor->store_description ?? '',
                    'store_address' => $vendor->store_address ?? '',
                    'cover_image' => $vendor->cover_image ? [$vendor->cover_image] : null,
                ];
            }
        }
    }

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('name')
                    ->label('Owner Name')
                    ->required()
                    ->maxLength(255),

                Forms\Components\TextInput::make('email')
                    ->label('Email')
                    ->email()
                    ->required()
                    ->maxLength(255)
                    ->helperText('Changing your email will require email verification to activate your account again.'),

                Forms\Components\TextInput::make('store_name')
                    ->label('Store Name')
                    ->required()
                    ->maxLength(255)
                    ->reactive()
                    ->afterStateUpdated(function ($state, callable $set) {
                        $formatted = strtolower(preg_replace('/\s+/', '-', $state));
                        $set('store_name', $formatted);
                    })
                    ->helperText(function ($state) {
                        if ($state) {
                            $formatted = ucwords(str_replace('-', ' ', $state));
                            return "Will be displayed as: {$formatted}";
                        }
                        return null;
                    }),

                Forms\Components\Textarea::make('store_description')
                    ->label('Store Description')
                    ->rows(3)
                    ->maxLength(500),

                Forms\Components\Textarea::make('store_address')
                    ->label('Store Address')
                    ->rows(2)
                    ->maxLength(255),

                Forms\Components\FileUpload::make('cover_image')
                    ->label('Cover Image')
                    ->image()
                    ->directory('vendor-covers')
                    ->disk('public')
                    ->visibility('public')
                    ->maxSize(5120)
                    ->helperText('Upload a cover image for your store. Max size: 5MB')
                    ->downloadable()
                    ->openable()
                    ->deletable(),
            ])
            ->statePath('data');
    }

    public function edit()
    {
        $this->isEditing = true;
    }

    public function cancelEdit()
    {
        $this->isEditing = false;
        $this->mount();
    }

    public function save()
    {
        $data = $this->form->getState();
        $user = Filament::auth()->user();
        $vendor = $user->vendor;

        $emailChanged = $user->email !== $data['email'];
        /** @var \App\Models\User $user */
        $user->update([
            'name' => $data['name'],
            'email' => $data['email'],
        ]);

        if ($vendor) {
            $vendor->update([
                'store_name' => $data['store_name'],
                'store_description' => $data['store_description'],
                'store_address' => $data['store_address'],
                'cover_image' => is_array($data['cover_image']) ? $data['cover_image'][0] ?? null : $data['cover_image'],
            ]);
        }

        if ($emailChanged) {
            $user->email_verified_at = null;
            $user->save();
            $user->sendEmailVerificationNotification();
            Filament::auth()->logout();
            request()->session()->invalidate();
            request()->session()->regenerateToken();

            Notification::make()
                ->title('Email Changed!')
                ->body('Please check your new email for verification. You have been logged out for security.')
                ->warning()
                ->duration(10000)
                ->send();

            return redirect()->route('login');
        } else {
            Notification::make()
                ->title('Profile Updated!')
                ->body('Your profile has been updated successfully.')
                ->success()
                ->send();
        }

        $this->isEditing = false;
        $this->mount();
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
        /** @var \App\Models\User $user */
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
            'store_address' => $vendor?->store_address ?? 'N/A',
            'cover_image' => $vendor?->cover_image,
            'products_count' => $productsCount,
            'active_products_count' => $activeProductsCount,
            'member_since' => $vendor?->created_at?->format('M Y') ?? 'N/A',
        ];
    }
}
