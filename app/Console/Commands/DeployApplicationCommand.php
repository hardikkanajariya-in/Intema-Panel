<?php

namespace App\Console\Commands;

use App\Actions\DeployApplicationAction;
use App\Models\Application;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('app:deploy {uuid}')]
#[Description('Deploy an application by UUID')]
class DeployApplicationCommand extends Command
{
    /**
     * Execute the console command.
     */
    public function handle(DeployApplicationAction $deployAction): int
    {
        $uuid = $this->argument('uuid');
        $application = Application::query()->where('uuid', $uuid)->first();

        if (! $application) {
            $this->error("Application not found for UUID: {$uuid}");
            return 1;
        }

        if (! $application->repository_url || ! $application->deploy_path) {
            $this->error("Repository URL and deploy path are required.");
            return 1;
        }

        try {
            $this->info("Deploying application: {$application->name}...");
            $deployAction->execute($application);
            $this->info("Application deployed successfully.");
            return 0;
        } catch (\Throwable $e) {
            $this->error("Deployment failed: " . $e->getMessage());
            return 1;
        }
    }
}
