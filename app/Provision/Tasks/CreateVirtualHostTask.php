<?php

namespace App\Provision\Tasks;

use App\Provision\Engine\ProvisionContext;
use App\Provision\Engine\TaskResult;
use App\Services\NginxService;

class CreateVirtualHostTask extends AbstractTask
{
    public function __construct(
        private readonly NginxService $nginxService,
    ) {}

    public function name(): string
    {
        return 'create_virtual_host';
    }

    public function execute(ProvisionContext $context): TaskResult
    {
        $domain = (string) $context->get('domain');
        $root = (string) $context->get('document_root');

        if ($domain === '' || $root === '') {
            return TaskResult::success('Skipped virtual host creation (no domain configured).');
        }

        $application = $context->getApplication();
        $proxyPort = $context->get('proxy_port') ?: ($application->metadata['port'] ?? null);

        $nodeTypes = [\App\Enums\ApplicationType::NextJs, \App\Enums\ApplicationType::NestJs, \App\Enums\ApplicationType::ApiOnly];
        if (in_array($application->type, $nodeTypes, true) && ! $proxyPort) {
            $assignedPorts = \App\Models\Application::query()
                ->where('id', '!=', $application->id)
                ->get()
                ->map(fn ($app) => $app->metadata['port'] ?? null)
                ->filter()
                ->toArray();

            $port = 3000;
            while (in_array($port, $assignedPorts, true)) {
                $port++;
            }

            $proxyPort = (string) $port;
            $metadata = $application->metadata ?? [];
            $metadata['port'] = $port;
            $application->update(['metadata' => $metadata]);
        }

        $phpSocket = $context->get('php_socket');
        $this->nginxService->createVirtualHost(
            $domain,
            $root,
            is_string($phpSocket) ? $phpSocket : null,
            $proxyPort ? (string) $proxyPort : null
        );

        return TaskResult::success("Virtual host created for {$domain}.");
    }
}
