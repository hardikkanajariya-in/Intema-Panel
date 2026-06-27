<?php

namespace App\Provision\Engine;

readonly class ProvisionResult
{
    /**
     * @param  list<array{name: string, success: bool, message: string}>  $taskResults
     */
    public function __construct(
        public bool $success,
        public string $message = '',
        public array $taskResults = [],
    ) {}

    public static function success(string $message = '', array $taskResults = []): self
    {
        return new self(true, $message, $taskResults);
    }

    public static function failure(string $message, array $taskResults = []): self
    {
        return new self(false, $message, $taskResults);
    }
}
