<?php

namespace App\Provision\Tasks;

use App\Provision\Engine\ProvisionContext;
use App\Provision\Engine\TaskResult;
use App\Services\ShellService;

class InstallNpmTask extends AbstractTask
{
    public function __construct(
        private readonly ShellService $shellService,
    ) {}

    public function name(): string
    {
        return 'install_npm';
    }

    public function execute(ProvisionContext $context): TaskResult
    {
        $path = (string) $context->get('deploy_path');

        if ($path === '' || ! is_dir($path)) {
            return TaskResult::success('Skipped NPM install (no deploy path).');
        }

        if (! is_file($path.'/package.json')) {
            return TaskResult::success('Skipped NPM install (no package.json).');
        }

        $this->shellService->runSystem('npm', ['ci', '--no-audit', '--no-fund'], cwd: $path);

        return TaskResult::success('NPM dependencies installed.');
    }
}
