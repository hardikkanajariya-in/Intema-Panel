<?php

namespace App\Http\Controllers;

use App\Models\SslCertificate;
use App\Services\SslService;
use App\Support\SslCertificateResource;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class SslCertificateController extends Controller
{
    public function __construct(
        private readonly SslService $sslService,
    ) {}

    public function index(): Response
    {
        $this->authorize('viewAny', SslCertificate::class);

        $certificates = SslCertificate::query()
            ->with('project')
            ->latest()
            ->paginate(15);

        return Inertia::render('SSL/Index', [
            'certificates' => [
                'data' => SslCertificateResource::collection($certificates->items())->resolve(),
                'links' => $certificates->linkCollection()->toArray(),
                'meta' => [
                    'current_page' => $certificates->currentPage(),
                    'last_page' => $certificates->lastPage(),
                    'per_page' => $certificates->perPage(),
                    'total' => $certificates->total(),
                ],
            ],
            'systemCertificates' => $this->sslService->certificates(),
        ]);
    }

    public function show(SslCertificate $sslCertificate): Response
    {
        $this->authorize('view', $sslCertificate);

        $sslCertificate->load(['project', 'domain']);

        return Inertia::render('SSL/Show', [
            'certificate' => SslCertificateResource::make($sslCertificate),
        ]);
    }

    public function renew(SslCertificate $sslCertificate): RedirectResponse
    {
        $this->authorize('update', $sslCertificate);

        $this->sslService->renew($sslCertificate->domain_name);

        return back()->with('success', 'SSL certificate renewed successfully.');
    }

    public function destroy(SslCertificate $sslCertificate): RedirectResponse
    {
        $this->authorize('delete', $sslCertificate);

        $this->sslService->delete($sslCertificate->domain_name);
        $sslCertificate->delete();

        return redirect()
            ->route('ssl-certificates.index')
            ->with('success', 'SSL certificate deleted successfully.');
    }
}
