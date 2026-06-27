<?php

namespace App\Provision\Tasks;

use App\Provision\Contracts\TaskInterface;
use App\Provision\Engine\ProvisionContext;
use App\Provision\Engine\TaskResult;

class HealthCheckTask implements TaskInterface
{
    public function name(): string
    {
        return 'health_check';
    }

    public function execute(ProvisionContext $context): TaskResult
    {
        $deployPath = (string) $context->get('deploy_path');

        if ($deployPath !== '' && ! is_dir($deployPath)) {
            return TaskResult::failure("Deploy path does not exist: {$deployPath}");
        }

        $documentRoot = (string) $context->get('document_root');

        if ($documentRoot !== '' && ! is_dir($documentRoot)) {
            return TaskResult::failure("Document root does not exist: {$documentRoot}");
        }

        return TaskResult::success('Health check passed.');
    }
}
