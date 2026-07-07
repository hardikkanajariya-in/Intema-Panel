<?php

namespace App\Http\Controllers;

use App\Models\Application;
use App\Models\Domain;
use App\Models\Project;
use App\Services\NginxService;
use App\Services\SslService;
use App\Support\ApplicationResource;
use App\Support\DomainResource;
use App\Support\ProjectResource;
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

        // Sync domains from Cloudflare
        try {
            $cloudflareService = app(\App\Services\CloudflareService::class);
            $zones = $cloudflareService->getZones();
            foreach ($zones as $zone) {
                $hostname = $zone['name'];
                $exists = Domain::query()->where('hostname', $hostname)->exists();
                if (! $exists) {
                    Domain::query()->create([
                        'hostname' => $hostname,
                        'status' => \App\Enums\ResourceStatus::Active,
                        'source' => Domain::SOURCE_CLOUDFLARE,
                    ]);
                }
            }
        } catch (\Throwable $e) {
            // Ignore fetch/sync errors to keep page functional if API fails
        }

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

        $domain->load(['project', 'application']);

        $cloudflareConfigured = ! empty(app(\App\Services\SettingService::class)->get('cloudflare_token'));

        $nginxConfig = '';
        if ($domain->nginx_site) {
            $nginxConfig = $this->nginxService->getSiteConfig($domain->nginx_site);
        }

        return Inertia::render('Domains/Show', [
            'domain' => DomainResource::make($domain)->resolve(),
            'cloudflareConfigured' => $cloudflareConfigured,
            'nginxConfig' => $nginxConfig,
        ]);
    }

    public function configureSsl(Domain $domain, SslService $sslService): RedirectResponse
    {
        $this->authorize('update', $domain);

        try {
            $email = (string) (config('panel.ssl.email') ?: setting('support_email', config('panel.support_email')));
            $result = $sslService->obtain($domain->hostname, $email);

            if ($result->successful()) {
                $domain->update(['ssl_active' => true]);
                return back()->with('success', 'SSL Certificate successfully configured for ' . $domain->hostname);
            }

            return back()->with('error', 'Certbot failed: ' . ($result->errorOutput ?: $result->output));
        } catch (\Throwable $e) {
            return back()->with('error', 'Failed to configure SSL: ' . $e->getMessage());
        }
    }

    public function destroy(Domain $domain): RedirectResponse
    {
        $this->authorize('delete', $domain);

        if ($domain->source === Domain::SOURCE_CLOUDFLARE) {
            abort(403, 'Cloudflare-created domains cannot be deleted.');
        }

        if ($domain->nginx_site) {
            $this->nginxService->deleteSite($domain->nginx_site);
        }

        $domain->delete();

        return redirect()
            ->route('domains.index')
            ->with('success', 'Domain deleted successfully.');
    }

    public function create(Request $request): Response
    {
        $this->authorize('create', Domain::class);

        $projectUuid = $request->query('project');
        $project = $projectUuid
            ? Project::query()->where('uuid', $projectUuid)->first()
            : null;

        $applicationUuid = $request->query('application');
        $application = $applicationUuid
            ? Application::query()->where('uuid', $applicationUuid)->first()
            : null;

        return Inertia::render('Domains/Create', [
            'selectedProject' => $project ? ProjectResource::make($project) : null,
            'selectedApplication' => $application ? ApplicationResource::make($application) : null,
            'projects' => ProjectResource::collection(Project::query()->orderBy('name')->get())->resolve(),
            'applications' => ApplicationResource::collection(
                Application::query()->orderBy('name')->get(),
            )->resolve(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $this->authorize('create', Domain::class);

        $validated = $request->validate([
            'project_uuid' => ['required', 'string', 'exists:projects,uuid'],
            'hostname' => ['required', 'string', 'max:255', 'regex:/^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/i'],
            'application_id' => ['nullable', 'exists:applications,uuid'],
            'document_root' => [
                'nullable',
                'string',
                'max:500',
                'starts_with:/var/www/',
                function ($attribute, $value, $fail) {
                    if (str_contains($value, '..')) {
                        $fail('The document root cannot contain directory traversal.');
                    }
                }
            ],
            'notes' => ['nullable', 'string'],
        ]);

        $projectId = Project::query()->where('uuid', $validated['project_uuid'])->value('id');
        $validated['project_id'] = $projectId;

        // Resolve application ID
        $applicationId = null;
        if (! empty($validated['application_id'])) {
            $applicationId = Application::query()->where('uuid', $validated['application_id'])->value('id');
        }
        $validated['application_id'] = $applicationId;

        // Default document root and always provision Nginx
        if (empty($validated['document_root'])) {
            $validated['document_root'] = '/var/www/' . $validated['hostname'];
        }

        $domain = app(\App\Actions\CreateDomainAction::class)->execute(
            \App\DTOs\DomainData::fromArray($validated),
            provisionNginx: true,
        );

        return redirect()
            ->route('domains.show', $domain)
            ->with('success', 'Domain created successfully.');
    }

    public function update(Request $request, Domain $domain): RedirectResponse
    {
        $this->authorize('update', $domain);

        $validated = $request->validate([
            'document_root' => [
                'nullable',
                'string',
                'max:500',
                'starts_with:/var/www/',
                function ($attribute, $value, $fail) {
                    if (str_contains($value, '..')) {
                        $fail('The document root cannot contain directory traversal.');
                    }
                }
            ],
            'nginx_config' => ['nullable', 'string'],
        ]);

        try {
            // Update document root
            if (array_key_exists('document_root', $validated)) {
                $domain->document_root = $validated['document_root'];
            }

            // Ensure site name exists if it is empty/null (e.g. Cloudflare domains)
            if (empty($domain->nginx_site)) {
                $domain->nginx_site = \Illuminate\Support\Str::slug($domain->hostname, '_');
            }

            // If Nginx config is updated
            if (array_key_exists('nginx_config', $validated)) {
                $nginxConfig = $validated['nginx_config'];

                if (! empty($nginxConfig)) {
                    // Update site config safely
                    $result = $this->nginxService->updateSiteConfig($domain->nginx_site, $nginxConfig);
                    if (! $result->successful()) {
                        return back()->withInput()->with('error', 'Nginx config test failed: ' . $result->message());
                    }
                    // Mark status as active
                    $domain->status = \App\Enums\ResourceStatus::Active;
                }
            } else {
                // If they changed document root but did not specify nginx_config,
                // and the site config doesn't exist yet, we can provision it
                $currentConfig = $this->nginxService->getSiteConfig($domain->nginx_site);
                if (empty($currentConfig) && ! empty($domain->document_root)) {
                    $this->nginxService->createVirtualHost($domain->hostname, $domain->document_root);
                    $this->nginxService->enableSite($domain->nginx_site);
                    $this->nginxService->reload();
                    $domain->status = \App\Enums\ResourceStatus::Active;
                }
            }

            $domain->save();

            return back()->with('success', 'Domain updated successfully.');
        } catch (\Throwable $e) {
            return back()->withInput()->with('error', 'Failed to update domain: ' . $e->getMessage());
        }
    }
}
