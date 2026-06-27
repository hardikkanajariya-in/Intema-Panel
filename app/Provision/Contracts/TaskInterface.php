<?php

namespace App\Provision\Contracts;

use App\Provision\Engine\ProvisionContext;
use App\Provision\Engine\TaskResult;

interface TaskInterface
{
    public function name(): string;

    public function execute(ProvisionContext $context): TaskResult;
}
