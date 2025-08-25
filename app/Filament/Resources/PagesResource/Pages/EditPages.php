<?php

namespace App\Filament\Resources\PagesResource\Pages;

use App\Filament\Resources\PagesResource;
use App\Services\FilamentFormBuilderService;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;
use Filament\Forms\Form;
use Illuminate\Support\Facades\Log;

class EditPages extends EditRecord
{
    protected static string $resource = PagesResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\ViewAction::make(),
            Actions\DeleteAction::make(),
        ];
    }

    public function form(Form $form): Form
    {
        $formBuilder = app(FilamentFormBuilderService::class);

        return $form->schema($formBuilder->buildFormSchema($this->getRecord()));
    }

    protected function mutateFormDataBeforeSave(array $data): array
    {
        if (isset($data['template_name']) && !isset($data['template_schema'])) {
            $templateService = app(\App\Services\TemplateService::class);
            try {
                $data['template_schema'] = $templateService->loadTemplate($data['template_name']);
            } catch (\Exception $e) {
                Log::error('Error loading template: ' . $e->getMessage(), [
                    'exception' => $e,
                    'template_name' => $data['template_name'] ?? null,
                ]);
            }
        }
        return $data;
    }
}
