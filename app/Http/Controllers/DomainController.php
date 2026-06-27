<?php

namespace App\Http\Controllers;

use App\Models\Domain;
use App\Services\NginxService;
use App\Support\DomainResource;
use Illuminate\Http\RedirectResponse;
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
                'data' => DomainResource::collection($domains->items()),
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

        return Inertia::render('Domains/Show', [
            'domain' => DomainResource::make($domain),
        ]);
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
