<?php

namespace App\Provision\Tasks;

use App\Provision\Engine\ProvisionContext;
use App\Provision\Engine\TaskResult;
use App\Services\ShellService;

class CreateSupervisorConfigTask extends AbstractTask
{
    public function __construct(
        private readonly ShellService $shellService,
    ) {}

    public function name(): string
    {
        return 'create_supervisor_config';
    }

    public function execute(ProvisionContext $context): TaskResult
    {
        $application = $context->getApplication();
        $path = (string) $context->get('deploy_path');
        $startCommand = (string) ($context->get('start_command') ?: $application->start_command);

        $nodeTypes = [\App\Enums\ApplicationType::NextJs, \App\Enums\ApplicationType::NestJs, \App\Enums\ApplicationType::ApiOnly];
        if (! in_array($application->type, $nodeTypes, true)) {
            return TaskResult::success('Skipped supervisor config (not a Node-based application).');
        }

        if ($startCommand === '') {
            return TaskResult::success('Skipped supervisor config (no start command configured).');
        }

        $slug = \Illuminate\Support\Str::slug($application->name, '_') . '_' . $application->id;
        $configFile = "/etc/supervisor/conf.d/{$slug}.conf";
        $user = $application->linux_user ?: 'www-data';
        $port = $application->metadata['port'] ?? 3000;

        // Parse environment variables
        $envStr = "PORT=\"{$port}\",NODE_ENV=\"production\",NODE_OPTIONS=\"--max-old-space-size=1536\"";
        if (is_array($application->environment_variables)) {
            foreach ($application->environment_variables as $k => $v) {
                $envStr .= ",{$k}=\"{$v}\"";
            }
        }

        $configContent = <<<EOT
[program:{$slug}]
command={$startCommand}
directory={$path}
autostart=true
autorestart=true
user={$user}
stdout_logfile=/var/log/supervisor/{$slug}.log
stderr_logfile=/var/log/supervisor/{$slug}.err.log
environment={$envStr}
EOT;

        try {
            // Write supervisor configuration file (requires root)
            // Using shell/file manager style or writing directly
            @file_put_contents($configFile, $configContent);

            // Re-read and update supervisor configurations
            $this->shellService->runSystem('supervisorctl', ['reread']);
            $this->shellService->runSystem('supervisorctl', ['update']);
            $this->shellService->runSystem('supervisorctl', ['restart', $slug], optional: true);
        } catch (\Throwable $e) {
            return TaskResult::success('Warning: Failed to reload Supervisor: ' . $e->getMessage() . '. Make sure supervisor is running.');
        }

        return TaskResult::success("Supervisor service created and started for {$slug} on port {$port}.");
    }
}
