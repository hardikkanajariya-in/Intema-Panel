<?php

namespace App\Http\Controllers;

use App\Models\Domain;
use App\Models\SslCertificate;
use App\Services\NginxService;
use App\Support\DomainResource;
use App\Support\SslCertificateResource;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DomainController extends Controller
{
    public function __construct(
        private readonly NginxService $nginxService,
    ) {}

    public function index(): Response
    {
        $this->authorize('viewAny', Domain::class);

        $domains = Domain::query()
            ->with(['project', 'application'])
            ->latest()
            ->paginate(15);

        return Inertia::render('Domains/Index', [
            'domains' => [
                'data' => DomainResource::collection($domains->items())->resolve(),
                'links' => $domains->linkCollection()->toArray(),
                'meta' => [
                    'current_page' => $domains->currentPage(),
                    'last_page' => $domains->lastPage(),
                    'per_page' => $domains->perPage(),
                    'total' => $domains->total(),
                ],
            ],
        ]);
    }

    public function show(Domain $domain): Response
    {
        $this->authorize('view', $domain);

        $domain->load(['project', 'application', 'sslCertificate']);

        $availableCertificates = SslCertificate::query()
            ->whereNull('domain_id')
            ->orWhere('domain_id', $domain->id)
            ->orderBy('domain_name')
            ->get();

        $cloudflareConfigured = ! empty(app(\App\Services\SettingService::class)->get('cloudflare_token'));

        return Inertia::render('Domains/Show', [
            'domain' => DomainResource::make($domain)->resolve(),
            'sslCertificate' => $domain->sslCertificate
                ? SslCertificateResource::make($domain->sslCertificate)->resolve()
                : null,
            'availableCertificates' => SslCertificateResource::collection($availableCertificates)->resolve(),
            'cloudflareConfigured' => $cloudflareConfigured,
        ]);
    }

    public function attachSsl(Request $request, Domain $domain): RedirectResponse
    {
        $this->authorize('update', $domain);

        $validated = $request->validate([
            'ssl_certificate_uuid' => ['required', 'exists:ssl_certificates,uuid'],
        ]);

        $certificate = SslCertificate::query()
            ->where('uuid', $validated['ssl_certificate_uuid'])
            ->firstOrFail();

        $certificate->update(['domain_id' => $domain->id]);
        $domain->update(['ssl_certificate_id' => $certificate->id]);

        return back()->with('success', 'SSL certificate attached to domain.');
    }

    public function detachSsl(Domain $domain): RedirectResponse
    {
        $this->authorize('update', $domain);

        if ($domain->ssl_certificate_id) {
            SslCertificate::query()
                ->where('id', $domain->ssl_certificate_id)
                ->update(['domain_id' => null]);
            $domain->update(['ssl_certificate_id' => null]);
        }

        return back()->with('success', 'SSL certificate detached from domain.');
    }

    public function destroy(Domain $domain): RedirectResponse
    {
        $this->authorize('delete', $domain);

        if ($domain->nginx_site) {
            $this->nginxService->deleteSite($domain->nginx_site);
        }

        $domain->delete();

        return redirect()
            ->route('domains.index')
            ->with('success', 'Domain deleted successfully.');
    }
}
