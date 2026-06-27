<?php

namespace App\Provision\ApplicationProvisioners;

use App\Enums\ApplicationType;

class CustomProvisioner extends AbstractApplicationProvisioner
{
    public function type(): string
    {
        return ApplicationType::Custom->value;
    }

    protected function provisionTasks(): array
    {
        return $this->baseTasks();
    }
}
