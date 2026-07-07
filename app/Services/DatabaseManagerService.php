<?php

namespace App\Services;

use App\Models\ManagedDatabase;
use App\Models\DatabaseBackup;
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

    public function backup(ManagedDatabase $database): DatabaseBackup
    {
        $timestamp = now()->format('Ymd_His');
        $filename = "{$database->database_name}_{$timestamp}.sql";
        $dir = storage_path('app/backups');
        if (! is_dir($dir)) {
            mkdir($dir, 0755, true);
        }
        $absolutePath = $dir . DIRECTORY_SEPARATOR . $filename;

        $this->shellService->run('postgres_backup.sh', [
            $database->database_name,
            $absolutePath,
        ]);

        if (! is_file($absolutePath)) {
            throw new \RuntimeException('Backup file was not created.');
        }

        return $database->backups()->create([
            'filename' => $filename,
            'path' => 'backups/' . $filename,
            'size' => filesize($absolutePath),
        ]);
    }

    public function restore(ManagedDatabase $database, string $absolutePath): void
    {
        $this->shellService->run('postgres_restore.sh', [
            $database->database_name,
            $absolutePath,
            $database->database_user,
        ]);
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
