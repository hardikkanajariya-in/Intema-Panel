<?php

namespace App\Provision\Tasks;

use App\Provision\Contracts\TaskInterface;
use App\Provision\Engine\ProvisionContext;
use App\Provision\Engine\TaskResult;
use Illuminate\Support\Facades\File;

class CreateEnvTask implements TaskInterface
{
    public function name(): string
    {
        return 'create_env';
    }

    public function execute(ProvisionContext $context): TaskResult
    {
        $path = (string) $context->get('deploy_path');

        if ($path === '' || ! is_dir($path)) {
            return TaskResult::success('Skipped .env creation (no deploy path).');
        }

        $envPath = $path.'/.env';
        $variables = $context->get('environment_variables', []);

        if (! is_array($variables) || $variables === []) {
            if (is_file($envPath)) {
                return TaskResult::success('.env already exists.');
            }

            if (is_file($path.'/.env.example')) {
                File::copy($path.'/.env.example', $envPath);

                return TaskResult::success('Created .env from .env.example.');
            }

            return TaskResult::success('Skipped .env creation (no variables).');
        }

        $lines = [];

        foreach ($variables as $key => $value) {
            if (! is_string($key) || ! is_scalar($value)) {
                continue;
            }

            $escaped = str_replace('"', '\\"', (string) $value);
            $lines[] = "{$key}=\"{$escaped}\"";
        }

        File::put($envPath, implode(PHP_EOL, $lines).PHP_EOL);

        return TaskResult::success('Created .env file.');
    }
}
