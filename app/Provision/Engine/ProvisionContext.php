<?php

namespace App\Provision\Engine;

use Illuminate\Database\Eloquent\Model;

class ProvisionContext
{
    /**
     * @param  array<string, mixed>  $data
     */
    public function __construct(
        public readonly Model $resource,
        public array $data = [],
    ) {}

    public function get(string $key, mixed $default = null): mixed
    {
        return $this->data[$key] ?? $default;
    }

    public function set(string $key, mixed $value): void
    {
        $this->data[$key] = $value;
    }
}
