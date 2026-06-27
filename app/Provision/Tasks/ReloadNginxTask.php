<?php

namespace App\Provision\Tasks;

use App\Provision\Engine\ProvisionContext;
use App\Provision\Engine\TaskResult;
use App\Services\NginxService;

class ReloadNginxTask extends AbstractTask
{
    public function __construct(
        private readonly NginxService $nginxService,
    ) {}

    public function name(): string
    {
        return 'reload_nginx';
    }

    public function execute(ProvisionContext $context): TaskResult
    {
        if (! $context->get('domain')) {
            return TaskResult::success('Skipped Nginx reload (no domain configured).');
        }

        $this->nginxService->testConfiguration();
        $this->nginxService->reload();

        return TaskResult::success('Nginx reloaded.');
    }
}
