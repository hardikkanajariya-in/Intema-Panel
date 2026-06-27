<?php

namespace App\DTOs;

readonly class DomainData
{
    public function __construct(
        public string $hostname,
        public ?int $projectId = null,
        public ?int $applicationId = null,
        public ?string $documentRoot = null,
        public ?string $notes = null,
    ) {}

    /**
     * @param  array<string, mixed>  $data
     */
    public static function fromArray(array $data): self
    {
        return new self(
            hostname: (string) $data['hostname'],
            projectId: isset($data['project_id']) ? (int) $data['project_id'] : null,
            applicationId: isset($data['application_id']) ? (int) $data['application_id'] : null,
            documentRoot: $data['document_root'] ?? null,
            notes: $data['notes'] ?? null,
        );
    }
}
