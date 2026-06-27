<?php

namespace App\Policies;

use App\Models\SslCertificate;
use App\Models\User;

class SslCertificatePolicy extends ResourcePolicy
{
    public function viewAny(User $user): bool
    {
        return $this->authorized($user);
    }

    public function view(User $user, SslCertificate $sslCertificate): bool
    {
        return $this->authorized($user);
    }

    public function create(User $user): bool
    {
        return $this->authorized($user);
    }

    public function update(User $user, SslCertificate $sslCertificate): bool
    {
        return $this->authorized($user);
    }

    public function delete(User $user, SslCertificate $sslCertificate): bool
    {
        return $this->authorized($user);
    }
}
