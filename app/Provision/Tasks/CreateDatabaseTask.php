<?php

namespace App\Provision\Tasks;

use App\Provision\Contracts\TaskInterface;
use App\Provision\Engine\ProvisionContext;
use App\Provision\Engine\TaskResult;
use App\Services\PostgresService;

class CreateDatabaseTask implements TaskInterface
{
    public function __construct(
        private readonly PostgresService $postgresService,
    ) {}

    public function name(): string
    {
        return 'create_database';
    }

    public function execute(ProvisionContext $context): TaskResult
    {
        $databaseName = (string) $context->get('database_name');

        if ($databaseName === '') {
            return TaskResult::success('Skipped database creation (not configured).');
        }

        $databaseUser = (string) $context->get('database_user');
        $password = (string) $context->get('database_password');

        $credentials = $this->postgresService->provision($databaseName, $databaseUser, $password ?: null);

        return TaskResult::success('Database provisioned.', [
            'database_name' => $credentials->databaseName,
            'database_user' => $credentials->databaseUser,
            'database_password' => $credentials->databasePassword,
        ]);
    }
}
