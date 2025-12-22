<?php

namespace App\Filament\Resources;

use App\Filament\Resources\VendorResource\Pages;
use App\Filament\Resources\VendorResource\RelationManagers;
use App\Models\Vendor;
use App\Enums\VendorStatusEnum;
use App\Enums\RolesEnum;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Filament\Facades\Filament;

class VendorResource extends Resource
{
    protected static ?string $model = Vendor::class;

    protected static ?string $navigationIcon = 'heroicon-o-building-storefront';
    protected static ?string $navigationLabel = 'Vendors';
    protected static ?string $modelLabel = 'Vendor';
    protected static ?string $pluralModelLabel = 'Vendors';

    public static function canAccess(): bool
    {
        $user = Filament::auth()->user();
        return $user && ($user->hasRole(RolesEnum::ADMIN->value) || $user->hasRole(RolesEnum::MASTER_ADMIN->value));
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Select::make('status')
                    ->label('Status')
                    ->options([
                        VendorStatusEnum::Pending->value => 'Pending',
                        VendorStatusEnum::Approved->value => 'Approved',
                        VendorStatusEnum::Rejected->value => 'Rejected',
                    ])
                    ->required()
                    ->native(false),
                Forms\Components\TextInput::make('store_name')
                    ->label('Store Name')
                    ->required()
                    ->maxLength(255),
                Forms\Components\Textarea::make('store_description')
                    ->label('Store Description')
                    ->columnSpanFull(),
                Forms\Components\TextInput::make('store_address')
                    ->label('Store Address')
                    ->maxLength(255),
                Forms\Components\FileUpload::make('cover_image')
                    ->label('Cover Image')
                    ->image()
                    ->directory('vendor-covers')
                    ->disk('public')
                    ->visibility('public'),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('user.name')
                    ->label('Vendor Name')
                    ->sortable()
                    ->searchable(),
                Tables\Columns\TextColumn::make('user.email')
                    ->label('Email')
                    ->sortable()
                    ->searchable(),
                Tables\Columns\IconColumn::make('user.email_verified_at')
                    ->label('Email Verified')
                    ->boolean()
                    ->getStateUsing(fn ($record) => !is_null($record->user->email_verified_at)),
                Tables\Columns\TextColumn::make('store_name')
                    ->label('Store Name')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\SelectColumn::make('status')
                    ->label('Status')
                    ->options([
                        VendorStatusEnum::Pending->value => 'Pending',
                        VendorStatusEnum::Approved->value => 'Approved',
                        VendorStatusEnum::Rejected->value => 'Rejected',
                    ])
                    ->selectablePlaceholder(false),
                Tables\Columns\TextColumn::make('products_count')
                    ->label('Total Products')
                    ->getStateUsing(fn ($record) => $record->user->products()->count())
                    ->sortable(),
                Tables\Columns\TextColumn::make('active_products_count')
                    ->label('Active Products')
                    ->getStateUsing(fn ($record) => $record->user->products()->where('status', 'published')->count())
                    ->sortable(),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Joined')
                    ->dateTime()
                    ->sortable()
                    ->since(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->options([
                        VendorStatusEnum::Pending->value => 'Pending',
                        VendorStatusEnum::Approved->value => 'Approved',
                        VendorStatusEnum::Rejected->value => 'Rejected',
                    ]),
                Tables\Filters\Filter::make('email_verified')
                    ->label('Email Verified')
                    ->query(fn (Builder $query): Builder => $query->whereHas('user', fn ($q) => $q->whereNotNull('email_verified_at'))),
            ])
            ->actions([
                Tables\Actions\EditAction::make()
                    ->slideOver(),
            ])
            ->bulkActions([])
            ->defaultSort('created_at', 'desc');
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
            'index' => Pages\ListVendors::route('/'),
            'edit' => Pages\EditVendor::route('/{record}/edit'),
        ];
    }

    public static function canCreate(): bool
    {
        return false;
    }

    public static function canDelete($record): bool
    {
        return false;
    }

    public static function canDeleteAny(): bool
    {
        return false;
    }
}
