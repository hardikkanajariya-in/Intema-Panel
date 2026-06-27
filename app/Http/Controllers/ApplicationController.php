<?php

namespace App\Http\Controllers;

use App\Models\Application;
use App\Provision\ProvisionerRegistry;
use App\Support\ApplicationResource;
use App\Support\DeploymentResource;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ApplicationController extends Controller
{
    public function __construct(
        private readonly ProvisionerRegistry $provisionerRegistry,
    ) {}

    public function index(): Response
    {
        $this->authorize('viewAny', Application::class);

        $applications = Application::query()
            ->with('project')
            ->latest()
            ->paginate(15);

        return Inertia::render('Applications/Index', [
            'applications' => [
                'data' => ApplicationResource::collection($applications->items()),
                'links' => $applications->linkCollection()->toArray(),
                'meta' => [
                    'current_page' => $applications->currentPage(),
                    'last_page' => $applications->lastPage(),
                    'per_page' => $applications->perPage(),
                    'total' => $applications->total(),
                ],
            ],
        ]);
    }

    public function show(Application $application): Response
    {
        $this->authorize('view', $application);

        $application->load(['project', 'databases', 'domains', 'deployments']);

        return Inertia::render('Applications/Show', [
            'application' => ApplicationResource::make($application),
            'deployments' => DeploymentResource::collection($application->deployments),
        ]);
    }

    public function destroy(Application $application): RedirectResponse
    {
        $this->authorize('delete', $application);

        $provisioner = $this->provisionerRegistry->forType($application->type);
        $provisioner->delete($application);

        return redirect()
            ->route('applications.index')
            ->with('success', 'Application deleted successfully.');
    }

    public function repair(Application $application): RedirectResponse
    {
        $this->authorize('update', $application);

        $provisioner = $this->provisionerRegistry->forType($application->type);
        $result = $provisioner->repair($application);

        if (! $result->success) {
            return back()->with('error', $result->message);
        }

        return back()->with('success', 'Application repaired successfully.');
    }

    public function health(Application $application): RedirectResponse
    {
        $this->authorize('view', $application);

        $provisioner = $this->provisionerRegistry->forType($application->type);
        $result = $provisioner->health($application);

        if (! $result->success) {
            return back()->with('error', $result->message);
        }

        return back()->with('success', 'Application health check passed.');
    }
}
