<?php

namespace App\Services;

use App\DTOs\ShellResult;
use App\Exceptions\ShellExecutionException;
use InvalidArgumentException;
use Symfony\Component\Process\Process;

class SystemCommandService
{
    /**
     * @var list<string>
     */
    private const ALLOWED_SERVICES = [
        'nginx',
        'postgresql',
        'php8.3-fpm',
        'supervisor',
        'fail2ban',
        'ufw',
    ];

    /**
     * @var list<string>
     */
    private const ALLOWED_ACTIONS = [
        'start',
        'stop',
        'restart',
        'reload',
        'status',
        'is-active',
    ];

    public function runVersion(string $binary): ?string
    {
        if (! preg_match('/^[a-z0-9.-]+$/', $binary)) {
            return null;
        }

        $process = new Process(['bash', '-lc', sprintf('command -v %s >/dev/null 2>&1 && %s --version 2>&1 | head -1', escapeshellarg($binary), escapeshellarg($binary))]);
        $process->setTimeout(10);
        $process->run();

        if (! $process->isSuccessful()) {
            return null;
        }

        return trim($process->getOutput()) ?: null;
    }

    public function isInstalled(string $binary): bool
    {
        if (! preg_match('/^[a-z0-9.-]+$/', $binary)) {
            return false;
        }

        $process = new Process(['bash', '-lc', sprintf('command -v %s', escapeshellarg($binary))]);
        $process->run();

        return $process->isSuccessful();
    }

    public function serviceAction(string $service, string $action): ShellResult
    {
        if (! in_array($service, self::ALLOWED_SERVICES, true)) {
            throw new InvalidArgumentException('Service not allowed.');
        }

        if (! in_array($action, self::ALLOWED_ACTIONS, true)) {
            throw new InvalidArgumentException('Action not allowed.');
        }

        $process = new Process(['systemctl', $action, $service]);
        $process->setTimeout((int) config('panel.shell.timeout'));
        $process->run();

        $result = new ShellResult(
            exitCode: (int) $process->getExitCode(),
            output: trim($process->getOutput()),
            errorOutput: trim($process->getErrorOutput()),
        );

        if (! $result->successful() && $action !== 'status' && $action !== 'is-active') {
            throw new ShellExecutionException($result->message() ?: 'Service action failed.', $result->exitCode);
        }

        return $result;
    }

    public function serviceStatus(string $service): string
    {
        if (PHP_OS_FAMILY !== 'Linux') {
            return 'Unavailable';
        }

        try {
            $result = $this->serviceAction($service, 'is-active');
        } catch (InvalidArgumentException) {
            return 'Unknown';
        }

        if (! $result->successful()) {
            return 'Stopped';
        }

        return trim($result->output) === 'active' ? 'Running' : ucfirst(trim($result->output));
    }
}
