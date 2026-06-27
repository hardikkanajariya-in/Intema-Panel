<?php

namespace App\Provision\Tasks;

use App\Provision\Contracts\TaskInterface;
use App\Provision\Engine\ProvisionContext;
use App\Provision\Engine\TaskResult;
use App\Services\ShellService;

class InstallComposerTask implements TaskInterface
{
    public function __construct(
        private readonly ShellService $shellService,
    ) {}

    public function name(): string
    {
        return 'install_composer';
    }

    public function execute(ProvisionContext $context): TaskResult
    {
        $path = (string) $context->get('deploy_path');

        if ($path === '' || ! is_dir($path)) {
            return TaskResult::success('Skipped Composer install (no deploy path).');
        }

        if (! is_file($path.'/composer.json')) {
            return TaskResult::success('Skipped Composer install (no composer.json).');
        }

        $this->shellService->runSystem('composer', [
            'install',
            '--no-dev',
            '--optimize-autoloader',
            '--no-interaction',
        ], cwd: $path);

        return TaskResult::success('Composer dependencies installed.');
    }
}
