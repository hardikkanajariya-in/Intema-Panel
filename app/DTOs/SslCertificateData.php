<?php

namespace App\DTOs;

readonly class SslCertificateData
{
    public function __construct(
        public string $domainName,
        public ?int $projectId = null,
        public ?int $domainId = null,
        public ?bool $autoRenew = null,
        public ?string $notes = null,
    ) {}

    /**
     * @param  array<string, mixed>  $data
     */
    public static function fromArray(array $data): self
    {
        return new self(
            domainName: (string) ($data['domain_name'] ?? $data['hostname'] ?? ''),
            projectId: isset($data['project_id']) ? (int) $data['project_id'] : null,
            domainId: isset($data['domain_id']) ? (int) $data['domain_id'] : null,
            autoRenew: isset($data['auto_renew']) ? (bool) $data['auto_renew'] : null,
            notes: $data['notes'] ?? null,
        );
    }
}
