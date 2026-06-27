<?php

namespace App\Support;

use App\Models\Client;

class ClientResource
{
    /**
     * @return array<string, mixed>
     */
    public static function make(Client $client): array
    {
        return [
            'id' => $client->id,
            'company_name' => $client->company_name,
            'domain' => $client->domain,
            'database_name' => $client->database_name,
            'database_user' => $client->database_user,
            'status' => $client->status->value,
            'notes' => $client->notes,
            'created_at' => $client->created_at?->toIso8601String(),
            'updated_at' => $client->updated_at?->toIso8601String(),
        ];
    }

    /**
     * @param  iterable<int, Client>  $clients
     * @return list<array<string, mixed>>
     */
    public static function collection(iterable $clients): array
    {
        $result = [];

        foreach ($clients as $client) {
            $result[] = self::make($client);
        }

        return $result;
    }
}
