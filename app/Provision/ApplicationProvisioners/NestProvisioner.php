<?php

namespace App\Provision\ApplicationProvisioners;

use App\Enums\ApplicationType;

class NestProvisioner extends AbstractApplicationProvisioner
{
    public function type(): string
    {
        return ApplicationType::NestJs->value;
    }

    protected function provisionTasks(): array
    {
        return [
            $this->createFolderTask,
            $this->createLinuxUserTask,
            $this->cloneRepositoryTask,
            $this->installNpmTask,
            $this->runBuildCommandTask,
            $this->createVirtualHostTask,
            $this->enableSiteTask,
            $this->createSupervisorConfigTask,
            $this->reloadNginxTask,
            $this->healthCheckTask,
            $this->saveMetadataTask,
        ];
    }
}
