<?php

namespace App\Provision\Contracts;

use App\Provision\Engine\ProvisionContext;
use App\Provision\Engine\TaskResult;

interface TaskInterface
{
    public function name(): string;

    public function validate(ProvisionContext $context): TaskResult;

    public function execute(ProvisionContext $context): TaskResult;

    public function rollback(ProvisionContext $context): TaskResult;

    public function health(ProvisionContext $context): TaskResult;
}
