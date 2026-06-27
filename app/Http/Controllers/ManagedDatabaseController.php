<?php

namespace App\Http\Controllers;

use App\Models\ManagedDatabase;
use App\Services\DatabaseManagerService;
use App\Services\PostgresService;
use App\Support\ManagedDatabaseResource;
use Illuminate\Http\RedirectResponse;
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
                'data' => ManagedDatabaseResource::collection($databases->items()),
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

    public function backup(ManagedDatabase $database): RedirectResponse
    {
        $this->authorize('view', $database);

        $this->databaseManagerService->backup($database);

        return back()->with('success', 'Database backup completed.');
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

        app(\App\Services\ActivityLogService::class)->log(
            action: 'database.deleted',
            description: "Database \"{$database->name}\" was deleted.",
            subject: $database,
        );

        return redirect()
            ->route('databases.index')
            ->with('success', 'Database deleted successfully.');
    }
}
