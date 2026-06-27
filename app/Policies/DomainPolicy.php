<?php

namespace App\Policies;

use App\Models\Domain;
use App\Models\User;

class DomainPolicy extends ResourcePolicy
{
    public function viewAny(User $user): bool
    {
        return $this->authorized($user);
    }

    public function view(User $user, Domain $domain): bool
    {
        return $this->authorized($user);
    }

    public function create(User $user): bool
    {
        return $this->authorized($user);
    }

    public function update(User $user, Domain $domain): bool
    {
        return $this->authorized($user);
    }

    public function delete(User $user, Domain $domain): bool
    {
        return $this->authorized($user);
    }
}
