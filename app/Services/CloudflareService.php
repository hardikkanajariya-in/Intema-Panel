<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class CloudflareService
{
    public function __construct(
        private readonly SettingService $settingService,
    ) {}

    public function getZoneId(string $hostname): ?string
    {
        $token = $this->settingService->get('cloudflare_token');
        if (! $token) {
            return null;
        }

        $parts = explode('.', $hostname);
        while (count($parts) >= 2) {
            $domain = implode('.', $parts);
            $response = Http::withToken($token)
                ->get("https://api.cloudflare.com/client/v4/zones", [
                    'name' => $domain,
                ]);

            if ($response->successful()) {
                $result = $response->json();
                if (! empty($result['result'])) {
                    return $result['result'][0]['id'];
                }
            }
            array_shift($parts);
        }

        return null;
    }

    public function getDnsRecords(string $zoneId): array
    {
        $token = $this->settingService->get('cloudflare_token');
        if (! $token) {
            return [];
        }

        $response = Http::withToken($token)
            ->get("https://api.cloudflare.com/client/v4/zones/{$zoneId}/dns_records", [
                'per_page' => 100,
            ]);

        if ($response->successful()) {
            return $response->json()['result'] ?? [];
        }

        throw new \RuntimeException("Failed to fetch DNS records from Cloudflare: " . $response->body());
    }

    public function createDnsRecord(string $zoneId, array $data): array
    {
        $token = $this->settingService->get('cloudflare_token');
        if (! $token) {
            throw new \RuntimeException("Cloudflare API token not configured.");
        }

        $response = Http::withToken($token)
            ->post("https://api.cloudflare.com/client/v4/zones/{$zoneId}/dns_records", [
                'type' => $data['type'],
                'name' => $data['name'],
                'content' => $data['content'],
                'ttl' => (int) ($data['ttl'] ?? 1),
                'proxied' => (bool) ($data['proxied'] ?? false),
            ]);

        if ($response->successful()) {
            return $response->json()['result'] ?? [];
        }

        throw new \RuntimeException("Failed to create DNS record on Cloudflare: " . json_encode($response->json()['errors'] ?? $response->body()));
    }

    public function deleteDnsRecord(string $zoneId, string $recordId): bool
    {
        $token = $this->settingService->get('cloudflare_token');
        if (! $token) {
            throw new \RuntimeException("Cloudflare API token not configured.");
        }

        $response = Http::withToken($token)
            ->delete("https://api.cloudflare.com/client/v4/zones/{$zoneId}/dns_records/{$recordId}");

        if ($response->successful()) {
            return true;
        }

        throw new \RuntimeException("Failed to delete DNS record on Cloudflare: " . json_encode($response->json()['errors'] ?? $response->body()));
    }

    public function getZones(): array
    {
        $token = $this->settingService->get('cloudflare_token');
        if (! $token) {
            return [];
        }

        $response = Http::withToken($token)
            ->get("https://api.cloudflare.com/client/v4/zones", [
                'per_page' => 50,
            ]);

        if ($response->successful()) {
            return $response->json()['result'] ?? [];
        }

        throw new \RuntimeException("Failed to fetch zones from Cloudflare: " . $response->body());
    }

    public function updateDnsRecord(string $zoneId, string $recordId, array $data): array
    {
        $token = $this->settingService->get('cloudflare_token');
        if (! $token) {
            throw new \RuntimeException("Cloudflare API token not configured.");
        }

        $response = Http::withToken($token)
            ->put("https://api.cloudflare.com/client/v4/zones/{$zoneId}/dns_records/{$recordId}", [
                'type' => $data['type'],
                'name' => $data['name'],
                'content' => $data['content'],
                'ttl' => (int) ($data['ttl'] ?? 1),
                'proxied' => (bool) ($data['proxied'] ?? false),
            ]);

        if ($response->successful()) {
            return $response->json()['result'] ?? [];
        }

        throw new \RuntimeException("Failed to update DNS record on Cloudflare: " . json_encode($response->json()['errors'] ?? $response->body()));
    }
}
