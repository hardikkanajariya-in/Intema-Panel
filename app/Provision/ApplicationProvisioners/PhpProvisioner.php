<?php

namespace App\Provision\ApplicationProvisioners;

use App\Enums\ApplicationType;

class PhpProvisioner extends AbstractApplicationProvisioner
{
    public function type(): string
    {
        return ApplicationType::StandardPhp->value;
    }

    protected function defaultDocumentRoot(string $deployPath): string
    {
        return $deployPath;
    }

    protected function provisionTasks(): array
    {
        return [
            $this->createFolderTask,
            $this->createLinuxUserTask,
            $this->cloneRepositoryTask,
            $this->setPermissionsTask,
            $this->createVirtualHostTask,
            $this->enableSiteTask,
            $this->reloadNginxTask,
            $this->healthCheckTask,
            $this->saveMetadataTask,
        ];
    }
}
