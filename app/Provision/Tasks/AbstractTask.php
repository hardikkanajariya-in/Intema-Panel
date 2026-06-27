<?php

namespace App\Provision\Tasks;

use App\Provision\Contracts\TaskInterface;
use App\Provision\Engine\ProvisionContext;
use App\Provision\Engine\TaskResult;

abstract class AbstractTask implements TaskInterface
{
    public function validate(ProvisionContext $context): TaskResult
    {
        return TaskResult::success();
    }

    public function rollback(ProvisionContext $context): TaskResult
    {
        return TaskResult::success('Nothing to rollback.');
    }

    public function health(ProvisionContext $context): TaskResult
    {
        return TaskResult::success();
    }
}
