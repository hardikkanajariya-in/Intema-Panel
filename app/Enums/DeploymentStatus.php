<?php

namespace App\Enums;

enum DeploymentStatus: string
{
    case Pending = 'pending';
    case Building = 'building';
    case Deploying = 'deploying';
    case Active = 'active';
    case Failed = 'failed';
    case RolledBack = 'rolled_back';

    public function label(): string
    {
        return match ($this) {
            self::Pending => 'Pending',
            self::Building => 'Building',
            self::Deploying => 'Deploying',
            self::Active => 'Active',
            self::Failed => 'Failed',
            self::RolledBack => 'Rolled Back',
        };
    }
}
