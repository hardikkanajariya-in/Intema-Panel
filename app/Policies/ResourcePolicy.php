<?php

namespace App\Policies;

use App\Models\User;

abstract class ResourcePolicy
{
    protected function authorized(?User $user): bool
    {
        return $user !== null;
    }
}
