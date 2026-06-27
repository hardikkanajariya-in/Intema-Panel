<?php

namespace App\Services;

use App\DTOs\ShellResult;
use App\Exceptions\ShellExecutionException;
use InvalidArgumentException;
use Symfony\Component\Process\Process;

class ShellService
{
    /**
     * @param  list<string>  $arguments
     */
    public function run(string $script, array $arguments = []): ShellResult
    {
        if (! config('panel.shell.enabled')) {
            throw new ShellExecutionException('Shell execution is disabled.');
        }

        if (! preg_match('/^[a-z_]+\.sh$/', $script)) {
            throw new InvalidArgumentException('Invalid script name.');
        }

        $scriptPath = rtrim((string) config('panel.scripts_path'), DIRECTORY_SEPARATOR)
            .DIRECTORY_SEPARATOR
            .$script;

        if (! is_file($scriptPath)) {
            throw new ShellExecutionException("Script not found: {$script}");
        }

        foreach ($arguments as $argument) {
            if (! is_string($argument) || str_contains($argument, "\0")) {
                throw new InvalidArgumentException('Invalid script argument.');
            }
        }

        $process = new Process(
            array_merge([$scriptPath, ...$arguments]),
            null,
            $this->postgresEnvironment(),
            null,
            (int) config('panel.shell.timeout'),
        );

        $process->run();

        $result = new ShellResult(
            exitCode: (int) $process->getExitCode(),
            output: trim($process->getOutput()),
            errorOutput: trim($process->getErrorOutput()),
        );

        if (! $result->successful()) {
            throw new ShellExecutionException(
                $result->message() ?: "Script {$script} failed.",
                $result->exitCode,
                $script,
            );
        }

        return $result;
    }

    public function runOptional(string $script, array $arguments = []): ShellResult
    {
        try {
            return $this->run($script, $arguments);
        } catch (ShellExecutionException $exception) {
            return new ShellResult(
                exitCode: $exception->exitCode,
                output: '',
                errorOutput: $exception->getMessage(),
            );
        }
    }

    /**
     * @param  list<string>  $arguments
     */
    public function runSystem(
        string $command,
        array $arguments = [],
        ?string $cwd = null,
        bool $optional = false,
    ): ShellResult {
        if (! config('panel.shell.enabled')) {
            throw new ShellExecutionException('Shell execution is disabled.');
        }

        if (! preg_match('/^[a-zA-Z0-9._-]+$/', $command)) {
            throw new InvalidArgumentException('Invalid system command.');
        }

        foreach ($arguments as $argument) {
            if (! is_string($argument) || str_contains($argument, "\0")) {
                throw new InvalidArgumentException('Invalid command argument.');
            }
        }

        $process = new Process(
            array_merge([$command, ...$arguments]),
            $cwd,
            $this->postgresEnvironment(),
            null,
            (int) config('panel.shell.timeout'),
        );

        $process->run();

        $result = new ShellResult(
            exitCode: (int) $process->getExitCode(),
            output: trim($process->getOutput()),
            errorOutput: trim($process->getErrorOutput()),
        );

        if (! $result->successful() && ! $optional) {
            throw new ShellExecutionException(
                $result->message() ?: "Command {$command} failed.",
                $result->exitCode,
            );
        }

        return $result;
    }

    /**
     * @return array<string, string>
     */
    private function postgresEnvironment(): array
    {
        $environment = [
            'PGHOST' => (string) config('panel.postgres.host'),
            'PGPORT' => (string) config('panel.postgres.port'),
            'PGUSER' => (string) config('panel.postgres.admin_user'),
        ];

        $password = config('panel.postgres.admin_password');

        if (is_string($password) && $password !== '') {
            $environment['PGPASSWORD'] = $password;
        }

        return $environment;
    }
}
