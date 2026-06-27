<?php

namespace App\Actions;

use App\DTOs\ClientData;
use App\Models\Client;
use App\Services\ActivityLogService;
use App\Services\PostgresService;

class UpdateClientAction
{
    public function __construct(
        private readonly ActivityLogService $activityLogService,
        private readonly PostgresService $postgresService,
    ) {}

    public function execute(Client $client, ClientData $data): Client
    {
        if ($data->databasePassword !== null && $data->databasePassword !== '' && $client->database_user) {
            $password = $this->postgresService->resetPassword(
                $client->database_user,
                $data->databasePassword,
            );

            $client->update([
                ...$data->toArray(),
                'database_password_encrypted' => $password,
            ]);

            $this->activityLogService->log(
                action: 'password.reset',
                description: "Database password reset for \"{$client->company_name}\".",
                subject: $client,
                properties: [
                    'database_user' => $client->database_user,
                ],
            );
        } else {
            $client->update($data->toArray());
        }

        $this->activityLogService->log(
            action: 'client.updated',
            description: "Client \"{$client->company_name}\" was updated.",
            subject: $client->fresh(),
            properties: [
                'domain' => $client->domain,
            ],
        );

        return $client->fresh();
    }
}
