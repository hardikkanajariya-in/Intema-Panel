<?php

namespace App\DTOs;

use App\Enums\ClientStatus;

readonly class ClientData
{
    public function __construct(
        public string $companyName,
        public string $domain,
        public ?string $databaseName,
        public ?string $databaseUser,
        public ?string $databasePassword,
        public ClientStatus $status,
        public ?string $notes,
    ) {}

    /**
     * @param  array<string, mixed>  $data
     */
    public static function fromArray(array $data): self
    {
        return new self(
            companyName: $data['company_name'],
            domain: $data['domain'],
            databaseName: $data['database_name'] ?? null,
            databaseUser: $data['database_user'] ?? null,
            databasePassword: $data['database_password'] ?? null,
            status: $data['status'] instanceof ClientStatus
                ? $data['status']
                : ClientStatus::from($data['status']),
            notes: $data['notes'] ?? null,
        );
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'company_name' => $this->companyName,
            'domain' => $this->domain,
            'status' => $this->status,
            'notes' => $this->notes,
        ];
    }
}
