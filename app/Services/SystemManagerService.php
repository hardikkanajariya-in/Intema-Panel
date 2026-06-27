<?php

namespace App\Services;

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
    public function __construct(
        private readonly SystemCommandService $commandService,
    ) {}

    /**
     * @return list<ComponentStatus>
     */
    public function components(): array
    {
        $definitions = [
            ['name' => 'php', 'label' => 'PHP', 'binary' => 'php', 'service' => 'php8.3-fpm'],
            ['name' => 'composer', 'label' => 'Composer', 'binary' => 'composer', 'service' => null],
            ['name' => 'node', 'label' => 'Node.js', 'binary' => 'node', 'service' => null],
            ['name' => 'npm', 'label' => 'NPM', 'binary' => 'npm', 'service' => null],
            ['name' => 'postgresql', 'label' => 'PostgreSQL', 'binary' => 'psql', 'service' => 'postgresql'],
            ['name' => 'nginx', 'label' => 'Nginx', 'binary' => 'nginx', 'service' => 'nginx'],
            ['name' => 'certbot', 'label' => 'Certbot', 'binary' => 'certbot', 'service' => null],
            ['name' => 'git', 'label' => 'Git', 'binary' => 'git', 'service' => null],
            ['name' => 'supervisor', 'label' => 'Supervisor', 'binary' => 'supervisord', 'service' => 'supervisor'],
            ['name' => 'fail2ban', 'label' => 'Fail2Ban', 'binary' => 'fail2ban-client', 'service' => 'fail2ban'],
            ['name' => 'ufw', 'label' => 'UFW', 'binary' => 'ufw', 'service' => null],
        ];

        $components = [];

        foreach ($definitions as $definition) {
            $installed = $this->commandService->isInstalled($definition['binary']);
            $status = 'Missing';

            if ($installed && $definition['service']) {
                $status = $this->commandService->serviceStatus($definition['service']);
            } elseif ($installed) {
                $status = 'Installed';
            }

            $components[] = [
                'name' => $definition['name'],
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
        $componentMap = collect($this->components())->keyBy('name');

        /** @var ComponentStatus|null $definition */
        $definition = $componentMap->get($component);

        if ($definition === null || $definition['service'] === null) {
            throw new \InvalidArgumentException('Component does not support service actions.');
        }

        $this->commandService->serviceAction($definition['service'], $action);
    }
}
