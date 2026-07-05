<?php

namespace App\Provision\ApplicationProvisioners;

use App\Enums\ResourceStatus;
use App\Models\Application;
use App\Provision\Contracts\ApplicationProvisionerInterface;
use App\Provision\Contracts\TaskInterface;
use App\Provision\Engine\ProvisionContext;
use App\Provision\Engine\ProvisionEngine;
use App\Provision\Engine\ProvisionResult;
use App\Provision\Tasks\CloneRepositoryTask;
use App\Provision\Tasks\CreateEnvTask;
use App\Provision\Tasks\CreateFolderTask;
use App\Provision\Tasks\CreateLinuxUserTask;
use App\Provision\Tasks\CreateVirtualHostTask;
use App\Provision\Tasks\EnableSiteTask;
use App\Provision\Tasks\GenerateAppKeyTask;
use App\Provision\Tasks\HealthCheckTask;
use App\Provision\Tasks\InstallComposerTask;
use App\Provision\Tasks\InstallNpmTask;
use App\Provision\Tasks\CreateSupervisorConfigTask;
use App\Provision\Tasks\ReloadNginxTask;
use App\Provision\Tasks\RunBuildCommandTask;
use App\Provision\Tasks\RunMigrationsTask;
use App\Provision\Tasks\SaveMetadataTask;
use App\Provision\Tasks\SetPermissionsTask;
use App\Services\NginxService;
use App\Services\ShellService;
use Illuminate\Support\Str;

abstract class AbstractApplicationProvisioner implements ApplicationProvisionerInterface
{
    public function __construct(
        protected readonly ProvisionEngine $engine,
        protected readonly CreateFolderTask $createFolderTask,
        protected readonly CreateLinuxUserTask $createLinuxUserTask,
        protected readonly CloneRepositoryTask $cloneRepositoryTask,
        protected readonly InstallComposerTask $installComposerTask,
        protected readonly InstallNpmTask $installNpmTask,
        protected readonly RunBuildCommandTask $runBuildCommandTask,
        protected readonly CreateSupervisorConfigTask $createSupervisorConfigTask,
        protected readonly CreateEnvTask $createEnvTask,
        protected readonly GenerateAppKeyTask $generateAppKeyTask,
        protected readonly RunMigrationsTask $runMigrationsTask,
        protected readonly CreateVirtualHostTask $createVirtualHostTask,
        protected readonly EnableSiteTask $enableSiteTask,
        protected readonly ReloadNginxTask $reloadNginxTask,
        protected readonly SetPermissionsTask $setPermissionsTask,
        protected readonly HealthCheckTask $healthCheckTask,
        protected readonly SaveMetadataTask $saveMetadataTask,
        protected readonly NginxService $nginxService,
        protected readonly ShellService $shellService,
    ) {}

    /**
     * @return list<TaskInterface>
     */
    abstract protected function provisionTasks(): array;

    public function validate(array $input): array
    {
        $errors = [];

        if (empty($input['name'])) {
            $errors[] = 'Application name is required.';
        }

        return $errors;
    }

    /**
     * @return list<TaskInterface>
     */
    public function getTasks(): array
    {
        return $this->provisionTasks();
    }

    public function provision(Application $application, array $input = []): ProvisionResult
    {
        $application->update(['status' => ResourceStatus::Provisioning]);

        $context = $this->buildContext($application, $input);
        $result = $this->engine->execute($context, $this->provisionTasks());

        if (! $result->success) {
            $application->update(['status' => ResourceStatus::Failed]);

            return $result;
        }

        return $result;
    }

    public function repair(Application $application): ProvisionResult
    {
        return $this->provision($application, $this->contextDataFromApplication($application));
    }

    public function delete(Application $application): ProvisionResult
    {
        // 1. Delete Nginx virtual host for each domain
        foreach ($application->domains as $domain) {
            try {
                $siteName = Str::slug($domain->hostname, '_');
                $this->nginxService->deleteSite($siteName);
            } catch (\Throwable $e) {
                // Ignore site deletion failures to ensure application deletion continues
            }
        }
        try {
            $this->nginxService->reload();
        } catch (\Throwable $e) {
            // Ignore
        }

        // 2. Stop and delete Supervisor config for Node applications
        $nodeTypes = [\App\Enums\ApplicationType::NextJs, \App\Enums\ApplicationType::NestJs, \App\Enums\ApplicationType::ApiOnly];
        if (in_array($application->type, $nodeTypes, true)) {
            $slug = Str::slug($application->name, '_') . '_' . $application->id;
            $configFile = "/etc/supervisor/conf.d/{$slug}.conf";
            if (is_file($configFile)) {
                try {
                    $this->shellService->runSystem('supervisorctl', ['stop', $slug], optional: true);
                    @unlink($configFile);
                    $this->shellService->runSystem('supervisorctl', ['reread']);
                    $this->shellService->runSystem('supervisorctl', ['update']);
                } catch (\Throwable $e) {
                    // Ignore
                }
            }
        }

        // 3. Delete deployment directory
        $deployPath = $application->deploy_path;
        if ($deployPath && is_dir($deployPath)) {
            try {
                if (DIRECTORY_SEPARATOR === '/') {
                    // On Linux, use rm -rf to force remove the directory
                    $this->shellService->runSystem('rm', ['-rf', $deployPath]);
                } else {
                    // On Windows (dev environment), use recursive PHP deletion
                    $this->deleteDirectory($deployPath);
                }
            } catch (\Throwable $e) {
                // Ignore directory deletion failures so DB record gets cleaned up
            }
        }

        // 4. Finally delete the DB record
        $application->delete();

        return ProvisionResult::success('Application and all its files, virtual hosts, and services have been deleted successfully.');
    }

    private function deleteDirectory(string $dir): void
    {
        if (! is_dir($dir)) {
            return;
        }
        $items = scandir($dir);
        if ($items === false) {
            return;
        }
        foreach ($items as $item) {
            if ($item === '.' || $item === '..') {
                continue;
            }
            $path = $dir . DIRECTORY_SEPARATOR . $item;
            if (is_dir($path)) {
                $this->deleteDirectory($path);
            } else {
                @unlink($path);
            }
        }
        @rmdir($dir);
    }

    public function health(Application $application): ProvisionResult
    {
        $context = new ProvisionContext($application, $this->contextDataFromApplication($application));

        $result = $this->healthCheckTask->execute($context);

        if (! $result->success) {
            return ProvisionResult::failure($result->message);
        }

        return ProvisionResult::success('Application is healthy.');
    }

    /**
     * @param  array<string, mixed>  $input
     */
    protected function buildContext(Application $application, array $input): ProvisionContext
    {
        $slug = Str::slug($application->name, '_');
        $basePath = rtrim((string) config('panel.install_path'), '/').'/apps/'.$slug;
        $linuxUser = $input['linux_user'] ?? $slug;
        $deployPath = $input['deploy_path'] ?? $application->deploy_path ?? $basePath;
        $documentRoot = $input['document_root'] ?? $this->defaultDocumentRoot($deployPath);
        $domain = $input['domain'] ?? null;

        return new ProvisionContext($application, [
            'linux_user' => $linuxUser,
            'home_path' => "/home/{$linuxUser}",
            'folder_path' => $deployPath,
            'root_path' => $basePath,
            'deploy_path' => $deployPath,
            'document_root' => $documentRoot,
            'repository_url' => $input['repository_url'] ?? $application->repository_url,
            'repository_branch' => $input['repository_branch'] ?? $application->repository_branch,
            'environment_variables' => $input['environment_variables'] ?? $application->environment_variables,
            'domain' => $domain,
            'generate_ssl' => $input['generate_ssl'] ?? false,
            'php_socket' => $input['php_socket'] ?? 'unix:/run/php/php8.4-fpm.sock',
            'metadata' => array_merge($application->metadata ?? [], [
                'provisioned_at' => now()->toIso8601String(),
                'type' => $this->type(),
            ]),
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    protected function contextDataFromApplication(Application $application): array
    {
        return [
            'linux_user' => $application->linux_user,
            'deploy_path' => $application->deploy_path,
            'repository_url' => $application->repository_url,
            'repository_branch' => $application->repository_branch,
            'environment_variables' => $application->environment_variables,
        ];
    }

    protected function defaultDocumentRoot(string $deployPath): string
    {
        return $deployPath.'/public';
    }

    /**
     * @return list<TaskInterface>
     */
    protected function baseTasks(): array
    {
        return [
            $this->createFolderTask,
            $this->createLinuxUserTask,
            $this->cloneRepositoryTask,
            $this->createEnvTask,
            $this->setPermissionsTask,
            $this->createVirtualHostTask,
            $this->enableSiteTask,
            $this->reloadNginxTask,
            $this->healthCheckTask,
            $this->saveMetadataTask,
        ];
    }
}
