<?php

namespace App\Provision\Tasks;

use App\Provision\Contracts\TaskInterface;
use App\Provision\Engine\ProvisionContext;
use App\Provision\Engine\TaskResult;
use App\Services\EncryptionService;

class GeneratePasswordTask implements TaskInterface
{
    public function __construct(
        private readonly EncryptionService $encryptionService,
    ) {}

    public function name(): string
    {
        return 'generate_password';
    }

    public function execute(ProvisionContext $context): TaskResult
    {
        if ($context->get('database_password')) {
            return TaskResult::success('Password already set.');
        }

        $password = $this->encryptionService->generatePassword();

        return TaskResult::success('Password generated.', [
            'database_password' => $password,
        ]);
    }
}
