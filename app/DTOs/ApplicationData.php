<?php

namespace App\DTOs;

use App\Enums\ApplicationType;

readonly class ApplicationData
{
    /**
     * @param  array<string, string>|null  $environmentVariables
     * @param  array<string, mixed>|null  $metadata
     */
    public function __construct(
        public string $name,
        public ApplicationType $type,
        public ?int $projectId = null,
        public ?string $rootPath = null,
        public ?string $repositoryUrl = null,
        public ?string $repositoryBranch = null,
        public ?string $deployPath = null,
        public ?string $runtime = null,
        public ?string $buildCommand = null,
        public ?string $startCommand = null,
        public ?array $environmentVariables = null,
        public ?string $linuxUser = null,
        public ?array $metadata = null,
        public ?string $notes = null,
    ) {}

    /**
     * @param  array<string, mixed>  $data
     */
    public static function fromArray(array $data): self
    {
        return new self(
            name: (string) $data['name'],
            type: ApplicationType::from((string) $data['type']),
            projectId: isset($data['project_id']) ? (int) $data['project_id'] : null,
            rootPath: $data['root_path'] ?? null,
            repositoryUrl: $data['repository_url'] ?? null,
            repositoryBranch: $data['repository_branch'] ?? 'main',
            deployPath: $data['deploy_path'] ?? null,
            runtime: $data['runtime'] ?? null,
            buildCommand: $data['build_command'] ?? null,
            startCommand: $data['start_command'] ?? null,
            environmentVariables: $data['environment_variables'] ?? null,
            linuxUser: $data['linux_user'] ?? null,
            metadata: $data['metadata'] ?? null,
            notes: $data['notes'] ?? null,
        );
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'name' => $this->name,
            'type' => $this->type->value,
            'project_id' => $this->projectId,
            'root_path' => $this->rootPath,
            'repository_url' => $this->repositoryUrl,
            'repository_branch' => $this->repositoryBranch,
            'deploy_path' => $this->deployPath,
            'runtime' => $this->runtime,
            'build_command' => $this->buildCommand,
            'start_command' => $this->startCommand,
            'environment_variables' => $this->environmentVariables,
            'linux_user' => $this->linuxUser,
            'metadata' => $this->metadata,
            'notes' => $this->notes,
        ];
    }
}
