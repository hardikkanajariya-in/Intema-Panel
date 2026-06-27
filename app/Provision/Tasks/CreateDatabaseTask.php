<?php

namespace App\Provision\Tasks;

use App\Provision\Engine\ProvisionContext;
use App\Provision\Engine\TaskResult;
use App\Services\PostgresService;

class CreateDatabaseTask extends AbstractTask
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
            'database_provisioned' => true,
        ]);
    }

    public function rollback(ProvisionContext $context): TaskResult
    {
        if (! $context->get('database_provisioned')) {
            return TaskResult::success('Database was not provisioned by this task.');
        }

        $this->postgresService->deprovision(
            (string) $context->get('database_name'),
            (string) $context->get('database_user'),
        );

        return TaskResult::success('Database deprovisioned.');
    }

    public function health(ProvisionContext $context): TaskResult
    {
        $databaseName = (string) $context->get('database_name');

        if ($databaseName === '') {
            return TaskResult::success('No database configured.');
        }

        if (! $this->postgresService->databaseExists($databaseName)) {
            return TaskResult::failure("Database does not exist: {$databaseName}");
        }

        return TaskResult::success('Database exists.');
    }
}
