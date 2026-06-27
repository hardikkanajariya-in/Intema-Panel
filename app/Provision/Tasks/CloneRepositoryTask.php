<?php

namespace App\Provision\Tasks;

use App\Provision\Contracts\TaskInterface;
use App\Provision\Engine\ProvisionContext;
use App\Provision\Engine\TaskResult;
use App\Services\ShellService;

class CloneRepositoryTask implements TaskInterface
{
    public function __construct(
        private readonly ShellService $shellService,
    ) {}

    public function name(): string
    {
        return 'clone_repository';
    }

    public function execute(ProvisionContext $context): TaskResult
    {
        $repository = (string) $context->get('repository_url');
        $path = (string) $context->get('deploy_path');
        $branch = (string) ($context->get('repository_branch') ?: 'main');

        if ($repository === '' || $path === '') {
            return TaskResult::success('Skipped repository clone (no repository configured).');
        }

        if (is_dir($path.'/.git')) {
            $this->shellService->runSystem('git', ['-C', $path, 'fetch', 'origin'], cwd: $path);
            $this->shellService->runSystem('git', ['-C', $path, 'checkout', $branch], cwd: $path);
            $this->shellService->runSystem('git', ['-C', $path, 'pull', 'origin', $branch], cwd: $path);

            return TaskResult::success("Updated repository at {$path}");
        }

        $this->shellService->runSystem('git', [
            'clone',
            '--branch',
            $branch,
            $repository,
            $path,
        ]);

        return TaskResult::success("Cloned repository to {$path}");
    }
}
