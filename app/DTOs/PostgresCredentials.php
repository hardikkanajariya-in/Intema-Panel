<?php

namespace App\DTOs;

readonly class PostgresCredentials
{
    public function __construct(
        public string $databaseName,
        public string $databaseUser,
        public string $databasePassword,
    ) {}
}
