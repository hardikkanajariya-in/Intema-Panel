<?php

namespace App\Http\Controllers;

use App\Models\Application;
use App\Models\DatabaseBackup;
use App\Models\ManagedDatabase;
use App\Models\Project;
use App\Services\ActivityLogService;
use App\Services\DatabaseManagerService;
use App\Services\PostgresService;
use App\Support\ApplicationResource;
use App\Support\ManagedDatabaseResource;
use App\Support\ProjectResource;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ManagedDatabaseController extends Controller
{
    public function __construct(
        private readonly DatabaseManagerService $databaseManagerService,
        private readonly PostgresService $postgresService,
    ) {}

    public function index(): Response
    {
        $this->authorize('viewAny', ManagedDatabase::class);

        $databases = ManagedDatabase::query()
            ->with(['project', 'application'])
            ->latest()
            ->paginate(15);

        return Inertia::render('Databases/Index', [
            'databases' => [
                'data' => ManagedDatabaseResource::collection($databases->items())->resolve(),
                'links' => $databases->linkCollection()->toArray(),
                'meta' => [
                    'current_page' => $databases->currentPage(),
                    'last_page' => $databases->lastPage(),
                    'per_page' => $databases->perPage(),
                    'total' => $databases->total(),
                ],
            ],
        ]);
    }

    public function show(ManagedDatabase $database): Response
    {
        $this->authorize('view', $database);

        $database->load(['project', 'application']);

        return Inertia::render('Databases/Show', [
            'database' => ManagedDatabaseResource::make($database),
        ]);
    }

    public function backup(ManagedDatabase $database)
    {
        $this->authorize('view', $database);

        $backup = $this->databaseManagerService->backup($database);
        $absolutePath = storage_path('app/' . $backup->path);

        return response()->download($absolutePath, $backup->filename);
    }

    public function downloadBackup(ManagedDatabase $database, DatabaseBackup $backup)
    {
        $this->authorize('view', $database);

        if ($backup->managed_database_id !== $database->id) {
            abort(403);
        }

        $absolutePath = storage_path('app/' . $backup->path);

        if (! is_file($absolutePath)) {
            abort(404, 'Backup file not found on disk.');
        }

        return response()->download($absolutePath, $backup->filename);
    }

    public function showRestore(ManagedDatabase $database): Response
    {
        $this->authorize('update', $database);

        $database->load(['project', 'application']);

        $backups = $database->backups()
            ->latest()
            ->get()
            ->map(fn (DatabaseBackup $backup): array => [
                'uuid' => $backup->uuid,
                'filename' => $backup->filename,
                'size' => $backup->size,
                'created_at' => $backup->created_at?->toIso8601String(),
            ]);

        return Inertia::render('Databases/Restore', [
            'database' => ManagedDatabaseResource::make($database),
            'backups' => $backups,
        ]);
    }

    public function restore(ManagedDatabase $database, Request $request): RedirectResponse
    {
        $this->authorize('update', $database);

        $request->validate([
            'backup_file' => 'required|file',
        ]);

        $file = $request->file('backup_file');
        
        $tempPath = $file->storeAs('temp_restores', $file->getClientOriginalName());
        $absolutePath = storage_path('app/' . $tempPath);

        try {
            $this->databaseManagerService->restore($database, $absolutePath);
            @unlink($absolutePath);
            return back()->with('success', 'Database restored successfully.');
        } catch (\Throwable $e) {
            @unlink($absolutePath);
            return back()->with('error', 'Restoration failed: ' . $e->getMessage());
        }
    }

    public function restoreFromLog(ManagedDatabase $database, DatabaseBackup $backup): RedirectResponse
    {
        $this->authorize('update', $database);

        if ($backup->managed_database_id !== $database->id) {
            abort(403);
        }

        $absolutePath = storage_path('app/' . $backup->path);

        if (! is_file($absolutePath)) {
            return back()->with('error', 'Backup file not found on disk.');
        }

        try {
            $this->databaseManagerService->restore($database, $absolutePath);
            return back()->with('success', 'Database restored from backup successfully.');
        } catch (\Throwable $e) {
            return back()->with('error', 'Restoration failed: ' . $e->getMessage());
        }
    }

    public function resetPassword(ManagedDatabase $database): RedirectResponse
    {
        $this->authorize('update', $database);

        $password = $this->postgresService->resetPassword($database->database_user);
        $database->update(['database_password_encrypted' => $password]);

        return back()->with('success', 'Database password reset successfully.');
    }

    public function destroy(ManagedDatabase $database): RedirectResponse
    {
        $this->authorize('delete', $database);

        $this->postgresService->deprovision($database->database_name, $database->database_user);
        $database->delete();

        app(ActivityLogService::class)->log(
            action: 'database.deleted',
            description: "Database \"{$database->name}\" was deleted.",
            subject: $database,
        );

        return redirect()
            ->route('databases.index')
            ->with('success', 'Database deleted successfully.');
    }

    public function create(Request $request): Response
    {
        $this->authorize('create', ManagedDatabase::class);

        $projectUuid = $request->query('project');
        $project = $projectUuid
            ? Project::query()->where('uuid', $projectUuid)->first()
            : null;

        $applicationUuid = $request->query('application');
        $application = $applicationUuid
            ? Application::query()->where('uuid', $applicationUuid)->first()
            : null;

        return Inertia::render('Databases/Create', [
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
        $this->authorize('create', ManagedDatabase::class);

        $validated = $request->validate([
            'project_uuid' => ['required', 'string', 'exists:projects,uuid'],
            'name' => ['required', 'string', 'max:255'],
            'application_id' => ['nullable', 'exists:applications,uuid'],
            'database_name' => ['nullable', 'string', 'max:63', 'regex:/^[a-z][a-z0-9_]*$/'],
            'database_user' => ['nullable', 'string', 'max:63', 'regex:/^[a-z][a-z0-9_]*$/'],
            'notes' => ['nullable', 'string'],
            'provision' => ['boolean'],
        ]);

        $projectId = Project::query()->where('uuid', $validated['project_uuid'])->value('id');
        $validated['project_id'] = $projectId;

        // Resolve application ID
        $applicationId = null;
        if (! empty($validated['application_id'])) {
            $applicationId = Application::query()->where('uuid', $validated['application_id'])->value('id');
        }
        $validated['application_id'] = $applicationId;
        $provision = (bool) ($validated['provision'] ?? true);

        try {
            $database = app(\App\Actions\CreateManagedDatabaseAction::class)->execute(
                \App\DTOs\ManagedDatabaseData::fromArray($validated),
                provision: $provision,
            );
        } catch (\Throwable $exception) {
            return back()->withInput()->with('error', $exception->getMessage());
        }

        return redirect()
            ->route('databases.show', $database)
            ->with('success', 'Database created successfully.');
    }
}
