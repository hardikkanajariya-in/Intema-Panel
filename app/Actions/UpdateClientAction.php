<?php

namespace App\Actions;

use App\DTOs\ClientData;
use App\Models\ActivityLog;
use App\Models\Client;

class UpdateClientAction
{
    public function execute(Client $client, ClientData $data): Client
    {
        $client->update($data->toArray());

        ActivityLog::query()->create([
            'action' => 'client.updated',
            'subject_type' => Client::class,
            'subject_id' => $client->id,
            'description' => "Client \"{$client->company_name}\" was updated.",
            'properties' => [
                'domain' => $client->domain,
            ],
        ]);

        return $client->fresh();
    }
}
