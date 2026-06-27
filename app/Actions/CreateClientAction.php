<?php

namespace App\Actions;

use App\DTOs\ClientData;
use App\Models\ActivityLog;
use App\Models\Client;

class CreateClientAction
{
    public function execute(ClientData $data): Client
    {
        $client = Client::query()->create($data->toArray());

        ActivityLog::query()->create([
            'action' => 'client.created',
            'subject_type' => Client::class,
            'subject_id' => $client->id,
            'description' => "Client \"{$client->company_name}\" was created.",
            'properties' => [
                'domain' => $client->domain,
            ],
        ]);

        return $client;
    }
}
