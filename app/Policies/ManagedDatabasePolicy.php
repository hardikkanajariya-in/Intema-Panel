<?php

namespace App\Policies;

use App\Models\ManagedDatabase;
use App\Models\User;

class ManagedDatabasePolicy extends ResourcePolicy
{
    public function viewAny(User $user): bool
    {
        return $this->authorized($user);
    }

    public function view(User $user, ManagedDatabase $managedDatabase): bool
    {
        return $this->authorized($user);
    }

    public function create(User $user): bool
    {
        return $this->authorized($user);
    }

    public function update(User $user, ManagedDatabase $managedDatabase): bool
    {
        return $this->authorized($user);
    }

    public function delete(User $user, ManagedDatabase $managedDatabase): bool
    {
        return $this->authorized($user);
    }
}
