<?php

namespace App\Filament\Resources;

use App\Enums\RolesEnum;
use App\Filament\Resources\NewsletterCampaignResource\Pages;
use App\Filament\Resources\NewsletterCampaignResource\RelationManagers;
use App\Models\Newsletter;
use App\Models\NewsletterCampaign;
use App\Models\User;
use Filament\Facades\Filament;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class NewsletterCampaignResource extends Resource
{
    protected static ?string $model = NewsletterCampaign::class;

    protected static ?string $navigationIcon = 'heroicon-o-envelope';

    protected static ?string $navigationLabel = 'Email Campaigns';

    protected static ?string $modelLabel = 'Email Campaign';

    protected static ?string $pluralModelLabel = 'Email Campaigns';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('title')
                    ->required()
                    ->maxLength(255),

                Forms\Components\Textarea::make('content')
                    ->label('Description')
                    ->required()
                    ->rows(4)
                    ->maxLength(1000)
                    ->columnSpanFull(),

                Forms\Components\Select::make('campaign_type')
                    ->label('Email Type')
                    ->options([
                        'sale' => 'Sale',
                        'announcement' => 'Announcement',
                        'newsletter' => 'Newsletter',
                        'other' => 'Other',
                    ])
                    ->required()
                    ->default('newsletter'),

                Forms\Components\CheckboxList::make('recipient_types')
                    ->label('Send To')
                    ->options([
                        'all' => 'All Users (includes newsletter subscribers)',
                        'customers' => 'Customers',
                        'vendors' => 'Vendors',
                        'admins' => 'Admins',
                        'subscribers' => 'Newsletter Subscribers',
                    ])
                    ->required()
                    ->columns(2)
                    ->columnSpanFull(),

                Forms\Components\TextInput::make('recipient_count')
                    ->label('Recipients')
                    ->numeric()
                    ->default(0)
                    ->disabled()
                    ->dehydrated(false),

                Forms\Components\DateTimePicker::make('sent_at')
                    ->label('Sent Date')
                    ->default(now())
                    ->disabled()
                    ->dehydrated(false),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('title')
                    ->searchable()
                    ->sortable(),

                Tables\Columns\TextColumn::make('campaign_type')
                    ->label('Type')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'sale' => 'success',
                        'announcement' => 'warning',
                        'newsletter' => 'info',
                        'other' => 'gray',
                    }),

                Tables\Columns\TextColumn::make('recipient_types')
                    ->label('Sent To')
                    ->formatStateUsing(function ($state): string {
                        if (is_array($state)) {
                            return implode(', ', array_map('ucfirst', $state));
                        }
                        if (is_string($state)) {
                            $decoded = json_decode($state, true);
                            return $decoded ? implode(', ', array_map('ucfirst', $decoded)) : $state;
                        }
                        return 'N/A';
                    }),

                Tables\Columns\TextColumn::make('recipient_count')
                    ->label('Recipients')
                    ->numeric()
                    ->sortable(),

                Tables\Columns\TextColumn::make('sent_at')
                    ->label('Sent Date')
                    ->dateTime()
                    ->sortable(),
            ])
            ->defaultSort('sent_at', 'desc')
            ->filters([
                Tables\Filters\SelectFilter::make('campaign_type')
                    ->label('Email Type')
                    ->options([
                        'sale' => 'Sale',
                        'announcement' => 'Announcement',
                        'newsletter' => 'Newsletter',
                        'other' => 'Other',
                    ]),
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListNewsletterCampaigns::route('/'),
            'create' => Pages\CreateNewsletterCampaign::route('/create'),
        ];
    }

    public static function canViewAny(): bool
    {
        $user = Filament::auth()->user();
        return $user && $user->roles->contains(
            fn($role) => in_array(
                $role->name,
                [
                    RolesEnum::ADMIN->value,
                    RolesEnum::MASTER_ADMIN->value,
                ]
            )
        );
    }

    public static function calculateRecipientCount(array $recipientTypes): int
    {
        $emails = collect();

        foreach ($recipientTypes as $type) {
            switch ($type) {
                case 'all':
                    $userEmails = User::pluck('email');
                    $subscriberEmails = Newsletter::where('status', 'active')->pluck('email');
                    return $userEmails->concat($subscriberEmails)->unique()->count();
                case 'customers':
                    $emails = $emails->concat(
                        User::whereHas('roles', function ($query) {
                            $query->where('name', RolesEnum::CUSTOMER->value);
                        })->pluck('email')
                    );
                    break;
                case 'vendors':
                    $emails = $emails->concat(
                        User::whereHas('roles', function ($query) {
                            $query->where('name', RolesEnum::VENDOR->value);
                        })->pluck('email')
                    );
                    break;
                case 'admins':
                    $emails = $emails->concat(
                        User::whereHas('roles', function ($query) {
                            $query->whereIn('name', [RolesEnum::ADMIN->value, RolesEnum::MASTER_ADMIN->value]);
                        })->pluck('email')
                    );
                    break;
                case 'subscribers':
                    $emails = $emails->concat(
                        Newsletter::where('status', 'active')->pluck('email')
                    );
                    break;
            }
        }

        return $emails->unique()->count();
    }
}
