<?php

namespace App\Filament\Resources;

use App\Enums\ProductStatusEnum;
use App\Filament\Resources\ProductResource\Pages;
use App\Models\Product;
use App\Filament\Resources\ProductResource\Pages\ProductImages;
use App\Filament\Resources\ProductResource\Pages\ProductVariationTypes;
use App\Filament\Resources\ProductResource\Pages\EditProduct;
use App\Filament\Resources\ProductResource\Pages\ProductVariation;
use Filament\Resources\Pages\Page;
use Filament\Forms;
use Filament\Forms\Components\Section;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Illuminate\Support\Str;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Select;
use Filament\Pages\SubNavigationPosition;
use Illuminate\Database\Eloquent\Builder;
use Filament\Tables\Columns\SpatieMediaLibraryImageColumn;

class ProductResource extends Resource
{
    protected static ?string $model = Product::class;

    protected static SubNavigationPosition $subNavigationPosition = SubNavigationPosition::End;

    protected static ?string $navigationIcon = 'heroicon-s-shopping-cart';

    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()->forVendor();
    }
    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Grid::make()
                    ->schema([
                        TextInput::make('title')
                            ->live(onBlur: true)
                            ->required()
                            ->afterStateUpdated(
                                fn(String $operation, $state, callable $set) => $set('slug', Str::slug($state))
                            ),

                        TextInput::make('slug')
                            ->required(),

                        Select::make("department_id")
                            ->label('Department')
                            ->required()
                            ->preload()
                            ->searchable()
                            ->relationship('department', 'name')
                            ->reactive()
                            ->afterStateUpdated(
                                fn(callable $set) => $set('category_id', null)
                            ),

                        Select::make('category_id')
                            ->label('Category')
                            ->relationship(
                                name: 'category',
                                titleAttribute: 'name',
                                modifyQueryUsing: function (Builder $query, callable $get) {
                                    $department_id = $get('department_id');
                                    if ($department_id) {
                                        return $query->where('department_id', $department_id);
                                    }
                                }
                            )
                            ->required()
                            ->preload()
                            ->searchable(),
                    ]),
                Forms\Components\RichEditor::make('description')
                    ->required()
                    ->columnSpan(2)
                    ->toolbarButtons(
                        [
                            'blockquote',
                            'bold',
                            'bulletlist',
                            'h2',
                            'h3',
                            'italic',
                            'link',
                            'orderedList',
                            'strike',
                            'underline',
                            'undo',
                            'redo',
                            'table'
                        ]
                    ),
                TextInput::make('price')
                    ->required()
                    ->numeric(),
                TextInput::make('quantity')
                    ->required()
                    ->integer(),
                Select::make('status')
                    ->label('Status')
                    ->options(ProductStatusEnum::labels())
                    ->default(ProductStatusEnum::Draft),
                Section::make('SEO')
                    ->collapsible()
                    ->schema([
                        Forms\Components\TextInput::make(name: 'meta_title'),
                        Forms\Components\Textarea::make(name: 'meta_description')
                    ])
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make(name: 'id'),
                SpatieMediaLibraryImageColumn::make('images')
                    ->label('Image')
                    ->collection('images')
                    ->limit(1)
                    ->conversion('thumb'),
                TextColumn::make(name: 'title')
                    ->sortable()
                    ->searchable()
                    ->words(10),
                TextColumn::make(name: 'status')
                    ->sortable()
                    ->label('Status')
                    ->badge()
                    ->colors( ProductStatusEnum::colors()),
                TextColumn::make(name: 'price')
                    ->sortable(),
                TextColumn::make(name: 'quantity')
                    ->sortable(),
                TextColumn::make(name: 'category.name')
                    ->label('Category')
                    ->sortable(),
                TextColumn::make(name: 'department.name')
                    ->label('Department'),
                TextColumn::make(name: 'created_at')
                    ->sortable()
                    ->dateTime(),
                TextColumn::make(name: 'updated_at')
                    ->sortable()
                    ->dateTime(),
            ])
            ->filters([
                SelectFilter::make('status')
                  ->options(ProductStatusEnum::labels()),
                SelectFilter::make('department_id')
                   ->relationship('department', 'name'),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
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
            'index' => Pages\ListProducts::route('/'),
            'create' => Pages\CreateProduct::route('/create'),
            'edit' => Pages\EditProduct::route('/{record}/edit'),
            'images' => Pages\ProductImages::route('/{record}/images'),
            'variation-types' => Pages\ProductVariationTypes::route('/{record}/variation-types'),
            'variation' => Pages\ProductVariation::route('/{record}/variation'),
        ];
    }
    public static function getRecordSubNavigation(Page $page): array{
        return
            $page->generateNavigationItems([
                EditProduct::class,
                ProductImages::class,
                ProductVariationTypes::class,
                ProductVariation::class,
            ]);
    }
}
