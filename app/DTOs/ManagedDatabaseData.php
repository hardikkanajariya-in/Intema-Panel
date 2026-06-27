<?php

namespace App\DTOs;

readonly class ManagedDatabaseData
{
    public function __construct(
        public string $name,
        public ?int $projectId = null,
        public ?int $applicationId = null,
        public ?string $databaseName = null,
        public ?string $databaseUser = null,
        public ?string $databasePassword = null,
        public ?string $host = null,
        public ?int $port = null,
        public ?string $notes = null,
    ) {}

    /**
     * @param  array<string, mixed>  $data
     */
    public static function fromArray(array $data): self
    {
        return new self(
            name: (string) $data['name'],
            projectId: isset($data['project_id']) ? (int) $data['project_id'] : null,
            applicationId: isset($data['application_id']) ? (int) $data['application_id'] : null,
            databaseName: $data['database_name'] ?? null,
            databaseUser: $data['database_user'] ?? null,
            databasePassword: $data['database_password'] ?? null,
            host: $data['host'] ?? null,
            port: isset($data['port']) ? (int) $data['port'] : null,
            notes: $data['notes'] ?? null,
        );
    }
}
