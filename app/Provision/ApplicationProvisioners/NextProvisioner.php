<?php

namespace App\Provision\ApplicationProvisioners;

use App\Enums\ApplicationType;
use App\Enums\ResourceStatus;
use App\Models\Application;
use App\Provision\Engine\ProvisionResult;

class NextProvisioner extends AbstractApplicationProvisioner
{
    public function type(): string
    {
        return ApplicationType::NextJs->value;
    }

    public function provision(Application $application, array $input = []): ProvisionResult
    {
        $application->update([
            'status' => ResourceStatus::Active,
            'metadata' => array_merge($application->metadata ?? [], [
                'deployment_target' => 'vercel',
                'note' => 'Next.js applications are deployed via Vercel. Configure deployment metadata only.',
            ]),
        ]);

        return ProvisionResult::success('Next.js application metadata saved. Deploy via Vercel.');
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
