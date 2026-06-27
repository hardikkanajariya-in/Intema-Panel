<?php

namespace App\Services;

use App\Models\ManagedDatabase;
use Illuminate\Support\Collection;

class DatabaseManagerService
{
    public function __construct(
        private readonly PostgresService $postgresService,
        private readonly ShellService $shellService,
    ) {}

    /**
     * @return Collection<int, array<string, mixed>>
     */
    public function list(): Collection
    {
        return ManagedDatabase::query()
            ->with(['project', 'application'])
            ->orderBy('name')
            ->get()
            ->map(fn (ManagedDatabase $database): array => [
                'uuid' => $database->uuid,
                'name' => $database->name,
                'database_name' => $database->database_name,
                'database_user' => $database->database_user,
                'exists' => $this->postgresService->databaseExists($database->database_name),
                'connection_string' => $this->connectionString($database),
            ]);
    }

    public function backup(ManagedDatabase $database): string
    {
        $result = $this->shellService->run('postgres_backup.sh', [$database->database_name]);

        return $result->output;
    }

    public function connectionString(ManagedDatabase $database): string
    {
        return sprintf(
            'postgresql://%s:***@%s:%d/%s',
            $database->database_user,
            $database->host,
            $database->port,
            $database->database_name,
        );
    }
}
