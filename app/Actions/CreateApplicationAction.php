<?php

namespace App\Actions;

use App\DTOs\ApplicationData;
use App\Enums\ResourceStatus;
use App\Models\Application;
use App\Provision\ProvisionerRegistry;
use App\Services\ActivityLogService;
use Illuminate\Support\Facades\DB;
use Throwable;

class CreateApplicationAction
{
    public function __construct(
        private readonly ProvisionerRegistry $provisionerRegistry,
        private readonly ActivityLogService $activityLogService,
    ) {}

    /**
     * @param  array<string, mixed>  $provisionInput
     */
    public function execute(ApplicationData $data, array $provisionInput = [], bool $provision = true): Application
    {
        $application = DB::transaction(function () use ($data): Application {
            $application = Application::query()->create([
                'project_id' => $data->projectId,
                'name' => $data->name,
                'type' => $data->type,
                'status' => ResourceStatus::Pending,
                'root_path' => $data->rootPath,
                'repository_url' => $data->repositoryUrl,
                'repository_branch' => $data->repositoryBranch ?? 'main',
                'deploy_path' => $data->deployPath,
                'runtime' => $data->runtime,
                'build_command' => $data->buildCommand,
                'start_command' => $data->startCommand,
                'environment_variables' => $data->environmentVariables,
                'linux_user' => $data->linuxUser,
                'metadata' => $data->metadata,
                'notes' => $data->notes,
            ]);

            $this->activityLogService->log(
                action: 'application.created',
                description: "Application \"{$application->name}\" was created.",
                subject: $application,
            );

            return $application;
        });

        if (! $provision) {
            $application->update(['status' => ResourceStatus::Active]);

            return $application;
        }

        try {
            $provisioner = $this->provisionerRegistry->forType($application->type);
            $errors = $provisioner->validate(array_merge($data->toArray(), $provisionInput));

            if ($errors !== []) {
                $application->update(['status' => ResourceStatus::Failed]);
                throw new \InvalidArgumentException(implode(' ', $errors));
            }

            $result = $provisioner->provision($application, $provisionInput);

            if (! $result->success) {
                throw new \RuntimeException($result->message);
            }

            $this->activityLogService->log(
                action: 'application.provisioned',
                description: "Application \"{$application->name}\" was provisioned.",
                subject: $application->fresh(),
            );
        } catch (Throwable $exception) {
            $this->activityLogService->log(
                action: 'application.provisioned',
                description: 'Application provisioning failed.',
                status: 'failed',
                subject: $application,
                properties: ['error' => $exception->getMessage()],
            );

            throw $exception;
        }

        return $application->fresh();
    }
}
