<?php

namespace App\Actions;

use App\Models\ActivityLog;
use App\Models\Client;

class DeleteClientAction
{
    public function execute(Client $client): void
    {
        ActivityLog::query()->create([
            'action' => 'client.deleted',
            'subject_type' => Client::class,
            'subject_id' => $client->id,
            'description' => "Client \"{$client->company_name}\" was deleted.",
            'properties' => [
                'domain' => $client->domain,
            ],
        ]);

        $client->delete();
    }
}
