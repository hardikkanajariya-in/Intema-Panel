<?php

namespace App\Http\Controllers;

use App\Services\SslService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SslController extends Controller
{
    public function __construct(
        private readonly SslService $sslService,
    ) {}

    public function index(): Response
    {
        return Inertia::render('SSL/Index', [
            'certificates' => $this->sslService->certificates(),
            'defaultEmail' => (string) config('panel.ssl.email', config('panel.support_email')),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'domain' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email'],
        ]);

        $this->sslService->obtain($validated['domain'], $validated['email']);

        return back()->with('success', "SSL certificate obtained for {$validated['domain']}.");
    }

    public function renew(Request $request): RedirectResponse
    {
        $domain = $request->string('domain')->toString() ?: null;
        $this->sslService->renew($domain);

        return back()->with('success', 'SSL certificate renewal completed.');
    }

    public function destroy(string $domain): RedirectResponse
    {
        $this->sslService->delete($domain);

        return back()->with('success', "SSL certificate deleted for {$domain}.");
    }
}
