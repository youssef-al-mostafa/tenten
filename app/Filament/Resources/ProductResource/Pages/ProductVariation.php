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
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;

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
        foreach ($types as $type) {
            $fields[] = TextInput::make("variation_type_" . ($type->id) . ".id")
                ->hidden();
            $fields[] = TextInput::make("variation_type_" . ($type->id) . ".name")
                ->label($type->name);
        }
        return $form->schema([
            Repeater::make('variations')
                ->label(false)
                ->collapsible()
                ->defaultItems(1)
                ->columns(2)
                ->addable(false)
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

        $variations = $this->record->variation?->toArray() ?? [];
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

        return collect($cartesianProduct)->map(function ($product) use ($existingData, $defaultQuantity, $defaultPrice) {
            $optionsIds = collect($product)
                ->filter(fn($value, $key) => str_starts_with((string)$key, 'variation_type_'))
                ->map(fn($option) => $option['id'])
                ->values()
                ->toArray();

            $match = collect($existingData)->first(function ($variation) use ($optionsIds) {
                return json_encode($variation['variation_type_option_ids']) === json_encode($optionsIds);
            });

            return [
                ...collect($product)
                    ->filter(fn($value, $key) => str_starts_with((string)$key, 'variation_type_'))
                    ->map(fn($value) => [
                        'name' => $value['name'],
                        'label' => $value['label']
                    ])
                    ->toArray(),
                'quantity' => $match['quantity'] ?? $defaultQuantity,
                'price' => $match['price'] ?? $defaultPrice,
            ];
        })->toArray();
    }
    private function cartesianProduct($variationTypes, $defaultQuantity = null, $defaultPrice = null): array
    {
        $result = [[]];

        foreach ($variationTypes as $variationType) {
            Log::info('Processing variation type:', ['type' => $variationType->toArray()]);
            $temp = [];
            foreach ($variationType->options as $option) {
                Log::info('Processing option:', ['option' => $option->toArray()]);
                foreach ($result as $combination) {
                    $newCombination = array_merge($combination, [
                        'variation_type_' . $variationType->id => [
                            'id' => (int)$option->id,
                            'name' => $option->name,
                            'label' => $variationType->name
                        ]
                    ]);
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

    protected function mutateFormDataBeforeSave(array $data): array
    {
        Log::info('Incoming save data:', $data);

        $formatedData = [];
        foreach ($data['variations'] as $option) {
            $variationTypeOptionIds = [];
            $names = [];

            foreach ($this->record->variationTypes as $variationType) {
                $key = 'variation_type_' . $variationType->id;

                if (isset($option[$key]['name'])) {
                    $matchingOption = $variationType->options()
                        ->where('name', $option[$key]['name'])
                        ->first();

                    if ($matchingOption) {
                        $variationTypeOptionIds[] = (int)$matchingOption->id;
                        $names[] = $matchingOption->name;
                    }
                }
            }

            if (!empty($variationTypeOptionIds)) {
                $formatedData[] = [
                    'name' => implode(' / ', $names),
                    'quantity' => $option['quantity'],
                    'price' => $option['price'],
                    'variation_type_option_ids' => $variationTypeOptionIds
                ];
            }
        }

        $data['variations'] = $formatedData;
        return $data;
    }

    protected function handleRecordUpdate(Model $record, array $data): Model
    {
        $variation = $data['variations'];
        unset($data['variations']);

        $record->update($data);
        $record->variation()->delete();
        $record->variation()->createMany($variation);

        return $record;
    }
}
