<?php

namespace App\Services;

use Illuminate\Foundation\Application;
use Symfony\Component\Process\Process;

class SystemInfoService
{
    public function cpuUsage(): string
    {
        if (PHP_OS_FAMILY !== 'Linux' || ! is_readable('/proc/stat')) {
            return 'N/A';
        }

        $stat1 = $this->readCpuStat();
        usleep(200000);
        $stat2 = $this->readCpuStat();

        $idleDelta = $stat2['idle'] - $stat1['idle'];
        $totalDelta = $stat2['total'] - $stat1['total'];

        if ($totalDelta <= 0) {
            return 'N/A';
        }

        $usage = (1 - ($idleDelta / $totalDelta)) * 100;

        return number_format($usage, 1).'%';
    }

    public function ramUsage(): string
    {
        if (PHP_OS_FAMILY !== 'Linux' || ! is_readable('/proc/meminfo')) {
            return 'N/A';
        }

        $meminfo = file_get_contents('/proc/meminfo');

        if ($meminfo === false) {
            return 'N/A';
        }

        preg_match('/MemTotal:\s+(\d+)/', $meminfo, $totalMatch);
        preg_match('/MemAvailable:\s+(\d+)/', $meminfo, $availableMatch);

        if (! isset($totalMatch[1], $availableMatch[1])) {
            return 'N/A';
        }

        $total = (int) $totalMatch[1];
        $available = (int) $availableMatch[1];
        $used = $total - $available;
        $percent = $total > 0 ? ($used / $total) * 100 : 0;

        return number_format($percent, 1).'%';
    }

    public function diskUsage(): string
    {
        if (PHP_OS_FAMILY !== 'Linux') {
            return 'N/A';
        }

        $process = new Process(['df', '-h', '/']);
        $process->run();

        if (! $process->isSuccessful()) {
            return 'N/A';
        }

        $lines = explode("\n", trim($process->getOutput()));

        if (count($lines) < 2) {
            return 'N/A';
        }

        $parts = preg_split('/\s+/', $lines[1]) ?: [];

        return $parts[4] ?? 'N/A';
    }

    public function uptime(): string
    {
        if (PHP_OS_FAMILY !== 'Linux' || ! is_readable('/proc/uptime')) {
            return 'N/A';
        }

        $uptime = file_get_contents('/proc/uptime');

        if ($uptime === false) {
            return 'N/A';
        }

        $seconds = (int) floor((float) explode(' ', $uptime)[0]);
        $days = intdiv($seconds, 86400);
        $hours = intdiv($seconds % 86400, 3600);
        $minutes = intdiv($seconds % 3600, 60);

        if ($days > 0) {
            return "{$days}d {$hours}h {$minutes}m";
        }

        if ($hours > 0) {
            return "{$hours}h {$minutes}m";
        }

        return "{$minutes}m";
    }

    public function nginxStatus(): string
    {
        return $this->serviceStatus('nginx');
    }

    public function postgresqlStatus(): string
    {
        if (PHP_OS_FAMILY !== 'Linux') {
            return 'N/A';
        }

        $process = new Process([
            'pg_isready',
            '-h',
            (string) config('panel.postgres.host'),
            '-p',
            (string) config('panel.postgres.port'),
        ]);
        $process->run();

        return $process->isSuccessful() ? 'Running' : 'Stopped';
    }

    public function phpVersion(): string
    {
        return PHP_VERSION;
    }

    public function laravelVersion(): string
    {
        return Application::VERSION;
    }

    private function serviceStatus(string $service): string
    {
        if (PHP_OS_FAMILY !== 'Linux') {
            return 'N/A';
        }

        $process = new Process(['systemctl', 'is-active', $service]);
        $process->run();

        if (! $process->isSuccessful()) {
            return 'Stopped';
        }

        $status = trim($process->getOutput());

        return $status === 'active' ? 'Running' : ucfirst($status);
    }

    /**
     * @return array{idle: int, total: int}
     */
    private function readCpuStat(): array
    {
        $line = file('/proc/stat')[0] ?? '';
        $parts = preg_split('/\s+/', trim($line)) ?: [];
        array_shift($parts);

        $values = array_map(intval(...), $parts);
        $idle = ($values[3] ?? 0) + ($values[4] ?? 0);
        $total = array_sum($values);

        return ['idle' => $idle, 'total' => $total];
    }
}
