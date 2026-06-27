<?php

namespace App\Provision\Tasks;

use App\Provision\Contracts\TaskInterface;
use App\Provision\Engine\ProvisionContext;
use App\Provision\Engine\TaskResult;
use App\Services\NginxService;
use Illuminate\Support\Str;

class EnableSiteTask implements TaskInterface
{
    public function __construct(
        private readonly NginxService $nginxService,
    ) {}

    public function name(): string
    {
        return 'enable_site';
    }

    public function execute(ProvisionContext $context): TaskResult
    {
        $domain = (string) $context->get('domain');

        if ($domain === '') {
            return TaskResult::success('Skipped site enable (no domain configured).');
        }

        $site = Str::slug($domain, '_');
        $this->nginxService->enableSite($site);

        return TaskResult::success("Site enabled: {$site}");
    }
}
