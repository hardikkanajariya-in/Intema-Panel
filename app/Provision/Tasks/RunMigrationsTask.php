<?php

namespace App\Provision\Tasks;

use App\Provision\Contracts\TaskInterface;
use App\Provision\Engine\ProvisionContext;
use App\Provision\Engine\TaskResult;
use App\Services\ShellService;

class RunMigrationsTask implements TaskInterface
{
    public function __construct(
        private readonly ShellService $shellService,
    ) {}

    public function name(): string
    {
        return 'run_migrations';
    }

    public function execute(ProvisionContext $context): TaskResult
    {
        $path = (string) $context->get('deploy_path');

        if ($path === '' || ! is_file($path.'/artisan')) {
            return TaskResult::success('Skipped migrations (not a Laravel app).');
        }

        $this->shellService->runSystem('php', ['artisan', 'migrate', '--force'], cwd: $path);

        return TaskResult::success('Migrations executed.');
    }
}
