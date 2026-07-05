<?php

namespace App\Provision\ApplicationProvisioners;

use App\Enums\ApplicationType;

class NextProvisioner extends AbstractApplicationProvisioner
{
    public function type(): string
    {
        return ApplicationType::NextJs->value;
    }

    protected function provisionTasks(): array
    {
        return [
            $this->createFolderTask,
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
