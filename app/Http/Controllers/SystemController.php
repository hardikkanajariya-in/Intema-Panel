<?php

namespace App\Http\Controllers;

use App\Services\MonitoringService;
use App\Services\SystemManagerService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SystemController extends Controller
{
    public function __construct(
        private readonly MonitoringService $monitoringService,
        private readonly SystemManagerService $systemManagerService,
    ) {}

    public function index(): Response
    {
        return Inertia::render('System/Index', [
            'monitoring' => $this->monitoringService->snapshot(),
            'components' => $this->systemManagerService->components(),
        ]);
    }

    public function action(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'component' => ['required', 'string'],
            'action' => ['required', 'in:start,stop,restart,reload'],
        ]);

        $this->systemManagerService->performAction(
            $validated['component'],
            $validated['action'],
        );

        return back()->with('success', 'Service action completed successfully.');
    }
}
