<?php

namespace App\Exceptions;

use RuntimeException;

class ShellExecutionException extends RuntimeException
{
    public function __construct(
        string $message,
        public readonly int $exitCode = 1,
        public readonly string $script = '',
    ) {
        parent::__construct($message);
    }
}
