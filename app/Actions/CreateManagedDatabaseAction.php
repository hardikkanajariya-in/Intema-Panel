<?php

namespace App\Actions;

use App\DTOs\ManagedDatabaseData;
use App\Enums\ResourceStatus;
use App\Exceptions\PostgresProvisioningException;
use App\Models\ManagedDatabase;
use App\Services\ActivityLogService;
use App\Services\PostgresService;
use Illuminate\Support\Facades\DB;
use Throwable;

class CreateManagedDatabaseAction
{
    public function __construct(
        private readonly PostgresService $postgresService,
        private readonly ActivityLogService $activityLogService,
    ) {}

    public function execute(ManagedDatabaseData $data, bool $provision = true): ManagedDatabase
    {
        $databaseName = $data->databaseName;
        $databaseUser = $data->databaseUser;
        $password = $data->databasePassword;

        if ($provision && (! $databaseName || ! $databaseUser)) {
            $identifiers = $this->postgresService->generateIdentifiers($data->name, $data->name);
            $databaseName = $identifiers->databaseName;
            $databaseUser = $identifiers->databaseUser;
            $password = $identifiers->databasePassword;
        }

        $provisioned = false;

        try {
            return DB::transaction(function () use ($data, $databaseName, $databaseUser, $password, $provision, &$provisioned): ManagedDatabase {
                if ($provision) {
                    $credentials = $this->postgresService->provision(
                        $databaseName,
                        $databaseUser,
                        $password,
                    );
                    $provisioned = true;
                    $databaseName = $credentials->databaseName;
                    $databaseUser = $credentials->databaseUser;
                    $password = $credentials->databasePassword;
                }

                $database = ManagedDatabase::query()->create([
                    'project_id' => $data->projectId,
                    'application_id' => $data->applicationId,
                    'name' => $data->name,
                    'database_name' => $databaseName,
                    'database_user' => $databaseUser,
                    'database_password_encrypted' => $password ?? '',
                    'host' => $data->host ?? '127.0.0.1',
                    'port' => $data->port ?? 5432,
                    'status' => $provision ? ResourceStatus::Active : ResourceStatus::Pending,
                    'notes' => $data->notes,
                ]);

                $this->activityLogService->log(
                    action: 'database.created',
                    description: "Database \"{$database->name}\" was created.",
                    subject: $database,
                );

                return $database;
            });
        } catch (Throwable $exception) {
            if ($provisioned) {
                $this->postgresService->deprovision($databaseName, $databaseUser);
            }

            throw new PostgresProvisioningException(
                'Failed to create database: '.$exception->getMessage(),
                previous: $exception,
            );
        }
    }
}
