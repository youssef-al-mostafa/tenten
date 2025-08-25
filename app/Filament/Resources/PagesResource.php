<?php

namespace App\Filament\Resources;

use App\Filament\Resources\PagesResource\Pages;
use App\Models\Pages as PageModel;
use App\Services\FilamentFormBuilderService;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Actions\Action;

class PagesResource extends Resource
{
    protected static ?string $model = PageModel::class;

    protected static ?string $navigationIcon = 'heroicon-o-document-text';

    protected static ?string $navigationLabel = 'Pages';

    protected static ?string $modelLabel = 'Page';

    protected static ?string $pluralModelLabel = 'Pages';

    public static function form(Form $form): Form
    {
        $formBuilder = app(FilamentFormBuilderService::class);

        return $form->schema($formBuilder->buildFormSchema($form->getRecord()));
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('slug')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('template_name')
                    ->label('Template')
                    ->badge()
                    ->searchable(),

                IconColumn::make('is_active')
                    ->boolean()
                    ->sortable(),

                TextColumn::make('sort_order')
                    ->numeric()
                    ->sortable(),

                TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable(),
            ])
            ->filters([
                SelectFilter::make('template_name')
                    ->label('Template')
                    ->options(function () {
                        return PageModel::distinct('template_name')
                            ->pluck('template_name', 'template_name')
                            ->toArray();
                    }),

                Tables\Filters\TernaryFilter::make('is_active')
                    ->label('Status')
                    ->boolean()
                    ->trueLabel('Active')
                    ->falseLabel('Inactive'),
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ])
            ->defaultSort('sort_order')
            ->headerActions([
                Action::make('sync_templates')
                    ->label('Sync Templates')
                    ->icon('heroicon-o-arrow-path')
                    ->color('success')
                    ->action(function () {
                        $syncService = app(\App\Services\TemplateSyncService::class);
                        $results = $syncService->syncAllTemplates();

                        \Filament\Notifications\Notification::make()
                            ->title('Templates Synced Successfully')
                            ->body(sprintf(
                                'Created: %d, Updated: %d, Errors: %d',
                                count($results['created']),
                                count($results['updated']),
                                count($results['errors'])
                            ))
                            ->success()
                            ->send();
                    }),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListPages::route('/'),
            'create' => Pages\CreatePages::route('/create'),
            'edit' => Pages\EditPages::route('/{record}/edit'),
            'view' => Pages\ViewPages::route('/{record}'),
        ];
    }

    public static function getNavigationBadge(): ?string
    {
        return static::getModel()::count();
    }

    public static function getNavigationBadgeColor(): ?string
    {
        return static::getModel()::count() > 10 ? 'warning' : 'primary';
    }
}
