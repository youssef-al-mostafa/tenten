<?php

namespace App\Services;

use App\Models\Pages;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Exception;

class TemplateSyncService
{
    private TemplateService $templateService;

    public function __construct(TemplateService $templateService)
    {
        $this->templateService = $templateService;
    }

    /**
     * Sync all templates to database
     */
    public function syncAllTemplates(bool $dryRun = false): array
    {
        $results = [
            'created' => [],
            'updated' => [],
            'errors' => [],
            'total_processed' => 0
        ];

        try {
            $templates = $this->templateService->getAllTemplates();
            $results['total_processed'] = count($templates);

            DB::beginTransaction();

            foreach ($templates as $templateName => $templateData) {
                try {
                    $result = $this->syncTemplate($templateName, $templateData, $dryRun);
                    $results[$result['action']][] = $result;
                } catch (Exception $e) {
                    $results['errors'][] = [
                        'template' => $templateName,
                        'error' => $e->getMessage()
                    ];
                    Log::error("Template sync error for {$templateName}: " . $e->getMessage());
                }
            }

            if (!$dryRun) {
                DB::commit();
                Log::info('Template sync completed successfully', $results);
            } else {
                DB::rollBack();
                Log::info('Template sync dry run completed', $results);
            }

        } catch (Exception $e) {
            DB::rollBack();
            $results['errors'][] = ['general' => $e->getMessage()];
            Log::error('Template sync failed: ' . $e->getMessage());
        }

        return $results;
    }

    /**
     * Sync individual template
     */
    public function syncTemplate(string $templateName, array $templateData, bool $dryRun = false): array
    {
        $slug = $this->templateService->generateSlug($templateName);
        $page = Pages::where('template_name', $templateName)->first();

        if ($page) {
            return $this->updateExistingPage($page, $templateData, $dryRun);
        } else {
            return $this->createNewPage($templateName, $slug, $templateData, $dryRun);
        }
    }

    /**
     * Create new page from template
     */
    private function createNewPage(string $templateName, string $slug, array $templateData, bool $dryRun): array
    {
        $defaultContent = $this->generateDefaultContent($templateData);

        $pageData = [
            'name' => $templateData['name'],
            'slug' => $slug,
            'template_name' => $templateName,
            'template_schema' => $templateData,
            'content' => $defaultContent,
            'is_active' => true,
            'sort_order' => 0
        ];

        if (!$dryRun) {
            Pages::create($pageData);
        }

        return [
            'action' => 'created',
            'template' => $templateName,
            'name' => $templateData['name'],
            'slug' => $slug
        ];
    }

    /**
     * Update existing page with new template
     */
    private function updateExistingPage(Pages $page, array $templateData, bool $dryRun): array
    {
        $existingContent = $page->content ?? [];
        $updatedContent = $this->mergeContent($existingContent, $templateData);

        $updates = [
            'name' => $templateData['name'],
            'template_schema' => $templateData,
            'content' => $updatedContent
        ];

        if (!$dryRun) {
            $page->update($updates);
        }

        return [
            'action' => 'updated',
            'template' => $page->template_name,
            'name' => $templateData['name'],
            'slug' => $page->slug
        ];
    }

    /**
     * Generate default content from template
     */
    private function generateDefaultContent(array $templateData): array
    {
        $content = [];
        $sections = $this->templateService->getTemplateSectionsWithDefaults($templateData);

        foreach ($sections as $sectionKey => $defaults) {
            $content[$sectionKey] = $defaults;
        }

        return $content;
    }

    /**
     * Merge existing content with new template structure
     */
    private function mergeContent(array $existingContent, array $templateData): array
    {
        $newContent = [];
        $sections = $this->templateService->getTemplateSectionsWithDefaults($templateData);

        foreach ($sections as $sectionKey => $defaults) {
            if (isset($existingContent[$sectionKey])) {
                $newContent[$sectionKey] = array_merge($defaults, $existingContent[$sectionKey]);
            } else {
                $newContent[$sectionKey] = $defaults;
            }
        }

        return $newContent;
    }

    /**
     * Remove orphaned pages (templates that no longer exist)
     */
    public function cleanOrphanedPages(bool $dryRun = false): array
    {
        $templateNames = $this->templateService->getAllTemplateNames();
        $orphanedPages = Pages::whereNotIn('template_name', $templateNames)->get();

        $results = [];
        foreach ($orphanedPages as $page) {
            $results[] = [
                'id' => $page->id,
                'name' => $page->name,
                'template' => $page->template_name
            ];

            if (!$dryRun) {
                $page->delete();
            }
        }

        return $results;
    }
}
