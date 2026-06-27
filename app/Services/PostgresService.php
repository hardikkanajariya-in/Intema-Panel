<?php

namespace App\Services;

use App\DTOs\PostgresCredentials;
use App\Exceptions\PostgresProvisioningException;
use Illuminate\Support\Str;

class PostgresService
{
    public function __construct(
        private readonly ShellService $shellService,
        private readonly EncryptionService $encryptionService,
    ) {}

    public function provision(string $databaseName, string $databaseUser, ?string $password = null): PostgresCredentials
    {
        $password ??= $this->encryptionService->generatePassword();

        $this->shellService->run('create_database.sh', [$databaseName]);
        $this->shellService->run('create_user.sh', [$databaseUser, $password]);
        $this->shellService->run('grant_privileges.sh', [$databaseName, $databaseUser]);

        return new PostgresCredentials($databaseName, $databaseUser, $password);
    }

    public function deprovision(?string $databaseName, ?string $databaseUser): void
    {
        if ($databaseName) {
            $this->shellService->runOptional('delete_database.sh', [$databaseName]);
        }

        if ($databaseUser) {
            $this->shellService->runOptional('delete_user.sh', [$databaseUser]);
        }
    }

    public function resetPassword(string $databaseUser, ?string $password = null): string
    {
        $password ??= $this->encryptionService->generatePassword();

        $this->shellService->run('reset_password.sh', [$databaseUser, $password]);

        return $password;
    }

    public function databaseExists(string $databaseName): bool
    {
        $result = $this->shellService->runOptional('database_exists.sh', [$databaseName]);

        return $result->successful() && str_contains($result->output, 'exists');
    }

    public function generateIdentifiers(string $companyName, string $domain): PostgresCredentials
    {
        $prefix = (string) setting('default_database_prefix', config('panel.default_database_prefix'));
        $slug = Str::slug($companyName, '_');

        if ($slug === '') {
            $slug = Str::slug(Str::before($domain, '.'), '_');
        }

        if ($slug === '') {
            throw new PostgresProvisioningException('Unable to generate database identifiers.');
        }

        $base = strtolower(preg_replace('/[^a-z0-9_]/', '', $prefix.$slug) ?? '');

        if ($base === '' || ! preg_match('/^[a-z]/', $base)) {
            $base = 'client_'.$base;
        }

        $base = substr($base, 0, 50);
        $suffix = substr(md5($domain), 0, 6);

        return new PostgresCredentials(
            databaseName: $base.'_db_'.$suffix,
            databaseUser: $base.'_user_'.$suffix,
            databasePassword: $this->encryptionService->generatePassword(),
        );
    }
}
