<?php

namespace App\Console\Commands;

use App\Services\TemplateSyncService;
use Illuminate\Console\Command;

class SyncTemplatesCommand extends Command
{
    protected $signature = 'pages:sync-templates {--dry-run : Show what would be done without making changes}';

    protected $description = 'Sync page templates from JSON files to database';

    public function handle(TemplateSyncService $syncService): int
    {
        $dryRun = $this->option('dry-run');

        if ($dryRun) {
            $this->info('Running in DRY RUN mode - no changes will be made');
        }

        $this->info('Syncing templates...');

        $results = $syncService->syncAllTemplates($dryRun);

        if (!empty($results['created'])) {
            $this->info('Created pages:');
            foreach ($results['created'] as $result) {
                $this->line("  - {$result['name']} ({$result['template']})");
            }
        }

        if (!empty($results['updated'])) {
            $this->info('Updated pages:');
            foreach ($results['updated'] as $result) {
                $this->line("  - {$result['name']} ({$result['template']})");
            }
        }

        if (!empty($results['errors'])) {
            $this->error('Errors occurred:');
            foreach ($results['errors'] as $error) {
                if (isset($error['template']) && isset($error['error'])) {
                    $this->line("  - {$error['template']}: {$error['error']}");
                } elseif (isset($error['general'])) {
                    $this->line("  - General: {$error['general']}");
                } else {
                    $this->line("  - Unknown error: " . json_encode($error));
                }
            }
        }

        $this->info("Processed {$results['total_processed']} templates");

        return empty($results['errors']) ? 0 : 1;
    }
}
