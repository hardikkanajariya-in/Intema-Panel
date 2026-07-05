<?php

namespace App\Provision\Tasks;

use App\Provision\Engine\ProvisionContext;
use App\Provision\Engine\TaskResult;
use App\Services\ShellService;

class RunBuildCommandTask extends AbstractTask
{
    public function __construct(
        private readonly ShellService $shellService,
    ) {}

    public function name(): string
    {
        return 'run_build_command';
    }

    public function execute(ProvisionContext $context): TaskResult
    {
        $path = (string) $context->get('deploy_path');
        $application = $context->getApplication();
        $buildCommand = (string) ($context->get('build_command') ?: $application->build_command);

        if ($path === '' || ! is_dir($path)) {
            return TaskResult::success('Skipped build command (no deploy path).');
        }

        if ($buildCommand === '') {
            return TaskResult::success('Skipped build command (none configured).');
        }

        $parts = preg_split('/\s+/', trim($buildCommand));
        if (empty($parts)) {
            return TaskResult::success('Skipped build command (empty).');
        }

        $cmd = array_shift($parts);
        $this->shellService->runSystem($cmd, $parts, cwd: $path);

        return TaskResult::success("Build command executed: {$buildCommand}");
    }
}
