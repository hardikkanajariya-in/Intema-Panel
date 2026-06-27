<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Services\DatabaseManagerService;
use App\Services\PostgresService;
use App\Services\SystemInfoService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class DatabaseController extends Controller
{
    public function __construct(
        private readonly DatabaseManagerService $databaseManagerService,
        private readonly PostgresService $postgresService,
    ) {}

    public function index(): Response
    {
        return Inertia::render('Databases/Index', [
            'databases' => $this->databaseManagerService->list()->values()->all(),
            'adminerUrl' => (string) config('panel.adminer.url'),
            'postgresqlStatus' => app(SystemInfoService::class)->postgresqlStatus(),
        ]);
    }

    public function backup(Client $client): RedirectResponse
    {
        $path = $this->databaseManagerService->backup($client);

        return back()->with('success', "Database backup created: {$path}");
    }

    public function resetPassword(Client $client): RedirectResponse
    {
        if (! $client->database_user) {
            return back()->with('error', 'Client has no database user.');
        }

        $password = $this->postgresService->resetPassword($client->database_user);
        $client->update(['database_password_encrypted' => $password]);

        return back()->with('success', 'Database password reset successfully.');
    }
}
