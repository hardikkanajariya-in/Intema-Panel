<?php

namespace App\Actions;

use App\Models\Client;
use App\Services\ActivityLogService;
use App\Services\PostgresService;
use Illuminate\Support\Facades\DB;
use Throwable;

class DeleteClientAction
{
    public function __construct(
        private readonly PostgresService $postgresService,
        private readonly ActivityLogService $activityLogService,
    ) {}

    public function execute(Client $client): void
    {
        DB::transaction(function () use ($client): void {
            $databaseName = $client->database_name;
            $databaseUser = $client->database_user;

            try {
                $this->postgresService->deprovision($databaseName, $databaseUser);
            } catch (Throwable $exception) {
                $this->activityLogService->log(
                    action: 'database.deleted',
                    description: "Failed to delete database for \"{$client->company_name}\".",
                    status: 'failed',
                    subject: $client,
                    properties: [
                        'error' => $exception->getMessage(),
                    ],
                );

                throw $exception;
            }

            if ($databaseName) {
                $this->activityLogService->log(
                    action: 'database.deleted',
                    description: "Database \"{$databaseName}\" was deleted.",
                    subject: $client,
                    properties: [
                        'database_name' => $databaseName,
                        'database_user' => $databaseUser,
                    ],
                );
            }

            $this->activityLogService->log(
                action: 'client.deleted',
                description: "Client \"{$client->company_name}\" was deleted.",
                subject: $client,
                properties: [
                    'domain' => $client->domain,
                ],
            );

            $client->delete();
        });
    }
}
