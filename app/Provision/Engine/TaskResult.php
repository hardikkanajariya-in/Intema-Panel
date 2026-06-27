<?php

namespace App\Provision\Engine;

readonly class TaskResult
{
    public function __construct(
        public bool $success,
        public string $message = '',
        public array $output = [],
    ) {}

    public static function success(string $message = '', array $output = []): self
    {
        return new self(true, $message, $output);
    }

    public static function failure(string $message, array $output = []): self
    {
        return new self(false, $message, $output);
    }
}
