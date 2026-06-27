<?php

namespace App\Provision\ApplicationProvisioners;

use App\Enums\ApplicationType;

class ApiProvisioner extends AbstractApplicationProvisioner
{
    public function type(): string
    {
        return ApplicationType::ApiOnly->value;
    }

    protected function defaultDocumentRoot(string $deployPath): string
    {
        return $deployPath.'/public';
    }

    protected function provisionTasks(): array
    {
        return [
            $this->createFolderTask,
            $this->createLinuxUserTask,
            $this->cloneRepositoryTask,
            $this->installComposerTask,
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
