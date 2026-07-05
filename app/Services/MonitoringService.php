<?php

namespace App\Services;

use Illuminate\Foundation\Application;
use Symfony\Component\Process\Process;

class MonitoringService
{
    public function __construct(
        private readonly SystemInfoService $systemInfoService,
    ) {}

    /**
     * @return array<string, mixed>
     */
    public function snapshot(): array
    {
        return [
            'cpu' => $this->systemInfoService->cpuUsage(),
            'ram' => $this->systemInfoService->ramUsage(),
            'disk' => $this->systemInfoService->diskUsage(),
            'loadAverage' => $this->loadAverage(),
            'uptime' => $this->systemInfoService->uptime(),
            'processes' => $this->processCount(),
            'php' => [
                'version' => $this->systemInfoService->phpVersion(),
                'status' => 'Running',
            ],
            'nginx' => [
                'version' => $this->commandVersion('nginx'),
                'status' => $this->systemInfoService->nginxStatus(),
            ],
            'postgresql' => [
                'version' => $this->commandVersion('psql'),
                'status' => $this->systemInfoService->postgresqlStatus(),
            ],
            'laravel' => Application::VERSION,
            'storageBreakdown' => $this->storageBreakdown(),
        ];
    }

    public function storageBreakdown(): array
    {
        $appsPath = '/opt/intema-panel/apps';
        $varWww = '/var/www';

        $appsBytes = $this->getDirectorySize($appsPath) + $this->getDirectorySize($varWww);
        $dbBytes = $this->getDirectorySize('/var/lib/postgresql');
        $logsBytes = $this->getDirectorySize('/var/log');
        $panelBytes = $this->getDirectorySize(base_path());

        return [
            'apps' => [
                'bytes' => $appsBytes,
                'formatted' => $this->formatSize($appsBytes),
            ],
            'databases' => [
                'bytes' => $dbBytes,
                'formatted' => $this->formatSize($dbBytes),
            ],
            'logs' => [
                'bytes' => $logsBytes,
                'formatted' => $this->formatSize($logsBytes),
            ],
            'panel' => [
                'bytes' => $panelBytes,
                'formatted' => $this->formatSize($panelBytes),
            ],
        ];
    }

    private function getDirectorySize(string $path): int
    {
        if (PHP_OS_FAMILY !== 'Linux' || ! is_dir($path) || ! is_readable($path)) {
            return 0;
        }

        $process = Process::fromShellCommandline("du -sb " . escapeshellarg($path) . " 2>/dev/null");
        $process->run();

        if ($process->isSuccessful()) {
            $output = trim($process->getOutput());
            $parts = preg_split('/\s+/', $output);
            return (int) ($parts[0] ?? 0);
        }

        return 0;
    }

    private function formatSize(int $bytes): string
    {
        if ($bytes <= 0) {
            return '0 B';
        }
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];
        $i = (int) floor(log($bytes, 1024));
        return round($bytes / pow(1024, $i), 2) . ' ' . $units[$i];
    }

    public function loadAverage(): string
    {
        if (PHP_OS_FAMILY !== 'Linux' || ! is_readable('/proc/loadavg')) {
            return 'N/A';
        }

        $load = file_get_contents('/proc/loadavg');

        if ($load === false) {
            return 'N/A';
        }

        $parts = explode(' ', trim($load));

        return implode(', ', array_slice($parts, 0, 3));
    }

    public function processCount(): int
    {
        if (PHP_OS_FAMILY !== 'Linux' || ! is_dir('/proc')) {
            return 0;
        }

        $count = 0;

        foreach (scandir('/proc') ?: [] as $entry) {
            if (ctype_digit($entry)) {
                $count++;
            }
        }

        return $count;
    }

    private function commandVersion(string $binary): string
    {
        if (PHP_OS_FAMILY !== 'Linux') {
            return 'N/A';
        }

        $process = new Process([$binary, '--version']);
        $process->run();

        if (! $process->isSuccessful()) {
            return 'N/A';
        }

        return trim(explode("\n", $process->getOutput())[0] ?? 'N/A');
    }
}
