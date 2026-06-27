<?php

namespace App\Actions;

use App\DTOs\ClientData;
use App\Exceptions\PostgresProvisioningException;
use App\Models\Client;
use App\Services\ActivityLogService;
use App\Services\PostgresService;
use Illuminate\Support\Facades\DB;
use Throwable;

class CreateClientAction
{
    public function __construct(
        private readonly PostgresService $postgresService,
        private readonly ActivityLogService $activityLogService,
    ) {}

    public function execute(ClientData $data): Client
    {
        $identifiers = $this->postgresService->generateIdentifiers(
            $data->companyName,
            $data->domain,
        );

        $provisioned = false;

        try {
            return DB::transaction(function () use ($data, $identifiers, &$provisioned): Client {
                $credentials = $this->postgresService->provision(
                    $identifiers->databaseName,
                    $identifiers->databaseUser,
                    $identifiers->databasePassword,
                );
                $provisioned = true;

                $client = Client::query()->create([
                    ...$data->toArray(),
                    'database_name' => $credentials->databaseName,
                    'database_user' => $credentials->databaseUser,
                    'database_password_encrypted' => $credentials->databasePassword,
                ]);

                $this->activityLogService->log(
                    action: 'client.created',
                    description: "Client \"{$client->company_name}\" was created.",
                    subject: $client,
                    properties: [
                        'domain' => $client->domain,
                        'database_name' => $client->database_name,
                        'database_user' => $client->database_user,
                    ],
                );

                $this->activityLogService->log(
                    action: 'database.created',
                    description: "Database \"{$credentials->databaseName}\" was created.",
                    subject: $client,
                    properties: [
                        'database_name' => $credentials->databaseName,
                        'database_user' => $credentials->databaseUser,
                    ],
                );

                return $client;
            });
        } catch (Throwable $exception) {
            if ($provisioned) {
                $this->postgresService->deprovision(
                    $identifiers->databaseName,
                    $identifiers->databaseUser,
                );
            }

            $this->activityLogService->log(
                action: 'client.created',
                description: 'Client creation failed.',
                status: 'failed',
                properties: [
                    'domain' => $data->domain,
                    'error' => $exception->getMessage(),
                ],
            );

            throw new PostgresProvisioningException(
                'Failed to create client: '.$exception->getMessage(),
                previous: $exception,
            );
        }
    }
}
