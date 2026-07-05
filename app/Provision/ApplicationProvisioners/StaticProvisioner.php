<?php

namespace App\Provision\ApplicationProvisioners;

use App\Enums\ApplicationType;

class StaticProvisioner extends AbstractApplicationProvisioner
{
    public function type(): string
    {
        return ApplicationType::StaticWebsite->value;
    }

    protected function defaultDocumentRoot(string $deployPath): string
    {
        return $deployPath;
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
            $this->reloadNginxTask,
            $this->healthCheckTask,
            $this->saveMetadataTask,
        ];
    }
}
