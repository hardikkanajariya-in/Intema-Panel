<?php

namespace App\Policies;

use App\Models\Application;
use App\Models\User;

class ApplicationPolicy extends ResourcePolicy
{
    public function viewAny(User $user): bool
    {
        return $this->authorized($user);
    }

    public function view(User $user, Application $application): bool
    {
        return $this->authorized($user);
    }

    public function create(User $user): bool
    {
        return $this->authorized($user);
    }

    public function update(User $user, Application $application): bool
    {
        return $this->authorized($user);
    }

    public function delete(User $user, Application $application): bool
    {
        return $this->authorized($user);
    }
}
