<?php

namespace App\DTOs;

use App\Enums\ResourceStatus;

readonly class ProjectData
{
    public function __construct(
        public string $name,
        public ?string $slug = null,
        public ?string $description = null,
        public ?ResourceStatus $status = null,
        public ?string $notes = null,
    ) {}

    /**
     * @param  array<string, mixed>  $data
     */
    public static function fromArray(array $data): self
    {
        return new self(
            name: (string) $data['name'],
            slug: $data['slug'] ?? null,
            description: $data['description'] ?? null,
            status: isset($data['status']) ? ResourceStatus::from((string) $data['status']) : null,
            notes: $data['notes'] ?? null,
        );
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return array_filter([
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'status' => $this->status?->value,
            'notes' => $this->notes,
        ], fn ($value) => $value !== null);
    }
}
