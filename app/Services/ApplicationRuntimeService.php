<?php

namespace App\Services;

use App\Enums\ApplicationType;
use App\Models\Application;
use InvalidArgumentException;

class ApplicationRuntimeService
{
    public function __construct(
        private readonly ShellService $shellService,
        private readonly ActivityLogService $activityLogService,
    ) {}

    /**
     * @return list<array{key: string, label: string}>
     */
    public function availableOperations(Application $application): array
    {
        return match ($application->type) {
            ApplicationType::Laravel => [
                ['key' => 'optimize', 'label' => 'Optimize'],
                ['key' => 'cache_config', 'label' => 'Cache Config'],
                ['key' => 'cache_routes', 'label' => 'Cache Routes'],
                ['key' => 'cache_views', 'label' => 'Cache Views'],
                ['key' => 'storage_link', 'label' => 'Storage Link'],
                ['key' => 'queue_restart', 'label' => 'Queue Restart'],
                ['key' => 'migrate', 'label' => 'Migrate'],
            ],
            ApplicationType::NestJs => [
                ['key' => 'update_metadata', 'label' => 'Update Metadata'],
            ],
            ApplicationType::NextJs => [
                ['key' => 'update_vercel_metadata', 'label' => 'Update Vercel Metadata'],
            ],
            ApplicationType::StaticWebsite => [
                ['key' => 'update_document_root', 'label' => 'Update Document Root'],
                ['key' => 'enable_compression', 'label' => 'Enable Compression'],
                ['key' => 'enable_security_headers', 'label' => 'Security Headers'],
            ],
            ApplicationType::StandardPhp, ApplicationType::ApiOnly => [
                ['key' => 'update_document_root', 'label' => 'Update Document Root'],
                ['key' => 'update_php_version', 'label' => 'Update PHP Version'],
                ['key' => 'update_environment', 'label' => 'Update Environment'],
            ],
            ApplicationType::Custom => [
                ['key' => 'health_check', 'label' => 'Health Check'],
            ],
        };
    }

    /**
     * @param  array<string, mixed>  $input
     */
    public function run(Application $application, string $operation, array $input = []): string
    {
        $path = $application->deploy_path;

        $message = match ($application->type) {
            ApplicationType::Laravel => $this->runLaravel($path, $operation),
            ApplicationType::NestJs => $this->runNestMetadata($application, $input),
            ApplicationType::NextJs => $this->runNextMetadata($application, $input),
            ApplicationType::StaticWebsite => $this->runStatic($application, $operation, $input),
            ApplicationType::StandardPhp, ApplicationType::ApiOnly => $this->runPhp($application, $operation, $input),
            ApplicationType::Custom => $this->runCustomHealth($path),
        };

        $this->activityLogService->log(
            action: 'application.runtime',
            description: "Runtime operation \"{$operation}\" completed for \"{$application->name}\".",
            subject: $application,
            properties: ['operation' => $operation],
        );

        return $message;
    }

    private function runLaravel(?string $path, string $operation): string
    {
        if (! $path || ! is_file($path.'/artisan')) {
            throw new InvalidArgumentException('Laravel deploy path or artisan file not found.');
        }

        $commands = match ($operation) {
            'optimize' => [['php', 'artisan', 'optimize']],
            'cache_config' => [['php', 'artisan', 'config:cache']],
            'cache_routes' => [['php', 'artisan', 'route:cache']],
            'cache_views' => [['php', 'artisan', 'view:cache']],
            'storage_link' => [['php', 'artisan', 'storage:link']],
            'queue_restart' => [['php', 'artisan', 'queue:restart']],
            'migrate' => [['php', 'artisan', 'migrate', '--force']],
            default => throw new InvalidArgumentException('Unknown Laravel operation.'),
        };

        foreach ($commands as $command) {
            $this->shellService->runSystem($command[0], array_slice($command, 1), cwd: $path);
        }

        return 'Laravel operation completed successfully.';
    }

    /**
     * @param  array<string, mixed>  $input
     */
    private function runNestMetadata(Application $application, array $input): string
    {
        $metadata = array_merge($application->metadata ?? [], array_filter([
            'node_version' => $input['node_version'] ?? null,
            'build_command' => $input['build_command'] ?? null,
            'environment' => $input['environment'] ?? null,
        ]));

        $application->update([
            'runtime' => $input['node_version'] ?? $application->runtime,
            'build_command' => $input['build_command'] ?? $application->build_command,
            'metadata' => $metadata,
        ]);

        return 'NestJS runtime metadata updated.';
    }

    /**
     * @param  array<string, mixed>  $input
     */
    private function runNextMetadata(Application $application, array $input): string
    {
        $metadata = array_merge($application->metadata ?? [], [
            'deployment_target' => 'vercel',
            'vercel_project' => $input['vercel_project'] ?? ($application->metadata['vercel_project'] ?? null),
            'environment_variables' => $input['environment_variables'] ?? ($application->metadata['environment_variables'] ?? []),
        ]);

        $application->update([
            'environment_variables' => $input['environment_variables'] ?? $application->environment_variables,
            'metadata' => $metadata,
        ]);

        return 'Next.js Vercel metadata updated.';
    }

    /**
     * @param  array<string, mixed>  $input
     */
    private function runStatic(Application $application, string $operation, array $input): string
    {
        return match ($operation) {
            'update_document_root' => tap('Document root updated.', function () use ($application, $input): void {
                $application->update([
                    'root_path' => $input['document_root'] ?? $application->root_path,
                    'metadata' => array_merge($application->metadata ?? [], [
                        'document_root' => $input['document_root'] ?? $application->root_path,
                    ]),
                ]);
            }),
            'enable_compression' => tap('Compression enabled in metadata.', function () use ($application): void {
                $application->update(['metadata' => array_merge($application->metadata ?? [], ['compression' => true])]);
            }),
            'enable_security_headers' => tap('Security headers enabled in metadata.', function () use ($application): void {
                $application->update(['metadata' => array_merge($application->metadata ?? [], ['security_headers' => true])]);
            }),
            default => throw new InvalidArgumentException('Unknown static site operation.'),
        };
    }

    /**
     * @param  array<string, mixed>  $input
     */
    private function runPhp(Application $application, string $operation, array $input): string
    {
        return match ($operation) {
            'update_document_root' => tap('Document root updated.', function () use ($application, $input): void {
                $application->update(['root_path' => $input['document_root'] ?? $application->root_path]);
            }),
            'update_php_version' => tap('PHP version updated.', function () use ($application, $input): void {
                $application->update(['runtime' => $input['php_version'] ?? $application->runtime ?? 'php8.3']);
            }),
            'update_environment' => tap('Environment updated.', function () use ($application, $input): void {
                if (isset($input['environment_variables']) && is_array($input['environment_variables'])) {
                    $application->update(['environment_variables' => $input['environment_variables']]);
                }
            }),
            default => throw new InvalidArgumentException('Unknown PHP operation.'),
        };
    }

    private function runCustomHealth(?string $path): string
    {
        if ($path && ! is_dir($path)) {
            throw new InvalidArgumentException('Deploy path does not exist.');
        }

        return 'Health check passed.';
    }
}
