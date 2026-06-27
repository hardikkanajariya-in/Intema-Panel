<?php

namespace App\Provision\Tasks;

use App\Provision\Contracts\TaskInterface;
use App\Provision\Engine\ProvisionContext;
use App\Provision\Engine\TaskResult;
use App\Services\SslService;

class GenerateSslTask implements TaskInterface
{
    public function __construct(
        private readonly SslService $sslService,
    ) {}

    public function name(): string
    {
        return 'generate_ssl';
    }

    public function execute(ProvisionContext $context): TaskResult
    {
        $domain = (string) $context->get('domain');

        if ($domain === '' || ! $context->get('generate_ssl')) {
            return TaskResult::success('Skipped SSL generation (not requested).');
        }

        $email = (string) (config('panel.ssl.email') ?: setting('support_email', config('panel.support_email')));
        $this->sslService->obtain($domain, $email);

        return TaskResult::success("SSL certificate obtained for {$domain}.");
    }
}
