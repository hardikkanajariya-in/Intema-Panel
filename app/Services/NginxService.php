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

    public function createVirtualHost(string $domain, string $root, ?string $phpSocket = null, ?string $proxyPort = null): ShellResult
    {
        $phpSocket ??= 'unix:/run/php/php8.4-fpm.sock';

        return $this->shellService->run('nginx_create_vhost.sh', [
            Str::slug($domain, '_'),
            $domain,
            $root,
            $phpSocket,
            $proxyPort ?: '',
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

    public function getSiteConfig(string $site): string
    {
        $sitesAvailable = (string) config('panel.nginx.sites_available');
        $filePath = rtrim($sitesAvailable, '/') . '/' . $site;

        if (! is_file($filePath)) {
            return '';
        }

        return (string) @file_get_contents($filePath);
    }

    public function updateSiteConfig(string $site, string $content): ShellResult
    {
        $sitesAvailable = (string) config('panel.nginx.sites_available');
        $targetPath = rtrim($sitesAvailable, '/') . '/' . $site;
        $backupPath = $targetPath . '.bak';
        $hadOriginal = is_file($targetPath);

        // 1. Create backup if the file already exists
        if ($hadOriginal) {
            $this->shellService->runSystem('cp', ['-f', $targetPath, $backupPath]);
        }

        // 2. Write new content to a temporary location
        if (! is_dir(storage_path('app'))) {
            mkdir(storage_path('app'), 0755, true);
        }
        $tempPath = storage_path('app/nginx_tmp_' . uniqid() . '.conf');
        file_put_contents($tempPath, $content);

        try {
            // 3. Overwrite the target config
            $this->shellService->runSystem('cp', ['-f', $tempPath, $targetPath]);
        } finally {
            if (is_file($tempPath)) {
                @unlink($tempPath);
            }
        }

        // 4. Test the Nginx configuration
        $testResult = $this->shellService->runOptional('nginx_test_config.sh');

        if ($testResult->exitCode !== 0) {
            // 5. On failure, restore backup or remove target
            if ($hadOriginal) {
                $this->shellService->runSystem('cp', ['-f', $backupPath, $targetPath]);
            } else {
                $this->shellService->runSystem('rm', ['-f', $targetPath]);
            }
            if (is_file($backupPath)) {
                $this->shellService->runSystem('rm', ['-f', $backupPath], optional: true);
            }
            return $testResult;
        }

        // 6. On success, delete backup and reload Nginx
        if (is_file($backupPath)) {
            $this->shellService->runSystem('rm', ['-f', $backupPath], optional: true);
        }
        
        $this->reload();

        return new ShellResult(0, 'Nginx configuration updated successfully.', '');
    }
}
