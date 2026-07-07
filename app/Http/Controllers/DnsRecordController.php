<?php

namespace App\Http\Controllers;

use App\Models\Domain;
use App\Services\CloudflareService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DnsRecordController extends Controller
{
    public function __construct(
        private readonly CloudflareService $cloudflareService,
    ) {}

    public function index(Domain $domain): JsonResponse
    {
        $this->authorize('view', $domain);

        try {
            $zoneId = $this->cloudflareService->getZoneId($domain->hostname);

            if (! $zoneId) {
                return response()->json([
                    'success' => false,
                    'message' => 'This domain is not configured or active on Cloudflare, or the API token is invalid.',
                ], 404);
            }

            $records = $this->cloudflareService->getDnsRecords($zoneId);

            return response()->json([
                'success' => true,
                'zone_id' => $zoneId,
                'records' => $records,
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function store(Domain $domain, Request $request): JsonResponse
    {
        $this->authorize('update', $domain);

        $validated = $request->validate([
            'type' => ['required', 'string', 'in:A,AAAA,CNAME,TXT,MX,SRV,NS,CAA'],
            'name' => ['required', 'string'],
            'content' => ['required', 'string'],
            'ttl' => ['nullable', 'integer', 'min:1'],
            'proxied' => ['nullable', 'boolean'],
        ]);

        try {
            $zoneId = $this->cloudflareService->getZoneId($domain->hostname);

            if (! $zoneId) {
                return response()->json([
                    'success' => false,
                    'message' => 'Zone not found on Cloudflare.',
                ], 404);
            }

            $record = $this->cloudflareService->createDnsRecord($zoneId, $validated);

            return response()->json([
                'success' => true,
                'record' => $record,
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function destroy(Domain $domain, string $recordId): JsonResponse
    {
        $this->authorize('update', $domain);

        try {
            $zoneId = $this->cloudflareService->getZoneId($domain->hostname);

            if (! $zoneId) {
                return response()->json([
                    'success' => false,
                    'message' => 'Zone not found on Cloudflare.',
                ], 404);
            }

            $this->cloudflareService->deleteDnsRecord($zoneId, $recordId);

            return response()->json([
                'success' => true,
                'message' => 'DNS record deleted successfully.',
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function update(Domain $domain, string $recordId, Request $request): JsonResponse
    {
        $this->authorize('update', $domain);

        $validated = $request->validate([
            'type' => ['required', 'string', 'in:A,AAAA,CNAME,TXT,MX,SRV,NS,CAA'],
            'name' => ['required', 'string'],
            'content' => ['required', 'string'],
            'ttl' => ['nullable', 'integer', 'min:1'],
            'proxied' => ['nullable', 'boolean'],
        ]);

        try {
            $zoneId = $this->cloudflareService->getZoneId($domain->hostname);

            if (! $zoneId) {
                return response()->json([
                    'success' => false,
                    'message' => 'Zone not found on Cloudflare.',
                ], 404);
            }

            $record = $this->cloudflareService->updateDnsRecord($zoneId, $recordId, $validated);

            return response()->json([
                'success' => true,
                'record' => $record,
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
