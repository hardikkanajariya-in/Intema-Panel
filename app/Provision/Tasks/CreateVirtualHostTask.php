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

        $phpSocket = $context->get('php_socket');
        $this->nginxService->createVirtualHost($domain, $root, is_string($phpSocket) ? $phpSocket : null);

        return TaskResult::success("Virtual host created for {$domain}.");
    }
}
