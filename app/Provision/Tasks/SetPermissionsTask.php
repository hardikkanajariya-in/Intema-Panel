<?php

namespace App\Provision\Tasks;

use App\Provision\Contracts\TaskInterface;
use App\Provision\Engine\ProvisionContext;
use App\Provision\Engine\TaskResult;
use App\Services\ShellService;

class SetPermissionsTask implements TaskInterface
{
    public function __construct(
        private readonly ShellService $shellService,
    ) {}

    public function name(): string
    {
        return 'set_permissions';
    }

    public function execute(ProvisionContext $context): TaskResult
    {
        $path = (string) $context->get('deploy_path');
        $user = (string) $context->get('linux_user');

        if ($path === '' || $user === '' || ! is_dir($path)) {
            return TaskResult::success('Skipped permission setup.');
        }

        $this->shellService->runSystem('chown', ['-R', "{$user}:{$user}", $path]);
        $this->shellService->runSystem('find', [$path, '-type', 'd', '-exec', 'chmod', '755', '{}', ';']);
        $this->shellService->runSystem('find', [$path, '-type', 'f', '-exec', 'chmod', '644', '{}', ';']);

        $storagePath = $path.'/storage';

        if (is_dir($storagePath)) {
            $this->shellService->runSystem('chmod', ['-R', '775', $storagePath]);
        }

        $bootstrapCache = $path.'/bootstrap/cache';

        if (is_dir($bootstrapCache)) {
            $this->shellService->runSystem('chmod', ['-R', '775', $bootstrapCache]);
        }

        return TaskResult::success('Permissions configured.');
    }
}
