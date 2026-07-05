<?php

namespace App\Actions;

use App\Enums\DeploymentStatus;
use App\Enums\ResourceStatus;
use App\Models\Application;
use App\Models\Deployment;
use App\Provision\Engine\ProvisionContext;
use App\Provision\Engine\ProvisionEngine;
use App\Provision\ProvisionerRegistry;
use App\Services\ActivityLogService;
use Illuminate\Support\Facades\DB;

class DeployApplicationAction
{
    public function __construct(
        private readonly ProvisionerRegistry $provisionerRegistry,
        private readonly ProvisionEngine $engine,
        private readonly ActivityLogService $activityLogService,
    ) {}

    public function execute(Application $application): Deployment
    {
        return DB::transaction(function () use ($application): Deployment {
            $deployment = Deployment::query()->create([
                'application_id' => $application->id,
                'status' => DeploymentStatus::Deploying,
                'branch' => $application->repository_branch,
                'deploy_path' => $application->deploy_path,
            ]);

            $provisioner = $this->provisionerRegistry->forType($application->type);
            $tasks = $provisioner->getTasks();

            // Extract primary domain and document root from domains or metadata
            $domainModel = $application->domains()->first();
            $domain = $domainModel ? $domainModel->hostname : ($application->metadata['domain'] ?? '');
            $docRoot = $domainModel && $domainModel->document_root 
                ? $domainModel->document_root 
                : ($application->metadata['document_root'] ?? $application->deploy_path);

            $context = new ProvisionContext($application, [
                'name' => $application->name,
                'domain' => $domain,
                'document_root' => $docRoot,
                'folder_path' => $application->deploy_path,
                'deploy_path' => $application->deploy_path,
                'repository_url' => $application->repository_url,
                'repository_branch' => $application->repository_branch,
                'runtime' => $application->runtime,
                'build_command' => $application->build_command,
                'start_command' => $application->start_command,
                'linux_user' => $application->linux_user,
            ]);

            $result = $this->engine->execute($context, $tasks);

            if (! $result->success) {
                $deployment->update([
                    'status' => DeploymentStatus::Failed,
                    'error_output' => $result->message,
                ]);

                $this->activityLogService->log(
                    action: 'deployment.failed',
                    description: "Deployment failed for \"{$application->name}\".",
                    status: 'failed',
                    subject: $deployment,
                    properties: ['error' => $result->message],
                );

                throw new \RuntimeException($result->message);
            }

            $deployment->update([
                'status' => DeploymentStatus::Active,
                'deployed_at' => now(),
                'build_output' => $result->message,
            ]);

            $application->update(['status' => ResourceStatus::Active]);

            $this->activityLogService->log(
                action: 'deployment.completed',
                description: "Deployment completed for \"{$application->name}\".",
                subject: $deployment,
            );

            return $deployment;
        });
    }
}
