<?php

namespace App\Http\Controllers;

use App\Actions\CreateApplicationAction;
use App\Actions\DeployApplicationAction;
use App\Enums\ApplicationType;
use App\Models\Application;
use App\Models\Domain;
use App\Models\ManagedDatabase;
use App\Models\Project;
use App\Provision\ProvisionerRegistry;
use App\Services\ApplicationRuntimeService;
use App\Support\ApplicationResource;
use App\Support\DeploymentResource;
use App\Support\DomainResource;
use App\Support\ManagedDatabaseResource;
use App\Support\ProjectResource;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ApplicationController extends Controller
{
    public function __construct(
        private readonly ProvisionerRegistry $provisionerRegistry,
        private readonly ApplicationRuntimeService $runtimeService,
        private readonly DeployApplicationAction $deployApplicationAction,
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
                'data' => ApplicationResource::collection($applications->items())->resolve(),
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

        $availableDatabases = ManagedDatabase::query()
            ->whereNull('application_id')
            ->orWhere('application_id', $application->id)
            ->orderBy('name')
            ->get();

        $availableDomains = Domain::query()
            ->whereNull('application_id')
            ->orWhere('application_id', $application->id)
            ->orderBy('hostname')
            ->get();

        return Inertia::render('Applications/Show', [
            'application' => ApplicationResource::make($application)->resolve(),
            'deployments' => DeploymentResource::collection($application->deployments)->resolve(),
            'runtimeOperations' => $this->runtimeService->availableOperations($application),
            'databases' => ManagedDatabaseResource::collection($application->databases)->resolve(),
            'domains' => DomainResource::collection($application->domains)->resolve(),
            'availableDatabases' => ManagedDatabaseResource::collection($availableDatabases)->resolve(),
            'availableDomains' => DomainResource::collection($availableDomains)->resolve(),
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

    public function deploy(Application $application): RedirectResponse
    {
        $this->authorize('update', $application);

        if (! $application->repository_url || ! $application->deploy_path) {
            return back()->with('error', 'Repository URL and deploy path are required to deploy.');
        }

        try {
            $this->deployApplicationAction->execute($application);
        } catch (\Throwable $exception) {
            return back()->with('error', $exception->getMessage());
        }

        return back()->with('success', 'Application deployed successfully.');
    }

    public function runtime(Request $request, Application $application): RedirectResponse
    {
        $this->authorize('update', $application);

        $validated = $request->validate([
            'operation' => ['required', 'string', 'max:64'],
            'document_root' => ['nullable', 'string', 'max:500'],
            'php_version' => ['nullable', 'string', 'max:32'],
            'node_version' => ['nullable', 'string', 'max:32'],
            'build_command' => ['nullable', 'string', 'max:500'],
            'vercel_project' => ['nullable', 'string', 'max:255'],
        ]);

        try {
            $message = $this->runtimeService->run(
                $application,
                $validated['operation'],
                $validated,
            );
        } catch (\Throwable $exception) {
            return back()->with('error', $exception->getMessage());
        }

        return back()->with('success', $message);
    }

    public function attachDatabase(Request $request, Application $application): RedirectResponse
    {
        $this->authorize('update', $application);

        $validated = $request->validate([
            'database_uuid' => ['required', 'exists:databases,uuid'],
        ]);

        $database = ManagedDatabase::query()->where('uuid', $validated['database_uuid'])->firstOrFail();
        $database->update(['application_id' => $application->id]);

        return back()->with('success', 'Database attached to application.');
    }

    public function detachDatabase(Application $application, ManagedDatabase $database): RedirectResponse
    {
        $this->authorize('update', $application);

        if ($database->application_id !== $application->id) {
            return back()->with('error', 'Database is not attached to this application.');
        }

        $database->update(['application_id' => null]);

        return back()->with('success', 'Database detached from application.');
    }

    public function attachDomain(Request $request, Application $application): RedirectResponse
    {
        $this->authorize('update', $application);

        $validated = $request->validate([
            'domain_uuid' => ['required', 'exists:domains,uuid'],
        ]);

        $domain = Domain::query()->where('uuid', $validated['domain_uuid'])->firstOrFail();
        $domain->update(['application_id' => $application->id]);

        return back()->with('success', 'Domain attached to application.');
    }

    public function detachDomain(Application $application, Domain $domain): RedirectResponse
    {
        $this->authorize('update', $application);

        if ($domain->application_id !== $application->id) {
            return back()->with('error', 'Domain is not attached to this application.');
        }

        $domain->update(['application_id' => null]);

        return back()->with('success', 'Domain detached from application.');
    }

    public function create(Request $request): Response
    {
        $this->authorize('create', Application::class);

        $projectUuid = $request->query('project');
        $project = $projectUuid
            ? Project::query()->where('uuid', $projectUuid)->first()
            : null;

        return Inertia::render('Applications/Create', [
            'selectedProject' => $project ? ProjectResource::make($project) : null,
            'projects' => ProjectResource::collection(Project::query()->orderBy('name')->get())->resolve(),
            'applicationTypes' => $this->provisionerRegistry->types(),
            'githubConnected' => ! empty(app(\App\Services\SettingService::class)->get('github_token')),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $this->authorize('create', Application::class);

        $validated = $request->validate([
            'project_uuid' => ['required', 'string', 'exists:projects,uuid'],
            'name' => ['required', 'string', 'max:255'],
            'type' => ['required', 'string', 'in:'.implode(',', array_column(ApplicationType::cases(), 'value'))],
            'root_path' => ['nullable', 'string', 'max:500'],
            'repository_url' => ['nullable', 'string', 'max:500'],
            'repository_branch' => ['nullable', 'string', 'max:100'],
            'deploy_path' => ['nullable', 'string', 'max:500'],
            'runtime' => ['nullable', 'string', 'max:50'],
            'build_command' => ['nullable', 'string', 'max:500'],
            'start_command' => ['nullable', 'string', 'max:500'],
            'linux_user' => ['nullable', 'string', 'max:32', 'regex:/^[a-z_][a-z0-9_-]{0,31}$/'],
            'domain' => ['nullable', 'string', 'max:255'],
            'document_root' => ['nullable', 'string', 'max:500'],
            'generate_ssl' => ['boolean'],
            'notes' => ['nullable', 'string'],
            'provision' => ['boolean'],
        ]);

        $projectId = Project::query()->where('uuid', $validated['project_uuid'])->value('id');
        $validated['project_id'] = $projectId;
        $provision = (bool) ($validated['provision'] ?? true);

        try {
            $application = app(CreateApplicationAction::class)->execute(
                \App\DTOs\ApplicationData::fromArray($validated),
                provisionInput: [
                    'domain' => $validated['domain'] ?? null,
                    'document_root' => $validated['document_root'] ?? null,
                    'generate_ssl' => $validated['generate_ssl'] ?? false,
                ],
                provision: $provision,
            );
        } catch (\Throwable $exception) {
            return back()->withInput()->with('error', $exception->getMessage());
        }

        return redirect()
            ->route('applications.show', $application)
            ->with('success', 'Application created successfully.');
    }
}
