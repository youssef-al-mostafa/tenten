<?php

namespace App\Filament\Resources\ProductResource\Pages;

use App\Enums\ProductVariationTypesEnum;
use App\Filament\Resources\ProductResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;
use Filament\Forms\Form;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\SpatieMediaLibraryFileUpload;

class ProductVariation extends EditRecord
{
    protected static string $resource = ProductResource::class;
    protected static ?string $navigationIcon = 'heroicon-s-shopping-bag';
    protected static ?string $title = 'Variations';
    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
    protected function mutateFormDataBeforeFill(array $data): array
    {
        $variations = $this->record->variations->toArray();
        $data['variations'] = $this->mergeCartesianWithExisting($this->record->variationTypes, $variations);
        return [];
    }
    private function mergeCartesianWithExisting($variationTypes, $existingData): array
    {
        $defaultQuantity = $this->record->quantity;
        $defaultPrice = $this->record->price;
        $cartesianProduct = $this->cartesianProduct($variationTypes, $defaultQuantity, $defaultPrice);

        $mergedResult = [];
        foreach ($cartesianProduct as $product) {
           $optionsIds = collect($product)
              ->filter(fn ($key,$value) => str_starts_with($key, 'variation_type_'))
              ->map(fn ($option) => $option['id'])
              ->values()
              ->toArray();

            $match = array_filter($existingData , function ($existingOption) use ($optionsIds) {
                   return $existingOption['variation_type_option_ids'] === $optionsIds;
            });

            if (!empty($match)) {
                $existingEntry = reset($match);
                $product['quantity'] = $existingEntry['quantity'];
                $product['price'] = $existingEntry['price'];
            }else {
                $product['quantity'] = $defaultQuantity;
                $product['price'] = $defaultPrice;
            }
            $mergedResult[] = $product ;
        }
        return $mergedResult;
    }
    private function cartesianProduct($variationTypes, $defaultQuantity = null, $defaultPrice = null): array{
        return [[]];
    }
}
