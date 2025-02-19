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
use Filament\Forms\Components\Section;

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
    public function form(Form $form): Form
    {
        $types = $this->record->variationTypes;
        $fields = [];
        foreach ($types as $i => $type) {
            $fields[] = TextInput::make("variation_type_" . ($type) . ".id")
                ->hidden();
            $fields[] = TextInput::make("variation_type_" . ($type) . ".name")
                ->label($type->name);
        }
        return $form->schema([
            Repeater::make('variations')
                ->label('Variations')
                ->collapsible()
                ->defaultItems(1)
                ->columns(2)
                ->columnSpan(2)
                ->schema([
                    Section::make()->schema($fields)
                        ->columns(3),
                    TextInput::make('quantity')->label('Quantity')
                        ->numeric(),
                    TextInput::make('price')->label('Price')
                        ->numeric(),
                ])
        ]);
    }
    protected function mutateFormDataBeforeFill(array $data): array
    {
        if (!$this->record) {
            return $data;
        }

        $variations = $this->record->variations?->toArray() ?? [];
        $variationTypes = $this->record->variationTypes;

        if (!$variationTypes->count()) {
            return $data;
        }

        $data['variations'] = $this->mergeCartesianWithExisting($variationTypes, $variations);
        return $data;
    }
    private function mergeCartesianWithExisting($variationTypes, $existingData): array
    {
        $defaultQuantity = $this->record->quantity;
        $defaultPrice = $this->record->price;
        $cartesianProduct = $this->cartesianProduct($variationTypes, $defaultQuantity, $defaultPrice);

        $mergedResult = [];
        foreach ($cartesianProduct as $product) {
            $optionsIds = collect($product)
                ->filter(function ($value, $key) {
                    return str_starts_with((string) $key, 'variation_type_');
                })
                ->map(fn($option) => $option['id'])
                ->values()
                ->toArray();

            $match = array_filter($existingData, function ($existingOption) use ($optionsIds) {
                return $existingOption['variation_type_option_ids'] === $optionsIds;
            });

            if (!empty($match)) {
                $existingEntry = reset($match);
                $product['quantity'] = $existingEntry['quantity'];
                $product['price'] = $existingEntry['price'];
            } else {
                $product['quantity'] = $defaultQuantity;
                $product['price'] = $defaultPrice;
            }
            $mergedResult[] = $product;
        }
        return $mergedResult;
    }
    private function cartesianProduct($variationTypes, $defaultQuantity = null, $defaultPrice = null): array
    {
        $result = [[]];

        foreach ($variationTypes as $index => $variationType) {
            $temp = [];
            foreach ($variationType->options as $option) {
                foreach ($result as $combination) {
                    $newCombination = $combination + [
                        'variation_type_' . ($variationType->id) =>
                        ['id' => $option->id, 'name' => $option->name, 'label' => $variationType->name],
                    ];
                    $temp[] = $newCombination;
                }
            }
            $result = $temp;
        }
        foreach ($result as &$combination) {
            $combination['quantity'] = $defaultQuantity;
            $combination['price'] = $defaultPrice;
        }

        return $result;
    }
}
