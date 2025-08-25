<?php

namespace App\Services;

use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;
use Exception;

class TemplateService
{
    private string $templatesPath;
    private int $cacheTtl;

    public function __construct()
    {
        $this->templatesPath = app_path('Templates/Layouts');
        $this->cacheTtl = config('cache.default_ttl', 3600);
    }

    /**
     * Get all template files
     */
    public function getAllTemplates(): array
    {
        if (!File::exists($this->templatesPath)) {
            throw new Exception("Templates directory not found: {$this->templatesPath}");
        }

        $templates = [];
        $files = File::files($this->templatesPath);

        foreach ($files as $file) {
            if ($file->getExtension() === 'json') {
                $templateName = $file->getFilenameWithoutExtension();
                $templates[$templateName] = $this->loadTemplate($templateName);
            }
        }

        return $templates;
    }

    /**
     * Load a specific template
     */
    public function loadTemplate(string $templateName): array
    {
        return Cache::remember(
            "template.{$templateName}",
            $this->cacheTtl,
            fn() => $this->loadTemplateFromFile($templateName)
        );
    }

    /**
     * Load template from file system
     */
    private function loadTemplateFromFile(string $templateName): array
    {
        $filePath = $this->getTemplatePath($templateName);

        if (!File::exists($filePath)) {
            throw new Exception("Template file not found: {$filePath}");
        }

        $content = File::get($filePath);
        $decoded = json_decode($content, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new Exception("Invalid JSON in template {$templateName}: " . json_last_error_msg());
        }

        return $this->validateTemplate($decoded, $templateName);
    }

    /**
     * Validate template structure
     */
    private function validateTemplate(array $template, string $templateName): array
    {
        $required = ['name', 'sections', 'fields'];

        foreach ($required as $field) {
            if (!isset($template[$field])) {
                throw new Exception("Missing required field '{$field}' in template {$templateName}");
            }
        }

        return $template;
    }

    /**
     * Get template file path
     */
    private function getTemplatePath(string $templateName): string
    {
        return $this->templatesPath . "/{$templateName}.json";
    }

    /**
     * Generate slug from template name
     */
    public function generateSlug(string $templateName): string
    {
        return Str::slug($templateName);
    }

    /**
     * Check if template file was modified
     */
    public function isTemplateModified(string $templateName, int $lastSyncTime): bool
    {
        $filePath = $this->getTemplatePath($templateName);

        if (!File::exists($filePath)) {
            return false;
        }

        return File::lastModified($filePath) > $lastSyncTime;
    }

    /**
     * Clear template cache
     */
    public function clearTemplateCache(string $templateName = null): void
    {
        if ($templateName) {
            Cache::forget("template.{$templateName}");
        } else {
            $templates = $this->getAllTemplateNames();
            foreach ($templates as $name) {
                Cache::forget("template.{$name}");
            }
        }
    }

    /**
     * Get all template names
     */
    public function getAllTemplateNames(): array
    {
        $files = File::files($this->templatesPath);
        $names = [];

        foreach ($files as $file) {
            if ($file->getExtension() === 'json') {
                $names[] = $file->getFilenameWithoutExtension();
            }
        }

        return $names;
    }

    /**
     * Get template sections with default metadata
     */
    public function getTemplateSectionsWithDefaults(array $template): array
    {
        $sections = [];
        $order = 1;

        foreach ($template['sections'] as $sectionKey) {
            $sections[$sectionKey] = [
                'is_active' => true,
                'sort_order' => $order++
            ];
        }

        return $sections;
    }
}
