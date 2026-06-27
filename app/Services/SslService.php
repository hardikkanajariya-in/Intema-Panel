<?php

namespace App\Services;

use App\DTOs\ShellResult;

class SslService
{
    public function __construct(
        private readonly ShellService $shellService,
    ) {}

    /**
     * @return list<array<string, string>>
     */
    public function certificates(): array
    {
        $result = $this->shellService->runOptional('ssl_list_certs.sh', []);

        if (! $result->successful() || $result->output === '') {
            return [];
        }

        $certificates = [];

        foreach (explode("\n", $result->output) as $line) {
            if ($line === '') {
                continue;
            }

            [$domain, $expiry] = array_pad(explode('|', $line), 2, '');

            $certificates[] = [
                'domain' => $domain,
                'expiry' => $expiry,
            ];
        }

        return $certificates;
    }

    public function obtain(string $domain, string $email): ShellResult
    {
        return $this->shellService->run('ssl_obtain.sh', [$domain, $email]);
    }

    public function renew(?string $domain = null): ShellResult
    {
        return $this->shellService->run('ssl_renew.sh', [$domain ?? 'all']);
    }

    public function delete(string $domain): ShellResult
    {
        return $this->shellService->run('ssl_delete.sh', [$domain]);
    }
}
