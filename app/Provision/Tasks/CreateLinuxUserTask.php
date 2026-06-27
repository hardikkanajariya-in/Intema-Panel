<?php

namespace App\Provision\Tasks;

use App\Provision\Contracts\TaskInterface;
use App\Provision\Engine\ProvisionContext;
use App\Provision\Engine\TaskResult;
use App\Services\ShellService;

class CreateLinuxUserTask implements TaskInterface
{
    public function __construct(
        private readonly ShellService $shellService,
    ) {}

    public function name(): string
    {
        return 'create_linux_user';
    }

    public function execute(ProvisionContext $context): TaskResult
    {
        $username = (string) $context->get('linux_user');

        if ($username === '' || ! preg_match('/^[a-z_][a-z0-9_-]{0,31}$/', $username)) {
            return TaskResult::failure('Invalid Linux username.');
        }

        $home = (string) ($context->get('home_path') ?: "/home/{$username}");

        $check = $this->shellService->runSystem('id', [$username], optional: true);

        if ($check->successful()) {
            return TaskResult::success("Linux user already exists: {$username}");
        }

        $this->shellService->runSystem('useradd', [
            '-m',
            '-d',
            $home,
            '-s',
            '/bin/bash',
            $username,
        ]);

        return TaskResult::success("Created Linux user: {$username}", [
            'home_path' => $home,
        ]);
    }
}
