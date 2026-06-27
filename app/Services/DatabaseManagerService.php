<?php

namespace App\Services;

use App\Models\Client;
use Illuminate\Support\Collection;

class DatabaseManagerService
{
    public function __construct(
        private readonly PostgresService $postgresService,
    ) {}

    /**
     * @return Collection<int, array<string, mixed>>
     */
    public function list(): Collection
    {
        return Client::query()
            ->whereNotNull('database_name')
            ->orderBy('company_name')
            ->get()
            ->map(fn (Client $client): array => [
                'id' => $client->id,
                'company_name' => $client->company_name,
                'domain' => $client->domain,
                'database_name' => $client->database_name,
                'database_user' => $client->database_user,
                'exists' => $client->database_name
                    ? $this->postgresService->databaseExists($client->database_name)
                    : false,
                'connection_string' => $this->connectionString($client),
            ]);
    }

    public function backup(Client $client): string
    {
        if (! $client->database_name) {
            throw new \InvalidArgumentException('Client has no database.');
        }

        $result = app(ShellService::class)->run('postgres_backup.sh', [$client->database_name]);

        return $result->output;
    }

    public function connectionString(Client $client): string
    {
        return sprintf(
            'postgresql://%s:***@%s:%s/%s',
            $client->database_user ?? 'user',
            config('panel.postgres.host'),
            config('panel.postgres.port'),
            $client->database_name ?? 'database',
        );
    }
}
