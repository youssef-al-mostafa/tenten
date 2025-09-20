<?php

namespace App\Services;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Components\Hidden;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Grid;
use Filament\Forms\Components\Select;
use App\Models\Pages as PageModel;
use Illuminate\Container\Attributes\Log as AttributesLog;
use Illuminate\Support\Str;
use Livewire\Features\SupportFileUploads\TemporaryUploadedFile;
use Illuminate\Support\Facades\Log;

class FilamentFormBuilderService
{
    private TemplateService $templateService;

    public function __construct(TemplateService $templateService)
    {
        $this->templateService = $templateService;
    }

    /**
     * Build dynamic form schema from template
     */
    public function buildFormSchema(?PageModel $record = null): array
    {
        $schema = [];

        $schema[] = Section::make('Page Information')
            ->schema([
                TextInput::make('name')
                    ->required()
                    ->maxLength(255)
                    ->live(onBlur: true)
                    ->afterStateUpdated(function ($state, callable $set) use ($record) {
                        if (!$record) {
                            $set('slug', Str::slug($state));
                        }
                    }),

                TextInput::make('slug')
                    ->required()
                    ->maxLength(255)
                    ->unique(PageModel::class, 'slug', ignoreRecord: true),

                TextInput::make('template_name')
                    ->required()
                    ->datalist($this->templateService->getAllTemplateNames())
                    ->live(onBlur: true)
                    ->afterStateUpdated(fn($state, callable $set) => $this->loadTemplateSchema($state, $set)),

                Toggle::make('is_active')
                    ->default(true),

                TextInput::make('sort_order')
                    ->numeric()
                    ->default(0),

                Hidden::make('template_schema'),
            ])
            ->columns(2);

        if ($record && $record->template_schema) {
            $schema[] = $this->buildContentSections($record->template_schema, $record);
        }

        return $schema;
    }

    /**
     * Build content sections from template schema
     */
    private function buildContentSections(array $templateSchema, PageModel $record): Section
    {
        $sections = [];
        $templateFields = $templateSchema['fields'] ?? [];
        $templateSections = $templateSchema['sections'] ?? [];

        foreach ($templateSections as $sectionKey) {
            if (isset($templateFields[$sectionKey])) {
                $sections[] = $this->buildSectionForm($sectionKey, $templateFields[$sectionKey]);
            } else {
                $sections[] = $this->buildEmptySection($sectionKey);
            }
        }

        return Section::make('Page Content')
            ->schema($sections)
            ->collapsible();
    }

    /**
     * Build form for individual section
     */
    private function buildSectionForm(string $sectionKey, array $fieldDefinitions): Section
    {
        $fields = [];

        $fields[] = Grid::make(2)->schema([
            Toggle::make("content.{$sectionKey}.is_active")
                ->label('Section Active')
                ->default(true),

            TextInput::make("content.{$sectionKey}.sort_order")
                ->label('Section Order')
                ->numeric()
                ->default(0),
        ]);
        foreach ($fieldDefinitions as $fieldName => $fieldConfig) {
            if ($fieldName === 'analytics' && is_array($fieldConfig)) {
                $fields[] = $this->buildAnalyticsFields($sectionKey, $fieldConfig);
            } elseif (isset($fieldConfig['type']) && $fieldConfig['type'] === 'repeater') {
                $fields[] = $this->buildRepeaterField($sectionKey, $fieldName, $fieldConfig);
            } else {
                $fields[] = $this->buildFieldComponent($sectionKey, $fieldName, $fieldConfig);
            }
        }

        return Section::make($this->humanizeString($sectionKey))
            ->schema($fields)
            ->collapsible()
            ->collapsed();
    }

    /**
     * Build repeater field component
     */
    private function buildRepeaterField(string $sectionKey, string $fieldName, array $fieldConfig): Repeater
    {
        $repeaterFields = [];
        $repeaterFieldDefinitions = $fieldConfig['fields'] ?? [];

        foreach ($repeaterFieldDefinitions as $repeaterFieldName => $repeaterFieldConfig) {
            $repeaterFields[] = $this->buildSimpleFieldComponent($repeaterFieldName, $repeaterFieldConfig);
        }

        $repeater = Repeater::make("content.{$sectionKey}.{$fieldName}")
            ->label($this->humanizeString($fieldName))
            ->schema($repeaterFields)
            ->collapsible()
            ->reorderable()
            ->cloneable()
            ->columns(2);

        if (isset($fieldConfig['min_items'])) {
            $repeater = $repeater->minItems($fieldConfig['min_items']);
        }

        if (isset($fieldConfig['max_items'])) {
            $repeater = $repeater->maxItems($fieldConfig['max_items']);
        }

        $defaultItems = $fieldConfig['default_items'] ?? 1;
        $repeater = $repeater->defaultItems($defaultItems);

        return $repeater;
    }

    /**
     * Build simple field component for repeater items
     */
    private function buildSimpleFieldComponent(string $fieldName, array $fieldConfig): mixed
    {
        $component = match ($fieldConfig['type']) {
            'string' => TextInput::make($fieldName),
            'text' => Textarea::make($fieldName)->rows(3),
            'number' => TextInput::make($fieldName)->numeric(),
            'image' => FileUpload::make($fieldName)
                ->image()
                ->disk('public')
                ->directory("content/repeater")
                ->preserveFilenames(),
            'select' => Select::make($fieldName)
                ->options($fieldConfig['options'] ?? []),
            default => TextInput::make($fieldName)
        };

        $component = $component->label($this->humanizeString($fieldName));

        if (isset($fieldConfig['required']) && $fieldConfig['required']) {
            $component = $component->required();
        }

        if (isset($fieldConfig['default'])) {
            $component = $component->default($fieldConfig['default']);
        }

        if (isset($fieldConfig['max_length'])) {
            $component = $component->maxLength($fieldConfig['max_length']);
        }

        if (isset($fieldConfig['min']) && isset($fieldConfig['max'])) {
            $component = $component->minValue($fieldConfig['min'])->maxValue($fieldConfig['max']);
        }

        return $component;
    }

    /**
     * Build section with no fields
     */
    private function buildEmptySection(string $sectionKey): Section
    {
        return Section::make($this->humanizeString($sectionKey))
            ->schema([
                Grid::make(2)->schema([
                    Toggle::make("content.{$sectionKey}.is_active")
                        ->label('Section Active')
                        ->default(true),

                    TextInput::make("content.{$sectionKey}.sort_order")
                        ->label('Section Order')
                        ->numeric()
                        ->default(0),
                ])
            ])
            ->collapsible()
            ->collapsed();
    }

    /**
     * Build analytics/statistics fields
     */
    private function buildAnalyticsFields(string $sectionKey, array $analyticsConfig): Repeater
    {
        return Repeater::make("content.{$sectionKey}.analytics")
            ->label('Statistics')
            ->schema([
                TextInput::make('name')
                    ->label('Label')
                    ->required(),
                TextInput::make('number')
                    ->label('Number')
                    ->numeric()
                    ->required(),
            ])
            ->defaultItems(3)
            ->maxItems(6)
            ->collapsible()
            ->reorderable();
    }

    /**
     * Build individual field component
     */
    private function buildFieldComponent(string $sectionKey, string $fieldName, array $fieldConfig): mixed
    {
        $fieldPath = "content.{$sectionKey}.{$fieldName}";
        $component = match ($fieldConfig['type']) {
            'string' => TextInput::make($fieldPath),
            'text' => Textarea::make($fieldPath)->rows(3),
            'number' => TextInput::make($fieldPath)->numeric(),
            'image' => FileUpload::make($fieldPath)
                ->image()
                ->disk('public')
                ->directory("content/{$sectionKey}")
                ->preserveFilenames()
                ->getUploadedFileNameForStorageUsing(
                    fn(TemporaryUploadedFile $file): string =>
                    $fieldName . '_' . now()->format('Y-m-d_H-i-s') . '.' . $file->getClientOriginalExtension()
                ),
            default => TextInput::make($fieldPath)
        };

        $component = $component->label($this->humanizeString($fieldName));

        if (isset($fieldConfig['required']) && $fieldConfig['required']) {
            $component = $component->required();
        }

        if (isset($fieldConfig['default'])) {
            $component = $component->default($fieldConfig['default']);
        }

        if (isset($fieldConfig['max_length'])) {
            $component = $component->maxLength($fieldConfig['max_length']);
        }

        return $component;
    }

    /**
     * Load template schema when template is selected
     */
    private function loadTemplateSchema(string $templateName, callable $set): void
    {
        try {
            $template = $this->templateService->loadTemplate($templateName);
            $set('template_schema', $template);
            $set('name', $template['name'] ?? $templateName);
        } catch (\Exception $e) {
            Log::error('Error loading template schema: ' . $e->getMessage(), [
                'exception' => $e,
                'template_name' => $templateName,
            ]);
        }
    }

    /**
     * Convert snake_case to human readable
     */
    private function humanizeString(string $string): string
    {
        return Str::title(str_replace('_', ' ', $string));
    }
}
