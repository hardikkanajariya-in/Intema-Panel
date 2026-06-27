<?php

namespace App\Provision;

use App\Enums\ApplicationType;
use App\Provision\Contracts\ApplicationProvisionerInterface;
use InvalidArgumentException;

class ProvisionerRegistry
{
    /**
     * @param  iterable<ApplicationProvisionerInterface>  $provisioners
     */
    public function __construct(
        private readonly iterable $provisioners,
    ) {}

    public function forType(ApplicationType|string $type): ApplicationProvisionerInterface
    {
        $value = $type instanceof ApplicationType ? $type->value : $type;

        foreach ($this->provisioners as $provisioner) {
            if ($provisioner->type() === $value) {
                return $provisioner;
            }
        }

        throw new InvalidArgumentException("No provisioner registered for type: {$value}");
    }

    /**
     * @return list<array{value: string, label: string}>
     */
    public function types(): array
    {
        return array_map(
            fn (ApplicationType $type) => [
                'value' => $type->value,
                'label' => $type->label(),
            ],
            ApplicationType::cases(),
        );
    }
}
