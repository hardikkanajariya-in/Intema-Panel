<?php

namespace App\Http\Controllers;

use App\Actions\CreateApplicationAction;
use App\Actions\CreateDomainAction;
use App\Actions\CreateManagedDatabaseAction;
use App\Actions\CreateSslCertificateAction;
use App\DTOs\ApplicationData;
use App\DTOs\DomainData;
use App\DTOs\ManagedDatabaseData;
use App\DTOs\SslCertificateData;
use App\Enums\ApplicationType;
use App\Models\Application;
use App\Models\Domain;
use App\Models\ManagedDatabase;
use App\Models\Project;
use App\Models\SslCertificate;
use App\Provision\ProvisionerRegistry;
use App\Support\ApplicationResource;
use App\Support\DomainResource;
use App\Support\ProjectResource;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ResourceWizardController extends Controller
{
    public function __construct(
        private readonly ProvisionerRegistry $provisionerRegistry,
        private readonly CreateApplicationAction $createApplicationAction,
        private readonly CreateManagedDatabaseAction $createManagedDatabaseAction,
        private readonly CreateDomainAction $createDomainAction,
        private readonly CreateSslCertificateAction $createSslCertificateAction,
        private readonly \App\Services\SettingService $settingService,
    ) {}

    public function create(Request $request): Response
    {
        $step = (int) $request->query('step', 1);
        $projectUuid = $request->query('project');
        $resourceType = $request->query('type');

        $project = $projectUuid
            ? Project::query()->where('uuid', $projectUuid)->first()
            : null;

        return Inertia::render('Resources/Wizard', [
            'step' => $step,
            'selectedProject' => $project ? ProjectResource::make($project) : null,
            'resourceType' => $resourceType,
            'projects' => ProjectResource::collection(Project::query()->orderBy('name')->get())->resolve(),
            'applicationTypes' => $this->provisionerRegistry->types(),
            'applications' => ApplicationResource::collection(
                Application::query()->orderBy('name')->get(),
            )->resolve(),
            'domains' => DomainResource::collection(
                Domain::query()->orderBy('hostname')->get(),
            )->resolve(),
            'githubConnected' => ! empty($this->settingService->get('github_token')),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'resource_type' => ['required', 'in:application,database,domain,ssl'],
            'project_uuid' => ['nullable', 'string', 'exists:projects,uuid'],
            'provision' => ['boolean'],
        ]);

        $projectId = isset($validated['project_uuid'])
            ? Project::query()->where('uuid', $validated['project_uuid'])->value('id')
            : null;

        $resourceType = (string) $validated['resource_type'];
        $provision = (bool) ($validated['provision'] ?? true);

        return match ($resourceType) {
            'application' => $this->storeApplication($request, $projectId, $provision),
            'database' => $this->storeDatabase($request, $projectId, $provision),
            'domain' => $this->storeDomain($request, $projectId),
            'ssl' => $this->storeSsl($request, $projectId, $provision),
            default => back()->with('error', 'Invalid resource type.'),
        };
    }

    private function storeApplication(Request $request, ?int $projectId, bool $provision): RedirectResponse
    {
        $this->authorize('create', Application::class);

        $validated = $request->validate([
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
        ]);

        $validated['project_id'] = $projectId;

        try {
            $application = $this->createApplicationAction->execute(
                ApplicationData::fromArray($validated),
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

    private function storeDatabase(Request $request, ?int $projectId, bool $provision): RedirectResponse
    {
        $this->authorize('create', ManagedDatabase::class);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'application_id' => ['nullable', 'exists:applications,uuid'],
            'database_name' => ['nullable', 'string', 'max:63', 'regex:/^[a-z][a-z0-9_]*$/'],
            'database_user' => ['nullable', 'string', 'max:63', 'regex:/^[a-z][a-z0-9_]*$/'],
            'notes' => ['nullable', 'string'],
        ]);

        $validated['project_id'] = $projectId;
        $validated['application_id'] = $this->resolveApplicationId($validated['application_id'] ?? null);

        try {
            $database = $this->createManagedDatabaseAction->execute(
                ManagedDatabaseData::fromArray($validated),
                provision: $provision,
            );
        } catch (\Throwable $exception) {
            return back()->withInput()->with('error', $exception->getMessage());
        }

        return redirect()
            ->route('databases.show', $database)
            ->with('success', 'Database created successfully.');
    }

    private function storeDomain(Request $request, ?int $projectId): RedirectResponse
    {
        $this->authorize('create', Domain::class);

        $validated = $request->validate([
            'hostname' => ['required', 'string', 'max:255', 'regex:/^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/i'],
            'application_id' => ['nullable', 'exists:applications,uuid'],
            'document_root' => ['nullable', 'string', 'max:500'],
            'provision_nginx' => ['boolean'],
            'notes' => ['nullable', 'string'],
        ]);

        $validated['project_id'] = $projectId;
        $validated['application_id'] = $this->resolveApplicationId($validated['application_id'] ?? null);

        $domain = $this->createDomainAction->execute(
            DomainData::fromArray($validated),
            provisionNginx: (bool) ($validated['provision_nginx'] ?? false),
        );

        return redirect()
            ->route('domains.show', $domain)
            ->with('success', 'Domain created successfully.');
    }

    private function storeSsl(Request $request, ?int $projectId, bool $provision): RedirectResponse
    {
        $this->authorize('create', SslCertificate::class);

        $validated = $request->validate([
            'domain_name' => ['required', 'string', 'max:255'],
            'domain_id' => ['nullable', 'exists:domains,uuid'],
            'auto_renew' => ['boolean'],
            'notes' => ['nullable', 'string'],
        ]);

        $validated['project_id'] = $projectId;

        if (! empty($validated['domain_id'])) {
            $validated['domain_id'] = Domain::query()
                ->where('uuid', $validated['domain_id'])
                ->value('id');
        }

        try {
            $certificate = $this->createSslCertificateAction->execute(
                SslCertificateData::fromArray($validated),
                provision: $provision,
            );
        } catch (\Throwable $exception) {
            return back()->withInput()->with('error', $exception->getMessage());
        }

        return redirect()
            ->route('ssl-certificates.show', $certificate)
            ->with('success', 'SSL certificate created successfully.');
    }

    private function resolveApplicationId(mixed $uuid): ?int
    {
        if (empty($uuid)) {
            return null;
        }

        return Application::query()->where('uuid', $uuid)->value('id');
    }
}
