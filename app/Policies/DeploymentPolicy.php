<?php

namespace App\Policies;

use App\Models\Deployment;
use App\Models\User;

class DeploymentPolicy extends ResourcePolicy
{
    public function viewAny(User $user): bool
    {
        return $this->authorized($user);
    }

    public function view(User $user, Deployment $deployment): bool
    {
        return $this->authorized($user);
    }

    public function create(User $user): bool
    {
        return $this->authorized($user);
    }
}
