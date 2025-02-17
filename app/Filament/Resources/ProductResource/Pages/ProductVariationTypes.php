<?php

namespace App\Filament\Resources\ProductResource\Pages;

use App\Enums\Enums\ProductVariationTypesEnum;
use App\Filament\Resources\ProductResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;
use Filament\Forms\Form;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Select;

class ProductVariationTypes extends EditRecord
{
    protected static string $resource = ProductResource::class;


    protected static ?string $navigationIcon = 'heroicon-m-puzzle-piece';
    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Repeater::make('variationTypes')
                    ->relationship()
                    ->collapsible()
                    ->defaultItems(1)
                    ->addActionLabel('Add new variation type')
                    ->columnSpan(2)
                    ->columns(2)
                    ->schema([
                        TextInput::make('name')
                            ->required()
                            ->maxLength(255),
                        Select::make('type')
                            ->options(ProductVariationTypesEnum::labels())
                            ->required(),
                        Repeater::make('options'),
                        TextInput::make('price')
                            ->required()
                            ->numeric(),
                        TextInput::make('price_percentage')
                            ->required()
                            ->numeric(),
                        Select::make('stock_management')
                            ->options([
                                'enabled' => 'Enabled',
                                'disabled' => 'Disabled',
                            ])
                            ->required(),
                        TextInput::make('stock')
                            ->required()
                            ->numeric(),
                    ])
            ]);
    }
}
