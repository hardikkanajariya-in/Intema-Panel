<?php

namespace App\Enums;

enum ResourceStatus: string
{
    case Pending = 'pending';
    case Provisioning = 'provisioning';
    case Active = 'active';
    case Inactive = 'inactive';
    case Failed = 'failed';
    case Suspended = 'suspended';

    public function label(): string
    {
        return match ($this) {
            self::Pending => 'Pending',
            self::Provisioning => 'Provisioning',
            self::Active => 'Active',
            self::Inactive => 'Inactive',
            self::Failed => 'Failed',
            self::Suspended => 'Suspended',
        };
    }

    /**
     * @return list<string>
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
