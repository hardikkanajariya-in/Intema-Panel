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

        $hasPnpmLock = is_file($path.'/pnpm-lock.yaml');
        $hasPnpm = false;
        try {
            $this->shellService->runSystem('which', ['pnpm']);
            $hasPnpm = true;
        } catch (\Throwable) {}

        if ($hasPnpmLock || $hasPnpm) {
            $this->shellService->runSystem('pnpm', ['install'], cwd: $path);
            $msg = 'pnpm dependencies installed.';
        } else {
            $this->shellService->runSystem('npm', ['install'], cwd: $path);
            $msg = 'NPM dependencies installed.';
        }

        return TaskResult::success($msg);
    }
}
