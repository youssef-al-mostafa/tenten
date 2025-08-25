<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class Pages extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'template_name',
        'template_schema',
        'content',
        'is_active',
        'sort_order'
    ];

    protected $casts = [
        'template_schema' => 'array',
        'content' => 'array',
        'is_active' => 'boolean',
        'sort_order' => 'integer'
    ];

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    public function scopeByTemplate(Builder $query, string $templateName): Builder
    {
        return $query->where('template_name', $templateName);
    }

    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('sort_order');
    }

    public function getContentForSection(string $sectionKey): array
    {
        return $this->content[$sectionKey] ?? [];
    }

    public function setSectionContent(string $sectionKey, array $data): void
    {
        $content = $this->content ?? [];
        $content[$sectionKey] = $data;
        $this->content = $content;
    }

    public function isSectionActive(string $sectionKey): bool
    {
        return $this->getContentForSection($sectionKey)['is_active'] ?? true;
    }

    public function getSectionOrder(string $sectionKey): int
    {
        return $this->getContentForSection($sectionKey)['sort_order'] ?? 0;
    }

    public function getTemplateSchema(): array
    {
        return $this->template_schema ?? [];
    }

    public function getTemplateSections(): array
    {
        return $this->getTemplateSchema()['sections'] ?? [];
    }

    public function getTemplateFields(): array
    {
        return $this->getTemplateSchema()['fields'] ?? [];
    }

    public function hasSection(string $sectionKey): bool
    {
        return in_array($sectionKey, $this->getTemplateSections());
    }
}
