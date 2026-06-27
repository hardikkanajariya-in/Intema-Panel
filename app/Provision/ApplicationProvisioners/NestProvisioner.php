<?php

namespace App\Provision\ApplicationProvisioners;

use App\Enums\ApplicationType;
use App\Enums\ResourceStatus;
use App\Models\Application;
use App\Provision\Engine\ProvisionResult;

class NestProvisioner extends AbstractApplicationProvisioner
{
    public function type(): string
    {
        return ApplicationType::NestJs->value;
    }

    public function provision(Application $application, array $input = []): ProvisionResult
    {
        $application->update([
            'status' => ResourceStatus::Active,
            'metadata' => array_merge($application->metadata ?? [], [
                'deployment_target' => 'metadata_only',
                'note' => 'NestJS metadata stored. Local deployment is not supported in v1.0.',
            ]),
        ]);

        return ProvisionResult::success('NestJS application metadata saved.');
    }

    public function repair(Application $application): ProvisionResult
    {
        return $this->provision($application);
    }

    protected function provisionTasks(): array
    {
        return [];
    }
}
