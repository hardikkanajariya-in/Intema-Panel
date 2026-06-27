<?php

namespace App\Provision\Contracts;

use App\Models\Application;
use App\Provision\Engine\ProvisionResult;

interface ApplicationProvisionerInterface
{
    public function type(): string;

    /**
     * @param  array<string, mixed>  $input
     * @return list<string>
     */
    public function validate(array $input): array;

    public function provision(Application $application, array $input = []): ProvisionResult;

    public function repair(Application $application): ProvisionResult;

    public function delete(Application $application): ProvisionResult;

    public function health(Application $application): ProvisionResult;
}
