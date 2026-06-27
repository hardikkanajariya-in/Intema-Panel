<?php

namespace App\DTOs;

readonly class ShellResult
{
    public function __construct(
        public int $exitCode,
        public string $output,
        public string $errorOutput,
    ) {}

    public function successful(): bool
    {
        return $this->exitCode === 0;
    }

    public function message(): string
    {
        return trim($this->errorOutput !== '' ? $this->errorOutput : $this->output);
    }
}
