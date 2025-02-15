<?php

namespace App\Filament\Resources;

use App\Enums\Enums\ProductStatusEnum;
use App\Filament\Resources\ProductResource\Pages;
use App\Models\Product;
use App\Models\Category;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Illuminate\Support\Str;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Select;
use Illuminate\Database\Eloquent\Builder;


class ProductResource extends Resource
{
    protected static ?string $model = Product::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

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
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
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
        ];
    }
}
