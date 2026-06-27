<?php

namespace App\Actions;

use App\Enums\DeploymentStatus;
use App\Enums\ResourceStatus;
use App\Models\Application;
use App\Models\Deployment;
use App\Provision\Engine\ProvisionContext;
use App\Provision\Tasks\CloneRepositoryTask;
use App\Services\ActivityLogService;
use Illuminate\Support\Facades\DB;

class DeployApplicationAction
{
    public function __construct(
        private readonly CloneRepositoryTask $cloneRepositoryTask,
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

            $context = new ProvisionContext($application, [
                'repository_url' => $application->repository_url,
                'deploy_path' => $application->deploy_path,
                'repository_branch' => $application->repository_branch,
            ]);

            $result = $this->cloneRepositoryTask->execute($context);

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
