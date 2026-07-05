<?php

namespace App\Services;

use App\DTOs\ShellResult;
use Illuminate\Support\Str;

class NginxService
{
    public function __construct(
        private readonly ShellService $shellService,
    ) {}

    /**
     * @return list<string>
     */
    public function sites(): array
    {
        $path = (string) config('panel.nginx.sites_available');

        if (! is_dir($path)) {
            return [];
        }

        return collect(scandir($path) ?: [])
            ->filter(fn (string $file): bool => ! in_array($file, ['.', '..'], true) && ! str_ends_with($file, '.bak'))
            ->values()
            ->all();
    }

    public function createVirtualHost(string $domain, string $root, ?string $phpSocket = null): ShellResult
    {
        $phpSocket ??= 'unix:/run/php/php8.4-fpm.sock';

        return $this->shellService->run('nginx_create_vhost.sh', [
            Str::slug($domain, '_'),
            $domain,
            $root,
            $phpSocket,
        ]);
    }

    public function enableSite(string $site): ShellResult
    {
        return $this->shellService->run('nginx_enable_site.sh', [$site]);
    }

    public function disableSite(string $site): ShellResult
    {
        return $this->shellService->run('nginx_disable_site.sh', [$site]);
    }

    public function deleteSite(string $site): ShellResult
    {
        return $this->shellService->run('nginx_delete_site.sh', [$site]);
    }

    public function testConfiguration(): ShellResult
    {
        return $this->shellService->run('nginx_test_config.sh', []);
    }

    public function reload(): ShellResult
    {
        return $this->shellService->run('nginx_reload.sh', []);
    }

    public function restart(): ShellResult
    {
        return $this->shellService->run('nginx_restart.sh', []);
    }

    public function readErrorLog(int $lines = 100): string
    {
        $result = $this->shellService->runOptional('nginx_tail_log.sh', ['error', (string) $lines]);

        return $result->output ?: $result->errorOutput;
    }
}
