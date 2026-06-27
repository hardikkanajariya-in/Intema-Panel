<?php

namespace App\Http\Controllers;

use App\Services\NginxService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class NginxController extends Controller
{
    public function __construct(
        private readonly NginxService $nginxService,
    ) {}

    public function index(): Response
    {
        return Inertia::render('Nginx/Index', [
            'sites' => $this->nginxService->sites(),
            'errorLog' => $this->nginxService->readErrorLog(50),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'domain' => ['required', 'string', 'max:255'],
            'root' => ['required', 'string', 'max:255'],
        ]);

        $this->nginxService->createVirtualHost(
            str_replace('.', '_', $validated['domain']),
            $validated['domain'],
            $validated['root'],
        );
        $this->nginxService->enableSite(str_replace('.', '_', $validated['domain']));
        $this->nginxService->testConfiguration();
        $this->nginxService->reload();

        return back()->with('success', 'Virtual host created and enabled.');
    }

    public function enable(string $site): RedirectResponse
    {
        $this->nginxService->enableSite($site);
        $this->nginxService->reload();

        return back()->with('success', "Site enabled: {$site}");
    }

    public function disable(string $site): RedirectResponse
    {
        $this->nginxService->disableSite($site);
        $this->nginxService->reload();

        return back()->with('success', "Site disabled: {$site}");
    }

    public function destroy(string $site): RedirectResponse
    {
        $this->nginxService->deleteSite($site);
        $this->nginxService->reload();

        return back()->with('success', "Site deleted: {$site}");
    }

    public function test(): RedirectResponse
    {
        $this->nginxService->testConfiguration();

        return back()->with('success', 'Nginx configuration is valid.');
    }

    public function reload(): RedirectResponse
    {
        $this->nginxService->reload();

        return back()->with('success', 'Nginx reloaded.');
    }

    public function restart(): RedirectResponse
    {
        $this->nginxService->restart();

        return back()->with('success', 'Nginx restarted.');
    }
}
