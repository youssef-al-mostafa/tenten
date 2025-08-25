<?php

namespace App\Filament\Resources\PagesResource\Pages;

use App\Filament\Resources\PagesResource;
use Filament\Actions;
use Filament\Resources\Pages\ViewRecord;

class ViewPages extends ViewRecord
{
    protected static string $resource = PagesResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\EditAction::make(),
        ];
    }
}
