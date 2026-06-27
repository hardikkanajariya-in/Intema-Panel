<?php

namespace App\Services;

use InvalidArgumentException;
use Symfony\Component\Process\Process;

/**
 * @phpstan-type ComponentStatus array{
 *     name: string,
 *     label: string,
 *     installed: bool,
 *     version: string|null,
 *     status: string,
 *     binary: string,
 *     service: string|null,
 * }
 */
class SystemManagerService
{
    /**
     * @var array<string, array{label: string, binary: string, service: string|null, script: string|null}>
     */
    private const COMPONENTS = [
        'php' => ['label' => 'PHP', 'binary' => 'php', 'service' => 'php8.3-fpm', 'script' => '03-php-composer.sh'],
        'composer' => ['label' => 'Composer', 'binary' => 'composer', 'service' => null, 'script' => '03-php-composer.sh'],
        'node' => ['label' => 'Node.js', 'binary' => 'node', 'service' => null, 'script' => '06-node-supervisor.sh'],
        'npm' => ['label' => 'NPM', 'binary' => 'npm', 'service' => null, 'script' => '06-node-supervisor.sh'],
        'postgresql' => ['label' => 'PostgreSQL', 'binary' => 'psql', 'service' => 'postgresql', 'script' => '04-postgresql.sh'],
        'nginx' => ['label' => 'Nginx', 'binary' => 'nginx', 'service' => 'nginx', 'script' => '05-nginx-certbot.sh'],
        'certbot' => ['label' => 'Certbot', 'binary' => 'certbot', 'service' => null, 'script' => '05-nginx-certbot.sh'],
        'git' => ['label' => 'Git', 'binary' => 'git', 'service' => null, 'script' => '02-base-packages.sh'],
        'supervisor' => ['label' => 'Supervisor', 'binary' => 'supervisord', 'service' => 'supervisor', 'script' => '06-node-supervisor.sh'],
        'fail2ban' => ['label' => 'Fail2Ban', 'binary' => 'fail2ban-client', 'service' => 'fail2ban', 'script' => '02-base-packages.sh'],
        'ufw' => ['label' => 'UFW', 'binary' => 'ufw', 'service' => null, 'script' => '02-base-packages.sh'],
    ];

    public function __construct(
        private readonly SystemCommandService $commandService,
        private readonly ActivityLogService $activityLogService,
    ) {}

    /**
     * @return list<ComponentStatus>
     */
    public function components(): array
    {
        $components = [];

        foreach (self::COMPONENTS as $name => $definition) {
            $installed = $this->commandService->isInstalled($definition['binary']);
            $status = 'Missing';

            if ($installed && $definition['service']) {
                $status = $this->commandService->serviceStatus($definition['service']);
            } elseif ($installed) {
                $status = 'Installed';
            }

            $components[] = [
                'name' => $name,
                'label' => $definition['label'],
                'installed' => $installed,
                'version' => $installed ? $this->commandService->runVersion($definition['binary']) : null,
                'status' => $status,
                'binary' => $definition['binary'],
                'service' => $definition['service'],
            ];
        }

        return $components;
    }

    public function performAction(string $component, string $action): void
    {
        if (! isset(self::COMPONENTS[$component])) {
            throw new InvalidArgumentException('Unknown component.');
        }

        $definition = self::COMPONENTS[$component];

        match ($action) {
            'install' => $this->install($component, $definition),
            'update' => $this->update($component, $definition),
            'repair' => $this->repair($component, $definition),
            'validate' => $this->validate($component, $definition),
            'start', 'stop', 'restart', 'reload' => $this->serviceAction($component, $definition, $action),
            default => throw new InvalidArgumentException('Action not allowed.'),
        };
    }

    /**
     * @param  array{label: string, binary: string, service: string|null, script: string|null}  $definition
     */
    private function install(string $component, array $definition): void
    {
        if ($definition['script'] === null) {
            throw new InvalidArgumentException('Component cannot be installed from panel.');
        }

        $this->runBootstrapScript($definition['script']);

        $this->activityLogService->log(
            action: 'system.install',
            description: "{$definition['label']} installed.",
            properties: ['component' => $component],
        );
    }

    /**
     * @param  array{label: string, binary: string, service: string|null, script: string|null}  $definition
     */
    private function update(string $component, array $definition): void
    {
        $process = new Process(['apt-get', 'update']);
        $process->setTimeout(300);
        $process->mustRun();

        $this->runBootstrapScript($definition['script'] ?? '01-apt-update.sh');

        $this->activityLogService->log(
            action: 'system.update',
            description: "{$definition['label']} updated.",
            properties: ['component' => $component],
        );
    }

    /**
     * @param  array{label: string, binary: string, service: string|null, script: string|null}  $definition
     */
    private function repair(string $component, array $definition): void
    {
        if ($definition['service']) {
            $this->commandService->serviceAction($definition['service'], 'restart');
        }

        $this->activityLogService->log(
            action: 'system.repair',
            description: "{$definition['label']} repaired.",
            properties: ['component' => $component],
        );
    }

    /**
     * @param  array{label: string, binary: string, service: string|null, script: string|null}  $definition
     */
    private function validate(string $component, array $definition): void
    {
        if (! $this->commandService->isInstalled($definition['binary'])) {
            throw new InvalidArgumentException("{$definition['label']} is not installed.");
        }

        $this->activityLogService->log(
            action: 'system.validate',
            description: "{$definition['label']} validated.",
            properties: ['component' => $component],
        );
    }

    /**
     * @param  array{label: string, binary: string, service: string|null, script: string|null}  $definition
     */
    private function serviceAction(string $component, array $definition, string $action): void
    {
        if ($definition['service'] === null) {
            throw new InvalidArgumentException('Component does not support service actions.');
        }

        $this->commandService->serviceAction($definition['service'], $action);

        $this->activityLogService->log(
            action: 'system.'.$action,
            description: "{$definition['label']} {$action} completed.",
            properties: ['component' => $component, 'action' => $action],
        );
    }

    private function runBootstrapScript(string $script): void
    {
        $bootstrapDir = base_path('bootstrap/lib');
        $scriptPath = $bootstrapDir.DIRECTORY_SEPARATOR.$script;

        if (! is_file($scriptPath)) {
            throw new InvalidArgumentException("Bootstrap script not found: {$script}");
        }

        $process = new Process(['bash', $scriptPath]);
        $process->setTimeout((int) config('panel.shell.timeout', 600));
        $process->mustRun();
    }
}
