<?php

namespace App\Provision\ApplicationProvisioners;

use App\Enums\ApplicationType;

class LaravelProvisioner extends AbstractApplicationProvisioner
{
    public function type(): string
    {
        return ApplicationType::Laravel->value;
    }

    public function validate(array $input): array
    {
        $errors = parent::validate($input);

        if (empty($input['deploy_path']) && empty($input['repository_url'])) {
            $errors[] = 'Repository URL or deploy path is required for Laravel applications.';
        }

        return $errors;
    }

    protected function provisionTasks(): array
    {
        return [
            $this->createFolderTask,
            $this->createLinuxUserTask,
            $this->cloneRepositoryTask,
            $this->installComposerTask,
            $this->createEnvTask,
            $this->generateAppKeyTask,
            $this->runMigrationsTask,
            $this->setPermissionsTask,
            $this->createVirtualHostTask,
            $this->enableSiteTask,
            $this->reloadNginxTask,
            $this->healthCheckTask,
            $this->saveMetadataTask,
        ];
    }
}
