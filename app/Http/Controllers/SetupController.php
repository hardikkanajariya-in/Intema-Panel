<?php

namespace App\Http\Controllers;

use App\Actions\CompleteSetupAction;
use App\Http\Requests\CompleteSetupRequest;
use App\Services\SetupService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class SetupController extends Controller
{
    public function __construct(
        private readonly SetupService $setupService,
        private readonly CompleteSetupAction $completeSetupAction,
    ) {}

    public function index(): Response|RedirectResponse
    {
        if ($this->setupService->isComplete()) {
            return redirect()->route('login');
        }

        return Inertia::render('Setup/Index', [
            'defaults' => [
                'panel_name' => config('panel.name'),
                'company_name' => config('panel.company'),
                'website' => config('panel.website'),
                'github_url' => config('panel.github'),
                'support_email' => config('panel.support_email'),
                'timezone' => config('panel.timezone'),
            ],
            'timezones' => timezone_identifiers_list(),
        ]);
    }

    public function store(CompleteSetupRequest $request): RedirectResponse
    {
        $this->completeSetupAction->execute($request->validated());

        return redirect()
            ->route('login')
            ->with('success', 'Setup complete. Sign in with your administrator account.');
    }
}
